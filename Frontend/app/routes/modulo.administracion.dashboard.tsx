import { useState, useEffect } from 'react';
import { Link } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { useAuth } from '~/contexts/AuthContext';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import SystemAdminLayout from '~/components/Layout/SystemAdminLayout'; // ← CAMBIO AQUÍ
import { AdminService } from '~/services/adminService';
import { motion } from 'framer-motion';

export const meta: MetaFunction = () => {
    return [
        { title: `Dashboard Administración - Nodux` },
        { name: "description", content: `Panel de administración del sistema` },
    ];
};

export default function AdministracionDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await AdminService.getDashboardStats();
                setStats(data);
            } catch (error: any) {
                console.error('Error al cargar estadísticas:', error);
                setError(error.message || 'Error al cargar estadísticas del sistema');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <SystemAdminLayout title="Dashboard Administración">
                <div className="max-w-7xl mx-auto bg-white min-h-screen -m-6 p-6">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <div className="bg-white p-8 rounded-2xl shadow-xl mb-8">
                            <h1 className="text-4xl font-bold text-zafiro-900 mb-4">
                                Panel de Administración
                            </h1>
                            <p className="text-lg text-zafiro-900/80">
                                Gestiona usuarios, permisos y configuración del sistema
                            </p>
                        </div>
                    </motion.div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                className="text-center"
                            >
                                <svg className="animate-spin h-8 w-8 text-nodux-neon mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className="text-nodux-neon font-inter">Cargando estadísticas del sistema...</p>
                            </motion.div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
                            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-600 font-inter font-bold mb-2">Error al cargar datos</p>
                            <p className="text-red-500 font-inter text-sm">{error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="mt-4 btn-primary"
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : stats ? (
                        <>
                            {/* Estadísticas del sistema */}
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                                {/* Usuarios totales */}
                                <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-nodux-neon to-nodux-marino rounded-lg flex items-center justify-center mr-4">
                                            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <dt className="text-sm font-medium text-gray-600">Usuarios Totales</dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-2xl font-semibold text-zafiro-900">{stats.totalUsers}</div>
                                                <div className="ml-2 text-sm font-semibold text-green-600">
                                                    +{stats.newUsersThisWeek}
                                                </div>
                                            </dd>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <Link to="/modulo/administracion/users" className="text-sm font-medium text-nodux-neon hover:text-nodux-marino transition-colors">
                                            Ver todos los usuarios →
                                        </Link>
                                    </div>
                                </div>

                                {/* Usuarios activos */}
                                <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-nodux-marino to-nodux-amarillo rounded-lg flex items-center justify-center mr-4">
                                            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <dt className="text-sm font-medium text-gray-600">Usuarios Activos</dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-2xl font-semibold text-zafiro-900">{stats.activeUsers}</div>
                                                <div className="ml-2 text-sm font-semibold text-green-600">
                                                    {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
                                                </div>
                                            </dd>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <Link to="/modulo/administracion/users?filter=active" className="text-sm font-medium text-nodux-neon hover:text-nodux-marino transition-colors">
                                            Ver usuarios activos →
                                        </Link>
                                    </div>
                                </div>

                                {/* Roles */}
                                <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-nodux-amarillo to-nodux-naranja rounded-lg flex items-center justify-center mr-4">
                                            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <dt className="text-sm font-medium text-gray-600">Roles del Sistema</dt>
                                            <dd className="text-2xl font-semibold text-zafiro-900">{stats.totalRoles}</dd>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <Link to="/modulo/administracion/roles" className="text-sm font-medium text-nodux-neon hover:text-nodux-marino transition-colors">
                                            Gestionar roles →
                                        </Link>
                                    </div>
                                </div>

                                {/* Módulos */}
                                <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-nodux-neon to-nodux-marino rounded-lg flex items-center justify-center mr-4">
                                            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <dt className="text-sm font-medium text-gray-600">Módulos del Sistema</dt>
                                            <dd className="text-2xl font-semibold text-zafiro-900">{stats.totalModules}</dd>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <Link to="/selector-modulo" className="text-sm font-medium text-nodux-neon hover:text-nodux-marino transition-colors">
                                            Cambiar de módulo →
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Salud del sistema */}
                            <div className="bg-white border-2 border-gray-200 shadow-lg rounded-2xl mb-8">
                                <div className="px-6 py-5 border-b border-gray-200">
                                    <h3 className="text-lg leading-6 font-medium text-zafiro-900">Salud del Sistema</h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-600">
                                        Monitoreo de recursos del servidor
                                    </p>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* CPU */}
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-700">CPU</span>
                                                <span className="text-sm font-medium text-gray-700">{stats.systemHealth.cpu}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className={`h-2.5 rounded-full ${stats.systemHealth.cpu > 80 ? 'bg-nodux-naranja' : stats.systemHealth.cpu > 60 ? 'bg-nodux-amarillo' : 'bg-nodux-marino'}`}
                                                    style={{ width: `${stats.systemHealth.cpu}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Memoria */}
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-700">Memoria</span>
                                                <span className="text-sm font-medium text-gray-700">{stats.systemHealth.memory}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className={`h-2.5 rounded-full ${stats.systemHealth.memory > 80 ? 'bg-nodux-naranja' : stats.systemHealth.memory > 60 ? 'bg-nodux-amarillo' : 'bg-nodux-marino'}`}
                                                    style={{ width: `${stats.systemHealth.memory}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Almacenamiento */}
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-700">Almacenamiento</span>
                                                <span className="text-sm font-medium text-gray-700">{stats.systemHealth.storage}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className={`h-2.5 rounded-full ${stats.systemHealth.storage > 80 ? 'bg-nodux-naranja' : stats.systemHealth.storage > 60 ? 'bg-nodux-amarillo' : 'bg-nodux-marino'}`}
                                                    style={{ width: `${stats.systemHealth.storage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t border-gray-200">
                                    <div className="px-4 py-3 text-right">
                                        <Link to="/healthcheck" className="text-sm font-medium text-nodux-neon hover:text-nodux-marino transition-colors">
                                            Ver diagnóstico completo →
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Actividad reciente */}
                            <div className="bg-white border-2 border-gray-200 shadow-lg rounded-2xl">
                                <div className="px-6 py-5 border-b border-gray-200">
                                    <h3 className="text-lg leading-6 font-medium text-zafiro-900">Actividad reciente</h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-600">
                                        Últimas acciones realizadas en el sistema
                                    </p>
                                </div>
                                <div className="border-t border-gray-200">
                                    <ul className="divide-y divide-gray-200">
                                        {stats.activityLogs.map((log: any) => (
                                            <li key={log.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-zafiro-900">
                                                            {log.action}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-medium">{log.user}</span> • {log.target}
                                                        </p>
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(log.timestamp).toLocaleString()}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="border-t border-gray-200">
                                    <div className="px-4 py-3 text-right">
                                        <Link to="/modulo/administracion/logs" className="text-sm font-medium text-nodux-neon hover:text-nodux-marino transition-colors">
                                            Ver todos los logs →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            </SystemAdminLayout>
        </ProtectedRoute>
    );
}
