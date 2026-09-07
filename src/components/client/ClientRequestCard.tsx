import { useState } from 'react';
import { LayoutGrid, ArrowRight, AlertCircle } from 'lucide-react';
import ClientRequestDetailsModal from './ClientRequestDetailsModal';

interface Props {
  req: any;
  onRefresh: () => void;
}

export default function ClientRequestCard({ req, onRefresh }: Props) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Cuenta cuántos elementos están esperando firma del partner justo ahora
  const pendingReviewsCount = req.request_tasks?.filter((t: any) => t.status === 'en_revision_cliente').length || 0;

  // 🔥 Identificamos si el ticket está congelado por contrapropuesta operativa
  const isContrapropuesta = req.status === 'contrapropuesta';

  // 🔥 MAGIA: Función interna para pintar el estatus sin depender del archivo viejo
  const renderStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pendiente: 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-gray-200 dark:border-zinc-700/50',
      en_proceso: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
      contrapropuesta: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
      en_revision_cliente: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20',
      completado: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20'
    };
    
    // Si no lo encuentra, lo pone gris por defecto, pero ya NO dice "Desconocido"
    const appliedStyle = styles[status] || styles.pendiente;
    const label = status.replace(/_/g, ' ');

    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border flex items-center justify-center ${appliedStyle}`}>
        {label}
      </span>
    );
  };

  return (
    <>
      <div 
        onClick={() => setIsDetailsOpen(true)}
        // 🔥 MODIFICADO: Si es contrapropuesta, la tarjeta se ilumina en ámbar para exigir atención del cliente
        className={`p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center group transition-all cursor-pointer select-none relative shadow-sm dark:shadow-none ${
          isContrapropuesta 
            ? 'bg-amber-500/5 dark:bg-amber-500/[0.02] border border-amber-500/40 dark:border-amber-500/30 shadow-md shadow-amber-500/5' 
            : 'bg-white dark:bg-[#141419] border border-gray-200 dark:border-luxury-border hover:border-luxury-red/40 dark:hover:border-gray-600'
        }`}
      >
        <div className="flex items-center gap-6 w-full md:w-auto">
          {/* Ícono central adaptado al tema */}
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center group-hover:scale-105 transition-transform ${
            isContrapropuesta 
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
              : 'bg-gray-50 dark:bg-[#0F0F12] border-gray-200 dark:border-luxury-border text-luxury-red'
          }`}>
            <LayoutGrid size={20}/>
          </div>
          
          <div>
            {/* Título dinámico */}
            <h4 className="text-gray-900 dark:text-white font-bold text-base flex items-center gap-2 transition-colors flex-wrap">
              {req.title}
              {pendingReviewsCount > 0 && (
                <span className="bg-purple-600 text-white text-[9px] font-black px-2 py-0.5 uppercase rounded-full animate-pulse tracking-wider shadow-sm">
                  {pendingReviewsCount} revisión
                </span>
              )}
              {/* 🔥 NUEVO BADGE: Alerta visual instantánea al lado del título */}
              {isContrapropuesta && (
                <span className="bg-amber-500 dark:bg-amber-500 text-black dark:text-black text-[9px] font-black px-2 py-0.5 uppercase rounded-md tracking-wider flex items-center gap-1 animate-pulse shadow-sm">
                  <AlertCircle size={10} strokeWidth={3}/> Acción Requerida
                </span>
              )}
            </h4>
            
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 transition-colors">
                {req.request_categories?.name || 'General'}
              </span>
              <span className="text-[10px] text-gray-400 dark:text-gray-600">•</span>
              <span className="text-[10px] font-bold drop-shadow-sm" style={{ color: req.priorities?.color_code }}>
                PRIORIDAD {req.priorities?.level?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
          
          {/* 🔥 AQUÍ MANDAMOS A LLAMAR A NUESTRA NUEVA FUNCIÓN */}
          {renderStatusBadge(req.status)}
          
          <div className="text-right min-w-[100px]">
            <p className="text-[10px] text-gray-500 dark:text-gray-600 uppercase font-bold transition-colors">Solicitado el</p>
            <p className="text-xs text-gray-800 dark:text-gray-400 font-medium transition-colors">{new Date(req.created_at).toLocaleDateString()}</p>
          </div>
          
          <ArrowRight size={16} className={`group-hover:translate-x-1 transition-all hidden md:block ${isContrapropuesta ? 'text-amber-500 group-hover:text-amber-400' : 'text-gray-400 dark:text-gray-600 group-hover:text-luxury-red dark:group-hover:text-luxury-red'}`} />
        </div>
      </div>

      {/* MODAL DETALLADO INTEGRADO */}
      <ClientRequestDetailsModal 
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        request={req}
        onRefresh={onRefresh}
      />
    </>
  );
}