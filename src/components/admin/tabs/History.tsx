import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { 
  Search, Filter, Loader2, Calendar, Layers, Hash, 
  BarChart3, CheckSquare, PackagePlus, ChevronLeft, 
  ChevronRight, Eye, RotateCcw, Trash2, ArchiveRestore,
  Building2, User
} from 'lucide-react';
import Swal from 'sweetalert2';

// 🔥 IMPORTAMOS EL MODAL MAESTRO ORQUESTADOR
import EditRequestModal from '../modals/EditRequestModal';

export default function HistoryPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 🔥 ESTADO: Pestañas de vista
  const [viewMode, setViewMode] = useState<'activas' | 'deshabilitadas'>('activas');

  // 🔥 ESTADOS DE BÚSQUEDA Y FILTROS AVANZADOS
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [filterClient, setFilterClient] = useState('todos');
  const [filterRequester, setFilterRequester] = useState('todos');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // 🔥 ESTADOS PARA EL CONTROL DEL MODAL MAESTRO Y SUS CATÁLOGOS
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [staffCatalog, setStaffCatalog] = useState<any[]>([]);
  const [prioritiesCatalog, setPrioritiesCatalog] = useState<any[]>([]);

  // Estados para la Paginación Inteligente
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    initHistoryPage();
  }, []);

  // Resetear a página 1 si cambian los filtros de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, filterClient, filterRequester, dateFrom, dateTo, viewMode]);

  const initHistoryPage = async () => {
    setLoading(true);
    await Promise.all([
      fetchAllRequests(),
      fetchCatalogs()
    ]);
    setLoading(false);
  };

  const fetchCatalogs = async () => {
    try {
      const [staffRes, prioritiesRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('is_active', true),
        supabase.from('priorities').select('*').order('weight', { ascending: true })
      ]);
      if (staffRes.data) setStaffCatalog(staffRes.data);
      if (prioritiesRes.data) setPrioritiesCatalog(prioritiesRes.data);
    } catch (err) {
      console.error('Error cargando catálogos de soporte:', err);
    }
  };

  const fetchAllRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          id,
          title,
          status,
          department,
          due_date,
          quantity,
          created_at,
          request_date,
          delivered_at,
          reopened_at,
          is_active,
          cancellation_reason,
          projects ( name ),
          organizations ( name ),
          priorities ( level, color_code ),
          request_categories ( name ),
          requester:profiles!requests_requester_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setRequests(data);
    } catch (err) {
      console.error('Error cargando historial:', err);
    }
  };

  const handleOpenRequestDetails = async (req: any) => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('id', req.id)
        .single();
      
      if (error) throw error;
      if (data) {
        setSelectedRequest(data);
        setIsModalOpen(true);
      }
    } catch (err: any) {
      Swal.fire('Error', 'No se pudo mapear el detalle de este requerimiento, pa.', 'error');
    }
  };

  const handleRevertDelivery = async (reqId: string) => {
    const isDarkTheme = document.documentElement.classList.contains('dark');
    const result = await Swal.fire({
      title: '¿Deshacer Entrega y Reabrir?',
      text: 'El ticket corporativo regresará a estado "En Proceso", sus subtareas volverán a evaluación interna y se registrará la fecha de reapertura.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4b5563',
      cancelButtonColor: '#D3002D',
      confirmButtonText: 'SÍ, REVERTIR Y REABRIR',
      background: isDarkTheme ? '#0F0F12' : '#fff',
      color: isDarkTheme ? '#fff' : '#1f2937'
    });

    if (!result.isConfirmed) return;
    setLoading(true);

    try {
      const { error: reqErr } = await supabase
        .from('requests')
        .update({ 
          status: 'en_proceso',
          reopened_at: new Date().toISOString()
        })
        .eq('id', reqId);
      if (reqErr) throw reqErr;

      const { error: tasksErr } = await supabase
        .from('request_tasks')
        .update({ status: 'aprobado_interno' })
        .eq('request_id', reqId)
        .eq('status', 'aprobado');
      if (tasksErr) throw tasksErr;

      Swal.fire({
        title: '¡Ticket Reabierto!',
        text: 'La solicitud se encuentra nuevamente activa en el pipeline operativo.',
        icon: 'success',
        confirmButtonColor: '#D3002D'
      });

      fetchAllRequests();
    } catch (err: any) {
      Swal.fire('Error de Reversión', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableRequest = async (reqId: string, title: string) => {
    const isDarkTheme = document.documentElement.classList.contains('dark');
    
    const { value: reason } = await Swal.fire({
      title: `Deshabilitar "${title}"`,
      text: 'La solicitud pasará a la pestaña de "Deshabilitadas". ¿Cuál es el motivo exacto?',
      input: 'textarea',
      inputPlaceholder: 'Ej. Proyecto pausado, solicitud duplicada...',
      showCancelButton: true,
      confirmButtonColor: '#D3002D',
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'DESHABILITAR',
      cancelButtonText: 'CANCELAR',
      background: isDarkTheme ? '#0F0F12' : '#fff',
      color: isDarkTheme ? '#fff' : '#1f2937',
      inputValidator: (value) => {
        if (!value || value.trim().length < 5) return '¡Debes escribir un motivo válido para la auditoría!';
      }
    });

    if (reason) {
      setLoading(true);
      try {
        const { error } = await supabase.from('requests').update({ is_active: false, cancellation_reason: reason.trim() }).eq('id', reqId);
        if (error) throw error;
        Swal.fire({ title: '¡Deshabilitada!', text: 'La solicitud fue movida a deshabilitadas.', icon: 'success', confirmButtonColor: '#D3002D' });
        fetchAllRequests();
      } catch (err: any) {
        Swal.fire('Error al deshabilitar', err.message, 'error');
        setLoading(false);
      }
    }
  };

  const handleRestoreRequest = async (reqId: string) => {
    const isDarkTheme = document.documentElement.classList.contains('dark');
    const result = await Swal.fire({
      title: '¿Restaurar Solicitud?',
      text: 'Volverá a aparecer en la pestaña de "Activas" en los pipelines.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'SÍ, RESTAURAR',
      cancelButtonText: 'CANCELAR',
      background: isDarkTheme ? '#0F0F12' : '#fff',
      color: isDarkTheme ? '#fff' : '#1f2937'
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const { error } = await supabase.from('requests').update({ is_active: true, cancellation_reason: null }).eq('id', reqId);
        if (error) throw error;
        Swal.fire({ title: '¡Restaurada!', text: 'La solicitud vuelve a estar activa.', icon: 'success', confirmButtonColor: '#D3002D' });
        fetchAllRequests();
      } catch (err: any) {
        Swal.fire('Error al restaurar', err.message, 'error');
        setLoading(false);
      }
    }
  };

  const handlePermanentDelete = async (reqId: string) => {
    const isDarkTheme = document.documentElement.classList.contains('dark');
    const result = await Swal.fire({
      title: '¿Borrado Permanente?',
      text: 'Esta acción NO se puede deshacer. Se borrará la solicitud, sus tareas y todos sus registros de la base de datos para siempre.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#D3002D',
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'SÍ, BORRAR DEFINITIVAMENTE',
      cancelButtonText: 'CANCELAR',
      background: isDarkTheme ? '#0F0F12' : '#fff',
      color: isDarkTheme ? '#fff' : '#1f2937'
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const { error } = await supabase.from('requests').delete().eq('id', reqId);
        if (error) throw error;
        Swal.fire({ title: '¡Eliminada!', text: 'La solicitud fue borrada permanentemente.', icon: 'success', confirmButtonColor: '#D3002D' });
        fetchAllRequests();
      } catch (err: any) {
        Swal.fire('Error al borrar', err.message, 'error');
        setLoading(false);
      }
    }
  };

  // 🔥 CONSTRUIMOS OPCIONES ÚNICAS DE LOS DATOS REALES 🔥
  const clientOptions = Array.from(new Set(requests.map(r => r.organizations?.name).filter(Boolean))).sort();
  
  // 🔥 MAPEAMOS LOS SOLICITANTES CON SU EMPRESA PARA EL DROPDOWN 🔥
  const requesterMap = new Map();
  requests.forEach(r => {
    if (r.requester?.full_name) {
      requesterMap.set(r.requester.full_name, r.organizations?.name || 'Sin Empresa');
    }
  });
  const requesterOptions = Array.from(requesterMap.entries())
    .map(([name, org]) => ({ name, org }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // 🔥 FILTRO MAESTRO 🔥
  const filteredRequests = requests.filter(req => {
    const matchesStatus = statusFilter === 'todos' || req.status === statusFilter;
    const matchesSearch = 
      req.title.toLowerCase().includes(search.toLowerCase()) ||
      req.projects?.name?.toLowerCase().includes(search.toLowerCase()) ||
      req.department?.toLowerCase().includes(search.toLowerCase());
    const matchesActive = viewMode === 'activas' ? req.is_active !== false : req.is_active === false;
    const matchesClient = filterClient === 'todos' || req.organizations?.name === filterClient;
    const matchesRequester = filterRequester === 'todos' || req.requester?.full_name === filterRequester;

    let matchesDate = true;
    if (dateFrom || dateTo) {
      const reqDateStr = req.request_date || req.created_at?.split('T')[0];
      if (reqDateStr) {
        if (dateFrom && reqDateStr < dateFrom) matchesDate = false;
        if (dateTo && reqDateStr > dateTo) matchesDate = false;
      } else {
        matchesDate = false; // No tiene fecha pero se está buscando por fecha
      }
    }

    return matchesStatus && matchesSearch && matchesActive && matchesClient && matchesRequester && matchesDate;
  });

  // Métricas en tiempo real (Solamente sobre las activas para no ensuciar datos)
  const activeRequestsTotal = requests.filter(r => r.is_active !== false);
  const totalTickets = activeRequestsTotal.length;
  const completedTickets = activeRequestsTotal.filter(r => r.status === 'completado').length;
  const efficiencyRate = totalTickets > 0 ? Math.round((completedTickets / totalTickets) * 100) : 0;

  const totalPiecesProd = activeRequestsTotal
    .filter(r => r.status === 'completado')
    .reduce((acc, r) => acc + (r.quantity || 0), 0);

  // Segmentación para paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  // Formateador de Fechas
  const formatFecha = (dateStr: string) => {
    if (!dateStr) return 'PENDIENTE';
    return new Date(dateStr).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 transition-colors duration-300 font-sans">
      
      {/* HEADER PRINCIPAL (Sin botones extra) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-luxury-border pb-4 transition-colors duration-300">
        <div>
          <h2 className="text-xl font-black tracking-widest text-gray-900 dark:text-white uppercase transition-colors duration-300">Historial General</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">Busca en tu historial de solicitudes; si utilizas los filtros, tienes una búsqueda más acertada.</p>
        </div>
      </div>

      {/* SECCIÓN DE MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border shadow-sm rounded-xl flex items-center justify-between transition-all duration-300">
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Volumen Filtrado (Activas)</p>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1 transition-colors">{totalTickets} Solicitudes</h3>
          </div>
          <div className="p-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"><BarChart3 size={20}/></div>
        </div>
        <div className="p-4 bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border shadow-sm rounded-xl flex items-center justify-between transition-all duration-300">
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Eficiencia de Cierre</p>
            <h3 className="text-xl font-black text-green-600 dark:text-green-400 mt-1 transition-colors">{efficiencyRate}% Efectividad</h3>
          </div>
          <div className="p-3 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-500"><CheckSquare size={20}/></div>
        </div>
        <div className="p-4 bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border shadow-sm rounded-xl flex items-center justify-between transition-all duration-300">
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Producción Entregada</p>
            <h3 className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1 transition-colors">{totalPiecesProd} Piezas</h3>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500"><PackagePlus size={20}/></div>
        </div>
      </div>

      {/* 🔥 TABS DE ACTIVAS VS DESHABILITADAS 🔥 */}
      <div className="flex items-center gap-4 border-b border-gray-200 dark:border-luxury-border pt-4">
        <button 
          onClick={() => setViewMode('activas')}
          className={`px-4 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all ${viewMode === 'activas' ? 'border-b-2 border-luxury-red text-luxury-red' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
        >
          Activas
        </button>
        <button 
          onClick={() => setViewMode('deshabilitadas')}
          className={`px-4 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all ${viewMode === 'deshabilitadas' ? 'border-b-2 border-gray-600 text-gray-800 dark:text-gray-200 dark:border-gray-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
        >
          Deshabilitadas (Papelera)
        </button>
      </div>

      {/* 🔥 FILTROS AVANZADOS 🔥 */}
      <div className="flex flex-col gap-4">
        {/* Fila 1: Búsqueda y Rango de Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-7 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors duration-300" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por proyecto, tablero o departamento..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-gray-900 dark:text-white focus:border-luxury-red dark:focus:border-luxury-red outline-none transition-colors duration-300 shadow-sm"
            />
          </div>
          
          <div className="md:col-span-5 flex items-center gap-2 bg-white dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl px-4 py-2.5 shadow-sm transition-colors duration-300">
            <Calendar size={16} className="text-luxury-red shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">DE:</span>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="bg-transparent text-xs font-black uppercase text-gray-700 dark:text-gray-300 outline-none w-full cursor-pointer" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">A:</span>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="bg-transparent text-xs font-black uppercase text-gray-700 dark:text-gray-300 outline-none w-full cursor-pointer" />
          </div>
        </div>

        {/* Fila 2: Menús desplegables (Cliente, Solicitante, Estado) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
            <select 
              value={filterClient} 
              onChange={e => setFilterClient(e.target.value)} 
              className="w-full bg-white dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-gray-700 dark:text-white outline-none cursor-pointer shadow-sm transition-colors duration-300 truncate"
            >
              <option value="todos">Cualquier Cuenta</option>
              {clientOptions.map(c => <option key={String(c)} value={String(c)}>{String(c)}</option>)}
            </select>
          </div>

          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
            <select 
              value={filterRequester} 
              onChange={e => setFilterRequester(e.target.value)} 
              className="w-full bg-white dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-gray-700 dark:text-white outline-none cursor-pointer shadow-sm transition-colors duration-300 truncate"
            >
              <option value="todos">Cualquier Solicitante</option>
              {/* 🔥 AQUÍ SE MAPEA EL NOMBRE Y LA EMPRESA 🔥 */}
              {requesterOptions.map(r => (
                <option key={r.name} value={r.name}>
                  {r.name} • {r.org}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full bg-white dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-gray-700 dark:text-white outline-none cursor-pointer shadow-sm transition-colors duration-300 truncate"
            >
              <option value="todos">Todos los Estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="en_proceso">En Proceso</option>
              <option value="completado">Completados</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLA MASTER */}
      <div className="bg-white dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-2xl overflow-hidden shadow-md dark:shadow-2xl transition-colors duration-300 mt-4">
        {loading ? (
          <div className="p-20 flex items-center justify-center">
            <Loader2 className="animate-spin text-luxury-red" size={32} />
          </div>
        ) : currentItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-luxury-border bg-gray-50 dark:bg-black/40 text-[10px] font-black uppercase tracking-widest text-gray-500 transition-colors duration-300">
                  <th className="p-4">Proyecto</th>
                  <th className="p-4">Cliente / Área</th>
                  <th className="p-4">Especificaciones</th>
                  <th className="p-4">Bloque de Tiempos</th>
                  <th className="p-4 text-center">Estado</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-luxury-border/40 text-sm transition-colors duration-300">
                {currentItems.map((req) => (
                  <tr key={req.id} className={`hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-colors duration-300 group ${req.is_active === false ? 'opacity-70 bg-gray-50 dark:bg-black/40' : ''}`}>
                    <td className="p-4 max-w-xs">
                      <p className="font-bold text-gray-900 dark:text-white group-hover:text-luxury-red dark:group-hover:text-luxury-red transition-colors duration-300 truncate">{req.title}</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium mt-0.5 transition-colors duration-300">ID: ...{req.id.slice(-8)}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-gray-800 dark:text-gray-300 transition-colors duration-300">{req.organizations?.name || 'Inexistente'}</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold mt-0.5 transition-colors duration-300">{req.department || 'General'}</p>
                    </td>

                    <td className="p-4 space-y-1">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md transition-colors duration-300 ${req.is_active === false ? 'bg-gray-200 text-gray-500 dark:bg-zinc-800' : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-white/5'}`}>
                        <Layers size={10}/> {req.request_categories?.name || 'Otros'}
                      </span>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500 font-medium transition-colors duration-300">
                        <span className="flex items-center gap-0.5"><Hash size={10}/> Qty: {req.quantity}</span>
                      </div>
                    </td>

                    {/* BLOQUE DE 3 FECHAS */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5 text-[10px] font-bold uppercase tracking-wider select-none text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200">
                          <Calendar size={12} className={`${req.is_active === false ? 'text-gray-400' : 'text-luxury-red'} shrink-0`}/>
                          <span>Límite: <span className="font-black">{req.due_date ? new Date(req.due_date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : 'S/F'}</span></span>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <CheckSquare size={12} className={req.delivered_at ? "text-green-500 shrink-0" : "text-gray-300 dark:text-zinc-600 shrink-0"}/>
                          <span>Entrega: <span className={req.delivered_at ? "font-black text-green-600 dark:text-green-400" : "font-medium text-gray-400"}>{req.delivered_at ? formatFecha(req.delivered_at) : 'PENDIENTE'}</span></span>
                        </div>

                        {req.reopened_at && (
                          <div className="flex items-center gap-1.5">
                            <RotateCcw size={12} className={req.reopened_at ? "text-amber-500 shrink-0" : "text-gray-300 dark:text-zinc-600 shrink-0"}/>
                            <span>Reapertura: <span className={req.reopened_at ? "font-black text-amber-600 dark:text-amber-400" : "font-medium text-gray-400"}>{req.reopened_at ? formatFecha(req.reopened_at) : 'N/A'}</span></span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      {req.is_active === false ? (
                         <div className="flex flex-col items-center gap-1.5">
                           <span className="inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-gray-200 dark:bg-zinc-800 text-gray-500 border border-gray-300 dark:border-zinc-700 shadow-inner">
                             CANCELADA
                           </span>
                           <span className="text-[9px] text-gray-500 max-w-[140px] truncate" title={req.cancellation_reason}>
                             {req.cancellation_reason || 'Sin motivo'}
                           </span>
                         </div>
                      ) : (
                        <>
                          <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-colors duration-300 ${
                            req.status === 'completado' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20' :
                            req.status === 'en_proceso' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20' :
                            'bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700'
                          }`}>
                            {req.status?.replace('_', ' ')}
                          </span>
                          
                          {req.priorities && (
                            <div className="mt-1.5">
                              <span 
                                className="text-[9px] font-black uppercase tracking-widest inline-block"
                                style={{ color: req.priorities?.color_code || '#71717a' }}
                              >
                                ⚡ {req.priorities?.level || 'Normal'}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Ver / Moderar detalle */}
                        <button 
                          type="button"
                          onClick={() => handleOpenRequestDetails(req)}
                          className="p-2 bg-gray-100 dark:bg-zinc-800/80 hover:bg-luxury-red dark:hover:bg-luxury-red text-gray-600 dark:text-zinc-400 hover:text-white dark:hover:text-white rounded-xl border border-gray-200/60 dark:border-zinc-800 transition-all cursor-pointer shadow-sm"
                          title="Inspeccionar requerimiento completo"
                        >
                          <Eye size={14} />
                        </button>

                        {req.is_active !== false ? (
                          <>
                            {/* Revertir entrega (Solo si está completado) */}
                            {req.status === 'completado' && (
                              <button 
                                type="button"
                                onClick={() => handleRevertDelivery(req.id)}
                                className="p-2 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-600 text-amber-600 dark:text-amber-400 hover:text-white rounded-xl border border-amber-200/50 dark:border-amber-500/20 transition-all cursor-pointer shadow-sm animate-in fade-in duration-200"
                                title="Revertir Entrega / Reabrir Ticket"
                              >
                                <RotateCcw size={14} />
                              </button>
                            )}

                            {/* 🗑️ 🔥 BOTÓN DE DESHABILITAR SOLICITUD (SOFT DELETE) */}
                            <button 
                              type="button"
                              onClick={() => handleDisableRequest(req.id, req.title)}
                              className="p-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-600 text-red-600 dark:text-red-400 hover:text-white rounded-xl border border-red-200/50 dark:border-red-500/20 transition-all cursor-pointer shadow-sm"
                              title="Deshabilitar solicitud (Papelera)"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        ) : (
                           <>
                             <button 
                                type="button"
                                onClick={() => handleRestoreRequest(req.id)}
                                className="p-2 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-600 text-emerald-600 dark:text-emerald-400 hover:text-white rounded-xl border border-emerald-200/50 dark:border-emerald-500/20 transition-all cursor-pointer shadow-sm"
                                title="Restaurar Solicitud"
                              >
                                <ArchiveRestore size={14} />
                            </button>
                            <button 
                                type="button"
                                onClick={() => handlePermanentDelete(req.id)}
                                className="p-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-600 text-red-500 dark:text-red-400 hover:text-white rounded-xl border border-red-200/50 dark:border-red-500/20 transition-all cursor-pointer shadow-sm"
                                title="Borrar Permanentemente"
                              >
                                <Trash2 size={14} />
                            </button>
                           </>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-xs transition-colors duration-300">
            No se encontraron solicitudes con esos filtros
          </div>
        )}

        {/* CONTROLES DE PAGINACIÓN */}
        {!loading && filteredRequests.length > itemsPerPage && (
          <div className="p-4 bg-gray-50 dark:bg-black/20 border-t border-gray-200 dark:border-luxury-border flex justify-between items-center transition-colors duration-300">
            <p className="text-xs font-bold text-gray-400">
              Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredRequests.length)} de {filteredRequests.length}
            </p>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
                className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-zinc-800 p-2 rounded-xl disabled:opacity-30 text-gray-700 dark:text-white transition-all cursor-pointer shadow-sm dark:shadow-none"
              >
                <ChevronLeft size={16}/>
              </button>
              <span className="text-xs font-black tracking-widest text-gray-500 dark:text-gray-400">
                {currentPage} / {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages}
                className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-zinc-800 p-2 rounded-xl disabled:opacity-30 text-gray-700 dark:text-white transition-all cursor-pointer shadow-sm dark:shadow-none"
              >
                <ChevronRight size={16}/>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RENDER DEL MODAL DINÁMICO CENTRALIZADO */}
      <EditRequestModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        staffCatalog={staffCatalog}
        prioritiesCatalog={prioritiesCatalog}
        onRefresh={fetchAllRequests}
      />

    </div>
  );
}