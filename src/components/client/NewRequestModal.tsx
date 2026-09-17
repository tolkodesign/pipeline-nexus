import { useState, useEffect } from 'react';
import { X, Send, Calendar, AlertCircle, Briefcase, User, Layers, Link2, Hash, Layout, Plus, Trash2, Mail, HelpCircle, Building2, BellOff, PackageCheck, Users, ChevronDown, FileText, Flag, Sparkles, ListChecks, UserCheck, Check, Search, Package, ChevronUp } from 'lucide-react';
import Swal from 'sweetalert2';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import NewProjectModal from './NewProjectModal';
import ModalTour from './ModalTour';
import DeliverablesManagerModal from '../admin/modals/DeliverablesManagerModal'; 
import DisciplineTabs from '../admin/modals/edit-request/DisciplineTabs';
import TaskWorkspace from '../admin/modals/edit-request/TaskWorkspace';
import { Skeleton } from '../../components/admin/ui/Skeleton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  organizationId?: string; 
  isAdminMode?: boolean;   
  clients?: any[];
  clientUsers?: any[];
  onRefresh?: () => void;
}

const DISCIPLINES = [
  { key: 'needs_copy', label: 'Contenido' },
  { key: 'needs_design', label: 'Diseño' },
  { key: 'needs_av', label: 'Audiovisual' },
  { key: 'needs_dev', label: 'Programación' },
  { key: 'needs_prod', label: 'Producción' },
  { key: 'needs_staff', label: 'Staff' },
  { key: 'needs_rp', label: 'RP' }
];

export default function NewRequestModal({ isOpen, onClose, organizationId, isAdminMode, clients = [], clientUsers = [], onRefresh }: Props) {
  const { user, profile } = useAuth();
  
  const roleIdNum = Number(profile?.role_id);
  const roleText = (profile?.internal_role || '').toLowerCase().trim();
  const isAdminOrJefatura = profile?.is_admin || roleIdNum === 3 || roleText === 'admin' || 
                            [2, 4, 5].includes(roleIdNum) || 
                            ['lider', 'líder', 'coordinador', 'ejecutivo', 'ejecutivo de comunicación'].includes(roleText);
  const isInternalUser = isAdminMode || isAdminOrJefatura;

  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false); 
  const [links, setLinks] = useState<string[]>(['']);

  const [categories, setCategories] = useState<any[]>([]);
  const [clientDeliverables, setClientDeliverables] = useState<any[]>([]);
  const [priorities, setPriorities] = useState<any[]>([]);
  const [specialtiesCatalog, setSpecialtiesCatalog] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]); 

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isDeliverableModalOpen, setIsDeliverableModalOpen] = useState(false);
  const [autoSelectNewDeliverable, setAutoSelectNewDeliverable] = useState(false);

  // ESTADOS DEL BUSCADOR Y DESPLEGABLE PERSONALIZADO DE ENTREGABLES
  const [isDeliverableDropdownOpen, setIsDeliverableDropdownOpen] = useState(false);
  const [deliverableSearchQuery, setDeliverableSearchQuery] = useState('');
  const [showIndividualsSection, setShowIndividualDeliverables] = useState(false);
  
  const [runModalTour, setRunModalTour] = useState(false);
  const [orgPrimaryColor, setOrgPrimaryColor] = useState('#D3002D');
  const [orgBannerUrl, setOrgBannerUrl] = useState<string | null>(null);
  const [sendClientEmail, setSendClientEmail] = useState(false);

  const [selectedOrgId, setSelectedOrgId] = useState(organizationId || '');
  const [requesterId, setRequesterId] = useState('');
  const [availableRequesters, setAvailableRequesters] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<string>('Diseño');
  const [editingAssignee, setEditingAssignee] = useState<Record<string, boolean>>({});

  const [entryMode, setEntryMode] = useState<'unico' | 'checklist'>('unico');
  const [customBreakdown, setCustomBreakdown] = useState<any[]>([]);
  const [checklistItem, setChecklistItem] = useState({
    name: '',
    quantity: 1,
    isPackageWarning: false, 
    needs_copy: false,
    needs_design: false,
    needs_av: false,
    needs_dev: false,
    needs_prod: false,
    needs_staff: false,
    needs_rp: false,
    specialty_ids: [] as number[]
  });

  const activeOrgId = isAdminMode ? selectedOrgId : organizationId;
  const activeClientObj = clients?.find(c => c.id === activeOrgId) || { id: activeOrgId, name: 'Cliente Actual' };

  const [formData, setFormData] = useState<any>({
    projectId: '', 
    title: '',
    department: '',
    deliverableId: '',
    priorityId: '',
    quantity: 0, 
    dueDate: '',
    due_date: '',
    description: '',
    ccEmails: '',
    needs_copy: false,
    needs_design: false,
    needs_av: false,
    needs_dev: false,
    needs_prod: false,
    needs_staff: false,
    needs_rp: false,
    specialty_ids: [] as number[],
    items_breakdown: [],
    tasks: {
      'Contenido': { assignees_details: [], coordinator_notes: '' },
      'Diseño': { assignees_details: [], coordinator_notes: '' },
      'Audiovisual': { assignees_details: [], coordinator_notes: '' },
      'Programación': { assignees_details: [], coordinator_notes: '' },
      'Producción': { assignees_details: [], coordinator_notes: '' },
      'Staff': { assignees_details: [], coordinator_notes: '' },
      'RP': { assignees_details: [], coordinator_notes: '' }
    }
  });

  const today = new Date().toISOString().split('T')[0];

  const normDiscipline = (str: string) => {
    const s = (str || '').toLowerCase().trim();
    if (s.includes('dev') || s.includes('progra') || s.includes('code') || s.includes('web') || s.includes('plataforma')) return 'needs_dev';
    if (s.includes('desig') || s.includes('diseñ') || s.includes('diseno')) return 'needs_design';
    if (s.includes('av') || s.includes('audio') || s.includes('video')) return 'needs_av';
    if (s.includes('copy') || s.includes('contenid') || s.includes('redac')) return 'needs_copy';
    if (s.includes('prod')) return 'needs_prod';
    if (s.includes('staff')) return 'needs_staff';
    if (s.includes('rp') || s.includes('relacion')) return 'needs_rp';
    return '';
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedOrgId(organizationId || '');
      setRequesterId('');
      setSendClientEmail(false);
    }
  }, [isOpen, organizationId]);

  useEffect(() => {
    if (isAdminMode && selectedOrgId) {
      setAvailableRequesters(clientUsers.filter(u => u.organization_id === selectedOrgId));
    } else {
      setAvailableRequesters([]);
    }
  }, [selectedOrgId, isAdminMode, JSON.stringify(clientUsers)]);

  useEffect(() => {
    if (isOpen && activeOrgId) {
      setIsFetching(true); 
      Promise.all([
        fetchDropdownData(activeOrgId),
        fetchProjects(activeOrgId)
      ]).finally(() => {
        setIsFetching(false); 
      });
    } else {
      setProjects([]);
      setClientDeliverables([]);
      setOrgBannerUrl(null);
    }
  }, [isOpen, activeOrgId]);

  const fetchDropdownData = async (orgId: string, shouldAutoSelectNewest = false) => {
    try {
      const [catsRes, priosRes, deliverablesRes, orgRes, specRes, staffRes] = await Promise.all([
        supabase.from('request_categories').select('*'),
        supabase.from('priorities').select('*').order('weight', { ascending: false }),
        supabase.from('organization_deliverables').select(`
          *,
          package_deliverable_items!package_id (
            quantity,
            item:organization_deliverables!item_deliverable_id(*)
          )
        `).eq('organization_id', orgId).eq('is_active', true).order('created_at', { ascending: false }),
        supabase.from('organizations').select('primary_color, banner_url').eq('id', orgId).single(),
        supabase.from('specialties').select('id, name'),
        supabase.from('profiles').select('id, full_name, role_id, is_admin, specialty, specialty_id, internal_roles(name), specialties(name)').not('role_id', 'is', null)
      ]);

      if (catsRes.data) setCategories(catsRes.data);
      if (priosRes.data) setPriorities(priosRes.data); 
      if (deliverablesRes.data) {
        setClientDeliverables(deliverablesRes.data);

        // 🔥 AUTO-SELECCIÓN AUTOMÁTICA DEL ENTREGABLE RECIÉN CREADO
        if (shouldAutoSelectNewest && deliverablesRes.data.length > 0) {
          const newlyCreated = deliverablesRes.data[0];
          if (newlyCreated) {
            selectDeliverableById(newlyCreated.id, deliverablesRes.data);
          }
        }
      }
      if (specRes.data) setSpecialtiesCatalog(specRes.data);
      if (staffRes.data) setStaffList(staffRes.data);
      if (orgRes.data) {
        if (orgRes.data.primary_color) setOrgPrimaryColor(orgRes.data.primary_color);
        if (orgRes.data.banner_url) setOrgBannerUrl(orgRes.data.banner_url);
        else setOrgBannerUrl(null);
      }
    } catch (error) {
      console.error("Error cargando catálogos:", error);
    }
  };

  const fetchProjects = async (orgId: string, autoSelectLatest = false) => {
    try {
      const { data } = await supabase
        .from('projects')
        .select('id, name')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false });

      if (data) {
        setProjects(data);
        if (autoSelectLatest && data.length > 0) {
          setFormData((prev: any) => ({ ...prev, projectId: data[0].id }));
        }
      }
    } catch (error) {
      console.error("Error cargando proyectos:", error);
    }
  };

  const handleTaskChange = (discipline: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [discipline]: {
          ...(prev.tasks[discipline] || {}),
          [field]: value
        }
      }
    }));
  };

  const handleToggleDiscipline = (key: string) => {
    setFormData((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLinkChange = (index: number, value: string) => {
    const updatedLinks = [...links];
    updatedLinks[index] = value;
    setLinks(updatedLinks);
  };

  const addLinkField = () => setLinks([...links, '']);
  const removeLinkField = (indexToRemove: number) => setLinks(links.length > 1 ? links.filter((_, idx) => idx !== indexToRemove) : ['']);

  const resetAndClose = () => {
    setFormData({ 
      projectId: '', title: '', department: '', deliverableId: '', priorityId: '', 
      quantity: 0, dueDate: '', due_date: '', description: '', ccEmails: '',
      needs_copy: false, needs_design: false, needs_av: false, needs_dev: false,
      needs_prod: false, needs_staff: false, needs_rp: false,
      specialty_ids: [] as number[],
      items_breakdown: [],
      tasks: {
        'Contenido': { assignees_details: [], coordinator_notes: '' },
        'Diseño': { assignees_details: [], coordinator_notes: '' },
        'Audiovisual': { assignees_details: [], coordinator_notes: '' },
        'Programación': { assignees_details: [], coordinator_notes: '' },
        'Producción': { assignees_details: [], coordinator_notes: '' },
        'Staff': { assignees_details: [], coordinator_notes: '' },
        'RP': { assignees_details: [], coordinator_notes: '' }
      }
    });
    setLinks(['']); 
    setCustomBreakdown([]);
    setEntryMode('unico');
    setIsDeliverableDropdownOpen(false);
    setDeliverableSearchQuery('');
    setShowIndividualDeliverables(false);
    setChecklistItem({ name: '', quantity: 1, isPackageWarning: false, needs_copy: false, needs_design: false, needs_av: false, needs_dev: false, needs_prod: false, needs_staff: false, needs_rp: false, specialty_ids: [] });
    onClose();
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'NUEVO_PROYECTO') {
      setIsProjectModalOpen(true);
      setFormData((prev: any) => ({ ...prev, projectId: '' })); 
    } else {
      setFormData((prev: any) => ({ ...prev, projectId: val }));
    }
  };

  const recalculateFromBreakdown = (items: any[]) => {
    const newDisciplines: Record<string, any> = {
      needs_copy: false, needs_design: false, needs_av: false,
      needs_dev: false, needs_prod: false, needs_staff: false, needs_rp: false,
      specialty_ids: [] as number[]
    };
    let totalQty = 0;
    let allSpecIds = new Set<number>();
    
    items.forEach(item => {
      totalQty += item.quantity || 1;
      if (item.needs_copy) newDisciplines.needs_copy = true;
      if (item.needs_design) newDisciplines.needs_design = true;
      if (item.needs_av) newDisciplines.needs_av = true;
      if (item.needs_dev) newDisciplines.needs_dev = true;
      if (item.needs_prod) newDisciplines.needs_prod = true;
      if (item.needs_staff) newDisciplines.needs_staff = true;
      if (item.needs_rp) newDisciplines.needs_rp = true;
      if (item.specialty_ids && Array.isArray(item.specialty_ids)) {
        item.specialty_ids.forEach((id: number) => allSpecIds.add(id));
      }
    });

    specialtiesCatalog.forEach(s => {
      const canonicalName = normDiscipline(s.name);
      let isActive = false;
      if (newDisciplines.needs_copy && canonicalName === 'needs_copy') isActive = true;
      if (newDisciplines.needs_design && canonicalName === 'needs_design') isActive = true;
      if (newDisciplines.needs_av && canonicalName === 'needs_av') isActive = true;
      if (newDisciplines.needs_dev && canonicalName === 'needs_dev') isActive = true;
      if (newDisciplines.needs_prod && canonicalName === 'needs_prod') isActive = true;
      if (newDisciplines.needs_staff && canonicalName === 'needs_staff') isActive = true;
      if (newDisciplines.needs_rp && canonicalName === 'needs_rp') isActive = true;
      if (allSpecIds.has(s.id)) isActive = true;

      newDisciplines[`specialty_${s.id}`] = isActive;
    });

    newDisciplines.specialty_ids = Array.from(allSpecIds);

    const firstActiveSpec = specialtiesCatalog.find(s => newDisciplines[`specialty_${s.id}`]);
    if (firstActiveSpec) {
      setActiveTab(firstActiveSpec.name);
    }

    setFormData((prev: any) => ({ ...prev, quantity: totalQty, items_breakdown: items, ...newDisciplines }));
  };

  const handleModeChange = (mode: 'unico' | 'checklist') => {
    setEntryMode(mode);
    setCustomBreakdown([]);
    setFormData((prev: any) => ({ ...prev, deliverableId: '', quantity: 1, items_breakdown: [], needs_copy: false, needs_design: false, needs_av: false, needs_dev: false, needs_prod: false, needs_staff: false, needs_rp: false }));
  };

  const handleChecklistNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const matched = clientDeliverables.find(d => (d.name === val || d.format_name === val));
    
    if (matched) {
      if (matched.is_package) {
        setChecklistItem(prev => ({
          ...prev, name: val, isPackageWarning: true, 
          needs_copy: false, needs_design: false, needs_av: false, needs_dev: false, needs_prod: false, needs_staff: false, needs_rp: false
        }));
      } else {
        setChecklistItem(prev => ({
          ...prev, name: val, isPackageWarning: false,
          needs_copy: matched.needs_copy || false, needs_design: matched.needs_design || false, needs_av: matched.needs_av || false,
          needs_dev: matched.needs_dev || false, needs_prod: matched.needs_prod || false, needs_staff: matched.needs_staff || false,
          needs_rp: matched.needs_rp || false, specialty_ids: matched.specialty_ids || []
        }));
      }
    } else {
      setChecklistItem(prev => ({ ...prev, name: val, isPackageWarning: false }));
    }
  };

  const handleAddChecklistItem = () => {
    if (!checklistItem.name.trim()) return Swal.fire('Atención', 'Ponle un nombre o selecciona un entregable de la lista.', 'warning');
    
    const matched = clientDeliverables.find(d => (d.name === checklistItem.name || d.format_name === checklistItem.name));
    
    let newItemsToAdd: any[] = [];

    if (matched && matched.is_package && matched.package_deliverable_items) {
      newItemsToAdd = matched.package_deliverable_items.map((pi: any) => ({
        id: Math.random().toString(),
        name: pi.item?.name || pi.item?.format_name || 'Pieza',
        label: pi.item?.name || pi.item?.format_name || 'Pieza',
        quantity: (pi.quantity || 1) * checklistItem.quantity, 
        needs_copy: pi.item?.needs_copy || false,
        needs_design: pi.item?.needs_design || false,
        needs_av: pi.item?.needs_av || false,
        needs_dev: pi.item?.needs_dev || false,
        needs_prod: pi.item?.needs_prod || false,
        needs_staff: pi.item?.needs_staff || false,
        needs_rp: pi.item?.needs_rp || false,
        specialty_ids: pi.item?.specialty_ids || []
      }));
    } else {
      const hasArea = checklistItem.needs_copy || checklistItem.needs_design || checklistItem.needs_av || checklistItem.needs_dev || checklistItem.needs_prod || checklistItem.needs_staff || checklistItem.needs_rp || checklistItem.specialty_ids.length > 0;
      if (!hasArea) return Swal.fire('Atención', 'Selecciona al menos un área (ej. Diseño, Audiovisual) para este entregable.', 'warning');
      
      newItemsToAdd = [{ ...checklistItem, label: checklistItem.name, id: Math.random().toString() }];
    }

    const updatedBreakdown = [...customBreakdown, ...newItemsToAdd];
    setCustomBreakdown(updatedBreakdown);
    recalculateFromBreakdown(updatedBreakdown);
    
    setChecklistItem({ name: '', quantity: 1, isPackageWarning: false, needs_copy: false, needs_design: false, needs_av: false, needs_dev: false, needs_prod: false, needs_staff: false, needs_rp: false, specialty_ids: [] });
  };

  // 🔥 LÓGICA REUTILIZABLE PARA SELECCIONAR ENTREGABLE POR ID
  const selectDeliverableById = (delivId: string, catalog = clientDeliverables) => {
    const selectedDeliv = catalog.find((d: any) => d.id === delivId);
    if (!selectedDeliv) return;

    let breakdown: any[] = [];
    if (selectedDeliv.is_package && selectedDeliv.package_deliverable_items?.length) {
      breakdown = selectedDeliv.package_deliverable_items.map((pi: any) => ({
        id: pi.item?.id || pi.item_deliverable_id || Math.random().toString(),
        name: pi.item?.name || 'Entregable',
        label: pi.item?.name || 'Entregable',
        quantity: pi.quantity || 1,
        needs_copy: pi.item?.needs_copy, needs_design: pi.item?.needs_design,
        needs_av: pi.item?.needs_av, needs_dev: pi.item?.needs_dev,
        needs_prod: pi.item?.needs_prod, needs_staff: pi.item?.needs_staff, needs_rp: pi.item?.needs_rp,
        specialty_ids: pi.item?.specialty_ids || []
      }));
    } else {
      breakdown = [{
        id: selectedDeliv.id,
        name: selectedDeliv.name || selectedDeliv.format_name,
        label: selectedDeliv.name || selectedDeliv.format_name,
        quantity: 1,
        needs_copy: selectedDeliv.needs_copy, needs_design: selectedDeliv.needs_design,
        needs_av: selectedDeliv.needs_av, needs_dev: selectedDeliv.needs_dev,
        needs_prod: selectedDeliv.needs_prod, needs_staff: selectedDeliv.needs_staff, needs_rp: selectedDeliv.needs_rp,
        specialty_ids: selectedDeliv.specialty_ids || []
      }];
    }

    setFormData((prev: any) => ({ ...prev, deliverableId: delivId }));
    setCustomBreakdown(breakdown);
    recalculateFromBreakdown(breakdown);
    setIsDeliverableDropdownOpen(false);
    setDeliverableSearchQuery('');
  };

  const removeItemFromBreakdown = (indexToRemove: number) => {
    const updated = customBreakdown.filter((_, idx) => idx !== indexToRemove);
    setCustomBreakdown(updated);
    recalculateFromBreakdown(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (isAdminMode && (!activeOrgId || !requesterId)) return Swal.fire('Atención', 'Debes seleccionar la empresa y el usuario que solicitó esto.', 'warning');
    if (!formData.projectId) return Swal.fire('Atención', 'Por favor selecciona o crea un Tablero para esta solicitud.', 'warning');
    
    if (entryMode === 'checklist' && customBreakdown.length === 0) return Swal.fire('Atención', 'Agrega al menos un entregable a tu checklist.', 'warning');

    const hasAnyDiscipline = formData.needs_copy || formData.needs_design || formData.needs_av || formData.needs_dev || formData.needs_prod || formData.needs_staff || formData.needs_rp || (formData.specialty_ids && formData.specialty_ids.length > 0);
    if (!hasAnyDiscipline) return Swal.fire('Atención', 'La solicitud debe incluir al menos un entregable o disciplina activa.', 'warning');
    
    setLoading(true);
    try {
      const activeLinks = links.filter(l => l.trim() !== '');
      const selectedDeliv = clientDeliverables.find(d => d.id === formData.deliverableId);
      let finalDescription = formData.description;
      if (customBreakdown.length > 0) {
        const breakdownSummary = customBreakdown.map(i => `• ${i.quantity}x ${i.name}`).join('\n');
        finalDescription = `${formData.description}\n\n📦 **DESGLOSE DE ENTREGABLES INCLUIDOS:**\n${breakdownSummary}`;
      }

      const findSpecialtyId = (keywords: string[]) => {
        const spec = specialtiesCatalog.find(s => keywords.some(kw => s.name.toLowerCase().includes(kw)));
        return spec ? spec.id : null;
      };

      const specIdsMap: Record<string, number | null> = {
        needs_copy: findSpecialtyId(['contenido', 'copy']),
        needs_design: findSpecialtyId(['diseño', 'diseno']),
        needs_av: findSpecialtyId(['audiovisual']),
        needs_dev: findSpecialtyId(['programación', 'programacion']),
        needs_prod: findSpecialtyId(['producción', 'produccion']),
        needs_staff: findSpecialtyId(['staff']),
        needs_rp: findSpecialtyId(['relaciones públicas', 'relaciones publicas', 'rp'])
      };

      const allTaskSpecialtyIds = new Set<number>();
      Object.keys(specIdsMap).forEach(key => {
        if ((formData as any)[key] && specIdsMap[key]) allTaskSpecialtyIds.add(specIdsMap[key] as number);
      });
      if (formData.specialty_ids && formData.specialty_ids.length > 0) formData.specialty_ids.forEach((id: number) => allTaskSpecialtyIds.add(id));
      const finalSpecialtyIds = Array.from(allTaskSpecialtyIds);

      let totalAssigneesCount = 0;
      DISCIPLINES.forEach(d => {
        const taskConf = formData.tasks?.[d.label];
        if (taskConf?.assignees_details?.length > 0) {
          totalAssigneesCount += taskConf.assignees_details.length;
        }
      });

      const initialStatus = totalAssigneesCount > 0 ? 'en_proceso' : 'pendiente';

      const requestPayload = {
        organization_id: activeOrgId,
        project_id: formData.projectId,
        requester_id: isAdminMode ? requesterId : user.id,
        title: formData.title,
        department: formData.department,
        organization_deliverable_id: entryMode === 'unico' ? (formData.deliverableId || null) : null,
        category_id: selectedDeliv ? selectedDeliv.category_id : null,
        target_format_id: selectedDeliv ? selectedDeliv.target_format_id : null,
        priority_id: parseInt(formData.priorityId),
        quantity: formData.quantity || 1, 
        due_date: formData.dueDate || formData.due_date || null,
        original_due_date: formData.dueDate || formData.due_date || null,
        external_resource_url: activeLinks[0] || null, 
        description: finalDescription,
        cc_emails: formData.ccEmails, 
        status: initialStatus,
        send_email_notification: !isInternalUser ? true : sendClientEmail,
        needs_copy: formData.needs_copy, needs_design: formData.needs_design,
        needs_av: formData.needs_av, needs_dev: formData.needs_dev,
        needs_prod: formData.needs_prod, needs_staff: formData.needs_staff, needs_rp: formData.needs_rp,
        specialty_ids: finalSpecialtyIds,
        items_breakdown: customBreakdown 
      };
      
      const { data: newRequest, error: reqError } = await supabase.from('requests').insert([requestPayload]).select('id').single();
      if (reqError) throw reqError;

      const disciplineNamesMap: Record<string, string> = {
        needs_copy: 'Contenido', needs_design: 'Diseño', needs_av: 'Audiovisual',
        needs_dev: 'Programación', needs_prod: 'Producción', needs_staff: 'Staff', needs_rp: 'RP'
      };
      const getSpecName = (id: number) => specialtiesCatalog.find(s => s.id === id)?.name || 'Nueva Área';

      const initialTasks = finalSpecialtyIds.map(specId => {
        const legacyKey = Object.keys(specIdsMap).find(k => specIdsMap[k] === specId);
        const discName = legacyKey ? disciplineNamesMap[legacyKey] : getSpecName(specId);
        const taskConf = formData.tasks?.[discName] || {};
        const flatAssignees = (taskConf.assignees_details || []).map((a: any) => a.profile_id);

        return { 
          request_id: newRequest.id, 
          discipline: discName, 
          specialty_id: specId, 
          status: 'pendiente', 
          quantity: formData.quantity || 1,
          assigned_to: flatAssignees,
          coordinator_notes: taskConf.coordinator_notes || null
        };
      });

      if (initialTasks.length > 0) {
        const { data: createdTasks, error: tasksErr } = await supabase.from('request_tasks').insert(initialTasks).select();
        if (tasksErr) console.warn("Aviso al crear tareas iniciales:", tasksErr.message);

        if (createdTasks && createdTasks.length > 0 && isInternalUser) {
          const assigneeInserts: any[] = [];

          createdTasks.forEach(task => {
            const taskConf = formData.tasks?.[task.discipline];
            if (taskConf?.assignees_details?.length > 0) {
              taskConf.assignees_details.forEach((a: any) => {
                assigneeInserts.push({
                  task_id: task.id,
                  profile_id: a.profile_id,
                  assigned_by: user.id,
                  assigned_quantity: a.assigned_quantity || 1,
                  specific_instructions: a.specific_instructions || '',
                  assigned_items: a.assigned_items || [],
                  due_date: a.due_date || formData.dueDate || formData.due_date || null,
                  status: 'pendiente'
                });
              });
            }
          });

          if (assigneeInserts.length > 0) {
            await supabase.from('task_assignees').insert(assigneeInserts);
          }
        }
      }

      if (activeLinks.length > 0) {
        const linksPayload = activeLinks.map(url => ({ request_id: newRequest.id, storage_path: url, file_type: 'input', uploader_id: user.id }));
        await supabase.from('request_files').insert(linksPayload);
      }
      
      Swal.fire({ title: '¡ENVIADO!', text: 'Tu solicitud ya está en el pipeline.', icon: 'success', confirmButtonColor: '#D3002D' });
      resetAndClose();
      if (onRefresh) onRefresh();
    } catch (error: any) {
      Swal.fire({ title: 'Error de Envío', text: error.message, icon: 'error', confirmButtonColor: '#D3002D' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const disciplinesCatalog = specialtiesCatalog.map(s => ({
    id: s.id,
    key: `specialty_${s.id}`,
    name: s.name
  }));

  const headerStyle = {
    backgroundColor: orgPrimaryColor || '#D3002D',
    ...(orgBannerUrl ? {
      backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 100%), url(${orgBannerUrl})`,
      backgroundSize: 'cover', backgroundPosition: 'center'
    } : {})
  };

  const normalizedStaffCatalog = staffList.map(s => {
    const spec = (s.specialty || '').toLowerCase().trim();
    if (spec === 'relaciones públicas' || spec === 'relaciones publicas') { return { ...s, specialty: 'RP' }; }
    return s;
  });

  // FILTRADO DE ENTREGABLES PARA EL DESPLEGABLE PERSONALIZADO
  const packagesList = clientDeliverables.filter(d => d.is_package && (d.name || d.format_name || '').toLowerCase().includes(deliverableSearchQuery.toLowerCase()));
  const individualsList = clientDeliverables.filter(d => !d.is_package && (d.name || d.format_name || '').toLowerCase().includes(deliverableSearchQuery.toLowerCase()));

  const selectedDeliverableObj = clientDeliverables.find(d => d.id === formData.deliverableId);

  return (
    <>
      <ModalTour run={runModalTour} onFinish={() => setRunModalTour(false)} primaryColor={orgPrimaryColor} />
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/70 dark:bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
        <div className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-zinc-800 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh] md:max-h-[90vh]">
          
          <div className="p-6 md:p-8 flex justify-between items-center shrink-0 relative overflow-hidden" style={headerStyle}>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter drop-shadow-md">
                {isAdminMode ? 'Levantar Ticket de Cliente' : 'Solicitud de Materiales'}
              </h2>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/90 font-bold mt-1.5 drop-shadow-sm">Pipeline de Contenido</p>
            </div>
            <div className="flex gap-2 relative z-10">
              <button type="button" onClick={() => setRunModalTour(true)} className="text-white hover:bg-black/20 p-2 rounded-xl transition-colors cursor-pointer" title="¿Cómo llenar este formulario?">
                <HelpCircle size={24} />
              </button>
              <button type="button" onClick={resetAndClose} className="text-white hover:bg-black/20 p-2 rounded-xl transition-colors cursor-pointer">
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto custom-scrollbar p-6 md:p-10 flex-1">
            <form id="request-form" onSubmit={handleSubmit} className="space-y-10">
              
              {isAdminMode && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-red-50/50 dark:bg-luxury-red/5 border border-red-100 dark:border-luxury-red/20 p-6 rounded-[20px] mb-8">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-luxury-red uppercase tracking-widest px-1 flex items-center gap-1.5"><Building2 size={12}/> Empresa Cliente *</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-red/50" size={16}/>
                      <select required value={selectedOrgId} onChange={e => { setSelectedOrgId(e.target.value); setRequesterId(''); }} className="w-full h-12 bg-white dark:bg-[#0a0a0c] border border-gray-200 dark:border-luxury-red/30 rounded-xl pl-11 pr-10 text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none appearance-none transition-colors cursor-pointer font-bold shadow-sm">
                        <option value="" disabled>Selecciona la empresa...</option>
                        {clients?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-red/50 pointer-events-none" size={16}/>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-luxury-red uppercase tracking-widest px-1 flex items-center gap-1.5"><User size={12}/> ¿Quién lo solicitó? *</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-red/50" size={16}/>
                      <select required disabled={!selectedOrgId} value={requesterId} onChange={e => setRequesterId(e.target.value)} className="w-full h-12 bg-white dark:bg-[#0a0a0c] border border-gray-200 dark:border-luxury-red/30 rounded-xl pl-11 pr-10 text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none appearance-none transition-colors cursor-pointer font-bold disabled:opacity-50 shadow-sm">
                        <option value="" disabled>{selectedOrgId ? 'Selecciona quién lo pidió...' : 'Primero elige empresa'}</option>
                        {availableRequesters.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-red/50 pointer-events-none" size={16}/>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
                
                {/* COLUMNA IZQUIERDA */}
                <div className="flex flex-col gap-6">
                  <div className="border-b border-gray-200 dark:border-luxury-border/50 pb-2 h-8 flex items-end">
                    <h3 className="text-luxury-red text-[10px] font-black tracking-[0.2em] uppercase">Información de la Solicitud</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="tour-modal-proyecto space-y-1.5">
                      <label className="text-[10px] font-black text-luxury-red uppercase tracking-widest px-1 flex items-center gap-1.5"><Layout size={12}/> Proyecto / Tablero *</label>
                      {isFetching ? (
                        <Skeleton className="w-full h-12 rounded-xl" />
                      ) : (
                        <div className="relative">
                          <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16}/>
                          <select required disabled={!activeOrgId} value={formData.projectId} onChange={handleProjectChange} className="w-full h-12 bg-red-50/50 dark:bg-luxury-red/5 border border-red-200 dark:border-luxury-red/30 rounded-xl pl-11 pr-10 text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none appearance-none cursor-pointer font-bold disabled:opacity-50 shadow-sm">
                            <option value="" disabled>{activeOrgId ? 'Seleccionar...' : 'Falta empresa'}</option>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            {activeOrgId && <option value="NUEVO_PROYECTO" className="text-luxury-red font-black">➕ CREAR TABLERO...</option>}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16}/>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1 flex items-center gap-1.5"><Users size={12}/> Departamento / Área (Opc)</label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16}/>
                        <input type="text" list="departmentsList" placeholder="Ej: RRHH, Comms" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full h-12 bg-gray-50 dark:bg-[#0a0a0c] border border-gray-200 dark:border-luxury-border rounded-xl pl-11 pr-4 text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none transition-colors shadow-sm" />
                      </div>
                      <datalist id="departmentsList">
                        <option value="Comms" /><option value="RRHH" /><option value="TI" /><option value="HSSE" /><option value="Marketing" /><option value="Operaciones" /><option value="Ventas" />
                      </datalist>
                    </div>
                  </div>
                  
                  <div className="tour-modal-info space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1 flex items-center gap-1.5"><Briefcase size={12}/> Nombre de la Solicitud *</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16}/>
                      <input required type="text" placeholder="Ej: Arte para Redes Q4" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full h-12 bg-gray-50 dark:bg-[#0a0a0c] border border-gray-200 dark:border-luxury-border rounded-xl pl-11 pr-4 text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none transition-colors shadow-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1 flex items-center gap-1.5"><Flag size={12}/> Prioridad *</label>
                      {isFetching ? (
                        <Skeleton className="w-full h-12 rounded-xl" />
                      ) : (
                        <div className="relative">
                          <Flag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16}/>
                          <select required value={formData.priorityId} onChange={e => setFormData({...formData, priorityId: e.target.value})} className="w-full h-12 bg-gray-50 dark:bg-[#0a0a0c] border border-gray-200 dark:border-luxury-border rounded-xl pl-11 pr-10 text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none appearance-none cursor-pointer shadow-sm">
                            <option value="" disabled>Elegir...</option>
                            {priorities.map(prio => <option key={prio.id} value={prio.id}>{prio.level}</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16}/>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-luxury-red uppercase tracking-widest px-1 flex items-center gap-1.5"><Calendar size={12}/> Deadline Deseado *</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-red/50 dark:text-luxury-red/80" size={16}/>
                        <input required type="date" min={today} value={formData.dueDate || formData.due_date} onChange={e => setFormData({...formData, dueDate: e.target.value, due_date: e.target.value})} className="w-full h-12 bg-red-50/30 dark:bg-luxury-red/5 border border-red-200 dark:border-luxury-border/50 rounded-xl pl-11 pr-4 text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none transition-colors cursor-pointer shadow-sm font-bold" />
                      </div>
                    </div>
                  </div>

                </div>

                {/* COLUMNA DERECHA */}
                <div className="flex flex-col gap-6">
                  
                  <div className="border-b border-gray-200 dark:border-luxury-border/50 pb-2 flex items-center justify-between">
                    <h3 className="text-luxury-red text-[10px] font-black tracking-[0.2em] uppercase">Especificaciones Técnicas</h3>
                    <div className="flex items-center bg-gray-100 dark:bg-white/5 p-1 rounded-lg">
                      <button type="button" onClick={() => handleModeChange('unico')} className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${entryMode === 'unico' ? 'bg-white dark:bg-luxury-card text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>Único</button>
                      <button type="button" onClick={() => handleModeChange('checklist')} className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-md transition-all flex items-center gap-1 ${entryMode === 'checklist' ? 'bg-white dark:bg-luxury-card text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}><ListChecks size={12}/> Checklist</button>
                    </div>
                  </div>
                  
                  <div className="tour-modal-specs flex flex-col gap-5 w-full">
                    
                    {entryMode === 'unico' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                        
                        {/* 🔥 DESPLEGABLE PERSONALIZADO DE ENTREGABLES (CON BUSCADOR, ÍCONOS Y AGROUPADO SEPARADO) 🔥 */}
                        <div className="sm:col-span-8 space-y-1.5 relative">
                          <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1 flex items-center gap-1.5"><Layers size={12}/> Entregable a Solicitar *</label>
                          {isFetching ? (
                            <Skeleton className="w-full h-12 rounded-xl" />
                          ) : (
                            <div>
                              <button
                                type="button"
                                disabled={!activeOrgId}
                                onClick={() => setIsDeliverableDropdownOpen(!isDeliverableDropdownOpen)}
                                className="w-full h-12 bg-gray-50 dark:bg-[#0a0a0c] border border-gray-200 dark:border-luxury-border rounded-xl px-4 text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none flex items-center justify-between cursor-pointer disabled:opacity-50 font-bold shadow-sm"
                              >
                                <span className="flex items-center gap-2 truncate">
                                  {selectedDeliverableObj ? (
                                    <>
                                      {selectedDeliverableObj.is_package ? <Package size={16} className="text-amber-500 shrink-0"/> : <FileText size={16} className="text-blue-500 shrink-0"/>}
                                      <span className="truncate">{selectedDeliverableObj.name || selectedDeliverableObj.format_name}</span>
                                    </>
                                  ) : (
                                    <span className="text-gray-400 font-normal">{activeOrgId ? 'Seleccionar entregable...' : 'Falta empresa'}</span>
                                  )}
                                </span>
                                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isDeliverableDropdownOpen ? 'rotate-180' : ''}`}/>
                              </button>

                              {isDeliverableDropdownOpen && (
                                <>
                                  <div className="fixed inset-0 z-40" onClick={() => setIsDeliverableDropdownOpen(false)}/>
                                  <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-[#141419] border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-80 animate-in fade-in zoom-in-95 duration-150">
                                    
                                    {/* BUSCADOR DENTRO DEL MENU */}
                                    <div className="p-3 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-black/30 shrink-0 relative">
                                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
                                      <input 
                                        type="text"
                                        placeholder="Buscar entregable o paquete..."
                                        value={deliverableSearchQuery}
                                        onChange={e => setDeliverableSearchQuery(e.target.value)}
                                        className="w-full h-9 bg-white dark:bg-[#070709] border border-gray-200 dark:border-zinc-700 rounded-xl pl-9 pr-3 text-xs text-gray-900 dark:text-white outline-none focus:border-luxury-red font-bold"
                                        autoFocus
                                      />
                                    </div>

                                    <div className="overflow-y-auto custom-scrollbar p-2 space-y-2 flex-1">
                                      
                                      {/* SECCIÓN 1: 📦 PAQUETES DE ENTREGABLES */}
                                      {packagesList.length > 0 && (
                                        <div className="space-y-1">
                                          <span className="text-[9px] font-black uppercase text-amber-500 px-2 flex items-center gap-1 tracking-widest">
                                            <Package size={12}/> Paquetes Completo ({packagesList.length})
                                          </span>
                                          {packagesList.map(deliv => (
                                            <div
                                              key={deliv.id}
                                              onClick={() => selectDeliverableById(deliv.id)}
                                              className={`p-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-between group ${formData.deliverableId === deliv.id ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-800 dark:text-gray-200'}`}
                                            >
                                              <div className="flex items-center gap-2 truncate">
                                                <Package size={15} className="text-amber-500 shrink-0"/>
                                                <span className="truncate">{deliv.name || deliv.format_name}</span>
                                              </div>
                                              <span className="text-[9px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded shrink-0">PAQUETE</span>
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {/* BOTÓN COLAPSIBLE PARA ENTREGABLES INDIVIDUALES */}
                                      {individualsList.length > 0 && (
                                        <div className="pt-1">
                                          <button
                                            type="button"
                                            onClick={() => setShowIndividualDeliverables(!showIndividualsSection)}
                                            className="w-full p-2 bg-gray-100 dark:bg-zinc-900/80 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 flex items-center justify-between transition-colors cursor-pointer"
                                          >
                                            <span className="flex items-center gap-1.5">
                                              <FileText size={13}/> Ver Entregables Individuales ({individualsList.length})
                                            </span>
                                            {showIndividualsSection || deliverableSearchQuery ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                                          </button>

                                          {/* SECCIÓN 2: 📄 ENTREGABLES INDIVIDUALES */}
                                          {(showIndividualsSection || deliverableSearchQuery.trim() !== '') && (
                                            <div className="mt-1 space-y-1 pl-1 animate-in fade-in duration-150">
                                              {individualsList.map(deliv => (
                                                <div
                                                  key={deliv.id}
                                                  onClick={() => selectDeliverableById(deliv.id)}
                                                  className={`p-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-between group ${formData.deliverableId === deliv.id ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'}`}
                                                >
                                                  <div className="flex items-center gap-2 truncate">
                                                    <FileText size={14} className="text-blue-500 shrink-0"/>
                                                    <span className="truncate">{deliv.name || deliv.format_name}</span>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {/* OPCIÓN PARA CREAR NUEVO ENTREGABLE */}
                                      {activeOrgId && isAdminOrJefatura && (
                                        <div 
                                          onClick={() => {
                                            setIsDeliverableDropdownOpen(false);
                                            setAutoSelectNewDeliverable(true);
                                            setIsDeliverableModalOpen(true);
                                          }}
                                          className="p-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-luxury-red hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer transition-colors flex items-center gap-2 border-t border-gray-100 dark:border-zinc-800 mt-2"
                                        >
                                          <Plus size={14} strokeWidth={3}/> CREAR NUEVO ENTREGABLE...
                                        </div>
                                      )}

                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="sm:col-span-4 space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1 flex items-center gap-1.5"><Hash size={12}/> Cantidad *</label>
                          <div className="relative">
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16}/>
                            <input required type="number" min={1} value={formData.quantity} onChange={e => {
                               const newQty = parseInt(e.target.value) || 1;
                               setFormData({...formData, quantity: newQty});
                               if(customBreakdown.length === 1) {
                                 const updated = [...customBreakdown];
                                 updated[0].quantity = newQty;
                                 setCustomBreakdown(updated);
                               }
                            }} className="w-full h-12 bg-gray-50 dark:bg-[#0a0a0c] border border-gray-200 dark:border-luxury-border rounded-xl pl-11 pr-4 text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none transition-colors shadow-sm font-bold" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-[#0a0a0c] border border-gray-200 dark:border-luxury-border p-4 rounded-2xl space-y-4 shadow-sm">
                          
                          <div className="flex gap-3">
                            <div className="flex-1 space-y-1.5">
                              <label className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase px-1">Busca o escribe el Entregable</label>
                              <input 
                                list="deliverables-catalog"
                                value={checklistItem.name}
                                onChange={handleChecklistNameChange}
                                placeholder="Ej: Infografía, Video, Toolkit..."
                                className="w-full h-10 bg-white dark:bg-[#141419] border border-gray-200 dark:border-white/10 rounded-xl px-3 text-sm text-gray-900 dark:text-white outline-none focus:border-luxury-red font-medium shadow-sm"
                              />
                              <datalist id="deliverables-catalog">
                                {clientDeliverables.map(d => (
                                  <option key={d.id} value={d.name || d.format_name} />
                                ))}
                              </datalist>
                            </div>
                            <div className="w-20 space-y-1.5">
                              <label className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase px-1">Cant.</label>
                              <input 
                                type="number" min={1} 
                                value={checklistItem.quantity} 
                                onChange={e => setChecklistItem({...checklistItem, quantity: parseInt(e.target.value)||1})} 
                                className="w-full h-10 bg-white dark:bg-[#141419] border border-gray-200 dark:border-white/10 rounded-xl px-3 text-sm text-gray-900 dark:text-white font-bold text-center outline-none focus:border-luxury-red shadow-sm" 
                              />
                            </div>
                          </div>
                          
                          {checklistItem.isPackageWarning ? (
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 p-3 rounded-xl flex items-start gap-2">
                              <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
                              <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold leading-tight">
                                Este es un Paquete. Al agregarlo a la lista, se desglosará automáticamente en todas sus piezas individuales y pre-encenderá las áreas correspondientes.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <label className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase px-1">Confirma las áreas de trabajo para este ítem *</label>
                              
                              <div className="relative">
                                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16}/>
                                <select 
                                  value="" 
                                  onChange={(e) => {
                                    if(e.target.value) {
                                      setChecklistItem(prev => ({...prev, [e.target.value]: true}));
                                    }
                                  }}
                                  className="w-full h-10 bg-white dark:bg-[#141419] border border-gray-200 dark:border-white/10 rounded-xl pl-11 pr-10 text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none appearance-none cursor-pointer shadow-sm font-bold"
                                >
                                  <option value="" disabled>Añadir área de trabajo...</option>
                                  {DISCIPLINES.filter(d => !checklistItem[d.key as keyof typeof checklistItem]).map(disc => (
                                    <option key={disc.key} value={disc.key}>{disc.label}</option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16}/>
                              </div>

                              {DISCIPLINES.some(d => checklistItem[d.key as keyof typeof checklistItem]) && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {DISCIPLINES.filter(d => checklistItem[d.key as keyof typeof checklistItem]).map(disc => (
                                    <span key={disc.key} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-luxury-red text-white shadow-sm flex items-center gap-1.5 animate-in fade-in zoom-in duration-200">
                                      {disc.label}
                                      <button type="button" onClick={() => setChecklistItem(prev => ({...prev, [disc.key]: false}))} className="hover:text-black/30 transition-colors cursor-pointer">
                                        <X size={12} strokeWidth={3}/>
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          <button type="button" onClick={handleAddChecklistItem} className="w-full bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm mt-2">
                            <Plus size={14} strokeWidth={3}/> AÑADIR A LA LISTA
                          </button>
                        </div>
                      </div>
                    )}

                    {customBreakdown.length > 0 && (
                      <div className="bg-red-50/50 dark:bg-luxury-red/5 border border-red-100 dark:border-luxury-red/20 p-4 rounded-2xl space-y-3 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between border-b border-red-100 dark:border-luxury-red/20 pb-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-luxury-red flex items-center gap-1.5">
                            <PackageCheck size={14} /> Entregables Agregados
                          </label>
                          <span className="text-[10px] font-black text-gray-600 dark:text-gray-300 bg-white dark:bg-black/40 px-2 py-1 rounded-md border border-gray-200 dark:border-white/10">
                            TOTAL: {formData.quantity} pzs
                          </span>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                          {customBreakdown.map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-[#141419] border border-gray-200 dark:border-zinc-800 p-2.5 rounded-xl flex items-center justify-between shadow-sm group">
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="w-6 h-6 rounded bg-luxury-red/10 text-luxury-red flex items-center justify-center text-[10px] font-black shrink-0">{item.quantity}x</span>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{item.name}</p>
                                  <div className="flex gap-1 mt-1 flex-wrap">
                                    {DISCIPLINES.filter(d => item[d.key]).map(d => (
                                      <span key={d.key} className="text-[8px] font-black uppercase bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded border border-gray-200 dark:border-white/10">{d.label}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <button type="button" onClick={() => removeItemFromBreakdown(idx)} className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 dark:bg-white/5 dark:hover:bg-red-950/30 p-2 rounded-lg transition-all cursor-pointer shrink-0" title="Quitar este ítem">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>

              {/* REUTILIZACIÓN EXACTA DE DISCIPLINE TABS Y TASK WORKSPACE PARA LÍDERES/ADMINS */}
              {isInternalUser && (
                <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-luxury-border/50">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-luxury-red uppercase tracking-widest flex items-center gap-2">
                      <UserCheck size={16}/> MESA DE TRABAJO Y ASIGNACIONES PREVIAS (OPCIONAL)
                    </label>
                  </div>

                  <DisciplineTabs 
                    catalog={disciplinesCatalog} 
                    editForm={formData} 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    tasks={[]} 
                    canToggle={(discName) => true} 
                    onToggleDiscipline={handleToggleDiscipline} 
                  />

                  <TaskWorkspace 
                    catalog={disciplinesCatalog}
                    activeTab={activeTab} 
                    editForm={formData} 
                    tasks={[]} 
                    staffCatalog={normalizedStaffCatalog} 
                    profile={profile} 
                    mySpecialty={null} 
                    isAdmin={true} 
                    isJefatura={true}
                    isCollaboratorView={false}
                    isCancelled={false}
                    loadingTaskId={null} 
                    editingAssignee={editingAssignee} 
                    setEditingAssignee={setEditingAssignee} 
                    onTaskChange={handleTaskChange} 
                    onSendCorrections={() => {}} 
                    onInternalApprove={() => {}} 
                    onUndoInternalApprove={() => {}}
                    onDeliverTask={() => {}} 
                  />
                </div>
              )}

              {/* ÚLTIMA FILA: BRIEF Y ENLACES */}
              <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-luxury-border/50">
                <div className="tour-modal-brief space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1 flex items-center gap-1.5"><FileText size={12}/> Descripción / Brief Detallado *</label>
                  <textarea required rows={4} placeholder="Describe medidas, textos, referencias, objetivos..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0a0a0c] border border-gray-200 dark:border-luxury-border rounded-xl p-4 text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none transition-colors resize-none shadow-sm"></textarea>
                </div>
                
                <div className="tour-modal-enlaces space-y-4">
                  <label className="text-[10px] font-black text-luxury-red uppercase tracking-widest px-1 flex items-center gap-2">
                    <Link2 size={14}/> Enlaces de Referencia (Drive, Dropbox, Figma, Notion)
                  </label>
                  <div className="space-y-3">
                    {links.map((link, idx) => (
                      <div key={idx} className="flex gap-2 items-center animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="relative flex-1">
                          <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                          <input type="url" placeholder="https://enlace-de-referencia.com/..." value={link} onChange={e => handleLinkChange(idx, e.target.value)} className="w-full h-12 bg-gray-50 dark:bg-[#0a0a0c] border border-gray-200 dark:border-luxury-border rounded-xl pl-11 pr-4 text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none transition-colors font-medium shadow-sm" />
                        </div>
                        {links.length > 1 && (
                          <button type="button" onClick={() => removeLinkField(idx)} className="w-12 h-12 flex items-center justify-center bg-red-50 dark:bg-red-950/20 text-luxury-red border border-red-200 dark:border-red-900/30 rounded-xl hover:bg-luxury-red hover:text-white transition-all cursor-pointer shrink-0 shadow-sm">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={addLinkField} className="inline-flex items-center gap-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-200 dark:hover:bg-white/10 transition-all cursor-pointer shadow-sm">
                    <Plus size={14} strokeWidth={3}/> Agregar otro enlace
                  </button>
                </div>

                <div className="space-y-1.5 pt-6 border-t border-gray-200 dark:border-luxury-border/50 mt-6">
                  <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1">Añadir personas a la copia de este ticket externas a Tolko (Opcional)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16}/>
                    <input type="text" placeholder="jefe@correo.com, extra@correo.com" value={formData.ccEmails} onChange={e => setFormData({...formData, ccEmails: e.target.value})} className="w-full h-12 bg-gray-50 dark:bg-[#0a0a0c] border border-gray-200 dark:border-luxury-border rounded-xl pl-11 pr-4 text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none transition-colors shadow-sm" />
                  </div>
                  <p className="text-[10px] text-gray-400 px-2 mt-1">Separa los correos con una coma.</p>
                </div>
              </div>
            </form>
          </div>

          <div className="p-4 md:p-6 border-t border-gray-200 dark:border-luxury-border bg-gray-50 dark:bg-[#0F0F12] shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-300">
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <AlertCircle size={16} className="text-luxury-red shrink-0"/>
                <span className="text-[10px] md:text-xs uppercase font-bold tracking-widest text-center sm:text-left">
                  {isAdminMode ? 'Se creará el ticket a nombre del cliente' : 'Revisaremos tu solicitud en breve'}
                </span>
              </div>
              {isInternalUser && (
                <div className="flex items-center gap-3 bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 px-4 py-2.5 rounded-xl shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">Notificar Cliente</span>
                    <span className="text-[8px] font-bold uppercase text-gray-500">
                      {sendClientEmail ? 'Recibirá correo' : 'Modo silencioso'}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={sendClientEmail} onChange={() => setSendClientEmail(!sendClientEmail)} />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-black/60 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-luxury-red"></div>
                  </label>
                  {!sendClientEmail && <BellOff size={14} className="text-gray-400 ml-1" />}
                </div>
              )}
            </div>
            <button form="request-form" disabled={loading || isFetching} type="submit" className="tour-modal-enviar w-full sm:w-auto justify-center bg-luxury-red hover:opacity-90 text-white px-8 py-4 rounded-xl text-xs font-black tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_10px_30px_rgba(211,0,45,0.2)] disabled:opacity-50 cursor-pointer active:scale-95">
              {loading ? 'PROCESANDO...' : <><Send size={16} strokeWidth={3}/> {isAdminMode ? 'CREAR TICKET' : 'ENVIAR SOLICITUD'}</>}
            </button>
          </div>
        </div>
      </div>

      <NewProjectModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)} 
        organizationId={activeOrgId || ''}
        onRefresh={() => { if(activeOrgId) fetchProjects(activeOrgId, true); }}
      />

      <DeliverablesManagerModal 
        isOpen={isDeliverableModalOpen} 
        onClose={() => {
          setIsDeliverableModalOpen(false);
          if (activeOrgId) fetchDropdownData(activeOrgId, autoSelectNewDeliverable);
          setAutoSelectNewDeliverable(false);
        }} 
        client={activeClientObj} 
      />
    </>
  );
}