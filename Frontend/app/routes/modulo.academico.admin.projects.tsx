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
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isActive: true
    });

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

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name) {
            alert('Por favor ingresa el nombre del proyecto');
            return;
        }

        setLoading(true);
        try {
            console.log('Creando proyecto con datos:', formData);
            const newProject = await ProjectService.createProject({
                name: formData.name,
                isActive: formData.isActive
            });
            setProjects([...projects, newProject]);
            setShowCreateModal(false);
            setFormData({ name: '', description: '', isActive: true });
            alert('Proyecto creado exitosamente');
        } catch (error: any) {
            console.error('Error al crear proyecto:', error);
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.error ||
                                'Error al crear proyecto. Por favor verifica los datos.';
            alert(errorMessage);
        } finally {
            setLoading(false);
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
                                <button 
                                    type="button" 
                                    className="btn-primary"
                                    onClick={() => setShowCreateModal(true)}
                                >
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

                {/* Modal de creación */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h2 className="text-xl font-bold mb-4">Crear Proyecto</h2>
                            <form onSubmit={handleCreateProject}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Nombre del proyecto <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="form-input mt-1 w-full"
                                            placeholder="Sistema de Gestión"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                        <textarea
                                            className="form-input mt-1 w-full"
                                            rows={3}
                                            placeholder="Descripción del proyecto..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-4 w-4 text-blue-600"
                                                checked={formData.isActive}
                                                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Proyecto activo</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-6">
                                    <button 
                                        type="button" 
                                        className="btn-secondary" 
                                        onClick={() => setShowCreateModal(false)}
                                        disabled={loading}
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Creando...' : 'Crear'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </AdminLayout>
        </ProtectedRoute>
    );
}