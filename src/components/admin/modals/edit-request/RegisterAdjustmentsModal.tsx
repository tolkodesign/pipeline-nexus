import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Loader2, ClipboardList, Building2, UserCheck, ArrowRight, User } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import Swal from 'sweetalert2';
import { useAuth } from '../../../../context/AuthContext';

interface RegisterAdjustmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: any;
  tasks: any[];
  onRefresh: () => void;
}

export default function RegisterAdjustmentsModal({ isOpen, onClose, request, tasks, onRefresh }: RegisterAdjustmentsModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  
  const [origin, setOrigin] = useState<'cliente' | 'agencia' | null>(null);
  const [discipline, setDiscipline] = useState('Diseño');
  
  const [selectedAssignee, setSelectedAssignee] = useState<string>('');
  const [availableAssignees, setAvailableAssignees] = useState<any[]>([]);

  const [currentText, setCurrentText] = useState('');
  const [adjustmentsList, setAdjustmentsList] = useState<string[]>([]);

  const disciplines = ['Contenido', 'Diseño', 'Audiovisual', 'Programación', 'Producción', 'Staff', 'RP'];

  const norm = (str: string) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() : "";

  useEffect(() => {
    const fetchAssignees = async () => {
      if (!discipline || !tasks || tasks.length === 0) {
        setAvailableAssignees([]);
        setSelectedAssignee('');
        return;
      }
      
      setFetchingUsers(true);
      try {
        const dbTask = tasks.find(t => norm(t.discipline) === norm(discipline));
        
        if (dbTask && dbTask.id) {
          const { data, error } = await supabase
            .from('task_assignees')
            .select(`
              profile_id,
              profiles!task_assignees_profile_id_fkey ( full_name )
            `)
            .eq('task_id', dbTask.id);
            
          if (error) throw error;

          if (data) {
            const assignees = data.map((a: any) => ({
              id: a.profile_id,
              name: a.profiles?.full_name || 'Usuario Desconocido'
            }));
            
            setAvailableAssignees(assignees);
            
            if (assignees.length > 0) {
              setSelectedAssignee(assignees[0].id);
            } else {
              setSelectedAssignee('');
            }
          }
        } else {
          setAvailableAssignees([]);
          setSelectedAssignee('');
        }
      } catch (err) {
        console.error("Error buscando asignados:", err);
      } finally {
        setFetchingUsers(false);
      }
    };

    if (isOpen) {
      fetchAssignees();
    }
  }, [discipline, tasks, isOpen]);

  if (!isOpen) return null;

  const handleAddRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentText.trim()) return;
    setAdjustmentsList([...adjustmentsList, currentText.trim()]);
    setCurrentText('');
  };

  const handleRemoveRow = (index: number) => {
    setAdjustmentsList(adjustmentsList.filter((_, i) => i !== index));
  };

  const handleSaveAdjustments = async () => {
    if (!origin || adjustmentsList.length === 0 || !request?.id || !selectedAssignee) {
      Swal.fire('Error', 'Debes seleccionar un colaborador responsable para recibir el ajuste.', 'warning');
      return;
    }

    setLoading(true);

    try {
      let dbTask = tasks.find(t => norm(t.discipline) === norm(discipline));
      let taskId = dbTask?.id;

      if (!taskId) throw new Error("No existe una tarea válida para esta área.");

      // 1. Textos a inyectar (Los bullets hermosos)
      const bulletsFormatted = adjustmentsList.map(desc => `• [${discipline.toUpperCase()}]: ${desc}`).join('\n');
      const injectionText = `🚨 CORRECCIONES DE ${origin.toUpperCase()}:\n${bulletsFormatted}`;

      // 2. Actualizar la tarea general
      const oldTaskNotes = dbTask?.delivery_notes ? `${dbTask.delivery_notes}\n\n` : '';
      const updatedTaskNotes = `${oldTaskNotes}${injectionText}`;

      const { error: taskErr } = await supabase
        .from('request_tasks')
        .update({ 
          status: 'con_correcciones',
          delivery_notes: updatedTaskNotes 
        })
        .eq('id', taskId);
      if (taskErr) throw taskErr;

      // 3. 🔥 SOLUCIÓN: INYECTAR DIRECTO AL COLABORADOR SELECCIONADO
      // Primero traemos lo que ya tenía escrito (para no borrarle su entrega)
      const { data: assigneeData } = await supabase
        .from('task_assignees')
        .select('delivery_notes')
        .match({ task_id: taskId, profile_id: selectedAssignee })
        .single();

      const oldAssigneeNotes = assigneeData?.delivery_notes ? `${assigneeData.delivery_notes}\n\n` : '';
      const updatedAssigneeNotes = `${oldAssigneeNotes}${injectionText}`;

      const { error: assigneeErr } = await supabase
        .from('task_assignees')
        .update({ 
          status: 'con_correcciones',
          delivery_notes: updatedAssigneeNotes 
        })
        .match({ task_id: taskId, profile_id: selectedAssignee });
      if (assigneeErr) throw assigneeErr;

      // 4. Inyectar en "task_adjustments" (Auditoría)
      const adjustmentsPayload = adjustmentsList.map(desc => ({
        task_id: taskId,
        description: desc,
        origin: origin,
        is_internal: origin === 'agencia',
        created_by: user?.id
      }));
      const { error: adjErr } = await supabase.from('task_adjustments').insert(adjustmentsPayload);
      if (adjErr) throw adjErr;

      // 5. Totalizador del Request
      const currentTotal = request.total_adjustments || 0;
      const { error: reqErr } = await supabase
        .from('requests')
        .update({ total_adjustments: currentTotal + adjustmentsList.length, status: 'en_proceso' })
        .eq('id', request.id);
      if (reqErr) throw reqErr;

      // 6. Notificación a la campana
      const { error: notifErr } = await supabase
        .from('notifications')
        .insert([{
          profile_id: selectedAssignee,
          title: 'Ajuste de Proyecto',
          message: `Te han asignado ${adjustmentsList.length} correcciones en el ticket #${request.id.slice(-6).toUpperCase()} (${request.title}).`,
          type: 'alert',
          action_link: `/dashboard?ticket=${request.id}`
        }]);
      if (notifErr) console.error("Error al notificar:", notifErr);

      Swal.fire({ title: '¡Ajustes Enviados!', text: `Las correcciones se inyectaron directamente en la tarjeta del colaborador.`, icon: 'success', confirmButtonColor: '#D3002D' });
      
      setOrigin(null);
      setAdjustmentsList([]);
      onRefresh();
      onClose();
    } catch (e: any) {
      Swal.fire('Error de Sincronización', e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-luxury-border w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-colors">
        
        <div className="p-5 bg-amber-600 flex justify-between items-center text-white">
          <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
            <ClipboardList size={16}/> Solicitud de cambios
          </div>
          <button onClick={() => { setOrigin(null); setAdjustmentsList([]); onClose(); }} className="hover:bg-black/20 p-1.5 rounded-lg transition-colors cursor-pointer"><X size={16}/></button>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1">
              1. Responsable del Ajuste (Origen) {origin && <ArrowRight size={10} className="text-green-500"/>}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setOrigin('cliente')} className={`p-4 rounded-xl border font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${origin === 'cliente' ? 'bg-purple-600/10 border-purple-500 text-purple-600 dark:text-purple-400 shadow-md' : 'bg-gray-50 dark:bg-black/40 border-gray-200 dark:border-zinc-800 text-gray-400 hover:border-gray-300'}`}>
                <Building2 size={16}/> Cambio de Cliente
              </button>
              <button type="button" onClick={() => setOrigin('agencia')} className={`p-4 rounded-xl border font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${origin === 'agencia' ? 'bg-amber-600/10 border-amber-500 text-amber-600 dark:text-amber-400 shadow-md' : 'bg-gray-50 dark:bg-black/40 border-gray-200 dark:border-zinc-800 text-gray-400 hover:border-gray-300'}`}>
                <UserCheck size={16}/> Cambio de Agencia
              </button>
            </div>
          </div>

          <div className={`space-y-4 transition-all duration-300 ${!origin ? 'opacity-35 pointer-events-none' : 'opacity-100'}`}>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                2. Área Destino de la Corrección
              </label>
              <select value={discipline} onChange={e => setDiscipline(e.target.value)} className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-zinc-800 rounded-xl p-3 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-amber-500 cursor-pointer">
                {disciplines.map(d => <option key={d} value={d}>{d.toUpperCase()}</option>)}
              </select>
            </div>

            <div className="space-y-1.5 relative">
              <label className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${availableAssignees.length === 0 && !fetchingUsers ? 'text-red-500' : 'text-amber-600 dark:text-amber-500'}`}>
                <User size={12}/> 3. Enviar ajuste directamente a:
              </label>
              
              {fetchingUsers ? (
                <div className="w-full bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-3 flex items-center gap-2 text-gray-500">
                  <Loader2 className="animate-spin" size={14} /> <span className="text-xs font-bold">Buscando equipo...</span>
                </div>
              ) : availableAssignees.length === 0 ? (
                <div className="w-full bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl p-3 text-xs font-bold text-red-600 outline-none flex items-center justify-between">
                  <span>¡ALERTA! Nadie está asignado aquí.</span>
                </div>
              ) : (
                <select value={selectedAssignee} onChange={e => setSelectedAssignee(e.target.value)} className="w-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-3 text-xs font-bold text-amber-900 dark:text-amber-400 outline-none focus:border-amber-500 cursor-pointer">
                  {availableAssignees.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              )}
            </div>
          </div>

          <div className={`space-y-2 transition-all duration-300 ${!origin || availableAssignees.length === 0 || fetchingUsers ? 'opacity-35 pointer-events-none' : 'opacity-100'}`}>
            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              4. Lista de ajustes
            </label>
            <form onSubmit={handleAddRow} className="flex gap-2">
              <input type="text" placeholder={origin ? `Escribe el ajuste para ${discipline.toUpperCase()}...` : "🔒 Bloqueado"} value={currentText} onChange={e => setCurrentText(e.target.value)} className="flex-1 bg-gray-50 dark:bg-black border border-gray-300 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs text-gray-900 dark:text-white outline-none focus:border-amber-500 shadow-inner" />
              <button disabled={!origin || availableAssignees.length === 0 || !currentText.trim()} type="submit" className="bg-gray-900 dark:bg-zinc-800 hover:bg-black disabled:opacity-50 text-white px-4 rounded-xl flex items-center justify-center cursor-pointer transition-colors"><Plus size={18}/></button>
            </form>

            <div className="border border-gray-200 dark:border-zinc-800 rounded-xl divide-y divide-gray-100 dark:divide-zinc-900 bg-gray-50/30 dark:bg-black/20 overflow-hidden mt-2">
              {adjustmentsList.length === 0 ? (
                <div className="p-6 text-center text-[11px] text-gray-400 font-bold uppercase tracking-wider">No has añadido cambios a la lista todavía</div>
              ) : (
                adjustmentsList.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-4 text-xs font-medium text-gray-700 dark:text-gray-300">
                    <span className="break-all select-text"><span className="text-amber-500 mr-1.5 font-bold">•</span>{item}</span>
                    <button type="button" onClick={() => handleRemoveRow(idx)} className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"><Trash2 size={14}/></button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        <div className="p-4 bg-gray-50 dark:bg-black/40 border-t border-gray-200 dark:border-zinc-800 flex justify-end">
          <button 
            type="button"
            disabled={loading || fetchingUsers || !origin || adjustmentsList.length === 0 || !selectedAssignee}
            onClick={handleSaveAdjustments}
            className="bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-md cursor-pointer active:scale-95 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={14}/> : <><Save size={14}/>Enviar cambios</>}
          </button>
        </div>

      </div>
    </div>
  );
}