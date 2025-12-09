import { Link, useNavigate } from "@remix-run/react";
import { useAuth } from "~/contexts/AuthContext";
import { motion } from "framer-motion";
import { useState } from "react";

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
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const getVariantClasses = () => {
        switch (variant) {
            case 'transparent':
                return 'bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-lg';
            case 'minimal':
                return 'bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm';
            default:
                return 'bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-md';
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
                return 'text-white/80 hover:text-white';
            default:
                return 'text-slate-600 hover:text-blue-600';
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            // Redirigir al home después de cerrar sesión
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            // Redirigir de todos modos
            navigate('/', { replace: true });
        }
    };

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`sticky top-0 z-50 ${getVariantClasses()} ${className}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:h-20">
                    {/* Logo */}
                    {showLogo && (
                        <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                transition={{ duration: 0.3 }}
                            >
                            </motion.div>
                            <span className={`font-thicker text-xl sm:text-2xl ${getTextClasses()} group-hover:text-blue-600 transition-colors`}>
                                NODUX
                            </span>
                        </Link>
                    )}
                    {/* Auth Section Desktop */}
                    {showAuth && (
                        <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
                            {isAuthenticated ? (
                                <div className="flex items-center space-x-3 lg:space-x-4">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${variant === 'transparent' ? 'bg-white/10' : 'bg-slate-100'}`}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${variant === 'transparent' ? 'bg-green-400' : 'bg-green-500'} animate-pulse`}></div>
                                        <span className={`text-sm font-medium ${getTextClasses()} hidden lg:inline`}>
                                            {user?.name.split(' ')[0]}
                                        </span>
                                    </motion.div>
                                    <Link
                                        to={user?.role === 'Estudiante' ? '/estudiantes/dashboard' : '/selector-modulo'}
                                        className={`text-sm font-semibold ${getLinkClasses()} transition-all duration-300 hover:scale-105`}
                                    >
                                        Dashboard
                                    </Link>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleLogout}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                                            variant === 'transparent' 
                                                ? 'bg-white/10 hover:bg-white/20 text-white' 
                                                : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                                        }`}
                                    >
                                        Salir
                                    </motion.button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-3 lg:space-x-4">
                                    <Link
                                        to="/login"
                                        className={`text-sm font-semibold ${getLinkClasses()} transition-all duration-300 hover:scale-105`}
                                    >
                                        Iniciar sesión
                                    </Link>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Link
                                            to="/registro"
                                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 shadow-md hover:shadow-lg ${
                                                variant === 'transparent'
                                                    ? 'bg-white text-blue-600 hover:bg-gray-100'
                                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                                            }`}
                                        >
                                            Registrarse
                                        </Link>
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`p-2 rounded-lg ${variant === 'transparent' ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'} transition-colors`}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`md:hidden pb-4 ${variant === 'transparent' ? 'border-t border-white/10' : 'border-t border-gray-200'}`}
                    >
                        <div className="space-y-3 pt-4">                            
                            {showAuth && (
                                <>
                                    {isAuthenticated ? (
                                        <>
                                            <div className={`px-4 py-2 text-sm ${getTextClasses()}`}>
                                                Hola, {user?.name.split(' ')[0]}
                                            </div>
                                            <Link
                                                to={user?.role === 'Estudiante' ? '/estudiantes/dashboard' : '/selector-modulo'}
                                                className={`block px-4 py-2 rounded-lg ${getLinkClasses()} font-medium transition-colors`}
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setMobileMenuOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 rounded-lg ${getLinkClasses()} font-medium transition-colors`}
                                            >
                                                Cerrar sesión
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/login"
                                                className={`block px-4 py-2 rounded-lg ${getLinkClasses()} font-medium transition-colors`}
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                Iniciar sesión
                                            </Link>
                                            <Link
                                                to="/registro"
                                                className={`block px-4 py-2 rounded-lg font-bold text-center ${
                                                    variant === 'transparent'
                                                        ? 'bg-white text-blue-600'
                                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                                                }`}
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                Registrarse
                                            </Link>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.nav>
    );
}
