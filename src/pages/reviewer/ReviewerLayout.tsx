import { useEffect } from 'react'; // 🔥 IMPORTAMOS useEffect
import { Routes, Route, useLocation } from 'react-router-dom'; // 🔥 IMPORTAMOS useLocation
import { useAuth } from '../../context/AuthContext';
import ReviewerSidebar from '../../components/layout/ReviewerSidebar'; 
import ReviewerDashboard from '../reviewer/ReviewerDashboard'; 
import ReviewerDeliveriesPage from '../../pages/reviewer/ReviewerDeliveriesPage'; 
import ClientSettings from '../../components/client/ClientSettings'; 
import PressDirectory from '../../components/rp/PressDirectory';

export default function ReviewerLayout() {
  const { profile } = useAuth();
  const location = useLocation(); // 🔥 LEEMOS LA URL ACTUAL EN VIVO

  // 🛡️ AUTOMATIZACIÓN DE PESTAÑA: Modifica el título según la sección del colaborador
  useEffect(() => {
    const path = location.pathname;
    let title = 'Mesa de Trabajo';

    // Evaluamos en qué subruta está parado el colaborador (adaptado a la URL /colaborador)
    if (path.endsWith('/colaborador') || path.endsWith('/colaborador/') || path === '/') {
      title = 'Mesa de Trabajo';
    } else if (path.includes('/entregas')) {
      title = 'Historial de Entregas';
    } else if (path.includes('/settings')) {
      title = 'Configuración';
    }

    document.title = `${title}`;
  }, [location.pathname]); // Se dispara en automático cada vez que cambia la sección

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-luxury-dark transition-colors duration-300">
      
      {/* La Sidebar ya no pide activeTab porque hereda el ruteador global */}
      <ReviewerSidebar profile={profile} />

      {/* CONTENEDOR DE VISTAS DINÁMICAS (LADO DERECHO) */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        <Routes>
          <Route path="/" element={<ReviewerDashboard />} />
          <Route path="/entregas" element={<ReviewerDeliveriesPage />} />
          <Route path="/reporters" element={<PressDirectory />} />
          <Route path="/settings" element={<ClientSettings />} /> 
        </Routes>
      </main>
      
    </div>
  );
}