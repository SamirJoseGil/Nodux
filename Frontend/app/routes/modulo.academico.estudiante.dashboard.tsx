import type { MetaFunction } from '@remix-run/node';
import { useAuth } from '~/contexts/AuthContext';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import AdminLayout from '~/components/Layout/AdminLayout';

export const meta: MetaFunction = () => {
    return [
        { title: `Dashboard Estudiante - Nodux` },
        { name: "description", content: `Dashboard del estudiante` },
    ];
};

export default function EstudianteDashboard() {
    const { user } = useAuth();

    return (
        <ProtectedRoute allowedRoles={['Estudiante', 'Admin', 'SuperAdmin']}>
            <AdminLayout title="Dashboard Estudiante">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Bienvenido, {user?.name?.split(' ')[0] || 'Estudiante'}
                        </h1>
                        <p className="text-lg text-gray-600">
                            Tu espacio de aprendizaje
                        </p>
                    </div>

                    {/* Contenido del dashboard de estudiante */}
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                        <p className="text-gray-600">Aquí verás tus cursos, horarios y progreso.</p>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
