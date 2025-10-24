import { Link } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import Navbar from '~/components/Navigation/Navbar';
import Footer from '~/components/Navigation/Footer';
import DocumentIcon from "~/components/Icons/DocumentIcon";

export const meta: MetaFunction = () => {
    return [{ title: 'Mi Matrícula - Universidad EAFIT' }];
};

export default function Matricula() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar variant="minimal" showLogo={false} />

            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            to="/estudiantes/dashboard"
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors font-medium"
                        >
                            <DocumentIcon size={24} className="mr-2" />
                            Volver al Dashboard
                        </Link>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h1 className="text-2xl font-semibold text-slate-900">Mi Matrícula</h1>
                            <p className="text-slate-600 mt-1">Información sobre tu matrícula académica</p>
                        </div>
                        <div className="card-body">
                            <div className="text-center py-12">
                                <DocumentIcon size={48} className="mx-auto mb-4 text-gray-400" />
                                <h3 className="text-lg font-medium text-slate-900 mb-2">Módulo en construcción</h3>
                                <p className="text-slate-600">Esta funcionalidad estará disponible próximamente.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer variant="minimal" />
        </div>
    );
}
