import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
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
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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

    const handleProjectSelect = (project: Project) => {
        setSelectedProject(project);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'badge-success';
            case 'completed':
                return 'badge-info';
            case 'cancelled':
                return 'badge-error';
            case 'pending':
                return 'badge-warning';
            default:
                return 'badge-neutral';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active':
                return 'Activo';
            case 'completed':
                return 'Completado';
            case 'cancelled':
                return 'Cancelado';
            case 'pending':
                return 'Pendiente';
            default:
                return status;
        }
    };

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <AdminLayout title="Gestión de Proyectos">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Lista de proyectos */}
                    <div className="lg:col-span-2">
                        <div className="card">
                            <div className="card-header flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Proyectos ({projects.length})
                                </h3>
                                <button type="button" className="btn-primary">
                                    Crear proyecto
                                </button>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : error ? (
                                <div className="card-body">
                                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                        {error}
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="table">
                                        <thead className="table-header">
                                            <tr>
                                                <th className="table-header-cell">Nombre del Proyecto</th>
                                                <th className="table-header-cell">Estado</th>
                                                <th className="table-header-cell">Fechas</th>
                                                <th className="table-header-cell">Estadísticas</th>
                                                <th className="table-header-cell">
                                                    <span className="sr-only">Acciones</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {projects.map((project) => (
                                                <tr
                                                    key={project.id}
                                                    onClick={() => handleProjectSelect(project)}
                                                    className={`table-row cursor-pointer ${selectedProject?.id === project.id ? 'bg-blue-50' : ''}`}
                                                >
                                                    <td className="table-cell">
                                                        <div className="text-sm font-medium text-slate-900">{project.name}</div>
                                                        <div className="text-sm text-slate-600 truncate max-w-xs">{project.description}</div>
                                                    </td>
                                                    <td className="table-cell">
                                                        <span className={`badge ${getStatusColor(project.status)}`}>
                                                            {getStatusText(project.status)}
                                                        </span>
                                                    </td>
                                                    <td className="table-cell">
                                                        <div>Inicio: {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</div>
                                                        {project.endDate && (
                                                            <div>Fin: {new Date(project.endDate).toLocaleDateString()}</div>
                                                        )}
                                                    </td>
                                                    <td className="table-cell">
                                                        <div>{project.mentorCount ?? 0} mentores</div>
                                                        <div>{project.studentCount ?? 0} estudiantes</div>
                                                        <div>{project.totalHours ?? 0} horas</div>
                                                    </td>
                                                    <td className="table-cell text-right">
                                                        <button
                                                            type="button"
                                                            className="btn-ghost"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleProjectSelect(project);
                                                            }}
                                                        >
                                                            Ver
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Panel de detalle */}
                    <div className="lg:col-span-1">
                        {selectedProject ? (
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        Detalles del Proyecto
                                    </h3>
                                </div>
                                <div className="card-body space-y-4">
                                    {/* ...existing project details... */}
                                </div>
                                <div className="card-footer flex gap-2">
                                    <button type="button" className="btn-secondary">
                                        Editar
                                    </button>
                                    <button type="button" className="btn-primary">
                                        Ver detalles completos
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="card p-6 text-center">
                                <p className="text-slate-600">Selecciona un proyecto para ver sus detalles</p>
                            </div>
                        )}
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}