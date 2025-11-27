import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import AdminLayout from '~/components/Layout/AdminLayout';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { MentorService } from '~/services/academicService';
import type { Mentor } from '~/types/academic';
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
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        specialty: ''
    });

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

        setLoading(true);
        try {
            const newMentor = await MentorService.createMentor({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                specialty: formData.specialty
            });
            
            setMentors([...mentors, newMentor]);
            setShowCreateModal(false);
            setFormData({ name: '', email: '', phone: '', specialty: '' });
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
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
                                        <button type="button" className="btn-primary flex-1">
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
                                                disabled={loading}
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
                                                disabled={loading}
                                            />
                                        </div>

                                        <div>
                                            <label className="form-label text-zafiro-900">Teléfono (opcional)</label>
                                            <input
                                                type="tel"
                                                className="form-input w-full text-zafiro-900 placeholder-zafiro-500"
                                                placeholder="+57 300 123 4567"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                disabled={loading}
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
                                                placeholder="Frontend Developer"
                                                value={formData.specialty}
                                                onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                                                disabled={loading}
                                            />
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
                                            disabled={loading}
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="btn-primary flex-1"
                                            disabled={loading}
                                        >
                                            {loading ? 'Creando...' : 'Crear Mentor'}
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