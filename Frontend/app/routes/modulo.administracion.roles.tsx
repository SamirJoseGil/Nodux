import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import SystemAdminLayout from '~/components/Layout/SystemAdminLayout';
import { AdminService } from '~/services/adminService';
import type { UserRole } from '~/types/auth';
import { motion } from 'framer-motion';
import FeatureIcon from '~/components/Icons/FeatureIcon';

export const meta: MetaFunction = () => {
    return [
        { title: `Roles y Permisos - Administración - Nodux` },
        { name: "description", content: `Gestión de roles y permisos del sistema` },
    ];
};

interface RoleStats {
    name: UserRole;
    count: number;
    description: string;
    permissions: string[];
}

export default function RolesAdmin() {
    const [roles, setRoles] = useState<RoleStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState<RoleStats | null>(null);

    useEffect(() => {
        const fetchRoles = async () => {
            setLoading(true);
            try {
                const data = await AdminService.getRoleStatistics();
                setRoles(data);
                if (data.length > 0) {
                    setSelectedRole(data[0]);
                }
            } catch (error) {
                console.error('Error al cargar roles:', error);
                alert('Error al cargar estadísticas de roles');
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

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
                <SystemAdminLayout title="Roles y Permisos">
                    <div className="flex justify-center items-center h-64">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="text-center"
                        >
                            <svg className="animate-spin h-8 w-8 text-nodux-neon mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-nodux-neon font-inter">Cargando roles...</p>
                        </motion.div>
                    </div>
                </SystemAdminLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <SystemAdminLayout title="Roles y Permisos">
                <div className="min-h-screen -m-6 p-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8"
                    >
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-nodux-neon to-nodux-marino rounded-xl flex items-center justify-center">
                                    <FeatureIcon type="shield" size={24} className="text-white" />
                                </div>
                                <div>
                                    <h1 className="font-thicker text-2xl text-zafiro-900">Roles y Permisos</h1>
                                    <p className="font-inter text-sm text-zafiro-700">{roles.length} roles configurados</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Lista de roles */}
                        <div className="lg:col-span-2">
                            <div className="glass-card overflow-hidden">
                                <div className="px-6 py-4 border-b border-zafiro-300">
                                    <h2 className="font-inter text-xl font-bold text-zafiro-900">
                                        Roles del Sistema
                                    </h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    {roles.map((role) => (
                                        <motion.div
                                            key={role.name}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            onClick={() => setSelectedRole(role)}
                                            className={`p-4 bg-white/50 hover:bg-white/70 border-2 rounded-xl cursor-pointer transition-all ${
                                                selectedRole?.name === role.name ? 'border-nodux-neon' : 'border-zafiro-200'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-nodux-neon to-nodux-marino rounded-full flex items-center justify-center">
                                                        <FeatureIcon type="shield" size={20} className="text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-inter font-bold text-zafiro-900 mb-1">
                                                            {role.name}
                                                        </h3>
                                                        <p className="font-inter text-sm text-zafiro-700">
                                                            {role.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`badge ${getRoleBadgeColor(role.name)}`}>
                                                        {role.count} usuarios
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Panel de detalle */}
                        <div className="lg:col-span-1">
                            {selectedRole ? (
                                <div className="glass-card overflow-hidden">
                                    <div className="px-6 py-4 border-b border-zafiro-300">
                                        <h3 className="font-inter text-lg font-bold text-zafiro-900">
                                            Detalles del Rol
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="text-center pb-4 border-b border-zafiro-300">
                                            <div className="w-20 h-20 bg-gradient-to-br from-nodux-neon to-nodux-marino rounded-full flex items-center justify-center mx-auto mb-4">
                                                <FeatureIcon type="shield" size={32} className="text-white" />
                                            </div>
                                            <h4 className="font-inter font-bold text-zafiro-900 text-lg mb-1">
                                                {selectedRole.name}
                                            </h4>
                                            <p className="font-inter text-sm text-zafiro-700">
                                                {selectedRole.description}
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Usuarios</span>
                                                <p className="font-inter text-zafiro-900 mt-1">{selectedRole.count} usuarios asignados</p>
                                            </div>
                                            <div>
                                                <span className="font-inter text-xs font-bold text-zafiro-600 uppercase mb-2 block">Permisos</span>
                                                <div className="space-y-2">
                                                    {selectedRole.permissions.map((permission, index) => (
                                                        <div key={index} className="flex items-center gap-2 text-sm">
                                                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                            <span className="font-inter text-zafiro-900">{permission}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="glass-card p-8 text-center">
                                    <FeatureIcon type="shield" size={48} className="mx-auto mb-4 text-zafiro-400" />
                                    <p className="font-inter text-zafiro-700">
                                        Selecciona un rol para ver sus detalles
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
