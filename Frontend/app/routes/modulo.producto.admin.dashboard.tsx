import { useState, useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { useAuth } from '~/contexts/AuthContext';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import ProductLayout from '~/components/Layout/ProductLayout';

export const meta: MetaFunction = () => {
    return [
        { title: `Dashboard Producto - Nodux` },
        {
            name: "description",
            content: `Dashboard del módulo de producto de Nodux`,
        },
    ];
};

export default function ProductoDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [currentQuote, setCurrentQuote] = useState(0);

    // Frases filosóficas sobre innovación y producto
    const innovationQuotes = [
        {
            text: "La innovación distingue entre un líder y un seguidor.",
            author: "Steve Jobs"
        },
        {
            text: "El futuro pertenece a quienes creen en la belleza de sus sueños.",
            author: "Eleanor Roosevelt"
        },
        {
            text: "La creatividad es la inteligencia divirtiéndose.",
            author: "Albert Einstein"
        },
        {
            text: "La manera de empezar es dejar de hablar y comenzar a hacer.",
            author: "Walt Disney"
        },
        {
            text: "No esperes a que las condiciones sean perfectas para empezar. El empezar hace que las condiciones sean perfectas.",
            author: "Anónimo"
        },
        {
            text: "El éxito no es definitivo, el fracaso no es fatal: lo que cuenta es el coraje para continuar.",
            author: "Winston Churchill"
        },
        {
            text: "La única forma de hacer un gran trabajo es amar lo que haces.",
            author: "Steve Jobs"
        },
        {
            text: "El secreto para salir adelante es comenzar.",
            author: "Mark Twain"
        }
    ];

    // Efecto para cambiar las frases cada 6 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuote((prev) => (prev + 1) % innovationQuotes.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [innovationQuotes.length]);

    const getCurrentTimeGreeting = () => {
        const now = new Date();
        const hour = now.getHours();

        if (hour < 12) return "Buenos días";
        if (hour < 18) return "Buenas tardes";
        return "Buenas noches";
    };

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin', 'Trabajador']}>
            <ProductLayout title="Dashboard de Producto">
                <div className="max-w-4xl mx-auto">
                    {/* Header principal */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            {getCurrentTimeGreeting()}, {user?.name?.split(' ')[0] || 'Innovador'}
                        </h1>
                        <h2 className="text-2xl text-gray-600 mb-8">
                            Módulo de Producto - Nodo EAFIT
                        </h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                            Construyendo el futuro a través de la innovación, el diseño y el desarrollo de productos excepcionales.
                        </p>
                    </div>

                    {/* Sección de frases filosóficas */}
                    <div className="bg-gradient-to-br from-green-50 to-teal-100 rounded-2xl p-8 mb-8 border border-green-200">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>

                            <blockquote className="text-xl sm:text-2xl italic font-medium text-gray-800 mb-4 leading-relaxed">
                                "{innovationQuotes[currentQuote].text}"
                            </blockquote>

                            <cite className="text-green-600 font-semibold text-lg">
                                — {innovationQuotes[currentQuote].author}
                            </cite>
                        </div>
                    </div>

                    {/* Estado del módulo */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center mb-8">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                            </svg>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Módulo en Desarrollo
                        </h3>

                        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                            Este espacio está siendo cuidadosamente construido para ofrecerte las mejores herramientas
                            de gestión de productos. Cada línea de código se escribe pensando en potenciar tu creatividad
                            y hacer realidad tus ideas más ambiciosas.
                        </p>
                    </div>

                    {/* Mensaje inspiracional */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            El Futuro se Construye Hoy
                        </h3>

                        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                            Cada producto que imaginas tiene el potencial de cambiar vidas. Tu visión,
                            combinada con las herramientas adecuadas, puede crear soluciones que
                            impacten positivamente a miles de personas alrededor del mundo.
                        </p>

                        <div className="mt-8 flex justify-center items-center space-x-8">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-gray-700">Innovación</p>
                            </div>

                            <div className="text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-gray-700">Crecimiento</p>
                            </div>

                            <div className="text-center">
                                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-gray-700">Colaboración</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ProductLayout>
        </ProtectedRoute>
    );
}
