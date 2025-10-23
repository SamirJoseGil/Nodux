import { Link } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import Navbar from '~/components/Navigation/Navbar';
import Footer from '~/components/Navigation/Footer';
import BookIcon from "~/components/Icons/BookIcon";

export const meta: MetaFunction = () => {
    return [{ title: 'Material de Apoyo - Universidad EAFIT' }];
};

export default function MaterialApoyo() {
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
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver al Dashboard
                        </Link>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h1 className="text-2xl font-semibold text-slate-900">Material de Apoyo</h1>
                            <p className="text-slate-600 mt-1">Accede a recursos y material complementario</p>
                        </div>
                        <div className="card-body">
                            <div className="text-center py-12">
                                <BookIcon size={48} className="mx-auto mb-4 text-gray-400" />
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
