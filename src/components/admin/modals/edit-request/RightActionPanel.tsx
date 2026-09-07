import { useState } from 'react';
import { Loader2, ShieldAlert, ChevronDown, ChevronUp, Activity, LayoutTemplate, Flag, Calendar, Pencil, Save, UploadCloud, ExternalLink, CheckCircle, Clock, Trash2, Video } from 'lucide-react'; 
import Swal from 'sweetalert2';
import { supabase } from '../../../../lib/supabase';

interface RightActionPanelProps {
  editForm: any;
  isPackageReady: boolean;
  updateLoading: boolean;
  canEditGlobal: boolean;
  isGlobalEditing: boolean;
  isAdmin?: boolean;
  isCollaboratorView?: boolean;
  isCancelled?: boolean;
  hasChanges?: boolean;
  hasAudiovisual?: boolean;
  onCollaboratorDeliver?: () => void;
  myAssignment?: any;
  onDeliver: () => void;
  onOpenAdjustments: () => void;
  globalAdjustments: any[];
  projects: any[];
  prioritiesCatalog: any[];
  onFormChange: (field: string, value: any) => void;
  request: any;
  onSave: () => void;
  onRenameProject: (id: string, currentName: string) => void;
}

export default function RightActionPanel({
  editForm,
  isPackageReady,
  updateLoading,
  canEditGlobal,
  isGlobalEditing,
  isAdmin = false,
  isCollaboratorView = false,
  isCancelled = false,
  hasChanges = false,
  hasAudiovisual = false,
  onCollaboratorDeliver,
  myAssignment,
  onDeliver,
  onOpenAdjustments,
  globalAdjustments = [],
  projects,
  prioritiesCatalog,
  onFormChange,
  request,
  onSave,
  onRenameProject
}: RightActionPanelProps) {
  
  const [showHistory, setShowHistory] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const agencyCount = (globalAdjustments || []).filter(a => a.origin === 'agencia').length;
  const clientCount = (globalAdjustments || []).filter(a => a.origin === 'cliente').length;

  const safeFormatDate = (dateStr: string) => {
    if (!dateStr) return '--';
    const [year, month, day] = dateStr.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  };

  const currentPriority = prioritiesCatalog.find(p => p.id?.toString() === editForm.priority_id?.toString());
  const priorityColor = currentPriority?.color_code || '#D3002D';
  const priorityName = currentPriority?.level;

  const subStatus = myAssignment?.status || 'pendiente';
  const myDueDate = myAssignment?.due_date || editForm.due_date;
  const myCompletedAt = myAssignment?.completed_at;

  const handleSoftDelete = async () => {
    const isDarkTheme = document.documentElement.classList.contains('dark');
    
    const { value: reason } = await Swal.fire({
      title: 'Deshabilitar Solicitud',
      text: 'Esta solicitud desaparecerá de los tableros activos. Escribe el motivo exacto de la cancelación:',
      input: 'textarea',
      inputPlaceholder: 'Ej. El cliente canceló la campaña, presupuesto pausado...',
      showCancelButton: true,
      confirmButtonColor: '#D3002D',
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'DESHABILITAR',
      cancelButtonText: 'CANCELAR',
      background: isDarkTheme ? '#0F0F12' : '#fff',
      color: isDarkTheme ? '#fff' : '#1f2937',
      inputValidator: (value) => {
        if (!value || value.trim().length < 5) {
          return '¡Debes escribir un motivo válido para la auditoría!';
        }
      }
    });

    if (reason) {
      setIsDeleting(true);
      try {
        const { error } = await supabase
          .from('requests')
          .update({ is_active: false, cancellation_reason: reason.trim() })
          .eq('id', request.id);

        if (error) throw error;

        Swal.fire({ title: '¡Deshabilitada!', text: 'La solicitud fue ocultada exitosamente.', icon: 'success', confirmButtonColor: '#D3002D' });
        setTimeout(() => window.location.reload(), 1500);
      } catch (err: any) {
        Swal.fire('Error', err.message, 'error');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // 🔥 CALCULAR TOTALES DINÁMICOS DE AUDIOVISUAL DESDE LOS COLABORADORES 🔥
  let totalEditingHrs = 0;
  let totalRecordingHrs = 0;
  let allDurations: string[] = [];

  if (hasAudiovisual) {
    const avTask = editForm.tasks['Audiovisual'] || editForm.tasks['AudioVisual'];
    if (avTask && avTask.assignees_details) {
      avTask.assignees_details.forEach((a: any) => {
        totalEditingHrs += Number(a.editing_hours) || 0;
        totalRecordingHrs += Number(a.recording_hours) || 0;
        if (a.video_duration && a.video_duration.trim() !== '') {
          allDurations.push(a.video_duration.trim());
        }
      });
    }
  }

  const displayDuration = allDurations.length > 0 ? allDurations.join(' | ') : '--';

  return (
    <div className="bg-white dark:bg-[#141419] border border-gray-200 dark:border-zinc-800/80 p-6 rounded-2xl shadow-lg transition-colors duration-300 flex flex-col gap-6 sticky top-0">
      
      {/* CONFIGURACIÓN DE SOLICITUD */}
      <div>
        <h4 className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
          {isCollaboratorView ? 'Detalles de Tu Entrega' : 'Configuración de Solicitud'}
        </h4>
        
        <div className="bg-gray-50 dark:bg-[#0c0c10] border border-gray-100 dark:border-zinc-800/50 rounded-xl p-4 space-y-4">
          
          {/* Estatus */}
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Activity size={12}/> Estatus</span>
            <span className="bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 px-2 py-0.5 rounded font-black text-[10px] uppercase shadow-sm">
              {isCancelled ? 'CANCELADA' : (isCollaboratorView ? subStatus : editForm.status).replace(/_/g, ' ')}
            </span>
          </div>

          {/* VISTA MODO COLABORADOR VS MODO LÍDER/ADMIN */}
          {isCollaboratorView ? (
            <>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar size={12}/> Límite Entrega</span>
                <span className="text-xs font-black text-luxury-red">{safeFormatDate(myDueDate)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Clock size={12}/> Enviado El</span>
                <span className="text-xs font-black text-green-600 dark:text-green-400">
                  {myCompletedAt ? new Date(myCompletedAt).toLocaleDateString('es-MX') : '--'}
                </span>
              </div>
            </>
          ) : (
            <>
              {/* FECHA DE INGRESO (HABILITADA PARA EDICIÓN SOLO SI ES ADMIN) */}
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Ingreso</span>
                {isGlobalEditing && isAdmin ? (
                  <input 
                    type="date"
                    value={editForm.request_date ? editForm.request_date.split('T')[0] : (request?.request_date || request?.created_at?.split('T')[0] || '')}
                    onChange={e => onFormChange('request_date', e.target.value)}
                    className="bg-white dark:bg-[#141419] border border-blue-400 text-gray-900 dark:text-white rounded-lg px-2 py-1 outline-none font-black uppercase text-[10px] cursor-pointer w-[125px] shadow-sm focus:border-blue-500"
                  />
                ) : (
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200">
                    {safeFormatDate(editForm.request_date || request?.request_date || request?.created_at)}
                  </span>
                )}
              </div>

              {/* FECHA LÍMITE */}
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar size={12}/> Límite</span>
                {isGlobalEditing ? (
                  <input 
                    type="date"
                    value={editForm.due_date ? editForm.due_date.split('T')[0] : ''}
                    onChange={e => onFormChange('due_date', e.target.value)}
                    className="bg-white dark:bg-[#141419] border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white rounded-lg px-2 py-1 outline-none font-black uppercase text-[10px] cursor-pointer w-[125px] shadow-sm focus:border-blue-500"
                  />
                ) : (
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200">{safeFormatDate(editForm.due_date)}</span>
                )}
              </div>
            </>
          )}

          {/* Prioridad */}
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Flag size={12}/> Prioridad</span>
              {!isCollaboratorView && isGlobalEditing ? (
                <select 
                  value={editForm.priority_id || ''} 
                  onChange={e => onFormChange('priority_id', e.target.value)}
                  className="bg-white dark:bg-[#141419] border border-gray-300 dark:border-zinc-700 rounded-lg px-2 py-1 outline-none font-black uppercase text-[10px] cursor-pointer w-[125px] shadow-sm focus:border-blue-500"
                  style={{ color: priorityColor }}
                >
                  <option value="" disabled>Elegir...</option>
                  {prioritiesCatalog.map(p => <option key={p.id} value={p.id}>{p.level}</option>)}
                </select>
              ) : (
                priorityName ? (
                  <span className="text-[10px] font-black text-white px-2.5 py-0.5 rounded shadow-sm uppercase tracking-wider" style={{ backgroundColor: priorityColor }}>
                    {priorityName}
                  </span>
                ) : (
                  <span className="text-[10px] font-black text-white px-2.5 py-0.5 rounded shadow-sm uppercase tracking-wider" style={{ backgroundColor: '#6b7280' }}>
                    NORMAL
                  </span>
                )
              )}
          </div>

          {/* Tablero / Proyecto */}
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-200 dark:border-zinc-800/80 relative">
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><LayoutTemplate size={12}/> Tablero / Proyecto</span>
            
            {!isCollaboratorView && isGlobalEditing ? (
              <>
                <div 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-white dark:bg-[#141419] border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 font-bold text-xs cursor-pointer shadow-sm flex justify-between items-center transition-all hover:border-blue-400"
                >
                  <span className="truncate text-[11px] uppercase">
                    {projects.find(p => p.id === editForm.project_id)?.name || 'Seleccionar tablero...'}
                  </span>
                  <ChevronDown size={14} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}/>
                </div>

                {isDropdownOpen && (
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                )}

                {isDropdownOpen && (
                  <div className="absolute top-[100%] left-0 w-full mt-1 bg-white dark:bg-[#141419] border border-gray-200 dark:border-zinc-700 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto custom-scrollbar overflow-hidden">
                    <div 
                      className="px-3 py-2.5 text-[11px] text-gray-500 uppercase hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer border-b border-gray-100 dark:border-zinc-800"
                      onClick={() => { onFormChange('project_id', ''); setIsDropdownOpen(false); }}
                    >
                      General (Sin tablero)
                    </div>
                    {projects.map(p => (
                      <div 
                        key={p.id}
                        className={`flex items-center justify-between px-3 py-2 text-[11px] font-bold uppercase cursor-pointer group transition-colors ${editForm.project_id === p.id ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
                        onClick={() => { onFormChange('project_id', p.id); setIsDropdownOpen(false); }}
                      >
                        <span className="truncate pr-2">{p.name}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsDropdownOpen(false);
                            onRenameProject(p.id, p.name);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1.5 rounded transition-all"
                          title="Renombrar Tablero"
                        >
                          <Pencil size={12} strokeWidth={2.5}/>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <span className="text-[11px] font-black text-green-600 dark:text-green-400 uppercase">
                {projects.find(p => p.id === editForm.project_id)?.name || 'General'}
              </span>
            )}
          </div>

        </div>
      </div>

      {/* 🔥 MÉTRICAS GLOBALES AUDIOVISUAL (DISEÑO IGUAL QUE INDIVIDUAL) 🔥 */}
      {hasAudiovisual && !isCollaboratorView && (
        <div>
          <h4 className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Video size={12}/> Métricas Audiovisual (Global)
          </h4>
          <div className="bg-red-50/40 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-4 rounded-xl space-y-3 shadow-sm">
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-luxury-red uppercase tracking-widest mb-1 flex justify-between items-center">
                  Edición (Hrs)
                  <span className="text-[8px] text-gray-400 normal-case font-bold">(Suma Eq: {totalEditingHrs})</span>
                </span>
                {isGlobalEditing ? (
                  <input 
                    type="number" 
                    step="0.5" 
                    min="0" 
                    value={editForm.editing_hours || totalEditingHrs || ''} 
                    onChange={e => onFormChange('editing_hours', e.target.value)} 
                    className="w-full bg-white dark:bg-[#070709] border border-red-200 dark:border-red-900/50 rounded-lg px-3 py-2 text-xs font-black text-gray-900 dark:text-white outline-none focus:border-luxury-red shadow-sm transition-colors" 
                  />
                ) : (
                  <div className="w-full bg-white/60 dark:bg-black/20 border border-red-100 dark:border-red-900/30 rounded-lg px-3 py-2 text-xs font-black text-gray-800 dark:text-gray-200">
                    {editForm.editing_hours || totalEditingHrs || 0}
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <span className="text-[9px] font-black text-luxury-red uppercase tracking-widest mb-1 flex justify-between items-center">
                  Grabación (Hrs)
                  <span className="text-[8px] text-gray-400 normal-case font-bold">(Suma Eq: {totalRecordingHrs})</span>
                </span>
                {isGlobalEditing ? (
                  <input 
                    type="number" 
                    step="0.5" 
                    min="0" 
                    value={editForm.recording_hours || totalRecordingHrs || ''} 
                    onChange={e => onFormChange('recording_hours', e.target.value)} 
                    className="w-full bg-white dark:bg-[#070709] border border-red-200 dark:border-red-900/50 rounded-lg px-3 py-2 text-xs font-black text-gray-900 dark:text-white outline-none focus:border-luxury-red shadow-sm transition-colors" 
                  />
                ) : (
                  <div className="w-full bg-white/60 dark:bg-black/20 border border-red-100 dark:border-red-900/30 rounded-lg px-3 py-2 text-xs font-black text-gray-800 dark:text-gray-200">
                    {editForm.recording_hours || totalRecordingHrs || 0}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] font-black text-luxury-red uppercase tracking-widest mb-1 flex justify-between items-center">
                Duración Final (Video)
                {allDurations.length > 0 && <span className="text-[8px] text-gray-400 normal-case font-bold">(Tramos: {allDurations.length})</span>}
              </span>
              {isGlobalEditing ? (
                <input 
                  type="text" 
                  placeholder="HH:MM:SS" 
                  value={editForm.video_duration || (displayDuration !== '--' ? displayDuration : '')} 
                  onChange={e => onFormChange('video_duration', e.target.value)} 
                  className="w-full bg-white dark:bg-[#070709] border border-red-200 dark:border-red-900/50 rounded-lg px-3 py-2 text-xs font-black text-gray-900 dark:text-white outline-none focus:border-luxury-red shadow-sm transition-colors" 
                />
              ) : (
                <div className="w-full bg-white/60 dark:bg-black/20 border border-red-100 dark:border-red-900/30 rounded-lg px-3 py-2 text-xs font-black text-gray-800 dark:text-gray-200 truncate">
                  {editForm.video_duration || displayDuration}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* MÉTRICAS DE MODULACIÓN */}
      {!isCollaboratorView && (
        <div className="pt-2 border-t border-gray-100 dark:border-zinc-900">
          <h4 className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Métricas de Modulación</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-purple-50/50 dark:bg-purple-500/5 border border-purple-100 dark:border-purple-500/10 rounded-xl p-3 flex flex-col items-center justify-center shadow-sm">
              <span className="text-[8px] font-black text-purple-500 uppercase tracking-wider text-center">Ajustes Cliente</span>
              <span className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">{clientCount}</span>
            </div>
            <div className="bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10 rounded-xl p-3 flex flex-col items-center justify-center shadow-sm">
              <span className="text-[8px] font-black text-amber-500 uppercase tracking-wider text-center">Ajustes Agencia</span>
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{agencyCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* BOTÓN MODO COLABORADOR */}
      {isCollaboratorView && (
        <div className="pt-4 border-t border-gray-100 dark:border-zinc-900 space-y-3">
          {isCancelled ? (
             <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-3.5 text-center">
              <span className="text-[10px] font-black uppercase text-red-600 dark:text-red-400 block tracking-wider">
                🚫 Ticket Cancelado
              </span>
              <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 block mt-1 leading-tight">
                No puedes subir nada a este ticket.
              </span>
            </div>
          ) : ['en_proceso', 'con_correcciones'].includes(subStatus) ? (
            <>
              {/* Botón escondido para inyectar la misma lógica del modal */}
              <button id="btn-hidden-deliver" className="hidden" onClick={onCollaboratorDeliver}></button>
              <button 
                type="button"
                onClick={() => {
                  const btn = document.getElementById('btn-hidden-deliver');
                  if (btn) btn.click();
                }}
                className="w-full h-14 bg-luxury-red hover:bg-red-700 text-white rounded-xl text-xs font-black tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg active:scale-scale-95 cursor-pointer uppercase"
              >
                <UploadCloud size={18}/> SUBIR MI ENTREGABLE
              </button>
            </>
          ) : subStatus === 'pendiente' ? (
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-3.5 text-center">
              <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 block tracking-wider">
                ⏳ Tarea Pendiente
              </span>
              <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 block mt-1 leading-tight">
                Pásala a "En Proceso" en tu Mesa de Trabajo para poder entregar
              </span>
            </div>
          ) : (
            <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl p-4 text-center space-y-2">
              <span className="text-xs font-black uppercase text-green-600 dark:text-green-400 flex items-center justify-center gap-1.5">
                <CheckCircle size={16}/> ENTREGABLE ENVIADO
              </span>
              {myAssignment?.deliverable_url && (
                <a 
                  href={myAssignment.deliverable_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[10px] text-blue-500 hover:underline font-bold uppercase inline-flex items-center gap-1"
                >
                  <ExternalLink size={12}/> Ver Material Enviado
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* ACCIONES DEL LÍDER / ADMIN */}
      {!isCollaboratorView && canEditGlobal && editForm.status !== 'completado' && (
        <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-zinc-900">
          <button 
            type="button"
            onClick={onOpenAdjustments}
            className="w-full h-12 bg-[#E87500] hover:bg-[#CC6600] text-white rounded-xl text-xs font-black tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <ShieldAlert size={15}/> REGISTRAR NUEVO CAMBIO
          </button>

          <button 
            type="button"
            onClick={onSave}
            disabled={updateLoading || !hasChanges}
            className={`w-full h-12 rounded-xl text-xs font-black tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm ${
              hasChanges && !updateLoading
                ? 'bg-[#111827] hover:bg-black dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white cursor-pointer active:scale-95'
                : 'bg-gray-200 text-gray-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed opacity-60'
            }`}
          >
            {updateLoading ? <Loader2 className="animate-spin" size={15}/> : <><Save size={15}/> GUARDAR CONFIGURACIÓN</>}
          </button>

          <button 
            type="button"
            onClick={handleSoftDelete}
            disabled={isDeleting || updateLoading}
            className="w-full h-10 mt-2 bg-transparent hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded-xl text-[10px] font-black tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer border border-red-200 dark:border-red-900/30 uppercase"
          >
            {isDeleting ? <Loader2 className="animate-spin" size={14}/> : <><Trash2 size={13}/> Deshabilitar Solicitud</>}
          </button>

        </div>
      )}

      {/* ACCIÓN DE CIERRE FINAL PARA LÍDER / ADMIN */}
      {!isCollaboratorView && editForm.status !== 'completado' && !isGlobalEditing && !isCancelled && (
        <div>
          <button 
            type="button"
            onClick={onDeliver}
            disabled={updateLoading || !isPackageReady}
            className={`w-full h-12 rounded-xl text-[11px] font-black tracking-widest flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer active:scale-95 ${
              isPackageReady 
                ? 'bg-gray-100 hover:bg-emerald-600 text-gray-700 hover:text-white dark:bg-zinc-800 dark:text-gray-300 border border-gray-200 dark:border-zinc-700' 
                : 'bg-gray-50 dark:bg-zinc-900/50 text-gray-400 dark:text-zinc-600 border border-gray-100 dark:border-zinc-800/50 cursor-not-allowed opacity-50'
            }`}
          >
            {updateLoading ? <Loader2 className="animate-spin" size={15}/> : 'ENTREGA FINAL (CERRAR)'}
          </button>
        </div>
      )}

      {/* HISTORIAL DE AJUSTES */}
      {!isCollaboratorView && (globalAdjustments || []).length > 0 && (
        <div className="pt-4 border-t border-gray-100 dark:border-zinc-900">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer"
          >
            <span>Ver historial de ajustes ({(globalAdjustments || []).length})</span>
            {showHistory ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
          </button>

          {showHistory && (
            <div className="mt-4 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-zinc-900 rounded-xl divide-y divide-gray-100 dark:divide-zinc-900/60 overflow-hidden animate-in fade-in duration-200">
              {globalAdjustments.map((adj) => (
                <div key={adj.id} className="p-3.5 text-[11px] font-medium text-gray-700 dark:text-gray-300 flex flex-col gap-1.5 select-text">
                  <p className={adj.status === 'resuelto' ? 'line-through opacity-50' : ''}>
                    <span className="text-amber-500 font-bold mr-1.5">•</span> {adj.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}