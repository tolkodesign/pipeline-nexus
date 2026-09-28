import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Trash2, Loader2, Mail, ArrowLeft, UserPlus } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { NORMALIZED_ROLES } from '../../../lib/identity';
import { useAuth } from '../../../context/AuthContext';
import Swal from 'sweetalert2';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preselectedOrgId?: string | null; // 🔥 PERMITE ABRIR DIRECTO EN LA MARCA ACTIVA
}

export default function ManageDistributionModal({ isOpen, onClose, preselectedOrgId }: Props) {
  const { user, profile } = useAuth();

  const isAdmin = profile?.normalized_role === NORMALIZED_ROLES.ADMIN;

  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);

  // Estado de navegación Drill-Down
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchData();
      if (preselectedOrgId) {
        setActiveOrgId(preselectedOrgId);
      } else {
        setActiveOrgId(null);
      }
    } else {
      setActiveOrgId(null);
      setSelectedProfile('');
    }
  }, [isOpen, preselectedOrgId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Cargar Organizaciones
      let orgsQuery = supabase.from('organizations').select('id, name, logo_url, banner_url').order('name');
      
      if (!isAdmin && user?.id) {
        const { data: myDist } = await supabase
          .from('organization_distribution_lists')
          .select('organization_id')
          .eq('profile_id', user.id);
        const myOrgIds = myDist?.map(d => d.organization_id) || [];
        orgsQuery = orgsQuery.in('id', myOrgIds.length > 0 ? myOrgIds : ['00000000-0000-0000-0000-000000000000']);
      }

      const { data: orgs } = await orgsQuery;
      setOrganizations(orgs || []);

      // 2. 🔥 REGLA DE ORO: Solo Líderes (2), Coordinadores (4) y Ejecutivos de Comunicación (5)
      const { data: staffData, error: staffError } = await supabase
        .from('profiles')
        .select('id, full_name, role_id, specialty_id, internal_roles(name), specialties(name)')
        .in('role_id', [2, 4, 5])
        .eq('is_active', true)
        .eq('is_active', true)
        .order('full_name');

      if (staffError) throw staffError;

      const allowedStaff = (staffData || []).map((s: any) => ({
        ...s,
        internal_role: s.internal_roles?.name || 'Mando',
        specialty: s.specialties?.name || ''
      }));
      setStaff(allowedStaff);

      // 3. Cargar la lista actual de asignados en distribución
      const { data: current, error: currentError } = await supabase
        .from('organization_distribution_lists')
        .select(`
          organization_id,
          profile_id,
          organizations(name, logo_url, banner_url),
          profiles(id, full_name, email, avatar_url, role_id, specialty_id, internal_roles(name), specialties(name))
        `);

      if (currentError) throw currentError;

      const formattedAssignments = (current || []).map((item: any) => {
        if (item.profiles) {
          item.profiles.internal_role = item.profiles.internal_roles?.name || 'Mando';
          item.profiles.specialty = item.profiles.specialties?.name || '';
        }
        return item;
      });

      setAssignments(formattedAssignments);
    } catch (error) {
      console.error("Error cargando listas de distribución:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAssignment = async () => {
    if (!activeOrgId || !selectedProfile) return;

    try {
      const { error } = await supabase
        .from('organization_distribution_lists')
        .insert([{ organization_id: activeOrgId, profile_id: selectedProfile }]);

      if (error) throw error;
      
      setSelectedProfile(''); 
      fetchData(); 
    } catch (error: any) {
      Swal.fire({ title: 'Error', text: error.message || 'No se pudo vincular al responsable.', icon: 'error', confirmButtonColor: '#D3002D' });
    }
  };

  const handleRemove = async (orgId: string, profId: string) => {
    try {
      const { error } = await supabase
        .from('organization_distribution_lists')
        .delete()
        .match({ organization_id: orgId, profile_id: profId });

      if (error) throw error;
      fetchData();
    } catch (error: any) {
      console.error("Error al remover de la lista:", error);
    }
  };

  const currentOrg = organizations.find(o => o.id === activeOrgId);
  const availableStaff = staff.filter(s => !assignments.some(a => a.organization_id === activeOrgId && a.profile_id === s.id));
  const activeListMembers = assignments.filter(a => a.organization_id === activeOrgId);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200000] flex items-center justify-center p-4 md:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-50 dark:bg-[#0a0a0c] border border-gray-200 dark:border-luxury-border w-full max-w-5xl rounded-[24px] overflow-hidden shadow-2xl flex flex-col h-[85vh] transition-colors duration-300">
        
        {/* HEADER */}
        <div className="bg-luxury-red px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            {activeOrgId && !preselectedOrgId && (
              <button 
                onClick={() => { setActiveOrgId(null); setSelectedProfile(''); }}
                className="w-10 h-10 rounded-xl bg-black/10 hover:bg-black/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Volver a las marcas"
              >
                <ArrowLeft size={20} strokeWidth={2.5}/>
              </button>
            )}
            <div>
              <h2 className="text-white font-black text-lg uppercase tracking-tight leading-tight">
                {activeOrgId ? `Lista de Distribución: ${currentOrg?.name || 'Cargando...'}` : 'Listas de Distribución'}
              </h2>
              <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                {activeOrgId ? 'Líderes, Coordinadores y Ejecutivos suscritos a los alertas de esta marca' : 'Selecciona una marca para gestionar su lista'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-white flex items-center justify-center transition-colors cursor-pointer">
            <X size={16} strokeWidth={3} />
          </button>
        </div>

        {/* CUERPO DEL MODAL */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 relative">
          {loading && assignments.length === 0 ? (
            <div className="flex h-full items-center justify-center py-20"><Loader2 className="animate-spin text-luxury-red" size={32}/></div>
          ) : (
            <>
              {!activeOrgId ? (
                /* REJILLA GENERAL SI SE ABRIÓ DESDE EL TEAM GLOBAL */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-200">
                  {organizations.map(org => {
                    const memberCount = assignments.filter(a => a.organization_id === org.id).length;

                    return (
                      <div 
                        key={org.id}
                        onClick={() => setActiveOrgId(org.id)}
                        className="relative group cursor-pointer overflow-hidden rounded-2xl border border-gray-200/80 dark:border-white/[0.06] hover:border-luxury-red/50 dark:hover:border-luxury-red/50 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[170px]"
                        style={{
                          backgroundImage: org.banner_url 
                            ? `linear-gradient(to bottom, rgba(15, 15, 18, 0.45), rgba(15, 15, 18, 0.9)), url(${org.banner_url})` 
                            : 'linear-gradient(to bottom right, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        {!org.banner_url && (
                          <div className="absolute inset-0 bg-white dark:bg-[#141419] -z-10" />
                        )}

                        <div className="flex items-start justify-between gap-4 relative z-10">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border backdrop-blur-md transition-all ${
                            memberCount > 0 
                              ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' 
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                          }`}>
                            {memberCount > 0 ? `${memberCount} Responsables` : 'Sin Asignar'}
                          </span>
                        </div>

                        <div className="mt-8 relative z-10">
                          <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide group-hover:text-luxury-red transition-colors truncate">{org.name}</h4>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
                            Configurar Lista →
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* VISTA ESPECÍFICA DE LA MARCA (EJ: AMIB) */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in slide-in-from-right-8 duration-300 relative">
                  
                  {currentOrg?.logo_url && (
                    <img 
                      src={currentOrg.logo_url} 
                      className="absolute right-6 bottom-6 w-80 h-80 object-contain opacity-[0.03] dark:opacity-[0.02] pointer-events-none select-none blur-[1px] mix-blend-luminosity dark:mix-blend-screen z-0" 
                      alt=""
                    />
                  )}

                  {/* PANEL IZQUIERDO: SELECCIONAR Y AGREGAR MANDO */}
                  <div className="bg-white dark:bg-[#141419] border border-gray-200 dark:border-zinc-800/80 p-6 rounded-2xl shadow-sm flex flex-col gap-4 relative z-10 transition-colors duration-300">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <UserPlus size={14} className="text-luxury-red"/> Vincular Mando / Responsable
                    </h3>
                    
                    <div className="space-y-4 mt-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400">Líderes, Coordinadores y Ejecutivos</label>
                        <select 
                          value={selectedProfile} 
                          onChange={e => setSelectedProfile(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-[#070709] border border-gray-200 dark:border-zinc-800 rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-luxury-red cursor-pointer transition-all shadow-inner"
                        >
                          <option value="">Elegir responsable a vincular...</option>
                          {availableStaff.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.full_name} ({s.internal_role}{s.specialty ? ` - ${s.specialty}` : ''})
                            </option>
                          ))}
                        </select>
                      </div>

                      <button 
                        onClick={handleAddAssignment}
                        disabled={!selectedProfile}
                        className="w-full bg-luxury-red hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-luxury-red text-white py-3.5 rounded-xl text-xs font-black tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-luxury-red/20 uppercase"
                      >
                        <Plus size={16} strokeWidth={3}/> AGREGAR A LA LISTA
                      </button>
                    </div>

                    <div className="p-4 bg-luxury-red/5 border border-luxury-red/10 rounded-xl mt-2">
                      <p className="text-[10px] text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                        ⚠️ Únicamente los mandos vinculados a esta lista recibirán las notificaciones por correo de {currentOrg?.name}.
                      </p>
                    </div>
                  </div>

                  {/* PANEL DERECHO: MANDOS ACTIVOS EN LA CUENTA */}
                  <div className="lg:col-span-2 space-y-4 relative z-10">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 px-1 border-b border-gray-200 dark:border-zinc-800/80 pb-3">
                      Responsables Suscritos ({activeListMembers.length})
                    </h3>

                    {activeListMembers.length === 0 ? (
                      <div className="border border-dashed border-gray-300 dark:border-zinc-800 rounded-2xl p-12 text-center bg-white/50 dark:bg-white/[0.01]">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">No hay mandos o ejecutivos vinculados a esta lista de distribución.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {activeListMembers.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-zinc-800/80 shadow-sm transition-colors duration-300 group hover:border-gray-300 dark:hover:border-zinc-700">
                            <div className="flex items-center gap-4 min-w-0">
                              <img 
                                src={item.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.profiles?.full_name || 'X')}&background=1E1E24&color=D3002D`}
                                className="w-10 h-10 rounded-xl object-cover border border-luxury-red/30 shrink-0" 
                                alt=""
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight truncate">{item.profiles?.full_name || 'Sin Nombre'}</p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest truncate mt-0.5 flex items-center gap-1.5">
                                  {item.profiles?.internal_role} {item.profiles?.specialty ? `• ${item.profiles.specialty}` : ''}
                                </p>
                              </div>
                            </div>

                            <button 
                              onClick={() => handleRemove(item.organization_id, item.profile_id)}
                              className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all cursor-pointer shrink-0"
                              title="Remover de la lista"
                            >
                              <Trash2 size={16}/>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>,
    document.body
  );
}
