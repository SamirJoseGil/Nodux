import { Link } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import DashboardLayout from '~/components/dashboard/DashboardLayout';

export const meta: MetaFunction = () => {
    return [{ title: 'Mi Matrícula - Universidad EAFIT' }];
};

export default function Matricula() {
    return (
        <DashboardLayout>
            <div className="animate-fade-in">
                <div className="mb-6">
                    <Link to="/estudiantes/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Volver al Dashboard</span>
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Mi Matrícula</h1>
                    <p className="text-gray-600">Módulo en construcción...</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
