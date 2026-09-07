import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// 🛡️ CADENERO DE ACCESOS INTELIGENTE
const ProtectedRoute = ({ children, allowedArea }: { children: any, allowedArea: 'admin' | 'coordinator' | 'colaborador' | 'client' }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-luxury-card flex flex-col gap-4 items-center justify-center font-sans">
      <Loader2 className="animate-spin text-luxury-red" size={40} />
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
        Verificando credenciales de seguridad...
      </p>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  const roleIdNum = Number(profile?.role_id);
  const isAdminUser = profile?.is_admin || roleIdNum === 3; // 3 es Admin Supremo

  // REINO 1: ADMIN SUPREMO
  // 🔥 CORREGIDO: SOLO Admins reales entran aquí. Si entra un Líder (2), va a /coordinator
  if (allowedArea === 'admin') {
    if (isAdminUser) return children;
    if ([2, 4, 5].includes(roleIdNum)) return <Navigate to="/coordinator" replace />;
    if (roleIdNum === 1) return <Navigate to="/colaborador" replace />; 
    return <Navigate to="/client" replace />; 
  }

  // REINO 2: JEFATURAS (LÍDERES = 2, COORDINADORES = 4, EJECUTIVOS = 5)
  if (allowedArea === 'coordinator') {
    if ([2, 4, 5].includes(roleIdNum) || isAdminUser) return children;
    if (roleIdNum === 1) return <Navigate to="/colaborador" replace />; 
    return <Navigate to="/client" replace />;
  }

  // REINO 3: COLABORADORES
  if (allowedArea === 'colaborador') {
    if (roleIdNum === 1 || isAdminUser) return children; 
    if ([2, 4, 5].includes(roleIdNum)) return <Navigate to="/coordinator" replace />; 
    return <Navigate to="/client" replace />;
  }

  // REINO 4: CLIENTES EXTERNOS
  // 🔥 CORREGIDO: Si un Líder (2) cae aquí, se le rebota a /coordinator
  if (allowedArea === 'client') {
    if (isAdminUser) return <Navigate to="/admin" replace />; 
    if ([2, 4, 5].includes(roleIdNum)) return <Navigate to="/coordinator" replace />;
    if (roleIdNum === 1) return <Navigate to="/colaborador" replace />; 
    return children;
  }

  return children;
};

// 🔀 REDIRECCIÓN MAESTRA POST-LOGIN / RAÍZ
const RootRedirect = () => {
  const { user, profile, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const roleIdNum = Number(profile?.role_id);

  // 🔥 CORREGIDO: ROL 2 (LÍDERES) AHORA VA DIRECTO A /coordinator
  if (profile?.is_admin || roleIdNum === 3) {
    return <Navigate to="/admin" replace />;
  } else if ([2, 4, 5].includes(roleIdNum)) {
    return <Navigate to="/coordinator" replace />;
  } else if (roleIdNum === 1) {
    return <Navigate to="/colaborador" replace />; 
  } else {
    return <Navigate to="/client" replace />;
  }
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

            {/* ENRUTADOR DE RAÍZ Y CATCH-ALL */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;