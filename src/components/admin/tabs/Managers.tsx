import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LayoutGrid, List, Search, UserPlus, Loader2, X, FolderKanban, Clock, Target, ExternalLink } from 'lucide-react';
import ManagerCard from '../ui/ManagerCard';
import ManagerListRow from '../ui/ManagerListRow';
import AddManagerModal from '../modals/AddManagerModal';
import EditManagerModal from '../modals/EditManagerModal';
import EditRequestModal from '../modals/EditRequestModal'; 
import { supabase } from '../../../lib/supabase';
import Swal from 'sweetalert2';

// 🔥 COMPONENTE: MODAL DE SOLICITUDES DEL MANAGER
function ManagerRequestsModal({ 
  manager, 
  onClose, 
  staffCatalog, 
  prioritiesCatalog 
}: { 
  manager: any, 
  onClose: () => void, 
  staffCatalog: any[], 
  prioritiesCatalog: any[] 
}) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 🔥 ESTADO PARA ABRIR EL MODAL DE DETALLE DEL TICKET
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  useEffect(() => {
    if (manager && !selectedRequest) fetchRequests();
  }, [manager, selectedRequest]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          organizations ( name ),
          projects ( name ),
          priorities ( level, color_code ),
          request_categories ( name ),
          request_tasks (*),
          profiles ( full_name ),
          file_extensions:target_format_id(extension)
        `)
        .eq('requester_id', manager.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      aprobado: 'bg-green-500/10 text-green-500 border-green-500/20',
      completado: 'bg-green-500/10 text-green-500 border-green-500/20',
      aprobado_interno: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      en_proceso: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      en_revision_cliente: 'bg-cyan-500/10 text-cyan-400 border-cyan-200/20',
      con_correcciones: 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse',
      entregado: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    };
    return styles[status] || 'bg-gray-100 dark:bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-500/20';
  };

  return createPortal(
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-50 dark:bg-[#0a0a0c] w-full max-w-5xl rounded-[20px] overflow-hidden shadow-2xl flex flex-col h-[85vh] transition-colors duration-300">
        
        {/* HEADER LIMPIO (Mismo estilo que el modal de tickets) */}
        <div className="bg-luxury-red px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-black/10 flex items-center justify-center">
              <FolderKanban className="text-white" size={20}/>
            </div>
            <div>
              <h2 className="text-white font-black text-lg uppercase tracking-tight leading-tight">
                Historial de Solicitudes
              </h2>
              <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                MANAGER • {manager.name}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-white flex items-center justify-center transition-colors cursor-pointer">
            <X size={16} strokeWidth={3} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 flex flex-col">
          <div className="flex-1 space-y-4">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-luxury-red border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Cargando tickets...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-gray-300 dark:border-zinc-800 rounded-2xl bg-white/50 dark:bg-[#070709]/30">
                <FolderKanban className="mx-auto text-gray-400 dark:text-gray-700 mb-4" size={48} />
                <p className="text-gray-500 text-xs font-black uppercase tracking-widest">No ha registrado solicitudes</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {requests.map((req) => (
                  <div 
                    key={req.id} 
                    onClick={() => setSelectedRequest(req)} 
                    className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-zinc-800/80 p-5 rounded-2xl hover:border-luxury-red/50 dark:hover:border-luxury-red/50 transition-all group shadow-sm cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <ExternalLink className="text-luxury-red" size={24} strokeWidth={2.5} />
                    </div>
                    
                    <div className="flex justify-between items-start mb-4 pr-10">
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-full border border-gray-200 dark:border-white/5">
                          {req.request_categories?.name || 'General'}
                        </span>
                        <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(req.status)}`}>
                          {req.status.replace(/_/g, ' ')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 shrink-0">
                        <Clock size={12} className="text-luxury-red" />
                        <span className="text-[10px] font-bold">{new Date(req.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2 group-hover:text-luxury-red transition-colors pr-10">
                      {req.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-4 line-clamp-2 pr-10">{req.description}</p>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-zinc-800/60 pr-10">
                      <span className="text-[8px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">Tablero: {req.projects?.name || 'General'}</span>
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#141419] flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:bg-luxury-red/10 group-hover:text-luxury-red transition-colors">
                         <Target size={14} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 🔥 RENDERIZAMOS EL MODAL MAESTRO POR ENCIMA CUANDO SELECCIONAN UN TICKET */}
        {selectedRequest && (
          <EditRequestModal 
            isOpen={!!selectedRequest}
            onClose={() => setSelectedRequest(null)}
            request={selectedRequest}
            staffCatalog={staffCatalog}
            prioritiesCatalog={prioritiesCatalog}
            onRefresh={fetchRequests}
          />
        )}
      </div>
    </div>,
    document.body
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function Managers() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [managers, setManagers] = useState<any[]>([]);
  
  const [managerFilter, setManagerFilter] = useState<'activos' | 'inactivos'>('activos');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [managerToEdit, setManagerToEdit] = useState<any | null>(null);
  const [managerForRequests, setManagerForRequests] = useState<any | null>(null);

  // 🔥 ESTADOS PARA LOS CATÁLOGOS DEL MODAL DE TICKETS
  const [staffCatalog, setStaffCatalog] = useState<any[]>([]);
  const [prioritiesCatalog, setPrioritiesCatalog] = useState<any[]>([]);

  // CARGA INICIAL DE CATÁLOGOS
  useEffect(() => {
    const fetchCatalogs = async () => {
      const [staffRes, priosRes] = await Promise.all([
        // 🔥 CORRECCIÓN 1: Traemos las nuevas tablas y usamos is_active para el catálogo del modal interno
        supabase.from('profiles').select('*, internal_roles(name), specialties(name)').eq('is_active', true),
        supabase.from('priorities').select('*')
      ]);
      if (staffRes.data) {
        // Aplanamos igual que en los demás lados para que EditRequestModal no llore
        const mappedStaff = staffRes.data.map((s:any) => ({
          ...s,
          internal_role: s.internal_roles?.name || null,
          specialty: s.specialties?.name || null
        }));
        setStaffCatalog(mappedStaff);
      }
      if (priosRes.data) setPrioritiesCatalog(priosRes.data);
    };
    fetchCatalogs();
  }, []);

  useEffect(() => {
    if (!isModalOpen && !managerToEdit) fetchManagers();
  }, [isModalOpen, managerToEdit, managerFilter]);

  const fetchManagers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id, 
        full_name, 
        email, 
        phone, 
        avatar_url,
        is_active, 
        organization_members (
          role_in_org,
          organizations ( id, name )
        )
      `)
      // 🔥 CORRECCIÓN 2: Quitamos el "internal_role" del select y ordenamos normal
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error al traer managers:", error);
      return;
    }

    const formattedManagers = data
      .filter((profile: any) => {
        // 🔥 CORRECCIÓN 3: Usamos is_active para decidir si está en el historial
        if (managerFilter === 'activos' && !profile.is_active) return false;
        if (managerFilter === 'inactivos' && profile.is_active) return false;

        const hasOrg = profile.organization_members && profile.organization_members.length > 0;
        return hasOrg;
      })
      .map((profile: any) => {
        const orgMember = profile.organization_members[0];
        return {
          id: profile.id,
          name: profile.full_name || 'Sin Nombre',
          email: profile.email || 'N/A',
          phone: profile.phone || 'N/A',
          avatar: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || 'X')}&background=1E1E24&color=D3002D`,
          role: orgMember.role_in_org || 'Responsable',
          company: orgMember.organizations ? orgMember.organizations.name : 'Sin Empresa',
          company_id: orgMember.organizations ? orgMember.organizations.id : null,
          is_active: profile.is_active
        };
      });

    setManagers(formattedManagers);
  };

  const handleDeleteManager = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: `¿Inhabilitar a ${name}?`,
      text: "El encargado pasará al historial y no podrá acceder al sistema.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#D3002D',
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'SÍ, INHABILITAR',
      cancelButtonText: 'CANCELAR'
    });

    if (result.isConfirmed) {
      // 🔥 CORRECCIÓN 4: Actualizamos is_active a false en lugar del string viejo
      const { error } = await supabase.from('profiles').update({ is_active: false }).eq('id', id);
      if (!error) {
        Swal.fire({ title: 'Inhabilitado', text: 'Usuario enviado al historial.', icon: 'success', confirmButtonColor: '#D3002D' });
        fetchManagers();
      }
    }
  };

  const handleRestoreManager = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: `¿Reactivar a ${name}?`,
      text: "El encargado volverá a tener acceso a su tablero corporativo.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'SÍ, ACTIVAR',
      cancelButtonText: 'CANCELAR'
    });

    if (result.isConfirmed) {
      // 🔥 CORRECCIÓN 5: Actualizamos is_active a true en lugar de internal_role a null
      const { error } = await supabase.from('profiles').update({ is_active: true }).eq('id', id);
      if (!error) {
        Swal.fire({ title: 'Reactivado', text: 'El encargado volvió a estar activo.', icon: 'success', confirmButtonColor: '#10B981' });
        fetchManagers();
      }
    }
  };

  const filteredManagers = managers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 transition-colors duration-300">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors duration-300">Gestión de <span className="text-luxury-red">Encargados</span></h1>
          <p className="text-gray-500 text-sm transition-colors duration-300">Responsables estratégicos ({filteredManagers.length})</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-luxury-red hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-luxury-red/20 active:scale-95 cursor-pointer">
          <UserPlus size={18}/> REGISTRAR ENCARGADO
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-luxury-border p-4 rounded-2xl shadow-sm dark:shadow-none transition-colors duration-300">
        <div className="flex bg-gray-50 dark:bg-[#050505] p-1.5 rounded-xl border border-gray-200 dark:border-luxury-border select-none shrink-0 w-full lg:w-auto">
          <button onClick={() => setManagerFilter('activos')} className={`flex-1 lg:flex-none px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${managerFilter === 'activos' ? 'bg-white dark:bg-[#1A1A21] text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Activos</button>
          <button onClick={() => setManagerFilter('inactivos')} className={`flex-1 lg:flex-none px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${managerFilter === 'inactivos' ? 'bg-white dark:bg-[#1A1A21] text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Historial</button>
        </div>

        <div className="flex-1 relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors duration-300" size={18}/>
          <input type="text" placeholder="Buscar por nombre o empresa..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-luxury-border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-luxury-red text-gray-900 dark:text-white transition-all text-xs font-bold duration-300" />
        </div>
        <div className="flex bg-gray-50 dark:bg-[#050505] p-1 rounded-xl border border-gray-200 dark:border-luxury-border transition-colors duration-300 w-full lg:w-auto shrink-0 justify-center">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${viewMode === 'grid' ? 'bg-luxury-red text-white' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}><LayoutGrid size={20}/></button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${viewMode === 'list' ? 'bg-luxury-red text-white' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}><List size={20}/></button>
        </div>
      </div>

      {managers.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-300 dark:border-luxury-border rounded-2xl transition-colors duration-300">
          <p className="text-gray-500 text-xs font-black tracking-widest uppercase">No hay encargados en este bloque.</p>
        </div>
      ) : filteredManagers.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-300 dark:border-luxury-border rounded-2xl transition-colors duration-300">
          <p className="text-gray-500 font-bold uppercase tracking-wider text-xs">No se encontraron resultados.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredManagers.map(m => (
            <ManagerCard 
              key={m.id} 
              manager={m} 
              onEdit={() => setManagerToEdit(m)} 
              onDelete={() => handleDeleteManager(m.id, m.name)}
              onRestore={() => handleRestoreManager(m.id, m.name)}
              onViewRequests={() => setManagerForRequests(m)} 
              isHistorial={managerFilter === 'inactivos'}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-luxury-border rounded-2xl overflow-hidden shadow-md dark:shadow-xl transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-gray-50 dark:bg-white/5 text-[10px] uppercase tracking-widest text-gray-500 font-bold transition-colors duration-300 border-b border-gray-200 dark:border-luxury-border">
                <tr>
                  <th className="px-6 py-4">Responsable</th>
                  <th className="px-6 py-4">Empresa / Cliente</th>
                  <th className="px-6 py-4">Contacto</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-luxury-border transition-colors duration-300">
                {filteredManagers.map(m => (
                  <ManagerListRow 
                    key={m.id} 
                    manager={m} 
                    onEdit={() => setManagerToEdit(m)}
                    onDelete={() => handleDeleteManager(m.id, m.name)}
                    onRestore={() => handleRestoreManager(m.id, m.name)}
                    onViewRequests={() => setManagerForRequests(m)} 
                    isHistorial={managerFilter === 'inactivos'}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AddManagerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchManagers} />
      
      {managerToEdit && <EditManagerModal isOpen={!!managerToEdit} onClose={() => setManagerToEdit(null)} manager={managerToEdit} onRefresh={fetchManagers} />}
      
      {/* 🔥 RENDEREAMOS EL MODAL INTERMEDIO DE HISTORIAL DE TICKETS */}
      {managerForRequests && (
        <ManagerRequestsModal 
          manager={managerForRequests} 
          onClose={() => setManagerForRequests(null)} 
          staffCatalog={staffCatalog}
          prioritiesCatalog={prioritiesCatalog}
        />
      )}
    </div>
  );
}