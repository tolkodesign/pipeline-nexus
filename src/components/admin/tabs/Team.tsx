import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LayoutGrid, List, ShieldPlus, Search, Loader2, X, FolderKanban, Clock, Target, ExternalLink, Filter, Mail, Users, ShieldCheck, Edit2, Trash2, AlertCircle, CheckCircle2, UserMinus, FileText, Hash, Trophy, Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList, Legend } from 'recharts';
import TeamCard from '../ui/TeamCard';
import TeamListRow from '../ui/TeamListRow';
import AddTeamModal from '../modals/AddTeamModal';
import EditTeamModal from '../modals/EditTeamModal';
import EditRequestModal from '../modals/EditRequestModal';
import ManageDistributionModal from '../modals/ManageDistributionModal';
import { supabase } from '../../../lib/supabase';
import { useUserRole } from '../../../hooks/useUserRole'; 
import Swal from 'sweetalert2';

const safeParseJSON = (data: any) => {
  if (typeof data === 'string') {
    try { return JSON.parse(data); } catch { return []; }
  }
  return Array.isArray(data) ? data : [];
};

function TeamRequestsModal({ member, onClose, staffCatalog, prioritiesCatalog, onRefreshParent }: { member: any, onClose: () => void, staffCatalog: any[], prioritiesCatalog: any[], onRefreshParent: () => void }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  useEffect(() => {
    if (member && !selectedRequest) fetchTasks();
  }, [member, selectedRequest]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('request_tasks')
        .select(`
          *,
          task_assignees!inner(profile_id, assigned_quantity, assigned_items, status, deliverable_url, delivery_notes),
          requests (
            id, title, description, created_at, items_breakdown, quantity, is_active,
            needs_design, needs_dev, needs_av, needs_copy, needs_prod, needs_staff, needs_rp,
            organizations ( name ),
            projects ( name ),
            priorities!requests_priority_id_fkey( level, color_code ),
            request_categories ( name ),
            profiles!requests_requester_id_fkey ( full_name )
          )
        `)
        .eq('task_assignees.profile_id', member.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const validTasks = (data || []).filter((t: any) => {
        const reqDataRaw = Array.isArray(t.requests) ? t.requests[0] : t.requests;
        return reqDataRaw?.is_active !== false;
      });
      
      setTasks(validTasks);
    } catch (err) {
      console.error("Error al cargar tareas:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSubTask = (task: any) => {
    if (Array.isArray(task.task_assignees)) {
      return task.task_assignees.find((a: any) => a.profile_id === member.id) || task.task_assignees[0] || {};
    }
    return task.task_assignees || {};
  };

  const getSubStatus = (task: any) => getSubTask(task).status || task.status || 'pendiente';

  const getSubQty = (task: any) => {
    const subTask = getSubTask(task);
    const rawReq = task.requests as any; 
    const reqData = (Array.isArray(rawReq) ? rawReq[0] : rawReq) || {};
    
    const assignedItems = safeParseJSON(subTask.assigned_items);
    if (assignedItems.length > 0) {
      return assignedItems.reduce((sum: number, item: any) => sum + (Number(item.quantity) || 1), 0);
    } 
    
    if (Number(subTask.assigned_quantity) > 0) {
      return Number(subTask.assigned_quantity);
    }
    
    const reqBreakdown = safeParseJSON(reqData.items_breakdown);
    const disciplineItems = reqBreakdown.filter((item: any) => {
      const itemArea = String(item.area || item.discipline || '').toLowerCase().trim();
      const taskArea = String(task.discipline || '').toLowerCase().trim();
      return itemArea === taskArea;
    });

    if (disciplineItems.length > 0) {
      return disciplineItems.reduce((sum: number, item: any) => sum + (Number(item.quantity) || 1), 0);
    } 
    
    if (Number(task.quantity) > 0) {
      return Number(task.quantity);
    }
    
    return 1;
  };

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      aprobado: 'bg-green-500/10 text-green-500 border-green-500/20',
      completado: 'bg-green-500/10 text-green-500 border-green-500/20',
      aprobado_interno: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      en_proceso: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      en_revision_cliente: 'bg-cyan-500/10 text-cyan-400 border-cyan-200/20',
      con_correcciones: 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse',
      entregado: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    };
    return styles[status] || 'bg-gray-100 dark:bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-500/20';
  };

  return createPortal(
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-50 dark:bg-[#0a0a0c] w-full max-w-5xl rounded-[20px] overflow-hidden shadow-2xl flex flex-col h-[85vh] transition-colors duration-300">
        <div className="bg-luxury-red px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-black/10 flex items-center justify-center">
              <FolderKanban className="text-white" size={20}/>
            </div>
            <div>
              <h2 className="text-white font-black text-lg uppercase tracking-tight leading-tight">Desglose de Asignaciones</h2>
              <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-0.5">TEAM • {member.full_name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-white flex items-center justify-center transition-colors cursor-pointer">
            <X size={16} strokeWidth={3} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-luxury-red border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-gray-300 dark:border-zinc-800 rounded-2xl bg-white/50 dark:bg-[#070709]/30">
                <FolderKanban className="mx-auto text-gray-400 dark:text-gray-700 mb-4" size={48} />
                <p className="text-gray-500 text-xs font-black uppercase tracking-widest">No tiene tareas asignadas</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {tasks.map((task) => {
                  const rawReq = task.requests as any;
                  const req = (Array.isArray(rawReq) ? rawReq[0] : rawReq) || {};
                  const subStatus = getSubStatus(task);
                  const subQty = getSubQty(task);

                  return (
                    <div key={task.id} onClick={() => setSelectedRequest(req)} className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-zinc-800/80 p-5 rounded-2xl hover:border-luxury-red/50 dark:hover:border-luxury-red/50 transition-all group shadow-sm cursor-pointer relative overflow-hidden">
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <ExternalLink className="text-luxury-red" size={24} strokeWidth={2.5} />
                      </div>
                      
                      <div className="flex justify-between items-start mb-4 pr-10">
                        <div className="flex flex-wrap gap-2">
                          <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-full border border-gray-200 dark:border-white/5">
                            {req?.organizations?.name || 'Interno'}
                          </span>
                          <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(subStatus)}`}>
                            TAREA: {subStatus.replace(/_/g, ' ')}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 shrink-0">
                          <Clock size={12} className="text-luxury-red" />
                          <span className="text-[10px] font-bold">{new Date(task.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2 group-hover:text-luxury-red transition-colors pr-10">
                        {req?.title || 'Sin Título'}
                      </h3>

                      <div className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest mb-4 inline-flex items-center gap-1.5 border border-blue-200 dark:border-blue-500/20 shadow-sm">
                        <Layers size={14}/> {subQty} {subQty === 1 ? 'Entregable' : 'Entregables'} de {task.discipline}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-zinc-800/60 pr-10">
                        <span className="text-[8px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">Tablero: {req?.projects?.name || 'General'}</span>
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#141419] flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:bg-luxury-red/10 group-hover:text-luxury-red transition-colors">
                           <Target size={14} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {selectedRequest && (
          <EditRequestModal 
            isOpen={!!selectedRequest}
            onClose={() => setSelectedRequest(null)}
            request={selectedRequest}
            staffCatalog={staffCatalog}
            prioritiesCatalog={prioritiesCatalog}
            onRefresh={() => {
              fetchTasks();
              onRefreshParent();
            }}
          />
        )}
      </div>
    </div>,
    document.body
  );
}

export default function TeamPage() {
  const { role, loadingRole } = useUserRole();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDistModalOpen, setIsDistModalOpen] = useState(false); 
  const [team, setTeam] = useState<any[]>([]);
  const [teamToEdit, setTeamToEdit] = useState<any | null>(null);

  const [teamFilter, setTeamFilter] = useState<'activos' | 'inactivos'>('activos');
  const [searchQuery, setSearchQuery] = useState('');
  const [areaFilter, setAreaFilter] = useState('todos'); 
  const [teamForRequests, setTeamForRequests] = useState<any | null>(null);

  const [staffCatalog, setStaffCatalog] = useState<any[]>([]);
  const [prioritiesCatalog, setPrioritiesCatalog] = useState<any[]>([]);

  const [rawTasks, setRawTasks] = useState<any[]>([]);
  const [chartAreaFilter, setChartAreaFilter] = useState('todos');
  const [chartStatusFilter, setChartStatusFilter] = useState<'completadas' | 'en_proceso'>('completadas');
  const [chartTimeFilter, setChartTimeFilter] = useState<'diario' | 'semanal' | 'mensual' | 'todos'>('todos');
  const [chartData, setChartData] = useState<any[]>([]);

  const removeAccents = (str?: string) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : '';
  const checkAreaMatch = (val1?: string, val2?: string) => {
    const v1 = removeAccents(val1);
    const v2 = removeAccents(val2);
    return v1 === v2 || (v1 === 'rp' && v2 === 'relaciones publicas') || (v2 === 'rp' && v1 === 'relaciones publicas');
  };

  const [specialtiesCatalog, setSpecialtiesCatalog] = useState<any[]>([]);

  useEffect(() => {
    const fetchCatalogs = async () => {
      const [staffRes, priosRes, specsRes] = await Promise.all([
        supabase.from('profiles').select('*, internal_roles(name), specialties(name)').eq('is_active', true),
        supabase.from('priorities').select('*'),
        supabase.from('specialties').select('*').order('name')
      ]);
      if (specsRes.data) setSpecialtiesCatalog(specsRes.data);
      if (staffRes.data) {
        setStaffCatalog(staffRes.data.map((s:any) => ({
          ...s, internal_role: s.internal_roles?.name || 'Colaborador', specialty: s.specialties?.name || 'Sin área'
        })));
      }
      if (priosRes.data) setPrioritiesCatalog(priosRes.data);
    };
    fetchCatalogs();
  }, []);

  useEffect(() => {
    if (!isModalOpen && !teamToEdit) fetchTeam();
  }, [isModalOpen, teamToEdit, teamFilter]);

  const fetchTeam = async () => {
    const fetchAllAssignees = async () => {
      let allRecords: any[] = [];
      let page = 0;
      const pageSize = 1000;
      let keepFetching = true;

      while (keepFetching) {
        const { data, error } = await supabase
          .from('task_assignees')
          .select(`
            profile_id, task_id, assigned_quantity, assigned_items, status, created_at,
            request_tasks (
              id, request_id, quantity, created_at, discipline, status,
              requests ( quantity, items_breakdown )
            )
          `)
          .order('created_at', { ascending: false })
          .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) {
          console.error("Error cargando bloque de task_assignees:", error);
          break;
        }

        if (data && data.length > 0) {
          allRecords = [...allRecords, ...data];
          if (data.length < pageSize) {
            keepFetching = false;
          } else {
            page++;
          }
        } else {
          keepFetching = false;
        }
      }
      return allRecords;
    };

    const [teamRes, assigneesData] = await Promise.all([
      supabase
        .from('profiles')
        .select(`*, organization_members ( organizations ( name ) ), internal_roles(name), specialties(name)`)
        .not('role_id', 'is', null) 
        .eq('is_active', teamFilter === 'activos')
        .order('created_at', { ascending: false }),
      fetchAllAssignees()
    ]);

    if (teamRes.error) return;

    // Mapeo seguro con la información completa
    const processedTasks = (assigneesData || []).map((p: any) => {
      const task = Array.isArray(p.request_tasks) ? p.request_tasks[0] : p.request_tasks;
      if (!task) return null;

      const rawReq = task.requests;
      const reqData = (Array.isArray(rawReq) ? rawReq[0] : rawReq) || {};

      let finalQty = 1;
      const assignedItems = safeParseJSON(p.assigned_items);
      
      if (assignedItems.length > 0) {
        finalQty = assignedItems.reduce((sum: number, item: any) => sum + (Number(item.quantity) || 1), 0);
      } else if (Number(p.assigned_quantity) > 0) {
        finalQty = Number(p.assigned_quantity);
      } else {
        const reqBreakdown = safeParseJSON(reqData.items_breakdown);
        const disciplineItems = reqBreakdown.filter((item: any) => {
          const itemArea = String(item.area || item.discipline || '').toLowerCase().trim();
          const taskArea = String(task.discipline || '').toLowerCase().trim();
          return itemArea === taskArea;
        });

        if (disciplineItems.length > 0) {
          finalQty = disciplineItems.reduce((sum: number, item: any) => sum + (Number(item.quantity) || 1), 0);
        } else if (Number(task.quantity) > 0) {
          finalQty = Number(task.quantity);
        } else if (reqBreakdown.length > 0) {
          finalQty = reqBreakdown.reduce((sum: number, item: any) => sum + (Number(item.quantity) || 1), 0);
        } else if (Number(reqData.quantity) > 0) {
          finalQty = Number(reqData.quantity);
        }
      }

      return { 
        profile_id: p.profile_id, 
        created_at: p.created_at || task.created_at, 
        qty: finalQty, // ENTREGABLES (PIEZAS) EXACTOS
        status: p.status || task.status || 'pendiente',
        request_id: task.request_id,
        discipline: task.discipline || 'General'
      };
    }).filter(Boolean); 

    setRawTasks(processedTasks);

    const profileMetrics: Record<string, { active_pieces: number, delivered_pieces: number, assigned_tasks: number }> = {};

    processedTasks.forEach((t: any) => {
      if (!profileMetrics[t.profile_id]) {
         profileMetrics[t.profile_id] = { active_pieces: 0, delivered_pieces: 0, assigned_tasks: 0 };
      }
      
      // 1 FILA = 1 SOLICITUD
      profileMetrics[t.profile_id].assigned_tasks++; 
      
      if(['pendiente', 'en_proceso', 'con_correcciones'].includes(t.status)) {
          profileMetrics[t.profile_id].active_pieces += t.qty;
      } else if (['aprobado_interno'].includes(t.status)) {
          profileMetrics[t.profile_id].delivered_pieces += t.qty;
      }
    });

    const formattedTeam = teamRes.data.map((member: any) => ({
      ...member,
      internal_role: member.internal_roles?.name || 'Colaborador',
      specialty: member.specialties?.name || 'Sin área',
      companies: member.organization_members?.map((om: any) => om.organizations?.name).filter(Boolean) || [],
      total_requests: profileMetrics[member.id]?.assigned_tasks || 0,
      active_pieces: profileMetrics[member.id]?.active_pieces || 0,
      delivered_pieces: profileMetrics[member.id]?.delivered_pieces || 0
    }));

    setTeam(formattedTeam);
  };

  useEffect(() => {
    if (!team.length || !rawTasks.length) {
      setChartData([]);
      return;
    }

    const now = new Date();
    let limitDate = new Date(0);

    if (chartTimeFilter === 'diario') limitDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    else if (chartTimeFilter === 'semanal') limitDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    else if (chartTimeFilter === 'mensual') limitDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let teamForChart = team.filter(m => m.is_active);

    if (chartAreaFilter !== 'todos') {
      teamForChart = teamForChart.filter(member => 
        checkAreaMatch(member.specialty, chartAreaFilter) || 
        checkAreaMatch(member.internal_role, chartAreaFilter)
      );
    }
    
    const newChartData = teamForChart.map(member => {
      const memberTasks = rawTasks.filter((task: any) => {
        if (task.profile_id !== member.id || !task.created_at) return false;
        
        const isCompleted = ['aprobado_interno'].includes(task.status);
        const isInProcess = ['pendiente', 'en_proceso', 'con_correcciones'].includes(task.status);
        
        if (chartStatusFilter === 'completadas' && !isCompleted) return false;
        if (chartStatusFilter === 'en_proceso' && !isInProcess) return false;
        
        const taskDate = new Date(task.created_at);
        if (chartTimeFilter !== 'todos') {
           if (taskDate < limitDate) return false;
        }

        return true;
      });

      const memberPieces = memberTasks.reduce((sum: number, task: any) => sum + task.qty, 0);
      const memberTasksCount = memberTasks.length; 

      return {
        name: member.full_name,
        displayName: member.full_name.split(' ')[0], 
        piezas: memberPieces,
        solicitudes: memberTasksCount
      };
    });

    setChartData(newChartData);
  }, [chartTimeFilter, chartStatusFilter, chartAreaFilter, rawTasks, team]);

  const handleDeleteTeam = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: `¿Inhabilitar a ${name}?`,
      text: "Pasará al historial y no podrá acceder al panel de agencia.",
      icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#D3002D', cancelButtonColor: '#4b5563', confirmButtonText: 'SÍ, INHABILITAR', cancelButtonText: 'CANCELAR'
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from('profiles').update({ is_active: false }).eq('id', id);
      if (!error) {
        Swal.fire({ title: 'Inhabilitado', text: 'Enviado al historial.', icon: 'success', confirmButtonColor: '#D3002D' });
        fetchTeam();
      }
    }
  };

  const handleRestoreTeam = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: `¿Reactivar a ${name}?`,
      text: "Volverá a tener acceso a sus tareas y proyectos.",
      icon: 'question',
      showCancelButton: true, confirmButtonColor: '#10B981', cancelButtonColor: '#4b5563', confirmButtonText: 'SÍ, ACTIVAR', cancelButtonText: 'CANCELAR'
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from('profiles').update({ is_active: true }).eq('id', id);
      if (!error) {
        Swal.fire({ title: 'Reactivado', text: 'El perfil vuelve a estar activo.', icon: 'success', confirmButtonColor: '#10B981' });
        fetchTeam();
      }
    }
  };

  const filteredTeam = team.filter(member => {
    const searchNorm = removeAccents(searchQuery);
    const matchesSearch = 
      removeAccents(member.full_name).includes(searchNorm) ||
      removeAccents(member.email).includes(searchNorm) ||
      removeAccents(member.internal_role).includes(searchNorm);

    const matchesArea = 
      areaFilter === 'todos' || 
      checkAreaMatch(member.internal_role, areaFilter) ||
      checkAreaMatch(member.specialty, areaFilter);

    return matchesSearch && matchesArea;
  });

  if (loadingRole) {
    return <div className="flex h-full items-center justify-center min-h-[400px]"><Loader2 className="animate-spin text-luxury-red" size={40} /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 transition-colors duration-300 w-full max-w-full overflow-hidden">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors duration-300"> 
            TEAM <span className="text-luxury-red">TOLKO</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
            Gestión de talento interno y niveles de acceso ({filteredTeam.length})
          </p>
        </div>
        
        {role === 'Admin' && (
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="w-full sm:w-auto justify-center bg-luxury-red hover:bg-red-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-luxury-red/20 active:scale-95 cursor-pointer uppercase tracking-wider"
          >
            <ShieldPlus size={18}/> Alta de Personal
          </button>
        )}
      </div>

      {teamFilter === 'activos' && chartData.length > 0 && (
        <div className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-white/[0.06] rounded-2xl shadow-sm p-6 mb-6">
          
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 w-full">
              
              <div className="relative w-full sm:w-56">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <select 
                  value={chartAreaFilter} 
                  onChange={e => setChartAreaFilter(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/[0.06] rounded-xl py-2 pl-9 pr-3 text-[10px] font-black uppercase text-gray-600 dark:text-gray-400 outline-none focus:border-luxury-red cursor-pointer appearance-none transition-colors"
                >
                  <option value="todos">Todas las Áreas</option>
                  {specialtiesCatalog.map((s: any) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex bg-gray-50 dark:bg-black/20 p-1 rounded-xl border border-gray-200 dark:border-white/[0.06]">
                <button onClick={() => setChartStatusFilter('en_proceso')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${chartStatusFilter === 'en_proceso' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>En Proceso</button>
                <button onClick={() => setChartStatusFilter('completadas')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${chartStatusFilter === 'completadas' ? 'bg-green-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>Completadas</button>
              </div>

              <div className="w-px bg-gray-200 dark:bg-zinc-800 hidden sm:block h-6 my-auto"></div>

              <div className="flex bg-gray-50 dark:bg-black/20 p-1 rounded-xl border border-gray-200 dark:border-white/[0.06]">
                <button onClick={() => setChartTimeFilter('diario')} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${chartTimeFilter === 'diario' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>Diario</button>
                <button onClick={() => setChartTimeFilter('semanal')} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${chartTimeFilter === 'semanal' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>Semanal</button>
                <button onClick={() => setChartTimeFilter('mensual')} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${chartTimeFilter === 'mensual' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>Mensual</button>
                <button onClick={() => setChartTimeFilter('todos')} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${chartTimeFilter === 'todos' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>Histórico</button>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Trophy size={16} className="text-luxury-red"/> 
                Rendimiento: {chartStatusFilter === 'completadas' ? 'Asignaciones Entregadas' : 'Asignaciones En Proceso'}
              </h3>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 30, right: 30, left: 0, bottom: 20 }} barGap={0} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#555555" opacity={0.15} />
                <XAxis 
                  dataKey="displayName" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#A0AEC0', fontWeight: '900' }} 
                  dy={15} 
                />
                <YAxis 
                  allowDecimals={false}
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#A0AEC0', fontWeight: '900' }} 
                  dx={-15} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 15, 18, 0.9)', 
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                  }}
                  itemStyle={{ fontSize: '13px', fontWeight: '900', color: '#E2E8F0', textTransform: 'uppercase', letterSpacing: '1px' }}
                  labelStyle={{ color: '#888888', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}
                  labelFormatter={(label, payload) => payload[0]?.payload?.name || label}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }}/>
                
                <Bar dataKey="piezas" name={chartStatusFilter === 'completadas' ? 'Entregables Completados' : 'Entregables en Proceso'} fill="#D3002D" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="piezas" position="top" fill="#A0AEC0" fontSize={12} fontWeight="bold" />
                </Bar>

                <Bar dataKey="solicitudes" name={chartStatusFilter === 'completadas' ? 'Solicitudes Completadas' : 'Solicitudes en Proceso'} fill="#3B82F6" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="solicitudes" position="top" fill="#A0AEC0" fontSize={12} fontWeight="bold" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 items-center bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-white/[0.06] p-4 rounded-2xl shadow-sm dark:shadow-none transition-colors duration-300 w-full">
        
        <div className="flex bg-gray-50 dark:bg-[#050505] p-1.5 rounded-xl border border-gray-200 dark:border-white/[0.06] select-none shrink-0 w-full lg:w-auto">
          <button onClick={() => setTeamFilter('activos')} className={`flex-1 lg:flex-none px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${teamFilter === 'activos' ? 'bg-white dark:bg-[#1A1A21] text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Activos</button>
          <button onClick={() => setTeamFilter('inactivos')} className={`flex-1 lg:flex-none px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${teamFilter === 'inactivos' ? 'bg-white dark:bg-[#1A1A21] text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Historial</button>
        </div>

        <div className="w-full lg:flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors duration-300" size={16}/>
          <input 
            type="text" 
            placeholder="Buscar staff por nombre, correo..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-white/[0.06] rounded-xl py-3 pl-11 pr-4 text-gray-900 dark:text-white outline-none focus:border-luxury-red transition-all text-xs font-bold duration-300" 
          />
        </div>

        <div className="w-full lg:w-auto flex flex-row items-center gap-3 justify-between sm:justify-end shrink-0">
          <div className="relative w-full sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <select 
              value={areaFilter} 
              onChange={e => setAreaFilter(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-white/[0.06] rounded-xl py-3 pl-9 pr-3 text-xs font-black text-gray-600 dark:text-gray-400 outline-none focus:border-luxury-red cursor-pointer appearance-none transition-colors"
            >
              <option value="todos">Listar Todos</option>
              <optgroup label="Roles">
                <option value="Admin">Administradores</option>
                <option value="Líder">Líderes de Área</option>
                <option value="Coordinador">Coordinadores</option>
                <option value="Colaborador">Colaboradores</option>
              </optgroup>
              <optgroup label="Especialidades">
                {specialtiesCatalog.map((s: any) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="flex bg-gray-50 dark:bg-[#050505] p-1 rounded-xl border border-gray-200 dark:border-white/[0.06] transition-colors duration-300 shrink-0">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${viewMode === 'grid' ? 'bg-luxury-red text-white' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}><LayoutGrid size={16}/></button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${viewMode === 'list' ? 'bg-luxury-red text-white' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}><List size={16}/></button>
          </div>
        </div>
      </div>

      {team.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-300 dark:border-white/[0.06] rounded-2xl transition-colors duration-300 bg-white dark:bg-[#0F0F12]">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">No hay staff interno registrado en este bloque.</p>
        </div>
      ) : filteredTeam.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-300 dark:border-white/[0.06] rounded-2xl transition-colors duration-300 bg-white dark:bg-[#0F0F12]">
          <p className="text-gray-500 font-bold uppercase text-xs tracking-wider">No se encontraron coincidencias.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTeam.map(member => (
            <TeamCard 
              key={member.id} 
              member={member} 
              onEdit={() => setTeamToEdit(member)}
              onDelete={() => handleDeleteTeam(member.id, member.full_name)}
              onRestore={() => handleRestoreTeam(member.id, member.full_name)}
              onViewTasks={() => setTeamForRequests(member)}
              isHistorial={teamFilter === 'inactivos'}
              isAdminUser={role === 'Admin'}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-white/[0.06] rounded-2xl shadow-md dark:shadow-xl transition-colors duration-300 w-full overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-gray-50 dark:bg-white/5 text-[9px] uppercase tracking-widest text-gray-500 font-black border-b border-gray-100 dark:border-white/[0.06] transition-colors duration-300">
              <tr>
                <th className="px-6 py-4">Staff Member</th>
                <th className="px-6 py-4">Nivel de Acceso</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/[0.06] transition-colors duration-300 text-xs">
              {filteredTeam.map(member => (
                <TeamListRow 
                  key={member.id} 
                  member={member} 
                  onEdit={() => setTeamToEdit(member)}
                  onDelete={() => handleDeleteTeam(member.id, member.full_name)}
                  onRestore={() => handleRestoreTeam(member.id, member.full_name)}
                  onViewTasks={() => setTeamForRequests(member)}
                  isHistorial={teamFilter === 'inactivos'}
                  isAdminUser={role === 'Admin'}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {role === 'Admin' && (
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/[0.06] w-full">
          <div className="bg-gradient-to-r from-gray-900 to-black dark:from-luxury-card dark:to-[#09090b] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-white/5 transition-all">
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 min-w-0">
              <div className="bg-luxury-red/20 p-4 rounded-xl border border-luxury-red/30 shrink-0 text-luxury-red">
                <Mail size={28} />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Listas de Distribución</h3>
                <p className="text-gray-400 text-xs mt-1 max-w-lg leading-relaxed font-medium">
                  Configura y edita los flujos de correo. Asigna qué Líderes o Coordinadores ven los requerimientos de cada marca cliente.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsDistModalOpen(true)}
              className="w-full md:w-auto bg-white hover:bg-gray-100 text-black px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Users size={14} strokeWidth={3}/> Configurar Listas
            </button>
          </div>
        </div>
      )}

      {role === 'Admin' && (
        <>
          <AddTeamModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchTeam} />
          {teamToEdit && <EditTeamModal isOpen={!!teamToEdit} onClose={() => setTeamToEdit(null)} member={teamToEdit} onRefresh={fetchTeam} />}
          <ManageDistributionModal isOpen={isDistModalOpen} onClose={() => setIsDistModalOpen(false)} />
        </>
      )}

      {/* 🔥 MODAL DE HISTORIAL DE TAREAS DEL STAFF */}
      {teamForRequests && (
        <TeamRequestsModal 
          member={teamForRequests} 
          onClose={() => setTeamForRequests(null)} 
          staffCatalog={staffCatalog}
          prioritiesCatalog={prioritiesCatalog}
          onRefreshParent={fetchTeam}
        />
      )}
    </div>
  );
}