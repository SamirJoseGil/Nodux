import { Link, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import NotFoundIcon from "~/components/Icons/NotFoundIcon";

interface NotFoundProps {
    message?: string;
    showBackButton?: boolean;
}

export default function NotFound({
    message = "La página que buscas no existe",
    showBackButton = true
}: NotFoundProps) {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    navigate(-1);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    const handleGoBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    const suggestions = [
        {
            title: "Página Principal",
            description: "Vuelve al inicio de Nodux",
            href: "/",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            title: "Selector de Módulos",
            description: "Accede a los diferentes módulos",
            href: "/selector-modulo",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            )
        },
        {
            title: "Iniciar Sesión",
            description: "Accede a tu cuenta",
            href: "/login",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">
                {/* Icono animado */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-6 animate-pulse">
                        <NotFoundIcon size={64} className="text-blue-600" />
                    </div>

                    {/* Número 404 estilizado */}
                    <div className="relative">
                        <h1 className="text-9xl font-bold text-blue-600 opacity-20 select-none">
                            404
                        </h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl font-bold text-slate-900">
                                Página no encontrada
                            </span>
                        </div>
                    </div>
                </div>

                {/* Mensaje */}
                <div className="mb-8">
                    <p className="text-xl text-slate-600 mb-4">
                        {message}
                    </p>
                    <p className="text-slate-500">
                        Parece que la página que buscas ha sido movida, eliminada o nunca existió.
                    </p>
                </div>

                {/* Botones de acción */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        {showBackButton && (
                            <button
                                onClick={handleGoBack}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Volver atrás
                            </button>
                        )}

                        <Link
                            to="/"
                            className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                        >
                            Ir al inicio
                        </Link>
                    </div>

                    {/* Contador regresivo */}
                    {showBackButton && (
                        <div className="mt-4 text-sm text-slate-500">
                            Te redirigiremos automáticamente en <span className="font-semibold text-blue-600">{countdown}</span> segundos
                        </div>
                    )}
                </div>

                {/* Footer con información adicional */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-500">
                        Si crees que esto es un error, por favor{" "}
                        <a
                            href="mailto:soporte@nodux.com"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            contáctanos
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
