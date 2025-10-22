import { Link, useLocation } from "@remix-run/react";
import { useAuth } from "~/contexts/AuthContext";

export default function SystemAdminSidebar() {
    const location = useLocation();
    const { user, logout } = useAuth();

    const menuItems = [
        { name: 'Dashboard', path: '/modulo/administracion/dashboard', icon: '📊' },
        { name: 'Usuarios', path: '/modulo/administracion/users', icon: '👥' },
        { name: 'Roles y Permisos', path: '/modulo/administracion/roles', icon: '🔐' },
        { name: 'Logs del Sistema', path: '/modulo/administracion/logs', icon: '📝' },
        { name: 'Configuración', path: '/modulo/administracion/settings', icon: '⚙️' },
    ];

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div className="bg-gray-900 text-white w-64 min-h-screen flex flex-col">
            <div className="p-4 border-b border-gray-800">
                <h2 className="text-2xl font-semibold">Admin del Sistema</h2>
                <p className="text-sm text-gray-400">
                    Gestión centralizada
                </p>
            </div>

            <div className="p-4 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                    <div className="bg-red-600 rounded-full h-10 w-10 flex items-center justify-center">
                        <span className="text-lg font-semibold">{user?.name.charAt(0) || 'A'}</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium">{user?.name || 'Administrador'}</p>
                        <p className="text-xs text-gray-400">{user?.role || 'Admin'}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4">
                <ul className="space-y-1">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${isActive(item.path)
                                        ? 'bg-gray-700 text-white'
                                        : 'text-gray-300 hover:bg-gray-800'
                                    }`}
                            >
                                <span className="mr-3 text-lg">{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-800">
                <Link
                    to="/selector-modulo"
                    className="flex items-center px-4 py-2 w-full text-gray-300 hover:bg-gray-800 rounded-lg transition-colors mb-2"
                >
                    <span className="mr-3 text-lg">🔄</span>
                    <span>Cambiar Módulo</span>
                </Link>

                <button
                    onClick={logout}
                    className="flex items-center px-4 py-2 w-full text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <span className="mr-3 text-lg">👋</span>
                    <span>Cerrar sesión</span>
                </button>
            </div>
        </div>
    );
}
