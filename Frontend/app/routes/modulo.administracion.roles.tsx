import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import SystemAdminLayout from '~/components/Layout/SystemAdminLayout'; // ← CAMBIO AQUÍ
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { AdminService } from '~/services/adminService';
import { motion } from 'framer-motion';
import FeatureIcon from '~/components/Icons/FeatureIcon';

export const meta: MetaFunction = () => {
    return [
        { title: `Gestión de Roles - Administración - Nodux` },
        { name: "description", content: `Administra roles y permisos del sistema` },
    ];
};

export default function RolesAdmin() {
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoles = async () => {
            setLoading(true);
            try {
                const data = await AdminService.getRoles();
                setRoles(data);
            } catch (error) {
                console.error('Error al cargar roles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    if (loading) {
        return (
            <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
                <SystemAdminLayout title="Gestión de Roles">
                    <div className="flex justify-center items-center h-64">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="text-nodux-naranja text-lg font-inter"
                        >
                            Cargando roles...
                        </motion.div>
                    </div>
                </SystemAdminLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <SystemAdminLayout title="Gestión de Roles"> {/* ← CAMBIO AQUÍ */}
                <div className="min-h-screen -m-6 p-6 bg-white">
                    {/* Header */}
                    <motion.div
                                     initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        className="mb-8"
                    >
                        <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-nodux-amarillo to-nodux-naranja rounded-xl flex items-center justify-center">
                                    <FeatureIcon type="shield" size={24} className="text-white" />
                                </div>
                                <div>
                                    <h1 className="font-thicker text-2xl text-zafiro-900">Gestión de Roles</h1>
                                    <p className="font-inter text-sm text-gray-600">{roles.length} roles del sistema</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Roles Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {roles.map((role, index) => (
                            <motion.div
                                key={role.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="bg-white border-2 border-gray-200 hover:border-nodux-neon rounded-2xl shadow-lg p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-inter font-bold text-xl text-zafiro-900">
                                        {role.name}
                                    </h3>
                                    <span className="px-3 py-1 bg-nodux-neon/10 text-nodux-neon border border-nodux-neon/30 rounded-full text-sm font-bold">
                                        {role.count}
                                    </span>
                                </div>
                                
                                <div className="space-y-2">
                                    <p className="font-inter text-sm text-gray-600 font-bold">Permisos:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {role.permissions.slice(0, 3).map((permission: string) => (
                                            <span key={permission} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-inter">
                                                {permission}
                                            </span>
                                        ))}
                                        {role.permissions.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-inter">
                                                +{role.permissions.length - 3} más
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button className="btn-secondary w-full mt-4">
                                    Ver Permisos
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </SystemAdminLayout>
        </ProtectedRoute>
    );
}
