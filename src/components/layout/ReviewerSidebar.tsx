import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, FolderCheck, Settings, LogOut, HelpCircle, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';
import ThemeToggle from '../ui/ThemeToggle';
import { canManagePressDirectory } from '../../lib/pressDirectoryAuth';
import { Newspaper } from 'lucide-react';

interface SidebarProps {
  profile: any; // Solo recibe el perfil mapeado de la base de datos
}

const logoUrl = "https://mcusercontent.com/f8003344e5055720b1568282f/images/e84ab177-5143-b5b7-4514-9298f1f3fa99.png";

export default function ReviewerSidebar({ profile }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const reviewerSpecialty = profile?.specialty || 'Creativo';

  // 🔥 CORREGIDO: Enrutado real sincronizado con el /colaborador de App.tsx
  const menuItems = [
    { icon: <LayoutGrid size={18} />, label: 'Mi Panel', path: '/colaborador' },
    { icon: <FolderCheck size={18} />, label: 'Mis Entregas', path: '/colaborador/entregas' },
    ...(canManagePressDirectory(profile) ? [{ icon: <Newspaper size={18} />, label: 'Prensa', path: '/colaborador/reporters' }] : []),
    { icon: <Settings size={18} />, label: 'Configuración', path: '/colaborador/settings' },
  ];

  const handleLogout = async () => {
    setIsOpen(false);
    const isDarkTheme = document.documentElement.classList.contains('dark');
    const result = await Swal.fire({
      title: '¿Cerrar Sesión?',
      text: 'Tendrás que ingresar tus credenciales la próxima vez.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--color-luxury-red)',
      cancelButtonColor: 'var(--color-luxury-gray)',
      confirmButtonText: 'SÍ, SALIR',
      cancelButtonText: 'CANCELAR',
      background: isDarkTheme ? '#0F0F12' : '#fff',
      color: isDarkTheme ? '#fff' : '#1f2937'
    });

    if (result.isConfirmed) {
      await supabase.auth.signOut();
      navigate('/login');
    }
  };

  return (
    <>
      {/* BOTÓN HAMBURGUESA FLOTANTE MÓVIL */}
      <button 
        onClick={() => setIsOpen(true)} 
        className="md:hidden fixed top-5 left-4 z-40 p-2.5 bg-white/80 dark:bg-luxury-card/80 backdrop-blur-md border border-gray-200 dark:border-luxury-border rounded-xl text-gray-900 dark:text-white shadow-md cursor-pointer transition-all active:scale-95"
      >
        <Menu size={20} />
      </button>

      {/* OVERLAY OSCURO CON BLUR MÓVIL */}
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
      )}

      {/* BARRA ASIDE DEL COLABORADOR */}
      <aside className={`fixed md:sticky md:top-0 inset-y-0 left-0 w-64 border-r border-gray-200 dark:border-luxury-border flex flex-col bg-gray-50 dark:bg-[#0b0b0e]/90 md:dark:bg-luxury-dark/50 backdrop-blur-xl h-screen transition-transform duration-300 z-50 font-sans ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        {/* CABECERA DE MARCA E IDENTIDAD */}
        <div className="p-8 flex flex-col items-center text-center gap-4 border-b border-gray-200 dark:border-luxury-border/40 relative shrink-0">
          <button onClick={() => setIsOpen(false)} className="md:hidden absolute top-4 right-4 p-1.5 text-gray-400 hover:text-luxury-red transition-colors cursor-pointer"><X size={18} /></button>
          
          <div className="w-20 h-20 bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border rounded-2xl flex items-center justify-center overflow-hidden shadow-sm shrink-0 transition-all duration-300">
            <img src={logoUrl} className="w-full h-full object-cover p-1" alt="Logo Tolko" />
          </div>
          
          <div className="min-w-0 w-full">
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase truncate flex items-center justify-center gap-1 tracking-tight transition-colors">
              {profile?.full_name?.split(' ')[0] || 'CREADOR'}
            </h2>
            {/* 🔥 CORREGIDO: Cambiamos "Reviewer" por "Colaborador" para hacer match con la nueva UI premium */}
            <p className="text-[9px] uppercase tracking-[0.25em] text-luxury-red font-black mt-1">
              Colaborador {reviewerSpecialty}
            </p>
          </div>
        </div>

        {/* NAVEGACIÓN BASADA EN COMPONENTES LINK NATIVOS */}
        <nav className="flex-1 px-4 space-y-1 mt-6 overflow-y-auto custom-scrollbar">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={index} 
                to={item.path} 
                onClick={() => setIsOpen(false)} 
                className={`flex items-center gap-4 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider w-full transition-all duration-200 ${
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
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Apariencia</span>
            <ThemeToggle />
          </div>

          <button
            type="button"
            onClick={() => {
              const isDarkTheme = document.documentElement.classList.contains('dark');
              Swal.fire({
                title: 'Soporte de Célula',
                text: 'Si presentas incidencias con tus asignaciones, notifícalo con tu Coordinador de Célula de inmediato.',
                icon: 'info',
                background: isDarkTheme ? '#0F0F12' : '#fff', color: isDarkTheme ? '#fff' : '#1f2937', confirmButtonColor: '#D3002D'
              });
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <HelpCircle size={18} />
            <span>Soporte</span>
          </button>

          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 text-gray-500 hover:text-luxury-red dark:text-gray-400 dark:hover:text-luxury-red transition-colors w-full p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/10 cursor-pointer"
          >
            <LogOut size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Salir</span>
          </button>
        </div>
      </aside>
    </>
  );
}