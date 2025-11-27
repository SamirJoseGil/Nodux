import { Link, useLocation } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '~/contexts/SidebarContext';
import { useAuth } from '~/contexts/AuthContext';
import FeatureIcon from '~/components/Icons/FeatureIcon';

export default function AdminSidebar() {
    const { isCollapsed, isPinned, toggleCollapse, togglePin } = useSidebar();
    const { user, logout } = useAuth();
    const location = useLocation();

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

    return (
        <>
            {/* Overlay para mobile */}
            <AnimatePresence>
                {!isCollapsed && !isPinned && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCollapse}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    x: isCollapsed && !isPinned ? -280 : 0,
                    width: 256
                }}
                className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-xl z-50 flex flex-col ${
                    isPinned ? '' : 'lg:translate-x-0'
                }`}
            >
                {/* Header del Sidebar */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <Link to="/" className="flex items-center space-x-1">
                     <img
                    src="/images/LogoNodoEafit.png"
                    alt="Logo Nodo EAFIT"
                    className="w-24 h-12 object-contain"
                    />
                            <span className="font-thicker text-xl text-gray-900">NODUX</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={togglePin}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title={isPinned ? 'Desanclar' : 'Anclar'}
                            >
                                <FeatureIcon 
                                    type={isPinned ? 'target' : 'settings'} 
                                    size={20} 
                                    className="text-gray-600"
                                />
                            </button>
                            <button
                                onClick={toggleCollapse}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => !isPinned && toggleCollapse()}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                                isActive(item.path)
                                    ? 'bg-nodux-neon text-white shadow-lg'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <FeatureIcon 
                                type={item.icon as any} 
                                size={20} 
                                className={isActive(item.path) ? 'text-white' : 'text-gray-600 group-hover:text-nodux-neon'}
                            />
                            <span className="font-inter font-semibold">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-gray-200 space-y-2">
                    <Link
                        to="/selector-modulo"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                    >
                        <FeatureIcon type="apps" size={20} className="text-gray-600" />
                        <span className="font-inter font-semibold">Cambiar Módulo</span>
                    </Link>

                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-nodux-neon/10 hover:text-nodux-neon rounded-xl transition-all w-full"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-inter font-semibold">Cerrar Sesión</span>
                    </button>
                </div>
            </motion.aside>

            {/* Toggle button para desktop */}
            {isCollapsed && (
                <button
                    onClick={toggleCollapse}
                    className="fixed top-20 left-4 z-40 p-3 bg-gradient-to-br from-nodux-neon to-nodux-marino rounded-xl shadow-lg hover:shadow-xl transition-all hidden lg:block"
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            )}
        </>
    );
}
