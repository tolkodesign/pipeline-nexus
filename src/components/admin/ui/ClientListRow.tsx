import { Mail, Phone, Edit2, Trash2, RotateCcw, Package } from "lucide-react"; // 🔥 Agregamos Package

interface Props {
  client: any;
  onEdit: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
  onManageDeliverables: () => void; // 🔥 NUEVO PROP
  isHistorial?: boolean;
}

export default function ClientListRow({ client, onEdit, onDelete, onRestore, onManageDeliverables, isHistorial }: Props) {
  return (
    // 🔥 Hover híbrido: gris muy claro de día, transparente sutil de noche
    <tr className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors duration-300 group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <img src={client.avatar} alt="avatar" className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-transparent transition-colors duration-300" />
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white transition-colors duration-300">{client.name}</p>
            <p className="text-[10px] text-luxury-red font-bold uppercase tracking-tighter">{client.role}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium transition-colors duration-300">
        {client.empresa}
      </td>
      <td className="px-6 py-4">
        {/* 🔥 Badge híbrido */}
        <span className="bg-gray-100 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border text-gray-700 dark:text-white text-[10px] font-bold px-2 py-1 rounded transition-colors duration-300">
          {client.proyectos} PROYECTOS
        </span>
      </td>
      
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end items-center gap-4">
          
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
            <Edit2 size={18}/>
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
      </td>
    </tr>
  );
}