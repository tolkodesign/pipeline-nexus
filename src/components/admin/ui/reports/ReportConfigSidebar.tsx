import React from 'react';
import { 
  Settings, Save, RotateCcw, MonitorPlay, Film, PenTool, BarChart3, Layers, 
  Clock, ShieldCheck, MailOpen, List, FileText, Video, Presentation, LayoutTemplate, 
  Sparkles, CheckCircle2, UserCheck, Megaphone, Send, Award
} from 'lucide-react';
import type { ReportSettings } from './reportTypes';

interface ReportConfigSidebarProps {
  settings: ReportSettings;
  updateSetting: (key: keyof ReportSettings, value: boolean) => void;
  saveClientSettings: () => void;
  resetToGlobal: () => void;
  isGlobal: boolean;
}

export function ReportConfigSidebar({ settings, updateSetting, saveClientSettings, resetToGlobal, isGlobal }: ReportConfigSidebarProps) {

  const Toggle = ({ 
    label, 
    icon: Icon, 
    settingKey, 
    isSubItem = false 
  }: { 
    label: string, 
    icon?: any, 
    settingKey: keyof ReportSettings, 
    isSubItem?: boolean 
  }) => (
    <label className={`flex items-center justify-between cursor-pointer group mb-2.5 ${isSubItem ? 'pl-5 py-0.5' : 'py-1'}`}>
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon ? (
          <div className={`p-1.5 rounded-lg transition-colors shrink-0 ${settings[settingKey] ? 'bg-red-500/10 text-red-500' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'}`}>
            <Icon size={14} strokeWidth={2.5} />
          </div>
        ) : (
          <div className={`w-2 h-2 rounded-full ml-1 shrink-0 ${settings[settingKey] ? 'bg-red-500' : 'bg-gray-300'}`} />
        )}
        <span className={`text-xs font-semibold truncate transition-colors ${settings[settingKey] ? (isSubItem ? 'text-gray-700' : 'text-gray-900 font-bold') : 'text-gray-400'}`}>
          {label}
        </span>
      </div>
      <div className="relative shrink-0 ml-2">
        <input 
          type="checkbox" 
          className="sr-only" 
          checked={settings[settingKey]} 
          onChange={(e) => updateSetting(settingKey, e.target.checked)} 
        />
        <div className={`block ${isSubItem ? 'w-8 h-4' : 'w-9 h-5'} rounded-full transition-colors ${settings[settingKey] ? 'bg-red-500' : 'bg-gray-200'}`}></div>
        <div className={`absolute left-0.5 top-0.5 bg-white ${isSubItem ? 'w-3 h-3' : 'w-4 h-4'} rounded-full transition-transform ${settings[settingKey] ? (isSubItem ? 'translate-x-4' : 'translate-x-4') : 'translate-x-0'}`}></div>
      </div>
    </label>
  );

  return (
    <div className="w-80 h-full bg-white border-r border-gray-200 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.03)] shrink-0 overflow-hidden select-none">
      
      {/* Header */}
      <div className="p-5 border-b border-gray-100 bg-gray-50/70 flex flex-col gap-2 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-md shadow-red-500/20">
            <Settings size={18} />
          </div>
          <div>
            <h3 className="font-black text-gray-900 text-sm leading-tight">Report Builder</h3>
            <p className="text-[11px] text-gray-500 font-medium">
              {isGlobal ? 'Plantilla Global Activa' : 'Personalizando Cliente'}
            </p>
          </div>
        </div>

        {!isGlobal && (
          <div className="mt-3 flex gap-2">
            <button 
              onClick={saveClientSettings}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
            >
              <Save size={13} /> Guardar para este cliente
            </button>
            <button 
              onClick={resetToGlobal}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95"
              title="Restaurar a default"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Scrollable Toggles */}
      <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-gray-200 space-y-6">
        
        {/* SLIDE 1: PORTADA */}
        <div className="bg-gray-50/60 p-3.5 rounded-2xl border border-gray-100">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 px-0.5">SLIDE 1: Portada</h4>
          <Toggle label="Mostrar Portada Completa" icon={BarChart3} settingKey="showCover" />
          {settings.showCover && (
            <div className="mt-2 pt-2 border-t border-gray-200/60 space-y-1">
              <Toggle label="Solicitudes Totales" settingKey="showCoverTotalRequests" isSubItem />
              <Toggle label="Solicitudes Entregadas" settingKey="showCoverCompleted" isSubItem />
              <Toggle label="Entregables Producidos" settingKey="showCoverDeliverables" isSubItem />
            </div>
          )}
        </div>

        {/* SLIDES 2: AUDIOVISUAL */}
        <div className="bg-gray-50/60 p-3.5 rounded-2xl border border-gray-100">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 px-0.5">SLIDE 2: Audiovisual</h4>
          <Toggle label="Slide de Audiovisual" icon={Video} settingKey="showAudiovisual" />
          {settings.showAudiovisual && (
            <div className="mt-2 pt-2 border-t border-gray-200/60 space-y-1">
              <Toggle label="Entregables Audiovisuales" settingKey="showAvDeliverables" isSubItem />
              <Toggle label="Horas de Edición" settingKey="showAvEditingHours" isSubItem />
              <Toggle label="Horas de Grabación" settingKey="showAvRecordingHours" isSubItem />
              <Toggle label="Duración Total de Videos" settingKey="showAvDuration" isSubItem />
            </div>
          )}
        </div>

        {/* SLIDES 2: DISEÑO */}
        <div className="bg-gray-50/60 p-3.5 rounded-2xl border border-gray-100">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 px-0.5">SLIDE 2: Diseño y Arte</h4>
          <Toggle label="Slide de Diseño" icon={PenTool} settingKey="showDesign" />
          {settings.showDesign && (
            <div className="mt-2 pt-2 border-t border-gray-200/60 space-y-1">
              <Toggle label="Presentaciones / Textos" settingKey="showDesignPpts" isSubItem />
              <Toggle label="Slides Diseñados" settingKey="showDesignSlides" isSubItem />
              <Toggle label="Artes / Diseños Sueltos" settingKey="showDesignArts" isSubItem />
            </div>
          )}
        </div>

        {/* SLIDES 2: PROGRAMACIÓN */}
        <div className="bg-gray-50/60 p-3.5 rounded-2xl border border-gray-100">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 px-0.5">SLIDE 2: Programación Web</h4>
          <Toggle label="Slide de Programación" icon={MonitorPlay} settingKey="showDev" />
          {settings.showDev && (
            <div className="mt-2 pt-2 border-t border-gray-200/60 space-y-1">
              <Toggle label="Proyectos Codeados" settingKey="showDevProjects" isSubItem />
            </div>
          )}
        </div>

        {/* SLIDES 2: CONTENIDO */}
        <div className="bg-gray-50/60 p-3.5 rounded-2xl border border-gray-100">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 px-0.5">SLIDE 2: Contenido y Estrategia</h4>
          <Toggle label="Slide de Contenido" icon={FileText} settingKey="showContent" />
          {settings.showContent && (
            <div className="mt-2 pt-2 border-t border-gray-200/60 space-y-1">
              <Toggle label="Piezas Redactadas" settingKey="showCopyPieces" isSubItem />
              <Toggle label="Estrategias" settingKey="showCopyStrategies" isSubItem />
              <Toggle label="Redacción Exacta (BioPappel)" settingKey="showCopyExact" isSubItem />
            </div>
          )}
        </div>

        {/* SLIDES 2: PRODUCCIÓN */}
        <div className="bg-gray-50/60 p-3.5 rounded-2xl border border-gray-100">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 px-0.5">SLIDE 2: Producción</h4>
          <Toggle label="Slide de Producción" icon={Film} settingKey="showProduction" />
          {settings.showProduction && (
            <div className="mt-2 pt-2 border-t border-gray-200/60 space-y-1">
              <Toggle label="Llamados / Producciones" settingKey="showProdCalls" isSubItem />
              <Toggle label="Horas Grabadas" settingKey="showProdHours" isSubItem />
            </div>
          )}
        </div>

        {/* SLIDES 2: STAFF */}
        <div className="bg-gray-50/60 p-3.5 rounded-2xl border border-gray-100">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 px-0.5">SLIDE 2: Staff</h4>
          <Toggle label="Slide de Staff" icon={UserCheck} settingKey="showStaff" />
          {settings.showStaff && (
            <div className="mt-2 pt-2 border-t border-gray-200/60 space-y-1">
              <Toggle label="Eventos Apoyados" settingKey="showStaffEvents" isSubItem />
            </div>
          )}
        </div>

        {/* SLIDES 2: RP */}
        <div className="bg-gray-50/60 p-3.5 rounded-2xl border border-gray-100">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 px-0.5">SLIDE 2: Relaciones Públicas (RP)</h4>
          <Toggle label="Slide de RP" icon={Megaphone} settingKey="showPR" />
          {settings.showPR && (
            <div className="mt-2 pt-2 border-t border-gray-200/60 space-y-1">
              <Toggle label="Impactos PR" settingKey="showPrImpacts" isSubItem />
              <Toggle label="Gestiones" settingKey="showPrGestiones" isSubItem />
            </div>
          )}
        </div>

        {/* SLIDE 3: PRIORIDADES */}
        <div className="bg-gray-50/60 p-3.5 rounded-2xl border border-gray-100">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 px-0.5">SLIDE 3: Prioridades</h4>
          <Toggle label="Slide de Prioridades" icon={ShieldCheck} settingKey="showPriorities" />
          {settings.showPriorities && (
            <div className="mt-2 pt-2 border-t border-gray-200/60 space-y-1">
              <Toggle label="Prioridad Alta" settingKey="showPriorityHigh" isSubItem />
              <Toggle label="Prioridad Media" settingKey="showPriorityMedium" isSubItem />
              <Toggle label="Prioridad Baja" settingKey="showPriorityLow" isSubItem />
            </div>
          )}
        </div>

        {/* SLIDE 4: TOP PROYECTOS */}
        <div className="bg-gray-50/60 p-3.5 rounded-2xl border border-gray-100">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 px-0.5">SLIDE 4: Top Proyectos</h4>
          <Toggle label="Top 5 Proyectos Recurrentes" icon={Award} settingKey="showTopProjects" />
        </div>

        {/* COMPLEMENTOS Y CIERRE */}
        <div className="bg-gray-50/60 p-3.5 rounded-2xl border border-gray-100 space-y-1">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 px-0.5">Slides Adicionales</h4>
          <Toggle label="Unidades de Negocio (Marcas)" icon={Layers} settingKey="showBrands" />
          <Toggle label="Campañas Mailchimp" icon={MailOpen} settingKey="showMailchimp" />
          <Toggle label="Slide: Conclusiones" icon={List} settingKey="showConclusions" />
          <Toggle label="Slide: Siguientes Pasos" icon={List} settingKey="showNextSteps" />
        </div>

      </div>
      
    </div>
  );
}
