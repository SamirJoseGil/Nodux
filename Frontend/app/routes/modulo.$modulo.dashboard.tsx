import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { useAuth } from '~/contexts/AuthContext';
import { useModule } from '~/contexts/ModuleContext';
import { decodeParam } from '~/utils/navigation';
import ProtectedRoute from '~/components/ProtectedRoute';
import AdminLayout from '~/components/Layout/AdminLayout';

export const meta: MetaFunction = ({ params }) => {
    const moduloName = params.modulo ?
        decodeParam(params.modulo).charAt(0).toUpperCase() + decodeParam(params.modulo).slice(1) :
        'Módulo';

    return [
        { title: `Dashboard ${moduloName} - Nodux` },
        {
            name: "description",
            content: `Dashboard del módulo ${moduloName} de Nodux`,
        },
    ];
};

export default function ModuloDashboard() {
    const { modulo } = useParams();
    const { user } = useAuth();
    const { activeModule } = useModule();
    const navigate = useNavigate();
    const location = useLocation();
    const hasRedirected = useRef(false); // Usar ref para evitar re-renderizados

    const decodedModulo = decodeParam(modulo);

    // Efecto para redireccionar según el rol - solo una vez
    useEffect(() => {
        if (user && !hasRedirected.current) {
            console.log(`ModuloDashboard: Verificando rol del usuario: ${user.role} para módulo ${decodedModulo}`);

            if (user.role === 'Mentor') {
                console.log('ModuloDashboard: Redireccionando a dashboard de mentor');
                hasRedirected.current = true;
                navigate(`/modulo/${decodedModulo}/mentor/dashboard`, { replace: true });
            } else if (user.role === 'Estudiante') {
                console.log('ModuloDashboard: Redireccionando a dashboard de estudiante');
                hasRedirected.current = true;
                navigate(`/modulo/${decodedModulo}/estudiante/dashboard`, { replace: true });
            }
        }
    }, [user, decodedModulo, navigate]);

    // Log para depuración
    console.log(`ModuloDashboard renderizado: ${location.pathname}, módulo: ${decodedModulo}, activeModule: ${activeModule}`);

    // Datos de ejemplo para el dashboard
    const stats = [
        { name: 'Proyectos Activos', value: '24', icon: '📝' },
        { name: 'Total Mentores', value: '12', icon: '👨‍🏫' },
        { name: 'Total Horas', value: '245', icon: '⏱️' },
        { name: 'Grupos', value: '8', icon: '👥' },
    ];

    const recentActivities = [
        { id: 1, user: 'María García', action: 'registró 5 horas en', target: 'Proyecto Alpha', date: '2023-06-15T14:32:00Z' },
        { id: 2, user: 'Juan Pérez', action: 'creó un nuevo grupo en', target: 'Proyecto Beta', date: '2023-06-15T12:15:00Z' },
        { id: 3, user: 'Carlos López', action: 'fue asignado como mentor de', target: 'Grupo A', date: '2023-06-14T10:45:00Z' },
        { id: 4, user: 'Ana Martínez', action: 'completó el hito 2 de', target: 'Proyecto Gamma', date: '2023-06-14T09:20:00Z' },
        { id: 5, user: 'Roberto Sánchez', action: 'subió un nuevo documento a', target: 'Proyecto Alpha', date: '2023-06-13T16:10:00Z' },
    ];

    const upcomingEvents = [
        { id: 1, title: 'Reunión semanal de mentores', date: '2023-06-16T10:00:00Z', location: 'Sala virtual 1' },
        { id: 2, title: 'Entrega de avance Proyecto Alpha', date: '2023-06-17T15:00:00Z', location: 'Plataforma' },
        { id: 3, title: 'Capacitación nuevas herramientas', date: '2023-06-20T09:00:00Z', location: 'Sala de conferencias' },
    ];

    // Este componente solo será visible para Admin y SuperAdmin
    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <AdminLayout title={`Dashboard ${decodedModulo ? decodedModulo.charAt(0).toUpperCase() + decodedModulo.slice(1) : ''}`}>
                {/* Estadísticas */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                    {stats.map((stat) => (
                        <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 text-3xl">
                                        {stat.icon}
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                {stat.name}
                                            </dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-2xl font-semibold text-gray-900">
                                                    {stat.value}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Accesos rápidos */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Actividad reciente */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6 bg-indigo-50">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Actividad reciente</h3>
                        </div>
                        <div className="px-4 py-5 sm:p-6">
                            <ul className="divide-y divide-gray-200">
                                {recentActivities.map((activity) => (
                                    <li key={activity.id} className="py-4">
                                        <div className="flex space-x-3">
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-sm font-medium">{activity.user}</h3>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(activity.date).toLocaleDateString()} {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {activity.action} <span className="font-medium text-indigo-600">{activity.target}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6">
                                <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                    Ver todo
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Próximos eventos */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6 bg-green-50">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Próximos eventos</h3>
                        </div>
                        <div className="px-4 py-5 sm:p-6">
                            <ul className="divide-y divide-gray-200">
                                {upcomingEvents.map((event) => (
                                    <li key={event.id} className="py-4">
                                        <div className="flex space-x-3">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">{event.title}</p>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-500">{event.location}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6">
                                <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                    Ver calendario
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Acceso rápido */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6 bg-blue-50">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Acceso rápido</h3>
                        </div>
                        <div className="px-4 py-5 sm:p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <a href={`/modulo/${modulo}/admin/projects`} className="px-4 py-6 bg-gray-50 shadow-sm rounded-lg text-center hover:bg-gray-100 transition-colors">
                                    <span className="text-2xl">📝</span>
                                    <p className="mt-3 text-sm font-medium text-gray-900">Proyectos</p>
                                </a>
                                <a href={`/modulo/${modulo}/admin/mentors`} className="px-4 py-6 bg-gray-50 shadow-sm rounded-lg text-center hover:bg-gray-100 transition-colors">
                                    <span className="text-2xl">👨‍🏫</span>
                                    <p className="mt-3 text-sm font-medium text-gray-900">Mentores</p>
                                </a>
                                <a href={`/modulo/${modulo}/admin/groups`} className="px-4 py-6 bg-gray-50 shadow-sm rounded-lg text-center hover:bg-gray-100 transition-colors">
                                    <span className="text-2xl">👥</span>
                                    <p className="mt-3 text-sm font-medium text-gray-900">Grupos</p>
                                </a>
                                <a href={`/modulo/${modulo}/admin/hours`} className="px-4 py-6 bg-gray-50 shadow-sm rounded-lg text-center hover:bg-gray-100 transition-colors">
                                    <span className="text-2xl">⏱️</span>
                                    <p className="mt-3 text-sm font-medium text-gray-900">Horas</p>
                                </a>
                            </div>
                            <div className="mt-4 text-center">
                                <a href="/modulo/administracion/dashboard" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                    Ir a administración del sistema
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}