import type { MetaFunction } from '@remix-run/node';
import { useAuth } from '~/contexts/AuthContext';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import AdminLayout from '~/components/Layout/AdminLayout';

export const meta: MetaFunction = () => {
    return [
        { title: `Dashboard Trabajador - Nodux` },
        { name: "description", content: `Dashboard del trabajador` },
    ];
};

export default function TrabajadorDashboard() {
    const { user } = useAuth();

    return (
        <ProtectedRoute allowedRoles={['Trabajador', 'Admin', 'SuperAdmin']}>
            <AdminLayout title="Dashboard Producto">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Bienvenido, {user?.name?.split(' ')[0] || 'Trabajador'}
                        </h1>
                        <p className="text-lg text-gray-600">
                            Gestión de productos y servicios
                        </p>
                    </div>

                    {/* Contenido del dashboard de trabajador */}
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                        <p className="text-gray-600">Aquí gestionarás productos e inventario.</p>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
