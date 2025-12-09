import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import Navbar from '~/components/Navigation/Navbar';
import Footer from '~/components/Navigation/Footer';
import { useAuth } from '~/contexts/AuthContext';
import { motion } from 'framer-motion';
import FeatureIcon from '~/components/Icons/FeatureIcon';
import { Link } from '@remix-run/react';

export const meta: MetaFunction = () => {
    return [
        { title: 'Dashboard Mentor - Nodux' },
        { name: 'description', content: 'Portal del mentor' },
    ];
};

export default function MentorDashboard() {
    const { user } = useAuth();
    const [showWelcome, setShowWelcome] = useState(false);
    const mentorName = user?.name.split(' ')[0] || 'Mentor';

    useEffect(() => {
        const hasSeenWelcome = sessionStorage.getItem('hasSeenMentorWelcome');
        if (!hasSeenWelcome) {
            setShowWelcome(true);
            sessionStorage.setItem('hasSeenMentorWelcome', 'true');
            const timer = setTimeout(() => {
                setShowWelcome(false);
            }, 2000);
            return () => clearTimeout(timer);
        } else {
            setShowWelcome(false);
        }
    }, []);

    const dashboardItems = [
        {
            title: 'Mis Grupos',
            description: 'Gestiona tus grupos asignados',
            icon: 'users',
            href: '/mentores/dashboard/grupos',
            color: 'from-nodux-neon to-nodux-marino',
            isAvailable: false
        },
        {
            title: 'Calendario',
            description: 'Visualiza tu horario de clases',
            icon: 'calendar',
            href: '/mentores/dashboard/calendario',
            color: 'from-nodux-marino to-nodux-amarillo',
            isAvailable: true
        },
        {
            title: 'Asistencia',
            description: 'Registra asistencia de estudiantes',
            icon: 'clock',
            href: '/mentores/dashboard/asistencia',
            color: 'from-nodux-amarillo to-nodux-naranja',
            isAvailable: false
        },
        {
            title: 'Material de Apoyo',
            description: 'Recursos y materiales didácticos',
            icon: 'book',
            href: '/mentores/dashboard/materiales',
            color: 'from-nodux-neon to-nodux-amarillo',
            isAvailable: false
        },
        {
            title: 'Evaluaciones',
            description: 'Evalúa el desempeño de tus estudiantes',
            icon: 'chart',
            href: '/mentores/dashboard/evaluaciones',
            color: 'from-nodux-marino to-nodux-neon',
            isAvailable: false
        },
        {
            title: 'Perfil',
            description: 'Actualiza tu información personal',
            icon: 'settings',
            href: '/mentores/dashboard/perfil',
            color: 'from-nodux-naranja to-nodux-marino',
            isAvailable: false
        }
    ];

    if (showWelcome) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-nodux-neon to-nodux-marino flex items-center justify-center">
                <div className="text-center text-white">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl font-thicker mb-4">¡Bienvenido, {mentorName}!</h1>
                        <p className="text-xl mb-8 font-inter">Cargando tu portal de mentor...</p>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                    </motion.div>
                </div>
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
                        className="text-center mb-12"
                    >
                        <h1 className="text-3xl sm:text-4xl font-thicker text-slate-900 mb-3">
                            Portal del Mentor
                        </h1>
                        <p className="text-base sm:text-lg text-slate-600 font-inter">
                            Bienvenido, <span className="font-bold text-nodux-neon">{mentorName}</span>
                        </p>
                    </motion.div>

                    {/* Dashboard Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dashboardItems.map((item, index) => (
                            <motion.div
                                key={item.href}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: item.isAvailable ? 1.05 : 1, y: item.isAvailable ? -5 : 0 }}
                                className="group relative"
                            >
                                {item.isAvailable ? (
                                    <Link to={item.href} className="block h-full">
                                        <div className="glass-card h-full p-6 transition-all duration-300 hover:shadow-2xl">
                                            <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                                                <FeatureIcon type={item.icon as any} size={32} className="text-white" />
                                            </div>
                                            <h3 className="font-thicker text-xl text-slate-900 mb-2 group-hover:text-nodux-neon transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="font-inter text-sm text-slate-600 mb-4">
                                                {item.description}
                                            </p>
                                            <div className="flex items-center text-nodux-neon font-inter font-semibold text-sm">
                                                Acceder
                                                <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="block h-full relative">
                                        {/* Overlay de "En desarrollo" */}
                                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 rounded-2xl flex items-center justify-center">
                                            <div className="text-center p-4">
                                                <svg className="w-8 h-8 text-yellow-500 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                </svg>
                                                <span className="font-inter text-sm font-bold text-slate-700">En desarrollo</span>
                                            </div>
                                        </div>

                                        <div className="glass-card h-full p-6 transition-all duration-300 opacity-50">
                                            <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                                                <FeatureIcon type={item.icon as any} size={32} className="text-white" />
                                            </div>
                                            <h3 className="font-thicker text-xl text-slate-900 mb-2">
                                                {item.title}
                                            </h3>
                                            <p className="font-inter text-sm text-slate-600 mb-4">
                                                {item.description}
                                            </p>
                                            <div className="flex items-center text-slate-400 font-inter font-semibold text-sm">
                                                Próximamente
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Aviso de desarrollo */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-12"
                    >
                        <div className="glass-card p-6">
                            <div className="flex items-start gap-4">
                                <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <h3 className="font-inter font-bold text-slate-900 text-lg mb-2">
                                        🚀 Portal en Desarrollo
                                    </h3>
                                    <p className="font-inter text-slate-700">
                                        Estamos trabajando para traerte todas las funcionalidades. Por ahora, puedes acceder al <span className="font-bold text-nodux-neon">Calendario</span> para ver y gestionar tus clases.
                                    </p>
                                    <div className="mt-3 flex gap-2">
                                        <span className="badge badge-success">Calendario disponible</span>
                                        <span className="badge badge-warning">Otros módulos en desarrollo</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6"
                    >
                        <div className="glass-card p-6 text-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-nodux-neon to-nodux-marino rounded-full flex items-center justify-center mx-auto mb-3">
                                <FeatureIcon type="users" size={24} className="text-white" />
                            </div>
                            <p className="font-thicker text-3xl text-slate-900 mb-1">0</p>
                            <p className="font-inter text-sm text-slate-600">Grupos Activos</p>
                        </div>

                        <div className="glass-card p-6 text-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-nodux-amarillo to-nodux-naranja rounded-full flex items-center justify-center mx-auto mb-3">
                                <FeatureIcon type="clock" size={24} className="text-white" />
                            </div>
                            <p className="font-thicker text-3xl text-slate-900 mb-1">0</p>
                            <p className="font-inter text-sm text-slate-600">Clases Pendientes</p>
                        </div>

                        <div className="glass-card p-6 text-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-nodux-marino to-nodux-neon rounded-full flex items-center justify-center mx-auto mb-3">
                                <FeatureIcon type="chart" size={24} className="text-white" />
                            </div>
                            <p className="font-thicker text-3xl text-slate-900 mb-1">0</p>
                            <p className="font-inter text-sm text-slate-600">Estudiantes</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer variant="minimal" />
        </div>
    );
}
