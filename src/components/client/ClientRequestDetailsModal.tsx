import { useState, useEffect } from 'react';
import { X, Calendar, Layers, FileText, Link2, Lock, User, Clock, Package, LayoutTemplate, Building2, Flag, Mail, FolderKanban, Hash } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  request: any | null;
  onRefresh: () => void;
}

export default function ClientRequestDetailsModal({ isOpen, onClose, request }: Props) {
  
  // Estado para guardar el ticket completo traído directamente de la BD
  const [fullReq, setFullReq] = useState<any>(request);

  // Estados relacionales resueltos
  const [resolvedOrgName, setResolvedOrgName] = useState('CARGANDO...');
  const [orgBanner, setOrgBanner] = useState<string | null>(null);
  const [requesterName, setRequesterName] = useState<string>('Cargando...');
  const [projectName, setProjectName] = useState('General (Sin Tablero)');
  const [priorityData, setPriorityData] = useState({ level: 'Normal', color: '#6b7280' });
  const [formatName, setFormatName] = useState('Formatos Mixtos');

  useEffect(() => {
    if (isOpen && request) {
      loadAllData(); 
    }
  }, [isOpen, request]);

  const loadAllData = async () => {
    if (!request) return;

    // 1. Traer TODO el renglón de requests por si la pantalla padre no mandó columnas (ej. cc_emails o links)
    const { data: rawReq } = await supabase
      .from('requests')
      .select('*')
      .eq('id', request.id)
      .single();
      
    const merged = { ...request, ...(rawReq || {}) };
    setFullReq(merged);

    // 2. Resolver Organización y Banner
    let fOrgName = merged.organizations?.name || merged.department || 'TOLKO PARTNER';
    let fBanner = merged.organizations?.banner_url || null;
    if (merged.organization_id && !merged.organizations) {
      const { data: orgD } = await supabase.from('organizations').select('name, banner_url').eq('id', merged.organization_id).single();
      if (orgD) { fOrgName = orgD.name; fBanner = orgD.banner_url; }
    }
    setResolvedOrgName(fOrgName);
    setOrgBanner(fBanner);

    // 3. Resolver Solicitante
    let fReqName = merged.profiles?.full_name || merged.requester?.full_name;
    if (!fReqName && merged.requester_id) {
      const { data: profD } = await supabase.from('profiles').select('full_name').eq('id', merged.requester_id).single();
      if (profD) fReqName = profD.full_name;
    }
    setRequesterName(fReqName || merged.department || 'Usuario Tolko');

    // 4. Resolver Proyecto/Tablero
    let fProjName = merged.projects?.name;
    if (!fProjName && merged.project_id) {
        const {data: pData} = await supabase.from('projects').select('name').eq('id', merged.project_id).single();
        if (pData) fProjName = pData.name;
    }
    setProjectName(fProjName || 'General (Sin Tablero)');

    // 5. Resolver Prioridad
    let fPrioLevel = merged.priorities?.level || 'Normal';
    let fPrioColor = merged.priorities?.color_code || '#6b7280';
    if (!merged.priorities && merged.priority_id) {
        const {data: prData} = await supabase.from('priorities').select('level, color_code').eq('id', merged.priority_id).single();
        if (prData) { fPrioLevel = prData.level; fPrioColor = prData.color_code; }
    }
    setPriorityData({ level: fPrioLevel, color: fPrioColor });

    // 6. Resolver Formatos
    let fFormat = merged.file_extensions?.extension || 'Formatos Mixtos';
    if (!merged.file_extensions && merged.target_format_id) {
        const {data: fData} = await supabase.from('file_extensions').select('extension').eq('id', merged.target_format_id).single();
        if (fData) fFormat = fData.extension;
    }
    setFormatName(fFormat);
  };

  if (!isOpen || !request || !fullReq) return null;

  // Variables calculadas listas para el render
  const parsedTitle = fullReq.title || 'SOLICITUD';
  const displayLinks = fullReq.external_resource_url ? fullReq.external_resource_url.split(',').map((l: string) => l.trim()).filter(Boolean) : [];
  const itemsBreakdown = fullReq.items_breakdown || [];
  const cleanDescription = (fullReq.description || '').replace(/\*\*DESGLOSE DE ENTREGABLES INCLUIDOS:\*\*[\s\S]*/, '').trim();
  const creationDate = fullReq.created_at || fullReq.request_date;
  const ccEmails = fullReq.cc_emails || 'Ninguno';

  // LÓGICA DEL MES AUTOMÁTICO
  let projMonth = fullReq.project_month;
  if (!projMonth && creationDate) {
    const dateObj = new Date(creationDate);
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    projMonth = `${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
  } else if (!projMonth) {
    projMonth = 'N/A';
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-black/60 dark:bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#0a0a0c] border border-gray-200 dark:border-zinc-800/80 w-full max-w-[1000px] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        
        {/* BANNER HERO PREMIUM CON BACKGROUND DINÁMICO */}
        <div 
          className="relative overflow-hidden p-8 md:p-10 shrink-0 transition-all duration-500"
          style={{
            backgroundImage: orgBanner 
              ? `linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3) 100%), url(${orgBanner})` 
              : 'linear-gradient(to right, #0F0F12, #1a1a24)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <button onClick={onClose} className="absolute top-6 right-6 text-white/60 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-xl transition-all cursor-pointer z-10"><X size={20}/></button>

          <div className="relative z-10 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="bg-black/60 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                <Building2 size={12}/> {resolvedOrgName}
              </span>
              <span className="text-white/70 text-[10px] font-black uppercase tracking-widest bg-black/40 px-2 py-1 rounded-md border border-white/5">• ID: {fullReq.id.slice(-6)}</span>
              
              <span className="text-white text-[10px] font-black uppercase tracking-widest bg-black/40 px-2 py-1 rounded-md border border-white/5 flex items-center gap-1.5" style={{ color: priorityData.color }}>
                 <Flag size={12} style={{ color: priorityData.color }}/> Prioridad {priorityData.level}
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight max-w-4xl drop-shadow-lg">
              {parsedTitle}
            </h2>

            <div className="flex flex-wrap items-center gap-4 mt-2">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 shadow-sm">
                <User size={14} className="text-white/70" />
                <div>
                  <p className="text-[8px] text-white/50 font-black uppercase tracking-widest leading-none">Solicitado por</p>
                  <p className="text-xs text-white font-bold leading-tight mt-0.5 uppercase">{requesterName}</p>
                </div>
              </div>

              {creationDate && (
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 shadow-sm">
                  <Clock size={14} className="text-white/70" />
                  <div>
                    <p className="text-[8px] text-white/50 font-black uppercase tracking-widest leading-none">Fecha Solicitud</p>
                    <p className="text-xs text-white font-bold leading-tight mt-0.5">{new Date(creationDate).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BODY - LAYOUT HORIZONTAL PURO */}
        <div className="overflow-y-auto custom-scrollbar flex-1 bg-gray-50/50 dark:bg-[#0a0a0c]">
          <div className="p-6 md:p-10 flex flex-col gap-8">
            
            {/* 1. Bloque: Info Base Detallada */}
            <div className="bg-white dark:bg-[#141419] border border-gray-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Lock size={60} />
              </div>
              
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6 flex items-center gap-2">
                <FileText size={14} className="text-luxury-red"/> Especificaciones Originales
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Área / Marca</label>
                  <div className="bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-zinc-800/60 p-3 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 truncate uppercase">
                    {fullReq.department || 'N/A'}
                  </div>
                </div>
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Fecha de Entrega Pactada</label>
                  <div className="bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-zinc-800/60 p-3 rounded-xl text-xs font-black text-luxury-red flex items-center gap-2">
                    <Calendar size={14}/> {fullReq.due_date ? new Date(fullReq.due_date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Sin Fecha'}
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><FolderKanban size={10}/> Proyecto Asociado</label>
                  <div className="bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-zinc-800/60 p-3 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 truncate uppercase">
                    {projectName}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Mes</label>
                  <div className="bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-zinc-800/60 p-3 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 truncate capitalize">
                    {projMonth}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Hash size={10}/> Formatos Base</label>
                  <div className="bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-zinc-800/60 p-3 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 truncate uppercase">
                    {formatName}
                  </div>
                </div>
                
                {/* 🔥 AQUÍ ESTÁN TUS CORREOS COPIADOS DE VUELTA 🔥 */}
                <div className="space-y-1.5 md:col-span-4">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Mail size={10}/> Con copia a (CC)</label>
                  <div className="bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-zinc-800/60 p-3 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 break-all">
                    {ccEmails}
                  </div>
                </div>

              </div>

              <div className="mt-6 space-y-1.5">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Descripción General / Brief</label>
                <div className="bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-zinc-800/60 p-5 rounded-xl text-[13px] text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-medium leading-relaxed shadow-inner max-h-[300px] overflow-y-auto custom-scrollbar select-text">
                  {cleanDescription || <span className="italic opacity-50">Sin descripción proporcionada.</span>}
                </div>
              </div>

              {/* 🔥 Y AQUÍ LOS ENLACES QUE PUSIERON 🔥 */}
              <div className="mt-6 space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Material y Enlaces Base</label>
                {displayLinks.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {displayLinks.map((link: string, idx: number) => (
                      <a key={idx} href={link} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 px-3 py-2 rounded-xl text-xs font-bold transition-all border border-gray-200 dark:border-zinc-700 shadow-sm truncate max-w-full">
                        <Link2 size={12} className="text-blue-500 shrink-0"/> <span className="truncate">{link.replace(/^https?:\/\//, '')}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-zinc-800/60 p-3 rounded-xl text-xs font-medium text-gray-500 italic">
                    Sin enlaces adjuntos.
                  </div>
                )}
              </div>
            </div>

            {/* 2. Bloque: Desglose de Entregables Dinámico */}
            <div className="bg-white dark:bg-[#141419] border border-gray-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100 dark:border-zinc-800/50">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <LayoutTemplate size={14} className="text-luxury-red"/> Entregables a Producir
                </h3>
                {itemsBreakdown.length > 0 && (
                  <span className="bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest">
                    Total: {itemsBreakdown.reduce((acc: number, cur: any) => acc + (Number(cur.quantity) || 1), 0)} Pz
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2.5">
                {itemsBreakdown.length > 0 ? (
                  itemsBreakdown.map((item: any, idx: number) => (
                    <div key={idx} className={`bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-zinc-800/80 rounded-xl px-3.5 py-2.5 flex items-center gap-3 shadow-sm ${item.package_source ? 'ring-1 ring-amber-500/20' : ''}`}>
                      <div className="flex flex-col">
                        <span className="text-xs font-black uppercase text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                          {item.package_source ? <Package size={12} className="text-amber-500"/> : <Layers size={12} className="text-blue-500"/>} 
                          {item.label || item.name}
                        </span>
                        {item.package_source && (
                          <span className="text-[8px] text-amber-600/70 font-bold uppercase tracking-widest ml-4 mt-0.5">De: {item.package_source}</span>
                        )}
                      </div>
                      <div className="h-4 w-px bg-gray-200 dark:bg-zinc-700 mx-1"></div>
                      <span className="bg-white dark:bg-zinc-800 text-[9px] font-bold px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-zinc-700 uppercase tracking-widest">
                        {item.discipline || 'General'}
                      </span>
                      <span className="bg-luxury-red/10 text-luxury-red text-[10px] font-black px-2 py-0.5 rounded uppercase">
                        {item.quantity} pz
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="w-full text-center py-6 text-gray-400 text-xs font-medium italic border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">
                    La solicitud se procesará como una pieza única (1 Pz).
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}