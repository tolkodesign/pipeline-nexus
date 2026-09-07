import { useState, useEffect, useRef } from 'react';
import { X, MapPin, UploadCloud, CheckCircle2, Loader2, UserCheck, Layers, Palette, Image as ImageIcon, Mail } from 'lucide-react'; // 🔥 Agregué Mail aquí
import { supabase } from '../../../lib/supabase';
import Swal from 'sweetalert2';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export default function NewClientModal({ isOpen, onClose, onRefresh }: Props) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [profiles, setProfiles] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);

  const [selectedManagers, setSelectedManagers] = useState<any[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  
  // ESTADOS DE IMÁGENES
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // ESTADOS DE COLORES WHITE-LABEL
  const [primaryColor, setPrimaryColor] = useState('#D3002D');
  const [secondaryColor, setSecondaryColor] = useState('#0F0F12');

  // 🔥 1. AGREGUÉ DISTRIBUTION EMAIL AL ESTADO
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    distributionEmail: '' 
  });

  // Limpiar formulario y cargar catálogos al abrir
  useEffect(() => {
    if (isOpen) {
      resetForm();
      loadCatalogs();
    }
  }, [isOpen]);

  const resetForm = () => {
    // 🔥 2. LO RESETEAMOS TAMBIÉN AQUÍ
    setFormData({ name: '', address: '', distributionEmail: '' });
    setSelectedManagers([]);
    setSelectedSectors([]);
    setLogoFile(null);
    setBannerFile(null);
    setPrimaryColor('#D3002D');
    setSecondaryColor('#0F0F12');
  };

  const loadCatalogs = async () => {
    setFetching(true);
    try {
      // 🔥 ÚNICO CAMBIO: Adaptación de la consulta a la nueva estructura relacional
      const [profRes, sectRes] = await Promise.all([
        supabase.from('profiles').select('id, full_name, email, role_id, specialty_id, internal_roles(name), specialties(name)'),
        supabase.from('sectors').select('id, name').order('name')
      ]);
      
      if (profRes.data) {
        // Aplanamos para que sea fácil de leer en la UI si alguna vez lo ocupas
        const formattedStaff = profRes.data.map((s: any) => ({
          ...s,
          internal_role: s.internal_roles?.name || null,
          specialty: s.specialties?.name || null
        }));
        setProfiles(formattedStaff);
      }
      
      if (sectRes.data) setSectors(sectRes.data);
    } catch (error) {
      console.error("Error al cargar catálogos:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleSectorSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) return;

    if (val === 'NUEVO') {
      const { value: newSector } = await Swal.fire({
        title: 'Nuevo Sector',
        input: 'text',
        confirmButtonColor: '#D3002D',
        showCancelButton: true, 
        cancelButtonText: 'Cancelar'
      });

      if (newSector && newSector.trim() !== '') {
        const { data, error } = await supabase.from('sectors').insert([{ name: newSector.trim() }]).select().single();
        if (!error && data) {
          setSectors([...sectors, data]);
          if (!selectedSectors.includes(data.name)) setSelectedSectors([...selectedSectors, data.name]);
        }
      }
    } else {
      if (!selectedSectors.includes(val)) setSelectedSectors([...selectedSectors, val]);
    }
    e.target.value = ''; 
  };

  const handleManagerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const profileId = e.target.value;
    if (!profileId) return;
    
    if (!selectedManagers.some(m => m.id === profileId)) {
      const managerObj = profiles.find(p => p.id === profileId);
      if (managerObj) setSelectedManagers([...selectedManagers, managerObj]);
    }
    e.target.value = ''; 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalLogoUrl = null;
    let finalBannerUrl = null;

    try {
      // 1. SUBIR LOGO SI HAY
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `logo_${Date.now()}.${fileExt}`;
        const filePath = `logos/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('client-logos').upload(filePath, logoFile);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from('client-logos').getPublicUrl(filePath);
        finalLogoUrl = publicUrlData.publicUrl;
      }

      // 2. SUBIR BANNER SI HAY
      if (bannerFile) {
        const fileExt = bannerFile.name.split('.').pop();
        const fileName = `banner_${Date.now()}.${fileExt}`;
        const filePath = `logos/${fileName}`; 

        const { error: uploadError } = await supabase.storage.from('client-logos').upload(filePath, bannerFile);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from('client-logos').getPublicUrl(filePath);
        finalBannerUrl = publicUrlData.publicUrl;
      }

      // 3. INSERTAR ORGANIZACIÓN
      const { data: newOrg, error: orgError } = await supabase
        .from('organizations')
        .insert([{
          name: formData.name,
          industry: selectedSectors.join(', '), 
          address: formData.address || null,
          distribution_email: formData.distributionEmail || null, // 🔥 3. LO MANDAMOS A LA BASE DE DATOS
          logo_url: finalLogoUrl,
          banner_url: finalBannerUrl,
          primary_color: primaryColor,
          secondary_color: secondaryColor
        }])
        .select()
        .single();

      if (orgError) throw orgError;

      // 4. VINCULAR MANAGERS
      if (selectedManagers.length > 0 && newOrg) {
        const membersData = selectedManagers.map(m => ({
          organization_id: newOrg.id,
          profile_id: m.id,
          role_in_org: 'manager'
        }));
        
        const { error: insertError } = await supabase
          .from('organization_members')
          .insert(membersData);
          
        if (insertError) throw insertError;
      }

      Swal.fire({ 
        title: '¡CREADO!', 
        text: 'El cliente ha sido registrado con éxito.', 
        icon: 'success', 
        confirmButtonColor: '#D3002D' 
      });

      onRefresh(); 
      onClose();

    } catch (error: any) {
      Swal.fire({ 
        title: 'Error de Base de Datos', 
        text: error.message, 
        icon: 'error', 
        confirmButtonColor: '#D3002D' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/90 backdrop-blur-sm animate-in fade-in duration-200 transition-colors duration-300">
      <div className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl dark:shadow-2xl flex flex-col max-h-[90vh] transition-colors duration-300">
        
        {/* HEADER */}
        <div className="p-6 bg-luxury-red flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-lg">Nuevo Cliente</h3>
            <p className="text-xs text-white/80 font-bold uppercase mt-1">Alta de organización</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white bg-black/15 hover:bg-black/30 p-2 rounded-xl transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto custom-scrollbar p-10 flex-1 bg-gray-50/50 dark:bg-transparent transition-colors duration-300">
          {fetching ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-luxury-red mb-4" size={40} />
              <p className="text-gray-500 text-xs font-black tracking-widest uppercase">Cargando catálogos...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1 transition-colors duration-300">Nombre Legal / Marca *</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white dark:bg-[#0a0a0c] border border-gray-300 dark:border-luxury-border rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none transition-colors duration-300" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1 transition-colors duration-300">Sector / Industria</label>
                  <select onChange={handleSectorSelect} value="" className="w-full bg-white dark:bg-[#0a0a0c] border border-gray-300 dark:border-luxury-border rounded-xl p-3 text-sm text-gray-600 dark:text-gray-400 focus:border-luxury-red outline-none appearance-none transition-colors duration-300 cursor-pointer">
                    <option value="" disabled>Añadir sector...</option>
                    {sectors.map(s => <option key={s.id} value={s.name} className="text-gray-900 dark:text-white">{s.name}</option>)}
                    <option value="NUEVO" className="text-luxury-red font-bold">➕ Registrar nuevo sector...</option>
                  </select>
                  
                  {selectedSectors.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {selectedSectors.map(s => (
                        <span key={s} className="inline-flex items-center gap-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[10px] font-bold text-gray-700 dark:text-gray-300 px-3 py-1 rounded-lg uppercase tracking-wider transition-colors duration-300">
                          <Layers size={10} className="text-luxury-red"/> {s}
                          <button type="button" onClick={() => setSelectedSectors(selectedSectors.filter(x => x !== s))} className="hover:text-luxury-red ml-1 cursor-pointer"><X size={10}/></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 🔥 4. ACOMODÉ DIRECCIÓN Y CORREO GRUPAL EN UNA SOLA FILA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1 transition-colors duration-300">Dirección Fiscal / Operativa</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors duration-300" size={16} />
                    <input type="text" placeholder="Calle, Número, Ciudad..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-white dark:bg-[#0a0a0c] border border-gray-300 dark:border-luxury-border rounded-xl py-3 pl-12 pr-4 text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none transition-colors duration-300" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1 transition-colors duration-300">Lista de Distribución (Correos Grupales)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors duration-300" size={16} />
                    <input type="email" placeholder="ej: nike-team@tolkogroup.com" value={formData.distributionEmail} onChange={e => setFormData({...formData, distributionEmail: e.target.value})} className="w-full bg-white dark:bg-[#0a0a0c] border border-gray-300 dark:border-luxury-border rounded-xl py-3 pl-12 pr-4 text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none transition-colors duration-300" />
                  </div>
                </div>
              </div>

              {/* SECCIÓN: IDENTIDAD VISUAL (WHITE-LABEL) */}
              <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-luxury-border/50 transition-colors duration-300">
                <div className="flex items-center gap-2">
                  <Palette size={16} className="text-luxury-red" />
                  <h3 className="text-luxury-red text-xs font-black tracking-widest uppercase">Identidad Visual</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1">Color Principal (Botones)</label>
                    <div className="flex items-center gap-3 bg-white dark:bg-[#0a0a0c] border border-gray-300 dark:border-luxury-border rounded-xl p-1.5 focus-within:border-luxury-red transition-colors">
                      <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0 shrink-0" />
                      <input type="text" value={primaryColor.toUpperCase()} onChange={e => setPrimaryColor(e.target.value)} maxLength={7} className="w-full bg-transparent text-sm text-gray-900 dark:text-white font-bold uppercase outline-none px-2" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1">Color Secundario (Fondos)</label>
                    <div className="flex items-center gap-3 bg-white dark:bg-[#0a0a0c] border border-gray-300 dark:border-luxury-border rounded-xl p-1.5 focus-within:border-luxury-red transition-colors">
                      <input type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0 shrink-0" />
                      <input type="text" value={secondaryColor.toUpperCase()} onChange={e => setSecondaryColor(e.target.value)} maxLength={7} className="w-full bg-transparent text-sm text-gray-900 dark:text-white font-bold uppercase outline-none px-2" />
                    </div>
                  </div>
                </div>

                {/* LOGO Y BANNER UPLOADS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* LOGO */}
                  <div className="space-y-2 flex flex-col">
                    <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1">Logotipo Corporativo</label>
                    <div className="flex gap-4 items-center flex-1">
                      <div onClick={() => fileInputRef.current?.click()} className="flex-1 border-2 border-dashed border-gray-300 dark:border-luxury-border/40 bg-gray-50 dark:bg-black/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-luxury-red/40 transition-all cursor-pointer group h-full">
                        <input type="file" ref={fileInputRef} onChange={e => e.target.files && setLogoFile(e.target.files[0])} accept="image/*" className="hidden" />
                        {logoFile ? <CheckCircle2 className="text-green-500 mb-1" size={20} /> : <UploadCloud size={20} className="text-gray-400 group-hover:text-luxury-red mb-1" />}
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{logoFile ? 'Logo listo para subir' : 'Seleccionar Logo'}</p>
                      </div>
                    </div>
                  </div>

                  {/* BANNER */}
                  <div className="space-y-2 flex flex-col">
                    <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1">Banner de Portada</label>
                    <div className="flex gap-4 items-center flex-1">
                      <div onClick={() => bannerInputRef.current?.click()} className="flex-1 border-2 border-dashed border-gray-300 dark:border-luxury-border/40 bg-gray-50 dark:bg-black/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-luxury-red/40 transition-all cursor-pointer group h-full">
                        <input type="file" ref={bannerInputRef} onChange={e => e.target.files && setBannerFile(e.target.files[0])} accept="image/*" className="hidden" />
                        {bannerFile ? <CheckCircle2 className="text-green-500 mb-1" size={20} /> : <ImageIcon size={20} className="text-gray-400 group-hover:text-luxury-red mb-1" />}
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{bannerFile ? 'Banner listo para subir' : 'Seleccionar Banner'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-luxury-border/50 transition-colors duration-300">
                <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1 transition-colors duration-300">Responsables de Cuenta (Managers)</label>
                <select onChange={handleManagerSelect} value="" className="w-full bg-white dark:bg-[#0a0a0c] border border-gray-300 dark:border-luxury-border rounded-xl p-3 text-sm text-gray-600 dark:text-gray-400 focus:border-luxury-red outline-none appearance-none transition-colors duration-300 cursor-pointer">
                  <option value="" disabled>Vincular perfil existente...</option>
                  {profiles.map(p => <option key={p.id} value={p.id} className="text-gray-900 dark:text-white">{p.full_name} ({p.email})</option>)}
                </select>

                {selectedManagers.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-luxury-border/30 rounded-xl transition-colors duration-300">
                    {selectedManagers.map(m => (
                      <span key={m.id} className="inline-flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[10px] font-bold text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-xl uppercase tracking-wider transition-colors duration-300 shadow-sm dark:shadow-none">
                        <UserCheck size={12} className="text-luxury-red"/> {m.full_name}
                        <button type="button" onClick={() => setSelectedManagers(selectedManagers.filter(x => x.id !== m.id))} className="text-gray-400 hover:text-luxury-red ml-1 cursor-pointer"><X size={12}/></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 flex justify-end">
                <button type="submit" disabled={loading} className="bg-luxury-red hover:bg-red-700 text-white px-8 py-3 rounded-xl text-xs font-black tracking-widest flex items-center gap-2 transition-all disabled:opacity-50 shadow-md cursor-pointer">
                  {loading ? <Loader2 className="animate-spin" size={14} /> : 'REGISTRAR CLIENTE'}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}