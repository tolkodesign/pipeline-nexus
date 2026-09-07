import { Mail, Phone, Trash2, ExternalLink, Edit2, RotateCcw, FolderKanban } from 'lucide-react';

interface ManagerListRowProps {
  manager: any;
  onEdit: () => void; 
  onDelete?: () => void;
  onRestore?: () => void;
  onViewRequests?: () => void; // 🔥 Ahora sí, convive a la par
  isHistorial?: boolean;
}

export default function ManagerListRow({ manager, onEdit, onDelete, onRestore, onViewRequests, isHistorial }: ManagerListRowProps) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors duration-300 group border-b border-gray-200 dark:border-luxury-border/50 last:border-0">
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={manager.avatar} className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-luxury-border group-hover:border-luxury-red transition-colors duration-300" alt={manager.name} />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-luxury-dark rounded-full transition-colors duration-300"></div>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white tracking-tight transition-colors duration-300">{manager.name}</p>
            <p className="text-[10px] text-luxury-red font-black uppercase tracking-widest">{manager.role}</p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium transition-colors duration-300">{manager.company}</span>
          <ExternalLink size={12} className="text-gray-400 dark:text-gray-600 group-hover:text-luxury-red cursor-pointer transition-colors duration-300" />
        </div>
      </td>

      

      <td className="px-6 py-4 text-right">
        {/* 🔥 TODOS LOS BOTONES A LA PAR */}
        <div className="flex justify-end gap-2">
          <button onClick={onViewRequests} title="Ver Solicitudes del Manager" className="p-2 text-gray-400 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all duration-300 cursor-pointer">
            <FolderKanban size={18} />
          </button>

          <button onClick={onEdit} title="Editar Encargado" className="p-2 text-gray-400 dark:text-gray-600 hover:text-luxury-red dark:hover:text-luxury-red hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all duration-300 cursor-pointer">
            <Edit2 size={18} />
          </button>
          
          {isHistorial ? (
            <button onClick={onRestore} title="Reactivar Encargado" className="p-2 text-gray-400 dark:text-gray-600 hover:text-green-500 dark:hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-all duration-300 cursor-pointer">
              <RotateCcw size={18} />
            </button>
          ) : (
            <button onClick={onDelete} title="Remover Encargado" className="p-2 text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all duration-300 cursor-pointer">
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}