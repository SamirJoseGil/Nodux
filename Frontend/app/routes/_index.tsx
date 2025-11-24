import { Link, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { useAuth } from "~/contexts/AuthContext";
import Navbar from "~/components/Navigation/Navbar";
import Footer from "~/components/Navigation/Footer";
import AcademicIcon from "~/components/Icons/AcademicIcon";
import ProductIcon from "~/components/Icons/ProductIcon";
import AdminIcon from "~/components/Icons/AdminIcon";
import NotFound from "~/components/ErrorBoundary/NotFound";

export const meta: MetaFunction = () => {
  return [
    { title: "Nodux - Plataforma de Proyectos" },
    {
      name: "description",
      content: "Plataforma de gestión de proyectos y mentores",
    },
  ];
};

export default function Index() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navegación */}
      <Navbar />

      {/* Hero section */}
      <div className="relative py-20 bg-gradient-to-br from-blue-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl tracking-tight font-bold text-white sm:text-5xl md:text-6xl">
                <span className="block">Gestión de proyectos</span>
                <span className="block text-blue-200">académicos y mentorías</span>
              </h1>
              <p className="mt-3 text-base text-blue-100 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Nodux es una plataforma integral para la gestión de proyectos académicos,
                mentoría de estudiantes y seguimiento de actividades educativas.
              </p>
              {!isAuthenticated && (
                <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                  <div className="flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start">
                    <Link to="/registro" className="btn-primary px-8 py-4 text-base font-medium bg-white text-blue-600 hover:bg-gray-50">
                      Comenzar Ahora
                    </Link>
                    <Link
                      to="/login"
                      className="btn-secondary px-8 py-4 text-base font-medium text-white border-white hover:bg-white hover:text-blue-600"
                    >
                      Iniciar sesión
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full lg:max-w-md">
                <div className="relative block w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                  <img
                    className="w-full"
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                    alt="Equipo de trabajo colaborando"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Características */}
      <div id="caracteristicas" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Características</h2>
            <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-slate-900 sm:text-4xl">
              Una mejor manera de gestionar proyectos académicos
            </p>
            <p className="mt-4 max-w-2xl text-xl text-slate-600 lg:mx-auto">
              Herramientas diseñadas específicamente para entornos educativos y de mentoría.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {[
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  ),
                  title: "Gestión de proyectos",
                  description: "Crea, organiza y supervisa proyectos académicos con herramientas de seguimiento y evaluación."
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  ),
                  title: "Sistema de mentorías",
                  description: "Conecta mentores y estudiantes con herramientas para programar sesiones, registrar horas y evaluar avances."
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  ),
                  title: "Calendario integrado",
                  description: "Visualiza y coordina sesiones, entregas y eventos importantes en un solo lugar."
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  ),
                  title: "Métricas y reportes",
                  description: "Obtén información valiosa sobre el progreso de los proyectos, desempeño de mentores y más."
                }
              ].map((feature, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-blue-600 text-white shadow-lg">
                      <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {feature.icon}
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-semibold text-slate-900">{feature.title}</h3>
                    <p className="mt-2 text-base text-slate-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Módulos disponibles */}
      <div id="modulos" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Módulos disponibles
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Módulo Académico */}
            <div className="card group hover:shadow-lg transition-all duration-200">
              <div className="card-body text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <AcademicIcon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Módulo Académico
                </h3>
                <p className="text-slate-600 mb-6">
                  Diseñado para instituciones educativas, este módulo permite gestionar proyectos académicos,
                  mentorías, evaluaciones y seguimiento del progreso de los estudiantes.
                </p>
                <div>
                  {isAuthenticated ? (
                    <Link to="/modulo/academico/dashboard" className="btn-primary">
                      Acceder
                    </Link>
                  ) : (
                    <Link to="/login" className="btn-secondary">
                      Iniciar sesión para acceder
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Módulo de Producto */}
            <div className="card group hover:shadow-lg transition-all duration-200">
              <div className="card-body text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl flex items-center justify-center">
                  <ProductIcon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Módulo de Producto
                </h3>
                <p className="text-slate-600 mb-6">
                  Orientado a la gestión de productos y servicios, permite la planificación, desarrollo y seguimiento
                  de productos desde la fase de ideación hasta el lanzamiento.
                </p>
                <div>
                  {isAuthenticated ? (
                    <Link to="/modulo/producto/dashboard" className="btn-primary">
                      Acceder
                    </Link>
                  ) : (
                    <Link to="/login" className="btn-secondary">
                      Iniciar sesión para acceder
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Módulo de Administración */}
            {isAuthenticated && (user?.role === 'Admin' || user?.role === 'SuperAdmin') && (
              <div className="card group hover:shadow-lg transition-all duration-200">
                <div className="card-body text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-600 to-pink-600 rounded-2xl flex items-center justify-center">
                    <AdminIcon size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">
                    Administración
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Gestión centralizada de usuarios, permisos y configuración del sistema para administradores.
                  </p>
                  <div>
                    <Link to="/modulo/administracion/dashboard" className="btn-primary">
                      Acceder
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-blue-600 overflow-hidden">
        <div className="relative max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            <span className="block">¿Listo para comenzar?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Únete a Nodux y lleva tus proyectos académicos y mentorías al siguiente nivel.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to={user?.role === 'Admin' || user?.role === 'SuperAdmin'
                  ? '/selector-modulo'
                  : user?.role === 'Mentor'
                    ? '/modulo/academico/mentor/dashboard'
                    : '/modulo/academico/estudiante/dashboard'}
                className="btn-primary bg-white text-blue-600 hover:bg-gray-50"
              >
                Ir a mi Dashboard
              </Link>
            ) : (
              <>
                <Link to="/registro" className="btn-primary bg-white text-blue-600 hover:bg-gray-50">
                  Registrarse
                </Link>
                <Link to="/login" className="btn-secondary text-white border-white hover:bg-white hover:text-blue-600">
                  Iniciar sesión
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Ha ocurrido un error
        </h1>
        <p className="text-slate-600">
          Por favor, inténtalo de nuevo más tarde.
        </p>
      </div>
    </div>
  );
}
