import { Link } from "@remix-run/react";
import { useAuth } from "~/contexts/AuthContext";

interface NavbarProps {
    variant?: 'default' | 'transparent' | 'minimal';
    showAuth?: boolean;
    showLogo?: boolean;
    className?: string;
}

export default function Navbar({
    variant = 'default',
    showAuth = true,
    showLogo = true,
    className = ''
}: NavbarProps) {
    const { isAuthenticated, user, logout } = useAuth();

    const getVariantClasses = () => {
        switch (variant) {
            case 'transparent':
                return 'bg-transparent border-b border-white/20';
            case 'minimal':
                return 'bg-white/95 backdrop-blur-sm border-b border-gray-100';
            default:
                return 'bg-white border-b border-gray-200 shadow-sm';
        }
    };

    const getTextClasses = () => {
        switch (variant) {
            case 'transparent':
                return 'text-white';
            default:
                return 'text-slate-900';
        }
    };

    const getLinkClasses = () => {
        switch (variant) {
            case 'transparent':
                return 'text-white/90 hover:text-white';
            default:
                return 'text-slate-600 hover:text-blue-600';
        }
    };

    return (
        <nav className={`sticky top-0 z-50 ${getVariantClasses()} ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    {showLogo && (
                        <div className="flex items-center">
                            <Link to="/" className={`text-2xl font-bold ${getTextClasses()}`}>
                                NODUX
                            </Link>
                        </div>
                    )}

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/#caracteristicas" className={`text-sm font-medium ${getLinkClasses()} transition-colors`}>
                            Características
                        </Link>
                        <Link to="/#modulos" className={`text-sm font-medium ${getLinkClasses()} transition-colors`}>
                            Módulos
                        </Link>
                        <Link to="/healthcheck" className={`text-sm font-medium ${getLinkClasses()} transition-colors`}>
                            Estado del Sistema
                        </Link>
                    </div>

                    {/* Auth Section */}
                    {showAuth && (
                        <div className="flex items-center space-x-4">
                            {isAuthenticated ? (
                                <div className="flex items-center space-x-4">
                                    <span className={`text-sm font-medium ${getTextClasses()}`}>
                                        Hola, {user?.name.split(' ')[0]}
                                    </span>
                                    <Link
                                        to={user?.role === 'Admin' || user?.role === 'SuperAdmin'
                                            ? '/selector-modulo'
                                            : user?.role === 'Mentor'
                                                ? '/modulo/academico/mentor/dashboard'
                                                : '/modulo/academico/estudiante/dashboard'}
                                        className={`text-sm font-medium ${getLinkClasses()} transition-colors`}
                                    >
                                        Mi Dashboard
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className={`text-sm font-medium ${getLinkClasses()} transition-colors`}
                                    >
                                        Cerrar sesión
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        to="/login"
                                        className={`text-sm font-medium ${getLinkClasses()} transition-colors`}
                                    >
                                        Iniciar sesión
                                    </Link>
                                    <Link
                                        to="/registro"
                                        className={`btn-primary text-sm ${variant === 'transparent' ? 'bg-white text-blue-600 hover:bg-gray-100' : ''}`}
                                    >
                                        Registrarse
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button className={`${getTextClasses()} hover:text-blue-600 transition-colors`}>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
