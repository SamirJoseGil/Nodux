import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from '@remix-run/react';
import { useAuth } from '~/contexts/AuthContext';
import type { UserRole } from '~/types/auth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
    requireModule?: boolean;
}

export default function ProtectedRoute({
    children,
    allowedRoles = [],
    requireModule = false
}: ProtectedRouteProps) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const hasChecked = useRef(false);

    useEffect(() => {
        // Solo verificar una vez para evitar loops de redirección
        if (hasChecked.current || isLoading) return;

        if (!isAuthenticated) {
            console.log('ProtectedRoute: Usuario no autenticado, redirigiendo a login');
            hasChecked.current = true;
            navigate('/login', { replace: true });
            return;
        }

        // Si hay roles permitidos y el usuario no tiene uno de ellos
        if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
            console.log(`ProtectedRoute: Usuario con rol ${user.role} no tiene permisos para acceder`);

            // Solo redirigir si no estamos ya en una ruta del dashboard del usuario
            const userDashboardPaths = [
                '/selector-modulo',
                '/modulo/academico/mentor/dashboard',
                '/modulo/academico/estudiante/dashboard',
                '/modulo/producto/dashboard',
                '/modulo/administracion/dashboard'
            ];

            // Si ya estamos en una ruta válida para el usuario, no redirigir
            if (!userDashboardPaths.some(path => location.pathname.startsWith(path))) {
                hasChecked.current = true;

                // Redirección basada en roles
                switch (user.role) {
                    case 'Mentor':
                        navigate('/modulo/academico/mentor/dashboard', { replace: true });
                        break;
                    case 'Estudiante':
                        navigate('/modulo/academico/estudiante/dashboard', { replace: true });
                        break;
                    case 'Admin':
                    case 'SuperAdmin':
                        navigate('/selector-modulo', { replace: true });
                        break;
                    default:
                        navigate('/', { replace: true });
                }
            }
            return;
        }

        hasChecked.current = true;
    }, [isAuthenticated, user, isLoading, allowedRoles, requireModule, navigate, location.pathname]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Si el usuario está autenticado y tiene los permisos necesarios
    if (isAuthenticated && user) {
        if (allowedRoles.length === 0 || allowedRoles.includes(user.role)) {
            return <>{children}</>;
        }
    }

    // Mostrar un estado de carga mientras se realiza la redirección
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );
}
