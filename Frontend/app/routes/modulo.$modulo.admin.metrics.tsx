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
        { title: `Métricas - ${moduleName} - Nodux` },
        {
            name: "description",
            content: `Métricas y analytics del módulo ${moduleName}`,
        },
    ];
};

export default function MetricsAdmin() {
    const { modulo } = useParams();
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            setLoading(true);
            try {
                // Simular carga de métricas
                const mockMetrics = {
                    totalUsers: 150,
                    activeProjects: 25,
                    completedTasks: 340,
                    averageScore: 8.5
                };
                setMetrics(mockMetrics);
            } catch (error) {
                console.error('Error al cargar métricas:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, [modulo]);

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <AdminLayout title="Métricas y Analytics">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                            Métricas - {modulo}
                        </h2>
                        <p className="text-slate-600">
                            Análisis y métricas de rendimiento del módulo {modulo}
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
                                    Dashboard de Métricas
                                </h3>
                            </div>
                            <div className="card-body">
                                <div className="text-center py-12">
                                    <span className="text-6xl mb-4 block">📈</span>
                                    <h3 className="text-lg font-medium text-slate-900 mb-2">Métricas en desarrollo</h3>
                                    <p className="text-slate-600">Sistema de analytics y reportes estará disponible próximamente.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
