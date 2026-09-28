import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter, Loader2, RefreshCw, Calendar, Layers, Hash, Download, BarChart3, CheckSquare, PackagePlus, ChevronLeft, ChevronRight, Eye, RotateCcw, Clock, ArrowUpDown, Trash2, ArchiveRestore, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';

import EditRequestModal from '../../components/admin/modals/EditRequestModal';

export default function CoordinatorHistory() {
  const { user, profile } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  
  // 🔥 NUEVO ESTADO: Pestañas de vista
  const [viewMode, setViewMode] = useState<'activas' | 'deshabilitadas'>('activas');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [clientFilter, setClientFilter] = useState('todos'); 
  const [sortBy, setSortBy] = useState('recientes'); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [staffCatalog, setStaffCatalog] = useState<any[]>([]);
  const [prioritiesCatalog, setPrioritiesCatalog] = useState<any[]>([]);
  const [specialtiesCatalog, setSpecialtiesCatalog] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (user?.id) {
      initHistoryPage();
    }
  }, [user]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, clientFilter, sortBy, viewMode]);

  const initHistoryPage = async () => {
    setLoading(true);
    await Promise.all([
      fetchCoordinatorRequests(),
      fetchCatalogs()
    ]);
    setLoading(false);
  };

  const fetchCatalogs = async () => {
    try {
      const [staffRes, prioritiesRes, specsRes] = await Promise.all([
        supabase.from('profiles').select('*, internal_roles(name), specialties(name)').eq('is_active', true),
        supabase.from('priorities').select('*').order('weight', { ascending: true }),
        supabase.from('specialties').select('id, name')
      ]);
      
      if (staffRes.data) {
        const formattedStaff = staffRes.data.map(s => ({
          ...s,
          internal_role: s.internal_roles?.name || s.internal_role || 'Colaborador',
          specialty: s.specialties?.name || s.specialty || 'General'
        }));
        setStaffCatalog(formattedStaff);
      }
      if (prioritiesRes.data) setPrioritiesCatalog(prioritiesRes.data);
      if (specsRes.data) setSpecialtiesCatalog(specsRes.data);
    } catch (err) {
      console.error('Error cargando catálogos de soporte:', err);
    }
  };

  const fetchCoordinatorRequests = async () => {
    try {
      const { data: myAssignedOrgs } = await supabase
        .from('organization_distribution_lists')
        .select('organization_id')
        .eq('profile_id', user!.id);

      const orgIds = myAssignedOrgs?.map(item => item.organization_id) || [];

      if (orgIds.length === 0) {
        setRequests([]);
        setClients([]);
        return;
      }

      const { data: orgs } = await supabase
        .from('organizations')
        .select('id, name, logo_url, banner_url')
        .in('id', orgIds)
        .order('name');
      
      if (orgs) setClients(orgs);

      // 🔥 LE QUITAMOS EL FILTRO DE IS_ACTIVE DESDE SQL PARA TRAER TODO Y FILTRARLO LOCALMENTE 🔥
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
          delivered_at,
          reopened_at,
          is_active, 
          cancellation_reason,
          organization_id,
          specialty_ids,
          organizations ( id, name ),
          priorities ( level, color_code ),
          request_categories ( name ),
          profiles ( full_name ),
          organization_deliverables ( name ),
          file_extensions:target_format_id(extension)
        `)
        .in('organization_id', orgIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setRequests(data);
    } catch (err) {
      console.error('Error cargando historial del coordinador:', err);
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
      Swal.fire('Error', 'No se pudo mapear el detalle de este requerimiento.', 'error');
    }
  };

  const handleRevertDelivery = async (reqId: string) => {
    const isDarkTheme = document.documentElement.classList.contains('dark');
    const result = await Swal.fire({
      title: '¿Deshacer Entrega y Reabrir?',
      text: 'El ticket regresará a estado "En Proceso" y se registrará la fecha de reapertura.',
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

      Swal.fire({ title: '¡Ticket Reabierto!', text: 'La solicitud se encuentra nuevamente activa en el pipeline.', icon: 'success', confirmButtonColor: '#D3002D' });
      fetchCoordinatorRequests();
    } catch (err: any) {
      Swal.fire('Error de Reversión', err.message, 'error');
      setLoading(false);
    }
  };

  // 🔥 NUEVA FUNCIÓN PARA DESHABILITAR (SOFT DELETE) DESDE LA TABLA 🔥
  const handleDisableRequest = async (reqId: string) => {
    const isDarkTheme = document.documentElement.classList.contains('dark');
    
    const { value: reason } = await Swal.fire({
      title: 'Deshabilitar Solicitud',
      text: 'La solicitud pasará a la pestaña de "Deshabilitadas". ¿Cuál es el motivo?',
      input: 'textarea',
      inputPlaceholder: 'Ej. Proyecto pausado, error de creación...',
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
        fetchCoordinatorRequests();
      } catch (err: any) {
        Swal.fire('Error', err.message, 'error');
        setLoading(false);
      }
    }
  };

  // 🔥 NUEVA FUNCIÓN PARA RESTAURAR SOLICITUDES 🔥
  const handleRestoreRequest = async (reqId: string) => {
    const isDarkTheme = document.documentElement.classList.contains('dark');
    const result = await Swal.fire({
      title: '¿Restaurar Solicitud?',
      text: 'Volverá a aparecer en la pestaña de "Activas".',
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
        fetchCoordinatorRequests();
      } catch (err: any) {
        Swal.fire('Error', err.message, 'error');
        setLoading(false);
      }
    }
  };

  // 🔥 NUEVA FUNCIÓN PARA BORRADO PERMANENTE 🔥
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
        fetchCoordinatorRequests();
      } catch (err: any) {
        Swal.fire('Error', err.message, 'error');
        setLoading(false);
      }
    }
  };

  // 🔥 FILTROS PRINCIPALES (Incluye las Pestañas Activas / Deshabilitadas) 🔥
  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.title?.toLowerCase().includes(search.toLowerCase()) ||
      req.organizations?.name?.toLowerCase().includes(search.toLowerCase()) ||
      req.department?.toLowerCase().includes(search.toLowerCase()) ||
      req.profiles?.full_name?.toLowerCase().includes(search.toLowerCase());

    let matchesStatus = true;
    if (statusFilter !== 'todos') {
      if (statusFilter === 'completado') {
        matchesStatus = ['completado', 'aprobado', 'entregado'].includes(req.status);
      } else {
        matchesStatus = req.status === statusFilter;
      }
    }

    const matchesClient = clientFilter === 'todos' || req.organization_id === clientFilter;
    const matchesActive = viewMode === 'activas' ? req.is_active !== false : req.is_active === false;

    return matchesSearch && matchesStatus && matchesClient && matchesActive;
  }).sort((a, b) => {
    if (sortBy === 'urgentes') {
      if (!a.due_date) return 1; if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // MÉTRICAS (Basadas solo en las activas de todo el arreglo para no perder datos si cambias de pestaña)
  const activeRequestsTotal = requests.filter(r => r.is_active !== false);
  const totalTickets = activeRequestsTotal.length;
  const completedTickets = activeRequestsTotal.filter(r => ['completado', 'aprobado', 'entregado'].includes(r.status)).length;
  const efficiencyRate = totalTickets > 0 ? Math.round((completedTickets / totalTickets) * 100) : 0;
  const totalPiecesProd = activeRequestsTotal
    .filter(r => ['completado', 'aprobado', 'entregado'].includes(r.status))
    .reduce((acc, r) => acc + (r.quantity || 0), 0);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const selectedClientData = clients.find(c => c.id === clientFilter);

  const formatFecha = (dateStr: string) => {
    if (!dateStr) return 'Pendiente';
    return new Date(dateStr).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleExportCSV = () => {
    if (filteredRequests.length === 0) {
      Swal.fire({ title: 'Sin datos', text: 'No hay registros para exportar.', icon: 'info', confirmButtonColor: '#D3002D' });
      return;
    }

    const headers = ['ID', 'Proyecto', 'Cliente', 'Solicitante', 'Departamento', 'Categoria', 'Formato', 'Especialidades', 'Cantidad', 'Fecha Límite', 'Fecha Entrega', 'Estado', 'Activa', 'Motivo Cancelación'];
    const rows = filteredRequests.map(req => {
      const deliverableName = req.organization_deliverables?.name || req.request_categories?.name || 'Otros';

      let reqSpecialties = 'N/A';
      if (req.specialty_ids && req.specialty_ids.length > 0) {
        reqSpecialties = specialtiesCatalog
          .filter(s => req.specialty_ids.includes(s.id))
          .map(s => s.name)
          .join(', ');
      } else {
        const specs = [];
        if (req.needs_design) specs.push('Diseño');
        if (req.needs_copy) specs.push('Copy');
        if (req.needs_av) specs.push('Audiovisual');
        if (req.needs_dev) specs.push('Programación');
        if (req.needs_prod) specs.push('Producción');
        if (req.needs_staff) specs.push('Staff');
        if (req.needs_rp) specs.push('RP');
        reqSpecialties = specs.length > 0 ? specs.join(', ') : 'N/A';
      }

      return [
        `"${req.id.slice(-6)}"`,
        `"${(req.title || '').replace(/"/g, '""')}"`,
        `"${(req.organizations?.name || 'N/A').replace(/"/g, '""')}"`,
        `"${(req.profiles?.full_name || 'Desconocido').replace(/"/g, '""')}"`,
        `"${(req.department || 'General').replace(/"/g, '""')}"`,
        `"${deliverableName.replace(/"/g, '""')}"`,
        `"${(req.file_extensions?.extension || 'N/A').replace(/"/g, '""')}"`,
        `"${reqSpecialties.replace(/"/g, '""')}"`,
        req.quantity || 0,
        req.due_date || 'Sin fecha',
        req.delivered_at ? new Date(req.delivered_at).toLocaleDateString('es-MX') : 'Pendiente',
        `"${req.status}"`,
        `"${req.is_active ? 'Sí' : 'No'}"`,
        `"${(req.cancellation_reason || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Historial_Célula_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans p-4 md:p-10 w-full max-w-full flex-1 transition-colors min-w-0 overflow-x-hidden">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 dark:border-luxury-border pb-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase truncate">
            Historial <span className="text-luxury-red">Operativo</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 font-bold flex items-center gap-2 uppercase tracking-wider">
            <ShieldCheck size={14} className="text-luxury-red shrink-0" />
            Célula Operativa: <span className="text-luxury-red font-black">{profile?.specialties?.name || profile?.specialty || 'General'}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 self-end md:self-auto">
          <button onClick={handleExportCSV} className="flex items-center gap-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer uppercase tracking-wider">
            <Download size={14} /> Exportar CSV
          </button>
          <button onClick={initHistoryPage} className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all border border-gray-200 dark:border-luxury-border px-3 py-2.5 rounded-xl bg-white dark:bg-luxury-card/40 shadow-sm cursor-pointer">
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Recargar
          </button>
        </div>
      </div>

      {clientFilter !== 'todos' && selectedClientData && (
        <div 
          className="w-full min-h-[12rem] rounded-3xl overflow-hidden relative shadow-md flex flex-col justify-end p-6 md:p-8 border border-gray-200/50 dark:border-white/10 transition-all duration-500 mb-2"
          style={{
            backgroundImage: selectedClientData.banner_url 
              ? `linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%), url(${selectedClientData.banner_url})` 
              : 'linear-gradient(to right, #0F0F12, #1f1f2e)',
            backgroundSize: 'cover', backgroundPosition: 'center'
          }}
        >
          {selectedClientData.logo_url && (
            <img src={selectedClientData.logo_url} alt="Logo" className="absolute top-6 right-6 w-20 h-20 object-contain opacity-80 mix-blend-screen drop-shadow-2xl" />
          )}
          
          <div className="relative z-10 w-full">
            <p className="text-[10px] text-white/70 uppercase tracking-[0.3em] font-bold mb-1 flex items-center gap-2">
              Auditoría y Entregas
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase drop-shadow-lg truncate">
              {selectedClientData.name}
            </h2>
          </div>
        </div>
      )}

      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border shadow-sm rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Volumen de Célula (Activas)</p>
            <h3 className="text-lg font-black text-gray-900 dark:text-white mt-1">{totalTickets} Solicitudes</h3>
          </div>
          <div className="p-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"><BarChart3 size={20}/></div>
        </div>
        <div className="p-4 bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border shadow-sm rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Eficiencia de Cierre</p>
            <h3 className="text-lg font-black text-green-600 dark:text-green-400 mt-1">{efficiencyRate}% Efectividad</h3>
          </div>
          <div className="p-3 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-500"><CheckSquare size={20}/></div>
        </div>
        <div className="p-4 bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border shadow-sm rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Producción Completada</p>
            <h3 className="text-lg font-black text-blue-600 dark:text-blue-400 mt-1">{totalPiecesProd} Piezas</h3>
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

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={14} />
          <input 
            type="text" 
            placeholder="Buscar por proyecto, solicitante..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border rounded-xl py-3.5 pl-9 pr-3 text-xs text-gray-900 dark:text-white focus:border-luxury-red outline-none transition-all font-bold"
          />
        </div>

        <select 
          value={clientFilter}
          onChange={e => setClientFilter(e.target.value)}
          className="w-full bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border rounded-xl py-3.5 px-4 text-xs text-gray-700 dark:text-white focus:border-luxury-red outline-none appearance-none font-black cursor-pointer uppercase truncate"
        >
          <option value="todos">Todas las Marcas</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={14} />
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border rounded-xl py-3.5 pl-9 pr-4 text-xs text-gray-700 dark:text-white focus:border-luxury-red outline-none appearance-none font-black cursor-pointer uppercase"
          >
            <option value="todos">Todos los Estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="en_proceso">En Proceso</option>
            <option value="completado">Completados / Aprobados</option>
          </select>
        </div>

        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={14} />
          <select 
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="w-full bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border rounded-xl py-3.5 pl-9 pr-4 text-xs text-gray-700 dark:text-white focus:border-luxury-red outline-none appearance-none font-black cursor-pointer uppercase"
          >
            <option value="recientes">Más Recientes</option>
            <option value="urgentes">Próximos a Vencer</option>
          </select>
        </div>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-20 flex items-center justify-center">
            <Loader2 className="animate-spin text-luxury-red" size={32} />
          </div>
        ) : filteredRequests.length > 0 ? (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/[0.06] bg-gray-50 dark:bg-black/20 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  <th className="p-4">Proyecto</th>
                  <th className="p-4">Marca / Solicitante</th>
                  <th className="p-4">Especificaciones</th>
                  <th className="p-4">Bloque de Tiempos</th>
                  <th className="p-4 text-center">Estado</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05] text-xs">
                {currentItems.map((req) => {
                  const deliverableName = req.organization_deliverables?.name || req.request_categories?.name || 'Otros';

                  return (
                    <tr key={req.id} className={`hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-colors group ${req.is_active === false ? 'opacity-70 bg-gray-50 dark:bg-black/40' : ''}`}>
                      <td className="p-4 max-w-xs">
                        <p className="font-black text-gray-900 dark:text-white group-hover:text-luxury-red transition-colors truncate uppercase">{req.title}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">ID: ...{req.id.slice(-6)}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-black text-gray-800 dark:text-gray-300 uppercase">{req.organizations?.name || 'Inexistente'}</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-0.5 uppercase tracking-wider">Por: {req.profiles?.full_name || 'Desconocido'}</p>
                      </td>
                      <td className="p-4 space-y-1">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded uppercase ${req.is_active === false ? 'bg-gray-200 text-gray-500 dark:bg-zinc-800' : 'text-luxury-red bg-luxury-red/10'}`}>
                          <Layers size={10}/> {deliverableName}
                        </span>
                        <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold">
                          <span className="flex items-center gap-0.5"><Hash size={10}/> FMT: {req.file_extensions?.extension || 'N/A'}</span>
                          <span>•</span>
                          <span>QTY: {req.quantity || 1}</span>
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wider select-none text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200">
                            <Calendar size={11} className={`${req.is_active === false ? 'text-gray-400' : 'text-luxury-red'} shrink-0`}/>
                            <span>Límite: <span className="font-black">{req.due_date ? new Date(req.due_date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : 'S/F'}</span></span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <CheckSquare size={11} className={req.delivered_at ? "text-green-500 shrink-0" : "text-gray-300 dark:text-zinc-700 shrink-0"}/>
                            <span>Entrega: <span className={req.delivered_at ? "font-black text-green-600 dark:text-green-400" : "font-medium text-gray-400"}>{formatFecha(req.delivered_at)}</span></span>
                          </div>
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
                          <span className={`inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                            ['completado', 'aprobado', 'entregado'].includes(req.status) ? 'bg-green-50 dark:bg-green-500/10 text-green-500 border border-green-500/20' :
                            req.status === 'en_proceso' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                            'bg-red-50 dark:bg-red-500/10 text-luxury-red border border-red-500/20'
                          }`}>
                            {req.status?.replace(/_/g, ' ')}
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            type="button"
                            onClick={() => handleOpenRequestDetails(req)}
                            className="p-2 bg-gray-100 dark:bg-black/40 hover:bg-luxury-red text-gray-600 dark:text-gray-400 hover:text-white rounded-xl border border-gray-200 dark:border-white/10 transition-all cursor-pointer shadow-sm"
                            title="Ver requerimiento"
                          >
                            <Eye size={14} />
                          </button>

                          {req.is_active !== false ? (
                            <>
                              {['completado', 'aprobado', 'entregado'].includes(req.status) && (
                                <button 
                                  type="button"
                                  onClick={() => handleRevertDelivery(req.id)}
                                  className="p-2 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-600 text-amber-600 dark:text-amber-400 hover:text-white rounded-xl border border-amber-200/50 dark:border-amber-500/20 transition-all cursor-pointer shadow-sm animate-in fade-in"
                                  title="Revertir Entrega / Reabrir"
                                >
                                  <RotateCcw size={14} />
                                </button>
                              )}
                              
                              <button 
                                type="button"
                                onClick={() => handleDisableRequest(req.id)}
                                className="p-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-600 text-red-500 dark:text-red-400 hover:text-white rounded-xl border border-red-200/50 dark:border-red-500/20 transition-all cursor-pointer shadow-sm"
                                title="Deshabilitar Solicitud"
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
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-xs">
            No se encontraron solicitudes con esos filtros
          </div>
        )}

        {!loading && filteredRequests.length > itemsPerPage && (
          <div className="p-4 bg-gray-50 dark:bg-black/20 border-t border-gray-200 dark:border-white/[0.06] flex justify-between items-center select-none">
            <p className="text-xxs font-black uppercase text-gray-400">
              Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredRequests.length)} de {filteredRequests.length}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-white/10 p-2 rounded-xl disabled:opacity-30 text-gray-700 dark:text-white cursor-pointer transition-all">
                <ChevronLeft size={14}/>
              </button>
              <span className="text-xxs font-black text-gray-500 dark:text-gray-400">{currentPage} / {totalPages}</span>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-white/10 p-2 rounded-xl disabled:opacity-30 text-gray-700 dark:text-white cursor-pointer transition-all">
                <ChevronRight size={14}/>
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <EditRequestModal 
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRequest(null);
          }}
          request={selectedRequest}
          staffCatalog={staffCatalog}
          prioritiesCatalog={prioritiesCatalog}
          onRefresh={initHistoryPage}
        />
      )}

    </div>
  );
}