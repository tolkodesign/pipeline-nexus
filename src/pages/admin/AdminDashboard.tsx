import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext'; 
import Sidebar from '../../components/layout/Sidebar'; 

import StatCard from '../../components/admin/ui/StatCard';
import RequestRow from '../../components/admin/ui/RequestRow';
import RequestRowSkeleton from '../../components/admin/ui/RequestRowSkeleton'; 
import { Skeleton } from '../../components/admin/ui/Skeleton'; 

import ClientsPage from './Clients'; 
import ManagersPage from '../../components/admin/tabs/Managers';
import TeamPage from '../../components/admin/tabs/Team';
import AdminReports from '../../components/admin/ui/AdminReports'; 
import HistoryPage from '../../components/admin/tabs/History';
import SettingsPage from '../../components/admin/Settings';

import EditRequestModal from '../../components/admin/modals/EditRequestModal';
import PriorityListModal from '../../components/admin/modals/PriorityListModal';
import NewRequestModal from '../../components/client/NewRequestModal'; 

import NotificationBell from '../../components/ui/NotificationBell';
import ClientAnalytics from '../../components/client/ClientAnalytics';
import CalendarPage from '../../components/admin/tabs/CalendarPage';

// 🔥 IMPORTAMOS EL CALENDAR PARA EL NUEVO FILTRO DE FECHAS
import { LayoutGrid, CheckCircle2, Flame, Clock, ArrowRight, Activity, Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, AlertTriangle, History, X, Filter, BellRing, Plus, Building2, FolderKanban, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';

import HostageOverlay from '../../components/admin/ui/HostageOverlay';

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth(); 

  const [activeTab, setActiveTab] = useState<string>(() => {
    const hash = location.hash.replace('#', '');
    return hash || 'dashboard';
  });

  useEffect(() => {
    navigate(`#${activeTab}`, { replace: true });
  }, [activeTab, navigate]);

  const [requests, setRequests] = useState<any[]>([]);
  const [prioritiesCatalog, setPrioritiesCatalog] = useState<any[]>([]);
  const [staffCatalog, setStaffCatalog] = useState<any[]>([]); 
  const [specialtiesCatalog, setSpecialtiesCatalog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activityFeed, setActivityFeed] = useState<any[]>([]);

  const [activePriorityModal, setActivePriorityModal] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [statModalType, setStatModalType] = useState<string | null>(null); 

  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [modalClientFilter, setModalClientFilter] = useState('todos');

  // 🔥 ESTADOS PARA PAGINACIÓN DEL MODAL
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const [modalItemsPerPage, setModalItemsPerPage] = useState(10);

  // 🔥 ESTADOS PARA EL FILTRO DE FECHAS
  const [frequencyFilter, setFrequencyFilter] = useState('todos');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [pipelineTab, setPipelineTab] = useState('todos');
  const [searchPipeline, setSearchPipeline] = useState('');
  
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  const [priorityFilter, setPriorityFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('urgentes'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); 

  const [isNewReqModalOpen, setIsNewReqModalOpen] = useState(false);
  const [allClients, setAllClients] = useState<any[]>([]);
  const [allClientUsers, setAllClientUsers] = useState<any[]>([]);

  const [monthlyFlowData, setMonthlyFlowData] = useState<any[]>([]);
  const [disciplineDistribution, setDisciplineDistribution] = useState<any[]>([]);
  const [deliverableDistribution, setDeliverableDistribution] = useState<any[]>([]);
  const [clientDistribution, setClientDistribution] = useState<any[]>([]);

  const leaderSpecialty = profile?.specialties?.name || profile?.specialty || 'General';

  useEffect(() => {
    const checkAndOpenTicket = async () => {
      if (loading) return;
      const params = new URLSearchParams(location.search || window.location.search);
      const ticketId = params.get('ticket');
      
      if (!ticketId) return;

      let targetReq = requests.find((r: any) => 
        String(r.id) === String(ticketId) ||
        r.request_tasks?.some((t: any) => String(t.id) === String(ticketId))
      );

      if (!targetReq) {
        let { data: fetchedReq } = await supabase
          .from('requests')
          .select(`
            *, 
            organizations ( name, logo_url ), 
            priorities!requests_priority_id_fkey(id, level, color_code, weight),
            request_categories ( name ), 
            file_extensions ( extension ),
            profiles!requests_requester_id_fkey(full_name),
            request_tasks ( * ) 
          `)
          .eq('id', ticketId)
          .eq('is_active', true) 
          .maybeSingle();

        if (!fetchedReq) {
          const { data: taskData } = await supabase
            .from('request_tasks')
            .select('request_id')
            .eq('id', ticketId)
            .maybeSingle();

          if (taskData?.request_id) {
            const { data: parentReq } = await supabase
              .from('requests')
              .select(`
                *, 
                organizations ( name, logo_url ), 
                priorities!requests_priority_id_fkey(id, level, color_code, weight),
                request_categories ( name ), 
                file_extensions ( extension ),
                profiles!requests_requester_id_fkey(full_name),
                request_tasks ( * ) 
              `)
              .eq('id', taskData.request_id)
              .eq('is_active', true) 
              .maybeSingle();
            fetchedReq = parentReq;
          }
        }
        if (fetchedReq) targetReq = fetchedReq;
      }

      if (targetReq) {
        setSelectedRequest(targetReq);
      }
      window.history.replaceState(null, '', window.location.pathname + window.location.hash);
    };

    checkAndOpenTicket();
  }, [loading, requests, location.search]);

  useEffect(() => {
    if (user?.id) {
      const savedFilter = localStorage.getItem(`tolko_clients_filter_admin_${user.id}`);
      if (savedFilter) {
        try {
          setSelectedClients(JSON.parse(savedFilter));
        } catch (e) {
          console.error("Error leyendo el filtro guardado", e);
        }
      }
    }
  }, [user?.id]);

  useEffect(() => {
    setModalCurrentPage(1);
    if (!statModalType) {
      setModalSearchQuery('');
      setModalClientFilter('todos');
    }
  }, [statModalType, modalSearchQuery, modalClientFilter, modalItemsPerPage]);

  useEffect(() => {
    fetchDashboardData();
    fetchModalCatalogs(); 

    const channel = supabase.channel('admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, fetchDashboardData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'request_tasks' }, fetchDashboardData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'task_adjustments' }, fetchDashboardData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const titles: Record<string, string> = {
      dashboard: 'Admin Pipeline',
      clientes: 'Gestión de Clientes',
      encargados: 'Encargados de Cuenta',
      equipo: 'Team Tolko',
      reportes: 'Business Intelligence',
      historial: 'Historial Global',
      configuracion: 'Configuración del Sistema'
    };
    document.title = `Inicio - ${titles[activeTab] || 'Panel de Control'}`;
  }, [activeTab]);

  const fetchModalCatalogs = async () => {
    try {
      const [orgsRes, membersRes] = await Promise.all([
        supabase.from('organizations').select('id, name, logo_url').eq('is_active', true).order('name'),
        supabase.from('organization_members').select('organization_id, profiles(id, full_name)')
      ]);

      if (orgsRes.data) setAllClients(orgsRes.data);
      
      if (membersRes.data) {
        const formattedUsers = membersRes.data
          .filter((m: any) => m.profiles)
          .map((m: any) => ({
            organization_id: m.organization_id,
            id: m.profiles.id,
            full_name: m.profiles.full_name
          }));
        setAllClientUsers(formattedUsers);
      }
    } catch (error) {
      console.error("Error cargando catálogos del modal", error);
    }
  };

  const fetchDashboardData = async () => {
    if (requests.length === 0) setLoading(true);
    
    try {
      const [requestsRes, prioritiesRes, auditRes, staffRes, specsRes] = await Promise.all([
        supabase.from('requests').select(`
          *, 
          specialty_ids,
          organizations ( name, logo_url ), 
          priorities!requests_priority_id_fkey(id, level, color_code, weight),
          request_categories ( name ), 
          file_extensions ( extension ),
          profiles!requests_requester_id_fkey(full_name),
          request_tasks ( * ) 
        `)
        .eq('is_active', true) // 🔥 AQUÍ ESTÁ EL BLINDAJE: Solo solicitudes activas
        .order('created_at', { ascending: false }),
        supabase.from('priorities').select('*'),
        supabase.from('audit_logs').select('*, profiles(full_name, avatar_url)').order('created_at', { ascending: false }).limit(15),
        supabase.from('profiles').select('id, full_name, role_id, specialty_id, internal_roles(name), specialties(name)').not('role_id', 'is', null),
        supabase.from('specialties').select('id, name')
      ]);

      if (prioritiesRes.data) setPrioritiesCatalog(prioritiesRes.data);
      if (auditRes.data) setActivityFeed(auditRes.data);
      if (specsRes.data) setSpecialtiesCatalog(specsRes.data);
      
      if (staffRes.data) {
        const formattedStaff = staffRes.data.map((s: any) => ({
          id: s.id,
          full_name: s.full_name,
          role_id: s.role_id,
          specialty_id: s.specialty_id,
          internal_role: s.internal_roles?.name || null,
          specialty: s.specialties?.name || null
        }));
        setStaffCatalog(formattedStaff);
      }

      if (requestsRes.data) {
        const formatted = requestsRes.data.map((r: any) => {
          const tasks = r.request_tasks || [];
          const hasCorrections = tasks.some((t: any) => t.status === 'con_correcciones');
          const hasDeliveries = tasks.some((t: any) => ['entregado', 'aprobado_interno', 'aprobado'].includes(t.status)) || r.status === 'completado';
          const isNew = (r.status === 'pendiente' || r.status === 'en_proceso') && !hasCorrections && !hasDeliveries;
          
          const latestUpdate = tasks.reduce((latest: number, t: any) => {
             const d = new Date(t.updated_at).getTime();
             return d > latest ? d : latest;
          }, new Date(r.request_date || r.created_at).getTime());

          return {
            ...r,
            id: r.id, 
            proyecto: r.title, 
            empresa: r.organizations?.name || 'Desconocida',
            logo_url: r.organizations?.logo_url || '',
            solicitante: r.profiles?.full_name || 'Desconocido',
            prioridad: Array.isArray(r.priorities) ? r.priorities[0]?.level : (r.priorities?.level || 'Normal'), 
            prioColor: Array.isArray(r.priorities) ? r.priorities[0]?.color_code : (r.priorities?.color_code || 'var(--color-luxury-gray)'),
            prioWeight: Array.isArray(r.priorities) ? r.priorities[0]?.weight : (r.priorities?.weight || 0), 
            category: r.request_categories?.name || 'N/A',
            format: r.file_extensions?.extension || 'N/A', 
            quantity: r.quantity,
            external_url: r.external_resource_url, 
            department: r.department, 
            status: r.status,
            request_date: r.request_date,
            created_at: r.created_at, 
            due_date: r.due_date,
            frequency: r.frequency || r.frecuencia || 'N/A',
            needs_design: r.needs_design, 
            needs_dev: r.needs_dev,
            needs_av: r.needs_av, 
            needs_copy: r.needs_copy,
            needs_prod: r.needs_prod,
            needs_staff: r.needs_staff,
            needs_rp: r.needs_rp,
            max_revisions: r.max_revisions, 
            revisions_used: r.revisions_used,
            hasCorrections,
            hasDeliveries,
            isNew,
            latestUpdate
          };
        });

        setRequests(formatted);

        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const monthlyCounts: any = {};
        formatted.forEach((req: any) => {
          const dateStr = req.request_date || req.created_at;
          if (dateStr) {
            const parts = String(dateStr).split('T')[0].split('-');
            if (parts.length >= 2) {
              const ymKey = `${parts[0]}-${parts[1]}`;
              const mName = `${monthNames[parseInt(parts[1], 10) - 1]} ${parts[0].slice(-2)}`;
              if (!monthlyCounts[ymKey]) monthlyCounts[ymKey] = { label: mName, count: 0 };
              monthlyCounts[ymKey].count += 1;
            }
          }
        });

        const sortedKeys = Object.keys(monthlyCounts).sort();
        setMonthlyFlowData(sortedKeys.slice(-12).map(k => ({ name: monthlyCounts[k].label, solicitudes: monthlyCounts[k].count })));

        const specialtyMap: Record<string, number> = {};
        const localSpecs = specsRes?.data || [];

        formatted.forEach((req: any) => {
          if (req.specialty_ids && req.specialty_ids.length > 0) {
            req.specialty_ids.forEach((sid: number) => {
              const specObj = localSpecs.find((s:any) => s.id === sid);
              const specName = specObj ? specObj.name : 'General';
              specialtyMap[specName] = (specialtyMap[specName] || 0) + 1;
            });
          } else {
            if (req.needs_design) specialtyMap['Diseño'] = (specialtyMap['Diseño'] || 0) + 1;
            if (req.needs_dev) specialtyMap['Programación'] = (specialtyMap['Programación'] || 0) + 1;
            if (req.needs_av) specialtyMap['Audiovisual'] = (specialtyMap['Audiovisual'] || 0) + 1;
            if (req.needs_copy) specialtyMap['Contenido'] = (specialtyMap['Contenido'] || 0) + 1;
            if (req.needs_prod) specialtyMap['Producción'] = (specialtyMap['Producción'] || 0) + 1;
            if (req.needs_staff) specialtyMap['Staff'] = (specialtyMap['Staff'] || 0) + 1;
            if (req.needs_rp) specialtyMap['Relaciones Públicas'] = (specialtyMap['Relaciones Públicas'] || 0) + 1;
          }
        });

        const dynamicDisciplineData = Object.keys(specialtyMap)
          .map(key => ({ name: key, value: specialtyMap[key] }))
          .filter(d => d.value > 0)
          .sort((a, b) => b.value - a.value);

        setDisciplineDistribution(dynamicDisciplineData);

        const catCounts = formatted.reduce((acc: any, req: any) => {
          const categoryName = req.category || 'General';
          acc[categoryName] = (acc[categoryName] || 0) + 1;
          return acc;
        }, {});
        setDeliverableDistribution(Object.keys(catCounts).map(k => ({ name: k, total: catCounts[k] })).sort((a, b) => b.total - a.total).slice(0, 5));

        const cliStatsMap: Record<string, { name: string, total: number, logo_url: string }> = {};
        formatted.forEach((req: any) => {
          const name = req.empresa || 'Desconocida';
          if (!cliStatsMap[name]) {
            cliStatsMap[name] = { name, total: 0, logo_url: req.logo_url || '' };
          }
          cliStatsMap[name].total += 1;
        });
        setClientDistribution(Object.values(cliStatsMap).sort((a, b) => b.total - a.total).slice(0, 5));
      }
    } catch (error) {
      console.error('Error cargando Dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForceComplete = async (requestId: string) => {
    const isDarkTheme = document.documentElement.classList.contains('dark');
    
    const result = await Swal.fire({
      title: '¿SOLICITAR CIERRE AL EQUIPO?',
      html: `<p style="font-size: 13px; color: ${isDarkTheme ? '#aaa' : '#666'};"><br/>Esto activará el <b>Modo Rehén</b> para las áreas pendientes.<br/>Su plataforma se bloqueará hasta que entreguen.</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#D3002D',
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'SÍ, EXIGIR CIERRE',
      cancelButtonText: 'CANCELAR',
      background: isDarkTheme ? '#0F0F12' : '#fff',
      color: isDarkTheme ? '#fff' : '#1f2937'
    });

    if (!result.isConfirmed) return;
    setLoading(true);

    try {
      const { error: reqError } = await supabase.from('requests').update({ 
        cierre_solicitado: true
      }).eq('id', requestId);
      if (reqError) throw reqError;

      fetchDashboardData(); 

      Swal.fire({ title: '¡Equipo Bloqueado! 🔒', icon: 'success', confirmButtonColor: '#D3002D' });
    } catch (err: any) { Swal.fire('Error', err.message, 'error'); setLoading(false); }
  };

  const handleUnlockRequest = async (requestId: string) => {
    try {
      await supabase.from('requests').update({ cierre_solicitado: false }).eq('id', requestId);
      fetchDashboardData(); 
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleRestoreRequest = async (requestId: string) => {
    const isDarkTheme = document.documentElement.classList.contains('dark');
    
    const result = await Swal.fire({
      title: '¿REVIVIR SOLICITUD?',
      text: 'Esta solicitud regresará al pipeline activo en estado "En Proceso". ¿Proceder?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'SÍ, REVIVIRLA',
      cancelButtonText: 'CANCELAR',
      background: isDarkTheme ? '#0F0F12' : '#fff',
      color: isDarkTheme ? '#fff' : '#1f2937'
    });

    if (!result.isConfirmed) return;

    try {
      const { error } = await supabase.from('requests').update({ status: 'en_proceso' }).eq('id', requestId);
      if (error) throw error;
      
      setRequests(prevRequests => 
        prevRequests.map(req => req.id === requestId ? { ...req, status: 'en_proceso' } : req)
      );

      Swal.fire({ 
        title: '¡REVERTIDO!', 
        text: 'La solicitud volvió a estar activa.', 
        icon: 'success', 
        confirmButtonColor: '#D3002D',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err: any) { Swal.fire('Error', err.message, 'error'); }
  };

  const handleToggleClientFilter = (clientName: string) => {
    setSelectedClients(prev => {
      const next = prev.includes(clientName) ? prev.filter(c => c !== clientName) : [...prev, clientName];
      if (user?.id) localStorage.setItem(`tolko_clients_filter_admin_${user.id}`, JSON.stringify(next));
      return next;
    });
  };

  const handleClearClientFilter = () => {
    setSelectedClients([]);
    if (user?.id) localStorage.setItem(`tolko_clients_filter_admin_${user.id}`, JSON.stringify([]));
    setShowClientDropdown(false);
  };

  const leaderSpecialtyId = profile?.specialty_id;

  const isMyAreaPending = (r: any) => {
    if (['completado', 'entregado', 'aprobado'].includes(r.status)) return false;

    const myTask = (r.request_tasks || []).find((t: any) => t.specialty_id === leaderSpecialtyId);

    if (!myTask) {
        if (leaderSpecialtyId && r.specialty_ids && r.specialty_ids.includes(leaderSpecialtyId)) return true;
        
        const norm = (s: string) => (s || '').toLowerCase().trim();
        const leaderSpecialtyName = norm(profile?.specialties?.name || profile?.specialty || '');
        const legacyMap: Record<string, string> = {
          'diseño': 'needs_design', 'programación': 'needs_dev', 'programacion': 'needs_dev',
          'audiovisual': 'needs_av', 'contenido': 'needs_copy', 'producción': 'needs_prod',
          'produccion': 'needs_prod', 'staff': 'needs_staff', 'rp': 'needs_rp',
          'relaciones públicas': 'needs_rp', 'relaciones publicas': 'needs_rp'
        };
        const columnKey = legacyMap[leaderSpecialtyName];
        if (columnKey && r[columnKey]) return true;
        return false;
    }

    const isTaskDone = ['aprobado', 'aprobado_interno', 'entregado'].includes(myTask.status);
    const assignees = myTask.task_assignees || [];
    const allAssigneesDone = assignees.length > 0 && assignees.every((a: any) => ['aprobado', 'aprobado_interno', 'entregado'].includes(a.status));

    if (isTaskDone || allAssigneesDone) return false;

    return true;
  };

  // 🔥 LÓGICA MAESTRA: FILTRADO POR FRECUENCIA Y POR RANGO DE FECHAS (DE: A:)
  const globalFilteredRequests = requests.filter(req => {
    const dateStr = req.request_date || req.created_at;
    if (!dateStr) return false;
    
    const reqDateOnly = String(dateStr).split('T')[0];

    // 1. FILTRO DE FECHAS (Calendario Libre)
    if (dateFrom && reqDateOnly < dateFrom) return false;
    if (dateTo && reqDateOnly > dateTo) return false;

    // 2. FILTRO DE FRECUENCIA PREDEFINIDA
    if (frequencyFilter !== 'todos') {
      const [year, month, day] = reqDateOnly.split('-');
      const reqDateObj = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
      const now = new Date();
      
      const diffTime = Math.abs(now.getTime() - reqDateObj.getTime());
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      switch (frequencyFilter) {
        case 'diaria': if(diffDays > 1.5) return false; break;
        case 'semanal': if(diffDays > 7) return false; break;
        case 'mensual': if(diffDays > 30) return false; break;
        case 'trimestral': if(diffDays > 90) return false; break;
        case 'semestral': if(diffDays > 180) return false; break;
        case 'anual': if(diffDays > 365) return false; break;
      }
    }
    
    return true;
  });

  const today = new Date();
  today.setHours(0,0,0,0);

  const myRealOverdueRequests = requests.filter(r => {
    const isGloballyPending = !['completado', 'entregado', 'aprobado'].includes(r.status);
    if (!r.cierre_solicitado || !isGloballyPending) return false;
    return isMyAreaPending(r); 
  });

  // Métricas reaccionan al filtro de fechas
  const stats = {
    total: globalFilteredRequests.length,
    enProceso: globalFilteredRequests.filter(r => r.status === 'en_proceso').length,
    completados: globalFilteredRequests.filter(r => r.status === 'completado').length,
    vencidos: globalFilteredRequests.filter(r => r.due_date && new Date(r.due_date) < today && r.status !== 'completado').length
  };

  const uniqueClients = Array.from(new Set(globalFilteredRequests.map(r => r.empresa)));
  const activeRequests = globalFilteredRequests.filter(r => r.status !== 'completado');

  const filteredPipelineRequests = activeRequests.filter(req => {
    if (pipelineTab === 'nuevas' && !req.isNew) return false;
    if (pipelineTab === 'cambios' && !req.hasCorrections) return false;
    if (pipelineTab === 'entregadas' && !req.hasDeliveries) return false;

    const matchesSearch = req.proyecto.toLowerCase().includes(searchPipeline.toLowerCase()) || req.empresa.toLowerCase().includes(searchPipeline.toLowerCase());
    const matchesClient = selectedClients.length === 0 || selectedClients.includes(req.empresa);
    const matchesPriority = priorityFilter === 'todos' || req.prioridad === priorityFilter;
    
    return matchesSearch && matchesClient && matchesPriority;
  }).sort((a, b) => {
    if (a.hasCorrections || b.hasCorrections) {
      if (a.hasCorrections && !b.hasCorrections) return -1;
      if (!a.hasCorrections && b.hasCorrections) return 1;
      return b.latestUpdate - a.latestUpdate;
    }
    if (sortBy === 'urgentes') {
      if (!a.due_date) return 1; if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    if (sortBy === 'prioridad') return b.prioWeight - a.prioWeight;
    return new Date(b.request_date || b.created_at).getTime() - new Date(a.request_date || a.created_at).getTime();
  });

  const currentPipelineItems = filteredPipelineRequests.slice((currentPage * itemsPerPage) - itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredPipelineRequests.length / itemsPerPage);

  const getStatModalRequests = () => {
    let base: any[] = [];
    switch (statModalType) {
      case 'total': base = globalFilteredRequests; break;
      case 'en_proceso': base = globalFilteredRequests.filter(r => r.status === 'en_proceso'); break;
      case 'completados': base = globalFilteredRequests.filter(r => r.status === 'completado'); break;
      case 'vencidos': base = globalFilteredRequests.filter(r => r.due_date && new Date(r.due_date) < today && r.status !== 'completado'); break;
      default: base = []; break;
    }

    return base.filter(req => {
      const titleStr = req.proyecto || '';
      const orgName = req.empresa || '';
      const reqName = req.solicitante || '';
      
      const matchesSearch = modalSearchQuery === '' || 
        titleStr.toLowerCase().includes(modalSearchQuery.toLowerCase()) || 
        orgName.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
        reqName.toLowerCase().includes(modalSearchQuery.toLowerCase());
        
      const matchesClient = modalClientFilter === 'todos' || req.organization_id === modalClientFilter;
      
      return matchesSearch && matchesClient;
    });
  };

  const filteredModalReqs = getStatModalRequests();
  const totalModalPages = Math.ceil(filteredModalReqs.length / modalItemsPerPage);
  const paginatedModalReqs = filteredModalReqs.slice((modalCurrentPage - 1) * modalItemsPerPage, modalCurrentPage * modalItemsPerPage);

  const timeAgo = (dateStr: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return `${seconds} seg`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} h`;
    return `${Math.floor(hours / 24)} d`;
  };

  // Reset de página al cambiar cualquier filtro maestro
  useEffect(() => { setCurrentPage(1); }, [searchPipeline, selectedClients, priorityFilter, frequencyFilter, dateFrom, dateTo, sortBy, itemsPerPage, pipelineTab]);

  return (
    <>
      <HostageOverlay 
        overdueRequests={myRealOverdueRequests} 
        onOpenTask={(req) => setSelectedRequest(req)} 
        userName={profile?.full_name?.split(' ')[0] || 'Admin'} 
      />

      <div className="flex min-h-screen bg-gray-50 dark:bg-luxury-dark text-gray-900 dark:text-gray-200 transition-colors duration-300 font-sans">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
          
          <div className="absolute top-0 right-0 p-4 md:p-8 z-50 pointer-events-none w-full flex justify-end">
            <div className="pointer-events-auto">
              <NotificationBell />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar h-full w-full">
            <section className="p-10 space-y-8 max-w-7xl mx-auto w-full pb-32 pt-16 md:pt-10">
              
              {activeTab === 'dashboard' && (
                <>
                  <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border p-4 sm:p-5 rounded-2xl shadow-sm transition-colors duration-300 mt-2">
                    <div className="shrink-0">
                      <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
                        <Filter size={16} className="text-luxury-red" />
                        Filtro de Frecuencia
                      </h3>
                      <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Métricas y panel en tiempo real.</p>
                    </div>
                    
                    <div className="w-full xl:w-auto flex flex-col sm:flex-row items-center gap-3">
                      {/* 🔥 NUEVO: FILTRO POR RANGO DE FECHAS */}
                      <div className="flex items-center w-full sm:w-auto gap-2 bg-gray-50 dark:bg-[#0a0a0c] border border-gray-200 dark:border-luxury-border rounded-xl px-3 py-2 shadow-sm">
                        <Calendar size={14} className="text-luxury-red shrink-0" />
                        <span className="text-[10px] font-black uppercase text-gray-400">De:</span>
                        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="bg-transparent text-xs font-bold uppercase text-gray-700 dark:text-gray-300 outline-none w-full cursor-pointer" />
                        <span className="text-[10px] font-black uppercase text-gray-400 ml-1">A:</span>
                        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="bg-transparent text-xs font-bold uppercase text-gray-700 dark:text-gray-300 outline-none w-full cursor-pointer" />
                      </div>

                      <select 
                        value={frequencyFilter} 
                        onChange={e => setFrequencyFilter(e.target.value)} 
                        className="w-full sm:w-auto bg-gray-50 dark:bg-[#0a0a0c] border border-gray-200 dark:border-luxury-border rounded-xl p-3 text-xs text-gray-900 dark:text-white font-bold outline-none cursor-pointer uppercase tracking-wider transition-colors duration-300"
                      >
                        <option value="todos">Histórico (Todas)</option>
                        <option value="diaria">Diarias (24h)</option>
                        <option value="semanal">Semanales (7 días)</option>
                        <option value="mensual">Mensuales (30 días)</option>
                        <option value="trimestral">Trimestrales (90 días)</option>
                        <option value="semestral">Semestrales (180 días)</option>
                        <option value="anual">Anuales (365 días)</option>
                      </select>

                      <button 
                        onClick={() => setIsNewReqModalOpen(true)}
                        className="w-full sm:w-auto bg-luxury-red hover:bg-red-700 text-white px-5 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 uppercase tracking-widest shrink-0"
                      >
                        <Plus size={16} strokeWidth={3}/> SOLICITUD
                      </button>
                    </div>
                  </div>

                  {/* 🔥 TARJETAS DE ESTADÍSTICAS CON SKELETON 🔥 */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 text-3xl md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <StatCard 
                        label="Total Pedidos" 
                        value={stats.total} 
                        loading={loading}
                        icon={<LayoutGrid className="text-gray-900 dark:text-white transition-colors duration-300"/>} 
                        onClick={() => setStatModalType('total')}
                      />
                      
                      <StatCard 
                        label="Producción Activa" 
                        value={stats.enProceso} 
                        loading={loading}
                        icon={<Activity className="text-blue-500 dark:text-blue-400"/>} 
                        color="border-blue-500/20" 
                        onClick={() => setStatModalType('en_proceso')}
                      />
                      
                      <div 
                        onClick={() => setStatModalType('vencidos')}
                        className={`cursor-pointer p-6 rounded-2xl border flex flex-col justify-between h-32 relative overflow-hidden transition-all duration-300 hover:scale-[0.98] ${stats.vencidos > 0 && !loading ? 'bg-red-50 dark:bg-red-950/20 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)] animate-pulse' : 'bg-white dark:bg-luxury-card border-gray-200 dark:border-luxury-border shadow-sm dark:shadow-none'}`}
                      >
                        <div className="flex justify-between items-start z-10 pointer-events-none">
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest transition-colors duration-300">Focos Rojos</p>
                          <AlertTriangle className={stats.vencidos > 0 && !loading ? 'text-red-500' : 'text-gray-400 dark:text-gray-600 transition-colors duration-300'} size={20}/>
                        </div>
                        <div className="z-10 pointer-events-none">
                          {loading ? (
                             <Skeleton className="h-8 w-16 rounded-md mt-1" />
                          ) : (
                             <h2 className={`text-3xl font-black transition-colors duration-300 ${stats.vencidos > 0 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>{stats.vencidos}</h2>
                          )}
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1 transition-colors duration-300">Solicitudes Vencidas</p>
                        </div>
                      </div>
                      
                      <StatCard 
                        label="Entregados" 
                        value={stats.completados} 
                        loading={loading}
                        icon={<CheckCircle2 className="text-green-500"/>} 
                        onClick={() => setStatModalType('completados')}
                      />
                    </div>

                    {/* 🔥 TARJETAS DE PRIORIDADES CON SKELETON 🔥 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {['Alta', 'Media', 'Baja'].map((prio) => (
                        <button key={prio} type="button" onClick={() => setActivePriorityModal(prio)} className="p-6 rounded-2xl border border-gray-200 dark:border-luxury-border bg-white dark:bg-luxury-card shadow-sm dark:shadow-none hover:border-luxury-red/40 dark:hover:border-luxury-red/40 transition-all duration-300 text-left h-36 flex flex-col justify-between group cursor-pointer">
                          <div className="flex justify-between items-start w-full">
                            {prio === 'Alta' ? <Flame className="text-luxury-red" size={24}/> : prio === 'Media' ? <Clock className="text-amber-500" size={24}/> : <CheckCircle2 className="text-cyan-500" size={24}/>}
                            <span className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[10px] font-black px-2 py-1 rounded-md text-gray-600 dark:text-gray-400 transition-colors duration-300">
                              {loading ? (
                                 <Skeleton className="w-10 h-3 inline-block align-middle" />
                              ) : (
                                 `${globalFilteredRequests.filter(r => r.prioridad === prio && r.status !== 'completado').length} activas`
                              )}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider transition-colors duration-300">{prio}</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 transition-colors duration-300">Panel de supervisión <ArrowRight size={10} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity"/></p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 🔥 GRÁFICAS CON SKELETON 🔥 */}
                  <div className="w-full min-w-0 overflow-hidden">
                    <ClientAnalytics 
                      loading={loading}
                      monthlyData={monthlyFlowData} 
                      disciplineData={disciplineDistribution} 
                      deliverableData={deliverableDistribution}
                      clientData={clientDistribution}
                    />
                  </div>

                  {/* 🔥 ACTIVIDAD RECIENTE CON SKELETON 🔥 */}
                  <div className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border shadow-sm dark:shadow-none transition-colors duration-300 rounded-2xl p-4 flex flex-col">
                    <h3 className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4 px-2 transition-colors duration-300"><History size={14} className="text-luxury-red"/> Actividad Reciente</h3>
                    <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2 px-2">
                      {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="min-w-[280px] bg-gray-50 dark:bg-luxury-dark/40 border border-gray-200 dark:border-luxury-border/50 rounded-xl p-3 flex gap-3 items-center shrink-0">
                            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                            <div className="w-full space-y-2">
                              <Skeleton className="h-3 w-3/4 rounded-md" />
                              <Skeleton className="h-2 w-1/2 rounded-md" />
                            </div>
                          </div>
                        ))
                      ) : activityFeed.length > 0 ? (
                        activityFeed.map((log: any) => (
                          <div key={log.id} className="min-w-[280px] bg-gray-50 dark:bg-luxury-dark/40 border border-gray-200 dark:border-luxury-border/50 rounded-xl p-3 flex gap-3 items-center shrink-0 transition-colors duration-300">
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border flex items-center justify-center transition-colors duration-300"><span className="text-xs font-bold text-gray-500 uppercase">{log.profiles?.full_name?.slice(0,2)}</span></div>
                            <div>
                              <p className="text-[10px] text-gray-600 dark:text-gray-300 transition-colors duration-300"><span className="font-bold text-gray-900 dark:text-white">{log.profiles?.full_name?.split(' ')[0]}</span><span className="text-gray-500"> actualizó </span><span className="font-bold text-luxury-red uppercase">{log.table_name}</span></p>
                              <p className="text-[9px] text-gray-400 dark:text-gray-600 font-bold uppercase mt-0.5 transition-colors duration-300">{timeAgo(log.created_at)}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                         <div className="text-xs text-gray-400 py-2 italic px-2">Sin actividad reciente...</div>
                      )}
                    </div>
                  </div>

                  <div className="w-full space-y-4">
                    <div className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border shadow-sm dark:shadow-none transition-colors duration-300 rounded-2xl p-4 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-luxury-border pb-4 mb-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 flex items-center gap-2 transition-colors duration-300">
                          <SlidersHorizontal size={14} className="text-luxury-red"/> Pipeline de Producción
                        </h3>

                        <div className="flex items-center flex-wrap gap-2">
                          <button onClick={() => setPipelineTab('todas')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${pipelineTab === 'todas' ? 'bg-gray-900 dark:bg-gray-700 text-white border border-gray-800' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-transparent hover:border-gray-300 dark:hover:border-zinc-700'}`}>
                            Todas
                          </button>
                          <button onClick={() => setPipelineTab('nuevas')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${pipelineTab === 'nuevas' ? 'bg-blue-500 text-white border border-blue-600' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-transparent hover:border-gray-300 dark:hover:border-zinc-700'}`}>
                            Nuevas
                          </button>
                          <button onClick={() => setPipelineTab('cambios')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${pipelineTab === 'cambios' ? 'bg-red-500 text-white border border-red-600' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-transparent hover:border-gray-300 dark:hover:border-zinc-700'}`}>
                            Con Cambios
                          </button>
                          <button onClick={() => setPipelineTab('entregadas')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${pipelineTab === 'entregadas' ? 'bg-green-500 text-white border border-green-600' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-transparent hover:border-gray-300 dark:hover:border-zinc-700'}`}>
                            Entregadas
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
                        <div className="relative lg:col-span-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 transition-colors duration-300" size={14} />
                          <input type="text" placeholder="Buscar proyecto..." value={searchPipeline} onChange={e => setSearchPipeline(e.target.value)} className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl py-2.5 pl-9 pr-3 text-xs text-gray-900 dark:text-white outline-none transition-colors duration-300" />
                        </div>
                        
                        <div className="relative w-full z-20">
                          <div 
                            onClick={() => setShowClientDropdown(!showClientDropdown)}
                            className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl p-2.5 text-xs text-gray-600 dark:text-gray-400 font-bold outline-none cursor-pointer flex justify-between items-center h-[38px] transition-colors duration-300"
                          >
                            <span className="truncate">
                              {selectedClients.length === 0 
                                ? 'Todos los Clientes' 
                                : `${selectedClients.length} filtrados`}
                            </span>
                            <Filter size={14} className="shrink-0"/>
                          </div>

                          {showClientDropdown && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setShowClientDropdown(false)} />
                              <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-[#141419] border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto custom-scrollbar p-2 space-y-1">
                                <div 
                                  onClick={handleClearClientFilter}
                                  className={`p-2.5 rounded-lg text-xs font-black uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-2 ${selectedClients.length === 0 ? 'bg-luxury-red/10 text-luxury-red' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400'}`}
                                >
                                  <Building2 size={14}/> Mostrar Todos
                                </div>
                                <div className="border-t border-gray-100 dark:border-zinc-800/80 my-1"></div>
                                {uniqueClients.map(cli => (
                                  <div 
                                    key={cli as string} 
                                    onClick={() => handleToggleClientFilter(cli as string)}
                                    className="p-2 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-2.5 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300"
                                  >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${selectedClients.includes(cli as string) ? 'bg-luxury-red border-luxury-red text-white' : 'border-gray-300 dark:border-zinc-600'}`}>
                                      {selectedClients.includes(cli as string) && <CheckCircle2 size={12} strokeWidth={4}/>}
                                    </div>
                                    <span className="truncate uppercase">{cli as string}</span>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                        
                        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl p-2.5 text-xs text-gray-600 dark:text-gray-400 font-bold outline-none transition-colors duration-300 cursor-pointer">
                          <option value="todos">Prioridades</option>
                          <option value="Alta">Alta</option>
                          <option value="Media">Media</option>
                          <option value="Baja">Baja</option>
                        </select>

                        <div className="relative">
                          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 transition-colors duration-300" size={14} />
                          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl py-2.5 pl-9 pr-3 text-xs text-gray-600 dark:text-gray-400 font-black outline-none appearance-none transition-colors duration-300 cursor-pointer">
                            <option value="urgentes">Próximos a Vencer</option>
                            <option value="prioridad">Por Prioridad</option>
                            <option value="recientes">Más Recientes</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 w-full">
                      {/* 🔥 APLICAMOS SKELETONS AL PIPELINE 🔥 */}
                      {loading ? (
                        <div className="overflow-x-auto custom-scrollbar w-full pb-2">
                          <div className="min-w-[1000px] space-y-4 pr-2">
                            {Array.from({ length: itemsPerPage }).map((_, i) => (
                              <RequestRowSkeleton key={i} />
                            ))}
                          </div>
                        </div>
                      ) : currentPipelineItems.length > 0 ? (
                        <div className="overflow-x-auto custom-scrollbar w-full pb-2">
                          <div className="min-w-[1000px] space-y-4 pr-2">
                            {currentPipelineItems.map(req => (
                              <div key={req.id} className="relative transition-all duration-300">
                                {req.hasCorrections && (
                                  <span className="absolute -top-1.5 -left-1.5 z-10 bg-red-600 border-2 border-white dark:border-luxury-dark text-white p-1.5 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.6)] animate-pulse" title="¡Correcciones Pendientes!">
                                    <BellRing size={12} strokeWidth={3}/>
                                  </span>
                                )}
                                <RequestRow 
                                  request={req} 
                                  onEdit={setSelectedRequest} 
                                  onForceComplete={handleForceComplete}
                                  onRestore={handleRestoreRequest}
                                  onUnlock={handleUnlockRequest}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500 bg-white dark:bg-luxury-card rounded-2xl border border-gray-200 dark:border-luxury-border transition-colors duration-300">
                          {pipelineTab === 'cambios' ? '¡Todo limpio! No hay tareas con correcciones pendientes. 🎉' : 'No hay solicitudes activas.'}
                        </div>
                      )}
                      
                      {!loading && filteredPipelineRequests.length > 0 && (
                        <div className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border shadow-sm dark:shadow-none transition-colors duration-300 rounded-2xl p-4 flex justify-between items-center">
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                            <span>Mostrar</span>
                            <select value={itemsPerPage} onChange={e => setItemsPerPage(parseInt(e.target.value))} className="bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-lg p-1 text-gray-900 dark:text-white font-bold transition-colors duration-300 cursor-pointer"><option value={5}>5</option><option value={10}>10</option><option value={20}>20</option></select>
                          </div>
                          <div className="flex items-center gap-3">
                            <button type="button" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border p-2 rounded-xl disabled:opacity-30 text-gray-900 dark:text-white transition-colors duration-300 cursor-pointer"><ChevronLeft size={16}/></button>
                            <span className="text-xs font-black tracking-widest text-gray-500 dark:text-gray-400 uppercase transition-colors duration-300">Pág <span className="text-gray-900 dark:text-white">{currentPage}</span> / {totalPages}</span>
                            <button type="button" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border p-2 rounded-xl disabled:opacity-30 text-gray-900 dark:text-white transition-colors duration-300 cursor-pointer"><ChevronRight size={16}/></button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'clientes' && <ClientsPage />}
              {activeTab === 'encargados' && <ManagersPage />}
              {activeTab === 'equipo' && <TeamPage />}
              {activeTab === 'reportes' && <AdminReports />} 
              {activeTab === 'historial' && <HistoryPage />}
              {activeTab === 'configuracion' && <SettingsPage />}
              {activeTab === 'calendario' && <CalendarPage />}

            </section>
          </div>
        </main>

        <PriorityListModal 
          isOpen={activePriorityModal} 
          onClose={() => setActivePriorityModal(null)} 
          requests={globalFilteredRequests} 
          onEditTask={setSelectedRequest}
        />

        <EditRequestModal 
          isOpen={selectedRequest !== null} 
          onClose={() => setSelectedRequest(null)} 
          request={selectedRequest}
          staffCatalog={staffCatalog}
          prioritiesCatalog={prioritiesCatalog}
          onRefresh={fetchDashboardData}
        />

        <NewRequestModal 
          isOpen={isNewReqModalOpen} 
          onClose={() => setIsNewReqModalOpen(false)} 
          isAdminMode={true} 
          clients={allClients} 
          clientUsers={allClientUsers} 
          onRefresh={fetchDashboardData} 
        />

        {statModalType && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-gray-900/40 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-luxury-border w-full max-w-[95vw] xl:max-w-[1400px] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              
              <div className="p-6 border-b border-gray-200 dark:border-luxury-border flex justify-between items-center bg-gray-50 dark:bg-black/40 shrink-0">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
                    <LayoutGrid size={18} className="text-luxury-red"/> 
                    Control de Solicitudes - {statModalType.replace(/_/g, ' ')}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Supervisión y auditoría de la mesa operativa.
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => setStatModalType(null)} 
                  className="bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <X size={18}/>
                </button>
              </div>

              <div className="p-4 border-b border-gray-200 dark:border-luxury-border bg-white dark:bg-[#0a0a0c] shrink-0 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={14} />
                  <input 
                    type="text" 
                    placeholder="Buscar por proyecto, marca o solicitante..." 
                    value={modalSearchQuery}
                    onChange={(e) => setModalSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl py-2 pl-9 pr-3 text-xs text-gray-900 dark:text-white outline-none focus:border-luxury-red dark:focus:border-luxury-red transition-colors"
                  />
                </div>
                <div className="relative w-full sm:w-64 shrink-0">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={14} />
                  <select 
                    value={modalClientFilter}
                    onChange={(e) => setModalClientFilter(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl py-2 pl-9 pr-8 text-xs text-gray-900 dark:text-white outline-none appearance-none cursor-pointer focus:border-luxury-red dark:focus:border-luxury-red font-bold transition-colors"
                  >
                    <option value="todos">Todas las Marcas</option>
                    {allClients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4 flex-1 bg-gray-50/50 dark:bg-[#0a0a0c]/50">
                {/* 🔥 SKELETONS Y PAGINACIÓN DEL MODAL 🔥 */}
                {loading ? (
                  <div className="overflow-x-auto custom-scrollbar w-full pb-2">
                    <div className="min-w-[1000px] flex flex-col gap-4 pr-2 pb-4">
                      {Array.from({ length: modalItemsPerPage }).map((_, i) => (
                        <RequestRowSkeleton key={i} />
                      ))}
                    </div>
                  </div>
                ) : paginatedModalReqs.length > 0 ? (
                  <div className="overflow-x-auto custom-scrollbar w-full pb-2">
                    <div className="min-w-[1000px] flex flex-col gap-4 pr-2 pb-4">
                      {paginatedModalReqs.map((req) => (
                        <RequestRow 
                          key={req.id} 
                          request={req} 
                          onEdit={setSelectedRequest} 
                          onForceComplete={handleForceComplete}
                          onRestore={handleRestoreRequest}
                          onUnlock={handleUnlockRequest}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 flex flex-col items-center justify-center gap-3">
                    <FolderKanban className="text-gray-300 dark:text-luxury-border/40 animate-pulse" size={42} />
                    <p className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-xs">
                      No hay registros con esos filtros.
                    </p>
                  </div>
                )}
              </div>

              {/* 🔥 CONTROLES DE PAGINACIÓN DEL MODAL */}
              {!loading && filteredModalReqs.length > 0 && (
                <div className="p-4 border-t border-gray-200 dark:border-luxury-border bg-white dark:bg-[#0a0a0c] flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 rounded-b-3xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                    <span>Mostrar</span>
                    <select 
                      value={modalItemsPerPage} 
                      onChange={e => setModalItemsPerPage(parseInt(e.target.value))} 
                      className="bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-lg p-1.5 text-gray-900 dark:text-white font-bold transition-colors duration-300 cursor-pointer"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      type="button" 
                      onClick={() => setModalCurrentPage(p => Math.max(p - 1, 1))} 
                      disabled={modalCurrentPage === 1} 
                      className="bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border p-2 rounded-xl disabled:opacity-30 text-gray-900 dark:text-white transition-colors duration-300 cursor-pointer"
                    >
                      <ChevronLeft size={16}/>
                    </button>
                    <span className="text-xs font-black tracking-widest text-gray-500 dark:text-gray-400 uppercase transition-colors duration-300">
                      Pág <span className="text-gray-900 dark:text-white">{modalCurrentPage}</span> / {totalModalPages}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setModalCurrentPage(p => Math.min(p + 1, totalModalPages))} 
                      disabled={modalCurrentPage === totalModalPages} 
                      className="bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border p-2 rounded-xl disabled:opacity-30 text-gray-900 dark:text-white transition-colors duration-300 cursor-pointer"
                    >
                      <ChevronRight size={16}/>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </>
  );
}