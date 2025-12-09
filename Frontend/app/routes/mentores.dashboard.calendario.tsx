import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import Navbar from '~/components/Navigation/Navbar';
import Footer from '~/components/Navigation/Footer';
import { useAuth } from '~/contexts/AuthContext';
import { EventService } from '~/services/eventService';
import type { Event, EventStatus } from '~/types/event';
import { motion } from 'framer-motion';
import FeatureIcon from '~/components/Icons/FeatureIcon';
import { Link } from '@remix-run/react';

export const meta: MetaFunction = () => {
    return [
        { title: 'Mi Calendario - Mentor - Nodux' },
        { name: 'description', content: 'Calendario de clases del mentor' },
    ];
};

const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function MentorCalendar() {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await EventService.getEvents();
                // Filtrar solo eventos del mentor actual (puedes ajustar esto según tu lógica)
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

    const getEventStatus = (event: Event): EventStatus => {
        return EventService.getEventStatus(event);
    };

    const getStatusColor = (status: EventStatus) => {
        switch (status) {
            case 'completed': return 'bg-green-500/20 border-green-500 text-green-700';
            case 'pending': return 'bg-blue-500/20 border-blue-500 text-blue-700';
            case 'missed': return 'bg-red-500/20 border-red-500 text-red-700';
            case 'cancelled': return 'bg-gray-500/20 border-gray-500 text-gray-700';
            default: return 'bg-slate-500/20 border-slate-500 text-slate-700';
        }
    };

    const getStatusText = (status: EventStatus) => {
        switch (status) {
            case 'completed': return 'Completado';
            case 'pending': return 'Pendiente';
            case 'missed': return 'No asistió';
            case 'cancelled': return 'Cancelado';
            default: return 'Desconocido';
        }
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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <Navbar showLogo={true} variant="minimal" />
                <div className="flex justify-center items-center h-96">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center"
                    >
                        <svg className="animate-spin h-8 w-8 text-nodux-neon mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-nodux-neon font-inter">Cargando tu calendario...</p>
                    </motion.div>
                </div>
                <Footer variant="minimal" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Navbar showLogo={true} variant="minimal" />

            <div className="py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-thicker text-slate-900 mb-2">Mi Calendario</h1>
                                <p className="text-slate-600 font-inter">Gestiona tus clases y horarios</p>
                            </div>
                            <Link to="/mentores/dashboard" className="btn-secondary flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Volver al Dashboard
                            </Link>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Calendario */}
                        <div className="lg:col-span-2">
                            <div className="glass-card overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-300 flex items-center justify-between">
                                    <button onClick={prevMonth} className="btn-ghost text-slate-900">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <h2 className="font-thicker text-xl text-slate-900">
                                        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                                    </h2>
                                    <button onClick={nextMonth} className="btn-ghost text-slate-900">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-7 gap-2 mb-4">
                                        {DAYS_OF_WEEK.map((day) => (
                                            <div key={day} className="text-center font-inter font-bold text-slate-700 text-sm py-2">
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
                                            const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === currentDate.getMonth();
                                            const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();

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
                                                            ? 'bg-nodux-neon/10 text-slate-900 hover:bg-nodux-neon/20 border border-nodux-neon/30'
                                                            : 'bg-white/50 text-slate-700 hover:bg-white/70 border border-slate-200'
                                                    }`}
                                                >
                                                    <span>{day}</span>
                                                    {dayEvents.length > 0 && (
                                                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-nodux-neon"></div>
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
                                    <div className="px-6 py-4 border-b border-slate-300">
                                        <h3 className="font-inter text-lg font-bold text-slate-900">
                                            {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                        </h3>
                                        <p className="font-inter text-sm text-slate-700 mt-1">
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
                                                            onClick={() => setSelectedEvent(event)}
                                                            className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                                                                selectedEvent?.id === event.id
                                                                    ? 'bg-nodux-neon/20 border-nodux-neon'
                                                                    : `${getStatusColor(status)} border-2`
                                                            }`}
                                                        >
                                                            <h4 className="font-inter font-bold text-slate-900 mb-2">
                                                                {event.groupInfo?.mentor?.name || `Grupo ${event.group}`}
                                                            </h4>
                                                            <p className="font-inter text-sm text-slate-700 mb-2">
                                                                📍 {event.location}
                                                            </p>
                                                            {event.startTime && (
                                                                <p className="font-inter text-sm text-slate-600">
                                                                    ⏰ {event.startTime} - {event.endTime}
                                                                </p>
                                                            )}
                                                            <span className={`badge mt-2 ${
                                                                status === 'completed' ? 'badge-success' :
                                                                status === 'pending' ? 'badge-info' :
                                                                status === 'missed' ? 'badge-error' :
                                                                'badge-neutral'
                                                            }`}>
                                                                {getStatusText(status)}
                                                            </span>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <FeatureIcon type="calendar" size={48} className="mx-auto mb-4 text-slate-400" />
                                                <p className="font-inter text-slate-700">No hay clases programadas</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="glass-card p-8 text-center">
                                    <FeatureIcon type="calendar" size={48} className="mx-auto mb-4 text-slate-400" />
                                    <p className="font-inter text-slate-700">Selecciona una fecha para ver tus clases</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer variant="minimal" />
        </div>
    );
}
