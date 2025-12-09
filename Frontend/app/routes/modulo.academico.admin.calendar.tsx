import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import AdminLayout from '~/components/Layout/AdminLayout';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { EventService } from '~/services/eventService';
import { ProjectService } from '~/services/academicService';
import { GroupService } from '~/services/academicService';
import type { Event, EventStatus } from '~/types/event';
import type { Project, Group } from '~/types/academic';
import { motion, AnimatePresence } from 'framer-motion';
import FeatureIcon from '~/components/Icons/FeatureIcon';

export const meta: MetaFunction = () => {
    return [
        { title: `Calendario - Académico - Nodux` },
        { name: "description", content: `Calendario de eventos académicos` },
    ];
};

const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function CalendarAdmin() {
    const [events, setEvents] = useState<Event[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProjectGroups, setSelectedProjectGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creatingEvent, setCreatingEvent] = useState(false);
    const [formData, setFormData] = useState({
        projectId: '',
        groupId: '',
        location: '',
        date: '',
        startDate: '',
        endDate: '',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
    const [processingEvent, setProcessingEvent] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventsData, projectsData] = await Promise.all([
                    EventService.getEvents(),
                    ProjectService.getProjects()
                ]);
                setEvents(eventsData);
                setProjects(projectsData);
            } catch (error) {
                console.error('Error al cargar datos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Cargar grupos cuando se selecciona un proyecto
    useEffect(() => {
        const fetchGroups = async () => {
            if (formData.projectId) {
                try {
                    const groupsData = await GroupService.getGroups(formData.projectId);
                    setSelectedProjectGroups(groupsData);
                } catch (error) {
                    console.error('Error al cargar grupos:', error);
                    setSelectedProjectGroups([]);
                }
            } else {
                setSelectedProjectGroups([]);
            }
        };

        fetchGroups();
    }, [formData.projectId]);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

        return { daysInMonth, startingDayOfWeek };
    };

    const getEventsForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return events.filter(event => event.date === dateStr);
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: startingDayOfWeek }, (_, i) => i);

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleDayClick = (day: number) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(date);
        const dayEvents = getEventsForDate(date);
        if (dayEvents.length > 0) {
            setSelectedEvent(dayEvents[0]);
        } else {
            setSelectedEvent(null);
        }
    };

    const handleOpenCreateModal = () => {
        setShowCreateModal(true);
        // Pre-rellenar la fecha si hay una seleccionada
        if (selectedDate) {
            const dateStr = selectedDate.toISOString().split('T')[0];
            setFormData(prev => ({
                ...prev,
                date: dateStr,
                startDate: dateStr,
                endDate: dateStr
            }));
        }
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setFormData({
            projectId: '',
            groupId: '',
            location: '',
            date: '',
            startDate: '',
            endDate: '',
        });
        setFormErrors({});
        setSelectedProjectGroups([]);
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.projectId) {
            errors.projectId = 'Selecciona un proyecto';
        }
        if (!formData.groupId) {
            errors.groupId = 'Selecciona un grupo';
        }
        if (!formData.location) {
            errors.location = 'La ubicación es requerida';
        }
        if (!formData.date) {
            errors.date = 'La fecha del evento es requerida';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setCreatingEvent(true);
        try {
            console.log('📤 Creando evento:', formData);

            const newEvent = await EventService.createGroupEvent(
                formData.projectId,
                formData.groupId,
                {
                    location: formData.location,
                    date: formData.date,
                    startDate: formData.startDate || formData.date,
                    endDate: formData.endDate || formData.date,
                }
            );

            console.log('✅ Evento creado:', newEvent);

            // Actualizar la lista de eventos
            setEvents(prev => [...prev, newEvent]);

            // Cerrar modal y limpiar formulario
            handleCloseCreateModal();

            // Si la fecha del nuevo evento coincide con la seleccionada, actualizar la vista
            if (selectedDate && formData.date === selectedDate.toISOString().split('T')[0]) {
                setSelectedEvent(newEvent);
            }

            alert('Evento creado exitosamente');
        } catch (error: any) {
            console.error('❌ Error al crear evento:', error);
            alert(error.message || 'Error al crear el evento');
        } finally {
            setCreatingEvent(false);
        }
    };

    // ✅ Función para obtener el estado de un evento
    const getEventStatus = (event: Event): EventStatus => {
        return EventService.getEventStatus(event);
    };

    // ✅ Función para obtener el color según el estado
    const getStatusColor = (status: EventStatus) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500/20 border-green-500 text-green-700';
            case 'pending':
                return 'bg-blue-500/20 border-blue-500 text-blue-700';
            case 'missed':
                return 'bg-red-500/20 border-red-500 text-red-700';
            case 'cancelled':
                return 'bg-gray-500/20 border-gray-500 text-gray-700';
            default:
                return 'bg-zafiro-500/20 border-zafiro-500 text-zafiro-700';
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

    // ✅ Función para obtener el ícono del estado
    const getStatusIcon = (status: EventStatus) => {
        switch (status) {
            case 'completed':
                return '✓';
            case 'pending':
                return '○';
            case 'missed':
                return '✕';
            case 'cancelled':
                return '⊗';
            default:
                return '?';
        }
    };

    // ✅ Marcar evento como completado
    const handleMarkAsCompleted = async (event: Event) => {
        if (!event.groupInfo?.project) {
            alert('No se puede marcar como completado: falta información del proyecto');
            return;
        }

        setProcessingEvent(true);
        try {
            const updatedEvent = await EventService.markEventAsCompleted(
                String(event.groupInfo.project),
                event.group,
                event.id
            );

            // Actualizar la lista de eventos
            setEvents(events.map(e => e.id === event.id ? updatedEvent : e));
            
            // Actualizar el evento seleccionado si es el mismo
            if (selectedEvent?.id === event.id) {
                setSelectedEvent(updatedEvent);
            }

            alert('Evento marcado como completado');
        } catch (error: any) {
            alert(error.message || 'Error al marcar evento como completado');
        } finally {
            setProcessingEvent(false);
        }
    };

    // ✅ Marcar evento como perdido (mentor no asistió)
    const handleMarkAsMissed = async (event: Event) => {
        if (!event.groupInfo?.project) {
            alert('No se puede marcar como perdido: falta información del proyecto');
            return;
        }

        const notes = prompt('Razón por la que el mentor no asistió (opcional):');
        
        setProcessingEvent(true);
        try {
            const updatedEvent = await EventService.markEventAsMissed(
                String(event.groupInfo.project),
                event.group,
                event.id,
                notes || undefined
            );

            // Actualizar la lista de eventos
            setEvents(events.map(e => e.id === event.id ? updatedEvent : e));
            
            // Actualizar el evento seleccionado si es el mismo
            if (selectedEvent?.id === event.id) {
                setSelectedEvent(updatedEvent);
            }

            alert('Evento marcado como perdido - Mentor no asistió');
        } catch (error: any) {
            alert(error.message || 'Error al marcar evento como perdido');
        } finally {
            setProcessingEvent(false);
        }
    };

    if (loading) {
        return (
            <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
                <AdminLayout title="Calendario">
                    <div className="flex justify-center items-center h-64">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="text-nodux-neon text-lg font-inter"
                        >
                            Cargando calendario...
                        </motion.div>
                    </div>
                </AdminLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <AdminLayout title="Calendario">
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
                                    <div className="w-12 h-12 bg-gradient-to-br from-nodux-neon to-nodux-marino rounded-xl flex items-center justify-center">
                                        <FeatureIcon type="calendar" size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h1 className="font-thicker text-2xl text-zafiro-900">Calendario Académico</h1>
                                        <p className="font-inter text-sm text-zafiro-700">{events.length} eventos programados</p>
                                    </div>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={handleOpenCreateModal}
                                    className="btn-primary"
                                >
                                    <FeatureIcon type="calendar" size={20} className="inline mr-2" />
                                    Crear Evento
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Calendario */}
                        <div className="lg:col-span-2">
                            <div className="glass-card overflow-hidden">
                                {/* Header del calendario */}
                                <div className="px-6 py-4 border-b border-zafiro-300 flex items-center justify-between">
                                    <button
                                        onClick={prevMonth}
                                        className="btn-ghost text-zafiro-900"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <h2 className="font-thicker text-xl text-zafiro-900">
                                        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                                    </h2>
                                    <button
                                        onClick={nextMonth}
                                        className="btn-ghost text-zafiro-900"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Grid del calendario */}
                                <div className="p-6">
                                    <div className="grid grid-cols-7 gap-2 mb-4">
                                        {DAYS_OF_WEEK.map((day) => (
                                            <div key={day} className="text-center font-inter font-bold text-zafiro-700 text-sm py-2">
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-2">
                                        {emptyDays.map((_, index) => (
                                            <div key={`empty-${index}`} className="aspect-square" />
                                        ))}
                                        {calendarDays.map((day) => {
                                            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                                            const dayEvents = getEventsForDate(date);
                                            const isSelected = selectedDate?.getDate() === day && 
                                                             selectedDate?.getMonth() === currentDate.getMonth();
                                            const isToday = new Date().getDate() === day && 
                                                          new Date().getMonth() === currentDate.getMonth() &&
                                                          new Date().getFullYear() === currentDate.getFullYear();

                                            // ✅ Contar eventos por estado
                                            const completedCount = dayEvents.filter(e => getEventStatus(e) === 'completed').length;
                                            const missedCount = dayEvents.filter(e => getEventStatus(e) === 'missed').length;
                                            const pendingCount = dayEvents.filter(e => getEventStatus(e) === 'pending').length;

                                            return (
                                                <motion.button
                                                    key={day}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleDayClick(day)}
                                                    className={`aspect-square rounded-xl p-2 relative transition-all font-inter font-semibold ${
                                                        isSelected
                                                            ? 'bg-nodux-neon text-white shadow-neon'
                                                            : isToday
                                                            ? 'bg-nodux-marino/20 text-nodux-marino border-2 border-nodux-marino'
                                                            : dayEvents.length > 0
                                                            ? 'bg-nodux-neon/10 text-zafiro-900 hover:bg-nodux-neon/20 border border-nodux-neon/30'
                                                            : 'bg-white/50 text-zafiro-700 hover:bg-white/70 border border-zafiro-200'
                                                    }`}
                                                >
                                                    <span>{day}</span>
                                                    
                                                    {/* ✅ Indicadores de estado de eventos */}
                                                    {dayEvents.length > 0 && (
                                                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                                                            {completedCount > 0 && (
                                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" title={`${completedCount} completado(s)`} />
                                                            )}
                                                            {pendingCount > 0 && (
                                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" title={`${pendingCount} pendiente(s)`} />
                                                            )}
                                                            {missedCount > 0 && (
                                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" title={`${missedCount} perdido(s)`} />
                                                            )}
                                                        </div>
                                                    )}
                                                </motion.button>
                                            );
                                        })}
                                    </div>

                                    {/* ✅ Leyenda de estados */}
                                    <div className="mt-6 pt-4 border-t border-zafiro-300">
                                        <h4 className="font-inter text-sm font-bold text-zafiro-900 mb-3">Leyenda:</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                <span className="font-inter text-xs text-zafiro-700">Completado</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                                <span className="font-inter text-xs text-zafiro-700">Pendiente</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                <span className="font-inter text-xs text-zafiro-700">No asistió</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                                                <span className="font-inter text-xs text-zafiro-700">Cancelado</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Panel de eventos */}
                        <div className="lg:col-span-1">
                            {selectedDate ? (
                                <div className="glass-card overflow-hidden">
                                    <div className="px-6 py-4 border-b border-zafiro-300">
                                        <h3 className="font-inter text-lg font-bold text-zafiro-900">
                                            {selectedDate.toLocaleDateString('es-ES', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long'
                                            })}
                                        </h3>
                                        <p className="font-inter text-sm text-zafiro-700 mt-1">
                                            {getEventsForDate(selectedDate).length} evento(s)
                                        </p>
                                    </div>
                                    <div className="p-6 max-h-[600px] overflow-y-auto custom-scrollbar">
                                        {getEventsForDate(selectedDate).length > 0 ? (
                                            <div className="space-y-3">
                                                {getEventsForDate(selectedDate).map((event) => {
                                                    const status = getEventStatus(event);
                                                    return (
                                                        <motion.div
                                                            key={event.id}
                                                            whileHover={{ scale: 1.02 }}
                                                            onClick={() => {
                                                                setSelectedEvent(event);
                                                                setShowEventDetailsModal(true);
                                                            }}
                                                            className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                                                                selectedEvent?.id === event.id
                                                                    ? 'bg-nodux-neon/20 border-nodux-neon'
                                                                    : `${getStatusColor(status)} border-2`
                                                            }`}
                                                        >
                                                            <div className="flex items-start justify-between mb-2">
                                                                <h4 className="font-inter font-bold text-zafiro-900">
                                                                    {event.groupInfo?.mentor?.name || `Grupo ${event.group}`}
                                                                </h4>
                                                                <span className={`badge ${
                                                                    status === 'completed' ? 'badge-success' :
                                                                    status === 'pending' ? 'badge-info' :
                                                                    status === 'missed' ? 'badge-error' :
                                                                    'badge-neutral'
                                                                }`}>
                                                                    {getStatusIcon(status)} {getStatusText(status)}
                                                                </span>
                                                            </div>
                                                            <p className="font-inter text-sm text-zafiro-700">
                                                                📍 {event.location}
                                                            </p>
                                                            {event.startTime && (
                                                                <p className="font-inter text-sm text-zafiro-600 mt-1">
                                                                    ⏰ {event.startTime} - {event.endTime}
                                                                </p>
                                                            )}
                                                            {event.groupInfo?.mode && (
                                                                <p className="font-inter text-xs text-zafiro-600 mt-2 capitalize">
                                                                    {event.groupInfo.mode}
                                                                </p>
                                                            )}
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <FeatureIcon type="calendar" size={48} className="mx-auto mb-4 text-zafiro-400" />
                                                <p className="font-inter text-zafiro-700">
                                                    No hay eventos programados
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="glass-card p-8 text-center">
                                    <FeatureIcon type="calendar" size={48} className="mx-auto mb-4 text-zafiro-400" />
                                    <p className="font-inter text-zafiro-700">
                                        Selecciona una fecha para ver los eventos
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ✅ Modal de Detalles del Evento */}
                    <AnimatePresence>
                        {showEventDetailsModal && selectedEvent && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setShowEventDetailsModal(false)}
                                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                                />

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                                >
                                    <div className="glass-card max-w-2xl w-full">
                                        <div className="px-6 py-4 border-b border-zafiro-300 flex items-center justify-between">
                                            <h2 className="font-thicker text-xl text-zafiro-900">Detalles del Evento</h2>
                                            <button
                                                onClick={() => setShowEventDetailsModal(false)}
                                                className="text-zafiro-700 hover:text-zafiro-900 transition-colors"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="p-6 space-y-4">
                                            {/* Estado */}
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                <span className="font-inter font-bold text-zafiro-900">Estado</span>
                                                <span className={`badge ${
                                                    getEventStatus(selectedEvent) === 'completed' ? 'badge-success' :
                                                    getEventStatus(selectedEvent) === 'pending' ? 'badge-info' :
                                                    getEventStatus(selectedEvent) === 'missed' ? 'badge-error' :
                                                    'badge-neutral'
                                                }`}>
                                                    {getStatusIcon(getEventStatus(selectedEvent))} {getStatusText(getEventStatus(selectedEvent))}
                                                </span>
                                            </div>

                                            {/* Información del evento */}
                                            <div className="space-y-3">
                                                <div>
                                                    <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Fecha</span>
                                                    <p className="font-inter text-zafiro-900 mt-1">
                                                        {new Date(selectedEvent.date).toLocaleDateString('es-ES', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>

                                                {selectedEvent.startTime && (
                                                    <div>
                                                        <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Horario</span>
                                                        <p className="font-inter text-zafiro-900 mt-1">
                                                            {selectedEvent.startTime} - {selectedEvent.endTime}
                                                        </p>
                                                    </div>
                                                )}

                                                <div>
                                                    <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Ubicación</span>
                                                    <p className="font-inter text-zafiro-900 mt-1">{selectedEvent.location}</p>
                                                </div>

                                                {selectedEvent.groupInfo?.mentor && (
                                                    <div>
                                                        <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Mentor</span>
                                                        <p className="font-inter text-zafiro-900 mt-1">
                                                            {selectedEvent.groupInfo.mentor.name}
                                                        </p>
                                                    </div>
                                                )}

                                                {selectedEvent.groupInfo?.mode && (
                                                    <div>
                                                        <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Modalidad</span>
                                                        <p className="font-inter text-zafiro-900 mt-1 capitalize">
                                                            {selectedEvent.groupInfo.mode}
                                                        </p>
                                                    </div>
                                                )}

                                                {selectedEvent.notes && (
                                                    <div>
                                                        <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Notas</span>
                                                        <p className="font-inter text-zafiro-900 mt-1">{selectedEvent.notes}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Acciones */}
                                            {getEventStatus(selectedEvent) !== 'completed' && getEventStatus(selectedEvent) !== 'missed' && (
                                                <div className="flex gap-3 pt-4 border-t border-zafiro-300">
                                                    <button
                                                        onClick={() => handleMarkAsCompleted(selectedEvent)}
                                                        className="btn-primary flex-1"
                                                        disabled={processingEvent}
                                                    >
                                                        {processingEvent ? 'Procesando...' : '✓ Marcar como Completado'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleMarkAsMissed(selectedEvent)}
                                                        className="btn-primary bg-red-500 hover:bg-red-600 flex-1"
                                                        disabled={processingEvent}
                                                    >
                                                        {processingEvent ? 'Procesando...' : '✕ Mentor No Asistió'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="px-6 py-4 border-t border-zafiro-300 flex justify-end">
                                            <button
                                                onClick={() => setShowEventDetailsModal(false)}
                                                className="btn-secondary"
                                            >
                                                Cerrar
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Modal de Crear Evento */}
                    <AnimatePresence>
                        {showCreateModal && (
                            <>
                                {/* Overlay */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={handleCloseCreateModal}
                                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                                />

                                {/* Modal */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                                >
                                    <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                        {/* Header */}
                                        <div className="px-6 py-4 border-b border-zafiro-300 flex items-center justify-between">
                                            <h2 className="font-thicker text-xl text-zafiro-900">Crear Nuevo Evento</h2>
                                            <button
                                                onClick={handleCloseCreateModal}
                                                className="text-zafiro-700 hover:text-zafiro-900 transition-colors"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Form */}
                                        <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
                                            {/* Proyecto */}
                                            <div>
                                                <label className="form-label">Proyecto *</label>
                                                <select
                                                    value={formData.projectId}
                                                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value, groupId: '' })}
                                                    className={`form-input ${formErrors.projectId ? 'border-nodux-naranja' : ''}`}
                                                    disabled={creatingEvent}
                                                >
                                                    <option value="">Selecciona un proyecto</option>
                                                    {projects.map((project) => (
                                                        <option key={project.id} value={project.id}>
                                                            {project.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {formErrors.projectId && (
                                                    <p className="text-sm text-nodux-naranja mt-1">{formErrors.projectId}</p>
                                                )}
                                            </div>

                                            {/* Grupo */}
                                            <div>
                                                <label className="form-label">Grupo *</label>
                                                <select
                                                    value={formData.groupId}
                                                    onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                                                    className={`form-input ${formErrors.groupId ? 'border-nodux-naranja' : ''}`}
                                                    disabled={!formData.projectId || creatingEvent}
                                                >
                                                    <option value="">Selecciona un grupo</option>
                                                    {selectedProjectGroups.map((group) => (
                                                        <option key={group.id} value={group.id}>
                                                            Grupo {group.id} - {group.mentorName || 'Sin mentor'}
                                                        </option>
                                                    ))}
                                                </select>
                                                {formErrors.groupId && (
                                                    <p className="text-sm text-nodux-naranja mt-1">{formErrors.groupId}</p>
                                                )}
                                            </div>

                                            {/* Ubicación */}
                                            <div>
                                                <label className="form-label">Ubicación *</label>
                                                <input
                                                    type="text"
                                                    value={formData.location}
                                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                    className={`form-input ${formErrors.location ? 'border-nodux-naranja' : ''}`}
                                                    placeholder="Ej: Aula 301, Zoom, etc."
                                                    disabled={creatingEvent}
                                                />
                                                {formErrors.location && (
                                                    <p className="text-sm text-nodux-naranja mt-1">{formErrors.location}</p>
                                                )}
                                            </div>

                                            {/* Fecha del Evento */}
                                            <div>
                                                <label className="form-label">Fecha del Evento *</label>
                                                <input
                                                    type="date"
                                                    value={formData.date}
                                                    onChange={(e) => setFormData({ 
                                                        ...formData, 
                                                        date: e.target.value,
                                                        startDate: e.target.value,
                                                        endDate: e.target.value
                                                    })}
                                                    className={`form-input ${formErrors.date ? 'border-nodux-naranja' : ''}`}
                                                    disabled={creatingEvent}
                                                />
                                                {formErrors.date && (
                                                    <p className="text-sm text-nodux-naranja mt-1">{formErrors.date}</p>
                                                )}
                                            </div>

                                            {/* Botones */}
                                            <div className="flex gap-3 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={handleCloseCreateModal}
                                                    className="btn-secondary flex-1"
                                                    disabled={creatingEvent}
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn-primary flex-1"
                                                    disabled={creatingEvent}
                                                >
                                                    {creatingEvent ? (
                                                        <span className="flex items-center justify-center gap-2">
                                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Creando...
                                                        </span>
                                                    ) : (
                                                        'Crear Evento'
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
