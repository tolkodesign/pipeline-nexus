import { useState, useEffect } from 'react';
import { 
  ShieldCheck, CheckCircle2, AlertCircle, Download, Target, Printer, Building2, Video, Clock, 
  Presentation, Copy, Flag, Repeat, MonitorPlay, PenTool, LayoutTemplate, Sparkles, BarChart3, 
  Award, CalendarDays, MailOpen, List, Send, Megaphone, ArrowUpDown, PanelLeft, 
  UserCheck, RefreshCw, Layers, FileText, Layout, Package, Image, Film
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';
import Swal from 'sweetalert2';
import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';

// 🔥 IMPORTAMOS EL LOGO DIRECTO DESDE TUS ASSETS LOCALES 🔥
import tolkoLogo from '../../../assets/image-4-_1_.ico';

// 🔥 COMPONENTES BASE DE PRESENTACIÓN CON BRANDING TOLKO 🔥

function ProgressRing({ percent, value, label, color, track = '#F1F5F9', size = 130, strokeWidth = 14, textColor }: any) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safePercent = Math.max(0, Math.min(100, percent || 0));
  const offset = circumference - (safePercent / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={track} strokeWidth={strokeWidth} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
        <EditableBigNumber value={value} style={{ color: textColor || color, fontSize: size * 0.22 }} className="font-black leading-none" />
        {label && <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1 text-center">{label}</span>}
      </div>
    </div>
  );
}

function SlideSidebar({ index, total, title, icon: Icon, colorP, clientLogo }: any) {
  const formattedIndex = String(index).padStart(2, '0');
  const formattedTotal = String(total).padStart(2, '0');
  
  return (
    <div className="w-95 shrink-0 h-full bg-gradient-to-b from-[#0F0F12] via-[#1F1F2E] to-[#0F0F12] p-12 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full border-[28px] border-white/[0.04]"></div>
      <div className="absolute -right-16 bottom-16 w-40 h-40 rounded-full" style={{ backgroundColor: `${colorP}1A` }}></div>

      <div className="relative z-10">
        <img 
          src={tolkoLogo} 
          alt="Tolko" 
          className="h-12 w-auto object-contain mb-10 opacity-90 drop-shadow-md rounded-lg"
        />

        {Icon && (
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-6 backdrop-blur-sm shadow-xl">
            <Icon size={26} style={{ color: colorP }} strokeWidth={2.5} />
          </div>
        )}
        
        <p className="text-xs font-black uppercase tracking-[0.3em] mb-4" style={{ color: colorP }}>Reporte Ejecutivo</p>
        <h2 className="text-[40px] font-black text-white leading-[1.05] uppercase drop-shadow-sm">{title}</h2>
      </div>

      <div className="relative z-10 flex flex-col items-start gap-8">
        {clientLogo && (
          <div className="h-20 w-48 flex items-center justify-start">
            <img 
              src={clientLogo} 
              alt="Client" 
              className="max-w-full max-h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]" 
              crossOrigin="anonymous" 
            />
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="h-[2px] w-14 bg-white/20"></div>
          <span className="text-white/40 text-xs font-black tracking-widest">{formattedIndex} / {formattedTotal}</span>
        </div>
      </div>
    </div>
  );
}

function SectionPill({ icon: Icon, title, colorP }: any) {
  return (
    <div className="inline-flex items-center gap-3 text-white px-7 py-4 rounded-2xl w-fit" style={{ backgroundColor: colorP, boxShadow: `0 14px 30px -12px ${colorP}8C` }}>
      <Icon size={26} strokeWidth={2.5} />
      <span className="text-2xl font-black uppercase tracking-wide">{title}</span>
    </div>
  );
}

function MetricCard({ icon: Icon, value, label, accent }: any) {
  const [editedValue, setEditedValue] = useState(value);

  // Sync when parent value changes (e.g. filter change), but otherwise keep user edits
  useEffect(() => {
     setEditedValue(value);
  }, [value]);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col items-center justify-center text-center gap-3 h-full shadow-sm">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accent}1A` }}>
        <Icon size={20} style={{ color: accent }} strokeWidth={2.5} />
      </div>
      <input 
        type="text"
        value={editedValue}
        onChange={(e) => setEditedValue(e.target.value)}
        className="text-[52px] font-black leading-none text-center bg-transparent outline-none w-full border-b-2 border-transparent hover:border-gray-100 focus:border-gray-200 transition-colors"
        style={{ color: accent }} 
      />
      <span className="text-[13px] text-gray-500 font-bold uppercase tracking-widest leading-tight">{label}</span>
    </div>
  );
}

function SlideWrapper({ children }: { children: React.ReactNode }) {
  const scale = 0.82; 
  const height = 720 * scale;
  
  return (
    <div className="w-full flex justify-center mb-6" style={{ height: `${height}px` }}>
      <div className="origin-top" style={{ transform: `scale(${scale})` }}>
        <div className="rounded-[24px] shadow-[0_25px_60px_-15px_rgba(211,0,45,0.15)] border border-gray-200 overflow-hidden">
            {children}
        </div>
      </div>
    </div>
  );
}

function EditableBigNumber({ value, className, style }: any) {
  const [editedValue, setEditedValue] = useState(value);
  useEffect(() => { setEditedValue(value); }, [value]);
  return (
    <input 
      type="text"
      value={editedValue}
      onChange={(e) => setEditedValue(e.target.value)}
      className={`bg-transparent outline-none border-b-2 border-transparent hover:border-gray-300 focus:border-gray-400 transition-colors text-center w-full ${className}`}
      style={style}
    />
  );
}

function CustomEditableSlide({ title, slideIndex, totalSlides, colorP, clientLogo, defaultText }: any) {
  const [text, setText] = useState(defaultText);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <SlideWrapper>
      <div className="pdf-slide relative flex overflow-hidden shrink-0 bg-white w-[1280px] h-[720px]">
        <button onClick={() => setIsEditing(!isEditing)} data-html2canvas-ignore="true" className={`absolute top-8 right-8 px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 z-50 transition-all shadow-xl border-2 ${isEditing ? 'bg-emerald-500 text-white border-emerald-400 hover:bg-emerald-600' : 'bg-white/90 text-[#0F0F12] border-gray-200 hover:bg-white'}`}>
          {isEditing ? <><CheckCircle2 size={16}/> GUARDAR TEXTO</> : <><PenTool size={16}/> EDITAR SLIDE</>}
        </button>
        <SlideSidebar index={slideIndex} total={totalSlides} title={<span dangerouslySetInnerHTML={{__html: title}}/>} icon={FileText} colorP={colorP} clientLogo={clientLogo} />
        <div className="flex-1 p-14 flex flex-col">
          <SectionPill icon={FileText} title={title.replace('<br/>', ' ')} colorP={colorP} />
          <div className="mt-10 flex-1 bg-red-50/30 rounded-3xl p-8 border border-red-100 shadow-sm flex flex-col">
            {isEditing ? (
              <textarea 
                className="flex-1 w-full bg-white border border-gray-300 rounded-2xl p-6 text-[22px] font-medium text-gray-800 outline-none resize-none leading-relaxed" 
                value={text} 
                onChange={e => setText(e.target.value)} 
              />
            ) : (
              <div className="flex-1 w-full bg-white rounded-2xl p-6 text-[22px] font-medium text-gray-800 leading-relaxed whitespace-pre-wrap overflow-hidden">
                {text}
              </div>
            )}
          </div>
        </div>
      </div>
    </SlideWrapper>
  );
}

function TopCampaignSlide({ campaign, brand, slideIndex, totalSlides, colorP, clientLogo }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: '', totalOpens: 0, totalClicks: 0, deliveries: 0, openRate: '0.0', clickRate: '0.0' });

  useEffect(() => {
    if (campaign) {
      setEditData({ title: campaign.title, totalOpens: campaign.totalOpens, totalClicks: campaign.totalClicks, deliveries: campaign.deliveries, openRate: campaign.openRate, clickRate: campaign.clickRate });
    }
  }, [campaign]);

  if (!campaign) {
    return (
      <SlideWrapper>
        <div className="pdf-slide relative flex overflow-hidden shrink-0 bg-white" style={{ width: '1280px', height: '720px' }}>
          <SlideSidebar index={slideIndex} total={totalSlides} title={<>Lo más<br/>relevante</>} icon={Target} colorP={colorP} clientLogo={clientLogo} />
          <div className="flex-1 bg-red-50/50 p-10 flex flex-col h-full items-center justify-center text-center">
            <div className="rounded-3xl px-12 py-8 mb-8 shadow-lg" style={{ backgroundColor: colorP }}><h1 className="text-[44px] font-black text-white">{brand}</h1></div>
            <div className="bg-white rounded-3xl p-12 shadow-sm border border-red-100"><p className="text-3xl font-bold text-gray-800 uppercase tracking-widest">No hay campañas enviadas<br/>en este periodo.</p></div>
          </div>
        </div>
      </SlideWrapper>
    );
  }

  return (
    <SlideWrapper>
      <div className="pdf-slide relative flex overflow-hidden shrink-0 bg-white" style={{ width: '1280px', height: '720px' }}>
        <button onClick={() => setIsEditing(!isEditing)} data-html2canvas-ignore="true" className={`absolute top-8 right-8 px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 z-50 transition-all shadow-xl border-2 ${isEditing ? 'bg-emerald-500 text-white border-emerald-400 hover:bg-emerald-600' : 'bg-white/90 text-[#0F0F12] border-gray-200 hover:bg-white'}`}>
          {isEditing ? <><CheckCircle2 size={16}/> GUARDAR DATOS</> : <><PenTool size={16}/> MODO EDICIÓN</>}
        </button>

        <SlideSidebar index={slideIndex} total={totalSlides} title={<>Lo más<br/>relevante</>} icon={Target} colorP={colorP} clientLogo={clientLogo} />

        <div className="w-[860px] shrink-0 bg-[#F8FAFC] p-10 flex flex-col h-full overflow-hidden">
          <div className="rounded-3xl px-8 py-5 mb-6 flex items-center justify-between shadow-lg w-full overflow-hidden shrink-0" style={{ backgroundColor: colorP }}>
            <div className="flex items-center gap-3 w-full min-w-0">
              <span className="bg-white/20 text-white font-black text-xs px-3.5 py-1.5 rounded-xl whitespace-nowrap uppercase shrink-0">{brand}</span>
              {isEditing ? <input type="text" className="text-[28px] font-black text-white bg-white/10 rounded-xl px-3 py-1 w-full outline-none min-w-0" value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} /> : <h1 className="text-[32px] font-black text-white truncate min-w-0 flex-1 leading-tight" title={editData.title}>{editData.title}</h1>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5 mb-6 shrink-0">
            <div className="bg-white rounded-3xl p-5 flex flex-col items-center text-center shadow-sm border border-gray-200">
              <span className="text-gray-500 text-lg font-bold mb-1">Aperturas Totales</span>
              {isEditing ? <input type="number" className="text-[40px] font-black text-[#0F0F12] text-center bg-gray-100 rounded-xl w-full outline-none mt-1" value={editData.totalOpens} onChange={e => setEditData({...editData, totalOpens: Number(e.target.value)})} /> : <span className="text-[56px] font-black text-[#0F0F12] leading-none">{editData.totalOpens}</span>}
            </div>
            <div className="bg-white rounded-3xl p-5 flex flex-col items-center text-center shadow-sm border border-gray-200">
              <span className="text-gray-500 text-lg font-bold mb-1">Clics Totales</span>
              {isEditing ? <input type="number" className="text-[40px] font-black text-[#0F0F12] text-center bg-gray-100 rounded-xl w-full outline-none mt-1" value={editData.totalClicks} onChange={e => setEditData({...editData, totalClicks: Number(e.target.value)})} /> : <span className="text-[56px] font-black text-[#0F0F12] leading-none">{editData.totalClicks}</span>}
            </div>
            <div className="bg-white rounded-3xl p-5 flex flex-col items-center text-center shadow-sm border border-gray-200">
              <span className="text-gray-500 text-lg font-bold mb-1">Entregas Totales</span>
              {isEditing ? <input type="number" className="text-[40px] font-black text-[#0F0F12] text-center bg-gray-100 rounded-xl w-full outline-none mt-1" value={editData.deliveries} onChange={e => setEditData({...editData, deliveries: Number(e.target.value)})} /> : <span className="text-[56px] font-black text-[#0F0F12] leading-none">{editData.deliveries}</span>}
            </div>
          </div>

          <div className="flex-1 grid grid-cols-3 gap-5 min-h-0">
            <div className="bg-white rounded-3xl p-5 flex flex-col items-center justify-between shadow-sm border border-gray-200 relative h-full">
              <div className="flex-1 flex items-center justify-center pt-1 relative w-full min-h-0">
                <ProgressRing percent={parseFloat(editData.openRate)} value={isEditing ? "" : `${editData.openRate}%`} label="" color={colorP} textColor="#0F0F12" track="#F1F5F9" size={130} strokeWidth={14} />
                {isEditing && <div className="absolute inset-0 flex items-center justify-center"><input type="number" step="0.1" className="w-20 py-1 text-center text-xl font-black text-[#0F0F12] bg-white rounded-lg outline-none shadow-md border-2" style={{ borderColor: colorP }} value={editData.openRate} onChange={e => setEditData({...editData, openRate: e.target.value})} /></div>}
              </div>
              <div className="border-l-4 pl-3 mt-2 w-full text-left shrink-0" style={{ borderColor: colorP }}><span className="block text-[#0F0F12] text-[18px] font-black uppercase leading-tight">Tasa de<br/>Apertura</span></div>
            </div>
            
            <div className="bg-white rounded-3xl p-5 flex flex-col items-center justify-between shadow-sm border border-gray-200 relative h-full">
              <div className="flex-1 flex items-center justify-center pt-1 relative w-full min-h-0">
                <ProgressRing percent={parseFloat(editData.clickRate)} value={isEditing ? "" : `${editData.clickRate}%`} label="" color={colorP} textColor="#0F0F12" track="#F1F5F9" size={130} strokeWidth={14} />
                {isEditing && <div className="absolute inset-0 flex items-center justify-center"><input type="number" step="0.1" className="w-20 py-1 text-center text-xl font-black text-[#0F0F12] bg-white rounded-lg outline-none shadow-md border-2" style={{ borderColor: colorP }} value={editData.clickRate} onChange={e => setEditData({...editData, clickRate: e.target.value})} /></div>}
              </div>
              <div className="border-l-4 pl-3 mt-2 w-full text-left shrink-0" style={{ borderColor: colorP }}><span className="block text-[#0F0F12] text-[18px] font-black uppercase leading-tight">Tasa de<br/>Clics</span></div>
            </div>

            <div className="rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden" style={{ backgroundColor: colorP }}>
              <span className="relative z-10 text-white text-lg font-medium mb-1">Nota con más clics</span>
              <span className="relative z-10 text-[72px] font-black text-white leading-none">N/A</span>
              <span className="relative z-10 text-white/50 text-[10px] mt-3 uppercase tracking-widest">*Dato extraíble desde GA4</span>
            </div>
          </div>
        </div>
      </div>
    </SlideWrapper>
  );
}

export default function AdminReports() {
  const { user, profile } = useAuth();
  
  // 🛡️ LÓGICA DE SEGURIDAD
  const roleIdNum = Number(profile?.role_id);
  const roleText = (profile?.internal_role || '').toLowerCase().trim();
  const isAdmin = profile?.is_admin === true || roleIdNum === 3 || roleText === 'admin';

  const [activeTab, setActiveTab] = useState<'pipeline' | 'presentacion'>('pipeline');
  const [isMainSidebarCollapsed, setIsMainSidebarCollapsed] = useState(false);

  const [requests, setRequests] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportingPDF, setExportingPDF] = useState(false);

  // FILTROS
  const [reportClientId, setReportClientId] = useState<string>('todos');
  const [startMonth, setStartMonth] = useState<string>(''); 
  const [endMonth, setEndMonth] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const [mailchimpStats, setMailchimpStats] = useState({ totalCampaignsAnalized: 0, totalEmailsSent: 0, openRate: 0, clickRate: 0, campaigns: [] as any[] });

  useEffect(() => { if (user?.id) fetchAdminReportData(); }, [user]);

  useEffect(() => {
    if (clients.length === 0) return; 
    const client = reportClientId === 'todos' ? { has_mailchimp: false, id: 'todos', name: 'Global' } : clients.find(c => c.id === reportClientId) || { has_mailchimp: false, id: null, name: '' };
    if (client.has_mailchimp && client.id) fetchMailchimpStats(client.id, client.name);
    else setMailchimpStats({ totalCampaignsAnalized: 0, totalEmailsSent: 0, openRate: 0, clickRate: 0, campaigns: [] });
  }, [reportClientId, startMonth, endMonth, clients]);

  const toggleMainAppSidebar = () => {
    setIsMainSidebarCollapsed(prev => !prev);
    const sidebarEl = document.querySelector('aside') || document.querySelector('.admin-sidebar') || document.querySelector('[class*="sidebar"]');
    if (sidebarEl) sidebarEl.classList.toggle('hidden');
    window.dispatchEvent(new CustomEvent('toggle-sidebar', { detail: !isMainSidebarCollapsed }));
  };

  const fetchMailchimpStats = async (orgId: string, orgName: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('mailchimp-metrics', { body: { startMonth, endMonth, organization_id: orgId, organization_name: orgName } });
      if (!error && data?.success && data?.metrics) setMailchimpStats({ ...data.metrics, campaigns: data.campaigns || [] });
      else setMailchimpStats({ totalCampaignsAnalized: 0, totalEmailsSent: 0, openRate: 0, clickRate: 0, campaigns: [] });
    } catch (err) { setMailchimpStats({ totalCampaignsAnalized: 0, totalEmailsSent: 0, openRate: 0, clickRate: 0, campaigns: [] }); }
  };

  const fetchAdminReportData = async () => {
    setLoading(true);
    try {
      let allowedOrgIds: string[] | null = null;

      if (!isAdmin) {
        const { data: myAssignedOrgs } = await supabase
          .from('organization_distribution_lists')
          .select('organization_id')
          .eq('profile_id', user!.id);
        
        allowedOrgIds = myAssignedOrgs?.map(item => item.organization_id) || [];
        
        if (allowedOrgIds.length === 0) {
           setClients([]);
           setRequests([]);
           setLoading(false);
           return;
        }
      }

      let orgsQuery = supabase.from('organizations').select('*').eq('is_active', true).order('name');
      if (allowedOrgIds) orgsQuery = orgsQuery.in('id', allowedOrgIds);
      
      const { data: orgs } = await orgsQuery;
      if (orgs) setClients(orgs);

      let reqsQuery = supabase
        .from('requests')
        .select(`
          *, 
          organizations(name, logo_url), 
          projects(name), 
          request_categories(name),
          organization_deliverables(name), 
          priorities(level, color_code), 
          file_extensions(extension), 
          request_tasks(discipline, status, updated_at, quantity, task_adjustments(origin), task_assignees(assigned_quantity, editing_hours, recording_hours, video_duration)), 
          requester:profiles!requests_requester_id_fkey(full_name)
        `)
        .eq('is_active', true) 
        .order('created_at', { ascending: false });

      if (allowedOrgIds) reqsQuery = reqsQuery.in('organization_id', allowedOrgIds);

      const { data: reqs } = await reqsQuery;
      setRequests(reqs || []);
    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleExportPDFSlides = async () => {
    setExportingPDF(true);
    try {
      const slides = document.querySelectorAll('.pdf-slide');
      if (slides.length === 0) {
        Swal.fire('Atención', 'No hay diapositivas para exportar.', 'info');
        setExportingPDF(false);
        return;
      }
      
      const PDFConstructor = typeof jsPDF === 'function' ? jsPDF : (jsPDF as any).jsPDF;
      const pdf = new PDFConstructor({ orientation: 'landscape', unit: 'px', format: [1280, 720] });

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i] as HTMLElement;
        const imgData = await toJpeg(slide, { 
          quality: 0.95, 
          pixelRatio: 2, 
          backgroundColor: '#FFFFFF', 
          width: 1280, 
          height: 720, 
          style: { width: '1280px', height: '720px', margin: '0', transform: 'none' }, 
          filter: (node) => { if (node instanceof HTMLElement && node.dataset.html2canvasIgnore === 'true') return false; return true; } 
        });
        if (i > 0) pdf.addPage([1280, 720], 'landscape');
        pdf.addImage(imgData, 'JPEG', 0, 0, 1280, 720, undefined, 'FAST');
      }
      const clientName = reportData.selectedClient?.name || 'Global';
      pdf.save(`Presentacion_Resultados_${clientName.replace(/\s+/g, '_')}.pdf`);
      Swal.fire({ title: '¡Presentación Lista!', text: 'Tu archivo en PDF se descargó perfectamente.', icon: 'success', timer: 2000, showConfirmButton: false });
    } catch (error: any) { 
      console.error("Error PDF:", error);
      Swal.fire({ title: 'Error de Render', text: `Hubo un detalle procesando las imágenes: ${error.message}`, icon: 'error', confirmButtonColor: '#D3002D' }); 
    } finally { 
      setExportingPDF(false); 
    }
  };

  const getClientSpecificData = () => {
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
      : clients.find(c => c.id === reportClientId) || { name: 'Reporte Especial', primary_color: '#D3002D', has_mailchimp: false };

    const clientNameClean = selectedClient.name.toLowerCase().replace(/\s+/g, '');
    const isBioPappel = clientNameClean.includes('biopappel');

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

    let totalEditingHours = 0; let totalSlides = 0; let totalVideos = 0; let totalGifs = 0; let totalPpts = 0;
    let totalTotems = 0; let totalGestiones = 0; let totalEnvios = 0; let totalPR = 0; let totalCopysExcatos = 0; 
    let priorityCounts = { alta: 0, media: 0, baja: 0 };
    let projectCounts: Record<string, number> = {}; let brandCounts: Record<string, number> = {};
    
    let specialtyMap: Record<string, number> = { 
      'Audiovisual': 0, 'Diseño': 0, 'Programación': 0, 'Contenido y estrategia': 0, 
      'Producción': 0, 'Staff': 0, 'RP': 0 
    };
    
    let strategyCount = 0;
    let totalDeliverablesCount = 0;
    let completedDeliverablesCount = 0;

    // 🔥 REGLA DE ORO DE CANTIDADES ESTRICTA 🔥
    clientData.forEach((req: any) => {
      const isCompleted = req.status === 'completado' || req.status === 'aprobado';
      
      let sumAssignees = 0;
      let assigneesByDisc: Record<string, number> = { 'Diseño': 0, 'Programación': 0, 'Audiovisual': 0, 'Contenido': 0, 'Producción': 0, 'Staff': 0, 'RP': 0 };
      
      if (req.request_tasks && Array.isArray(req.request_tasks)) {
         req.request_tasks.forEach((t: any) => {
            let disc = t.discipline?.toLowerCase() || '';
            let discKey = 'Diseño';
            if (disc === 'programación' || disc === 'programacion') discKey = 'Programación';
            else if (disc === 'audiovisual') discKey = 'Audiovisual';
            else if (disc === 'contenido') discKey = 'Contenido';
            else if (disc === 'producción' || disc === 'produccion') discKey = 'Producción';
            else if (disc === 'staff') discKey = 'Staff';
            else if (disc === 'relaciones públicas' || disc === 'rp') discKey = 'RP';

            if (t.task_assignees && Array.isArray(t.task_assignees)) {
               t.task_assignees.forEach((a: any) => {
                  let aq = Number(a.assigned_quantity) || 0;
                  sumAssignees += aq;
                  assigneesByDisc[discKey] += aq;
               });
            }
         });
      }

      let sumItemsBreakdown = 0;
      let itemsByDisc: Record<string, number> = { 'Diseño': 0, 'Programación': 0, 'Audiovisual': 0, 'Contenido': 0, 'Producción': 0, 'Staff': 0, 'RP': 0 };
      if (req.items_breakdown && Array.isArray(req.items_breakdown) && req.items_breakdown.length > 0) {
         req.items_breakdown.forEach((item: any) => {
            let q = Number(item.quantity) || 1;
            sumItemsBreakdown += q;
            if (item.needs_design) itemsByDisc['Diseño'] += q;
            if (item.needs_dev) itemsByDisc['Programación'] += q;
            if (item.needs_av) itemsByDisc['Audiovisual'] += q;
            if (item.needs_copy) itemsByDisc['Contenido'] += q;
            if (item.needs_prod) itemsByDisc['Producción'] += q;
            if (item.needs_staff) itemsByDisc['Staff'] += q;
            if (item.needs_rp) itemsByDisc['RP'] += q;
         });
      }

      let fallbackDisc: Record<string, number> = { 'Diseño': 0, 'Programación': 0, 'Audiovisual': 0, 'Contenido': 0, 'Producción': 0, 'Staff': 0, 'RP': 0 };
      let hasDiscipline = false;
      let q = Number(req.quantity) || 1;
      if (req.needs_design) { fallbackDisc['Diseño'] += q; hasDiscipline = true; }
      if (req.needs_dev) { fallbackDisc['Programación'] += q; hasDiscipline = true; }
      if (req.needs_av) { fallbackDisc['Audiovisual'] += q; hasDiscipline = true; }
      if (req.needs_copy) { fallbackDisc['Contenido'] += q; hasDiscipline = true; }
      if (req.needs_prod) { fallbackDisc['Producción'] += q; hasDiscipline = true; }
      if (req.needs_staff) { fallbackDisc['Staff'] += q; hasDiscipline = true; }
      if (req.needs_rp) { fallbackDisc['RP'] += q; hasDiscipline = true; }
      if (!hasDiscipline) { fallbackDisc['Diseño'] += q; }

      let finalRequestQty = 0;
      let discCounts: Record<string, number> = { 'Diseño': 0, 'Programación': 0, 'Audiovisual': 0, 'Contenido': 0, 'Producción': 0, 'Staff': 0, 'RP': 0 };

      if (sumAssignees > 0) {
         finalRequestQty = sumAssignees;
         discCounts = { ...assigneesByDisc };
      } else if (sumItemsBreakdown > 0) {
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
              specialtyMap['Contenido y estrategia'] += val;
              totalCopysExcatos += val;
           } else {
              specialtyMap[disc] += val;
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
          totalTotems += discCounts['Audiovisual'] > 0 ? discCounts['Audiovisual'] : finalRequestQty;
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
      clientData, selectedClient, totalRequests, completed, totalDeliverablesCount, completedDeliverablesCount, clientAdjustments, agencyAdjustments, 
      specialtyMap, totalEditingHours, totalSlides, totalVideos, totalGifs, totalPpts, priorityCounts, 
      topRecurrentProjects, topBrands, strategyCount, totalTotems, totalGestiones, totalEnvios, totalPR, isBioPappel, totalCopysExcatos 
    };
  };

  const reportData = getClientSpecificData();
  let cP = reportData.selectedClient.primary_color || '#D3002D';
  if (reportData.selectedClient.name?.toLowerCase().includes('novo')) {
      cP = '#42aaf5';
  }
  
  const isBioPappel = reportData.isBioPappel;
  const usaMailchimp = reportData.selectedClient.has_mailchimp === true;

  const findCampaign = (primaryKeyword: string, fallbackKeywords: string[]) => {
    if (!mailchimpStats.campaigns || mailchimpStats.campaigns.length === 0) return null;
    
    // Ignoramos los que digan "Resend:" para asegurar que traiga la campaña original principal
    const validCampaigns = mailchimpStats.campaigns.filter(c => !c.title.toLowerCase().includes('resend:'));

    const primaryMatch = validCampaigns.filter(c => (c.title + " " + c.subject).toLowerCase().includes(primaryKeyword.toLowerCase()));
    if (primaryMatch.length > 0) return primaryMatch.reduce((prev, curr) => (Number(curr.totalOpens) > Number(prev.totalOpens) ? curr : prev));
    
    const fallbackMatch = validCampaigns.filter(c => fallbackKeywords.some(k => (c.title + " " + c.subject).toLowerCase().includes(k.toLowerCase())));
    if (fallbackMatch.length > 0) return fallbackMatch.reduce((prev, curr) => (Number(curr.totalOpens) > Number(prev.totalOpens) ? curr : prev));
    
    return null;
  };

  const topApisNews = findCampaign('apis', ['apis news']);
  const topCheckInn = findCampaign('hemofilia', ['check', 'comunicado', 'paty']);

  const topCampaignsRenderList = [
    { brand: 'APIS News', data: topApisNews },
    { brand: 'Check-INN', data: topCheckInn }
  ];

  const ITEMS_PER_TABLE = 8;
  const chunkedCampaigns = [];
  if (mailchimpStats.campaigns && mailchimpStats.campaigns.length > 0) {
    for (let i = 0; i < mailchimpStats.campaigns.length; i += ITEMS_PER_TABLE) {
      chunkedCampaigns.push(mailchimpStats.campaigns.slice(i, i + ITEMS_PER_TABLE));
    }
  }

  const validTopCampaigns = topCampaignsRenderList.filter(t => t.data !== null && reportData.selectedClient.name.toLowerCase().includes('novo'));

  let totalDynamicSlides = 1; 
  if (reportData.specialtyMap['Audiovisual'] > 0) totalDynamicSlides++;
  if (reportData.specialtyMap['Diseño'] > 0) totalDynamicSlides++;
  if (reportData.specialtyMap['Programación'] > 0) totalDynamicSlides++;
  if (reportData.specialtyMap['Contenido y estrategia'] > 0) totalDynamicSlides++;
  if (reportData.specialtyMap['Producción'] > 0) totalDynamicSlides++;
  if (reportData.specialtyMap['Staff'] > 0) totalDynamicSlides++;
  if (reportData.totalPR > 0) totalDynamicSlides++; 
  
  totalDynamicSlides += 1; 
  totalDynamicSlides += 1; 
  if (isBioPappel) totalDynamicSlides++; 
  if (usaMailchimp) {
    totalDynamicSlides += 1; 
    totalDynamicSlides += chunkedCampaigns.length; 
    totalDynamicSlides += validTopCampaigns.length; 
  }
  totalDynamicSlides += 2; 

  const TOTAL_SLIDES = totalDynamicSlides;
  let slideNum = 1;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: cP, borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  const formatMonthLabel = (yyyyMM: string) => {
    if (!yyyyMM) return '';
    const [year, month] = yyyyMM.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
  };

  const getPeriodLabel = () => {
    if (startMonth && endMonth) {
      if (startMonth === endMonth) return formatMonthLabel(startMonth);
      return `${formatMonthLabel(startMonth)} a ${formatMonthLabel(endMonth)}`;
    } else if (startMonth) return `Desde ${formatMonthLabel(startMonth)}`;
    else if (endMonth) return `Hasta ${formatMonthLabel(endMonth)}`;
    return 'Histórico Completo';
  };

  // 🔥 EXPORTADOR EXCEL VIP "SMART COLUMNS" ACTUALIZADO 🔥
  const exportToPremiumReport = (dataToExport: any[], clientName: string) => {
    if (dataToExport.length === 0) {
      Swal.fire({ title: 'Sin Datos', text: 'No hay solicitudes para exportar con estos filtros.', icon: 'info', confirmButtonColor: '#D3002D' });
      return;
    }

    const norm = (s: string) => (s || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

    const hasDisc = (req: any, disc: string) => (req._calculated_disciplines?.[disc] || 0) > 0;

    const hasDesign = dataToExport.some(req => hasDisc(req, 'Diseño'));
    const hasDev = dataToExport.some(req => hasDisc(req, 'Programación'));
    const hasAv = dataToExport.some(req => hasDisc(req, 'Audiovisual'));
    const hasCopy = dataToExport.some(req => hasDisc(req, 'Contenido'));
    const hasProd = dataToExport.some(req => hasDisc(req, 'Producción'));
    const hasStaff = dataToExport.some(req => hasDisc(req, 'Staff'));
    const hasRp = dataToExport.some(req => hasDisc(req, 'RP'));

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

    // Extrae exactamente el texto y cantidad basándose en la bandera lógica real del item
    const getDelivs = (req: any, disc: string, isNeeded: boolean) => {
      if (!isNeeded || !req._calculated_disciplines) return '-';
      const totalQtyForDisc = req._calculated_disciplines[disc] || 0;
      if (totalQtyForDisc === 0) return '-';
      
      let breakdown = req.items_breakdown;
      if (typeof breakdown === 'string') {
        try { breakdown = JSON.parse(breakdown); } catch (e) { breakdown = []; }
      }
      
      if (breakdown && Array.isArray(breakdown) && breakdown.length > 0) {
        let flag = '';
        if (disc === 'Diseño') flag = 'needs_design';
        else if (disc === 'Programación') flag = 'needs_dev';
        else if (disc === 'Audiovisual') flag = 'needs_av';
        else if (disc === 'Contenido') flag = 'needs_copy';
        else if (disc === 'Producción') flag = 'needs_prod';
        else if (disc === 'Staff') flag = 'needs_staff';
        else if (disc === 'RP') flag = 'needs_rp';

        const items = breakdown.filter((i: any) => i[flag] === true);
        if (items.length > 0) {
          if (items.length === 1) {
             return `${items[0].quantity || 1}x ${items[0].name || items[0].label}`;
          }
          return items.map((i:any) => `${i.quantity || 1}x ${i.name || i.label}`).join(' | ');
        }
      }

      // Fallback
      const task = req.request_tasks?.find((t: any) => norm(t.discipline) === norm(disc));
      let fallbackName = req.title || 'Pieza';
      
      if (task?.task_adjustments?.length > 0) {
         fallbackName += ' (Ajustado)';
      }
      
      return `${totalQtyForDisc}x ${fallbackName}`;
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
              ${reportData.selectedClient?.logo_url ? `<img src="${reportData.selectedClient.logo_url}" height="50" style="margin-top: 10px;" />` : ''}
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

          ${hasDesign ? `<td class="${hasDisc(req, 'Diseño') ? 'disc-yes' : 'disc-no'}">${hasDisc(req, 'Diseño') ? 'SÍ' : 'NO'}</td>
          <td>${getDelivs(req, 'Diseño', hasDisc(req, 'Diseño'))}</td>` : ''}

          ${hasDev ? `<td class="${hasDisc(req, 'Programación') ? 'disc-yes' : 'disc-no'}">${hasDisc(req, 'Programación') ? 'SÍ' : 'NO'}</td>
          <td>${getDelivs(req, 'Programación', hasDisc(req, 'Programación'))}</td>` : ''}

          ${hasAv ? `<td class="${hasDisc(req, 'Audiovisual') ? 'disc-yes' : 'disc-no'}">${hasDisc(req, 'Audiovisual') ? 'SÍ' : 'NO'}</td>
          <td>${getDelivs(req, 'Audiovisual', hasDisc(req, 'Audiovisual'))}</td>
          <td style="text-align: center; font-weight: 900; color: #047857; background-color: #ecfdf5;">${hasDisc(req, 'Audiovisual') ? avMetricsInfo.dur : '-'}</td>` : ''}

          ${hasCopy ? `<td class="${hasDisc(req, 'Contenido') ? 'disc-yes' : 'disc-no'}">${hasDisc(req, 'Contenido') ? 'SÍ' : 'NO'}</td>
          <td>${getDelivs(req, 'Contenido', hasDisc(req, 'Contenido'))}</td>` : ''}

          ${hasProd ? `<td class="${hasDisc(req, 'Producción') ? 'disc-yes' : 'disc-no'}">${hasDisc(req, 'Producción') ? 'SÍ' : 'NO'}</td>
          <td>${getDelivs(req, 'Producción', hasDisc(req, 'Producción'))}</td>` : ''}

          ${hasStaff ? `<td class="${hasDisc(req, 'Staff') ? 'disc-yes' : 'disc-no'}">${hasDisc(req, 'Staff') ? 'SÍ' : 'NO'}</td>
          <td>${getDelivs(req, 'Staff', hasDisc(req, 'Staff'))}</td>` : ''}

          ${hasRp ? `<td class="${hasDisc(req, 'RP') ? 'disc-yes' : 'disc-no'}">${hasDisc(req, 'RP') ? 'SÍ' : 'NO'}</td>
          <td>${getDelivs(req, 'RP', hasDisc(req, 'RP'))}</td>` : ''}

          <td style="text-align: center; font-weight: 900; font-size: 12px; background-color: #fef2f2; color: #D3002D;">${req._final_request_qty || 1}</td>
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
    link.setAttribute("download", `Reporte_${clientName.replace(/\s+/g, '_')}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeColor = (status: string) => {
    if (['completado', 'aprobado'].includes(status)) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (['con_correcciones'].includes(status)) return 'bg-rose-100 text-rose-800 border-rose-300';
    if (['en_proceso'].includes(status)) return 'bg-red-50 text-luxury-red border-red-200';
    return 'bg-amber-100 text-amber-800 border-amber-300';
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12 font-sans w-full relative overflow-x-hidden">

      {/* 📌 BOTÓN FLOTANTE LATERAL PARA OCULTAR / MOSTRAR SIDEBAR GENERAL DEL SISTEMA */}
      <button
        onClick={toggleMainAppSidebar}
        className="absolute left-0 top-[260px] -translate-x-1/2 z-[999] bg-white border border-gray-200 text-gray-600 hover:text-luxury-red p-2.5 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center hover:scale-105"
        title={isMainSidebarCollapsed ? "Mostrar menú principal" : "Ocultar menú principal"}
        data-html2canvas-ignore="true"
      >
        <PanelLeft size={16} />
      </button>

      {/* 📌 BARRA DE CONTROLES: TABS EN FILA 1 + FILTROS UNIFICADOS EN FILA 2 */}
      <div className="px-4 py-3.5 w-full border-b border-gray-200 bg-white sticky top-0 z-40 shadow-sm flex flex-col gap-3" data-html2canvas-ignore="true">
        
        {/* FILA 1: PESTAÑAS (PIPELINE / PRESENTACIÓN) Y EXPORTACIONES EXCLUSIVAS */}
        <div className="flex items-center justify-between w-full">
          
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200 shrink-0">
            <button 
              onClick={() => setActiveTab('pipeline')}
              className={`px-4 py-2 rounded-lg font-black text-[11px] uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'pipeline' ? 'bg-[#D3002D] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Layout size={14} /> Pipeline
            </button>
            <button 
              onClick={() => setActiveTab('presentacion')}
              className={`px-4 py-2 rounded-lg font-black text-[11px] uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'presentacion' ? 'bg-[#D3002D] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Presentation size={14} /> Presentación
            </button>
          </div>

          {/* EXPORTACIÓN EXCLUSIVA DE ACUERDO A LA PESTAÑA */}
          <div className="shrink-0 mr-14 md:mr-16">
            {activeTab === 'pipeline' ? (
              <button onClick={() => exportToPremiumReport(reportData.clientData, reportData.selectedClient.name)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-black text-[11px] flex items-center gap-2 uppercase tracking-wider transition-all shadow-sm cursor-pointer">
                <Download size={14} strokeWidth={2.5}/> Excel
              </button>
            ) : (
              <button onClick={handleExportPDFSlides} disabled={exportingPDF} className="bg-[#D3002D] hover:bg-red-700 text-white px-5 py-2 rounded-xl font-black text-[11px] flex items-center gap-2 uppercase tracking-wider transition-all shadow-sm cursor-pointer disabled:opacity-50">
                <Printer size={14} strokeWidth={2.5}/> {exportingPDF ? 'Procesando...' : 'Exportar en PDF'}
              </button>
            )}
          </div>
        </div>

        {/* FILA 2: FILTROS UNIFICADOS (SE ACOMODAN LIMPIOS SIN ROTURAS) */}
        <div className="flex flex-wrap items-center gap-2.5 w-full pt-1 border-t border-gray-100">
          
          {/* RANGO DE MESES */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-[11px] font-bold shadow-sm">
            <CalendarDays size={14} style={{ color: cP }} />
            <span className="text-[10px] text-gray-400 font-extrabold uppercase">DE:</span>
            <input type="month" value={startMonth} onChange={e => setStartMonth(e.target.value)} className="bg-transparent font-extrabold text-gray-800 outline-none cursor-pointer uppercase" />
            <span className="text-[10px] text-gray-400 font-extrabold uppercase ml-1">A:</span>
            <input type="month" value={endMonth} onChange={e => setEndMonth(e.target.value)} className="bg-transparent font-extrabold text-gray-800 outline-none cursor-pointer uppercase" />
          </div>

          {/* ORDEN CRONOLÓGICO */}
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
            <select value={sortOrder} onChange={e => setSortOrder(e.target.value as 'desc' | 'asc')} className="bg-gray-50 border border-gray-200 rounded-xl py-2 pl-8 pr-4 text-[11px] font-extrabold text-gray-700 outline-none cursor-pointer uppercase shadow-sm">
              <option value="desc">MÁS RECIENTES</option>
              <option value="asc">MÁS ANTIGUOS</option>
            </select>
          </div>

          {/* ESTATUS */}
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-[11px] font-extrabold text-gray-700 outline-none cursor-pointer uppercase shadow-sm truncate max-w-[200px]">
            <option value="todos">TODOS LOS ESTATUS</option>
            <option value="activos">SOLO ACTIVOS</option>
            <option value="completados">SOLO COMPLETADOS</option>
            <option value="pendiente">PENDIENTES</option>
            <option value="en_proceso">EN PROCESO</option>
            <option value="en_revision_cliente">EN REVISIÓN CLIENTE</option>
          </select>

          {/* MARCA / CLIENTE */}
          <select value={reportClientId} onChange={e => setReportClientId(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-[11px] font-extrabold text-gray-800 outline-none cursor-pointer uppercase truncate max-w-[200px] shadow-sm">
            <option value="todos">{isAdmin ? 'TODAS LAS MARCAS' : 'MIS CUENTAS'}</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

        </div>
      </div>

      {/* ========================================================== */}
      {/* PESTAÑA 1: PIPELINE OPERATIVO */}
      {/* ========================================================== */}
      {activeTab === 'pipeline' && (
        <div className="px-4 sm:px-6 md:px-10 pt-8 space-y-8 animate-in fade-in duration-300">
          
          {/* BANNER MARCA TOLKO */}
          <div 
            className="w-full min-h-[14rem] rounded-3xl overflow-hidden relative shadow-xl flex flex-col justify-end p-8 border border-gray-200"
            style={{
              backgroundImage: reportData.selectedClient.banner_url 
                ? `linear-gradient(to right, rgba(15,15,18,0.95) 0%, rgba(15,15,18,0.6) 50%, rgba(15,15,18,0.2) 100%), url(${reportData.selectedClient.banner_url})` 
                : 'linear-gradient(to right, #0F0F12, #1F1F2E)',
              backgroundSize: 'cover', backgroundPosition: 'center'
            }}
          >
            {reportData.selectedClient.logo_url && (
              <img src={reportData.selectedClient.logo_url} alt="Logo" className="absolute top-6 right-8 w-20 h-20 object-contain drop-shadow-2xl" />
            )}
            <div className="relative z-10">
              <p className="text-[10px] text-white/70 uppercase tracking-[0.3em] font-bold mb-1 flex items-center gap-2">
                Consola de Seguimiento Operativo 
                <span className="bg-luxury-red px-2.5 py-0.5 rounded text-white font-black">{getPeriodLabel()}</span>
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                {reportData.selectedClient.name}
              </h1>
            </div>
          </div>

          {/* TARJETAS KPI OPERATIVAS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Layers size={16} className="text-luxury-red"/><span className="text-[10px] font-black uppercase tracking-widest">Total Solicitudes</span>
              </div>
              <p className="text-3xl font-black text-gray-900">{reportData.totalRequests}</p>
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <CheckCircle2 size={16} className="text-emerald-500"/><span className="text-[10px] font-black uppercase tracking-widest">Completadas</span>
              </div>
              <p className="text-3xl font-black text-gray-900">{reportData.completed}</p>
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <UserCheck size={16} className="text-orange-500"/><span className="text-[10px] font-black uppercase tracking-widest">Ajustes Cliente</span>
              </div>
              <p className="text-3xl font-black text-orange-600">{reportData.clientAdjustments}</p>
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <RefreshCw size={16} className="text-purple-600"/><span className="text-[10px] font-black uppercase tracking-widest">Ajustes Agencia</span>
              </div>
              <p className="text-3xl font-black text-purple-600">{reportData.agencyAdjustments}</p>
            </div>
          </div>

          {/* RESUMEN POR DISCIPLINAS */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4 flex items-center gap-2">
              <BarChart3 size={16} style={{ color: cP }} /> Carga por Especialidad
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-red-50/50 p-4 rounded-2xl text-center border border-red-100">
                <span className="text-xs text-gray-500 font-bold uppercase block">Audiovisual</span>
                <span className="text-2xl font-black text-luxury-red">{reportData.specialtyMap['Audiovisual']}</span>
              </div>
              <div className="bg-red-50/50 p-4 rounded-2xl text-center border border-red-100">
                <span className="text-xs text-gray-500 font-bold uppercase block">Diseño Gráfico</span>
                <span className="text-2xl font-black text-luxury-red">{reportData.specialtyMap['Diseño']}</span>
              </div>
              <div className="bg-red-50/50 p-4 rounded-2xl text-center border border-red-100">
                <span className="text-xs text-gray-500 font-bold uppercase block">Programación</span>
                <span className="text-2xl font-black text-luxury-red">{reportData.specialtyMap['Programación']}</span>
              </div>
              <div className="bg-red-50/50 p-4 rounded-2xl text-center border border-red-100">
                <span className="text-xs text-gray-500 font-bold uppercase block">Contenido</span>
                <span className="text-2xl font-black text-luxury-red">{reportData.specialtyMap['Contenido y estrategia']}</span>
              </div>
            </div>
          </div>

          {/* TABLA DE SOLICITUDES DEL PIPELINE */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2 pl-1">
              <FileText size={16} style={{ color: cP }}/> Historial Filtrado de Solicitudes ({reportData.clientData.length})
            </h3>

            <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0F0F12] text-white uppercase font-black text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">ID Ticket</th>
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Solicitante</th>
                      <th className="p-4">Proyecto / Tablero</th>
                      <th className="p-4">Título</th>
                      <th className="p-4">Fecha</th>
                      <th className="p-4">Deadline</th>
                      <th className="p-4 text-center">Prioridad</th>
                      <th className="p-4 text-center">Estatus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {reportData.clientData.map((req: any) => (
                      <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-black text-gray-900">#{req.id.slice(-6).toUpperCase()}</td>
                        <td className="p-4 font-bold">{req.organizations?.name || 'N/A'}</td>
                        <td className="p-4 text-gray-600">{req.requester?.full_name || 'N/A'}</td>
                        <td className="p-4 text-gray-600">{req.projects?.name || 'N/A'}</td>
                        <td className="p-4 font-bold text-gray-900">{req.title || 'N/A'}</td>
                        <td className="p-4 text-gray-500">{req.request_date || req.created_at?.split('T')[0] || 'S/F'}</td>
                        <td className="p-4 font-bold text-gray-700">{req.due_date || 'S/F'}</td>
                        <td className="p-4 text-center">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-gray-100 text-gray-800">
                            {req.priorities?.level || 'Normal'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusBadgeColor(req.status)}`}>
                            {req.status?.replace(/_/g, ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {reportData.clientData.length === 0 && (
                      <tr>
                        <td colSpan={9} className="p-12 text-center text-gray-400 uppercase font-black text-xs">
                          No hay registros con los filtros seleccionados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================== */}
      {/* PESTAÑA 2: MODO PRESENTACIÓN (SLIDES 16:9 REESCALADAS) */}
      {/* ========================================================== */}
      {activeTab === 'presentacion' && (
        <div className="w-full overflow-x-auto py-8 animate-in fade-in duration-300">
          <div className="flex flex-col gap-8 w-max mx-auto px-6">
            
            {/* SLIDE 1: PORTADA */}
            <SlideWrapper>
              <div className="pdf-slide relative flex flex-col overflow-hidden shrink-0 bg-gradient-to-br from-[#0F0F12] via-[#1F1F2E] to-[#0F0F12] w-[1280px] h-[720px]">
                <div className="absolute -right-36 -top-36 w-[560px] h-[560px] rounded-full border-[44px] border-white/[0.04]"></div>
                <div className="absolute -right-6 top-44 w-64 h-64 rounded-full border-[22px]" style={{ borderColor: `${cP}1A` }}></div>
                <div className="relative z-10 flex justify-between items-start px-16 pt-14">
                  
                  <div className="inline-flex items-center gap-4 bg-white/10 border border-white/15 rounded-full px-6 py-3 w-fit backdrop-blur-md shadow-lg">
                     <img 
                       src={tolkoLogo} 
                       alt="Tolko" 
                       className="h-6 w-auto object-contain opacity-90 drop-shadow-sm" 
                     />
                    <span className="text-white/80 text-xs font-black uppercase tracking-[0.25em] border-l border-white/20 pl-4">Consola de Resultados</span>
                  </div>

                  {reportData.selectedClient.logo_url && (
                    <img 
                      src={reportData.selectedClient.logo_url} 
                      className="max-w-[180px] max-h-[90px] object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
                      crossOrigin="anonymous" 
                    />
                  )}
                </div>
                <div className="relative z-10 px-16 mt-14 flex-1 flex flex-col justify-center">
                  <h1 className="text-[86px] leading-[0.95] font-black text-white uppercase tracking-tight text-center">
                    Impacto y <span style={{ color: cP }}>Resultados</span>
                  </h1>
                  <div className="flex items-center justify-center gap-3 mt-8">
                    <div className="px-6 py-3 rounded-xl" style={{ backgroundColor: cP }}><span className="text-white font-black text-xl uppercase tracking-wide">{reportData.selectedClient.name}</span></div>
                    <div className="bg-white/10 border border-white/15 px-6 py-3 rounded-xl"><span className="text-white/80 font-bold text-xl uppercase tracking-wide">{getPeriodLabel()}</span></div>
                  </div>
                </div>
                <div className="relative z-10 px-16 pb-14 grid grid-cols-3 gap-8 max-w-[1100px] mx-auto w-full">
                  <div className="bg-white/[0.07] backdrop-blur border border-white/10 rounded-3xl p-6 flex flex-col items-center text-center shadow-lg">
                    <Target size={32} className="mb-4" style={{ color: cP }} strokeWidth={2.5} />
                    <EditableBigNumber value={reportData.totalRequests} className="text-[64px] font-black text-white leading-none mb-2" />
                    <p className="text-white/60 text-xs font-black uppercase tracking-[0.2em]">Solicitudes Totales</p>
                  </div>
                  <div className="bg-white/[0.07] backdrop-blur border border-white/10 rounded-3xl p-6 flex flex-col items-center text-center shadow-lg">
                    <CheckCircle2 size={32} className="text-emerald-400 mb-4" strokeWidth={2.5} />
                    <EditableBigNumber value={reportData.completed} className="text-[64px] font-black text-emerald-400 leading-none mb-2" />
                    <p className="text-white/60 text-xs font-black uppercase tracking-[0.2em]">Solicitudes Entregadas</p>
                  </div>
                  <div className="bg-white/[0.07] backdrop-blur border border-white/10 rounded-3xl p-6 flex flex-col items-center text-center shadow-lg">
                    <CheckCircle2 size={32} className="mb-4" style={{ color: cP }} strokeWidth={2.5} />
                    <EditableBigNumber value={reportData.totalDeliverablesCount} className="text-[64px] font-black leading-none mb-2" style={{ color: cP }} />
                    <p className="text-white/60 text-xs font-black uppercase tracking-[0.2em]">Entregables Producidos</p>
                  </div>
                </div>
              </div>
            </SlideWrapper>

            {/* SLIDE: AUDIOVISUAL */}
            {reportData.specialtyMap['Audiovisual'] > 0 && (
              <SlideWrapper>
                <div className="pdf-slide relative flex overflow-hidden shrink-0 bg-white w-[1280px] h-[720px]">
                  <SlideSidebar index={++slideNum} total={TOTAL_SLIDES} icon={BarChart3} title={<>Métricas<br />Generales</>} colorP={cP} clientLogo={reportData.selectedClient.logo_url} />
                  <div className="flex-1 p-14 flex flex-col">
                    <SectionPill icon={Video} title="Audiovisual" colorP={cP} />
                    <div className="mt-10 flex-1 bg-red-50/30 rounded-3xl flex items-center justify-center gap-20 px-12 border border-red-100">
                      <ProgressRing percent={100} value={reportData.specialtyMap['Audiovisual']} label="Producción Audiovisual" color={cP} track="#FEE2E2" size={280} strokeWidth={22} />
                      <div className="max-w-sm">
                        <p className="text-2xl text-gray-400 font-black uppercase tracking-widest mb-4">Piezas Producidas</p>
                        <EditableBigNumber value={reportData.specialtyMap['Audiovisual']} className="text-7xl font-black text-[#0F0F12] leading-none mb-6" />
                        <p className="text-lg text-gray-500 font-medium leading-relaxed">Entregables de video, animaciones y motion graphics.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SlideWrapper>
            )}

            {/* SLIDE: DISEÑO */}
            {reportData.specialtyMap['Diseño'] > 0 && (
              <SlideWrapper>
                <div className="pdf-slide relative flex overflow-hidden shrink-0 bg-white w-[1280px] h-[720px]">
                  <SlideSidebar index={++slideNum} total={TOTAL_SLIDES} icon={BarChart3} title={<>Métricas<br />Generales</>} colorP={cP} clientLogo={reportData.selectedClient.logo_url} />
                  <div className="flex-1 p-14 flex flex-col">
                    <SectionPill icon={PenTool} title="Diseño Gráfico" colorP={cP} />
                    <div className="mt-10 flex-1 bg-red-50/30 rounded-3xl p-8 grid grid-cols-4 gap-6 border border-red-100">
                      {isBioPappel ? (
                        <MetricCard icon={Copy} value={reportData.specialtyMap['Contenido y estrategia']} label="Entregables de Texto" accent={cP} />
                      ) : (
                        <MetricCard icon={Presentation} value={reportData.totalPpts} label="Presentaciones" accent={cP} />
                      )}
                      <MetricCard icon={LayoutTemplate} value={reportData.totalSlides} label="Slides Diseñados" accent={cP} />
                      <MetricCard icon={Sparkles} value={Math.max(0, reportData.specialtyMap['Diseño'] - reportData.totalSlides)} label="Artes / Diseños" accent="#0F0F12" />
                      <MetricCard icon={Target} value={reportData.specialtyMap['Diseño']} label="Total General" accent="#10B981" />
                    </div>
                  </div>
                </div>
              </SlideWrapper>
            )}

            {/* SLIDE: PROGRAMACIÓN */}
            {reportData.specialtyMap['Programación'] > 0 && (
              <SlideWrapper>
                <div className="pdf-slide relative flex overflow-hidden shrink-0 bg-white w-[1280px] h-[720px]">
                  <SlideSidebar index={++slideNum} total={TOTAL_SLIDES} icon={BarChart3} title={<>Métricas<br />Generales</>} colorP={cP} clientLogo={reportData.selectedClient.logo_url} />
                  <div className="flex-1 p-14 flex flex-col">
                    <SectionPill icon={MonitorPlay} title="Programación" colorP={cP} />
                    <div className="mt-10 flex-1 bg-red-50/30 rounded-3xl flex items-center justify-center gap-20 px-12 border border-red-100">
                      <ProgressRing percent={(reportData.specialtyMap['Programación'] / Math.max(1, reportData.totalRequests)) * 100} value={reportData.specialtyMap['Programación']} label="HTML / Desarrollos" color={cP} track="#FEE2E2" size={280} strokeWidth={22} />
                      <div className="max-w-sm">
                        <p className="text-2xl text-gray-400 font-black uppercase tracking-widest mb-4">Programación</p>
                        <EditableBigNumber value={reportData.specialtyMap['Programación']} className="text-7xl font-black text-[#0F0F12] leading-none mb-6" />
                        <p className="text-lg text-gray-500 font-medium leading-relaxed">Entregables procesados de código e integración.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SlideWrapper>
            )}

            {/* SLIDE: CONTENIDO Y ESTRATEGIA */}
            {reportData.specialtyMap['Contenido y estrategia'] > 0 && (
              <SlideWrapper>
                <div className="pdf-slide relative flex overflow-hidden shrink-0 bg-white w-[1280px] h-[720px]">
                  <SlideSidebar index={++slideNum} total={TOTAL_SLIDES} icon={BarChart3} title={<>Métricas<br />Generales</>} colorP={cP} clientLogo={reportData.selectedClient.logo_url} />
                  <div className="flex-1 p-14 flex flex-col">
                    <SectionPill icon={LayoutTemplate} title="Contenido y Estrategia" colorP={cP} />
                    <div className="mt-10 flex-1 grid grid-cols-2 gap-6">
                      <div className="bg-red-50/30 border border-red-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${cP}1A` }}><Copy size={26} style={{ color: cP }} strokeWidth={2.5} /></div>
                        <EditableBigNumber value={reportData.specialtyMap['Contenido y estrategia']} className="text-[110px] font-black leading-none mb-4" style={{ color: cP }} />
                        <span className="text-xl text-gray-500 font-bold uppercase tracking-widest">Copys & Textos</span>
                      </div>
                      <div className="bg-red-50/30 border border-red-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                        <div className="w-14 h-14 rounded-2xl bg-[#0F0F12]/10 flex items-center justify-center mb-6"><Flag size={26} className="text-[#0F0F12]" strokeWidth={2.5} /></div>
                        <EditableBigNumber value={reportData.strategyCount} className="text-[110px] font-black text-[#0F0F12] leading-none mb-4" />
                        <span className="text-xl text-gray-500 font-bold uppercase tracking-widest">Estrategia y Conceptos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SlideWrapper>
            )}

            {/* SLIDE: PRODUCCIÓN */}
            {reportData.specialtyMap['Producción'] > 0 && (
              <SlideWrapper>
                <div className="pdf-slide relative flex overflow-hidden shrink-0 bg-white w-[1280px] h-[720px]">
                  <SlideSidebar index={++slideNum} total={TOTAL_SLIDES} icon={BarChart3} title={<>Métricas<br />Producción</>} colorP={cP} clientLogo={reportData.selectedClient.logo_url} />
                  <div className="flex-1 p-14 flex flex-col">
                    <SectionPill icon={Package} title="Producción y Logística" colorP={cP} />
                    <div className="mt-10 flex-1 bg-red-50/30 rounded-3xl p-8 grid grid-cols-2 gap-6 border border-red-100">
                      <MetricCard icon={Package} value={reportData.specialtyMap['Producción']} label="Materiales Producidos" accent={cP} />
                      <MetricCard icon={Target} value={reportData.completed} label="Entregas Exitosas" accent="#0F0F12" />
                    </div>
                  </div>
                </div>
              </SlideWrapper>
            )}

            {/* SLIDE: STAFF Y APOYO */}
            {reportData.specialtyMap['Staff'] > 0 && (
              <SlideWrapper>
                <div className="pdf-slide relative flex overflow-hidden shrink-0 bg-white w-[1280px] h-[720px]">
                  <SlideSidebar index={++slideNum} total={TOTAL_SLIDES} icon={BarChart3} title={<>Métricas<br />Staff</>} colorP={cP} clientLogo={reportData.selectedClient.logo_url} />
                  <div className="flex-1 p-14 flex flex-col">
                    <SectionPill icon={UserCheck} title="Staff y Apoyo" colorP={cP} />
                    <div className="mt-10 flex-1 bg-red-50/30 rounded-3xl p-8 grid grid-cols-2 gap-6 border border-red-100">
                      <MetricCard icon={UserCheck} value={reportData.specialtyMap['Staff']} label="Asignaciones de Staff" accent={cP} />
                      <MetricCard icon={CalendarDays} value={reportData.totalRequests} label="Eventos / Apoyos Totales" accent="#0F0F12" />
                    </div>
                  </div>
                </div>
              </SlideWrapper>
            )}

            {/* DIAPOSITIVA: RELACIONES PÚBLICAS */}
            {reportData.totalPR > 0 && (
              <SlideWrapper>
                <div className="pdf-slide relative flex overflow-hidden shrink-0 bg-white w-[1280px] h-[720px]">
                  <SlideSidebar index={++slideNum} total={TOTAL_SLIDES} icon={Megaphone} title={<>Impacto<br />PR</>} colorP={cP} clientLogo={reportData.selectedClient.logo_url} />
                  <div className="flex-1 p-14 flex flex-col">
                    <SectionPill icon={Target} title="Relaciones Públicas" colorP={cP} />
                    <div className="mt-10 flex-1 bg-red-50/30 border border-red-100 rounded-3xl p-8 grid grid-cols-4 gap-6">
                      <MetricCard icon={Megaphone} value={reportData.totalPR} label="Acciones de PR" accent={cP} />
                      <MetricCard icon={Flag} value={reportData.totalGestiones} label="Gestiones" accent="#F59E0B" />
                      <MetricCard icon={Send} value={reportData.totalEnvios} label="Envíos / Kits" accent="#10B981" />
                      <MetricCard icon={Award} value={reportData.totalPR} label="Entregables Completados" accent="#0F0F12" />
                    </div>
                  </div>
                </div>
              </SlideWrapper>
            )}

            {/* SLIDE: PRIORIDADES */}
            <SlideWrapper>
              <div className="pdf-slide relative flex overflow-hidden shrink-0 bg-white w-[1280px] h-[720px]">
                <SlideSidebar index={++slideNum} total={TOTAL_SLIDES} icon={ShieldCheck} title="Prioridades" colorP={cP} clientLogo={reportData.selectedClient.logo_url} />
                <div className="flex-1 p-14 flex flex-col">
                  <SectionPill icon={AlertCircle} title="Distribución por Nivel" colorP={cP} />
                  <div className="mt-10 flex-1 bg-red-50/30 border border-red-100 rounded-3xl flex items-center justify-around px-10">
                    <div className="flex flex-col items-center gap-6"><ProgressRing percent={(reportData.priorityCounts.alta / Math.max(1, reportData.totalRequests)) * 100} value={reportData.priorityCounts.alta} label="Prioridad Alta" color="#DC2626" track="#F8D2D2" size={218} strokeWidth={18} /></div>
                    <div className="flex flex-col items-center gap-6"><ProgressRing percent={(reportData.priorityCounts.media / Math.max(1, reportData.totalRequests)) * 100} value={reportData.priorityCounts.media} label="Prioridad Media" color="#F59E0B" track="#FBE4BC" size={218} strokeWidth={18} /></div>
                    <div className="flex flex-col items-center gap-6"><ProgressRing percent={(reportData.priorityCounts.baja / Math.max(1, reportData.totalRequests)) * 100} value={reportData.priorityCounts.baja} label="Prioridad Baja" color="#10B981" track="#C4EEDD" size={218} strokeWidth={18} /></div>
                  </div>
                </div>
              </div>
            </SlideWrapper>

            {/* SLIDE: TOP PROYECTOS */}
            <SlideWrapper>
              <div className="pdf-slide relative flex overflow-hidden shrink-0 bg-white w-[1280px] h-[720px]">
                <SlideSidebar index={++slideNum} total={TOTAL_SLIDES} icon={Building2} title={<>Top<br/>Proyectos</>} colorP={cP} clientLogo={reportData.selectedClient.logo_url} />
                <div className="flex-1 p-10 flex flex-col h-full">
                  <SectionPill icon={Repeat} title="Distribución por Proyecto" colorP={cP} />
                  <div className="mt-6 flex-1 bg-red-50/30 border border-red-100 rounded-3xl p-6 flex flex-col shadow-sm">
                    <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4">
                      {reportData.topRecurrentProjects.map((proj, idx) => (
                        <div key={`proj-${idx}`} className="flex items-center justify-between bg-white rounded-2xl px-6 py-4 border border-gray-200 shadow-sm">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black shrink-0`} style={idx === 0 ? { backgroundColor: '#FEF3C7', color: '#D97706' } : { backgroundColor: `${cP}1A`, color: cP }}>{idx === 0 ? <Award size={24} strokeWidth={2.5} /> : idx + 1}</div>
                            <span className="text-xl font-black text-[#0F0F12] uppercase truncate">{proj.name}</span>
                          </div>
                          <div className="bg-[#0F0F12] px-6 py-2 rounded-xl text-base font-black text-white tracking-widest shrink-0">{proj.count} ENTREGABLES</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </SlideWrapper>

            {/* SLIDE: UNIDADES / MARCAS (BIO PAPPEL) */}
            {isBioPappel && (
              <SlideWrapper>
                <div className="pdf-slide relative flex overflow-hidden shrink-0 bg-white w-[1280px] h-[720px]">
                  <SlideSidebar index={++slideNum} total={TOTAL_SLIDES} icon={Target} title={<>Unidades<br/>de Negocio</>} colorP={cP} clientLogo={reportData.selectedClient.logo_url} />
                  <div className="flex-1 p-10 flex flex-col h-full">
                    <SectionPill icon={Target} title="Distribución por Marca / Solicitante" colorP={cP} />
                    <div className="mt-6 flex-1 bg-red-50/30 border border-red-100 rounded-3xl p-6 flex flex-col shadow-sm">
                      <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4">
                        {reportData.topBrands.map((brand, idx) => (
                          <div key={`brand-${idx}`} className="flex items-center justify-between bg-white rounded-2xl px-6 py-4 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-4 min-w-0">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black shrink-0`} style={{ backgroundColor: `${cP}1A`, color: cP }}><Target size={24} strokeWidth={2.5} /></div>
                              <span className="text-xl font-black text-[#0F0F12] uppercase truncate">{brand.name}</span>
                            </div>
                            <div className="px-6 py-2 rounded-xl text-base font-black text-white tracking-widest shrink-0" style={{ backgroundColor: cP }}>{brand.count} ENTREGABLES</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </SlideWrapper>
            )}

            {/* SLIDES MAILCHIMP */}
            {usaMailchimp && (
              <>
                <SlideWrapper>
                  <div className="pdf-slide relative flex overflow-hidden shrink-0 bg-white w-[1280px] h-[720px]">
                    <SlideSidebar index={++slideNum} total={TOTAL_SLIDES} icon={MailOpen} title={<>Email<br />Marketing</>} colorP={cP} clientLogo={reportData.selectedClient.logo_url} />
                    <div className="flex-1 p-14 flex flex-col">
                      <SectionPill icon={MailOpen} title="Desempeño Global de Comunicados" colorP={cP} />
                      <div className="mt-10 flex-1 grid grid-cols-3 gap-6">
                        <div className="bg-red-50/30 border border-red-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${cP}1A` }}><Copy size={26} style={{ color: cP }} strokeWidth={2.5} /></div>
                          <span className="text-[90px] font-black leading-none mb-4" style={{ color: cP }}>{mailchimpStats.totalCampaignsAnalized}</span>
                          <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">Campañas Analizadas</span>
                        </div>
                        <div className="bg-red-50/30 border border-red-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                          <div className="w-14 h-14 rounded-2xl bg-[#10B981]/10 flex items-center justify-center mb-6"><MailOpen size={26} className="text-[#10B981]" strokeWidth={2.5} /></div>
                          <span className="text-[90px] font-black text-[#10B981] leading-none mb-4">{mailchimpStats.openRate}%</span>
                          <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">Tasa de Apertura (Promedio)</span>
                        </div>
                        <div className="bg-red-50/30 border border-red-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                          <div className="w-14 h-14 rounded-2xl bg-[#0F0F12]/10 flex items-center justify-center mb-6"><Target size={26} className="text-[#0F0F12]" strokeWidth={2.5} /></div>
                          <span className="text-[90px] font-black text-[#0F0F12] leading-none mb-4">{mailchimpStats.clickRate}%</span>
                          <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">CTR (Clics Promedio)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SlideWrapper>

                {chunkedCampaigns.length > 0 ? (
                  chunkedCampaigns.map((chunk, chunkIndex) => (
                    <SlideWrapper key={`table-${chunkIndex}`}>
                      <div className="pdf-slide relative flex overflow-hidden shrink-0 bg-white w-[1280px] h-[720px]">
                        <SlideSidebar index={++slideNum} total={TOTAL_SLIDES} icon={List} title={<>Todas las<br />Campañas</>} colorP={cP} clientLogo={reportData.selectedClient.logo_url} />
                        <div className="flex-1 p-10 flex flex-col h-full overflow-hidden">
                          <SectionPill icon={List} title={`Desglose Completo (Pág. ${chunkIndex + 1})`} colorP={cP} />
                          <div className="flex-1 mt-6 bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col">
                            <div className="bg-[#0F0F12] text-white px-5 py-4 text-xs font-black uppercase tracking-widest flex items-center justify-between">
                              <span className="w-1/3">Campaña Enviada</span>
                              <span className="w-[12%] text-center">Entregas</span>
                              <span className="w-[12%] text-center">Lectores Únicos</span>
                              <span className="w-[12%] text-center">Clics Únicos</span>
                              <span className="w-[15%] text-center" style={{ color: cP }}>Tasa Apertura</span>
                              <span className="w-[15%] text-center" style={{ color: cP }}>CTR</span>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                              {chunk.map((camp: any, idx: number) => {
                                const bgRow = idx % 2 === 0 ? 'bg-white' : 'bg-gray-50';
                                const dateObj = new Date(camp.sendTime);
                                const formattedDate = dateObj.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
                                return (
                                  <div key={camp.id} className={`px-5 py-4 flex items-center justify-between border-b border-gray-100 ${bgRow}`}>
                                    <div className="w-1/3 pr-4"><p className="text-sm font-bold text-[#0F0F12] truncate" title={camp.title}>{camp.title}</p><p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{formattedDate}</p></div>
                                    <div className="w-[12%] text-center text-sm font-bold text-gray-600">{camp.deliveries}</div>
                                    <div className="w-[12%] text-center text-sm font-bold text-gray-600">{camp.uniqueOpens}</div>
                                    <div className="w-[12%] text-center text-sm font-bold text-gray-600">{camp.uniqueClicks}</div>
                                    <div className="w-[15%] text-center text-xl font-black text-[#10B981]">{camp.openRate}%</div>
                                    <div className="w-[15%] text-center text-xl font-black" style={{ color: cP }}>{camp.clickRate}%</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </SlideWrapper>
                  ))
                ) : null}

                {validTopCampaigns.map((top, idx) => (
                  <TopCampaignSlide key={`top-${idx}`} campaign={top.data} brand={top.brand} slideIndex={++slideNum} totalSlides={TOTAL_SLIDES} colorP={cP} clientLogo={reportData.selectedClient.logo_url} />
                ))}
              </>
            )}

            {/* 🔥 SLIDES PERSONALIZADAS AL FINAL (CONCLUSIONES Y PASOS A SEGUIR) 🔥 */}
            <CustomEditableSlide 
              title="Conclusiones y<br/>¿Qué nos llevamos?" 
              slideIndex={++slideNum} 
              totalSlides={TOTAL_SLIDES} 
              colorP={cP} 
              clientLogo={reportData.selectedClient.logo_url} 
              defaultText={`• Punto número 1...\n• Punto número 2...\n• Punto clave de la estrategia...`} 
            />

            <CustomEditableSlide 
              title="Siguientes Pasos y<br/>Estrategia a futuro" 
              slideIndex={++slideNum} 
              totalSlides={TOTAL_SLIDES} 
              colorP={cP} 
              clientLogo={reportData.selectedClient.logo_url} 
              defaultText={`1. Analizar el alcance en el Q3...\n2. Preparar los materiales para el próximo ciclo...\n3. Evaluar el retorno de inversión de la pauta publicitaria...`} 
            />

          </div>
        </div>
      )}

    </div>
  );
}