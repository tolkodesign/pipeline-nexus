import React from 'react';
import { X, Edit2, Phone, Mail, Calendar, Building, Briefcase, Tag, Target, Camera } from 'lucide-react';
import type { Reporter } from '../../types/press';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reporter: Reporter | null;
  onEdit: (reporter: Reporter) => void;
}

export default function ReporterViewModal({ isOpen, onClose, reporter, onEdit }: Props) {
  if (!isOpen || !reporter) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-luxury-card w-full max-w-4xl rounded-2xl shadow-xl flex flex-col overflow-hidden max-h-[90vh]">
        <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-luxury-border">
          <h3 className="text-xl font-black uppercase text-gray-900 dark:text-white flex items-center gap-2">
            Perfil del Reportero
            {!reporter.is_active && (
              <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Inactivo</span>
            )}
          </h3>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { onClose(); onEdit(reporter); }}
              className="flex items-center gap-1.5 text-xs font-bold text-luxury-red hover:text-red-700 transition-colors uppercase tracking-wider bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg"
            >
              <Edit2 size={14} /> Editar
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-luxury-red transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar bg-gray-50 dark:bg-luxury-dark/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column: Photo & Main Info */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-40 h-40 rounded-full border-4 border-white dark:border-luxury-card shadow-lg bg-gray-100 dark:bg-luxury-dark flex items-center justify-center overflow-hidden shrink-0">
                {reporter.photo_url ? (
                  <img src={reporter.photo_url} alt={reporter.full_name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-black text-gray-300">{reporter.full_name.charAt(0)}</span>
                )}
              </div>
              
              <div className="text-center w-full">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-1">{reporter.full_name}</h2>
                {reporter.position && <p className="text-sm font-bold text-gray-500 uppercase">{reporter.position}</p>}
                
                <div className="mt-4 flex justify-center">
                  <span className={`text-xs font-black px-3 py-1 rounded-xl uppercase tracking-widest shadow-sm ${
                    reporter.tier === 1 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                    reporter.tier === 2 ? 'bg-gray-200 text-gray-800 border-gray-300' : 
                    'bg-orange-100 text-orange-800 border-orange-200'
                  }`}>
                    Tier {reporter.tier}
                  </span>
                </div>
              </div>

              <div className="w-full bg-white dark:bg-luxury-card rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-luxury-border space-y-4 mt-2">
                <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest border-b border-gray-100 dark:border-white/5 pb-2">Contacto</h4>
                
                {reporter.email && (
                  <div className="flex items-center gap-3">
                    <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg text-luxury-red"><Mail size={16} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Email</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{reporter.email}</p>
                    </div>
                  </div>
                )}
                
                {reporter.phone && (
                  <div className="flex items-center gap-3">
                    <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg text-luxury-red"><Phone size={16} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Teléfono</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{reporter.phone}</p>
                    </div>
                  </div>
                )}

                {reporter.birth_date && (
                  <div className="flex items-center gap-3">
                    <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg text-luxury-red"><Calendar size={16} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Cumpleaños</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{reporter.birth_date}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Medium, Campaigns, Evidence */}
            <div className="md:col-span-2 flex flex-col gap-6">
              
              <div className="bg-white dark:bg-luxury-card rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-luxury-border">
                <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest border-b border-gray-100 dark:border-white/5 pb-3 mb-4">Información del Medio</h4>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Building size={14} className="text-gray-400" />
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Medio Principal</p>
                    </div>
                    <p className="text-base font-black text-gray-800 dark:text-gray-200 uppercase">{reporter.press_media?.name || '-'}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Target size={14} className="text-gray-400" />
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Tipo de Medio</p>
                    </div>
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase">{reporter.press_media_types?.name || '-'}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase size={14} className="text-gray-400" />
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Fuente / Especialidad</p>
                    </div>
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase">{reporter.press_sources?.name || 'General'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-luxury-card rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-luxury-border">
                <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest border-b border-gray-100 dark:border-white/5 pb-3 mb-4 flex items-center gap-2">
                  <Tag size={16} /> Campañas en las que participó
                </h4>
                
                {reporter.press_campaigns && reporter.press_campaigns.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {reporter.press_campaigns.map((camp, idx) => (
                      <span key={idx} className="bg-luxury-red text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                        {camp.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 font-medium">No tiene campañas registradas.</p>
                )}
              </div>

              <div className="bg-white dark:bg-luxury-card rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-luxury-border">
                <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest border-b border-gray-100 dark:border-white/5 pb-3 mb-4 flex items-center gap-2">
                  <Camera size={16} /> Testigos ({reporter.reporter_evidence?.length || 0}/5)
                </h4>
                
                {reporter.reporter_evidence && reporter.reporter_evidence.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {reporter.reporter_evidence.map((ev, idx) => (
                      <a key={idx} href={ev.url} target="_blank" rel="noopener noreferrer" className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200 dark:border-luxury-border hover:border-luxury-red transition-colors block cursor-zoom-in">
                        <img src={ev.url} alt={`Testigo ${idx+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 font-medium">No hay fotos de testigos.</p>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
