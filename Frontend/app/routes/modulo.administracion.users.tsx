import { useState, useEffect } from 'react';
import { useSearchParams, Link } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { useAuth } from '~/contexts/AuthContext';
import ProtectedRoute from '~/components/ProtectedRoute';
import SystemAdminLayout from '~/components/Layout/SystemAdminLayout';
import { AdminService } from '~/services/adminService';
import type { User, UserRole } from '~/types/auth';

export const meta: MetaFunction = () => {
    return [
        { title: `Administración de Usuarios - Nodux` },
        {
            name: "description",
            content: `Gestión centralizada de usuarios en el sistema Nodux`,
        },
    ];
};

export default function AdminUsers() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('filter') || 'all');

    // Estado para el formulario de edición
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        role: '',
        active: true
    });

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const data = await AdminService.getUsers();
                setUsers(data);
                setFilteredUsers(data);
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Efecto para aplicar filtros
    useEffect(() => {
        let result = [...users];

        // Filtro por estado (activo/inactivo)
        if (statusFilter === 'active') {
            result = result.filter(user => user.active);
        } else if (statusFilter === 'inactive') {
            result = result.filter(user => !user.active);
        }

        // Filtro por rol
        if (roleFilter !== 'all') {
            result = result.filter(user => user.role === roleFilter);
        }

        // Filtro por término de búsqueda
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(user =>
                user.name.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term)
            );
        }

        setFilteredUsers(result);
    }, [users, searchTerm, roleFilter, statusFilter]);

    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        setEditMode(false);
        setEditForm({
            name: user.name,
            email: user.email,
            role: user.role,
            active: user.active || false
        });
    };

    const handleEditToggle = () => {
        setEditMode(!editMode);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'active') {
            const checkbox = e.target as HTMLInputElement;
            setEditForm({ ...editForm, [name]: checkbox.checked });
        } else {
            setEditForm({ ...editForm, [name]: value });
        }
    };

    const handleSaveChanges = async () => {
        if (!selectedUser) return;

        try {
            const updatedUser = await AdminService.updateUser(selectedUser.id, {
                name: editForm.name,
                email: editForm.email,
                role: editForm.role as UserRole,
                active: editForm.active
            });

            // Actualizar la lista de usuarios
            setUsers(users.map(u => u.id === selectedUser.id ? updatedUser : u));
            setSelectedUser(updatedUser);
            setEditMode(false);

            // Mostrar mensaje de éxito
            alert('Usuario actualizado correctamente');
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            alert('Error al actualizar usuario. Inténtalo de nuevo más tarde.');
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        // Evitar que el usuario elimine su propia cuenta
        if (selectedUser.id === currentUser?.id) {
            alert('No puedes eliminar tu propia cuenta');
            return;
        }

        // Confirmar antes de eliminar
        if (!window.confirm(`¿Estás seguro que deseas eliminar al usuario ${selectedUser.name}?`)) {
            return;
        }

        try {
            await AdminService.deleteUser(selectedUser.id);

            // Actualizar la lista de usuarios
            setUsers(users.filter(u => u.id !== selectedUser.id));
            setSelectedUser(null);

            // Mostrar mensaje de éxito
            alert('Usuario eliminado correctamente');
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            alert('Error al eliminar usuario. Inténtalo de nuevo más tarde.');
        }
    };

    const roleOptions: UserRole[] = ['Admin', 'SuperAdmin', 'Mentor', 'Estudiante', 'Trabajador', 'Usuario base'];

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <SystemAdminLayout title="Administración de Usuarios">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Panel de filtros */}
                    <div className="lg:col-span-3 card">
                        <div className="card-body">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Búsqueda */}
                                <div className="col-span-2">
                                    <label htmlFor="search" className="form-label">Buscar usuario</label>
                                    <input
                                        type="text"
                                        name="search"
                                        id="search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="form-input"
                                        placeholder="Nombre o correo electrónico"
                                    />
                                </div>

                                {/* Filtro por rol */}
                                <div>
                                    <label htmlFor="role-filter" className="form-label">Filtrar por rol</label>
                                    <select
                                        id="role-filter"
                                        name="role-filter"
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                        className="form-input"
                                    >
                                        <option value="all">Todos los roles</option>
                                        {roleOptions.map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Filtro por estado */}
                                <div>
                                    <label htmlFor="status-filter" className="form-label">Filtrar por estado</label>
                                    <select
                                        id="status-filter"
                                        name="status-filter"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="form-input"
                                    >
                                        <option value="all">Todos los estados</option>
                                        <option value="active">Activos</option>
                                        <option value="inactive">Inactivos</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lista de usuarios */}
                    <div className="lg:col-span-2">
                        <div className="card">
                            <div className="card-header flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Usuarios ({filteredUsers.length})
                                </h3>
                                <button type="button" className="btn-primary">
                                    Crear usuario
                                </button>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                                </div>
                            ) : filteredUsers.length === 0 ? (
                                <div className="card-body text-center text-slate-500">
                                    No se encontraron usuarios que coincidan con los criterios de búsqueda.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="table">
                                        <thead className="table-header">
                                            <tr>
                                                <th className="table-header-cell">Usuario</th>
                                                <th className="table-header-cell">Rol</th>
                                                <th className="table-header-cell">Estado</th>
                                                <th className="table-header-cell">
                                                    <span className="sr-only">Acciones</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredUsers.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    onClick={() => handleSelectUser(user)}
                                                    className={`table-row cursor-pointer ${selectedUser?.id === user.id ? 'bg-gray-50' : ''}`}
                                                >
                                                    <td className="table-cell">
                                                        <div className="flex items-center">
                                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                                <span className="text-slate-700 font-medium">{user.name.charAt(0)}</span>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-slate-900">{user.name}</div>
                                                                <div className="text-sm text-slate-500">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="table-cell">
                                                        <span className={`badge ${user.role === 'Admin' ? 'badge-info' :
                                                            user.role === 'SuperAdmin' ? 'badge-error' :
                                                                user.role === 'Mentor' ? 'badge-warning' :
                                                                    user.role === 'Estudiante' ? 'badge-success' :
                                                                        'badge-neutral'
                                                            }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="table-cell">
                                                        <span className={`badge ${user.active ? 'badge-success' : 'badge-error'}`}>
                                                            {user.active ? 'Activo' : 'Inactivo'}
                                                        </span>
                                                    </td>
                                                    <td className="table-cell text-right">
                                                        <button
                                                            type="button"
                                                            className="btn-ghost"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleSelectUser(user);
                                                            }}
                                                        >
                                                            Ver
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

                    {/* Panel de detalle/edición */}
                    <div className="lg:col-span-1">
                        {selectedUser ? (
                            <div className="card">
                                <div className="card-header flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        Detalles del Usuario
                                    </h3>
                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={handleEditToggle}
                                            className="btn-secondary"
                                        >
                                            {editMode ? 'Cancelar' : 'Editar'}
                                        </button>
                                        {editMode && (
                                            <button
                                                type="button"
                                                onClick={handleSaveChanges}
                                                className="btn-primary"
                                            >
                                                Guardar
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="card-body space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="form-label">Nombre completo</label>
                                            {editMode ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={editForm.name}
                                                    onChange={handleInputChange}
                                                    className="form-input"
                                                />
                                            ) : (
                                                <div className="text-sm text-slate-900">{selectedUser.name}</div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="form-label">Correo electrónico</label>
                                            {editMode ? (
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={editForm.email}
                                                    onChange={handleInputChange}
                                                    className="form-input"
                                                />
                                            ) : (
                                                <div className="text-sm text-slate-900">{selectedUser.email}</div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="form-label">Rol</label>
                                            {editMode ? (
                                                <select
                                                    name="role"
                                                    value={editForm.role}
                                                    onChange={handleInputChange}
                                                    className="form-input"
                                                >
                                                    {roleOptions.map(role => (
                                                        <option key={role} value={role}>{role}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${selectedUser.role === 'Admin' ? 'bg-blue-100 text-blue-800' :
                                                    selectedUser.role === 'SuperAdmin' ? 'bg-red-100 text-red-800' :
                                                        selectedUser.role === 'Mentor' ? 'bg-purple-100 text-purple-800' :
                                                            selectedUser.role === 'Estudiante' ? 'bg-green-100 text-green-800' :
                                                                'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {selectedUser.role}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <label className="form-label">Estado</label>
                                            {editMode ? (
                                                <div className="flex items-center">
                                                    <input
                                                        id="active"
                                                        name="active"
                                                        type="checkbox"
                                                        checked={editForm.active}
                                                        onChange={handleInputChange}
                                                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                                                        {editForm.active ? 'Activo' : 'Inactivo'}
                                                    </label>
                                                </div>
                                            ) : (
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${selectedUser.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {selectedUser.active ? 'Activo' : 'Inactivo'}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <label className="form-label">Último acceso</label>
                                            <div className="text-sm text-slate-900">
                                                {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Nunca ha accedido'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {!editMode && (
                                    <div className="card-footer">
                                        <button
                                            type="button"
                                            onClick={handleDeleteUser}
                                            disabled={selectedUser.id === currentUser?.id}
                                            className={`btn-primary w-full ${selectedUser.id === currentUser?.id
                                                ? 'opacity-50 cursor-not-allowed'
                                                : 'bg-red-600 hover:bg-red-700'
                                                }`}
                                        >
                                            {selectedUser.id === currentUser?.id ? "No puedes eliminar tu cuenta" : "Eliminar usuario"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="card p-6 text-center">
                                <p className="text-slate-500">Selecciona un usuario para ver sus detalles</p>
                            </div>
                        )}
                    </div>
                </div>
            </SystemAdminLayout>
        </ProtectedRoute>
    );
}
