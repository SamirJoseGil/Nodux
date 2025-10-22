import { useState } from 'react';
import { Link, useNavigate } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { testAllServices, testApplicationRoutes } from '~/utils/testUtils';

export const meta: MetaFunction = () => {
    return [
        { title: 'Test de Sistema - Nodux' },
        {
            name: 'description',
            content: 'Página para probar la funcionalidad del sistema',
        },
    ];
};

export default function Test() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any>(null);
    const routes = testApplicationRoutes();

    const runTests = async () => {
        setLoading(true);
        try {
            const testResults = await testAllServices();
            setResults(testResults);
        } catch (error) {
            console.error('Error durante las pruebas:', error);
            setResults({ status: 'error', message: 'Error durante las pruebas' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        🧪 Test de Sistema Nodux
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Esta página permite probar la funcionalidad del sistema y verificar la conexión entre componentes
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={runTests}
                            disabled={loading}
                            className={`px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Ejecutando pruebas...
                                </span>
                            ) : '▶️ Ejecutar pruebas de servicios'}
                        </button>
                        <Link
                            to="/healthcheck"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            🏥 Ver estado del sistema
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Rutas de la aplicación */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            📑 Rutas de la aplicación
                        </h2>
                        <ul className="space-y-2">
                            {routes.map((route) => (
                                <li key={route.path} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                                    <div>
                                        <span className="font-medium">{route.name}</span>
                                        <span className="text-sm text-gray-500 ml-2">{route.path}</span>
                                        {route.protected && (
                                            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Protegida
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => navigate(route.path)}
                                        className="text-indigo-600 hover:text-indigo-800"
                                    >
                                        Ir
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resultados de pruebas */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            🔍 Resultados de las pruebas
                        </h2>
                        {results ? (
                            results.status === 'success' ? (
                                <div>
                                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-green-700 font-medium">✅ Todas las pruebas fueron exitosas</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="border-b pb-2">
                                            <h3 className="font-medium">Autenticación:</h3>
                                            <p>Usuarios disponibles: {results.results.auth.users}</p>
                                        </div>

                                        <div className="border-b pb-2">
                                            <h3 className="font-medium">Módulos:</h3>
                                            <p>Total de módulos: {results.results.modules.count}</p>
                                        </div>

                                        <div>
                                            <h3 className="font-medium mb-2">Académico:</h3>
                                            <ul className="grid grid-cols-2 gap-2 text-sm">
                                                <li className="flex justify-between"><span>Mentores:</span> <span>{results.results.academic.mentors}</span></li>
                                                <li className="flex justify-between"><span>Proyectos:</span> <span>{results.results.academic.projects}</span></li>
                                                <li className="flex justify-between"><span>Grupos:</span> <span>{results.results.academic.groups}</span></li>
                                                <li className="flex justify-between"><span>Estudiantes:</span> <span>{results.results.academic.students}</span></li>
                                                <li className="flex justify-between"><span>Horas registradas:</span> <span>{results.results.academic.hours}</span></li>
                                                <li className="flex justify-between"><span>Métricas:</span> <span>{results.results.academic.metrics}</span></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-700 font-medium">❌ Error en las pruebas</p>
                                    <p className="text-red-600 mt-2">{results.error}</p>
                                </div>
                            )
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                Presiona "Ejecutar pruebas" para ver los resultados
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p className="text-gray-600">
                        Esta herramienta es solo para desarrollo y pruebas.
                    </p>
                </div>
            </div>
        </div>
    );
}
