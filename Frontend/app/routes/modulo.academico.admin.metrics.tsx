import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import AdminLayout from '~/components/Layout/AdminLayout';
import ProtectedRoute from '~/components/ProtectedRoute';
import ChartIcon from "~/components/Icons/ChartIcon";
import TrendUpIcon from "~/components/Icons/TrendUpIcon";
import TrendDownIcon from "~/components/Icons/TrendDownIcon";
import TrendStableIcon from "~/components/Icons/TrendStableIcon";
import StarRatingIcon from "~/components/Icons/StarRatingIcon";

export const meta: MetaFunction = () => {
    return [
        { title: `Métricas Académicas - Nodux` },
        {
            name: "description",
            content: `Dashboard de métricas y analytics académicos`,
        },
    ];
};

interface MetricData {
    id: string;
    name: string;
    value: number;
    previousValue: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
    percentage: number;
}

interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        color: string;
    }[];
}

export default function MetricsAdmin() {
    const [metrics, setMetrics] = useState<MetricData[]>([]);
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('month');

    useEffect(() => {
        const fetchMetrics = async () => {
            setLoading(true);
            try {
                // const data = await MetricService.getMetrics();
                // Por el momento datos fallback para este servicio
                const data = [
                    { id: '1', name: 'Total de Mentores', value: 45, type: 'count' },
                    { id: '2', name: 'Total de Estudiantes', value: 320, type: 'count' },
                    { id: '3', name: 'Proyectos Completados', value: 120, type: 'count' },
                    { id: '4', name: 'Horas de Mentoría', value: 850, type: 'hours' },
                ];

                // Adaptar los datos si es necesario
                setMetrics(data.map((m: any) => ({
                    id: m.id,
                    name: m.name,
                    value: Number(m.value),
                    previousValue: 0, // Si tienes histórico, ponlo aquí
                    unit: m.type === 'count' ? '' : m.type,
                    trend: 'stable', // Si tienes tendencia, ponla aquí
                    percentage: 0,   // Si tienes porcentaje, ponlo aquí
                })));
                // setChartData(...) // Si tienes datos de gráfico desde el backend
            } catch (error) {
                console.error('Error al cargar métricas:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, [selectedPeriod]);

    const getTrendIcon = (trend: string, className = "w-5 h-5") => {
        switch (trend) {
            case 'up':
                return <TrendUpIcon className={`text-green-600 ${className}`} size={20} />;
            case 'down':
                return <TrendDownIcon className={`text-red-600 ${className}`} size={20} />;
            case 'stable':
                return <TrendStableIcon className={`text-gray-600 ${className}`} size={20} />;
            default:
                return <ChartIcon className={`text-gray-600 ${className}`} size={20} />;
        }
    };

    const getTrendColor = (trend: string) => {
        switch (trend) {
            case 'up':
                return 'text-green-600';
            case 'down':
                return 'text-red-600';
            case 'stable':
                return 'text-gray-600';
            default:
                return 'text-gray-600';
        }
    };

    // Datos simulados para rankings
    const topMentors = [
        { name: 'María García', hours: 245, students: 12, rating: 4.8 },
        { name: 'Juan Pérez', hours: 198, students: 8, rating: 4.7 },
        { name: 'Carlos López', hours: 156, students: 6, rating: 4.6 },
        { name: 'Ana Martínez', hours: 134, students: 5, rating: 4.5 },
        { name: 'Roberto Sánchez', hours: 112, students: 4, rating: 4.4 }
    ];

    const topProjects = [
        { name: 'Plataforma E-learning', completion: 95, students: 24, mentor: 'María García' },
        { name: 'App Móvil Finanzas', completion: 87, students: 18, mentor: 'Juan Pérez' },
        { name: 'Sistema de Gestión', completion: 82, students: 15, mentor: 'Carlos López' },
        { name: 'Dashboard Analytics', completion: 78, students: 12, mentor: 'Ana Martínez' }
    ];

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <AdminLayout title="Métricas y Analytics">
                {/* Controles de filtro */}
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-slate-900">
                        Dashboard de Métricas
                    </h2>
                    <div className="flex gap-4">
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="form-input max-w-xs"
                        >
                            <option value="week">Última semana</option>
                            <option value="month">Último mes</option>
                            <option value="quarter">Último trimestre</option>
                            <option value="year">Último año</option>
                        </select>
                        <button className="btn-primary">
                            Exportar Reporte
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        {/* Métricas principales */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                            {metrics.map((metric) => (
                                <div key={metric.id} className="card p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-medium text-slate-600">
                                            {metric.name}
                                        </h3>
                                        {getTrendIcon(metric.trend)}
                                    </div>
                                    <div className="flex items-baseline">
                                        <span className="text-3xl font-semibold text-slate-900">
                                            {metric.value}
                                        </span>
                                        <span className="ml-1 text-sm text-slate-600">
                                            {metric.unit}
                                        </span>
                                    </div>
                                    <div className={`mt-2 flex items-center text-sm ${getTrendColor(metric.trend)}`}>
                                        <span>
                                            {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '' : ''}
                                            {metric.percentage}%
                                        </span>
                                        <span className="ml-1 text-slate-600">
                                            vs período anterior
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Gráficos y rankings */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Gráfico de tendencias */}
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        Tendencias de Crecimiento
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                                        <div className="text-center">
                                            <ChartIcon size={64} className="mx-auto mb-4 text-gray-400" />
                                            <p className="text-slate-600 font-medium">Gráfico de tendencias</p>
                                            <p className="text-sm text-slate-500">Integración con Chart.js próximamente</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Top Mentores */}
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        Top Mentores
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <div className="space-y-4">
                                        {topMentors.map((mentor, index) => (
                                            <div key={mentor.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                        <span className="text-sm font-bold text-blue-800">
                                                            {index + 1}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">
                                                            {mentor.name}
                                                        </p>
                                                        <p className="text-xs text-slate-600">
                                                            {mentor.hours} horas • {mentor.students} estudiantes
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center">
                                                        <span className="text-sm font-medium text-slate-900">
                                                            {mentor.rating}
                                                        </span>
                                                        <StarRatingIcon size={16} className="ml-1 text-yellow-500" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Proyectos destacados y análisis adicional */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Top Proyectos */}
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        Proyectos Destacados
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <div className="space-y-4">
                                        {topProjects.map((project, index) => (
                                            <div key={project.name} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-medium text-slate-900">{project.name}</h4>
                                                    <span className="badge badge-info">{project.completion}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full"
                                                        style={{ width: `${project.completion}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between text-sm text-slate-600">
                                                    <span>{project.students} estudiantes</span>
                                                    <span>Mentor: {project.mentor}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Análisis de rendimiento */}
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        Análisis de Rendimiento
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-slate-700">Productividad General</span>
                                                <span className="text-sm text-slate-600">85%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-slate-700">Participación Estudiantil</span>
                                                <span className="text-sm text-slate-600">92%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-slate-700">Calidad de Mentorías</span>
                                                <span className="text-sm text-slate-600">78%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-slate-700">Retención de Estudiantes</span>
                                                <span className="text-sm text-slate-600">94%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </AdminLayout>
        </ProtectedRoute>
    );
}
