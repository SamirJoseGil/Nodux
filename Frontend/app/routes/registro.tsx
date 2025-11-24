import { useState, useEffect } from "react";
import { Link, useNavigate } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { useAuth } from "~/contexts/AuthContext";
import type { UserRole } from "~/contexts/AuthContext";
import Navbar from "~/components/Navigation/Navbar";

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
        role: "" as UserRole | ""
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
        if (!formData.name) {
            setError("El nombre es requerido");
            return;
        }

        if (!formData.email) {
            setError("El email es requerido");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError("Email inválido");
            return;
        }

        if (!formData.password) {
            setError("La contraseña es requerida");
            return;
        }

        if (formData.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

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
            console.error('Error en registro:', err);
            setError(err.message || "Error al registrar usuario. Verifica tus datos e intenta nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const availableRoles: { value: UserRole; label: string; icon: string; description: string }[] = [
        { 
            value: 'Estudiante', 
            label: 'Estudiante', 
            icon: '🎓',
            description: 'Acceso a cursos y proyectos académicos'
        },
        { 
            value: 'Mentor', 
            label: 'Mentor', 
            icon: '👨‍🏫',
            description: 'Mentoría y guía de proyectos'
        },
        { 
            value: 'Trabajador', 
            label: 'Trabajador', 
            icon: '👷',
            description: 'Acceso al módulo de productos'
        },
        { 
            value: 'Usuario base', 
            label: 'Usuario Base', 
            icon: '👤',
            description: 'Acceso básico a la plataforma'
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar variant="minimal" showAuth={false} />

            <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-bold text-slate-900">
                        Crear nueva cuenta
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-600">
                        O{" "}
                        <Link
                            to="/login"
                            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                        >
                            inicia sesión con tu cuenta existente
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
                                <label htmlFor="name" className="form-label">
                                    Nombre completo <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Juan Pérez"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="form-label">
                                    Correo electrónico <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="juan@example.com"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="form-label">
                                    Contraseña <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Mínimo 6 caracteres"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="form-label">
                                    Confirmar contraseña <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Repite tu contraseña"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="role" className="form-label">
                                    Selecciona tu rol <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    required
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="form-input"
                                    disabled={isLoading}
                                >
                                    <option value="">-- Selecciona un rol --</option>
                                    {availableRoles.map(role => (
                                        <option key={role.value} value={role.value}>
                                            {role.icon} {role.label} - {role.description}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-2 text-xs text-slate-500">
                                    Selecciona el rol que mejor describa tu participación en la plataforma
                                </p>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn-primary w-full flex justify-center py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                                            Creando cuenta...
                                        </span>
                                    ) : (
                                        "Crear cuenta"
                                    )}
                                </button>
                            </div>
                        </form>
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
