import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { CheckCircle2, AlertCircle, Send, ExternalLink, MessageSquare, Loader2, ShieldAlert } from 'lucide-react';
import Swal from 'sweetalert2';

interface Task {
  id: string;
  discipline: string;
  status: string;
  deliverable_url?: string;
  delivery_notes?: string;
}

interface Props {
  requestId: string;
  tasks: Task[];
  requestData: {
    needs_design: boolean;
    needs_dev: boolean;
    needs_av: boolean;
    needs_copy: boolean;
  };
  onRefresh: () => void;
}

export default function AdminTaskReview({ requestId, tasks, requestData, onRefresh }: Props) {
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);

  // Extract unique disciplines directly from the tasks array
  // This supports any new dynamic specialty dynamically without needing needs_* booleans
  const activeDisciplines = tasks.map(t => ({
    key: t.id,
    label: t.discipline,
    name: t.discipline
  }));

  const handleInternalApprove = async (taskId: string) => {
    setLoadingTaskId(taskId);
    try {
      const { error } = await supabase
        .from('request_tasks')
        .update({ status: 'aprobado_interno' })
        .eq('id', taskId);

      if (error) throw error;
      onRefresh();
    } catch (error: any) {
      Swal.fire({ title: 'Error', text: error.message, icon: 'error', background: '#0F0F12', color: '#fff' });
    } finally { setLoadingTaskId(null); }
  };

  const handlePushToClient = async (taskId: string) => {
    setLoadingTaskId(taskId);
    try {
      const { error } = await supabase
        .from('request_tasks')
        .update({ status: 'en_revision_cliente' })
        .eq('id', taskId);

      if (error) throw error;
      
      Swal.fire({
        title: '¡ENVIADO AL CLIENTE!',
        text: 'Esta entrega ya está visible en el portal del cliente.',
        icon: 'success',
        background: '#0F0F12', color: '#fff', confirmButtonColor: '#D3002D'
      });
      onRefresh();
    } catch (error: any) {
      Swal.fire({ title: 'Error', text: error.message, icon: 'error', background: '#0F0F12', color: '#fff' });
    } finally { setLoadingTaskId(null); }
  };

  const handleSendCorrections = async (taskId: string) => {
    const { value: text } = await Swal.fire({
      title: '¿Qué correcciones requiere?',
      input: 'textarea',
      inputPlaceholder: 'Escribe detalladamente qué cambios se necesitan...',
      showCancelButton: true,
      confirmButtonColor: '#D3002D',
      cancelButtonColor: '#1E1E24',
      background: '#0F0F12', color: '#fff'
    });

    if (!text) return;

    setLoadingTaskId(taskId);
    try {
      const { error } = await supabase
        .from('request_tasks')
        .update({ 
          status: 'con_correcciones',
          delivery_notes: `[FEEDBACK INTERNO]: ${text}`
        })
        .eq('id', taskId);

      if (error) throw error;
      onRefresh();
    } catch (error: any) {
      Swal.fire({ title: 'Error', text: error.message, icon: 'error', background: '#0F0F12', color: '#fff' });
    } finally { setLoadingTaskId(null); }
  };

  const renderStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pendiente: 'bg-zinc-800 text-zinc-400 border-zinc-700/50',
      con_correcciones: 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse font-black',
      entregado: 'bg-amber-500/10 text-amber-400 border-amber-500/20 font-bold',
      aprobado_interno: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      en_revision_cliente: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      aprobado: 'bg-green-500/10 text-green-400 border-green-500/20'
    };
    return (
      <span className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-md border ${styles[status] || styles.pendiente}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="space-y-5 bg-black/40 p-6 rounded-2xl border border-zinc-800/60">
      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-zinc-900 pb-3">
        Control de Calidad 
      </h3>

      <div className="space-y-4">
        {activeDisciplines.map(discipline => {
          const task = tasks.find(t => t.discipline.toLowerCase() === discipline.name.toLowerCase());
          const currentStatus = task?.status || 'pendiente';
          const isCorrection = currentStatus === 'con_correcciones';

          return (
            <div 
              key={discipline.key} 
              className={`border rounded-xl p-5 flex flex-col gap-4 transition-all ${
                isCorrection 
                  ? 'bg-red-950/5 border-red-900/40 border-l-4 border-l-red-600' 
                  : 'bg-[#070709] border-zinc-800/80'
              }`}
            >
              
              {/* FILA SUPERIOR: INFORMACIÓN E INDICADOR */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                <div className="flex items-center gap-3">
                  <span className="text-base font-black text-white">{discipline.label}</span>
                  {renderStatusBadge(currentStatus)}
                </div>

                {/* BOTONES DE ACCIÓN (MÁS GRANDES Y LIMPIOS) */}
                <div className="flex flex-wrap items-center gap-2">
                  {currentStatus === 'entregado' && task && (
                    <>
                      <a href={task.deliverable_url} target="_blank" rel="noreferrer" className="bg-white/5 hover:bg-white/10 border border-zinc-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors">
                        <ExternalLink size={14}/> Ver Link
                      </a>
                      <button 
                        disabled={loadingTaskId !== null}
                        onClick={() => handleSendCorrections(task.id)}
                        className="bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/40 px-4 py-2.5 rounded-xl text-xs font-black tracking-wide flex items-center gap-1.5 transition-all"
                      >
                        <AlertCircle size={14}/> Regresar
                      </button>
                      <button 
                        disabled={loadingTaskId !== null}
                        onClick={() => handleInternalApprove(task.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-xs font-black tracking-wide flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                      >
                        {loadingTaskId === task?.id ? <Loader2 className="animate-spin" size={14}/> : <CheckCircle2 size={14}/>}
                        Aprobar Interno
                      </button>
                    </>
                  )}

                  {currentStatus === 'aprobado_interno' && task && (
                    <button 
                      disabled={loadingTaskId !== null}
                      onClick={() => handlePushToClient(task.id)}
                      className="bg-luxury-red hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-black tracking-widest flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(211,0,45,0.3)]"
                    >
                      {loadingTaskId === task?.id ? <Loader2 className="animate-spin" size={14}/> : <Send size={14}/>}
                      MANDAR A REVISIÓN CLIENTE
                    </button>
                  )}
                </div>
              </div>

              {/* 🔥 COFRE DE NOTAS REDISEÑADO: TEXTO GRANDE Y EXPLICITO */}
              {task?.delivery_notes && (
                <div className={`p-4 rounded-xl text-sm leading-relaxed border ${
                  isCorrection 
                    ? 'bg-red-950/20 border-red-900/30 text-red-200' 
                    : 'bg-black/40 border-zinc-900 text-gray-300'
                }`}>
                  <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider mb-1.5 text-gray-400">
                    {isCorrection ? <ShieldAlert size={14} className="text-red-500" /> : <MessageSquare size={14} />}
                    Historial de ajustes:
                  </div>
                  <p className="whitespace-pre-line font-medium text-sm">
                    {task.delivery_notes}
                  </p>
                </div>
              )}

              {/* MENSAJES DE ESPERA EXPLICITOS */}
              <div className="text-sm font-medium">
                {currentStatus === 'pendiente' && (
                  <p className="text-gray-500 italic flex items-center gap-2"><Loader2 size={14} className="animate-spin"/> El ejecutivo asignado aún no sube su propuesta...</p>
                )}
                {currentStatus === 'con_correcciones' && (
                  <p className="text-red-400 font-bold flex items-center gap-2">⚠️ El creador ya fue notificado y está aplicando los ajustes solicitados justo ahora.</p>
                )}
                {currentStatus === 'en_revision_cliente' && (
                  <p className="text-purple-400 font-bold flex items-center gap-2">⏱️ Entregado con éxito. Esperando decisión o feedback de cambios por parte del Partner.</p>
                )}
                {currentStatus === 'aprobado' && (
                  <p className="text-green-400 font-black flex items-center gap-1.5">🎉 ¡Pieza aprobada y firmada al 100% por el cliente!</p>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}