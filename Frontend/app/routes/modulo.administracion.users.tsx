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
                    <div className="lg:col-span-3 bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Búsqueda */}
                                <div className="col-span-2">
                                    <label htmlFor="search" className="block text-sm font-medium text-gray-700">Buscar usuario</label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="search"
                                            id="search"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Nombre o correo electrónico"
                                        />
                                    </div>
                                </div>

                                {/* Filtro por rol */}
                                <div>
                                    <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700">Filtrar por rol</label>
                                    <div className="mt-1">
                                        <select
                                            id="role-filter"
                                            name="role-filter"
                                            value={roleFilter}
                                            onChange={(e) => setRoleFilter(e.target.value)}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        >
                                            <option value="all">Todos los roles</option>
                                            {roleOptions.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Filtro por estado */}
                                <div>
                                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">Filtrar por estado</label>
                                    <div className="mt-1">
                                        <select
                                            id="status-filter"
                                            name="status-filter"
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        >
                                            <option value="all">Todos los estados</option>
                                            <option value="active">Activos</option>
                                            <option value="inactive">Inactivos</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lista de usuarios */}
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Usuarios ({filteredUsers.length})
                                </h3>
                                <button
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Crear usuario
                                </button>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                                </div>
                            ) : filteredUsers.length === 0 ? (
                                <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
                                    No se encontraron usuarios que coincidan con los criterios de búsqueda.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Usuario
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Rol
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Estado
                                                </th>
                                                <th scope="col" className="relative px-6 py-3">
                                                    <span className="sr-only">Acciones</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredUsers.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    onClick={() => handleSelectUser(user)}
                                                    className={`hover:bg-gray-50 cursor-pointer ${selectedUser?.id === user.id ? 'bg-gray-50' : ''}`}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                                <span className="text-gray-700 font-medium">{user.name.charAt(0)}</span>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                                <div className="text-sm text-gray-500">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'Admin' ? 'bg-blue-100 text-blue-800' :
                                                                user.role === 'SuperAdmin' ? 'bg-red-100 text-red-800' :
                                                                    user.role === 'Mentor' ? 'bg-purple-100 text-purple-800' :
                                                                        user.role === 'Estudiante' ? 'bg-green-100 text-green-800' :
                                                                            'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {user.active ? 'Activo' : 'Inactivo'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            type="button"
                                                            className="text-red-600 hover:text-red-900"
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
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Detalles del Usuario
                                    </h3>
                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={handleEditToggle}
                                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            {editMode ? 'Cancelar' : 'Editar'}
                                        </button>
                                        {editMode && (
                                            <button
                                                type="button"
                                                onClick={handleSaveChanges}
                                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                            >
                                                Guardar
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="border-t border-gray-200">
                                    <dl>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Nombre completo</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {editMode ? (
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={editForm.name}
                                                        onChange={handleInputChange}
                                                        className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                ) : selectedUser.name}
                                            </dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Correo electrónico</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {editMode ? (
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={editForm.email}
                                                        onChange={handleInputChange}
                                                        className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                ) : selectedUser.email}
                                            </dd>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Rol</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {editMode ? (
                                                    <select
                                                        name="role"
                                                        value={editForm.role}
                                                        onChange={handleInputChange}
                                                        className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
                                            </dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Estado</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
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
                                            </dd>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Último acceso</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Nunca ha accedido'}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                                {!editMode && (
                                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                        <button
                                            type="button"
                                            onClick={handleDeleteUser}
                                            disabled={selectedUser.id === currentUser?.id}
                                            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${selectedUser.id === currentUser?.id
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                                                }`}
                                        >
                                            {selectedUser.id === currentUser?.id ? "No puedes eliminar tu cuenta" : "Eliminar usuario"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
                                <p className="text-gray-500">Selecciona un usuario para ver sus detalles</p>
                            </div>
                        )}
                    </div>
                </div>
            </SystemAdminLayout>
        </ProtectedRoute>
    );
}
