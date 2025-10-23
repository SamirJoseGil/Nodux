import { useState, useEffect } from 'react';
import { Link } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { useAuth } from '~/contexts/AuthContext';
import ProtectedRoute from '~/components/ProtectedRoute';
import SystemAdminLayout from '~/components/Layout/SystemAdminLayout';
import { AdminService } from '~/services/adminService';

export const meta: MetaFunction = () => {
    return [
        { title: `Panel de Administración del Sistema - Nodux` },
        {
            name: "description",
            content: `Panel de administración del sistema Nodux`,
        },
    ];
};

export default function SystemAdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const data = await AdminService.getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error('Error al cargar estadísticas:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <SystemAdminLayout title="Panel de Administración del Sistema">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                    </div>
                ) : stats ? (
                    <>
                        {/* Estadísticas del sistema */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                            {/* Usuarios totales */}
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                            <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">Usuarios Totales</dt>
                                                <dd className="flex items-baseline">
                                                    <div className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</div>
                                                    <div className="ml-2 text-sm font-semibold text-green-600">
                                                        +{stats.newUsersThisWeek}
                                                    </div>
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-5 py-3">
                                    <div className="text-sm">
                                        <Link to="/modulo/administracion/users" className="font-medium text-blue-600 hover:text-blue-500">Ver todos los usuarios</Link>
                                    </div>
                                </div>
                            </div>

                            {/* Usuarios activos */}
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">Usuarios Activos</dt>
                                                <dd className="flex items-baseline">
                                                    <div className="text-2xl font-semibold text-gray-900">{stats.activeUsers}</div>
                                                    <div className="ml-2 text-sm font-semibold text-green-600">
                                                        {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
                                                    </div>
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-5 py-3">
                                    <div className="text-sm">
                                        <Link to="/modulo/administracion/users?filter=active" className="font-medium text-blue-600 hover:text-blue-500">Ver usuarios activos</Link>
                                    </div>
                                </div>
                            </div>

                            {/* Roles */}
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                                            <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">Roles del Sistema</dt>
                                                <dd className="flex items-baseline">
                                                    <div className="text-2xl font-semibold text-gray-900">{stats.totalRoles}</div>
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-5 py-3">
                                    <div className="text-sm">
                                        <Link to="/modulo/administracion/roles" className="font-medium text-blue-600 hover:text-blue-500">Gestionar roles</Link>
                                    </div>
                                </div>
                            </div>

                            {/* Módulos */}
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                                            <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">Módulos del Sistema</dt>
                                                <dd className="flex items-baseline">
                                                    <div className="text-2xl font-semibold text-gray-900">{stats.totalModules}</div>
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-5 py-3">
                                    <div className="text-sm">
                                        <Link to="/selector-modulo" className="font-medium text-blue-600 hover:text-blue-500">Cambiar de módulo</Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Salud del sistema */}
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                            <div className="px-4 py-5 sm:px-6 bg-gray-50">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Salud del Sistema</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
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
                                                className={`h-2.5 rounded-full ${stats.systemHealth.cpu > 80 ? 'bg-red-500' : stats.systemHealth.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
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
                                                className={`h-2.5 rounded-full ${stats.systemHealth.memory > 80 ? 'bg-red-500' : stats.systemHealth.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
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
                                                className={`h-2.5 rounded-full ${stats.systemHealth.storage > 80 ? 'bg-red-500' : stats.systemHealth.storage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                                style={{ width: `${stats.systemHealth.storage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-gray-200">
                                <div className="px-4 py-3 bg-gray-50 text-right">
                                    <Link to="/healthcheck" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                        Ver diagnóstico completo
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Actividad reciente */}
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6 bg-gray-50">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Actividad reciente</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Últimas acciones realizadas en el sistema
                                </p>
                            </div>
                            <div className="border-t border-gray-200">
                                <ul className="divide-y divide-gray-200">
                                    {stats.activityLogs.map((log: any) => (
                                        <li key={log.id} className="px-4 py-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {log.action}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
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
                                <div className="px-4 py-3 bg-gray-50 text-right">
                                    <Link to="/modulo/administracion/logs" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                        Ver todos los logs
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
                        <p className="text-gray-500">No se pudieron cargar las estadísticas del sistema.</p>
                    </div>
                )}
            </SystemAdminLayout>
        </ProtectedRoute>
    );
}
