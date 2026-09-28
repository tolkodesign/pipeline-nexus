import type { ClientData, NameCountPair, PriorityCounts, ReportFilters, ReportMetrics } from '../types/reportMetrics';

export const parseDurationToSeconds = (raw: string): number => {
  if (!raw) return 0;
  const str = String(raw).trim().toLowerCase();
  if (!str || str === '--') return 0;
  
  if (str.includes(':')) {
    const parts = str.split(':').map(p => parseFloat(p) || 0);
    if (parts.length === 3) {
      return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
    } else if (parts.length === 2) {
      return (parts[0] * 60) + parts[1];
    }
  }
  
  if (str.includes('min') || str.includes('m')) {
    const num = parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
    return num * 60;
  }
  if (str.includes('seg') || str.includes('s')) {
    return parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
  }
  const num = parseFloat(str) || 0;
  return num > 60 ? num : num * 60;
};

export const formatSecondsToReadable = (totalSec: number): string => {
  if (!totalSec || totalSec <= 0) return '0 min';
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes} min`;
};

export const calculateReportMetrics = (
  requests: any[],
  clients: ClientData[],
  filters: ReportFilters,
  resolveSpecialtyName: (id?: number, fallbackStr?: string) => string
): ReportMetrics => {
  const { reportClientId, startMonth, endMonth, statusFilter, sortOrder, isAdmin } = filters;

  let clientData = reportClientId === 'todos' ? requests : requests.filter(r => r.organization_id === reportClientId);
    
  if (startMonth || endMonth) {
    clientData = clientData.filter(req => {
      const dateStr = req.due_date || req.request_date || req.created_at;
      if (!dateStr) return false;
      const reqMonth = String(dateStr).substring(0, 7);
      if (startMonth && endMonth) return reqMonth >= startMonth && reqMonth <= endMonth;
      if (startMonth) return reqMonth >= startMonth;
      if (endMonth) return reqMonth <= endMonth;
      return true;
    });
  }

  if (statusFilter !== 'todos') {
    if (statusFilter === 'completados') clientData = clientData.filter(req => ['completado', 'aprobado'].includes(req.status));
    else if (statusFilter === 'activos') clientData = clientData.filter(req => !['completado', 'aprobado'].includes(req.status));
    else clientData = clientData.filter(req => req.status === statusFilter);
  }

  clientData = clientData.sort((a, b) => {
    const dateA = new Date(a.request_date || a.created_at).getTime();
    const dateB = new Date(b.request_date || b.created_at).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const globalName = isAdmin ? 'Consola Global Tolko' : 'Cuentas Asignadas';
  const selectedClient = reportClientId === 'todos' 
    ? { name: globalName, banner_url: null, logo_url: null, primary_color: '#D3002D', has_mailchimp: false } 
    : clients.find(c => c.id === reportClientId) || { name: 'Reporte Especial', banner_url: null, logo_url: null, primary_color: '#D3002D', has_mailchimp: false };

  const clientNameClean = selectedClient.name.toLowerCase().replace(/\s+/g, '');
  const isBioPappel = clientNameClean.includes('biopappel');

  let cP = selectedClient.primary_color || '#D3002D';
  if (selectedClient.name?.toLowerCase().includes('novo')) {
      cP = '#42aaf5';
  }

  const totalRequests = clientData.length;
  const completed = clientData.filter(r => r.status === 'completado' || r.status === 'aprobado').length;

  let clientAdjustments = 0; let agencyAdjustments = 0;
  clientData.forEach((req: any) => {
    let reqClient = 0; let reqAgency = 0; let hasDetailed = false;
    if (req.request_tasks && Array.isArray(req.request_tasks)) {
      req.request_tasks.forEach((t: any) => {
        if (t.task_adjustments && Array.isArray(t.task_adjustments)) {
          t.task_adjustments.forEach((adj: any) => {
            hasDetailed = true;
            if (adj.origin === 'cliente') reqClient++;
            else if (adj.origin === 'agencia') reqAgency++;
          });
        }
      });
    }
    if (hasDetailed) { clientAdjustments += reqClient; agencyAdjustments += reqAgency; }
    else { clientAdjustments += (req.total_adjustments || 0); }
  });

  let totalEditingHours = 0; let totalRecordingHours = 0; let totalVideoDurationSeconds = 0;
  let totalSlides = 0; let totalVideos = 0; let totalGifs = 0; let totalPpts = 0;
  let totalTotems = 0; let totalGestiones = 0; let totalEnvios = 0; let totalPR = 0; let totalCopysExcatos = 0; 
  let priorityCounts = { alta: 0, media: 0, baja: 0 };
  let projectCounts: Record<string, number> = {}; let brandCounts: Record<string, number> = {};
  
  let specialtyParticipations: Record<string, number> = { 
    'Audiovisual': 0, 'Diseño': 0, 'Programación': 0, 'Contenido y estrategia': 0, 
    'Producción': 0, 'Staff': 0, 'RP': 0 
  };
  
  let strategyCount = 0;
  let totalDeliverablesCount = 0;
  let completedDeliverablesCount = 0;

  // 🔥 REGLA DE ORO: ITEMS_BREAKDOWN ES LA ÚNICA FUENTE DE LA VERDAD 🔥
  clientData.forEach((req: any) => {
    const isCompleted = req.status === 'completado' || req.status === 'aprobado';
    
    const getSpecName = (specId?: number, fallbackStr?: string) => resolveSpecialtyName(specId, fallbackStr);

    const applyLegacyNeeds = (targetMap: Record<string, number>, srcObj: any, q: number) => {
       let matched = false;
       const check = (flag: string, fallbackName: string) => {
         if (srcObj[flag]) {
            const name = getSpecName(undefined, fallbackName);
            targetMap[name] = (targetMap[name] || 0) + q;
            matched = true;
         }
       };
       check('needs_design', 'Diseño');
       check('needs_dev', 'Programación');
       check('needs_av', 'Audiovisual');
       check('needs_copy', 'Contenido');
       check('needs_prod', 'Producción');
       check('needs_staff', 'Staff');
       check('needs_rp', 'RP');
       return matched;
    };

    // 1. Fuente única de la verdad: items_breakdown
    let breakdown = req.items_breakdown;
    if (typeof breakdown === 'string') {
      try { breakdown = JSON.parse(breakdown); } catch (e) { breakdown = []; }
    }

    let sumItemsBreakdown = 0;
    let itemsByDisc: Record<string, number> = {};

    if (breakdown && Array.isArray(breakdown) && breakdown.length > 0) {
      breakdown.forEach((item: any) => {
        let q = Number(item.quantity) || 1;
        sumItemsBreakdown += q;
        if (item.specialty_ids && Array.isArray(item.specialty_ids) && item.specialty_ids.length > 0) {
          item.specialty_ids.forEach((sid: number) => {
            const name = getSpecName(sid);
            itemsByDisc[name] = (itemsByDisc[name] || 0) + q;
          });
        } else {
          const matched = applyLegacyNeeds(itemsByDisc, item, q);
          if (!matched) {
            const name = getSpecName(undefined, 'Diseño');
            itemsByDisc[name] = (itemsByDisc[name] || 0) + q;
          }
        }
      });
    }

    // 2. Fallback únicamente si la solicitud no tiene desglose (registros viejos)
    let fallbackDisc: Record<string, number> = {};
    let hasDiscipline = false;
    let q = Number(req.quantity) || 1;

    if (req.specialty_ids && Array.isArray(req.specialty_ids) && req.specialty_ids.length > 0) {
      req.specialty_ids.forEach((sid: number) => {
        const name = getSpecName(sid);
        fallbackDisc[name] = (fallbackDisc[name] || 0) + q;
        hasDiscipline = true;
      });
    } else {
      hasDiscipline = applyLegacyNeeds(fallbackDisc, req, q);
    }
    
    if (!hasDiscipline) { 
      const fallback = getSpecName(undefined, 'Diseño');
      fallbackDisc[fallback] = (fallbackDisc[fallback] || 0) + q; 
    }

    let finalRequestQty = 0;
    let discCounts: Record<string, number> = {};

    if (sumItemsBreakdown > 0) {
      finalRequestQty = sumItemsBreakdown;
      discCounts = { ...itemsByDisc };
    } else {
      finalRequestQty = q;
      discCounts = { ...fallbackDisc };
    }

    totalDeliverablesCount += finalRequestQty;
    if (isCompleted) completedDeliverablesCount += finalRequestQty;

    // Inyectar en el row para que el Excel lo lea tal cual
    req._calculated_disciplines = { ...discCounts };
    req._final_request_qty = finalRequestQty;

    // Sumar al Global Map de la UI
    Object.entries(discCounts).forEach(([disc, val]) => {
      if (val > 0) {
        if (disc === 'Contenido') {
          specialtyParticipations['Contenido y estrategia'] += val;
          totalCopysExcatos += val;
        } else {
          specialtyParticipations[disc] = (specialtyParticipations[disc] || 0) + val;
        }
        if (disc === 'RP') totalPR += val;
      }
    });

    // ---- Métricas extras para las slides ----
    if (req.request_tasks && Array.isArray(req.request_tasks)) {
      req.request_tasks.forEach((t: any) => {
        if (t.task_assignees && Array.isArray(t.task_assignees)) {
           t.task_assignees.forEach((a: any) => {
              totalEditingHours += Number(a.editing_hours) || 0;
              totalRecordingHours += Number(a.recording_hours) || 0;
              if (a.video_duration) {
                totalVideoDurationSeconds += parseDurationToSeconds(String(a.video_duration));
              }
           });
        }
      });
    }

    const ext = req.file_extensions?.extension?.toLowerCase() || '';
    const titleRaw = (req.title || '').toLowerCase();
    const projName = req.projects?.name || 'General (Sin Tablero)';

    const isPresentation = ext.includes('ppt') || titleRaw.includes('presentación') || titleRaw.includes('presentacion');
    if (isPresentation) {
        totalSlides += finalRequestQty;
        totalPpts += 1;
    } else {
        totalSlides += Number(req.page_or_slide_count) || 0;
    }
    
    if (titleRaw.includes('totem') || titleRaw.includes('tótem')) {
        totalTotems += (discCounts['Audiovisual'] || 0) > 0 ? (discCounts['Audiovisual'] || 0) : finalRequestQty;
    }
    
    const prio = req.priorities?.level?.toLowerCase() || '';
    if (prio.includes('alta') || prio === '1') priorityCounts.alta++; 
    else if (prio.includes('media') || prio === '2') priorityCounts.media++; 
    else priorityCounts.baja++;
    
    projectCounts[projName] = (projectCounts[projName] || 0) + finalRequestQty;
    
    const brandName = req.department || selectedClient?.name || 'General';
    brandCounts[brandName] = (brandCounts[brandName] || 0) + finalRequestQty;

    if (titleRaw.includes('estrategia') || titleRaw.includes('concepto') || titleRaw.includes('estrategico') || titleRaw.includes('estratégico')) strategyCount += finalRequestQty;
    if (titleRaw.includes('gestión') || titleRaw.includes('visita')) totalGestiones += finalRequestQty;
    if (titleRaw.includes('envío') || titleRaw.includes('entrega')) totalEnvios += finalRequestQty;
  });

  const topRecurrentProjects = Object.entries(projectCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 5); 
  const topBrands = Object.entries(brandCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 5); 

  return { 
    clientData, 
    selectedClient, 
    clientColor: cP,
    isBioPappel,
    
    totalRequests, 
    completed, 
    totalDeliverablesCount, 
    completedDeliverablesCount, 
    
    clientAdjustments, 
    agencyAdjustments, 
    
    specialtyParticipations, 
    
    totalEditingHours, 
    totalRecordingHours, 
    totalVideoDurationSeconds,
    totalVideoDurationFormatted: formatSecondsToReadable(totalVideoDurationSeconds),
    
    totalSlides, 
    totalVideos, 
    totalGifs, 
    totalPpts, 
    
    priorityCounts, 
    topRecurrentProjects, 
    topBrands, 
    
    strategyCount, 
    totalTotems, 
    totalGestiones, 
    totalEnvios, 
    totalPR, 
    totalCopysExcatos 
  };
};
