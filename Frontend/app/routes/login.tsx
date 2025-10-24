import { useState, useEffect } from "react";
import { Link, useNavigate } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { useAuth } from "~/contexts/AuthContext";
import Navbar from "~/components/Navigation/Navbar";

export const meta: MetaFunction = () => {
    return [
        { title: "Iniciar Sesión - Nodux" },
        {
            name: "description",
            content: "Inicia sesión en la plataforma Nodux",
        },
    ];
};

export default function Login() {
    const { login, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated && user) {
            // Redirección basada en roles
            switch (user.role) {
                case 'Mentor':
                    navigate('/modulo/academico/mentor/dashboard');
                    break;
                case 'Estudiante':
                    navigate('/modulo/academico/estudiante/dashboard');
                    break;
                case 'Admin':
                case 'SuperAdmin':
                    navigate('/selector-modulo');
                    break;
                default:
                    navigate('/');
            }
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // Simplemente llamamos a login sin validación
            await login();
            // La redirección se maneja en el useEffect
        } catch (err) {
            setError("Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar variant="minimal" showAuth={false} />

            <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-4xl">🔐</span>
                    </div>

                    <h2 className="mt-6 text-center text-3xl font-bold text-slate-900">
                        Bienvenido de nuevo
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-600">
                        O{" "}
                        <Link
                            to="/registro"
                            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                        >
                            registra una nueva cuenta
                        </Link>
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="card py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="form-label">
                                    Correo electrónico
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                    placeholder="tu@email.com"
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    💡 Modo desarrollo: usa cualquier email
                                </p>
                            </div>

                            <div>
                                <label htmlFor="password" className="form-label">
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input"
                                    placeholder="••••••••"
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    💡 Modo desarrollo: usa cualquier contraseña
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                                        Recordarme
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn-primary w-full flex justify-center py-3 text-base font-medium"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center">
                                            <svg
                                                className="animate-spin w-5 h-5 mr-3"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Iniciando sesión...
                                        </span>
                                    ) : (
                                        "Iniciar sesión"
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-slate-500 font-medium">
                                        Modo desarrollo activo
                                    </span>
                                </div>
                            </div>
                            <div className="mt-6 text-center">
                                <div className="inline-flex items-center px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <span className="text-2xl mr-2">⚡</span>
                                    <p className="text-sm text-slate-700 font-medium">
                                        Presiona "Iniciar sesión" para acceder como administrador
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Link de regreso */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium"
                        >
                            <span>←</span>
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
