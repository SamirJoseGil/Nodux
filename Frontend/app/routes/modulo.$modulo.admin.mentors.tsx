import { useState, useEffect } from 'react';
import { useParams } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import AdminLayout from '~/components/Layout/AdminLayout';
import ProtectedRoute from '~/components/ProtectedRoute';
import { MentorService } from '~/services/academicService';
import type { Mentor } from '~/types/academic';

export const meta: MetaFunction = ({ params }) => {
    const moduleName = params.modulo ?
        params.modulo.charAt(0).toUpperCase() + params.modulo.slice(1) :
        'Módulo';

    return [
        { title: `Gestión de Mentores - ${moduleName} - Nodux` },
        {
            name: "description",
            content: `Gestiona mentores en el módulo ${moduleName}`,
        },
    ];
};

export default function MentorsAdmin() {
    const { modulo } = useParams();
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

    useEffect(() => {
        const fetchMentors = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await MentorService.getMentors();
                setMentors(data);
            } catch (err) {
                setError('Error al cargar los mentores. Inténtalo de nuevo más tarde.');
                console.error('Error loading mentors:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMentors();
    }, [modulo]);

    const handleMentorSelect = (mentor: Mentor) => {
        setSelectedMentor(mentor);
    };

    const getStatusColor = (status: string) => {
        return status === 'active' ? 'badge-success' : 'badge-error';
    };

    const getStatusText = (status: string) => {
        return status === 'active' ? 'Activo' : 'Inactivo';
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
                                <button type="button" className="btn-primary">
                                    Agregar mentor
                                </button>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : error ? (
                                <div className="card-body text-red-600">{error}</div>
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
                                                        <div>{mentor.projectCount || 0} proyectos</div>
                                                        <div>{mentor.totalHours || 0} horas</div>
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
                                    <div>
                                        <dt className="text-sm font-medium text-slate-600">Nombre</dt>
                                        <dd className="text-sm text-slate-900">{selectedMentor.name}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-slate-600">Email</dt>
                                        <dd className="text-sm text-slate-900">{selectedMentor.email}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-slate-600">Especialidad</dt>
                                        <dd className="text-sm text-slate-900">{selectedMentor.specialty}</dd>
                                    </div>
                                    {selectedMentor.bio && (
                                        <div>
                                            <dt className="text-sm font-medium text-slate-600">Biografía</dt>
                                            <dd className="text-sm text-slate-900">{selectedMentor.bio}</dd>
                                        </div>
                                    )}
                                    <div>
                                        <dt className="text-sm font-medium text-slate-600">Estado</dt>
                                        <dd className="text-sm text-slate-900">
                                            <span className={`badge ${getStatusColor(selectedMentor.status)}`}>
                                                {getStatusText(selectedMentor.status)}
                                            </span>
                                        </dd>
                                    </div>
                                    {selectedMentor.expertise && selectedMentor.expertise.length > 0 && (
                                        <div>
                                            <dt className="text-sm font-medium text-slate-600">Experiencia</dt>
                                            <dd className="text-sm text-slate-900">
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {selectedMentor.expertise.map((skill, index) => (
                                                        <span key={index} className="badge badge-info">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </dd>
                                        </div>
                                    )}
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
            </AdminLayout>
        </ProtectedRoute>
    );
}
