import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import Navbar from '~/components/Navigation/Navbar';
import Footer from '~/components/Navigation/Footer';
import UsersIcon from "~/components/Icons/UsersIcon";
import DocumentIcon from "~/components/Icons/DocumentIcon";
import ProjectIcon from "~/components/Icons/ProjectIcon";
import ChartIcon from "~/components/Icons/ChartIcon";
import TaskIcon from "~/components/Icons/TaskIcon";

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
            icon: UsersIcon,
            href: '/estudiantes/dashboard/datos-personales',
        },
        {
            title: 'Anexo de documentos',
            icon: DocumentIcon,
            href: '/estudiantes/dashboard/anexo-documentos',
        },
        {
            title: 'Mi Matrícula',
            icon: ProjectIcon,
            href: '/estudiantes/dashboard/matricula',
        },
        {
            title: 'Lenguatek',
            icon: () => (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            href: 'https://portal.speexx.com/login?languageCode=en',
            isExternal: true,
        },
        {
            title: 'Progreso académico',
            icon: ChartIcon,
            href: 'https://aula.nodoeafit.com/',
            isExternal: true,
        },
        {
            title: 'Evaluación Docente',
            icon: () => (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            ),
            href: '/estudiantes/dashboard/evaluacion-docente',
        },
        {
            title: 'Mis Cuestionarios',
            icon: TaskIcon,
            href: '/estudiantes/dashboard/cuestionarios',
            badge: '1 Pendiente',
        },
        {
            title: 'Inscripciones',
            icon: () => (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            href: 'https://es.nodoeafit.com/cursos-nodo/',
            isExternal: true,
        },
        {
            title: 'Material de Apoyo',
            icon: () => (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
            ),
            href: '/estudiantes/dashboard/material-apoyo',
        },
    ];

    if (showWelcome) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                <div className="text-center text-white">
                    <h1 className="text-4xl font-bold mb-4">¡Bienvenido, {studentName}!</h1>
                    <p className="text-xl mb-8">Cargando tu portal estudiantil...</p>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar showLogo={false} />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Portal del Estudiante</h1>
                        <p className="text-slate-600">Bienvenido, {studentName}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dashboardItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <div key={item.href} className="card group hover:shadow-lg transition-all duration-200">
                                    <div className="card-body text-center">
                                        <div className="mb-4 flex justify-center">
                                            <IconComponent className="text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        {item.badge && (
                                            <div className="mb-4">
                                                <span className="badge badge-info">{item.badge}</span>
                                            </div>
                                        )}
                                        <div>
                                            {item.isExternal ? (
                                                <a
                                                    href={item.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-primary"
                                                >
                                                    Acceder
                                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </a>
                                            ) : (
                                                <a href={item.href} className="btn-primary">
                                                    Acceder
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <Footer variant="minimal" />
        </div>
    );
}
