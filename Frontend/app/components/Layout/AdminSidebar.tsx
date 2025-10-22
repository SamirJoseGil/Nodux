import { Link, useLocation } from "@remix-run/react";
import { useAuth } from "~/contexts/AuthContext";
import { useModule } from "~/contexts/ModuleContext";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function AdminSidebar() {
    const location = useLocation();
    const { user, logout } = useAuth();
    const { activeModule } = useModule();

    const modulePrefix = useMemo(() => {
        if (activeModule) {
            return `/modulo/${activeModule.toLowerCase()}`;
        }
        return '';
    }, [activeModule]);

    const menuItems = [
        { name: 'Dashboard', path: `${modulePrefix}/dashboard`, icon: '📊' },
        { name: 'Proyectos', path: `${modulePrefix}/admin/projects`, icon: '📝' },
        { name: 'Mentores', path: `${modulePrefix}/admin/mentors`, icon: '👨‍🏫' },
        { name: 'Grupos', path: `${modulePrefix}/admin/groups`, icon: '👨‍👩‍👧‍👦' },
        { name: 'Registro de horas', path: `${modulePrefix}/admin/hours`, icon: '⏱️' },
        { name: 'Calendario', path: `${modulePrefix}/admin/calendar`, icon: '📅' },
        { name: 'Métricas', path: `${modulePrefix}/admin/metrics`, icon: '📈' },
    ];

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div className="sidebar-nodo shadow-xl">
            {/* Header con glassmorphism */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 border-b-2 border-nodo-neon-blue/30 bg-nodo-neon-blue/10 backdrop-blur-sm"
            >
                <motion.h2
                    className="text-2xl font-bold bg-gradient-to-r from-nodo-yellow to-nodo-green bg-clip-text text-transparent"
                    whileHover={{ scale: 1.05 }}
                >
                    Nodux {activeModule || ''}
                </motion.h2>
                <p className="text-sm text-gray-300 mt-1">
                    {activeModule || 'Plataforma de Gestión'}
                </p>
            </motion.div>

            {/* User info con avatar */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 border-b border-nodo-neon-blue/20"
            >
                <div className="flex items-center space-x-3">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="relative"
                    >
                        <div className="bg-gradient-to-br from-nodo-neon-blue to-nodo-green rounded-full h-12 w-12 flex items-center justify-center shadow-lg ring-2 ring-nodo-yellow/50">
                            <span className="text-xl font-bold text-white">{user?.name.charAt(0) || 'A'}</span>
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-nodo-green rounded-full border-2 border-nodo-dark-blue"></div>
                    </motion.div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{user?.name || 'Usuario Admin'}</p>
                        <p className="text-xs text-nodo-yellow">{user?.role || 'Admin'}</p>
                    </div>
                </div>
            </motion.div>

            {/* Navigation menu */}
            <nav className="flex-1 p-4 overflow-y-auto">
                <motion.ul
                    className="space-y-2"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.05
                            }
                        }
                    }}
                >
                    {menuItems.map((item, index) => (
                        <motion.li
                            key={item.path}
                            variants={{
                                hidden: { opacity: 0, x: -20 },
                                visible: { opacity: 1, x: 0 }
                            }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${isActive(item.path)
                                        ? 'bg-gradient-to-r from-nodo-neon-blue to-nodo-green text-white shadow-lg shadow-nodo-neon-blue/50'
                                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <motion.span
                                    className="mr-3 text-2xl"
                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    {item.icon}
                                </motion.span>
                                <span className="font-medium">{item.name}</span>
                                {isActive(item.path) && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="ml-auto w-2 h-2 bg-nodo-yellow rounded-full"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 500 }}
                                    />
                                )}
                            </Link>
                        </motion.li>
                    ))}
                </motion.ul>

                {/* Acceso administrativo */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 pt-6 border-t border-nodo-neon-blue/30"
                >
                    <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-3 px-4 font-semibold">
                        Acceso Especial
                    </h4>
                    <Link
                        to="/modulo/administracion/dashboard"
                        className="flex items-center px-4 py-3 rounded-xl transition-all text-gray-300 hover:bg-nodo-orange/20 hover:text-nodo-orange group"
                    >
                        <motion.span
                            className="mr-3 text-2xl"
                            whileHover={{ scale: 1.2, rotate: 180 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            ⚙️
                        </motion.span>
                        <span className="font-medium">Sistema</span>
                    </Link>
                </motion.div>
            </nav>

            {/* Footer actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-4 border-t-2 border-nodo-neon-blue/30 bg-nodo-dark-blue/50 backdrop-blur-sm space-y-2"
            >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                        to="/selector-modulo"
                        className="flex items-center px-4 py-3 w-full text-gray-300 hover:bg-white/10 rounded-xl transition-all group"
                    >
                        <motion.span
                            className="mr-3 text-xl"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            🔄
                        </motion.span>
                        <span className="font-medium">Cambiar módulo</span>
                    </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <button
                        onClick={logout}
                        className="flex items-center px-4 py-3 w-full text-gray-300 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all group"
                    >
                        <motion.span
                            className="mr-3 text-xl"
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            👋
                        </motion.span>
                        <span className="font-medium">Cerrar sesión</span>
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}
