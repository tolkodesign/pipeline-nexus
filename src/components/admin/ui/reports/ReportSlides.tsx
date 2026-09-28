import React, { useState, useEffect } from 'react';
import { CheckCircle2, PenTool, FileText, Target } from 'lucide-react';
import { SlideWrapper, SlideSidebar, SectionPill, ProgressRing } from './ReportUIWidgets';

export function CustomEditableSlide({ title, slideIndex, totalSlides, colorP, clientLogo, defaultText }: any) {
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

export function TopCampaignSlide({ campaign, brand, slideIndex, totalSlides, colorP, clientLogo }: any) {
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
