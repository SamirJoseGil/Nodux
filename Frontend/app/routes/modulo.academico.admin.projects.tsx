import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { Link } from 'react-router-dom';
import AdminLayout from '~/components/Layout/AdminLayout';
import ProtectedRoute from '~/components/ProtectedRoute';
import { ProjectService } from '~/services/academicService';
import type { Project } from '~/types/academic';

export const meta: MetaFunction = () => {
    return [
        { title: `Gestión de Proyectos - Académico - Nodux` },
        {
            name: "description",
            content: `Gestiona proyectos en el módulo académico`,
        },
    ];
};

export default function ProjectsAdmin() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await ProjectService.getProjects();
            setProjects(response);
        } catch (err) {
            setError('Error al cargar los proyectos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm font-medium text-red-800">
                                {error}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <AdminLayout title="Gestión de Proyectos">
                <div className="min-h-screen bg-gray-50">
                    <div className="py-12 bg-gradient-to-r from-indigo-500 to-purple-600">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
                                Gestión de Proyectos
                            </h1>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                Proyectos Académicos
                            </h2>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {project.name}
                                        </h3>
                                        <p className="mt-2 text-sm text-gray-600">
                                            {project.description}
                                        </p>
                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-xs font-semibold uppercase rounded-full
                      {project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      px-3 py-1">
                                                {project.status === 'active' ? 'Activo' : 'Inactivo'}
                                            </span>
                                            <Link
                                                to={`/modulo/academico/proyectos/${project.id}`}
                                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                            >
                                                Ver detalles
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}