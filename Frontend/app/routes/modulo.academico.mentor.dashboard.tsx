import type { MetaFunction } from '@remix-run/node';
import { useAuth } from '~/contexts/AuthContext';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import AdminLayout from '~/components/Layout/AdminLayout';

export const meta: MetaFunction = () => {
    return [
        { title: `Dashboard Mentor - Nodux` },
        { name: "description", content: `Dashboard del mentor` },
    ];
};

export default function MentorDashboard() {
    const { user } = useAuth();

    return (
        <ProtectedRoute allowedRoles={['Mentor', 'Admin', 'SuperAdmin']}>
            <AdminLayout title="Dashboard Mentor">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Bienvenido, {user?.name?.split(' ')[0] || 'Mentor'}
                        </h1>
                        <p className="text-lg text-gray-600">
                            Panel de control para mentores
                        </p>
                    </div>

                    {/* Contenido del dashboard de mentor */}
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                        <p className="text-gray-600">Aquí verás tus grupos, horarios y estadísticas.</p>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
