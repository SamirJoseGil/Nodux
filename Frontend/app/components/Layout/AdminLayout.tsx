import { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import { Link } from '@remix-run/react';
import { useAuth } from '~/contexts/AuthContext';
import { SidebarProvider, useSidebar } from '~/contexts/SidebarContext';
import { motion } from 'framer-motion';

interface AdminLayoutProps {
    children: ReactNode;
    title: string;
}

function AdminLayoutContent({ children, title }: AdminLayoutProps) {
    const { user } = useAuth();
    const { isCollapsed, isPinned } = useSidebar();

    return (
        <div className="min-h-screen bg-zafiro-500 flex relative overflow-hidden">
            {/* Background decorations */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 right-20 w-96 h-96 bg-nodux-neon/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-nodux-marino/5 rounded-full blur-3xl" />
            </div>

            <AdminSidebar />

            <div className={`flex-1 flex flex-col transition-all duration-300 relative ${
                isCollapsed || !isPinned ? 'ml-0' : 'ml-64'
            }`}>
                {/* Header */}
                <motion.header
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="glass-strong sticky top-0 z-30 border-b border-gray-200 bg-white"
                >
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <div>
                            <h1 className="font-thicker text-2xl text-gray-900">
                                {title}
                            </h1>
                            <p className="font-inter text-sm text-gray-500 mt-1">
                                {new Date().toLocaleDateString('es-ES', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>

                        {/* User Info */}
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:block text-right">
                                <p className="font-inter text-sm font-semibold text-gray-900">
                                    {user?.name}
                                </p>
                                <p className="font-inter text-xs text-nodux-neon font-bold">
                                    {user?.role}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-nodux-neon to-nodux-marino rounded-full flex items-center justify-center text-white font-thicker shadow-neon">
                                {user?.name.charAt(0) || 'U'}
                            </div>
                        </div>
                    </div>
                </motion.header>

                {/* Main content */}
                <main className="flex-1 max-w-7xl w-full mx-auto py-6 px-4 sm:px-6 lg:px-8 relative z-10 bg-white">
                    {children}
                </main>

                {/* Footer */}
                <footer className="glass-strong border-t border-gray-200 bg-white py-4 px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="font-inter text-sm text-gray-600">
                            © 2025 <span className="font-bold text-nodux-neon">Nodux</span>.
                            Todos los derechos reservados.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link
                                to="/"
                                className="font-inter text-sm text-gray-600 hover:text-nodux-neon transition-colors"
                            >
                                Inicio
                            </Link>
                            <span className="text-gray-300">|</span>
                            <Link
                                to="/selector-modulo"
                                className="font-inter text-sm text-gray-600 hover:text-nodux-neon transition-colors"
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

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    return (
        <SidebarProvider>
            <AdminLayoutContent title={title}>
                {children}
            </AdminLayoutContent>
        </SidebarProvider>
    );
}
