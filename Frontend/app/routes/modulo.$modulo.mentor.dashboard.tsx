import { useState, useEffect } from 'react';
import { Link } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { useAuth } from '~/contexts/AuthContext';
import ProtectedRoute from '~/components/ProtectedRoute';
import MentorLayout from '~/components/Layout/MentorLayout';
import { MentorService, ProjectService, HourService } from '~/services/academicService';
import type { Project, Group, HourRecord } from '~/types/academic';

export const meta: MetaFunction = () => {
    return [
        { title: `Dashboard Mentor - Nodux` },
        {
            name: "description",
            content: `Panel de control para mentores de Nodux`,
        },
    ];
};

export default function MentorDashboard() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [hours, setHours] = useState<HourRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMentorData = async () => {
            setLoading(true);

            try {
                const mentorId = "1"; // ID del mentor para demo
                const userId = user?.id || "1"; // ID del usuario para demo

                const [mentorProjects, mentorGroups, mentorHours] = await Promise.all([
                    MentorService.getProjectsByUser(userId),
                    MentorService.getGroupsByMentor(userId),
                    HourService.getHourRecords()
                ]);

                setProjects(mentorProjects);
                setGroups(mentorGroups);
                setHours(mentorHours);
            } catch (error) {
                console.error('Error al cargar datos del mentor:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMentorData();
    }, [user?.id]);

    // Cálculos para estadísticas
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const totalStudents = groups.reduce((sum, group) => sum + group.students.length, 0);
    const totalHours = hours.reduce((sum, hour) => sum + hour.hours, 0);
    const pendingHours = hours.filter(h => h.status === 'pending').length;

    // Obtener las próximas sesiones (simulado)
    const upcomingSessions = [
        { id: '1', name: 'Sesión Frontend', group: 'Grupo Frontend', date: '2023-06-20T15:00:00', location: 'Sala Virtual 1' },
        { id: '2', name: 'Revisión de código', group: 'Grupo App', date: '2023-06-21T10:00:00', location: 'Sala Virtual 3' },
        { id: '3', name: 'Tutoría individual', group: 'Estudiante: Ana Martínez', date: '2023-06-22T14:00:00', location: 'Sala Virtual 2' },
    ];

    return (
        <ProtectedRoute allowedRoles={['Mentor']}>
            <MentorLayout title="Dashboard de Mentor">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <>
                        {/* Estadísticas rápidas */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Proyectos Activos
                                                </dt>
                                                <dd className="flex items-baseline">
                                                    <div className="text-2xl font-semibold text-gray-900">
                                                        {projects.length}
                                                    </div>
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Grupos Asignados
                                                </dt>
                                                <dd className="flex items-baseline">
                                                    <div className="text-2xl font-semibold text-gray-900">
                                                        {groups.length}
                                                    </div>
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Horas Registradas
                                                </dt>
                                                <dd className="flex items-baseline">
                                                    <div className="text-2xl font-semibold text-gray-900">
                                                        {hours.length}
                                                    </div>
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
                            {/* Próximas sesiones */}
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6 bg-indigo-50">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Próximas sesiones
                                    </h3>
                                </div>
                                <ul className="divide-y divide-gray-200">
                                    {upcomingSessions.map(session => (
                                        <li key={session.id} className="px-4 py-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {session.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {session.group}
                                                    </p>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(session.date).toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="mt-2 text-sm text-gray-500">
                                                Ubicación: {session.location}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="px-4 py-3 bg-gray-50 text-right">
                                    <Link
                                        to="/modulo/academico/mentor/calendar"
                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        Ver calendario completo
                                    </Link>
                                </div>
                            </div>

                            {/* Proyectos recientes */}
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6 bg-indigo-50">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Mis proyectos
                                    </h3>
                                </div>
                                {projects.length > 0 ? (
                                    <ul className="divide-y divide-gray-200">
                                        {projects.slice(0, 3).map(project => (
                                            <li key={project.id} className="px-4 py-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {project.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500 truncate max-w-xs">
                                                            {project.description}
                                                        </p>
                                                    </div>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.status === 'active' ? 'bg-green-100 text-green-800' :
                                                        project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {project.status === 'active' ? 'Activo' :
                                                            project.status === 'completed' ? 'Completado' :
                                                                project.status === 'cancelled' ? 'Cancelado' : 'Pendiente'}
                                                    </span>
                                                </div>
                                                {project.startDate && (
                                                    <div className="mt-1 text-xs text-gray-500">
                                                        Inicio: {new Date(project.startDate).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="px-4 py-5 text-center text-sm text-gray-500">
                                        No tienes proyectos asignados actualmente.
                                    </div>
                                )}
                                <div className="px-4 py-3 bg-gray-50 text-right">
                                    <Link
                                        to="/modulo/academico/mentor/projects"
                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        Ver todos los proyectos
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Grupos recientes */}
                        <div className="mt-8 bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Grupos Recientes
                                </h3>
                            </div>
                            <div className="px-4 py-5 sm:p-6">
                                <ul className="divide-y divide-gray-200">
                                    {groups.map((group) => (
                                        <li key={group.id} className="py-4">
                                            <div className="flex space-x-3">
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-sm font-medium text-gray-900">
                                                            {group.name}
                                                        </h3>
                                                        <p className="text-xs text-gray-500">
                                                            {group.createdAt ? new Date(group.createdAt).toLocaleDateString() : 'Fecha desconocida'}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        {group.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6">
                                    <Link
                                        to="/modulo/academico/mentor/grupos"
                                        className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Ver todos los grupos
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Registro de horas */}
                        <div className="mt-8 bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Registro de Horas
                                </h3>
                            </div>
                            <div className="px-4 py-5 sm:p-6">
                                <ul className="divide-y divide-gray-200">
                                    {hours.map((hour) => (
                                        <li key={hour.id} className="py-4">
                                            <div className="flex space-x-3">
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-sm font-medium text-gray-900">
                                                            {hour.projectName}
                                                        </h3>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(hour.date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        {hour.duration} horas registradas
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6">
                                    <Link
                                        to="/modulo/academico/mentor/registro-horas"
                                        className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Ver registro completo
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </MentorLayout>
        </ProtectedRoute>
    );
}