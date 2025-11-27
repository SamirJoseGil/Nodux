import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { useAuth } from '~/contexts/AuthContext';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import AdminLayout from '~/components/Layout/AdminLayout';
import { motion } from 'framer-motion';
import FeatureIcon from '~/components/Icons/FeatureIcon';
import { StatsService } from '~/services/statsService';
import { AttendanceService } from '~/services/attendanceService';

export const meta: MetaFunction = () => {
    return [
        { title: `Dashboard Admin - Académico - Nodux` },
        { name: "description", content: `Dashboard administrativo del módulo académico` },
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

export default function AdminAcademicoDashboard() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        mentors: 0,
        projects: 0,
        groups: 0,
        pendingHours: 0,
        totalHours: 0,
        confirmedHours: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, attendances] = await Promise.all([
                    StatsService.getStats(),
                    AttendanceService.getAttendances()
                ]);

                const totalHours = attendances.reduce((sum, a) => sum + a.hours, 0);
                const confirmedHours = attendances.filter(a => a.isConfirmed).reduce((sum, a) => sum + a.hours, 0);
                const pendingHours = attendances.filter(a => !a.isConfirmed).length;

                setStats({
                    mentors: statsData.mentors,
                    projects: statsData.projects,
                    groups: statsData.groups,
                    pendingHours,
                    totalHours,
                    confirmedHours
                });
            } catch (error) {
                console.error('Error al cargar datos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getCurrentTimeGreeting = () => {
        const now = new Date();
        const hour = now.getHours();
        if (hour < 12) return "Buenos días";
        if (hour < 18) return "Buenas tardes";
        return "Buenas noches";
    };

    const adminStats = [
        {
            icon: 'users',
            title: 'Mentores Activos',
            value: stats.mentors.toString(),
            subtitle: 'En la plataforma',
            color: 'from-nodux-neon to-nodux-marino',
            link: '/modulo/academico/admin/mentors'
        },
        {
            icon: 'book',
            title: 'Proyectos',
            value: stats.projects.toString(),
            subtitle: 'Total de proyectos',
            color: 'from-nodux-marino to-nodux-amarillo',
            link: '/modulo/academico/admin/projects'
        },
        {
            icon: 'chart',
            title: 'Grupos Activos',
            value: stats.groups.toString(),
            subtitle: 'Grupos académicos',
            color: 'from-nodux-neon to-nodux-marino',
            link: '/modulo/academico/admin/groups'
        },
        {
            icon: 'clock',
            title: 'Horas Totales',
            value: stats.totalHours.toString(),
            subtitle: `${stats.confirmedHours} confirmadas`,
            color: 'from-nodux-amarillo to-nodux-naranja',
            link: '/modulo/academico/admin/hours'
        }
    ];

    const quickActions = [
        { icon: 'users', label: 'Gestionar Mentores', link: '/modulo/academico/admin/mentors', color: 'text-nodux-neon' },
        { icon: 'book', label: 'Ver Proyectos', link: '/modulo/academico/admin/projects', color: 'text-nodux-marino' },
        { icon: 'chart', label: 'Administrar Grupos', link: '/modulo/academico/admin/groups', color: 'text-nodux-amarillo' },
        { icon: 'calendar', label: 'Calendario', link: '/modulo/academico/admin/calendar', color: 'text-nodux-naranja' },
        { icon: 'clock', label: 'Registro de Horas', link: '/modulo/academico/admin/hours', color: 'text-nodux-neon' },
        { icon: 'trending', label: 'Métricas', link: '/modulo/academico/admin/metrics', color: 'text-nodux-marino' },
    ];

    if (loading) {
        return (
            <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
                <AdminLayout title="Dashboard Académico">
                    <div className="flex justify-center items-center h-64">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 border-4 border-nodux-neon border-t-transparent rounded-full"
                        />
                    </div>
                </AdminLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <AdminLayout title="Dashboard Académico">
                <div className="min-h-screen -m-6 p-6">
                    {/* Hero Section */}
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
                                    {getCurrentTimeGreeting()}, {user?.name?.split(' ')[0] || 'Administrador'} 👨‍💼
                                </h1>
                                <p className="font-inter text-lg text-white/70">
                                    Panel de control - Módulo Académico
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Estadísticas */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    >
                        {adminStats.map((stat, index) => (
                            <motion.a
                                key={index}
                                href={stat.link}
                                variants={cardVariants}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="glass-card p-6 cursor-pointer"
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
                            </motion.a>
                        ))}
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Acciones Rápidas */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-2"
                        >
                            <div className="glass-card overflow-hidden">
                                <div className="px-6 py-4 border-b border-white/10">
                                    <h2 className="font-inter text-xl font-bold text-white">
                                        ⚡ Acciones Rápidas
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {quickActions.map((action, index) => (
                                            <motion.a
                                                key={index}
                                                href={action.link}
                                                whileHover={{ scale: 1.02, x: 5 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-nodux-neon/50 rounded-xl transition-all group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FeatureIcon 
                                                        type={action.icon as any} 
                                                        size={24} 
                                                        className={action.color}
                                                    />
                                                    <span className="font-inter text-sm font-medium text-white group-hover:text-nodux-neon transition-colors">
                                                        {action.label}
                                                    </span>
                                                </div>
                                            </motion.a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Resumen Rápido */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="lg:col-span-1"
                        >
                            <div className="glass-card p-6 mb-6">
                                <h3 className="font-inter text-lg font-bold text-white mb-4">
                                    📊 Resumen del Día
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                        <span className="font-inter text-sm text-white/70">Horas Pendientes</span>
                                        <span className="font-thicker text-lg text-nodux-amarillo">{stats.pendingHours}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                        <span className="font-inter text-sm text-white/70">Horas Confirmadas</span>
                                        <span className="font-thicker text-lg text-nodux-marino">{stats.confirmedHours}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                        <span className="font-inter text-sm text-white/70">Total de Horas</span>
                                        <span className="font-thicker text-lg text-nodux-neon">{stats.totalHours}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Nota Informativa */}
                            <div className="glass-card p-6">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-nodux-neon/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FeatureIcon type="lightbulb" size={24} className="text-nodux-neon" />
                                    </div>
                                    <h3 className="font-inter font-bold text-white mb-2">
                                        💡 Consejo del día
                                    </h3>
                                    <p className="font-inter text-sm text-white/70 leading-relaxed">
                                        Revisa regularmente las métricas para identificar oportunidades de mejora 
                                        en los procesos académicos.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Información del Sistema */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8"
                    >
                        <div className="glass-card p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-nodux-marino/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <FeatureIcon type="star" size={24} className="text-nodux-marino" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-inter font-bold text-white mb-2">
                                        🎯 Bienvenido al Panel Administrativo
                                    </h3>
                                    <p className="font-inter text-sm text-white/70 leading-relaxed">
                                        Desde aquí puedes gestionar todos los aspectos del módulo académico: 
                                        mentores, proyectos, grupos, horarios y registros de asistencia. 
                                        Utiliza el menú lateral para navegar entre las diferentes secciones.
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
