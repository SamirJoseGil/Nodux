import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import AdminLayout from '~/components/Layout/AdminLayout';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { MentorService } from '~/services/academicService';
import { ProjectService } from '~/services/projectService';
import type { Mentor } from '~/types/academic';
import type { Project } from '~/types/project';
import { motion } from 'framer-motion';
import FeatureIcon from '~/components/Icons/FeatureIcon';

export const meta: MetaFunction = () => {
    return [
        { title: `Gestión de Mentores - Académico - Nodux` },
        { name: "description", content: `Gestiona mentores en el módulo académico` },
    ];
};

// ✅ Variantes de animación
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

export default function MentorsAdmin() {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showProjectsModal, setShowProjectsModal] = useState(false);
    const [mentorProjects, setMentorProjects] = useState<Project[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        specialty: ''
    });
    const [creatingMentor, setCreatingMentor] = useState(false);

    useEffect(() => {
        const fetchMentors = async () => {
            setLoading(true);
            try {
                const data = await MentorService.getMentors();
                setMentors(data);
            } catch (error) {
                setError('Error al cargar los mentores');
            } finally {
                setLoading(false);
            }
        };

        fetchMentors();
    }, []);

    const handleMentorSelect = (mentor: Mentor) => {
        setSelectedMentor(mentor);
    };

    const handleCreateMentor = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.specialty) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Por favor ingresa un email válido');
            return;
        }

        setCreatingMentor(true);
        try {
            console.log('📤 Creando mentor con datos:', formData);

            const newMentor = await MentorService.createMentor({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                specialty: formData.specialty
            });
            
            console.log('✅ Mentor creado:', newMentor);
            
            setMentors([...mentors, newMentor]);
            setShowCreateModal(false);
            setFormData({ name: '', email: '', phone: '', specialty: '' });
            
            alert(`✅ Mentor creado exitosamente!\n\nUsuario: ${newMentor.username}\nUna contraseña temporal ha sido generada.\n\nEl mentor podrá cambiar su contraseña al iniciar sesión.`);
        } catch (error: any) {
            console.error('❌ Error:', error);
            alert(error.message || 'Error al crear el mentor');
        } finally {
            setCreatingMentor(false);
        }
    };

    const handleViewProjects = async (mentor: Mentor) => {
        setSelectedMentor(mentor);
        setShowProjectsModal(true);
        setLoadingProjects(true);
        
        try {
            // Obtener todos los proyectos
            const allProjects = await ProjectService.getProjects();
            
            // Filtrar proyectos que tienen grupos asignados a este mentor
            const mentorProjectsList = allProjects.filter(project => 
                project.groups && project.groups.some(group => 
                    String(group.mentorId) === String(mentor.id)
                )
            ).map(project => ({
                ...project,
                // Filtrar solo los grupos del mentor
                groups: project.groups?.filter(group => 
                    String(group.mentorId) === String(mentor.id)
                ) || []
            }));
            
            setMentorProjects(mentorProjectsList);
        } catch (error) {
            console.error('Error al cargar proyectos del mentor:', error);
            alert('Error al cargar los proyectos del mentor');
        } finally {
            setLoadingProjects(false);
        }
    };

    if (loading && mentors.length === 0) {
        return (
            <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
                <AdminLayout title="Gestión de Mentores">
                    <div className="flex justify-center items-center h-64">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="text-nodux-neon text-lg font-inter"
                        >
                            Cargando mentores...
                        </motion.div>
                    </div>
                </AdminLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <AdminLayout title="Gestión de Mentores">
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
                                    <div className="w-12 h-12 bg-gradient-to-br from-nodux-neon to-nodux-marino rounded-xl flex items-center justify-center">
                                        <FeatureIcon type="users" size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h1 className="font-thicker text-2xl text-zafiro-900">Gestión de Mentores</h1>
                                        <p className="font-inter text-sm text-zafiro-700">{mentors.length} mentores registrados</p>
                                    </div>
                                </div>
                                <button 
                                    type="button" 
                                    className="btn-primary"
                                    onClick={() => setShowCreateModal(true)}
                                >
                                    <FeatureIcon type="users" size={20} className="inline mr-2" />
                                    Agregar Mentor
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Lista de mentores */}
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
                                    {mentors.map((mentor) => (
                                        <motion.div
                                            key={mentor.id}
                                            variants={cardVariants}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            onClick={() => handleMentorSelect(mentor)}
                                            className={`glass-card p-6 cursor-pointer transition-all ${
                                                selectedMentor?.id === mentor.id ? 'ring-2 ring-nodux-neon' : ''
                                            }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-nodux-marino to-nodux-amarillo rounded-full flex items-center justify-center text-zafiro-900 font-thicker text-lg flex-shrink-0">
                                                    {mentor.name.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-inter font-bold text-zafiro-900 mb-1 truncate">
                                                        {mentor.name}
                                                    </h3>
                                                    <p className="font-inter text-sm text-zafiro-700 mb-2 truncate">
                                                        {mentor.email}
                                                    </p>
                                                    <div className="flex items-center gap-3">
                                                        <span className="badge badge-info">
                                                            {mentor.specialty}
                                                        </span>
                                                        <span className="badge badge-success">
                                                            Activo
                                                        </span>
                                                    </div>
                                                </div>
                                                <button className="btn-ghost text-zafiro-900 hover:text-nodux-neon">
                                                    Ver
                                                </button>
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
                            {selectedMentor ? (
                                <div className="glass-card overflow-hidden">
                                    <div className="px-6 py-4 border-b border-zafiro-300">
                                        <h3 className="font-inter text-lg font-bold text-zafiro-900">
                                            Detalles del Mentor
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="text-center pb-4 border-b border-zafiro-300">
                                            <div className="w-20 h-20 bg-gradient-to-br from-nodux-marino to-nodux-amarillo rounded-full flex items-center justify-center text-zafiro-900 font-thicker text-3xl mx-auto mb-4">
                                                {selectedMentor.name.charAt(0)}
                                            </div>
                                            <h4 className="font-inter font-bold text-zafiro-900 text-lg mb-1">
                                                {selectedMentor.name}
                                            </h4>
                                            <p className="font-inter text-sm text-zafiro-700">
                                                {selectedMentor.email}
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Especialidad</span>
                                                <p className="font-inter text-zafiro-900 mt-1">{selectedMentor.specialty}</p>
                                            </div>
                                            {selectedMentor.phone && (
                                                <div>
                                                    <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Teléfono</span>
                                                    <p className="font-inter text-zafiro-900 mt-1">{selectedMentor.phone}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="px-6 py-4 border-t border-zafiro-300 flex gap-2">
                                        <button type="button" className="btn-secondary flex-1">
                                            Editar
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn-primary flex-1"
                                            onClick={() => handleViewProjects(selectedMentor)}
                                        >
                                            Ver Proyectos
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="glass-card p-8 text-center">
                                    <FeatureIcon type="users" size={48} className="mx-auto mb-4 text-zafiro-400" />
                                    <p className="font-inter text-zafiro-700">
                                        Selecciona un mentor para ver sus detalles
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
                                className="glass-card max-w-md w-full max-h-[90vh] overflow-y-auto"
                            >
                                <div className="px-6 py-4 border-b border-zafiro-300">
                                    <h2 className="font-thicker text-2xl text-zafiro-900">Crear Nuevo Mentor</h2>
                                    <p className="font-inter text-sm text-zafiro-700 mt-1">
                                        Se creará un usuario con acceso al portal de mentores
                                    </p>
                                </div>
                                
                                <form onSubmit={handleCreateMentor} className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="form-label text-zafiro-900">
                                                Nombre completo <span className="text-nodux-naranja">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                className="form-input w-full text-zafiro-900 placeholder-zafiro-500"
                                                placeholder="Juan Pérez García"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                disabled={creatingMentor}
                                            />
                                        </div>

                                        <div>
                                            <label className="form-label text-zafiro-900">
                                                Correo electrónico <span className="text-nodux-naranja">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                className="form-input w-full text-zafiro-900 placeholder-zafiro-500"
                                                placeholder="juan.perez@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                disabled={creatingMentor}
                                            />
                                            <p className="text-xs text-zafiro-600 mt-1">
                                                Se usará para crear la cuenta de usuario
                                            </p>
                                        </div>

                                        <div>
                                            <label className="form-label text-zafiro-900">Teléfono</label>
                                            <input
                                                type="tel"
                                                className="form-input w-full text-zafiro-900 placeholder-zafiro-500"
                                                placeholder="+57 300 123 4567"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                disabled={creatingMentor}
                                            />
                                        </div>

                                        <div>
                                            <label className="form-label text-zafiro-900">
                                                Especialidad <span className="text-nodux-naranja">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                className="form-input w-full text-zafiro-900 placeholder-zafiro-500"
                                                placeholder="Frontend Developer, Backend, UX/UI, etc."
                                                value={formData.specialty}
                                                onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                                                disabled={creatingMentor}
                                            />
                                        </div>

                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                            <p className="text-sm text-blue-800 font-inter">
                                                ℹ️ Se creará automáticamente:
                                            </p>
                                            <ul className="text-sm text-blue-700 mt-2 space-y-1">
                                                <li>• Usuario con rol "Mentor"</li>
                                                <li>• Contraseña temporal (se enviará por email)</li>
                                                <li>• Acceso al portal de mentores</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-6">
                                        <button 
                                            type="button" 
                                            className="btn-secondary flex-1" 
                                            onClick={() => {
                                                setShowCreateModal(false);
                                                setFormData({ name: '', email: '', phone: '', specialty: '' });
                                            }}
                                            disabled={creatingMentor}
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="btn-primary flex-1"
                                            disabled={creatingMentor}
                                        >
                                            {creatingMentor ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Creando...
                                                </span>
                                            ) : (
                                                'Crear Mentor'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}

                    {/* Modal de Proyectos del Mentor */}
                    {showProjectsModal && selectedMentor && (
                        <div className="fixed inset-0 glass-overlay flex items-center justify-center z-50 p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                            >
                                <div className="px-6 py-4 border-b border-zafiro-300 flex items-center justify-between">
                                    <div>
                                        <h2 className="font-thicker text-xl text-zafiro-900">
                                            Proyectos de {selectedMentor.name}
                                        </h2>
                                        <p className="font-inter text-sm text-zafiro-700 mt-1">
                                            {selectedMentor.specialty}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowProjectsModal(false);
                                            setMentorProjects([]);
                                        }}
                                        className="text-zafiro-700 hover:text-zafiro-900 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                
                                <div className="p-6">
                                    {loadingProjects ? (
                                        <div className="flex justify-center items-center py-12">
                                            <div className="text-center">
                                                <svg className="animate-spin h-8 w-8 text-nodux-neon mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <p className="font-inter text-zafiro-700">Cargando proyectos...</p>
                                            </div>
                                        </div>
                                    ) : mentorProjects.length === 0 ? (
                                        <div className="text-center py-12">
                                            <FeatureIcon type="book" size={48} className="mx-auto mb-4 text-zafiro-400" />
                                            <h3 className="font-inter font-bold text-zafiro-900 text-lg mb-2">
                                                Sin proyectos asignados
                                            </h3>
                                            <p className="font-inter text-zafiro-700">
                                                Este mentor no tiene proyectos o grupos asignados actualmente.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {mentorProjects.map((project) => (
                                                <div key={project.id} className="glass-card p-4">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h3 className="font-inter font-bold text-zafiro-900 text-lg">
                                                                {project.name}
                                                            </h3>
                                                            <p className="font-inter text-sm text-zafiro-700">
                                                                {project.groups?.length || 0} grupo(s) asignado(s)
                                                            </p>
                                                        </div>
                                                        <span className={`badge ${project.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                                                            {project.status === 'active' ? 'Activo' : 'Inactivo'}
                                                        </span>
                                                    </div>
                                                
                                                    {project.groups && project.groups.length > 0 && (
                                                        <div className="mt-3 space-y-2">
                                                            <p className="font-inter text-xs font-bold text-zafiro-600 uppercase">Grupos:</p>
                                                            {project.groups.map((group) => (
                                                                <div key={group.id} className="bg-white/50 rounded-lg p-3 border border-zafiro-200">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex-1">
                                                                            <p className="font-inter font-semibold text-zafiro-900">
                                                                                Grupo #{group.id}
                                                                            </p>
                                                                            {group.schedule && group.schedule.length > 0 && (
                                                                                <p className="font-inter text-sm text-zafiro-700 mt-1">
                                                                                    📍 {group.schedule[0].location || 'Sin ubicación'}
                                                                                </p>
                                                                            )}
                                                                            {group.schedule && group.schedule.length > 0 && (
                                                                                <p className="font-inter text-sm text-zafiro-600 mt-1">
                                                                                    🕐 {group.schedule[0].startTime} - {group.schedule[0].endTime}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                        <span className="badge badge-info">
                                                                            {group.students?.length || 0} estudiantes
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="px-6 py-4 border-t border-zafiro-300 flex justify-end">
                                    <button
                                        onClick={() => {
                                            setShowProjectsModal(false);
                                            setMentorProjects([]);
                                        }}
                                        className="btn-primary"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}