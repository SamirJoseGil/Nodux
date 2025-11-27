import { useState, useEffect } from "react";
import { Link, useNavigate } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { useAuth } from "~/contexts/AuthContext";
import type { UserRole } from "~/contexts/AuthContext";
import { motion } from "framer-motion";
import FeatureIcon from "~/components/Icons/FeatureIcon";

export const meta: MetaFunction = () => {
    return [
        { title: "Crear Cuenta - Nodux" },
        { name: "description", content: "Regístrate en la plataforma Nodux" },
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
        role: "Estudiante" as UserRole
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isAuthenticated && user) {
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
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "El nombre es requerido";
        }

        if (!formData.email.trim()) {
            newErrors.email = "El correo electrónico es requerido";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Correo electrónico inválido";
        }

        if (!formData.password) {
            newErrors.password = "La contraseña es requerida";
        } else if (formData.password.length < 6) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
        } catch (err: any) {
            console.error('Error en registro:', err);
            setErrors({ 
                general: err.message || "Error al registrar usuario. Verifica tus datos e intenta nuevamente." 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const availableRoles: { value: UserRole; label: string; description: string }[] = [
        { 
            value: 'Estudiante', 
            label: 'Estudiante',
            description: 'Acceso a cursos y proyectos académicos'
        },
        { 
            value: 'Mentor', 
            label: 'Mentor',
            description: 'Mentoría y guía de proyectos'
        },
    ];

    return (
        <div className="min-h-screen bg-zafiro-500 flex flex-col relative overflow-hidden">
            {/* Background animated shapes */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-20 right-20 w-96 h-96 bg-nodux-neon/10 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    rotate: [360, 180, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-20 left-20 w-96 h-96 bg-nodux-marino/10 rounded-full blur-3xl"
            />

            {/* Header */}
            <header className="w-full py-4 px-6 glass-strong relative z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-10 h-10 bg-gradient-to-br from-nodux-neon to-nodux-marino rounded-xl flex items-center justify-center shadow-neon"
                        >
                            <span className="font-thicker text-white text-xl">N</span>
                        </motion.div>
                        <span className="font-thicker text-2xl text-white">NODUX</span>
                    </Link>
                    <Link 
                        to="/login" 
                        className="text-white/80 hover:text-white font-inter font-semibold transition-colors"
                    >
                        Iniciar sesión
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4 py-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Card */}
                    <div className="glass-card overflow-hidden">
                        {/* Header del Card */}
                        <div className="px-8 pt-8 pb-6 text-center">
                            <h1 className="font-thicker text-3xl text-white mb-2">
                                Crear Cuenta
                            </h1>
                            <p className="font-inter text-white/70">
                                Completa los datos para registrarte
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
                            {errors.general && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 bg-nodux-naranja/20 border border-nodux-naranja/30 rounded-xl"
                                >
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-nodux-naranja mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-sm text-nodux-naranja font-medium font-inter">{errors.general}</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Name Field */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="form-label text-white text-white">
                                    Nombre Completo
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FeatureIcon type="users" size={20} className="text-black" />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`form-input pl-12 ${errors.name ? 'border-nodux-naranja' : ''}`}
                                        placeholder="Juan Pérez"
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.name && <p className="text-sm text-nodux-naranja font-inter">{errors.name}</p>}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="form-label text-white text-white">
                                    Correo Electrónico
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`form-input pl-12 ${errors.email ? 'border-nodux-naranja' : ''}`}
                                        placeholder="juan@correo.com"
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.email && <p className="text-sm text-nodux-naranja font-inter">{errors.email}</p>}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="form-label text-white">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FeatureIcon type="shield" size={20} className="text-black" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`form-input pl-12 pr-12 ${errors.password ? 'border-nodux-naranja' : ''}`}
                                        placeholder="Mínimo 6 caracteres"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-black hover:text-white/60 transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && <p className="text-sm text-nodux-naranja font-inter">{errors.password}</p>}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="form-label text-white">
                                    Confirmar Contraseña
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FeatureIcon type="target" size={20} className="text-black" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`form-input pl-12 ${errors.confirmPassword ? 'border-nodux-naranja' : ''}`}
                                        placeholder="Repite tu contraseña"
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.confirmPassword && <p className="text-sm text-nodux-naranja font-inter">{errors.confirmPassword}</p>}
                            </div>

                                {/* Role Selector as Cards */}
                                <div className="space-y-2">
                                    <label className="form-label text-white">
                                        Selecciona tu Rol
                                    </label>
                                    <div className="flex gap-4">
                                        {availableRoles.map(role => (
                                            <button
                                                key={role.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, role: role.value })}
                                                disabled={isLoading}
                                                className={`
                                                    flex-1 p-4 rounded-xl border transition-all
                                                    ${formData.role === role.value
                                                        ? "bg-nodux-neon/10 border-nodux-neon shadow-neon text-nodux-neon"
                                                        : "bg-white/5 border-white/10 text-white/80 hover:border-nodux-neon/60"}
                                                    flex flex-col items-center gap-2
                                                    focus:outline-none
                                                `}
                                            >
                                                <FeatureIcon
                                                    type={role.value === "Estudiante" ? "users" : "star"}
                                                    size={28}
                                                    className={formData.role === role.value ? "text-nodux-neon" : "text-white"}
                                                />
                                                <span className="font-bold text-base">{role.label}</span>
                                                <span className="text-xs text-white/60 text-center">{role.description}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                disabled={isLoading}
                                className="btn-primary w-full"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creando cuenta...
                                    </span>
                                ) : (
                                    "Crear Cuenta"
                                )}
                            </motion.button>
                        </form>

                        {/* Footer del Card */}
                        <div className="px-8 py-6 border-t border-white/10">
                            <p className="text-center text-sm text-white/70 font-inter">
                                ¿Ya tienes una cuenta?{" "}
                                <Link
                                    to="/login"
                                    className="font-bold text-nodux-neon hover:text-nodux-marino transition-colors"
                                >
                                    Inicia sesión
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Back Link */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors font-inter font-semibold"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver al inicio
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
