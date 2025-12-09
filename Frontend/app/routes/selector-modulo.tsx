import { useState, useEffect } from "react";
import { useNavigate, Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { useAuth } from "~/contexts/AuthContext";
import { ModuleService } from "~/services/moduleService";
import type { Module } from "~/types/module";
import type { UserRole } from "~/types/auth";
import AcademicIcon from "~/components/Icons/AcademicIcon";
import ProductIcon from "~/components/Icons/ProductIcon";
import AdminIcon from "~/components/Icons/AdminIcon";

// ✅ Variantes de animación
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

// ✅ Función para obtener el ícono del módulo
const getModuleIcon = (moduleName: string) => {
    switch(moduleName) {
        case 'Académico':
            return <AcademicIcon size={40} className="text-white" />;
        case 'Producto':
            return <ProductIcon size={40} className="text-white" />;
        case 'Administración':
            return <AdminIcon size={40} className="text-white" />;
        default:
            return <AcademicIcon size={40} className="text-white" />;
    }
};

// ✅ Función para obtener el color del gradiente según el módulo
const getModuleGradient = (moduleName: string) => {
    switch(moduleName) {
        case 'Académico':
            return 'from-nodux-neon to-nodux-marino';
        case 'Producto':
            return 'from-nodux-marino to-nodux-amarillo';
        case 'Administración':
            return 'from-nodux-naranja to-nodux-amarillo';
        default:
            return 'from-nodux-neon to-nodux-marino';
    }
};

export default function SelectorModulo() {
    const { user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [modules, setModules] = useState<Module[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadModules = async () => {
            if (authLoading) {
                console.log('⏳ Esperando autenticación...');
                return;
            }

            if (!user) {
                console.log('⚠️ No hay usuario, redirigiendo a login');
                navigate('/login');
                return;
            }

            console.log('🔍 Cargando módulos para usuario:', {
                id: user.id,
                name: user.name,
                role: user.role,
                email: user.email
            });

            // Verificar localStorage como respaldo
            const localRole = localStorage.getItem('user_role');
            console.log('📦 Rol en localStorage:', localRole);

            if (!user.role && !localRole) {
                console.error('❌ Usuario sin rol asignado');
                setError('Tu cuenta no tiene un rol asignado. Contacta al administrador.');
                setIsLoading(false);
                return;
            }

            const effectiveRole = user.role || localRole as UserRole;
            console.log('✅ Usando rol efectivo:', effectiveRole);

            try {
                const loadedModules = await ModuleService.getModules(effectiveRole);
                
                console.log('📋 Módulos cargados:', {
                    count: loadedModules.length,
                    modules: loadedModules.map(m => ({ id: m.id, name: m.name }))
                });

                setModules(loadedModules);

                if (loadedModules.length === 0) {
                    console.warn('⚠️ No hay módulos disponibles para el rol:', effectiveRole);
                    setError(`No tienes acceso a ningún módulo con el rol "${effectiveRole}". Contacta al administrador.`);
                }
            } catch (err) {
                console.error('❌ Error al cargar módulos:', err);
                setError('Error al cargar módulos. Intenta nuevamente.');
            } finally {
                setIsLoading(false);
            }
        };

        loadModules();
    }, [user, authLoading, navigate]);

    const handleModuleClick = (module: Module) => {
        console.log('🎯 Click en módulo:', {
            moduleId: module.id,
            moduleName: module.name,
            userRole: user?.role,
            timestamp: new Date().toISOString()
        });

        sessionStorage.setItem('activeModule', module.name);

        const userRole = user?.role;
        
        switch(module.name) {
            case 'Académico':
                if (userRole === 'Mentor') {
                    console.log('→ Redirigiendo a: /modulo/academico/mentor/dashboard');
                    navigate('/modulo/academico/mentor/dashboard');
                } else if (userRole === 'Estudiante') {
                    console.log('→ Redirigiendo a: /modulo/academico/estudiante/dashboard');
                    navigate('/modulo/academico/estudiante/dashboard');
                } else {
                    console.log('→ Redirigiendo a: /modulo/academico/dashboard');
                    navigate('/modulo/academico/dashboard');
                }
                break;
            
            case 'Producto':
                if (userRole === 'Trabajador') {
                    console.log('→ Redirigiendo a: /modulo/producto/trabajador/dashboard');
                    navigate('/modulo/producto/trabajador/dashboard');
                } else {
                    console.log('→ Redirigiendo a: /modulo/producto/admin/dashboard');
                    navigate('/modulo/producto/admin/dashboard');
                }
                break;
            
            case 'Administración':
                console.log('→ Redirigiendo a: /modulo/administracion/dashboard');
                navigate('/modulo/administracion/dashboard');
                break;
            
            default:
                console.warn('⚠️ Módulo desconocido:', module.name);
                setError(`Módulo "${module.name}" no configurado.`);
        }
    };

    // Loading state
    if (isLoading || authLoading) {
        return (
            <div className="min-h-screen bg-zafiro-500 flex items-center justify-center relative overflow-hidden">
                {/* Animated background */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-20 right-20 w-96 h-96 bg-nodux-neon/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [360, 180, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-20 left-20 w-96 h-96 bg-nodux-marino/10 rounded-full blur-3xl"
                />

                <div className="text-center relative z-10">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-nodux-neon border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-white font-inter font-medium">Cargando módulos...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-zafiro-500 relative overflow-hidden">
                {/* Background shapes */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-20 right-20 w-96 h-96 bg-nodux-neon/10 rounded-full blur-3xl"
                />

                {/* Header */}
                <header className="relative z-10 w-full px-6 glass-strong">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2">
                            <span className="font-thicker text-2xl text-white">NODUX</span>
                        </Link>
                    </div>
                </header>

                {/* Error Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto glass-card p-8 text-center"
                    >
                        <div className="w-16 h-16 bg-nodux-naranja/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-nodux-naranja" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="font-thicker text-2xl text-white mb-2">Sin acceso</h3>
                        <p className="font-inter text-white/70 mb-4">{error}</p>
                        {user && (
                            <p className="text-sm text-white/60 mb-6">
                                Tu rol actual: <strong className="text-nodux-neon">{user.role}</strong>
                            </p>
                        )}
                        <button
                            onClick={() => navigate('/')}
                            className="btn-primary w-full"
                        >
                            Volver al Inicio
                        </button>
                    </motion.div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zafiro-500 relative overflow-hidden">
            {/* Animated Background */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-20 right-20 w-96 h-96 bg-nodux-neon/10 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    rotate: [360, 180, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-20 left-20 w-96 h-96 bg-nodux-marino/10 rounded-full blur-3xl"
            />

            {/* Header */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full py-4 px-6 glass-strong"
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="font-thicker text-2xl text-white">NODUX</span>
                    </Link>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <div className="inline-block mb-6 text-left w-full">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 px-4 py-2 bg-nodux-marino/80 hover:bg-nodux-marino/90 text-white rounded-xl shadow transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Volver</span>
                        </button>
                    </div>
                    <h1 className="font-thicker text-4xl sm:text-5xl text-white mb-4">
                        Selecciona tu <span className="text-gradient-neon">Módulo</span>
                    </h1>
                    <p className="font-inter text-lg text-white/70 max-w-2xl mx-auto">
                        Elige el espacio de trabajo que mejor se adapte a tus necesidades
                    </p>
                </motion.div>

                {/* User Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6 mb-12"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-nodux-neon to-nodux-marino rounded-full flex items-center justify-center text-white font-thicker text-2xl shadow-neon">
                            {user?.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h2 className="font-inter text-xl font-bold text-white">{user?.name}</h2>
                            <div className="flex items-center gap-4 mt-1">
                                <p className="font-inter text-white/70">{user?.email}</p>
                                <span className="px-3 py-1 bg-nodux-neon/20 text-nodux-neon border border-nodux-neon/30 rounded-full text-sm font-bold font-inter">
                                    {user?.role}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Modules Grid */}
                {modules.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto glass-card p-8 text-center"
                    >
                        <div className="w-16 h-16 bg-nodux-amarillo/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-nodux-amarillo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="font-thicker text-2xl text-white mb-2">Sin acceso</h3>
                        <p className="font-inter text-white/70 mb-4">
                            No tienes acceso a ningún módulo.
                        </p>
                        <p className="text-sm font-inter text-white/60 mb-6">
                            Tu rol actual: <strong className="text-nodux-neon">{user?.role}</strong>
                        </p>
                        <p className="font-inter text-white/70">
                            Contacta al administrador para obtener los permisos necesarios.
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {modules.map((module) => (
                            <motion.button
                                key={module.id}
                                variants={cardVariants}
                                whileHover={{ scale: 1.05, y: -8 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleModuleClick(module)}
                                className="glass-card p-8 text-left group relative overflow-hidden"
                            >
                                {/* Decorative gradient on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 from-nodux-neon to-nodux-marino" />

                                {/* Icon */}
                                <div className={`w-20 h-20 bg-gradient-to-br ${getModuleGradient(module.name)} rounded-2xl flex items-center justify-center mb-6 shadow-neon group-hover:shadow-neon-lg group-hover:scale-110 transition-all duration-300 relative z-10`}>
                                    {getModuleIcon(module.name)}
                                </div>

                                {/* Content */}
                                <h3 className="font-inter font-bold text-2xl text-white mb-3 group-hover:text-nodux-neon transition-colors relative z-10">
                                    {module.name}
                                </h3>
                                <p className="font-inter text-white/70 mb-4 relative z-10">
                                    {module.description}
                                </p>

                                {/* Arrow */}
                                <div className="flex items-center text-nodux-neon font-inter font-bold group-hover:translate-x-2 transition-transform relative z-10">
                                    <span>Acceder</span>
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </main>
        </div>
    );
}
