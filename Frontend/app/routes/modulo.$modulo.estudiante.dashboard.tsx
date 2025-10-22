import { useState, useEffect } from 'react';
import { Link } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { useAuth } from '~/contexts/AuthContext';
import ProtectedRoute from '~/components/ProtectedRoute';
import StudentLayout from '~/components/Layout/StudentLayout';
import { StudentService } from '~/services/academicService';
import type { Group } from '~/types/academic';

export const meta: MetaFunction = () => {
    return [
        { title: `Dashboard Estudiante - Nodux` },
        {
            name: "description",
            content: `Panel de control para estudiantes de Nodux`,
        },
    ];
};

export default function StudentDashboard() {
    const { user } = useAuth();
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentData = async () => {
            setLoading(true);

            try {
                // Asumimos que el id del estudiante es "1" para propósitos de demo
                const studentId = "1";

                // Corregido para usar StudentService.getStudentGroups
                const studentGroups = await StudentService.getStudentGroups(studentId);
                setGroups(studentGroups);
            } catch (error) {
                console.error('Error al cargar datos del estudiante:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, []);

    // Datos simulados para tareas pendientes
    const pendingTasks = [
        { id: '1', title: 'Entrega de prototipo', dueDate: '2023-06-25', project: 'Plataforma E-learning', priority: 'alta' },
        { id: '2', title: 'Documentación de API', dueDate: '2023-06-22', project: 'App Móvil de Finanzas', priority: 'media' },
        { id: '3', title: 'Revisión de código', dueDate: '2023-06-20', project: 'Plataforma E-learning', priority: 'baja' },
    ];

    // Próximas clases simuladas
    const upcomingClasses = [
        { id: '1', title: 'Desarrollo Frontend', date: '2023-06-20T15:00:00', mentor: 'Juan Pérez', location: 'Sala Virtual 1' },
        { id: '2', title: 'Taller de UX/UI', date: '2023-06-21T10:00:00', mentor: 'María García', location: 'Sala Virtual 2' },
        { id: '3', title: 'Revisión de proyecto', date: '2023-06-22T14:00:00', mentor: 'Juan Pérez', location: 'Sala Virtual 3' },
    ];

    // Recursos recientes
    const recentResources = [
        { id: '1', title: 'Guía de React Hooks', type: 'PDF', uploadedBy: 'Juan Pérez', date: '2023-06-15' },
        { id: '2', title: 'Plantillas de UI', type: 'ZIP', uploadedBy: 'María García', date: '2023-06-14' },
        { id: '3', title: 'Tutorial API REST', type: 'Video', uploadedBy: 'Carlos Rodríguez', date: '2023-06-13' },
    ];

    const getPriorityClass = (priority: string) => {
        switch (priority) {
            case 'alta':
                return 'bg-red-100 text-red-800';
            case 'media':
                return 'bg-yellow-100 text-yellow-800';
            case 'baja':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getResourceTypeIcon = (type: string) => {
        switch (type) {
            case 'PDF':
                return '📄';
            case 'ZIP':
                return '🗄️';
            case 'Video':
                return '🎥';
            case 'Link':
                return '🔗';
            default:
                return '📁';
        }
    };

    return (
        <ProtectedRoute allowedRoles={['Estudiante']}>
            <StudentLayout title="Dashboard de Estudiante">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        {/* Bienvenida */}
                        <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
                            <div className="px-4 py-5 sm:p-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Bienvenido, {user?.name?.split(' ')[0] || 'Estudiante'}
                                </h2>
                                <p className="mt-1 text-gray-600">
                                    Estás inscrito en {groups.length} {groups.length === 1 ? 'grupo' : 'grupos'}.
                                    Aquí puedes ver un resumen de tus actividades y tareas pendientes.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
                            {/* Próximas clases */}
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6 bg-blue-50">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Próximas clases
                                    </h3>
                                </div>
                                <ul className="divide-y divide-gray-200">
                                    {upcomingClasses.map(cls => (
                                        <li key={cls.id} className="px-4 py-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {cls.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(cls.date).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {cls.location}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Recursos recientes */}
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6 bg-blue-50">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Recursos recientes
                                    </h3>
                                </div>
                                <ul className="divide-y divide-gray-200">
                                    {recentResources.map(resource => (
                                        <li key={resource.id} className="px-4 py-4 flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {resource.title}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {resource.uploadedBy} - {new Date(resource.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="ml-4 flex-shrink-0">
                                                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-800">
                                                    {getResourceTypeIcon(resource.type)}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Mis grupos */}
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                            <div className="px-4 py-5 sm:px-6 bg-blue-50">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Mis grupos
                                </h3>
                            </div>
                            {groups.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                                    {groups.map(group => (
                                        <div key={group.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <h4 className="font-medium text-gray-900">{group.name}</h4>
                                            <p className="text-sm text-gray-500 mt-1">{group.projectName}</p>
                                            <div className="mt-3 text-sm">
                                                <span className="text-gray-600">Mentor:</span> {group.mentorName}
                                            </div>
                                            <div className="mt-3 text-sm text-gray-500">
                                                {group.students.length} estudiantes
                                            </div>
                                            <div className="mt-4 text-right">
                                                <Link
                                                    to={`/modulo/academico/estudiante/groups/${group.id}`}
                                                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                                >
                                                    Ver detalles
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-4 py-5 text-center text-sm text-gray-500">
                                    No estás inscrito en ningún grupo actualmente.
                                </div>
                            )}
                        </div>

                        {/* Tareas pendientes */}
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                            <div className="px-4 py-5 sm:px-6 bg-blue-50">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Tareas pendientes
                                </h3>
                            </div>
                            <div className="p-4">
                                {pendingTasks.length === 0 ? (
                                    <p className="text-center text-sm text-gray-500">
                                        No tienes tareas pendientes.
                                    </p>
                                ) : (
                                    <ul className="space-y-4">
                                        {pendingTasks.map(task => (
                                            <li key={task.id} className="bg-gray-50 p-4 rounded-lg shadow">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {task.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {task.project} - {new Date(task.dueDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="ml-4 flex-shrink-0">
                                                        <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${getPriorityClass(task.priority)}`}>
                                                            {task.priority.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </StudentLayout>
        </ProtectedRoute>
    );
}