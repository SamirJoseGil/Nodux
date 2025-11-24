import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import ProtectedRoute from '~/components/ProtectedRoute';
import SystemAdminLayout from '~/components/Layout/SystemAdminLayout';
import SettingsIcon from "~/components/Icons/SettingsIcon";
import SecurityIcon from "~/components/Icons/SecurityIcon";
import NotificationIcon from "~/components/Icons/NotificationIcon";
import ModulesIcon from "~/components/Icons/ModulesIcon";

export const meta: MetaFunction = () => {
    return [
        { title: `Configuración del Sistema - Nodux` },
        {
            name: "description",
            content: `Configuración general del sistema Nodux`,
        },
    ];
};

interface SystemSettings {
    general: {
        siteName: string;
        siteDescription: string;
        maintenanceMode: boolean;
        allowRegistration: boolean;
    };
    security: {
        loginAttempts: number;
        sessionTimeout: number;
        passwordMinLength: number;
        requireTwoFactor: boolean;
    };
    notifications: {
        emailNotifications: boolean;
        browserNotifications: boolean;
        slackIntegration: boolean;
        discordIntegration: boolean;
    };
    modules: {
        academicModule: boolean;
        productModule: boolean;
        hrModule: boolean;
    };
}

export default function SystemSettings() {
    const [settings, setSettings] = useState<SystemSettings>({
        general: {
            siteName: 'Nodux',
            siteDescription: 'Plataforma de gestión académica y de proyectos',
            maintenanceMode: false,
            allowRegistration: true,
        },
        security: {
            loginAttempts: 5,
            sessionTimeout: 60,
            passwordMinLength: 8,
            requireTwoFactor: false,
        },
        notifications: {
            emailNotifications: true,
            browserNotifications: true,
            slackIntegration: false,
            discordIntegration: false,
        },
        modules: {
            academicModule: true,
            productModule: true,
            hrModule: false,
        }
    });

    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSettingChange = (section: keyof SystemSettings, key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Simular guardado
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Error al guardar configuración:', error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'general', name: 'General', icon: SettingsIcon },
        { id: 'security', name: 'Seguridad', icon: SecurityIcon },
        { id: 'notifications', name: 'Notificaciones', icon: NotificationIcon },
        { id: 'modules', name: 'Módulos', icon: ModulesIcon },
    ];

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <SystemAdminLayout title="Configuración del Sistema">
                <div className="space-y-6">
                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {tabs.map((tab) => {
                                const IconComponent = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === tab.id
                                                ? 'border-red-500 text-red-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <IconComponent size={16} />
                                        {tab.name}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Contenido */}
                    <div className="card">
                        <div className="card-body">
                            {activeTab === 'general' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-slate-900">Configuración General</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="form-label">Nombre del Sitio</label>
                                            <input
                                                type="text"
                                                value={settings.general.siteName}
                                                onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                                                className="form-input"
                                            />
                                        </div>

                                        <div>
                                            <label className="form-label">Descripción del Sitio</label>
                                            <input
                                                type="text"
                                                value={settings.general.siteDescription}
                                                onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                                                className="form-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-slate-900">Modo de Mantenimiento</h4>
                                                <p className="text-sm text-slate-600">Bloquea el acceso al sitio para todos los usuarios excepto administradores</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={settings.general.maintenanceMode}
                                                onChange={(e) => handleSettingChange('general', 'maintenanceMode', e.target.checked)}
                                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-slate-900">Permitir Registro</h4>
                                                <p className="text-sm text-slate-600">Permite que nuevos usuarios se registren en la plataforma</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={settings.general.allowRegistration}
                                                onChange={(e) => handleSettingChange('general', 'allowRegistration', e.target.checked)}
                                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-slate-900">Configuración de Seguridad</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="form-label">Intentos de Login Máximos</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="10"
                                                value={settings.security.loginAttempts}
                                                onChange={(e) => handleSettingChange('security', 'loginAttempts', parseInt(e.target.value))}
                                                className="form-input"
                                            />
                                        </div>

                                        <div>
                                            <label className="form-label">Timeout de Sesión (minutos)</label>
                                            <input
                                                type="number"
                                                min="15"
                                                max="480"
                                                value={settings.security.sessionTimeout}
                                                onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                                                className="form-input"
                                            />
                                        </div>

                                        <div>
                                            <label className="form-label">Longitud Mínima de Contraseña</label>
                                            <input
                                                type="number"
                                                min="6"
                                                max="20"
                                                value={settings.security.passwordMinLength}
                                                onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                                                className="form-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-slate-900">Autenticación de Dos Factores</h4>
                                            <p className="text-sm text-slate-600">Requiere un segundo factor de autenticación para todos los usuarios</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.security.requireTwoFactor}
                                            onChange={(e) => handleSettingChange('security', 'requireTwoFactor', e.target.checked)}
                                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-slate-900">Configuración de Notificaciones</h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-slate-900">Notificaciones por Email</h4>
                                                <p className="text-sm text-slate-600">Envía notificaciones importantes por correo electrónico</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={settings.notifications.emailNotifications}
                                                onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-slate-900">Notificaciones del Navegador</h4>
                                                <p className="text-sm text-slate-600">Muestra notificaciones push en el navegador</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={settings.notifications.browserNotifications}
                                                onChange={(e) => handleSettingChange('notifications', 'browserNotifications', e.target.checked)}
                                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-slate-900">Integración con Slack</h4>
                                                <p className="text-sm text-slate-600">Envía notificaciones a canales de Slack configurados</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={settings.notifications.slackIntegration}
                                                onChange={(e) => handleSettingChange('notifications', 'slackIntegration', e.target.checked)}
                                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-slate-900">Integración con Discord</h4>
                                                <p className="text-sm text-slate-600">Envía notificaciones a servidores de Discord</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={settings.notifications.discordIntegration}
                                                onChange={(e) => handleSettingChange('notifications', 'discordIntegration', e.target.checked)}
                                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'modules' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-slate-900">Configuración de Módulos</h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-slate-900">Módulo Académico</h4>
                                                <p className="text-sm text-slate-600">Gestión de proyectos académicos, mentores y estudiantes</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={settings.modules.academicModule}
                                                onChange={(e) => handleSettingChange('modules', 'academicModule', e.target.checked)}
                                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-slate-900">Módulo de Producto</h4>
                                                <p className="text-sm text-slate-600">Gestión de productos, inventario y ventas</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={settings.modules.productModule}
                                                onChange={(e) => handleSettingChange('modules', 'productModule', e.target.checked)}
                                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-slate-900">Módulo de Recursos Humanos</h4>
                                                <p className="text-sm text-slate-600">Gestión de empleados, nómina y evaluaciones</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={settings.modules.hrModule}
                                                onChange={(e) => handleSettingChange('modules', 'hrModule', e.target.checked)}
                                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="card-footer flex justify-between items-center">
                            <div>
                                {saved && (
                                    <span className="text-green-600 font-medium">
                                        ✓ Configuración guardada correctamente
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="btn-primary"
                            >
                                {loading ? 'Guardando...' : 'Guardar Configuración'}
                            </button>
                        </div>
                    </div>
                </div>
            </SystemAdminLayout>
        </ProtectedRoute>
    );
}
