import { useState, useEffect } from 'react';
import { Link2, Plus, Trash2, FileText } from 'lucide-react';

interface RequestBriefPanelProps {
  description: string;
  externalResourceUrl?: string | null;
  isEditing: boolean;
  onFormChange: (field: string, value: any) => void;
}

export default function RequestBriefPanel({ description, externalResourceUrl, isEditing, onFormChange }: RequestBriefPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localLinks, setLocalLinks] = useState<string[]>([]);

  // Sincroniza la prop con el estado local al abrir o cerrar el modo de edición
  useEffect(() => {
    if (externalResourceUrl) {
      setLocalLinks(externalResourceUrl.split(',').map(l => l.trim()).filter(Boolean));
    } else {
      setLocalLinks([]);
    }
  }, [isEditing, externalResourceUrl]);

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...localLinks];
    newLinks[index] = value;
    setLocalLinks(newLinks);
    // Mandamos al formulario global solo los que sí tienen texto
    onFormChange('external_resource_url', newLinks.filter(l => l.trim() !== '').join(', '));
  };

  const handleAddLink = () => {
    // Añade un cajón vacío a la lista local para que el usuario escriba
    setLocalLinks([...localLinks, '']);
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = localLinks.filter((_, i) => i !== index);
    setLocalLinks(newLinks);
    // Actualizamos el formulario global al borrar
    onFormChange('external_resource_url', newLinks.filter(l => l.trim() !== '').join(', '));
  };

  const maxLength = 250;
  const shouldTruncate = description?.length > maxLength;
  const displayText = isExpanded ? description : description?.slice(0, maxLength) + (shouldTruncate ? '...' : '');

  // Cuando no estamos editando, leemos directo de la prop limpia
  const displayLinks = externalResourceUrl ? externalResourceUrl.split(',').map(l => l.trim()).filter(Boolean) : [];

  return (
    <div className={`w-full bg-white dark:bg-[#141419] border rounded-2xl p-6 shadow-sm transition-all duration-300 ${isEditing ? 'border-blue-400 ring-2 ring-blue-500/10' : 'border-gray-200 dark:border-zinc-800/80'}`}>
      
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-zinc-800/50">
        <FileText size={16} className={isEditing ? 'text-blue-500' : 'text-gray-400'} />
        <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Descripción / Brief</h3>
      </div>
      
      {isEditing ? (
        <div className="space-y-5 animate-in fade-in duration-200">
          
          <div className="space-y-1.5">
            <textarea 
              value={description} 
              onChange={e => onFormChange('description', e.target.value)}
              placeholder="Escribe la descripción detallada de la solicitud..."
              className="w-full bg-gray-50 dark:bg-[#070709] border border-gray-300 dark:border-zinc-700 rounded-xl p-4 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500 min-h-[140px] resize-y"
            />
          </div>

          <div className="space-y-3 bg-gray-50/50 dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-zinc-800/50">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Enlaces de Referencia Múltiples</label>
              <button type="button" onClick={handleAddLink} className="text-[10px] bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors cursor-pointer">
                <Plus size={12}/> Nuevo Link
              </button>
            </div>
            {localLinks.map((link, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input 
                  type="url" 
                  value={link} 
                  onChange={e => handleLinkChange(idx, e.target.value)} 
                  placeholder="https://ejemplo.com/recursos"
                  className="flex-1 bg-white dark:bg-[#070709] border border-gray-300 dark:border-zinc-700 rounded-lg p-2.5 text-xs text-gray-900 dark:text-white outline-none focus:border-blue-500 shadow-sm"
                />
                <button type="button" onClick={() => handleRemoveLink(idx)} className="text-gray-400 hover:text-red-500 p-2 cursor-pointer transition-colors"><Trash2 size={16}/></button>
              </div>
            ))}
            {localLinks.length === 0 && <p className="text-xs text-gray-400 italic">No hay enlaces configurados. Presiona "Nuevo Link" para agregar.</p>}
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-200">
          <p className="whitespace-pre-wrap leading-relaxed break-words text-[14px] md:text-[15px] select-text text-gray-700 dark:text-gray-300 font-medium">
            {description ? displayText : <span className="italic text-gray-400 text-sm">Sin descripción detallada proporcionada.</span>}
            
            {shouldTruncate && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-2 text-blue-500 hover:text-blue-700 font-bold text-[13px] cursor-pointer transition-colors lowercase"
              >
                {isExpanded ? 'ver menos' : '...ver más'}
              </button>
            )}
          </p>

          {displayLinks.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800/50 flex flex-wrap gap-2">
              {displayLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 px-3.5 py-2 rounded-lg text-xs font-bold tracking-wide transition-all shadow-sm max-w-[280px] truncate"
                >
                  <Link2 size={14} className="shrink-0 text-blue-500"/> 
                  <span className="truncate">{link.replace(/^https?:\/\//, '')}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}