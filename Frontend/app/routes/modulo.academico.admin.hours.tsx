import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import AdminLayout from '~/components/Layout/AdminLayout';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { AttendanceService } from '~/services/attendanceService';
import type { Attendance } from '~/types/attendance';
import { motion } from 'framer-motion';
import FeatureIcon from '~/components/Icons/FeatureIcon';

export const meta: MetaFunction = () => {
    return [
        { title: `Registro de Horas - Académico - Nodux` },
        { name: "description", content: `Gestiona el registro de horas en el módulo académico` },
    ];
};

export default function HoursAdmin() {
    const [hours, setHours] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedHour, setSelectedHour] = useState<Attendance | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        const fetchHours = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await AttendanceService.getAttendances();
                setHours(data);
            } catch (err) {
                setError('Error al cargar los registros de horas');
                console.error('Error loading hours:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHours();
    }, []);

    const handleApproveHour = async (hourId: string) => {
        try {
            await AttendanceService.confirmAttendance(hourId);
            
            setHours(hours.map(h =>
                h.id === hourId ? { ...h, isConfirmed: true } : h
            ));

            if (selectedHour?.id === hourId) {
                setSelectedHour({ ...selectedHour, isConfirmed: true });
            }
        } catch (error) {
            console.error('Error al aprobar horas:', error);
        }
    };

    const getStatusColor = (isConfirmed: boolean) => {
        return isConfirmed ? 'badge-success' : 'badge-warning';
    };

    const getStatusText = (isConfirmed: boolean) => {
        return isConfirmed ? 'Confirmado' : 'Pendiente';
    };

    const filteredHours = filterStatus === 'all'
        ? hours
        : filterStatus === 'confirmed'
        ? hours.filter(h => h.isConfirmed)
        : hours.filter(h => !h.isConfirmed);

    const totalHours = hours.reduce((sum, h) => sum + h.hours, 0);
    const pendingHours = hours.filter(h => !h.isConfirmed).length;
    const confirmedHours = hours.filter(h => h.isConfirmed).reduce((sum, h) => sum + h.hours, 0);

    if (loading) {
        return (
            <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
                <AdminLayout title="Registro de Horas">
                    <div className="flex justify-center items-center h-64">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="text-nodux-neon text-lg font-inter"
                        >
                            Cargando registros...
                        </motion.div>
                    </div>
                </AdminLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <AdminLayout title="Registro de Horas">
                <div className="min-h-screen -m-6 p-6">
                    {/* Header */}
                    <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        className="mb-8"
                    >
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-nodux-amarillo to-nodux-naranja rounded-xl flex items-center justify-center">
                                        <FeatureIcon type="clock" size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h1 className="font-thicker text-2xl text-zafiro-900">Registro de Horas</h1>
                                        <p className="font-inter text-sm text-zafiro-700">{hours.length} registros totales</p>
                                    </div>
                                </div>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="form-input max-w-xs text-zafiro-900"
                                >
                                    <option value="all" className="bg-white text-zafiro-900">Todos</option>
                                    <option value="confirmed" className="bg-white text-zafiro-900">Confirmados</option>
                                    <option value="pending" className="bg-white text-zafiro-900">Pendientes</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-6"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-nodux-neon to-nodux-marino rounded-xl flex items-center justify-center">
                                    <FeatureIcon type="clock" size={24} className="text-white" />
                                </div>
                                <div>
                                    <p className="font-inter text-sm text-zafiro-700">Total de Horas</p>
                                    <p className="font-thicker text-3xl text-zafiro-900">{totalHours}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card p-6"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-nodux-amarillo to-nodux-naranja rounded-xl flex items-center justify-center">
                                    <FeatureIcon type="lightbulb" size={24} className="text-white" />
                                </div>
                                <div>
                                    <p className="font-inter text-sm text-zafiro-700">Pendientes</p>
                                    <p className="font-thicker text-3xl text-zafiro-900">{pendingHours}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card p-6"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-nodux-marino to-nodux-amarillo rounded-xl flex items-center justify-center">
                                    <FeatureIcon type="target" size={24} className="text-white" />
                                </div>
                                <div>
                                    <p className="font-inter text-sm text-zafiro-700">Confirmadas</p>
                                    <p className="font-thicker text-3xl text-zafiro-900">{confirmedHours}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Lista de registros */}
                        <div className="lg:col-span-2">
                            <div className="glass-card overflow-hidden">
                                <div className="px-6 py-4 border-b border-zafiro-300">
                                    <h2 className="font-inter text-xl font-bold text-zafiro-900">
                                        Registros de Asistencia
                                    </h2>
                                </div>

                                {error ? (
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 text-nodux-naranja">
                                            <FeatureIcon type="lightbulb" size={24} />
                                            <p className="font-inter">{error}</p>
                                        </div>
                                    </div>
                                ) : filteredHours.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <FeatureIcon type="clock" size={48} className="mx-auto mb-4 text-zafiro-400" />
                                        <p className="font-inter text-zafiro-700">No hay registros disponibles</p>
                                    </div>
                                ) : (
                                    <div className="p-6 space-y-4">
                                        {filteredHours.map((hour) => (
                                            <motion.div
                                                key={hour.id}
                                                whileHover={{ scale: 1.02, x: 5 }}
                                                onClick={() => setSelectedHour(hour)}
                                                className={`p-4 bg-white/5 backdrop-blur-sm border rounded-xl cursor-pointer transition-all ${
                                                    selectedHour?.id === hour.id ? 'border-nodux-neon' : 'border-zafiro-300'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="font-inter font-bold text-zafiro-900 mb-1">
                                                            {hour.mentor.firstName} {hour.mentor.lastName}
                                                        </h3>
                                                        <p className="font-inter text-sm text-zafiro-700 mb-2">
                                                            {hour.mentor.email}
                                                        </p>
                                                        <div className="flex items-center gap-3">
                                                            <span className={`badge ${getStatusColor(hour.isConfirmed)}`}>
                                                                {getStatusText(hour.isConfirmed)}
                                                            </span>
                                                            <span className="font-inter text-sm text-zafiro-700">
                                                                {hour.hours} horas
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-inter text-xs text-zafiro-600">
                                                            {new Date(hour.startDatetime).toLocaleDateString('es-ES')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Panel de detalle */}
                        <div className="lg:col-span-1">
                            {selectedHour ? (
                                <div className="glass-card overflow-hidden">
                                    <div className="px-6 py-4 border-b border-zafiro-300">
                                        <h3 className="font-inter text-lg font-bold text-zafiro-900">
                                            Detalles del Registro
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Mentor</span>
                                            <p className="font-inter text-zafiro-900 mt-1">
                                                {selectedHour.mentor.firstName} {selectedHour.mentor.lastName}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Email</span>
                                            <p className="font-inter text-zafiro-900 mt-1">{selectedHour.mentor.email}</p>
                                        </div>
                                        <div>
                                            <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Horas</span>
                                            <p className="font-thicker text-2xl text-zafiro-900 mt-1">{selectedHour.hours}</p>
                                        </div>
                                        <div>
                                            <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Estado</span>
                                            <p className="mt-1">
                                                <span className={`badge ${getStatusColor(selectedHour.isConfirmed)}`}>
                                                    {getStatusText(selectedHour.isConfirmed)}
                                                </span>
                                            </p>
                                        </div>
                                        <div>
                                            <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Fecha</span>
                                            <p className="font-inter text-zafiro-900 mt-1">
                                                {new Date(selectedHour.startDatetime).toLocaleDateString('es-ES', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    {!selectedHour.isConfirmed && (
                                        <div className="px-6 py-4 border-t border-zafiro-300">
                                            <button
                                                onClick={() => handleApproveHour(selectedHour.id)}
                                                className="btn-primary w-full"
                                            >
                                                Aprobar Horas
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="glass-card p-8 text-center">
                                    <FeatureIcon type="clock" size={48} className="mx-auto mb-4 text-zafiro-400" />
                                    <p className="font-inter text-zafiro-700">
                                        Selecciona un registro para ver sus detalles
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
