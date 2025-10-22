import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { useAuth } from "~/contexts/AuthContext";
import { motion } from "framer-motion";

export const meta: MetaFunction = () => {
  return [
    { title: "Nodux - Plataforma de Proyectos" },
    {
      name: "description",
      content: "Plataforma de gestión de proyectos y mentores",
    },
  ];
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Index() {
  const { isAuthenticated, user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen gradient-nodo-primary">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-4 border-nodo-yellow border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navegación con glassmorphism */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="header-glass sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold text-gradient-nodo"
              >
                NODUX
              </motion.div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-nodo-black font-medium">
                    Hola, {user?.name.split(' ')[0]}
                  </span>
                  <Link
                    to={user?.role === 'Admin' || user?.role === 'SuperAdmin'
                      ? '/selector-modulo'
                      : user?.role === 'Mentor'
                        ? '/modulo/academico/mentor/dashboard'
                        : '/modulo/academico/estudiante/dashboard'}
                    className="text-sm font-medium text-nodo-neon-blue hover:text-nodo-dark-blue transition-colors"
                  >
                    Mi Dashboard
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={logout}
                    className="text-sm font-medium text-gray-700 hover:text-nodo-black transition-colors"
                  >
                    Cerrar sesión
                  </motion.button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-nodo-neon-blue hover:text-nodo-dark-blue transition-colors"
                  >
                    Iniciar sesión
                  </Link>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/registro" className="btn-nodo-primary text-sm">
                      Registrarse
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero section con glassmorphism */}
      <div className="relative py-20 gradient-nodo-primary overflow-hidden">
        {/* Efectos de fondo animados */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-nodo-yellow/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-nodo-green/10 rounded-full blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left"
            >
              <motion.h1
                className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="block">Gestión de proyectos</span>
                <span className="block text-nodo-yellow">académicos y mentorías</span>
              </motion.h1>
              <motion.p
                className="mt-3 text-base text-white sm:mt-5 sm:text-xl lg:text-lg xl:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Nodux es una plataforma integral para la gestión de proyectos académicos,
                mentoría de estudiantes y seguimiento de actividades educativas.
              </motion.p>
              {!isAuthenticated && (
                <motion.div
                  className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link to="/registro" className="btn-nodo-accent w-full sm:w-auto px-8 py-4 text-base font-bold rounded-xl">
                        Comenzar Ahora
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/login"
                        className="bg-white/90 backdrop-blur-sm text-nodo-dark-blue hover:bg-white px-8 py-4 text-base font-bold rounded-xl transition-all border-2 border-white hover:border-nodo-yellow w-full sm:w-auto inline-block text-center"
                      >
                        Iniciar sesión
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center"
            >
              <div className="relative mx-auto w-full lg:max-w-md">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="relative block w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border-2 border-white/30"
                >
                  <img
                    className="w-full"
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                    alt="Equipo de trabajo colaborando"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Características con animaciones */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:text-center"
          >
            <h2 className="text-base text-nodo-neon-blue font-semibold tracking-wide uppercase">Características</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-nodo-black sm:text-4xl">
              Una mejor manera de gestionar proyectos académicos
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 lg:mx-auto">
              Herramientas diseñadas específicamente para entornos educativos y de mentoría.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mt-10"
          >
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
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, translateY: -5 }}
                  className="flex"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-nodo-neon-blue to-nodo-green text-white shadow-lg">
                      <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {feature.icon}
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-bold text-nodo-black">{feature.title}</h3>
                    <p className="mt-2 text-base text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Módulos disponibles con glassmorphism */}
      <div className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold text-nodo-black text-center mb-12"
          >
            Módulos disponibles
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
          >
            {/* Módulo Académico */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.03, translateY: -10 }}
              className="card-nodo-glass group"
            >
              <div className="px-6 py-8">
                <motion.div
                  className="text-center mb-6"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  <span className="text-6xl">🎓</span>
                </motion.div>
                <h3 className="text-xl leading-6 font-bold text-nodo-black text-center mb-4">
                  Módulo Académico
                </h3>
                <p className="text-gray-700 text-center mb-6">
                  Diseñado para instituciones educativas, este módulo permite gestionar proyectos académicos,
                  mentorías, evaluaciones y seguimiento del progreso de los estudiantes.
                </p>
                <div className="text-center">
                  {isAuthenticated ? (
                    <Link to="/modulo/academico/dashboard" className="btn-nodo-secondary inline-flex items-center">
                      Acceder
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      className="inline-flex items-center px-6 py-3 border-2 border-nodo-neon-blue text-sm font-bold rounded-lg text-nodo-neon-blue bg-white hover:bg-nodo-neon-blue hover:text-white transition-all"
                    >
                      Iniciar sesión para acceder
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Módulo de Producto */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.03, translateY: -10 }}
              className="card-nodo-glass border-l-4 border-nodo-green group"
            >
              <div className="px-6 py-8">
                <motion.div
                  className="text-center mb-6"
                  whileHover={{ scale: 1.2, rotate: -5 }}
                >
                  <span className="text-6xl">📦</span>
                </motion.div>
                <h3 className="text-xl leading-6 font-bold text-nodo-black text-center mb-4">
                  Módulo de Producto
                </h3>
                <p className="text-gray-700 text-center mb-6">
                  Orientado a la gestión de productos y servicios, permite la planificación, desarrollo y seguimiento
                  de productos desde la fase de ideación hasta el lanzamiento.
                </p>
                <div className="text-center">
                  {isAuthenticated ? (
                    <Link to="/modulo/producto/dashboard" className="btn-nodo-secondary inline-flex items-center">
                      Acceder
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      className="inline-flex items-center px-6 py-3 border-2 border-nodo-green text-sm font-bold rounded-lg text-nodo-black bg-white hover:bg-nodo-green hover:text-white transition-all"
                    >
                      Iniciar sesión para acceder
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Módulo de Administración */}
            {isAuthenticated && (user?.role === 'Admin' || user?.role === 'SuperAdmin') && (
              <motion.div
                variants={fadeInUp}
                whileHover={{ scale: 1.03, translateY: -10 }}
                className="card-nodo-glass border-l-4 border-nodo-orange group"
              >
                <div className="px-6 py-8">
                  <motion.div
                    className="text-center mb-6"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                  >
                    <span className="text-6xl">⚙️</span>
                  </motion.div>
                  <h3 className="text-xl leading-6 font-bold text-nodo-black text-center mb-4">
                    Administración
                  </h3>
                  <p className="text-gray-700 text-center mb-6">
                    Gestión centralizada de usuarios, permisos y configuración del sistema para administradores.
                  </p>
                  <div className="text-center">
                    <Link to="/modulo/administracion/dashboard" className="btn-nodo-secondary inline-flex items-center">
                      Acceder
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative gradient-nodo-primary overflow-hidden"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 right-0 w-64 h-64 bg-nodo-yellow/20 rounded-full blur-3xl"
        />
        <div className="relative max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-extrabold text-white sm:text-4xl"
          >
            <span className="block">¿Listo para comenzar?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg leading-6 text-nodo-yellow"
          >
            Únete a Nodux y lleva tus proyectos académicos y mentorías al siguiente nivel.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex justify-center gap-4"
          >
            {isAuthenticated ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={user?.role === 'Admin' || user?.role === 'SuperAdmin'
                    ? '/selector-modulo'
                    : user?.role === 'Mentor'
                      ? '/modulo/academico/mentor/dashboard'
                      : '/modulo/academico/estudiante/dashboard'}
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-base font-bold rounded-xl text-nodo-dark-blue bg-white hover:bg-nodo-yellow hover:border-nodo-yellow transition-all"
                >
                  Ir a mi Dashboard
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/registro"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-base font-bold rounded-xl text-nodo-dark-blue bg-white hover:bg-nodo-yellow hover:border-nodo-yellow transition-all"
                  >
                    Registrarse
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-base font-bold rounded-xl text-white bg-transparent hover:bg-white hover:text-nodo-dark-blue transition-all"
                  >
                    Iniciar sesión
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-nodo-neon-blue">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-nodo-neon-blue transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-500">
              &copy; 2024 Nodux by <span className="font-bold text-nodo-neon-blue">Nodo</span>. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
