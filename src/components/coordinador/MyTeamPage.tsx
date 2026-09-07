import { useState, useEffect } from 'react';
import { LayoutGrid, List, ShieldPlus, Search, ShieldCheck, Edit2, Trash2, Loader2, Users, FolderKanban, X, Clock, Target, AlertCircle, CheckCircle2, UserMinus, FileText, ExternalLink, Trophy, Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Legend } from 'recharts';
import AddTeamModal from '../../components/admin/modals/AddTeamModal';
import EditTeamModal from '../../components/admin/modals/EditTeamModal';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext'; 
import Swal from 'sweetalert2';
import TeamCard from '../admin/ui/TeamCard';
import TeamListRow from '../admin/ui/TeamListRow';

const safeParseJSON = (data: any) => {
  if (typeof data === 'string') {
    try { return JSON.parse(data); } catch { return []; }
  }
  return Array.isArray(data) ? data : [];
};

function MemberAssignmentsModal({ member, onClose }: { member: any, onClose: () => void }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'todos' | 'activos' | 'correcciones' | 'completados'>('todos');

  useEffect(() => {
    if (member) fetchTasks();
  }, [member]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('request_tasks')
        .select(`
          *,
          task_assignees!inner(profile_id, assigned_quantity, assigned_items, status, deliverable_url, delivery_notes),
          requests (
            title, due_date, status, items_breakdown, quantity, is_active
          )
        `)
        .eq('task_assignees.profile_id', member.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      const validTasks = (data || []).filter((t: any) => {
        const reqDataRaw = Array.isArray(t.requests) ? t.requests[0] : t.requests;
        return reqDataRaw?.is_active !== false;
      });
      
      setTasks(validTasks);
    } catch (err) {
      console.error("Error al cargar tareas del modal:", err);
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
  
  // 🔥 FÓRMULA MAESTRA PARA PIEZAS EXACTAS POR ÁREA
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
      con_correcciones: 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse',
      entregado: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      pendiente: 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-zinc-700'
    };
    return styles[status] || styles.pendiente;
  };

  const countActivos = tasks.filter(t => ['pendiente', 'en_proceso'].includes(getSubStatus(t))).reduce((sum, t) => sum + getSubQty(t), 0);
  const countCorrecciones = tasks.filter(t => getSubStatus(t) === 'con_correcciones').reduce((sum, t) => sum + getSubQty(t), 0);
  const countCompletados = tasks.filter(t => ['entregado', 'aprobado_interno', 'aprobado', 'completado'].includes(getSubStatus(t))).reduce((sum, t) => sum + getSubQty(t), 0);

  const filteredTasks = tasks.filter(task => {
    const s = getSubStatus(task);
    if (activeFilter === 'activos') return ['pendiente', 'en_proceso'].includes(s);
    if (activeFilter === 'correcciones') return s === 'con_correcciones';
    if (activeFilter === 'completados') return ['entregado', 'aprobado_interno', 'aprobado', 'completado'].includes(s);
    return true; 
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 dark:bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-white/10 w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95">
        
        <div className="p-8 bg-luxury-red flex items-center justify-between shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="relative">
              <img src={member.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.full_name || 'X')}&background=1E1E24&color=D3002D`} className="w-16 h-16 rounded-2xl border-2 border-white/20 shadow-lg object-cover" alt="avatar" />
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 border-2 border-luxury-red rounded-full shadow-sm ${!member.is_active ? 'bg-gray-400' : 'bg-green-500'}`}></div>
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Desglose de Piezas</h2>
              <p className="text-[10px] text-white/80 font-black tracking-[0.3em] uppercase mt-1.5 flex items-center gap-2">
                {member.internal_role === 'Reviewer' ? 'COLABORADOR' : member.internal_role} <span className="w-1 h-1 bg-white/40 rounded-full"></span> {member.full_name}
              </p>
            </div>
          </div>
          
          <button onClick={onClose} className="p-3 text-white/70 hover:text-white hover:bg-white/20 rounded-2xl transition-all cursor-pointer relative z-10">
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 flex flex-col bg-gray-50/50 dark:bg-transparent">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 shrink-0">
            <div onClick={() => setActiveFilter('activos')} className={`bg-white dark:bg-[#16161D] border p-5 rounded-3xl transition-all cursor-pointer flex items-center justify-between group shadow-sm dark:shadow-none ${activeFilter === 'activos' ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'border-gray-200 dark:border-white/5 hover:border-blue-500/30'}`}>
              <div>
                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1 group-hover:text-blue-500 transition-colors">Piezas en Cola</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white">{countActivos}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                <Clock size={20} strokeWidth={2.5}/>
              </div>
            </div>

            <div onClick={() => setActiveFilter('correcciones')} className={`bg-white dark:bg-[#16161D] border p-5 rounded-3xl transition-all cursor-pointer flex items-center justify-between group shadow-sm dark:shadow-none ${activeFilter === 'correcciones' ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-gray-200 dark:border-white/5 hover:border-red-500/30'}`}>
              <div>
                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1 group-hover:text-red-500 transition-colors">Piezas Rebotadas</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white">{countCorrecciones}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                <AlertCircle size={20} strokeWidth={2.5}/>
              </div>
            </div>

            <div onClick={() => setActiveFilter('completados')} className={`bg-white dark:bg-[#16161D] border p-5 rounded-3xl transition-all cursor-pointer flex items-center justify-between group shadow-sm dark:shadow-none ${activeFilter === 'completados' ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'border-gray-200 dark:border-white/5 hover:border-green-500/30'}`}>
              <div>
                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1 group-hover:text-green-500 transition-colors">Piezas Entregadas</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white">{countCompletados}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                <CheckCircle2 size={20} strokeWidth={2.5}/>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6 shrink-0">
            <button onClick={() => setActiveFilter('todos')} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${activeFilter === 'todos' ? 'bg-gray-900 text-white dark:bg-white dark:text-black border-transparent' : 'bg-transparent text-gray-500 dark:text-gray-400 border-gray-300 dark:border-white/10 hover:border-gray-400'}`}>
              Todas
            </button>
            <button onClick={() => setActiveFilter('activos')} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${activeFilter === 'activos' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30' : 'bg-transparent text-gray-500 dark:text-gray-400 border-gray-300 dark:border-white/10 hover:border-gray-400'}`}>
              En Cola
            </button>
            <button onClick={() => setActiveFilter('correcciones')} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${activeFilter === 'correcciones' ? 'bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-500/30' : 'bg-transparent text-gray-500 dark:text-gray-400 border-gray-300 dark:border-white/10 hover:border-gray-400'}`}>
              En Triage
            </button>
            <button onClick={() => setActiveFilter('completados')} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${activeFilter === 'completados' ? 'bg-green-50 text-green-600 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-500/30' : 'bg-transparent text-gray-500 dark:text-gray-400 border-gray-300 dark:border-white/10 hover:border-gray-400'}`}>
              Entregadas
            </button>
          </div>

          <div className="flex-1 space-y-4">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-luxury-red border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-gray-300 dark:border-white/5 rounded-[2rem] bg-white dark:bg-white/[0.01]">
                <FolderKanban className="mx-auto text-gray-400 dark:text-gray-700 mb-4" size={48} />
                <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Sin asignaciones en este estatus</p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const subStatus = getSubStatus(task);
                const subQty = getSubQty(task);
                const subTaskData = getSubTask(task);

                return (
                  <div key={task.id} className="bg-white dark:bg-[#16161D] border border-gray-200 dark:border-white/[0.05] p-5 rounded-[1.8rem] hover:border-blue-500/30 transition-all group shadow-sm dark:shadow-none">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-full border border-gray-200 dark:border-white/5">
                          {task.discipline}
                        </span>
                        <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(subStatus)}`}>
                          {subStatus.replace(/_/g, ' ')}
                        </div>
                      </div>
                      {task.requests?.due_date && (
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock size={12} className={subStatus === 'con_correcciones' ? 'text-red-500 animate-pulse' : 'text-blue-500'} />
                          <span className="text-[10px] font-bold">{new Date(task.requests?.due_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-base md:text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight mb-3 group-hover:text-blue-500 transition-colors">
                      {task.requests?.title || 'PROYECTO SIN TÍTULO'}
                    </h3>
                    
                    <div className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest mb-4 inline-flex items-center gap-1.5 border border-blue-200 dark:border-blue-500/20 shadow-sm">
                      <Layers size={14}/> {subQty} {subQty === 1 ? 'Entregable' : 'Entregables'} de {task.discipline}
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-2">
                      <div className="bg-gray-50 dark:bg-black/20 rounded-2xl p-4 border border-gray-100 dark:border-white/5">
                        <p className="text-[8px] font-black text-gray-500 dark:text-gray-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                          <FileText size={10} /> Notas en la Entrega
                        </p>
                        <p className="text-[11px] text-gray-600 dark:text-gray-400 font-medium leading-relaxed italic">
                          {subTaskData.delivery_notes || "Sin comentarios en la entrega."}
                        </p>
                      </div>

                      {subTaskData.deliverable_url && (
                        <a 
                          href={subTaskData.deliverable_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-full bg-gray-100 dark:bg-white/5 hover:bg-blue-500 dark:hover:bg-blue-500 text-gray-700 hover:text-white dark:text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-gray-200 dark:border-white/10 hover:border-transparent cursor-pointer"
                        >
                          <ExternalLink size={14} /> Abrir Link del Entregable
                        </a>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function MyTeamPage() {
  const { user, profile } = useAuth();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [teamFilter, setTeamFilter] = useState<'activos' | 'inactivos'>('activos'); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [team, setTeam] = useState<any[]>([]);
  const [teamToEdit, setTeamToEdit] = useState<any | null>(null);
  const [memberForTasks, setMemberForTasks] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [chartData, setChartData] = useState<any[]>([]);
  const [rawTasks, setRawTasks] = useState<any[]>([]);
  
  const [chartTimeRange, setChartTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('all');
  const [chartStatusFilter, setChartStatusFilter] = useState<'completadas' | 'en_proceso'>('completadas');

  const leaderSpecialty = profile?.specialties?.name || profile?.specialty || 'Diseño';
  const leaderSpecialtyId = profile?.specialty_id || 4;

  useEffect(() => {
    if (user?.id && !isModalOpen && !teamToEdit) {
      fetchTeam();
    }
  }, [user, isModalOpen, teamToEdit, teamFilter]);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      // 🔥 SOLUCIÓN: JOIN RELACIONAL DIRECTO EN SUPABASE CON LÍMITE ALTO 🔥
      const [teamRes, assigneesRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('*, internal_roles(name), specialties(name)')
          .eq('specialty_id', leaderSpecialtyId)
          .eq('is_active', teamFilter === 'activos')
          .order('created_at', { ascending: false }),
        supabase
          .from('task_assignees')
          .select(`
            profile_id, task_id, assigned_quantity, assigned_items, status, created_at,
            request_tasks (
              id, request_id, quantity, created_at, discipline, status,
              requests ( quantity, items_breakdown )
            )
          `)
          .limit(15000)
      ]);

      if (teamRes.error) throw teamRes.error;

      // Mapeo seguro con la información completa
      const processedTasks = (assigneesRes.data || []).map((p: any) => {
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
        } else if (['entregado', 'aprobado_interno', 'aprobado', 'completado'].includes(t.status)) {
            profileMetrics[t.profile_id].delivered_pieces += t.qty;
        }
      });
      
      const formattedTeam = teamRes.data.map((member: any) => ({
        ...member,
        internal_role: member.internal_roles?.name || member.internal_role || 'Colaborador',
        specialty: member.specialties?.name || member.specialty || 'General',
        total_requests: profileMetrics[member.id]?.assigned_tasks || 0, 
        active_pieces: profileMetrics[member.id]?.active_pieces || 0,  
        delivered_pieces: profileMetrics[member.id]?.delivered_pieces || 0 
      }));

      setTeam(formattedTeam || []);
    } catch (error) {
      console.error("Error al traer el equipo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!team.length || !rawTasks.length) {
      setChartData([]);
      return;
    }

    const now = new Date();
    let limitDate = new Date(0);

    if (chartTimeRange === 'daily') limitDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    else if (chartTimeRange === 'weekly') limitDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    else if (chartTimeRange === 'monthly') limitDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const activeTeam = team.filter(m => m.is_active);
    
    const newChartData = activeTeam.map(member => {
      const memberTasks = rawTasks.filter((task: any) => {
        if (task.profile_id !== member.id || !task.created_at) return false;
        
        const isCompleted = ['entregado', 'aprobado_interno', 'aprobado', 'completado'].includes(task.status);
        const isInProcess = ['pendiente', 'en_proceso', 'con_correcciones'].includes(task.status);
        
        if (chartStatusFilter === 'completadas' && !isCompleted) return false;
        if (chartStatusFilter === 'en_proceso' && !isInProcess) return false;
        
        const taskDate = new Date(task.created_at);
        if (chartTimeRange !== 'all') {
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
  }, [chartTimeRange, chartStatusFilter, team, rawTasks]);

  const handleDeleteStaff = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: `¿Expulsar a ${name}?`,
      text: "El colaborador será removido de tu célula y pasará al historial de Inactivos.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#D3002D',
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'SÍ, EXPULSAR',
      cancelButtonText: 'CANCELAR'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from('profiles').update({ is_active: false }).eq('id', id);
        if (error) throw error;
        Swal.fire({ title: '¡Expulsado!', text: 'El miembro fue movido a inactivos.', icon: 'success', confirmButtonColor: '#D3002D' });
        fetchTeam();
      } catch (error: any) {
        Swal.fire('Error', 'Se aferró a la silla. Checa la consola.', 'error');
      }
    }
  };

  const handleRestoreStaff = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: `¿Restaurar a ${name}?`,
      text: "El colaborador volverá a tener acceso a las tareas de la célula.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981', 
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'SÍ, RESTAURAR',
      cancelButtonText: 'CANCELAR'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from('profiles').update({ is_active: true }).eq('id', id);
        if (error) throw error;
        Swal.fire({ title: '¡Restaurado!', text: 'El miembro volvió a la célula activa.', icon: 'success', confirmButtonColor: '#10B981' });
        fetchTeam();
      } catch (error: any) {
        Swal.fire('Error', 'No se pudo restaurar.', 'error');
      }
    }
  };

  const filteredTeam = team.filter(member => 
    member.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-screen bg-gray-50 dark:bg-luxury-dark">
        <Loader2 className="animate-spin text-luxury-red" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-luxury-dark text-gray-900 dark:text-gray-200 pb-12 space-y-8 font-sans w-full max-w-full flex-1 transition-colors duration-300 min-w-0 overflow-x-hidden">
      
      <div className="px-4 sm:px-6 md:px-10 pt-6 md:pt-10 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase"> 
              Gestión de <span className="text-luxury-red">Célula</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 font-bold uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={14} className="text-luxury-red shrink-0"/> Área: <span className="text-luxury-red font-black">{leaderSpecialty}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-10 w-full min-w-0 space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-white/[0.06] p-4 rounded-2xl shadow-sm relative z-10">
          
          <div className="flex bg-gray-50 dark:bg-[#050505] p-1.5 rounded-xl border border-gray-200 dark:border-white/[0.06] w-full lg:w-auto">
            <button 
              onClick={() => setTeamFilter('activos')} 
              className={`flex-1 lg:flex-none px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${teamFilter === 'activos' ? 'bg-white dark:bg-[#1A1A21] text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              Activos
            </button>
            <button 
              onClick={() => setTeamFilter('inactivos')} 
              className={`flex-1 lg:flex-none px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${teamFilter === 'inactivos' ? 'bg-white dark:bg-[#1A1A21] text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              Historial
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:flex-1 justify-end">
            <div className="w-full sm:w-64 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
              <input 
                type="text" 
                placeholder="Buscar colaborador..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-white/[0.06] rounded-xl py-3 pl-11 pr-4 text-gray-900 dark:text-white outline-none focus:border-luxury-red text-xs font-bold" 
              />
            </div>
            <div className="flex bg-gray-50 dark:bg-[#050505] p-1 rounded-xl border border-gray-200 dark:border-white/[0.06] shrink-0">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg cursor-pointer ${viewMode === 'grid' ? 'bg-luxury-red text-white shadow-md' : 'text-gray-400 hover:text-white'}`}><LayoutGrid size={18}/></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg cursor-pointer ${viewMode === 'list' ? 'bg-luxury-red text-white shadow-md' : 'text-gray-400 hover:text-white'}`}><List size={18}/></button>
            </div>
          </div>
        </div>

        {teamFilter === 'activos' && chartData.length > 0 && (
          <div className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-white/[0.06] rounded-2xl shadow-sm p-6 mb-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Trophy size={16} className="text-luxury-red"/> 
                Rendimiento: {chartStatusFilter === 'completadas' ? 'Asignaciones Entregadas' : 'Asignaciones En Proceso'}
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="flex bg-gray-50 dark:bg-black/20 p-1 rounded-xl border border-gray-200 dark:border-white/[0.06]">
                  <button onClick={() => setChartStatusFilter('en_proceso')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${chartStatusFilter === 'en_proceso' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>En Proceso</button>
                  <button onClick={() => setChartStatusFilter('completadas')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${chartStatusFilter === 'completadas' ? 'bg-green-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>Completadas</button>
                </div>
                <div className="w-px bg-gray-200 dark:bg-zinc-800 hidden sm:block mx-1"></div>
                <div className="flex bg-gray-50 dark:bg-black/20 p-1 rounded-xl border border-gray-200 dark:border-white/[0.06]">
                  <button onClick={() => setChartTimeRange('daily')} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${chartTimeRange === 'daily' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>Diario</button>
                  <button onClick={() => setChartTimeRange('weekly')} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${chartTimeRange === 'weekly' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>Semanal</button>
                  <button onClick={() => setChartTimeRange('monthly')} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${chartTimeRange === 'monthly' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>Mensual</button>
                  <button onClick={() => setChartTimeRange('all')} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${chartTimeRange === 'all' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>Histórico</button>
                </div>
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

        {team.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-300 dark:border-white/[0.06] rounded-2xl bg-white dark:bg-white/[0.01]">
            <Users className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={40} />
            <p className="text-gray-500 text-xs font-black uppercase tracking-wider">Tu célula de trabajo está vacía.</p>
          </div>
        ) : filteredTeam.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-300 dark:border-white/[0.06] rounded-2xl bg-white dark:bg-white/[0.01]">
            <p className="text-gray-500 font-bold uppercase text-xs">No se encontraron coincidencias.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in zoom-in-95 duration-200">
            {filteredTeam.map(member => (
              <TeamCard 
                key={member.id} 
                member={member} 
                onEdit={() => setTeamToEdit(member)}
                onDelete={() => handleDeleteStaff(member.id, member.full_name)}
                onRestore={() => handleRestoreStaff(member.id, member.full_name)}
                onViewTasks={() => setMemberForTasks(member)}
                isHistorial={teamFilter === 'inactivos'}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left min-w-[750px]">
                <thead className="bg-gray-50 dark:bg-white/5 text-[10px] uppercase tracking-widest text-gray-500 font-black border-b border-gray-200 dark:border-white/[0.06]">
                  <tr>
                    <th className="px-6 py-4">Colaborador</th>
                    <th className="px-6 py-4">Especialidad</th>
                    <th className="px-6 py-4">Métricas (Piezas & Solicitudes)</th>
                    <th className="px-6 py-4">Contacto</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/[0.06] text-xs">
                  {filteredTeam.map(member => (
                    <tr key={member.id} className={`hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors ${teamFilter === 'inactivos' ? 'opacity-60 hover:opacity-100 grayscale hover:grayscale-0' : ''}`}>
                      <td className="px-6 py-4 flex items-center gap-4">
                        <img src={member.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.full_name || 'X')}&background=1E1E24&color=D3002D`} className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-white/10 shadow-sm" alt="avatar" />
                        <div>
                          <div className="text-gray-900 dark:text-white font-black uppercase">{member.full_name}</div>
                          <div className="text-[10px] text-luxury-red font-black uppercase tracking-widest mt-0.5">
                            {member.internal_role === 'Reviewer' ? 'Colaborador' : member.internal_role}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300 uppercase">{member.specialty}</td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500">
                           <span className={member.total_requests > 0 ? "text-blue-500" : ""}>{member.total_requests || 0} Solicitudes</span>
                           <span>•</span>
                           <span className={member.active_pieces > 0 ? "text-amber-500" : ""}>{member.active_pieces || 0} Pz. Cola</span>
                           <span>•</span>
                           <span className="text-green-500">{member.delivered_pieces || 0} Pz. Entregadas</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-bold">{member.email}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-3">
                          <button onClick={() => setMemberForTasks(member)} className="p-2 text-gray-400 hover:text-blue-500 bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-white/[0.06] rounded-xl cursor-pointer shadow-sm hover:shadow transition-all" title={teamFilter === 'activos' ? 'Desglose' : 'Historial'}>
                            <FolderKanban size={16}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && <AddTeamModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchTeam} />}
      {teamToEdit && <EditTeamModal isOpen={!!teamToEdit} onClose={() => setTeamToEdit(null)} member={teamToEdit} onRefresh={fetchTeam} />}
      
      {memberForTasks && (
        <MemberAssignmentsModal 
          member={memberForTasks} 
          onClose={() => setMemberForTasks(null)} 
        />
      )}
    </div>
  );
}