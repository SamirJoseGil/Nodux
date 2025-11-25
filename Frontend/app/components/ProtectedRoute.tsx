import { useState, useEffect } from 'react';
import { Navigate, useLocation } from '@remix-run/react';
import { useAuth } from '~/contexts/AuthContext';
import type { UserRole } from '~/types/auth';
import { AccessDeniedModal } from './AccessDeniedModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      console.log('🔒 ProtectedRoute Security Check:', {
        timestamp: new Date().toISOString(),
        path: location.pathname,
        isAuthenticated,
        userId: user?.id,
        userRole: user?.role,
        allowedRoles,
        hasAccess: user ? allowedRoles.includes(user.role) : false
      });
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, location.pathname]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated || !user) {
    console.warn('🚨 Security: Unauthorized access attempt to', location.pathname);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Si no tiene el rol permitido, mostrar modal y luego redirigir
  if (!allowedRoles.includes(user.role)) {
    console.warn('🚨 Security: Insufficient permissions', {
      user: user.email,
      role: user.role,
      requiredRoles: allowedRoles,
      attemptedPath: location.pathname
    });

    // Mostrar modal solo si aún no se ha mostrado
    if (!showAccessDenied) {
      setShowAccessDenied(true);
    }

    return (
      <>
        <AccessDeniedModal
          isOpen={true}
          userRole={user.role}
          requiredRoles={allowedRoles}
          attemptedPath={location.pathname}
          onClose={() => setShowAccessDenied(false)}
        />
        {/* Contenido de fallback mientras el modal está visible */}
        <div className="min-h-screen bg-gray-50" />
      </>
    );
  }

  // Usuario autenticado con rol correcto
  console.log('✅ Security: Access granted to', location.pathname);
  return <>{children}</>;
}

// Componente para página de acceso denegado
export function UnauthorizedPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Acceso Denegado
        </h1>
        
        <p className="text-gray-600 mb-2">
          No tienes permisos para acceder a esta página.
        </p>
        
        {user && (
          <p className="text-sm text-gray-500 mb-6">
            Tu rol actual es: <span className="font-semibold text-gray-700">{user.role}</span>
          </p>
        )}
        
        <div className="space-y-3">
          <a
            href="/selector-modulo"
            className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Ir a Selector de Módulos
          </a>
          
          <a
            href="/"
            className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Volver al Inicio
          </a>
        </div>
      </div>
    </div>
  );
}
