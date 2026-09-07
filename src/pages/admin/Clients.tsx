import { useState, useEffect } from 'react';
import { LayoutGrid, List, Search, UserPlus } from 'lucide-react';
import ClientCard from '../../components/admin/ui/ClientCard';
import ClientListRow from '../../components/admin/ui/ClientListRow';
import AddClientModal from '../../components/admin/modals/AddClientModal';
import EditClientModal from '../../components/admin/modals/EditClientModal'; 
// 🔥 1. IMPORTAMOS EL NUEVO MODAL (Ajusta la ruta si lo guardaste en otra carpeta)
import DeliverablesManagerModal from '../../components/admin/modals/DeliverablesManagerModal';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';

export default function Clients() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState<any[]>([]);

  // 🛠️ ESTADOS DE CONTROL Y FILTRADO
  const [clientFilter, setClientFilter] = useState<'activos' | 'inactivos'>('activos');
  const [searchQuery, setSearchQuery] = useState('');
  const [clientToEdit, setClientToEdit] = useState<any | null>(null);

  // 🔥 2. ESTADOS PARA EL MODAL DE ENTREGABLES
  const [isDeliverablesOpen, setIsDeliverablesOpen] = useState(false);
  const [clientForDeliverables, setClientForDeliverables] = useState<any | null>(null);

  useEffect(() => {
    if (!isModalOpen && !clientToEdit && !isDeliverablesOpen) {
      fetchClients();
    }
  }, [isModalOpen, clientToEdit, isDeliverablesOpen, clientFilter]);

  const fetchClients = async () => {
    console.log("Consultando clientes a Supabase...");
    
    const { data, error } = await supabase
      .from('organizations')
      .select(`
        id, 
        name, 
        industry, 
        logo_url,
        is_active,
        organization_members (
          role_in_org,
          profiles ( id, full_name, avatar_url, phone, email )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error de Supabase:", error);
      return;
    }

    // Mapeo blindado
    const formattedClients = data.map((org: any) => {
      const hasMembers = org.organization_members && org.organization_members.length > 0;
      const mainManager = hasMembers ? org.organization_members[0].profiles : null;
      
      return {
        id: org.id,
        empresa: org.name || 'Empresa Desconocida',
        industry: org.industry, 
        proyectos: 0, 
        // 🔥 VALIDACIÓN DE ESTADO ACTIVO
        is_active: org.is_active !== false,
        avatar: org.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(org.name || 'X')}&background=1E1E24&color=fff`,
        name: mainManager ? mainManager.full_name : 'Sin Encargado',
        role: mainManager ? 'Responsable' : 'Pendiente', // Cambiado a Responsable
        email: mainManager?.email || org.email || 'Sin correo', 
      };
    });

    setClients(formattedClients);
  };

  // 🛠️ LOGICA PARA INHABILITAR (SOFT-DELETE)
  const handleDeleteClient = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: `¿Deshabilitar ${name}?`,
      text: "La empresa pasará al historial de marcas inactivas.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#D3002D',
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'SÍ, DESHABILITAR',
      cancelButtonText: 'CANCELAR'
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from('organizations').update({ is_active: false }).eq('id', id);
      if (!error) {
        Swal.fire({ title: 'Deshabilitada', text: 'Marca archivada con éxito.', icon: 'success', confirmButtonColor: '#D3002D' });
        fetchClients();
      }
    }
  };

  // 🛠️ LOGICA PARA REACTIVAR
  const handleRestoreClient = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: `¿Reactivar ${name}?`,
      text: "La empresa volverá a estar activa en el directorio global.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'SÍ, ACTIVAR',
      cancelButtonText: 'CANCELAR'
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from('organizations').update({ is_active: true }).eq('id', id);
      if (!error) {
        Swal.fire({ title: 'Reactivada', text: 'La marca volvió al directorio activo.', icon: 'success', confirmButtonColor: '#10B981' });
        fetchClients();
      }
    }
  };

  // 🔥 FILTRADO INTELIGENTE (Buscador + Activos/Historial)
  const filteredClients = clients.filter(client => {
    const matchesStatus = clientFilter === 'activos' ? client.is_active : !client.is_active;
    const matchesSearch = client.empresa.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (client.industry || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 transition-colors duration-300">
      
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors duration-300">Directorio <span className="text-luxury-red">Tolko</span></h1>
          <p className="text-gray-500 text-sm transition-colors duration-300">Empresas: {filteredClients.length} registradas</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-luxury-red hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-luxury-red/20 active:scale-95 transition-all duration-300 cursor-pointer">
          <UserPlus size={18}/> NUEVO CLIENTE
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-luxury-border shadow-sm dark:shadow-none p-4 rounded-2xl transition-colors duration-300 w-full">
        
        {/* 🔥 TABS FILTRO OPERATIVO */}
        <div className="flex bg-gray-50 dark:bg-[#050505] p-1.5 rounded-xl border border-gray-200 dark:border-luxury-border select-none shrink-0 w-full lg:w-auto">
          <button 
            onClick={() => setClientFilter('activos')} 
            className={`flex-1 lg:flex-none px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${clientFilter === 'activos' ? 'bg-white dark:bg-[#1A1A21] text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
          >
            Activos
          </button>
          <button 
            onClick={() => setClientFilter('inactivos')} 
            className={`flex-1 lg:flex-none px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${clientFilter === 'inactivos' ? 'bg-white dark:bg-[#1A1A21] text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
          >
            Historial
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:flex-1 justify-end">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors duration-300" size={18}/>
            <input type="text" placeholder="Buscar por nombre o industria..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-luxury-border rounded-xl py-3 pl-12 pr-4 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-luxury-red dark:focus:border-luxury-red transition-colors duration-300" />
          </div>
          <div className="flex bg-gray-50 dark:bg-[#050505] p-1 rounded-xl border border-gray-200 dark:border-luxury-border transition-colors duration-300 shrink-0">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${viewMode === 'grid' ? 'bg-luxury-red text-white' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}><LayoutGrid size={20}/></button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${viewMode === 'list' ? 'bg-luxury-red text-white' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}><List size={20}/></button>
          </div>
        </div>
      </div>

      {/* RENDER GRID / LIST */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-300 dark:border-luxury-border rounded-2xl transition-colors duration-300">
          <p className="text-gray-500 text-xs font-black uppercase tracking-widest">No hay marcas registradas en este bloque</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map(client => (
            <ClientCard 
              key={client.id} 
              client={client} 
              onEdit={() => setClientToEdit(client)} 
              onDelete={() => handleDeleteClient(client.id, client.empresa)}
              onRestore={() => handleRestoreClient(client.id, client.empresa)}
              isHistorial={clientFilter === 'inactivos'}
              // 🔥 3. CONECTAMOS EL BOTÓN AL MODAL
              onManageDeliverables={() => {
                setClientForDeliverables(client);
                setIsDeliverablesOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-luxury-border rounded-2xl overflow-hidden shadow-md dark:shadow-xl transition-colors duration-300">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-white/5 text-[10px] uppercase tracking-widest text-gray-500 font-bold transition-colors duration-300 border-b border-gray-200 dark:border-luxury-border">
              <tr>
                <th className="px-6 py-4">Empresa / Logo</th>
                <th className="px-6 py-4">Responsable Actual</th>
                <th className="px-6 py-4">Proyectos</th>
                <th className="px-6 py-4">Contacto Principal</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-luxury-border transition-colors duration-300">
              {filteredClients.map(client => (
                <ClientListRow 
                  key={client.id} 
                  client={client} 
                  onEdit={() => setClientToEdit(client)} 
                  onDelete={() => handleDeleteClient(client.id, client.empresa)}
                  onRestore={() => handleRestoreClient(client.id, client.empresa)}
                  isHistorial={clientFilter === 'inactivos'}
                  // 🔥 4. CONECTAMOS EL BOTÓN AL MODAL AQUÍ TAMBIÉN
                  onManageDeliverables={() => {
                    setClientForDeliverables(client);
                    setIsDeliverablesOpen(true);
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODALES EXISTENTES */}
      <AddClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchClients} />

      {clientToEdit && (
        <EditClientModal 
          isOpen={!!clientToEdit} 
          onClose={() => setClientToEdit(null)} 
          client={clientToEdit} 
          onRefresh={fetchClients} 
        />
      )}

      {/* 🔥 5. PONEMOS EL NUEVO MODAL AQUÍ ABAJO */}
      <DeliverablesManagerModal 
        isOpen={isDeliverablesOpen}
        onClose={() => {
          setIsDeliverablesOpen(false);
          setClientForDeliverables(null);
        }}
        client={clientForDeliverables}
      />

    </div>
  );
}