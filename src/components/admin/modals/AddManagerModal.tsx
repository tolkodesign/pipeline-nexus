import { useState, useEffect, useRef } from 'react';
import { X, Briefcase, Mail, Phone, Building, Send, Upload, Camera, Lock } from 'lucide-react';
import Swal from 'sweetalert2';
import { supabase } from '../../../lib/supabase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
  preselectedOrgId?: string | null; 
}

export default function AddManagerModal({ isOpen, onClose, onRefresh, preselectedOrgId }: Props) {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    role: '',
    organizationId: preselectedOrgId || '',
    email: '',
    password: '', 
    phone: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchOrganizations();
      if (preselectedOrgId) {
        setFormData(prev => ({ ...prev, organizationId: preselectedOrgId }));
      }
    } else {
      setAvatarFile(null);
      setAvatarPreview('');
      setFormData({ fullName: '', role: '', organizationId: preselectedOrgId || '', email: '', password: '', phone: '' });
    }
  }, [isOpen, preselectedOrgId]);

  const fetchOrganizations = async () => {
    const { data, error } = await supabase
      .from('organizations')
      .select('id, name')
      .eq('is_active', true) 
      .order('name');
    if (!error && data) setOrganizations(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.organizationId) {
      Swal.fire({ title: 'Acción Denegada', text: 'Es obligatorio vincular al encargado con una empresa registrada.', icon: 'warning', confirmButtonColor: '#D3002D' });
      return;
    }

    setLoading(true);
    
    try {
      // 🔥 1. PRE-FILTRO ANTIBALAS: Checar si el correo ya existe antes de molestar a la Edge Function
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email.trim())
        .maybeSingle();

      if (existingProfile) {
        Swal.fire({ 
          title: 'Correo Duplicado', 
          text: 'El email que intentas registrar ya pertenece a una cuenta activa en el sistema. Utiliza uno distinto.', 
          icon: 'warning', 
          confirmButtonColor: '#D3002D' 
        });
        setLoading(false);
        return; // Detenemos todo aquí
      }

      let finalAvatarUrl = null;

      // 2. SUBIR LA FOTO PRIMERO SI EXISTE
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        finalAvatarUrl = publicUrlData.publicUrl;
      }

      // 3. CREAR EL USUARIO MEDIANTE LA EDGE FUNCTION
      const { data, error: inviteError } = await supabase.functions.invoke('invite-manager', {
        body: { 
          email: formData.email.trim(),
          password: formData.password,
          fullName: formData.fullName,
          organizationId: formData.organizationId,
          role: formData.role || 'Manager'
        }
      });

      if (inviteError) throw inviteError;

      // 4. SI HUBO FOTO O TELÉFONO, ACTUALIZAR EL PERFIL RECIÉN CREADO
      if (finalAvatarUrl || formData.phone) {
        const updatePayload: any = {};
        if (finalAvatarUrl) updatePayload.avatar_url = finalAvatarUrl;
        if (formData.phone) updatePayload.phone = formData.phone;

        await supabase.from('profiles').update(updatePayload).eq('email', formData.email.trim());
      }

      onClose();
      if (onRefresh) onRefresh();
      
      Swal.fire({ title: 'SISTEMA CONFIGURADO', text: `Se ha creado el acceso para ${formData.email} vinculado a la empresa.`, icon: 'success', confirmButtonColor: '#D3002D' });

    } catch (error: any) {
      console.error("Error al registrar:", error);
      
      // 🔥 2. TRADUCTOR DE ERRORES: Si Supabase escupe su error ambiguo, lo volvemos amigable.
      let errorMsg = error.message || 'Error inesperado al intentar registrar al usuario.';
      
      if (errorMsg.includes('non-2xx')) {
        errorMsg = 'El servidor rechazó la solicitud. Verifica que la contraseña tenga al menos 6 caracteres y que el correo sea válido.';
      }

      Swal.fire({ title: 'No se pudo registrar', text: errorMsg, icon: 'error', confirmButtonColor: '#D3002D' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/90 backdrop-blur-sm animate-in fade-in duration-300 transition-colors duration-300">
      <div className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-luxury-border w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] transition-colors duration-300">
        
        <div className="p-6 bg-luxury-red flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-lg">Registrar Responsable de Empresa</h3>
            <p className="text-xs text-white/80 font-bold uppercase mt-1">Configuración de accesos operativos para Partners.</p>
          </div>
          <button onClick={onClose} className="text-white bg-black/15 hover:bg-black/30 p-2 rounded-xl transition-all cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          
          {/* LADO IZQUIERDO: Avatar y Branding */}
          <div className="md:w-2/5 p-8 md:p-10 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 dark:border-luxury-border relative bg-gray-50 dark:bg-[#0a0a0c] shrink-0 transition-colors duration-300">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,rgba(211,0,45,0.15)_0%,transparent_70%)] z-0 pointer-events-none"></div>
            
            {/* COMPONENTE DE FOTO */}
            <div className="relative group mb-6 z-10 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-white dark:bg-black/40 border-4 border-gray-200 dark:border-white/10 flex items-center justify-center overflow-hidden transition-all duration-500 shadow-md group-hover:border-luxury-red/50">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={50} className="text-gray-400 dark:text-gray-600 group-hover:text-luxury-red transition-colors duration-300" />
                )}
              </div>
              <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 bg-luxury-red p-2.5 rounded-full text-white hover:scale-110 transition-transform shadow-lg z-20 flex items-center justify-center">
                <Upload size={16} />
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              </div>
            </div>

            <div className="text-center z-10 space-y-1">
                <h2 className="text-gray-900 dark:text-white font-bold text-xl tracking-tight uppercase transition-colors duration-300">Acceso Partner</h2>
                <p className="text-luxury-red text-[10px] font-black uppercase tracking-[0.25em]">TEAM TOLKO</p>
            </div>
          </div>

          {/* LADO DERECHO: Formulario */}
          <form onSubmit={handleSubmit} className="w-full md:w-3/5 p-6 md:p-10 space-y-6 overflow-y-auto custom-scrollbar bg-white dark:bg-transparent transition-colors duration-300">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-white/[0.02] p-5 md:p-6 border border-gray-200 dark:border-white/[0.05] rounded-2xl transition-colors duration-300">
                <div className="space-y-1 md:col-span-2">
                    <label className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase px-1">Nombre Completo *</label>
                    <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full bg-white dark:bg-[#070709] border border-gray-300 dark:border-white/[0.08] rounded-xl p-3 text-xs md:text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none transition-colors duration-300" />
                </div>
                
                <div className="space-y-1 md:col-span-2">
                    <label className="text-[9px] font-bold text-luxury-red uppercase px-1">Empresa Vinculada *</label>
                    <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16}/>
                        <select required disabled={!!preselectedOrgId} value={formData.organizationId} onChange={e => setFormData({...formData, organizationId: e.target.value})} className="w-full bg-white dark:bg-[#070709] border border-luxury-red/50 rounded-xl py-3 pl-10 pr-4 text-xs md:text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none appearance-none disabled:opacity-50">
                            <option value="" disabled>Seleccionar Empresa...</option>
                            {organizations.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase px-1">Teléfono</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16}/>
                        <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white dark:bg-[#070709] border border-gray-200 dark:border-white/[0.08] rounded-xl py-3 pl-10 pr-4 text-xs md:text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none" />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase px-1">Puesto</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16}/>
                        <input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-white dark:bg-[#070709] border border-gray-200 dark:border-white/[0.08] rounded-xl py-3 pl-10 pr-4 text-xs md:text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group space-y-1 bg-gray-50 dark:bg-white/[0.02] p-5 md:p-6 border border-gray-200 dark:border-white/[0.05] rounded-2xl focus-within:border-luxury-red dark:focus-within:border-luxury-red transition-colors duration-300">
                    <label className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase px-1 group-focus-within:text-luxury-red">Email de Acceso *</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 group-focus-within:text-luxury-red" size={16}/>
                        <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent border-0 py-2 pl-10 pr-4 text-xs md:text-sm text-gray-900 dark:text-white outline-none" />
                    </div>
                </div>
                <div className="group space-y-1 bg-gray-50 dark:bg-white/[0.02] p-5 md:p-6 border border-gray-200 dark:border-white/[0.05] rounded-2xl focus-within:border-luxury-red dark:focus-within:border-luxury-red transition-colors duration-300">
                    <label className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase px-1 group-focus-within:text-luxury-red">Contraseña Inicial *</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 group-focus-within:text-luxury-red" size={16}/>
                        <input required type="text" placeholder="Ej: Bimbo2026!" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-transparent border-0 py-2 pl-10 pr-4 text-xs md:text-sm text-gray-900 dark:text-white outline-none" />
                    </div>
                </div>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-luxury-red hover:bg-red-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_4px_20px_rgba(211,0,45,0.3)] disabled:opacity-50 mt-4 active:scale-95 cursor-pointer">
              {loading ? 'GENERANDO ACCESO...' : <><Send size={18}/> CREAR Y VINCULAR MANAGER</>}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}