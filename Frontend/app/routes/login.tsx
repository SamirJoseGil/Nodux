import { useState, useEffect } from "react";
import { Link, useNavigate } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { useAuth } from "~/contexts/AuthContext";
import { motion } from "framer-motion";

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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Efectos de fondo animados */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 180],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-0 right-0 w-96 h-96 bg-nodo-neon-blue/5 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    rotate: [180, 90, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute bottom-0 left-0 w-96 h-96 bg-nodo-green/5 rounded-full blur-3xl"
            />

            <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="mx-auto w-20 h-20 bg-gradient-to-br from-nodo-neon-blue to-nodo-green rounded-2xl flex items-center justify-center shadow-2xl"
                >
                    <span className="text-4xl">🔐</span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 text-center text-4xl font-extrabold text-nodo-black"
                >
                    Bienvenido de nuevo
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-2 text-center text-sm text-gray-600"
                >
                    O{" "}
                    <Link
                        to="/registro"
                        className="font-medium text-nodo-neon-blue hover:text-nodo-dark-blue transition-colors"
                    >
                        registra una nueva cuenta
                    </Link>
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md"
            >
                <div className="card-nodo-glass py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg"
                        >
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </motion.div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-bold text-nodo-black mb-2"
                            >
                                Correo electrónico
                            </label>
                            <motion.div whileFocus={{ scale: 1.02 }}>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-nodo appearance-none block w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nodo-neon-blue focus:border-nodo-neon-blue transition-all"
                                    placeholder="tu@email.com"
                                />
                            </motion.div>
                            <p className="mt-2 text-xs text-gray-500">
                                💡 Modo desarrollo: usa cualquier email
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-bold text-nodo-black mb-2"
                            >
                                Contraseña
                            </label>
                            <motion.div whileFocus={{ scale: 1.02 }}>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-nodo appearance-none block w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nodo-neon-blue focus:border-nodo-neon-blue transition-all"
                                    placeholder="••••••••"
                                />
                            </motion.div>
                            <p className="mt-2 text-xs text-gray-500">
                                💡 Modo desarrollo: usa cualquier contraseña
                            </p>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-nodo-neon-blue focus:ring-nodo-neon-blue border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Recordarme
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-nodo-neon-blue hover:text-nodo-dark-blue transition-colors">
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>
                        </div>

                        <div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="btn-nodo-primary w-full flex justify-center py-4 text-base font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <motion.svg
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 mr-3"
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
                                        </motion.svg>
                                        Iniciando sesión...
                                    </span>
                                ) : (
                                    "Iniciar sesión"
                                )}
                            </motion.button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white/80 text-gray-500 font-medium">
                                    Modo desarrollo activo
                                </span>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <div className="inline-flex items-center px-4 py-2 bg-nodo-yellow/10 border border-nodo-yellow rounded-lg">
                                <span className="text-2xl mr-2">⚡</span>
                                <p className="text-sm text-nodo-black font-medium">
                                    Presiona "Iniciar sesión" para acceder como administrador
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Link de regreso */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-6 text-center"
                >
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-nodo-neon-blue transition-colors font-medium"
                    >
                        <span>←</span>
                        Volver al inicio
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
