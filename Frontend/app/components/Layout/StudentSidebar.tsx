import { Link, useLocation } from "@remix-run/react";
import { useAuth } from "~/contexts/AuthContext";
import DashboardIcon from "~/components/Icons/DashboardIcon";
import GroupIcon from "~/components/Icons/GroupIcon";
import CalendarIcon from "~/components/Icons/CalendarIcon";
import ResourceIcon from "~/components/Icons/ResourceIcon";
import TaskIcon from "~/components/Icons/TaskIcon";
import UsersIcon from "~/components/Icons/UsersIcon";

export default function StudentSidebar() {
    const location = useLocation();
    const { user, logout } = useAuth();

    const menuItems = [
        { name: 'Dashboard', path: '/modulo/academico/estudiante/dashboard', icon: DashboardIcon },
        { name: 'Mis Grupos', path: '/modulo/academico/estudiante/groups', icon: GroupIcon },
        { name: 'Calendario', path: '/modulo/academico/estudiante/calendar', icon: CalendarIcon },
        { name: 'Recursos', path: '/modulo/academico/estudiante/resources', icon: ResourceIcon },
        { name: 'Tareas', path: '/modulo/academico/estudiante/tasks', icon: TaskIcon },
        { name: 'Mi Perfil', path: '/modulo/academico/estudiante/profile', icon: UsersIcon },
    ];

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div className="sidebar bg-white border-r border-gray-200 shadow-sm">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-slate-900">Nodux Estudiante</h2>
                <p className="text-sm text-slate-600 mt-1">
                    Plataforma Académica
                </p>
            </div>

            {/* User info */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="bg-blue-600 rounded-full h-12 w-12 flex items-center justify-center shadow-sm">
                            <span className="text-lg font-semibold text-white">{user?.name.charAt(0) || 'E'}</span>
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'Estudiante'}</p>
                        <p className="text-xs text-blue-600 font-medium">{user?.role || 'Estudiante'}</p>
                    </div>
                </div>
            </div>

            {/* Navigation menu */}
            <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${isActive(item.path)
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                        : 'text-slate-700 hover:bg-gray-50 hover:text-slate-900'
                                        }`}
                                >
                                    <IconComponent
                                        size={20}
                                        className={`mr-3 ${isActive(item.path) ? 'text-blue-600' : 'text-slate-500'}`}
                                    />
                                    <span className="font-medium">{item.name}</span>
                                    {isActive(item.path) && (
                                        <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer actions */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button
                    onClick={logout}
                    className="flex items-center px-4 py-3 w-full text-slate-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all"
                >
                    <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">Cerrar sesión</span>
                </button>
            </div>
        </div>
    );
}
