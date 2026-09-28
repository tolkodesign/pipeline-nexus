import React from 'react';
import { 
  Settings, Save, RotateCcw, X, MonitorPlay, Film, PenTool, BarChart3, Layers, 
  Clock, ShieldCheck, MailOpen, List, FileText, Video, Presentation, LayoutTemplate, 
  Sparkles, CheckCircle2, UserCheck, Megaphone, Send, Award
} from 'lucide-react';
import type { ReportSettings } from './reportTypes';

interface ReportConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReportSettings;
  updateSetting: (key: keyof ReportSettings, value: boolean) => void;
  saveClientSettings: () => void;
  resetToGlobal: () => void;
  isGlobal: boolean;
}

export function ReportConfigModal({ 
  isOpen, 
  onClose, 
  settings, 
  updateSetting, 
  saveClientSettings, 
  resetToGlobal, 
  isGlobal 
}: ReportConfigModalProps) {
  if (!isOpen) return null;

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
    <label className={`flex items-center justify-between cursor-pointer group select-none transition-colors ${
      isSubItem 
        ? 'pl-5 py-1 hover:bg-gray-100/60 rounded-lg pr-2' 
        : 'py-1.5 px-2 hover:bg-gray-100/60 rounded-xl'
    }`}>
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon ? (
          <div className={`p-1.5 rounded-lg transition-colors shrink-0 ${
            settings[settingKey] ? 'bg-red-500/10 text-red-500' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
          }`}>
            <Icon size={15} strokeWidth={2.5} />
          </div>
        ) : (
          <div className={`w-2 h-2 rounded-full ml-1 shrink-0 ${
            settings[settingKey] ? 'bg-red-500' : 'bg-gray-300'
          }`} />
        )}
        <span className={`text-xs truncate transition-colors ${
          settings[settingKey] 
            ? (isSubItem ? 'text-gray-700 font-medium' : 'text-gray-900 font-bold') 
            : 'text-gray-400'
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
          settings[settingKey] ? 'translate-x-4' : 'translate-x-0'
        }`}></div>
      </div>
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* MODAL HEADER */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/20">
              <Settings size={20} />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-base leading-tight">Configuración del Reporte</h3>
              <p className="text-xs text-gray-500 font-medium">
                {isGlobal ? 'Plantilla Global Activa' : 'Personalizando visibilidad para esta cuenta'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isGlobal && (
              <button 
                onClick={resetToGlobal}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold py-2 px-3 rounded-xl flex items-center gap-1.5 transition-all"
                title="Restaurar valores globales"
              >
                <RotateCcw size={13} />
                <span>Restaurar</span>
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* MODAL BODY (GRID 2 COLUMNAS) */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* COLUMNA 1 */}
            <div className="space-y-4">
              
              {/* SLIDE 1: PORTADA */}
              <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/70">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2.5 px-1">SLIDE 1: Portada</h4>
                <Toggle label="Mostrar Portada Completa" icon={BarChart3} settingKey="showCover" />
                {settings.showCover && (
                  <div className="mt-2 pt-2 border-t border-gray-200/60 space-y-0.5">
                    <Toggle label="Solicitudes Totales" settingKey="showCoverTotalRequests" isSubItem />
                    <Toggle label="Solicitudes Entregadas" settingKey="showCoverCompleted" isSubItem />
                    <Toggle label="Entregables Producidos" settingKey="showCoverDeliverables" isSubItem />
                  </div>
                )}
              </div>

              {/* SLIDE 2: AUDIOVISUAL */}
              <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/70">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2.5 px-1">SLIDE 2: Audiovisual</h4>
                <Toggle label="Slide de Audiovisual" icon={Video} settingKey="showAudiovisual" />
                {settings.showAudiovisual && (
                  <div className="mt-2 pt-2 border-t border-gray-200/60 space-y-0.5">
                    <Toggle label="Entregables Audiovisuales" settingKey="showAvDeliverables" isSubItem />
                    <Toggle label="Horas de Edición" settingKey="showAvEditingHours" isSubItem />
                    <Toggle label="Horas de Grabación" settingKey="showAvRecordingHours" isSubItem />
                    <Toggle label="Duración Total de Videos" settingKey="showAvDuration" isSubItem />
                  </div>
                )}
              </div>

              {/* SLIDE 2: DISEÑO */}
              <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/70">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2.5 px-1">SLIDE 2: Diseño y Arte</h4>
                <Toggle label="Slide de Diseño" icon={PenTool} settingKey="showDesign" />
                {settings.showDesign && (
                  <div className="mt-2 pt-2 border-t border-gray-200/60 space-y-0.5">
                    <Toggle label="Presentaciones / Textos" settingKey="showDesignPpts" isSubItem />
                    <Toggle label="Slides Diseñados" settingKey="showDesignSlides" isSubItem />
                    <Toggle label="Artes / Diseños Sueltos" settingKey="showDesignArts" isSubItem />
                  </div>
                )}
              </div>

              {/* SLIDE 2: PROGRAMACIÓN */}
              <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/70">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2.5 px-1">SLIDE 2: Programación Web</h4>
                <Toggle label="Slide de Programación" icon={MonitorPlay} settingKey="showDev" />
                {settings.showDev && (
                  <div className="mt-2 pt-2 border-t border-gray-200/60 space-y-0.5">
                    <Toggle label="Proyectos Codeados" settingKey="showDevProjects" isSubItem />
                  </div>
                )}
              </div>

            </div>

            {/* COLUMNA 2 */}
            <div className="space-y-4">
              
              {/* SLIDE 2: CONTENIDO */}
              <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/70">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2.5 px-1">SLIDE 2: Contenido y Estrategia</h4>
                <Toggle label="Slide de Contenido" icon={FileText} settingKey="showContent" />
                {settings.showContent && (
                  <div className="mt-2 pt-2 border-t border-gray-200/60 space-y-0.5">
                    <Toggle label="Piezas Redactadas" settingKey="showCopyPieces" isSubItem />
                    <Toggle label="Estrategias" settingKey="showCopyStrategies" isSubItem />
                    <Toggle label="Redacción Exacta (BioPappel)" settingKey="showCopyExact" isSubItem />
                  </div>
                )}
              </div>

              {/* SLIDE 2: PRODUCCIÓN */}
              <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/70">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2.5 px-1">SLIDE 2: Producción</h4>
                <Toggle label="Slide de Producción" icon={Film} settingKey="showProduction" />
                {settings.showProduction && (
                  <div className="mt-2 pt-2 border-t border-gray-200/60 space-y-0.5">
                    <Toggle label="Llamados / Producciones" settingKey="showProdCalls" isSubItem />
                    <Toggle label="Horas Grabadas" settingKey="showProdHours" isSubItem />
                  </div>
                )}
              </div>

              {/* SLIDE 2: STAFF & RP */}
              <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/70 space-y-3">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-1">SLIDES 2: Staff y RP</h4>
                <div>
                  <Toggle label="Slide de Staff" icon={UserCheck} settingKey="showStaff" />
                  {settings.showStaff && (
                    <div className="mt-1 pt-1.5 border-t border-gray-200/60 space-y-0.5">
                      <Toggle label="Eventos Apoyados" settingKey="showStaffEvents" isSubItem />
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-gray-200/60">
                  <Toggle label="Slide de Relaciones Públicas" icon={Megaphone} settingKey="showPR" />
                  {settings.showPR && (
                    <div className="mt-1 pt-1.5 border-t border-gray-200/60 space-y-0.5">
                      <Toggle label="Impactos PR" settingKey="showPrImpacts" isSubItem />
                      <Toggle label="Gestiones" settingKey="showPrGestiones" isSubItem />
                    </div>
                  )}
                </div>
              </div>

              {/* SLIDE 3: PRIORIDADES */}
              <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/70">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2.5 px-1">SLIDE 3: Prioridades</h4>
                <Toggle label="Slide de Prioridades" icon={ShieldCheck} settingKey="showPriorities" />
                {settings.showPriorities && (
                  <div className="mt-2 pt-2 border-t border-gray-200/60 space-y-0.5">
                    <Toggle label="Prioridad Alta" settingKey="showPriorityHigh" isSubItem />
                    <Toggle label="Prioridad Media" settingKey="showPriorityMedium" isSubItem />
                    <Toggle label="Prioridad Baja" settingKey="showPriorityLow" isSubItem />
                  </div>
                )}
              </div>

              {/* SLIDE 4 & EXTRAS */}
              <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/70 space-y-1">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2.5 px-1">Otras Diapositivas</h4>
                <Toggle label="Top 5 Proyectos Recurrentes" icon={Award} settingKey="showTopProjects" />
                <Toggle label="Unidades de Negocio (BioPappel)" icon={Layers} settingKey="showBrands" />
                <Toggle label="Campañas Mailchimp" icon={MailOpen} settingKey="showMailchimp" />
                <Toggle label="Slide: Conclusiones" icon={List} settingKey="showConclusions" />
                <Toggle label="Slide: Siguientes Pasos" icon={List} settingKey="showNextSteps" />
              </div>

            </div>

          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between shrink-0">
          <p className="text-xs text-gray-500">
            Los cambios se aplican inmediatamente en el reporte.
          </p>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold py-2.5 px-4 rounded-xl border border-gray-200 transition-all"
            >
              Listo
            </button>
            {!isGlobal && (
              <button 
                onClick={() => {
                  saveClientSettings();
                  onClose();
                }}
                className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <Save size={14} />
                <span>Guardar para esta cuenta</span>
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
