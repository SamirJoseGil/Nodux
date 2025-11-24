import { useState, useEffect } from "react";
import { Link, useNavigate } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { useAuth } from "~/contexts/AuthContext";
import Navbar from "~/components/Navigation/Navbar";
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
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/selector-modulo');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        
        // Validaciones
        const newErrors: { email?: string; password?: string } = {};
        
        if (!formData.email) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        
        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        setIsLoading(true);
        try {
            await login(formData.email, formData.password);
            // El useEffect manejará la redirección
        } catch (error: any) {
            setErrors({ 
                general: error.message || 'Error al iniciar sesión. Verifica tus credenciales.' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
                <div className="py-8 px-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-center">
                    <div className="w-16 h-16 rounded-full bg-white bg-opacity-10 flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">🔐</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">
                        Bienvenido de nuevo
                    </h2>
                    <p className="text-sm opacity-90">
                        Inicia sesión para continuar
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {errors.general && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
                        >
                            {errors.general}
                        </motion.div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            placeholder="tu@email.com"
                            disabled={isLoading}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            placeholder="••••••••"
                            disabled={isLoading}
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                        className={`w-full py-3 rounded-lg font-medium transition-all ${
                            isLoading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                        } text-white`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Iniciando sesión...
                            </span>
                        ) : 'Iniciar sesión'}
                    </motion.button>
                </form>

                <div className="py-4 px-8 bg-slate-50 text-center">
                    <p className="text-sm text-slate-500">
                        ¿No tienes una cuenta?{" "}
                        <Link
                            to="/registro"
                            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                        >
                            Regístrate aquí
                        </Link>
                    </p>
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
            </motion.div>
        </div>
    );
}
