import { motion } from 'framer-motion';
import type { MetaFunction } from '@remix-run/node';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import SystemAdminLayout from '~/components/Layout/SystemAdminLayout';
import FeatureIcon from '~/components/Icons/FeatureIcon';

export const meta: MetaFunction = () => {
    return [
        { title: `Logs del Sistema - Administración - Nodux` },
        { name: "description", content: `Visualiza los logs del sistema` },
    ];
};

export default function LogsAdmin() {
    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <SystemAdminLayout title="Logs del Sistema">
                <div className="min-h-screen -m-6 p-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8"
                    >
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-nodux-neon to-nodux-marino rounded-xl flex items-center justify-center">
                                    <FeatureIcon type="document" size={24} className="text-white" />
                                </div>
                                <div>
                                    <h1 className="font-thicker text-2xl text-zafiro-900">Logs del Sistema</h1>
                                    <p className="font-inter text-sm text-zafiro-700">Auditoría y monitoreo de actividades</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Aviso de Desarrollo */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 text-center">
                        <svg className="w-16 h-16 text-blue-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <h2 className="font-thicker text-2xl text-zafiro-900 mb-3">
                            🚧 Módulo en Construcción
                        </h2>
                        <p className="font-inter text-zafiro-700 text-lg mb-6 max-w-2xl mx-auto">
                            El sistema de logs está actualmente en desarrollo. Esta funcionalidad permitirá visualizar y filtrar todas las acciones realizadas en el sistema.
                        </p>
                        <div className="glass-card max-w-3xl mx-auto p-6 text-left">
                            <h3 className="font-inter font-bold text-zafiro-900 mb-4 text-lg">
                                📋 Funcionalidades planeadas:
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="font-inter font-semibold text-zafiro-900">Registro de acciones</p>
                                        <p className="font-inter text-sm text-zafiro-700">CRUD de usuarios, proyectos, etc.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="font-inter font-semibold text-zafiro-900">Intentos de acceso</p>
                                        <p className="font-inter text-sm text-zafiro-700">Exitosos y fallidos</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="font-inter font-semibold text-zafiro-900">Filtros avanzados</p>
                                        <p className="font-inter text-sm text-zafiro-700">Por usuario, fecha, tipo de acción</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="font-inter font-semibold text-zafiro-900">Exportación de datos</p>
                                        <p className="font-inter text-sm text-zafiro-700">CSV, Excel, PDF</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="font-inter font-semibold text-zafiro-900">Búsqueda en tiempo real</p>
                                        <p className="font-inter text-sm text-zafiro-700">Encuentra eventos específicos</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="font-inter font-semibold text-zafiro-900">Alertas automáticas</p>
                                        <p className="font-inter text-sm text-zafiro-700">Notificaciones de eventos críticos</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 text-sm text-zafiro-600 font-inter">
                            💡 Mientras tanto, puedes revisar la actividad reciente en el <a href="/modulo/administracion/dashboard" className="text-nodux-neon hover:underline font-semibold">Dashboard</a>
                        </div>
                    </div>
                </div>
            </SystemAdminLayout>
        </ProtectedRoute>
    );
}
