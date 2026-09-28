import { useState } from 'react';
import { LayoutGrid, Users, UserCircle, Clock, Settings, LogOut, ShieldCheck, Menu, X, BarChart3, CalendarDays, Newspaper } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { canManagePressDirectory } from '../../lib/pressDirectoryAuth';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const logoUrl = "https://mcusercontent.com/f8003344e5055720b1568282f/images/e84ab177-5143-b5b7-4514-9298f1f3fa99.png"

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    setIsOpen(false);
    const result = await Swal.fire({
      title: 'Cerrar Sesión',
      text: 'Tendrás que ingresar tus credenciales la próxima vez.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--color-luxury-red)',
      cancelButtonColor: 'var(--color-luxury-gray)',
      confirmButtonText: 'SÍ, SALIR',
      cancelButtonText: 'CANCELAR'
    });

    if (result.isConfirmed) {
      await supabase.auth.signOut();
      navigate('/login');
    }
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  return (
    <>
      {/* HAMBURGUESA FLOTANTE MÓVIL */}
      <button 
        onClick={() => setIsOpen(true)} 
        className="md:hidden fixed top-5 left-4 z-40 p-2.5 bg-white/80 dark:bg-[#0F0F12]/80 backdrop-blur-md border border-gray-200 dark:border-luxury-border rounded-xl text-gray-900 dark:text-white shadow-md cursor-pointer transition-all active:scale-95"
      >
        <Menu size={20} />
      </button>

      {/* BACKDROP OSCURO */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        />
      )}

      {/* CONTENEDOR PRINCIPAL */}
      <aside 
        className={`fixed md:sticky md:top-0 inset-y-0 left-0 w-64 border-r border-gray-200 dark:border-luxury-border flex flex-col bg-gray-50 dark:bg-[#0b0b0e]/90 md:dark:bg-luxury-dark/50 backdrop-blur-xl h-screen transition-transform duration-300 z-50 font-sans ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        
        {/* CABECERA (Más compacta para dar espacio) */}
        <div className="p-6 flex flex-col items-center text-center gap-3 border-b border-gray-200 dark:border-luxury-border/40 transition-colors duration-300 relative shrink-0">
          
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden absolute top-4 right-4 p-1.5 text-gray-400 hover:text-luxury-red transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="w-16 h-16 bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border rounded-2xl flex items-center justify-center overflow-hidden shadow-sm shrink-0 transition-all duration-300">
            <img src={logoUrl} className="w-full h-full object-cover p-1" alt="Logo Tolko" />
          </div>

          <div className="min-w-0 w-full px-2">
            <h2 
              className="text-[13px] font-black tracking-tight text-gray-900 dark:text-white transition-colors duration-300 truncate" 
              title={user?.email || ''}
            >
              {user?.email || 'admin@tolko.com'}
            </h2>
            <p className="text-[10px] uppercase tracking-[0.3em] text-luxury-red font-bold mt-1 transition-colors duration-300">
              {profile?.normalized_role || 'ADMINISTRADOR'}
            </p>
          </div>
        </div>

        {/* NAVEGACIÓN (Sin scroll, aprovechando el espacio) */}
        <nav className="flex-1 px-4 space-y-1 mt-4 flex flex-col justify-center">
          
          <button 
            onClick={() => handleTabClick('dashboard')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold w-full transition-all cursor-pointer ${
              activeTab === 'dashboard' 
                ? 'bg-luxury-red text-white shadow-lg shadow-luxury-red/20' 
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5'
            }`}
          >
            <LayoutGrid size={18}/> Dashboard
          </button>

           {/* 🔥 EL NUEVO INQUILINO: CALENDARIO 🔥 */}
          <button 
            onClick={() => handleTabClick('calendario')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold w-full transition-all cursor-pointer ${
              activeTab === 'calendario' 
                ? 'bg-luxury-red text-white shadow-lg shadow-luxury-red/20' 
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5'
            }`}
          >
            <CalendarDays size={18}/> Calendario
          </button>

          <button 
            onClick={() => handleTabClick('clientes')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold w-full transition-all cursor-pointer ${
              activeTab === 'clientes' 
                ? 'bg-luxury-red text-white shadow-lg shadow-luxury-red/20' 
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5'
            }`}
          >
            <Users size={18}/> Cuentas
          </button>

          <button 
            onClick={() => handleTabClick('encargados')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold w-full transition-all cursor-pointer ${
              activeTab === 'encargados' 
                ? 'bg-luxury-red text-white shadow-lg shadow-luxury-red/20' 
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5'
            }`}
          >
            <UserCircle size={18}/> Encargados de cuenta
          </button>

          <button 
            onClick={() => handleTabClick('equipo')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold w-full transition-all cursor-pointer ${
              activeTab === 'equipo' 
                ? 'bg-luxury-red text-white shadow-lg shadow-luxury-red/20' 
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5'
            }`}
          >
            <ShieldCheck size={18}/> Team Tolko
          </button>

          <button 
            onClick={() => handleTabClick('reportes')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold w-full transition-all cursor-pointer ${
              activeTab === 'reportes' 
                ? 'bg-luxury-red text-white shadow-lg shadow-luxury-red/20' 
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5'
            }`}
          >
            <BarChart3 size={18}/> Reportes
          </button>

          <button 
            onClick={() => handleTabClick('historial')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold w-full transition-all cursor-pointer ${
              activeTab === 'historial' 
                ? 'bg-luxury-red text-white shadow-lg shadow-luxury-red/20' 
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5'
            }`}
          >
            <Clock size={18}/> Historial
          </button>

          {canManagePressDirectory(profile) && (
            <button 
              onClick={() => handleTabClick('prensa')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold w-full transition-all cursor-pointer ${
                activeTab === 'prensa' 
                  ? 'bg-luxury-red text-white shadow-lg shadow-luxury-red/20' 
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5'
              }`}
            >
              <Newspaper size={18}/> Prensa
            </button>
          )}

         
          
          <button 
            onClick={() => handleTabClick('configuracion')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold w-full transition-colors duration-300 cursor-pointer ${
              activeTab === 'configuracion'
                ? 'bg-luxury-red text-white shadow-lg shadow-luxury-red/20'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5'
            }`}
          >
            <Settings size={18}/> Configuración
          </button>
        </nav>

        {/* UTILERÍA INFERIOR (Fijo abajo con shrink-0) */}
        <div className="p-4 border-t border-gray-200 dark:border-luxury-border flex flex-col gap-2 transition-colors duration-300 shrink-0">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Apariencia</span>
            <ThemeToggle />
          </div>

          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 text-gray-500 hover:text-luxury-red dark:text-gray-400 dark:hover:text-luxury-red transition-colors w-full p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/10 cursor-pointer"
          >
            <LogOut size={18}/>
            <span className="text-sm font-bold uppercase tracking-widest">Salir</span>
          </button>
        </div>
      </aside>
    </>
  );
}