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
                        <div className="card">
                            {error && (
                                <div className="m-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="card-header">
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Usuarios del Sistema
                                </h3>
                                <p className="text-sm text-slate-600 mt-1">
                                    Gestiona los usuarios registrados en la plataforma
                                </p>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <div className="card-body">
                                    <div className="grid gap-4">
                                        {users.map((user) => (
                                            <div
                                                key={user.id}
                                                onClick={() => handleUserSelect(user)}
                                                className={`p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${selectedUser?.id === user.id ? 'border-blue-500 bg-blue-50' : ''}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="text-sm font-medium text-slate-900">{user.name}</h4>
                                                        <p className="text-sm text-slate-600">{user.email}</p>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="badge badge-info">{user.role}</span>
                                                        <span className={`badge ${user.active ? 'badge-success' : 'badge-error'}`}>
                                                            {user.active ? 'Activo' : 'Inactivo'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="card-footer">
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="btn-primary"
                                >
                                    Nuevo Usuario
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Panel de detalle/edición */}
                    <div className="lg:col-span-1">
                        {selectedUser ? (
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        Detalles del Usuario
                                    </h3>
                                </div>
                                <div className="card-body space-y-4">
                                    <div>
                                        <label className="form-label">Nombre</label>
                                        <input
                                            type="text"
                                            value={selectedUser.name}
                                            onChange={(e) =>
                                                updateUserField('name', e.target.value)
                                            }
                                            className="form-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Correo electrónico</label>
                                        <input
                                            type="email"
                                            value={selectedUser.email}
                                            onChange={(e) =>
                                                updateUserField('email', e.target.value)
                                            }
                                            className="form-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Rol</label>
                                        <select
                                            value={selectedUser.role}
                                            onChange={(e) =>
                                                handleRoleChange(selectedUser.id, e.target.value)
                                            }
                                            className="form-input"
                                        >
                                            <option value="Admin">Admin</option>
                                            <option value="User">User</option>
                                            <option value="SuperAdmin">SuperAdmin</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Estado</label>
                                        <div className="mt-2">
                                            <button
                                                onClick={() =>
                                                    handleStatusChange(selectedUser.id, !selectedUser.active)
                                                }
                                                className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedUser.active
                                                    ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    } transition-colors`}
                                            >
                                                {selectedUser.active ? 'Desactivar' : 'Activar'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <button
                                        onClick={() => setSelectedUser(null)}
                                        className="btn-primary w-full"
                                    >
                                        Guardar Cambios
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="card p-6 text-center">
                                <p className="text-slate-600">Selecciona un usuario para ver sus detalles</p>
                            </div>
                        )}
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}