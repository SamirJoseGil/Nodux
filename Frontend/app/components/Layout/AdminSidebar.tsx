import { Link, useLocation, useNavigate } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '~/contexts/SidebarContext';
import { useAuth } from '~/contexts/AuthContext';
import FeatureIcon from '~/components/Icons/FeatureIcon';
import { useEffect } from 'react';

export default function AdminSidebar() {
    const { isCollapsed, isPinned, toggleCollapse, togglePin } = useSidebar();
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // ✅ Debug: Log estado del sidebar
    useEffect(() => {
        console.log('📱 AdminSidebar - Estado:', { isCollapsed, isPinned });
    }, [isCollapsed, isPinned]);

    const menuItems = [
        {
            name: 'Dashboard',
            icon: 'chart',
            path: '/modulo/academico/dashboard',
        },
        {
            name: 'Proyectos',
            icon: 'book',
            path: '/modulo/academico/admin/projects',
        },
        {
            name: 'Mentores',
            icon: 'users',
            path: '/modulo/academico/admin/mentors',
        },
        {
            name: 'Grupos',
            icon: 'chart',
            path: '/modulo/academico/admin/groups',
        },
        {
            name: 'Registro de Horas',
            icon: 'clock',
            path: '/modulo/academico/admin/hours',
        },
        {
            name: 'Calendario',
            icon: 'calendar',
            path: '/modulo/academico/admin/calendar',
        },
        {
            name: 'Métricas',
            icon: 'trending',
            path: '/modulo/academico/admin/metrics',
        },
    ];

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            navigate('/', { replace: true });
        }
    };

    // ✅ Handler mejorado para cerrar el menú
    const handleMenuItemClick = () => {
        console.log('🔘 Item del menú clickeado, isPinned:', isPinned);
        if (!isPinned) {
            toggleCollapse();
        }
    };

    // ✅ Handler mejorado para el overlay
    const handleOverlayClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log('🔘 Overlay clickeado');
        toggleCollapse();
    };

    // ✅ Handler específico para el botón de cerrar
    const handleCloseClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        console.log('🔘 Botón X clickeado');
        toggleCollapse();
    };

    return (
        <>
            {/* Overlay para mobile - ✅ Mejorado */}
            <AnimatePresence>
                {!isCollapsed && !isPinned && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleOverlayClick}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        style={{ touchAction: 'none' }}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar - ✅ Mejorado */}
            <motion.aside
                initial={false}
                animate={{
                    x: isCollapsed && !isPinned ? -280 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-xl z-50 flex flex-col w-64 ${
                    isPinned ? '' : 'lg:translate-x-0'
                }`}
            >
                {/* Header del Sidebar */}
                <div className="p-4 sm:p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <span className="font-thicker text-lg sm:text-xl text-gray-900">NODUX</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            {/* Pin button - solo en desktop */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    togglePin();
                                }}
                                className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title={isPinned ? 'Desanclar' : 'Anclar'}
                                type="button"
                            >
                                <FeatureIcon 
                                    type={isPinned ? 'target' : 'settings'} 
                                    size={18} 
                                    className="text-gray-600"
                                />
                            </button>
                            {/* Close button - solo en mobile - ✅ MEJORADO */}
                            <button
                                onClick={handleCloseClick}
                                onTouchEnd={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    console.log('🔘 Touch en botón X');
                                    toggleCollapse();
                                }}
                                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation active:bg-gray-200"
                                aria-label="Cerrar menú"
                                type="button"
                                style={{ 
                                    WebkitTapHighlightColor: 'transparent',
                                    minWidth: '44px',
                                    minHeight: '44px'
                                }}
                            >
                                <svg className="w-6 h-6 text-gray-600 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="px-3 py-2 bg-nodux-neon/10 rounded-lg border border-nodux-neon/30">
                        <p className="text-xs font-inter font-bold text-nodux-neon uppercase">Académico</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1 sm:space-y-2 custom-scrollbar">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={handleMenuItemClick}
                            onTouchEnd={(e) => {
                                if (!isPinned) {
                                    e.preventDefault();
                                    navigate(item.path);
                                    setTimeout(() => toggleCollapse(), 100);
                                }
                            }}
                            className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all group touch-manipulation ${
                                isActive(item.path)
                                    ? 'bg-nodux-neon text-white shadow-lg'
                                    : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                            }`}
                        >
                            <FeatureIcon 
                                type={item.icon as any} 
                                size={20} 
                                className={isActive(item.path) ? 'text-white' : 'text-gray-600 group-hover:text-nodux-neon'}
                            />
                            <span className="font-inter font-semibold text-sm sm:text-base">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* User Info & Logout */}
                <div className="p-3 sm:p-4 border-t border-gray-200 space-y-1 sm:space-y-2">
                    <Link
                        to="/selector-modulo"
                        onClick={handleMenuItemClick}
                        onTouchEnd={(e) => {
                            if (!isPinned) {
                                e.preventDefault();
                                navigate('/selector-modulo');
                                setTimeout(() => toggleCollapse(), 100);
                            }
                        }}
                        className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-all touch-manipulation"
                    >
                        <FeatureIcon type="apps" size={20} className="text-gray-600" />
                        <span className="font-inter font-semibold text-sm sm:text-base">Cambiar Módulo</span>
                    </Link>

                    <button
                        onClick={() => {
                            handleLogout();
                            handleMenuItemClick();
                        }}
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            handleLogout();
                            if (!isPinned) {
                                setTimeout(() => toggleCollapse(), 100);
                            }
                        }}
                        className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 hover:bg-nodux-neon/10 hover:text-nodux-neon active:bg-nodux-neon/20 rounded-xl transition-all w-full touch-manipulation"
                        type="button"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-inter font-semibold text-sm sm:text-base">Cerrar Sesión</span>
                    </button>
                </div>
            </motion.aside>

            {/* Toggle button para desktop cuando está colapsado */}
            {isCollapsed && (
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={toggleCollapse}
                    className="fixed top-4 left-4 z-40 p-3 bg-gradient-to-br from-nodux-neon to-nodux-marino rounded-xl shadow-lg hover:shadow-xl transition-all hidden lg:block"
                    type="button"
                    aria-label="Abrir menú"
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </motion.button>
            )}
        </>
    );
}
