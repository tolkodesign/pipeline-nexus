import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  X, Clock, CheckCircle2, Layers, Building2, 
  Flame, Loader2
} from 'lucide-react';
import EditRequestModal from '../modals/EditRequestModal';

export default function CalendarPage() {
  const { user, profile } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros rápidos
  const [filter, setFilter] = useState<'todos' | 'urgentes' | 'pendientes' | 'en_proceso' | 'completados' | 'atrasadas'>('todos');
  const [filterClient, setFilterClient] = useState('todos');

  // Panel lateral
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  // Modal Maestro
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [staffCatalog, setStaffCatalog] = useState<any[]>([]);
  const [prioritiesCatalog, setPrioritiesCatalog] = useState<any[]>([]);

  // 🔥 DATOS DE ESPECIALIDAD / ÁREA DEL LÍDER O COORDINADOR
  const leaderSpecialty = profile?.specialties?.name || profile?.specialty || '';
  const leaderSpecialtyId = profile?.specialty_id;

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const roleName = (profile?.internal_roles?.name || profile?.internal_role || '').toLowerCase();
      const isAdmin = profile?.is_admin || profile?.role_id === 1 || roleName === 'admin';

      let requestQuery = supabase
        .from('requests')
        .select(`
          *,
          organizations ( name, logo_url ),
          priorities ( level, color_code ),
          request_categories ( name ),
          request_tasks ( id, status, discipline, specialty_id ),
          requester:profiles!requests_requester_id_fkey(full_name)
        `)
        .eq('is_active', true);

      if (!isAdmin && user?.id) {
        const { data: distList } = await supabase
          .from('organization_distribution_lists')
          .select('organization_id')
          .eq('profile_id', user.id);

        const assignedOrgIds = distList?.map(item => item.organization_id) || [];

        if (assignedOrgIds.length === 0) {
          setRequests([]);
          setLoading(false);
          return;
        }

        requestQuery = requestQuery.in('organization_id', assignedOrgIds);
      }

      const [reqsRes, staffRes, prioRes] = await Promise.all([
        requestQuery,
        supabase.from('profiles').select('*').eq('is_active', true),
        supabase.from('priorities').select('*').order('weight', { ascending: true })
      ]);

      if (reqsRes.data) setRequests(reqsRes.data);
      if (staffRes.data) setStaffCatalog(staffRes.data);
      if (prioRes.data) setPrioritiesCatalog(prioRes.data);

    } catch (error) {
      console.error("Error cargando calendario:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

  const clientOptions = Array.from(new Set(requests.map(r => r.organizations?.name).filter(Boolean))).sort();

  // 🔥 EVALUADOR INTELIGENTE: ¿ESTA SOLICITUD REQUIERE EL ÁREA DEL LÍDER/COORDINADOR?
  const norm = (s: string) => (s || '').toLowerCase().trim();

  const isMyAreaRequired = (r: any) => {
    if (!leaderSpecialty && !leaderSpecialtyId) return true; // Si no tiene área definida, pasa por defecto

    // 1. Verificación por arreglo relacional specialty_ids
    if (r.specialty_ids && Array.isArray(r.specialty_ids) && r.specialty_ids.length > 0) {
      if (leaderSpecialtyId && r.specialty_ids.includes(leaderSpecialtyId)) return true;
    } else {
      // 2. Verificación legacy por tareas activas
      const isLegacyMatch = r.request_tasks?.some((t: any) => norm(t.discipline) === norm(leaderSpecialty));
      if (isLegacyMatch) return true;

      // 3. Fallback directo a columnas booleanas
      const legacyMap: Record<string, string> = {
        'diseño': 'needs_design', 'diseno': 'needs_design',
        'programación': 'needs_dev', 'programacion': 'needs_dev',
        'audiovisual': 'needs_av',
        'contenido': 'needs_copy', 'copy': 'needs_copy',
        'producción': 'needs_prod', 'produccion': 'needs_prod',
        'staff': 'needs_staff',
        'rp': 'needs_rp', 'relaciones públicas': 'needs_rp', 'relaciones publicas': 'needs_rp'
      };
      const col = legacyMap[norm(leaderSpecialty)];
      if (col && Boolean(r[col]) === true) return true;
    }

    // 4. Verificación por ID en tareas
    if (leaderSpecialtyId && r.request_tasks?.some((t: any) => t.specialty_id === leaderSpecialtyId)) {
      return true;
    }

    return false;
  };

  // 🔥 LÓGICA DE FILTRADO MASTER CON DISCRIMINACIÓN POR ÁREA 🔥
  const filteredRequests = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const roleName = (profile?.internal_roles?.name || profile?.internal_role || '').toLowerCase();
    const isAdmin = profile?.is_admin || profile?.role_id === 1 || roleName === 'admin';

    return requests.filter(req => {
      if (!req.due_date) return false;
      
      // 🛡️ CADENERO DE ÁREA: Si no es Admin, SOLO le salen las de su área
      if (!isAdmin && !isMyAreaRequired(req)) {
        return false;
      }

      const isCompletado = ['completado', 'aprobado'].includes(req.status);
      const isUrgente = req.priorities?.level?.toLowerCase().includes('alta');
      const reqDateStr = String(req.due_date).split('T')[0];
      const isAtrasada = !isCompletado && reqDateStr < todayStr;

      let passQuickFilter = true;
      switch (filter) {
        case 'urgentes': passQuickFilter = isUrgente && !isCompletado; break;
        case 'pendientes': passQuickFilter = req.status === 'pendiente'; break;
        case 'en_proceso': passQuickFilter = req.status === 'en_proceso'; break;
        case 'completados': passQuickFilter = isCompletado; break;
        case 'atrasadas': passQuickFilter = isAtrasada; break;
        default: passQuickFilter = true; break;
      }

      const passClient = filterClient === 'todos' || req.organizations?.name === filterClient;

      return passQuickFilter && passClient;
    });
  }, [requests, filter, filterClient, profile, leaderSpecialtyId, leaderSpecialty]);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevMonth = month === 0 ? 12 : month;
      const prevYear = month === 0 ? year - 1 : year;
      const dateStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ day: d, isCurrentMonth: false, dateStr });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ day: i, isCurrentMonth: true, dateStr });
    }

    const remainingCells = (Math.ceil(days.length / 7) * 7) - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonth = month === 11 ? 1 : month + 2;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ day: i, isCurrentMonth: false, dateStr });
    }

    return days;
  }, [currentDate]);

  const requestsByDate = useMemo(() => {
    const map: Record<string, any[]> = {};
    filteredRequests.forEach(req => {
      if (!req.due_date) return;
      const dateStr = String(req.due_date).split('T')[0];
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(req);
    });
    return map;
  }, [filteredRequests]);

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const todayStr = new Date().toISOString().split('T')[0];

  const selectedDateRequests = selectedDateStr ? (requestsByDate[selectedDateStr] || []) : [];
  
  const drawerActiveReqs = selectedDateRequests.filter(r => !['completado', 'aprobado'].includes(r.status));
  const drawerCompletedReqs = selectedDateRequests.filter(r => ['completado', 'aprobado'].includes(r.status));

  return (
    <div className="relative w-full min-h-screen flex flex-col animate-in fade-in duration-300 transition-colors bg-gray-50 dark:bg-luxury-dark font-sans overflow-hidden">
      
      {/* HEADER Y FILTROS */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-luxury-border bg-white dark:bg-[#0a0a0c] flex flex-col gap-4 shrink-0 z-10 shadow-sm md:pr-20">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-luxury-red/10 flex items-center justify-center text-luxury-red">
              <CalendarIcon size={24} strokeWidth={2.5}/>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-gray-900 dark:text-white uppercase transition-colors">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                Calendario Operativo {leaderSpecialty && `• ÁREA ${leaderSpecialty.toUpperCase()}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-1 overflow-x-auto">
              <button onClick={() => setFilter('todos')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${filter === 'todos' ? 'bg-white dark:bg-luxury-card text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>Todos</button>
              <button onClick={() => setFilter('urgentes')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${filter === 'urgentes' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-500 hover:text-red-500'}`}><Flame size={12} className="inline mr-1"/>Urgentes</button>
              <button onClick={() => setFilter('pendientes')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${filter === 'pendientes' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-500 hover:text-amber-500'}`}>Pendientes</button>
              <button onClick={() => setFilter('en_proceso')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${filter === 'en_proceso' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-500 hover:text-blue-500'}`}>En Proceso</button>
              <button onClick={() => setFilter('atrasadas')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${filter === 'atrasadas' ? 'bg-purple-500 text-white shadow-sm' : 'text-gray-500 hover:text-purple-500'}`}>Atrasadas</button>
            </div>

            <div className="flex items-center gap-2 border-l border-gray-200 dark:border-luxury-border pl-3">
              <button onClick={handlePrevMonth} className="p-2.5 rounded-xl bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border hover:border-luxury-red dark:hover:border-luxury-red text-gray-600 dark:text-gray-300 transition-colors shadow-sm"><ChevronLeft size={16}/></button>
              <button onClick={handleToday} className="px-4 py-2.5 rounded-xl bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border hover:border-luxury-red dark:hover:border-luxury-red text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 transition-colors shadow-sm">Hoy</button>
              <button onClick={handleNextMonth} className="p-2.5 rounded-xl bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border hover:border-luxury-red dark:hover:border-luxury-red text-gray-600 dark:text-gray-300 transition-colors shadow-sm"><ChevronRight size={16}/></button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-1/2 md:w-1/3">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={14} />
            <select 
              value={filterClient} 
              onChange={e => setFilterClient(e.target.value)} 
              className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl py-2.5 pl-9 pr-4 text-xs font-bold text-gray-700 dark:text-white outline-none cursor-pointer shadow-sm transition-colors duration-300 truncate"
            >
              <option value="todos">Mis Cuentas Asignadas</option>
              {clientOptions.map(c => <option key={String(c)} value={String(c)}>{String(c)}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* CUERPO DEL CALENDARIO */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col relative z-0">
        {loading ? (
          <div className="flex-1 min-h-[400px] flex items-center justify-center">
            <Loader2 className="animate-spin text-luxury-red" size={40} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col bg-white dark:bg-black/20 border border-gray-200 dark:border-luxury-border rounded-3xl overflow-hidden shadow-sm min-h-[500px]">
            <div className="grid grid-cols-7 bg-gray-50 dark:bg-[#0a0a0c] border-b border-gray-200 dark:border-luxury-border shrink-0">
              {weekDays.map(day => (
                <div key={day} className="py-3 text-center text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  {day}
                </div>
              ))}
            </div>

            <div className="flex-1 grid grid-cols-7 grid-rows-5 md:grid-rows-auto bg-gray-200 dark:bg-luxury-border/50 gap-px">
              {calendarDays.map((cell, idx) => {
                const dayReqs = requestsByDate[cell.dateStr] || [];
                
                const activeReqsInCell = dayReqs.filter(r => !['completado', 'aprobado'].includes(r.status));
                const completedCount = dayReqs.length - activeReqsInCell.length;

                const isToday = cell.dateStr === todayStr;
                const isSelected = cell.dateStr === selectedDateStr;

                return (
                  <div 
                    key={idx} 
                    onClick={() => {
                      if (dayReqs.length > 0) setSelectedDateStr(cell.dateStr);
                    }}
                    className={`bg-white dark:bg-luxury-card relative p-2 transition-all flex flex-col min-h-[90px] ${!cell.isCurrentMonth ? 'opacity-40 bg-gray-50 dark:bg-[#070709]' : ''} ${dayReqs.length > 0 ? 'cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/10' : ''} ${isSelected ? 'ring-inset ring-2 ring-luxury-red z-10' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1 shrink-0">
                      <span className={`text-xs font-black w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-luxury-red text-white shadow-md' : 'text-gray-500 dark:text-gray-400'}`}>
                        {cell.day}
                      </span>
                      {activeReqsInCell.length > 0 && (
                        <span className="text-[9px] font-bold text-gray-400 bg-gray-100 dark:bg-white/5 px-1.5 rounded" title="Entregas pendientes de tu área">
                          {activeReqsInCell.length}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 overflow-hidden flex flex-col gap-1">
                      {activeReqsInCell.slice(0, 3).map((req, rIdx) => {
                        const reqDueDateStr = req.due_date ? String(req.due_date).split('T')[0] : '';
                        const isLate = reqDueDateStr ? reqDueDateStr < todayStr : false;
                        
                        let colorClass = 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300 border-gray-200 dark:border-white/10';
                        if (req.status === 'en_proceso') colorClass = 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-900/30';
                        else if (isLate) colorClass = 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-900/30';
                        else if (req.priorities?.level?.toLowerCase().includes('alta')) colorClass = 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-orange-200 dark:border-orange-900/30';

                        return (
                          <div key={rIdx} className={`px-1.5 py-1 text-[9px] font-bold rounded truncate border ${colorClass} transition-colors`} title={req.title}>
                            {req.organizations?.name?.slice(0,3)}: {req.title}
                          </div>
                        );
                      })}
                      {activeReqsInCell.length > 3 && (
                        <div className="text-[9px] font-black text-luxury-red mt-auto text-center bg-red-50 dark:bg-red-900/20 rounded py-0.5">
                          + {activeReqsInCell.length - 3} pendientes
                        </div>
                      )}
                      
                      {completedCount > 0 && activeReqsInCell.length === 0 && (
                        <div className="text-[9px] font-bold text-green-500 mt-auto text-center">
                          {completedCount} entregadas ✓
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selectedDateStr && (
        <div 
          className="fixed inset-0 z-[50]"
          onClick={() => setSelectedDateStr(null)}
        />
      )}

      {/* PANEL LATERAL DERECHO */}
      <div 
        className={`fixed top-0 right-0 h-screen w-full sm:w-[400px] bg-white dark:bg-[#141419] border-l border-gray-200 dark:border-luxury-border shadow-[-10px_0_30px_rgba(0,0,0,0.1)] dark:shadow-[-10px_0_30px_rgba(0,0,0,0.5)] transform transition-transform duration-300 ease-in-out z-[60] flex flex-col ${selectedDateStr ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="sticky top-0 z-20 p-6 border-b border-gray-200 dark:border-luxury-border bg-gray-50/95 dark:bg-[#0a0a0c]/95 backdrop-blur-md flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
              <Clock size={16} className="text-luxury-red"/> Entregas del Día
            </h3>
            <p className="text-xs font-bold text-gray-500 mt-1">
              {selectedDateStr && new Date(selectedDateStr + 'T12:00:00Z').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <button onClick={() => setSelectedDateStr(null)} className="p-2 rounded-xl bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border text-gray-500 hover:text-luxury-red transition-colors cursor-pointer shadow-sm">
            <X size={16}/>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {drawerActiveReqs.length > 0 ? (
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-200 dark:border-zinc-800 pb-2">
                En Progreso / Pendientes ({drawerActiveReqs.length})
              </h4>
              {drawerActiveReqs.map(req => {
                const reqDueDateStr = req.due_date ? String(req.due_date).split('T')[0] : '';
                const isLate = reqDueDateStr ? reqDueDateStr < todayStr : false;
                
                let statusColor = 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300 border border-gray-200 dark:border-zinc-700';
                if (req.status === 'en_proceso') {
                  statusColor = 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20';
                }

                return (
                  <div 
                    key={req.id} 
                    onClick={() => {
                      setSelectedRequest(req);
                      setIsModalOpen(true);
                    }}
                    className={`bg-white dark:bg-luxury-card border rounded-2xl p-4 shadow-sm hover:shadow-md cursor-pointer transition-all hover:scale-[1.02] group ${isLate ? 'border-red-300 dark:border-red-900/50' : 'border-gray-200 dark:border-luxury-border'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {req.organizations?.logo_url ? (
                          <img src={req.organizations.logo_url} className="w-4 h-4 rounded-full object-cover shrink-0 bg-white border border-gray-200" alt="logo" crossOrigin="anonymous"/>
                        ) : (
                          <Building2 size={12} className="text-gray-400 shrink-0"/>
                        )}
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 truncate">{req.organizations?.name || 'Cliente'}</span>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${statusColor}`}>
                        {req.status?.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-3 group-hover:text-luxury-red transition-colors line-clamp-2">
                      {req.title}
                    </h4>

                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-3 mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-luxury-red/10 flex items-center justify-center text-[9px] font-bold text-luxury-red uppercase">
                          {req.requester?.full_name?.slice(0,2) || 'TK'}
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 truncate max-w-[100px]">{req.requester?.full_name?.split(' ')[0] || 'Tolko'}</span>
                      </div>

                      <span className="text-[10px] font-black uppercase bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5 px-2 py-1 rounded text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Layers size={10}/> Qty: {req.quantity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            drawerCompletedReqs.length === 0 && (
              <p className="text-xs text-center text-gray-400 italic pt-10">No hay entregas asignadas a tu área en este día.</p>
            )
          )}

          {drawerCompletedReqs.length > 0 && (
            <div className="space-y-4 pt-4 border-t-2 border-dashed border-gray-200 dark:border-zinc-800">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-green-500 flex items-center gap-1.5">
                <CheckCircle2 size={14}/> Completadas / Entregadas ({drawerCompletedReqs.length})
              </h4>
              {drawerCompletedReqs.map(req => (
                <div 
                  key={req.id} 
                  onClick={() => {
                    setSelectedRequest(req);
                    setIsModalOpen(true);
                  }}
                  className="bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 cursor-pointer transition-all hover:border-green-300 group opacity-80 hover:opacity-100"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {req.organizations?.logo_url ? (
                        <img src={req.organizations.logo_url} className="w-4 h-4 rounded-full object-cover shrink-0 grayscale group-hover:grayscale-0 transition-all bg-white" alt="logo" crossOrigin="anonymous"/>
                      ) : (
                        <Building2 size={12} className="text-gray-400 shrink-0"/>
                      )}
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 truncate">{req.organizations?.name || 'Cliente'}</span>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-900/50">
                      {req.status?.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-bold text-gray-600 dark:text-gray-400 leading-tight mb-3 line-clamp-2">
                    {req.title}
                  </h4>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <EditRequestModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        staffCatalog={staffCatalog}
        prioritiesCatalog={prioritiesCatalog}
        onRefresh={fetchData}
      />
    </div>
  );
}