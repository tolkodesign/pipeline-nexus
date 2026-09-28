import { useState, useEffect } from 'react';
import { X, Loader2, Building2, Layers, Pencil, Check, SidebarClose, SidebarOpen, Plus, Trash2, Package, ShieldAlert, Database } from 'lucide-react'; 
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext'; 
import Swal from 'sweetalert2';

import RequestBriefPanel from './edit-request/RequestBriefPanel';
import DisciplineTabs from './edit-request/DisciplineTabs';
import TaskWorkspace from './edit-request/TaskWorkspace';
import RightActionPanel from './edit-request/RightActionPanel';
import RegisterAdjustmentsModal from './edit-request/RegisterAdjustmentsModal';
import DuplicateInspectorModal from './edit-request/DuplicateInspectorModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  request: any | null;
  staffCatalog: any[];
  prioritiesCatalog: any[];
  onRefresh: () => void;
  isCollaboratorView?: boolean;
  targetDiscipline?: string;
}

export default function EditRequestModal({ 
  isOpen, 
  onClose, 
  request, 
  staffCatalog, 
  prioritiesCatalog, 
  onRefresh,
  isCollaboratorView = false,
  targetDiscipline
}: Props) {
  const { profile } = useAuth();

  useEffect(() => {
    const styleId = 'swal-zindex-override';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `.swal2-container { z-index: 999999 !important; }`;
      document.head.appendChild(style);
    }
  }, []);

  const roleIdNum = Number(profile?.role_id);
  const roleText = (profile?.internal_role || '').toLowerCase().trim();
  
  const isAdmin = profile?.is_admin === true || roleIdNum === 3 || roleText === 'admin';

  const jefaturaKeywords = ['lider', 'líder', 'coordinador', 'coordinadora', 'ejecutivo', 'ejecutiva', 'gerente', 'director', 'directora'];
  const isJefatura = [2, 4, 5].includes(roleIdNum) || jefaturaKeywords.some(k => roleText.includes(k));
  
  const rawSpecialty = profile?.specialties?.name || profile?.specialty || '';
  const mySpecialty = ['relaciones públicas', 'relaciones publicas', 'rp'].includes(rawSpecialty.toLowerCase().trim()) 
    ? 'RP' 
    : rawSpecialty; 

  const isCancelled = request?.is_active === false;
  
  const getCanonicalDiscipline = (input: string): string => {
    const s = (input || '').toLowerCase().trim();
    if (!s) return '';
    if (s.includes('dev') || s.includes('progra') || s.includes('code') || s === 'web' || s === 'needs_dev' || s.includes('plataforma')) return 'programacion';
    if (s.includes('desig') || s.includes('diseño') || s.includes('diseno') || s === 'needs_design') return 'diseno';
    if (s.includes('av') || s.includes('audio') || s.includes('video') || s === 'needs_av') return 'audiovisual';
    if (s.includes('copy') || s.includes('contenid') || s.includes('redac') || s === 'needs_copy') return 'contenido';
    if (s.includes('prod') || s === 'needs_prod') return 'produccion';
    if (s.includes('staff') || s === 'needs_staff') return 'staff';
    if (s.includes('rp') || s.includes('relacion') || s === 'needs_rp') return 'rp';
    return s;
  };

  const canToggleDiscipline = (discName: string) => {
    if (isCollaboratorView || isCancelled) return false;
    if (isAdmin || isJefatura) return true;
    return false;
  };

  const canEditGlobal = !isCollaboratorView && (isAdmin || isJefatura) && !isCancelled;

  const [updateLoading, setUpdateLoading] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [globalAdjustments, setGlobalAdjustments] = useState<any[]>([]); 
  const [orgDetails, setOrgDetails] = useState<any>({}); 
  const [orgDeliverables, setOrgDeliverables] = useState<any[]>([]); 
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
  
  const [projects, setProjects] = useState<any[]>([]);
  const [specialtiesCatalog, setSpecialtiesCatalog] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('General'); 
  const [editingAssignee, setEditingAssignee] = useState<Record<string, boolean>>({});
  const [isAdjModalOpen, setIsAdjModalOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  const [isGlobalEditing, setIsGlobalEditing] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  const desiredOrder = ['contenido', 'diseño', 'audiovisual', 'programación', 'producción', 'staff', 'marketing', 'rp', 'relaciones públicas'];
  
  const disciplinesCatalog = specialtiesCatalog.map(s => ({
    id: s.id,
    key: `specialty_${s.id}`,
    name: s.name
  })).sort((a, b) => {
    const idxA = desiredOrder.indexOf(a.name.toLowerCase().trim());
    const idxB = desiredOrder.indexOf(b.name.toLowerCase().trim());
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.name.localeCompare(b.name);
  });

  const initialTasksState = disciplinesCatalog.reduce((acc, curr) => {
    acc[curr.name] = { id: null, assignees_details: [], quantity: 1, status: 'pendiente', coordinator_notes: '' };
    return acc;
  }, {} as any);

  const [editForm, setEditForm] = useState<any>({ 
    id: '', title: '', project_id: '', status: '', priority_id: '', due_date: '', request_date: '',
    editing_hours: 0, recording_hours: 0, video_duration: '',
    needs_copy: false, needs_design: false, needs_av: false, needs_dev: false,
    needs_prod: false, needs_staff: false, needs_rp: false,
    max_revisions: 2,
    description: '',
    external_resource_url: '',
    items_breakdown: [],
    tasks: initialTasksState
  });

  const [initialFormState, setInitialFormState] = useState<string>('');
  const [deliverableName, setDeliverableName] = useState<string>('Cargando...');

  useEffect(() => {
    if (isOpen && request) {
      if (targetDiscipline) setActiveTab(targetDiscipline);
      fetchRequestTasks();
      setEditingAssignee({});
      setIsGlobalEditing(false);
      setIsRightPanelOpen(true);

      const channel = supabase.channel(`edit-request-${request.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'task_assignees' }, fetchRequestTasks)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'request_tasks' }, fetchRequestTasks)
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isOpen, request, targetDiscipline]);

  const fetchRequestTasks = async () => {
    if (!request) return;
    setGlobalAdjustments([]); 
    
    const [tasksRes, projectsRes, orgRes, delivsRes, specRes] = await Promise.all([
      supabase.from('request_tasks').select('*').eq('request_id', request.id),
      supabase.from('projects').select('id, name').eq('organization_id', request.organization_id).order('name'),
      request.organization_id ? supabase.from('organizations').select('logo_url, banner_url').eq('id', request.organization_id).single() : Promise.resolve({data: null}),
      request.organization_id ? supabase.from('organization_deliverables').select('*').eq('organization_id', request.organization_id).eq('is_active', true).order('name') : Promise.resolve({data: []}),
      supabase.from('specialties').select('id, name')
    ]);
    
    if (projectsRes.data) setProjects(projectsRes.data);
    if (orgRes.data) setOrgDetails(orgRes.data);
    if (delivsRes.data) setOrgDeliverables(delivsRes.data); 
    if (specRes.data) setSpecialtiesCatalog(specRes.data);

    let finalDeliverableName = request.request_categories?.name || 'Entregable General';
    if (request.organization_deliverables?.name) {
      finalDeliverableName = request.organization_deliverables.name;
    } else if (request.organization_deliverable_id) {
      const { data: delivData } = await supabase.from('organization_deliverables').select('name').eq('id', request.organization_deliverable_id).maybeSingle(); 
      if (delivData?.name) finalDeliverableName = delivData.name;
    }
    setDeliverableName(finalDeliverableName);

    const currentTasks: any = {};
    if (specRes.data) {
      specRes.data.forEach((s: any) => {
        currentTasks[s.name] = { id: null, assignees_details: [], quantity: 1, status: 'pendiente', coordinator_notes: '' };
      });
    }

    if (tasksRes.data) {
      setTasks(tasksRes.data);
      const taskIds = tasksRes.data.map(t => t.id);
      let pivotAssignees: any[] = [];
      
      if (taskIds.length > 0) {
        const { data: aData } = await supabase.from('task_assignees').select('*').in('task_id', taskIds);
        if (aData) {
          const uniquePivotAssignees: any[] = [];
          const seen = new Set();
          const sortedPivot = [...aData].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          
          sortedPivot.forEach(p => {
            const key = `${p.task_id}-${p.profile_id}`;
            if (!seen.has(key)) {
              seen.add(key);
              uniquePivotAssignees.push(p);
            }
          });
          pivotAssignees = uniquePivotAssignees;
        }
      }

      tasksRes.data.forEach(task => {
        let targetName = null;
        if (task.specialty_id) {
          targetName = specRes.data?.find((s: any) => s.id === task.specialty_id)?.name;
        }
        if (!targetName && task.discipline) {
          targetName = specRes.data?.find((s: any) => getCanonicalDiscipline(s.name) === getCanonicalDiscipline(task.discipline))?.name;
        }
        
        if (targetName && currentTasks[targetName]) {
          let listFromPivot = pivotAssignees.filter(p => p.task_id === task.id).map(p => {
            const resolvedStatus = (p.status && p.status !== 'pendiente') ? p.status : (task.status || 'pendiente');
            const resolvedUrl = p.deliverable_url || task.deliverable_url || '';
            const resolvedNotes = p.delivery_notes || task.delivery_notes || '';

            return {
              id: p.id, // 🔥 CRUCIAL: MANTIENE EL ID REAL EN MEMORIA DE REACT
              profile_id: p.profile_id,
              assigned_quantity: p.assigned_quantity || 1,
              specific_instructions: p.specific_instructions || '',
              due_date: p.due_date || request.due_date || '',
              completed_at: p.completed_at || null,
              status: resolvedStatus,
              deliverable_url: resolvedUrl,
              delivery_notes: resolvedNotes,
              assigned_items: p.assigned_items || [],
              editing_hours: p.editing_hours || 0,
              recording_hours: p.recording_hours || 0,
              video_duration: p.video_duration || ''
            };
          });

          // 🛡️ DEDUPLICACIÓN EN VIVO: Si el slot ya tiene datos reales, evita que una fila vacía lo pise
          const existingSlot = currentTasks[targetName];
          if (existingSlot.id && existingSlot.assignees_details.length > 0 && listFromPivot.length === 0) {
            return;
          }

          currentTasks[targetName] = {
            id: task.id,
            assignees_details: listFromPivot,
            quantity: task.quantity || 1,
            status: task.status || 'pendiente',
            coordinator_notes: task.coordinator_notes || ''
          };
        }
      });

      if (taskIds.length > 0) {
        const { data: adjData } = await supabase.from('task_adjustments').select('*').in('task_id', taskIds).order('created_at', { ascending: false });
        if (adjData) setGlobalAdjustments(adjData);
      }
    }

    const dynamicNeeds: Record<string, boolean> = {};
    if (specRes.data) {
      specRes.data.forEach((s: any) => {
        let isActive = false;
        if (request.specialty_ids && request.specialty_ids.includes(s.id)) {
          isActive = true;
        } else {
          const canonicalName = getCanonicalDiscipline(s.name);
          if (request.needs_copy && canonicalName === 'contenido') isActive = true;
          if (request.needs_design && canonicalName === 'diseno') isActive = true;
          if (request.needs_av && canonicalName === 'audiovisual') isActive = true;
          if (request.needs_dev && canonicalName === 'programacion') isActive = true;
          if (request.needs_prod && canonicalName === 'produccion') isActive = true;
          if (request.needs_staff && canonicalName === 'staff') isActive = true;
          if (request.needs_rp && canonicalName === 'rp') isActive = true;
        }
        dynamicNeeds[`specialty_${s.id}`] = isActive;
      });
    }

    const loadedForm = {
      id: request.id, 
      title: request.title || '',
      project_id: request.project_id?.toString() || '', 
      status: request.status || 'pendiente',
      priority_id: request.priority_id?.toString() || '',
      due_date: request.due_date || '',
      request_date: request.request_date || request.created_at?.split('T')[0] || '',
      editing_hours: request.editing_hours || 0,
      recording_hours: request.recording_hours || 0,
      video_duration: request.video_duration || '',
      description: request.description || '',
      external_resource_url: request.external_resource_url || '',
      ...dynamicNeeds,
      max_revisions: request.max_revisions !== undefined ? request.max_revisions : 2,
      items_breakdown: request.items_breakdown || [],
      tasks: currentTasks
    };

    setEditForm(loadedForm);
    setInitialFormState(JSON.stringify(loadedForm));

    if (targetDiscipline) {
      setActiveTab(targetDiscipline);
    } else {
      const mySpecCanonical = getCanonicalDiscipline(mySpecialty || '');
      const mySpecItem = disciplinesCatalog.find(d => getCanonicalDiscipline(d.name) === mySpecCanonical);
      const isMySpecActive = mySpecItem ? dynamicNeeds[mySpecItem.key] : false;

      if (isMySpecActive && mySpecItem) {
        setActiveTab(mySpecItem.name);
      } else {
        const firstActive = disciplinesCatalog.find(d => dynamicNeeds[d.key]);
        if (firstActive) {
          setActiveTab(firstActive.name);
        } else {
          setActiveTab(mySpecItem ? mySpecItem.name : (disciplinesCatalog.length > 0 ? disciplinesCatalog[0].name : 'Contenido'));
        }
      }
    }
    
    document.title = `Mesa de Control • ${request.title || 'Ticket'}`;
  };

  const isFormDirty = JSON.stringify(editForm) !== initialFormState;

  const handleTaskChange = (discipline: string, field: string, value: any) => {
    setEditForm((prev: any) => ({
      ...prev,
      tasks: { ...prev.tasks, [discipline]: { ...prev.tasks[discipline], [field]: value } }
    }));
  };

  const handleFormChange = (field: string, value: any) => {
    setEditForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleToggleDiscipline = (key: string) => {
    setEditForm((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const consolidateItems = (items: any[]) => {
    const merged: any[] = [];
    items.forEach(item => {
      const name = (item.label || item.name || '').trim().toLowerCase();
      const disc = (item.discipline || '').trim().toLowerCase();
      
      if (!name) {
        merged.push(item); 
        return;
      }
      
      const existingIdx = merged.findIndex(m => 
        (m.label || m.name || '').trim().toLowerCase() === name && 
        (m.discipline || '').trim().toLowerCase() === disc
      );
      
      if (existingIdx >= 0) {
        merged[existingIdx].quantity = Number(merged[existingIdx].quantity) + Number(item.quantity || 1);
        if (item.package_source && !merged[existingIdx].package_source) {
          merged[existingIdx].package_source = item.package_source;
        }
      } else {
        merged.push({ ...item, name: item.label || item.name }); 
      }
    });
    return merged;
  };

  const handleSelectDeliverable = async (idx: number, deliverableId: string) => {
    const selectedDeliv = orgDeliverables.find(d => d.id === deliverableId);
    if (!selectedDeliv) return;

    let newItems = [...(editForm.items_breakdown || [])];

    if (selectedDeliv.is_package) {
      Swal.fire({ 
        title: 'Desglosando paquete...', 
        text: 'Analizando las piezas internas...',
        allowOutsideClick: false, 
        didOpen: () => Swal.showLoading() 
      });

      const { data, error } = await supabase
        .from('package_deliverable_items')
        .select(`
          quantity,
          organization_deliverables!package_deliverable_items_item_deliverable_id_fkey (
            id, name, needs_dev, needs_av, needs_design, needs_copy, needs_rp
          )
        `)
        .eq('package_id', selectedDeliv.id);

      if (error || !data || data.length === 0) {
        Swal.fire('Paquete Vacío', 'Asegúrate de haberle agregado piezas a este paquete desde el panel de Entregables.', 'info');
        return;
      }

      Swal.close();
      newItems.splice(idx, 1);

      data.forEach((subItem: any) => {
        const itemData = subItem.organization_deliverables;
        if (!itemData) return;

        let detectedDiscipline = 'Diseño';
        if (itemData.needs_dev) detectedDiscipline = 'Programación';
        else if (itemData.needs_av) detectedDiscipline = 'Audiovisual';
        else if (itemData.needs_design) detectedDiscipline = 'Diseño';
        else if (itemData.needs_copy) detectedDiscipline = 'Contenido';
        else if (itemData.needs_rp) detectedDiscipline = 'RP';

        newItems.push({
          id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
          deliverable_id: itemData.id,
          label: itemData.name,
          name: itemData.name,
          discipline: detectedDiscipline,
          quantity: subItem.quantity || 1,
          is_package: false,
          package_source: selectedDeliv.name 
        });
      });

      handleFormChange('items_breakdown', consolidateItems(newItems));

    } else {
      let detectedDiscipline = newItems[idx].discipline || 'Diseño';
      if (selectedDeliv.needs_dev) detectedDiscipline = 'Programación';
      else if (selectedDeliv.needs_av) detectedDiscipline = 'Audiovisual';
      else if (selectedDeliv.needs_design) detectedDiscipline = 'Diseño';
      else if (selectedDeliv.needs_copy) detectedDiscipline = 'Contenido';
      else if (selectedDeliv.needs_rp) detectedDiscipline = 'RP';

      newItems[idx] = {
        ...newItems[idx],
        deliverable_id: selectedDeliv.id,
        label: selectedDeliv.name,
        name: selectedDeliv.name,
        discipline: detectedDiscipline,
        is_package: false,
        package_source: null
      };
      
      handleFormChange('items_breakdown', consolidateItems(newItems));
    }
  };

  const handleInternalApprove = async (taskId: string, profileId: string) => {
    setLoadingTaskId(taskId + profileId);
    try {
      const { error } = await supabase.from('task_assignees').update({ status: 'aprobado_interno' }).eq('task_id', taskId).eq('profile_id', profileId);
      if (error) throw error;
      fetchRequestTasks();
    } catch (error: any) { Swal.fire('Error', error.message, 'error'); } finally { setLoadingTaskId(null); }
  };

  const handleUndoInternalApprove = async (taskId: string, profileId: string) => {
    setLoadingTaskId(taskId + profileId);
    try {
      const { error } = await supabase.from('task_assignees').update({ status: 'entregado' }).eq('task_id', taskId).eq('profile_id', profileId);
      if (error) throw error;
      fetchRequestTasks();
    } catch (error: any) { Swal.fire('Error', error.message, 'error'); } finally { setLoadingTaskId(null); }
  };

  const handleSendCorrections = async (taskId: string, profileId: string, currentNotes: string) => {
    const isDarkTheme = document.documentElement.classList.contains('dark');
    const { value: text } = await Swal.fire({
      title: 'Rebotar pieza',
      input: 'textarea', inputPlaceholder: 'Observaciones para que corrija su parte...',
      showCancelButton: true, confirmButtonColor: '#D3002D',
      background: isDarkTheme ? '#0F0F12' : '#fff', color: isDarkTheme ? '#fff' : '#1f2937',
      inputValidator: (value) => { if (!value) return '¡Debes escribir feedback!'; }
    });

    if (!text) return;
    setLoadingTaskId(taskId + profileId);
    try {
      const newNotes = currentNotes ? `${currentNotes}\n\n[FILTRO INTERNO]: ${text}` : `[FILTRO INTERNO]: ${text}`;

      const { error } = await supabase.from('task_assignees').update({ status: 'con_correcciones', delivery_notes: newNotes }).eq('task_id', taskId).eq('profile_id', profileId);
      if (error) throw error;

      await supabase.from('task_adjustments').insert([{ task_id: taskId, description: text, origin: 'agencia', is_internal: true, status: 'pendiente', created_by: profile?.id }]);
      fetchRequestTasks();
    } catch (error: any) { Swal.fire('Error', error.message, 'error'); } finally { setLoadingTaskId(null); }
  };

  const handleDeliverTask = async (taskId: string, profileId: string, url: string, notes: string) => {
    setLoadingTaskId(taskId + profileId);
    try {
      const isJefaturaOrAdmin = isAdmin || isJefatura;
      const targetStatus = isJefaturaOrAdmin ? 'aprobado_interno' : 'entregado';
      const tag = isJefaturaOrAdmin ? '[ENTREGA DIRECTA JEFATURA]' : '[ENTREGA COLABORADOR]';
      const newNotes = notes ? `${tag}: ${notes}` : `${tag}: Entregable subido.`;

      const { data, error } = await supabase.from('task_assignees').update({ 
        status: targetStatus, 
        deliverable_url: url, 
        delivery_notes: newNotes,
        completed_at: new Date().toISOString()
      }).eq('task_id', taskId).eq('profile_id', profileId).select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('Usuario no encontrado en base de datos. ¡Guarda la configuración del tablero antes de subir material!');
      }

      if (request?.status === 'pendiente') {
        await supabase.from('requests').update({ status: 'en_proceso' }).eq('id', request.id);
      }

      Swal.fire({ 
        title: isJefaturaOrAdmin ? '¡Entregado y Aprobado!' : '¡Entregado!', 
        text: isJefaturaOrAdmin ? 'El entregable fue subido y aprobado automáticamente.' : 'El entregable ha sido enviado a revisión.', 
        icon: 'success', 
        confirmButtonColor: '#10b981' 
      });

      fetchRequestTasks();
      onRefresh();
    } catch (error: any) { Swal.fire('Error', error.message, 'error'); } finally { setLoadingTaskId(null); }
  };

  const handleSaveChanges = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!request || isCollaboratorView || !isFormDirty) return;
    setOriginalDocTitle();
    setUpdateLoading(true);

    try {
      const consolidatedBreakdown = consolidateItems(editForm.items_breakdown || []);
      const breakdownSpecialties = new Set(consolidatedBreakdown.map((i: any) => i.discipline));
      
      const updatedSpecialtyKeys = { ...editForm };
      disciplinesCatalog.forEach(d => {
        if (breakdownSpecialties.has(d.name)) {
          updatedSpecialtyKeys[d.key] = true;
        }
      });

      const safeEditForm = { 
        ...updatedSpecialtyKeys, 
        items_breakdown: consolidatedBreakdown
      };

      const enabledDisciplines = disciplinesCatalog.filter(d => safeEditForm[d.key]).map(d => d.name);
      const disabledDisciplines = disciplinesCatalog.filter(d => !safeEditForm[d.key]).map(d => d.name);

      const hasAssignments = enabledDisciplines.some(disc => safeEditForm.tasks[disc]?.assignees_details?.length > 0);
      const newStatus = (request.status === 'pendiente' && hasAssignments) ? 'en_proceso' : safeEditForm.status;

      const calculatedTotalQuantity = consolidatedBreakdown.reduce((acc: number, curr: any) => acc + (Number(curr.quantity) || 1), 0) || 1;

      const selectedSpecIds = disciplinesCatalog
        .filter(d => safeEditForm[d.key])
        .map(d => d.id);

      const legacyMap = disciplinesCatalog.reduce((acc, cat) => {
        const isSel = selectedSpecIds.includes(cat.id);
        const nm = cat.name.toLowerCase();
        if (['contenido', 'copy'].includes(nm)) acc.needs_copy = isSel;
        if (['diseño', 'diseno'].includes(nm)) acc.needs_design = isSel;
        if (['audiovisual'].includes(nm)) acc.needs_av = isSel;
        if (['programación', 'programacion'].includes(nm)) acc.needs_dev = isSel;
        if (['producción', 'produccion'].includes(nm)) acc.needs_prod = isSel;
        if (['staff'].includes(nm)) acc.needs_staff = isSel;
        if (['rp', 'relaciones públicas', 'relaciones publicas'].includes(nm)) acc.needs_rp = isSel;
        return acc;
      }, {} as any);

      let globalEdit = 0; let globalRec = 0; let globalDur: string[] = [];
      enabledDisciplines.forEach(disc => {
        const taskConf = safeEditForm.tasks[disc];
        if(taskConf && taskConf.assignees_details) {
           taskConf.assignees_details.forEach((a: any) => {
              globalEdit += Number(a.editing_hours) || 0;
              globalRec += Number(a.recording_hours) || 0;
              if (a.video_duration && a.video_duration.trim() !== '') {
                 globalDur.push(a.video_duration.trim());
              }
           });
        }
      });

      const { error: updateError } = await supabase.from('requests').update({ 
          title: safeEditForm.title || request.title,
          project_id: safeEditForm.project_id || null,
          priority_id: safeEditForm.priority_id || null,
          due_date: safeEditForm.due_date || null,
          request_date: safeEditForm.request_date || null,
          description: safeEditForm.description,
          external_resource_url: safeEditForm.external_resource_url,
          editing_hours: Number(safeEditForm.editing_hours) || globalEdit || 0,
          recording_hours: Number(safeEditForm.recording_hours) || globalRec || 0,
          video_duration: safeEditForm.video_duration || (globalDur.length > 0 ? globalDur.join(' | ') : null),
          status: newStatus, 
          ...legacyMap,
          specialty_ids: selectedSpecIds,
          items_breakdown: consolidatedBreakdown, 
          quantity: calculatedTotalQuantity              
        }).eq('id', request.id);

      if (updateError) throw updateError;

      for (const disc of enabledDisciplines) {
        const taskConfig = safeEditForm.tasks[disc];
        const flatAssignees = taskConfig.assignees_details.map((a: any) => a.profile_id); 

        const totalQty = taskConfig.assignees_details.reduce((sum: number, a: any) => sum + (Number(a.assigned_quantity) || 0), 0) || 1;
        
        const payload = { 
          request_id: request.id, 
          discipline: disc, 
          specialty_id: disciplinesCatalog.find(d => d.name === disc)?.id || null,
          assigned_to: flatAssignees, 
          quantity: totalQty, 
          coordinator_notes: taskConfig.coordinator_notes || null 
        };
        
        let targetTaskId = taskConfig.id;
        
        if (targetTaskId) {
          await supabase.from('request_tasks').update(payload).eq('id', targetTaskId);
        } else {
          const { data: newT, error: insErr } = await supabase.from('request_tasks').insert([payload]).select().single();
          if (insErr) throw insErr;
          if (newT) targetTaskId = newT.id;
        }

        if (targetTaskId) {
          for (const a of taskConfig.assignees_details) {
            
            const { data: currentDbRecords } = await supabase.from('task_assignees')
              .select('id, status, deliverable_url, delivery_notes, completed_at, assigned_by')
              .eq('task_id', targetTaskId)
              .eq('profile_id', a.profile_id);

            let targetRecord = currentDbRecords && currentDbRecords.length > 0 ? currentDbRecords[0] : null;

            if (currentDbRecords && currentDbRecords.length > 1) {
              const duplicateIds = currentDbRecords.slice(1).map(r => r.id);
              await supabase.from('task_assignees').delete().in('id', duplicateIds);
            }

            const statusFromDb = targetRecord?.status;
            const isDbDelivered = ['entregado', 'aprobado_interno', 'aprobado', 'completado'].includes(statusFromDb || '');

            const assigneePayload: any = {
              task_id: targetTaskId,
              profile_id: a.profile_id,
              assigned_by: targetRecord?.assigned_by || profile?.id,
              assigned_quantity: a.assigned_quantity || 1,
              specific_instructions: a.specific_instructions || '',
              due_date: a.due_date || safeEditForm.due_date || null,
              status: isDbDelivered ? statusFromDb : (a.status || 'pendiente'),
              deliverable_url: isDbDelivered ? (targetRecord?.deliverable_url || a.deliverable_url || '') : (a.deliverable_url || targetRecord?.deliverable_url || ''),
              delivery_notes: isDbDelivered ? (targetRecord?.delivery_notes || a.delivery_notes || '') : (a.delivery_notes || targetRecord?.delivery_notes || ''),
              completed_at: targetRecord?.completed_at || null,
              assigned_items: a.assigned_items || [],
              editing_hours: Number(a.editing_hours) || 0,
              recording_hours: Number(a.recording_hours) || 0,
              video_duration: a.video_duration || null
            };

            const recordIdToUpdate = targetRecord?.id || a.id;

            if (recordIdToUpdate) {
              await supabase.from('task_assignees').update(assigneePayload).eq('id', recordIdToUpdate);
            } else {
              await supabase.from('task_assignees').insert(assigneePayload);
            }
          }

          const currentProfileIds = new Set(taskConfig.assignees_details.map((a: any) => a.profile_id));
          const { data: fetchToClean } = await supabase.from('task_assignees').select('id, profile_id').eq('task_id', targetTaskId);
          const removedAssignees = (fetchToClean || []).filter(p => !currentProfileIds.has(p.profile_id));
          
          if (removedAssignees.length > 0) {
            await supabase.from('task_assignees').delete().in('id', removedAssignees.map(r => r.id));
          }
        }
      }

      for (const disc of disabledDisciplines) {
        const targetTaskId = safeEditForm.tasks[disc]?.id;
        if (targetTaskId) {
          try {
            await supabase.from('task_assignees').delete().eq('task_id', targetTaskId);
            await supabase.from('task_adjustments').delete().eq('task_id', targetTaskId);
            await supabase.from('request_tasks').delete().eq('id', targetTaskId);
          } catch (delErr) { console.warn("No se pudo purgar tarea:", targetTaskId, delErr); }
        }
      }

      setIsGlobalEditing(false);
      onRefresh();

      await Swal.fire({ 
        title: '¡Cambios Guardados!', 
        text: 'La configuración y desglose de la solicitud ha sido actualizada.', 
        icon: 'success', 
        confirmButtonColor: '#D3002D' 
      });

      onClose();
      
    } catch (error: any) { 
      Swal.fire('Error', error.message, 'error'); 
    } finally { 
      setUpdateLoading(false); 
    }
  };

  const handleRenameProject = async (projectId: string, currentName: string) => {
    const isDarkTheme = document.documentElement.classList.contains('dark');
    const { value: newName } = await Swal.fire({
      title: 'Renombrar Tablero',
      input: 'text',
      inputValue: currentName,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#D3002D',
      background: isDarkTheme ? '#0F0F12' : '#fff',
      color: isDarkTheme ? '#fff' : '#1f2937',
      inputValidator: (value) => {
        if (!value) return 'El nombre no puede estar vacío';
      }
    });

    if (newName && newName !== currentName) {
      setUpdateLoading(true);
      try {
        const { error } = await supabase.from('projects').update({ name: newName }).eq('id', projectId);
        if (error) throw error;
        Swal.fire({ title: '¡Actualizado!', text: 'El tablero ha sido renombrado exitosamente.', icon: 'success', confirmButtonColor: '#D3002D' });
        setProjects(projects.map(p => p.id === projectId ? { ...p, name: newName } : p));
      } catch (err: any) {
        Swal.fire('Error', err.message, 'error');
      } finally {
        setUpdateLoading(false);
      }
    }
  };

  const handleDeliverPackage = async () => {
    const isDarkTheme = document.documentElement.classList.contains('dark');
    const result = await Swal.fire({
      title: '✅ Completar Solicitud',
      text: '¿Confirmas que el paquete completo de la célula está listo? Esto cerrará el ticket corporativo.',
      icon: 'question', showCancelButton: true, confirmButtonColor: '#10b981', confirmButtonText: 'SÍ, MARCAR COMO ENTREGADO',
      background: isDarkTheme ? '#0F0F12' : '#fff', color: isDarkTheme ? '#fff' : '#1f2937',
    });

    if (!result.isConfirmed) return;
    setOriginalDocTitle();
    setUpdateLoading(true);

    try {
      const { error: reqError } = await supabase.from('requests').update({ status: 'completado', delivered_at: new Date().toISOString() }).eq('id', request.id);
      if (reqError) throw reqError;
      const { error: tasksError } = await supabase.from('request_tasks').update({ status: 'aprobado' }).eq('request_id', request.id);
      if (tasksError) throw tasksError;

      Swal.fire({ title: '¡ENTREGA COMPLETA!', text: 'El ticket se ha archivado como completado.', icon: 'success', background: isDarkTheme ? '#0F0F12' : '#fff' });
      onRefresh();
      onClose();
    } catch (error: any) { Swal.fire('Error', error.message, 'error'); } finally { setUpdateLoading(false); }
  };

  const setOriginalDocTitle = () => {
    setTimeout(() => {
      const isClient = window.location.pathname.includes('/client') || document.title.includes('Portal');
      document.title = isClient ? "Inicio - Client Pipeline" : "Inicio - Admin Pipeline";
    }, 400);
  };

  if (!isOpen || !request) return null;

  const parsedOrgName = request?.organizations?.name || 'Empresa Partner';
  const deliverableNameFinal = deliverableName || 'Entregable General';
  
  const requiredDisciplines = disciplinesCatalog.filter(d => editForm[d.key]);
  const isPackageReady = requiredDisciplines.length > 0 && requiredDisciplines.every(d => {
    const taskData = editForm.tasks[d.name];
    if (!taskData || !taskData.assignees_details || taskData.assignees_details.length === 0) return false;
    return taskData.assignees_details.every((a: any) => a.status === 'aprobado_interno' || a.status === 'aprobado');
  });

  const normalizedStaffCatalog = staffCatalog.map(s => {
    const specName = s.specialties?.name || s.specialty || '';
    const spec = specName.toLowerCase().trim();
    if (spec === 'relaciones públicas' || spec === 'relaciones publicas') { return { ...s, specialty: 'RP' }; }
    return { ...s, specialty: specName };
  });

  const finalLogoUrl = orgDetails?.logo_url || request?.organizations?.logo_url;
  const finalBannerUrl = orgDetails?.banner_url || request?.organizations?.banner_url;

  const currentTaskDetails = editForm.tasks[activeTab];
  const myAssignment = currentTaskDetails?.assignees_details?.find((a: any) => a.profile_id === profile?.id);

  const totalInventoryPieces = (editForm.items_breakdown || []).reduce((acc: number, item: any) => acc + (Number(item.quantity) || 1), 0);

  const hasAudiovisual = (disciplinesCatalog.some(d => getCanonicalDiscipline(d.name) === 'audiovisual' && editForm[d.key])) || editForm.needs_av;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
      
      <div className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-luxury-border w-full max-w-[1500px] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[95vh] transition-colors duration-300">
        
        {isCancelled && (
          <div className="bg-red-600 text-white px-6 py-2.5 text-center text-[11px] font-black uppercase tracking-widest shrink-0 z-50 flex items-center justify-center gap-2 shadow-md">
            <ShieldAlert size={16} /> SOLICITUD DESHABILITADA — MOTIVO: {request?.cancellation_reason || 'No especificado'}
          </div>
        )}

        <div 
          className={`px-6 py-6 flex flex-col gap-4 shrink-0 shadow-md transition-all duration-300 relative overflow-hidden ${isGlobalEditing ? 'ring-inset ring-4 ring-blue-500/50' : ''}`}
          style={{
            backgroundImage: finalBannerUrl 
              ? `linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.4) 100%), url(${finalBannerUrl})` 
              : 'linear-gradient(to right, #111115, #1a1a24)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 w-full">
            
            <div className="flex gap-4 w-full lg:w-auto min-w-0 flex-1">
              <div className="bg-white p-1 rounded-xl shrink-0 w-16 h-16 flex items-center justify-center overflow-hidden shadow-sm mt-1">
                {finalLogoUrl ? (
                  <img src={finalLogoUrl} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <Building2 className="text-gray-400" size={32}/>
                )}
              </div>

              <div className="flex flex-col min-w-0 flex-1 justify-center">
                {isGlobalEditing ? (
                  <div className="w-full max-w-2xl mb-2">
                    <input 
                      type="text" 
                      value={editForm.title} 
                      onChange={e => handleFormChange('title', e.target.value)}
                      className="font-black text-xl md:text-2xl text-white uppercase bg-black/40 backdrop-blur-md border border-blue-400 rounded-lg px-3 py-1.5 focus:border-blue-300 outline-none w-full shadow-inner transition-colors"
                      placeholder="Nombre de la solicitud"
                    />
                  </div>
                ) : (
                  <h2 className="font-black text-2xl sm:text-3xl text-white uppercase leading-tight line-clamp-2 break-words mb-2 pr-6">
                    {editForm.title || 'SIN TÍTULO'}
                  </h2>
                )}
                
                <div className="text-[11px] md:text-[12px] uppercase tracking-widest text-white/90 flex items-center gap-2.5 flex-wrap font-semibold">
                  <span className="font-black text-white bg-black/40 px-2 py-0.5 rounded-lg border border-white/10">{parsedOrgName}</span>
                  <span className="text-white/30">•</span>
                  <span className="bg-white/20 text-white px-2.5 py-0.5 rounded-lg font-black shadow-sm flex items-center gap-1 backdrop-blur-sm border border-white/20">
                    <Layers size={12}/> {deliverableNameFinal}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 justify-end">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setIsInspectorOpen(true)}
                  className="bg-blue-600/80 hover:bg-blue-600 backdrop-blur-md text-white border border-blue-400/40 px-3.5 h-12 rounded-xl text-xs font-black tracking-widest flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                  title="Auditar registros reales en Supabase"
                >
                  <Database size={15} /> <span className="hidden sm:inline">AUDITAR DB</span>
                </button>
              )}

              {!isCollaboratorView && canEditGlobal && editForm.status !== 'completado' && (
                !isGlobalEditing ? (
                  <button 
                    onClick={() => setIsGlobalEditing(true)} 
                    className="bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white px-5 h-12 rounded-xl text-xs font-black tracking-widest flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Pencil size={14}/> EDITAR SOLICITUD
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => setIsGlobalEditing(false)} 
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-4 h-12 rounded-xl text-xs font-black tracking-widest transition-all active:scale-95 cursor-pointer"
                    >
                      CANCELAR
                    </button>

                    <button 
                      onClick={handleSaveChanges} 
                      disabled={updateLoading || !isFormDirty}
                      className={`px-5 h-12 rounded-xl text-xs font-black tracking-widest flex items-center gap-2 transition-all shadow-md ${
                        isFormDirty && !updateLoading
                          ? 'bg-green-600 hover:bg-green-500 text-white cursor-pointer active:scale-95'
                          : 'bg-gray-600/50 text-gray-300 cursor-not-allowed opacity-50'
                      }`}
                    >
                      {updateLoading ? <Loader2 className="animate-spin" size={14}/> : <><Check size={14} strokeWidth={3}/> GUARDAR</>}
                    </button>
                  </>
                )
              )}
              <button onClick={() => { setOriginalDocTitle(); onClose(); }} className="text-white bg-black/50 hover:bg-red-600 border border-white/20 backdrop-blur-md h-12 w-12 rounded-xl transition-all flex items-center justify-center shadow-lg cursor-pointer"><X size={24} strokeWidth={3}/></button>
            </div>

          </div>
        </div>
        
        <div className="flex-1 overflow-hidden flex bg-gray-50 dark:bg-[#0a0a0c]/20 transition-colors duration-300 relative">
          
          <div className="flex-1 min-w-0 h-full overflow-y-auto custom-scrollbar p-6 lg:p-10 transition-all duration-300 ease-in-out">
            <div className="max-w-6xl mx-auto space-y-8 pb-12">
              
              <RequestBriefPanel 
                description={editForm.description} 
                externalResourceUrl={editForm.external_resource_url} 
                isEditing={isGlobalEditing}
                onFormChange={handleFormChange}
              />

              {!isCollaboratorView && (
                <div className="bg-white dark:bg-[#141419] border border-gray-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b border-gray-100 dark:border-zinc-800/50 pb-3 gap-2">
                    
                    <div className="flex items-center gap-3">
                      <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                        <Layers size={16} className={isGlobalEditing ? 'text-blue-500' : 'text-gray-400'}/>
                        Desglose de Entregables (Inventario)
                      </h3>
                      {totalInventoryPieces > 0 && (
                        <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
                          TOTAL: {totalInventoryPieces} PZ
                        </span>
                      )}
                    </div>

                    {isGlobalEditing && (
                      <button onClick={() => {
                        const newItem = { id: Date.now().toString(), deliverable_id: '', label: '', quantity: 1, discipline: 'Diseño' };
                        handleFormChange('items_breakdown', [...(editForm.items_breakdown || []), newItem]);
                      }} type="button" className="text-[10px] bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer shrink-0">
                        <Plus size={12}/> Añadir Pieza
                      </button>
                    )}
                  </div>

                  {isGlobalEditing ? (
                    <div className="space-y-3">
                      {(editForm.items_breakdown || []).map((item: any, idx: number) => {
                         const currentVal = item.deliverable_id || (orgDeliverables.find(d => d.name === (item.label || item.name))?.id) || '';
                         const isCustomFallback = !currentVal && (item.label || item.name);

                         return (
                          <div key={item.id || idx} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            
                            <select 
                              value={currentVal} 
                              onChange={e => handleSelectDeliverable(idx, e.target.value)}
                              className="flex-1 w-full bg-gray-50 dark:bg-[#070709] border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-blue-500 shadow-sm cursor-pointer"
                            >
                              <option value="" disabled>Selecciona del catálogo...</option>
                              {orgDeliverables.map(d => (
                                <option key={d.id} value={d.id}>
                                  {d.is_package ? '📦' : '📄'} {d.name}
                                </option>
                              ))}
                              {isCustomFallback && <option value="" disabled>{item.label || item.name} (Custom Viejo)</option>}
                            </select>

                            <div className="flex w-full sm:w-auto gap-3">
                              <select 
                                value={item.discipline || 'Diseño'} 
                                onChange={e => {
                                  const newItems = [...(editForm.items_breakdown || [])];
                                  newItems[idx].discipline = e.target.value;
                                  handleFormChange('items_breakdown', consolidateItems(newItems));
                                }}
                                className="flex-1 sm:w-40 bg-gray-50 dark:bg-[#070709] border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:border-blue-500 cursor-pointer shadow-sm"
                              >
                                {disciplinesCatalog.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                              </select>
                              <input 
                                type="number" min="1" value={item.quantity || 1} 
                                onChange={e => {
                                  const newItems = [...(editForm.items_breakdown || [])];
                                  newItems[idx].quantity = parseInt(e.target.value) || 1;
                                  handleFormChange('items_breakdown', newItems);
                                }}
                                className="w-20 bg-gray-50 dark:bg-[#070709] border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-center font-black text-gray-900 dark:text-white outline-none focus:border-blue-500 shadow-sm"
                              />
                              <button type="button" onClick={() => {
                                const newItems = [...(editForm.items_breakdown || [])];
                                newItems.splice(idx, 1);
                                handleFormChange('items_breakdown', newItems);
                              }} className="text-gray-400 hover:text-red-500 px-2 transition-colors cursor-pointer"><Trash2 size={16}/></button>
                            </div>
                          </div>
                         );
                      })}
                      {!(editForm.items_breakdown?.length) && <p className="text-xs text-gray-400 italic">No hay desglose. La solicitud se procesará como 1 pieza general.</p>}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {consolidateItems(editForm.items_breakdown || []).length > 0 ? (
                        consolidateItems(editForm.items_breakdown || []).map((item: any, idx: number) => (
                          <div key={idx} className={`bg-gray-50 dark:bg-black/20 border ${item.package_source ? 'border-amber-200 dark:border-amber-900/50' : 'border-gray-200 dark:border-zinc-800'} rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm relative group`}>
                            <span className="text-xs font-black uppercase text-gray-700 dark:text-gray-300">
                              {item.package_source ? <Package size={12} className="inline text-amber-500 mr-1"/> : '📄 '} {item.label || item.name}
                            </span>
                            <span className="bg-white dark:bg-zinc-800 text-[10px] font-bold px-1.5 py-0.5 rounded text-gray-500 border border-gray-100 dark:border-zinc-700">
                              {item.discipline || 'General'}
                            </span>
                            <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] font-black px-1.5 py-0.5 rounded">{item.quantity} pz</span>
                            
                            {item.package_source && (
                              <div className="absolute -top-3 left-3 bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-300 text-[8px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                de: {item.package_source}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 italic font-medium">No hay entregables individuales desglosados en esta solicitud.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {!isCollaboratorView && (
                <div className="sticky top-0 z-30 -mx-6 lg:-mx-10 px-6 lg:px-10 py-4 bg-gray-50/95 dark:bg-[#0a0a0c]/95 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 shadow-sm">
                  <DisciplineTabs catalog={disciplinesCatalog} editForm={editForm} activeTab={activeTab} setActiveTab={setActiveTab} tasks={tasks} canToggle={canToggleDiscipline} onToggleDiscipline={handleToggleDiscipline} />
                </div>
              )}
              
              <TaskWorkspace 
                catalog={disciplinesCatalog}
                activeTab={activeTab} 
                editForm={editForm} 
                tasks={tasks} 
                staffCatalog={normalizedStaffCatalog} 
                profile={profile} 
                mySpecialty={mySpecialty} 
                isAdmin={isAdmin} 
                isJefatura={isJefatura}
                isCollaboratorView={isCollaboratorView}
                isCancelled={isCancelled}
                loadingTaskId={loadingTaskId} 
                editingAssignee={editingAssignee} 
                setEditingAssignee={setEditingAssignee} 
                onTaskChange={handleTaskChange} 
                onSendCorrections={handleSendCorrections} 
                onInternalApprove={handleInternalApprove} 
                onUndoInternalApprove={handleUndoInternalApprove}
                onDeliverTask={handleDeliverTask} 
              />
            </div>
          </div>

          <div className={`shrink-0 h-full border-l border-gray-200 dark:border-zinc-800/80 bg-gray-50/50 dark:bg-[#0c0c10] transition-all duration-300 ease-in-out overflow-hidden ${isRightPanelOpen ? 'w-[320px] lg:w-[380px] opacity-100' : 'w-0 opacity-0 border-none'}`}>
             <div className="w-[320px] lg:w-[380px] h-full overflow-y-auto custom-scrollbar">
               <RightActionPanel 
                  editForm={editForm} 
                  isPackageReady={isPackageReady} 
                  updateLoading={updateLoading} 
                  canEditGlobal={canEditGlobal} 
                  isGlobalEditing={isGlobalEditing}
                  isAdmin={isAdmin}
                  isCollaboratorView={isCollaboratorView}
                  isCancelled={isCancelled}
                  hasChanges={isFormDirty}
                  hasAudiovisual={hasAudiovisual}
                  onCollaboratorDeliver={() => {
                    const fakeLinkBtn = document.getElementById('btn-hidden-deliver');
                    if (fakeLinkBtn) fakeLinkBtn.click();
                  }}
                  myAssignment={myAssignment}
                  onDeliver={handleDeliverPackage} 
                  onOpenAdjustments={() => setIsAdjModalOpen(true)} 
                  globalAdjustments={globalAdjustments} 
                  projects={projects}
                  prioritiesCatalog={prioritiesCatalog}
                  onFormChange={handleFormChange}
                  request={request}
                  onSave={handleSaveChanges}
                  onRenameProject={handleRenameProject}
                />
             </div>
          </div>

          <button 
            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
            className={`absolute top-1/2 -translate-y-1/2 z-40 bg-white dark:bg-[#141419] border border-gray-200 dark:border-zinc-700 text-gray-500 hover:text-blue-500 p-2.5 rounded-l-2xl shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out cursor-pointer hover:pl-4 ${isRightPanelOpen ? 'right-[320px] lg:right-[380px]' : 'right-0'}`}
            title={isRightPanelOpen ? "Esconder panel" : "Mostrar panel"}
          >
            {isRightPanelOpen ? <SidebarClose size={20} strokeWidth={2.5} /> : <SidebarOpen size={20} strokeWidth={2.5} />}
          </button>

        </div>
      </div>

      <RegisterAdjustmentsModal isOpen={isAdjModalOpen} onClose={() => setIsAdjModalOpen(false)} request={request} tasks={tasks} onRefresh={fetchRequestTasks} />
      
      <DuplicateInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        requestId={request.id}
        requestTitle={request.title || 'Ticket'}
        onRefreshParent={fetchRequestTasks}
      />
    </div>
  );
}
