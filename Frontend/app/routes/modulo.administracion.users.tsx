import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import SystemAdminLayout from '~/components/Layout/SystemAdminLayout'; // ← CAMBIO AQUÍ
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { AdminService } from '~/services/adminService';
import type { User } from '~/types/auth';
import { motion } from 'framer-motion';
import FeatureIcon from '~/components/Icons/FeatureIcon';

export const meta: MetaFunction = () => {
    return [
        { title: `Gestión de Usuarios - Administración - Nodux` },
        { name: "description", content: `Administra usuarios del sistema` },
    ];
};

export default function UsersAdmin() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [filterRole, setFilterRole] = useState<string>('all');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const data = await AdminService.getUsers();
                setUsers(data);
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
            } finally {
                setLoading(false);
            }
        };

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

    if (loading) {
        return (
            <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
                <SystemAdminLayout title="Gestión de Usuarios">
                    <div className="flex justify-center items-center h-64">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="text-nodux-naranja text-lg font-inter"
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
            <SystemAdminLayout title="Gestión de Usuarios"> {/* ← CAMBIO AQUÍ */}
                <div className="min-h-screen -m-6 p-6 bg-white">
                    {/* Header */}
                    <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        className="mb-8"
                    >
                        <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-nodux-neon to-nodux-marino rounded-xl flex items-center justify-center">
                                        <FeatureIcon type="users" size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h1 className="font-thicker text-2xl text-zafiro-900">Gestión de Usuarios</h1>
                                        <p className="font-inter text-sm text-gray-600">{filteredUsers.length} usuarios</p>
                                    </div>
                                </div>
                                <select
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                    className="form-input max-w-xs text-zafiro-900"
                                >
                                    <option value="all" className="bg-white">Todos los roles</option>
                                    <option value="SuperAdmin" className="bg-white">SuperAdmin</option>
                                    <option value="Admin" className="bg-white">Admin</option>
                                    <option value="Mentor" className="bg-white">Mentor</option>
                                    <option value="Estudiante" className="bg-white">Estudiante</option>
                                    <option value="Trabajador" className="bg-white">Trabajador</option>
                                    <option value="Usuario base" className="bg-white">Usuario base</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Lista de usuarios */}
                        <div className="lg:col-span-2">
                            <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="font-inter text-xl font-bold text-zafiro-900">
                                        Lista de Usuarios
                                    </h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    {filteredUsers.map((user) => (
                                        <motion.div
                                            key={user.id}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            onClick={() => setSelectedUser(user)}
                                            className={`p-4 bg-gray-50 hover:bg-gray-100 border-2 rounded-xl cursor-pointer transition-all ${
                                                selectedUser?.id === user.id ? 'border-nodux-neon' : 'border-gray-200'
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
                                                        <p className="font-inter text-sm text-gray-600 mb-2">
                                                            {user.email}
                                                        </p>
                                                        <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                                                            {user.role}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {user.active ? (
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
                                <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h3 className="font-inter text-lg font-bold text-zafiro-900">
                                            Detalles del Usuario
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="text-center pb-4 border-b border-gray-200">
                                            <div className="w-20 h-20 bg-gradient-to-br from-nodux-neon to-nodux-marino rounded-full flex items-center justify-center text-white font-thicker text-3xl mx-auto mb-4">
                                                {selectedUser.name.charAt(0)}
                                            </div>
                                            <h4 className="font-inter font-bold text-zafiro-900 text-lg mb-1">
                                                {selectedUser.name}
                                            </h4>
                                            <p className="font-inter text-sm text-gray-600">
                                                {selectedUser.email}
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <span className="font-inter text-xs font-bold text-gray-600 uppercase">Rol</span>
                                                <p className="mt-1">
                                                    <span className={`badge ${getRoleBadgeColor(selectedUser.role)}`}>
                                                        {selectedUser.role}
                                                    </span>
                                                </p>
                                            </div>
                                            <div>
                                                <span className="font-inter text-xs font-bold text-gray-600 uppercase">Estado</span>
                                                <p className="mt-1">
                                                    {selectedUser.active ? (
                                                        <span className="badge badge-success">Activo</span>
                                                    ) : (
                                                        <span className="badge badge-error">Inactivo</span>
                                                    )}
                                                </p>
                                            </div>
                                            {selectedUser.lastLogin && (
                                                <div>
                                                    <span className="font-inter text-xs font-bold text-gray-600 uppercase">Último acceso</span>
                                                    <p className="font-inter text-zafiro-900 mt-1">
                                                        {new Date(selectedUser.lastLogin).toLocaleString('es-ES')}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="px-6 py-4 border-t border-gray-200 flex gap-2">
                                        <button type="button" className="btn-secondary flex-1">
                                            Editar
                                        </button>
                                        <button type="button" className="btn-primary flex-1">
                                            Cambiar Rol
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg p-8 text-center">
                                    <FeatureIcon type="users" size={48} className="mx-auto mb-4 text-gray-400" />
                                    <p className="font-inter text-gray-600">
                                        Selecciona un usuario para ver sus detalles
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </SystemAdminLayout>
        </ProtectedRoute>
    );
}
