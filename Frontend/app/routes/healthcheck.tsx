import type { MetaFunction } from '@remix-run/node';
import { useRevalidator } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { getBackendHealth } from '~/utils/api';

export const meta: MetaFunction = () => {
    return [
        { title: 'Healthcheck - Nodux' },
        { name: 'description', content: 'Sistema de monitoreo de salud de la aplicación' },
    ];
};

export default function Healthcheck() {
    const [frontendHealth, setFrontendHealth] = useState<any>(null);
    const [backendHealth, setBackendHealth] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const revalidator = useRevalidator();

    const fetchFrontendHealth = () => {
        if (typeof window !== 'undefined') {
            setFrontendHealth({
                status: 'healthy',
                service: 'nodux-frontend',
                version: '1.0.0',
                timestamp: Date.now(),
                metrics: {
                    platform: navigator.platform,
                    userAgent: navigator.userAgent,
                    language: navigator.language,
                }
            });
        }
    };

    const fetchBackendHealth = async () => {
        setLoading(true);
        try {
            const health = await getBackendHealth();
            setBackendHealth(health);
        } catch (error) {
            setBackendHealth({
                status: 'unhealthy',
                error: 'No se pudo conectar con el backend'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFrontendHealth();
        fetchBackendHealth();
        const interval = setInterval(() => {
            fetchFrontendHealth();
            fetchBackendHealth();
        }, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy':
                return 'bg-green-500';
            case 'degraded':
                return 'bg-yellow-500';
            case 'unhealthy':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'healthy':
                return 'Saludable';
            case 'degraded':
                return 'Degradado';
            case 'unhealthy':
                return 'No saludable';
            default:
                return 'Desconocido';
        }
    };

    if (!frontendHealth) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        🏥 Sistema de Monitoreo de Salud
                    </h1>
                    <p className="text-lg text-gray-600">
                        Monitoreo en tiempo real de la infraestructura de Nodux
                    </p>
                    <button
                        onClick={() => {
                            fetchFrontendHealth();
                            fetchBackendHealth();
                            revalidator.revalidate();
                        }}
                        className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        🔄 Actualizar
                    </button>
                </div>

                {/* Status Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Frontend Health */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Frontend</h2>
                            <span className={`px-4 py-2 rounded-full text-white text-sm font-semibold ${getStatusColor(frontendHealth.status)}`}>
                                {getStatusText(frontendHealth.status)}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-600">Servicio:</span>
                                <span className="font-semibold">{frontendHealth.service}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-600">Versión:</span>
                                <span className="font-semibold">{frontendHealth.version}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-600">Plataforma:</span>
                                <span className="font-semibold">{frontendHealth.metrics.platform}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-gray-600">Idioma:</span>
                                <span className="font-semibold">{frontendHealth.metrics.language}</span>
                            </div>
                        </div>
                    </div>

                    {/* Backend Health */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Backend</h2>
                            {loading ? (
                                <span className="px-4 py-2 rounded-full bg-gray-300 text-white text-sm font-semibold">
                                    Cargando...
                                </span>
                            ) : backendHealth ? (
                                <span className={`px-4 py-2 rounded-full text-white text-sm font-semibold ${getStatusColor(backendHealth.status)}`}>
                                    {getStatusText(backendHealth.status)}
                                </span>
                            ) : null}
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center h-48">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : backendHealth && backendHealth.status !== 'unhealthy' ? (
                            <div className="space-y-4">
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-gray-600">Servicio:</span>
                                    <span className="font-semibold">{backendHealth.service}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-gray-600">Versión:</span>
                                    <span className="font-semibold">{backendHealth.version}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-gray-600">Tiempo de Respuesta:</span>
                                    <span className="font-semibold">{backendHealth.metrics?.response_time_ms || backendHealth.responseTime}ms</span>
                                </div>
                                {backendHealth.metrics?.database && (
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Base de Datos:</span>
                                        <span className={`font-semibold ${backendHealth.metrics.database.status === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
                                            {backendHealth.metrics.database.status} ({backendHealth.metrics.database.latency_ms}ms)
                                        </span>
                                    </div>
                                )}
                                {backendHealth.metrics?.authentication && (
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-600">Autenticación:</span>
                                        <span className={`font-semibold ${backendHealth.metrics.authentication.status === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
                                            {backendHealth.metrics.authentication.status}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-48 text-red-600">
                                <div className="text-center">
                                    <p className="text-xl font-semibold mb-2">❌ Error de Conexión</p>
                                    <p className="text-sm">{backendHealth?.error || 'No se pudo conectar con el backend'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Security Status */}
                {backendHealth && backendHealth.metrics?.security && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-t-4 border-purple-500">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">🔒 Estado de Seguridad</h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <SecurityCard
                                title="CORS"
                                enabled={backendHealth.metrics.security.cors_enabled}
                                description="Control de origen cruzado"
                            />
                            <SecurityCard
                                title="Rate Limiting"
                                enabled={backendHealth.metrics.security.rate_limiting}
                                description="Limitación de peticiones"
                            />
                            <SecurityCard
                                title="Django Axes"
                                enabled={backendHealth.metrics.security.axes_enabled}
                                description="Protección contra ataques"
                            />
                            <SecurityCard
                                title="Modo Producción"
                                enabled={!backendHealth.metrics.security.debug_mode}
                                description="Debug desactivado"
                                warning={backendHealth.metrics.security.debug_mode}
                            />
                        </div>
                    </div>
                )}

                {/* System Metrics */}
                {backendHealth && backendHealth.metrics && (
                    <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-orange-500">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Métricas del Sistema</h2>

                        <div className="grid md:grid-cols-3 gap-6">
                            <MetricCard
                                title="Tiempo de Respuesta API"
                                value={`${backendHealth.metrics.response_time_ms}ms`}
                                status={backendHealth.metrics.response_time_ms < 100 ? 'good' : backendHealth.metrics.response_time_ms < 500 ? 'warning' : 'bad'}
                            />
                            <MetricCard
                                title="Latencia Base de Datos"
                                value={`${backendHealth.metrics.database.latency_ms}ms`}
                                status={backendHealth.metrics.database.latency_ms < 50 ? 'good' : backendHealth.metrics.database.latency_ms < 200 ? 'warning' : 'bad'}
                            />
                            <MetricCard
                                title="Motor de BD"
                                value={backendHealth.metrics.database.engine.split('.').pop() || 'N/A'}
                                status="info"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function SecurityCard({ title, enabled, description, warning = false }: {
    title: string;
    enabled: boolean;
    description: string;
    warning?: boolean;
}) {
    return (
        <div className={`p-4 rounded-lg border-2 ${enabled ? (warning ? 'border-yellow-400 bg-yellow-50' : 'border-green-400 bg-green-50') : 'border-red-400 bg-red-50'}`}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">{title}</h3>
                <span className="text-2xl">
                    {enabled ? (warning ? '⚠️' : '✅') : '❌'}
                </span>
            </div>
            <p className="text-sm text-gray-600">{description}</p>
            <p className={`text-xs mt-2 font-semibold ${enabled ? (warning ? 'text-yellow-700' : 'text-green-700') : 'text-red-700'}`}>
                {enabled ? (warning ? 'ADVERTENCIA' : 'ACTIVO') : 'INACTIVO'}
            </p>
        </div>
    );
}

function MetricCard({ title, value, status }: {
    title: string;
    value: string;
    status: 'good' | 'warning' | 'bad' | 'info';
}) {
    const colors = {
        good: 'border-green-400 bg-green-50 text-green-700',
        warning: 'border-yellow-400 bg-yellow-50 text-yellow-700',
        bad: 'border-red-400 bg-red-50 text-red-700',
        info: 'border-blue-400 bg-blue-50 text-blue-700',
    };

    return (
        <div className={`p-4 rounded-lg border-2 ${colors[status]}`}>
            <h3 className="text-sm font-medium mb-2">{title}</h3>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );
}
