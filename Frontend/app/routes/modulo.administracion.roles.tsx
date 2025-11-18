import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import ProtectedRoute from '~/components/ProtectedRoute';
import SystemAdminLayout from '~/components/Layout/SystemAdminLayout';
import SecurityIcon from "~/components/Icons/SecurityIcon";

export const meta: MetaFunction = () => {
    return [
        { title: `Gestión de Roles - Administración - Nodux` },
        {
            name: "description",
            content: `Gestiona roles y permisos del sistema`,
        },
    ];
};

interface Role {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    userCount: number;
    isSystemRole: boolean;
}

interface Permission {
    id: string;
    name: string;
    description: string;
    module: string;
}

export default function RolesAdmin() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Datos simulados
                const mockRoles: Role[] = [
                    {
                        id: '1',
                        name: 'SuperAdmin',
                        description: 'Acceso completo al sistema',
                        permissions: ['*'],
                        userCount: 2,
                        isSystemRole: true
                    },
                    {
                        id: '2',
                        name: 'Admin',
                        description: 'Administrador de módulos',
                        permissions: ['view_dashboard', 'manage_users', 'manage_projects'],
                        userCount: 5,
                        isSystemRole: true
                    },
                    {
                        id: '3',
                        name: 'Mentor',
                        description: 'Mentor académico',
                        permissions: ['view_projects', 'manage_hours', 'view_students'],
                        userCount: 15,
                        isSystemRole: true
                    },
                    {
                        id: '4',
                        name: 'Estudiante',
                        description: 'Estudiante del programa',
                        permissions: ['view_own_projects', 'submit_tasks'],
                        userCount: 150,
                        isSystemRole: true
                    }
                ];

                const mockPermissions: Permission[] = [
                    { id: '1', name: 'view_dashboard', description: 'Ver dashboard', module: 'General' },
                    { id: '2', name: 'manage_users', description: 'Gestionar usuarios', module: 'Administración' },
                    { id: '3', name: 'manage_projects', description: 'Gestionar proyectos', module: 'Académico' },
                    { id: '4', name: 'view_projects', description: 'Ver proyectos', module: 'Académico' },
                    { id: '5', name: 'manage_hours', description: 'Gestionar horas', module: 'Académico' },
                    { id: '6', name: 'view_students', description: 'Ver estudiantes', module: 'Académico' },
                    { id: '7', name: 'view_own_projects', description: 'Ver proyectos propios', module: 'Académico' },
                    { id: '8', name: 'submit_tasks', description: 'Entregar tareas', module: 'Académico' }
                ];

                setRoles(mockRoles);
                setPermissions(mockPermissions);
            } catch (error) {
                console.error('Error al cargar datos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleRoleSelect = (role: Role) => {
        setSelectedRole(role);
    };

    const getRoleColor = (roleName: string) => {
        switch (roleName) {
            case 'SuperAdmin':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'Admin':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Mentor':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Estudiante':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const groupedPermissions = permissions.reduce((acc, permission) => {
        if (!acc[permission.module]) {
            acc[permission.module] = [];
        }
        acc[permission.module].push(permission);
        return acc;
    }, {} as Record<string, Permission[]>);

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <SystemAdminLayout title="Gestión de Roles y Permisos">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Lista de roles */}
                        <div className="lg:col-span-2">
                            <div className="card">
                                <div className="card-header flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        Roles del Sistema ({roles.length})
                                    </h3>
                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="btn-primary"
                                    >
                                        Crear Rol
                                    </button>
                                </div>

                                <div className="card-body">
                                    <div className="space-y-4">
                                        {roles.map((role) => (
                                            <div
                                                key={role.id}
                                                onClick={() => handleRoleSelect(role)}
                                                className={`p-4 border border-gray-200 rounded-lg cursor-pointer hover:shadow-md transition-all ${selectedRole?.id === role.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="font-semibold text-slate-900">{role.name}</h4>
                                                        {role.isSystemRole && (
                                                            <span className="badge badge-neutral text-xs">Sistema</span>
                                                        )}
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(role.name)}`}>
                                                        {role.userCount} usuarios
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 mb-3">{role.description}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {role.permissions.slice(0, 3).map((permission, index) => (
                                                        <span key={index} className="badge badge-info text-xs">
                                                            {permission === '*' ? 'Todos los permisos' : permission}
                                                        </span>
                                                    ))}
                                                    {role.permissions.length > 3 && (
                                                        <span className="badge badge-neutral text-xs">
                                                            +{role.permissions.length - 3} más
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Panel de detalle */}
                        <div className="lg:col-span-1">
                            {selectedRole ? (
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="text-lg font-semibold text-slate-900">
                                            Detalles del Rol
                                        </h3>
                                    </div>
                                    <div className="card-body space-y-4">
                                        <div>
                                            <label className="form-label">Nombre del Rol</label>
                                            <input
                                                type="text"
                                                value={selectedRole.name}
                                                disabled={selectedRole.isSystemRole}
                                                className="form-input"
                                            />
                                        </div>

                                        <div>
                                            <label className="form-label">Descripción</label>
                                            <textarea
                                                value={selectedRole.description}
                                                disabled={selectedRole.isSystemRole}
                                                className="form-input"
                                                rows={3}
                                            />
                                        </div>

                                        <div>
                                            <label className="form-label">Usuarios Asignados</label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-bold text-slate-900">
                                                    {selectedRole.userCount}
                                                </span>
                                                <span className="text-sm text-slate-600">usuarios</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="form-label">Permisos</label>
                                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                                {selectedRole.permissions.includes('*') ? (
                                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-red-600 text-lg">⚡</span>
                                                            <span className="font-medium text-red-800">
                                                                Acceso Total al Sistema
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-red-600 mt-1">
                                                            Este rol tiene acceso completo a todas las funcionalidades.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                                                        <div key={module} className="border border-gray-200 rounded-lg p-3">
                                                            <h5 className="font-medium text-slate-900 mb-2">{module}</h5>
                                                            <div className="space-y-2">
                                                                {modulePermissions.map((permission) => (
                                                                    <div key={permission.id} className="flex items-center">
                                                                        <input
                                                                            type="checkbox"
                                                                            id={permission.id}
                                                                            checked={selectedRole.permissions.includes(permission.name)}
                                                                            disabled={selectedRole.isSystemRole}
                                                                            className="mr-2"
                                                                        />
                                                                        <label htmlFor={permission.id} className="text-sm text-slate-700">
                                                                            {permission.description}
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {!selectedRole.isSystemRole && (
                                        <div className="card-footer flex gap-2">
                                            <button className="btn-secondary">
                                                Guardar Cambios
                                            </button>
                                            <button className="btn-primary bg-red-600 hover:bg-red-700">
                                                Eliminar Rol
                                            </button>
                                        </div>
                                    )}

                                    {selectedRole.isSystemRole && (
                                        <div className="card-footer">
                                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                <p className="text-sm text-yellow-800">
                                                    ⚠️ Este es un rol del sistema y no puede ser modificado.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="card p-12 text-center">
                                    <SecurityIcon size={48} className="mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-2xl font-semibold text-slate-900 mb-2">Sin acceso</h3>
                                    <p className="text-slate-600">Selecciona un rol para ver sus detalles</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </SystemAdminLayout>
        </ProtectedRoute>
    );
}
