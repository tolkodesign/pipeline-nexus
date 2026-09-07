import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X, ArrowRight } from 'lucide-react';

interface Props {
  overdueRequests: any[];
  onOpenTask: (req: any) => void;
  userName: string;
  isModalOpen?: boolean;
}

export default function HostageOverlay({ overdueRequests, onOpenTask, userName, isModalOpen }: Props) {
  // 🔥 CONFIGURACIÓN DEL CASTIGO: 3 horas en milisegundos
  const SNOOZE_TIME_MS = 3 * 60 * 60 * 1000; 

  // Inicializamos revisando si el popup está "dormido" en la memoria del navegador
  const [isDismissed, setIsDismissed] = useState(() => {
    const snoozedUntil = localStorage.getItem('tolko_hostage_snooze');
    return snoozedUntil ? Date.now() < Number(snoozedUntil) : false;
  });

  // 🔥 EL CRONÓMETRO DE LA MUERTE: Revive el popup cuando se acaba el tiempo
  useEffect(() => {
    if (isDismissed) {
      const snoozedUntil = Number(localStorage.getItem('tolko_hostage_snooze') || 0);
      const timeRemaining = snoozedUntil - Date.now();

      if (timeRemaining > 0) {
        // Ponemos la alarma para que despierte
        const timer = setTimeout(() => {
          setIsDismissed(false);
          localStorage.removeItem('tolko_hostage_snooze');
        }, timeRemaining);
        return () => clearTimeout(timer);
      } else {
        // Si ya se pasó el tiempo mientras tenían la pestaña inactiva, lo despertamos de golpe
        setIsDismissed(false);
        localStorage.removeItem('tolko_hostage_snooze');
      }
    }
  }, [isDismissed]);

  // Función para mandar a dormir al popup
  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('tolko_hostage_snooze', String(Date.now() + SNOOZE_TIME_MS));
  };

  // Si no debe nada, no renderizamos absolutamente nada y limpiamos castigos
  if (overdueRequests.length === 0) {
    localStorage.removeItem('tolko_hostage_snooze');
    return null;
  }

  // Si ya cerró el popup (está en sus 3 horas de paz), le dejamos el mini-recordatorio flotante
  if (isDismissed) {
    return createPortal(
      <button 
        onClick={() => {
          setIsDismissed(false);
          localStorage.removeItem('tolko_hostage_snooze'); // Si lo abren manual, cancelamos el snooze
        }}
        className="fixed bottom-6 right-6 z-[90000] bg-luxury-red hover:bg-red-700 text-white p-3 md:px-5 md:py-3 rounded-full shadow-[0_10px_25px_rgba(211,0,45,0.4)] animate-bounce flex items-center gap-2 transition-all cursor-pointer group"
        title="Ver cierres solicitados"
      >
        <AlertTriangle size={20} />
        <span className="hidden md:block text-xs font-black uppercase tracking-widest">
          {overdueRequests.length} Cierre{overdueRequests.length !== 1 ? 's' : ''} Pendiente{overdueRequests.length !== 1 ? 's' : ''}
        </span>
      </button>,
      document.body
    );
  }

  // POPUP PRINCIPAL
  return createPortal(
    <div className="fixed inset-0 z-[200000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white dark:bg-[#0F0F12] border border-red-500/30 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">
        
        {/* BOTÓN CERRAR SUPERIOR */}
        <button 
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/5 dark:bg-white/5 hover:bg-luxury-red dark:hover:bg-luxury-red p-2 rounded-xl transition-colors z-10 cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="p-6 md:p-8 flex flex-col items-center text-center gap-2">
          
          <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center animate-pulse mb-2 border border-red-100 dark:border-red-500/20">
            <AlertTriangle size={32} className="text-luxury-red" />
          </div>

          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            ¡Hola, {userName}!
          </h2>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium px-4">
            Han solicitado el cierre de <span className="font-black text-luxury-red">{overdueRequests.length === 1 ? '1 solicitud' : `${overdueRequests.length} solicitudes`}</span> en las que tienes tareas operativas pendientes.
          </p>

          <div className="w-full mt-6 space-y-3 max-h-60 overflow-y-auto custom-scrollbar p-1">
            {overdueRequests.map(req => (
              <div key={req.id} className="bg-white dark:bg-black/40 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-sm hover:border-luxury-red/50 transition-colors">
                <div className="flex-1 min-w-0 w-full">
                  <p className="text-xs font-black text-gray-900 dark:text-white uppercase truncate" title={req.title || req.proyecto}>
                    {req.title || req.proyecto}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                    Límite: <span className="text-luxury-red font-bold">{req.due_date ? new Date(req.due_date).toLocaleDateString('es-MX') : 'Sin fecha'}</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    handleDismiss();      // Lo mandamos a dormir 3 horas
                    onOpenTask(req);      // Y abrimos el modal de la tarea
                  }}
                  className="w-full sm:w-auto bg-luxury-red hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shrink-0 active:scale-95 cursor-pointer"
                >
                  Atender <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* BOTÓN CERRAR INFERIOR */}
          <div className="w-full mt-6">
            <button
              onClick={handleDismiss}
              className="text-[10px] text-gray-500 hover:text-gray-900 dark:hover:text-white font-black uppercase tracking-widest transition-colors cursor-pointer"
            >
              Cerrar aviso por ahora
            </button>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}