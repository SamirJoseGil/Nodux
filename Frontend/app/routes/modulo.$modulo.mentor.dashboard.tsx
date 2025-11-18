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
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        {/* Estadísticas rápidas */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                            <div className="card p-5">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                        <span className="text-2xl">📝</span>
                                    </div>
                                    <div className="flex-1">
                                        <dt className="text-sm font-medium text-slate-600">
                                            Proyectos Activos
                                        </dt>
                                        <dd className="text-2xl font-semibold text-slate-900">
                                            {projects.length}
                                        </dd>
                                    </div>
                                </div>
                            </div>

                            <div className="card p-5">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                        <span className="text-2xl">👥</span>
                                    </div>
                                    <div className="flex-1">
                                        <dt className="text-sm font-medium text-slate-600">
                                            Grupos Asignados
                                        </dt>
                                        <dd className="text-2xl font-semibold text-slate-900">
                                            {groups.length}
                                        </dd>
                                    </div>
                                </div>
                            </div>

                            <div className="card p-5">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                                        <span className="text-2xl">⏱️</span>
                                    </div>
                                    <div className="flex-1">
                                        <dt className="text-sm font-medium text-slate-600">
                                            Horas Registradas
                                        </dt>
                                        <dd className="text-2xl font-semibold text-slate-900">
                                            {hours.length}
                                        </dd>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
                            {/* Próximas sesiones */}
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        Próximas sesiones
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <ul className="space-y-4">
                                        {upcomingSessions.map(session => (
                                            <li key={session.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">
                                                            {session.name}
                                                        </p>
                                                        <p className="text-sm text-slate-600">
                                                            {session.group}
                                                        </p>
                                                    </div>
                                                    <div className="text-sm text-slate-600">
                                                        {new Date(session.date).toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-sm text-slate-600">
                                                    📍 {session.location}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="card-footer">
                                    <Link
                                        to="/modulo/academico/mentor/calendar"
                                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        Ver calendario completo →
                                    </Link>
                                </div>
                            </div>

                            {/* Proyectos recientes */}
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        Mis proyectos
                                    </h3>
                                </div>
                                <div className="card-body">
                                    {projects.length > 0 ? (
                                        <ul className="space-y-4">
                                            {projects.slice(0, 3).map(project => (
                                                <li key={project.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-900">
                                                                {project.name}
                                                            </p>
                                                            <p className="text-sm text-slate-600 truncate max-w-xs">
                                                                {project.description}
                                                            </p>
                                                        </div>
                                                        <span className={`badge ${project.status === 'active' ? 'badge-success' :
                                                            project.status === 'completed' ? 'badge-info' :
                                                                'badge-neutral'
                                                            }`}>
                                                            {project.status === 'active' ? 'Activo' :
                                                                project.status === 'completed' ? 'Completado' :
                                                                    project.status === 'cancelled' ? 'Cancelado' : 'Pendiente'}
                                                        </span>
                                                    </div>
                                                    {project.startDate && (
                                                        <div className="mt-1 text-xs text-slate-600">
                                                            Inicio: {new Date(project.startDate).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-center text-sm text-slate-600 py-8">
                                            No tienes proyectos asignados actualmente.
                                        </div>
                                    )}
                                </div>
                                <div className="card-footer">
                                    <Link
                                        to="/modulo/academico/mentor/projects"
                                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        Ver todos los proyectos →
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Grupos y horas */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Grupos recientes */}
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        Grupos Recientes
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <ul className="space-y-4">
                                        {groups.map((group) => (
                                            <li key={group.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-medium text-slate-900">
                                                        {group.name}
                                                    </h4>
                                                    <p className="text-xs text-slate-600">
                                                        {group.createdAt ? new Date(group.createdAt).toLocaleDateString() : 'Fecha desconocida'}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-slate-600 mt-1">
                                                    {group.description}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="card-footer">
                                    <Link
                                        to="/modulo/academico/mentor/grupos"
                                        className="btn-secondary w-full text-center"
                                    >
                                        Ver todos los grupos
                                    </Link>
                                </div>
                            </div>

                            {/* Registro de horas */}
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        Registro de Horas
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <ul className="space-y-4">
                                        {hours.map((hour) => (
                                            <li key={hour.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-medium text-slate-900">
                                                        {hour.projectName}
                                                    </h4>
                                                    <p className="text-xs text-slate-600">
                                                        {new Date(hour.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-slate-600 mt-1">
                                                    {hour.duration} horas registradas
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="card-footer">
                                    <Link
                                        to="/modulo/academico/mentor/registro-horas"
                                        className="btn-secondary w-full text-center"
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