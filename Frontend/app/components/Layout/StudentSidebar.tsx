import { Link, useLocation } from "@remix-run/react";
import { useAuth } from "~/contexts/AuthContext";

export default function StudentSidebar() {
    const location = useLocation();
    const { user, logout } = useAuth();

    const menuItems = [
        { name: 'Dashboard', path: '/modulo/academico/estudiante/dashboard', icon: '📊' },
        { name: 'Mis Grupos', path: '/modulo/academico/estudiante/groups', icon: '👨‍👩‍👧‍👦' },
        { name: 'Calendario', path: '/modulo/academico/estudiante/calendar', icon: '📅' },
        { name: 'Recursos', path: '/modulo/academico/estudiante/resources', icon: '📚' },
        { name: 'Tareas', path: '/modulo/academico/estudiante/tasks', icon: '📝' },
        { name: 'Mi Perfil', path: '/modulo/academico/estudiante/profile', icon: '👤' },
    ];

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div className="bg-blue-800 text-white w-64 min-h-screen flex flex-col">
            <div className="p-4 border-b border-blue-700">
                <h2 className="text-2xl font-semibold">Nodux Estudiante</h2>
                <p className="text-sm text-blue-300">
                    Plataforma Académica
                </p>
            </div>

            <div className="p-4 border-b border-blue-700">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-600 rounded-full h-10 w-10 flex items-center justify-center">
                        <span className="text-lg font-semibold">{user?.name.charAt(0) || 'E'}</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium">{user?.name || 'Estudiante'}</p>
                        <p className="text-xs text-blue-300">{user?.role || 'Estudiante'}</p>
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
                                        ? 'bg-blue-700 text-white'
                                        : 'text-blue-200 hover:bg-blue-700'
                                    }`}
                            >
                                <span className="mr-3 text-lg">{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-blue-700">
                <button
                    onClick={logout}
                    className="flex items-center px-4 py-2 w-full text-blue-200 hover:bg-blue-700 rounded-lg transition-colors"
                >
                    <span className="mr-3 text-lg">👋</span>
                    <span>Cerrar sesión</span>
                </button>
            </div>
        </div>
    );
}
