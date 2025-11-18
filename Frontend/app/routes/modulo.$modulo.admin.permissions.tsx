import { useState, useEffect } from 'react';
import { useParams } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import AdminLayout from '~/components/Layout/AdminLayout';
import ProtectedRoute from '~/components/ProtectedRoute';

export const meta: MetaFunction = ({ params }) => {
    const moduleName = params.modulo ?
        params.modulo.charAt(0).toUpperCase() + params.modulo.slice(1) :
        'Módulo';

    return [
        { title: `Administración de Permisos - ${moduleName} - Nodux` },
        {
            name: "description",
            content: `Gestiona permisos en el módulo ${moduleName}`,
        },
    ];
};

export default function PermissionsAdmin() {
    const { modulo } = useParams();
    const [permissions, setPermissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPermissions = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/permissions?module=${modulo}`);
                const data = await response.json();
                setPermissions(data.permissions);
            } catch (error) {
                console.error('Error al cargar los permisos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPermissions();
    }, [modulo]);

    const handlePermissionChange = async (permissionId: string, enabled: boolean) => {
        try {
            await fetch(`/api/permissions/${permissionId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ enabled }),
            });

            setPermissions((prev) =>
                prev.map((perm) =>
                    perm.id === permissionId ? { ...perm, enabled } : perm
                )
            );
        } catch (error) {
            console.error('Error al actualizar el permiso:', error);
        }
    };

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <AdminLayout title="Administración de Permisos">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                            Gestión de Permisos - {modulo}
                        </h2>
                        <p className="text-slate-600">
                            Configura los permisos y accesos para el módulo {modulo}
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="card">
                            <div className="card-header">
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Lista de Permisos
                                </h3>
                            </div>
                            <div className="card-body space-y-4">
                                {permissions.map((permission) => (
                                    <div
                                        key={permission.id}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-slate-900">
                                                {permission.name}
                                            </h4>
                                            <p className="text-sm text-slate-600">
                                                {permission.description}
                                            </p>
                                        </div>
                                        <div className="flex items-center ml-4">
                                            <input
                                                id={`permission-${permission.id}`}
                                                name={`permission-${permission.id}`}
                                                type="checkbox"
                                                checked={permission.enabled}
                                                onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor={`permission-${permission.id}`} className="ml-2 text-sm font-medium">
                                                <span className={`badge ${permission.enabled ? 'badge-success' : 'badge-neutral'}`}>
                                                    {permission.enabled ? 'Habilitado' : 'Deshabilitado'}
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}