import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import AdminLayout from '~/components/Layout/AdminLayout';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { ProjectService } from '~/services/academicService';
import type { Project } from '~/types/academic';
import { motion } from 'framer-motion';
import FeatureIcon from '~/components/Icons/FeatureIcon';

export const meta: MetaFunction = () => {
    return [
        { title: `Gestión de Proyectos - Académico - Nodux` },
        { name: "description", content: `Gestiona proyectos en el módulo académico` },
    ];
};

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
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

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name) {
            alert('Por favor ingresa el nombre del proyecto');
            return;
        }

        setLoading(true);
        try {
            const newProject = await ProjectService.createProject({
                name: formData.name,
                status: formData.isActive ? 'active' : 'pending'
            });
            setProjects([...projects, newProject]);
            setShowCreateModal(false);
            setFormData({ name: '', description: '', isActive: true });
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'badge-success';
            case 'completed': return 'badge-info';
            case 'pending': return 'badge-warning';
            default: return 'badge-neutral';
        }
    };

    if (loading && projects.length === 0) {
        return (
            <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
                <AdminLayout title="Gestión de Proyectos">
                    <div className="flex justify-center items-center h-64">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="text-nodux-neon text-lg font-inter"
                        >
                            Cargando proyectos...
                        </motion.div>
                    </div>
                </AdminLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <AdminLayout title="Gestión de Proyectos">
                <div className="min-h-screen -m-6 p-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8"
                    >
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-nodux-marino to-nodux-amarillo rounded-xl flex items-center justify-center">
                                        <FeatureIcon type="book" size={24} className="text-zafiro-900" />
                                    </div>
                                    <div>
                                        <h1 className="font-thicker text-2xl text-zafiro-900">Gestión de Proyectos</h1>
                                        <p className="font-inter text-sm text-zafiro-700">{projects.length} proyectos registrados</p>
                                    </div>
                                </div>
                                <button 
                                    type="button" 
                                    className="btn-primary"
                                    onClick={() => setShowCreateModal(true)}
                                >
                                    <FeatureIcon type="book" size={20} className="inline mr-2" />
                                    Crear Proyecto
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Lista de proyectos */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="lg:col-span-2"
                        >
                            {error ? (
                                <div className="glass-card p-6">
                                    <div className="flex items-center gap-3 text-nodux-naranja">
                                        <FeatureIcon type="lightbulb" size={24} />
                                        <p className="font-inter">{error}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {projects.map((project) => (
                                        <motion.div
                                            key={project.id}
                                            variants={cardVariants}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            onClick={() => handleProjectSelect(project)}
                                            className={`glass-card p-6 cursor-pointer transition-all ${
                                                selectedProject?.id === project.id ? 'ring-2 ring-nodux-marino' : ''
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-inter font-bold text-zafiro-900 mb-2">
                                                        {project.name}
                                                    </h3>
                                                    {project.description && (
                                                        <p className="font-inter text-sm text-zafiro-700 mb-3">
                                                            {project.description}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <span className={`badge ${getStatusColor(project.status)}`}>
                                                            {project.status === 'active' ? 'Activo' : 'Pendiente'}
                                                        </span>
                                                        {project.groups && project.groups.length > 0 && (
                                                            <span className="badge badge-info">
                                                                {project.groups.length} grupos
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <button className="btn-ghost text-zafiro-900">Ver</button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Panel de detalle */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-1"
                        >
                            {selectedProject ? (
                                <div className="glass-card overflow-hidden">
                                    <div className="px-6 py-4 border-b border-zafiro-300">
                                        <h3 className="font-inter text-lg font-bold text-zafiro-900">
                                            Detalles del Proyecto
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Nombre</span>
                                            <p className="font-inter text-zafiro-900 mt-1">{selectedProject.name}</p>
                                        </div>
                                        {selectedProject.description && (
                                            <div>
                                                <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Descripción</span>
                                                <p className="font-inter text-zafiro-900 mt-1">{selectedProject.description}</p>
                                            </div>
                                        )}
                                        <div>
                                            <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Estado</span>
                                            <p className="mt-1">
                                                <span className={`badge ${getStatusColor(selectedProject.status)}`}>
                                                    {selectedProject.status === 'active' ? 'Activo' : 'Pendiente'}
                                                </span>
                                            </p>
                                        </div>
                                        {selectedProject.groups && selectedProject.groups.length > 0 && (
                                            <div>
                                                <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Grupos</span>
                                                <p className="font-inter text-zafiro-900 mt-1">
                                                    {selectedProject.groups.length} grupos asignados
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="px-6 py-4 border-t border-zafiro-300 flex gap-2">
                                        <button type="button" className="btn-secondary flex-1">
                                            Editar
                                        </button>
                                        <button type="button" className="btn-primary flex-1">
                                            Ver Grupos
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="glass-card p-8 text-center">
                                    <FeatureIcon type="book" size={48} className="mx-auto mb-4 text-zafiro-400" />
                                    <p className="font-inter text-zafiro-700">
                                        Selecciona un proyecto para ver sus detalles
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Modal de creación */}
                    {showCreateModal && (
                        <div className="fixed inset-0 glass-overlay flex items-center justify-center z-50 p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-card max-w-md w-full"
                            >
                                <div className="px-6 py-4 border-b border-zafiro-300">
                                    <h2 className="font-thicker text-2xl text-zafiro-900">Crear Proyecto</h2>
                                </div>
                                
                                <form onSubmit={handleCreateProject} className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="form-label text-zafiro-900">
                                                Nombre del proyecto <span className="text-nodux-naranja">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                className="form-input w-full text-zafiro-900 placeholder-zafiro-500"
                                                placeholder="Sistema de Gestión"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label text-zafiro-900">Descripción</label>
                                            <textarea
                                                className="form-input w-full text-zafiro-900 placeholder-zafiro-500"
                                                rows={3}
                                                placeholder="Descripción del proyecto..."
                                                value={formData.description}
                                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded border-zafiro-400 bg-white text-nodux-neon focus:ring-nodux-neon"
                                                    checked={formData.isActive}
                                                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                                />
                                                <span className="font-inter text-sm text-zafiro-900">Proyecto activo</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-6">
                                        <button 
                                            type="button" 
                                            className="btn-secondary flex-1" 
                                            onClick={() => setShowCreateModal(false)}
                                            disabled={loading}
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="btn-primary flex-1"
                                            disabled={loading}
                                        >
                                            {loading ? 'Creando...' : 'Crear'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}