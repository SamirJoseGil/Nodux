import { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import { Link } from '@remix-run/react';
import { useAuth } from '~/contexts/AuthContext';
import { motion } from 'framer-motion';

interface AdminLayoutProps {
    children: ReactNode;
    title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const { user } = useAuth();

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <AdminSidebar />

            <div className="flex-1 flex flex-col">
                {/* Header con glassmorphism */}
                <motion.header
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="header-glass sticky top-0 z-40"
                >
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <motion.h1
                            className="text-3xl font-bold text-nodo-black"
                            initial={{ x: -20 }}
                            animate={{ x: 0 }}
                        >
                            {title}
                        </motion.h1>
                        <div className="flex items-center space-x-4">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to="/healthcheck"
                                    className="text-sm text-gray-600 hover:text-nodo-neon-blue transition-colors font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/50"
                                >
                                    <span>🏥</span>
                                    Sistema
                                </Link>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="relative group"
                            >
                                <div className="flex items-center cursor-pointer">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-nodo-neon-blue to-nodo-green flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-nodo-yellow/50">
                                        {user?.name.charAt(0) || 'A'}
                                    </div>
                                </div>
                                {/* Tooltip */}
                                <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-3">
                                    <p className="text-sm font-semibold text-nodo-black">{user?.name}</p>
                                    <p className="text-xs text-gray-600">{user?.email}</p>
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                        <span className="text-xs font-medium text-nodo-neon-blue">{user?.role}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.header>

                {/* Main content */}
                <main className="flex-1 max-w-7xl w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {children}
                    </motion.div>
                </main>

                {/* Footer */}
                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/50 backdrop-blur-sm border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8"
                >
                    <div className="max-w-7xl mx-auto flex justify-between items-center text-sm text-gray-600">
                        <p>© 2024 <span className="font-bold text-nodo-neon-blue">Nodo</span>. Todos los derechos reservados.</p>
                        <div className="flex gap-4">
                            <Link to="/healthcheck" className="hover:text-nodo-neon-blue transition-colors">Estado del sistema</Link>
                            <span className="text-gray-400">|</span>
                            <Link to="/" className="hover:text-nodo-neon-blue transition-colors">Inicio</Link>
                        </div>
                    </div>
                </motion.footer>
            </div>
        </div>
    );
}
