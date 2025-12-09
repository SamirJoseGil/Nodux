import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import SystemAdminLayout from '~/components/Layout/SystemAdminLayout';
import SettingsIcon from "~/components/Icons/SettingsIcon";
import SecurityIcon from "~/components/Icons/SecurityIcon";
import NotificationIcon from "~/components/Icons/NotificationIcon";
import ModulesIcon from "~/components/Icons/ModulesIcon";
import { AdminService } from '~/services/adminService';
import { motion } from 'framer-motion';

export const meta: MetaFunction = () => {
    return [
        { title: `Configuración - Administración - Nodux` },
        { name: "description", content: `Configuración del sistema` },
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

export default function SettingsAdmin() {
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
    const [loadingSettings, setLoadingSettings] = useState(true);
    const [saved, setSaved] = useState(false);

    // Cargar configuración desde el backend
    useEffect(() => {
        const fetchSettings = async () => {
            setLoadingSettings(true);
            try {
                const data = await AdminService.getSystemSettings();
                setSettings(data);
            } catch (error) {
                console.error('Error al cargar configuración:', error);
                alert('Error al cargar la configuración del sistema');
            } finally {
                setLoadingSettings(false);
            }
        };

        fetchSettings();
    }, []);

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
            await AdminService.updateSystemSettings(settings);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Error al guardar configuración:', error);
            alert('Error al guardar la configuración');
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

    if (loadingSettings) {
        return (
            <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
                <SystemAdminLayout title="Configuración del Sistema">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <svg className="animate-spin h-8 w-8 text-nodux-neon mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-zafiro-700 font-inter">Cargando configuración...</p>
                        </div>
                    </div>
                </SystemAdminLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <SystemAdminLayout title="Configuración del Sistema">
                <div className="min-h-screen -m-6 p-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8"
                    >
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-nodux-marino to-nodux-amarillo rounded-xl flex items-center justify-center">
                                    <SettingsIcon size={24} className="text-white" />
                                </div>
                                <div>
                                    <h1 className="font-thicker text-2xl text-zafiro-900">Configuración del Sistema</h1>
                                    <p className="font-inter text-sm text-zafiro-700">Administra parámetros globales</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Aviso de Desarrollo */}
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 mb-8">
                        <div className="flex items-start gap-4">
                            <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <h3 className="font-inter font-bold text-yellow-900 text-lg mb-2">
                                    🚧 Módulo en Desarrollo
                                </h3>
                                <p className="font-inter text-yellow-800 mb-3">
                                    La funcionalidad de configuración del sistema está actualmente en desarrollo. Los cambios realizados se guardan temporalmente en el cliente pero no persisten en el servidor.
                                </p>
                                <div className="bg-white/50 rounded-lg p-3 mt-3">
                                    <p className="font-inter text-sm text-yellow-900 font-semibold mb-2">
                                        📋 Funcionalidades pendientes:
                                    </p>
                                    <ul className="space-y-1 text-sm text-yellow-800">
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-600 mt-0.5">•</span>
                                            <span>Persistencia de configuración en base de datos</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-600 mt-0.5">•</span>
                                            <span>Validación de permisos por configuración</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-600 mt-0.5">•</span>
                                            <span>Integración con servicios externos (Slack, Discord)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-600 mt-0.5">•</span>
                                            <span>Sistema de auditoría de cambios</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {loadingSettings ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-center">
                                <svg className="animate-spin h-8 w-8 text-nodux-neon mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className="text-zafiro-700 font-inter">Cargando configuración...</p>
                            </div>
                        </div>
                    ) : (
                        <>
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

                            {/* Contenido con overlay disabled */}
                            <div className="relative">
                                {/* Overlay de desarrollo */}
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center pointer-events-none">
                                    <div className="text-center p-6 bg-white/90 rounded-2xl border-2 border-yellow-200 shadow-lg max-w-md">
                                        <svg className="w-12 h-12 text-yellow-500 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                        <h3 className="font-inter font-bold text-zafiro-900 text-lg mb-2">
                                            Funcionalidad en Desarrollo
                                        </h3>
                                        <p className="font-inter text-sm text-zafiro-700">
                                            Esta sección estará disponible próximamente
                                        </p>
                                    </div>
                                </div>

                                <div className="card opacity-50">
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
                                                <span className="text-yellow-600 font-medium">
                                                    ⚠️ Guardado en modo demo (no persistente)
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={handleSave}
                                            disabled={true}
                                            className="btn-primary opacity-50 cursor-not-allowed"
                                        >
                                            Guardar Configuración (Demo)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </SystemAdminLayout>
        </ProtectedRoute>
    );
}
