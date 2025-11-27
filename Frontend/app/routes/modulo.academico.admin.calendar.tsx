import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import AdminLayout from '~/components/Layout/AdminLayout';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { EventService } from '~/services/eventService';
import type { Event } from '~/types/event';
import { motion } from 'framer-motion';
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
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await EventService.getEvents();
                setEvents(data);
            } catch (error) {
                console.error('Error al cargar eventos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

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
                                <button type="button" className="btn-primary">
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
                                                    {dayEvents.length > 0 && (
                                                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                                                            {dayEvents.slice(0, 3).map((_, i) => (
                                                                <div key={i} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-nodux-marino'}`} />
                                                            ))}
                                                        </div>
                                                    )}
                                                </motion.button>
                                            );
                                        })}
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
                                    </div>
                                    <div className="p-6">
                                        {getEventsForDate(selectedDate).length > 0 ? (
                                            <div className="space-y-3">
                                                {getEventsForDate(selectedDate).map((event) => (
                                                    <motion.div
                                                        key={event.id}
                                                        whileHover={{ scale: 1.02 }}
                                                        onClick={() => setSelectedEvent(event)}
                                                        className={`p-4 rounded-xl cursor-pointer transition-all ${
                                                            selectedEvent?.id === event.id
                                                                ? 'bg-nodux-neon/20 border-2 border-nodux-neon'
                                                                : 'bg-white/50 border border-zafiro-300 hover:border-nodux-neon/50'
                                                        }`}
                                                    >
                                                        <h4 className="font-inter font-bold text-zafiro-900 mb-1">
                                                            Evento del Grupo {event.group}
                                                        </h4>
                                                        <p className="font-inter text-sm text-zafiro-700">
                                                            📍 {event.location}
                                                        </p>
                                                        {event.startTime && (
                                                            <p className="font-inter text-sm text-zafiro-600 mt-1">
                                                                ⏰ {event.startTime} - {event.endTime}
                                                            </p>
                                                        )}
                                                    </motion.div>
                                                ))}
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
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
