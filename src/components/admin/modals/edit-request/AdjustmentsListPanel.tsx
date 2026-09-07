// components/admin/modals/edit-request/AdjustmentsListPanel.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { BarChart3, ShieldAlert, CheckCircle2, User, Building2, HelpCircle, Loader2 } from 'lucide-react';

interface AdjustmentsListPanelProps {
  requestId: string;
  tasks: any[];
  refreshTrigger: boolean; // Para re-renderizar cuando el modal de registro inyecte cambios
}

export default function AdjustmentsListPanel({ requestId, tasks, refreshTrigger }: AdjustmentsListPanelProps) {
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (requestId) {
      fetchGlobalAdjustments();
    }
  }, [requestId, refreshTrigger, tasks]);

  const fetchGlobalAdjustments = async () => {
    setLoading(false);
    try {
      // Jalamos todos los ajustes de todas las tareas amarradas a este ticket
      const taskIds = tasks.map(t => t.id);
      if (taskIds.length === 0) {
        setAdjustments([]);
        return;
      }

      const { data, error } = await supabase
        .from('task_adjustments')
        .select('*')
        .in('task_id', taskIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setAdjustments(data);
    } catch (e: any) {
      console.error("Error jalando auditoría de cambios:", e.message);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'pendiente' ? 'resuelto' : 'pendiente';
    try {
      const { error } = await supabase
        .from('task_adjustments')
        .update({ 
          status: nextStatus,
          resolved_at: nextStatus === 'resuelto' ? new Date().toISOString() : null
        })
        .eq('id', id);

      if (error) throw error;
      setAdjustments(adjustments.map(a => a.id === id ? { ...a, status: nextStatus } : a));
    } catch (e: any) {
      console.error(e.message);
    }
  };

  // 🧮 MATEMÁTICAS CLÍNICAS (Métricas del ticket)
  const totalAgencia = adjustments.filter(a => a.origin === 'agencia').length;
  const totalCliente = adjustments.filter(a => a.origin === 'cliente').length;
  const totalInternos = adjustments.filter(a => a.is_internal === true).length;

  // Encontrar a qué disciplina pertenece cada ajuste para ponerle su etiqueta
  const getDisciplineName = (taskId: string) => {
    const t = tasks.find(task => task.id === taskId);
    return t ? t.discipline : 'General';
  };

  return (
    <div className="bg-white dark:bg-[#0e0e12] border border-gray-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm transition-all duration-300 w-full">
      
      {/* HEADER DEL PANEL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 dark:border-zinc-900 pb-4 mb-5 gap-3">
        <div className="space-y-0.5">
          <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
            <BarChart3 size={15} className="text-amber-500" /> Auditoría General de Ajustes
          </h4>
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Historial acumulado y rendimiento de la orden</p>
        </div>

        {/* CONTADORES EN TIEMPO REAL */}
        <div className="flex gap-2">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 px-3 py-1.5 rounded-xl text-center min-w-[75px]">
            <span className="block text-[8px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">Agencia</span>
            <span className="text-xs font-black text-amber-700 dark:text-amber-400">{totalAgencia}</span>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 px-3 py-1.5 rounded-xl text-center min-w-[75px]">
            <span className="block text-[8px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider">Cliente</span>
            <span className="text-xs font-black text-purple-700 dark:text-purple-400">{totalCliente}</span>
          </div>
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 px-3 py-1.5 rounded-xl text-center min-w-[75px]">
            <span className="block text-[8px] font-black text-red-600 dark:text-red-400 tracking-wider uppercase">Internos</span>
            <span className="text-xs font-black text-red-700 dark:text-red-400">{totalInternos}</span>
          </div>
        </div>
      </div>

      {/* LISTADO DE CORRECCIONES */}
      {loading ? (
        <div className="flex justify-center py-6"><Loader2 className="animate-spin text-gray-400" size={18}/></div>
      ) : adjustments.length === 0 ? (
        <div className="border border-dashed border-gray-200 dark:border-zinc-900 p-6 rounded-xl text-center text-xs text-gray-400 font-medium uppercase tracking-wider bg-gray-50/50 dark:bg-black/10">
          Sin registros de cambios en este ticket, pa. ¡Todo limpio!
        </div>
      ) : (
        <div className="border border-gray-200 dark:border-zinc-800 rounded-xl divide-y divide-gray-100 dark:divide-zinc-900 overflow-hidden bg-gray-50/20 dark:bg-black/10">
          {adjustments.map((adj) => {
            const discName = getDisciplineName(adj.task_id);
            const isResuelto = adj.status === 'resuelto';

            return (
              <div 
                key={adj.id} 
                className={`p-3.5 flex items-start justify-between gap-4 transition-colors group ${
                  isResuelto ? 'bg-gray-50/60 dark:bg-black/20 opacity-50' : 'hover:bg-gray-50 dark:hover:bg-black/20'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {/* Checkbox de estado */}
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(adj.id, adj.status)}
                    className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      isResuelto 
                        ? 'bg-green-600 border-green-600 text-white' 
                        : 'border-gray-300 dark:border-zinc-700 hover:border-amber-500 bg-white dark:bg-black'
                    }`}
                  >
                    {isResuelto && <CheckCircle2 size={11} strokeWidth={3}/>}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-semibold text-gray-800 dark:text-gray-200 break-words leading-relaxed select-text ${
                      isResuelto ? 'line-through text-gray-400 dark:text-zinc-500' : ''
                    }`}>
                      {adj.description}
                    </p>
                    
                    {/* Fila de Tags / Badges */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap text-[8px] font-black uppercase tracking-wider">
                      {/* Badge del Área Destino */}
                      <span className="bg-gray-200/70 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 px-1.5 py-0.5 rounded">
                        {discName}
                      </span>
                      {/* Badge de Origen */}
                      <span className={`px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                        adj.origin === 'agencia' 
                          ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' 
                          : 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400'
                      }`}>
                        {adj.origin === 'agencia' ? <User size={8}/> : <Building2 size={8}/>} {adj.origin}
                      </span>
                      {/* Badge de Filtro Interno */}
                      {adj.is_internal && (
                        <span className="bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 px-1.5 py-0.5 rounded">
                          Filtro Interno
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}