import { ReactNode } from 'react';
import SystemAdminSidebar from './SystemAdminSidebar';
import { Link } from '@remix-run/react';
import { useAuth } from '~/contexts/AuthContext';
import { SidebarProvider, useSidebar } from '~/contexts/SidebarContext';
import { motion } from 'framer-motion';

interface SystemAdminLayoutProps {
    children: ReactNode;
    title: string;
}

function SystemAdminLayoutContent({ children, title }: SystemAdminLayoutProps) {
    const { user } = useAuth();
    const { isCollapsed, isPinned, toggleCollapse } = useSidebar();

    // ✅ Función mejorada para manejar el toggle en móvil
    const handleMobileMenuToggle = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        e.preventDefault();
        console.log('🔘 Toggle móvil clickeado, isCollapsed:', isCollapsed);
        toggleCollapse();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-yellow-50 flex relative overflow-hidden">
            {/* Background decorations */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 right-20 w-96 h-96 bg-nodux-naranja/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-nodux-amarillo/5 rounded-full blur-3xl" />
            </div>

            <SystemAdminSidebar />

            <div className={`flex-1 flex flex-col transition-all duration-300 relative ${
                isCollapsed || !isPinned ? 'lg:ml-0' : 'lg:ml-64'
            }`}>
                {/* Header */}
                <motion.header
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="glass-strong sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm"
                >
                    <div className="max-w-7xl mx-auto py-3 sm:py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        {/* Mobile menu button */}
                        <button
                            onClick={handleMobileMenuToggle}
                            onTouchEnd={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                console.log('🔘 Touch en hamburger');
                                toggleCollapse();
                            }}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation active:scale-95"
                            aria-label="Abrir menú"
                            type="button"
                            style={{ 
                                WebkitTapHighlightColor: 'transparent',
                                minWidth: '44px',
                                minHeight: '44px'
                            }}
                        >
                            <svg className="w-6 h-6 text-gray-600 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Title */}
                        <div className="flex-1 lg:flex-initial ml-4 lg:ml-0">
                            <h1 className="font-thicker text-lg sm:text-xl lg:text-2xl text-gray-900 truncate">
                                {title}
                            </h1>
                            <p className="font-inter text-xs sm:text-sm text-gray-500 mt-0.5 hidden sm:block">
                                {new Date().toLocaleDateString('es-ES', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>

                        {/* User Info */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="hidden md:block text-right">
                                <p className="font-inter text-sm font-semibold text-gray-900">
                                    {user?.name}
                                </p>
                                <p className="font-inter text-xs text-nodux-naranja font-bold">
                                    {user?.role}
                                </p>
                            </div>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-nodux-naranja to-nodux-amarillo rounded-full flex items-center justify-center text-white font-thicker text-sm sm:text-base shadow-lg">
                                {user?.name.charAt(0) || 'A'}
                            </div>
                        </div>
                    </div>
                </motion.header>

                {/* Main content */}
                <main className="flex-1 w-full mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8 relative z-10 bg-transparent overflow-x-hidden">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="glass-strong border-t border-gray-200 bg-white/95 backdrop-blur-sm py-3 sm:py-4 px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                        <p className="font-inter text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                            © 2025 <span className="font-bold text-nodux-naranja">Nodux</span>.
                            Todos los derechos reservados.
                        </p>
                        <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
                            <Link
                                to="/"
                                className="font-inter text-xs sm:text-sm text-gray-600 hover:text-nodux-naranja transition-colors"
                            >
                                Inicio
                            </Link>
                            <span className="text-gray-300 hidden sm:inline">|</span>
                            <Link
                                to="/selector-modulo"
                                className="font-inter text-xs sm:text-sm text-gray-600 hover:text-nodux-naranja transition-colors"
                            >
                                Cambiar Módulo
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default function SystemAdminLayout({ children, title }: SystemAdminLayoutProps) {
    return (
        <SidebarProvider>
            <SystemAdminLayoutContent title={title}>
                {children}
            </SystemAdminLayoutContent>
        </SidebarProvider>
    );
}
