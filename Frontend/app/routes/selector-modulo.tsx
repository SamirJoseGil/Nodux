import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { useAuth } from '~/contexts/AuthContext';
import { useModule } from '~/contexts/ModuleContext';
import { ModuleService } from '~/services/moduleService';
import type { Module } from '~/types/module';
import SecurityIcon from '~/components/Icons/SecurityIcon';

export const meta: MetaFunction = () => {
    return [
        { title: "Selector de Módulos - Nodux" },
        {
            name: "description",
            content: "Selecciona el módulo con el que deseas trabajar",
        },
    ];
};

export default function SelectorModulo() {
    const { user } = useAuth();
    const { setActiveModule } = useModule();
    const navigate = useNavigate();
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                setLoading(true);
                if (user && user.role) {
                    const availableModules = await ModuleService.getModules(user.role);
                    setModules(availableModules || []);
                } else {
                    setModules([]);
                }
            } catch (error) {
                console.error("Error cargando módulos:", error);
                setModules([]);
            } finally {
                setLoading(false);
            }
        };

        fetchModules();
    }, [user]);

    const handleModuleSelect = (module: Module) => {
        setActiveModule(module.name);
        let targetPath = '';

        switch (module.name) {
            case 'Académico':
                targetPath = '/modulo/academico/dashboard';
                break;
            case 'Producto':
                targetPath = '/modulo/producto/dashboard';
                break;
            case 'Administración':
                targetPath = '/modulo/administracion/dashboard';
                break;
            default:
                targetPath = `/modulo/${(module.name ?? 'modulo').toLowerCase()}/dashboard`;
        }

        navigate(targetPath);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-block mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">
                        Selecciona tu módulo
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Elige el espacio de trabajo que mejor se adapte a tus necesidades
                    </p>
                </div>

                {modules && modules.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {modules.map((module) => (
                            <div
                                key={module.id}
                                onClick={() => handleModuleSelect(module)}
                                className="card cursor-pointer group relative overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                            >
                                <div className="card-body relative">
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                                            <span className="text-2xl">{module.icon}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-semibold text-slate-900 text-center mb-4 group-hover:text-blue-600 transition-colors">
                                        {module.name}
                                    </h3>

                                    <p className="text-slate-600 text-center mb-6 min-h-[60px]">
                                        {module.description}
                                    </p>

                                    <div className="text-center">
                                        <button className="btn-primary w-full">
                                            Acceder
                                        </button>
                                    </div>
                                </div>

                                {/* Indicador de módulo admin */}
                                {module.adminOnly && (
                                    <div className="absolute top-4 right-4">
                                        <span className="badge badge-warning">
                                            Admin
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card p-12 text-center">
                        <SecurityIcon size={48} className="mx-auto mb-4 text-gray-400" />
                        <h3 className="text-2xl font-semibold text-slate-900 mb-2">Sin acceso</h3>
                        <p className="text-slate-600">No tienes acceso a ningún módulo. Contacta al administrador.</p>
                    </div>
                )}

                {/* Footer con botón de regreso */}
                <div className="mt-12 text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-medium"
                    >
                        <span>←</span>
                        Volver a la página principal
                    </Link>
                </div>
            </div>
        </div>
    );
}
