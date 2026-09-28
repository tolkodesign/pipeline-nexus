import React, { useState, useEffect } from 'react';
import tolkoLogo from '../../../../assets/image-4-_1_.ico';

export function EditableBigNumber({ value, className, style }: any) {
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

export function ProgressRing({ percent, value, label, color, track = '#F1F5F9', size = 130, strokeWidth = 14, textColor }: any) {
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

export function SlideSidebar({ index, total, title, icon: Icon, colorP, clientLogo }: any) {
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

export function SectionPill({ icon: Icon, title, colorP }: any) {
  return (
    <div className="inline-flex items-center gap-3 text-white px-7 py-4 rounded-2xl w-fit" style={{ backgroundColor: colorP, boxShadow: `0 14px 30px -12px ${colorP}8C` }}>
      <Icon size={26} strokeWidth={2.5} />
      <span className="text-2xl font-black uppercase tracking-wide">{title}</span>
    </div>
  );
}

export function MetricCard({ icon: Icon, value, label, accent }: any) {
  const [editedValue, setEditedValue] = useState(value);

  useEffect(() => {
     setEditedValue(value);
  }, [value]);

  const valStr = String(editedValue ?? '');
  const fontSizeClass = valStr.length > 5 ? 'text-[34px]' : 'text-[52px]';

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col items-center justify-center text-center gap-3 h-full shadow-sm">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accent}1A` }}>
        <Icon size={20} style={{ color: accent }} strokeWidth={2.5} />
      </div>
      <input 
        type="text"
        value={editedValue}
        onChange={(e) => setEditedValue(e.target.value)}
        className={`${fontSizeClass} font-black leading-none text-center bg-transparent outline-none w-full border-b-2 border-transparent hover:border-gray-100 focus:border-gray-200 transition-colors`}
        style={{ color: accent }} 
      />
      <span className="text-[13px] text-gray-500 font-bold uppercase tracking-widest leading-tight">{label}</span>
    </div>
  );
}

export function SlideWrapper({ children }: { children: React.ReactNode }) {
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
