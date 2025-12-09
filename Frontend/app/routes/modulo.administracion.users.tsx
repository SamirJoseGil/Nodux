import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import SystemAdminLayout from '~/components/Layout/SystemAdminLayout';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { UserManagementService } from '~/services/userManagementService';
import { useAuth } from '~/contexts/AuthContext';
import type { UserListItem } from '~/types/user';
import type { UserRole } from '~/types/auth';
import { motion, AnimatePresence } from 'framer-motion';
import FeatureIcon from '~/components/Icons/FeatureIcon';

export const meta: MetaFunction = () => {
    return [
        { title: `Gestión de Usuarios - Administración - Nodux` },
        { name: "description", content: `Administra usuarios del sistema` },
    ];
};

export default function UsersAdmin() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
    const [filterRole, setFilterRole] = useState<string>('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [createFormData, setCreateFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        phone: '',
        role: 'Usuario base' as UserRole
    });
    const [editFormData, setEditFormData] = useState({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'Usuario base' as UserRole
    });
    const [processingAction, setProcessingAction] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await UserManagementService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            alert('Error al cargar la lista de usuarios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = filterRole === 'all'
        ? users
        : users.filter(u => u.role === filterRole);

    const getRoleBadgeColor = (role: string) => {
        const colors: Record<string, string> = {
            'SuperAdmin': 'badge-error',
            'Admin': 'badge-warning',
            'Mentor': 'badge-info',
            'Estudiante': 'badge-success',
            'Trabajador': 'badge-info',
            'Usuario base': 'badge-neutral'
        };
        return colors[role] || 'badge-neutral';
    };

    const handleOpenCreateModal = () => {
        setCreateFormData({
            firstName: '',
            lastName: '',
            email: '',
            username: '',
            password: '',
            phone: '',
            role: 'Usuario base'
        });
        setShowCreateModal(true);
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentUser) {
            alert('Error: No se pudo identificar el usuario actual');
            return;
        }

        // Validaciones
        if (!createFormData.firstName || !createFormData.lastName || !createFormData.email || !createFormData.username || !createFormData.password) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        if (createFormData.password.length < 8) {
            alert('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        // Validar permisos para asignar rol
        if (!UserManagementService.canChangeRole(currentUser.role, createFormData.role)) {
            alert('No tienes permisos para asignar este rol');
            return;
        }

        setProcessingAction(true);
        try {
            const newUserProfile = await UserManagementService.createUser(createFormData);
            
            // Agregar el nuevo usuario a la lista
            const newUser: UserListItem = {
                id: newUserProfile.id,
                username: newUserProfile.user.username,
                name: `${newUserProfile.user.firstName} ${newUserProfile.user.lastName}`,
                email: newUserProfile.user.email,
                role: newUserProfile.role,
                phone: newUserProfile.phone,
                photo: newUserProfile.photo,
                isActive: true
            };

            setUsers([...users, newUser]);
            setShowCreateModal(false);
            alert('Usuario creado exitosamente');
        } catch (error: any) {
            alert(error.message || 'Error al crear usuario');
        } finally {
            setProcessingAction(false);
        }
    };

    const handleOpenEditModal = (user: UserListItem) => {
        setSelectedUser(user);
        const nameParts = user.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        setEditFormData({
            id: user.id,
            firstName: firstName,
            lastName: lastName,
            email: user.email,
            phone: user.phone,
            role: user.role
        });
        setShowEditModal(true);
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentUser) {
            alert('Error: No se pudo identificar el usuario actual');
            return;
        }

        // Validar permisos para cambiar rol
        if (!UserManagementService.canChangeRole(currentUser.role, editFormData.role)) {
            alert('No tienes permisos para asignar este rol');
            return;
        }

        setProcessingAction(true);
        try {
            await UserManagementService.updateUser(editFormData.id, {
                firstName: editFormData.firstName,
                lastName: editFormData.lastName,
                email: editFormData.email,
                phone: editFormData.phone,
                role: editFormData.role
            });
            
            // Actualizar la lista local
            setUsers(users.map(u => 
                u.id === editFormData.id 
                    ? { 
                        ...u, 
                        name: `${editFormData.firstName} ${editFormData.lastName}`,
                        email: editFormData.email,
                        phone: editFormData.phone,
                        role: editFormData.role 
                    }
                    : u
            ));

            // Actualizar el usuario seleccionado
            if (selectedUser?.id === editFormData.id) {
                setSelectedUser({
                    ...selectedUser,
                    name: `${editFormData.firstName} ${editFormData.lastName}`,
                    email: editFormData.email,
                    phone: editFormData.phone,
                    role: editFormData.role
                });
            }

            setShowEditModal(false);
            alert('Usuario actualizado exitosamente');
        } catch (error: any) {
            alert(error.message || 'Error al actualizar usuario');
        } finally {
            setProcessingAction(false);
        }
    };

    const handleOpenDeleteModal = (user: UserListItem) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleDeleteUser = async () => {
        if (!selectedUser || !currentUser) return;

        // Validar permisos
        if (!UserManagementService.canDeleteUser(
            currentUser.role,
            selectedUser.role,
            selectedUser.id,
            currentUser.id
        )) {
            alert('No tienes permisos para eliminar este usuario');
            return;
        }

        setProcessingAction(true);
        try {
            await UserManagementService.deleteUser(selectedUser.id);
            
            // Actualizar la lista local
            setUsers(users.filter(u => u.id !== selectedUser.id));
            
            setShowDeleteModal(false);
            setSelectedUser(null);
            alert('Usuario eliminado exitosamente');
        } catch (error: any) {
            alert(error.message || 'Error al eliminar usuario');
        } finally {
            setProcessingAction(false);
        }
    };

    if (loading) {
        return (
            <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
                <SystemAdminLayout title="Gestión de Usuarios">
                    <div className="flex justify-center items-center h-64">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="text-nodux-neon text-lg font-inter"
                        >
                            Cargando usuarios...
                        </motion.div>
                    </div>
                </SystemAdminLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <SystemAdminLayout title="Gestión de Usuarios">
                <div className="min-h-screen -m-6 p-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8"
                    >
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-nodux-neon to-nodux-marino rounded-xl flex items-center justify-center">
                                        <FeatureIcon type="users" size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h1 className="font-thicker text-2xl text-zafiro-900">Gestión de Usuarios</h1>
                                        <p className="font-inter text-sm text-zafiro-700">{filteredUsers.length} usuarios</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <select
                                        value={filterRole}
                                        onChange={(e) => setFilterRole(e.target.value)}
                                        className="form-input max-w-xs text-zafiro-900"
                                    >
                                        <option value="all">Todos los roles</option>
                                        <option value="SuperAdmin">SuperAdmin</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Mentor">Mentor</option>
                                        <option value="Estudiante">Estudiante</option>
                                        <option value="Trabajador">Trabajador</option>
                                        <option value="Usuario base">Usuario base</option>
                                    </select>
                                    <button
                                        onClick={handleOpenCreateModal}
                                        className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg shadow transition-all duration-200 hover:bg-nodux-neon/90 focus:outline-none focus:ring-2 focus:ring-nodux-neon text-base font-semibold"
                                    >
                                        <FeatureIcon type="users" size={20} className="inline" />
                                        <span className="hidden sm:inline">Crear</span>
                                        <span className="sm:hidden">Crear</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Lista de usuarios */}
                        <div className="lg:col-span-2">
                            <div className="glass-card overflow-hidden">
                                <div className="px-6 py-4 border-b border-zafiro-300">
                                    <h2 className="font-inter text-xl font-bold text-zafiro-900">
                                        Lista de Usuarios
                                    </h2>
                                </div>
                                <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                                    {filteredUsers.map((user) => (
                                        <motion.div
                                            key={user.id}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            onClick={() => setSelectedUser(user)}
                                            className={`p-4 bg-white/50 hover:bg-white/70 border-2 rounded-xl cursor-pointer transition-all ${
                                                selectedUser?.id === user.id ? 'border-nodux-neon' : 'border-zafiro-200'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-nodux-neon to-nodux-marino rounded-full flex items-center justify-center text-white font-thicker text-lg">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-inter font-bold text-zafiro-900 mb-1">
                                                            {user.name}
                                                        </h3>
                                                        <p className="font-inter text-sm text-zafiro-700 mb-2">
                                                            {user.email}
                                                        </p>
                                                        <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                                                            {user.role}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {user.isActive ? (
                                                        <span className="badge badge-success">Activo</span>
                                                    ) : (
                                                        <span className="badge badge-error">Inactivo</span>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Panel de detalle */}
                        <div className="lg:col-span-1">
                            {selectedUser ? (
                                <div className="glass-card overflow-hidden">
                                    <div className="px-6 py-4 border-b border-zafiro-300">
                                        <h3 className="font-inter text-lg font-bold text-zafiro-900">
                                            Detalles del Usuario
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="text-center pb-4 border-b border-zafiro-300">
                                            <div className="w-20 h-20 bg-gradient-to-br from-nodux-neon to-nodux-marino rounded-full flex items-center justify-center text-white font-thicker text-3xl mx-auto mb-4">
                                                {selectedUser.name.charAt(0)}
                                            </div>
                                            <h4 className="font-inter font-bold text-zafiro-900 text-lg mb-1">
                                                {selectedUser.name}
                                            </h4>
                                            <p className="font-inter text-sm text-zafiro-700">
                                                {selectedUser.email}
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Usuario</span>
                                                <p className="font-inter text-zafiro-900 mt-1">{selectedUser.username}</p>
                                            </div>
                                            <div>
                                                <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Rol</span>
                                                <p className="mt-1">
                                                    <span className={`badge ${getRoleBadgeColor(selectedUser.role)}`}>
                                                        {selectedUser.role}
                                                    </span>
                                                </p>
                                            </div>
                                            {selectedUser.phone && (
                                                <div>
                                                    <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Teléfono</span>
                                                    <p className="font-inter text-zafiro-900 mt-1">{selectedUser.phone}</p>
                                                </div>
                                            )}
                                            <div>
                                                <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Estado</span>
                                                <p className="mt-1">
                                                    {selectedUser.isActive ? (
                                                        <span className="badge badge-success">Activo</span>
                                                    ) : (
                                                        <span className="badge badge-error">Inactivo</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-6 py-4 border-t border-zafiro-300 flex gap-2">
                                        <button 
                                            type="button" 
                                            className="btn-secondary flex-1"
                                            onClick={() => handleOpenEditModal(selectedUser)}
                                            disabled={!currentUser || !UserManagementService.canChangeRole(currentUser.role, selectedUser.role)}
                                        >
                                            Cambiar Rol
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn-primary bg-red-500 hover:bg-red-600 flex-1"
                                            onClick={() => handleOpenDeleteModal(selectedUser)}
                                            disabled={!currentUser || !UserManagementService.canDeleteUser(
                                                currentUser.role,
                                                selectedUser.role,
                                                selectedUser.id,
                                                currentUser.id
                                            )}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="glass-card p-8 text-center">
                                    <FeatureIcon type="users" size={48} className="mx-auto mb-4 text-zafiro-400" />
                                    <p className="font-inter text-zafiro-700">
                                        Selecciona un usuario para ver sus detalles
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Modal de Creación */}
                    <AnimatePresence>
                        {showCreateModal && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => !processingAction && setShowCreateModal(false)}
                                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                                />
                                
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                                >
                                    <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                        <div className="px-6 py-4 border-b border-zafiro-300">
                                            <h2 className="font-thicker text-xl text-zafiro-900">Crear Nuevo Usuario</h2>
                                            <p className="font-inter text-sm text-zafiro-700 mt-1">
                                                Completa todos los campos requeridos
                                            </p>
                                        </div>
                                        
                                        <form onSubmit={handleCreateUser} className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="form-label">Nombre *</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={createFormData.firstName}
                                                        onChange={(e) => setCreateFormData({ ...createFormData, firstName: e.target.value })}
                                                        className="form-input w-full text-zafiro-900"
                                                        placeholder="Juan"
                                                        disabled={processingAction}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="form-label">Apellido *</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={createFormData.lastName}
                                                        onChange={(e) => setCreateFormData({ ...createFormData, lastName: e.target.value })}
                                                        className="form-input w-full text-zafiro-900"
                                                        placeholder="Pérez"
                                                        disabled={processingAction}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="form-label">Email *</label>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={createFormData.email}
                                                        onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                                                        className="form-input w-full text-zafiro-900"
                                                        placeholder="juan@example.com"
                                                        disabled={processingAction}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="form-label">Usuario *</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={createFormData.username}
                                                        onChange={(e) => setCreateFormData({ ...createFormData, username: e.target.value })}
                                                        className="form-input w-full text-zafiro-900"
                                                        placeholder="juanperez"
                                                        disabled={processingAction}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="form-label">Contraseña *</label>
                                                    <input
                                                        type="password"
                                                        required
                                                        value={createFormData.password}
                                                        onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                                                        className="form-input w-full text-zafiro-900"
                                                        placeholder="Mínimo 8 caracteres"
                                                        minLength={8}
                                                        disabled={processingAction}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="form-label">Teléfono</label>
                                                    <input
                                                        type="tel"
                                                        value={createFormData.phone}
                                                        onChange={(e) => setCreateFormData({ ...createFormData, phone: e.target.value })}
                                                        className="form-input w-full text-zafiro-900"
                                                        placeholder="+57 300 123 4567"
                                                        disabled={processingAction}
                                                    />
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label className="form-label">Rol *</label>
                                                    <select
                                                        value={createFormData.role}
                                                        onChange={(e) => setCreateFormData({ ...createFormData, role: e.target.value as UserRole })}
                                                        className="form-input w-full text-zafiro-900"
                                                        disabled={processingAction}
                                                    >
                                                        <option value="Usuario base">Usuario base</option>
                                                        <option value="Estudiante">Estudiante</option>
                                                        <option value="Trabajador">Trabajador</option>
                                                        <option value="Mentor">Mentor</option>
                                                        <option value="Admin">Admin</option>
                                                        {currentUser?.role === 'SuperAdmin' && (
                                                            <option value="SuperAdmin">SuperAdmin</option>
                                                        )}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                                                <p className="text-sm text-blue-800 font-inter">
                                                    ℹ️ El nuevo usuario podrá iniciar sesión inmediatamente con las credenciales proporcionadas.
                                                </p>
                                            </div>

                                            <div className="flex gap-2 mt-6">
                                                <button 
                                                    type="button" 
                                                    className="btn-secondary flex-1" 
                                                    onClick={() => setShowCreateModal(false)}
                                                    disabled={processingAction}
                                                >
                                                    Cancelar
                                                </button>
                                                <button 
                                                    type="submit" 
                                                    className="btn-primary flex-1"
                                                    disabled={processingAction}
                                                >
                                                    {processingAction ? 'Creando...' : 'Crear Usuario'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Modal de Edición Completa */}
                    <AnimatePresence>
                        {showEditModal && selectedUser && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => !processingAction && setShowEditModal(false)}
                                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                                />
                                
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                                >
                                    <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                        <div className="px-6 py-4 border-b border-zafiro-300">
                                            <h2 className="font-thicker text-xl text-zafiro-900">Editar Usuario</h2>
                                            <p className="font-inter text-sm text-zafiro-700 mt-1">
                                                {selectedUser.username} • {selectedUser.email}
                                            </p>
                                        </div>
                                        
                                        <form onSubmit={handleUpdateUser} className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="form-label">Nombre *</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={editFormData.firstName}
                                                        onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                                                        className="form-input w-full text-zafiro-900"
                                                        disabled={processingAction}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="form-label">Apellido *</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={editFormData.lastName}
                                                        onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                                                        className="form-input w-full text-zafiro-900"
                                                        disabled={processingAction}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="form-label">Email *</label>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={editFormData.email}
                                                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                                        className="form-input w-full text-zafiro-900"
                                                        disabled={processingAction}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="form-label">Teléfono</label>
                                                    <input
                                                        type="tel"
                                                        value={editFormData.phone}
                                                        onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                                                        className="form-input w-full text-zafiro-900"
                                                        disabled={processingAction}
                                                    />
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label className="form-label">Rol *</label>
                                                    <select
                                                        value={editFormData.role}
                                                        onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as UserRole })}
                                                        className="form-input w-full text-zafiro-900"
                                                        disabled={processingAction}
                                                    >
                                                        <option value="Usuario base">Usuario base</option>
                                                        <option value="Estudiante">Estudiante</option>
                                                        <option value="Trabajador">Trabajador</option>
                                                        <option value="Mentor">Mentor</option>
                                                        <option value="Admin">Admin</option>
                                                        {currentUser?.role === 'SuperAdmin' && (
                                                            <option value="SuperAdmin">SuperAdmin</option>
                                                        )}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                                                <p className="text-sm text-yellow-800 font-inter">
                                                    ⚠️ Los cambios se aplicarán inmediatamente. El usuario será notificado si cambia su email o rol.
                                                </p>
                                            </div>

                                            <div className="flex gap-2 mt-6">
                                                <button 
                                                    type="button" 
                                                    className="btn-secondary flex-1" 
                                                    onClick={() => setShowEditModal(false)}
                                                    disabled={processingAction}
                                                >
                                                    Cancelar
                                                </button>
                                                <button 
                                                    type="submit" 
                                                    className="btn-primary flex-1"
                                                    disabled={processingAction}
                                                >
                                                    {processingAction ? 'Guardando...' : 'Guardar Cambios'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Modal de Confirmación de Eliminación */}
                    <AnimatePresence>
                        {showDeleteModal && selectedUser && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => !processingAction && setShowDeleteModal(false)}
                                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                                />
                                
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                                >
                                    <div className="glass-card max-w-md w-full">
                                        <div className="px-6 py-4 border-b border-zafiro-300">
                                            <h2 className="font-thicker text-xl text-zafiro-900">Confirmar Eliminación</h2>
                                        </div>
                                        
                                        <div className="p-6">
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                                <div className="flex items-start gap-3">
                                                    <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                    <div>
                                                        <p className="font-inter font-bold text-red-900 mb-1">¿Estás seguro?</p>
                                                        <p className="text-sm text-red-800 font-inter">
                                                            Esta acción eliminará permanentemente al usuario <strong>{selectedUser.name}</strong> ({selectedUser.email}).
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button 
                                                    type="button" 
                                                    className="btn-secondary flex-1" 
                                                    onClick={() => setShowDeleteModal(false)}
                                                    disabled={processingAction}
                                                >
                                                    Cancelar
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className="btn-primary bg-red-500 hover:bg-red-600 flex-1"
                                                    onClick={handleDeleteUser}
                                                    disabled={processingAction}
                                                >
                                                    {processingAction ? 'Eliminando...' : 'Eliminar Usuario'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </SystemAdminLayout>
        </ProtectedRoute>
    );
}
