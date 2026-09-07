import { useState } from 'react';
import { LayoutDashboard, FolderKanban, Settings, LogOut, Menu, X, FileText } from 'lucide-react'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';
import ThemeToggle from '../ui/ThemeToggle'; 

interface ClientSidebarProps {
  customLogo?: string | null;
  customName?: string;
}

const defaultLogoUrl = "https://mcusercontent.com/f8003344e5055720b1568282f/images/e84ab177-5143-b5b7-4514-9298f1f3fa99.png"

export default function ClientSidebar({ customLogo, customName }: ClientSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // 🔗 RUTAS REALES
  const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Mi Panel', path: '/client' },
    { icon: <FolderKanban size={18} />, label: 'Mis Proyectos', path: '/client/projects', tourClass: 'tour-sidebar-proyectos' },
    { icon: <FileText size={18} />, label: 'Todas las Solicitudes', path: '/client/requests' }, 
    { icon: <Settings size={18} />, label: 'Configuración', path: '/client/settings', tourClass: 'tour-sidebar-config' },
  ];

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar Sesión?',
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

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="md:hidden fixed top-6 left-4 z-40 p-2.5 bg-white/20 dark:bg-black/30 backdrop-blur-md border border-white/20 dark:border-luxury-border rounded-xl shadow-lg text-gray-900 dark:text-white transition-all active:scale-95">
        <Menu size={24} />
      </button>

      {isOpen && <div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 dark:border-luxury-border flex flex-col bg-gray-50/95 dark:bg-luxury-dark/95 backdrop-blur-xl h-screen font-sans transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        
        <div className="p-8 flex flex-col items-center text-center gap-4 border-b border-gray-200 dark:border-luxury-border/40 relative">
          <button onClick={() => setIsOpen(false)} className="md:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-luxury-red transition-colors">
            <X size={20} />
          </button>

          <div className="w-16 h-16 bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border rounded-2xl flex items-center justify-center overflow-hidden shadow-sm shrink-0">
            <img src={customLogo || defaultLogoUrl} className="w-full h-full object-cover p-1" alt="Logo Partner" />
          </div>

          <div>
            <h2 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white uppercase line-clamp-2">
              {customName || 'TOLKO GROUP'} <span className="text-luxury-red">.</span>
            </h2>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 font-bold mt-1">Client Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto custom-scrollbar">
          {menuItems.map((item, index) => {
            // Lógica para que se pinte la pestaña activa leyendo la URL de arriba
            const isActive = item.path === '/client' 
              ? location.pathname === '/client' 
              : location.pathname.startsWith(item.path);

            return (
              <Link 
                key={index} 
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold w-full transition-all ${item.tourClass || ''} ${
                  isActive 
                    ? 'bg-luxury-red text-white shadow-lg shadow-luxury-red/20' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-luxury-border flex flex-col gap-1">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Apariencia</span>
            <ThemeToggle />
          </div>
          <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 w-full text-gray-500 hover:text-luxury-red dark:text-gray-400 dark:hover:text-luxury-red hover:bg-red-50 dark:hover:bg-red-950/10 rounded-xl text-sm font-bold transition-all">
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}