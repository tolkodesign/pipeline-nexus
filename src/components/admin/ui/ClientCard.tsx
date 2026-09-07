import { Edit2, Trash2, RotateCcw, Package } from "lucide-react"; // 🔥 Agregamos Package

interface Props {
  client: any;
  onEdit: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
  onManageDeliverables: () => void; // 🔥 NUEVO PROP
  isHistorial?: boolean;
}

export default function ClientCard({ client, onEdit, onDelete, onRestore, onManageDeliverables, isHistorial }: Props) {
  return (
    <div className="bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-luxury-border p-6 rounded-2xl shadow-sm dark:shadow-none hover:border-luxury-red/50 dark:hover:border-luxury-red/50 transition-all duration-300 group relative overflow-hidden">
      
      {/* BOTONES SUPERIORES */}
      <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
        
        {/* 🔥 BOTÓN DE ENTREGABLES AQUÍ */}
        <button 
          onClick={onManageDeliverables} 
          title="Catálogo de Entregables"
          className="text-gray-400 dark:text-gray-600 hover:text-luxury-red dark:hover:text-luxury-red transition-colors duration-300 cursor-pointer"
        >
          <Package size={18} />
        </button>

        <button 
          onClick={onEdit} 
          title="Editar Cliente"
          className="text-gray-400 dark:text-gray-600 hover:text-luxury-red dark:hover:text-luxury-red transition-colors duration-300 cursor-pointer"
        >
          <Edit2 size={18} />
        </button>
        
        {isHistorial ? (
          <button 
            onClick={onRestore} 
            title="Reactivar Cliente" 
            className="text-gray-400 dark:text-gray-600 hover:text-green-500 dark:hover:text-green-500 transition-colors duration-300 cursor-pointer"
          >
            <RotateCcw size={18} />
          </button>
        ) : (
          <button 
            onClick={onDelete} 
            title="Deshabilitar Cliente" 
            className="text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-500 transition-colors duration-300 cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
      
      {/* INFO DEL CLIENTE */}
      <div className="flex flex-col items-center text-center mt-2 relative z-0">
        <div className="relative mb-4">
          <img 
            src={client.avatar} 
            alt="avatar" 
            className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-200 dark:border-luxury-border group-hover:border-luxury-red dark:group-hover:border-luxury-red transition-all duration-300" 
          />
          <div className="absolute -bottom-2 -right-2 bg-luxury-red text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg">Tolko</div>
        </div>
        
        <h3 className="text-gray-900 dark:text-white font-bold text-lg transition-colors duration-300">{client.name}</h3>
        <p className="text-luxury-red text-xs font-bold uppercase tracking-widest mb-4 transition-colors duration-300">{client.role}</p>
        
        {/* CAJA DE EMPRESA */}
        <div className="w-full bg-gray-50 dark:bg-[#070709] rounded-xl p-3 border border-gray-200 dark:border-luxury-border mb-6 transition-colors duration-300">
          <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold mb-1 transition-colors duration-300">Empresa</p>
          <p className="text-sm text-gray-800 dark:text-gray-200 font-medium transition-colors duration-300">{client.empresa}</p>
        </div>

       
      </div>
    </div>
  );
}