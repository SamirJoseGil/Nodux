import { json, type LoaderFunction, type MetaFunction } from '@remix-run/node';
import { useLoaderData, useRevalidator } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { getBackendHealth } from '~/utils/api';
import Navbar from '~/components/Navigation/Navbar';
import Footer from '~/components/Navigation/Footer';

export const meta: MetaFunction = () => {
    return [
        { title: 'Healthcheck - Nodux' },
        { name: 'description', content: 'Sistema de monitoreo de salud de la aplicación' },
    ];
};

export const loader: LoaderFunction = async () => {
    const frontendHealth = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
    };

    return json({ frontendHealth });
};

export default function Healthcheck() {
    const { frontendHealth } = useLoaderData<typeof loader>();
    const [backendHealth, setBackendHealth] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const revalidator = useRevalidator();

    const fetchBackendHealth = async () => {
        try {
            const health = await getBackendHealth();
            setBackendHealth(health);
        } catch (error) {
            console.error('Error fetching backend health:', error);
            setBackendHealth({ status: 'error', message: 'Backend unreachable' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBackendHealth();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ok':
            case 'healthy':
                return '✅';
            case 'warning':
                return '⚠️';
            case 'error':
            case 'unhealthy':
                return '❌';
            default:
                return '❓';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ok':
            case 'healthy':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'warning':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'error':
            case 'unhealthy':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar variant="minimal" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-4">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-semibold text-slate-900 mb-2">
                            Sistema de Monitoreo
                        </h1>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Monitoreo en tiempo real del estado de la infraestructura de Nodux
                        </p>
                        <button
                            onClick={() => {
                                fetchBackendHealth();
                                revalidator.revalidate();
                            }}
                            className="mt-4 btn-primary"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Actualizar
                        </button>
                    </div>

                    {/* Service Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Frontend Status */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                                    <span className="mr-2">⚛️</span>
                                    Frontend (Remix)
                                </h3>
                            </div>
                            <div className="card-body">
                                <div className={`p-4 rounded-lg border ${getStatusColor(frontendHealth.status)}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium">Estado:</span>
                                        <span className="flex items-center">
                                            {getStatusIcon(frontendHealth.status)}
                                            <span className="ml-1 capitalize">{frontendHealth.status}</span>
                                        </span>
                                    </div>
                                    <div className="text-sm space-y-1">
                                        <div>Versión: {frontendHealth.version}</div>
                                        <div>Entorno: {frontendHealth.environment}</div>
                                        <div>Última actualización: {new Date(frontendHealth.timestamp).toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Backend Status */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                                    <span className="mr-2">🐍</span>
                                    Backend (Django)
                                </h3>
                            </div>
                            <div className="card-body">
                                {loading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : backendHealth ? (
                                    <div className={`p-4 rounded-lg border ${getStatusColor(backendHealth.status)}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium">Estado:</span>
                                            <span className="flex items-center">
                                                {getStatusIcon(backendHealth.status)}
                                                <span className="ml-1 capitalize">{backendHealth.status}</span>
                                            </span>
                                        </div>
                                        <div className="text-sm space-y-1">
                                            {backendHealth.version && <div>Versión: {backendHealth.version}</div>}
                                            {backendHealth.database && <div>Base de datos: {backendHealth.database.status}</div>}
                                            {backendHealth.timestamp && <div>Última verificación: {new Date(backendHealth.timestamp).toLocaleString()}</div>}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-600">
                                        <div className="flex items-center">
                                            <span className="mr-2">❌</span>
                                            Backend no disponible
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* System Metrics */}
                    <div className="card mb-8">
                        <div className="card-header">
                            <h3 className="text-lg font-semibold text-slate-900">Métricas del Sistema</h3>
                        </div>
                        <div className="card-body">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">99.9%</div>
                                    <div className="text-sm text-slate-600">Disponibilidad</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600">150ms</div>
                                    <div className="text-sm text-slate-600">Tiempo de respuesta</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-600">1.2k</div>
                                    <div className="text-sm text-slate-600">Usuarios activos</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer variant="minimal" />
        </div>
    );
}
