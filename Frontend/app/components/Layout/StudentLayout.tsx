import { ReactNode } from 'react';
import StudentSidebar from './StudentSidebar';
import { Link } from '@remix-run/react';
import { useAuth } from '~/contexts/AuthContext';

interface StudentLayoutProps {
    children: ReactNode;
    title: string;
}

export default function StudentLayout({ children, title }: StudentLayoutProps) {
    const { user } = useAuth();

    return (
        <div className="flex min-h-screen bg-gray-100">
            <StudentSidebar />

            <div className="flex-1">
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/healthcheck"
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Sistema 🏥
                            </Link>
                            <div className="relative group">
                                <div className="flex items-center cursor-pointer">
                                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                        {user?.name.charAt(0) || 'E'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
