import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import ClientSidebar from '../../components/client/ClientSidebar';
import ClientDashboard from './ClientDashboard';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import ClientProjects from '../../components/client/ClientProjects';
import ProjectDetail from '../../components/client/ProjectDetail';
import ClientSettings from '../../components/client/ClientSettings';
import ClientRequests from '../../components/client/ClientRequest'; 

export default function ClientLayout() {
  const { user } = useAuth();
  const location = useLocation(); 
  const [orgData, setOrgData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchPartnerBranding();
    }
    
    // 🔥 LISTENER MÁGICO: Escucha cuando el cliente cambia de cuenta en el Dashboard
    const handleOrgChange = () => {
      fetchPartnerBranding();
    };
    window.addEventListener('tolkoOrgChanged', handleOrgChange);
    return () => window.removeEventListener('tolkoOrgChanged', handleOrgChange);
  }, [user]);

  useEffect(() => {
    const path = location.pathname;
    let title = 'Portal Partner';

    if (path.endsWith('/client') || path.endsWith('/client/') || path === '/') {
      title = 'Client Pipeline';
    } else if (path.includes('/projects/')) {
      title = 'Detalle de Proyecto'; 
    } else if (path.includes('/projects')) {
      title = 'Mis Proyectos';
    } else if (path.includes('/requests')) {
      title = 'Todas las Solicitudes';
    } else if (path.includes('/settings')) {
      title = 'Configuración';
    }

    document.title = `${title}`;
  }, [location.pathname]); 

  const fetchPartnerBranding = async () => {
    try {
      // 🔥 FIX: Quitamos el .single() y traemos TODAS las marcas a las que pertenece
      const { data: memberData, error: memberError } = await supabase
        .from('organization_members')
        .select(`
          organization_id,
          organizations ( name, primary_color, secondary_color, logo_url, banner_url )
        `)
        .eq('profile_id', user!.id);

      if (memberError || !memberData || memberData.length === 0) return;

      // 🔥 BUSCAMOS LA MARCA ACTIVA EN LOCALSTORAGE (O agarramos la primera por defecto)
      const savedOrgId = localStorage.getItem(`tolko_active_org_${user!.id}`);
      const activeMember = memberData.find(m => m.organization_id === savedOrgId) || memberData[0];

      const org = Array.isArray(activeMember.organizations) ? activeMember.organizations[0] : activeMember.organizations;

      if (org) {
        setOrgData(org);
        localStorage.setItem(`tolko_active_org_${user!.id}`, activeMember.organization_id);
      }
    } catch (err) {
      console.error("Error cargando branding del cliente:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-luxury-dark flex items-center justify-center text-gray-400 text-xs tracking-widest uppercase">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-luxury-red border-t-transparent rounded-full animate-spin"></div>
          <p>Preparando espacio de trabajo...</p>
        </div>
      </div>
    );
  }

  const activePrimary = orgData?.primary_color || '#D3002D';
  const activeSecondary = orgData?.secondary_color || '#0F0F12';
  const activeLogo = orgData?.logo_url || null;
  const activeName = orgData?.name || 'TOLKO GROUP';
  const activeBanner = orgData?.banner_url || null;

  return (
    <div 
      className="flex h-screen bg-gray-50 dark:bg-luxury-dark transition-colors duration-300 w-full overflow-hidden"
      style={{
        // @ts-ignore
        '--color-luxury-red': activePrimary,
        '--color-brand-secondary': activeSecondary
      }}
    >
      <ClientSidebar customLogo={activeLogo} customName={activeName} />
      
      <main className="flex-1 min-w-0 w-full flex flex-col overflow-y-auto custom-scrollbar relative">
        <Routes>
          <Route index element={<ClientDashboard bannerUrl={activeBanner} />} />
          <Route path="projects" element={<ClientProjects />} />
          <Route path="projects/:projectId" element={<ProjectDetail />} />
          <Route path="requests" element={<ClientRequests />} />
          <Route path="settings" element={<ClientSettings />} />
          <Route path="*" element={<Navigate to="/client" replace />} />
        </Routes>
      </main>
    </div>
  );
}