import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Settings, LogOut, Menu, X, 
  Briefcase, Users, BarChart3, 
  History, CheckSquare, CalendarDays 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';
import ThemeToggle from '../ui/ThemeToggle';
import { canManagePressDirectory } from '../../lib/pressDirectoryAuth';
import { Newspaper } from 'lucide-react';

interface Props {
  profile: any;
}

const logoUrl = "https://mcusercontent.com/f8003344e5055720b1568282f/images/e84ab177-5143-b5b7-4514-9298f1f3fa99.png";

export default function CoordinatorSidebar({ profile }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const leaderSpecialty = profile?.specialties?.name || profile?.specialty || 'Diseño';
  const userRole = profile?.normalized_role || 'Líder';

  const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/coordinator' },
    { icon: <CalendarDays size={18} />, label: 'Calendario', path: '/coordinator/calendar' },
    { icon: <Briefcase size={18} />, label: 'Mis Cuentas', path: '/coordinator/brands' },
    { icon: <Users size={18} />, label: 'Mi Equipo', path: '/coordinator/team' },
    { icon: <CheckSquare size={18} />, label: 'Mis Tareas', path: '/coordinator/my-tasks' },
    { icon: <History size={18} />, label: 'Historial', path: '/coordinator/history' }, 
    { icon: <BarChart3 size={18} />, label: 'Reportes', path: '/coordinator/reports' }, 
    ...(canManagePressDirectory(profile) ? [{ icon: <Newspaper size={18} />, label: 'Prensa', path: '/coordinator/reporters' }] : []),
    { icon: <Settings size={18} />, label: 'Configuración', path: '/coordinator/settings' },
  ];

  const handleLogout = async () => {
    setIsOpen(false);
    const result = await Swal.fire({
      title: '¿Cerrar Sesión?',
      text: 'Tendrás que ingresar tus credenciales la próxima vez.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#D3002D',
      cancelButtonColor: '#4b5563',
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
      <button 
        onClick={() => setIsOpen(true)} 
        className="md:hidden fixed top-5 left-4 z-30 p-2.5 print:hidden bg-white/80 dark:bg-luxury-card/80 backdrop-blur-md border border-gray-200 dark:border-luxury-border rounded-xl text-gray-900 dark:text-white shadow-md cursor-pointer transition-all active:scale-95"
      >
        <Menu size={20} />
      </button>

      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-300"
        />
      )}

      <aside 
        className={`fixed md:sticky md:top-0 inset-y-0 left-0 w-64 border-r border-gray-200 dark:border-luxury-border flex flex-col bg-gray-50 dark:bg-[#0b0b0e]/90 md:dark:bg-luxury-dark/50 backdrop-blur-xl h-screen transition-transform duration-300 z-40 font-sans print:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* CABECERA MÁS COMPACTA */}
        <div className="p-5 flex flex-col items-center text-center gap-3 border-b border-gray-200 dark:border-luxury-border/40 relative shrink-0">
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden absolute top-4 right-4 p-1.5 text-gray-400 hover:text-luxury-red transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
          
          <div className="w-16 h-16 bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border rounded-2xl flex items-center justify-center overflow-hidden shadow-sm shrink-0 transition-all duration-300">
            <img src={logoUrl} className="w-full h-full object-cover p-1" alt="Logo Tolko" />
          </div>
          
          <div className="min-w-0 w-full">
            <h2 className="text-xs font-black text-gray-900 dark:text-white uppercase truncate tracking-tight">
              {profile?.full_name?.split(' ')[0] || 'COORDINADOR'}
            </h2>
            
            <p className="text-[9px] uppercase tracking-[0.25em] text-luxury-red font-black mt-0.5 truncate">
              {userRole} {leaderSpecialty}
            </p>
          </div>
        </div>

        {/* NAVEGACIÓN SIN SCROLLBAR VISIBLE Y COMPACTA */}
        <nav className="flex-1 px-4 space-y-1 my-2 flex flex-col justify-center overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={index} 
                to={item.path} 
                onClick={() => setIsOpen(false)} 
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider w-full transition-all duration-200 ${
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

        {/* UTILERÍAS INFERIORES */}
        <div className="p-4 border-t border-gray-200 dark:border-luxury-border flex flex-col gap-1 shrink-0">
          <div className="flex items-center justify-between px-4 py-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Apariencia</span>
            <ThemeToggle />
          </div>

          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 text-gray-500 hover:text-luxury-red dark:text-gray-400 dark:hover:text-luxury-red transition-colors w-full p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/10 cursor-pointer"
          >
            <LogOut size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Salir</span>
          </button>
        </div>
      </aside>
    </>
  );
}