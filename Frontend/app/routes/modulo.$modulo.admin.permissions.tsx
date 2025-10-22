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
                <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                            Gestión de Permisos - {modulo}
                        </h2>

                        {loading ? (
                            <div className="flex items-center justify-center py-10">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : (
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Lista de Permisos
                                    </h3>
                                </div>
                                <div className="border-t border-gray-200">
                                    <dl>
                                        {permissions.map((permission) => (
                                            <div
                                                key={permission.id}
                                                className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                                            >
                                                <dt className="text-sm font-medium text-gray-500">
                                                    {permission.name}
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                    {permission.description}
                                                </dd>
                                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">
                                                    <div className="flex items-center">
                                                        <input
                                                            id={`permission-${permission.id}`}
                                                            name={`permission-${permission.id}`}
                                                            type="checkbox"
                                                            checked={permission.enabled}
                                                            onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                        />
                                                        <label htmlFor={`permission-${permission.id}`} className="ml-2 block text-sm text-gray-900">
                                                            {permission.enabled ? 'Habilitado' : 'Deshabilitado'}
                                                        </label>
                                                    </div>
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}