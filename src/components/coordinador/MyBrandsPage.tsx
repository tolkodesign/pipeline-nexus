import { useState, useEffect } from 'react';
import { 
  Plus, Loader2, ShieldCheck, ArrowLeft, LayoutGrid, List, Search, 
  FileText, Users, Mail, Palette, Sparkles, PackageCheck, 
  ChevronLeft, ChevronRight, ArrowRight, Settings, Lock, X, ExternalLink, Calendar
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import AddManagerModal from '../../components/admin/modals/AddManagerModal';
import EditManagerModal from '../../components/admin/modals/EditManagerModal';
import DeliverablesManagerModal from '../../components/admin/modals/DeliverablesManagerModal';
import EditRequestModal from '../../components/admin/modals/EditRequestModal'; // 🔥 IMPORT DEL MODAL DE EDICIÓN Y ASIGNACIÓN
import ManagerCard from '../../components/admin/ui/ManagerCard';
import ManagerListRow from '../../components/admin/ui/ManagerListRow';
import Swal from 'sweetalert2';

export default function MyBrandsPage() {
  const { user, profile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<any[]>([]);
  const [orgMembersMap, setOrgMembersMap] = useState<any[]>([]);
  const [activeRequestsMap, setActiveRequestsMap] = useState<Record<string, number>>({});
  
  // Marca Seleccionada y Módulo Activo ('overview' es el Bento Grid)
  const [activeBrandId, setActiveBrandId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'overview' | 'pipeline' | 'managers' | 'deliverables' | 'lookAndFeel'>('overview');

  // Datos de la Marca Seleccionada
  const [brandRequests, setBrandRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [brandDeliverables, setBrandDeliverables] = useState<any[]>([]);
  const [loadingDeliverables, setLoadingDeliverables] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  // Modales Reutilizados
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [managerToEdit, setManagerToEdit] = useState<any | null>(null);
  
  const [isDeliverablesManagerOpen, setIsDeliverablesManagerOpen] = useState(false);

  // 🔥 ESTADOS PARA MODAL DE EDICIÓN Y ASIGNACIÓN DE SOLICITUD
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [staffCatalog, setStaffCatalog] = useState<any[]>([]);
  const [prioritiesCatalog, setPrioritiesCatalog] = useState<any[]>([]);

  // Modal Nueva Solicitud Pre-llenada
  const [isNewRequestModalOpen, setIsCreateRequestModalOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    title: '',
    category_id: '',
    description: '',
    due_date: ''
  });

  // Filtros
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchBrandManagerQuery, setSearchBrandManagerQuery] = useState('');
  const [searchRequestQuery, setSearchRequestQuery] = useState('');
  const [requestStatusFilter, setRequestStatusFilter] = useState('activos');
  const [specialtiesCatalog, setSpecialtiesCatalog] = useState<any[]>([]);

  // Paginación de Solicitudes
  const [requestsCurrentPage, setRequestsCurrentPage] = useState(1);
  const [requestsPerPage, setRequestsPerPage] = useState(6);

  const leaderSpecialty = profile?.specialties?.name || profile?.specialty || 'Diseño';

  useEffect(() => {
    if (user?.id) {
      fetchBrandsData();
      fetchCategories();
      fetchCatalogs();
    }
  }, [user]);

  useEffect(() => {
    setSearchBrandManagerQuery('');
    setSearchRequestQuery('');
    setActiveSection('overview');
    setRequestsCurrentPage(1);
    
    if (activeBrandId) {
      fetchBrandRequests(activeBrandId);
      fetchBrandDeliverables(activeBrandId);
    }
  }, [activeBrandId]);

  useEffect(() => {
    setRequestsCurrentPage(1);
  }, [searchRequestQuery, requestStatusFilter]);

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
      console.error('Error cargando catálogos:', err);
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('request_categories').select('id, name').eq('is_active', true);
    if (data) setCategories(data);
  };

  const fetchBrandsData = async () => {
    setLoading(true);
    try {
      const { data: myAssignedOrgs } = await supabase
        .from('organization_distribution_lists')
        .select('organization_id')
        .eq('profile_id', user!.id);

      const orgIds = myAssignedOrgs?.map(item => item.organization_id) || [];

      if (orgIds.length === 0) {
        setClients([]);
        setOrgMembersMap([]);
        setActiveRequestsMap({});
      } else {
        const { data: orgs } = await supabase
          .from('organizations')
          .select('*')
          .in('id', orgIds)
          .order('name');
        setClients(orgs || []);

        const { data: membersRelation } = await supabase
          .from('organization_members')
          .select(`organization_id, profile_id, role_in_org, profiles!inner(id, full_name, phone, email, avatar_url)`)
          .in('organization_id', orgIds);
        
        setOrgMembersMap(membersRelation || []);

        const { data: reqCounts } = await supabase
          .from('requests')
          .select('organization_id, status')
          .in('organization_id', orgIds)
          .eq('is_active', true);

        const countsMap: Record<string, number> = {};
        (reqCounts || []).forEach((r: any) => {
          if (!['completado', 'entregado', 'aprobado'].includes(r.status)) {
            countsMap[r.organization_id] = (countsMap[r.organization_id] || 0) + 1;
          }
        });
        setActiveRequestsMap(countsMap);
      }
    } catch (error) {
      console.error("Error cargando reinos del coordinador:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrandRequests = async (orgId: string) => {
    setLoadingRequests(true);
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          priorities(level, color_code),
          request_categories(name),
          profiles:requester_id(full_name, avatar_url)
        `)
        .eq('organization_id', orgId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBrandRequests(data || []);
    } catch (err) {
      console.error("Error cargando solicitudes de la marca:", err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const fetchBrandDeliverables = async (orgId: string) => {
    setLoadingDeliverables(true);
    try {
      const { data, error } = await supabase
        .from('organization_deliverables')
        .select(`
          *,
          request_categories(name),
          file_extensions:target_format_id(extension)
        `)
        .eq('organization_id', orgId)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setBrandDeliverables(data || []);
    } catch (err) {
      console.error("Error cargando entregables de la marca:", err);
    } finally {
      setLoadingDeliverables(false);
    }
  };

  // 🔥 MAPPING Y CARGA DE DETALLE COMPLETO AL HACER CLIC EN UN TICKET
  const handleOpenRequestModal = async (req: any) => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          specialty_ids,
          organizations(name, logo_url),
          projects(name),
          request_categories(name),
          organization_deliverables(name),
          priorities!requests_priority_id_fkey(id, level, color_code),
          request_tasks(*, specialty_id, task_assignees(*, profiles(full_name, avatar_url))),
          profiles!requests_requester_id_fkey(full_name),
          file_extensions(extension)
        `)
        .eq('id', req.id)
        .single();

      if (error) throw error;
      setSelectedRequest(data || req);
    } catch (err) {
      console.error("Error al cargar detalle de la solicitud:", err);
      setSelectedRequest(req); // Fallback en caso de fallo de red
    }
  };

  /* ================= CREACIÓN RÃPIDA DE SOLICITUD PRELLENADA ================= */
  const handleSaveNewRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBrandId || !requestForm.title) return;

    try {
      const { error } = await supabase.from('requests').insert({
        organization_id: activeBrandId,
        requester_id: user!.id,
        title: requestForm.title,
        category_id: requestForm.category_id ? parseInt(requestForm.category_id) : null,
        description: requestForm.description,
        due_date: requestForm.due_date || null,
        status: 'pendiente',
        is_active: true
      });

      if (error) throw error;

      Swal.fire({
        title: '¡Solicitud Registrada!',
        text: `La solicitud fue vinculada a ${currentSelectedBrand?.name}.`,
        icon: 'success',
        confirmButtonColor: '#D3002D'
      });

      setIsCreateRequestModalOpen(false);
      setRequestForm({ title: '', category_id: '', description: '', due_date: '' });
      fetchBrandRequests(activeBrandId);
      fetchBrandsData();
    } catch (err: any) {
      console.error(err);
      Swal.fire('Error', err.message || 'No se pudo registrar la solicitud.', 'error');
    }
  };

  const handleRemoveRepresentative = async (orgId: string, profId: string, name: string) => {
    const result = await Swal.fire({
      title: '¿Quitar representante?',
      text: `Removerás a ${name} de la gestión directa de esta cuenta corporativa.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#D3002D',
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'SÃ, REMOVER',
      cancelButtonText: 'CANCELAR'
    });

    if (!result.isConfirmed) return;

    try {
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .match({ organization_id: orgId, profile_id: profId, role_in_org: 'manager' });

      if (error) throw error;
      
      Swal.fire({
        title: 'Removido',
        text: 'El representante fue desvinculado con éxito.',
        icon: 'success',
        confirmButtonColor: '#D3002D'
      });
      
      fetchBrandsData();
    } catch (error: any) {
      console.error(error);
      Swal.fire('Error', 'No se pudo remover al representante.', 'error');
    }
  };

  const currentSelectedBrand = clients.find(c => c.id === activeBrandId);
  const activeBrandRepresentatives = orgMembersMap.filter(m => m.organization_id === activeBrandId);

  const formattedBrandManagers = activeBrandRepresentatives.map(item => {
    const p = item.profiles;
    return {
      id: p.id,
      name: p.full_name || 'Sin Nombre',
      email: p.email || 'N/A',
      phone: p.phone || 'N/A',
      avatar: p.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.full_name || 'X')}&background=1E1E24&color=D3002D`,
      role: item.role_in_org || 'Encargado',
      company: currentSelectedBrand?.name || 'Sin Empresa',
      company_id: item.organization_id
    };
  });

  const filteredBrandManagers = formattedBrandManagers.filter(m => 
    m.name.toLowerCase().includes(searchBrandManagerQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchBrandManagerQuery.toLowerCase())
  );

  const filteredRequests = brandRequests.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchRequestQuery.toLowerCase());
    let matchesStatus = true;
    if (requestStatusFilter === 'activos') {
      matchesStatus = !['completado', 'entregado', 'aprobado'].includes(r.status);
    } else if (requestStatusFilter !== 'todos') {
      matchesStatus = r.status === requestStatusFilter;
    }
    return matchesSearch && matchesStatus;
  });

  // Paginación
  const totalRequestPages = Math.ceil(filteredRequests.length / requestsPerPage) || 1;
  const reqStartIndex = (requestsCurrentPage - 1) * requestsPerPage;
  const reqEndIndex = reqStartIndex + requestsPerPage;
  const paginatedRequests = filteredRequests.slice(reqStartIndex, reqEndIndex);

  const activeReqsCount = brandRequests.filter(r => !['completado', 'entregado', 'aprobado'].includes(r.status)).length;
  const completedReqsCount = brandRequests.filter(r => ['completado', 'entregado', 'aprobado'].includes(r.status)).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendiente':
        return <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-0.5 rounded text-[9px] font-black uppercase">Pendiente</span>;
      case 'en_proceso':
      case 'en_revision_cliente':
        return <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2.5 py-0.5 rounded text-[9px] font-black uppercase">En Proceso</span>;
      case 'completado':
      case 'entregado':
      case 'aprobado':
        return <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-2.5 py-0.5 rounded text-[9px] font-black uppercase">Completado</span>;
      default:
        return <span className="bg-gray-500/10 text-gray-400 border border-gray-500/20 px-2.5 py-0.5 rounded text-[9px] font-black uppercase">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-luxury-dark flex items-center justify-center font-sans">
        <Loader2 className="animate-spin text-luxury-red" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-luxury-dark text-gray-900 dark:text-gray-200 pb-12 space-y-8 font-sans w-full max-w-full flex-1 transition-colors duration-300 min-w-0 overflow-x-hidden">
      
      {/* HEADER DE LA SECCIÓN */}
      <div className="px-4 sm:px-6 md:px-10 pt-6 md:pt-10 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 w-full">
          <div className="w-full min-w-0 flex items-center gap-3">
            {activeBrandId && (
              <button 
                onClick={() => {
                  if (activeSection !== 'overview') {
                    setActiveSection('overview');
                  } else {
                    setActiveBrandId(null);
                  }
                }}
                className="p-2.5 bg-white dark:bg-white/5 hover:bg-luxury-red dark:hover:bg-luxury-red rounded-xl text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 transition-colors cursor-pointer shrink-0"
              >
                <ArrowLeft size={16} strokeWidth={3}/>
              </button>
            )}
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase truncate">
                {activeBrandId ? (
                  <>Centro de Mando: <span className="text-luxury-red">{currentSelectedBrand?.name}</span></>
                ) : (
                  <>Cuentas <span className="text-luxury-red">Asignadas</span></>
                )}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 font-bold flex items-center gap-2 uppercase tracking-wider">
                <ShieldCheck size={14} className="text-luxury-red shrink-0"/> Célula Operativa: <span className="text-luxury-red font-black">{leaderSpecialty}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-10 w-full min-w-0">
        {!activeBrandId ? (
          /* ================= GRID GENERAL DE MARCAS ================= */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-200">
            {clients.length === 0 ? (
              <div className="col-span-full border border-dashed border-gray-200 dark:border-white/[0.06] rounded-2xl p-16 text-center bg-white dark:bg-luxury-card">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">No tienes cuentas asignadas en tu lista de distribución.</p>
              </div>
            ) : (
              clients.map(client => {
                const repsCount = orgMembersMap.filter(m => m.organization_id === client.id).length;
                const activeReqs = activeRequestsMap[client.id] || 0;

                return (
                  <div 
                    key={client.id} 
                    onClick={() => setActiveBrandId(client.id)}
                    className="relative group cursor-pointer overflow-hidden rounded-3xl border border-gray-200/60 dark:border-white/[0.06] p-6 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between min-h-[190px] bg-white dark:bg-luxury-card"
                    style={{
                      backgroundImage: client.banner_url 
                        ? `linear-gradient(to bottom, rgba(15, 15, 18, 0.55), rgba(15, 15, 18, 0.92)), url(${client.banner_url})` 
                        : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {!client.banner_url && <div className="absolute inset-0 bg-white/[0.01] dark:bg-white/[0.02] backdrop-blur-xl -z-10" />}
                    
                    {client.logo_url && (
                      <img src={client.logo_url} className="absolute -right-4 -bottom-4 w-28 h-28 object-contain opacity-[0.05] dark:opacity-[0.03] pointer-events-none select-none mix-blend-screen transition-transform duration-500 group-hover:scale-110" alt="" />
                    )}

                    <div className="flex items-start justify-between gap-2 relative z-10">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border backdrop-blur-md transition-all ${
                          repsCount > 0 ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}>
                          {repsCount} Encargados
                        </span>
                        
                        <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border border-luxury-red/30 bg-luxury-red/20 text-white backdrop-blur-md">
                          {activeReqs} Solicitudes Activas
                        </span>
                      </div>
                    </div>

                    <div className="mt-8 relative z-10">
                      <h4 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-wide group-hover:text-luxury-red transition-colors truncate">
                        {client.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-1 opacity-80 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        Abrir Centro de Mando →
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* ================= VISTA DETALLADA / CENTRO DE MANDO DE MARCA ================= */
          <div className="w-full mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 relative">
            
            {/* HERO BANNER DE LA MARCA */}
            <div 
              className="relative rounded-3xl border border-gray-200/60 dark:border-white/[0.08] p-6 md:p-8 overflow-hidden shadow-lg bg-white dark:bg-luxury-card flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              style={{
                backgroundImage: currentSelectedBrand?.banner_url 
                  ? `linear-gradient(to right, rgba(15, 15, 18, 0.92), rgba(15, 15, 18, 0.75)), url(${currentSelectedBrand.banner_url})` 
                  : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="flex items-center gap-5 relative z-10">
                {currentSelectedBrand?.logo_url ? (
                  <div className="w-20 h-20 rounded-2xl bg-white dark:bg-black/50 p-3 border border-gray-200 dark:border-white/10 flex items-center justify-center shrink-0 shadow-md">
                    <img src={currentSelectedBrand.logo_url} className="w-full h-full object-contain" alt="" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-luxury-red/10 text-luxury-red border border-luxury-red/20 flex items-center justify-center shrink-0 font-black text-2xl uppercase">
                    {currentSelectedBrand?.name?.substring(0, 2)}
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black uppercase px-2.5 py-0.5 rounded bg-white/10 text-white border border-white/20 backdrop-blur-md">
                      {currentSelectedBrand?.industry || 'Cuenta Corporativa'}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                    {currentSelectedBrand?.name}
                  </h2>
                  {currentSelectedBrand?.distribution_email && (
                    <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5 mt-1">
                      <Mail size={13} className="text-luxury-red"/> {currentSelectedBrand.distribution_email}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 w-full md:w-auto z-10">
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-2xl text-xs font-black tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer uppercase active:scale-95"
                >
                  <Plus size={16} strokeWidth={3}/> REGISTRAR ENCARGADO
                </button>
                <button 
                  onClick={() => setIsCreateRequestModalOpen(true)}
                  className="bg-luxury-red hover:bg-red-700 text-white px-6 py-3.5 rounded-2xl text-xs font-black tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-luxury-red/20 uppercase active:scale-95"
                >
                  <Plus size={16} strokeWidth={3}/> NUEVA SOLICITUD
                </button>
              </div>
            </div>

            {/* BOTÓN REGRESO AL BENTO SI ESTÃS DENTRO DE UN MÃ“DULO */}
            {activeSection !== 'overview' && (
              <div className="flex items-center justify-between bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-white/[0.06] p-4 rounded-2xl">
                <button
                  onClick={() => setActiveSection('overview')}
                  className="text-xs font-black uppercase text-luxury-red flex items-center gap-2 hover:underline cursor-pointer"
                >
                  <ArrowLeft size={16} /> Volver a las tarjetas del Bento Grid
                </button>
                <span className="text-xs font-black uppercase text-gray-400">
                  Módulo Seleccionado: <span className="text-gray-900 dark:text-white">{activeSection.toUpperCase()}</span>
                </span>
              </div>
            )}

            {/* ================= ðŸ± BENTO GRID LIMPIO DE 4 TARJETAS ================= */}
            {activeSection === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* TILE 1: SOLICITUDES & PIPELINE (HERO 2 COLUMNAS) */}
                <div 
                  onClick={() => setActiveSection('pipeline')}
                  className="md:col-span-2 lg:col-span-2 p-6 rounded-3xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#0F0F12] hover:border-luxury-red/50 cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-sm hover:shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-white/5 text-luxury-red">
                        <FileText size={24} strokeWidth={2.5}/>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Módulo Principal</p>
                        <h3 className="text-sm font-black uppercase text-gray-900 dark:text-white">Solicitudes & Pipeline</h3>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-gray-400 group-hover:text-luxury-red group-hover:translate-x-1 transition-all"/>
                  </div>

                  <div className="flex items-end justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                    <div>
                      <span className="text-3xl font-black text-gray-900 dark:text-white">{brandRequests.length}</span>
                      <span className="text-xs text-gray-400 font-bold ml-1.5 uppercase">Tickets Totales</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        {activeReqsCount} Activas
                      </span>
                      <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-lg bg-green-500/10 text-green-500 border border-green-500/20">
                        {completedReqsCount} Listas
                      </span>
                    </div>
                  </div>
                </div>

                {/* TILE 2: ENCARGADOS */}
                <div 
                  onClick={() => setActiveSection('managers')}
                  className="lg:col-span-1 p-6 rounded-3xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#0F0F12] hover:border-luxury-red/50 cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-sm hover:shadow-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 rounded-2xl bg-blue-50 dark:bg-white/5 text-blue-500">
                      <Users size={20} strokeWidth={2.5}/>
                    </div>
                    <ArrowRight size={16} className="text-gray-400 group-hover:text-luxury-red group-hover:translate-x-1 transition-all"/>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Representantes</p>
                    <p className="text-xl font-black text-gray-900 dark:text-white mt-0.5">
                      {formattedBrandManagers.length} <span className="text-xs text-gray-400 font-bold normal-case">Encargados</span>
                    </p>
                  </div>
                </div>

                {/* TILE 3: ENTREGABLES */}
                <div 
                  onClick={() => setActiveSection('deliverables')}
                  className="lg:col-span-1 p-6 rounded-3xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#0F0F12] hover:border-luxury-red/50 cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-sm hover:shadow-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 rounded-2xl bg-purple-50 dark:bg-white/5 text-purple-500">
                      <PackageCheck size={20} strokeWidth={2.5}/>
                    </div>
                    <ArrowRight size={16} className="text-gray-400 group-hover:text-luxury-red group-hover:translate-x-1 transition-all"/>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Catálogo de Entregables</p>
                    <p className="text-xl font-black text-gray-900 dark:text-white mt-0.5">
                      {brandDeliverables.length} <span className="text-xs text-gray-400 font-bold normal-case">Entregables</span>
                    </p>
                  </div>
                </div>

                {/* TILE 4: LOOK & FEEL */}
                <div 
                  onClick={() => setActiveSection('lookAndFeel')}
                  className="md:col-span-2 lg:col-span-2 p-6 rounded-3xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#0F0F12] hover:border-luxury-red/50 cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-sm hover:shadow-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 rounded-2xl bg-amber-50 dark:bg-white/5 text-amber-500">
                      <Palette size={20} strokeWidth={2.5}/>
                    </div>
                    <ArrowRight size={16} className="text-gray-400 group-hover:text-luxury-red group-hover:translate-x-1 transition-all"/>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Branding & Colores</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="w-5 h-5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: currentSelectedBrand?.primary_color || '#D3002D' }} />
                      <div className="w-5 h-5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: currentSelectedBrand?.secondary_color || '#0F0F12' }} />
                      <span className="text-xs font-black uppercase text-gray-900 dark:text-white ml-1">Look & Feel</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ================= SUBVISTA 1: PIPELINE & SOLICITUDES (INTERACTIVO AL CLIC) ================= */}
            {activeSection === 'pipeline' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-white/[0.06] p-4 rounded-2xl">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="Buscar solicitud de esta marca..." 
                      value={searchRequestQuery}
                      onChange={e => setSearchRequestQuery(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-white/[0.06] rounded-xl py-2 pl-9 pr-3 text-xs text-gray-900 dark:text-white font-bold outline-none focus:border-luxury-red transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <select
                      value={requestStatusFilter}
                      onChange={e => setRequestStatusFilter(e.target.value)}
                      className="w-full sm:w-48 bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-white/[0.06] rounded-xl p-2 text-xs text-gray-900 dark:text-white font-bold outline-none focus:border-luxury-red cursor-pointer uppercase truncate"
                    >
                      <option value="activos">Ocultar Completados</option>
                      <option value="todos">Todos los Estados</option>
                      <option value="pendiente">Pendientes</option>
                      <option value="en_proceso">En Proceso</option>
                      <option value="completado">Completados</option>
                    </select>

                    <button
                      onClick={() => setIsCreateRequestModalOpen(true)}
                      className="bg-luxury-red text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 uppercase whitespace-nowrap cursor-pointer hover:bg-red-700"
                    >
                      <Plus size={14}/> Nueva Solicitud
                    </button>
                  </div>
                </div>

                {loadingRequests ? (
                  <div className="py-16 text-center"><Loader2 className="animate-spin mx-auto text-luxury-red" size={24}/></div>
                ) : filteredRequests.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-gray-200 dark:border-white/[0.06] rounded-2xl bg-white dark:bg-white/[0.01]">
                    <p className="text-gray-500 font-bold uppercase tracking-wider text-xs">No hay solicitudes registradas bajo este filtro para {currentSelectedBrand?.name}.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-3">
                      {paginatedRequests.map(req => (
                        <div 
                          key={req.id} 
                          onClick={() => handleOpenRequestModal(req)}
                          className="group bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-white/[0.06] p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-luxury-red/60 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md relative overflow-hidden"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[9px] font-black uppercase text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded">
                                {req.request_categories?.name || 'General'}
                              </span>
                              {getStatusBadge(req.status)}
                            </div>
                            <h4 className="font-black text-sm text-gray-900 dark:text-white uppercase group-hover:text-luxury-red transition-colors flex items-center gap-2">
                              {req.title}
                              <ExternalLink size={13} className="opacity-0 group-hover:opacity-100 transition-opacity text-luxury-red shrink-0" />
                            </h4>
                            <p className="text-xxs text-gray-400 font-bold uppercase mt-0.5">
                              Solicitante: {req.profiles?.full_name || 'Cliente'} • Fecha: {new Date(req.created_at).toLocaleDateString('es-MX')}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {req.due_date && (
                              <span className="text-[10px] font-black text-luxury-red bg-red-50 dark:bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-500/20 flex items-center gap-1">
                                <Calendar size={11} /> Límite: {new Date(req.due_date).toLocaleDateString('es-MX')}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CONTROLES DE PAGINACIÃ“N */}
                    <div className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Mostrando <span className="font-bold text-gray-900 dark:text-white">{reqStartIndex + 1}</span> a <span className="font-bold text-gray-900 dark:text-white">{Math.min(reqEndIndex, filteredRequests.length)}</span> de <span className="font-bold text-gray-900 dark:text-white">{filteredRequests.length}</span> solicitudes
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 mr-2">
                          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Mostrar:</span>
                          <select 
                            value={requestsPerPage} 
                            onChange={e => {
                              setRequestsPerPage(Number(e.target.value));
                              setRequestsCurrentPage(1);
                            }}
                            className="bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-white/[0.06] rounded-lg px-2 py-1 text-xs font-bold text-gray-700 dark:text-gray-200 outline-none cursor-pointer"
                          >
                            <option value={6}>6</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                          </select>
                        </div>

                        <button
                          onClick={() => setRequestsCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={requestsCurrentPage === 1}
                          className="p-2 bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-white/[0.06] rounded-xl text-gray-600 dark:text-gray-300 hover:text-luxury-red disabled:opacity-30 disabled:hover:text-gray-600 transition-all cursor-pointer disabled:cursor-not-allowed"
                        >
                          <ChevronLeft size={16} />
                        </button>

                        <span className="text-xs font-black px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-lg text-gray-800 dark:text-gray-200">
                          {requestsCurrentPage} / {totalRequestPages}
                        </span>

                        <button
                          onClick={() => setRequestsCurrentPage(prev => Math.min(prev + 1, totalRequestPages))}
                          disabled={requestsCurrentPage === totalRequestPages}
                          className="p-2 bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-white/[0.06] rounded-xl text-gray-600 dark:text-gray-300 hover:text-luxury-red disabled:opacity-30 disabled:hover:text-gray-600 transition-all cursor-pointer disabled:cursor-not-allowed"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* SUBVISTA 2: ENCARGADOS */}
            {activeSection === 'managers' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row gap-4 items-center bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-white/[0.06] p-4 rounded-2xl shadow-sm transition-colors duration-300">
                  <div className="flex-1 relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18}/>
                    <input 
                      type="text" 
                      placeholder="Buscar encargado por nombre o correo..." 
                      value={searchBrandManagerQuery}
                      onChange={(e) => setSearchBrandManagerQuery(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-white/[0.06] rounded-xl py-3 pl-12 pr-4 outline-none focus:border-luxury-red text-gray-900 dark:text-white transition-all text-sm font-bold" 
                    />
                  </div>
                  <div className="flex bg-gray-50 dark:bg-[#050505] p-1 rounded-xl border border-gray-200 dark:border-white/[0.06] shrink-0 transition-colors duration-300 w-full sm:w-auto justify-center">
                    <button onClick={() => setViewMode('grid')} className={`flex-1 sm:flex-none p-2 rounded-lg transition-all duration-300 cursor-pointer flex justify-center ${viewMode === 'grid' ? 'bg-luxury-red text-white shadow-md' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}><LayoutGrid size={20}/></button>
                    <button onClick={() => setViewMode('list')} className={`flex-1 sm:flex-none p-2 rounded-lg transition-all duration-300 cursor-pointer flex justify-center ${viewMode === 'list' ? 'bg-luxury-red text-white shadow-md' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}><List size={20}/></button>
                  </div>
                </div>

                {activeBrandRepresentatives.length === 0 ? (
                  <div className="text-center py-20 border border-dashed border-gray-200 dark:border-white/[0.06] rounded-2xl bg-white dark:bg-white/[0.01]">
                    <p className="text-gray-500 font-bold uppercase tracking-wider text-xs">No hay representantes registrados para {currentSelectedBrand?.name}.</p>
                  </div>
                ) : filteredBrandManagers.length === 0 ? (
                  <div className="text-center py-20 border border-dashed border-gray-200 dark:border-white/[0.06] rounded-2xl bg-white dark:bg-white/[0.01]">
                    <p className="text-gray-500 font-bold uppercase tracking-wider text-xs">No se encontraron encargados con: "{searchBrandManagerQuery}"</p>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredBrandManagers.map(m => (
                      <ManagerCard 
                        key={m.id} 
                        manager={m} 
                        onEdit={() => { setManagerToEdit(m); setIsEditModalOpen(true); }}
                        onDelete={() => handleRemoveRepresentative(m.company_id, m.id, m.name)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-md dark:shadow-xl">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 dark:bg-white/5 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                        <tr>
                          <th className="px-6 py-4">Responsable</th>
                          <th className="px-6 py-4">Empresa / Cliente</th>
                          <th className="px-6 py-4">Contacto</th>
                          <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-white/[0.06]">
                        {filteredBrandManagers.map(m => (
                          <ManagerListRow 
                            key={m.id} 
                            manager={m} 
                            onEdit={() => { setManagerToEdit(m); setIsEditModalOpen(true); }}
                            onDelete={() => handleRemoveRepresentative(m.company_id, m.id, m.name)}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* SUBVISTA 3: ENTREGABLES */}
            {activeSection === 'deliverables' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-white/[0.06] p-5 rounded-2xl">
                  <div>
                    <h3 className="text-sm font-black uppercase text-gray-900 dark:text-white">Catálogo de Entregables Autorizados</h3>
                    <p className="text-xxs text-gray-400 font-medium mt-0.5">Formatos disponibles para producción en {currentSelectedBrand?.name}</p>
                  </div>

                  <button
                    onClick={() => setIsDeliverablesManagerOpen(true)}
                    className="bg-luxury-red hover:bg-red-700 text-white text-xs font-black px-5 py-3 rounded-xl flex items-center gap-2 uppercase cursor-pointer shadow-lg shadow-luxury-red/20 active:scale-95"
                  >
                    <Settings size={15}/> Administrar Catálogo de Entregables
                  </button>
                </div>

                {loadingDeliverables ? (
                  <div className="py-16 text-center"><Loader2 className="animate-spin mx-auto text-luxury-red" size={24}/></div>
                ) : brandDeliverables.length === 0 ? (
                  <div className="text-center py-20 border border-dashed border-gray-200 dark:border-white/[0.06] rounded-2xl bg-white dark:bg-white/[0.01]">
                    <p className="text-gray-500 font-bold uppercase tracking-wider text-xs">No hay entregables configurados para {currentSelectedBrand?.name}.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {brandDeliverables.map(item => (
                      <div key={item.id} className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-white/[0.06] p-5 rounded-2xl space-y-3 hover:border-luxury-red/40 transition-all shadow-sm">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[9px] font-black uppercase text-luxury-red bg-luxury-red/10 border border-luxury-red/20 px-2.5 py-0.5 rounded">
                            {item.request_categories?.name || 'Categoría Standard'}
                          </span>
                          {item.is_package && (
                            <span className="text-[9px] font-black uppercase text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                              Paquete
                            </span>
                          )}
                        </div>

                        <h4 className="font-black text-sm text-gray-900 dark:text-white uppercase">{item.name}</h4>

                        <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-100 dark:border-white/5">
                          {item.specialty_ids && item.specialty_ids.length > 0 && (
                            specialtiesCatalog.filter(s => item.specialty_ids.includes(s.id)).map(spec => (
                              <span key={spec.id} className="text-[8px] font-bold uppercase bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded text-gray-400">{spec.name}</span>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SUBVISTA 4: LOOK & FEEL */}
            {activeSection === 'lookAndFeel' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
                <div className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-white/[0.06] p-6 rounded-3xl space-y-4">
                  <h3 className="text-sm font-black uppercase text-gray-900 dark:text-white flex items-center gap-2">
                    <Palette size={16} className="text-luxury-red"/> Paleta Cromática
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 space-y-2">
                      <p className="text-[10px] font-bold uppercase text-gray-400">Color Primario</p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl border border-white/20 shadow-inner" style={{ backgroundColor: currentSelectedBrand?.primary_color || '#D3002D' }} />
                        <span className="text-xs font-black uppercase text-gray-900 dark:text-white">{currentSelectedBrand?.primary_color || '#D3002D'}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 space-y-2">
                      <p className="text-[10px] font-bold uppercase text-gray-400">Color Secundario</p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl border border-white/20 shadow-inner" style={{ backgroundColor: currentSelectedBrand?.secondary_color || '#0F0F12' }} />
                        <span className="text-xs font-black uppercase text-gray-900 dark:text-white">{currentSelectedBrand?.secondary_color || '#0F0F12'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-white/[0.06] p-6 rounded-3xl space-y-4">
                  <h3 className="text-sm font-black uppercase text-gray-900 dark:text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-luxury-red"/> Ficha Técnica de Marca
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl flex justify-between items-center">
                      <span className="text-gray-400 font-bold uppercase text-[10px]">Giro / Industria</span>
                      <span className="font-black text-gray-900 dark:text-white uppercase text-[10px]">{currentSelectedBrand?.industry || 'Sin Especificar'}</span>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl flex justify-between items-center">
                      <span className="text-gray-400 font-bold uppercase text-[10px]">Estatus de Operación</span>
                      <span className="font-black text-green-500 uppercase text-[10px] px-2 py-0.5 rounded bg-green-500/10">Activa en Tolko</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* MODAL NUEVA SOLICITUD CON EMPRESA BLOQUEADA */}
      {isNewRequestModalOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <form onSubmit={handleSaveNewRequest} className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-luxury-border w-full max-w-lg rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-white/10 pb-3">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase">
                Nueva Solicitud Operativa
              </h3>
              <button type="button" onClick={() => setIsCreateRequestModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer"><X size={18}/></button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Empresa / Cuenta</label>
                <div className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-gray-500 dark:text-gray-300 flex items-center justify-between cursor-not-allowed">
                  <span>{currentSelectedBrand?.name}</span>
                  <Lock size={14} className="text-luxury-red"/>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Título de la Solicitud *</label>
                <input required type="text" placeholder="Ej: Campaña de Redes Septiembre" value={requestForm.title} onChange={e => setRequestForm({...requestForm, title: e.target.value})} className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-luxury-red" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Categoría</label>
                  <select value={requestForm.category_id} onChange={e => setRequestForm({...requestForm, category_id: e.target.value})} className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-luxury-red cursor-pointer">
                    <option value="">Seleccionar...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Fecha Límite</label>
                  <input type="date" value={requestForm.due_date} onChange={e => setRequestForm({...requestForm, due_date: e.target.value})} className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-luxury-red cursor-pointer" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Descripción o Brief</label>
                <textarea rows={3} placeholder="Detalles de la solicitud..." value={requestForm.description} onChange={e => setRequestForm({...requestForm, description: e.target.value})} className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-luxury-red" />
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-white/10">
              <button type="button" onClick={() => setIsCreateRequestModalOpen(false)} className="flex-1 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 py-3 rounded-xl text-xs font-black uppercase cursor-pointer">Cancelar</button>
              <button type="submit" className="flex-1 bg-luxury-red text-white py-3 rounded-xl text-xs font-black uppercase shadow-lg shadow-luxury-red/20 cursor-pointer">Crear Solicitud</button>
            </div>
          </form>
        </div>
      )}

      {/* MODALES REUTILIZADOS EXISTENTES */}
      {isAddModalOpen && (
        <AddManagerModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onRefresh={fetchBrandsData}
          preselectedOrgId={activeBrandId} 
        />
      )}

      {isEditModalOpen && managerToEdit && (
        <EditManagerModal 
          isOpen={isEditModalOpen}
          onClose={() => { setIsEditModalOpen(false); setManagerToEdit(null); }}
          onRefresh={fetchBrandsData}
          manager={managerToEdit}
          currentOrgId={activeBrandId}
        />
      )}

      {/* MODAL DE ENTREGABLES EXTERNO */}
      {isDeliverablesManagerOpen && currentSelectedBrand && (
        <DeliverablesManagerModal
          isOpen={isDeliverablesManagerOpen}
          onClose={() => {
            setIsDeliverablesManagerOpen(false);
            if (activeBrandId) fetchBrandDeliverables(activeBrandId);
          }}
          client={currentSelectedBrand}
        />
      )}

      {/* 🔥 MODAL DE EDICIÓN Y ASIGNACIÓN DE SOLICITUD */}
      {selectedRequest && (
        <EditRequestModal 
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          request={selectedRequest}
          staffCatalog={staffCatalog} 
          prioritiesCatalog={prioritiesCatalog}
          onRefresh={() => {
            if (activeBrandId) fetchBrandRequests(activeBrandId);
            fetchBrandsData();
          }}
        />
      )}

    </div>
  );
}

