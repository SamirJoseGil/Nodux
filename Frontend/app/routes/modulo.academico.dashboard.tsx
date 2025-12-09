import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { useAuth } from '~/contexts/AuthContext';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import AdminLayout from '~/components/Layout/AdminLayout';
import { motion } from 'framer-motion';
import FeatureIcon from '~/components/Icons/FeatureIcon';

export const meta: MetaFunction = () => {
    return [
        { title: `Dashboard Académico - Nodux` },
        { name: "description", content: `Dashboard del módulo académico de Nodux` },
    ];
};

// ✅ Variantes de animación
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

export default function ModuloDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const hasRedirected = useRef(false);
    const [currentQuote, setCurrentQuote] = useState(0);

    // Efecto para redireccionar según el rol - solo una vez
    useEffect(() => {
        if (user && !hasRedirected.current) {
            if (user.role === 'Mentor') {
                hasRedirected.current = true;
                navigate('/modulo/academico/mentor/dashboard', { replace: true });
            } else if (user.role === 'Estudiante') {
                hasRedirected.current = true;
                navigate('/modulo/academico/estudiante/dashboard', { replace: true });
            }
        }
    }, [user, navigate]);

    // Frases filosóficas educativas
    const philosophicalQuotes = [
        {
            text: "La educación es el arma más poderosa que puedes usar para cambiar el mundo.",
            author: "Nelson Mandela"
        },
        {
            text: "El aprendizaje nunca agota la mente.",
            author: "Leonardo da Vinci"
        },
        {
            text: "La inversión en conocimiento produce siempre los mejores intereses.",
            author: "Benjamin Franklin"
        },
        {
            text: "Dime y lo olvido, enséñame y lo recuerdo, involúcrame y lo aprendo.",
            author: "Benjamin Franklin"
        },
        {
            text: "La educación no es preparación para la vida; la educación es la vida en sí misma.",
            author: "John Dewey"
        }
    ];

    // Efecto para cambiar las frases cada 6 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuote((prev) => (prev + 1) % philosophicalQuotes.length);
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

    const quickAccessCards = [
        {
            icon: 'users',
            title: 'Mentores',
            description: 'Gestiona mentores y asignaciones',
            link: '/modulo/academico/admin/mentors',
            color: 'from-nodux-neon to-nodux-marino'
        },
        {
            icon: 'book',
            title: 'Proyectos',
            description: 'Administra proyectos académicos',
            link: '/modulo/academico/admin/projects',
            color: 'from-nodux-marino to-nodux-amarillo'
        },
        {
            icon: 'chart',
            title: 'Grupos',
            description: 'Organiza grupos y horarios',
            link: '/modulo/academico/admin/groups',
            color: 'from-nodux-amarillo to-nodux-naranja'
        },
        {
            icon: 'calendar',
            title: 'Calendario',
            description: 'Revisa eventos y sesiones',
            link: '/modulo/academico/admin/calendar',
            color: 'from-nodux-neon to-nodux-marino'
        }
    ];

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <AdminLayout title="Dashboard Académico">
                <div className="min-h-screen -m-6 p-6 bg-white">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <div className="bg-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                            {/* Decorative shapes */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-nodux-neon/20 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-nodux-marino/20 rounded-full blur-3xl" />

                            <div className="relative z-10">
                                <h1 className="font-thicker text-4xl text-zafiro-900 mb-2">
                                    {getCurrentTimeGreeting()}, {user?.name?.split(' ')[0] || 'Administrador'}
                                </h1>
                                <p className="font-inter text-lg text-zafiro-900/90">
                                    Módulo Académico - Panel de Administración
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Frase Filosófica */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="mb-8"
                    >
                        <div className="bg-gradient-to-br from-nodux-amarillo/10 to-nodux-naranja/10 border-2 border-nodux-amarillo/30 p-4 rounded-2xl text-center shadow-lg">                           
                            <blockquote className="font-inter text-xl italic text-zafiro-900 mb-4 leading-relaxed max-w-3xl mx-auto">
                                "{philosophicalQuotes[currentQuote].text}"
                            </blockquote>
                            
                            <cite className="font-inter text-sm font-bold text-nodux-neon">
                                — {philosophicalQuotes[currentQuote].author}
                            </cite>
                        </div>
                    </motion.div>

                    {/* Quick Access Cards */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    >
                        {quickAccessCards.map((card, index) => (
                            <motion.a
                                key={index}
                                href={card.link}
                                variants={cardVariants}
                                whileHover={{ scale: 1.05, y: -8 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-white border-2 border-gray-200 hover:border-nodux-neon p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                            >
                                {/* Gradient overlay on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                                
                                {/* Icon */}
                                <div className={`w-14 h-14 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 relative z-10`}>
                                    <FeatureIcon type={card.icon as any} size={28} className="text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="font-inter font-bold text-lg text-zafiro-900 mb-2 group-hover:text-nodux-neon transition-colors relative z-10">
                                    {card.title}
                                </h3>
                                <p className="font-inter text-sm text-gray-600 relative z-10">
                                    {card.description}
                                </p>

                                {/* Arrow */}
                                <div className="mt-4 flex items-center text-nodux-neon opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all relative z-10">
                                    <span className="font-inter text-sm font-bold">Acceder</span>
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </div>
                            </motion.a>
                        ))}
                    </motion.div>

                    {/* Info Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                        <div className="bg-gradient-to-br from-nodux-marino/10 to-nodux-neon/10 border-2 border-nodux-marino/30 p-6 rounded-2xl shadow-lg">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-nodux-marino to-nodux-neon rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <FeatureIcon type="star" size={24} className="text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-inter font-bold text-zafiro-900 mb-2">
                                        🎯 Bienvenido al Módulo Académico
                                    </h3>
                                    <p className="font-inter text-sm text-gray-700 leading-relaxed">
                                        Gestiona proyectos, mentores, grupos y eventos académicos desde un solo lugar. 
                                        Utiliza las tarjetas de acceso rápido arriba para navegar a las diferentes secciones 
                                        o explora el menú lateral para más opciones.
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