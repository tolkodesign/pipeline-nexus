import { Mail, Phone, Trash2, Edit2, RotateCcw, FolderKanban, ShieldCheck, Shield } from 'lucide-react';

interface TeamCardProps {
  member: any;
  onEdit: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
  onViewTasks?: () => void;
  isHistorial?: boolean;
  isAdminUser?: boolean;
}

export default function TeamCard({ member, onEdit, onDelete, onRestore, onViewTasks, isHistorial, isAdminUser }: TeamCardProps) {
  const isAdmin = member.internal_role?.toLowerCase() === 'admin';

  // Transformación dinámica de Reviewer a Colaborador
  const displayRole = member.internal_role?.toLowerCase() === 'reviewer' 
    ? 'Colaborador' 
    : member.internal_role;

  return (
    <div className="bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-luxury-border p-6 rounded-2xl shadow-sm dark:shadow-none transition-all duration-300 group relative flex flex-col h-full min-w-0">
      
      {/* BOTONES SUPERIORES */}
      <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
        {isAdminUser && (
          <button onClick={onEdit} title="Editar Team" className="text-gray-400 dark:text-gray-600 hover:text-luxury-red transition-colors duration-300 cursor-pointer">
            <Edit2 size={16} />
          </button>
        )}
        
        {isAdminUser && isHistorial ? (
          <button onClick={onRestore} title="Reactivar Team" className="text-gray-400 dark:text-gray-600 hover:text-green-500 transition-colors duration-300 cursor-pointer">
            <RotateCcw size={16} />
          </button>
        ) : isAdminUser && !isHistorial ? (
          <button onClick={onDelete} title="Remover Team" className="text-gray-400 dark:text-gray-600 hover:text-red-500 transition-colors duration-300 cursor-pointer">
            <Trash2 size={16} />
          </button>
        ) : null}
      </div>

      {/* BADGE DE ROL */}
      <div className={`absolute top-4 left-4 text-[9px] font-black uppercase px-2 py-0.5 rounded border flex items-center gap-1 transition-colors duration-300 ${
        isAdmin 
          ? 'bg-red-50 dark:bg-luxury-red/10 text-luxury-red border-red-200 dark:border-luxury-red/30' 
          : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-zinc-800'
      }`}>
        {isAdmin ? <ShieldCheck size={10}/> : <Shield size={10}/>} {displayRole}
      </div>

      <div className="flex flex-col items-center mt-6 relative z-0 flex-1 w-full">
        <div className="relative mb-4">
          <img 
            src={member.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.full_name || 'X')}&background=1E1E24&color=D3002D`} 
            className={`w-20 h-20 rounded-full object-cover border-4 border-white dark:border-luxury-dark shadow-md transition-all duration-300 ${isHistorial ? 'grayscale opacity-60' : ''}`} 
            alt="avatar" 
          />
          {!isHistorial && <div className="absolute inset-0 rounded-full border-2 border-luxury-red/10 group-hover:border-luxury-red transition-all duration-300 scale-110 pointer-events-none"></div>}
        </div>

        <h3 className="text-gray-900 dark:text-white font-black text-sm transition-colors duration-300 uppercase truncate w-full text-center">{member.full_name}</h3>
        <p className="text-luxury-red text-[10px] font-black uppercase tracking-widest mt-1 mb-5 truncate text-center w-full">{member.specialty || 'General'}</p>

        {/* 🔥 MÉTRICAS HOMOLOGADAS: Solicitudes | En Cola | Entregadas 🔥 */}
        <div className="grid grid-cols-3 w-full mb-6 px-2 bg-gray-50 dark:bg-white/5 py-3 rounded-xl border border-gray-100 dark:border-white/5 shadow-inner">
           <div className="flex flex-col items-center">
             <span className="text-lg font-black text-blue-500 leading-none">{member.total_requests || 0}</span>
             <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest mt-1">Solicitudes</span>
           </div>
           <div className="flex flex-col items-center border-l border-r border-gray-200 dark:border-zinc-700">
             <span className={`text-lg font-black leading-none ${member.active_pieces > 0 ? 'text-amber-500 animate-pulse' : 'text-gray-900 dark:text-white'}`}>{member.active_pieces || 0}</span>
             <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest mt-1">En Cola (PZ)</span>
           </div>
           <div className="flex flex-col items-center">
             <span className="text-lg font-black text-green-500 leading-none">{member.delivered_pieces || 0}</span>
             <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest mt-1">Entregadas</span>
           </div>
        </div>

        {/* SECCIÓN INFERIOR */}
        <div className="mt-auto w-full space-y-3">
          <button 
            onClick={onViewTasks}
            className="w-full bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer border border-gray-200 dark:border-transparent group/btn"
          >
            <FolderKanban size={14} className="group-hover/btn:text-luxury-red transition-colors" /> Ver Tareas
          </button>
        </div>
      </div>
    </div>
  );
}