import { Lock, MessageSquarePlus, ExternalLink, Loader2, CheckCircle, UploadCloud, Trash2, ShieldAlert, Calendar, Package, Check, Plus, Minus, Video } from 'lucide-react';
import Swal from 'sweetalert2';
import { supabase } from '../../../../lib/supabase'; 

interface TaskWorkspaceProps {
  catalog: any[];
  activeTab: string;
  editForm: any;
  tasks: any[];
  staffCatalog: any[];
  profile: any;
  mySpecialty: string | null;
  isAdmin: boolean;
  isJefatura: boolean; 
  isCollaboratorView?: boolean;
  isCancelled?: boolean; 
  loadingTaskId: string | null;
  editingAssignee: Record<string, boolean>;
  setEditingAssignee: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onTaskChange: (discipline: string, field: string, value: any) => void;
  onSendCorrections: (taskId: string, profileId: string, currentNotes: string) => void;
  onInternalApprove: (taskId: string, profileId: string) => void;
  onUndoInternalApprove: (taskId: string, profileId: string) => void;
  onDeliverTask: (taskId: string, profileId: string, url: string, notes: string) => void; 
}

export default function TaskWorkspace({
  catalog,
  activeTab,
  editForm,
  tasks,
  staffCatalog,
  profile,
  mySpecialty,
  isAdmin,
  isJefatura,
  isCollaboratorView = false,
  isCancelled = false, 
  loadingTaskId,
  editingAssignee,
  setEditingAssignee,
  onTaskChange,
  onSendCorrections,
  onInternalApprove,
  onUndoInternalApprove,
  onDeliverTask
}: TaskWorkspaceProps) {

  const norm = (s: string) => (s || '').toLowerCase().trim();

  const getCanonicalDiscipline = (input: string): string => {
    const s = norm(input);
    if (!s) return '';
    if (s.includes('dev') || s.includes('progra') || s.includes('code') || s === 'web' || s === 'needs_dev' || s.includes('plataforma')) return 'programacion';
    if (s.includes('desig') || s.includes('diseñ') || s.includes('diseno') || s === 'needs_design') return 'diseno';
    if (s.includes('av') || s.includes('audio') || s.includes('video') || s === 'needs_av') return 'audiovisual';
    if (s.includes('copy') || s.includes('contenid') || s.includes('redac') || s === 'needs_copy') return 'contenido';
    if (s.includes('prod') || s === 'needs_prod') return 'produccion';
    if (s.includes('staff') || s === 'needs_staff') return 'staff';
    if (s.includes('rp') || s.includes('relacion') || s === 'needs_rp') return 'rp';
    return s;
  };

  const activeTabCanonical = getCanonicalDiscipline(activeTab);
  const dbTask = tasks.find(t => getCanonicalDiscipline(t.discipline) === activeTabCanonical);
  const isAvTab = activeTabCanonical === 'audiovisual';

  const currentCatalogItem = catalog?.find(c => getCanonicalDiscipline(c.name) === activeTabCanonical);
  
  let isDisciplineEnabled = false;
  
  if (isCollaboratorView || dbTask) {
    isDisciplineEnabled = true;
  } else if (currentCatalogItem) {
    isDisciplineEnabled = editForm[currentCatalogItem.key];
  } else {
    const legacyMap: Record<string, string> = {
      'Contenido': 'needs_copy',
      'Copy': 'needs_copy',
      'Contenido y Estrategia': 'needs_copy',
      'Diseño': 'needs_design',
      'Audiovisual': 'needs_av',
      'Programación': 'needs_dev',
      'Producción': 'needs_prod',
      'Staff': 'needs_staff',
      'Relaciones Públicas': 'needs_rp',
      'RP': 'needs_rp'
    };
    isDisciplineEnabled = editForm[legacyMap[activeTab] || ''];
  }

  const userSpecialtyCanonical = getCanonicalDiscipline(
    mySpecialty || profile?.specialties?.name || profile?.specialty || ''
  );

  const canConfigureArea = !isCollaboratorView && !isCancelled && (
    isAdmin || (isJefatura && userSpecialtyCanonical === activeTabCanonical)
  );

  if (!isDisciplineEnabled) {
    return (
      <div className="border border-dashed border-gray-300 dark:border-zinc-800 rounded-2xl p-10 text-center bg-gray-100/50 dark:bg-[#070709]/30 transition-colors duration-300">
        <p className="text-sm text-gray-500 font-medium">Esta disciplina no está requerida para este proyecto.</p>
      </div>
    );
  }

  const taskConfig = editForm.tasks?.[activeTab];
  const rawAssignees: any[] = Array.isArray(taskConfig?.assignees_details) ? taskConfig.assignees_details : [];

  const assigneesDetails = isCollaboratorView 
    ? rawAssignees.filter(a => a.profile_id === profile?.id)
    : rawAssignees;

  const activeTabBooleanKeyMap: Record<string, string> = {
    'Contenido': 'needs_copy',
    'Diseño': 'needs_design',
    'Audiovisual': 'needs_av',
    'Programación': 'needs_dev',
    'Producción': 'needs_prod',
    'Staff': 'needs_staff',
    'RP': 'needs_rp'
  };

  const activeBooleanKey = activeTabBooleanKeyMap[activeTab];

  const allBreakdownItems: any[] = (editForm.items_breakdown && editForm.items_breakdown.length > 0)
    ? editForm.items_breakdown.map((i: any) => ({ ...i, name: i.label || i.name }))
    : [{ id: 'default-1', name: editForm.title || 'Pieza Principal', quantity: editForm.quantity || 1, discipline: activeTab }];

  const mergedBreakdownItems: any[] = [];
  allBreakdownItems.forEach(item => {
    const name = (item.name || '').trim().toLowerCase();
    const disc = (item.discipline || '').trim().toLowerCase();
    if (!name) return;
    
    const existing = mergedBreakdownItems.find(m => 
      (m.name || '').trim().toLowerCase() === name && 
      (m.discipline || '').trim().toLowerCase() === disc
    );
    
    if (existing) {
      existing.quantity = Number(existing.quantity) + Number(item.quantity || 1);
    } else {
      mergedBreakdownItems.push({ ...item });
    }
  });

  const requestItemsBreakdown = mergedBreakdownItems.filter((i: any) => {
    if (i.discipline) return getCanonicalDiscipline(i.discipline) === activeTabCanonical;
    const l = (i.name || '').toLowerCase();
    if (l === 'diseños' && activeTabCanonical === 'diseno') return true;
    if (l === 'contenidos' && activeTabCanonical === 'contenido') return true;
    if (activeBooleanKey && i[activeBooleanKey] === true) return true;
    if (!i.discipline && i.id === 'default-1') return true;
    return false;
  });

  const getItemTotalRequired = (itemName: string) => {
    const found = requestItemsBreakdown.find((i: any) => i.name === itemName);
    return found ? (found.quantity || 1) : 1;
  };

  const getQtyAssignedToOthers = (itemName: string, currentProfileId: string) => {
    return rawAssignees
      .filter(a => a.profile_id !== currentProfileId)
      .reduce((sum, a) => {
        const found = a.assigned_items?.find((i: any) => i.name === itemName);
        return sum + (found?.quantity || 0);
      }, 0);
  };

  const getMaxAllowedForUser = (itemName: string, currentProfileId: string) => {
    const totalReq = getItemTotalRequired(itemName);
    const assignedToOthers = getQtyAssignedToOthers(itemName, currentProfileId);
    return Math.max(0, totalReq - assignedToOthers);
  };

  const getTotalAssignedGlobally = (itemName: string) => {
    return rawAssignees.reduce((sum, a) => {
      const found = a.assigned_items?.find((i: any) => i.name === itemName);
      return sum + (found?.quantity || 0);
    }, 0);
  };

  const totalAssignedPiecesGlobal = rawAssignees.reduce((sum, a) => {
    const itemsSum = a.assigned_items?.reduce((iSum: number, item: any) => iSum + (item.quantity || 1), 0) || 0;
    return sum + (itemsSum > 0 ? itemsSum : (Number(a.assigned_quantity) || 0));
  }, 0);

  const getAssigneeNameHoldingItem = (itemName: string, currentProfileId: string) => {
    const holder = rawAssignees.find(a => 
      a.profile_id !== currentProfileId && 
      a.assigned_items?.some((i: any) => i.name === itemName && i.quantity > 0)
    );
    if (!holder) return null;
    const userObj = staffCatalog.find(s => s.id === holder.profile_id);
    return userObj?.full_name?.split(' ')[0] || 'Otro colab.';
  };

  const handleAddAssignee = async (userId: string) => {
    if (!userId || assigneesDetails.find(a => a.profile_id === userId)) return;

    const newAssigneePayload = { 
      profile_id: userId, 
      assigned_quantity: 1, 
      specific_instructions: '', 
      due_date: editForm.due_date ? editForm.due_date.split('T')[0] : '',
      status: 'pendiente',
      deliverable_url: '',
      delivery_notes: '',
      assigned_items: [],
      editing_hours: 0,
      recording_hours: 0,
      video_duration: ''
    };

    const updatedAssignees = [...rawAssignees, newAssigneePayload];
    onTaskChange(activeTab, 'assignees_details', updatedAssignees);

    try {
      let targetTaskId = dbTask?.id;

      if (!targetTaskId) {
        const requestId = editForm.id || tasks[0]?.request_id;
        if (!requestId) return;

        const { data: newT, error: insErr } = await supabase
          .from('request_tasks')
          .insert([{ 
            request_id: requestId, 
            discipline: activeTab, 
            assigned_to: [userId], 
            quantity: 1 
          }])
          .select()
          .single();

        if (insErr) throw insErr;
        if (newT) targetTaskId = newT.id;
      } else {
        const currentAssignedTo = Array.isArray(dbTask.assigned_to) ? dbTask.assigned_to : [];
        if (!currentAssignedTo.includes(userId)) {
          await supabase
            .from('request_tasks')
            .update({ assigned_to: [...currentAssignedTo, userId] })
            .eq('id', targetTaskId);
        }
      }

      if (targetTaskId) {
        await supabase.from('task_assignees').upsert({
          task_id: targetTaskId,
          profile_id: userId,
          assigned_by: profile?.id,
          assigned_quantity: 1,
          due_date: editForm.due_date ? editForm.due_date.split('T')[0] : null,
          status: 'pendiente'
        });
      }

    } catch (error) {
      console.error("Error al autoguardar la asignación:", error);
    }
  };

  const handleRemoveAssignee = async (userId: string) => {
    const user = staffCatalog.find(s => s.id === userId);
    const userName = user?.full_name?.split(' ')[0] || 'este colaborador';
    const isDarkTheme = document.documentElement.classList.contains('dark');

    const result = await Swal.fire({
      title: `¿Quitar a ${userName}?`,
      text: "Se removerá de las asignaciones de esta área. Recuerda guardar cambios para confirmar.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#D3002D',
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'SÍ, REMOVER',
      cancelButtonText: 'CANCELAR',
      background: isDarkTheme ? '#0F0F12' : '#fff',
      color: isDarkTheme ? '#fff' : '#1f2937'
    });

    if (result.isConfirmed) {
      onTaskChange(activeTab, 'assignees_details', rawAssignees.filter(a => a.profile_id !== userId));
    }
  };

  const handleAssigneeChange = (userId: string, field: string, value: any) => {
    const updated = rawAssignees.map(a => a.profile_id === userId ? { ...a, [field]: value } : a);
    onTaskChange(activeTab, 'assignees_details', updated);
  };

  const handleSetItemQuantity = (profileId: string, itemName: string, targetQty: number) => {
    const currentAssignee = rawAssignees.find(a => a.profile_id === profileId);
    if (!currentAssignee) return;

    const maxAllowed = getMaxAllowedForUser(itemName, profileId);
    const clampedQty = Math.max(0, Math.min(targetQty, maxAllowed));

    let items: any[] = [...(currentAssignee.assigned_items || [])];
    const existingIndex = items.findIndex(i => i.name === itemName);

    if (clampedQty <= 0) {
      if (existingIndex >= 0) items.splice(existingIndex, 1);
    } else {
      if (existingIndex >= 0) {
        items[existingIndex] = { ...items[existingIndex], quantity: clampedQty };
      } else {
        items.push({ name: itemName, quantity: clampedQty });
      }
    }

    const newTotalPieces = items.reduce((sum, i) => sum + (i.quantity || 1), 0);

    const updated = rawAssignees.map(a => {
      if (a.profile_id === profileId) {
        return {
          ...a,
          assigned_items: items,
          assigned_quantity: newTotalPieces > 0 ? newTotalPieces : a.assigned_quantity
        };
      }
      return a;
    });

    onTaskChange(activeTab, 'assignees_details', updated);
  };

  const handleToggleSingleItem = (profileId: string, itemName: string, isCurrentlyAssigned: boolean) => {
    if (!canConfigureArea) return;
    handleSetItemQuantity(profileId, itemName, isCurrentlyAssigned ? 0 : 1);
  };

  // 🔥 MAGIA: INTERCEPCIÓN Y VALIDACIÓN ESTRICTA DEL MODAL DE SUBIDA 🔥
  const handleOpenUploadModal = async (assigneeProfileId: string) => {
    if (!dbTask) {
      Swal.fire('Atención', 'Primero debes guardar la asignación antes de poder entregarla.', 'warning');
      return;
    }

    const isDarkTheme = document.documentElement.classList.contains('dark');
    const targetUser = staffCatalog.find(s => s.id === assigneeProfileId);
    const targetName = targetUser?.full_name?.split(' ')[0] || 'esta asignación';
    
    // Recuperamos los datos previos si es que los rebotaron
    const currentAssignee = rawAssignees.find(a => a.profile_id === assigneeProfileId) || {};
    const defEditHrs = currentAssignee.editing_hours || '';
    const defRecHrs = currentAssignee.recording_hours || '';
    const rawVidDur = currentAssignee.video_duration || '';
    
    let defHH = '', defMM = '', defSS = '';
    if (rawVidDur.includes(':')) {
      const parts = rawVidDur.split(':');
      defHH = parts[0] || ''; defMM = parts[1] || ''; defSS = parts[2] || '';
    } else if (rawVidDur) {
      defSS = rawVidDur.replace(/\D/g, ''); 
    }

    const bgInput = isDarkTheme ? '#000' : '#f9fafb';
    const borderInput = isDarkTheme ? '#27272a' : '#e5e7eb';
    const textInput = isDarkTheme ? '#fff' : '#1f2937';
    const labelColor = isDarkTheme ? '#9ca3af' : '#6b7280';
    const bgBox = isDarkTheme ? 'rgba(211, 0, 45, 0.05)' : '#fef2f2';
    const borderBox = isDarkTheme ? 'rgba(211, 0, 45, 0.2)' : '#fecaca';

    const avExtraFieldsHTML = isAvTab ? `
      <div style="background-color: ${bgBox}; border: 1px solid ${borderBox}; border-radius: 16px; padding: 20px; margin-bottom: 20px;">
        <label style="font-size: 11px; font-weight: 900; color: #D3002D; letter-spacing: 0.1em; display: flex; align-items: center; gap: 6px; margin-bottom: 16px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
          MÉTRICAS AUDIOVISUAL
        </label>
        
        <div style="display: flex; gap: 12px; margin-bottom: 16px;">
          <div style="flex: 1;">
            <label style="font-size: 9px; font-weight: 800; color: ${labelColor}; letter-spacing: 0.05em; display: block; margin-bottom: 6px;">EDICIÓN (HRS) *</label>
            <input id="swal-edit-hrs" value="${defEditHrs}" type="number" step="0.5" min="0" style="width: 100%; height: 42px; border-radius: 10px; border: 1px solid ${borderInput}; background: ${bgInput}; color: ${textInput}; text-align: center; font-weight: bold; outline: none; transition: all 0.2s;" placeholder="0.0" required>
          </div>
          <div style="flex: 1;">
            <label style="font-size: 9px; font-weight: 800; color: ${labelColor}; letter-spacing: 0.05em; display: block; margin-bottom: 6px;">GRABACIÓN (HRS)</label>
            <input id="swal-rec-hrs" value="${defRecHrs}" type="number" step="0.5" min="0" style="width: 100%; height: 42px; border-radius: 10px; border: 1px solid ${borderInput}; background: ${bgInput}; color: ${textInput}; text-align: center; font-weight: bold; outline: none; transition: all 0.2s;" placeholder="0.0">
          </div>
        </div>

        <div>
          <label style="font-size: 9px; font-weight: 800; color: ${labelColor}; letter-spacing: 0.05em; display: block; margin-bottom: 6px;">DURACIÓN DEL VIDEO * (HH:MM:SS)</label>
          <div style="display: flex; align-items: center; gap: 8px;">
            <input id="swal-dur-hh" value="${defHH}" type="number" min="0" max="99" style="flex: 1; height: 42px; border-radius: 10px; border: 1px solid ${borderInput}; background: ${bgInput}; color: ${textInput}; text-align: center; font-weight: bold; outline: none;" placeholder="HH" required>
            <span style="font-weight: bold; color: ${labelColor};">:</span>
            <input id="swal-dur-mm" value="${defMM}" type="number" min="0" max="59" style="flex: 1; height: 42px; border-radius: 10px; border: 1px solid ${borderInput}; background: ${bgInput}; color: ${textInput}; text-align: center; font-weight: bold; outline: none;" placeholder="MM" required>
            <span style="font-weight: bold; color: ${labelColor};">:</span>
            <input id="swal-dur-ss" value="${defSS}" type="number" min="0" max="59" style="flex: 1; height: 42px; border-radius: 10px; border: 1px solid ${borderInput}; background: ${bgInput}; color: ${textInput}; text-align: center; font-weight: bold; outline: none;" placeholder="SS" required>
          </div>
        </div>
      </div>
    ` : '';

    const { value: formValues } = await Swal.fire({
      title: `SUBIR ENTREGABLE`,
      html: `
        <div style="text-align: left; padding: 0 5px;">
          <div style="margin-bottom: 20px;">
            <label style="font-size: 10px; font-weight: 900; color: ${labelColor}; letter-spacing: 0.1em; display: block; margin-bottom: 8px;">ENLACE PRINCIPAL *</label>
            <input id="swal-url-1" style="width: 100%; height: 46px; border-radius: 12px; border: 1px solid ${borderInput}; background: ${bgInput}; color: ${textInput}; padding: 0 16px; font-size: 13px; font-weight: 600; outline: none; box-sizing: border-box;" placeholder="Ej. Frame.io, Figma, Drive..." type="text" required>
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="font-size: 10px; font-weight: 900; color: ${labelColor}; letter-spacing: 0.1em; display: block; margin-bottom: 8px;">ENLACE EXTRA (OPCIONAL)</label>
            <input id="swal-url-2" style="width: 100%; height: 46px; border-radius: 12px; border: 1px solid ${borderInput}; background: ${bgInput}; color: ${textInput}; padding: 0 16px; font-size: 13px; font-weight: 600; outline: none; box-sizing: border-box;" placeholder="Ej. Carpeta de assets, editables..." type="text">
          </div>
          
          ${avExtraFieldsHTML}

          <div>
            <label style="font-size: 10px; font-weight: 900; color: ${labelColor}; letter-spacing: 0.1em; display: block; margin-bottom: 8px;">OBSERVACIONES DE ENTREGA</label>
            <textarea id="swal-notes" style="width: 100%; border-radius: 12px; border: 1px solid ${borderInput}; background: ${bgInput}; color: ${textInput}; padding: 16px; font-size: 13px; min-height: 100px; resize: vertical; outline: none; box-sizing: border-box; font-family: inherit;" placeholder="Contraseñas, comentarios o detalles importantes..."></textarea>
          </div>
        </div>
      `,
      focusConfirm: false, 
      showCancelButton: true, 
      confirmButtonText: 'SUBIR A REVISIÓN', 
      confirmButtonColor: '#D3002D',
      background: isDarkTheme ? '#0F0F12' : '#fff', 
      color: isDarkTheme ? '#fff' : '#1f2937',
      preConfirm: () => {
        const popup = Swal.getPopup();
        if (!popup) return false;
        
        const url1Val = (popup.querySelector('#swal-url-1') as HTMLInputElement).value.trim();
        const url2Val = (popup.querySelector('#swal-url-2') as HTMLInputElement).value.trim();
        const notes = (popup.querySelector('#swal-notes') as HTMLTextAreaElement).value;
        
        // Validaciones súper estrictas para matar el bug de los 300 links base64
        if (!url1Val) {
          Swal.showValidationMessage('¡El enlace principal es obligatorio!');
          return false;
        }
        if (!url1Val.startsWith('http') && !url1Val.startsWith('www')) {
          Swal.showValidationMessage('El enlace principal debe ser una URL válida (http://...)');
          return false;
        }
        if (url2Val && !url2Val.startsWith('http') && !url2Val.startsWith('www')) {
          Swal.showValidationMessage('El enlace extra debe ser una URL válida (http://...)');
          return false;
        }

        let extraPayload = null;

        if (isAvTab) {
          const editHrs = (popup.querySelector('#swal-edit-hrs') as HTMLInputElement).value;
          const recHrs = (popup.querySelector('#swal-rec-hrs') as HTMLInputElement).value;
          const durHH = (popup.querySelector('#swal-dur-hh') as HTMLInputElement).value || "0";
          const durMM = (popup.querySelector('#swal-dur-mm') as HTMLInputElement).value || "0";
          const durSS = (popup.querySelector('#swal-dur-ss') as HTMLInputElement).value || "0";

          if (!editHrs || isNaN(Number(editHrs))) {
            Swal.showValidationMessage('¡Las horas de edición son obligatorias!');
            return false;
          }
          
          if (Number(durHH) === 0 && Number(durMM) === 0 && Number(durSS) === 0) {
             Swal.showValidationMessage('¡Debes especificar la duración del video!');
             return false;
          }

          const pad = (num: string) => num.padStart(2, '0');
          const vidDur = `${pad(durHH)}:${pad(durMM)}:${pad(durSS)}`;

          extraPayload = {
            editing_hours: Number(editHrs),
            recording_hours: recHrs ? Number(recHrs) : 0,
            video_duration: vidDur
          };
        }
        
        // Solo unimos URLs válidas y limpias
        const finalUrls = [url1Val, url2Val].filter(u => u !== '').join(',');
        return { url: finalUrls, notes, extraPayload };
      }
    });

    if (formValues) {
      if (formValues.extraPayload) {
        try {
          await supabase.from('task_assignees').update({
            editing_hours: formValues.extraPayload.editing_hours,
            recording_hours: formValues.extraPayload.recording_hours,
            video_duration: formValues.extraPayload.video_duration
          }).eq('task_id', dbTask.id).eq('profile_id', assigneeProfileId);

          handleAssigneeChange(assigneeProfileId, 'editing_hours', formValues.extraPayload.editing_hours);
          handleAssigneeChange(assigneeProfileId, 'recording_hours', formValues.extraPayload.recording_hours);
          handleAssigneeChange(assigneeProfileId, 'video_duration', formValues.extraPayload.video_duration);
        } catch (err) {
          console.error('Error guardando métricas de AV en task_assignees:', err);
        }
      }

      onDeliverTask(dbTask.id, assigneeProfileId, formValues.url, formValues.notes);
    }
  };

  const renderStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pendiente: 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-gray-200 dark:border-zinc-700/50',
      con_correcciones: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 border-red-200 dark:border-red-500/20 animate-pulse font-black',
      entregado: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20 font-bold',
      aprobado_interno: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/30 font-black'
    };
    return <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${styles[status] || styles.pendiente}`}>{status.replace(/_/g, ' ')}</span>;
  };

  const safeFormatDate = (dateStr: string) => {
    if (!dateStr) return '--';
    const [year, month, day] = dateStr.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="border border-gray-200 dark:border-zinc-800/80 rounded-2xl flex flex-col transition-all duration-300 animate-in fade-in bg-white dark:bg-[#0e0e12] shadow-sm">
      <div className="p-6 flex flex-col gap-6 w-full">
        
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-900 pb-3">
            <h4 className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
              Instrucciones de la Asignación {!canConfigureArea && (
                <span title="Solo lectura para áreas ajenas">
                  <Lock size={12} className="text-amber-500" />
                </span>
              )}
            </h4>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
              Total Global: {assigneesDetails.reduce((sum, a) => sum + (Number(a.assigned_quantity) || 0), 0)} Pz
            </span>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><MessageSquarePlus size={11}/> Indicaciones Generales del Líder</label>
            <textarea disabled={!canConfigureArea} rows={2} value={taskConfig?.coordinator_notes || ''} onChange={e => onTaskChange(activeTab, 'coordinator_notes', e.target.value)} placeholder={canConfigureArea ? "Ej. Usar arquitectura basada en microservicios..." : "🔒 Modo lectura para disciplinas externas."} className="w-full bg-gray-50 dark:bg-[#070709] border border-gray-200 dark:border-zinc-800 rounded-xl p-3 text-xs text-gray-900 dark:text-white outline-none focus:border-blue-500 font-medium disabled:opacity-70 disabled:cursor-not-allowed" />
          </div>
        </div>

        {requestItemsBreakdown.length > 0 && !isCollaboratorView && (
          <div className="bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-zinc-800 p-3.5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <Package size={13} className="text-luxury-red"/> Balance de Inventario de {activeTab}:
              </span>
              
              <span className="text-[10px] font-bold text-gray-400 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 px-2.5 py-1 rounded-lg">
                Piezas Asignadas: {totalAssignedPiecesGlobal} pzs
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {requestItemsBreakdown.map((item) => {
                const totalAssigned = getTotalAssignedGlobally(item.name);
                const totalReq = item.quantity || 1;
                const remaining = totalReq - totalAssigned;
                const isFullyAssigned = remaining <= 0;

                return (
                  <div 
                    key={item.id || item.name}
                    className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase border flex items-center gap-2 ${
                      isFullyAssigned 
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/40 text-green-600 dark:text-green-400'
                        : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    <span>{item.name}</span>
                    <span className="bg-white dark:bg-black/40 px-1.5 py-0.5 rounded font-bold">
                      {totalAssigned}/{totalReq} {isFullyAssigned ? '✓ Repartidos' : `(Quedan ${remaining})`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
              {isCollaboratorView ? 'Tu Asignación Específica' : 'Asignaciones Individuales'}
            </label>

            {!isCollaboratorView && canConfigureArea && (
              <select value="" onChange={e => handleAddAssignee(e.target.value)} className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded-lg px-2 py-1 text-[10px] font-bold outline-none cursor-pointer">
                <option value="">+ Añadir Colaborador...</option>
                {staffCatalog.filter(s => {
                  const staffSpecCanonical = getCanonicalDiscipline(s.specialty || s.specialties?.name || '');
                  return staffSpecCanonical === activeTabCanonical && !assigneesDetails.find(a => a.profile_id === s.id);
                }).map(staff => (
                  <option key={staff.id} value={staff.id}>{staff.full_name}</option>
                ))}
              </select>
            )}
          </div>

          {assigneesDetails.length === 0 ? (
            <div className="p-6 bg-gray-50 dark:bg-black/20 border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl text-center text-xs text-gray-400">
              No hay colaboradores asignados directamente a esta disciplina.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {assigneesDetails.map(assignee => {
                const user = staffCatalog.find(s => s.id === assignee.profile_id);
                const displayName = user?.full_name || (assignee.profile_id === profile?.id ? profile?.full_name : 'Colaborador Asignado');
                const subStatus = assignee.status || 'pendiente';
                const loadKey = dbTask?.id + assignee.profile_id;

                const notesToDisplay = assignee.delivery_notes || dbTask?.delivery_notes || '';
                const urlToDisplay = assignee.deliverable_url || dbTask?.deliverable_url || '';

                const itemsForThisCard = canConfigureArea
                  ? requestItemsBreakdown
                  : requestItemsBreakdown.filter(reqItem =>
                      assignee.assigned_items?.some((i: any) => i.name === reqItem.name && (i.quantity || 0) > 0)
                    );

                return (
                  <div key={assignee.profile_id} className={`border rounded-xl flex flex-col overflow-hidden transition-all shadow-sm ${subStatus === 'con_correcciones' ? 'bg-red-50/50 border-red-200 dark:bg-red-950/10 dark:border-red-900/30' : subStatus === 'entregado' ? 'bg-amber-50/30 border-amber-200 dark:bg-amber-950/10 dark:border-amber-900/30' : 'bg-white border-gray-200 dark:bg-[#121216] dark:border-zinc-800/80'}`}>
                    
                    <div className="bg-gray-50 dark:bg-black/40 border-b border-gray-100 dark:border-zinc-800/50 p-3 flex flex-wrap justify-between items-center gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-black uppercase">
                          {displayName.charAt(0) || '?'}
                        </div>
                        <span className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-wider">{displayName}</span>
                        {renderStatusBadge(subStatus)}
                      </div>

                      {!isCollaboratorView && (
                        <div className="flex items-center gap-2 ml-auto">
                          <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700/80 px-2.5 py-1 rounded-lg shadow-sm">
                            <Calendar size={12} className="text-luxury-red shrink-0"/>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Entrega:</span>
                            {canConfigureArea ? (
                              <input 
                                type="date" 
                                value={assignee.due_date ? assignee.due_date.split('T')[0] : (editForm.due_date ? editForm.due_date.split('T')[0] : '')} 
                                onChange={e => handleAssigneeChange(assignee.profile_id, 'due_date', e.target.value)}
                                className="bg-transparent text-xs font-black text-gray-900 dark:text-white outline-none cursor-pointer"
                              />
                            ) : (
                              <span className="text-xs font-black text-gray-900 dark:text-white">
                                {safeFormatDate(assignee.due_date || editForm.due_date)}
                              </span>
                            )}
                          </div>

                          {canConfigureArea && (
                            <button type="button" onClick={() => handleRemoveAssignee(assignee.profile_id)} className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer" title="Remover asignación">
                              <Trash2 size={14}/>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 🔥 MÉTRICAS INDIVIDUALES DE AUDIOVISUAL PARA EL LÍDER 🔥 */}
                    {isAvTab && !isCollaboratorView && (
                      <div className="bg-red-50/40 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/20 p-3 grid grid-cols-3 gap-3">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-red-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Video size={10}/> Hrs Edición</span>
                          {canConfigureArea ? (
                            <input type="number" step="0.5" value={assignee.editing_hours || ''} onChange={e => handleAssigneeChange(assignee.profile_id, 'editing_hours', e.target.value)} className="w-full bg-white dark:bg-black border border-gray-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-red-400" />
                          ) : (
                            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{assignee.editing_hours || 0}</span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-red-500 uppercase tracking-widest mb-1">Hrs Grabación</span>
                          {canConfigureArea ? (
                            <input type="number" step="0.5" value={assignee.recording_hours || ''} onChange={e => handleAssigneeChange(assignee.profile_id, 'recording_hours', e.target.value)} className="w-full bg-white dark:bg-black border border-gray-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-red-400" />
                          ) : (
                            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{assignee.recording_hours || 0}</span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-red-500 uppercase tracking-widest mb-1">Duración (HH:MM:SS)</span>
                          {canConfigureArea ? (
                            <input type="text" placeholder="HH:MM:SS" value={assignee.video_duration || ''} onChange={e => handleAssigneeChange(assignee.profile_id, 'video_duration', e.target.value)} className="w-full bg-white dark:bg-black border border-gray-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-red-400" />
                          ) : (
                            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{assignee.video_duration || '--'}</span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="p-3 bg-gray-50/70 dark:bg-black/20 border-b border-gray-100 dark:border-zinc-800/50 space-y-2">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <Package size={12} className="text-luxury-red"/> Entregables asignados a {displayName.split(' ')[0]}:
                      </label>

                      {itemsForThisCard.length === 0 ? (
                        <p className="text-[11px] font-bold text-gray-400 italic">
                          ✨ No hay entregables individuales de esta área asignados a esta persona.
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2 pt-0.5">
                          {itemsForThisCard.map((reqItem) => {
                            const totalAssignedGlobally = getTotalAssignedGlobally(reqItem.name);
                            const totalReq = reqItem.quantity || 1;
                            const assignedToThisUserObj = assignee.assigned_items?.find((i: any) => i.name === reqItem.name);
                            const userQty = assignedToThisUserObj?.quantity || 0;
                            
                            const otherUsersAssigned = totalAssignedGlobally - userQty;
                            const maxAvailableForThisUser = totalReq - otherUsersAssigned;

                            const isAssignedToThisUser = userQty > 0;
                            const isAssignedToOther = !isAssignedToThisUser && maxAvailableForThisUser <= 0;
                            const holderName = isAssignedToOther ? getAssigneeNameHoldingItem(reqItem.name, assignee.profile_id) : null;

                            if (!canConfigureArea) {
                              return (
                                <div
                                  key={reqItem.id || reqItem.name}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 border ${
                                    isAssignedToThisUser 
                                      ? 'bg-luxury-red border-luxury-red text-white shadow-sm'
                                      : 'bg-gray-100 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-400'
                                  }`}
                                >
                                  {isAssignedToThisUser && <Check size={12} strokeWidth={3} />}
                                  <span>{reqItem.name}</span>
                                  {totalReq > 1 && isAssignedToThisUser && (
                                    <span className="text-[10px] font-black bg-white/20 px-1.5 py-0.5 rounded">
                                      {userQty} pz{userQty !== 1 ? 's' : ''}
                                    </span>
                                  )}
                                </div>
                              );
                            }

                            if (totalReq === 1) {
                              return (
                                <button
                                  key={reqItem.id || reqItem.name}
                                  type="button"
                                  disabled={isAssignedToOther}
                                  onClick={() => handleToggleSingleItem(assignee.profile_id, reqItem.name, isAssignedToThisUser)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 border transition-all ${
                                    isAssignedToThisUser
                                      ? 'bg-luxury-red border-luxury-red text-white shadow-sm cursor-pointer'
                                      : isAssignedToOther
                                      ? 'bg-gray-100 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-400 opacity-60 cursor-not-allowed'
                                      : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 hover:border-luxury-red/50 cursor-pointer'
                                  }`}
                                >
                                  <div className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-colors ${
                                    isAssignedToThisUser ? 'bg-white text-luxury-red' : 'border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-black/40'
                                  }`}>
                                    {isAssignedToThisUser && <Check size={10} strokeWidth={4} />}
                                  </div>
                                  <span>{reqItem.name}</span>
                                  {isAssignedToOther && (
                                    <span className="text-[9px] font-bold text-gray-400 normal-case">
                                      ({holderName ? `con ${holderName}` : 'ocupado'})
                                    </span>
                                  )}
                                </button>
                              );
                            }

                            return (
                              <div
                                key={reqItem.id || reqItem.name}
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all ${
                                  isAssignedToThisUser
                                    ? 'bg-luxury-red border-luxury-red text-white shadow-sm'
                                    : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-500'
                                }`}
                              >
                                <span>{reqItem.name}</span>

                                <div className={`flex items-center gap-1.5 ml-1 pl-2 border-l ${isAssignedToThisUser ? 'border-white/30' : 'border-gray-200 dark:border-zinc-700'}`}>
                                  <button
                                    type="button"
                                    disabled={userQty <= 0}
                                    onClick={() => handleSetItemQuantity(assignee.profile_id, reqItem.name, userQty - 1)}
                                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 ${
                                      isAssignedToThisUser ? 'bg-black/20 hover:bg-black/40 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-gray-300'
                                    }`}
                                    title="Quitar 1 pieza"
                                  >
                                    <Minus size={10} strokeWidth={3} />
                                  </button>

                                  <span className={`text-[11px] font-black px-1 ${isAssignedToThisUser ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {userQty} pz{userQty !== 1 ? 's' : ''}
                                  </span>

                                  <button
                                    type="button"
                                    disabled={userQty >= maxAvailableForThisUser}
                                    onClick={() => handleSetItemQuantity(assignee.profile_id, reqItem.name, userQty + 1)}
                                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 ${
                                      isAssignedToThisUser ? 'bg-black/20 hover:bg-black/40 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-gray-300'
                                    }`}
                                    title="Añadir 1 pieza"
                                  >
                                    <Plus size={10} strokeWidth={3} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      <div className="md:col-span-3 space-y-1">
                         <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Piezas a entregar</label>
                         <input disabled={!canConfigureArea} type="number" min="1" value={assignee.assigned_quantity} onChange={e => handleAssigneeChange(assignee.profile_id, 'assigned_quantity', parseInt(e.target.value) || 1)} className="w-full h-10 bg-gray-50 dark:bg-[#070709] border border-gray-200 dark:border-zinc-800 rounded-lg px-3 text-xs text-gray-900 dark:text-white outline-none focus:border-blue-500 text-center font-bold disabled:opacity-60 disabled:cursor-not-allowed" />
                      </div>

                      <div className="md:col-span-9 space-y-1">
                         <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Instrucciones Dedicadas</label>
                         {canConfigureArea ? (
                           <textarea 
                             rows={2} 
                             value={assignee.specific_instructions || ''} 
                             onChange={e => handleAssigneeChange(assignee.profile_id, 'specific_instructions', e.target.value)} 
                             placeholder={`¿Qué tiene que hacer ${displayName.split(' ')[0]} exactamente?`} 
                             className="w-full bg-gray-50 dark:bg-[#070709] border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:border-blue-500 font-medium" 
                           />
                         ) : (
                           <div className="w-full bg-gray-50 dark:bg-[#070709] border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-xs text-gray-700 dark:text-gray-300 font-medium select-text min-h-[50px] flex items-center">
                             {assignee.specific_instructions?.trim() ? (
                               assignee.specific_instructions
                             ) : (
                               <span className="italic text-gray-400">No tienes especificaciones individuales en esta entrega</span>
                             )}
                           </div>
                         )}
                      </div>
                    </div>

                    {notesToDisplay && (
                      <div className="px-4 pb-4">
                        <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/20 rounded-xl p-4">
                          <h5 className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <ShieldAlert size={14}/> Historial de Observaciones
                          </h5>
                          <p className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed font-medium select-text">
                            {notesToDisplay}
                          </p>
                        </div>
                      </div>
                    )}

                    {canConfigureArea && (
                      <div className="bg-gray-50/50 dark:bg-[#070709]/50 border-t border-gray-100 dark:border-zinc-800/50 p-3 flex justify-end gap-2 items-center flex-wrap">
                        
                        {dbTask && ['pendiente', 'con_correcciones'].includes(subStatus) && !isCancelled && (
                          <button
                            type="button"
                            disabled={loadingTaskId !== null}
                            onClick={() => handleOpenUploadModal(assignee.profile_id)}
                            className="bg-luxury-red hover:bg-red-700 text-white px-4 h-9 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ml-auto active:scale-95"
                          >
                            <UploadCloud size={13} /> Subir / Entregar Material
                          </button>
                        )}

                        {dbTask && subStatus === 'entregado' && (
                          <>
                            {urlToDisplay && (
                              <div className="flex gap-2 mr-auto flex-wrap">
                                {urlToDisplay.split(',').map((l: string) => l.trim()).filter((l: string) => l !== '').slice(0, 2).map((link: string, idx: number) => (
                                  <a key={idx} href={link} target="_blank" rel="noreferrer" className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:text-blue-500 px-3 h-9 rounded-lg text-[10px] font-bold flex items-center gap-1.5 shadow-sm transition-colors max-w-[150px] truncate" title={link}>
                                    <ExternalLink size={12} className="shrink-0"/> <span className="truncate">Link {idx + 1}</span>
                                  </a>
                                ))}
                              </div>
                            )}
                            <button type="button" disabled={loadingTaskId !== null} onClick={() => onSendCorrections(dbTask.id, assignee.profile_id, notesToDisplay)} className="bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 px-4 h-9 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ml-auto">
                              Corrección interna
                            </button>
                            <button type="button" disabled={loadingTaskId !== null} onClick={() => onInternalApprove(dbTask.id, assignee.profile_id)} className="bg-green-600 hover:bg-green-500 text-white px-4 h-9 rounded-lg text-[10px] font-black uppercase transition-all shadow-sm flex items-center justify-center cursor-pointer min-w-[80px]">
                              {loadingTaskId === loadKey ? <Loader2 className="animate-spin" size={14}/> : 'Aprobar'}
                            </button>
                          </>
                        )}

                        {dbTask && subStatus === 'aprobado_interno' && (
                          <>
                            {urlToDisplay && (
                              <div className="flex gap-2 mr-auto flex-wrap">
                                {urlToDisplay.split(',').map((l: string) => l.trim()).filter((l: string) => l !== '').slice(0, 2).map((link: string, idx: number) => (
                                  <a key={idx} href={link} target="_blank" rel="noreferrer" className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:text-blue-500 px-3 h-9 rounded-lg text-[10px] font-bold flex items-center gap-1.5 shadow-sm transition-colors max-w-[150px] truncate" title={link}>
                                    <ExternalLink size={12} className="shrink-0"/> <span className="truncate">Link {idx + 1}</span>
                                  </a>
                                ))}
                              </div>
                            )}
                            <div className="bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 px-3 h-9 rounded-lg text-[10px] font-black flex items-center gap-1.5 ml-auto">
                              <CheckCircle size={14}/> APROBADO
                            </div>
                            <button type="button" disabled={loadingTaskId !== null} onClick={() => onUndoInternalApprove(dbTask.id, assignee.profile_id)} className="bg-white hover:bg-red-50 text-gray-500 hover:text-red-500 dark:bg-zinc-800 dark:border-zinc-700 border border-gray-200 px-3 h-9 rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-sm">
                              {loadingTaskId === loadKey ? <Loader2 className="animate-spin" size={14}/> : 'Deshacer OK'}
                            </button>
                          </>
                        )}

                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Botón fantasma para activar el modal del colaborador desde RightActionPanel */}
        {isCollaboratorView && (
           <button 
             id="btn-hidden-deliver" 
             className="hidden" 
             onClick={() => handleOpenUploadModal(profile?.id)}
           ></button>
        )}

      </div>
    </div>
  );
}