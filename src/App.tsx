import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react'; 

// 🔥 Lazy Loading
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ReviewerLayout = lazy(() => import('./pages/reviewer/ReviewerLayout')); 
const ClientLayout = lazy(() => import('./pages/client/ClientLayout'));
const Login = lazy(() => import('./auth/login'));
const CoordinatorLayout = lazy(() => import('./pages/Coordinador/CoordinatorLayout'));

// Componentes de contraseñas
const ForgotPassword = lazy(() => import('./auth/ForgotPassword'));
const UpdatePassword = lazy(() => import('./auth/UpdatePassword'));

import { NORMALIZED_ROLES } from './lib/identity';

// 🛡️ CADENERO DE ACCESOS INTELIGENTE
const ProtectedRoute = ({ children, allowedArea }: { children: any, allowedArea: 'admin' | 'coordinator' | 'colaborador' | 'client' }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  const searchParams = location.search; // 🔥 AQUÍ ATRAPAMOS EL ?ticket=12345

  if (loading) return (
    <div className="min-h-screen bg-luxury-card flex flex-col gap-4 items-center justify-center font-sans">
      <Loader2 className="animate-spin text-luxury-red" size={40} />
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
        Verificando credenciales de seguridad...
      </p>
    </div>
  );

  // Si no está logueado, lo mandamos al login PERO llevándonos el ticket
  if (!user) return <Navigate to={`/login${searchParams}`} replace />;

  const role = profile?.normalized_role || NORMALIZED_ROLES.CLIENT;
  const isAdminUser = role === NORMALIZED_ROLES.ADMIN;
  const isCoordinatorUser = role === NORMALIZED_ROLES.LIDER || role === NORMALIZED_ROLES.COORDINADOR || role === NORMALIZED_ROLES.EJECUTIVO;
  const isColaboradorUser = role === NORMALIZED_ROLES.COLABORADOR;

  // REINO 1: ADMIN SUPREMO
  if (allowedArea === 'admin') {
    if (isAdminUser) return children;
    if (isCoordinatorUser) return <Navigate to={`/coordinator${searchParams}`} replace />;
    if (isColaboradorUser) return <Navigate to={`/colaborador${searchParams}`} replace />; 
    return <Navigate to={`/client${searchParams}`} replace />; 
  }

  // REINO 2: JEFATURAS (LÍDERES = 2, COORDINADORES = 4, EJECUTIVOS = 5)
  if (allowedArea === 'coordinator') {
    if (isCoordinatorUser || isAdminUser) return children;
    if (isColaboradorUser) return <Navigate to={`/colaborador${searchParams}`} replace />; 
    return <Navigate to={`/client${searchParams}`} replace />;
  }

  // REINO 3: COLABORADORES
  if (allowedArea === 'colaborador') {
    if (isColaboradorUser || isAdminUser) return children; 
    if (isCoordinatorUser) return <Navigate to={`/coordinator${searchParams}`} replace />; 
    return <Navigate to={`/client${searchParams}`} replace />;
  }

  // REINO 4: CLIENTES EXTERNOS
  if (allowedArea === 'client') {
    if (isAdminUser) return <Navigate to={`/admin${searchParams}`} replace />; 
    if (isCoordinatorUser) return <Navigate to={`/coordinator${searchParams}`} replace />;
    if (isColaboradorUser) return <Navigate to={`/colaborador${searchParams}`} replace />; 
    return children;
  }

  return children;
};

// 🔀 REDIRECCIÓN MAESTRA POST-LOGIN / RAÍZ
const RootRedirect = () => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  const searchParams = location.search; // 🔥 ATRAPAMOS EL TICKET AQUÍ TAMBIÉN
  
  if (loading) return null;
  if (!user) return <Navigate to={`/login${searchParams}`} replace />;

  const role = profile?.normalized_role || NORMALIZED_ROLES.CLIENT;

  if (role === NORMALIZED_ROLES.ADMIN) {
    return <Navigate to={`/admin${searchParams}`} replace />;
  } else if (role === NORMALIZED_ROLES.LIDER || role === NORMALIZED_ROLES.COORDINADOR || role === NORMALIZED_ROLES.EJECUTIVO) {
    return <Navigate to={`/coordinator${searchParams}`} replace />;
  } else if (role === NORMALIZED_ROLES.COLABORADOR) {
    return <Navigate to={`/colaborador${searchParams}`} replace />; 
  } else {
    return <Navigate to={`/client${searchParams}`} replace />;
  }
};

// 🪝 COMPONENTE PARA EL CATCH-ALL QUE CONSERVE LA URL
const CatchAllRedirect = () => {
  const location = useLocation();
  return <Navigate to={`/${location.search}`} replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={
          <div className="min-h-screen bg-[#0F0F12] flex flex-col gap-4 items-center justify-center font-sans">
            <Loader2 className="animate-spin text-[#D3002D]" size={40} />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Cargando módulo...</p>
          </div>
        }>
          <Routes>
            {/* ACCESOS PÚBLICOS */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            
            {/* RUTAS PROTEGIDAS */}
            <Route path="/admin/*" element={
              <ProtectedRoute allowedArea="admin"> <AdminDashboard /> </ProtectedRoute>
            } />
            
            <Route path="/coordinator/*" element={
              <ProtectedRoute allowedArea="coordinator"> <CoordinatorLayout /> </ProtectedRoute>
            } />
            
            <Route path="/colaborador/*" element={
              <ProtectedRoute allowedArea="colaborador"> <ReviewerLayout /> </ProtectedRoute>
            } />
            
            <Route path="/client/*" element={
              <ProtectedRoute allowedArea="client"> <ClientLayout /> </ProtectedRoute>
            } />

            {/* ENRUTADOR DE RAÍZ, /dashboard Y CATCH-ALL */}
            <Route path="/" element={<RootRedirect />} />
            
            {/* 🔥 Esta ruta ataja los links de los correos que van a /dashboard */}
            <Route path="/dashboard" element={<RootRedirect />} /> 
            
            <Route path="*" element={<CatchAllRedirect />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;