import { useState } from 'react';
import { X, ExternalLink, CheckCircle2, AlertCircle, Loader2, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  task: any | null; // La sub-tarea específica (Diseño, Contenido, etc.)
  projectName: string; // Nombre del proyecto padre (ej: Presentación)
  onRefresh: () => void;
}

export default function ClientReviewModal({ isOpen, onClose, task, projectName, onRefresh }: Props) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !task) return null;

  // 🟢 1. EL CLIENTE AUTORIZA LA PIEZA
  const handleApprove = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('request_tasks')
        .update({ status: 'aprobado' })
        .eq('id', task.id);

      if (error) throw error;

      await supabase.from('audit_logs').insert([{
        table_name: 'request_tasks',
        record_id: task.id,
        action: 'CLIENT_TASK_APPROVED',
        new_data: { status: 'aprobado', discipline: task.discipline, project: projectName },
        performed_by: task.assigned_to
      }]);

      Swal.fire({
        title: '¡ENTREGABLE APROBADO!',
        text: `El área de ${task.discipline} se ha cerrado con éxito. ¡A darle!`,
        icon: 'success',
        background: '#0F0F12', color: '#fff', confirmButtonColor: '#D3002D'
      });
      
      onRefresh();
      onClose();
    } catch (err: any) {
      Swal.fire({ title: 'Error', text: err.message, icon: 'error', background: '#0F0F12', color: '#fff' });
    } finally {
      setLoading(false);
    }
  };

  // 🔴 2. EL CLIENTE RECHAZA Y PIDE CAMBIOS
  const handleReject = async () => {
    const { value: text } = await Swal.fire({
      title: `¿Qué ajustes requiere ${task.discipline}?`,
      input: 'textarea',
      inputPlaceholder: 'Escribe con lujo de detalle los cambios que necesitas para que el equipo los aplique de inmediato...',
      showCancelButton: true,
      confirmButtonColor: '#D3002D',
      cancelButtonColor: '#1E1E24',
      background: '#0F0F12', color: '#fff'
    });

    if (!text) return;

    setLoading(true);
    try {
      const historialNotas = task.delivery_notes ? `${task.delivery_notes}\n\n` : '';
      const notasActualizadas = `${historialNotas}[FEEDBACK CLIENTE]: ${text}`.trim();

      const { error } = await supabase
        .from('request_tasks')
        .update({ 
          status: 'con_correcciones',
          delivery_notes: notasActualizadas
        })
        .eq('id', task.id);

      if (error) throw error;

      await supabase.from('audit_logs').insert([{
        table_name: 'request_tasks',
        record_id: task.id,
        action: 'CLIENT_TASK_REJECTED',
        new_data: { status: 'con_correcciones', discipline: task.discipline, feedback: text },
        performed_by: task.assigned_to
      }]);

      Swal.fire({
        title: 'Solicitud de Ajustes Enviada',
        text: 'Nuestros creadores ya fueron notificados y comenzarán a trabajar en los cambios.',
        icon: 'info',
        background: '#0F0F12', color: '#fff'
      });
      
      onRefresh();
      onClose();
    } catch (err: any) {
      Swal.fire({ title: 'Error', text: err.message, icon: 'error', background: '#0F0F12', color: '#fff' });
    } finally {
      setLoading(false);
    }
  };

  // 🔥 MAPEADO SEGURO EXTRACTOR: Buscamos la relación de la organización o solicitudes heredadas del join
  const parsedOrgName = task?.requests?.organizations?.name || task?.requests?.organization_name || task?.organization_name || 'EMPRESA';
  const parsedProjectName = projectName || task?.requests?.title || 'SOLICITUD';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* TEMA OSCURO PREMIUM APLICADO */}
      <div className="bg-[#0F0F12] border border-luxury-border w-full max-w-2xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col relative">
        
        {/* BOTÓN CERRAR */}
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors cursor-pointer">
          <X size={20} />
        </button>

        {/* HEADER ROJO CON FORMATO MAPEADO: "EMPRESA - SOLICITUD" */}
        <div className="p-8 bg-[#141419] border-b border-luxury-border">
          <span className="text-[10px] bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full text-purple-400 font-black uppercase tracking-widest">
            Filtro de Entregable • {task.discipline}
          </span>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mt-3">
            {parsedOrgName} - {parsedProjectName}
          </h2>
          <p className="text-gray-500 text-xs mt-1">Por favor revisa el material propuesto por la agencia antes de autorizar o solicitar ajustes.</p>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="p-8 space-y-6 flex-1 bg-[#0B0B0E]">
          
          {/* NOTAS DEL EQUIPO */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <MessageSquare size={12}/> Comentarios del Equipo Creativo
            </label>
            <div className="bg-[#070709] border border-luxury-border p-4 rounded-xl text-sm text-gray-300 leading-relaxed whitespace-pre-wrap italic shadow-inner">
              {task.delivery_notes ? task.delivery_notes.replace('[CORRECCIÓN LÍDER]:', '') : 'El equipo preparó este entregable listo para producción.'}
            </div>
          </div>

          {/* BOTÓN DE ACCESO AL LINK EXTERNO */}
          <div className="pt-2">
            <a 
              href={task.deliverable_url} 
              target="_blank" 
              rel="noreferrer"
              className="w-full bg-[#141419] border border-luxury-border hover:border-purple-500/50 text-white p-5 rounded-2xl font-bold text-sm flex items-center justify-between group transition-all shadow-lg shadow-black/40"
            >
              <div className="flex items-center gap-3">
                <div className="bg-purple-600/10 p-2.5 rounded-xl text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <ExternalLink size={18}/>
                </div>
                <div className="text-left">
                  <p className="text-white font-black text-sm">Abrir Enlace del Entregable</p>
                  <p className="text-gray-500 text-[11px] font-medium truncate max-w-[320px] sm:max-w-md">{task.deliverable_url}</p>
                </div>
              </div>
              <span className="text-xs text-purple-400 font-bold group-hover:translate-x-1 transition-transform">Ver Pieza →</span>
            </a>
          </div>

        </div>

        {/* OPERACIONES / FOOTER */}
        <div className="p-6 bg-[#141419] border-t border-luxury-border grid grid-cols-2 gap-4">
          
          {/* BOTÓN RECHAZAR */}
          <button 
            disabled={loading}
            onClick={handleReject}
            className="border border-luxury-border hover:border-red-600/30 bg-black/20 hover:bg-red-950/10 text-gray-400 hover:text-red-500 py-4 rounded-xl text-xs font-black tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <AlertCircle size={14}/> PEDIR AJUSTES
          </button>

          {/* BOTÓN AUTORIZAR */}
          <button 
            disabled={loading}
            onClick={handleApprove}
            className="bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl text-xs font-black tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(34,197,94,0.2)] cursor-pointer"
          >
            {loading ? <Loader2 className="animate-spin" size={14}/> : <CheckCircle2 size={14}/>}
            AUTORIZAR ENTREGA
          </button>

        </div>

      </div>
    </div>
  );
}