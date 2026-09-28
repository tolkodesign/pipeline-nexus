import { useState } from 'react';
import { Edit2, ToggleLeft, ToggleRight, Search, LayoutGrid, List, Eye } from 'lucide-react';
import type { Reporter, PressMedia, PressSource, PressMediaType, PressCampaign } from '../../types/press';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';
import ReporterModal from './ReporterModal';
import ReporterViewModal from './ReporterViewModal';

interface Props {
  reporters: Reporter[];
  media: PressMedia[];
  sources: PressSource[];
  mediaTypes: PressMediaType[];
  campaigns: PressCampaign[];
  loading: boolean;
  refetch: () => void;
  profileId: string;
}

export default function ReportersList({ reporters, media, sources, mediaTypes, campaigns, loading, refetch, profileId }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMedia, setFilterMedia] = useState('todos');
  const [filterMediaType, setFilterMediaType] = useState('todos');
  const [filterSource, setFilterSource] = useState('todos');
  const [filterTier, setFilterTier] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('activos');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReporter, setSelectedReporter] = useState<Reporter | null>(null);

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingReporter, setViewingReporter] = useState<Reporter | null>(null);

  const filteredReporters = reporters.filter(r => {
    if (filterStatus === 'activos' && !r.is_active) return false;
    if (filterStatus === 'inactivos' && r.is_active) return false;
    if (filterTier !== 'todos' && r.tier.toString() !== filterTier) return false;
    if (filterMedia !== 'todos' && r.media_id !== filterMedia) return false;
    if (filterMediaType !== 'todos' && r.media_type_id !== filterMediaType) return false;
    if (filterSource !== 'todos' && r.source_id !== filterSource) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return r.full_name.toLowerCase().includes(q) || 
             (r.position && r.position.toLowerCase().includes(q)) ||
             (r.press_media?.name && r.press_media.name.toLowerCase().includes(q));
    }
    return true;
  });

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from('reporters').update({ is_active: !currentStatus }).eq('id', id);
      if (error) throw error;
      refetch();
    } catch (err: any) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const handleEdit = (r: Reporter) => {
    setSelectedReporter(r);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedReporter(null);
    setModalOpen(true);
  };

  const handleView = (r: Reporter) => {
    setViewingReporter(r);
    setViewModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="bg-white dark:bg-luxury-card rounded-2xl shadow-sm border border-gray-200 dark:border-luxury-border p-4 sm:p-5 flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, puesto o medio..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl py-2.5 pl-9 pr-3 text-xs md:text-sm font-medium outline-none focus:border-luxury-red transition-all"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <select value={filterMedia} onChange={e => setFilterMedia(e.target.value)} className="bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer">
            <option value="todos">Medio (Todos)</option>
            {media.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <select value={filterMediaType} onChange={e => setFilterMediaType(e.target.value)} className="bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer">
            <option value="todos">Tipo (Todos)</option>
            {mediaTypes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <select value={filterSource} onChange={e => setFilterSource(e.target.value)} className="bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer">
            <option value="todos">Fuente (Todas)</option>
            {sources.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <select value={filterTier} onChange={e => setFilterTier(e.target.value)} className="bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer">
            <option value="todos">Tier (Todos)</option>
            <option value="1">Tier 1</option>
            <option value="2">Tier 2</option>
            <option value="3">Tier 3</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer">
            <option value="todos">Estado (Todos)</option>
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
          </select>

          <button onClick={handleCreate} className="bg-luxury-red hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap shadow-md shadow-luxury-red/20 active:scale-95 transition-all cursor-pointer">
            + Nuevo Reportero
          </button>

          <div className="flex bg-gray-100 dark:bg-black/50 p-1 rounded-xl border border-gray-200/50 dark:border-white/5 ml-auto xl:ml-2">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-luxury-card text-luxury-red shadow-sm' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-luxury-card text-luxury-red shadow-sm' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-white dark:bg-luxury-card rounded-2xl shadow-sm border border-gray-200 dark:border-luxury-border overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 dark:bg-luxury-dark sticky top-0 z-10 border-b border-gray-200 dark:border-luxury-border">
                <tr>
                  <th className="py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest">Nombre</th>
                  <th className="py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest">Puesto</th>
                  <th className="py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest">Medio</th>
                  <th className="py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest">Tipo / Fuente</th>
                  <th className="py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest text-center">Tier</th>
                  <th className="py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest">Contacto</th>
                  <th className="py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest text-center">Estado</th>
                  <th className="py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-luxury-border">
                {loading ? (
                  <tr><td colSpan={8} className="text-center py-8 text-gray-500">Cargando...</td></tr>
                ) : filteredReporters.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-8 text-gray-500">No hay reporteros encontrados.</td></tr>
                ) : (
                  filteredReporters.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        {r.photo_url ? (
                          <img src={r.photo_url} alt={r.full_name} className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-luxury-border shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border flex items-center justify-center shrink-0">
                            <span className="text-gray-400 font-bold text-xs">{r.full_name.charAt(0)}</span>
                          </div>
                        )}
                        <div>
                          <div className={`font-bold text-sm ${r.is_active ? 'text-gray-900 dark:text-white' : 'text-gray-500 line-through'}`}>{r.full_name}</div>
                          {r.birth_date && <div className="text-[10px] text-gray-400">Nac: {r.birth_date}</div>}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-600 dark:text-gray-300">{r.position || '-'}</td>
                      <td className="py-3 px-4 text-xs font-bold text-gray-800 dark:text-gray-200">{r.press_media?.name || '-'}</td>
                      <td className="py-3 px-4 text-xs">
                        <span className="bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-md mr-1">{r.press_media_types?.name || '-'}</span>
                        {r.press_sources?.name && <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md">{r.press_sources.name}</span>}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${r.tier === 1 ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : r.tier === 2 ? 'bg-gray-100 text-gray-800 border border-gray-200' : 'bg-orange-100 text-orange-800 border border-orange-200'}`}>Tier {r.tier}</span>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-500">
                        <div>{r.email || '-'}</div>
                        <div>{r.phone || '-'}</div>
                        {r.press_campaigns && r.press_campaigns.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {r.press_campaigns.map((c, idx) => (
                              <span key={idx} className="text-[9px] bg-luxury-red/10 text-luxury-red px-1.5 py-0.5 rounded font-bold">
                                {c.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-[10px] font-black px-2 py-1 rounded uppercase ${r.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {r.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleView(r)} className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-100 dark:bg-white/5 rounded-lg border border-transparent hover:border-gray-300 dark:hover:border-luxury-border" title="Ver Detalles"><Eye size={16} /></button>
                          <button onClick={() => handleToggleActive(r.id, r.is_active)} className={`p-1.5 transition-colors ${r.is_active ? 'text-green-500 hover:text-red-500' : 'text-red-500 hover:text-green-500'}`} title={r.is_active ? 'Desactivar' : 'Reactivar'}>
                            {r.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8 text-gray-500">Cargando...</div>
          ) : filteredReporters.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">No hay reporteros encontrados.</div>
          ) : (
            filteredReporters.map(r => (
              <div key={r.id} className={`bg-white dark:bg-luxury-card rounded-2xl shadow-sm border ${r.is_active ? 'border-gray-200 dark:border-luxury-border' : 'border-gray-200 dark:border-luxury-border opacity-60'} flex flex-col overflow-hidden hover:shadow-md transition-shadow relative group`}>
                
                {/* Active Toggle & View Action (Top Right) */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button onClick={() => handleView(r)} className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white/80 dark:bg-black/40 backdrop-blur rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm" title="Ver Detalles">
                    <Eye size={16} />
                  </button>
                  <button onClick={() => handleToggleActive(r.id, r.is_active)} className={`p-1.5 bg-white/80 dark:bg-black/40 backdrop-blur rounded-lg shadow-sm transition-colors ${r.is_active ? 'text-green-500 hover:text-red-500' : 'text-red-500 hover:text-green-500'}`} title={r.is_active ? 'Desactivar' : 'Reactivar'}>
                    {r.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  </button>
                </div>

                <div className="p-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full border-4 border-gray-50 dark:border-luxury-dark shadow-sm bg-gray-100 dark:bg-luxury-dark flex items-center justify-center overflow-hidden mb-4">
                    {r.photo_url ? (
                      <img src={r.photo_url} alt={r.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-black text-gray-300">{r.full_name.charAt(0)}</span>
                    )}
                  </div>
                  
                  <h3 className={`font-black text-lg ${r.is_active ? 'text-gray-900 dark:text-white' : 'text-gray-500 line-through'} line-clamp-1 w-full uppercase`}>{r.full_name}</h3>
                  <p className="text-xs font-bold text-gray-500 uppercase mt-1 mb-3 line-clamp-1">{r.position || '-'}</p>

                  <div className="w-full bg-gray-50 dark:bg-luxury-dark rounded-xl p-3 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-bold uppercase">Medio</span>
                      <span className="text-gray-800 dark:text-gray-200 font-black truncate max-w-[120px]">{r.press_media?.name || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-bold uppercase">Tipo</span>
                      <span className="text-gray-600 dark:text-gray-400 font-bold">{r.press_media_types?.name || '-'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto border-t border-gray-100 dark:border-luxury-border p-4 bg-gray-50/50 dark:bg-luxury-dark/50 flex justify-between items-center">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl uppercase shadow-sm ${
                    r.tier === 1 ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 
                    r.tier === 2 ? 'bg-gray-200 text-gray-800 border border-gray-300' : 
                    'bg-orange-100 text-orange-800 border border-orange-200'
                  }`}>
                    Tier {r.tier}
                  </span>
                  
                  <button onClick={() => handleView(r)} className="text-xs font-black text-luxury-red hover:text-red-700 uppercase flex items-center gap-1 transition-colors">
                    Ver Perfil <Eye size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      <ReporterModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        reporter={selectedReporter}
        media={media}
        sources={sources}
        mediaTypes={mediaTypes}
        campaigns={campaigns}
        onRefresh={refetch}
        profileId={profileId}
      />
      <ReporterViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        reporter={viewingReporter}
        onEdit={(r) => {
          setViewModalOpen(false);
          handleEdit(r);
        }}
      />
    </div>
  );
}
