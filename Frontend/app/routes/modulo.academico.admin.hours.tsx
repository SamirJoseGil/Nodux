import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import AdminLayout from '~/components/Layout/AdminLayout';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { EventService } from '~/services/eventService';
import type { Event, EventStatus } from '~/types/event';
import { motion } from 'framer-motion';
import FeatureIcon from '~/components/Icons/FeatureIcon';

export const meta: MetaFunction = () => {
    return [
        { title: `Registro de Horas - Académico - Nodux` },
        { name: "description", content: `Gestiona el registro de horas en el módulo académico` },
    ];
};

const DAYS_OF_WEEK = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function HoursAdmin() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await EventService.getEvents();
                // Ordenar eventos por fecha (más recientes primero)
                const sortedData = data.sort((a, b) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                setEvents(sortedData);
            } catch (err) {
                setError('Error al cargar los registros de eventos');
                console.error('Error loading events:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // ✅ Función para obtener el estado de un evento
    const getEventStatus = (event: Event): EventStatus => {
        return EventService.getEventStatus(event);
    };

    // ✅ Función para obtener el color según el estado
    const getStatusColor = (status: EventStatus) => {
        switch (status) {
            case 'completed':
                return 'badge-success';
            case 'pending':
                return 'badge-info';
            case 'missed':
                return 'badge-error';
            case 'cancelled':
                return 'badge-neutral';
            default:
                return 'badge-neutral';
        }
    };

    // ✅ Función para obtener el texto del estado
    const getStatusText = (status: EventStatus) => {
        switch (status) {
            case 'completed':
                return 'Completado';
            case 'pending':
                return 'Pendiente';
            case 'missed':
                return 'No asistió';
            case 'cancelled':
                return 'Cancelado';
            default:
                return 'Desconocido';
        }
    };

    // ✅ Función para calcular duración de un evento
    const getEventDuration = (event: Event): number => {
        if (event.duration) return event.duration;
        if (event.startHour && event.endHour) {
            return event.endHour - event.startHour;
        }
        if (event.startTime && event.endTime) {
            const start = parseInt(event.startTime.split(':')[0]);
            const end = parseInt(event.endTime.split(':')[0]);
            return end - start;
        }
        return 0;
    };

    // Filtrar eventos según el estado seleccionado
    const filteredEvents = filterStatus === 'all'
        ? events
        : events.filter(e => getEventStatus(e) === filterStatus);

    // ✅ Calcular estadísticas
    const totalEvents = events.length;
    const completedEvents = events.filter(e => getEventStatus(e) === 'completed');
    const pendingEvents = events.filter(e => getEventStatus(e) === 'pending');
    const missedEvents = events.filter(e => getEventStatus(e) === 'missed');
    
    const totalHoursCompleted = completedEvents.reduce((sum, e) => sum + getEventDuration(e), 0);
    const totalHoursPending = pendingEvents.reduce((sum, e) => sum + getEventDuration(e), 0);

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
                                        <p className="font-inter text-sm text-zafiro-700">{totalEvents} eventos registrados</p>
                                    </div>
                                </div>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="form-input max-w-xs text-zafiro-900"
                                >
                                    <option value="all" className="bg-white text-zafiro-900">Todos</option>
                                    <option value="completed" className="bg-white text-zafiro-900">Completados</option>
                                    <option value="pending" className="bg-white text-zafiro-900">Pendientes</option>
                                    <option value="missed" className="bg-white text-zafiro-900">No asistió</option>
                                    <option value="cancelled" className="bg-white text-zafiro-900">Cancelados</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                                    <p className="font-inter text-sm text-zafiro-700">Total de Eventos</p>
                                    <p className="font-thicker text-3xl text-zafiro-900">{totalEvents}</p>
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
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-inter text-sm text-zafiro-700">Horas Completadas</p>
                                    <p className="font-thicker text-3xl text-zafiro-900">{totalHoursCompleted}h</p>
                                    <p className="font-inter text-xs text-zafiro-600">{completedEvents.length} eventos</p>
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
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-inter text-sm text-zafiro-700">Horas Pendientes</p>
                                    <p className="font-thicker text-3xl text-zafiro-900">{totalHoursPending}h</p>
                                    <p className="font-inter text-xs text-zafiro-600">{pendingEvents.length} eventos</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="glass-card p-6"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-inter text-sm text-zafiro-700">No Asistió</p>
                                    <p className="font-thicker text-3xl text-zafiro-900">{missedEvents.length}</p>
                                    <p className="font-inter text-xs text-zafiro-600">eventos perdidos</p>
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
                                        Eventos Registrados
                                    </h2>
                                </div>

                                {error ? (
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 text-nodux-naranja">
                                            <FeatureIcon type="lightbulb" size={24} />
                                            <p className="font-inter">{error}</p>
                                        </div>
                                    </div>
                                ) : filteredEvents.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <FeatureIcon type="clock" size={48} className="mx-auto mb-4 text-zafiro-400" />
                                        <p className="font-inter text-zafiro-700">No hay eventos registrados con este filtro</p>
                                    </div>
                                ) : (
                                    <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                                        {filteredEvents.map((event) => {
                                            const status = getEventStatus(event);
                                            const duration = getEventDuration(event);
                                            const eventDate = new Date(event.date);

                                            return (
                                                <motion.div
                                                    key={event.id}
                                                    whileHover={{ scale: 1.02, x: 5 }}
                                                    onClick={() => setSelectedEvent(event)}
                                                    className={`p-4 bg-white/5 backdrop-blur-sm border rounded-xl cursor-pointer transition-all ${
                                                        selectedEvent?.id === event.id ? 'border-nodux-neon' : 'border-zafiro-300'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-start gap-3 mb-2">
                                                                <div className="w-10 h-10 bg-gradient-to-br from-nodux-neon to-nodux-marino rounded-full flex items-center justify-center text-white font-thicker text-sm flex-shrink-0">
                                                                    {event.groupInfo?.mentor?.name.charAt(0) || 'G'}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h3 className="font-inter font-bold text-zafiro-900 mb-1 truncate">
                                                                        {event.groupInfo?.mentor?.name || `Grupo ${event.group}`}
                                                                    </h3>
                                                                    <p className="font-inter text-sm text-zafiro-700 mb-2">
                                                                        📍 {event.location}
                                                                    </p>
                                                                    <div className="flex items-center gap-3 flex-wrap">
                                                                        <span className={`badge ${getStatusColor(status)}`}>
                                                                            {getStatusText(status)}
                                                                        </span>
                                                                        <span className="font-inter text-sm text-zafiro-700">
                                                                            {duration}h
                                                                        </span>
                                                                        {event.groupInfo?.mode && (
                                                                            <span className="badge badge-neutral capitalize">
                                                                                {event.groupInfo.mode}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right ml-4">
                                                            <p className="font-inter text-xs text-zafiro-600">
                                                                {DAYS_OF_WEEK[eventDate.getDay()]}
, {eventDate.toLocaleDateString('es-ES')}
                                                            </p>
                                                            <p className="font-inter text-sm text-zafiro-700 mt-1">
                                                                {event.startTime} - {event.endTime}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Detalles del evento seleccionado */}
                        <div>
                            <div className="glass-card p-6">
                                <h2 className="font-inter text-xl font-bold text-zafiro-900 mb-4">
                                    Detalles del Evento
                                </h2>
                                {selectedEvent ? (
                                    <div className="space-y-4">
                                        <p className="font-inter text-zafiro-700">
                                            <span className="font-bold text-zafiro-900">Grupo:</span> {selectedEvent.groupInfo?.mentor?.name || `Grupo ${selectedEvent.group}`}
                                        </p>
                                        <p className="font-inter text-zafiro-700">
                                            <span className="font-bold text-zafiro-900">Fecha:</span> {new Date(selectedEvent.date).toLocaleDateString('es-ES')}
                                        </p>
                                        <p className="font-inter text-zafiro-700">
                                            <span className="font-bold text-zafiro-900">Hora:</span> {selectedEvent.startTime} - {selectedEvent.endTime}
                                        </p>
                                        <p className="font-inter text-zafiro-700">
                                            <span className="font-bold text-zafiro-900">Ubicación:</span> {selectedEvent.location}
                                        </p>
                                        <p className="font-inter text-zafiro-700">
                                            <span className="font-bold text-zafiro-900">Duración:</span> {getEventDuration(selectedEvent)} horas
                                        </p>
                                        <p className="font-inter text-zafiro-700">
                                            <span className="font-bold text-zafiro-900">Estado:</span> {getStatusText(getEventStatus(selectedEvent))}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="font-inter text-zafiro-700">Selecciona un evento para ver los detalles</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
