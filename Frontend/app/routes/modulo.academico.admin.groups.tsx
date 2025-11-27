import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import AdminLayout from '~/components/Layout/AdminLayout';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { GroupService } from '~/services/academicService';
import { ProjectService } from '~/services/academicService';
import { MentorService } from '~/services/academicService';
import type { Group } from '~/types/academic';
import { motion } from 'framer-motion';
import FeatureIcon from '~/components/Icons/FeatureIcon';

export const meta: MetaFunction = () => {
    return [
        { title: `Gestión de Grupos - Académico - Nodux` },
        { name: "description", content: `Gestiona grupos en el módulo académico` },
    ];
};

const DAYS_OF_WEEK = [
    { value: 0, label: 'Lunes' },
    { value: 1, label: 'Martes' },
    { value: 2, label: 'Miércoles' },
    { value: 3, label: 'Jueves' },
    { value: 4, label: 'Viernes' },
    { value: 5, label: 'Sábado' },
    { value: 6, label: 'Domingo' }
];

const MODE_OPTIONS = [
    { value: 'presencial', label: 'Presencial' },
    { value: 'virtual', label: 'Virtual' },
    { value: 'hibrido', label: 'Híbrido' }
];

export default function GroupsAdmin() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);
    const [mentors, setMentors] = useState<any[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    const [formData, setFormData] = useState({
        projectId: '',
        mentorId: '',
        location: '',
        mode: 'presencial' as 'presencial' | 'virtual' | 'hibrido',
        scheduleDay: '1',
        startTime: '08:00',
        endTime: '10:00',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [projectsData, mentorsData] = await Promise.all([
                    ProjectService.getProjects(),
                    MentorService.getMentors()
                ]);
                
                setProjects(projectsData);
                setMentors(mentorsData);
                
                if (projectsData.length > 0) {
                    const firstProject = projectsData[0];
                    setSelectedProjectId(firstProject.id);
                    setFormData(prev => ({ ...prev, projectId: firstProject.id }));
                    
                    const groupsData = await GroupService.getGroups(firstProject.id);
                    setGroups(groupsData);
                }
            } catch (err) {
                setError('Error al cargar datos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleProjectChange = async (projectId: string) => {
        setSelectedProjectId(projectId);
        setFormData(prev => ({ ...prev, projectId }));
        setLoading(true);
        try {
            const groupsData = await GroupService.getGroups(projectId);
            setGroups(groupsData);
        } catch (err) {
            setError('Error al cargar grupos');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.projectId || !formData.mentorId || !formData.location) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        setLoading(true);
        try {
            const newGroup = await GroupService.createGroup(formData.projectId, {
                mentorId: formData.mentorId,
                location: formData.location,
                mode: formData.mode,
                scheduleDay: parseInt(formData.scheduleDay),
                startTime: `${formData.startTime}:00`,
                endTime: `${formData.endTime}:00`,
                startDate: formData.startDate,
                endDate: formData.endDate
            });
            
            setGroups([...groups, newGroup]);
            setShowCreateModal(false);
            setFormData({
                projectId: formData.projectId,
                mentorId: '',
                location: '',
                mode: 'presencial',
                scheduleDay: '1',
                startTime: '08:00',
                endTime: '10:00',
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            });
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
                <AdminLayout title="Gestión de Grupos">
                    <div className="flex justify-center items-center h-64">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="text-nodux-neon text-lg font-inter"
                        >
                            Cargando grupos...
                        </motion.div>
                    </div>
                </AdminLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <AdminLayout title="Gestión de Grupos">
                <div className="min-h-screen -m-6 p-6">
                    {/* Header */}
                    <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        className="mb-8"
                    >
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-nodux-neon to-nodux-marino rounded-xl flex items-center justify-center">
                                        <FeatureIcon type="chart" size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h1 className="font-thicker text-2xl text-zafiro-900">Gestión de Grupos</h1>
                                        <p className="font-inter text-sm text-zafiro-700">{groups.length} grupos registrados</p>
                                    </div>
                                </div>
                                <button 
                                    type="button" 
                                    className="btn-primary"
                                    onClick={() => setShowCreateModal(true)}
                                >
                                    <FeatureIcon type="chart" size={20} className="inline mr-2" />
                                    Crear Grupo
                                </button>
                            </div>

                            {/* Project Selector */}
                            <div>
                                <label className="form-label text-zafiro-900">Proyecto</label>
                                <select
                                    value={selectedProjectId}
                                    onChange={(e) => handleProjectChange(e.target.value)}
                                    className="form-input w-full max-w-md text-zafiro-900"
                                >
                                    {projects.map(project => (
                                        <option key={project.id} value={project.id} className="bg-white text-zafiro-900">
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    {/* Groups List */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                            {groups.map((group) => (
                                <motion.div
                                    key={group.id}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    onClick={() => setSelectedGroup(group)}
                                    className={`glass-card p-6 cursor-pointer transition-all ${
                                        selectedGroup?.id === group.id ? 'ring-2 ring-nodux-neon' : ''
                                    }`}
                                >
                                    <h3 className="font-inter font-bold text-zafiro-900 mb-2">
                                        Grupo {group.id}
                                    </h3>
                                    <div className="space-y-2 text-sm text-zafiro-700">
                                        <p>📍 {group.schedule?.[0]?.location || 'Sin ubicación'}</p>
                                        <p>👨‍🏫 Mentor: {group.mentorName || 'Sin asignar'}</p>
                                        {group.schedule?.[0] && (
                                            <p>⏰ {DAYS_OF_WEEK[parseInt(group.schedule[0].day)]?.label} {group.schedule[0].startTime} - {group.schedule[0].endTime}</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            {selectedGroup ? (
                                <div className="glass-card overflow-hidden">
                                    <div className="px-6 py-4 border-b border-zafiro-300">
                                        <h3 className="font-inter text-lg font-bold text-zafiro-900">
                                            Detalles del Grupo
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">ID</span>
                                            <p className="font-inter text-zafiro-900 mt-1">{selectedGroup.id}</p>
                                        </div>
                                        {/* ...más detalles... */}
                                    </div>
                                </div>
                            ) : (
                                <div className="glass-card p-8 text-center">
                                    <FeatureIcon type="chart" size={48} className="mx-auto mb-4 text-zafiro-400" />
                                    <p className="font-inter text-zafiro-700">
                                        Selecciona un grupo para ver sus detalles
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Modal de creación */}
                    {showCreateModal && (
                        <div className="fixed inset-0 glass-overlay flex items-center justify-center z-50 p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            >
                                <div className="px-6 py-4 border-b border-zafiro-300">
                                    <h2 className="font-thicker text-2xl text-zafiro-900">Crear Nuevo Grupo</h2>
                                </div>
                                
                                <form onSubmit={handleCreateGroup} className="p-6">
                                    <div className="space-y-4">
                                        {/* Mentor */}
                                        <div>
                                            <label className="form-label">
                                                Mentor <span className="text-nodux-naranja">*</span>
                                            </label>
                                            <select
                                                required
                                                className="form-input w-full"
                                                value={formData.mentorId}
                                                onChange={(e) => setFormData({...formData, mentorId: e.target.value})}
                                            >
                                                <option value="" className="bg-zafiro-700">Selecciona un mentor</option>
                                                {mentors.map(mentor => (
                                                    <option key={mentor.id} value={mentor.id} className="bg-zafiro-700 text-white">
                                                        {mentor.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Location */}
                                        <div>
                                            <label className="form-label">
                                                Ubicación <span className="text-nodux-naranja">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                className="form-input w-full"
                                                placeholder="Ej: Sala 101, Zoom, etc."
                                                value={formData.location}
                                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                            />
                                        </div>

                                        {/* Mode */}
                                        <div>
                                            <label className="form-label">
                                                Modalidad <span className="text-nodux-naranja">*</span>
                                            </label>
                                            <select
                                                required
                                                className="form-input w-full"
                                                value={formData.mode}
                                                onChange={(e) => setFormData({...formData, mode: e.target.value as any})}
                                            >
                                                {MODE_OPTIONS.map(mode => (
                                                    <option key={mode.value} value={mode.value} className="bg-zafiro-700 text-white">
                                                        {mode.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Schedule Day */}
                                        <div>
                                            <label className="form-label">
                                                Día de la semana <span className="text-nodux-naranja">*</span>
                                            </label>
                                            <select
                                                required
                                                className="form-input w-full"
                                                value={formData.scheduleDay}
                                                onChange={(e) => setFormData({...formData, scheduleDay: e.target.value})}
                                            >
                                                {DAYS_OF_WEEK.map(day => (
                                                    <option key={day.value} value={day.value} className="bg-zafiro-700 text-white">
                                                        {day.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Time Range */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="form-label">
                                                    Hora de inicio <span className="text-nodux-naranja">*</span>
                                                </label>
                                                <input
                                                    type="time"
                                                    required
                                                    className="form-input w-full"
                                                    value={formData.startTime}
                                                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                                                />
                                            </div>
                                            <div>
                                                <label className="form-label">
                                                    Hora de fin <span className="text-nodux-naranja">*</span>
                                                </label>
                                                <input
                                                    type="time"
                                                    required
                                                    className="form-input w-full"
                                                    value={formData.endTime}
                                                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        {/* Date Range */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="form-label">
                                                    Fecha de inicio <span className="text-nodux-naranja">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    required
                                                    className="form-input w-full"
                                                    value={formData.startDate}
                                                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                                />
                                            </div>
                                            <div>
                                                <label className="form-label">
                                                    Fecha de fin <span className="text-nodux-naranja">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    required
                                                    className="form-input w-full"
                                                    value={formData.endDate}
                                                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-6 text-black">
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
                                            {loading ? 'Creando...' : 'Crear Grupo'}
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
