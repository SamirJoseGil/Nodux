import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { useAuth } from '~/contexts/AuthContext';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import AdminLayout from '~/components/Layout/AdminLayout';
import { motion } from 'framer-motion';
import FeatureIcon from '~/components/Icons/FeatureIcon';

export const meta: MetaFunction = () => {
    return [
        { title: `Dashboard Mentor - Nodux` },
        { name: "description", content: `Dashboard del mentor` },
    ];
};

// ✅ Variantes de animación
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

export default function MentorDashboard() {
    const { user } = useAuth();
    const [currentQuote, setCurrentQuote] = useState(0);

    // Frases motivacionales para mentores
    const mentorQuotes = [
        {
            text: "Un buen mentor es alguien que ve más talento y habilidad dentro de ti que tú mismo.",
            author: "Bob Proctor"
        },
        {
            text: "El arte supremo del maestro es despertar el gozo en la expresión creativa y el conocimiento.",
            author: "Albert Einstein"
        },
        {
            text: "Enseñar no es transferir conocimiento, sino crear las posibilidades para su producción o construcción.",
            author: "Paulo Freire"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuote((prev) => (prev + 1) % mentorQuotes.length);
        }, 6000);

        return () => clearInterval(interval);
    }, []);

    const getCurrentTimeGreeting = () => {
        const now = new Date();
        const hour = now.getHours();

        if (hour < 12) return "Buenos días";
        if (hour < 18) return "Buenas tardes";
        return "Buenas noches";
    };

    // Mock data - reemplazar con datos reales del backend
    const mentorStats = [
        {
            icon: 'users',
            title: 'Estudiantes Activos',
            value: '12',
            subtitle: 'En tus grupos',
            color: 'from-nodux-neon to-nodux-marino'
        },
        {
            icon: 'book',
            title: 'Proyectos',
            value: '4',
            subtitle: 'En supervisión',
            color: 'from-nodux-marino to-nodux-amarillo'
        },
        {
            icon: 'calendar',
            title: 'Sesiones',
            value: '8',
            subtitle: 'Esta semana',
            color: 'from-nodux-neon to-nodux-marino'
        },
        {
            icon: 'clock',
            title: 'Horas Mentoría',
            value: '32',
            subtitle: 'Este mes',
            color: 'from-nodux-amarillo to-nodux-naranja'
        }
    ];

    const upcomingSessions = [
        {
            id: '1',
            title: 'Grupo Backend Avanzado',
            students: 4,
            date: '2024-06-15',
            time: '10:00 - 12:00',
            location: 'Sala Virtual A'
        },
        {
            id: '2',
            title: 'Revisión Proyecto Final',
            students: 3,
            date: '2024-06-16',
            time: '14:00 - 16:00',
            location: 'Laboratorio 3'
        }
    ];

    return (
        <ProtectedRoute allowedRoles={['Mentor', 'Admin', 'SuperAdmin']}>
            <AdminLayout title="Dashboard Mentor">
                <div className="min-h-screen -m-6 p-6">
                    {/* Hero Section - COLORES CORREGIDOS */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <div className="glass-card p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-nodux-neon/20 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-nodux-marino/20 rounded-full blur-3xl" />

                            <div className="relative z-10">
                                <h1 className="font-thicker text-4xl text-white mb-2">
                                    {getCurrentTimeGreeting()}, {user?.name?.split(' ')[0] || 'Mentor'} 👨‍🏫
                                </h1>
                                <p className="font-inter text-lg text-white/70">
                                    Panel de control para mentores
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Estadísticas - COLORES CORREGIDOS */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    >
                        {mentorStats.map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={cardVariants}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="glass-card p-6"
                            >
                                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-4 shadow-neon`}>
                                    <FeatureIcon type={stat.icon as any} size={28} className="text-white" />
                                </div>
                                <h3 className="font-inter text-sm font-medium text-white/70 mb-2">
                                    {stat.title}
                                </h3>
                                <p className="font-thicker text-3xl text-white mb-1">
                                    {stat.value}
                                </p>
                                <p className="font-inter text-xs text-white/60">
                                    {stat.subtitle}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Próximas Sesiones */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-2"
                        >
                            <div className="glass-card overflow-hidden">
                                <div className="px-6 py-4 border-b border-white/10">
                                    <h2 className="font-inter text-xl font-bold text-white">
                                        📅 Próximas Sesiones
                                    </h2>
                                </div>
                                <div className="p-6">
                                    {upcomingSessions.length > 0 ? (
                                        <div className="space-y-4">
                                            {upcomingSessions.map((session) => (
                                                <motion.div
                                                    key={session.id}
                                                    whileHover={{ scale: 1.02, x: 5 }}
                                                    className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-nodux-neon/50 transition-all cursor-pointer"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h3 className="font-inter font-bold text-white mb-1">
                                                                {session.title}
                                                            </h3>
                                                            <p className="font-inter text-sm text-white/70 mb-2">
                                                                👥 {session.students} estudiantes
                                                            </p>
                                                            <div className="flex items-center gap-4 text-xs text-white/60">
                                                                <span>📅 {new Date(session.date).toLocaleDateString('es-ES')}</span>
                                                                <span>⏰ {session.time}</span>
                                                                <span>📍 {session.location}</span>
                                                            </div>
                                                        </div>
                                                        <button className="btn-secondary py-2 px-4 text-sm">
                                                            Ver grupo
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <FeatureIcon type="calendar" size={48} className="mx-auto mb-4 text-white/40" />
                                            <p className="font-inter text-white/70">No tienes sesiones programadas</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Frase motivacional y acciones */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="lg:col-span-1"
                        >
                            <div className="glass-card p-6 mb-6">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-nodux-amarillo to-nodux-naranja rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FeatureIcon type="lightbulb" size={24} className="text-white" />
                                    </div>
                                    <blockquote className="font-inter text-sm italic text-white/90 mb-3 leading-relaxed">
                                        "{mentorQuotes[currentQuote].text}"
                                    </blockquote>
                                    <cite className="font-inter text-xs text-nodux-neon font-bold">
                                        — {mentorQuotes[currentQuote].author}
                                    </cite>
                                </div>
                            </div>

                            {/* Acciones rápidas */}
                            <div className="glass-card p-6">
                                <h3 className="font-inter text-lg font-bold text-white mb-4">
                                    ⚡ Acciones Rápidas
                                </h3>
                                <div className="space-y-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-nodux-neon/50 rounded-xl text-left transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FeatureIcon type="users" size={20} className="text-nodux-neon" />
                                            <span className="font-inter text-sm font-medium text-white group-hover:text-nodux-neon transition-colors">
                                                Ver mis grupos
                                            </span>
                                        </div>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-nodux-marino/50 rounded-xl text-left transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FeatureIcon type="clock" size={20} className="text-nodux-marino" />
                                            <span className="font-inter text-sm font-medium text-white group-hover:text-nodux-marino transition-colors">
                                                Registrar horas
                                            </span>
                                        </div>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-nodux-amarillo/50 rounded-xl text-left transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FeatureIcon type="calendar" size={20} className="text-nodux-amarillo" />
                                            <span className="font-inter text-sm font-medium text-white group-hover:text-nodux-amarillo transition-colors">
                                                Ver calendario
                                            </span>
                                        </div>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Nota informativa */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8"
                    >
                        <div className="glass-card p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-nodux-neon/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <FeatureIcon type="star" size={24} className="text-nodux-neon" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-inter font-bold text-white mb-2">
                                        🎯 Bienvenido a tu panel de mentoría
                                    </h3>
                                    <p className="font-inter text-sm text-white/70 leading-relaxed">
                                        Este es tu espacio para gestionar tus grupos, revisar el progreso de tus estudiantes
                                        y programar sesiones de mentoría. Recuerda registrar tus horas después de cada sesión
                                        para mantener un seguimiento preciso.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
