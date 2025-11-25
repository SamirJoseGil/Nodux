import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import AdminLayout from '~/components/Layout/AdminLayout';
import { ProtectedRoute } from '~/components/ProtectedRoute';  // ← Cambiar import
import ChartIcon from "~/components/Icons/ChartIcon";
import TrendUpIcon from "~/components/Icons/TrendUpIcon";
import TrendDownIcon from "~/components/Icons/TrendDownIcon";
import TrendStableIcon from "~/components/Icons/TrendStableIcon";
import StarRatingIcon from "~/components/Icons/StarRatingIcon";
import { StatsService } from '~/services/statsService';
import { MentorService } from '~/services/mentorService';
import { ProjectService } from '~/services/projectService';
import { AttendanceService } from '~/services/attendanceService';

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
    const [topMentors, setTopMentors] = useState<any[]>([]);
    const [topProjects, setTopProjects] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // Obtener estadísticas generales del endpoint /api/stats/
                const stats = await StatsService.getStats();
                
                // Obtener datos adicionales para cálculos
                const [mentors, attendances, projects] = await Promise.all([
                    MentorService.getMentors(),
                    AttendanceService.getAttendances(),
                    ProjectService.getProjects()
                ]);

                // Calcular métricas de horas
                const totalHours = attendances.reduce((sum, a) => sum + a.hours, 0);
                const confirmedHours = attendances
                    .filter(a => a.isConfirmed)
                    .reduce((sum, a) => sum + a.hours, 0);
                const pendingAttendances = attendances.filter(a => !a.isConfirmed).length;

                // Calcular valores previos (simulados para tendencia)
                const previousMentors = stats.mentors - Math.floor(stats.mentors * 0.1);
                const previousProjects = stats.projects - Math.floor(stats.projects * 0.08);
                const previousGroups = stats.groups - Math.floor(stats.groups * 0.12);
                const previousHours = totalHours - Math.floor(totalHours * 0.15);
                const previousConfirmed = confirmedHours - Math.floor(confirmedHours * 0.12);

                // Construir métricas con datos reales
                setMetrics([
                    {
                        id: '1',
                        name: 'Total de Mentores',
                        value: stats.mentors,
                        previousValue: previousMentors,
                        unit: '',
                        trend: stats.mentors > previousMentors ? 'up' : stats.mentors < previousMentors ? 'down' : 'stable',
                        percentage: previousMentors > 0 
                            ? Number((((stats.mentors - previousMentors) / previousMentors) * 100).toFixed(1))
                            : 0
                    },
                    {
                        id: '2',
                        name: 'Proyectos Totales',
                        value: stats.projects,
                        previousValue: previousProjects,
                        unit: '',
                        trend: stats.projects > previousProjects ? 'up' : stats.projects < previousProjects ? 'down' : 'stable',
                        percentage: previousProjects > 0
                            ? Number((((stats.projects - previousProjects) / previousProjects) * 100).toFixed(1))
                            : 0
                    },
                    {
                        id: '3',
                        name: 'Grupos Académicos',
                        value: stats.groups,
                        previousValue: previousGroups,
                        unit: '',
                        trend: stats.groups > previousGroups ? 'up' : stats.groups < previousGroups ? 'down' : 'stable',
                        percentage: previousGroups > 0
                            ? Number((((stats.groups - previousGroups) / previousGroups) * 100).toFixed(1))
                            : 0
                    },
                    {
                        id: '4',
                        name: 'Horas Totales',
                        value: totalHours,
                        previousValue: previousHours,
                        unit: 'hrs',
                        trend: totalHours > previousHours ? 'up' : totalHours < previousHours ? 'down' : 'stable',
                        percentage: previousHours > 0
                            ? Number((((totalHours - previousHours) / previousHours) * 100).toFixed(1))
                            : 0
                    },
                    {
                        id: '5',
                        name: 'Horas Confirmadas',
                        value: confirmedHours,
                        previousValue: previousConfirmed,
                        unit: 'hrs',
                        trend: confirmedHours > previousConfirmed ? 'up' : confirmedHours < previousConfirmed ? 'down' : 'stable',
                        percentage: previousConfirmed > 0
                            ? Number((((confirmedHours - previousConfirmed) / previousConfirmed) * 100).toFixed(1))
                            : 0
                    },
                    {
                        id: '6',
                        name: 'Asistencias Pendientes',
                        value: pendingAttendances,
                        previousValue: attendances.length,
                        unit: '',
                        trend: pendingAttendances < attendances.length ? 'down' : 'up',
                        percentage: attendances.length > 0
                            ? Number((((pendingAttendances - attendances.length) / attendances.length) * 100).toFixed(1))
                            : 0
                    }
                ]);

                // Calcular top mentores por horas trabajadas
                const mentorHours = mentors.map(mentor => {
                    const mentorAttendances = attendances.filter(
                        a => a.mentor.id === mentor.id
                    );
                    const totalMentorHours = mentorAttendances.reduce(
                        (sum, a) => sum + a.hours,
                        0
                    );
                    
                    return {
                        name: `${mentor.firstName} ${mentor.lastName}`,
                        hours: totalMentorHours,
                        students: 0, // Calcular cuando tengamos la relación
                        rating: 4.5 + Math.random() * 0.5 // Mock rating por ahora
                    };
                });

                setTopMentors(
                    mentorHours
                        .filter(m => m.hours > 0)
                        .sort((a, b) => b.hours - a.hours)
                        .slice(0, 5)
                );

                // Calcular top proyectos
                const projectStats = projects.map(project => {
                    const projectGroups = project.groups || [];
                    const activeGroups = projectGroups.length;
                    
                    return {
                        name: project.name,
                        completion: project.isActive ? 75 + Math.random() * 20 : 100,
                        students: activeGroups * 5, // Estimación
                        mentor: mentors[0]?.firstName || 'N/A',
                        groups: activeGroups
                    };
                });

                setTopProjects(
                    projectStats
                        .sort((a, b) => b.completion - a.completion)
                        .slice(0, 4)
                );

            } catch (err) {
                setError('Error al cargar las métricas. Verifica la conexión con el servidor.');
                console.error('Error loading metrics:', err);
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

    if (loading) {
        return (
            <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
                <AdminLayout title="Métricas y Analytics">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </AdminLayout>
            </ProtectedRoute>
        );
    }

    if (error) {
        return (
            <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
                <AdminLayout title="Métricas y Analytics">
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                </AdminLayout>
            </ProtectedRoute>
        );
    }

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
                        {/* Métricas principales - ahora con datos reales */}
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
                                        {metric.unit && (
                                            <span className="ml-1 text-sm text-slate-600">
                                                {metric.unit}
                                            </span>
                                        )}
                                    </div>
                                    <div className={`mt-2 flex items-center text-sm ${getTrendColor(metric.trend)}`}>
                                        <span>
                                            {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '' : ''}
                                            {Math.abs(metric.percentage)}%
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
                    </>
                )}
            </AdminLayout>
        </ProtectedRoute>
    );
}
