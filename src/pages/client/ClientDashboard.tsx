import { useState, useEffect } from 'react';
import { Plus, Clock, CheckCircle2, MessageSquare, Search, SlidersHorizontal, ArrowUpDown, FolderKanban, HelpCircle, Activity, Inbox, Building2 } from 'lucide-react';
import NewRequestModal from '../../components/client/NewRequestModal';
import ClientRequestCard from '../../components/client/ClientRequestCard'; 
import ClientAnalytics from '../../components/client/ClientAnalytics'; 
import ClientTour from '../../components/client/ClientTour'; 
import { supabase } from '../../lib/supabase';
import { NORMALIZED_ROLES } from '../../lib/identity';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import NotificationBell from '../../components/ui/NotificationBell';

interface ClientDashboardProps {
  bannerUrl?: string | null;
}

export default function ClientDashboard({ bannerUrl }: ClientDashboardProps) {
  const { user, profile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [myOrganizationId, setMyOrganizationId] = useState<string | null>(null);
  const [userOrgs, setUserOrgs] = useState<any[]>([]);
  const [showOrgSwitcher, setShowOrgSwitcher] = useState(false);
  
  const [orgPrimaryColor, setOrgPrimaryColor] = useState('#D3002D');
  const [orgSecondaryColor, setOrgSecondaryColor] = useState('#0F0F12');
  
  const [runTour, setRunTour] = useState(false);

  const [statusFilter, setStatusFilter] = useState('todos');
  const [priorityFilter, setPriorityFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('urgentes');

  const [monthlyFlowData, setMonthlyFlowData] = useState<any[]>([]);
  const [disciplineDistribution, setDisciplineDistribution] = useState<any[]>([]);
  const [deliverableDistribution, setDeliverableDistribution] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) fetchClientOrganization();
  }, [user, profile]);

  useEffect(() => {
    if (!myOrganizationId) {
      if (profile?.normalized_role !== NORMALIZED_ROLES.CLIENT) setLoading(false);
      return;
    }

    fetchMyRequests();

    const channel = supabase.channel(`client-realtime-${myOrganizationId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'requests', filter: `organization_id=eq.${myOrganizationId}` }, fetchMyRequests)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'request_tasks' }, fetchMyRequests)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'task_adjustments' }, fetchMyRequests)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [myOrganizationId, isModalOpen, profile]);

  useEffect(() => {
    if (isModalOpen) {
      document.title = 'Inicio - Nueva Solicitud';
      return;
    }
    const statusTitles: Record<string, string> = { todos: 'Client Pipeline', pendiente: 'Proyectos Pendientes', en_proceso: 'Producción Activa', completado: 'Proyectos Completados' };
    document.title = `Inicio - ${statusTitles[statusFilter] || 'Portal Partner'}`;
  }, [statusFilter, isModalOpen]);

  const fetchClientOrganization = async () => {
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          organization_id,
          organizations(id, name, logo_url, primary_color, secondary_color)
        `)
        .eq('profile_id', user!.id);
        
      const isStaff = profile?.normalized_role !== NORMALIZED_ROLES.CLIENT;
      if (error) throw error;
      if (!data || data.length === 0) {
        if (isStaff) { setMyOrganizationId(null); return; }
        throw new Error("Tu cuenta de cliente aún no está vinculada a ninguna empresa activa.");
      }
      
      const parsedOrgs = data.map((d: any) => {
         const org = Array.isArray(d.organizations) ? d.organizations[0] : d.organizations;
         return {
           id: d.organization_id,
           name: org?.name || 'Empresa',
           logo_url: org?.logo_url || '',
           primary_color: org?.primary_color || '#D3002D',
           secondary_color: org?.secondary_color || '#0F0F12'
         };
      });
      
      setUserOrgs(parsedOrgs);

      const savedOrgId = localStorage.getItem(`tolko_active_org_${user!.id}`);
      const activeOrg = parsedOrgs.find(o => o.id === savedOrgId) || parsedOrgs[0];
      
      setMyOrganizationId(activeOrg.id);
      setOrgPrimaryColor(activeOrg.primary_color);
      setOrgSecondaryColor(activeOrg.secondary_color);
      
      localStorage.setItem(`tolko_active_org_${user!.id}`, activeOrg.id);

    } catch (err: any) {
      console.error(err);
      Swal.fire({ title: 'Configuración de Cuenta', text: err.message, icon: 'warning', confirmButtonColor: 'var(--color-luxury-red)' });
      setLoading(false);
    }
  };

  const handleSwitchOrg = (newOrgId: string) => {
    setLoading(true); 
    setMyOrganizationId(newOrgId);
    localStorage.setItem(`tolko_active_org_${user!.id}`, newOrgId);
    
    const selectedOrg = userOrgs.find(o => o.id === newOrgId);
    if (selectedOrg) {
       setOrgPrimaryColor(selectedOrg.primary_color);
       setOrgSecondaryColor(selectedOrg.secondary_color);
    }
    
    setShowOrgSwitcher(false);
    window.dispatchEvent(new Event('tolkoOrgChanged')); 
  };

  const fetchMyRequests = async () => {
    if (!myOrganizationId) return;
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(`*, request_categories(name), priorities(level, color_code), request_tasks(*)`)
        .eq('organization_id', myOrganizationId) 
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const dataRequests = data || [];
      setRequests(dataRequests);

      const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      const monthlyCounts: any = {};
      dataRequests.forEach((req: any) => {
        const d = new Date(req.created_at);
        const m = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
        monthlyCounts[m] = (monthlyCounts[m] || 0) + 1;
      });
      setMonthlyFlowData(Object.keys(monthlyCounts).reverse().map(k => ({ name: k, solicitudes: monthlyCounts[k] })).slice(0, 6));

      let design = 0, dev = 0, av = 0, copy = 0;
      dataRequests.forEach((req: any) => {
        if (req.needs_design) design++; if (req.needs_dev) dev++; if (req.needs_av) av++; if (req.needs_copy) copy++;
      });
      setDisciplineDistribution([
        { name: 'Diseño', value: design }, { name: 'Programación', value: dev },
        { name: 'Audiovisual', value: av }, { name: 'Contenido', value: copy }
      ].filter(d => d.value > 0));

      const catCounts = dataRequests.reduce((acc: any, req: any) => {
        const categoryName = req.request_categories?.name || 'General';
        acc[categoryName] = (acc[categoryName] || 0) + 1;
        return acc;
      }, {});
      
      setDeliverableDistribution(Object.keys(catCounts).map(k => ({ name: k, total: catCounts[k] })).sort((a, b) => b.total - a.total).slice(0, 5));
    } catch (err) {
      console.error("Error al cargar solicitudes:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesStatus = true;

    if (statusFilter === 'todos') {
      matchesStatus = req.status !== 'completado';
    } else if (statusFilter === 'pendiente') {
      matchesStatus = req.status === 'pendiente';
    } else if (statusFilter === 'en_proceso') {
      matchesStatus = req.status === 'en_proceso' || req.status === 'en_revision_cliente';
    } else if (statusFilter === 'completado') {
      matchesStatus = ['completado', 'entregado', 'aprobado'].includes(req.status);
    }

    const matchesPriority = priorityFilter === 'todos' || req.priorities?.level === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  }).sort((a, b) => {
    if (sortBy === 'urgentes') {
      if (!a.due_date) return 1; if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const pendingCount = requests.filter(r => r.status === 'pendiente').length;
  const inProcessCount = requests.filter(r => r.status === 'en_proceso' || r.status === 'en_revision_cliente').length;
  const completedCount = requests.filter(r => ['completado', 'entregado', 'aprobado'].includes(r.status)).length;

  if (loading && !myOrganizationId && profile?.normalized_role === NORMALIZED_ROLES.CLIENT) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-luxury-dark flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs tracking-widest uppercase font-sans">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-luxury-red border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-black tracking-widest">Sincronizando Portal Partner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-luxury-dark text-gray-900 dark:text-gray-200 pb-10 space-y-8 font-sans w-full max-w-full flex-1 transition-colors duration-300 min-w-0 overflow-x-hidden relative">
      
      <div className="absolute top-0 right-0 p-4 md:p-8 z-50 pointer-events-none w-full flex justify-end">
        <div className="pointer-events-auto">
          <NotificationBell />
        </div>
      </div>

      <ClientTour 
        run={runTour} 
        onFinish={() => setRunTour(false)} 
        primaryColor={orgPrimaryColor} 
        secondaryColor={orgSecondaryColor} 
      />

      <div className="px-4 sm:px-6 md:px-10 pt-16 md:pt-10 w-full">
        {bannerUrl ? (
          <div className="w-full min-h-[16rem] md:h-72 relative shadow-2xl flex flex-col justify-end p-6 md:p-10 group rounded-3xl z-10">
            
            {/* 🔥 HACK: Extraemos el contenedor de fondo para quitarle la guillotina al menú 🔥 */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
              <img src={bannerUrl} alt="Partner Banner" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 mix-blend-multiply opacity-50 dark:opacity-70 transition-opacity duration-300" style={{ backgroundColor: orgSecondaryColor }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            </div>

            <div className="relative z-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 w-full">
              <div className="w-full min-w-0 flex items-center gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase drop-shadow-lg truncate">
                    Portal <span style={{ color: orgPrimaryColor }}>Partner</span>
                  </h1>
                  <p className="text-sm mt-2 font-medium text-gray-200 drop-shadow-md truncate">
                    Bienvenido a tu centro de producción creativa.
                  </p>
                </div>
                <button 
                  onClick={() => setRunTour(true)}
                  className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                  title="¿Cómo funciona el portal?"
                >
                  <HelpCircle size={20} />
                </button>
              </div>
              
              <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3 shrink-0">
                {/* SELECTOR MULTICUENTA */}
                {userOrgs.length > 1 && (
                  <div className="relative w-full sm:w-auto z-50">
                    <div 
                      onClick={() => setShowOrgSwitcher(!showOrgSwitcher)}
                      className="w-full sm:w-64 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white px-4 py-4 rounded-2xl font-black text-[11px] outline-none cursor-pointer transition-all uppercase flex items-center justify-between shadow-lg"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {userOrgs.find(o => o.id === myOrganizationId)?.logo_url ? (
                          <img src={userOrgs.find(o => o.id === myOrganizationId)?.logo_url} className="w-4 h-4 object-contain" />
                        ) : <Building2 size={14} />}
                        <span className="truncate">{userOrgs.find(o => o.id === myOrganizationId)?.name}</span>
                      </div>
                      <ArrowUpDown size={14} className="opacity-70 shrink-0"/>
                    </div>

                    {showOrgSwitcher && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowOrgSwitcher(false)}></div>
                        <div className="absolute top-full right-0 mt-2 w-full bg-white dark:bg-[#141419] border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 p-2 space-y-1">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2 pb-1">Cambiar de Empresa</p>
                          {userOrgs.map(org => (
                            <div 
                              key={org.id}
                              onClick={() => handleSwitchOrg(org.id)}
                              className={`p-2.5 rounded-lg text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-3 ${myOrganizationId === org.id ? 'bg-luxury-red/10 text-luxury-red' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'}`}
                            >
                              {org.logo_url ? <img src={org.logo_url} className="w-5 h-5 rounded object-contain bg-white" /> : <Building2 size={16} className="text-gray-400"/>}
                              <span className="truncate uppercase">{org.name}</span>
                              {myOrganizationId === org.id && <CheckCircle2 size={14} className="ml-auto"/>}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
                
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="tour-nueva-solicitud w-full md:w-auto justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-3 transition-all active:scale-95 cursor-pointer tracking-wider uppercase shrink-0"
                >
                  <Plus size={16} strokeWidth={3}/> Nueva Solicitud
                </button>
              </div>

            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 w-full mt-2">
            <div className="w-full min-w-0 flex items-center gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase truncate">
                  Portal <span style={{ color: orgPrimaryColor }}>Partner</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium truncate">Bienvenido a tu centro de producción creativa.</p>
              </div>
              <button onClick={() => setRunTour(true)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors" title="Ver Tutorial">
                  <HelpCircle size={20} />
              </button>
            </div>
            
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3 shrink-0">
              {userOrgs.length > 1 && (
                <div className="relative w-full sm:w-auto z-40">
                  <div 
                    onClick={() => setShowOrgSwitcher(!showOrgSwitcher)}
                    className="w-full sm:w-64 bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border text-gray-900 dark:text-white px-4 py-4 rounded-2xl font-black text-[11px] outline-none cursor-pointer transition-all uppercase flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {userOrgs.find(o => o.id === myOrganizationId)?.logo_url ? (
                        <img src={userOrgs.find(o => o.id === myOrganizationId)?.logo_url} className="w-4 h-4 object-contain" />
                      ) : <Building2 size={14} />}
                      <span className="truncate">{userOrgs.find(o => o.id === myOrganizationId)?.name}</span>
                    </div>
                    <ArrowUpDown size={14} className="opacity-70 shrink-0"/>
                  </div>

                  {showOrgSwitcher && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowOrgSwitcher(false)}></div>
                      <div className="absolute top-full right-0 mt-2 w-full bg-white dark:bg-[#141419] border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 p-2 space-y-1">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2 pb-1">Cambiar de Empresa</p>
                        {userOrgs.map(org => (
                          <div 
                            key={org.id}
                            onClick={() => handleSwitchOrg(org.id)}
                            className={`p-2.5 rounded-lg text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-3 ${myOrganizationId === org.id ? 'bg-luxury-red/10 text-luxury-red' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'}`}
                          >
                            {org.logo_url ? <img src={org.logo_url} className="w-5 h-5 rounded object-contain bg-white" /> : <Building2 size={16} className="text-gray-400"/>}
                            <span className="truncate uppercase">{org.name}</span>
                            {myOrganizationId === org.id && <CheckCircle2 size={14} className="ml-auto"/>}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              <button onClick={() => setIsModalOpen(true)} style={{ backgroundColor: orgPrimaryColor }} className="tour-nueva-solicitud w-full md:w-auto justify-center hover:opacity-90 text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-3 transition-all shadow-lg active:scale-95 cursor-pointer tracking-wider uppercase shrink-0">
                <Plus size={16} strokeWidth={3}/> Nueva Solicitud
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="tour-metricas grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 px-4 sm:px-6 md:px-10 w-full">
        <div className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border p-4 md:p-6 rounded-2xl flex items-center gap-4 shadow-sm dark:shadow-none transition-colors min-w-0">
          <div className="bg-gray-100 dark:bg-white/5 p-3 rounded-xl shrink-0 text-amber-500"><Inbox size={22}/></div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 truncate">En Fila (Recibidas)</p>
            <p className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mt-0.5 truncate">{pendingCount}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border p-4 md:p-6 rounded-2xl flex items-center gap-4 shadow-sm dark:shadow-none transition-colors min-w-0">
          <div className="bg-gray-100 dark:bg-white/5 p-3 rounded-xl text-blue-500 shrink-0" style={{ color: orgPrimaryColor }}><Activity size={22}/></div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 truncate">En Producción</p>
            <p className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mt-0.5 truncate">{inProcessCount}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border p-4 md:p-6 rounded-2xl flex items-center gap-4 shadow-sm dark:shadow-none transition-colors min-w-0">
          <div className="bg-gray-100 dark:bg-white/5 p-3 rounded-xl text-green-500 shrink-0"><CheckCircle2 size={22}/></div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 truncate">Finalizadas</p>
            <p className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mt-0.5 truncate">{completedCount}</p>
          </div>
        </div>
      </div>

      {!loading && (
        <div className="px-4 sm:px-6 md:px-10 w-full min-w-0 overflow-hidden">
          <ClientAnalytics monthlyData={monthlyFlowData} disciplineData={disciplineDistribution} deliverableData={deliverableDistribution} />
        </div>
      )}

      <div className="space-y-4 px-4 sm:px-6 md:px-10 w-full min-w-0">
        <div className="tour-pipeline bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border shadow-sm dark:shadow-none transition-colors duration-300 rounded-2xl p-4 md:p-6 space-y-4 w-full">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 flex items-center gap-2 transition-colors duration-300">
            <SlidersHorizontal size={14} style={{ color: orgPrimaryColor }} className="shrink-0"/> Pipeline de Solicitudes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 transition-colors duration-300" size={14} />
              <input type="text" placeholder="Buscar proyecto..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl py-2.5 pl-9 pr-3 text-xs text-gray-900 dark:text-white outline-none transition-colors duration-300 focus:border-luxury-red/50" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl p-2.5 text-xs text-gray-600 dark:text-gray-400 font-bold outline-none transition-colors duration-300 cursor-pointer appearance-none truncate">
              <option value="todos">Activas</option>
              <option value="pendiente">Recién Solicitadas</option>
              <option value="en_proceso">En Producción</option>
              <option value="completado">Finalizadas</option>
            </select>
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl p-2.5 text-xs text-gray-600 dark:text-gray-400 font-bold outline-none transition-colors duration-300 cursor-pointer appearance-none truncate">
              <option value="todos">Todas las Prioridades</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
            <div className="relative w-full">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 transition-colors duration-300" size={14} />
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl py-2.5 pl-9 pr-3 text-xs text-gray-600 dark:text-gray-400 font-black outline-none appearance-none transition-colors duration-300 cursor-pointer truncate">
                <option value="urgentes">Próximos a Vencer</option>
                <option value="recientes">Más Recientes</option>
              </select>
            </div>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-gray-300 dark:border-luxury-border/60 bg-white dark:bg-luxury-card rounded-3xl flex flex-col items-center justify-center gap-3 shadow-inner transition-colors duration-300 px-4">
            <FolderKanban className="text-gray-300 dark:text-luxury-border/40 animate-pulse" size={42} />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-black uppercase tracking-widest">No hay solicitudes activas</p>
              <p className="text-gray-400 dark:text-gray-600 text-xxs mt-1 font-medium max-w-xs mx-auto">Tus solicitudes completadas o filtradas aparecerán aquí.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 w-full min-w-0">
            {filteredRequests.map(req => (
              <ClientRequestCard key={req.id} req={req} onRefresh={fetchMyRequests} />
            ))}
          </div>
        )}
      </div>

      {myOrganizationId && (
        <NewRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} organizationId={myOrganizationId} />
      )}
    </div>
  );
}
