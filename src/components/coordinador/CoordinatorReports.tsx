import { useState, useEffect } from 'react';
import { Layers, ShieldCheck, CheckCircle2, AlertCircle, Download, BarChart3, FileText, Printer, ArrowUpDown, UserCheck, RefreshCw } from 'lucide-react'; 
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import ClientAnalytics from '../../components/client/ClientAnalytics'; 
import RequestRow from '../../components/admin/ui/RequestRow'; 
import Swal from 'sweetalert2';

export default function CoordinatorReports() {
  const { user, profile } = useAuth();
  
  const [requests, setRequests] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [reportClientId, setReportClientId] = useState<string>('todos');
  const [periodFilter, setPeriodFilter] = useState<'historico' | 'mes' | 'trimestre' | 'semestre' | 'anual'>('historico');
  const [statusFilter, setStatusFilter] = useState<string>('todos'); 
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const leaderSpecialty = profile?.specialties?.name || profile?.specialty || 'General';

  useEffect(() => {
    if (user?.id) fetchReportData();
  }, [user]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // 1. RESTRICCIÓN DE SEGURIDAD: Solo las empresas asignadas al coordinador
      const { data: myAssignedOrgs } = await supabase
        .from('organization_distribution_lists')
        .select('organization_id')
        .eq('profile_id', user!.id);

      const orgIds = myAssignedOrgs?.map(item => item.organization_id) || [];

      if (orgIds.length === 0) {
        setRequests([]);
        setClients([]);
      } else {
        const { data: orgs } = await supabase
          .from('organizations')
          .select('id, name, logo_url, banner_url, primary_color')
          .in('id', orgIds)
          .order('name');
          
        if (orgs && orgs.length > 0) {
          setClients(orgs);
          if (reportClientId === 'todos') {
            setReportClientId('todos');
          }
        }

        // 2. Consulta con todos los datos necesarios para el Excel VIP
        const { data: reqs } = await supabase
          .from('requests')
          .select(`
            *, 
            organizations(name, primary_color), 
            projects(name), 
            request_categories(name), 
            organization_deliverables(name),
            priorities(level, color_code), 
            request_tasks(
              discipline, status, updated_at, quantity,
              task_adjustments(origin),
              task_assignees(editing_hours, recording_hours, video_duration)
            ),
            requester:profiles!requests_requester_id_fkey(full_name)
          `)
          .in('organization_id', orgIds)
          .order('created_at', { ascending: false });
        
        setRequests(reqs || []);
      }
    } catch (error) {
      console.error("Error estructurando analíticas:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 EXPORTADOR EXCEL VIP "SMART COLUMNS" ADAPTADO PARA EL COORDINADOR 🔥
  const exportToPremiumReport = (dataToExport: any[], clientInfo: any) => {
    if (dataToExport.length === 0) {
      Swal.fire({ title: 'Sin Datos', text: 'No hay solicitudes para exportar con estos filtros.', icon: 'info', confirmButtonColor: '#D3002D' });
      return;
    }

    const clientName = clientInfo?.name || 'Mis Cuentas Global';
    const logoUrl = clientInfo?.logo_url || '';

    const norm = (s: string) => (s || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

    // EVALUAR QUÉ COLUMNAS ESTÁN ACTIVAS
    const hasDesign = dataToExport.some(req => req.needs_design);
    const hasDev = dataToExport.some(req => req.needs_dev);
    const hasAv = dataToExport.some(req => req.needs_av);
    const hasCopy = dataToExport.some(req => req.needs_copy);
    const hasProd = dataToExport.some(req => req.needs_prod);
    const hasStaff = dataToExport.some(req => req.needs_staff);
    const hasRp = dataToExport.some(req => req.needs_rp);

    let activeDisciplinesCount = 0;
    if (hasDesign) activeDisciplinesCount++;
    if (hasDev) activeDisciplinesCount++;
    if (hasAv) activeDisciplinesCount++; 
    if (hasCopy) activeDisciplinesCount++;
    if (hasProd) activeDisciplinesCount++;
    if (hasStaff) activeDisciplinesCount++;
    if (hasRp) activeDisciplinesCount++;

    let totalColumns = 12 + (activeDisciplinesCount * 2) + 1;
    if (hasAv) totalColumns += 1; 
    
    const rightColspan = totalColumns - 7; 

    const getDisciplineQty = (req: any, disc: string, isNeeded: boolean) => {
      if (!isNeeded) return 0;
      const targetDisc = norm(disc);
      const task = req.request_tasks?.find((t: any) => norm(t.discipline) === targetDisc);
      
      if (task && Number(task.quantity) > 0) {
        return Number(task.quantity);
      }

      let breakdown = req.items_breakdown;
      if (typeof breakdown === 'string') {
         try { breakdown = JSON.parse(breakdown); } catch (e) { breakdown = []; }
      }
      if (breakdown && Array.isArray(breakdown)) {
         const items = breakdown.filter((i: any) => norm(i.discipline) === targetDisc);
         if (items.length > 0) {
             return items.reduce((acc: number, i: any) => acc + (Number(i.quantity) || 1), 0);
         }
      }
      return 1;
    };

    const getDelivs = (req: any, disc: string, isNeeded: boolean) => {
      if (!isNeeded) return '-';
      const targetDisc = norm(disc);
      const totalQtyForDisc = getDisciplineQty(req, disc, isNeeded);

      let breakdown = req.items_breakdown;
      if (typeof breakdown === 'string') {
        try { breakdown = JSON.parse(breakdown); } catch (e) { breakdown = []; }
      }

      if (breakdown && Array.isArray(breakdown)) {
        const items = breakdown.filter((i: any) => norm(i.discipline) === targetDisc);
        if (items.length > 0) {
          if (items.length === 1) {
            return `${totalQtyForDisc}x ${items[0].name || items[0].label || 'Pieza'}`;
          }
          return items.map((i: any) => `${i.quantity || 1}x ${i.name || i.label || 'Pieza'}`).join(' | ');
        }
      }

      const fallbackName = req.organization_deliverables?.name || req.request_categories?.name || req.title || 'Pieza General';
      return `${totalQtyForDisc}x ${fallbackName}`;
    };

    const getTotalDelivs = (req: any) => {
       let total = 0;
       if (hasDesign) total += getDisciplineQty(req, 'Diseño', req.needs_design);
       if (hasDev) total += getDisciplineQty(req, 'Programación', req.needs_dev);
       if (hasAv) total += getDisciplineQty(req, 'Audiovisual', req.needs_av);
       if (hasCopy) total += getDisciplineQty(req, 'Contenido', req.needs_copy);
       if (hasProd) total += getDisciplineQty(req, 'Producción', req.needs_prod);
       if (hasStaff) total += getDisciplineQty(req, 'Staff', req.needs_staff);
       if (hasRp) total += getDisciplineQty(req, 'RP', req.needs_rp);
       
       return total > 0 ? total : (Number(req.quantity) || 1);
    };

    const getAVMetrics = (req: any) => {
       let durs: string[] = [];
       if (req.request_tasks) {
         req.request_tasks.forEach((t:any) => {
           if (t.discipline.toLowerCase() === 'audiovisual' && t.task_assignees) {
              t.task_assignees.forEach((a:any) => {
                 if (a.video_duration) durs.push(a.video_duration);
              });
           }
         });
       }
       return { dur: durs.join(' | ') || '-' };
    };

    const getStatusColor = (status: string) => {
      if(['completado', 'entregado', 'aprobado', 'aprobado_interno'].includes(status)) return '#10b981'; 
      if(['con_correcciones'].includes(status)) return '#ef4444'; 
      return '#f59e0b'; 
    };

    let tableHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <style>
          table { border-collapse: collapse; font-family: 'Segoe UI', Arial, sans-serif; }
          th { background-color: #D3002D; color: white; font-weight: bold; padding: 12px; border: 1px solid #ffffff; text-align: center; font-size: 11px; }
          td { padding: 8px; border: 1px solid #e5e7eb; vertical-align: middle; font-size: 11px; }
          .title-row { background-color: #0F0F12; color: white; font-size: 20px; font-weight: 900; text-align: left; vertical-align: middle; }
          .disc-yes { background-color: #d1fae5; color: #065f46; font-weight: bold; text-align: center; }
          .disc-no { background-color: #f3f4f6; color: #9ca3af; text-align: center; }
          .cat-header { font-size: 10px; color: white; border: 1px solid #fff; }
          .total-header { background-color: #0F0F12; color: white; font-weight: 900; text-align: center; font-size: 11px; }
        </style>
      </head>
      <body>
        <table>
          <tr>
            <td colspan="7" class="title-row" style="height: 80px; padding-left: 20px;">
              REPORTE OPERATIVO: ${clientName.toUpperCase()}
            </td>
            <td colspan="${rightColspan}" class="title-row" style="text-align: right; padding-right: 20px;">
              ${logoUrl ? `<img src="${logoUrl}" height="50" style="margin-top: 10px;" />` : ''}
            </td>
          </tr>
          <tr><td colspan="${totalColumns}" style="height: 15px; border: none;"></td></tr>
          
          <tr>
            <th>ID TICKET</th>
            <th>CLIENTE</th>
            <th>SOLICITANTE</th>
            <th>TABLERO DESTINO</th>
            <th style="background-color: #0F0F12; color: #fff;">DEPARTAMENTO</th>
            <th style="width: 250px;">TÍTULO DEL PROYECTO</th>
            <th>FECHA SOLICITUD</th>
            <th>FECHA LÍMITE</th>
            <th>PRIORIDAD</th>
            <th>ESTATUS GLOBAL</th>
            <th style="background-color: #f97316;">AJUSTES CLIENTE</th>
            <th style="background-color: #a855f7;">AJUSTES AGENCIA</th>
            
            ${hasDesign ? `<th class="cat-header" style="background-color: #3b82f6;">DISEÑO</th>
            <th class="cat-header" style="background-color: #3b82f6; width: 200px;">ENTREGABLES DISEÑO</th>` : ''}
            
            ${hasDev ? `<th class="cat-header" style="background-color: #f59e0b;">PROGRAMACIÓN</th>
            <th class="cat-header" style="background-color: #f59e0b; width: 200px;">ENTREGABLES PROGRA</th>` : ''}
            
            ${hasAv ? `<th class="cat-header" style="background-color: #10b981;">AUDIOVISUAL</th>
            <th class="cat-header" style="background-color: #10b981; width: 200px;">ENTREGABLES AUDIOVISUAL</th>
            <th class="cat-header" style="background-color: #047857; width: 120px;">DURACIÓN VIDEO</th>` : ''}
            
            ${hasCopy ? `<th class="cat-header" style="background-color: #f9a8d4; color: #9d174d;">CONTENIDO</th>
            <th class="cat-header" style="background-color: #f9a8d4; color: #9d174d; width: 200px;">ENTREGABLES CONTENIDO</th>` : ''}
            
            ${hasProd ? `<th class="cat-header" style="background-color: #ec4899;">PRODUCCIÓN</th>
            <th class="cat-header" style="background-color: #ec4899; width: 200px;">ENTREGABLES PRODUCCIÓN</th>` : ''}
            
            ${hasStaff ? `<th class="cat-header" style="background-color: #06b6d4;">STAFF</th>
            <th class="cat-header" style="background-color: #06b6d4; width: 200px;">ENTREGABLES STAFF</th>` : ''}
            
            ${hasRp ? `<th class="cat-header" style="background-color: #8b5cf6;">RP</th>
            <th class="cat-header" style="background-color: #8b5cf6; width: 200px;">ENTREGABLES RP</th>` : ''}

            <th class="total-header" style="background-color: #D3002D; width: 160px;">TOTAL DE ENTREGABLES</th>
          </tr>
    `;

    dataToExport.forEach(req => {
      const reqDateStr = req.request_date || req.created_at;
      const statusClean = (req.status || '').replace(/_/g, ' ').toUpperCase();

      let clientAdj = 0;
      let agencyAdj = 0;
      if (req.request_tasks && Array.isArray(req.request_tasks)) {
        req.request_tasks.forEach((t: any) => {
          if (t.task_adjustments && Array.isArray(t.task_adjustments)) {
            t.task_adjustments.forEach((adj: any) => {
              if (adj.origin === 'cliente') clientAdj++;
              else if (adj.origin === 'agencia') agencyAdj++;
            });
          }
        });
      }
      if (clientAdj === 0 && agencyAdj === 0) clientAdj = req.total_adjustments || 0;

      const totalDelivsCount = getTotalDelivs(req);
      const avMetricsInfo = getAVMetrics(req);

      tableHtml += `
        <tr>
          <td style="text-align: center; font-weight: 900;">${req.id.slice(-6).toUpperCase()}</td>
          <td style="font-weight: bold;">${req.organizations?.name || 'N/A'}</td>
          <td>${req.requester?.full_name || 'N/A'}</td>
          <td>${req.projects?.name || 'N/A'}</td>
          <td style="text-align: center; font-weight: 900; color: #D3002D;">${req.department || '-'}</td>
          <td>${req.title || 'N/A'}</td>
          <td style="text-align: center;">${reqDateStr ? new Date(reqDateStr).toLocaleDateString('es-MX') : 'N/A'}</td>
          <td style="text-align: center; font-weight: bold;">${req.due_date ? new Date(req.due_date).toLocaleDateString('es-MX') : 'S/F'}</td>
          <td style="text-align: center; font-weight: 900; color: ${req.priorities?.color_code || '#000'}">${req.priorities?.level || 'N/A'}</td>
          <td style="text-align: center; font-weight: 900; color: ${getStatusColor(req.status)}">${statusClean}</td>
          <td style="text-align: center; font-weight: bold; color: #ea580c;">${clientAdj}</td>
          <td style="text-align: center; font-weight: bold; color: #9333ea;">${agencyAdj}</td>

          ${hasDesign ? `<td class="${req.needs_design ? 'disc-yes' : 'disc-no'}">${req.needs_design ? 'SÍ' : 'NO'}</td>
          <td>${getDelivs(req, 'Diseño', req.needs_design)}</td>` : ''}

          ${hasDev ? `<td class="${req.needs_dev ? 'disc-yes' : 'disc-no'}">${req.needs_dev ? 'SÍ' : 'NO'}</td>
          <td>${getDelivs(req, 'Programación', req.needs_dev)}</td>` : ''}

          ${hasAv ? `<td class="${req.needs_av ? 'disc-yes' : 'disc-no'}">${req.needs_av ? 'SÍ' : 'NO'}</td>
          <td>${getDelivs(req, 'Audiovisual', req.needs_av)}</td>
          <td style="text-align: center; font-weight: 900; color: #047857; background-color: #ecfdf5;">${req.needs_av ? avMetricsInfo.dur : '-'}</td>` : ''}

          ${hasCopy ? `<td class="${req.needs_copy ? 'disc-yes' : 'disc-no'}">${req.needs_copy ? 'SÍ' : 'NO'}</td>
          <td>${getDelivs(req, 'Contenido', req.needs_copy)}</td>` : ''}

          ${hasProd ? `<td class="${req.needs_prod ? 'disc-yes' : 'disc-no'}">${req.needs_prod ? 'SÍ' : 'NO'}</td>
          <td>${getDelivs(req, 'Producción', req.needs_prod)}</td>` : ''}

          ${hasStaff ? `<td class="${req.needs_staff ? 'disc-yes' : 'disc-no'}">${req.needs_staff ? 'SÍ' : 'NO'}</td>
          <td>${getDelivs(req, 'Staff', req.needs_staff)}</td>` : ''}

          ${hasRp ? `<td class="${req.needs_rp ? 'disc-yes' : 'disc-no'}">${req.needs_rp ? 'SÍ' : 'NO'}</td>
          <td>${getDelivs(req, 'RP', req.needs_rp)}</td>` : ''}

          <td style="text-align: center; font-weight: 900; font-size: 12px; background-color: #fef2f2; color: #D3002D;">${totalDelivsCount}</td>
        </tr>
      `;
    });

    tableHtml += `
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\uFEFF' + tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Reporte_Coordinador_${clientName.replace(/\s+/g, '_')}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const getClientSpecificData = () => {
    let clientData = reportClientId === 'todos' 
      ? requests 
      : requests.filter(r => r.organization_id === reportClientId);
      
    const now = new Date();
    if (periodFilter !== 'historico') {
      clientData = clientData.filter(req => {
        const reqDate = new Date(req.request_date || req.created_at);
        const diffTime = Math.abs(now.getTime() - reqDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (periodFilter === 'mes') return diffDays <= 30;
        if (periodFilter === 'trimestre') return diffDays <= 90;
        if (periodFilter === 'semestre') return diffDays <= 180;
        if (periodFilter === 'anual') return diffDays <= 365;
        return true;
      });
    }

    if (statusFilter !== 'todos') {
      if (statusFilter === 'completados') {
        clientData = clientData.filter(req => ['completado', 'aprobado'].includes(req.status));
      } else if (statusFilter === 'activos') {
        clientData = clientData.filter(req => !['completado', 'aprobado'].includes(req.status));
      } else {
        clientData = clientData.filter(req => req.status === statusFilter);
      }
    }

    clientData = clientData.sort((a, b) => {
      const dateA = new Date(a.request_date || a.created_at).getTime();
      const dateB = new Date(b.request_date || b.created_at).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    const selectedClient = reportClientId === 'todos' 
      ? { name: 'Reporte Global de Mis Cuentas', banner_url: null, logo_url: null, primary_color: '#D3002D' } 
      : clients.find(c => c.id === reportClientId) || { name: 'Reporte', primary_color: '#D3002D' };

    const totalRequests = clientData.length;
    const completed = clientData.filter(r => r.status === 'completado' || r.status === 'aprobado').length;
    
    // Cálculo diferenciado de Ajustes
    let clientAdjustments = 0;
    let agencyAdjustments = 0;

    clientData.forEach((req: any) => {
      let reqClient = 0;
      let reqAgency = 0;
      let hasDetailed = false;

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

      if (hasDetailed) {
        clientAdjustments += reqClient;
        agencyAdjustments += reqAgency;
      } else {
        clientAdjustments += (req.total_adjustments || 0);
      }
    });

    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const monthlyCounts: Record<string, { label: string; count: number }> = {};

    clientData.forEach((req: any) => {
      const dateStr = req.request_date || req.created_at;
      if (dateStr) {
        const parts = String(dateStr).split('T')[0].split('-');
        if (parts.length >= 2) {
          const ymKey = `${parts[0]}-${parts[1]}`;
          const monthIdx = parseInt(parts[1], 10) - 1;
          const mName = `${monthNames[monthIdx]} ${parts[0].slice(-2)}`;

          if (!monthlyCounts[ymKey]) {
            monthlyCounts[ymKey] = { label: mName, count: 0 };
          }
          monthlyCounts[ymKey].count += 1;
        }
      }
    });

    const sortedYMKeys = Object.keys(monthlyCounts).sort();
    const cMonthlyFlow = sortedYMKeys.slice(-12).map(k => ({
      name: monthlyCounts[k].label,
      solicitudes: monthlyCounts[k].count
    }));

    // Conteo completo de las 7 disciplinas
    let d = 0, p = 0, a = 0, c = 0, pr = 0, st = 0, rp = 0;
    clientData.forEach((req: any) => {
      if (req.needs_design) d++;
      if (req.needs_dev) p++;
      if (req.needs_av) a++;
      if (req.needs_copy) c++;
      if (req.needs_prod) pr++;
      if (req.needs_staff) st++;
      if (req.needs_rp) rp++;
    });

    const cDiscipline = [
      { name: 'Diseño', value: d },
      { name: 'Programación', value: p },
      { name: 'Audiovisual', value: a },
      { name: 'Contenido', value: c },
      { name: 'Producción', value: pr },
      { name: 'Staff', value: st },
      { name: 'RP', value: rp }
    ].filter(x => x.value > 0);

    const catCounts = clientData.reduce((acc: any, req: any) => {
      const cat = req.organization_deliverables?.name || req.request_categories?.name || 'General';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});
    
    const cDeliverables = Object.keys(catCounts).map(k => ({ name: k, total: catCounts[k] })).sort((x, y) => y.total - x.total).slice(0, 5);

    return { 
      clientData, 
      selectedClient, 
      totalRequests, 
      completed, 
      clientAdjustments, 
      agencyAdjustments, 
      cMonthlyFlow, 
      cDiscipline, 
      cDeliverables 
    };
  };

  const reportData = getClientSpecificData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-luxury-dark flex items-center justify-center font-sans print:hidden">
        <div className="w-8 h-8 border-2 border-luxury-red border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-luxury-dark text-gray-900 dark:text-gray-200 pb-10 space-y-8 font-sans w-full max-w-full flex-1 min-w-0 overflow-visible print:bg-white print:text-black">
      
      <style type="text/css" media="print">
        {`
          @page { size: auto; margin: 0mm !important; }
          body { background: white !important; }
          #report-printable-area {
            position: absolute !important;
            top: 0 !important; left: 0 !important;
            width: 100vw !important; margin: 0 !important;
            padding: 15mm !important; background: white !important;
            z-index: 99999 !important;
          }
          #report-printable-area .lg\\:flex { display: flex !important; }
          #report-printable-area .md\\:block { display: block !important; }
          #report-printable-area .sm\\:block { display: block !important; }
          #report-printable-area .hidden.print\\:hidden { display: none !important; }

          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
          .print-avoid-break { page-break-inside: avoid !important; break-inside: avoid !important; display: inline-block !important; width: 100% !important; margin-bottom: 1rem !important; }
          .recharts-wrapper { margin: 0 auto !important; }
          .print-heading { page-break-after: avoid !important; break-after: avoid !important; }
        `}
      </style>

      <div className="px-4 sm:px-6 md:px-10 pt-6 md:pt-10 w-full print:hidden">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4 md:gap-6 w-full">
          <div className="w-full min-w-0 mb-2 xl:mb-0">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase truncate">
              Business <span className="text-luxury-red">Intelligence</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium flex items-center gap-2 truncate">
              <ShieldCheck size={16} className="text-luxury-red shrink-0"/> Área Operativa: <span className="font-black text-luxury-red uppercase tracking-wider">{leaderSpecialty}</span>
            </p>
          </div>

          <div className="w-full xl:w-auto shrink-0 flex flex-wrap items-center gap-3">
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={14} />
              <select 
                value={sortOrder} 
                onChange={e => setSortOrder(e.target.value as 'desc' | 'asc')} 
                className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border rounded-xl py-3.5 pl-9 pr-8 text-xs text-gray-500 dark:text-gray-400 font-black outline-none cursor-pointer uppercase shadow-sm appearance-none w-full sm:w-auto"
              >
                <option value="desc">MÁS RECIENTES</option>
                <option value="asc">MÁS ANTIGUOS</option>
              </select>
            </div>

            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)} 
              className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border rounded-xl p-3.5 text-xs text-gray-500 dark:text-gray-400 font-black outline-none cursor-pointer uppercase shadow-sm w-full sm:w-auto"
            >
              <option value="todos">Todos los Estatus</option>
              <option value="activos">Solo Activos</option>
              <option value="completados">Solo Completados</option>
              <option value="pendiente">Pendientes</option>
              <option value="en_proceso">En Proceso</option>
              <option value="en_revision_cliente">En Revisión Cliente</option>
            </select>

            <select 
              value={periodFilter} 
              onChange={e => setPeriodFilter(e.target.value as any)} 
              className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border rounded-xl p-3.5 text-xs text-gray-500 dark:text-gray-400 font-black outline-none cursor-pointer uppercase shadow-sm w-full sm:w-auto"
            >
              <option value="historico">Histórico Completo</option>
              <option value="mes">Último Mes (30 días)</option>
              <option value="trimestre">Trimestral (90 días)</option>
              <option value="semestre">Semestral (180 días)</option>
              <option value="anual">Anual (365 días)</option>
            </select>

            <select 
              value={reportClientId} 
              onChange={e => setReportClientId(e.target.value)} 
              className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border rounded-xl p-3.5 text-xs text-gray-900 dark:text-white font-black outline-none cursor-pointer uppercase shadow-md truncate w-full sm:w-auto md:max-w-xs"
            >
              <option value="todos">Todas mis Cuentas</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div id="report-printable-area" className="px-4 sm:px-6 md:px-10 w-full min-w-0 space-y-8 animate-in fade-in duration-500 print:p-0 print:space-y-6">
        
        {reportData.selectedClient && (
          <div 
            className="w-full min-h-[16rem] rounded-3xl overflow-hidden relative shadow-2xl flex flex-col justify-end p-6 md:p-10 border border-gray-200/50 dark:border-white/10 transition-all duration-500 print:shadow-none print:border-2 print:border-gray-200 print:rounded-2xl print:min-h-[12rem] print:mb-6"
            style={{
              backgroundImage: reportData.selectedClient.banner_url 
                ? `linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%), url(${reportData.selectedClient.banner_url})` 
                : 'linear-gradient(to right, #0F0F12, #1f1f2e)',
              backgroundSize: 'cover', backgroundPosition: 'center'
            }}
          >
            {reportData.selectedClient.logo_url && (
              <img src={reportData.selectedClient.logo_url} alt="Logo" className="absolute top-6 right-6 w-24 h-24 object-contain opacity-80 mix-blend-screen drop-shadow-2xl print:opacity-100 print:mix-blend-normal" />
            )}
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 w-full print:text-black">
              <div className="w-full min-w-0">
                <p className="text-[10px] text-white/70 print:text-white uppercase tracking-[0.3em] font-bold mb-2 flex flex-wrap items-center gap-2">
                  Reporte de Rendimiento 
                  <span className="bg-luxury-red px-2 py-0.5 rounded text-white print:border print:border-white print:text-white print:bg-luxury-red">{periodFilter.toUpperCase()}</span>
                  {statusFilter !== 'todos' && (
                     <span className="bg-gray-800 px-2 py-0.5 rounded text-white print:border print:border-white print:text-white print:bg-gray-800">{statusFilter.replace(/_/g, ' ').toUpperCase()}</span>
                  )}
                </p>
                <h2 className="text-4xl md:text-5xl font-black text-white print:text-white tracking-tight uppercase drop-shadow-lg truncate print:drop-shadow-none">
                  {reportData.selectedClient.name}
                </h2>
              </div>
              <div className="flex gap-2 w-full md:w-auto print:hidden">
                <button onClick={handlePrintPDF} className="flex-1 md:flex-none bg-gray-900 hover:bg-gray-800 text-white px-6 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 cursor-pointer uppercase tracking-widest shrink-0">
                  <Printer size={16} strokeWidth={3}/> PDF
                </button>
                <button onClick={() => exportToPremiumReport(reportData.clientData, reportData.selectedClient)} className="flex-1 md:flex-none bg-luxury-red hover:bg-red-700 text-white px-6 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 cursor-pointer uppercase tracking-widest shrink-0">
                  <Download size={16} strokeWidth={3}/> Excel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TARJETAS DE MÉTRICAS OPERATIVAS RENOVADAS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full print:grid-cols-4 print:gap-4 print:mb-6">
          <div className="bg-white dark:bg-luxury-card print:border-gray-300 border border-gray-200 dark:border-luxury-border p-5 rounded-2xl shadow-sm print:shadow-none">
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-2">
              <Layers size={16} className="text-blue-500 print:text-black"/><span className="text-[10px] font-black uppercase tracking-widest">Total Solicitudes</span>
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white print:text-black">{reportData.totalRequests}</p>
          </div>

          <div className="bg-white dark:bg-luxury-card print:border-gray-300 border border-gray-200 dark:border-luxury-border p-5 rounded-2xl shadow-sm print:shadow-none">
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-2">
              <CheckCircle2 size={16} className="text-green-500 print:text-black"/><span className="text-[10px] font-black uppercase tracking-widest">Completadas</span>
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white print:text-black">{reportData.completed}</p>
          </div>

          <div className="bg-white dark:bg-luxury-card print:border-gray-300 border border-gray-200 dark:border-luxury-border p-5 rounded-2xl shadow-sm relative overflow-hidden print:shadow-none">
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-2">
              <UserCheck size={16} className="text-orange-500 print:text-black"/><span className="text-[10px] font-black uppercase tracking-widest">Ajustes Cliente</span>
            </div>
            <p className="text-3xl font-black text-orange-600 dark:text-orange-400 print:text-black">{reportData.clientAdjustments}</p>
          </div>

          <div className="bg-white dark:bg-luxury-card print:border-gray-300 border border-gray-200 dark:border-luxury-border p-5 rounded-2xl shadow-sm relative overflow-hidden print:shadow-none">
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-2">
              <RefreshCw size={16} className="text-purple-500 print:text-black"/><span className="text-[10px] font-black uppercase tracking-widest">Ajustes Agencia</span>
            </div>
            <p className="text-3xl font-black text-purple-600 dark:text-purple-400 print:text-black">{reportData.agencyAdjustments}</p>
          </div>
        </div>

        {reportData.clientData.length > 0 ? (
          <div className="w-full min-w-0 overflow-hidden bg-gray-50 dark:bg-luxury-dark rounded-3xl p-1 border border-dashed border-gray-300 dark:border-luxury-border/60 print:bg-white print:border-none print:page-break-inside-avoid print:overflow-visible">
            <ClientAnalytics 
              monthlyData={reportData.cMonthlyFlow} 
              disciplineData={reportData.cDiscipline} 
              deliverableData={reportData.cDeliverables}
            />
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-gray-300 dark:border-luxury-border/60 bg-white dark:bg-luxury-card rounded-3xl flex flex-col items-center justify-center gap-3 print:hidden">
            <BarChart3 className="text-gray-300 dark:text-luxury-border/40 animate-pulse" size={42} />
            <p className="text-gray-500 dark:text-gray-400 text-xs font-black uppercase tracking-widest">Sin data en este periodo</p>
          </div>
        )}

        <div className="space-y-4 print:mt-8">
          <h3 className="text-xs font-black print-heading uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 flex items-center gap-2 pl-2 print:text-black print:text-sm print:mb-4">
            <FileText size={14} className="text-luxury-red print:hidden"/> Historial del Cliente
          </h3>
          
          <div className="grid grid-cols-1 gap-3 w-full print:block">
            {reportData.clientData.map(req => (
              <div className="print-avoid-break" key={req.id}>
                <RequestRow 
                  request={req} 
                  onEdit={() => {}} 
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}