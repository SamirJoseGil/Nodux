import { ReactNode } from 'react';
import SystemAdminSidebar from './SystemAdminSidebar';
import { Link } from '@remix-run/react';
import { useAuth } from '~/contexts/AuthContext';
import { SidebarProvider, useSidebar } from '~/contexts/SidebarContext';
import HealthIcon from "~/components/Icons/HealthIcon";

interface SystemAdminLayoutProps {
    children: ReactNode;
    title: string;
}

function SystemAdminLayoutContent({ children, title }: SystemAdminLayoutProps) {
    const { user } = useAuth();
    const { isCollapsed, isPinned } = useSidebar();

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <SystemAdminSidebar />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed || !isPinned ? 'ml-0' : 'ml-64'
                }`}>
                {/* Header */}
                <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/healthcheck"
                                className="text-sm text-slate-600 hover:text-red-600 transition-colors font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50"
                            >
                                <HealthIcon size={18} />
                                Sistema
                            </Link>
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold shadow-sm">
                                    {user?.name.charAt(0) || 'A'}
                                </div>
                                <div className="ml-3 hidden sm:block">
                                    <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                                    <p className="text-xs text-red-600 font-medium">{user?.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 max-w-7xl w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    {children}
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto flex justify-between items-center text-sm text-slate-600">
                        <p>© 2024 <span className="font-semibold text-red-600">Nodo</span>. Todos los derechos reservados.</p>
                        <div className="flex gap-4">
                            <Link to="/healthcheck" className="hover:text-red-600 transition-colors">Estado del sistema</Link>
                            <span className="text-gray-400">|</span>
                            <Link to="/" className="hover:text-red-600 transition-colors">Inicio</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default function SystemAdminLayout({ children, title }: SystemAdminLayoutProps) {
    return (
        <SidebarProvider>
            <SystemAdminLayoutContent title={title}>
                {children}
            </SystemAdminLayoutContent>
        </SidebarProvider>
    );
}
