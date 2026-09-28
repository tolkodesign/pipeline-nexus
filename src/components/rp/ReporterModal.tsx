import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Upload, XCircle, Image as ImageIcon } from 'lucide-react';
import Swal from 'sweetalert2';
import type { Reporter, PressMedia, PressSource, PressMediaType, PressCampaign } from '../../types/press';
import { compressImage } from '../../utils/imageCompression';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reporter?: Reporter | null;
  media: PressMedia[];
  sources: PressSource[];
  mediaTypes: PressMediaType[];
  campaigns: PressCampaign[];
  onRefresh: () => void;
  profileId: string;
}

export default function ReporterModal({ isOpen, onClose, reporter, media, sources, mediaTypes, campaigns, onRefresh, profileId }: Props) {
  const [formData, setFormData] = useState({
    full_name: '',
    position: '',
    media_id: '',
    phone: '',
    email: '',
    birth_date: '',
    source_id: '',
    tier: 3 as 1 | 2 | 3,
    media_type_id: '',
    is_active: true
  });
  
  // Photos and Evidence
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [evidencePreviews, setEvidencePreviews] = useState<string[]>([]);
  const [existingEvidence, setExistingEvidence] = useState<{id: string, url: string}[]>([]);

  // Campaigns
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [campaignInput, setCampaignInput] = useState('');

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const evidenceInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && reporter) {
      setFormData({
        full_name: reporter.full_name || '',
        position: reporter.position || '',
        media_id: reporter.media_id || '',
        phone: reporter.phone || '',
        email: reporter.email || '',
        birth_date: reporter.birth_date || '',
        source_id: reporter.source_id || '',
        tier: reporter.tier || 3,
        media_type_id: reporter.media_type_id || '',
        is_active: reporter.is_active
      });
      setPhotoUrl(reporter.photo_url || null);
      setSelectedCampaigns(reporter.press_campaigns?.map(c => c.name) || []);
      setExistingEvidence(reporter.reporter_evidence || []);
    } else if (isOpen && !reporter) {
      setFormData({
        full_name: '', position: '', media_id: '', phone: '', email: '', birth_date: '', source_id: '', tier: 3, media_type_id: '', is_active: true
      });
      setPhotoUrl(null);
      setSelectedCampaigns([]);
      setExistingEvidence([]);
    }
    setPhotoFile(null);
    setPhotoPreview(null);
    setEvidenceFiles([]);
    setEvidencePreviews([]);
    setCampaignInput('');
  }, [isOpen, reporter]);

  if (!isOpen) return null;

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        return Swal.fire('Error', 'La imagen no debe superar los 10MB', 'error');
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleEvidenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalCount = existingEvidence.length + evidenceFiles.length + newFiles.length;
      
      if (totalCount > 5) {
        Swal.fire('Atención', 'Solo puedes subir un máximo de 5 testigos por reportero.', 'warning');
        return;
      }

      setEvidenceFiles(prev => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setEvidencePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeEvidenceFile = (index: number) => {
    setEvidenceFiles(prev => prev.filter((_, i) => i !== index));
    setEvidencePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddCampaign = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && campaignInput.trim()) {
      e.preventDefault();
      const val = campaignInput.trim();
      if (!selectedCampaigns.find(c => c.toLowerCase() === val.toLowerCase())) {
        setSelectedCampaigns([...selectedCampaigns, val]);
      }
      setCampaignInput('');
    }
  };

  const removeCampaign = (campaignName: string) => {
    setSelectedCampaigns(prev => prev.filter(c => c !== campaignName));
  };

  const uploadImage = async (file: File, folder: string): Promise<string> => {
    const compressed = await compressImage(file);
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('press_media')
      .upload(filePath, compressed, { contentType: 'image/webp' });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from('press_media')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.media_id || !formData.media_type_id || !formData.tier) {
      return Swal.fire('Error', 'Completa los campos obligatorios.', 'error');
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return Swal.fire('Error', 'Correo electrónico inválido.', 'error');
    }

    setLoading(true);
    try {
      // 1. Upload Photo if changed
      let finalPhotoUrl = photoUrl;
      if (photoFile) {
        finalPhotoUrl = await uploadImage(photoFile, 'reporters_photos');
      }

      const payload = {
        full_name: formData.full_name,
        position: formData.position || null,
        media_id: formData.media_id,
        phone: formData.phone || null,
        email: formData.email || null,
        birth_date: formData.birth_date || null,
        source_id: formData.source_id || null,
        tier: formData.tier,
        media_type_id: formData.media_type_id,
        is_active: formData.is_active,
        photo_url: finalPhotoUrl,
        updated_at: new Date().toISOString()
      };

      let reporterId = reporter?.id;

      if (reporter) {
        const { error } = await supabase.from('reporters').update(payload).eq('id', reporter.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('reporters').insert([payload]).select('id').single();
        if (error) throw error;
        reporterId = data.id;
      }

      // 2. Handle Campaigns
      if (reporterId) {
        // First, ensure all campaigns exist in press_campaigns
        const campaignIds: string[] = [];
        for (const cName of selectedCampaigns) {
          const existing = campaigns.find(c => c.name.toLowerCase() === cName.toLowerCase());
          if (existing) {
            campaignIds.push(existing.id);
          } else {
            // create it
            const { data: newC, error: newCError } = await supabase
              .from('press_campaigns')
              .insert([{ name: cName }])
              .select('id').single();
            if (!newCError && newC) {
              campaignIds.push(newC.id);
            }
          }
        }

        // Delete old junction links
        await supabase.from('reporter_campaigns').delete().eq('reporter_id', reporterId);

        // Insert new junction links
        if (campaignIds.length > 0) {
          const links = campaignIds.map(cid => ({ reporter_id: reporterId, campaign_id: cid }));
          await supabase.from('reporter_campaigns').insert(links);
        }

        // 3. Handle Evidence uploads
        if (evidenceFiles.length > 0) {
          const evidenceUrls = await Promise.all(evidenceFiles.map(f => uploadImage(f, 'reporters_evidence')));
          const evidenceInserts = evidenceUrls.map(url => ({ reporter_id: reporterId, url }));
          await supabase.from('reporter_evidence').insert(evidenceInserts);
        }
      }

      Swal.fire('Guardado', reporter ? 'Reportero actualizado.' : 'Nuevo reportero registrado.', 'success');
      onRefresh();
      onClose();
    } catch (err: any) {
      console.error(err);
      Swal.fire('Error', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-luxury-card w-full max-w-4xl rounded-2xl shadow-xl flex flex-col overflow-hidden max-h-[90vh]">
        <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-luxury-border">
          <h3 className="text-xl font-black uppercase text-gray-900 dark:text-white">
            {reporter ? 'Editar Reportero' : 'Nuevo Reportero'}
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-luxury-red transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 custom-scrollbar">
          
          {/* PHOTO SECTION */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex flex-col items-center gap-3 w-full md:w-auto">
              <div 
                className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 dark:border-luxury-border flex items-center justify-center bg-gray-50 dark:bg-luxury-dark overflow-hidden cursor-pointer relative group"
                onClick={() => fileInputRef.current?.click()}
              >
                {(photoPreview || photoUrl) ? (
                  <>
                    <img src={photoPreview || photoUrl || ''} alt="Profile" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all">
                      <Upload className="text-white" size={24} />
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <Upload className="mx-auto text-gray-400 mb-1" size={20} />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Subir Foto</span>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoChange} />
              {(photoPreview || photoUrl) && (
                <button type="button" onClick={() => { setPhotoFile(null); setPhotoPreview(null); setPhotoUrl(null); }} className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase">
                  Quitar Foto
                </button>
              )}
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nombre Completo *</label>
                <input type="text" required value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Puesto</label>
                <input type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Medio *</label>
                <select required value={formData.media_id} onChange={e => setFormData({...formData, media_id: e.target.value})} className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl px-3 py-2 text-sm outline-none">
                  <option value="">Seleccione...</option>
                  {media.filter(m => m.is_active || m.id === reporter?.media_id).map(m => (
                    <option key={m.id} value={m.id}>{m.name} {!m.is_active && '(Inactivo)'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Tipo de Medio *</label>
                <select required value={formData.media_type_id} onChange={e => setFormData({...formData, media_type_id: e.target.value})} className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl px-3 py-2 text-sm outline-none">
                  <option value="">Seleccione...</option>
                  {mediaTypes.filter(m => m.is_active || m.id === reporter?.media_type_id).map(m => (
                    <option key={m.id} value={m.id}>{m.name} {!m.is_active && '(Inactivo)'}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Fuente / Especialidad</label>
              <select value={formData.source_id} onChange={e => setFormData({...formData, source_id: e.target.value})} className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl px-3 py-2 text-sm outline-none">
                <option value="">Ninguna...</option>
                {sources.filter(m => m.is_active || m.id === reporter?.source_id).map(m => (
                  <option key={m.id} value={m.id}>{m.name} {!m.is_active && '(Inactivo)'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Tier *</label>
              <select required value={formData.tier} onChange={e => setFormData({...formData, tier: Number(e.target.value) as any})} className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl px-3 py-2 text-sm outline-none">
                <option value={1}>Tier 1 (Alto Impacto)</option>
                <option value={2}>Tier 2 (Medio Impacto)</option>
                <option value={3}>Tier 3 (General)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Fecha de Nacimiento</label>
              <input type="date" value={formData.birth_date} onChange={e => setFormData({...formData, birth_date: e.target.value})} className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Correo Electrónico</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Teléfono / Celular</label>
              <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl px-3 py-2 text-sm outline-none" />
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-luxury-border pt-4">
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Campañas en las que participó</label>
            <div className="bg-gray-50 dark:bg-luxury-dark border border-gray-200 dark:border-luxury-border rounded-xl p-2 flex flex-wrap gap-2 items-center min-h-[44px]">
              {selectedCampaigns.map((camp, idx) => (
                <span key={idx} className="bg-luxury-red text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  {camp}
                  <button type="button" onClick={() => removeCampaign(camp)} className="hover:text-red-200"><XCircle size={14} /></button>
                </span>
              ))}
              <input 
                type="text" 
                value={campaignInput}
                onChange={e => setCampaignInput(e.target.value)}
                onKeyDown={handleAddCampaign}
                placeholder={selectedCampaigns.length === 0 ? "Ej: Scribe diablos rojos (Presiona Enter)" : "Agregar otra..."}
                className="flex-1 min-w-[200px] bg-transparent outline-none text-sm px-2 py-1"
                list="campaigns-list"
              />
              <datalist id="campaigns-list">
                {campaigns.map(c => <option key={c.id} value={c.name} />)}
              </datalist>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Escribe el nombre de la campaña y presiona <kbd className="font-mono bg-gray-200 dark:bg-gray-800 px-1 rounded">Enter</kbd></p>
          </div>

          <div className="border-t border-gray-200 dark:border-luxury-border pt-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold uppercase text-gray-500">Testigos (Fotos)</label>
              <span className="text-[10px] font-bold text-gray-400">
                {existingEvidence.length + evidenceFiles.length} / 5
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {/* Existing Evidence */}
              {existingEvidence.map((ev, idx) => (
                <div key={idx} className="relative aspect-square bg-gray-100 dark:bg-luxury-dark rounded-xl overflow-hidden group">
                  <img src={ev.url} alt="Testigo" className="w-full h-full object-cover" />
                  <div className="absolute top-1 right-1 bg-black/50 text-[10px] text-white px-2 py-0.5 rounded-full font-bold">Guardado</div>
                </div>
              ))}
              
              {/* New Evidence Previews */}
              {evidencePreviews.map((preview, idx) => (
                <div key={`new-${idx}`} className="relative aspect-square bg-gray-100 dark:bg-luxury-dark rounded-xl overflow-hidden group border-2 border-luxury-red">
                  <img src={preview} alt="Nuevo testigo" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeEvidenceFile(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={14} />
                  </button>
                  <div className="absolute bottom-1 left-1 bg-luxury-red text-[10px] text-white px-2 py-0.5 rounded-full font-bold">Nuevo</div>
                </div>
              ))}

              {/* Upload Button */}
              {(existingEvidence.length + evidenceFiles.length) < 5 && (
                <div 
                  onClick={() => evidenceInputRef.current?.click()}
                  className="relative aspect-square border-2 border-dashed border-gray-300 dark:border-luxury-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-luxury-red hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                  <ImageIcon className="text-gray-400 mb-1" size={24} />
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Añadir Foto</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={evidenceInputRef} 
              className="hidden" 
              accept="image/*" 
              multiple 
              onChange={handleEvidenceChange} 
            />
          </div>

          {reporter && (
            <div className="flex items-center gap-2 mt-2 pt-4 border-t border-gray-200 dark:border-luxury-border">
              <input type="checkbox" id="is_active_rep" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4 text-luxury-red accent-luxury-red" />
              <label htmlFor="is_active_rep" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">Reportero Activo</label>
            </div>
          )}

        </form>

        <div className="p-6 border-t border-gray-200 dark:border-luxury-border flex justify-end gap-3 bg-gray-50 dark:bg-luxury-dark/40 shrink-0">
          <button onClick={onClose} disabled={loading} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={loading} className="bg-luxury-red hover:bg-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 transition-colors shadow-lg shadow-luxury-red/20">
            {loading ? 'Guardando...' : 'Guardar Reportero'}
          </button>
        </div>
      </div>
    </div>
  );
}
