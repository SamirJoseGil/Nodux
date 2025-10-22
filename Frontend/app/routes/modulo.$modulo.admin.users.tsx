import { useState, useEffect } from 'react';
import { useParams } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import AdminLayout from '~/components/Layout/AdminLayout';
import ProtectedRoute from '~/components/ProtectedRoute';
import { AuthService } from '~/services/authService';
import type { User } from '~/types/auth';

export const meta: MetaFunction = ({ params }) => {
    const moduleName = params.modulo ?
        params.modulo.charAt(0).toUpperCase() + params.modulo.slice(1) :
        'Módulo';

    return [
        { title: `Administración de Usuarios - ${moduleName} - Nodux` },
        {
            name: "description",
            content: `Gestiona usuarios en el módulo ${moduleName}`,
        },
    ];
};

export default function UsersAdmin() {
    const { modulo } = useParams();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);

            try {
                const usersData = await AuthService.getUsers();
                setUsers(usersData);
            } catch (err) {
                setError('Error al cargar los usuarios. Inténtalo de nuevo más tarde.');
                console.error('Error loading users:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [modulo]);

    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await AuthService.updateUserRole(userId, newRole as any);

            setUsers(users.map(user =>
                user.id === userId ? { ...user, role: newRole as any } : user
            ));

            if (selectedUser && selectedUser.id === userId) {
                setSelectedUser({ ...selectedUser, role: newRole as any });
            }
        } catch (err) {
            console.error('Error updating user role:', err);
            alert('Error al actualizar el rol del usuario');
        }
    };

    const handleStatusChange = async (userId: string, active: boolean) => {
        try {
            await AuthService.updateUserStatus(userId, active);

            setUsers(users.map(user =>
                user.id === userId ? { ...user, active } : user
            ));

            if (selectedUser && selectedUser.id === userId) {
                setSelectedUser({ ...selectedUser, active });
            }
        } catch (err) {
            console.error('Error updating user status:', err);
            alert('Error al actualizar el estado del usuario');
        }
    };

    const updateUserField = (field: string, value: string) => {
        if (!selectedUser) return;

        if (field === 'name') {
            const updatedUser: User = {
                ...selectedUser,
                name: value
            };
            setSelectedUser(updatedUser);
        }
        else if (field === 'email') {
            const updatedUser: User = {
                ...selectedUser,
                email: value
            };
            setSelectedUser(updatedUser);
        }
    };

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <AdminLayout title="Administración de Usuarios">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Lista de usuarios */}
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            {error && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-400 text-red-700 rounded">
                                    {error}
                                </div>
                            )}

                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Usuarios
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Aquí puedes gestionar los usuarios de la plataforma.
                                </p>
                            </div>

                            <div className="border-t border-gray-200">
                                <dl>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Nombre
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            {selectedUser?.name}
                                        </dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Correo electrónico
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            {selectedUser?.email}
                                        </dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Rol
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            {selectedUser?.role}
                                        </dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Estado
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            {selectedUser?.active ? 'Activo' : 'Inactivo'}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            <div className="px-4 py-3 text-right sm:px-6">
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Nuevo Usuario
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Panel de detalle/edición */}
                    <div className="lg:col-span-1">
                        {selectedUser ? (
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                                        Detalles del Usuario
                                    </h3>
                                </div>
                                <div className="border-t border-gray-200">
                                    <dl>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Nombre
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                <input
                                                    type="text"
                                                    value={selectedUser.name}
                                                    onChange={(e) =>
                                                        updateUserField('name', e.target.value)
                                                    }
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                            </dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Correo electrónico
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                <input
                                                    type="email"
                                                    value={selectedUser.email}
                                                    onChange={(e) =>
                                                        updateUserField('email', e.target.value)
                                                    }
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                            </dd>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Rol
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                <select
                                                    value={selectedUser.role}
                                                    onChange={(e) =>
                                                        handleRoleChange(selectedUser.id, e.target.value)
                                                    }
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                >
                                                    <option value="Admin">Admin</option>
                                                    <option value="User">User</option>
                                                    <option value="SuperAdmin">SuperAdmin</option>
                                                </select>
                                            </dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Estado
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                <button
                                                    onClick={() =>
                                                        handleStatusChange(selectedUser.id, !selectedUser.active)
                                                    }
                                                    className={`px-3 py-1 rounded-md text-sm font-medium ${selectedUser.active
                                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                                            : 'bg-green-600 text-white hover:bg-green-700'
                                                        }`}
                                                >
                                                    {selectedUser.active ? 'Desactivar' : 'Activar'}
                                                </button>
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div className="px-4 py-3 text-right sm:px-6">
                                    <button
                                        onClick={() => setSelectedUser(null)}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700"
                                    >
                                        Guardar Cambios
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
                                <p className="text-gray-500">Selecciona un usuario para ver sus detalles</p>
                            </div>
                        )}
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}