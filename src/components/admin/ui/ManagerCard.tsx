import { Mail, Phone, Trash2, Edit2, RotateCcw, FolderKanban } from 'lucide-react';

interface ManagerCardProps {
  manager: any;
  onEdit: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
  onViewRequests?: () => void; // 🔥 Ahora sí, convive a la par
  isHistorial?: boolean;
}

export default function ManagerCard({ manager, onEdit, onDelete, onRestore, onViewRequests, isHistorial }: ManagerCardProps) {
  return (
    <div className="bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-luxury-border p-6 rounded-2xl shadow-sm dark:shadow-none hover:border-luxury-red/50 dark:hover:border-luxury-red/50 transition-all duration-300 group relative flex flex-col h-full">
      
      {/* 🔥 BOTONES SUPERIORES (Editar + Borrar/Restaurar) */}
      <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
        <button onClick={onEdit} title="Editar Encargado" className="text-gray-400 dark:text-gray-600 hover:text-luxury-red dark:hover:text-luxury-red transition-colors duration-300 cursor-pointer">
          <Edit2 size={18} />
        </button>
        {isHistorial ? (
          <button onClick={onRestore} title="Reactivar Encargado" className="text-gray-400 dark:text-gray-600 hover:text-green-500 dark:hover:text-green-500 transition-colors duration-300 cursor-pointer">
            <RotateCcw size={18} />
          </button>
        ) : (
          <button onClick={onDelete} title="Remover Encargado" className="text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-500 transition-colors duration-300 cursor-pointer">
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center mt-2 relative z-0 flex-1">
        <div className="relative mb-4">
          <img src={manager.avatar} className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-luxury-dark shadow-md transition-colors duration-300" alt={manager.name} />
          <div className="absolute inset-0 rounded-full border-2 border-luxury-red/10 group-hover:border-luxury-red transition-all duration-300 scale-110 pointer-events-none"></div>
        </div>

        <h3 className="text-gray-900 dark:text-white font-bold text-lg transition-colors duration-300 line-clamp-1">{manager.name}</h3>
        <p className="text-luxury-red text-[10px] font-black uppercase tracking-widest mb-1">{manager.role}</p>
        <p className="text-gray-500 dark:text-gray-400 text-xs font-bold mb-6 italic transition-colors duration-300 truncate w-full text-center">{manager.company}</p>

        {/* 🔥 SECCIÓN INFERIOR: Botón de Solicitudes + Contacto */}
        <div className="mt-auto w-full space-y-3">
          <button 
            onClick={onViewRequests}
            className="w-full bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer border border-gray-200 dark:border-transparent group"
          >
            <FolderKanban size={14} className="group-hover:text-luxury-red transition-colors" /> Ver Solicitudes
          </button>

          
        </div>
      </div>
    </div>
  );
}