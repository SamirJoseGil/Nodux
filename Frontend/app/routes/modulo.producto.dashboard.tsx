import { useEffect } from 'react';
import { useParams, useNavigate } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { useAuth } from '~/contexts/AuthContext';
import ProtectedRoute from '~/components/ProtectedRoute';

export const meta: MetaFunction = () => {
    return [
        { title: `Dashboard Producto - Nodux` },
        {
            name: "description",
            content: `Dashboard del módulo de producto de Nodux`,
        },
    ];
};

export default function ProductoDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('ProductoDashboard: cargado para usuario', user?.role);
    }, [user]);

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin', 'Trabajador']}>
            <div className="min-h-screen bg-gray-100">
                <div className="py-10">
                    <header>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h1 className="text-3xl font-bold leading-tight text-gray-900">
                                Dashboard Módulo de Producto
                            </h1>
                        </div>
                    </header>
                    <main>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="py-8">
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                                    <p className="text-lg">
                                        Bienvenido al panel de gestión de productos.
                                    </p>
                                    <div className="mt-6">
                                        <p className="text-gray-600">
                                            Este módulo está en desarrollo. Próximamente contará con:
                                        </p>
                                        <ul className="mt-4 list-disc list-inside text-gray-600">
                                            <li>Gestión de productos y servicios</li>
                                            <li>Control de inventario</li>
                                            <li>Análisis de ventas</li>
                                            <li>Gestión de proveedores</li>
                                        </ul>
                                    </div>

                                    <div className="mt-8">
                                        <button
                                            onClick={() => navigate('/selector-modulo')}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                        >
                                            Volver al selector de módulos
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
