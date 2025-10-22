import { useState, useEffect } from "react";
import { Link, useNavigate } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { useAuth } from "~/contexts/AuthContext";
import type { UserRole } from "~/contexts/AuthContext";
import { motion } from "framer-motion";

export const meta: MetaFunction = () => {
    return [
        { title: "Registro - Nodux" },
        {
            name: "description",
            content: "Regístrate en la plataforma Nodux",
        },
    ];
};

export default function Registro() {
    const { register, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "" as UserRole
    });
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validaciones básicas
        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (!formData.role) {
            setError("Debe seleccionar un rol");
            return;
        }

        setIsLoading(true);

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role as UserRole
            });
            // La redirección se maneja en el useEffect
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al registrar usuario");
        } finally {
            setIsLoading(false);
        }
    };

    const availableRoles: { value: UserRole; label: string; icon: string }[] = [
        { value: 'Mentor', label: 'Mentor', icon: '👨‍🏫' },
        { value: 'Estudiante', label: 'Estudiante', icon: '🎓' },
        { value: 'Trabajador', label: 'Trabajador', icon: '👷' },
        { value: 'Usuario base', label: 'Usuario base', icon: '👤' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Efectos de fondo */}
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
                className="absolute top-0 right-0 w-96 h-96 bg-nodo-green/5 rounded-full blur-3xl"
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
                className="absolute bottom-0 left-0 w-96 h-96 bg-nodo-yellow/5 rounded-full blur-3xl"
            />

            <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="mx-auto w-20 h-20 bg-gradient-to-br from-nodo-green to-nodo-yellow rounded-2xl flex items-center justify-center shadow-2xl"
                >
                    <span className="text-4xl">✨</span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 text-center text-4xl font-extrabold text-nodo-black"
                >
                    Crear nueva cuenta
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-2 text-center text-sm text-gray-600"
                >
                    O{" "}
                    <Link
                        to="/login"
                        className="font-medium text-nodo-neon-blue hover:text-nodo-dark-blue transition-colors"
                    >
                        inicia sesión con tu cuenta existente
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

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <label htmlFor="name" className="block text-sm font-bold text-nodo-black mb-2">
                                Nombre completo
                            </label>
                            <motion.div whileFocus={{ scale: 1.02 }}>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-nodo appearance-none block w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nodo-neon-blue focus:border-nodo-neon-blue transition-all"
                                    placeholder="Juan Pérez"
                                />
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.65 }}
                        >
                            <label htmlFor="email" className="block text-sm font-bold text-nodo-black mb-2">
                                Correo electrónico
                            </label>
                            <motion.div whileFocus={{ scale: 1.02 }}>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-nodo appearance-none block w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nodo-neon-blue focus:border-nodo-neon-blue transition-all"
                                    placeholder="juan@example.com"
                                />
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <label htmlFor="password" className="block text-sm font-bold text-nodo-black mb-2">
                                Contraseña
                            </label>
                            <motion.div whileFocus={{ scale: 1.02 }}>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-nodo appearance-none block w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nodo-neon-blue focus:border-nodo-neon-blue transition-all"
                                    placeholder="••••••••"
                                />
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.75 }}
                        >
                            <label htmlFor="confirmPassword" className="block text-sm font-bold text-nodo-black mb-2">
                                Confirmar contraseña
                            </label>
                            <motion.div whileFocus={{ scale: 1.02 }}>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="input-nodo appearance-none block w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nodo-neon-blue focus:border-nodo-neon-blue transition-all"
                                    placeholder="••••••••"
                                />
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <label htmlFor="role" className="block text-sm font-bold text-nodo-black mb-2">
                                Selecciona tu rol
                            </label>
                            <motion.div whileFocus={{ scale: 1.02 }}>
                                <select
                                    id="role"
                                    name="role"
                                    required
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="input-nodo appearance-none block w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-nodo-neon-blue focus:border-nodo-neon-blue transition-all"
                                >
                                    <option value="">Elige un rol</option>
                                    {availableRoles.map(role => (
                                        <option key={role.value} value={role.value}>
                                            {role.icon} {role.label}
                                        </option>
                                    ))}
                                </select>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.85 }}
                        >
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="btn-nodo-accent w-full flex justify-center py-4 text-base font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
                                        Creando cuenta...
                                    </span>
                                ) : (
                                    "Crear cuenta"
                                )}
                            </motion.button>
                        </motion.div>
                    </form>
                </div>

                {/* Link de regreso */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
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
