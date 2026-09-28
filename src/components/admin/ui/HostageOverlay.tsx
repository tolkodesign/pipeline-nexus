import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X, ArrowRight, Minimize2, Maximize2 } from 'lucide-react';

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

  // DRAG & DROP Y CIRCLE MODE STATE
  const [position, setPosition] = useState<{ x: number, y: number } | null>(() => {
    const saved = localStorage.getItem('tolko_hostage_pos');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [isCircleMode, setIsCircleMode] = useState(() => {
    return localStorage.getItem('tolko_hostage_circle') === 'true';
  });

  const posRef = useRef(position);
  useEffect(() => { posRef.current = position; }, [position]);
  const wasDraggedRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Sólo clic izquierdo
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    let isDragging = false;
    const startX = e.clientX;
    const startY = e.clientY;
    wasDraggedRef.current = false;

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!isDragging && (Math.abs(moveEvent.clientX - startX) > 3 || Math.abs(moveEvent.clientY - startY) > 3)) {
        isDragging = true;
        wasDraggedRef.current = true;
        target.classList.remove('animate-bounce'); // Quitar animación al arrastrar
      }
      
      if (isDragging) {
        let newX = moveEvent.clientX - offsetX;
        let newY = moveEvent.clientY - offsetY;
        
        // Mantener dentro de la pantalla
        newX = Math.max(0, Math.min(newX, window.innerWidth - rect.width));
        newY = Math.max(0, Math.min(newY, window.innerHeight - rect.height));

        setPosition({ x: newX, y: newY });
      }
    };

    const onPointerUp = () => {
      if (isDragging && posRef.current) {
        localStorage.setItem('tolko_hostage_pos', JSON.stringify(posRef.current));
      }
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  };

  const handleFloatingClick = () => {
    if (wasDraggedRef.current) {
      wasDraggedRef.current = false;
      return;
    }
    setIsDismissed(false);
    localStorage.removeItem('tolko_hostage_snooze');
  };

  const toggleCircleMode = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que abra el modal
    const newVal = !isCircleMode;
    setIsCircleMode(newVal);
    localStorage.setItem('tolko_hostage_circle', String(newVal));
  };

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
    const style: React.CSSProperties = position 
      ? { left: position.x, top: position.y, right: 'auto', bottom: 'auto' }
      : { bottom: '24px', right: '24px' };

    return createPortal(
      <div 
        onPointerDown={handlePointerDown}
        onClick={handleFloatingClick}
        style={style}
        className={`fixed z-[90000] bg-luxury-red hover:bg-red-700 text-white shadow-[0_10px_25px_rgba(211,0,45,0.4)] flex items-center justify-center transition-colors cursor-grab active:cursor-grabbing group ${!position ? 'animate-bounce' : ''} ${isCircleMode ? 'w-14 h-14 rounded-full' : 'p-3 md:px-5 md:py-3 rounded-full gap-2'}`}
        title="Ver cierres solicitados (Arrastra para mover)"
      >
        {isCircleMode ? (
          <>
            <span className="text-xl font-black">{overdueRequests.length}</span>
            <button 
              onClick={toggleCircleMode}
              className="absolute -top-1 -right-1 bg-white text-luxury-red rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              title="Expandir"
            >
              <Maximize2 size={12} strokeWidth={3} />
            </button>
          </>
        ) : (
          <>
            <AlertTriangle size={20} className="shrink-0" />
            <span className="hidden md:block text-xs font-black uppercase tracking-widest select-none">
              {overdueRequests.length} Cierre{overdueRequests.length !== 1 ? 's' : ''} Pendiente{overdueRequests.length !== 1 ? 's' : ''}
            </span>
            <button 
              onClick={toggleCircleMode}
              className="ml-1 bg-black/10 hover:bg-black/20 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Minimizar a círculo"
            >
              <Minimize2 size={12} strokeWidth={3} />
            </button>
          </>
        )}
      </div>,
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