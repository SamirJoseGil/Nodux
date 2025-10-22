import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { useAuth } from '~/contexts/AuthContext';
import { useModule } from '~/contexts/ModuleContext';
import { ModuleService } from '~/services/moduleService';
import type { Module } from '~/types/module';
import { motion } from 'framer-motion';

export const meta: MetaFunction = () => {
    return [
        { title: "Selector de Módulos - Nodux" },
        {
            name: "description",
            content: "Selecciona el módulo con el que deseas trabajar",
        },
    ];
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 20
        }
    }
};

export default function SelectorModulo() {
    const { user } = useAuth();
    const { setActiveModule } = useModule();
    const navigate = useNavigate();
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                setLoading(true);
                if (user && user.role) {
                    const availableModules = await ModuleService.getModules(user.role);
                    setModules(availableModules || []);
                } else {
                    setModules([]);
                }
            } catch (error) {
                console.error("Error cargando módulos:", error);
                setModules([]);
            } finally {
                setLoading(false);
            }
        };

        fetchModules();
    }, [user]);

    const handleModuleSelect = (module: Module) => {
        setActiveModule(module.name);
        let targetPath = '';

        switch (module.name) {
            case 'Académico':
                targetPath = '/modulo/academico/dashboard';
                break;
            case 'Producto':
                targetPath = '/modulo/producto/dashboard';
                break;
            case 'Administración':
                targetPath = '/modulo/administracion/dashboard';
                break;
            default:
                targetPath = `/modulo/${(module.name ?? 'modulo').toLowerCase()}/dashboard`;
        }

        navigate(targetPath);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen gradient-nodo-primary">
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="rounded-full h-20 w-20 border-4 border-nodo-yellow border-t-transparent"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header con animación */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="inline-block mb-4"
                    >
                        <div className="w-20 h-20 bg-gradient-to-br from-nodo-neon-blue to-nodo-green rounded-2xl flex items-center justify-center shadow-2xl">
                            <span className="text-4xl">🎯</span>
                        </div>
                    </motion.div>
                    <h1 className="text-4xl font-bold text-nodo-black mb-4">
                        Selecciona tu módulo
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Elige el espacio de trabajo que mejor se adapte a tus necesidades
                    </p>
                </motion.div>

                {modules && modules.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {modules.map((module) => (
                            <motion.div
                                key={module.id}
                                variants={cardVariants}
                                whileHover={{
                                    scale: 1.05,
                                    y: -10,
                                    transition: { type: "spring", stiffness: 400 }
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleModuleSelect(module)}
                                className="card-nodo-glass cursor-pointer group relative overflow-hidden"
                            >
                                {/* Efecto de brillo al hover */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                    initial={{ x: '-100%' }}
                                    whileHover={{ x: '100%' }}
                                    transition={{ duration: 0.6 }}
                                />

                                <div className="relative px-6 py-8">
                                    <motion.div
                                        className="text-center mb-6"
                                        whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <span className="text-6xl drop-shadow-lg">{module.icon}</span>
                                    </motion.div>

                                    <h3 className="text-2xl leading-6 font-bold text-nodo-black text-center mb-4 group-hover:text-nodo-neon-blue transition-colors">
                                        {module.name}
                                    </h3>

                                    <p className="text-gray-700 text-center mb-6 min-h-[60px]">
                                        {module.description}
                                    </p>

                                    <div className="text-center">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="btn-nodo-secondary w-full"
                                        >
                                            Acceder
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Indicador de módulo admin */}
                                {module.adminOnly && (
                                    <div className="absolute top-4 right-4">
                                        <span className="px-2 py-1 text-xs font-bold bg-nodo-orange text-white rounded-full shadow-lg">
                                            Admin
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card-nodo-glass p-12 text-center"
                    >
                        <span className="text-6xl mb-4 block">🔒</span>
                        <h3 className="text-2xl font-bold text-nodo-black mb-2">Sin acceso</h3>
                        <p className="text-gray-600">No tienes acceso a ningún módulo. Contacta al administrador.</p>
                    </motion.div>
                )}

                {/* Footer con botón de regreso */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-nodo-neon-blue hover:text-nodo-dark-blue transition-colors font-medium"
                        >
                            <span>←</span>
                            Volver a la página principal
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
