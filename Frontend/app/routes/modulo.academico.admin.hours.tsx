import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import AdminLayout from '~/components/Layout/AdminLayout';
import ProtectedRoute from '~/components/ProtectedRoute';
import { HourService } from '~/services/academicService';
import type { HourRecord } from '~/types/academic';

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
                const data = await HourService.getHourRecords();
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
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
                    <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-200">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total de Horas</dt>
                                        <dd className="text-2xl font-semibold text-gray-900">{totalHours}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-200">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Pendientes</dt>
                                        <dd className="text-2xl font-semibold text-gray-900">{pendingHours}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-200">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Horas Aprobadas</dt>
                                        <dd className="text-2xl font-semibold text-gray-900">{approvedHours}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Lista de registros */}
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg border border-gray-200">
                            <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg leading-6 font-bold text-gray-900">
                                            Registros de Horas
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-600">
                                            {filteredHours.length} {filteredHours.length === 1 ? 'registro' : 'registros'}
                                        </p>
                                    </div>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="all">Todos</option>
                                        <option value="pending">Pendientes</option>
                                        <option value="approved">Aprobados</option>
                                        <option value="rejected">Rechazados</option>
                                    </select>
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                </div>
                            ) : error ? (
                                <div className="px-4 py-5 sm:px-6 text-red-500">{error}</div>
                            ) : filteredHours.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay registros</h3>
                                    <p className="mt-1 text-sm text-gray-500">No se encontraron registros con los filtros aplicados.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Mentor
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Proyecto
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Fecha
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Horas
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Estado
                                                </th>
                                                <th scope="col" className="relative px-6 py-3">
                                                    <span className="sr-only">Acciones</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredHours.map((hour) => (
                                                <tr
                                                    key={hour.id}
                                                    onClick={() => handleHourSelect(hour)}
                                                    className={`hover:bg-indigo-50 cursor-pointer transition-colors ${selectedHour?.id === hour.id ? 'bg-indigo-50' : ''}`}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{hour.mentorName}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{hour.projectName}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">{new Date(hour.date).toLocaleDateString()}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                            {hour.hours} {hour.hours === 1 ? 'hora' : 'horas'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(hour.status)}`}>
                                                            {getStatusText(hour.status)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            type="button"
                                                            className="text-indigo-600 hover:text-indigo-900 font-medium"
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
                            <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg border border-gray-200">
                                <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                                    <h3 className="text-lg leading-6 font-bold text-gray-900">
                                        Detalle del Registro
                                    </h3>
                                </div>
                                <div className="border-t border-gray-200">
                                    <dl>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Mentor</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold">{selectedHour.mentorName}</dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Proyecto</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedHour.projectName}</dd>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Fecha</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {new Date(selectedHour.date).toLocaleDateString('es-ES', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Horas</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {selectedHour.hours} {selectedHour.hours === 1 ? 'hora' : 'horas'}
                                                </span>
                                            </dd>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Estado</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedHour.status)}`}>
                                                    {getStatusText(selectedHour.status)}
                                                </span>
                                            </dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500 mb-2">Descripción</dt>
                                            <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                                                {selectedHour.description}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                {selectedHour.status === 'pending' && (
                                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-2 border-t border-gray-200">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                        >
                                            Rechazar
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                        >
                                            Aprobar
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg p-6 text-center border border-gray-200">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="mt-2 text-gray-500">Selecciona un registro para ver sus detalles</p>
                            </div>
                        )}
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
