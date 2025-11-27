import { useState, useEffect } from "react";
import { Link, useNavigate } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { useAuth } from "~/contexts/AuthContext";
import { motion } from "framer-motion";
import FeatureIcon from "~/components/Icons/FeatureIcon";

export const meta: MetaFunction = () => {
    return [
        { title: "Iniciar Sesión - Nodux" },
        { name: "description", content: "Inicia sesión en la plataforma Nodux" },
    ];
};

export default function Login() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/selector-modulo');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        
        const newErrors: { username?: string; password?: string } = {};
        
        if (!formData.username) {
            newErrors.username = 'El usuario o correo electrónico es requerido';
        }
        
        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        setIsLoading(true);
        try {
            await login(formData.username, formData.password);
        } catch (error: any) {
            console.error('Error en login:', error);
            setErrors({ 
                general: error.message || 'Error al iniciar sesión. Verifica tus credenciales.' 
            });
        } finally {
            setIsLoading(false);
        }
    };

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
                        to="/registro" 
                        className="text-white/80 hover:text-white font-inter font-semibold transition-colors"
                    >
                        Crear cuenta
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4 relative z-10">
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
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="w-16 h-16 bg-gradient-to-br from-nodux-neon to-nodux-marino rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-neon"
                            >
                                <FeatureIcon type="shield" size={32} className="text-white" />
                            </motion.div>
                            <h1 className="font-thicker text-3xl text-white mb-2">
                                Iniciar Sesión
                            </h1>
                            <p className="font-inter text-white/70">
                                Ingresa tus credenciales para continuar
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

                            {/* Username Field */}
                            <div className="space-y-2">
                                <label htmlFor="username" className="form-label text-white">
                                    Usuario o Correo Electrónico
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FeatureIcon type="users" size={20} className="text-black" />
                                    </div>
                                    <input
                                        id="username"
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className={`form-input pl-12 ${errors.username ? 'border-nodux-naranja' : ''}`}
                                        placeholder="admin, mentor, estudiante..."
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.username && <p className="text-sm text-nodux-naranja font-inter">{errors.username}</p>}
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
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className={`form-input pl-12 pr-12 ${errors.password ? 'border-nodux-naranja' : ''}`}
                                        placeholder="••••••••"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/60 transition-colors"
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
                                        Iniciando sesión...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Iniciar Sesión
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </span>
                                )}
                            </motion.button>
                        </form>

                        {/* Footer del Card */}
                        <div className="px-8 py-6 border-t border-white/10">
                            <p className="text-center text-sm text-white/70 font-inter">
                                ¿No tienes una cuenta?{" "}
                                <Link
                                    to="/registro"
                                    className="font-bold text-nodux-neon hover:text-nodux-marino transition-colors"
                                >
                                    Regístrate aquí
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
