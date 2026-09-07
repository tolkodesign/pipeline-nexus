import { useState, useEffect, useRef } from 'react';
import { X, Phone, UploadCloud, CheckCircle2, Loader2, Mail, Building2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import Swal from 'sweetalert2';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  manager: any; // El manager que recibe ahora trae { id, full_name, email, phone, avatar_url, ... }
  currentOrgId?: string | null; // Empresa actual en el Drill-Down
}

export default function EditManagerModal({ isOpen, onClose, onRefresh, manager, currentOrgId }: Props) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [organizations, setOrganizations] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    organization_id: ''
  });
  
  const [avatarUrl, setAvatarUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen && manager) {
      loadManagerData();
    } else {
      setAvatarFile(null);
    }
  }, [isOpen, manager]);

  const loadManagerData = async () => {
    setFetching(true);
    try {
      const { data: orgs } = await supabase.from('organizations').select('id, name').order('name');
      if (orgs) setOrganizations(orgs);

      setFormData({
        full_name: manager.full_name || manager.name || '',
        phone: manager.phone !== 'N/A' && manager.phone ? manager.phone : '',
        organization_id: currentOrgId || manager.company_id || ''
      });
      setAvatarUrl(manager.avatar_url || manager.avatar || '');

    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalAvatarUrl = avatarUrl;

    try {
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        finalAvatarUrl = publicUrlData.publicUrl;
      }

      const updatePayload: any = {
        full_name: formData.full_name,
        phone: formData.phone || null,
      };

      if (avatarFile) updatePayload.avatar_url = finalAvatarUrl;

      const { error: profileError } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', manager.id);

      if (profileError) throw profileError;

      // Actualizar tabla puente de organizaciones si la cambió
      if (formData.organization_id && formData.organization_id !== currentOrgId) {
        await supabase.from('organization_members').delete().eq('profile_id', manager.id);
        
        const { error: insertError } = await supabase.from('organization_members').insert({
          profile_id: manager.id,
          organization_id: formData.organization_id,
          role_in_org: 'manager'
        });
        if (insertError) throw insertError;
      } else if (!formData.organization_id) {
        // Lo dejó independiente
        await supabase.from('organization_members').delete().eq('profile_id', manager.id);
      }

      Swal.fire({ title: '¡PERFIL ACTUALIZADO!', text: 'Los datos se guardaron con éxito.', icon: 'success', confirmButtonColor: '#D3002D' });

      onRefresh(); 
      onClose();

    } catch (error: any) {
      Swal.fire({ title: 'Error', text: error.message, icon: 'error', confirmButtonColor: '#D3002D' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/90 backdrop-blur-sm animate-in fade-in duration-200 transition-colors duration-300">
      <div className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-white/[0.08] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] transition-colors duration-300">
        
        <div className="p-6 bg-luxury-red flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-lg">Editar Perfil de Encargado</h3>
            <p className="text-xs text-white/80 font-bold uppercase mt-1">Usuario: {manager?.email}</p>
          </div>
          <button onClick={onClose} className="text-white bg-black/15 hover:bg-black/30 p-2 rounded-xl transition-all cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar p-6 md:p-10 flex-1 bg-gray-50/50 dark:bg-transparent transition-colors duration-300">
          {fetching ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-luxury-red mb-4" size={40} />
              <p className="text-gray-500 text-xs font-black tracking-widest uppercase">Cargando perfil...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1">Nombre Completo *</label>
                <input required type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full bg-white dark:bg-[#0a0a0c] border border-gray-300 dark:border-white/[0.08] rounded-xl p-4 text-xs md:text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none transition-colors duration-300" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2 opacity-60 cursor-not-allowed">
                  <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1">Correo Electrónico (Solo Lectura)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                    <input type="text" disabled value={manager.email} className="w-full bg-gray-100 dark:bg-[#0a0a0c] border border-gray-200 dark:border-white/[0.08] rounded-xl py-4 pl-12 pr-4 text-xs md:text-sm text-gray-400 dark:text-gray-500 outline-none transition-colors duration-300" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1">Teléfono Móvil</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                    <input type="text" placeholder="+52 555..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white dark:bg-[#0a0a0c] border border-gray-300 dark:border-white/[0.08] rounded-xl py-4 pl-12 pr-4 text-xs md:text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none transition-colors duration-300" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-white/[0.08] transition-colors duration-300">
                <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1">Empresa Vinculada</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                  <select value={formData.organization_id} onChange={e => setFormData({...formData, organization_id: e.target.value})} className="w-full bg-white dark:bg-[#0a0a0c] border border-gray-300 dark:border-white/[0.08] rounded-xl py-4 pl-12 pr-4 text-xs md:text-sm text-gray-700 dark:text-gray-300 focus:border-luxury-red outline-none appearance-none transition-colors duration-300">
                    <option value="" className="text-gray-900 dark:text-white bg-white dark:bg-[#0a0a0c]">Independiente (Sin empresa)</option>
                    {organizations.map(org => <option key={org.id} value={org.id} className="text-gray-900 dark:text-white bg-white dark:bg-[#0a0a0c]">{org.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-white/[0.08] flex gap-4 md:gap-6 items-center transition-colors duration-300">
                <img src={avatarFile ? URL.createObjectURL(avatarFile) : (avatarUrl || 'https://via.placeholder.com/150')} alt="Avatar" className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border border-gray-200 dark:border-white/[0.08] transition-colors duration-300" />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 border-2 border-dashed border-gray-300 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center text-center hover:border-luxury-red/40 dark:hover:border-luxury-red/40 transition-all cursor-pointer group duration-300"
                >
                  <input type="file" ref={fileInputRef} onChange={e => e.target.files && setAvatarFile(e.target.files[0])} accept="image/*" className="hidden" />
                  <div className="text-gray-400 dark:text-gray-500 group-hover:text-luxury-red transition-colors mb-2">
                    {avatarFile ? <CheckCircle2 className="text-green-500" size={24} /> : <UploadCloud size={24} />}
                  </div>
                  <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300">
                    {avatarFile ? <span className="text-gray-900 dark:text-white">Foto lista: {avatarFile.name}</span> : 'Cambiar foto de perfil'}
                  </p>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button type="submit" disabled={loading} className="w-full md:w-auto bg-luxury-red hover:bg-red-700 text-white px-8 py-4 rounded-xl text-xs font-black tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md cursor-pointer active:scale-95">
                  {loading ? <Loader2 className="animate-spin" size={16} /> : 'GUARDAR CAMBIOS'}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}