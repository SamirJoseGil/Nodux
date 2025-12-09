import { ReactNode } from 'react';
import ProductSidebar from './ProductSidebar';
import { Link } from '@remix-run/react';
import { useAuth } from '~/contexts/AuthContext';
import { SidebarProvider, useSidebar } from '~/contexts/SidebarContext';
import { motion } from 'framer-motion';

interface ProductLayoutProps {
    children: ReactNode;
    title: string;
}

function ProductLayoutContent({ children, title }: ProductLayoutProps) {
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 flex relative overflow-hidden">
            {/* Background decorations */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 right-20 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
            </div>

            <ProductSidebar />

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
                        </div>

                        {/* User Info & Quick Actions */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            <Link
                                to="/healthcheck"
                                className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-green-600 transition-colors font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-50"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="hidden md:inline">Sistema</span>
                            </Link>
                            
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="hidden md:block text-right">
                                    <p className="font-inter text-sm font-semibold text-gray-900">
                                        {user?.name}
                                    </p>
                                    <p className="font-inter text-xs text-green-600 font-medium">
                                        {user?.role}
                                    </p>
                                </div>
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-thicker text-sm sm:text-base shadow-md">
                                    {user?.name.charAt(0) || 'P'}
                                </div>
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
                            © 2025 <span className="font-bold text-green-600">Nodux</span>.
                            Todos los derechos reservados.
                        </p>
                        <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
                            <Link
                                to="/healthcheck"
                                className="font-inter text-xs sm:text-sm text-gray-600 hover:text-green-600 transition-colors"
                            >
                                Estado del sistema
                            </Link>
                            <span className="text-gray-300 hidden sm:inline">|</span>
                            <Link
                                to="/"
                                className="font-inter text-xs sm:text-sm text-gray-600 hover:text-green-600 transition-colors"
                            >
                                Inicio
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default function ProductLayout({ children, title }: ProductLayoutProps) {
    return (
        <SidebarProvider>
            <ProductLayoutContent title={title}>
                {children}
            </ProductLayoutContent>
        </SidebarProvider>
    );
}
