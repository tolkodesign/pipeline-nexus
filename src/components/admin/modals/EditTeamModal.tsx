import { useState, useEffect, useRef } from 'react';
import { X, UploadCloud, CheckCircle2, Loader2, Mail, ShieldAlert, Lock, User, Briefcase } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext'; 
import Swal from 'sweetalert2';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  member: any;
}

export default function EditTeamModal({ isOpen, onClose, onRefresh, member }: Props) {
  const { profile } = useAuth();
  
  const roleIdNum = Number(profile?.role_id);
  const roleText = (profile?.internal_role || '').toLowerCase().trim();
  const isAdmin = profile?.is_admin === true || roleIdNum === 3 || roleText === 'admin';

  const [loading, setLoading] = useState(false);
  
  const [rolesCatalog, setRolesCatalog] = useState<any[]>([]);
  const [specialtiesCatalog, setSpecialtiesCatalog] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    full_name: '',
    internal_role: '', 
    specialty: ''      
  });
  
  const [avatarUrl, setAvatarUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCatalogs();
    }
  }, [isOpen]);

  // 🔥 AQUÍ ESTÁ LA CONEXIÓN ESTRICTA Y EL DETECTOR DE ERRORES
  const fetchCatalogs = async () => {
    try {
      const [rolesRes, specRes] = await Promise.all([
        supabase.from('internal_roles').select('*').order('id'),
        supabase.from('specialties').select('*').order('name')
      ]);

      // 1. Si la base de datos tira un error real (ej. tabla no existe)
      if (rolesRes.error) throw new Error(`Error en internal_roles: ${rolesRes.error.message}`);
      if (specRes.error) throw new Error(`Error en specialties: ${specRes.error.message}`);

      // 2. Si la base de datos no tira error pero regresa vacío (Bloqueo por RLS)
      if (rolesRes.data?.length === 0) {
        Swal.fire({
          title: 'Bloqueo de Seguridad (RLS)',
          text: 'Supabase no te está dejando leer la tabla "internal_roles" por falta de permisos. Activa las políticas de SELECT.',
          icon: 'warning',
          confirmButtonColor: '#D3002D'
        });
      }

      setRolesCatalog(rolesRes.data || []);
      setSpecialtiesCatalog(specRes.data || []);

    } catch (error: any) {
      console.error("Error crítico al traer catálogos", error);
      Swal.fire({
        title: 'Error de Base de Datos',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#D3002D'
      });
    }
  };

  useEffect(() => {
    if (isOpen && member) {
      setFormData({
        full_name: member.full_name || '',
        internal_role: member.role_id?.toString() || '', 
        specialty: member.specialty_id ? member.specialty_id.toString() : ''
      });
      setAvatarUrl(member.avatar_url || '');
      setAvatarFile(null); 
    }
  }, [isOpen, member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalAvatarUrl = avatarUrl;

    try {
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${member.id}-${Date.now()}.${fileExt}`;
        const filePath = `staff/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        finalAvatarUrl = publicUrlData.publicUrl;
      }

      const updatePayload: any = {
        full_name: formData.full_name,
      };

      if (isAdmin) {
        const parsedRole = parseInt(formData.internal_role);
        const parsedSpecialty = parseInt(formData.specialty);

        updatePayload.role_id = isNaN(parsedRole) ? null : parsedRole;
        
        const selectedRoleName = rolesCatalog.find(r => r.id === parsedRole)?.name;
        
        updatePayload.specialty_id = (selectedRoleName === 'Admin' || isNaN(parsedSpecialty)) 
          ? null 
          : parsedSpecialty;
      }

      if (avatarFile) {
        updatePayload.avatar_url = finalAvatarUrl;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', member.id)
        .select()
        .single();

      if (profileError) throw profileError;

      Swal.fire({ title: 'TEAM ACTUALIZADO!', text: 'Los cambios fueron guardados con éxito.', icon: 'success', confirmButtonColor: '#D3002D' });

      onRefresh(); 
      onClose();

    } catch (error: any) {
      Swal.fire({ title: 'Error al guardar', text: error.message, icon: 'error', confirmButtonColor: '#D3002D' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/90 backdrop-blur-sm animate-in fade-in duration-200 transition-colors duration-300">
      <div className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-luxury-border w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] transition-colors duration-300">
        
        <div className="p-6 bg-luxury-red flex justify-between items-center shrink-0 relative">
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-lg">Configuración de team</h3>
            <p className="text-xs text-white/80 font-bold uppercase mt-1">Usuario: {member?.email}</p>
          </div>
          <button onClick={onClose} className="text-white bg-black/15 hover:bg-black/30 p-2 rounded-xl transition-all cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar p-6 md:p-10 flex-1 bg-gray-50/50 dark:bg-transparent transition-colors duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2 opacity-60 cursor-not-allowed">
              <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1 transition-colors duration-300">Cuenta de Acceso (Auth)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors duration-300" size={18} />
                <input type="text" disabled value={member.email || ''} className="w-full bg-gray-100 dark:bg-[#0a0a0c] border border-gray-200 dark:border-luxury-border rounded-xl py-4 pl-12 pr-4 text-sm text-gray-500 dark:text-gray-400 outline-none transition-colors duration-300" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1 transition-colors duration-300">Nombre Completo *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors duration-300" size={18} />
                  <input required type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full bg-white dark:bg-[#0a0a0c] border border-gray-300 dark:border-luxury-border rounded-xl py-4 pl-12 pr-4 text-sm text-gray-900 dark:text-white focus:border-luxury-red dark:focus:border-luxury-red outline-none transition-colors duration-300" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-luxury-red uppercase tracking-widest px-1 flex items-center gap-1">
                  <ShieldAlert size={12}/> Cargo / Nivel de Acceso
                </label>
                {isAdmin ? (
                  <select 
                    value={formData.internal_role} 
                    onChange={e => setFormData({...formData, internal_role: e.target.value})} 
                    className="w-full bg-white dark:bg-[#0a0a0c] border border-gray-300 dark:border-luxury-red/30 rounded-xl p-4 text-sm text-gray-700 dark:text-white focus:border-luxury-red dark:focus:border-luxury-red outline-none appearance-none transition-colors duration-300 cursor-pointer"
                  >
                    <option value="" disabled>Selecciona Rol...</option>
                    {rolesCatalog.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl p-4 text-sm text-gray-500 dark:text-gray-400 font-bold flex items-center justify-between opacity-80 cursor-not-allowed transition-colors duration-300">
                    <span className="uppercase">{member.internal_role || 'Colaborador'}</span>
                    <Lock size={16} className="text-luxury-red/50" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1 flex items-center gap-1">
                <Briefcase size={12} className="text-luxury-red" /> Especialidad / Área Técnica
              </label>
              {isAdmin ? (
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors duration-300 pointer-events-none" size={18} />
                  <select 
                    value={formData.specialty} 
                    onChange={e => setFormData({...formData, specialty: e.target.value})} 
                    className="w-full bg-white dark:bg-[#0a0a0c] border border-gray-300 dark:border-luxury-border rounded-xl py-4 pl-12 pr-4 text-sm text-gray-700 dark:text-white focus:border-luxury-red dark:focus:border-luxury-red outline-none appearance-none transition-colors duration-300 cursor-pointer"
                  >
                    <option value="">Ninguna / Sin Área Técnica</option>
                    {specialtiesCatalog.map(spec => (
                      <option key={spec.id} value={spec.id}>{spec.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl p-4 text-sm text-gray-500 dark:text-gray-400 font-bold flex items-center justify-between opacity-80 cursor-not-allowed transition-colors duration-300">
                  <span className="uppercase">{member.specialty || 'Sin área'}</span>
                  <Lock size={16} className="text-luxury-red/50" />
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-luxury-border/50 flex gap-6 items-center transition-colors duration-300">
              <img 
                src={avatarFile ? URL.createObjectURL(avatarFile) : (avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.full_name || 'X')}&background=1E1E24&color=D3002D`)} 
                alt="Avatar" 
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border border-gray-200 dark:border-luxury-border transition-colors duration-300 shrink-0" 
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 border-2 border-dashed border-gray-300 dark:border-luxury-border/40 bg-gray-50 dark:bg-black/20 rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center text-center hover:border-luxury-red/40 dark:hover:border-luxury-red/40 transition-all cursor-pointer group duration-300"
              >
                <input type="file" ref={fileInputRef} onChange={e => e.target.files && setAvatarFile(e.target.files[0])} accept="image/*" className="hidden" />
                <div className="text-gray-400 dark:text-gray-500 group-hover:text-luxury-red transition-colors mb-2">
                  {avatarFile ? <CheckCircle2 className="text-green-500" size={24} /> : <UploadCloud size={24} />}
                </div>
                <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300">
                  {avatarFile ? <span className="text-gray-900 dark:text-white truncate max-w-[150px] inline-block">Foto: {avatarFile.name}</span> : 'Cambiar foto de perfil'}
                </p>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button type="submit" disabled={loading} className="w-full md:w-auto bg-luxury-red hover:bg-red-700 text-white px-8 py-4 rounded-xl text-xs font-black tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md cursor-pointer active:scale-95">
                {loading ? <Loader2 className="animate-spin" size={16} /> : 'GUARDAR CAMBIOS'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}