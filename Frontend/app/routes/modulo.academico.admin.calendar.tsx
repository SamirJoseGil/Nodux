import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import AdminLayout from '~/components/Layout/AdminLayout';
import ProtectedRoute from '~/components/ProtectedRoute';
import { Link } from '@remix-run/react';

export const meta: MetaFunction = () => {
    return [
        { title: `Calendario Académico - Nodux` },
        {
            name: "description",
            content: `Gestiona el calendario académico y eventos`,
        },
    ];
};

type ViewMode = 'week' | 'fullWeek' | 'month';

interface CalendarEvent {
    id: number;
    title: string;
    mentor: {
        id: number;
        name: string;
        avatar: string;
        expertise: string;
    };
    proyecto: {
        id: number;
        name: string;
        estado: string;
    };
    startTime: string;
    endTime: string;
    date: string;
    color: string;
    modalidad: 'Presencial' | 'Virtual' | 'Híbrida';
    lugar: string;
    startHour: number;
    endHour: number;
    duration: number;
}

const mockEvents: CalendarEvent[] = [
    {
        id: 1,
        title: "Sesión Frontend",
        mentor: { id: 1, name: "Juan Pérez", avatar: "JP", expertise: "Frontend Developer" },
        proyecto: { id: 1, name: "App Mobile de Gestión", estado: "En curso" },
        startTime: "09:00",
        endTime: "11:00",
        date: "2024-02-20",
        color: "bg-blue-500",
        modalidad: "Presencial",
        lugar: "Aula 201",
        startHour: 9,
        endHour: 11,
        duration: 2
    },
    {
        id: 2,
        title: "Análisis de Datos",
        mentor: { id: 2, name: "María García", avatar: "MG", expertise: "Data Scientist" },
        proyecto: { id: 2, name: "Sistema de Análisis", estado: "En curso" },
        startTime: "14:00",
        endTime: "16:00",
        date: "2024-02-20",
        color: "bg-green-500",
        modalidad: "Virtual",
        lugar: "Zoom Meeting",
        startHour: 14,
        endHour: 16,
        duration: 2
    },
    {
        id: 3,
        title: "Arquitectura Backend",
        mentor: { id: 3, name: "Carlos López", avatar: "CL", expertise: "Backend Architect" },
        proyecto: { id: 1, name: "App Mobile de Gestión", estado: "En curso" },
        startTime: "10:00",
        endTime: "12:00",
        date: "2024-02-21",
        color: "bg-purple-500",
        modalidad: "Híbrida",
        lugar: "Lab + Teams",
        startHour: 10,
        endHour: 12,
        duration: 2
    },
    {
        id: 4,
        title: "Review de Proyecto",
        mentor: { id: 1, name: "Juan Pérez", avatar: "JP", expertise: "Frontend Developer" },
        proyecto: { id: 3, name: "Portal Web Institucional", estado: "Sin iniciar" },
        startTime: "15:00",
        endTime: "17:00",
        date: "2024-02-22",
        color: "bg-orange-500",
        modalidad: "Virtual",
        lugar: "Google Meet",
        startHour: 15,
        endHour: 17,
        duration: 2
    },
    {
        id: 5,
        title: "Mentoría Individual",
        mentor: { id: 2, name: "María García", avatar: "MG", expertise: "Data Scientist" },
        proyecto: { id: 2, name: "Sistema de Análisis", estado: "En curso" },
        startTime: "11:00",
        endTime: "12:00",
        date: "2024-02-23",
        color: "bg-pink-500",
        modalidad: "Presencial",
        lugar: "Oficina 305",
        startHour: 11,
        endHour: 12,
        duration: 1
    },
    {
        id: 6,
        title: "Taller de React",
        mentor: { id: 1, name: "Juan Pérez", avatar: "JP", expertise: "Frontend Developer" },
        proyecto: { id: 1, name: "App Mobile de Gestión", estado: "En curso" },
        startTime: "08:00",
        endTime: "10:00",
        date: "2024-02-24",
        color: "bg-indigo-500",
        modalidad: "Presencial",
        lugar: "Aula 302",
        startHour: 8,
        endHour: 10,
        duration: 2
    }
];

export default function CalendarAdmin() {
    const [viewMode, setViewMode] = useState<ViewMode>('week');
    const [currentDate, setCurrentDate] = useState(new Date(2024, 1, 20)); // 20 febrero 2024
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [hoveredEvent, setHoveredEvent] = useState<CalendarEvent | null>(null);

    // Horas del día (de 7 AM a 7 PM)
    const timeSlots = [
        { hour: 7, label: "07:00" },
        { hour: 8, label: "08:00" },
        { hour: 9, label: "09:00" },
        { hour: 10, label: "10:00" },
        { hour: 11, label: "11:00" },
        { hour: 12, label: "12:00" },
        { hour: 13, label: "13:00" },
        { hour: 14, label: "14:00" },
        { hour: 15, label: "15:00" },
        { hour: 16, label: "16:00" },
        { hour: 17, label: "17:00" },
        { hour: 18, label: "18:00" },
        { hour: 19, label: "19:00" }
    ];

    const getWeekDays = (date: Date, fullWeek: boolean = false) => {
        const days = [];
        const startDay = fullWeek ? 0 : 1; // 0 = domingo, 1 = lunes
        const endDay = fullWeek ? 6 : 5; // 6 = sábado, 5 = viernes

        const start = new Date(date);
        start.setDate(date.getDate() - date.getDay() + startDay);

        for (let i = startDay; i <= endDay; i++) {
            const day = new Date(start);
            day.setDate(start.getDate() + (i - startDay));
            days.push(day);
        }
        return days;
    };

    const getEventsForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return mockEvents.filter(event => event.date === dateStr);
    };

    const daysOfWeek = viewMode === 'week'
        ? getWeekDays(currentDate, false)
        : viewMode === 'fullWeek'
            ? getWeekDays(currentDate, true)
            : getWeekDays(currentDate, false);

    const goToPrevious = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const goToNext = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    const getModalidadIcon = (modalidad: string) => {
        switch (modalidad) {
            case 'Presencial':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                );
            case 'Virtual':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                );
            case 'Híbrida':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                );
        }
    };

    const renderCalendarGrid = () => {
        const numDays = daysOfWeek.length;
        const numTimeSlots = timeSlots.length;

        return (
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
                <div
                    className="grid min-h-[600px]"
                    style={{
                        gridTemplateColumns: `80px repeat(${numDays}, 1fr)`,
                        gridTemplateRows: `60px repeat(${numTimeSlots}, 50px)`,
                        gap: '0'
                    }}
                >
                    {/* Celda vacía esquina superior izquierda */}
                    <div className="bg-gray-100/80 border-r border-b border-gray-200 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">Hora</span>
                    </div>

                    {/* Header de días */}
                    {daysOfWeek.map((day, index) => {
                        const isToday = day.toDateString() === new Date().toDateString();
                        return (
                            <div
                                key={index}
                                className={`bg-gray-100/80 border-r border-b border-gray-200 last:border-r-0 flex flex-col items-center justify-center p-2 ${isToday ? 'bg-blue-100' : ''}`}
                                style={{
                                    gridColumn: index + 2,
                                    gridRow: 1
                                }}
                            >
                                <div className={`text-xs font-medium ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>
                                    {day.toLocaleDateString('es-ES', { weekday: 'short' })}
                                </div>
                                <div className={`text-lg font-bold mt-1 ${isToday
                                    ? 'bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center'
                                    : 'text-gray-800'
                                    }`}>
                                    {day.getDate()}
                                </div>
                            </div>
                        );
                    })}

                    {/* Celdas de horas */}
                    {timeSlots.map((timeSlot, timeIndex) => (
                        <div
                            key={timeSlot.hour}
                            className="bg-gray-50/50 border-r border-b border-gray-200 flex items-center justify-center"
                            style={{
                                gridColumn: 1,
                                gridRow: timeIndex + 2
                            }}
                        >
                            <span className="text-xs font-medium text-gray-600">
                                {timeSlot.label}
                            </span>
                        </div>
                    ))}

                    {/* Celdas del calendario */}
                    {daysOfWeek.map((day, dayIndex) => (
                        timeSlots.map((timeSlot, timeIndex) => (
                            <div
                                key={`${dayIndex}-${timeIndex}`}
                                className="border-r border-b border-gray-200 last:border-r-0 hover:bg-blue-50/30 transition-colors relative"
                                style={{
                                    gridColumn: dayIndex + 2,
                                    gridRow: timeIndex + 2
                                }}
                            />
                        ))
                    ))}

                    {/* Eventos */}
                    {daysOfWeek.map((day, dayIndex) => {
                        const dayEvents = getEventsForDate(day);
                        return dayEvents.map((event) => {
                            const startRow = event.startHour - 7 + 2;
                            const endRow = startRow + event.duration;
                            const columnPos = dayIndex + 2;

                            return (
                                <motion.div
                                    key={`${event.id}-${dayIndex}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{
                                        scale: 1.02,
                                        zIndex: 10,
                                        boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                                    }}
                                    onHoverStart={() => setHoveredEvent(event)}
                                    onHoverEnd={() => setHoveredEvent(null)}
                                    onClick={() => setSelectedEvent(event)}
                                    className={`${event.color} text-white rounded-lg cursor-pointer m-1 p-2 shadow-sm transition-all relative z-0`}
                                    style={{
                                        gridColumn: columnPos,
                                        gridRow: `${startRow} / ${endRow}`
                                    }}
                                >
                                    <div className="h-full flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-1 mb-1">
                                                <span className="text-xs">{getModalidadIcon(event.modalidad)}</span>
                                                <span className="text-xs font-bold truncate">{event.title}</span>
                                            </div>
                                            <div className="text-xs opacity-90 truncate">
                                                {event.mentor.name}
                                            </div>
                                        </div>
                                        <div className="text-xs opacity-80">
                                            {event.startTime} - {event.endTime}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        });
                    })}
                </div>
            </div>
        );
    };

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <AdminLayout title="Calendario Académico">
                <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 -m-6 p-6">
                    {/* Header de navegación */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="flex items-center justify-between mb-8"
                    >
                        <div className="flex items-center space-x-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={goToPrevious}
                                className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl p-3 text-gray-700 hover:bg-white/80 transition-all shadow-sm"
                            >
                                ←
                            </motion.button>

                            <h2 className="text-3xl font-bold text-gray-800">
                                {`${daysOfWeek[0]?.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - ${daysOfWeek[daysOfWeek.length - 1]?.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                            </h2>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={goToNext}
                                className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl p-3 text-gray-700 hover:bg-white/80 transition-all shadow-sm"
                            >
                                →
                            </motion.button>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Selectores de vista */}
                            <div className="bg-gray-100/80 rounded-xl p-1 flex">
                                {[
                                    { key: 'week', label: 'Semana' },
                                    { key: 'fullWeek', label: 'Completa' }
                                ].map((view) => (
                                    <motion.button
                                        key={view.key}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setViewMode(view.key as ViewMode)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === view.key
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-800'
                                            }`}
                                    >
                                        {view.label}
                                    </motion.button>
                                ))}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCurrentDate(new Date())}
                                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-sm font-medium"
                            >
                                Hoy
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all shadow-sm font-medium"
                            >
                                + Nuevo Evento
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Calendario en cuadrícula */}
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        {renderCalendarGrid()}
                    </motion.div>

                    {/* Leyenda */}
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-6"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Leyenda</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center space-x-2">
                                {getModalidadIcon('Presencial')}
                                <span className="text-sm text-gray-600">Presencial</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                {getModalidadIcon('Virtual')}
                                <span className="text-sm text-gray-600">Virtual</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                {getModalidadIcon('Híbrida')}
                                <span className="text-sm text-gray-600">Híbrida</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                <span className="text-sm text-gray-600">Hoy</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Tooltip de hover */}
                    <AnimatePresence>
                        {hoveredEvent && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 shadow-2xl max-w-sm"
                                style={{ pointerEvents: 'none' }}
                            >
                                <div className="text-center">
                                    <h3 className="text-lg font-bold text-gray-800 mb-3">{hoveredEvent.title}</h3>

                                    <div className="space-y-3">
                                        {/* Mentor */}
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                                                {hoveredEvent.mentor.avatar}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-gray-800">{hoveredEvent.mentor.name}</p>
                                                <p className="text-sm text-gray-600">{hoveredEvent.mentor.expertise}</p>
                                            </div>
                                        </div>

                                        {/* Proyecto */}
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-sm text-gray-600">Proyecto:</p>
                                            <p className="font-medium text-gray-800">{hoveredEvent.proyecto.name}</p>
                                            <p className="text-xs text-blue-600">{hoveredEvent.proyecto.estado}</p>
                                        </div>

                                        {/* Detalles */}
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <p className="text-gray-600">Horario:</p>
                                                <p className="font-medium">{hoveredEvent.startTime} - {hoveredEvent.endTime}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Modalidad:</p>
                                                <p className="font-medium flex items-center gap-1">
                                                    <span>{getModalidadIcon(hoveredEvent.modalidad)}</span>
                                                    {hoveredEvent.modalidad}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-gray-600 text-sm">Lugar:</p>
                                            <p className="font-medium">{hoveredEvent.lugar}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Modal de detalle de evento */}
                    <AnimatePresence>
                        {selectedEvent && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                                onClick={() => setSelectedEvent(null)}
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                                >
                                    <div className="text-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedEvent.title}</h2>
                                        <p className="text-gray-600">{selectedEvent.date} • {selectedEvent.startTime} - {selectedEvent.endTime}</p>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Mentor */}
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-600 mb-3">Mentor Asignado</h3>
                                            <Link to={`/modulo/academico/admin/mentors?mentor=${selectedEvent.mentor.id}`}>
                                                <motion.div
                                                    whileHover={{ scale: 1.02 }}
                                                    className="flex items-center space-x-3 bg-blue-50 rounded-xl p-4 cursor-pointer hover:bg-blue-100 transition-colors"
                                                >
                                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                                                        {selectedEvent.mentor.avatar}
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-medium text-gray-800">{selectedEvent.mentor.name}</p>
                                                        <p className="text-sm text-gray-600">{selectedEvent.mentor.expertise}</p>
                                                        <p className="text-xs text-blue-600">Ver perfil →</p>
                                                    </div>
                                                </motion.div>
                                            </Link>
                                        </div>

                                        {/* Proyecto */}
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-600 mb-3">Proyecto Relacionado</h3>
                                            <Link to={`/modulo/academico/admin/projects?proyecto=${selectedEvent.proyecto.id}`}>
                                                <motion.div
                                                    whileHover={{ scale: 1.02 }}
                                                    className="bg-green-50 rounded-xl p-4 cursor-pointer hover:bg-green-100 transition-colors"
                                                >
                                                    <p className="font-medium text-gray-800">{selectedEvent.proyecto.name}</p>
                                                    <p className="text-sm text-green-600">{selectedEvent.proyecto.estado}</p>
                                                    <p className="text-xs text-green-600 mt-1">Ver proyecto →</p>
                                                </motion.div>
                                            </Link>
                                        </div>

                                        {/* Detalles de la sesión */}
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-600 mb-3">Detalles de la Sesión</h3>
                                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Modalidad:</span>
                                                    <span className="font-medium flex items-center gap-1">
                                                        {getModalidadIcon(selectedEvent.modalidad)}
                                                        {selectedEvent.modalidad}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Lugar:</span>
                                                    <span className="font-medium">{selectedEvent.lugar}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Duración:</span>
                                                    <span className="font-medium">{selectedEvent.duration} hora(s)</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Acciones */}
                                        <div className="flex gap-3">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all font-medium"
                                            >
                                                Editar Evento
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="flex-1 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-all font-medium"
                                            >
                                                Eliminar
                                            </motion.button>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedEvent(null)}
                                        className="w-full bg-gray-600 text-white py-3 rounded-xl hover:bg-gray-700 transition-all mt-6 font-medium"
                                    >
                                        Cerrar
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
