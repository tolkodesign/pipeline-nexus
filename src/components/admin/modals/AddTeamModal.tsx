import { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, Camera, Upload, Send, Loader2, Lock } from 'lucide-react';
import Swal from 'sweetalert2';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext'; 

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export default function AddTeamModal({ isOpen, onClose, onRefresh }: Props) {
  const { profile } = useAuth();
  const isAdmin = profile?.internal_role === 'Admin';

  const [loading, setLoading] = useState(false);
  const [leaders, setLeaders] = useState<any[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '', 
    // 🔥 CAMBIO: Inicializamos con IDs en string (1 = Colaborador, 4 = Diseño)
    internalRole: '1', 
    specialty: '4', 
    leader_id: '' 
  });

  const [specialtiesCatalog, setSpecialtiesCatalog] = useState<any[]>([]);

  const fetchSpecialties = async () => {
    const { data } = await supabase.from('specialties').select('*').order('name');
    if (data) setSpecialtiesCatalog(data);
  };

  const fetchLeaders = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, role_id, specialty_id, internal_roles(name), specialties(name)') 
      .in('role_id', [2, 4, 5]); 
      
    if (data) {
      const formatted = data.map((l: any) => {
        // 🔥 Traductor infalible: Si falla el texto, le inyectamos el nombre según su ID exacto
        let exactRole = '';
        if (l.role_id === 2) exactRole = 'Líder';
        else if (l.role_id === 4) exactRole = 'Coordinador';
        else if (l.role_id === 5) exactRole = 'Ejecutivo';

        return {
          ...l,
          internal_role: l.internal_roles?.name || exactRole,
          specialty: l.specialties?.name || ''
        };
      });
      setLeaders(formatted);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (isAdmin) {
        fetchLeaders();
        fetchSpecialties();
      }
      
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        internalRole: '1', // 1 = Colaborador
        specialty: isAdmin ? '' : (profile?.specialty_id?.toString() || ''),
        leader_id: isAdmin ? '' : (profile?.id || '')
      });
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  }, [isOpen, isAdmin, profile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const edgeRole = isAdmin ? formData.internalRole : '1';
      // 👁️ CAMBIO: Parseo de IDs para la base de datos (Admin = 3)
      const finalSpecialty = isAdmin 
        ? (formData.internalRole === '3' ? null : (parseInt(formData.specialty) || null)) 
        : (parseInt(profile?.specialty_id) || null);
      
      const finalLeaderId = isAdmin 
        ? (['1', '4'].includes(formData.internalRole) ? (formData.leader_id || null) : null) 
        : profile?.id;

      // 1. Crear usuario en Auth
      const { data: edgeData, error: edgeError } = await supabase.functions.invoke('create-staff', {
        body: {
          email: formData.email,
          password: formData.password,
          name: formData.fullName,
          phone: formData.phone,
          // 🔥 NOTA: A tu edge function le seguimos mandando el rol para los metadata claims si es necesario
          role: edgeRole 
        }
      });

      if (edgeError) throw new Error("Error en el servidor: " + edgeError.message);
      if (edgeData?.error) throw new Error(edgeData.error);

      const newUserId = edgeData.user_id;

      // 2. Subir Avatar si hay
      let finalAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=1E1E24&color=D3002D&size=200&bold=true`;

      if (avatarFile) {
        const fileName = `${newUserId}-${Date.now()}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(`staff/${fileName}`, avatarFile);
        if (!uploadError) {
          finalAvatarUrl = supabase.storage.from('avatars').getPublicUrl(`staff/${fileName}`).data.publicUrl;
        }
      }

      // 3. Machetazo con .upsert() metiendo toda la data junta con las nuevas columnas
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: newUserId,
          full_name: formData.fullName,
          email: formData.email.trim(),
          phone: formData.phone || null,
          specialty_id: finalSpecialty,      // 🔥 NUEVA COLUMNA
          role_id: parseInt(edgeRole),       // 🔥 NUEVA COLUMNA
          leader_id: finalLeaderId,
          avatar_url: finalAvatarUrl,
          is_active: true
        });

      if (updateError) throw updateError;

      Swal.fire({ 
        title: 'COLABORADOR REGISTRADO!', 
        text: 'El usuario ya puede iniciar sesión con sus credenciales en su célula.', 
        icon: 'success', 
        confirmButtonColor: '#D3002D' 
      });
      
      if (onRefresh) onRefresh();
      onClose();

    } catch (error: any) {
      Swal.fire({ 
        title: 'Error', 
        text: error?.message || 'Ocurrió un error inesperado', 
        icon: 'error', 
        confirmButtonColor: '#D3002D' 
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔥 CAMBIO: Filtramos a los líderes comparando los IDs de especialidad
  const filteredLeaders = leaders.filter(lider => lider.specialty_id?.toString() === formData.specialty);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/90 backdrop-blur-sm animate-in fade-in duration-300 transition-colors">
      <div className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh] transition-colors duration-300">
        
        <button onClick={onClose} className="absolute top-5 right-5 text-white/70 hover:text-white z-20 transition-colors cursor-pointer"><X size={22} /></button>

        <div className="bg-luxury-red p-6 text-white shrink-0">
          <h2 className="text-xl font-black tracking-tight uppercase flex items-center gap-3">
            <ShieldCheck size={24} /> VINCULAR COLABORADOR TEAM TOLKO
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 overflow-y-auto custom-scrollbar space-y-8 bg-white dark:bg-transparent transition-colors duration-300">
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* LADO IZQUIERDO */}
            <div className="w-full md:w-1/3 flex flex-col items-center space-y-6">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-36 h-36 rounded-full bg-gray-50 dark:bg-black/50 border-2 border-dashed border-gray-300 dark:border-luxury-border flex items-center justify-center overflow-hidden group-hover:border-luxury-red dark:group-hover:border-luxury-red transition-colors duration-300 shadow-inner">
                  {avatarPreview ? <img src={avatarPreview} className="w-full h-full object-cover" alt="Preview" /> : <Camera className="text-gray-400 dark:text-gray-600 group-hover:text-luxury-red dark:group-hover:text-luxury-red transition-colors duration-300" size={32} />}
                </div>
                <button type="button" className="absolute bottom-2 right-2 bg-luxury-red p-2.5 rounded-full text-white shadow-lg cursor-pointer"><Upload size={14} /></button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} accept="image/*" />
              </div>

              <div className="w-full space-y-1">
                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1 transition-colors duration-300">Nivel de Acceso</label>
                {isAdmin ? (
                  <select value={formData.internalRole} onChange={e => setFormData({...formData, internalRole: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0a0a0c] border border-gray-300 dark:border-luxury-border rounded-xl p-3 text-sm text-gray-900 dark:text-white outline-none focus:border-luxury-red dark:focus:border-luxury-red appearance-none transition-colors duration-300 cursor-pointer">
                    {/* 🔥 CAMBIO: IDs mapeados a la BD */}
                    <option value="1">Colaborador</option>
                    <option value="4">Coordinador</option>
                    <option value="2">Líder</option>
                    <option value="5">Ejecutivo de Comunicación</option>
                    <option value="3">Admin</option>
                  </select>
                ) : (
                  <div className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl p-3 text-sm text-gray-500 dark:text-gray-400 font-bold flex items-center justify-between opacity-80 cursor-not-allowed">
                    <span>colaborador</span>
                    <Lock size={14} className="text-luxury-red/50" />
                  </div>
                )}
              </div>
            </div>

            {/* LADO DERECHO */}
            <div className="w-full md:w-2/3 space-y-6">
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1 transition-colors duration-300">Nombre Completo *</label>
                  <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0a0a0c] border border-gray-300 dark:border-luxury-border rounded-xl p-3 text-sm text-gray-900 dark:text-white outline-none focus:border-luxury-red dark:focus:border-luxury-red transition-all duration-300" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1 transition-colors duration-300">Email (Usuario) *</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0a0a0c] border border-gray-300 dark:border-luxury-border rounded-xl p-3 text-sm text-gray-900 dark:text-white outline-none focus:border-luxury-red dark:focus:border-luxury-red transition-all duration-300" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1 transition-colors duration-300">Teléfono</label>
                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0a0a0c] border border-gray-300 dark:border-luxury-border rounded-xl p-3 text-sm text-gray-900 dark:text-white outline-none focus:border-luxury-red dark:focus:border-luxury-red transition-all duration-300" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-luxury-red uppercase tracking-widest px-1">Contraseña Temporal *</label>
                  <input required type="text" placeholder="Ej: Tolko2026!" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0a0a0c] border border-gray-300 dark:border-luxury-red/30 rounded-xl p-3 text-sm text-gray-900 dark:text-white outline-none focus:border-luxury-red dark:focus:border-luxury-red transition-all duration-300" />
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 px-1 mt-1 transition-colors duration-300">Con esta clave ingresará al sistema.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-gray-200 dark:border-luxury-border/50 transition-colors duration-300">
                {isAdmin ? (
                  formData.internalRole !== '3' ? (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1 transition-colors duration-300">Especialidad</label>
                      <select 
                        value={formData.specialty} 
                        onChange={e => setFormData({...formData, specialty: e.target.value, leader_id: ''})} 
                        className="w-full bg-gray-50 dark:bg-[#0a0a0c] border border-gray-300 dark:border-luxury-border rounded-xl p-3 text-sm text-gray-900 dark:text-white outline-none focus:border-luxury-red dark:focus:border-luxury-red appearance-none transition-colors duration-300 cursor-pointer"
                      >
                        <option value="" disabled>Seleccionar Especialidad...</option>
                        {specialtiesCatalog.map(spec => (
                          <option key={spec.id} value={spec.id.toString()}>{spec.name}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-1 flex flex-col justify-center">
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1 transition-colors duration-300">Especialidad</span>
                      <span className="text-sm text-gray-400 dark:text-gray-600 italic px-1 transition-colors duration-300">Global (No aplica)</span>
                    </div>
                  )
                ) : (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1 transition-colors duration-300">Especialidad Operativa</label>
                    <div className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl p-3 text-sm text-gray-500 dark:text-gray-400 font-bold flex items-center justify-between opacity-80 cursor-not-allowed">
                      <span>{profile?.specialty}</span>
                      <Lock size={14} className="text-luxury-red/50" />
                    </div>
                  </div>
                )}

                {isAdmin ? (
                  ['1', '4'].includes(formData.internalRole) ? (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-luxury-red uppercase tracking-widest px-1">Líder de Área *</label>
                      <select required value={formData.leader_id} onChange={e => setFormData({...formData, leader_id: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0a0a0c] border border-gray-300 dark:border-luxury-border rounded-xl p-3 text-sm text-gray-900 dark:text-white outline-none focus:border-luxury-red dark:focus:border-luxury-red appearance-none transition-colors duration-300 cursor-pointer">
                        <option value="" disabled>Seleccionar Líder...</option>
                        {filteredLeaders.length > 0 ? (
                          filteredLeaders.map(lider => (
                            <option key={lider.id} value={lider.id}>{lider.full_name} ({lider.internal_role})</option>
                          ))
                        ) : (
                          <option value="" disabled>No hay líderes en esta área</option>
                        )}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-1 flex flex-col justify-center">
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1 transition-colors duration-300">Líder de Área</span>
                      <span className="text-sm text-gray-400 dark:text-gray-600 italic px-1 transition-colors duration-300">No aplica para este rol.</span>
                    </div>
                  )
                ) : (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1 transition-colors duration-300">Célula Asignada</label>
                    <div className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl p-3 text-sm text-gray-500 dark:text-gray-400 font-bold flex items-center justify-between opacity-80 cursor-not-allowed">
                      <span className="truncate">Célula de {profile?.full_name?.split(' ')[0]}</span>
                      <Lock size={14} className="text-luxury-red/50 shrink-0" />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button disabled={loading} type="submit" className="w-full bg-luxury-red hover:bg-red-700 text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-[0_4px_20px_rgba(211,0,45,0.2)] disabled:opacity-50 cursor-pointer active:scale-95">
                  {loading ? <Loader2 className="animate-spin" size={18}/> : <><Send size={18}/> FINALIZAR VINCULACIÓN</>}
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}