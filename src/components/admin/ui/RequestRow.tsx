import { Calendar, Layers, FileText, Hash, ExternalLink, MoreVertical, AlertCircle, Folder, CheckCircle2, Activity, User, Building, Flame, Clock, Check, RotateCcw, Unlock, Lock } from 'lucide-react';

interface Props {
  request: any;
  onEdit: (req: any) => void;
  onForceComplete?: (id: string) => void; 
  onRestore?: (id: string) => void;
  onUnlock?: (id: string) => void;       
}

// VACUNA ANTI ZONAS HORARIAS
const formatDateSafe = (dateString: string) => {
  if (!dateString) return 'S/F';
  
  const [year, month, day] = dateString.split('T')[0].split('-');
  const date = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
  
  return date.toLocaleDateString('es-MX', { 
    day: '2-digit', 
    month: 'short' 
  }).replace('.', '').toUpperCase().replace(' ', '-');
};

export default function RequestRow({ request, onEdit, onForceComplete, onRestore, onUnlock }: Props) {
  const isPendiente = request.status === 'pendiente';

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'aprobado':
      case 'completado': 
        return 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20 font-black';
      case 'en_proceso': 
        return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20 font-bold';
      case 'aprobado_interno':
        return 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20 font-bold';
      case 'en_revision_cliente':
        return 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20 font-bold';
      case 'con_correcciones':
        return 'bg-red-50 dark:bg-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20 animate-pulse font-black';
      case 'entregado':
        return 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20 font-bold';
      case 'pendiente':
        return 'bg-luxury-red text-white border-luxury-red shadow-[0_4px_15px_rgba(211,0,45,0.2)] dark:shadow-[0_0_15px_rgba(211,0,45,0.3)] hover:bg-luxury-red-dark font-black';
      default: 
        return 'bg-gray-100 dark:bg-luxury-card/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-luxury-border/50';
    }
  };

  const renderAlertBadge = () => {
    const hasPendingTriage = request.description?.includes('🚨 NUEVOS AJUSTES') && !request.description?.includes('[CORRECCIONES ENTREGADAS');
    if (hasPendingTriage) {
      return (
        <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 uppercase rounded-md tracking-wider flex items-center gap-1 animate-pulse shadow-sm shrink-0">
          <Activity size={10} strokeWidth={3}/> CORRECCIONES PENDIENTES
        </span>
      );
    }
    if (request.status === 'pendiente') {
      return (
        <span className="bg-luxury-red text-white text-[9px] font-black px-2 py-0.5 uppercase rounded-md tracking-wider flex items-center gap-1 animate-pulse shadow-sm shrink-0">
          <AlertCircle size={10} strokeWidth={3}/> NUEVA SOLICITUD
        </span>
      );
    }
    if (request.status === 'aprobado_interno') {
      return (
        <span className="bg-green-500 text-white text-[9px] font-black px-2 py-0.5 uppercase rounded-md tracking-wider flex items-center gap-1 animate-pulse shadow-sm shrink-0">
          <CheckCircle2 size={10} strokeWidth={3}/> LISTO PARA EMPAQUETAR
        </span>
      );
    }
    return null;
  };

  const requesterName = request.requester?.full_name || request.profiles?.full_name || request.solicitante || 'Desconocido';
  const formatName = request.file_extensions?.extension || request.format || 'N/A';
  
  // EXTRAE LA PRIORIDAD REAL (SOPORTA ARREGLO U OBJETO DE SUPABASE)
  const priorityObj = Array.isArray(request.priorities) ? request.priorities[0] : request.priorities;
  const priorityColor = priorityObj?.color_code || request.prioColor || '#D3002D';
  const priorityLevel = priorityObj?.level || request.prioridad;

  return (
    <div 
      onClick={() => onEdit(request)}
      className={`group flex items-stretch bg-white dark:bg-luxury-card border rounded-2xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md dark:shadow-none dark:hover:shadow-[0_0_30px_rgba(211,0,45,0.05)] overflow-hidden ${
        isPendiente 
          ? 'border-luxury-red/40 dark:border-luxury-red/40' 
          : 'border-gray-200 dark:border-luxury-border hover:border-luxury-red/40 dark:hover:border-luxury-red/40'
      }`}
    >
      <div className="w-2 shrink-0" style={{ backgroundColor: priorityColor }} />

      <div className="flex-1 flex flex-col xl:flex-row items-center justify-between p-4 sm:p-5 gap-6">
        
        {/* BLOQUE 1: INFO PRINCIPAL */}
        <div className="flex-1 min-w-[220px] truncate flex flex-col justify-center">
          <div className="flex items-center gap-2 truncate mb-1">
            {isPendiente && <AlertCircle size={14} className="text-luxury-red animate-pulse shrink-0" />}
            <h4 className={`font-black text-sm uppercase tracking-wider transition-colors duration-300 truncate ${
              isPendiente ? 'text-luxury-red' : 'text-gray-900 dark:text-white group-hover:text-luxury-red dark:hover:text-luxury-red'
            }`}>
              {request.title || request.proyecto}
            </h4>
            {renderAlertBadge()}
          </div>
          
          <div className="flex items-center gap-2 text-xxs truncate">
            <span className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest truncate shrink-0">
              {request.organizations?.name || request.empresa || 'Cliente Desconocido'}
            </span>
            <span className="text-gray-300 dark:text-luxury-border shrink-0 hidden sm:block">•</span>
            <span className="font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 truncate hidden sm:flex shrink-0">
              <User size={10} className="shrink-0" /> {requesterName}
            </span>
            {request.department && (
              <>
                <span className="text-gray-300 dark:text-luxury-border shrink-0 hidden md:block">•</span>
                <span className="font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1 truncate hidden md:flex shrink-0">
                  <Building size={10} className="shrink-0" /> {request.department}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1.5 text-xxs truncate">
            <span className="font-black text-luxury-red bg-luxury-red/5 dark:bg-luxury-red/10 border border-luxury-red/10 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0 max-w-[150px] truncate">
              <Folder size={10} strokeWidth={3} /> {request.projects?.name || request.project_name || 'General'}
            </span>
            {request.project_month && (
              <>
                <span className="text-gray-300 dark:text-luxury-border shrink-0">•</span>
                <span className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-1 shrink-0">
                  <Calendar size={10} className="text-luxury-red shrink-0"/> {request.project_month}
                </span>
              </>
            )}
          </div>
        </div>

        {/* BLOQUE 2: ESPECIFICACIONES */}
        <div className="hidden lg:flex items-center gap-4 shrink-0 px-4">
          <div className="flex flex-col items-center">
            <Layers size={14} className="text-gray-400 dark:text-gray-500 mb-1"/>
            <span className="text-[9px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider">{request.organization_deliverables?.name || request.request_categories?.name || request.category || 'General'}</span>
          </div>
          <div className="w-px h-6 bg-gray-200 dark:bg-luxury-border"></div>
          <div className="flex flex-col items-center">
            <FileText size={14} className="text-gray-400 dark:text-gray-500 mb-1"/>
            <span className="text-[9px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider">{formatName}</span>
          </div>
          <div className="w-px h-6 bg-gray-200 dark:bg-luxury-border"></div>
          <div className="flex flex-col items-center">
            <Hash size={14} className="text-gray-400 dark:text-gray-500 mb-1"/>
            <span className="text-[9px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider">QTY: {request.quantity || 1}</span>
          </div>
        </div>

        {/* BLOQUE 3: TIMELINE */}
        <div className="hidden md:flex flex-col items-end shrink-0 w-36 gap-1.5 border-l border-gray-100 dark:border-luxury-border/50 pl-6">
          <div className="flex justify-between items-center w-full">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Enviada</span>
            <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
              {formatDateSafe(request.request_date || request.created_at)}
            </span>
          </div>
          
          <div className="flex justify-between items-center w-full bg-red-50 dark:bg-luxury-red/10 px-2 py-1 rounded-md border border-red-100 dark:border-luxury-red/20">
            <span className="text-[9px] font-black text-luxury-red uppercase tracking-widest">Entrega</span>
            <span className="text-[10px] font-black text-luxury-red uppercase tracking-widest flex items-center gap-1">
              {formatDateSafe(request.due_date)}
            </span>
          </div>

          {(request.external_resource_url || request.external_url) && (
            <a 
              href={request.external_resource_url || request.external_url} 
              target="_blank" 
              rel="noreferrer" 
              onClick={(e) => e.stopPropagation()} 
              className="text-[9px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-bold uppercase tracking-wider mt-1"
            >
              <ExternalLink size={10} className="shrink-0"/> Ver Recursos
            </a>
          )}
        </div>

        {/* BLOQUE 4: ACCIONES Y PRIORIDAD */}
        <div className="flex items-center gap-3 shrink-0 pl-2">
          <div className="flex flex-col items-center gap-1">
            {priorityLevel && (
              <span 
                className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md text-white shadow-sm flex items-center gap-1"
                style={{ backgroundColor: priorityColor }}
              >
                {priorityLevel === 'Alta' ? <Flame size={12}/> : <Clock size={12}/>}
                {priorityLevel}
              </span>
            )}
            
            <div className={`w-28 h-7 rounded-lg border-transparent border text-[9px] uppercase tracking-widest flex items-center justify-center gap-1 shrink-0 ${getStatusStyle(request.status)}`}>
              {isPendiente ? (
                <span className="flex items-center gap-1 animate-pulse">
                  PENDIENTE
                </span>
              ) : (
                <span className="truncate px-1">
                  {request.status ? request.status.replace(/_/g, ' ') : 'Desconocido'}
                </span>
              )}
            </div>
          </div>

          {/* LÓGICA CONDICIONAL DE BLOQUEO/DESBLOQUEO */}
          {request.status !== 'completado' && (
            request.cierre_solicitado ? (
              onUnlock ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnlock(request.id);
                  }}
                  className="hidden sm:flex bg-green-500 hover:bg-green-600 text-white font-black text-[9px] uppercase tracking-widest px-3 py-2 rounded-lg items-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer ml-2"
                  title="Quitar el bloqueo al equipo"
                >
                  <Unlock size={12} strokeWidth={3}/> Desbloquear
                </button>
              ) : (
                <div className="hidden sm:flex bg-red-950/40 text-red-400 font-black text-[9px] uppercase tracking-widest px-3 py-2 rounded-lg items-center gap-1 border border-red-500/20 ml-2 cursor-not-allowed" title="Un Administrador solicitó el cierre">
                  <Lock size={12} strokeWidth={3}/> Bloqueada
                </div>
              )
            ) : (
              onForceComplete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onForceComplete(request.id);
                  }}
                  className="hidden sm:flex bg-black hover:bg-gray-800 text-white font-black text-[9px] uppercase tracking-widest px-3 py-2 rounded-lg items-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer border border-white/10 ml-2"
                  title="Exigir cierre al equipo"
                >
                  <Check size={12} strokeWidth={3}/> Solicitar Cierre
                </button>
              )
            )
          )}

          {onRestore && request.status === 'completado' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRestore(request.id);
              }}
              className="hidden sm:flex bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-black text-[9px] uppercase tracking-widest px-3 py-2 rounded-lg items-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer border border-gray-200 dark:border-white/10 ml-2"
              title="Revertir ticket cerrado por error"
            >
              <RotateCcw size={12} strokeWidth={3}/> Revertir
            </button>
          )}

          <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors ml-1">
            <MoreVertical size={18}/>
          </button>
        </div>

      </div>
    </div>
  );
}