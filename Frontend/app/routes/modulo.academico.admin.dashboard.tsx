import { useEffect, useState } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { useAuth } from '~/contexts/AuthContext';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import AdminLayout from '~/components/Layout/AdminLayout';

export const meta: MetaFunction = () => {
    return [
        { title: `Dashboard Admin Académico - Nodux` },
        { name: "description", content: `Dashboard administrativo del módulo académico` },
    ];
};

export default function AcademicoAdminDashboard() {
    const { user } = useAuth();
    const [currentQuote, setCurrentQuote] = useState(0);

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
                            Módulo Académico - Panel de Administración
                        </h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                            Gestiona proyectos, mentores, grupos y eventos académicos desde un solo lugar.
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

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Mentores</p>
                                    <p className="text-2xl font-bold text-gray-900">-</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Proyectos Activos</p>
                                    <p className="text-2xl font-bold text-gray-900">-</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Grupos Totales</p>
                                    <p className="text-2xl font-bold text-gray-900">-</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
