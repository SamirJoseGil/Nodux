import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { useAuth } from '~/contexts/AuthContext';
import ProtectedRoute from '~/components/ProtectedRoute';
import AdminLayout from '~/components/Layout/AdminLayout';

export const meta: MetaFunction = () => {
    return [
        { title: `Dashboard Académico - Nodux` },
        {
            name: "description",
            content: `Dashboard del módulo académico de Nodux`,
        },
    ];
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
        },
        {
            text: "No hay nada imposible, porque los sueños de ayer son las esperanzas de hoy y pueden convertirse en realidad mañana.",
            author: "Robert H. Goddard"
        },
        {
            text: "El propósito de la educación es reemplazar una mente vacía con una abierta.",
            author: "Malcolm Forbes"
        },
        {
            text: "La sabiduría no es un producto de la escolarización, sino de la búsqueda de toda la vida de adquirirla.",
            author: "Albert Einstein"
        }
    ];

    // Efecto para cambiar las frases cada 6 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuote((prev) => (prev + 1) % philosophicalQuotes.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [philosophicalQuotes.length]);

    const getCurrentTimeGreeting = () => {
        const now = new Date();
        const hour = now.getHours();

        if (hour < 12) return "Buenos días";
        if (hour < 18) return "Buenas tardes";
        return "Buenas noches";
    };

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <AdminLayout title="Dashboard Académico">
                <div className="max-w-4xl mx-auto">
                    {/* Header principal */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            {getCurrentTimeGreeting()}, {user?.name?.split(' ')[0] || 'Administrador'}
                        </h1>
                        <h2 className="text-2xl text-gray-600 mb-8">
                            Módulo Académico - Nodo EAFIT
                        </h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                            Transformando vidas a través de la educación, la mentoría y el desarrollo de talento excepcional.
                        </p>
                    </div>

                    {/* Sección de frases filosóficas */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 mb-8 border border-blue-200">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>

                            <blockquote className="text-xl sm:text-2xl italic font-medium text-gray-800 mb-4 leading-relaxed">
                                "{philosophicalQuotes[currentQuote].text}"
                            </blockquote>

                            <cite className="text-blue-600 font-semibold text-lg">
                                — {philosophicalQuotes[currentQuote].author}
                            </cite>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}