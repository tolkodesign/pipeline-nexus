import { useState, useRef } from 'react';
import { X, FolderPlus, Loader2, AlignLeft, Layout, Image as ImageIcon, UploadCloud, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  onRefresh?: () => void;
}

export default function NewProjectModal({ isOpen, onClose, organizationId, onRefresh }: Props) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  // 🔥 ESTADOS PARA LA FOTO DE PORTADA
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setBannerFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) setBannerFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    let finalBannerUrl = null;

    try {
      // 1. SUBIR LA FOTO SI EL CLIENTE ELIGIÓ UNA
      if (bannerFile) {
        const fileExt = bannerFile.name.split('.').pop();
        const fileName = `project_${Date.now()}.${fileExt}`;
        const filePath = `projects/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('client-logos') // Usamos el mismo bucket por simplicidad
          .upload(filePath, bannerFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('client-logos')
          .getPublicUrl(filePath);
        
        finalBannerUrl = publicUrlData.publicUrl;
      }

      // 2. CREAR EL PROYECTO
      const { error } = await supabase
        .from('projects')
        .insert([{
          organization_id: organizationId,
          name: name.trim(),
          description: description.trim() || null,
          banner_url: finalBannerUrl // 🔥 GUARDAMOS LA URL
        }]);

      if (error) throw error;

      Swal.fire({
        title: '¡PROYECTO CREADO!',
        text: 'Tu nuevo tablero operativo ya está listo.',
        icon: 'success',
        confirmButtonColor: 'var(--color-luxury-red)'
      });

      setName(''); setDescription(''); setBannerFile(null);
      if (onRefresh) onRefresh();
      onClose();
    } catch (error: any) {
      Swal.fire({ title: 'Error', text: error.message, icon: 'error', confirmButtonColor: 'var(--color-luxury-red)' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-luxury-border w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col transition-colors">
        
        <div className="p-6 bg-luxury-red flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Nuevo Tablero</h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/80 font-bold mt-1">Ecosistema Operativo</p>
          </div>
          <button onClick={onClose} className="relative z-10 text-white/70 hover:text-white transition-colors bg-black/10 hover:bg-black/20 p-2 rounded-xl">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1">Nombre del Tablero *</label>
            <div className="relative">
              <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
              <input required type="text" placeholder="Ej: Campaña Q4, Redes Sociales..." value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-50 dark:bg-[#0a0a0c] border border-gray-300 dark:border-luxury-border rounded-2xl py-3.5 pl-11 pr-4 text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none transition-colors" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1">Descripción Breve</label>
            <div className="relative flex">
              <AlignLeft className="absolute left-4 top-4 text-gray-400" size={16}/>
              <textarea rows={3} placeholder="¿De qué trata este proyecto? (Opcional)" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-gray-50 dark:bg-[#0a0a0c] border border-gray-300 dark:border-luxury-border rounded-2xl py-3.5 pl-11 pr-4 text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none transition-colors resize-none"></textarea>
            </div>
          </div>

          {/* 🔥 ZONA DE CARGA DE IMAGEN */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1">Foto de Portada (Opcional)</label>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${isDragging ? 'border-luxury-red bg-luxury-red/10' : 'border-gray-300 dark:border-luxury-border bg-gray-50 dark:bg-black/20 hover:border-luxury-red hover:bg-luxury-red/5'}`}
            >
              {bannerFile ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="text-green-500" size={24} />
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{bannerFile.name}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-luxury-border p-3 rounded-2xl group-hover:scale-110 transition-transform">
                    <ImageIcon className="text-gray-400 group-hover:text-luxury-red transition-colors" size={20} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Arrastra una imagen o haz clic</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
              Cancelar
            </button>
            <button disabled={loading} type="submit" className="bg-luxury-red hover:opacity-90 text-white px-8 py-3 rounded-xl text-xs font-black tracking-widest flex items-center gap-2 transition-all shadow-[0_10px_20px_rgba(211,0,45,0.2)] active:scale-95 disabled:opacity-50 cursor-pointer">
              {loading ? <Loader2 className="animate-spin" size={14} /> : <><FolderPlus size={16} /> CREAR TABLERO</>}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}