import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Package, Plus, Trash2, Loader2, Layers, Pencil, Check, Box, Settings, FileType, Tag, Eye, EyeOff, RotateCcw, Minus, Search, Lock } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import Swal from 'sweetalert2';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  client: any;
}

export default function DeliverablesManagerModal({ isOpen, onClose, client }: Props) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [deliverables, setDeliverables] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [formats, setFormats] = useState<any[]>([]);

  // Filtros UI
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'individual' | 'package'>('all');
  const [showInactive, setShowInactive] = useState(false);

  // Formulario Creador
  const [itemType, setItemType] = useState<'individual' | 'package'>('individual');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deliverableName, setDeliverableName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');

  const [specialtiesCatalog, setSpecialtiesCatalog] = useState<any[]>([]);
  const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState<number[]>([]);

  const [packageItems, setPackageItems] = useState<{ item_deliverable_id: string; quantity: number }[]>([]);

  // Estados para Sub-Modales de Gestión (Categorías y Formatos)
  const [activeSubModal, setActiveSubModal] = useState<'none' | 'categories' | 'formats'>('none');
  const [showInactiveSubItems, setShowInactiveSubItems] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | number | null>(null);
  const [editingItemName, setEditingItemIdName] = useState('');
  const [subModalLoading, setSubModalLoading] = useState(false);

  // Derive catalog dynamically
  const disciplinesCatalog = specialtiesCatalog.map(s => ({
    id: s.id,
    name: s.name
  }));

  useEffect(() => {
    if (isOpen && client) {
      loadData();
      resetForm();
    }
  }, [isOpen, client, showInactive]);

  const loadData = async () => {
    setFetching(true);
    try {
      let delivQuery = supabase
        .from('organization_deliverables')
        .select(`
          *,
          request_categories(name),
          file_extensions(extension),
          package_deliverable_items!package_id (
            id,
            quantity,
            item:organization_deliverables!item_deliverable_id(id, name)
          )
        `)
        .eq('organization_id', client.id)
        .order('created_at', { ascending: true });

      if (!showInactive) delivQuery = delivQuery.eq('is_active', true);

      const [delivRes, catRes, formRes, specsRes] = await Promise.all([
        delivQuery,
        supabase.from('request_categories').select('*').order('name'),
        supabase.from('file_extensions').select('*').order('extension'),
        supabase.from('specialties').select('id, name')
      ]);

      if (delivRes.error) throw delivRes.error;
      setDeliverables(delivRes.data || []);
      if (catRes.data) setCategories(catRes.data);
      if (formRes.data) setFormats(formRes.data);
      if (specsRes.data) setSpecialtiesCatalog(specsRes.data);

    } catch (error: any) {
      console.error("Error al cargar datos:", error);
    } finally {
      setFetching(false);
    }
  };

  const reloadCatalogsOnly = async () => {
    const [catRes, formRes] = await Promise.all([
      supabase.from('request_categories').select('*').order('name'),
      supabase.from('file_extensions').select('*').order('extension')
    ]);
    if (catRes.data) setCategories(catRes.data);
    if (formRes.data) setFormats(formRes.data);
  };

  const resetForm = () => {
    setEditingId(null);
    setItemType('individual');
    setDeliverableName('');
    setSelectedCategory('');
    setSelectedFormat('');
    setSelectedSpecialtyIds([]);
    setPackageItems([]);
  };

  const handleOpenSubModal = (type: 'categories' | 'formats') => {
    setActiveSubModal(type);
    setNewItemName('');
    setEditingItemId(null);
  };

  const handleCreateSubItem = async () => {
    if (!newItemName.trim()) return;
    setSubModalLoading(true);
    try {
      if (activeSubModal === 'categories') {
        const { data, error } = await supabase
          .from('request_categories')
          .insert([{ name: newItemName.trim(), is_active: true }])
          .select().single();
        if (error) throw error;
        await reloadCatalogsOnly();
        setSelectedCategory(data.id.toString());
      } else {
        const { data, error } = await supabase
          .from('file_extensions')
          .insert([{ extension: newItemName.trim().toUpperCase(), is_active: true }])
          .select().single();
        if (error) throw error;
        await reloadCatalogsOnly();
        setSelectedFormat(data.id.toString());
      }
      setNewItemName('');
    } catch (err: any) {
      Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonColor: '#D3002D' });
    } finally {
      setSubModalLoading(false);
    }
  };

  const handleSaveSubItemEdit = async (id: string | number) => {
    if (!editingItemName.trim()) return;
    setSubModalLoading(true);
    try {
      if (activeSubModal === 'categories') {
        const { error } = await supabase.from('request_categories').update({ name: editingItemName.trim() }).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('file_extensions').update({ extension: editingItemName.trim().toUpperCase() }).eq('id', id);
        if (error) throw error;
      }
      await reloadCatalogsOnly();
      setEditingItemId(null);
    } catch (err: any) {
      Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonColor: '#D3002D' });
    } finally {
      setSubModalLoading(false);
    }
  };

  const handleToggleSubItemStatus = async (id: string | number, name: string, currentStatus: boolean) => {
    const isDark = document.documentElement.classList.contains('dark');
    const actionText = currentStatus ? 'Ocultar' : 'Restaurar';
    const result = await Swal.fire({
      title: `${actionText} "${name}"?`,
      text: currentStatus ? 'Ocultará la opción para nuevas solicitudes.' : 'Habilitará la opción en el catálogo.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#D3002D',
      confirmButtonText: `Sí, ${actionText}`,
      cancelButtonText: 'Cancelar',
      background: isDark ? '#0F0F12' : '#fff',
      color: isDark ? '#fff' : '#1f2937'
    });

    if (result.isConfirmed) {
      setSubModalLoading(true);
      try {
        if (activeSubModal === 'categories') {
          const { error } = await supabase.from('request_categories').update({ is_active: !currentStatus }).eq('id', id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('file_extensions').update({ is_active: !currentStatus }).eq('id', id);
          if (error) throw error;
        }
        await reloadCatalogsOnly();
      } catch (err: any) {
        Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonColor: '#D3002D' });
      } finally {
        setSubModalLoading(false);
      }
    }
  };

  const handleEditClick = (item: any) => {
    setEditingId(item.id);
    setItemType(item.is_package ? 'package' : 'individual');
    setDeliverableName(item.name || '');
    setSelectedCategory(item.category_id ? String(item.category_id) : '');
    setSelectedFormat(item.target_format_id ? String(item.target_format_id) : '');

    const legacySpecialtyIds = [];
    if (item.needs_copy) legacySpecialtyIds.push(disciplinesCatalog.find(d => ['contenido', 'copy'].includes(d.name.toLowerCase()))?.id);
    if (item.needs_design) legacySpecialtyIds.push(disciplinesCatalog.find(d => ['diseño', 'diseno'].includes(d.name.toLowerCase()))?.id);
    if (item.needs_av) legacySpecialtyIds.push(disciplinesCatalog.find(d => ['audiovisual'].includes(d.name.toLowerCase()))?.id);
    if (item.needs_dev) legacySpecialtyIds.push(disciplinesCatalog.find(d => ['programación', 'programacion'].includes(d.name.toLowerCase()))?.id);
    if (item.needs_prod) legacySpecialtyIds.push(disciplinesCatalog.find(d => ['producción', 'produccion'].includes(d.name.toLowerCase()))?.id);
    if (item.needs_staff) legacySpecialtyIds.push(disciplinesCatalog.find(d => ['staff'].includes(d.name.toLowerCase()))?.id);
    if (item.needs_rp) legacySpecialtyIds.push(disciplinesCatalog.find(d => ['rp', 'relaciones públicas', 'relaciones publicas'].includes(d.name.toLowerCase()))?.id);

    setSelectedSpecialtyIds(item.specialty_ids || legacySpecialtyIds.filter(Boolean) as number[]);

    if (item.is_package && item.package_deliverable_items) {
      setPackageItems(item.package_deliverable_items.map((pi: any) => ({
        item_deliverable_id: pi.item?.id || pi.item_deliverable_id,
        quantity: pi.quantity || 1
      })));
    } else {
      setPackageItems([]);
    }
  };

  const handleSaveDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliverableName.trim()) return;

    if (itemType === 'package' && packageItems.length === 0) {
      Swal.fire('Atención', 'Un paquete debe incluir al menos 1 entregable individual.', 'warning');
      return;
    }

    if (itemType === 'individual' && selectedSpecialtyIds.length === 0) {
      Swal.fire('Atención', 'Debes asignar al menos un área o disciplina para crear este entregable.', 'warning');
      return;
    }

    setLoading(true);
    try {
      let finalSpecialtyIds = [...selectedSpecialtyIds];

      if (itemType === 'package') {
        const specsSet = new Set<number>();
        packageItems.forEach(pi => {
          const original = deliverables.find(d => d.id === pi.item_deliverable_id);
          if (original && original.specialty_ids) {
            original.specialty_ids.forEach((id: number) => specsSet.add(id));
          }
        });
        finalSpecialtyIds = Array.from(specsSet);
      }

      // Backward compatibility logic
      const legacyMap = disciplinesCatalog.reduce((acc, cat) => {
        if (['contenido', 'copy'].includes(cat.name.toLowerCase())) acc.needs_copy = finalSpecialtyIds.includes(cat.id);
        if (['diseño', 'diseno'].includes(cat.name.toLowerCase())) acc.needs_design = finalSpecialtyIds.includes(cat.id);
        if (['audiovisual'].includes(cat.name.toLowerCase())) acc.needs_av = finalSpecialtyIds.includes(cat.id);
        if (['programación', 'programacion'].includes(cat.name.toLowerCase())) acc.needs_dev = finalSpecialtyIds.includes(cat.id);
        if (['producción', 'produccion'].includes(cat.name.toLowerCase())) acc.needs_prod = finalSpecialtyIds.includes(cat.id);
        if (['staff'].includes(cat.name.toLowerCase())) acc.needs_staff = finalSpecialtyIds.includes(cat.id);
        if (['rp', 'relaciones públicas', 'relaciones publicas'].includes(cat.name.toLowerCase())) acc.needs_rp = finalSpecialtyIds.includes(cat.id);
        return acc;
      }, {} as any);

      const payload = {
        organization_id: client.id,
        name: deliverableName.trim(),
        category_id: selectedCategory ? parseInt(selectedCategory) : null,
        target_format_id: selectedFormat ? parseInt(selectedFormat) : null,
        is_package: itemType === 'package',
        specialty_ids: finalSpecialtyIds,
        ...legacyMap,
        is_active: true
      };

      let targetId = editingId;

      if (editingId) {
        const { error } = await supabase.from('organization_deliverables').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('organization_deliverables').insert([payload]).select().single();
        if (error) throw error;
        targetId = data.id;
      }

      if (itemType === 'package' && targetId) {
        await supabase.from('package_deliverable_items').delete().eq('package_id', targetId);
        const itemsPayload = packageItems.map(pi => ({
          package_id: targetId,
          item_deliverable_id: pi.item_deliverable_id,
          quantity: pi.quantity
        }));
        await supabase.from('package_deliverable_items').insert(itemsPayload);
      }

      Swal.fire({ title: editingId ? 'Actualizado' : 'Creado', icon: 'success', confirmButtonColor: '#D3002D' });
      resetForm();
      loadData();
    } catch (error: any) {
      Swal.fire({ title: 'Error', text: error.message, icon: 'error', confirmButtonColor: '#D3002D' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDeliverableStatus = async (id: string, name: string, currentStatus: boolean) => {
    const actionText = currentStatus ? 'Ocultar' : 'Restaurar';
    const result = await Swal.fire({
      title: `${actionText} entregable?`,
      text: currentStatus ? `"${name}" ya no aparecerá en nuevas solicitudes.` : `"${name}" volverá a estar disponible.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#D3002D',
      cancelButtonColor: '#1f1f22',
      confirmButtonText: `Sí, ${actionText.toLowerCase()}`
    });

    if (result.isConfirmed) {
      try {
        await supabase.from('organization_deliverables').update({ is_active: !currentStatus }).eq('id', id);
        loadData();
      } catch (error: any) {
        Swal.fire({ title: 'Error', text: error.message, icon: 'error', confirmButtonColor: '#D3002D' });
      }
    }
  };

  if (!isOpen) return null;

  const individualDeliverables = deliverables.filter(d => !d.is_package && d.is_active);

  const filteredDeliverables = deliverables.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (typeFilter === 'individual') return matchesSearch && !d.is_package;
    if (typeFilter === 'package') return matchesSearch && d.is_package;
    return matchesSearch;
  });

  const activeCategories = categories.filter(c => showInactiveSubItems || c.is_active);
  const activeFormats = formats.filter(f => showInactiveSubItems || f.is_active);

  // 🔥 z-[200000] PARA SUPERAR CUALQUIER REGLA OVERRIDE DE Z-99999 🔥
  return createPortal(
    <div className="fixed inset-0 z-[200000] flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-luxury-border w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[90vh] relative">
        
        {/* HEADER */}
        <div className="p-5 bg-luxury-red flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl text-white">
              <Package size={22} />
            </div>
            <div>
              <h3 className="text-white font-black uppercase tracking-widest text-base">Catálogo de Entregables</h3>
              <p className="text-[11px] text-white/90 font-bold uppercase">Cliente: {client?.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white bg-black/20 hover:bg-black/40 p-2 rounded-xl transition-all cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* CONTENIDORES EN 2 COLUMNAS (SPLIT VIEW) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-zinc-800">
          
          {/* COLUMNA IZQUIERDA: FORMULARIO DE CREACIÓN/EDICIÓN (5 Cols) */}
          <div className="lg:col-span-5 p-6 overflow-y-auto custom-scrollbar bg-gray-50/50 dark:bg-black/20 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                {editingId ? <Pencil size={14} className="text-blue-500" /> : <Plus size={14} className="text-blue-500" />}
                {editingId ? 'Editar Entregable' : 'Nuevo Entregable'}
              </span>
            </div>

            {/* BLOQUEO DE SELECTOR DE TIPO EN MODO EDICIÓN */}
            <div className="relative">
              <div className="grid grid-cols-2 p-1 bg-white dark:bg-[#141419] rounded-xl border border-gray-200 dark:border-zinc-800">
                <button
                  type="button"
                  disabled={!!editingId}
                  onClick={() => setItemType('individual')}
                  className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                    itemType === 'individual' 
                      ? 'bg-luxury-red text-white shadow-sm' 
                      : 'text-gray-400 hover:text-gray-700 dark:hover:text-white'
                  } ${editingId ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                >
                  <Box size={13}/> Individual
                </button>
                <button
                  type="button"
                  disabled={!!editingId}
                  onClick={() => setItemType('package')}
                  className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                    itemType === 'package' 
                      ? 'bg-luxury-red text-white shadow-sm' 
                      : 'text-gray-400 hover:text-gray-700 dark:hover:text-white'
                  } ${editingId ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                >
                  <Package size={13}/> Paquete
                </button>
              </div>

              {editingId && (
                <div className="mt-1 flex items-center justify-center gap-1 text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  <Lock size={10} /> El tipo ({itemType}) no se puede cambiar en edición
                </div>
              )}
            </div>

            <form onSubmit={handleSaveDeliverable} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Nombre *</label>
                <input 
                  required
                  type="text" 
                  placeholder={itemType === 'package' ? "Ej. Paquete Redes Sociales" : "Ej. Banner Web JPG"} 
                  value={deliverableName}
                  onChange={(e) => setDeliverableName(e.target.value)}
                  className="w-full bg-white dark:bg-[#141419] border border-gray-300 dark:border-zinc-800 rounded-xl p-2.5 text-xs font-bold text-gray-900 dark:text-white focus:border-luxury-red outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                
                {/* CATEGORÍA CON BOTÓN DE GESTIÓN */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Categoría</label>
                    <button 
                      type="button" 
                      onClick={() => handleOpenSubModal('categories')} 
                      className="text-[10px] font-black uppercase text-blue-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Settings size={11}/> Administrar
                    </button>
                  </div>
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-white dark:bg-[#141419] border border-gray-300 dark:border-zinc-800 rounded-xl p-2.5 text-xs font-bold text-gray-700 dark:text-gray-300 outline-none"
                  >
                    <option value="">General</option>
                    {categories.filter(c => c.is_active).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                {/* FORMATO CON BOTÓN DE GESTIÓN */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Formato</label>
                    <button 
                      type="button" 
                      onClick={() => handleOpenSubModal('formats')} 
                      className="text-[10px] font-black uppercase text-blue-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Settings size={11}/> Administrar
                    </button>
                  </div>
                  <select 
                    value={selectedFormat} 
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="w-full bg-white dark:bg-[#141419] border border-gray-300 dark:border-zinc-800 rounded-xl p-2.5 text-xs font-bold text-gray-700 dark:text-gray-300 outline-none"
                  >
                    <option value="">N/A</option>
                    {formats.filter(f => f.is_active).map(f => <option key={f.id} value={f.id}>{f.extension}</option>)}
                  </select>
                </div>

              </div>

              {/* Disciplinas si es Individual */}
              {itemType === 'individual' && (
                <div className="space-y-2 bg-white dark:bg-[#141419] p-3 rounded-2xl border border-gray-200 dark:border-zinc-800">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Disciplinas requeridas:</label>
                  <div className="flex flex-wrap gap-1.5">
                    {disciplinesCatalog.map(disc => {
                      const isActive = selectedSpecialtyIds.includes(disc.id);
                      return (
                        <button
                          key={disc.id}
                          type="button"
                          onClick={() => {
                            if (isActive) {
                              setSelectedSpecialtyIds(prev => prev.filter(id => id !== disc.id));
                            } else {
                              setSelectedSpecialtyIds(prev => [...prev, disc.id]);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${
                            isActive ? 'bg-luxury-red border-luxury-red text-white' : 'bg-gray-50 dark:bg-black/40 border-gray-200 dark:border-zinc-800 text-gray-400'
                          }`}
                        >
                          {disc.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Selección Múltiple si es Paquete */}
              {itemType === 'package' && (
                <div className="space-y-2 bg-white dark:bg-[#141419] p-3 rounded-2xl border border-gray-200 dark:border-zinc-800">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Componentes del Paquete:</label>
                  <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto custom-scrollbar p-0.5">
                    {individualDeliverables.map(indiv => {
                      const selectedObj = packageItems.find(p => p.item_deliverable_id === indiv.id);
                      const isSelected = !!selectedObj;
                      const qty = selectedObj?.quantity || 0;

                      return (
                        <div key={indiv.id} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${isSelected ? 'bg-luxury-red border-luxury-red text-white' : 'bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-500'}`}>
                          <button
                            type="button"
                            onClick={() => {
                              if (isSelected) setPackageItems(packageItems.filter(p => p.item_deliverable_id !== indiv.id));
                              else setPackageItems([...packageItems, { item_deliverable_id: indiv.id, quantity: 1 }]);
                            }}
                          >
                            {indiv.name}
                          </button>
                          {isSelected && (
                            <div className="flex items-center gap-1 pl-1 border-l border-white/30">
                              <button type="button" onClick={() => setPackageItems(packageItems.map(p => p.item_deliverable_id === indiv.id ? { ...p, quantity: Math.max(1, qty - 1) } : p))}><Minus size={9}/></button>
                              <span>{qty}</span>
                              <button type="button" onClick={() => setPackageItems(packageItems.map(p => p.item_deliverable_id === indiv.id ? { ...p, quantity: qty + 1 } : p))}><Plus size={9}/></button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECCIÓN DE BOTONES: VERDE (GUARDAR) / AZUL (CREAR) Y ROJO ABAJO (CANCELAR) */}
              <div className="space-y-2 pt-2">
                <button 
                  type="submit" 
                  disabled={loading || !deliverableName.trim()}
                  className={`w-full text-white py-3 rounded-xl text-xs font-black tracking-widest uppercase shadow-md flex justify-center items-center gap-2 cursor-pointer transition-colors ${
                    editingId 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={15}/>
                  ) : editingId ? (
                    <><Check size={16}/> GUARDAR CAMBIOS</>
                  ) : (
                    <><Plus size={16}/> CREAR ENTREGABLE</>
                  )}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs font-black tracking-widest uppercase shadow-sm flex justify-center items-center gap-2 cursor-pointer transition-colors"
                  >
                    <X size={15}/> CANCELAR EDICIÓN
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* COLUMNA DERECHA: CATÁLOGO, BÚSQUEDA Y PESTAÑAS DE TIPO (7 Cols) */}
          <div className="lg:col-span-7 p-6 overflow-y-auto custom-scrollbar space-y-4">
            
            {/* BARRA SUPERIOR DE BÚSQUEDA, FILTRO DE TIPO Y VER OCULTOS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input 
                    type="text"
                    placeholder="Buscar entregable por nombre..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#141419] border border-gray-200 dark:border-zinc-800 rounded-xl pl-8 pr-3 py-2 text-xs font-medium text-gray-900 dark:text-white outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowInactive(!showInactive)}
                  className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border cursor-pointer ${
                    showInactive ? 'bg-luxury-red text-white border-luxury-red' : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-700'
                  }`}
                >
                  {showInactive ? <EyeOff size={13}/> : <Eye size={13}/>}
                  {showInactive ? 'Ocultar Inactivos' : 'Ver Ocultos'}
                </button>
              </div>

              {/* FILTRO RÁPIDO DE PESTAÑAS (TODOS / INDIVIDUALES / PAQUETES) */}
              <div className="flex gap-1.5 p-1 bg-gray-100 dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 w-fit">
                <button
                  type="button"
                  onClick={() => setTypeFilter('all')}
                  className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    typeFilter === 'all' 
                      ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Todos ({deliverables.length})
                </button>

                <button
                  type="button"
                  onClick={() => setTypeFilter('individual')}
                  className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    typeFilter === 'individual' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Individuales ({deliverables.filter(d => !d.is_package).length})
                </button>

                <button
                  type="button"
                  onClick={() => setTypeFilter('package')}
                  className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    typeFilter === 'package' 
                      ? 'bg-purple-600 text-white shadow-sm' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Paquetes ({deliverables.filter(d => d.is_package).length})
                </button>
              </div>
            </div>

            {/* LISTA DE TARJETAS */}
            {fetching ? (
              <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-luxury-red" size={28}/></div>
            ) : filteredDeliverables.length === 0 ? (
              <div className="py-16 text-center text-xs font-bold text-gray-400">No se encontraron entregables registrados.</div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredDeliverables.map(item => {
                  const isPkg = item.is_package;
                  const isActive = item.is_active;
                  const isBeingEdited = editingId === item.id;

                  return (
                    <div 
                      key={item.id}
                      className={`p-3.5 border rounded-2xl flex items-center justify-between gap-3 transition-all ${
                        isBeingEdited
                          ? 'bg-blue-50/70 dark:bg-blue-950/40 border-2 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                          : isActive 
                          ? 'bg-white dark:bg-[#121216] border-gray-200 dark:border-zinc-800 hover:border-blue-400/50' 
                          : 'bg-gray-100/50 dark:bg-zinc-900/30 border-dashed opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-xl shrink-0 ${
                          isBeingEdited
                            ? 'bg-blue-600 text-white'
                            : isPkg 
                            ? 'bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300' 
                            : 'bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300'
                        }`}>
                          {isPkg ? <Package size={16}/> : <Box size={16}/>}
                        </div>

                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black text-gray-900 dark:text-white uppercase truncate block">{item.name}</span>

                            {/* BADGE DISTINCTIVO VISIBLE */}
                            {isPkg ? (
                              <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 flex items-center gap-1">
                                <Package size={9} /> Paquete
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 flex items-center gap-1">
                                <Box size={9} /> Individual
                              </span>
                            )}

                            {isBeingEdited && (
                              <span className="text-[8px] bg-blue-600 text-white px-2 py-0.5 rounded-md font-black uppercase tracking-wider animate-pulse">
                                EDITANDO
                              </span>
                            )}
                          </div>

                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
                            {isPkg ? 'CONJUNTO MULTI-ENTREGABLE' : `${item.request_categories?.name || 'General'} • ${item.file_extensions?.extension || 'Format'}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button 
                          type="button" 
                          onClick={() => handleEditClick(item)} 
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isBeingEdited 
                              ? 'bg-blue-600 text-white' 
                              : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30'
                          }`}
                          title="Editar"
                        >
                          <Pencil size={14}/>
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleToggleDeliverableStatus(item.id, item.name, isActive)} 
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isActive ? 'text-gray-400 hover:text-luxury-red' : 'text-green-600'}`}
                          title={isActive ? "Ocultar" : "Restaurar"}
                        >
                          {isActive ? <Trash2 size={14}/> : <RotateCcw size={14}/>}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

        {/* SUB-MODAL FLOTANTE (ADMINISTRAR CATEGORÍAS/FORMATOS) */}
        {activeSubModal !== 'none' && (
          <div className="absolute inset-0 z-[200100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-zinc-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              
              <div className="p-4 bg-gray-900 text-white dark:bg-black flex justify-between items-center border-b border-gray-800">
                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
                  {activeSubModal === 'categories' ? <Tag size={16} className="text-luxury-red"/> : <FileType size={16} className="text-blue-500"/>}
                  Gestión de {activeSubModal === 'categories' ? 'Categorías' : 'Formatos / Extensiones'}
                </div>
                <button type="button" onClick={() => setActiveSubModal('none')} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer">
                  <X size={16}/>
                </button>
              </div>

              <div className="p-6 space-y-5 flex-1 overflow-y-auto max-h-[70vh]">
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Agregar Nuevo {activeSubModal === 'categories' ? 'Categoría' : 'Formato'}
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder={activeSubModal === 'categories' ? "Ej. Animación 3D, Impresión..." : "Ej. MP4, PNG, FIGMA..."}
                      value={newItemName}
                      onChange={e => setNewItemName(e.target.value)}
                      className="flex-1 bg-gray-50 dark:bg-black border border-gray-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-luxury-red"
                    />
                    <button 
                      type="button"
                      disabled={subModalLoading || !newItemName.trim()}
                      onClick={handleCreateSubItem}
                      className="bg-luxury-red hover:bg-red-700 disabled:opacity-40 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all shrink-0"
                    >
                      {subModalLoading ? <Loader2 className="animate-spin" size={14}/> : <><Plus size={14}/> CREAR</>}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Catálogo ({activeSubModal === 'categories' ? activeCategories.length : activeFormats.length})
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowInactiveSubItems(!showInactiveSubItems)}
                      className="text-[10px] font-black uppercase text-blue-500 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {showInactiveSubItems ? <EyeOff size={12}/> : <Eye size={12}/>}
                      {showInactiveSubItems ? 'Ocultar Inactivos' : 'Ver Inactivos'}
                    </button>
                  </div>

                  <div className="border border-gray-200 dark:border-zinc-800 rounded-xl divide-y divide-gray-100 dark:divide-zinc-900 bg-gray-50/50 dark:bg-black/30 overflow-hidden">
                    {(activeSubModal === 'categories' ? activeCategories : activeFormats).map((item) => {
                      const itemId = item.id;
                      const itemName = activeSubModal === 'categories' ? item.name : item.extension;
                      const isEditing = editingItemId === itemId;
                      const isActive = item.is_active;

                      return (
                        <div key={itemId} className={`p-3 flex items-center justify-between gap-3 text-xs font-bold transition-colors ${isActive ? 'text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-black/40' : 'text-gray-400 bg-gray-100/50 dark:bg-zinc-900/30'}`}>
                          {isEditing ? (
                            <input 
                              type="text"
                              value={editingItemName}
                              onChange={e => setEditingItemIdName(e.target.value)}
                              className="flex-1 bg-white dark:bg-zinc-900 border border-blue-500 rounded-lg px-2 py-1 text-xs text-gray-900 dark:text-white outline-none font-bold"
                              autoFocus
                            />
                          ) : (
                            <div className="flex items-center gap-2 truncate">
                              <span className="uppercase tracking-wider truncate">{itemName}</span>
                              {!isActive && <span className="text-[8px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-black uppercase">Inactivo</span>}
                            </div>
                          )}

                          <div className="flex items-center gap-1 shrink-0">
                            {isEditing ? (
                              <>
                                <button type="button" onClick={() => handleSaveSubItemEdit(itemId)} className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-lg transition-colors cursor-pointer">
                                  <Check size={14}/>
                                </button>
                                <button type="button" onClick={() => setEditingItemId(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
                                  <X size={14}/>
                                </button>
                              </>
                            ) : (
                              <>
                                <button type="button" onClick={() => { setEditingItemId(itemId); setEditingItemIdName(itemName); }} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
                                  <Pencil size={13}/>
                                </button>
                                <button type="button" onClick={() => handleToggleSubItemStatus(itemId, itemName, isActive)} className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isActive ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`} title={isActive ? "Ocultar" : "Restaurar"}>
                                  {isActive ? <Trash2 size={13}/> : <RotateCcw size={13}/>}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              <div className="p-4 bg-gray-50 dark:bg-black/40 border-t border-gray-200 dark:border-zinc-800 flex justify-end">
                <button 
                  type="button" 
                  onClick={() => setActiveSubModal('none')}
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-800 dark:text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Listo
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
}