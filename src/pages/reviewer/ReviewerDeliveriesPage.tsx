import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { CheckCircle2, Loader2, Link } from 'lucide-react';

export default function ReviewerDeliveriesPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveredTasks();
  }, []);

  const fetchDeliveredTasks = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('request_tasks')
        .select(`
          *,
          task_assignees!inner(profile_id, status, deliverable_url),
          requests (
            title, is_active,
            organizations ( name )
          )
        `)
        .eq('task_assignees.profile_id', user.id)
        .in('task_assignees.status', ['entregado', 'aprobado_interno', 'en_revision_cliente', 'aprobado']) // 🔥 Filtra por SU estado
        .order('created_at', { ascending: false });

      if (error) throw error;

      const validTasks = (data || []).filter((t: any) => {
        const reqDataRaw = Array.isArray(t.requests) ? t.requests[0] : t.requests;
        return reqDataRaw?.is_active !== false;
      });

      setTasks(validTasks.map((t: any) => {
        const orgData = t.requests?.organizations;
        const orgName = Array.isArray(orgData) ? orgData[0]?.name : orgData?.name;
        
        // 🔥 Jala la data específica del colaborador logueado
        const assignerList = Array.isArray(t.task_assignees) ? t.task_assignees : [t.task_assignees];
        const myAssignment = assignerList.find((a: any) => a.profile_id === user.id) || {};

        return {
          id: t.id,
          discipline: t.discipline,
          status: myAssignment.status || 'entregado',
          projectName: t.requests?.title || 'Sin Título',
          clientName: orgName || 'Desconocido',
          deliverable_url: myAssignment.deliverable_url // 🔥 Link de este usuario en específico
        };
      }));
    } catch (error) {
      console.error("Error al cargar repositorio histórico:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full pb-32 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Mis <span className="text-green-500">Entregas</span></h1>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1 font-medium">Bitácora histórica de piezas entregadas o aprobadas.</p>
      </div>

      <div className="space-y-4 mt-8">
        <h2 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2 border-b border-gray-200 dark:border-zinc-800/80 pb-2">
          <CheckCircle2 size={14} className="text-green-500"/> Repositorio Completado ({tasks.length})
        </h2>

        {loading ? (
          <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-green-500" size={24}/></div>
        ) : tasks.length === 0 ? (
          <div className="bg-white dark:bg-[#141419] border border-gray-200 dark:border-zinc-800/40 rounded-2xl p-12 text-center text-gray-400 font-medium">
            Aún no registras entregas completas.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {tasks.map(task => (
              <div key={task.id} className="bg-white dark:bg-[#141419] border border-gray-200 dark:border-zinc-800/60 rounded-xl p-5 flex flex-col justify-between h-44 group hover:border-gray-300 dark:hover:border-zinc-700 transition-all shadow-sm">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 font-bold uppercase px-2 py-0.5 rounded">{task.discipline}</span>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${task.status === 'aprobado' ? 'text-green-600 dark:text-green-400' : 'text-blue-500 dark:text-cyan-400'}`}>
                      {task.status.replace('_',' ')}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white truncate uppercase tracking-wide">{task.projectName}</h3>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold truncate mt-0.5 uppercase">{task.clientName}</p>
                </div>
                {task.deliverable_url && (
                  <a href={task.deliverable_url} target="_blank" rel="noreferrer" className="text-[11px] text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#070709] py-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors shadow-inner">
                    <Link size={12} className="text-luxury-red"/> Ver material enviado
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}