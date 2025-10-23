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
        { title: `Calendario - ${moduleName} - Nodux` },
        {
            name: "description",
            content: `Gestiona el calendario en el módulo ${moduleName}`,
        },
    ];
};

export default function CalendarAdmin() {
    const { modulo } = useParams();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                // Simular carga de eventos
                const mockEvents = [
                    { id: 1, title: 'Reunión de proyecto', date: '2024-02-20', type: 'meeting' },
                    { id: 2, title: 'Entrega de deliverable', date: '2024-02-22', type: 'deadline' },
                    { id: 3, title: 'Sesión de mentoría', date: '2024-02-25', type: 'mentoring' },
                ];
                setEvents(mockEvents);
            } catch (error) {
                console.error('Error al cargar eventos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [modulo]);

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <AdminLayout title="Calendario">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                            Calendario - {modulo}
                        </h2>
                        <p className="text-slate-600">
                            Gestiona eventos, reuniones y fechas importantes del módulo {modulo}
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
                                    Próximos Eventos
                                </h3>
                            </div>
                            <div className="card-body">
                                <div className="text-center py-12">
                                    <span className="text-6xl mb-4 block">📅</span>
                                    <h3 className="text-lg font-medium text-slate-900 mb-2">Calendario en desarrollo</h3>
                                    <p className="text-slate-600">Esta funcionalidad estará disponible próximamente.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
