import { useState, useEffect } from 'react';
import { X, ShieldAlert, Trash2, CheckCircle2, RefreshCw, Loader2, Database } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import Swal from 'sweetalert2';

interface DuplicateInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  requestTitle: string;
  onRefreshParent: () => void;
}

export default function DuplicateInspectorModal({
  isOpen,
  onClose,
  requestId,
  requestTitle,
  onRefreshParent
}: DuplicateInspectorModalProps) {
  const [loading, setLoading] = useState(false);
  const [rawRecords, setRawRecords] = useState<any[]>([]);

  const getCanonicalDiscipline = (input: string): string => {
    const s = (input || '').toLowerCase().trim();
    if (!s) return '';
    if (s.includes('dev') || s.includes('progra') || s.includes('code') || s === 'web' || s === 'needs_dev' || s.includes('plataforma')) return 'programacion';
    if (s.includes('desig') || s.includes('diseño') || s.includes('diseno') || s === 'needs_design') return 'diseno';
    if (s.includes('av') || s.includes('audio') || s.includes('video') || s === 'needs_av') return 'audiovisual';
    if (s.includes('copy') || s.includes('contenid') || s.includes('redac') || s === 'needs_copy') return 'contenido';
    if (s.includes('prod') || s === 'needs_prod') return 'produccion';
    if (s.includes('staff') || s === 'needs_staff') return 'staff';
    if (s.includes('rp') || s.includes('relacion') || s === 'needs_rp') return 'rp';
    return s;
  };

  useEffect(() => {
    if (isOpen && requestId) {
      fetchRawDbData();
    }
  }, [isOpen, requestId]);

  const fetchRawDbData = async () => {
    setLoading(true);
    try {
      const { data: tasks, error: taskErr } = await supabase
        .from('request_tasks')
        .select('id, discipline')
        .eq('request_id', requestId);

      if (taskErr) throw taskErr;

      if (!tasks || tasks.length === 0) {
        setRawRecords([]);
        return;
      }

      const taskIds = tasks.map(t => t.id);
      const { data: assignees, error } = await supabase
        .from('task_assignees')
        .select(`
          id,
          task_id,
          profile_id,
          status,
          deliverable_url,
          delivery_notes,
          created_at,
          profiles!task_assignees_profile_id_fkey ( full_name )
        `)
        .in('task_id', taskIds)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped = (assignees || []).map((a: any) => {
        const parentTask = tasks.find(t => t.id === a.task_id);
        return {
          ...a,
          discipline: parentTask?.discipline || 'Sin Área',
          colaborador: a.profiles?.full_name || 'Desconocido'
        };
      });

      setRawRecords(mapped);
    } catch (err: any) {
      console.error("Error auditando DB:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSingle = async (assigneeId: string, colabName: string) => {
    const isDark = document.documentElement.classList.contains('dark');
    const result = await Swal.fire({
      title: '¿Eliminar registro?',
      text: `Se borrará físicamente el registro de ${colabName}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#D3002D',
      background: isDark ? '#0F0F12' : '#fff',
      color: isDark ? '#fff' : '#1f2937'
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('task_assignees')
        .delete()
        .eq('id', assigneeId);

      if (error) throw error;

      Swal.fire({
        title: '¡Eliminado!',
        text: 'El registro fue removido de la BD.',
        icon: 'success',
        confirmButtonColor: '#D3002D'
      });

      await fetchRawDbData();
      onRefreshParent();
    } catch (e: any) {
      console.error("Error borrando asignación:", e);
      Swal.fire('Error', e.message || 'No se pudo eliminar', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeepOnlyThisOne = async (goodRecord: any) => {
    const isDark = document.documentElement.classList.contains('dark');
    const result = await Swal.fire({
      title: '⭐ Conservar este y purgar duplicados',
      text: `Se dejará vivo este registro (${goodRecord.status.toUpperCase()}) de ${goodRecord.colaborador} y se borrarán todos los demás duplicados.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'SÍ, LIMPIAR Y CONSERVAR ESTE',
      background: isDark ? '#0F0F12' : '#fff',
      color: isDark ? '#fff' : '#1f2937'
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      // 1. Obtener todas las tareas de este request
      const { data: matchedTasks, error: tasksErr } = await supabase
        .from('request_tasks')
        .select('id, discipline')
        .eq('request_id', requestId);

      if (tasksErr) throw tasksErr;

      const targetCanonical = getCanonicalDiscipline(goodRecord.discipline);
      const targetTasks = (matchedTasks || []).filter(
        t => getCanonicalDiscipline(t.discipline) === targetCanonical
      );
      const targetTaskIds = targetTasks.map(t => t.id);

      if (targetTaskIds.length > 0) {
        // 2. Eliminar todas las asignaciones duplicadas de este colaborador en esas tareas excepto la buena
        const { error: delErr } = await supabase
          .from('task_assignees')
          .delete()
          .in('task_id', targetTaskIds)
          .eq('profile_id', goodRecord.profile_id)
          .neq('id', goodRecord.id);

        if (delErr) throw delErr;

        // 3. Si existían tareas duplicadas en request_tasks, unificar todo a la tarea principal
        if (targetTasks.length > 1) {
          const mainTaskId = targetTasks[0].id;
          if (goodRecord.task_id !== mainTaskId) {
            await supabase
              .from('task_assignees')
              .update({ task_id: mainTaskId })
              .eq('id', goodRecord.id);
          }

          const secondaryTaskIds = targetTaskIds.filter(id => id !== mainTaskId);
          if (secondaryTaskIds.length > 0) {
            // Borrar tareas sobrantes si quedaron sin asignaciones
            await supabase
              .from('request_tasks')
              .delete()
              .in('id', secondaryTaskIds);
          }
        }
      }

      Swal.fire({
        title: '¡Base Limpia!',
        text: 'Se purgaron los duplicados exitosamente.',
        icon: 'success',
        confirmButtonColor: '#10b981'
      });

      await fetchRawDbData();
      onRefreshParent();
    } catch (e: any) {
      console.error("Error al purgar duplicados:", e);
      Swal.fire('Error', e.message || 'No se pudo purgar el registro', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const grouped = rawRecords.reduce((acc: any, curr: any) => {
    const key = `${getCanonicalDiscipline(curr.discipline)}-${curr.profile_id}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-[100005] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-luxury-border w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-950 flex justify-between items-center text-white shrink-0 border-b border-blue-800/50">
          <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
            <Database size={18} className="text-blue-400" /> Auditoría de Registros en Vivo (Supabase)
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchRawDbData} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer text-blue-200" title="Refrescar datos">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={onClose} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"><X size={18}/></button>
          </div>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 p-4 rounded-xl flex items-start gap-3">
            <ShieldAlert size={18} className="text-blue-500 shrink-0 mt-0.5" />
            <div className="text-xs text-gray-700 dark:text-gray-300">
              <p className="font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">Inspección de DB para: {requestTitle}</p>
              <p className="leading-relaxed">A continuación ves las filas **reales e individuales** guardadas en Supabase. Si ves más de 1 fila para la misma persona en la misma área, presiona <strong className="text-emerald-500">"CONSERVAR ESTE"</strong> en la versión con la entrega correcta.</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-400 font-bold uppercase tracking-widest border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">
              No hay registros de asignaciones en la base de datos para este ticket.
            </div>
          ) : (
            <div className="space-y-6">
              {Object.keys(grouped).map((groupKey) => {
                const groupItems = grouped[groupKey];
                const hasDuplicates = groupItems.length > 1;

                return (
                  <div key={groupKey} className={`border rounded-2xl p-4 space-y-3 transition-colors ${hasDuplicates ? 'bg-red-50/30 border-red-200 dark:bg-red-950/10 dark:border-red-900/40' : 'bg-gray-50/50 dark:bg-black/20 border-gray-200 dark:border-zinc-800'}`}>
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase text-gray-900 dark:text-white">{groupItems[0].colaborador}</span>
                        <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded uppercase">{groupItems[0].discipline}</span>
                      </div>
                      {hasDuplicates && (
                        <span className="text-[10px] font-black uppercase bg-red-600 text-white px-2.5 py-0.5 rounded-full animate-pulse">
                          ⚠️ {groupItems.length} FILAS DUPLICADAS
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {groupItems.map((rec: any) => (
                        <div key={rec.id} className="bg-white dark:bg-[#141419] border border-gray-200 dark:border-zinc-800 p-3 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="space-y-1 text-xs min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-gray-400">ID: ...{rec.id.slice(-8)}</span>
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${rec.status === 'aprobado_interno' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300'}`}>
                                {rec.status}
                              </span>
                            </div>
                            {rec.deliverable_url && (
                              <p className="text-[10px] text-blue-500 font-bold truncate">🔗 Link: {rec.deliverable_url}</p>
                            )}
                            <p className="text-[9px] text-gray-400 font-medium">Creado el: {new Date(rec.created_at).toLocaleString('es-MX')}</p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {hasDuplicates && (
                              <button
                                onClick={() => handleKeepOnlyThisOne(rec)}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                              >
                                <CheckCircle2 size={12} /> Conservar Este
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteSingle(rec.id, rec.colaborador)}
                              className="bg-red-50 hover:bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 text-[10px] font-black uppercase p-2 rounded-lg transition-all cursor-pointer"
                              title="Borrar Fila"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 dark:bg-black/40 border-t border-gray-200 dark:border-zinc-800 flex justify-end shrink-0">
          <button onClick={onClose} className="bg-gray-900 dark:bg-zinc-800 hover:bg-black text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase cursor-pointer">
            Cerrar Inspector
          </button>
        </div>

      </div>
    </div>
  );
}