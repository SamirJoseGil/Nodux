import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import AdminLayout from '~/components/Layout/AdminLayout';
import ProtectedRoute from '~/components/ProtectedRoute';
import { GroupService } from '~/services/academicService';
import type { Group } from '~/types/academic';

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
                const data = await GroupService.getGroups();
                setGroups(data);
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
                        <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg border border-gray-200">
                            <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                                <div>
                                    <h3 className="text-lg leading-6 font-bold text-gray-900">
                                        Grupos Académicos
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600">
                                        {groups.length} {groups.length === 1 ? 'grupo registrado' : 'grupos registrados'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                                >
                                    <span className="mr-2">+</span>
                                    Crear grupo
                                </button>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                </div>
                            ) : error ? (
                                <div className="px-4 py-5 sm:px-6 text-red-500">{error}</div>
                            ) : groups.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay grupos</h3>
                                    <p className="mt-1 text-sm text-gray-500">Comienza creando un nuevo grupo académico.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nombre del Grupo
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Proyecto
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Mentor
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Estudiantes
                                                </th>
                                                <th scope="col" className="relative px-6 py-3">
                                                    <span className="sr-only">Acciones</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {groups.map((group) => (
                                                <tr
                                                    key={group.id}
                                                    onClick={() => handleGroupSelect(group)}
                                                    className={`hover:bg-indigo-50 cursor-pointer transition-colors ${selectedGroup?.id === group.id ? 'bg-indigo-50' : ''}`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
                                                                <span className="text-white font-bold text-lg">👥</span>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{group.name}</div>
                                                                <div className="text-xs text-gray-500">ID: {group.id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{group.projectName}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{group.mentorName}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            {group.students.length} {group.students.length === 1 ? 'estudiante' : 'estudiantes'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            type="button"
                                                            className="text-indigo-600 hover:text-indigo-900 font-medium"
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
                            <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg border border-gray-200">
                                <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                                    <h3 className="text-lg leading-6 font-bold text-gray-900">
                                        Detalles del Grupo
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Información completa del grupo
                                    </p>
                                </div>
                                <div className="border-t border-gray-200">
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
                                    </dl>
                                </div>

                                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-2 border-t border-gray-200">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                                    >
                                        Gestionar estudiantes
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg p-6 text-center border border-gray-200">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <p className="mt-2 text-gray-500">Selecciona un grupo para ver sus detalles</p>
                            </div>
                        )}
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
