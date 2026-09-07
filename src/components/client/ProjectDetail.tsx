import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, SlidersHorizontal, ArrowUpDown, FolderKanban } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ClientRequestCard from '../../components/client/ClientRequestCard';
import NewRequestModal from '../../components/client/NewRequestModal';

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('recientes');

  useEffect(() => {
    fetchProjectAndRequests();
  }, [projectId]);

  const fetchProjectAndRequests = async () => {
    setLoading(true);
    try {
      // 1. Jalamos los datos del proyecto
      const { data: projData, error: projError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      
      if (projError) throw projError;
      setProject(projData);

      // 2. Jalamos las solicitudes de ESTE proyecto
      const { data: reqData, error: reqError } = await supabase
        .from('requests')
        .select(`
          *,
          request_categories(name),
          priorities(level, color_code),
          request_tasks(*) 
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (reqError) throw reqError;
      setRequests(reqData || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesStatus = true;
    if (statusFilter === 'pendiente') matchesStatus = req.status === 'pendiente';
    if (statusFilter === 'en_proceso') matchesStatus = req.status === 'en_proceso';
    if (statusFilter === 'completado') matchesStatus = ['completado', 'entregado', 'aprobado'].includes(req.status);
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'urgentes') {
      if (!a.due_date) return 1; if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (loading || !project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-luxury-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-luxury-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-luxury-dark text-gray-900 dark:text-gray-200 pb-10 space-y-8 font-sans w-full max-w-full flex-1 transition-colors duration-300 min-w-0 overflow-x-hidden">
      
      {/* HEADER DEL PROYECTO CON BANNER (Igual que el dashboard pero con botón Atrás) */}
      <div className="px-4 sm:px-6 md:px-10 pt-6 md:pt-10 w-full">
        {project.banner_url ? (
          <div className="w-full min-h-[16rem] md:h-64 rounded-3xl overflow-hidden relative shadow-2xl flex flex-col justify-end p-6 md:p-10 group">
            <img src={project.banner_url} alt="Banner" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700" />
            <div className="absolute inset-0 mix-blend-multiply opacity-50 dark:opacity-70 transition-opacity duration-300" style={{ backgroundColor: 'var(--color-brand-secondary, rgba(0,0,0,0.8))' }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 w-full">
              <div className="w-full min-w-0 flex flex-col gap-2">
                {/* BOTÓN ATRÁS */}
                <button onClick={() => navigate('/client/projects')} className="text-white/70 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors w-fit">
                  <ArrowLeft size={16} /> Volver a Proyectos
                </button>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase drop-shadow-lg truncate">
                  {project.name}
                </h1>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-3 transition-all active:scale-95 cursor-pointer tracking-wider uppercase shrink-0">
                <Plus size={16} strokeWidth={3}/> Agregar Solicitud
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 w-full">
            <div className="w-full min-w-0 flex flex-col gap-3">
              <button onClick={() => navigate('/client/projects')} className="text-gray-500 hover:text-luxury-red dark:hover:text-luxury-red flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors w-fit">
                <ArrowLeft size={14} /> Volver a Proyectos
              </button>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase truncate">
                {project.name}
              </h1>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto justify-center bg-luxury-red hover:opacity-90 text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-3 transition-all shadow-lg shadow-luxury-red/20 active:scale-95 cursor-pointer tracking-wider uppercase shrink-0">
              <Plus size={16} strokeWidth={3}/> Agregar Solicitud
            </button>
          </div>
        )}
      </div>

      {/* PIPELINE DEL PROYECTO */}
      <div className="space-y-4 px-4 sm:px-6 md:px-10 w-full min-w-0">
        <div className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border shadow-sm dark:shadow-none transition-colors duration-300 rounded-2xl p-4 md:p-6 space-y-4 w-full">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 flex items-center gap-2 transition-colors duration-300">
            <SlidersHorizontal size={14} className="text-luxury-red shrink-0"/> Solicitudes en este Tablero
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 transition-colors duration-300" size={14} />
              <input type="text" placeholder="Buscar ticket..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl py-2.5 pl-9 pr-3 text-xs text-gray-900 dark:text-white outline-none transition-colors duration-300 focus:border-luxury-red/50" />
            </div>

            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl p-2.5 text-xs text-gray-600 dark:text-gray-400 font-bold outline-none transition-colors duration-300 cursor-pointer appearance-none truncate">
              <option value="todos">Todos los Estados</option>
              <option value="pendiente">Realizadas</option>
              <option value="en_proceso">En Progreso</option>
              <option value="completado">Finalizadas</option>
            </select>

            <div className="relative w-full">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 transition-colors duration-300" size={14} />
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl py-2.5 pl-9 pr-3 text-xs text-gray-600 dark:text-gray-400 font-black outline-none appearance-none transition-colors duration-300 cursor-pointer truncate">
                <option value="recientes">Más Recientes</option>
                <option value="urgentes">Próximos a Vencer</option>
              </select>
            </div>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-gray-300 dark:border-luxury-border/60 bg-white dark:bg-luxury-card rounded-3xl flex flex-col items-center justify-center gap-3 shadow-inner transition-colors duration-300 px-4">
            <FolderKanban className="text-gray-300 dark:text-luxury-border/40 animate-pulse" size={42} />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-black uppercase tracking-widest">Tablero Vacío</p>
              <p className="text-gray-400 dark:text-gray-600 text-xxs mt-1 font-medium max-w-xs mx-auto">No hay solicitudes en este proyecto aún.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 w-full min-w-0">
            {filteredRequests.map(req => (
              <ClientRequestCard key={req.id} req={req} onRefresh={fetchProjectAndRequests} />
            ))}
          </div>
        )}
      </div>

      <NewRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} organizationId={project.organization_id} />
    </div>
  );
}