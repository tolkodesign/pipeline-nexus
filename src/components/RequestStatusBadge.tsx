// src/components/shared/RequestStatusBadge.tsx
import { CheckCircle2, Clock, MessageSquare, AlertCircle, XCircle } from 'lucide-react';

interface Props {
  status: 'pendiente' | 'en_proceso' | 'revision' | 'entregado' | 'cancelado' | 'contrapropuesta'; // 🔥 Agregamos el nuevo estado al tipo
}

export default function RequestStatusBadge({ status }: Props) {
  const getStatusConfig = () => {
    switch (status) {
      case 'pendiente':
        return { color: 'text-gray-400 bg-gray-500/10 border-gray-500/20', icon: <Clock size={12} />, text: 'PENDIENTE' };
      case 'en_proceso':
        return { color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: <AlertCircle size={12} />, text: 'EN PROCESO' };
      case 'revision':
        return { color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', icon: <MessageSquare size={12} />, text: 'EN REVISIÓN' };
      case 'entregado':
        return { color: 'text-green-400 bg-green-500/10 border-green-500/20', icon: <CheckCircle2 size={12} />, text: 'ENTREGADO' };
      case 'cancelado':
        return { color: 'text-red-400 bg-red-500/10 border-red-500/20', icon: <XCircle size={12} />, text: 'CANCELADO' };
      // 🔥 REGLA DE NEGOCIACIÓN: Estilizado ámbar con pulso de advertencia para exigir la firma del partner
      case 'contrapropuesta':
        return { color: 'text-amber-400 bg-amber-500/10 border-amber-500/20 animate-pulse font-black', icon: <AlertCircle size={12} />, text: 'POR CONFIRMAR' };
      default:
        return { color: 'text-gray-400 bg-gray-500/10 border-gray-500/20', icon: <Clock size={12} />, text: 'DESCONOCIDO' };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-full border ${config.color}`}>
      {config.icon}
      {config.text}
    </span>
  );
}