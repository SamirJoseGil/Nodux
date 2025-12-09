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
    { value: 0, label: 'Lunes', short: 'Lun' },
    { value: 1, label: 'Martes', short: 'Mar' },
    { value: 2, label: 'Miércoles', short: 'Mié' },
    { value: 3, label: 'Jueves', short: 'Jue' },
    { value: 4, label: 'Viernes', short: 'Vie' },
    { value: 5, label: 'Sábado', short: 'Sáb' },
    { value: 6, label: 'Domingo', short: 'Dom' }
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
    const [selectedDays, setSelectedDays] = useState<number[]>([]);
    const [formData, setFormData] = useState({
        projectId: '',
        mentorId: '',
        location: '',
        mode: 'presencial' as 'presencial' | 'virtual' | 'hibrido',
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

    const handleDayToggle = (dayValue: number) => {
        setSelectedDays(prev => {
            if (prev.includes(dayValue)) {
                return prev.filter(d => d !== dayValue);
            } else {
                return [...prev, dayValue].sort();
            }
        });
    };

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.projectId || !formData.mentorId || !formData.location) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        if (selectedDays.length === 0) {
            alert('Por favor selecciona al menos un día de la semana');
            return;
        }

        setLoading(true);
        try {
            const createdGroups: Group[] = [];
            const errors: string[] = [];

            // Crear un grupo por cada día seleccionado
            for (const day of selectedDays) {
                try {
                    const newGroup = await GroupService.createGroup(formData.projectId, {
                        mentorId: formData.mentorId,
                        location: formData.location,
                        mode: formData.mode,
                        scheduleDay: day,
                        startTime: `${formData.startTime}:00`,
                        endTime: `${formData.endTime}:00`,
                        startDate: formData.startDate,
                        endDate: formData.endDate
                    });
                    createdGroups.push(newGroup);
                } catch (error: any) {
                    const dayName = DAYS_OF_WEEK.find(d => d.value === day)?.label || `Día ${day}`;
                    errors.push(`${dayName}: ${error.message}`);
                }
            }

            // Actualizar la lista de grupos con los grupos creados
            if (createdGroups.length > 0) {
                setGroups([...groups, ...createdGroups]);
            }

            // Cerrar modal y resetear formulario
            setShowCreateModal(false);
            setSelectedDays([]);
            setFormData({
                projectId: formData.projectId,
                mentorId: '',
                location: '',
                mode: 'presencial',
                startTime: '08:00',
                endTime: '10:00',
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            });

            // Mostrar mensaje de resultado
            if (errors.length === 0) {
                alert(`✅ Se crearon ${createdGroups.length} grupo(s) exitosamente`);
            } else if (createdGroups.length > 0) {
                alert(`⚠️ Se crearon ${createdGroups.length} grupo(s).\n\nErrores:\n${errors.join('\n')}`);
            } else {
                alert(`❌ No se pudo crear ningún grupo:\n${errors.join('\n')}`);
            }
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
                                        <div>
                                            <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Proyecto</span>
                                            <p className="font-inter text-zafiro-900 mt-1">
                                                {projects.find(p => p.id === selectedGroup.projectId)?.name || 'Proyecto ID: ' + selectedGroup.projectId}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Mentor</span>
                                            <p className="font-inter text-zafiro-900 mt-1">
                                                {mentors.find(m => m.id === selectedGroup.mentorId)?.name || 'Mentor ID: ' + selectedGroup.mentorId}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Modalidad</span>
                                            <p className="font-inter text-zafiro-900 mt-1 capitalize">
                                                {selectedGroup.mode || 'No especificada'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Ubicación</span>
                                            <p className="font-inter text-zafiro-900 mt-1">
                                                {selectedGroup.location || 'No especificada'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Horario</span>
                                            {selectedGroup.schedule && selectedGroup.schedule.length > 0 ? (
                                                <ul className="mt-1 space-y-1">
                                                    {selectedGroup.schedule.map((sch, idx) => {
                                                        const dayNum = parseInt(sch.day);
                                                        const dayObj = DAYS_OF_WEEK.find(d => d.value === dayNum);
                                                        return (
                                                            <li key={idx} className="font-inter text-zafiro-900">
                                                                {dayObj?.label || `Día ${sch.day}`}: {sch.startTime} - {sch.endTime}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            ) : (
                                                <p className="font-inter text-zafiro-900 mt-1">Sin horario definido</p>
                                            )}
                                        </div>
                                        <div>
                                            <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Fecha de inicio</span>
                                            <p className="font-inter text-zafiro-900 mt-1">
                                                {selectedGroup.startDate || 'No especificada'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Fecha de fin</span>
                                            <p className="font-inter text-zafiro-900 mt-1">
                                                {selectedGroup.endDate || 'No especificada'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="font-inter text-xs font-bold text-zafiro-600 uppercase">Estado</span>
                                            <p className="mt-1">
                                                <span className={`badge ${selectedGroup.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                                                    {selectedGroup.status === 'active' ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </p>
                                        </div>
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
                                    <p className="font-inter text-sm text-zafiro-700 mt-1">
                                        Selecciona múltiples días para crear varios grupos con el mismo horario
                                    </p>
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

                                        {/* Days of Week - Botones de Selección Múltiple */}
                                        <div>
                                            <label className="form-label mb-3 block">
                                                Días de la semana <span className="text-nodux-naranja">*</span>
                                            </label>
                                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                                {DAYS_OF_WEEK.map(day => {
                                                    const isSelected = selectedDays.includes(day.value);
                                                    return (
                                                        <motion.button
                                                            key={day.value}
                                                            type="button"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleDayToggle(day.value)}
                                                            className={`
                                                                py-3 px-2 rounded-lg font-inter font-bold text-sm transition-all
                                                                ${isSelected 
                                                                    ? 'bg-nodux-neon text-white shadow-neon' 
                                                                    : 'bg-white/50 text-zafiro-700 hover:bg-white/70 border border-zafiro-300'
                                                                }
                                                            `}
                                                        >
                                                            <div className="hidden sm:block">{day.short}</div>
                                                            <div className="sm:hidden">{day.label}</div>
                                                        </motion.button>
                                                    );
                                                })}
                                            </div>
                                            {selectedDays.length > 0 && (
                                                <p className="text-sm text-nodux-neon mt-2 font-inter font-medium">
                                                    ✓ {selectedDays.length} día(s) seleccionado(s): {
                                                        selectedDays
                                                            .map(d => DAYS_OF_WEEK.find(day => day.value === d)?.short)
                                                            .join(', ')
                                                    }
                                                </p>
                                            )}
                                            {selectedDays.length === 0 && (
                                                <p className="text-sm text-zafiro-600 mt-2 font-inter">
                                                    Selecciona uno o más días de la semana
                                                </p>
                                            )}
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

                                        {/* Resumen de grupos a crear */}
                                        {selectedDays.length > 0 && (
                                            <div className="bg-nodux-neon/10 border border-nodux-neon/30 rounded-xl p-4">
                                                <h4 className="font-inter font-bold text-zafiro-900 mb-2 flex items-center gap-2">
                                                    <FeatureIcon type="calendar" size={18} className="text-nodux-neon" />
                                                    Resumen de creación
                                                </h4>
                                                <p className="font-inter text-sm text-zafiro-700">
                                                    Se crearán <span className="font-bold text-nodux-neon">{selectedDays.length} grupo(s)</span> con el siguiente horario:
                                                </p>
                                                <ul className="mt-2 space-y-1">
                                                    {selectedDays.map(dayValue => {
                                                        const day = DAYS_OF_WEEK.find(d => d.value === dayValue);
                                                        return (
                                                            <li key={dayValue} className="font-inter text-sm text-zafiro-700">
                                                                • <span className="font-semibold">{day?.label}</span>: {formData.startTime} - {formData.endTime}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2 mt-6 text-black">
                                        <button 
                                            type="button" 
                                            className="btn-secondary flex-1" 
                                            onClick={() => {
                                                setShowCreateModal(false);
                                                setSelectedDays([]);
                                            }}
                                            disabled={loading}
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="btn-primary flex-1"
                                            disabled={loading || selectedDays.length === 0}
                                        >
                                            {loading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Creando grupos...
                                                </span>
                                            ) : (
                                                `Crear ${selectedDays.length > 0 ? selectedDays.length : ''} Grupo${selectedDays.length !== 1 ? 's' : ''}`
                                            )}
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
