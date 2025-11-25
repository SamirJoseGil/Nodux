import { useState, useEffect } from "react";
import { useNavigate, Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { useAuth } from "~/contexts/AuthContext";
import { ModuleService } from "~/services/moduleService";
import type { Module } from "~/types/module";
import type { UserRole } from "~/types/auth";

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
                    console.log('→ Redirigiendo a: /modulo/academico/admin/dashboard');
                    navigate('/modulo/academico/admin/dashboard');
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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Cargando módulos...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 py-4 px-6">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">N</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">Nodux</span>
                        </Link>
                    </div>
                </header>

                {/* Error Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center"
                    >
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Sin acceso</h3>
                        <p className="text-gray-600 mb-1">{error}</p>
                        {user && (
                            <p className="text-sm text-gray-500 mb-4">
                                Tu rol actual: <strong>{user.role}</strong>
                            </p>
                        )}
                        <button
                            onClick={() => navigate('/')}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Volver al Inicio
                        </button>
                    </motion.div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-block mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">
                        Selecciona tu módulo
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Elige el espacio de trabajo que mejor se adapte a tus necesidades
                    </p>
                </div>

                {/* User Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {user?.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                            <div className="flex items-center gap-4 mt-1">
                                <p className="text-gray-600">{user?.email}</p>
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    {user?.role}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Selecciona un Módulo
                    </h1>
                    <p className="text-lg text-gray-600">
                        Elige el módulo con el que deseas trabajar
                    </p>
                </div>

                {modules.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center"
                    >
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Sin acceso</h3>
                        <p className="text-gray-600 mb-1">
                            No tienes acceso a ningún módulo.
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                            Tu rol actual: <strong>{user?.role}</strong>
                        </p>
                        <p className="text-gray-600">
                            Contacta al administrador para obtener los permisos necesarios.
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {modules.map((module, index) => (
                            <motion.button
                                key={module.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleModuleClick(module)}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-500 text-left group"
                            >
                                {/* Icon */}
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <span className="text-4xl">{module.icon}</span>
                                </div>

                                {/* Content */}
                                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                    {module.name}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {module.description}
                                </p>

                                {/* Arrow */}
                                <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform">
                                    <span>Acceder</span>
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
