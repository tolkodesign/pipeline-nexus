import { useState, useEffect } from 'react';
import { 
  FileText, Search, SlidersHorizontal, ArrowUpDown, 
  FolderKanban, Layers, User, ChevronLeft, ChevronRight 
} from 'lucide-react'; 
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import ClientRequestCard from '../../components/client/ClientRequestCard';
import Swal from 'sweetalert2';

export default function ClientRequests() {
  const { user, profile } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]); 
  const [orgMembers, setOrgMembers] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [myOrganizationId, setMyOrganizationId] = useState<string | null>(null);

  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [priorityFilter, setPriorityFilter] = useState('todos');
  const [projectFilter, setProjectFilter] = useState('todos'); 
  const [requesterFilter, setRequesterFilter] = useState('todos'); 
  const [sortBy, setSortBy] = useState('recientes');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    if (user?.id) fetchClientOrganization();
  }, [user, profile]);

  useEffect(() => {
    if (myOrganizationId) {
      fetchData();
    } else if (profile?.internal_role) {
      setLoading(false);
    }
  }, [myOrganizationId, profile]);

  // RESET AUTOMÁTICO DE PÁGINA AL CAMBIAR FILTROS
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, priorityFilter, projectFilter, requesterFilter, sortBy]);

  const fetchClientOrganization = async () => {
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('profile_id', user!.id);

      if (error) throw error;
      if (!data || data.length === 0) {
        if (profile?.internal_role) { setMyOrganizationId(null); return; }
        throw new Error("Tu cuenta aún no está vinculada a ninguna empresa activa.");
      }
      setMyOrganizationId(data[0].organization_id);
    } catch (err: any) {
      console.error(err);
      Swal.fire({ title: 'Configuración', text: err.message, icon: 'warning', confirmButtonColor: 'var(--color-luxury-red)' });
      setLoading(false);
    }
  };

  const fetchData = async () => {
    if (!myOrganizationId) return;
    setLoading(true);
    try {
      // 1. Cargar Solicitudes
      const { data: reqs, error: reqsErr } = await supabase
        .from('requests')
        .select(`
          *,
          request_categories(name),
          priorities(level, color_code),
          request_tasks(*) 
        `)
        .eq('organization_id', myOrganizationId);

      if (reqsErr) throw reqsErr;
      setRequests(reqs || []);

      // 2. Cargar Proyectos / Tableros
      const { data: projs } = await supabase
        .from('projects')
        .select('id, name')
        .eq('organization_id', myOrganizationId)
        .order('name');
        
      setProjects(projs || []);

      // 3. Cargar Integrantes de la cuenta
      const { data: membersData, error: membersErr } = await supabase
        .from('organization_members')
        .select(`
          profile_id,
          profiles:profile_id ( id, full_name, email, avatar_url )
        `)
        .eq('organization_id', myOrganizationId);

      if (!membersErr && membersData) {
        const formattedMembers = membersData
          .map((m: any) => m.profiles)
          .filter((p: any) => p !== null);
        setOrgMembers(formattedMembers);
      }

    } catch (err) {
      console.error("Error cargando solicitudes globales e integrantes:", err);
    } finally {
      setLoading(false);
    }
  };

  // LÓGICA DE FILTRADO
  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'todos') {
      matchesStatus = true;
    } else if (statusFilter === 'pendiente') {
      matchesStatus = req.status === 'pendiente';
    } else if (statusFilter === 'en_proceso') {
      matchesStatus = req.status === 'en_proceso' || req.status === 'en_revision_cliente';
    } else if (statusFilter === 'completado') {
      matchesStatus = ['completado', 'entregado', 'aprobado'].includes(req.status);
    }

    const matchesPriority = priorityFilter === 'todos' || req.priorities?.level === priorityFilter;
    const matchesProject = projectFilter === 'todos' || req.project_id === projectFilter;
    const matchesRequester = requesterFilter === 'todos' || req.requester_id === requesterFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesProject && matchesRequester;
  }).sort((a, b) => {
    if (sortBy === 'urgentes') {
      if (!a.due_date) return 1; if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // LÓGICA DE PAGINACIÓN
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

  if (loading && !myOrganizationId && !profile?.internal_role) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-luxury-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-luxury-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-luxury-dark text-gray-900 dark:text-gray-200 pb-10 space-y-8 font-sans w-full max-w-full flex-1 transition-colors duration-300 min-w-0 overflow-x-hidden">
      
      {/* HEADER */}
      <div className="px-6 md:px-10 pt-10 w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div className="w-full min-w-0">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase truncate">
            Historial <span style={{ color: 'var(--color-luxury-red)' }}>Global</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium truncate">
            Monitorea y filtra todas las solicitudes de tu organización.
          </p>
        </div>
      </div>

      {/* SECCIÓN DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-10 w-full">
        <div className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border p-6 rounded-3xl flex items-center gap-4 shadow-sm dark:shadow-none transition-colors w-full min-w-0">
          <div className="bg-red-50 dark:bg-white/5 p-4 rounded-2xl text-luxury-red shrink-0">
            <FileText size={26} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 truncate">Solicitudes Registradas</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white mt-0.5 truncate">
              {requests.length} <span className="text-xs text-gray-400 font-medium normal-case tracking-normal">en total</span>
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border p-6 rounded-3xl flex items-center gap-4 shadow-sm dark:shadow-none transition-colors w-full min-w-0">
          <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl text-gray-400 shrink-0">
            <Layers size={26} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 truncate">Resultados Filtrados</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white mt-0.5 truncate">
              {filteredRequests.length} <span className="text-xs text-gray-400 font-medium normal-case tracking-normal">coincidencias</span>
            </p>
          </div>
        </div>
      </div>

      {/* CONSOLA DE FILTROS AVANZADOS */}
      <div className="space-y-4 px-6 md:px-10 w-full min-w-0">
        <div className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border shadow-sm dark:shadow-none transition-colors duration-300 rounded-2xl p-4 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 flex items-center gap-2 transition-colors duration-300">
            <SlidersHorizontal size={14} className="text-luxury-red"/> Consola de Búsqueda Avanzada
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {/* 1. BUSCADOR */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600" size={14} />
              <input type="text" placeholder="Buscar solicitud..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-gray-50 dark:bg-[#0a0a0c] border border-gray-200 dark:border-luxury-border rounded-xl py-2.5 pl-9 pr-3 text-xs text-gray-900 dark:text-white outline-none focus:border-luxury-red/50 transition-colors" />
            </div>

            {/* 2. DROPDOWN DE PERSONAS / SOLICITANTES */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600" size={14} />
              <select 
                value={requesterFilter} 
                onChange={e => setRequesterFilter(e.target.value)} 
                className="w-full bg-gray-50 dark:bg-[#0a0a0c] border border-gray-200 dark:border-luxury-border rounded-xl py-2.5 pl-9 pr-3 text-xs text-gray-600 dark:text-gray-400 font-bold outline-none cursor-pointer appearance-none truncate"
              >
                <option value="todos">Todos los Solicitantes</option>
                {orgMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.full_name || member.email}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. ESTADOS */}
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-gray-50 dark:bg-[#0a0a0c] border border-gray-200 dark:border-luxury-border rounded-xl p-2.5 text-xs text-gray-600 dark:text-gray-400 font-bold outline-none cursor-pointer appearance-none truncate">
              <option value="todos">Todos los Estados</option>
              <option value="pendiente">Recién Solicitadas</option>
              <option value="en_proceso">En Progreso / Revisión</option>
              <option value="completado">Finalizadas / Completadas</option>
            </select>

            {/* 4. PRIORIDADES */}
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="bg-gray-50 dark:bg-[#0a0a0c] border border-gray-200 dark:border-luxury-border rounded-xl p-2.5 text-xs text-gray-600 dark:text-gray-400 font-bold outline-none cursor-pointer appearance-none truncate">
              <option value="todos">Todas las Prioridades</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>

            {/* 5. TABLEROS */}
            <select value={projectFilter} onChange={e => setProjectFilter(e.target.value)} className="bg-gray-50 dark:bg-[#0a0a0c] border border-gray-200 dark:border-luxury-border rounded-xl p-2.5 text-xs text-gray-600 dark:text-gray-400 font-bold outline-none cursor-pointer appearance-none truncate">
              <option value="todos">Todos los Tableros</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>

            {/* 6. ORDEN */}
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600" size={14} />
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full bg-gray-50 dark:bg-[#0a0a0c] border border-gray-200 dark:border-luxury-border rounded-xl py-2.5 pl-9 pr-3 text-xs text-gray-600 dark:text-gray-400 font-black outline-none appearance-none transition-colors cursor-pointer truncate">
                <option value="recientes">Más Recientes</option>
                <option value="urgentes">Próximos a Vencer</option>
              </select>
            </div>
          </div>
        </div>

        {/* LISTADO DE TARJETAS PAGINADAS */}
        {filteredRequests.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-gray-300 dark:border-luxury-border/60 bg-white dark:bg-luxury-card rounded-3xl flex flex-col items-center justify-center gap-3 shadow-inner px-4">
            <FolderKanban className="text-gray-300 dark:text-luxury-border/40 animate-pulse" size={42} />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-black uppercase tracking-widest">No hay registros globales</p>
              <p className="text-gray-400 dark:text-gray-600 text-xxs mt-1 font-medium max-w-xs mx-auto">Las solicitudes que coincidan con tus filtros aparecerán enlistadas en este bloque.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 w-full min-w-0">
            {paginatedRequests.map(req => (
              <ClientRequestCard key={req.id} req={req} onRefresh={fetchData} />
            ))}
          </div>
        )}

        {/* CONTROLES DE PAGINACIÓN */}
        {filteredRequests.length > 0 && (
          <div className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
            
            {/* Indicador de Registros */}
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Mostrando <span className="font-bold text-gray-900 dark:text-white">{startIndex + 1}</span> a <span className="font-bold text-gray-900 dark:text-white">{Math.min(endIndex, filteredRequests.length)}</span> de <span className="font-bold text-gray-900 dark:text-white">{filteredRequests.length}</span> solicitudes
            </div>

            <div className="flex items-center gap-3">
              {/* Selector de items por página */}
              <div className="flex items-center gap-2 mr-2">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Mostrar:</span>
                <select 
                  value={itemsPerPage} 
                  onChange={e => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-gray-50 dark:bg-[#0a0a0c] border border-gray-200 dark:border-luxury-border rounded-lg px-2 py-1 text-xs font-bold text-gray-700 dark:text-gray-200 outline-none cursor-pointer"
                >
                  <option value={6}>6</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              {/* Botón Anterior */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 bg-gray-50 dark:bg-[#0a0a0c] border border-gray-200 dark:border-luxury-border rounded-xl text-gray-600 dark:text-gray-300 hover:text-luxury-red disabled:opacity-30 disabled:hover:text-gray-600 transition-all cursor-pointer disabled:cursor-not-allowed"
                title="Página Anterior"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Contador de Páginas */}
              <span className="text-xs font-black px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-lg text-gray-800 dark:text-gray-200">
                {currentPage} / {totalPages}
              </span>

              {/* Botón Siguiente */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 bg-gray-50 dark:bg-[#0a0a0c] border border-gray-200 dark:border-luxury-border rounded-xl text-gray-600 dark:text-gray-300 hover:text-luxury-red disabled:opacity-30 disabled:hover:text-gray-600 transition-all cursor-pointer disabled:cursor-not-allowed"
                title="Página Siguiente"
              >
                <ChevronRight size={16} />
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}