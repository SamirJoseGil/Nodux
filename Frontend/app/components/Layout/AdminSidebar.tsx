import { Link, useLocation } from "@remix-run/react";
import { useAuth } from "~/contexts/AuthContext";
import { useModule } from "~/contexts/ModuleContext";
import { useSidebar } from "~/contexts/SidebarContext";
import { useMemo } from "react";
import DashboardIcon from "~/components/Icons/DashboardIcon";
import ProjectIcon from "~/components/Icons/ProjectIcon";
import MentorIcon from "~/components/Icons/MentorIcon";
import GroupIcon from "~/components/Icons/GroupIcon";
import TimeIcon from "~/components/Icons/TimeIcon";
import CalendarIcon from "~/components/Icons/CalendarIcon";
import ChartIcon from "~/components/Icons/ChartIcon";
import PinIcon from "~/components/Icons/PinIcon";
import MenuIcon from "~/components/Icons/MenuIcon";

export default function AdminSidebar() {
    const location = useLocation();
    const { user, logout } = useAuth();
    const { activeModule } = useModule();
    const { isCollapsed, isPinned, toggleCollapsed, togglePinned } = useSidebar();

    const modulePrefix = useMemo(() => {
        if (activeModule) {
            return `/modulo/${activeModule.toLowerCase()}`;
        }
        return '';
    }, [activeModule]);

    const menuItems = [
        { name: 'Dashboard', path: `/modulo/academico/dashboard`, icon: DashboardIcon },
        { name: 'Proyectos', path: `/modulo/academico/admin/projects`, icon: ProjectIcon },
        { name: 'Mentores', path: `/modulo/academico/admin/mentors`, icon: MentorIcon },
        { name: 'Grupos', path: `/modulo/academico/admin/groups`, icon: GroupIcon },
        { name: 'Registro de horas', path: `/modulo/academico/admin/hours`, icon: TimeIcon },
        { name: 'Calendario', path: `/modulo/academico/admin/calendar`, icon: CalendarIcon },
        { name: 'Métricas', path: `/modulo/academico/admin/metrics`, icon: ChartIcon },
    ];

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <>
            {/* Overlay for mobile when sidebar is expanded */}
            {!isCollapsed && !isPinned && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={toggleCollapsed}
                />
            )}

            <div className={`
                ${isPinned ? 'fixed' : 'absolute'} 
                top-0 left-0 z-40 
                transition-all duration-300 ease-in-out
                ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}
                bg-white border-r border-gray-200 shadow-lg
                ${isCollapsed ? 'w-0' : 'w-64'}
                h-screen overflow-hidden
                flex flex-col
            `}>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                    {!isCollapsed && (
                        <>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl font-bold text-slate-900 truncate">
                                    Nodux
                                </h2>
                                <p className="text-sm text-slate-600 truncate">
                                    {activeModule || 'Plataforma de Gestión'}
                                </p>
                            </div>

                            <div className="flex items-center space-x-2 flex-shrink-0">
                                <button
                                    onClick={togglePinned}
                                    className={`p-2 rounded-md transition-colors ${isPinned
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                        }`}
                                    title={isPinned ? 'Desfijar sidebar' : 'Fijar sidebar'}
                                >
                                    <PinIcon size={16} />
                                </button>

                                <button
                                    onClick={toggleCollapsed}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                    title="Contraer sidebar"
                                >
                                    <MenuIcon size={16} />
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {!isCollapsed && (
                    <>
                        {/* User info */}
                        <div className="p-4 border-b border-gray-200 flex-shrink-0">
                            <div className="flex items-center space-x-3">
                                <div className="relative flex-shrink-0">
                                    <div className="bg-blue-600 rounded-full h-12 w-12 flex items-center justify-center shadow-sm">
                                        <span className="text-lg font-semibold text-white">{user?.name.charAt(0) || 'A'}</span>
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'Usuario Admin'}</p>
                                    <p className="text-xs text-blue-600 font-medium">{user?.role || 'Admin'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation menu */}
                        <nav className="flex-1 p-4 overflow-y-auto min-h-0">
                            <ul className="space-y-1">
                                {menuItems.map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <li key={item.path}>
                                            <Link
                                                to={item.path}
                                                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${isActive(item.path)
                                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                    : 'text-slate-700 hover:bg-gray-50 hover:text-slate-900'
                                                    }`}
                                            >
                                                <IconComponent
                                                    size={20}
                                                    className={`mr-3 flex-shrink-0 ${isActive(item.path) ? 'text-blue-600' : 'text-slate-500'}`}
                                                />
                                                <span className="font-medium truncate">{item.name}</span>
                                                {isActive(item.path) && (
                                                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                                                )}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        {/* Footer actions */}
                        <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2 flex-shrink-0">
                            <Link
                                to="/selector-modulo"
                                className="flex items-center px-4 py-3 w-full text-slate-700 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                            >
                                <svg className="mr-3 w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span className="font-medium truncate">Cambiar módulo</span>
                            </Link>

                            <button
                                onClick={logout}
                                className="flex items-center px-4 py-3 w-full text-slate-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all"
                            >
                                <svg className="mr-3 w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="font-medium truncate">Cerrar sesión</span>
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Toggle button when collapsed - posicionado correctamente */}
            {isCollapsed && (
                <button
                    onClick={toggleCollapsed}
                    className="fixed top-20 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
                    title="Mostrar sidebar"
                >
                    <MenuIcon size={16} />
                </button>
            )}
        </>
    );
}
