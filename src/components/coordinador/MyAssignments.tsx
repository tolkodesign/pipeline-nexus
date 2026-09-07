import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircle2, Loader2, Clock, AlertCircle, Search, 
  Flame, X, ExternalLink, Calendar, Package 
} from 'lucide-react';
import Swal from 'sweetalert2';
import EditRequestModal from '../../components/admin/modals/EditRequestModal';

export default function MyAssignments() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  const [staffCatalog, setStaffCatalog] = useState<any[]>([]);
  const [prioritiesCatalog, setPrioritiesCatalog] = useState<any[]>([]);

  // Filtro por click en métricas superiores (modal de desglose)
  const [metricModalType, setMetricModalType] = useState<'nuevas' | 'correcciones' | 'vencer' | 'entregadas' | null>(null);

  // Filtros generales
  const [searchQuery, setSearchQuery] = useState('');
  const [clientFilter, setClientFilter] = useState('todos');
  const [uniqueClients, setUniqueClients] = useState<any[]>([]);

  useEffect(() => {
    fetchCatalogs();
    if (user?.id) fetchMyTasks();

    const channel = supabase.channel('my-assignments-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'task_assignees' }, fetchMyTasks)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'request_tasks' }, fetchMyTasks)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'task_adjustments' }, fetchMyTasks)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchCatalogs = async () => {
    const [staffRes, priosRes] = await Promise.all([
      supabase.from('profiles').select('*, internal_roles(name), specialties(name)').eq('is_active', true),
      supabase.from('priorities').select('*')
    ]);
    if (staffRes.data) {
      setStaffCatalog(staffRes.data.map((s: any) => ({
        ...s,
        internal_role: s.internal_roles?.name || 'Colaborador',
        specialty: s.specialties?.name || 'Sin área'
      })));
    }
    if (priosRes.data) setPrioritiesCatalog(priosRes.data);
  };

  const fetchMyTasks = async () => {
    if (tasks.length === 0) setLoading(true);
    try {
      const activeUserId = user?.id || (await supabase.auth.getUser()).data.user?.id;
      if (!activeUserId) return;

      const { data, error } = await supabase
        .from('request_tasks')
        .select(`
          *,
          task_assignees!inner(
            id,
            profile_id,
            status,
            deliverable_url,
            delivery_notes,
            due_date,
            completed_at,
            assigned_items,
            assigner:profiles!assigned_by(full_name, avatar_url)
          ),
          task_adjustments ( id, description, origin, is_internal, status ),
          requests (
            *,
            priorities ( level, color_code ),
            organizations ( id, name, logo_url, banner_url ),
            request_categories ( name ),
            projects ( name ),
            request_files ( id, storage_path, file_type )
          )
        `)
        .eq('task_assignees.profile_id', activeUserId) 
        .order('created_at', { ascending: false });

      if (error) throw error;

      const clientsMap = new Map();
      const uniqueTasksMap = new Map();

      (data || []).forEach(t => {
        const uniqueKey = String(t.id);
        if (uniqueTasksMap.has(uniqueKey)) return;

        const reqDataRaw = Array.isArray(t.requests) ? t.requests[0] : t.requests;
        if (reqDataRaw?.is_active === false) return;

        const priority = Array.isArray(t.requests?.priorities) ? t.requests?.priorities[0] : t.requests?.priorities;
        const orgData = Array.isArray(t.requests?.organizations) ? t.requests?.organizations[0] : t.requests?.organizations;
        const files = t.requests?.request_files || [];
        
        const assignerList = Array.isArray(t.task_assignees) ? t.task_assignees : [t.task_assignees];
        const myAssignment = assignerList.find((a: any) => a.profile_id === activeUserId) || {};
        const assignerData = Array.isArray(myAssignment?.assigner) ? myAssignment?.assigner[0] : myAssignment?.assigner;

        const assignerName = assignerData?.full_name || 'Sistema Tolko';
        const assignerAvatar = assignerData?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(assignerName)}&background=1E1E24&color=D3002D`;

        if (orgData && !clientsMap.has(orgData.id)) {
            clientsMap.set(orgData.id, { id: orgData.id, name: orgData.name, logo: orgData.logo_url });
        }

        const myStatus = myAssignment.status || 'pendiente';
        const myUrl = myAssignment.deliverable_url || '';
        const myNotes = myAssignment.delivery_notes || '';
        const myDueDate = myAssignment.due_date || t.requests?.due_date;
        const myAssignedItems = myAssignment.assigned_items || [];

        uniqueTasksMap.set(uniqueKey, {
          id: t.id,
          request_id: t.request_id,
          assignee_id: myAssignment.id,
          discipline: t.discipline,
          status: myStatus,
          quantity: t.quantity,
          projectName: t.requests?.title || 'Sin Título',
          clientName: orgData?.name || 'Desconocido',
          clientLogo: orgData?.logo_url || null,
          clientId: orgData?.id,
          dueDate: myDueDate,
          description: t.requests?.description,
          external_resource_url: t.requests?.external_resource_url || null, 
          files: files, 
          priorityLevel: priority?.level || 'Media',
          priorityColor: priority?.color_code || '#6b7280',
          deliverable_url: myUrl,
          delivery_notes: myNotes,
          coordinator_notes: t.coordinator_notes,
          adjustments: t.task_adjustments || [],
          assignerName: assignerName,
          assignerAvatar: assignerAvatar,
          assignedItems: myAssignedItems,
          fullRequest: t.requests
        });
      });

      setUniqueClients(Array.from(clientsMap.values()));
      setTasks(Array.from(uniqueTasksMap.values()));

    } catch (error) {
      console.error("Error al cargar la mesa de trabajo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTaskModal = (task: any) => {
    setSelectedTask(task);
    setSelectedRequest(task.fullRequest);
  };

  const checkIsUrgent = (task: any) => {
    if (!task.dueDate) return false;
    const isDone = ['entregado', 'aprobado_interno', 'en_revision_cliente', 'aprobado'].includes(task.status);
    if (isDone) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(task.dueDate);
    targetDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 1;
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;

    const task = tasks.find(t => String(t.id) === taskId);
    if (!task) return;

    if (targetStatus === 'entregado') {
      if (task.status === 'pendiente') {
        const isDarkTheme = document.documentElement.classList.contains('dark');
        Swal.fire({ 
          title: '¡A trabajar primero!', 
          text: 'Para poder entregar la tarea, debes pasarla a la columna de "En Proceso" primero.', 
          icon: 'warning', 
          background: isDarkTheme ? '#0F0F12' : '#fff', 
          color: isDarkTheme ? '#fff' : '#1f2937', 
          confirmButtonColor: '#D3002D' 
        });
        return;
      }
      handleOpenTaskModal(task);
      return;
    }

    if (task.status === targetStatus) return;

    setTasks(prev => prev.map(t => String(t.id) === taskId ? { ...t, status: targetStatus } : t));

    try {
      const activeUserId = user?.id || (await supabase.auth.getUser()).data.user?.id;
      if (!activeUserId) return;
      
      const { error } = await supabase
        .from('task_assignees')
        .update({ status: targetStatus })
        .eq('task_id', taskId)
        .eq('profile_id', activeUserId);
        
      if (error) throw error;
    } catch (err) {
      console.error("Error al mover tarea:", err);
      fetchMyTasks(); 
    }
  };

  const getCardStyle = (status: string) => {
    if (status === 'con_correcciones') return 'bg-amber-50/60 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30 hover:border-amber-400';
    if (status === 'pendiente') return 'bg-blue-50/60 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30 hover:border-blue-400';
    if (status === 'en_proceso') return 'bg-purple-50/60 dark:bg-purple-900/10 border-purple-200 dark:border-purple-900/30 hover:border-purple-400';
    if (['entregado', 'aprobado_interno', 'en_revision_cliente', 'aprobado'].includes(status)) return 'bg-cyan-50/60 dark:bg-cyan-900/10 border-cyan-200 dark:border-cyan-900/30 hover:border-cyan-400 opacity-80 hover:opacity-100';
    return 'bg-white dark:bg-[#141419] border-gray-200 dark:border-white/[0.05]';
  };

  const getUrgencyIndicator = (dueDate: string | null) => {
    if (!dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dueDate);
    targetDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-pulse rounded-l-2xl" title="Tarea Vencida"></div>;
    } else if (diffDays === 0) {
      return <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-red-500 rounded-l-2xl" title="Vence Hoy"></div>;
    } else if (diffDays <= 2) {
      return <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-amber-500 rounded-l-2xl" title="Vence Pronto"></div>;
    }
    return null;
  };

  const filteredTasks = tasks.filter(t => {
      const matchesSearch = t.projectName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.clientName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClient = clientFilter === 'todos' || t.clientId === clientFilter;
      return matchesSearch && matchesClient;
  });

  const colPendientes = filteredTasks.filter(t => ['pendiente', 'con_correcciones'].includes(t.status));
  const colEnProceso = filteredTasks.filter(t => t.status === 'en_proceso');
  const colEntregadas = filteredTasks.filter(t => ['entregado', 'aprobado_interno', 'en_revision_cliente', 'aprobado'].includes(t.status));

  const tasksNuevas = tasks.filter(t => t.status === 'pendiente');
  const tasksCorrecciones = tasks.filter(t => t.status === 'con_correcciones');
  const tasksVencer = tasks.filter(t => checkIsUrgent(t));
  const tasksEntregadas = tasks.filter(t => ['entregado', 'aprobado_interno', 'en_revision_cliente', 'aprobado'].includes(t.status));

  const getMetricList = () => {
    if (metricModalType === 'nuevas') return { title: 'Nuevas Asignaciones Pendientes', list: tasksNuevas, color: 'text-blue-500' };
    if (metricModalType === 'correcciones') return { title: 'Cola de Ajustes / Rebotados', list: tasksCorrecciones, color: 'text-amber-500' };
    if (metricModalType === 'vencer') return { title: '🚨 Próximos a Vencer (<= 24h)', list: tasksVencer, color: 'text-red-500' };
    if (metricModalType === 'entregadas') return { title: 'Entregadas / En Revisión', list: tasksEntregadas, color: 'text-green-500' };
    return { title: '', list: [], color: '' };
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-luxury-dark">
      <div className="text-center space-y-3">
        <Loader2 className="animate-spin text-luxury-red mx-auto" size={32} />
        <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-black">Sincronizando Tablero...</p>
      </div>
    </div>
  );

  const activeMetricData = getMetricList();

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full pb-32 animate-in fade-in duration-300 relative h-screen flex flex-col">
      
      <div className="pt-2 shrink-0 mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Mis <span className="text-luxury-red">Asignaciones</span></h1>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1 font-bold uppercase tracking-widest">Pipeline Kanban Operativo Personal</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Buscar tarea o cliente..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-[#141419] border border-gray-200 dark:border-zinc-800 rounded-xl py-2 pl-9 pr-3 text-xs text-gray-900 dark:text-white font-bold outline-none focus:border-luxury-red transition-all shadow-sm"
              />
            </div>
            <select
                value={clientFilter}
                onChange={e => setClientFilter(e.target.value)}
                className="w-full sm:w-48 bg-white dark:bg-[#141419] border border-gray-200 dark:border-zinc-800 rounded-xl p-2 text-xs text-gray-900 dark:text-white font-bold outline-none focus:border-luxury-red cursor-pointer shadow-sm uppercase truncate"
            >
                <option value="todos">Todos los Clientes</option>
                {uniqueClients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
        </div>
      </div>

      {/* 4 TARJETAS DE MÉTRICAS INTERACTIVAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 shrink-0">
        <div onClick={() => setMetricModalType('nuevas')} className="bg-white dark:bg-[#141419] border border-gray-200 dark:border-luxury-border hover:border-blue-500/50 p-5 rounded-2xl flex items-center gap-4 shadow-sm cursor-pointer transition-all hover:scale-[1.02] active:scale-95 group">
          <div className="bg-blue-50/80 text-blue-600 p-3 rounded-xl border border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <Clock size={20}/>
          </div>
          <div>
            <p className="text-[9px] uppercase font-black tracking-widest text-gray-400 group-hover:text-blue-500 transition-colors">Nuevas Asignaciones</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">{tasksNuevas.length}</p>
          </div>
        </div>

        <div onClick={() => setMetricModalType('correcciones')} className="bg-white dark:bg-[#141419] border border-gray-200 dark:border-luxury-border hover:border-amber-500/50 p-5 rounded-2xl flex items-center gap-4 shadow-sm cursor-pointer transition-all hover:scale-[1.02] active:scale-95 group">
          <div className="bg-amber-50/80 text-amber-600 p-3 rounded-xl border border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white transition-colors">
            <AlertCircle size={20}/>
          </div>
          <div>
            <p className="text-[9px] uppercase font-black tracking-widest text-gray-400 group-hover:text-amber-500 transition-colors">Cola de Ajustes</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">{tasksCorrecciones.length}</p>
          </div>
        </div>

        <div onClick={() => setMetricModalType('vencer')} className={`border p-5 rounded-2xl flex items-center gap-4 shadow-sm cursor-pointer transition-all hover:scale-[1.02] active:scale-95 group ${tasksVencer.length > 0 ? 'bg-red-50/60 dark:bg-red-950/20 border-red-300 dark:border-red-900/40 hover:border-red-500 animate-pulse' : 'bg-white dark:bg-[#141419] border-gray-200 dark:border-luxury-border hover:border-red-500/50'}`}>
          <div className={`p-3 rounded-xl border transition-colors ${tasksVencer.length > 0 ? 'bg-red-600 text-white border-red-700 shadow-md' : 'bg-red-50/80 text-red-600 border-red-100 dark:bg-red-500/10 dark:border-red-500/20 group-hover:bg-red-600 group-hover:text-white'}`}>
            <Flame size={20}/>
          </div>
          <div>
            <p className="text-[9px] uppercase font-black tracking-widest text-red-500 font-bold">Próximos a Vencer</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">{tasksVencer.length}</p>
          </div>
        </div>

        <div onClick={() => setMetricModalType('entregadas')} className="bg-white dark:bg-[#141419] border border-gray-200 dark:border-luxury-border hover:border-green-500/50 p-5 rounded-2xl flex items-center gap-4 shadow-sm cursor-pointer transition-all hover:scale-[1.02] active:scale-95 group">
          <div className="bg-green-50/80 text-green-600 p-3 rounded-xl border border-green-100 dark:bg-green-500/10 dark:border-green-500/20 group-hover:bg-green-600 group-hover:text-white transition-colors">
            <CheckCircle2 size={20}/>
          </div>
          <div>
            <p className="text-[9px] uppercase font-black tracking-widest text-gray-400 group-hover:text-green-500 transition-colors">Entregadas</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">{tasksEntregadas.length}</p>
          </div>
        </div>
      </div>

      {/* TABLERO KANBAN */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden pb-4">
        
        {/* COLUMNA 1: PENDIENTES */}
        <div className="flex flex-col bg-gray-50/50 dark:bg-[#0A0A0C] border border-gray-200/50 dark:border-white/5 rounded-3xl overflow-hidden" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'pendiente')}>
          <div className="p-5 flex items-center justify-between shrink-0 border-b border-gray-200 dark:border-white/5">
            <h2 className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Pendientes</h2>
            <span className="bg-white dark:bg-[#141419] text-gray-500 dark:text-gray-400 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">{colPendientes.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {colPendientes.map(task => (
              <div key={task.id} draggable onDragStart={(e) => handleDragStart(e, task.id)} onClick={() => handleOpenTaskModal(task)} className={`relative border p-4 rounded-2xl cursor-grab active:cursor-grabbing transition-all shadow-sm group overflow-hidden ${getCardStyle(task.status)}`}>
                {getUrgencyIndicator(task.dueDate)}
                <div className="flex justify-between items-start mb-2 pl-2">
                  <span className="text-[9px] bg-white/60 dark:bg-black/20 border border-gray-200/50 dark:border-white/10 text-gray-600 dark:text-gray-300 font-black uppercase px-2 py-0.5 rounded">{task.discipline}</span>
                  {task.clientLogo && <img src={task.clientLogo} alt="Logo" className="w-6 h-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity" />}
                </div>
                <div className="pl-2">
                  <h4 className="font-black text-gray-900 dark:text-white text-[13px] uppercase tracking-wide leading-tight mb-1">{task.projectName}</h4>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wider">{task.clientName}</p>

                  {task.assignedItems && task.assignedItems.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {task.assignedItems.map((item: any, idx: number) => (
                        <span key={idx} className="text-[8px] bg-luxury-red/10 text-luxury-red border border-luxury-red/20 font-black px-2 py-0.5 rounded-md uppercase flex items-center gap-1">
                          <Package size={9} />
                          {item.quantity && item.quantity > 1 ? `${item.quantity}x ` : ''}{item.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200/50 dark:border-white/5 flex items-center gap-2 pl-2">
                  <img src={task.assignerAvatar} className="w-5 h-5 rounded-full object-cover border border-gray-200 dark:border-zinc-800" alt="Avatar"/>
                  <span className="text-[8px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest truncate">De: {task.assignerName}</span>
                </div>
              </div>
            ))}
            {colPendientes.length === 0 && <div className="text-center p-8 text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest border border-dashed border-gray-300 dark:border-white/5 rounded-2xl">Arrastra tareas aquí</div>}
          </div>
        </div>

        {/* COLUMNA 2: EN PROCESO */}
        <div className="flex flex-col bg-gray-50/50 dark:bg-[#0A0A0C] border border-gray-200/50 dark:border-white/5 rounded-3xl overflow-hidden" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'en_proceso')}>
          <div className="p-5 flex items-center justify-between shrink-0 border-b border-gray-200 dark:border-white/5">
            <h2 className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div> En Proceso</h2>
            <span className="bg-white dark:bg-[#141419] text-gray-500 dark:text-gray-400 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">{colEnProceso.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {colEnProceso.map(task => (
              <div key={task.id} draggable onDragStart={(e) => handleDragStart(e, task.id)} onClick={() => handleOpenTaskModal(task)} className={`relative border p-4 rounded-2xl cursor-grab active:cursor-grabbing transition-all shadow-sm group overflow-hidden ${getCardStyle(task.status)}`}>
                {getUrgencyIndicator(task.dueDate)}
                <div className="flex justify-between items-start mb-2 pl-2">
                  <span className="text-[9px] bg-white/60 dark:bg-black/20 border border-gray-200/50 dark:border-white/10 text-gray-600 dark:text-gray-300 font-black uppercase px-2 py-0.5 rounded">{task.discipline}</span>
                  {task.clientLogo && <img src={task.clientLogo} alt="Logo" className="w-6 h-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity" />}
                </div>
                <div className="pl-2">
                  <h4 className="font-black text-gray-900 dark:text-white text-[13px] uppercase tracking-wide leading-tight mb-1">{task.projectName}</h4>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wider">{task.clientName}</p>

                  {task.assignedItems && task.assignedItems.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {task.assignedItems.map((item: any, idx: number) => (
                        <span key={idx} className="text-[8px] bg-luxury-red/10 text-luxury-red border border-luxury-red/20 font-black px-2 py-0.5 rounded-md uppercase flex items-center gap-1">
                          <Package size={9} />
                          {item.quantity && item.quantity > 1 ? `${item.quantity}x ` : ''}{item.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200/50 dark:border-white/5 flex items-center gap-2 pl-2">
                  <img src={task.assignerAvatar} className="w-5 h-5 rounded-full object-cover border border-gray-200 dark:border-zinc-800" alt="Avatar"/>
                  <span className="text-[8px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest truncate">De: {task.assignerName}</span>
                </div>
              </div>
            ))}
            {colEnProceso.length === 0 && <div className="text-center p-8 text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest border border-dashed border-gray-300 dark:border-white/5 rounded-2xl">Arrastra tareas aquí</div>}
          </div>
        </div>

        {/* COLUMNA 3: ENTREGADAS */}
        <div className="flex flex-col bg-gray-50/50 dark:bg-[#0A0A0C] border border-gray-200/50 dark:border-white/5 rounded-3xl overflow-hidden" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'entregado')}>
          <div className="p-5 flex items-center justify-between shrink-0 border-b border-gray-200 dark:border-white/5">
            <h2 className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-500"></div> Entregadas</h2>
            <span className="bg-white dark:bg-[#141419] text-gray-500 dark:text-gray-400 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">{colEntregadas.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {colEntregadas.map(task => (
              <div key={task.id} onClick={() => handleOpenTaskModal(task)} className={`relative border p-4 rounded-2xl cursor-pointer transition-all shadow-sm group overflow-hidden ${getCardStyle(task.status)}`}>
                <div className="flex justify-between items-start mb-2 pl-2">
                  <span className="text-[8px] bg-white/50 dark:bg-black/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200/50 dark:border-cyan-900/30 font-black uppercase px-2 py-0.5 rounded">{task.status.replace(/_/g,' ')}</span>
                  {task.clientLogo && <img src={task.clientLogo} alt="Logo" className="w-6 h-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity" />}
                </div>
                <div className="pl-2">
                  <h4 className="font-black text-gray-900 dark:text-white text-[13px] uppercase tracking-wide leading-tight mb-1 line-through decoration-cyan-300 dark:decoration-cyan-800">{task.projectName}</h4>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wider">{task.clientName}</p>

                  {task.assignedItems && task.assignedItems.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {task.assignedItems.map((item: any, idx: number) => (
                        <span key={idx} className="text-[8px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-black px-2 py-0.5 rounded-md uppercase flex items-center gap-1">
                          <Package size={9} />
                          {item.quantity && item.quantity > 1 ? `${item.quantity}x ` : ''}{item.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {colEntregadas.length === 0 && <div className="text-center p-8 text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest border border-dashed border-gray-300 dark:border-white/5 rounded-2xl">Suelta para Entregar</div>}
          </div>
        </div>

      </div>

      {/* MODAL DE DESGLOSE DE MÉTRICAS */}
      {metricModalType && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-luxury-border w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            
            <div className="p-5 bg-luxury-red flex justify-between items-center text-white shrink-0">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                {activeMetricData.title} ({activeMetricData.list.length})
              </h3>
              <button onClick={() => setMetricModalType(null)} className="hover:bg-black/20 p-1.5 rounded-lg transition-colors cursor-pointer"><X size={18}/></button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar space-y-3 flex-1 bg-gray-50/50 dark:bg-transparent">
              {activeMetricData.list.length === 0 ? (
                <div className="p-10 text-center text-xs font-black text-gray-400 uppercase tracking-widest border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">
                  Sin tareas en este filtro.
                </div>
              ) : (
                activeMetricData.list.map(t => (
                  <div 
                    key={t.id} 
                    onClick={() => {
                      setMetricModalType(null);
                      handleOpenTaskModal(t);
                    }}
                    className="bg-white dark:bg-[#141419] border border-gray-200 dark:border-zinc-800/80 p-4 rounded-xl hover:border-luxury-red/50 transition-all cursor-pointer shadow-sm group flex justify-between items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[8px] bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded font-black text-gray-600 dark:text-gray-300 uppercase">{t.discipline}</span>
                        <span className="text-[8px] font-black uppercase text-gray-400">{t.clientName}</span>
                      </div>
                      <h4 className="font-black text-xs uppercase text-gray-900 dark:text-white group-hover:text-luxury-red transition-colors">{t.projectName}</h4>
                      
                      {t.assignedItems && t.assignedItems.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {t.assignedItems.map((item: any, idx: number) => (
                            <span key={idx} className="text-[8px] bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 font-bold px-1.5 py-0.5 rounded">
                              • {item.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {t.dueDate && (
                        <span className="text-[10px] font-black text-luxury-red flex items-center gap-1 bg-red-50 dark:bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-500/20">
                          <Calendar size={12}/> {new Date(t.dueDate).toLocaleDateString('es-MX')}
                        </span>
                      )}
                      <ExternalLink size={14} className="text-gray-400 group-hover:text-luxury-red transition-colors"/>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* MODAL DETALLE / EDICIÓN TICKET */}
      {selectedRequest && selectedTask && (
        <EditRequestModal 
          isOpen={!!selectedRequest}
          onClose={() => { 
            setSelectedRequest(null); 
            setSelectedTask(null); 
          }}
          request={selectedRequest}
          staffCatalog={staffCatalog}
          prioritiesCatalog={prioritiesCatalog}
          onRefresh={fetchMyTasks}
          isCollaboratorView={true}
          targetDiscipline={selectedTask.discipline}
        />
      )}
    </div>
  );
}
