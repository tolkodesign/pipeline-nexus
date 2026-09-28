import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layers, Users, SlidersHorizontal, UserCheck, Briefcase, Plus, Pencil, Trash2, ShieldCheck, Loader2, Search, Filter, ArrowUpDown, FolderKanban, Clock, CheckCircle2, MessageSquare, Building2, Download, BellRing, Target, AlertTriangle, LayoutGrid, X, Activity, Globe, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'; 
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import RequestRow from '../../components/admin/ui/RequestRow';
import RequestRowSkeleton from '../../components/admin/ui/RequestRowSkeleton'; 
import { Skeleton } from '../../components/admin/ui/Skeleton'; 
import EditRequestModal from '../../components/admin/modals/EditRequestModal';
import ClientAnalytics from '../../components/client/ClientAnalytics'; 
import Swal from 'sweetalert2';
import NewRequestModal from '../../components/client/NewRequestModal';
import CalendarPage from '../../components/admin/tabs/CalendarPage'; // 🔥 IMPORTACIÓN DEL CALENDARIO
import HostageOverlay from '../../components/admin/ui/HostageOverlay';

interface CoordinatorDashboardProps {
  initialTab?: 'solicitudes' | 'clientes' | 'equipo' | 'calendario';
}

export default function CoordinatorDashboard({ initialTab = 'solicitudes' }: CoordinatorDashboardProps) {
  const { user, profile } = useAuth();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [requests, setRequests] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [priorities, setPriorities] = useState<any[]>([]);
  const [clientUsers, setClientUsers] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isNewReqModalOpen, setIsNewReqModalOpen] = useState(false); 

  const [statModalType, setStatModalType] = useState<string | null>(null);
  
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [modalClientFilter, setModalClientFilter] = useState('todos');

  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const modalItemsPerPage = 10;

  const [areaFilterScope, setAreaFilterScope] = useState<'mi_area' | 'todos'>('mi_area');

  const [pipelineTab, setPipelineTab] = useState('todas');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [priorityFilter, setPriorityFilter] = useState('todos');
  
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  const [sortBy, setSortBy] = useState('recientes');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  const [monthlyFlowData, setMonthlyFlowData] = useState<any[]>([]);
  const [disciplineDistribution, setDisciplineDistribution] = useState<any[]>([]);
  const [deliverableDistribution, setDeliverableDistribution] = useState<any[]>([]);
  const [clientDistribution, setClientDistribution] = useState<any[]>([]);

  const leaderSpecialty = profile?.specialties?.name || profile?.specialty || 'Diseño';
  const userRole = profile?.normalized_role || 'Líder';

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (user?.id) {
      const savedFilter = localStorage.getItem(`tolko_clients_filter_${user.id}`);
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
    if (!statModalType) {
      setModalSearchQuery('');
      setModalClientFilter('todos');
    }
    setModalCurrentPage(1);
  }, [statModalType, modalSearchQuery, modalClientFilter]);

  useEffect(() => {
    if (user?.id) fetchAllData();

    const channel = supabase.channel('coordinator-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, fetchAllData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'request_tasks' }, fetchAllData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'task_assignees' }, fetchAllData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'task_adjustments' }, fetchAllData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeTab]);

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
            id, title, description, status, request_date, due_date, created_at, organization_id, needs_design, needs_dev, needs_av, needs_copy, needs_prod, needs_staff, needs_rp, quantity, cierre_solicitado, external_resource_url, department, project_month, items_breakdown, organization_deliverable_id, project_id, priority_id, specialty_ids,
            organizations(name, logo_url), 
            projects(name), 
            request_categories(name), 
            organization_deliverables(name),
            priorities!requests_priority_id_fkey(id, level, color_code), 
            request_tasks(id, status, discipline, specialty_id, updated_at, created_at, task_assignees(id, task_id, profile_id, status)),
            profiles!requests_requester_id_fkey(full_name),
            file_extensions(extension)
          `)
          .eq('id', ticketId)
          .eq('is_active', true) // 🔥 BLINDADO
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
                id, title, description, status, request_date, due_date, created_at, organization_id, needs_design, needs_dev, needs_av, needs_copy, needs_prod, needs_staff, needs_rp, quantity, cierre_solicitado, external_resource_url, department, project_month, items_breakdown, organization_deliverable_id, project_id, priority_id, specialty_ids,
                organizations(name, logo_url), 
                projects(name), 
                request_categories(name), 
                organization_deliverables(name),
                priorities!requests_priority_id_fkey(id, level, color_code), 
                request_tasks(id, status, discipline, specialty_id, updated_at, created_at, task_assignees(id, task_id, profile_id, status)),
                profiles!requests_requester_id_fkey(full_name),
                file_extensions(extension)
              `)
              .eq('id', taskData.request_id)
              .eq('is_active', true) // 🔥 BLINDADO
              .maybeSingle();
            fetchedReq = parentReq;
          }
        }

        if (fetchedReq) {
          targetReq = fetchedReq;
        }
      }

      if (targetReq) {
        setSelectedRequest(targetReq);
      }

      window.history.replaceState(null, '', window.location.pathname + window.location.hash);
    };

    checkAndOpenTicket();
  }, [loading, requests, location.search]); 

  const fetchAllData = async () => {
    if (requests.length === 0) setLoading(true);
    try {
      const [priosRes, assignedOrgsRes] = await Promise.all([
        supabase.from('priorities').select('id, level, color_code, weight'),
        supabase.from('organization_distribution_lists').select('organization_id').eq('profile_id', user!.id)
      ]);

      if (priosRes.data) setPriorities(priosRes.data);

      const orgIds = assignedOrgsRes.data?.map(item => item.organization_id) || [];

      if (orgIds.length === 0) {
        setRequests([]);
        setClients([]);
        setClientUsers([]);
      } else {
        const [membersRes, reqsRes, orgsRes, staffRes] = await Promise.all([
          supabase.from('organization_members').select('organization_id, profiles(id, full_name)').in('organization_id', orgIds),
          supabase.from('requests').select(`
            id, title, description, status, request_date, due_date, created_at, organization_id, needs_design, needs_dev, needs_av, needs_copy, needs_prod, needs_staff, needs_rp, quantity, cierre_solicitado, external_resource_url, department, project_month, items_breakdown, organization_deliverable_id, project_id, priority_id, specialty_ids,
            organizations(name, logo_url), 
            projects(name), 
            request_categories(name), 
            organization_deliverables(name),
            priorities!requests_priority_id_fkey(id, level, color_code), 
            request_tasks(id, status, discipline, specialty_id, updated_at, created_at, task_assignees(id, task_id, profile_id, status)),
            profiles!requests_requester_id_fkey(full_name),
            file_extensions(extension)
          `).in('organization_id', orgIds).eq('is_active', true).order('created_at', { ascending: false }), // 🔥 BLINDADO
          supabase.from('organizations').select('id, name, logo_url, banner_url').in('id', orgIds).order('name'),
          supabase.from('profiles').select('id, full_name, role_id, specialty_id, internal_roles(name), specialties(name)').eq('is_active', true).order('created_at', { ascending: false })
        ]);
        
        const mappedMembers = membersRes.data?.map((m: any) => {
          const prof = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
          return { organization_id: m.organization_id, id: prof?.id, full_name: prof?.full_name };
        }).filter(m => m.id) || [];
        setClientUsers(mappedMembers);

        const dataRequests = (reqsRes.data || []).map(req => {
          const tasks = req.request_tasks || [];
          const hasCorrections = tasks.some((t: any) => 
            t.status === 'con_correcciones' || 
            (t.task_assignees && t.task_assignees.some((a: any) => a.status === 'con_correcciones'))
          );

          const hasDeliveries = tasks.some((t: any) => 
            ['entregado', 'aprobado_interno', 'aprobado'].includes(t.status) ||
            (t.task_assignees && t.task_assignees.some((a: any) => ['entregado', 'aprobado_interno', 'aprobado'].includes(a.status)))
          ) || req.status === 'completado';

          const isNew = (req.status === 'pendiente' || req.status === 'en_proceso') && !hasCorrections && !hasDeliveries;
          
          const latestUpdate = tasks.reduce((latest: number, t: any) => {
             const d = new Date(t.updated_at || t.created_at).getTime();
             return d > latest ? d : latest;
          }, new Date(req.request_date || req.created_at).getTime());

          return { ...req, hasCorrections, hasDeliveries, isNew, latestUpdate };
        });
        setRequests(dataRequests);

        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const monthlyCounts: Record<string, { label: string; count: number }> = {};
        const specialtyMap: Record<string, number> = {};
        const catCounts: Record<string, number> = {};
        const clientStatsMap: Record<string, {name: string, total: number, logo_url: string}> = {};

        dataRequests.forEach((req: any) => {
          const dateStr = req.request_date || req.created_at;
          if (dateStr) {
            const parts = String(dateStr).split('T')[0].split('-');
            if (parts.length >= 2) {
              const ymKey = `${parts[0]}-${parts[1]}`;
              const monthIdx = parseInt(parts[1], 10) - 1;
              const mName = `${monthNames[monthIdx]} ${parts[0].slice(-2)}`;
              if (!monthlyCounts[ymKey]) monthlyCounts[ymKey] = { label: mName, count: 0 };
              monthlyCounts[ymKey].count += 1;
            }
          }

          const tasks = req.request_tasks || [];
          if (tasks.length > 0) {
            tasks.forEach((t: any) => {
              const specName = t.discipline || 'General';
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

          const categoryName = req.organization_deliverables?.name || req.request_categories?.name || 'General';
          catCounts[categoryName] = (catCounts[categoryName] || 0) + 1;

          const orgName = req.organizations?.name || 'Desconocido';
          const logo = orgsRes.data?.find(c => c.id === req.organization_id)?.logo_url || '';
          if(!clientStatsMap[orgName]) clientStatsMap[orgName] = { name: orgName, total: 0, logo_url: logo };
          clientStatsMap[orgName].total += 1;
        });

        const sortedYMKeys = Object.keys(monthlyCounts).sort();
        setMonthlyFlowData(sortedYMKeys.slice(-12).map(k => ({ name: monthlyCounts[k].label, solicitudes: monthlyCounts[k].count })));
        setDisciplineDistribution(Object.keys(specialtyMap).map(key => ({ name: key, value: specialtyMap[key] })).filter(d => d.value > 0).sort((a, b) => b.value - a.value));
        setDeliverableDistribution(Object.keys(catCounts).map(k => ({ name: k, total: catCounts[k] })).sort((a, b) => b.total - a.total).slice(0, 5));
        setClientDistribution(Object.values(clientStatsMap).sort((a, b) => b.total - a.total).slice(0, 5));

        if (orgsRes.data) setClients(orgsRes.data);
        if (staffRes.data) {
          const mappedStaff = staffRes.data.map((s:any) => ({
            ...s,
            internal_role: s.internal_roles?.name || s.internal_role || 'Colaborador',
            specialty: s.specialties?.name || s.specialty || 'General'
          }));
          setStaff(mappedStaff);
        }
      }

    } catch (error) {
      console.error("Error estructurando dashboard corporativo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleForceComplete = async (requestId: string) => {
    const isDarkTheme = document.documentElement.classList.contains('dark');
    
    const result = await Swal.fire({
      title: '¿SOLICITAR CIERRE AL EQUIPO?',
      html: `
        <p style="font-size: 13px; color: ${isDarkTheme ? '#aaa' : '#666'};"><br/>
          Esto activará el <b>Modo Rehén</b> para las áreas pendientes.<br/><br/>
          Su plataforma se bloqueará hasta que entreguen.
        </p>
      `,
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

      fetchAllData(); 

      Swal.fire({ 
        title: '¡Equipo Bloqueado! 🔒', 
        text: 'Se les ha restringido el acceso a la plataforma hasta que atiendan esta solicitud.',
        icon: 'success', 
        confirmButtonColor: '#D3002D'
      });

    } catch (err: any) { 
      Swal.fire('Error', err.message, 'error'); 
      setLoading(false);
    }
  };

  const handleRestoreRequest = async (requestId: string) => {
    const isDarkTheme = document.documentElement.classList.contains('dark');
    const result = await Swal.fire({
      title: '¿REVIVIR SOLICITUD?',
      text: 'Esta solicitud regresarás al pipeline activo en estado "En Proceso". ¿Proceder?',
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
        icon: 'success', 
        confirmButtonColor: '#D3002D',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err: any) { Swal.fire('Error', err.message, 'error'); }
  };

  const handleToggleClientFilter = (clientId: string) => {
    setSelectedClients(prev => {
      const next = prev.includes(clientId) ? prev.filter(id => id !== clientId) : [...prev, clientId];
      if (user?.id) localStorage.setItem(`tolko_clients_filter_${user.id}`, JSON.stringify(next));
      return next;
    });
  };

  const handleClearClientFilter = () => {
    setSelectedClients([]);
    if (user?.id) localStorage.setItem(`tolko_clients_filter_${user.id}`, JSON.stringify([]));
    setShowClientDropdown(false);
  };

  const norm = (s: string) => (s || '').toLowerCase().trim();
  const leaderSpecialtyId = profile?.specialty_id;

  const isMyAreaRequired = (r: any) => {
    if (r.specialty_ids && r.specialty_ids.length > 0) {
      if (leaderSpecialtyId && r.specialty_ids.includes(leaderSpecialtyId)) return true;
    } else {
      const isLegacyMatch = r.request_tasks?.some((t: any) => norm(t.discipline) === norm(leaderSpecialty));
      if (isLegacyMatch) return true;
      
      const legacyMap: Record<string, string> = {
        'diseño': 'needs_design', 'programación': 'needs_dev', 'programacion': 'needs_dev',
        'audiovisual': 'needs_av', 'contenido': 'needs_copy', 'producción': 'needs_prod',
        'produccion': 'needs_prod', 'staff': 'needs_staff', 'rp': 'needs_rp',
        'relaciones públicas': 'needs_rp', 'relaciones publicas': 'needs_rp'
      };
      const col = legacyMap[norm(leaderSpecialty)];
      if (col && Boolean(r[col]) === true) return true;
    }
    
    if (leaderSpecialtyId && r.request_tasks?.some((t: any) => t.specialty_id === leaderSpecialtyId)) {
      return true;
    }
    return false;
  };

  const isMyAreaPending = (r: any) => {
    if (['completado', 'entregado', 'aprobado'].includes(r.status)) return false;

    let myTask = (r.request_tasks || []).find((t: any) => t.specialty_id === leaderSpecialtyId);
    if (!myTask) {
       myTask = (r.request_tasks || []).find((t: any) => norm(t.discipline) === norm(leaderSpecialty));
    }

    if (!myTask) {
        return isMyAreaRequired(r);
    }

    if (myTask.status === 'con_correcciones') return true;
    
    const assignees = myTask.task_assignees || [];
    if (assignees.some((a: any) => a.status === 'con_correcciones')) return true;

    const isTaskDone = ['aprobado', 'aprobado_interno', 'entregado'].includes(myTask.status);
    const allAssigneesDone = assignees.length > 0 && assignees.every((a: any) => ['aprobado', 'aprobado_interno', 'entregado'].includes(a.status));

    if (isTaskDone || allAssigneesDone) return false;

    return true;
  };

  const baseRequests = requests.filter(r => {
    if (areaFilterScope === 'mi_area') {
      return isMyAreaRequired(r);
    }
    return true; 
  });

  const filteredRequests = baseRequests.filter(req => {
    if (pipelineTab === 'nuevas' && !req.isNew) return false;
    if (pipelineTab === 'cambios' && !req.hasCorrections) return false;
    if (pipelineTab === 'entregadas' && !req.hasDeliveries) return false;

    const titleStr = req.title || '';
    const matchesSearch = titleStr.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'todos') {
      matchesStatus = !['completado', 'entregado', 'aprobado'].includes(req.status);
    } else if (statusFilter === 'pendiente') {
      matchesStatus = req.status === 'pendiente';
    } else if (statusFilter === 'en_proceso') {
      matchesStatus = req.status === 'en_proceso';
    } else if (statusFilter === 'completado') {
      matchesStatus = ['completado', 'entregado', 'aprobado'].includes(req.status);
    }
    
    const matchesPriority = priorityFilter === 'todos' || req.priorities?.level === priorityFilter;
    const matchesClient = selectedClients.length === 0 || selectedClients.includes(req.organization_id);
    
    return matchesSearch && matchesStatus && matchesPriority && matchesClient;
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
    return new Date(b.request_date || b.created_at).getTime() - new Date(a.request_date || a.created_at).getTime();
  });

  const today = new Date();
  today.setHours(0,0,0,0);

  const myRealOverdueRequests = requests.filter(r => {
    const isGloballyPending = !['completado', 'entregado', 'aprobado'].includes(r.status);
    if (!r.cierre_solicitado || !isGloballyPending) return false;
    return isMyAreaPending(r); 
  });

  const productionRequestsCount = baseRequests.filter(r => ['pendiente', 'en_proceso'].includes(r.status)).length;
  
  const activeProductionCount = baseRequests.filter(r => {
    if (!['en_proceso', 'pendiente'].includes(r.status)) return false;
    if (areaFilterScope === 'mi_area') return isMyAreaPending(r);
    return true;
  }).length;

  const vencidosCount = baseRequests.filter(r => {
    const isGloballyOverdue = r.due_date && new Date(r.due_date) < today;
    const isGloballyPending = !['completado', 'entregado', 'aprobado'].includes(r.status);
    
    if (!isGloballyOverdue || !isGloballyPending) return false;
    if (areaFilterScope === 'todos') return true;

    return isMyAreaPending(r);
  }).length;

  const completedRequestsCount = baseRequests.filter(r => {
    return ['completado', 'entregado', 'aprobado'].includes(r.status);
  }).length;

  const allDisciplines = [
    { name: 'Diseño', col: 'needs_design' },
    { name: 'Programación', col: 'needs_dev' },
    { name: 'Audiovisual', col: 'needs_av' },
    { name: 'Contenido', col: 'needs_copy' },
    { name: 'Producción', col: 'needs_prod' },
    { name: 'Staff', col: 'needs_staff' },
    { name: 'RP', col: 'needs_rp' },
  ];

  const getOtherRequiredDisciplines = (r: any) => {
    return allDisciplines.filter(d => 
      norm(d.name) !== norm(leaderSpecialty) && Boolean(r[d.col]) === true
    );
  };

  const isDisciplineAssigned = (r: any, disciplineName: string) => {
    const t = (r.request_tasks || []).find((task: any) => norm(task.discipline) === norm(disciplineName));
    if (!t) return false;
    const hasPivotAssignees = t.task_assignees && t.task_assignees.length > 0;
    const hasArrayAssignees = t.assigned_to && t.assigned_to.length > 0;
    return hasPivotAssignees || hasArrayAssignees;
  };

  const checkOtAsignadas = (r: any) => {
    if (['completado', 'entregado', 'aprobado'].includes(r.status)) return false;
    if (areaFilterScope === 'mi_area' && !isMyAreaRequired(r)) return false;

    const otherReqs = getOtherRequiredDisciplines(r);
    if (otherReqs.length === 0) return false;

    return otherReqs.every(d => isDisciplineAssigned(r, d.name));
  };

  const checkOtSinAsignar = (r: any) => {
    if (['completado', 'entregado', 'aprobado'].includes(r.status)) return false;
    if (areaFilterScope === 'mi_area' && !isMyAreaRequired(r)) return false;

    const otherReqs = getOtherRequiredDisciplines(r);
    if (otherReqs.length === 0) return false;

    return otherReqs.some(d => !isDisciplineAssigned(r, d.name));
  };

  const checkParaRevision = (r: any) => {
    if (['completado', 'aprobado'].includes(r.status)) return false;
    if (areaFilterScope === 'mi_area' && !isMyAreaRequired(r)) return false;

    const myTask = (r.request_tasks || []).find((t: any) => norm(t.discipline) === norm(leaderSpecialty));
    if (!myTask) return false;

    const assignees = myTask.task_assignees || [];
    const hasPendingAssigneeReview = assignees.some((a: any) => 
      ['entregado', 'en_revision_cliente'].includes(a.status)
    );

    return hasPendingAssigneeReview || ['entregado', 'en_revision_cliente'].includes(myTask.status);
  };

  const otAsignadasCount = baseRequests.filter(checkOtAsignadas).length;
  const otSinAsignarCount = baseRequests.filter(checkOtSinAsignar).length;
  const paraRevisionCount = baseRequests.filter(checkParaRevision).length;

  const getStatModalRequests = () => {
    let base: any[] = [];
    switch (statModalType) {
      case 'en_proceso': 
        base = baseRequests.filter(r => ['pendiente', 'en_proceso'].includes(r.status)); 
        break;
      case 'activa': 
        base = baseRequests.filter(r => {
          if (!['en_proceso', 'pendiente'].includes(r.status)) return false;
          if (areaFilterScope === 'mi_area') return isMyAreaPending(r);
          return true;
        }); 
        break;
      case 'vencidos': 
        base = baseRequests.filter(r => {
          const isGloballyOverdue = r.due_date && new Date(r.due_date) < today;
          const isGloballyPending = !['completado', 'entregado', 'aprobado'].includes(r.status);
          if (!isGloballyOverdue || !isGloballyPending) return false;
          if (areaFilterScope === 'todos') return true;
          return isMyAreaPending(r);
        }); 
        break;
      case 'completados': 
        base = baseRequests.filter(r => ['completado', 'entregado', 'aprobado'].includes(r.status)); 
        break;
      case 'ot_asignadas': 
        base = baseRequests.filter(checkOtAsignadas); 
        break;
      case 'ot_sin_asignar': 
        base = baseRequests.filter(checkOtSinAsignar); 
        break;
      case 'para_revision': 
        base = baseRequests.filter(checkParaRevision); 
        break;
      default: 
        base = [];
    }

    return base.filter(req => {
      const titleStr = req.title || '';
      const orgName = req.organizations?.name || '';
      const reqName = req.profiles?.full_name || '';
      
      const matchesSearch = modalSearchQuery === '' || 
        titleStr.toLowerCase().includes(modalSearchQuery.toLowerCase()) || 
        orgName.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
        reqName.toLowerCase().includes(modalSearchQuery.toLowerCase());
        
      const matchesClient = modalClientFilter === 'todos' || req.organization_id === modalClientFilter;
      
      return matchesSearch && matchesClient;
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const modalFilteredRequests = getStatModalRequests();
  const indexModalLastItem = modalCurrentPage * modalItemsPerPage;
  const indexModalFirstItem = indexModalLastItem - modalItemsPerPage;
  const currentModalItems = modalFilteredRequests.slice(indexModalFirstItem, indexModalLastItem);
  const modalTotalPages = Math.ceil(modalFilteredRequests.length / modalItemsPerPage);

  return (
    <>
      <HostageOverlay 
        overdueRequests={myRealOverdueRequests} 
        onOpenTask={(req) => setSelectedRequest(req)} 
        userName={profile?.full_name?.split(' ')[0] || 'Líder'} 
        isModalOpen={!!selectedRequest || isNewReqModalOpen} 
      />

      <div className="min-h-screen bg-gray-50 dark:bg-luxury-dark text-gray-900 dark:text-gray-200 pb-10 space-y-8 font-sans w-full max-w-full flex-1 transition-colors duration-300 min-w-0 overflow-x-hidden relative">

        <div className="px-4 sm:px-6 md:px-10 pt-16 md:pt-10 w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 w-full mt-2">
            <div className="w-full min-w-0">
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase truncate">
                {activeTab === 'solicitudes' && <>Mesa de <span className="text-luxury-red">Coordinación</span></>}
                {activeTab === 'clientes' && <>Marcas <span className="text-luxury-red">Asignadas</span></>}
                {activeTab === 'equipo' && <>Gestión de <span className="text-luxury-red">Célula</span></>}
                {activeTab === 'calendario' && <>Calendario <span className="text-luxury-red">Operativo</span></>}
              </h1>
              
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium flex items-center gap-2 truncate">
                  <ShieldCheck size={16} className="text-luxury-red shrink-0"/> {userRole} Operativo: <span className="font-black text-luxury-red uppercase tracking-wider">{leaderSpecialty}</span>
                </p>

                {activeTab === 'solicitudes' && (
                  <div className="flex items-center bg-gray-200 dark:bg-white/10 p-1 rounded-xl border border-gray-300 dark:border-white/10 select-none shadow-inner">
                    <button
                      type="button"
                      onClick={() => setAreaFilterScope('mi_area')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        areaFilterScope === 'mi_area'
                          ? 'bg-luxury-red text-white shadow-md shadow-luxury-red/20'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Target size={12} className={areaFilterScope === 'mi_area' ? "text-white animate-pulse" : "text-luxury-red"} />
                      Solo {leaderSpecialty}
                    </button>

                    <button
                      type="button"
                      onClick={() => setAreaFilterScope('todos')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        areaFilterScope === 'todos'
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-md'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Globe size={12} />
                      Ver Todo el Sistema
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full md:w-auto shrink-0 flex items-center gap-3">
              {activeTab === 'solicitudes' && (
                <button 
                  onClick={() => setIsNewReqModalOpen(true)}
                  className="w-full md:w-auto justify-center bg-luxury-red hover:opacity-90 text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-3 transition-all shadow-lg shadow-luxury-red/20 active:scale-95 cursor-pointer tracking-wider uppercase shrink-0"
                >
                  <Plus size={16} strokeWidth={3}/> Nueva Solicitud
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 md:px-10 w-full min-w-0">
          
          {/* 🔥 RENDER DEL CALENDARIO OPERATIVO 🔥 */}
          {activeTab === 'calendario' && <CalendarPage />}

          {activeTab === 'solicitudes' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* FILA 1 DE TARJETAS ESTADÍSTICAS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                <div onClick={() => setStatModalType('en_proceso')} className="cursor-pointer p-5 rounded-2xl border flex flex-col justify-between h-32 relative overflow-hidden transition-all duration-300 hover:scale-[0.98] bg-white dark:bg-luxury-card border-gray-200 dark:border-luxury-border shadow-sm dark:shadow-none hover:border-gray-300 dark:hover:border-zinc-700">
                  <div className="flex justify-between items-start z-10 pointer-events-none">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest transition-colors duration-300">Total Pedidos</p>
                    <LayoutGrid className="text-gray-900 dark:text-white transition-colors duration-300" size={18}/>
                  </div>
                  <div className="z-10 pointer-events-none">
                    {loading ? <Skeleton className="h-8 w-16 rounded-md mt-1" /> : <h2 className="text-2xl font-black transition-colors duration-300 text-gray-900 dark:text-white">{productionRequestsCount}</h2>}
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{areaFilterScope === 'mi_area' ? `En ${leaderSpecialty}` : 'En Sistema Global'}</p>
                  </div>
                </div>
                
                <div onClick={() => setStatModalType('activa')} className="cursor-pointer p-5 rounded-2xl border flex flex-col justify-between h-32 relative overflow-hidden transition-all duration-300 hover:scale-[0.98] bg-white dark:bg-luxury-card border-gray-200 dark:border-luxury-border shadow-sm dark:shadow-none hover:border-blue-500/40">
                  <div className="flex justify-between items-start z-10 pointer-events-none">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest transition-colors duration-300">Producción Activa</p>
                    <Activity className="text-blue-500 dark:text-blue-400 transition-colors duration-300" size={18}/>
                  </div>
                  <div className="z-10 pointer-events-none">
                    {loading ? <Skeleton className="h-8 w-16 rounded-md mt-1" /> : <h2 className="text-2xl font-black transition-colors duration-300 text-gray-900 dark:text-white">{activeProductionCount}</h2>}
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Pendientes / En Progreso</p>
                  </div>
                </div>

                <div onClick={() => setStatModalType('vencidos')} className={`cursor-pointer p-5 rounded-2xl border flex flex-col justify-between h-32 relative overflow-hidden transition-all duration-300 hover:scale-[0.98] ${vencidosCount > 0 && !loading ? 'bg-red-50 dark:bg-red-950/20 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)] animate-pulse' : 'bg-white dark:bg-luxury-card border-gray-200 dark:border-luxury-border shadow-sm dark:shadow-none hover:border-red-500/40'}`}>
                  <div className="flex justify-between items-start z-10 pointer-events-none">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest transition-colors duration-300">Focos Rojos</p>
                    <AlertTriangle className={vencidosCount > 0 && !loading ? 'text-red-500' : 'text-gray-400 dark:text-gray-600 transition-colors duration-300'} size={18}/>
                  </div>
                  <div className="z-10 pointer-events-none">
                    {loading ? <Skeleton className="h-8 w-16 rounded-md mt-1" /> : <h2 className={`text-2xl font-black transition-colors duration-300 ${vencidosCount > 0 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>{vencidosCount}</h2>}
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5 transition-colors duration-300">Solicitudes Vencidas</p>
                  </div>
                </div>

                <div onClick={() => setStatModalType('completados')} className="cursor-pointer p-5 rounded-2xl border flex flex-col justify-between h-32 relative overflow-hidden transition-all duration-300 hover:scale-[0.98] bg-white dark:bg-luxury-card border-gray-200 dark:border-luxury-border shadow-sm dark:shadow-none hover:border-green-500/40">
                  <div className="flex justify-between items-start z-10 pointer-events-none">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest transition-colors duration-300">Entregados</p>
                    <CheckCircle2 className="text-green-500 transition-colors duration-300" size={18}/>
                  </div>
                  <div className="z-10 pointer-events-none">
                    {loading ? <Skeleton className="h-8 w-16 rounded-md mt-1" /> : <h2 className="text-2xl font-black transition-colors duration-300 text-gray-900 dark:text-white">{completedRequestsCount}</h2>}
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Finalizadas / Cerradas</p>
                  </div>
                </div>
              </div>

              {/* FILA 2 DE TARJETAS ESTADÍSTICAS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                <div onClick={() => setStatModalType('ot_asignadas')} className="cursor-pointer p-5 rounded-2xl border flex flex-col justify-between h-32 relative overflow-hidden transition-all duration-300 hover:scale-[0.98] bg-white dark:bg-luxury-card border-gray-200 dark:border-luxury-border shadow-sm dark:shadow-none hover:border-green-500/40">
                  <div className="flex justify-between items-start z-10 pointer-events-none">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest transition-colors duration-300">Otras Áreas Asignadas</p>
                    <CheckCircle2 className="text-green-500 transition-colors duration-300" size={18}/>
                  </div>
                  <div className="z-10 pointer-events-none">
                    {loading ? <Skeleton className="h-8 w-16 rounded-md mt-1" /> : <h2 className="text-2xl font-black transition-colors duration-300 text-gray-900 dark:text-white">{otAsignadasCount}</h2>}
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Célula externa activa</p>
                  </div>
                </div>

                <div onClick={() => setStatModalType('ot_sin_asignar')} className={`cursor-pointer p-5 rounded-2xl border flex flex-col justify-between h-32 relative overflow-hidden transition-all duration-300 hover:scale-[0.98] ${otSinAsignarCount > 0 && !loading ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-500/40 shadow-sm' : 'bg-white dark:bg-luxury-card border-gray-200 dark:border-luxury-border shadow-sm'}`}>
                  <div className="flex justify-between items-start z-10 pointer-events-none">
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-black uppercase tracking-widest flex items-center gap-1">
                      ⚠️ Tareas sin colaborador
                    </p>
                  </div>
                  <div className="z-10 pointer-events-none">
                    {loading ? <Skeleton className="h-8 w-16 rounded-md mt-1" /> : <h2 className="text-2xl font-black text-amber-600 dark:text-amber-400">{otSinAsignarCount}</h2>}
                    <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold italic mt-0.5">(De otras áreas)</p>
                  </div>
                </div>

                <div onClick={() => setStatModalType('para_revision')} className={`cursor-pointer p-5 rounded-2xl border flex flex-col justify-between h-32 relative overflow-hidden transition-all duration-300 hover:scale-[0.98] ${paraRevisionCount > 0 && !loading ? 'bg-purple-50/60 dark:bg-purple-950/20 border-purple-500/40 shadow-md ring-1 ring-purple-500/20' : 'bg-white dark:bg-luxury-card border-gray-200 dark:border-luxury-border shadow-sm'}`}>
                  <div className="flex justify-between items-start z-10 pointer-events-none">
                    <p className="text-[10px] text-purple-600 dark:text-purple-400 font-black uppercase tracking-widest flex items-center gap-1">
                      👁️ Tareas de mi área
                    </p>
                  </div>
                  <div className="z-10 pointer-events-none">
                    {loading ? <Skeleton className="h-8 w-16 rounded-md mt-1" /> : <h2 className="text-2xl font-black text-purple-600 dark:text-purple-400">{paraRevisionCount}</h2>}
                    <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold italic mt-0.5">(Por aprobar)</p>
                  </div>
                </div>
              </div>

              {/* ANALYTICS CON SKELETON */}
              <div className="w-full min-w-0 overflow-hidden">
                <ClientAnalytics 
                  loading={loading}
                  monthlyData={monthlyFlowData} 
                  disciplineData={disciplineDistribution} 
                  deliverableData={deliverableDistribution}
                  clientData={clientDistribution}
                />
              </div>

              <div className="space-y-4 w-full">
                <div className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border shadow-sm dark:shadow-none p-4 md:p-6 rounded-2xl space-y-4 w-full">
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-luxury-border pb-4 mb-4">
                    
                    <div className="flex items-center gap-3">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <SlidersHorizontal size={14} className="text-luxury-red shrink-0"/> Pipeline
                      </h3>
                    </div>
                    
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
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 w-full">
                    <div className="relative w-full">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600" size={14} />
                      <input type="text" placeholder="Buscar ticket..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl py-2.5 pl-9 pr-3 text-xs text-gray-900 dark:text-white outline-none focus:border-luxury-red/50" />
                    </div>

                    <div className="relative w-full z-20">
                      <div 
                        onClick={() => setShowClientDropdown(!showClientDropdown)}
                        className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl p-2.5 text-xs text-gray-600 dark:text-gray-400 font-bold outline-none cursor-pointer flex justify-between items-center h-[38px]"
                      >
                        <span className="truncate">
                          {selectedClients.length === 0 
                            ? 'Todas las Cuentas' 
                            : `${selectedClients.length} cuentas filtradas`}
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
                              <Building2 size={14}/> Mostrar Todas
                            </div>
                            <div className="border-t border-gray-100 dark:border-zinc-800/80 my-1"></div>
                            {clients.map(c => (
                              <div 
                                key={c.id} 
                                onClick={() => handleToggleClientFilter(c.id)}
                                className="p-2 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-2.5 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300"
                              >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${selectedClients.includes(c.id) ? 'bg-luxury-red border-luxury-red text-white' : 'border-gray-300 dark:border-zinc-600'}`}>
                                  {selectedClients.includes(c.id) && <CheckCircle2 size={12} strokeWidth={4}/>}
                                </div>
                                <span className="truncate uppercase">{c.name}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl p-2.5 text-xs text-gray-600 dark:text-gray-400 font-bold outline-none cursor-pointer appearance-none">
                      <option value="todos">Todos los Estados</option>
                      <option value="pendiente">Realizadas</option>
                      <option value="en_proceso">En Progreso</option>
                      <option value="completado">Finalizadas</option>
                    </select>

                    <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl p-2.5 text-xs text-gray-600 dark:text-gray-400 font-bold outline-none cursor-pointer appearance-none">
                      <option value="todos">Todas las Prioridades</option>
                      <option value="Alta">Alta</option>
                      <option value="Media">Media</option>
                      <option value="Baja">Baja</option>
                    </select>

                    <div className="relative w-full">
                      <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600" size={14} />
                      <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl py-2.5 pl-9 pr-3 text-xs text-gray-600 dark:text-gray-400 font-black outline-none appearance-none cursor-pointer truncate">
                        <option value="recientes">Más Recientes</option>
                        <option value="urgentes">Próximos a Vencer</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* PIPELINE CON SKELETONS */}
                {loading ? (
                  <div className="space-y-4 w-full">
                    <div className="grid grid-cols-1 gap-3 w-full">
                      {Array.from({ length: itemsPerPage }).map((_, i) => (
                        <RequestRowSkeleton key={i} />
                      ))}
                    </div>
                  </div>
                ) : filteredRequests.length === 0 ? (
                  <div className="py-20 text-center border border-dashed border-gray-300 dark:border-luxury-border/60 bg-white dark:bg-luxury-card rounded-3xl flex flex-col items-center justify-center gap-3">
                    <FolderKanban className="text-gray-300 dark:text-luxury-border/40 animate-pulse" size={42} />
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-black uppercase tracking-widest">
                      {pipelineTab === 'cambios' ? '¡Todo limpio! Sin correcciones pendientes 🎉' : 'Sin solicitudes en este criterio operativo'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 w-full">
                    <div className="grid grid-cols-1 gap-3 w-full">
                      {currentItems.map(req => (
                        <div key={req.id} className="relative transition-all duration-300">
                          {req.hasCorrections && (
                            <span className="absolute -top-1.5 -left-1.5 z-10 bg-red-600 border-2 border-white dark:border-luxury-dark text-white p-1.5 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.6)] animate-pulse" title="¡Correcciones Pendientes!">
                              <BellRing size={12} strokeWidth={3}/>
                            </span>
                          )}
                          <RequestRow 
                            request={req} 
                            onEdit={(selected) => setSelectedRequest(selected)} 
                            onForceComplete={handleForceComplete}
                            onRestore={handleRestoreRequest}
                          />
                        </div>
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-between border-t border-gray-200 dark:border-luxury-border pt-4 px-2 shrink-0 select-none">
                        <p className="text-xxs font-black uppercase tracking-wider text-gray-400">
                          Mostrando <span className="text-gray-900 dark:text-white">{indexOfFirstItem + 1}</span> - <span className="text-gray-900 dark:text-white">{Math.min(indexOfLastItem, filteredRequests.length)}</span> de <span className="text-luxury-red">{filteredRequests.length}</span> Solicitudes
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="px-4 py-2 bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border rounded-xl text-xxs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 disabled:opacity-40 hover:border-luxury-red transition-all cursor-pointer shadow-sm"
                          >
                            Anterior
                          </button>
                          <div className="text-xxs font-black text-gray-900 dark:text-white bg-gray-100 dark:bg-white/5 px-3 py-2 rounded-xl">
                            {currentPage} / {totalPages}
                          </div>
                          <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="px-4 py-2 bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border rounded-xl text-xxs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 disabled:opacity-40 hover:border-luxury-red transition-all cursor-pointer shadow-sm"
                          >
                            Siguiente
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'clientes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
              {clients.map(client => (
                <div 
                  key={client.id} 
                  className="relative group overflow-hidden rounded-2xl border border-gray-200/60 dark:border-white/[0.06] p-6 shadow-sm flex flex-col justify-between min-h-[160px] transition-all duration-300 bg-cover bg-center"
                  style={{
                    backgroundImage: client.banner_url 
                      ? `linear-gradient(to bottom, rgba(15, 15, 18, 0.4), rgba(15, 15, 18, 0.85)), url(${client.banner_url})` 
                      : 'linear-gradient(to bottom right, rgba(255,255,255,0.02), rgba(255,255,255,0.01))'
                  }}
                >
                  {!client.banner_url && <div className="absolute inset-0 bg-white/[0.01] dark:bg-white/[0.02] backdrop-blur-xl -z-10" />}
                  
                  {client.logo_url && (
                    <img src={client.logo_url} className="absolute -right-4 -bottom-4 w-28 h-28 object-contain opacity-[0.04] dark:opacity-[0.025] pointer-events-none select-none mix-blend-screen" alt="" />
                  )}

                  <div className="relative z-10">
                    <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide truncate group-hover:text-luxury-red transition-colors">{client.name}</h4>
                    <p className="text-[10px] text-gray-300/70 uppercase tracking-widest font-black mt-1">ID: ...{client.id?.slice(-6)}</p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-white/[0.08] mt-4 relative z-10">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Distribución Activa</span>
                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                      <Building2 size={12} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* 1. MODAL DE ESTADÍSTICAS */}
      {statModalType && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center p-4 sm:p-6 bg-gray-900/40 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
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
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4 flex-1 bg-gray-50/50 dark:bg-[#0a0a0c]/50">
              {loading ? (
                <div className="flex flex-col h-full">
                  <div className="overflow-x-auto custom-scrollbar w-full pb-2 flex-1">
                    <div className="min-w-[1000px] flex flex-col gap-4 pr-2 pb-4">
                      {Array.from({ length: modalItemsPerPage }).map((_, i) => (
                        <RequestRowSkeleton key={i} />
                      ))}
                    </div>
                  </div>
                </div>
              ) : modalFilteredRequests.length > 0 ? (
                <div className="flex flex-col h-full">
                  <div className="overflow-x-auto custom-scrollbar w-full pb-2 flex-1">
                    <div className="min-w-[1000px] flex flex-col gap-4 pr-2 pb-4">
                      {currentModalItems.map((req) => (
                        <RequestRow 
                          key={req.id} 
                          request={req} 
                          onEdit={setSelectedRequest} 
                          onForceComplete={handleForceComplete}
                          onRestore={handleRestoreRequest}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {modalTotalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 dark:border-luxury-border pt-4 px-2 shrink-0 select-none mt-auto">
                      <p className="text-xxs font-black uppercase tracking-wider text-gray-400">
                        Mostrando <span className="text-gray-900 dark:text-white">{indexModalFirstItem + 1}</span> - <span className="text-gray-900 dark:text-white">{Math.min(indexModalLastItem, modalFilteredRequests.length)}</span> de <span className="text-luxury-red">{modalFilteredRequests.length}</span> Solicitudes
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          disabled={modalCurrentPage === 1}
                          onClick={() => setModalCurrentPage(prev => prev - 1)}
                          className="px-4 py-2 bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border rounded-xl text-xxs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 disabled:opacity-40 hover:border-luxury-red transition-all cursor-pointer shadow-sm"
                        >
                          <ChevronLeft size={16}/>
                        </button>
                        <div className="text-xxs font-black text-gray-900 dark:text-white bg-gray-100 dark:bg-white/5 px-3 py-2 rounded-xl">
                          {modalCurrentPage} / {modalTotalPages}
                        </div>
                        <button
                          disabled={modalCurrentPage === modalTotalPages}
                          onClick={() => setModalCurrentPage(prev => prev + 1)}
                          className="px-4 py-2 bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border rounded-xl text-xxs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 disabled:opacity-40 hover:border-luxury-red transition-all cursor-pointer shadow-sm"
                        >
                          <ChevronRight size={16}/>
                        </button>
                      </div>
                    </div>
                  )}
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

          </div>
        </div>
      )}

      {/* 2. MODALES DE EDICIÓN Y NUEVA SOLICITUD */}
      {selectedRequest && (
        <EditRequestModal 
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          request={selectedRequest}
          staffCatalog={staff} 
          prioritiesCatalog={priorities}
          onRefresh={fetchAllData}
        />
      )}

      {isNewReqModalOpen && (
        <NewRequestModal 
          isOpen={isNewReqModalOpen} 
          onClose={() => setIsNewReqModalOpen(false)} 
          isAdminMode={true}
          clients={clients}
          clientUsers={clientUsers}
          onRefresh={fetchAllData}
        />
      )}

    </>
  );
}
