import { useState, useEffect } from 'react';
import { FolderKanban, Search, Clock, CheckCircle2, Activity, Plus, Pencil, HelpCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import NewProjectModal from './NewProjectModal';
import EditProjectModal from './EditProjectModal'; 
import ProjectsTour from '../../components/client/ProjectsTour'; // 🔥 IMPORTAMOS EL TOUR DE PROYECTOS

export default function ClientProjects() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [myOrganizationId, setMyOrganizationId] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<any | null>(null); 

  // 🔥 ESTADOS PARA EL TOUR
  const [runProjectsTour, setRunProjectsTour] = useState(false);
  const [orgPrimaryColor, setOrgPrimaryColor] = useState('#D3002D');

  useEffect(() => {
    if (user?.id) fetchClientOrganization();
  }, [user, profile]);

  useEffect(() => {
    if (myOrganizationId) fetchProjects();
    else if (profile?.internal_role) setLoading(false);
  }, [myOrganizationId, profile, isModalOpen, projectToEdit]);

  const fetchClientOrganization = async () => {
    try {
      const { data, error } = await supabase.from('organization_members').select('organization_id').eq('profile_id', user!.id);
      if (error) throw error;
      if (!data || data.length === 0) {
        if (!!profile?.internal_role) { setMyOrganizationId(null); return; }
        throw new Error("Tu cuenta no está vinculada a ninguna empresa activa.");
      }
      const orgId = data[0].organization_id;
      setMyOrganizationId(orgId);

      // 🔥 SACAMOS EL COLOR DE LA ORGANIZACIÓN PARA EL TOUR
      const { data: orgData } = await supabase.from('organizations').select('primary_color').eq('id', orgId).single();
      if (orgData?.primary_color) setOrgPrimaryColor(orgData.primary_color);

    } catch (err: any) {
      console.error(err);
      Swal.fire({ title: 'Error', text: err.message, icon: 'warning', confirmButtonColor: 'var(--color-luxury-red)' });
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    if (!myOrganizationId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`*, requests ( id, status )`)
        .eq('organization_id', myOrganizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const processedProjects = (data || []).map(proj => {
        const reqs = proj.requests || [];
        const active = reqs.filter((r: any) => r.status === 'pendiente' || r.status === 'en_proceso').length;
        const completed = reqs.filter((r: any) => ['completado', 'entregado', 'aprobado'].includes(r.status)).length;
        return { ...proj, stats: { active, completed, total: reqs.length } };
      });

      setProjects(processedProjects);
    } catch (err) {
      console.error("Error al cargar proyectos:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading && !myOrganizationId && !profile?.internal_role) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-luxury-dark flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs tracking-widest uppercase">
        <div className="w-8 h-8 border-2 border-luxury-red border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-luxury-dark text-gray-900 dark:text-gray-200 pb-10 space-y-8 font-sans w-full max-w-full flex-1 transition-colors min-w-0">
      
      {/* 🔥 INYECTAMOS EL TOUR DE PROYECTOS */}
      <ProjectsTour 
        run={runProjectsTour} 
        onFinish={() => setRunProjectsTour(false)} 
        primaryColor={orgPrimaryColor}
      />

      <div className="px-6 md:px-10 pt-10 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        
        <div className="w-full min-w-0 flex items-center gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase truncate">
              Mis <span style={{ color: orgPrimaryColor }}>Proyectos</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium truncate">
              Administra tus tableros y campañas operativas.
            </p>
          </div>
          {/* 🔥 BOTÓN DE AYUDA PARA ACTIVAR EL TOUR */}
          <button onClick={() => setRunProjectsTour(true)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors" title="¿Cómo funciona esta sección?">
              <HelpCircle size={20} />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto shrink-0">
          {/* 🔥 CLASE DEL TOUR: tour-buscador-tablero */}
          <div className="tour-buscador-tablero relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors" size={16} />
            <input type="text" placeholder="Buscar tablero..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border rounded-2xl py-3.5 pl-11 pr-4 text-sm text-gray-900 dark:text-white outline-none transition-all focus:border-gray-400" />
          </div>
          
          {/* 🔥 CLASE DEL TOUR: tour-nuevo-tablero */}
          <button 
            onClick={() => setIsModalOpen(true)} 
            style={{ backgroundColor: orgPrimaryColor }}
            className="tour-nuevo-tablero w-full sm:w-auto hover:opacity-90 text-white px-6 py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-95 uppercase shrink-0"
          >
            <Plus size={16} strokeWidth={3}/> Nuevo Tablero
          </button>
        </div>
      </div>

      <div className="px-6 md:px-10 w-full min-w-0">
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-gray-300 dark:border-luxury-border/60 bg-white dark:bg-luxury-card rounded-3xl flex flex-col items-center justify-center gap-3">
            <FolderKanban className="text-gray-300 dark:text-luxury-border/40 animate-pulse" size={48} />
            <p className="text-gray-500 dark:text-gray-400 text-xs font-black uppercase tracking-widest">No se encontraron proyectos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <div 
                key={project.id} 
                onClick={() => navigate(`/client/projects/${project.id}`)} 
                // 🔥 CLASE DEL TOUR (Solo se la ponemos al primero para que el globo apunte ahí y no se vuelva loco)
                className={`relative bg-gray-900 dark:bg-luxury-card border border-gray-200 dark:border-luxury-border rounded-3xl flex flex-col shadow-sm hover:shadow-2xl transition-all duration-500 group cursor-pointer overflow-hidden min-h-[220px] ${index === 0 ? 'tour-tarjeta-tablero' : ''}`}
              >
                {project.banner_url ? (
                  <img src={project.banner_url} alt="Cover" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 bg-gray-800 dark:bg-luxury-dark transition-colors"></div>
                )}
                
                <div className="absolute inset-0 mix-blend-multiply opacity-60 dark:opacity-80 transition-opacity" style={{ backgroundColor: 'var(--color-brand-secondary, #0F0F12)' }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20"></div>

                <div className="relative z-10 flex flex-col h-full p-6">
                  <div className="flex justify-between items-start gap-4 mb-auto">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-black text-white uppercase tracking-tight truncate drop-shadow-md">
                        {project.name}
                      </h3>
                      <p className="text-xs text-gray-300 mt-1 line-clamp-2 font-medium leading-relaxed drop-shadow-sm">
                        {project.description || "Tablero operativo general para seguimiento de requerimientos."}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          setProjectToEdit(project);
                        }}
                        className="bg-black/40 hover:bg-luxury-red backdrop-blur-md border border-white/10 p-2.5 rounded-2xl text-white transition-colors duration-300 cursor-pointer"
                        title="Editar Tablero"
                      >
                        <Pencil size={18} />
                      </button>
                      <div className="bg-white/10 backdrop-blur-md border border-white/10 p-2.5 rounded-2xl text-white shrink-0 group-hover:bg-luxury-red transition-colors duration-300">
                        <FolderKanban size={18} strokeWidth={2} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex flex-col gap-1 transition-colors">
                      <div className="flex items-center gap-1.5 text-gray-300">
                        <Clock size={12} /> <span className="text-[9px] font-black uppercase tracking-widest">En Proceso</span>
                      </div>
                      <span className="text-xl font-black text-white">{project.stats.active}</span>
                    </div>
                    <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex flex-col gap-1 transition-colors">
                      <div className="flex items-center gap-1.5 text-gray-300">
                        <CheckCircle2 size={12} className="text-green-400" /> <span className="text-[9px] font-black uppercase tracking-widest">Completados</span>
                      </div>
                      <span className="text-xl font-black text-white">{project.stats.completed}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {myOrganizationId && (
        <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} organizationId={myOrganizationId} onRefresh={fetchProjects} />
      )}

      <EditProjectModal isOpen={!!projectToEdit} onClose={() => setProjectToEdit(null)} project={projectToEdit} onRefresh={fetchProjects} />

    </div>
  );
}