import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import AdminLayout from '~/components/Layout/AdminLayout';
import ProtectedRoute from '~/components/ProtectedRoute';
import type { HourRecord } from '~/types/academic';
import TimeIcon from "~/components/Icons/TimeIcon";

export const meta: MetaFunction = () => {
    return [
        { title: `Registro de Horas - Académico - Nodux` },
        {
            name: "description",
            content: `Gestiona el registro de horas en el módulo académico`,
        },
    ];
};

export default function HoursAdmin() {
    const [hours, setHours] = useState<HourRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedHour, setSelectedHour] = useState<HourRecord | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        const fetchHours = async () => {
            setLoading(true);
            setError(null);

            try {
                // const data = await HourService.getHourRecords();
                // Datos de ejemplo mientras el servicio no está implementado
                const data: HourRecord[] = [
                    {
                        id: '1',
                        mentorId: 'm1',
                        mentorName: 'Juan Pérez',
                        projectId: 'p1',
                        projectName: 'Proyecto Alpha',
                        date: '2024-06-10',
                        hours: 4,
                        description: 'Sesión de mentoría sobre React',
                        status: 'pending',
                    },
                    {
                        id: '2',
                        mentorId: 'm2',
                        mentorName: 'María Gómez',
                        projectId: 'p2',
                        projectName: 'Proyecto Beta',
                        date: '2024-06-11',
                        hours: 3,
                        description: 'Revisión de avances y planificación',
                        status: 'approved',
                    },
                    {
                        id: '3',
                        mentorId: 'm3',
                        mentorName: 'Pedro Martínez',
                        projectId: 'p3',
                        projectName: 'Proyecto Gamma',
                        date: '2024-06-12',
                        hours: 5,
                        description: 'Sesión de mentoría sobre Node.js',
                        status: 'pending',
                    },
                ];
                setHours(data);
            } catch (err) {
                setError('Error al cargar los registros de horas. Inténtalo de nuevo más tarde.');
                console.error('Error loading hours:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHours();
    }, []);

    const handleHourSelect = (hour: HourRecord) => {
        setSelectedHour(hour);
    };

    const handleApproveHour = async (hourId: string) => {
        try {
            // Simular aprobación
            setHours(hours.map(h =>
                h.id === hourId ? { ...h, status: 'approved' } : h
            ));

            if (selectedHour?.id === hourId) {
                setSelectedHour({ ...selectedHour, status: 'approved' });
            }
        } catch (error) {
            console.error('Error al aprobar horas:', error);
        }
    };

    const handleRejectHour = async (hourId: string) => {
        try {
            // Simular rechazo
            setHours(hours.map(h =>
                h.id === hourId ? { ...h, status: 'rejected' } : h
            ));

            if (selectedHour?.id === hourId) {
                setSelectedHour({ ...selectedHour, status: 'rejected' });
            }
        } catch (error) {
            console.error('Error al rechazar horas:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'badge-success';
            case 'pending':
                return 'badge-warning';
            case 'rejected':
                return 'badge-error';
            default:
                return 'badge-neutral';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'approved':
                return 'Aprobado';
            case 'pending':
                return 'Pendiente';
            case 'rejected':
                return 'Rechazado';
            default:
                return status;
        }
    };

    const filteredHours = filterStatus === 'all'
        ? hours
        : hours.filter(h => h.status === filterStatus);

    const totalHours = hours.reduce((sum, h) => sum + h.hours, 0);
    const pendingHours = hours.filter(h => h.status === 'pending').length;
    const approvedHours = hours.filter(h => h.status === 'approved').reduce((sum, h) => sum + h.hours, 0);

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <AdminLayout title="Registro de Horas">
                {/* Estadísticas */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
                    <div className="card p-5">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                <TimeIcon size={24} className="text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <dt className="text-sm font-medium text-slate-600">Total de Horas</dt>
                                <dd className="text-2xl font-semibold text-slate-900">{totalHours}</dd>
                            </div>
                        </div>
                    </div>

                    <div className="card p-5">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <dt className="text-sm font-medium text-slate-600">Pendientes</dt>
                                <dd className="text-2xl font-semibold text-slate-900">{pendingHours}</dd>
                            </div>
                        </div>
                    </div>

                    <div className="card p-5">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <dt className="text-sm font-medium text-slate-600">Horas Aprobadas</dt>
                                <dd className="text-2xl font-semibold text-slate-900">{approvedHours}</dd>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Lista de registros */}
                    <div className="lg:col-span-2">
                        <div className="card">
                            <div className="card-header flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Registros de Horas ({filteredHours.length})
                                </h3>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="form-input max-w-xs"
                                >
                                    <option value="all">Todos</option>
                                    <option value="pending">Pendientes</option>
                                    <option value="approved">Aprobados</option>
                                    <option value="rejected">Rechazados</option>
                                </select>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : error ? (
                                <div className="card-body">
                                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                        {error}
                                    </div>
                                </div>
                            ) : filteredHours.length === 0 ? (
                                <div className="card-body text-center py-12">
                                    <span className="text-6xl mb-4 block">⏱️</span>
                                    <h3 className="text-lg font-medium text-slate-900 mb-2">No hay registros</h3>
                                    <p className="text-slate-600">No se encontraron registros con los filtros aplicados.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="table">
                                        <thead className="table-header">
                                            <tr>
                                                <th className="table-header-cell">Mentor</th>
                                                <th className="table-header-cell">Proyecto</th>
                                                <th className="table-header-cell">Fecha</th>
                                                <th className="table-header-cell">Horas</th>
                                                <th className="table-header-cell">Estado</th>
                                                <th className="table-header-cell">
                                                    <span className="sr-only">Acciones</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredHours.map((hour) => (
                                                <tr
                                                    key={hour.id}
                                                    onClick={() => handleHourSelect(hour)}
                                                    className={`table-row cursor-pointer ${selectedHour?.id === hour.id ? 'bg-blue-50' : ''}`}
                                                >
                                                    <td className="table-cell">
                                                        <div className="text-sm font-medium text-slate-900">{hour.mentorName}</div>
                                                    </td>
                                                    <td className="table-cell">
                                                        <div className="text-sm text-slate-900">{hour.projectName}</div>
                                                    </td>
                                                    <td className="table-cell">
                                                        <div className="text-sm text-slate-600">{new Date(hour.date).toLocaleDateString()}</div>
                                                    </td>
                                                    <td className="table-cell">
                                                        <span className="badge badge-info">
                                                            {hour.hours} {hour.hours === 1 ? 'hora' : 'horas'}
                                                        </span>
                                                    </td>
                                                    <td className="table-cell">
                                                        <span className={`badge ${getStatusColor(hour.status)}`}>
                                                            {getStatusText(hour.status)}
                                                        </span>
                                                    </td>
                                                    <td className="table-cell text-right">
                                                        <button
                                                            type="button"
                                                            className="btn-ghost"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleHourSelect(hour);
                                                            }}
                                                        >
                                                            Ver
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Panel de detalle */}
                    <div className="lg:col-span-1">
                        {selectedHour ? (
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        Detalle del Registro
                                    </h3>
                                </div>
                                <div className="card-body space-y-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-slate-600">Mentor</dt>
                                            <dd className="mt-1 text-sm text-slate-900 sm:mt-0 font-semibold">{selectedHour.mentorName}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-slate-600">Proyecto</dt>
                                            <dd className="mt-1 text-sm text-slate-900 sm:mt-0">{selectedHour.projectName}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-slate-600">Fecha</dt>
                                            <dd className="mt-1 text-sm text-slate-900 sm:mt-0">
                                                {new Date(selectedHour.date).toLocaleDateString('es-ES', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-slate-600">Horas</dt>
                                            <dd className="mt-1 text-sm text-slate-900 sm:mt-0">
                                                <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {selectedHour.hours} {selectedHour.hours === 1 ? 'hora' : 'horas'}
                                                </span>
                                            </dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-slate-600">Estado</dt>
                                            <dd className="mt-1 text-sm text-slate-900 sm:mt-0">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedHour.status)}`}>
                                                    {getStatusText(selectedHour.status)}
                                                </span>
                                            </dd>
                                        </div>
                                    </div>

                                    <div>
                                        <dt className="text-sm font-medium text-slate-600 mb-2">Descripción</dt>
                                        <dd className="mt-1 text-sm text-slate-900 bg-gray-50 p-3 rounded-lg">
                                            {selectedHour.description}
                                        </dd>
                                    </div>
                                </div>

                                {selectedHour.status === 'pending' && (
                                    <div className="card-footer flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleRejectHour(selectedHour.id)}
                                            className="btn-secondary bg-red-50 text-red-700 hover:bg-red-100"
                                        >
                                            Rechazar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleApproveHour(selectedHour.id)}
                                            className="btn-primary"
                                        >
                                            Aprobar
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="card p-6 text-center">
                                <p className="text-slate-600">Selecciona un registro para ver sus detalles</p>
                            </div>
                        )}
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
