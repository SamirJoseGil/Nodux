import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { useAuth } from "~/contexts/AuthContext";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import AcademicIcon from "~/components/Icons/AcademicIcon";
import ProductIcon from "~/components/Icons/ProductIcon";
import AdminIcon from "~/components/Icons/AdminIcon";
import FeatureIcon from "~/components/Icons/FeatureIcon";

export const meta: MetaFunction = () => {
  return [
    { title: "Nodux - Plataforma de Proyectos Académicos" },
    { name: "description", content: "Plataforma de gestión de proyectos y mentores" },
  ];
};

// ✅ Variantes de animación
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const floatVariants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function Index() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [scrollY, setScrollY] = useState(0);

  // ✅ Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zafiro-500">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-nodux-neon border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zafiro-500 overflow-x-hidden">
      {/* ✅ Navbar con Glassmorphism - Responsive mejorado */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 navbar"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <span className="font-thicker text-xl sm:text-2xl text-white group-hover:text-nodux-neon transition-colors">
                NODUX
              </span>
            </Link>

            {/* Navigation - Desktop */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <a href="#caracteristicas" className="text-white/80 hover:text-white font-inter font-semibold transition-colors text-sm lg:text-base">
                Características
              </a>
              {!isAuthenticated && (
                <>
                  <Link to="/login" className="text-white/80 hover:text-white font-inter font-semibold transition-colors text-sm lg:text-base">
                    Iniciar sesión
                  </Link>
                  <Link to="/registro" className="btn-primary text-sm lg:text-base px-4 lg:px-6 py-2">
                    Registrarse
                  </Link>
                </>
              )}
              {isAuthenticated && (
                <Link 
                  to={user?.role === "Estudiante" ? "/estudiantes/dashboard" : "/selector-modulo"} 
                  className="btn-primary text-sm lg:text-base px-4 lg:px-6 py-2"
                >
                  {user?.role === "Estudiante" ? "Mi Dashboard" : "Dashboard"}
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              {isAuthenticated ? (
                <Link 
                  to={user?.role === "Estudiante" ? "/estudiantes/dashboard" : "/selector-modulo"} 
                  className="btn-primary text-sm px-3 py-2"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="text-white/80 hover:text-white font-inter font-semibold text-sm">
                    Entrar
                  </Link>
                  <Link to="/registro" className="btn-primary text-sm px-3 py-2">
                    Registro
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ✅ Hero Section - Responsive mejorado */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 px-4 sm:px-6">
        {/* Background animated gradient */}
        <div className="absolute inset-0 hero-gradient">
          {/* Animated shapes - ajustadas para móvil */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 sm:top-20 right-10 sm:right-20 w-48 h-48 sm:w-96 sm:h-96 bg-nodux-neon/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-10 sm:bottom-20 left-10 sm:left-20 w-48 h-48 sm:w-96 sm:h-96 bg-nodux-marino/10 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto py-12 sm:py-20 w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          >
            {/* Left content - Responsive */}
            <motion.div variants={itemVariants} className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-2 mb-4 px-3 sm:px-4 py-2 glass-strong rounded-full"
              >
                <FeatureIcon type="rocket" size={16} className="text-nodux-marino sm:w-5 sm:h-5" />
                <span className="text-nodux-marino font-inter font-bold text-xs sm:text-sm">
                  Plataforma Educativa del Futuro
                </span>
              </motion.div>

              <h1 className="font-thicker text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-4 sm:mb-6 leading-tight">
                Gestión de
                <span className="block text-gradient-neon">
                  Proyectos Académicos
                </span>
              </h1>

              <p className="font-inter text-base sm:text-lg lg:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed px-4 sm:px-0">
                Transformamos la educación con una plataforma integral para mentoría,
                seguimiento de proyectos y desarrollo de talento excepcional.
              </p>

              {!isAuthenticated && (
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 sm:px-0"
                >
                  <Link to="/registro" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
                    Comenzar Ahora
                    <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link to="/login" className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
                    Iniciar Sesión
                  </Link>
                </motion.div>
              )}

              {isAuthenticated && (
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 sm:px-0"
                >
                  <Link 
                    to={user?.role === "Estudiante" ? "/estudiantes/dashboard" : "/selector-modulo"} 
                    className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
                  >
                    Ir a mi Dashboard
                    <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </motion.div>
              )}

              {/* Stats - Responsive */}
                <motion.div
                variants={itemVariants}
                className="mt-8 sm:mt-12 grid grid-cols-3 gap-3 sm:gap-6 px-4 sm:px-0"
                >
                {[
                  {
                  value: "11000+",
                  label: "Estudiantes",
                  },
                  {
                  value: "20+",
                  label: "Mentores",
                  },
                  {
                  value: "100+",
                  label: "Proyectos",
                  },
                ].map((stat, i) => (
                  <div key={i} className="glass-strong rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
                  <div className="font-thicker text-xl sm:text-2xl lg:text-3xl text-white mb-1">{stat.value}</div>
                  <div className="font-inter text-xs sm:text-sm text-white/70">{stat.label}</div>
                  </div>
                ))}
                </motion.div>
            </motion.div>

            {/* Right content - Floating card - Oculto en móvil pequeño */}
            <motion.div
              variants={floatVariants}
              initial="initial"
              animate="animate"
              className="relative hidden sm:block"
            >
              <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-nodux-neon/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 sm:w-40 h-32 sm:h-40 bg-nodux-marino/20 rounded-full blur-3xl" />

                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Equipo colaborando"
                    className="rounded-xl sm:rounded-2xl shadow-2xl w-full"
                  />

                  {/* Floating badge */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 glass-strong px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-neon"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-nodux-marino rounded-full animate-pulse" />
                      <span className="font-inter font-bold text-white text-xs sm:text-sm">
                        En vivo ahora
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* ✅ Características Section - Responsive mejorado */}
      <section id="caracteristicas" className="py-16 sm:py-24 lg:py-32 relative px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="font-thicker text-3xl sm:text-4xl lg:text-5xl text-white mb-3 sm:mb-4">
              Características <span className="text-gradient-neon">Poderosas</span>
            </h2>
            <p className="font-inter text-base sm:text-lg lg:text-xl text-white/70 max-w-2xl mx-auto px-4 sm:px-0">
              Herramientas diseñadas específicamente para entornos educativos
            </p>
          </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
              icon: 'chart',
              title: "Gestión de Proyectos",
              description: "Organiza y supervisa proyectos con herramientas avanzadas"
              },
              {
              icon: 'users',
              title: "Sistema de Mentorías",
              description: "Conecta mentores y estudiantes eficientemente"
              },
              {
              icon: 'calendar',
              title: "Calendario Integrado",
              description: "Coordina sesiones y eventos en tiempo real"
              },
              {
              icon: 'analytics',
              title: "Métricas y Reportes",
              description: "Análisis detallado del progreso y desempeño"
              },
            ].map((feature, i) => (
              <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-card group cursor-pointer p-4 sm:p-6"
              >
              <div className="mb-3 sm:mb-4">
                <FeatureIcon 
                type={feature.icon as any} 
                size={40} 
                className="text-nodux-neon group-hover:text-nodux-marino transition-colors duration-300 sm:w-12 sm:h-12" 
                />
              </div>
              <h3 className="font-inter font-bold text-lg sm:text-xl text-white mb-2">
                {feature.title}
              </h3>
              <p className="font-inter text-sm sm:text-base text-white/70">
                {feature.description}
              </p>
              </motion.div>
            ))}
            </div>
        </div>
      </section>

      {/* ✅ CTA Section - Responsive mejorado */}
      <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden px-4 sm:px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-nodux-neon/20 to-nodux-marino/20" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 sm:p-8 lg:p-12"
          >
            <h2 className="font-thicker text-3xl sm:text-4xl lg:text-5xl text-white mb-4 sm:mb-6">
              ¿Listo para <span className="text-gradient-neon">Comenzar?</span>
            </h2>
            <p className="font-inter text-base sm:text-lg lg:text-xl text-white/80 mb-6 sm:mb-8 px-4 sm:px-0">
              Únete a Nodux y transforma tu experiencia educativa
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              {isAuthenticated ? (
                <Link 
                  to={user?.role === "Estudiante" ? "/estudiantes/dashboard" : "/selector-modulo"} 
                  className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
                >
                  Ir a Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/registro" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
                    Registrarse Gratis
                  </Link>
                  <Link to="/login" className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
                    Iniciar Sesión
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ✅ Footer - Responsive mejorado */}
      <footer className="py-8 sm:py-12 border-t border-white/10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-3">
              <span className="font-thicker text-xl sm:text-2xl text-white">NODUX</span>
            </div>
            <p className="font-inter text-white/60 text-sm sm:text-base text-center md:text-left">
              © 2025 Nodux. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
