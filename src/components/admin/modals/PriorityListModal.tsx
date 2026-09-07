import { X, LayoutGrid } from 'lucide-react';
import RequestRow from '../ui/RequestRow';

interface Props {
  isOpen: string | null;
  onClose: () => void;
  requests: any[];
  onEditTask: (request: any) => void;
}

export default function PriorityListModal({ isOpen, onClose, requests, onEditTask }: Props) {
  if (!isOpen) return null;

  const filtered = requests.filter(r => r.prioridad === isOpen && r.status !== 'completado');

  return (
    // 🔥 OVERLAY: Fondo semi-transparente oscuro/claro y z-index corregido
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-gray-900/40 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 transition-colors duration-300">
      
      {/* 🔥 CONTENEDOR PRINCIPAL DEL MODAL */}
      <div className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-luxury-border w-full max-w-[95vw] xl:max-w-[1400px] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] transition-colors duration-300">
        
        {/* HEADER */}
        <div className="p-6 border-b border-gray-200 dark:border-luxury-border flex justify-between items-center bg-gray-50 dark:bg-black/40 shrink-0 transition-colors duration-300">
          <div>
            <h3 className="text-lg font-black uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2 transition-colors duration-300">
              <LayoutGrid size={18} className="text-luxury-red"/> Solicitudes - Prioridad {isOpen}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 transition-colors duration-300">Panel flotante de supervisión de urgencias.</p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300 cursor-pointer shrink-0"
          >
            <X size={18}/>
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4 flex-1 bg-gray-50/50 dark:bg-[#0a0a0c]/50 transition-colors duration-300">
          {filtered.length > 0 ? (
            // 🔥 AQUÍ ESTÁ LA MAGIA ANTI-APLASTAMIENTO
            <div className="overflow-x-auto custom-scrollbar w-full pb-2">
              <div className="min-w-[1000px] flex flex-col gap-4 pr-2 pb-4">
                {filtered.map(req => (
                  // El shrink-0 prohíbe que flexbox comprima la tarjeta
                  <div key={req.id} className="shrink-0">
                    <RequestRow request={req} onEdit={onEditTask} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-xs transition-colors duration-300">
              No hay solicitudes activas con prioridad {isOpen}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}