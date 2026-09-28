import { Mail, Phone, Trash2, Edit2, RotateCcw, FolderKanban } from 'lucide-react';
import { getNormalizedRole } from '../../../lib/identity';

interface TeamListRowProps {
  member: any;
  onEdit: () => void; 
  onDelete?: () => void;
  onRestore?: () => void;
  onViewTasks?: () => void;
  isHistorial?: boolean;
  isAdminUser?: boolean;
}

export default function TeamListRow({ member, onEdit, onDelete, onRestore, onViewTasks, isHistorial, isAdminUser }: TeamListRowProps) {
  

  const displayRole = getNormalizedRole(member.role_id);
     
    

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors duration-300 group border-b border-gray-200 dark:border-luxury-border/50 last:border-0">
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img 
              src={member.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.full_name || 'X')}&background=1E1E24&color=D3002D`} 
              className={`w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-luxury-border group-hover:border-luxury-red transition-colors duration-300 ${isHistorial ? 'grayscale opacity-60' : ''}`} 
              alt={member.full_name} 
            />
            {!isHistorial && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-luxury-dark rounded-full transition-colors duration-300"></div>}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-white tracking-tight transition-colors duration-300 truncate uppercase">{member.full_name}</p>
            <p className="text-[10px] text-luxury-red font-black uppercase tracking-widest truncate">{member.specialty || 'General'}</p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex flex-col gap-2 items-start">
          <span className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 text-[10px] font-black uppercase px-2.5 py-1 rounded transition-colors duration-300">
            {displayRole}
          </span>
          {/* 🔥 MÉTRICAS HOMOLOGADAS 🔥 */}
          <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-500">
             <span className={member.total_requests > 0 ? "text-blue-500" : ""}>{member.total_requests || 0} Solicitudes</span>
             <span>•</span>
             <span className={member.active_pieces > 0 ? "text-amber-500" : ""}>{member.active_pieces || 0} Pz. Cola</span>
             <span>•</span>
             <span className="text-green-500">{member.delivered_pieces || 0} Pz. Entregadas</span>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 transition-colors duration-300">
            <Mail size={14} className="text-luxury-red/70" />
            <span className="text-xs truncate max-w-[120px]">{member.email}</span>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2">
          <button onClick={onViewTasks} title="Ver Tareas del team" className="p-2 text-gray-400 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all duration-300 cursor-pointer">
            <FolderKanban size={18} />
          </button>

          {isAdminUser && (
            <button onClick={onEdit} title="Editar Team" className="p-2 text-gray-400 dark:text-gray-600 hover:text-luxury-red hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all duration-300 cursor-pointer">
              <Edit2 size={18} />
            </button>
          )}
          
          {isAdminUser && isHistorial ? (
            <button onClick={onRestore} title="Reactivar Team" className="p-2 text-gray-400 dark:text-gray-600 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-all duration-300 cursor-pointer">
              <RotateCcw size={18} />
            </button>
          ) : isAdminUser && !isHistorial ? (
            <button onClick={onDelete} title="Remover Team" className="p-2 text-gray-400 dark:text-gray-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all duration-300 cursor-pointer">
              <Trash2 size={18} />
            </button>
          ) : null}
        </div>
      </td>
    </tr>
  );
}
