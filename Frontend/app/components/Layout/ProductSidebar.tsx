import { Link, useLocation, useNavigate } from "@remix-run/react";
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from "~/contexts/AuthContext";
import { useSidebar } from "~/contexts/SidebarContext";
import FeatureIcon from '~/components/Icons/FeatureIcon';
import { useEffect } from 'react';

export default function ProductSidebar() {
    const location = useLocation();
    const { user, logout } = useAuth();
    const { isCollapsed, isPinned, toggleCollapse, togglePin } = useSidebar();
    const navigate = useNavigate();

    // ✅ Debug: Log estado del sidebar
    useEffect(() => {
        console.log('📱 ProductSidebar - Estado:', { isCollapsed, isPinned });
    }, [isCollapsed, isPinned]);

    const menuItems: any[] = [
        // { name: 'Dashboard', path: '/modulo/producto/dashboard', icon: 'chart' },
        // Los demás items están comentados en el código original
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

    return (
        <>
            {/* Overlay para móvil */}
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

            {/* Sidebar */}
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
                {/* Header del sidebar */}
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
                            {/* Close button - solo en mobile */}
                            <button
                                onClick={toggleCollapse}
                                onTouchEnd={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
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
                    <div className="px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-xs font-inter font-bold text-green-700 uppercase">Producto</p>
                    </div>
                </div>

                {/* User Info */}
                <div className="p-4 sm:p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-thicker text-base sm:text-lg shadow-md">
                            {user?.name.charAt(0) || 'P'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-inter text-sm font-semibold text-gray-900 truncate">{user?.name || 'Usuario'}</p>
                            <p className="font-inter text-xs text-green-600 font-medium">{user?.role || 'Trabajador'}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1 sm:space-y-2 custom-scrollbar">
                    {/* Mensaje de desarrollo */}
                    <div className="flex items-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-yellow-50 text-yellow-800 border border-yellow-200">
                        <svg className="w-5 h-5 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                        </svg>
                        <span className="font-inter font-medium text-xs sm:text-sm">Este menú está en desarrollo</span>
                    </div>

                    {/* Los items del menú están comentados porque está en desarrollo */}
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={handleMenuItemClick}
                            className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all group touch-manipulation ${
                                isActive(item.path)
                                    ? 'bg-green-50 text-green-700 border-2 border-green-200'
                                    : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                            }`}
                        >
                            <FeatureIcon 
                                type={item.icon as any} 
                                size={20} 
                                className={isActive(item.path) ? 'text-green-600' : 'text-gray-500'}
                            />
                            <span className="font-inter font-medium text-sm sm:text-base truncate">{item.name}</span>
                            {isActive(item.path) && (
                                <div className="ml-auto w-2 h-2 bg-green-600 rounded-full flex-shrink-0" />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Footer actions */}
                <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50 space-y-1 sm:space-y-2">
                    <Link
                        to="/selector-modulo"
                        onClick={handleMenuItemClick}
                        className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 hover:bg-white hover:shadow-sm rounded-xl transition-all touch-manipulation"
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="font-inter font-medium text-sm sm:text-base truncate">Cambiar módulo</span>
                    </Link>

                    <button
                        onClick={() => {
                            handleLogout();
                            handleMenuItemClick();
                        }}
                        className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all w-full touch-manipulation"
                        type="button"
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-inter font-medium text-sm sm:text-base truncate">Cerrar sesión</span>
                    </button>
                </div>
            </motion.aside>

            {/* Toggle button cuando está colapsado */}
            {isCollapsed && (
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={toggleCollapse}
                    className="fixed top-4 left-4 z-50 p-3 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hidden lg:block"
                    type="button"
                    aria-label="Abrir menú"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </motion.button>
            )}
        </>
    );
}
