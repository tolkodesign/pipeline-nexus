import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';
import { Edit2, ToggleLeft, ToggleRight, Plus } from 'lucide-react';
import type { PressCatalog } from '../../types/press';

interface Props {
  tableName: 'press_media' | 'press_sources' | 'press_media_types' | 'press_campaigns';
  title: string;
  data: PressCatalog[];
  refetch: () => void;
  loading: boolean;
}

export default function CatalogsManager({ tableName, title, data, refetch, loading }: Props) {
  const [filterActive, setFilterActive] = useState<'todos' | 'activos' | 'inactivos'>('todos');
  const [editingItem, setEditingItem] = useState<PressCatalog | null>(null);
  const [newItemName, setNewItemName] = useState('');

  const filteredData = data.filter(item => {
    if (filterActive === 'activos') return item.is_active;
    if (filterActive === 'inactivos') return !item.is_active;
    return true;
  });

  const handleCreate = async () => {
    if (!newItemName.trim()) return;
    try {
      const { error } = await supabase.from(tableName).insert([{ name: newItemName.trim() }]);
      if (error) throw error;
      setNewItemName('');
      refetch();
    } catch (err: any) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const handleUpdate = async () => {
    if (!editingItem || !editingItem.name.trim()) return;
    try {
      const { error } = await supabase.from(tableName)
        .update({ name: editingItem.name.trim(), updated_at: new Date().toISOString() })
        .eq('id', editingItem.id);
      if (error) throw error;
      setEditingItem(null);
      refetch();
    } catch (err: any) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from(tableName)
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      refetch();
    } catch (err: any) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  return (
    <div className="bg-white dark:bg-luxury-card rounded-2xl shadow-sm border border-gray-200 dark:border-luxury-border p-5 sm:p-6 flex flex-col gap-4">
      {/* Header con título y filtro */}
      <div className="flex justify-between items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-3">
        <h3 className="text-base font-black uppercase text-gray-900 dark:text-white tracking-wider truncate">
          {title}
        </h3>
        
        <select 
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value as any)}
          className="bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl px-3 py-1.5 text-xs font-bold uppercase outline-none shrink-0 cursor-pointer"
        >
          <option value="todos">Todos</option>
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
        </select>
      </div>

      {/* Input de creación */}
      <div className="flex gap-2 items-center">
        <input 
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleCreate();
            }
          }}
          placeholder={`Nuevo ${title.toLowerCase()}...`}
          className="flex-1 min-w-0 bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-luxury-red transition-colors"
        />
        <button 
          onClick={handleCreate}
          disabled={!newItemName.trim()}
          className="bg-luxury-red hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-black uppercase tracking-wider disabled:opacity-40 flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap shadow-md shadow-luxury-red/15 transition-all cursor-pointer active:scale-95"
        >
          <Plus size={16} /> Crear
        </button>
      </div>

      {/* Listado con scroll amplio */}
      {loading ? (
        <div className="text-center py-8 text-xs text-gray-400 font-bold uppercase tracking-wider">Cargando...</div>
      ) : (
        <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
          {filteredData.map(item => (
            <div 
              key={item.id} 
              className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-colors ${
                item.is_active 
                  ? 'bg-gray-50 dark:bg-luxury-dark/60 border-gray-200 dark:border-luxury-border hover:border-gray-300' 
                  : 'bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20'
              }`}
            >
              {editingItem?.id === item.id ? (
                <input 
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUpdate();
                    if (e.key === 'Escape') setEditingItem(null);
                  }}
                  autoFocus
                  className="flex-1 min-w-0 bg-white dark:bg-black border border-luxury-red rounded-lg px-2.5 py-1 text-sm outline-none font-bold"
                />
              ) : (
                <span className={`text-sm font-bold truncate flex-1 min-w-0 ${item.is_active ? 'text-gray-900 dark:text-white' : 'text-gray-400 line-through'}`}>
                  {item.name}
                </span>
              )}

              <div className="flex items-center gap-1.5 shrink-0">
                {editingItem?.id === item.id ? (
                  <>
                    <button onClick={handleUpdate} className="text-xs font-black uppercase px-2.5 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">OK</button>
                    <button onClick={() => setEditingItem(null)} className="text-xs font-bold text-gray-500 px-2 py-1 hover:text-gray-700 dark:hover:text-white">✕</button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setEditingItem(item)} 
                      className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button 
                      onClick={() => handleToggleActive(item.id, item.is_active)} 
                      className={`p-1.5 rounded-lg transition-colors ${
                        item.is_active 
                          ? 'text-green-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' 
                          : 'text-red-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                      }`}
                      title={item.is_active ? 'Desactivar' : 'Reactivar'}
                    >
                      {item.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          {filteredData.length === 0 && (
            <div className="text-center py-8 text-xs font-bold text-gray-400 uppercase tracking-wider">
              No hay registros
            </div>
          )}
        </div>
      )}
    </div>
  );
}
