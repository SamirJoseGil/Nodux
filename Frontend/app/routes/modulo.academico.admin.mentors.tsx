import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import AdminLayout from '~/components/Layout/AdminLayout';
import ProtectedRoute from '~/components/ProtectedRoute';
import { MentorService } from '~/services/academicService';
import type { Mentor } from '~/types/academic';

export const meta: MetaFunction = () => {
    return [
        { title: `Gestión de Mentores - Académico - Nodux` },
        {
            name: "description",
            content: `Gestiona mentores en el módulo académico`,
        },
    ];
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

    const getStatusColor = (status: string) => {
        return status === 'active' ? 'badge-success' : 'badge-error';
    };

    const getStatusText = (status: string) => {
        return status === 'active' ? 'Activo' : 'Inactivo';
    };

    const handleCreateMentor = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validar que los campos requeridos estén completos
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

        setLoading(true);
        try {
            console.log('Creando mentor con datos:', formData);
            const newMentor = await MentorService.createMentor(formData);
            setMentors([...mentors, newMentor]);
            setShowCreateModal(false);
            setFormData({ name: '', email: '', phone: '', specialty: '' });
            alert('Mentor creado exitosamente');
        } catch (error: any) {
            console.error('Error al crear mentor:', error);
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.error ||
                                'Error al crear mentor. Por favor verifica los datos.';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <AdminLayout title="Gestión de Mentores">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Lista de mentores */}
                    <div className="lg:col-span-2">
                        <div className="card">
                            <div className="card-header flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Mentores ({mentors.length})
                                </h3>
                                <button 
                                    type="button" 
                                    className="btn-primary"
                                    onClick={() => setShowCreateModal(true)}
                                >
                                    Agregar mentor
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
                                                <th className="table-header-cell">Mentor</th>
                                                <th className="table-header-cell">Especialidad</th>
                                                <th className="table-header-cell">Estado</th>
                                                <th className="table-header-cell">Estadísticas</th>
                                                <th className="table-header-cell">
                                                    <span className="sr-only">Acciones</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {mentors.map((mentor) => (
                                                <tr
                                                    key={mentor.id}
                                                    onClick={() => handleMentorSelect(mentor)}
                                                    className={`table-row cursor-pointer ${selectedMentor?.id === mentor.id ? 'bg-blue-50' : ''}`}
                                                >
                                                    <td className="table-cell">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                {mentor.profileImage ? (
                                                                    <img className="h-10 w-10 rounded-full" src={mentor.profileImage} alt="" />
                                                                ) : (
                                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                                        <span className="text-blue-800 font-medium">{mentor.name.charAt(0)}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-slate-900">{mentor.name}</div>
                                                                <div className="text-sm text-slate-600">{mentor.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="table-cell">
                                                        <div className="text-sm text-slate-900">{mentor.specialty}</div>
                                                    </td>
                                                    <td className="table-cell">
                                                        <span className={`badge ${getStatusColor(mentor.status)}`}>
                                                            {getStatusText(mentor.status)}
                                                        </span>
                                                    </td>
                                                    <td className="table-cell">
                                                        <div>{mentor.projectCount ?? 0} proyectos</div>
                                                        <div>{mentor.totalHours ?? 0} horas</div>
                                                    </td>
                                                    <td className="table-cell text-right">
                                                        <button
                                                            type="button"
                                                            className="btn-ghost"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleMentorSelect(mentor);
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
                        {selectedMentor ? (
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        Detalles del Mentor
                                    </h3>
                                </div>
                                <div className="card-body space-y-4">
                                    {/* ...existing mentor details... */}
                                </div>
                                <div className="card-footer flex gap-2">
                                    <button type="button" className="btn-secondary">
                                        Editar
                                    </button>
                                    <button type="button" className="btn-primary">
                                        Ver proyectos
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="card p-6 text-center">
                                <p className="text-slate-600">Selecciona un mentor para ver sus detalles</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal de creación */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h2 className="text-xl font-bold mb-4">Crear Mentor</h2>
                            <form onSubmit={handleCreateMentor}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Nombre completo <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="form-input mt-1 w-full"
                                            placeholder="Juan Pérez"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            className="form-input mt-1 w-full"
                                            placeholder="juan@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                        <input
                                            type="tel"
                                            className="form-input mt-1 w-full"
                                            placeholder="+57 300 123 4567"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Especialidad <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="form-input mt-1 w-full"
                                            placeholder="Frontend Developer"
                                            value={formData.specialty}
                                            onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                                        />
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