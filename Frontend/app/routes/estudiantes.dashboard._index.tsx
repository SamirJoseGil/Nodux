import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import WelcomeAnimation from '~/components/dashboard/WelcomeAnimation';
import DashboardCard from '~/components/dashboard/DashboardCard';
import DashboardLayout from '~/components/dashboard/DashboardLayout';

export const meta: MetaFunction = () => {
    return [
        { title: 'Dashboard - Universidad EAFIT' },
        { name: 'description', content: 'Portal del estudiante' },
    ];
};

export default function DashboardIndex() {
    const [showWelcome, setShowWelcome] = useState(false);
    const studentName = 'sjosoriog'; // TODO: obtener del contexto/sesión

    useEffect(() => {
        // Verificar si ya se mostró la animación en esta sesión
        const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
        if (!hasSeenWelcome) {
            setShowWelcome(true);
            sessionStorage.setItem('hasSeenWelcome', 'true');
        }
    }, []);

    const dashboardItems = [
        {
            title: 'Datos Personales',
            icon: (
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            href: '/estudiantes/dashboard/datos-personales',
        },
        {
            title: 'Anexo de documentos',
            icon: (
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            href: '/estudiantes/dashboard/anexo-documentos',
        },
        {
            title: 'Mi Matrícula',
            icon: (
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 3v4a2 2 0 002 2h4" />
                </svg>
            ),
            href: '/estudiantes/dashboard/matricula',
        },
        {
            title: 'Lenguatek',
            icon: (
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
            ),
            href: 'https://portal.speexx.com/login?languageCode=en',
            isExternal: true,
        },
        {
            title: 'Progreso académico',
            icon: (
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            href: 'https://aula.nodoeafit.com/',
            isExternal: true,
        },
        {
            title: 'Evaluación Docente',
            icon: (
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            ),
            href: '/estudiantes/dashboard/evaluacion-docente',
        },
        {
            title: 'Mis Cuestionarios',
            icon: (
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            href: '/estudiantes/dashboard/cuestionarios',
            badge: { text: '1 Pendiente', variant: 'info' as const },
        },
        {
            title: 'Inscripciones',
            icon: (
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            href: 'https://es.nodoeafit.com/cursos-nodo/',
            isExternal: true,
        },
        {
            title: 'Material de Apoyo',
            icon: (
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 10h6" />
                </svg>
            ),
            href: '/estudiantes/dashboard/material-apoyo',
        },
    ];

    if (showWelcome) {
        return (
            <WelcomeAnimation
                onComplete={() => setShowWelcome(false)}
                studentName={studentName}
            />
        );
    }

    return (
        <DashboardLayout userName={studentName}>
            <div className="animate-fade-in">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Portal del Estudiante</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashboardItems.map((item) => (
                        <DashboardCard key={item.href} {...item} />
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
