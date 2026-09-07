import Swal from 'sweetalert2';

interface DisciplineItem {
  key: string;
  name: string;
}

interface DisciplineTabsProps {
  catalog: DisciplineItem[];
  editForm: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tasks: any[];
  canToggle: boolean | ((discName: string) => boolean);
  onToggleDiscipline: (key: string) => void;
}

export default function DisciplineTabs({
  catalog,
  editForm,
  activeTab,
  setActiveTab,
  tasks,
  canToggle,
  onToggleDiscipline
}: DisciplineTabsProps) {

  return (
    <div className="w-full flex flex-wrap gap-2 select-none">
      {catalog.map(item => {
        const isTabActive = activeTab === item.name;
        const isDisciplineEnabled = editForm[item.key];
        
        // Extraemos los asignados directamente del formulario en vivo
        const taskConfig = editForm?.tasks?.[item.name];
        const assignees = taskConfig?.assignees_details || [];
        
        let tabState = 'disabled';
        
        if (isDisciplineEnabled) {
          if (assignees.length === 0) {
            tabState = 'unassigned'; // 🔴 ROJO: Área prendida pero vacía
          } else {
            // Revisamos si TODOS los de esta área ya terminaron/aprobaron
            const isFullyApproved = assignees.every((a: any) => ['aprobado_interno', 'aprobado', 'completado'].includes(a.status));
            if (isFullyApproved) {
              tabState = 'approved'; // 🟢 VERDE: Ya acabaron su cacho
            } else {
              tabState = 'assigned'; // 🔵 AZUL: Ya hay gente asignada jalando
            }
          }
        }

        // Variables dinámicas para pintar el UI
        let containerClasses = "";
        let textClasses = "";
        let subLabelClasses = "";
        let subLabel = "";
        let neonColor = "";
        let switchBg = "";
        let switchKnob = "";

        if (!isDisciplineEnabled) {
          // ESTADO: APAGADO
          containerClasses = isTabActive 
            ? "bg-gray-900 border-gray-900 dark:bg-white dark:border-white shadow-md"
            : "bg-gray-50/40 hover:bg-gray-100/60 dark:bg-black/20 dark:hover:bg-zinc-900/30 border-gray-200/50 dark:border-zinc-900/40 opacity-70 hover:opacity-100";
          textClasses = isTabActive ? "text-white dark:text-black" : "text-gray-400 dark:text-zinc-600";
          subLabelClasses = isTabActive ? "text-gray-400 dark:text-gray-500" : "text-gray-400/50 dark:text-zinc-600/50";
          subLabel = "Deshabilitada";
          switchBg = isTabActive ? "bg-gray-600 dark:bg-gray-300" : "bg-gray-300 dark:bg-zinc-800";
          switchKnob = isTabActive ? "bg-gray-900 dark:bg-white" : "bg-white";
          
        } else {
          // ESTADOS: ENCENDIDO (Semaforización)
          if (tabState === 'unassigned') {
            containerClasses = isTabActive
              ? "bg-red-600 border-red-600 shadow-md"
              : "bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 border-red-200 dark:border-red-900/50";
            textClasses = isTabActive ? "text-white" : "text-red-700 dark:text-red-400";
            subLabelClasses = isTabActive ? "text-red-200" : "text-red-500/80 dark:text-red-400/80";
            subLabel = "⚠️ Aún no asigna colaborador";
            neonColor = "bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]";
            switchBg = isTabActive ? "bg-white/40 dark:bg-black/30" : "bg-red-500";
            switchKnob = "bg-white";
            
          } else if (tabState === 'approved') {
            containerClasses = isTabActive
              ? "bg-green-600 border-green-600 shadow-md"
              : "bg-green-50 hover:bg-green-100 dark:bg-green-950/20 dark:hover:bg-green-900/30 border-green-200 dark:border-green-900/50";
            textClasses = isTabActive ? "text-white" : "text-green-700 dark:text-green-400";
            subLabelClasses = isTabActive ? "text-green-200" : "text-green-500/80 dark:text-green-400/80";
            subLabel = "✓ Área completó su parte";
            neonColor = "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]";
            switchBg = isTabActive ? "bg-white/40 dark:bg-black/30" : "bg-green-500";
            switchKnob = "bg-white";
            
          } else if (tabState === 'assigned') {
            containerClasses = isTabActive
              ? "bg-blue-600 border-blue-600 shadow-md"
              : "bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-900/30 border-blue-200 dark:border-blue-900/50";
            textClasses = isTabActive ? "text-white" : "text-blue-700 dark:text-blue-400";
            subLabelClasses = isTabActive ? "text-blue-200" : "text-blue-500/80 dark:text-blue-400/80";
            subLabel = "⚡ Equipo asignado";
            neonColor = "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]";
            switchBg = isTabActive ? "bg-white/40 dark:bg-black/30" : "bg-blue-500";
            switchKnob = "bg-white";
          }
        }

        return (
          <div
            key={item.key}
            onClick={() => setActiveTab(item.name)}
            className={`flex items-center gap-3 px-3 py-1.5 min-h-[48px] rounded-xl border transition-all duration-200 whitespace-nowrap cursor-pointer ${containerClasses}`}
          >
            {/* 💡 CANICA NEÓN DE ESTADO OPERATIVO */}
            {isDisciplineEnabled && (
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${neonColor}`} />
            )}

            {/* TEXTO DEL ÁREA Y SUB-LABEL */}
            <div className="flex flex-col justify-center">
              <span className={`uppercase tracking-wider text-[10px] leading-tight ${isDisciplineEnabled ? 'font-black' : 'font-semibold'} ${textClasses}`}>
                {item.name}
              </span>
              <span className={`text-[8px] font-bold uppercase tracking-widest leading-none mt-1 ${subLabelClasses}`}>
                {subLabel}
              </span>
            </div>

            {/* 🎛️ MICRO SWITCH INTEGRADO */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                // canToggle is now a function taking the tab name
                const isAllowedToToggle = typeof canToggle === 'function' ? canToggle(item.name) : canToggle;
                if (isAllowedToToggle) {
                  onToggleDiscipline(item.key);
                } else {
                  Swal.fire({
                    title: 'Acceso Denegado',
                    text: 'Tu rol actual no cuenta con permisos para alterar las áreas requeridas.',
                    icon: 'info',
                    confirmButtonColor: '#D3002D'
                  });
                }
              }}
              className={`w-6 h-3.5 rounded-full p-0.5 ml-2 transition-colors duration-200 shrink-0 ${
                !(typeof canToggle === 'function' ? canToggle(item.name) : canToggle) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
              } ${switchBg} ${isDisciplineEnabled ? 'flex justify-end' : 'flex justify-start'}`}
            >
              <div className={`w-2.5 h-2.5 rounded-full shadow-sm transition-transform duration-200 ${switchKnob}`}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}