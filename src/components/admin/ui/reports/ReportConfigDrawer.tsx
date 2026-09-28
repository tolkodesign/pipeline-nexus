import React from 'react';
import { 
  Settings, Save, RotateCcw, X, MonitorPlay, Film, PenTool, BarChart3, Layers, 
  Clock, ShieldCheck, MailOpen, List, FileText, Video, Presentation, LayoutTemplate, 
  Sparkles, CheckCircle2, UserCheck, Megaphone, Send, Award, ChevronRight, SlidersHorizontal
} from 'lucide-react';
import type { ReportSettings } from './reportTypes';

interface ReportConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReportSettings;
  updateSetting: (key: keyof ReportSettings, value: boolean) => void;
  saveClientSettings: () => void;
  resetToGlobal: () => void;
  isGlobal: boolean;
}

export function ReportConfigDrawer({ 
  isOpen, 
  onClose, 
  settings, 
  updateSetting, 
  saveClientSettings, 
  resetToGlobal, 
  isGlobal 
}: ReportConfigDrawerProps) {

  // Contador dinámico de slides encendidas
  const activeSlidesCount = [
    settings.showCover,
    settings.showAudiovisual,
    settings.showDesign,
    settings.showDev,
    settings.showContent,
    settings.showProduction,
    settings.showStaff,
    settings.showPR,
    settings.showPriorities,
    settings.showTopProjects,
    settings.showBrands,
    settings.showMailchimp,
    settings.showConclusions,
    settings.showNextSteps
  ].filter(Boolean).length;

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
    <label className={`flex items-center justify-between cursor-pointer group select-none transition-all ${
      isSubItem 
        ? 'pl-6 py-1 hover:bg-gray-100/70 rounded-lg pr-2.5 my-0.5' 
        : 'py-2 px-2.5 hover:bg-gray-100/70 rounded-xl my-1'
    }`}>
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon ? (
          <div className={`p-1.5 rounded-lg transition-colors shrink-0 ${
            settings[settingKey] ? 'bg-red-500/10 text-red-500' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
          }`}>
            <Icon size={14} strokeWidth={2.5} />
          </div>
        ) : (
          <div className={`w-2 h-2 rounded-full ml-1 shrink-0 transition-colors ${
            settings[settingKey] ? 'bg-red-500' : 'bg-gray-300'
          }`} />
        )}
        <span className={`text-xs truncate transition-colors ${
          settings[settingKey] 
            ? (isSubItem ? 'text-gray-700 font-medium' : 'text-gray-900 font-bold') 
            : 'text-gray-400 font-medium'
        }`}>
          {label}
        </span>
      </div>
      <div className="relative shrink-0 ml-3">
        <input 
          type="checkbox" 
          className="sr-only" 
          checked={settings[settingKey]} 
          onChange={(e) => updateSetting(settingKey, e.target.checked)} 
        />
        <div className={`block ${isSubItem ? 'w-8 h-4' : 'w-9 h-5'} rounded-full transition-colors ${
          settings[settingKey] ? 'bg-red-500' : 'bg-gray-200'
        }`}></div>
        <div className={`absolute left-0.5 top-0.5 bg-white ${isSubItem ? 'w-3 h-3' : 'w-4 h-4'} rounded-full transition-transform ${
          settings[settingKey] ? (isSubItem ? 'translate-x-4' : 'translate-x-4') : 'translate-x-0'
        }`}></div>
      </div>
    </label>
  );

  return (
    <>
      {/* DRAWER FLOTANTE SIN BACKDROP OPASIVO (Permite ver y hacer scroll en la presentación) */}
      <aside 
        className={`fixed top-0 right-0 h-full w-[350px] sm:w-[380px] bg-white/95 backdrop-blur-md border-l border-gray-200 shadow-[-10px_0_30px_rgba(0,0,0,0.08)] z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        {/* HEADER DEL PANEL */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-md shadow-red-500/20">
              <SlidersHorizontal size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-gray-900 text-xs uppercase tracking-wider">Editor de Slides</h3>
                <span className="text-[10px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                  {activeSlidesCount} activas
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">
                {isGlobal ? 'Plantilla Global' : 'Cliente Personalizado'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors cursor-pointer"
            title="Cerrar panel"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENIDO CON SCROLL */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-thumb-gray-200">
          
          {/* SECCIÓN 1: ESTRUCTURA GENERAL */}
          <div className="bg-gray-50/70 p-3 rounded-2xl border border-gray-100">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
              Estructura Principal
            </h4>
            <div className="space-y-0.5">
              <Toggle label="Portada Completa" icon={BarChart3} settingKey="showCover" />
              {settings.showCover && (
                <div className="ml-3 pl-3 border-l-2 border-red-100 space-y-0.5 mt-1">
                  <Toggle label="Solicitudes Totales" settingKey="showCoverTotalRequests" isSubItem />
                  <Toggle label="Entregables Totales" settingKey="showCoverDeliverables" isSubItem />
                  <Toggle label="Tasa de Entrega (%)" settingKey="showCoverCompleted" isSubItem />
                </div>
              )}
              <Toggle label="Conclusiones y Aprendizajes" icon={Award} settingKey="showConclusions" />
              <Toggle label="Siguientes Pasos & Estrategia" icon={Send} settingKey="showNextSteps" />
            </div>
          </div>

          {/* SECCIÓN 2: ESPECIALIDADES & ENTREGABLES */}
          <div className="bg-gray-50/70 p-3 rounded-2xl border border-gray-100 space-y-2">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
              Especialidades y Métricas
            </h4>

            {/* AUDIOVISUAL */}
            <div className="bg-white/80 p-2.5 rounded-xl border border-gray-200/60 shadow-xs">
              <Toggle label="Audiovisual" icon={Video} settingKey="showAudiovisual" />
              {settings.showAudiovisual && (
                <div className="ml-3 pl-3 border-l-2 border-red-100 space-y-0.5 mt-1.5 pt-1 border-t border-gray-100">
                  <Toggle label="Entregables Audiovisuales" settingKey="showAvDeliverables" isSubItem />
                  <Toggle label="Horas de Edición" settingKey="showAvEditingHours" isSubItem />
                  <Toggle label="Horas de Grabación" settingKey="showAvRecordingHours" isSubItem />
                  <Toggle label="Duración Total de Videos" settingKey="showAvDuration" isSubItem />
                </div>
              )}
            </div>

            {/* DISEÑO GRÁFICO */}
            <div className="bg-white/80 p-2.5 rounded-xl border border-gray-200/60 shadow-xs">
              <Toggle label="Diseño Gráfico" icon={PenTool} settingKey="showDesign" />
              {settings.showDesign && (
                <div className="ml-3 pl-3 border-l-2 border-red-100 space-y-0.5 mt-1.5 pt-1 border-t border-gray-100">
                  <Toggle label="Presentaciones PPT" settingKey="showDesignPpts" isSubItem />
                  <Toggle label="Slides Diseñados" settingKey="showDesignSlides" isSubItem />
                  <Toggle label="Artes / Formatos Gráficos" settingKey="showDesignArts" isSubItem />
                </div>
              )}
            </div>

            {/* PROGRAMACIÓN */}
            <div className="bg-white/80 p-2.5 rounded-xl border border-gray-200/60 shadow-xs">
              <Toggle label="Programación / Web" icon={MonitorPlay} settingKey="showDev" />
              {settings.showDev && (
                <div className="ml-3 pl-3 border-l-2 border-red-100 space-y-0.5 mt-1.5 pt-1 border-t border-gray-100">
                  <Toggle label="Proyectos Codeados" settingKey="showDevProjects" isSubItem />
                </div>
              )}
            </div>

            {/* CONTENIDO Y ESTRATEGIA */}
            <div className="bg-white/80 p-2.5 rounded-xl border border-gray-200/60 shadow-xs">
              <Toggle label="Contenido y Estrategia" icon={FileText} settingKey="showContent" />
              {settings.showContent && (
                <div className="ml-3 pl-3 border-l-2 border-red-100 space-y-0.5 mt-1.5 pt-1 border-t border-gray-100">
                  <Toggle label="Piezas Redactadas" settingKey="showCopyPieces" isSubItem />
                  <Toggle label="Estrategias Desarrolladas" settingKey="showCopyStrategies" isSubItem />
                  <Toggle label="Redacción Exacta (Bio Pappel)" settingKey="showCopyExact" isSubItem />
                </div>
              )}
            </div>

            {/* PRODUCCIÓN */}
            <div className="bg-white/80 p-2.5 rounded-xl border border-gray-200/60 shadow-xs">
              <Toggle label="Producción" icon={Film} settingKey="showProduction" />
              {settings.showProduction && (
                <div className="ml-3 pl-3 border-l-2 border-red-100 space-y-0.5 mt-1.5 pt-1 border-t border-gray-100">
                  <Toggle label="Llamados / Producciones" settingKey="showProdCalls" isSubItem />
                  <Toggle label="Horas Grabadas" settingKey="showProdHours" isSubItem />
                </div>
              )}
            </div>

            {/* STAFF */}
            <div className="bg-white/80 p-2.5 rounded-xl border border-gray-200/60 shadow-xs">
              <Toggle label="Staff" icon={UserCheck} settingKey="showStaff" />
              {settings.showStaff && (
                <div className="ml-3 pl-3 border-l-2 border-red-100 space-y-0.5 mt-1.5 pt-1 border-t border-gray-100">
                  <Toggle label="Eventos Apoyados" settingKey="showStaffEvents" isSubItem />
                </div>
              )}
            </div>

            {/* RELACIONES PÚBLICAS (RP) */}
            <div className="bg-white/80 p-2.5 rounded-xl border border-gray-200/60 shadow-xs">
              <Toggle label="Relaciones Públicas (RP)" icon={Megaphone} settingKey="showPR" />
              {settings.showPR && (
                <div className="ml-3 pl-3 border-l-2 border-red-100 space-y-0.5 mt-1.5 pt-1 border-t border-gray-100">
                  <Toggle label="Impactos PR" settingKey="showPrImpacts" isSubItem />
                  <Toggle label="Gestiones de Prensa" settingKey="showPrGestiones" isSubItem />
                </div>
              )}
            </div>

          </div>

          {/* SECCIÓN 3: ANÁLISIS ESTRATÉGICO */}
          <div className="bg-gray-50/70 p-3 rounded-2xl border border-gray-100 space-y-2">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
              Métricas Estratégicas
            </h4>

            {/* PRIORIDADES */}
            <div className="bg-white/80 p-2.5 rounded-xl border border-gray-200/60 shadow-xs">
              <Toggle label="Prioridades de Solicitudes" icon={ShieldCheck} settingKey="showPriorities" />
              {settings.showPriorities && (
                <div className="ml-3 pl-3 border-l-2 border-red-100 space-y-0.5 mt-1.5 pt-1 border-t border-gray-100">
                  <Toggle label="Prioridad Alta" settingKey="showPriorityHigh" isSubItem />
                  <Toggle label="Prioridad Media" settingKey="showPriorityMedium" isSubItem />
                  <Toggle label="Prioridad Baja" settingKey="showPriorityLow" isSubItem />
                </div>
              )}
            </div>

            {/* TOP PROYECTOS & MARCAS */}
            <div className="bg-white/80 p-2.5 rounded-xl border border-gray-200/60 shadow-xs">
              <Toggle label="Top Proyectos Recurrentes" icon={Layers} settingKey="showTopProjects" />
              <Toggle label="Unidades de Negocio (Bio Pappel)" icon={BarChart3} settingKey="showBrands" />
              <Toggle label="Métricas de Mailchimp" icon={MailOpen} settingKey="showMailchimp" />
            </div>

          </div>

        </div>

        {/* FOOTER CON BOTONES DE ACCIÓN */}
        {!isGlobal && (
          <div className="p-3.5 border-t border-gray-200 bg-white flex gap-2 shrink-0 shadow-xs">
            <button 
              onClick={saveClientSettings}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Save size={14} /> Guardar para este cliente
            </button>
            <button 
              onClick={resetToGlobal}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              title="Restaurar a valores globales"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
