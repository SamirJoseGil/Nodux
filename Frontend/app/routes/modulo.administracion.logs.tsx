import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import SystemAdminLayout from '~/components/Layout/SystemAdminLayout'; // ← CAMBIO AQUÍ
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { AdminService } from '~/services/adminService';
import { motion } from 'framer-motion';
import FeatureIcon from '~/components/Icons/FeatureIcon';

export const meta: MetaFunction = () => {
    return [
        { title: `Logs del Sistema - Administración - Nodux` },
        { name: "description", content: `Auditoría y logs del sistema` },
    ];
};

export default function LogsAdmin() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const data = await AdminService.getSystemLogs(page, 20);
                setLogs(data.logs);
                setTotalPages(Math.ceil(data.total / 20));
            } catch (error) {
                console.error('Error al cargar logs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [page]);

    if (loading) {
        return (
            <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
                <SystemAdminLayout title="Logs del Sistema">
                    <div className="flex justify-center items-center h-64">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="text-nodux-naranja text-lg font-inter"
                        >
                            Cargando logs...
                        </motion.div>
                    </div>
                </SystemAdminLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <SystemAdminLayout title="Logs del Sistema"> {/* ← CAMBIO AQUÍ */}
                <div className="min-h-screen -m-6 p-6 bg-white">
                    {/* Header */}
                    <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        className="mb-8"
                    >
                        <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-nodux-naranja to-nodux-amarillo rounded-xl flex items-center justify-center">
                                    <FeatureIcon type="trending" size={24} className="text-white" />
                                </div>
                                <div>
                                    <h1 className="font-thicker text-2xl text-zafiro-900">Logs del Sistema</h1>
                                    <p className="font-inter text-sm text-gray-600">Auditoría de actividades</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Logs Table */}
                    <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="font-inter text-xl font-bold text-zafiro-900">
                                Actividad Reciente
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Usuario
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Acción
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Objetivo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-inter text-sm font-medium text-zafiro-900">
                                                    {log.user}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-inter text-sm text-gray-700">
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-inter text-sm text-gray-600">
                                                    {log.target}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-inter text-sm text-gray-500">
                                                    {new Date(log.timestamp).toLocaleString('es-ES')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="btn-secondary disabled:opacity-50"
                            >
                                Anterior
                            </button>
                            <span className="font-inter text-sm text-gray-700">
                                Página {page} de {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="btn-primary disabled:opacity-50"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </div>
            </SystemAdminLayout>
        </ProtectedRoute>
    );
}
