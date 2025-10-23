import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import AdminLayout from '~/components/Layout/AdminLayout';
import ProtectedRoute from '~/components/ProtectedRoute';
import { GroupService } from '~/services/academicService';
import type { Group } from '~/types/academic';
import GroupIcon from "~/components/Icons/GroupIcon";

export const meta: MetaFunction = () => {
    return [
        { title: `Gestión de Grupos - Académico - Nodux` },
        {
            name: "description",
            content: `Gestiona grupos en el módulo académico`,
        },
    ];
};

export default function GroupsAdmin() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

    useEffect(() => {
        const fetchGroups = async () => {
            setLoading(true);
            setError(null);

            try {
                // Simular datos de grupos
                const mockGroups: Group[] = [
                    {
                        id: '1',
                        name: 'Grupo Frontend Alpha',
                        projectId: 'p1',
                        projectName: 'Plataforma E-learning',
                        mentorId: 'm1',
                        mentorName: 'Juan Pérez',
                        description: 'Desarrollo de componentes React para la plataforma educativa',
                        students: [
                            { id: '1', userId: 'u1', name: 'Ana García', email: 'ana@email.com', status: 'active' },
                            { id: '2', userId: 'u2', name: 'Carlos López', email: 'carlos@email.com', status: 'active' },
                            { id: '3', userId: 'u3', name: 'María Rodríguez', email: 'maria@email.com', status: 'active' }
                        ],
                        createdAt: '2024-01-15'
                    },
                    {
                        id: '2',
                        name: 'Grupo Backend Beta',
                        projectId: 'p2',
                        projectName: 'API de Gestión',
                        mentorId: 'm2',
                        mentorName: 'María García',
                        description: 'Desarrollo de servicios backend con Django',
                        students: [
                            { id: '4', userId: 'u4', name: 'Pedro Sánchez', email: 'pedro@email.com', status: 'active' },
                            { id: '5', userId: 'u5', name: 'Laura Martínez', email: 'laura@email.com', status: 'active' }
                        ],
                        createdAt: '2024-01-20'
                    },
                    {
                        id: '3',
                        name: 'Grupo UX/UI Gamma',
                        projectId: 'p3',
                        projectName: 'Rediseño Portal',
                        mentorId: 'm3',
                        mentorName: 'Carlos López',
                        description: 'Diseño de interfaces de usuario modernas',
                        students: [
                            { id: '6', userId: 'u6', name: 'Sofia Chen', email: 'sofia@email.com', status: 'active' },
                            { id: '7', userId: 'u7', name: 'Diego Ruiz', email: 'diego@email.com', status: 'active' },
                            { id: '8', userId: 'u8', name: 'Valeria Torres', email: 'valeria@email.com', status: 'active' },
                            { id: '9', userId: 'u9', name: 'Andrés Vargas', email: 'andres@email.com', status: 'active' }
                        ],
                        createdAt: '2024-02-01'
                    }
                ];

                setGroups(mockGroups);
            } catch (err) {
                setError('Error al cargar los grupos. Inténtalo de nuevo más tarde.');
                console.error('Error loading groups:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const handleGroupSelect = (group: Group) => {
        setSelectedGroup(group);
    };

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <AdminLayout title="Gestión de Grupos">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Lista de grupos */}
                    <div className="lg:col-span-2">
                        <div className="card">
                            <div className="card-header flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Grupos Académicos ({groups.length})
                                </h3>
                                <button type="button" className="btn-primary">
                                    Crear grupo
                                </button>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : error ? (
                                <div className="card-body">
                                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                        {error}
                                    </div>
                                </div>
                            ) : groups.length === 0 ? (
                                <div className="card-body text-center py-12">
                                    <GroupIcon size={48} className="mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-lg font-medium text-slate-900 mb-2">No hay grupos</h3>
                                    <p className="text-slate-600">Comienza creando un nuevo grupo académico.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="table">
                                        <thead className="table-header">
                                            <tr>
                                                <th className="table-header-cell">Nombre del Grupo</th>
                                                <th className="table-header-cell">Proyecto</th>
                                                <th className="table-header-cell">Mentor</th>
                                                <th className="table-header-cell">Estudiantes</th>
                                                <th className="table-header-cell">
                                                    <span className="sr-only">Acciones</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {groups.map((group) => (
                                                <tr
                                                    key={group.id}
                                                    onClick={() => handleGroupSelect(group)}
                                                    className={`table-row cursor-pointer ${selectedGroup?.id === group.id ? 'bg-blue-50' : ''}`}
                                                >
                                                    <td className="table-cell">
                                                        <div className="flex items-center">
                                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                                                <GroupIcon size={20} className="text-blue-600" />
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-slate-900">{group.name}</div>
                                                                <div className="text-xs text-slate-500">ID: {group.id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="table-cell">
                                                        <div className="text-sm text-slate-900">{group.projectName}</div>
                                                    </td>
                                                    <td className="table-cell">
                                                        <div className="text-sm text-slate-900">{group.mentorName}</div>
                                                    </td>
                                                    <td className="table-cell">
                                                        <span className="badge badge-info">
                                                            {group.students.length} {group.students.length === 1 ? 'estudiante' : 'estudiantes'}
                                                        </span>
                                                    </td>
                                                    <td className="table-cell text-right">
                                                        <button
                                                            type="button"
                                                            className="btn-ghost"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleGroupSelect(group);
                                                            }}
                                                        >
                                                            Ver detalles
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Panel de detalle */}
                    <div className="lg:col-span-1">
                        {selectedGroup ? (
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        Detalles del Grupo
                                    </h3>
                                </div>
                                <div className="card-body space-y-4">
                                    <dl>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold">{selectedGroup.name}</dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Proyecto</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedGroup.projectName}</dd>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Mentor</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedGroup.mentorName}</dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500 mb-3">Estudiantes ({selectedGroup.students.length})</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {selectedGroup.students.length > 0 ? (
                                                    <ul className="space-y-2">
                                                        {selectedGroup.students.map((student) => (
                                                            <li key={student.id} className="flex items-center py-2 px-3 bg-gray-50 rounded-lg">
                                                                <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                                                    <span className="text-indigo-800 font-medium text-sm">{student.name.charAt(0)}</span>
                                                                </div>
                                                                <div className="ml-3">
                                                                    <p className="text-sm font-medium text-gray-900">{student.name}</p>
                                                                    <p className="text-xs text-gray-500">{student.email}</p>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-sm text-gray-500 italic">No hay estudiantes asignados</p>
                                                )}
                                            </dd>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Descripción</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedGroup.description}</dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Fecha de creación</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {selectedGroup.createdAt ? new Date(selectedGroup.createdAt).toLocaleDateString() : 'Fecha no disponible'}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div className="card-footer flex gap-2">
                                    <button type="button" className="btn-secondary">
                                        Editar
                                    </button>
                                    <button type="button" className="btn-primary">
                                        Gestionar estudiantes
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="card p-6 text-center">
                                <p className="text-slate-600">Selecciona un grupo para ver sus detalles</p>
                            </div>
                        )}
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
