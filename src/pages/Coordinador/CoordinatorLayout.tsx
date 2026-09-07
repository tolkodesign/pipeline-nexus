import { useEffect, lazy, Suspense } from 'react'; 
import { Routes, Route, useLocation } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext';
import CoordinatorSidebar from '../../components/coordinador/CoordinatorSidebar'; 
import { Loader2 } from 'lucide-react';

// 🔥 IMPORTAMOS LA CAMPANITA GLOBAL (ESTÁTICA PORQUE SIEMPRE SE VE)
import NotificationBell from '../../components/ui/NotificationBell';

// 🔥 LAZY LOADING: Las tripas pesadas del layout ahora se cargan bajo demanda
const CoordinatorDashboard = lazy(() => import('../Coordinador/CoordinadorDashboard')); 
const AdminReports = lazy(() => import('../../components/admin/ui/AdminReports'));
const ClientSettings = lazy(() => import('../../components/client/ClientSettings')); 
const MyBrandsPage = lazy(() => import('../../components/coordinador/MyBrandsPage'));
const MyTeamPage = lazy(() => import('../../components/coordinador/MyTeamPage'));
const CoordinatorHistory = lazy(() => import('../../components/coordinador/CoordinatorHistory')); 
const MyAssignments = lazy(() => import('../../components/coordinador/MyAssignments')); 

// 🔥 NUEVO: IMPORTACIÓN LAZY DEL CALENDARIO OPERATIVO
const CalendarPage = lazy(() => import('../../components/admin/tabs/CalendarPage'));

export default function CoordinatorLayout() {
  const { profile } = useAuth();
  const location = useLocation();

  // 🛡️ AUTOMATIZACIÓN DE PESTAÑA: Modifica el título según la sección
  useEffect(() => {
    const path = location.pathname;
    let title = 'Mesa de Control';

    if (path.endsWith('/coordinator') || path.endsWith('/coordinator/')) {
      title = 'Dashboard Coordinador';
    } else if (path.includes('/brands')) {
      title = 'Mis Marcas Asociadas';
    } else if (path.includes('/team')) {
      title = 'Mi Célula de Trabajo';
    } else if (path.includes('/my-tasks')) {
      title = 'Mis Asignaciones';
    } else if (path.includes('/history')) {
      title = 'Historial de Célula';
    } else if (path.includes('/reports')) {
      title = 'Inteligencia de Célula';
    } else if (path.includes('/calendar')) {
      title = 'Calendario Operativo'; // 🔥 TÍTULO DEL CALENDARIO
    } else if (path.includes('/settings')) {
      title = 'Configuración';
    }

    document.title = `${title}`;
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-luxury-dark transition-colors duration-300 relative">
      
      {/* INYECTAMOS LA SIDEBAR DE FORMA MODULAR */}
      <CoordinatorSidebar profile={profile} />

      {/* 🔥 CAMPANITA FLOTANTE GLOBAL (STICKY EN TODAS LAS PANTALLAS) */}
      <div className="fixed top-5 right-6 z-[9999]">
        <NotificationBell />
      </div>

      {/* CONTENEDOR DE VISTAS DINÁMICAS (LADO DERECHO) */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto relative">
        {/* 🔥 SUSPENSE INTERNO PARA TRANSICIÓN SUAVE 🔥 */}
        <Suspense fallback={
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-luxury-dark z-50">
            <Loader2 className="animate-spin text-luxury-red" size={40} />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-4">
              Cargando sección...
            </p>
          </div>
        }>
          <Routes>
            {/* Mapeamos las rutas del menú lateral */}
            <Route path="/" element={<CoordinatorDashboard initialTab="solicitudes" />} />
            <Route path="/brands" element={<MyBrandsPage />} />
            <Route path="/team" element={<MyTeamPage/>} />
            
            {/* RUTA EXCLUSIVA PARA TUS AUTO-ASIGNACIONES */}
            <Route path="/my-tasks" element={<MyAssignments />} />
            
            {/* HISTORIAL GENERAL DE LA CÉLULA */}
            <Route path="/history" element={<CoordinatorHistory />} />
            
            {/* PANEL DE INTELIGENCIA DE NEGOCIOS */}
            <Route path="/reports" element={<AdminReports />} />
            
            {/* 🔥 RUTA DEL CALENDARIO OPERATIVO 🔥 */}
            <Route path="/calendar" element={<CalendarPage />} />
            
            {/* Pantalla segura de cambio de password */}
            <Route path="/settings" element={<ClientSettings />} /> 
          </Routes>
        </Suspense>
      </main>
      
    </div>
  );
}