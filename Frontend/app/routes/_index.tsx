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
      {/* ✅ Navbar con Glassmorphism */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 navbar"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <img
              src="/images/LogoNodoEafit.png"
              alt="Logo Nodo EAFIT"
              className="w-24 h-24 object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
              />
              <span className="font-thicker text-2xl text-white group-hover:text-nodux-neon transition-colors">
              NODUX
              </span>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#caracteristicas" className="text-white/80 hover:text-white font-inter font-semibold transition-colors">
                Características
              </a>
              {!isAuthenticated && (
                <>
                  <Link to="/login" className="text-white/80 hover:text-white font-inter font-semibold transition-colors">
                    Iniciar sesión
                  </Link>
                  <Link to="/registro" className="btn-primary">
                    Registrarse
                  </Link>
                </>
              )}
              {isAuthenticated && (
                <Link to="/selector-modulo" className="btn-primary">
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ✅ Hero Section con SVG en lugar de emoji */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background animated gradient */}
        <div className="absolute inset-0 hero-gradient">
          {/* Animated shapes */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 right-20 w-96 h-96 bg-nodux-neon/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 left-20 w-96 h-96 bg-nodux-marino/10 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left content */}
            <motion.div variants={itemVariants} className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-2 mb-4 px-4 py-2 glass-strong rounded-full"
              >
                <FeatureIcon type="rocket" size={20} className="text-nodux-marino" />
                <span className="text-nodux-marino font-inter font-bold text-sm">
                  Plataforma Educativa del Futuro
                </span>
              </motion.div>

              <h1 className="font-thicker text-5xl sm:text-6xl lg:text-7xl text-white mb-6 leading-tight">
                Gestión de
                <span className="block text-gradient-neon">
                  Proyectos Académicos
                </span>
              </h1>

              <p className="font-inter text-lg sm:text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
                Transformamos la educación con una plataforma integral para mentoría,
                seguimiento de proyectos y desarrollo de talento excepcional.
              </p>

              {!isAuthenticated && (
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <Link to="/registro" className="btn-primary text-lg px-8 py-4">
                    Comenzar Ahora
                    <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                    Iniciar Sesión
                  </Link>
                </motion.div>
              )}

              {/* Stats */}
              <motion.div
                variants={itemVariants}
                className="mt-12 grid grid-cols-3 gap-6"
              >
                {[
                  {
                    value: "500+",
                    label: "Estudiantes",
                  },
                  {
                    value: "50+",
                    label: "Mentores",
                  },
                  {
                    value: "100+",
                    label: "Proyectos",
                  },
                ].map((stat, i) => (
                  <div key={i} className="glass-strong rounded-2xl p-4 text-center">
                    <div className="font-thicker text-3xl text-white mb-1">{stat.value}</div>
                    <div className="font-inter text-sm text-white/70">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right content - Floating card */}
            <motion.div
              variants={floatVariants}
              initial="initial"
              animate="animate"
              className="relative"
            >
              <div className="glass-card p-8 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-nodux-neon/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-nodux-marino/20 rounded-full blur-3xl" />

                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Equipo colaborando"
                    className="rounded-2xl shadow-2xl"
                  />

                  {/* Floating badge */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -bottom-4 -right-4 glass-strong px-6 py-3 rounded-2xl shadow-neon"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-nodux-marino rounded-full animate-pulse" />
                      <span className="font-inter font-bold text-white">
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
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* ✅ Características Section con SVG */}
      <section id="caracteristicas" className="py-32 relative h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-thicker text-4xl sm:text-5xl text-white mb-4">
              Características <span className="text-gradient-neon">Poderosas</span>
            </h2>
            <p className="font-inter text-xl text-white/70 max-w-2xl mx-auto">
              Herramientas diseñadas específicamente para entornos educativos
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                className="glass-card group cursor-pointer p-6"
              >
                <div className="mb-4">
                  <FeatureIcon 
                    type={feature.icon as any} 
                    size={48} 
                    className="text-nodux-neon group-hover:text-nodux-marino transition-colors duration-300" 
                  />
                </div>
                <h3 className="font-inter font-bold text-xl text-white mb-2">
                  {feature.title}
                </h3>
                <p className="font-inter text-white/70">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-nodux-neon/20 to-nodux-marino/20" />
        
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6"
          >
            <h2 className="font-thicker text-4xl sm:text-5xl text-white mb-6">
              ¿Listo para <span className="text-gradient-neon">Comenzar?</span>
            </h2>
            <p className="font-inter text-xl text-white/80 mb-8">
              Únete a Nodux y transforma tu experiencia educativa
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/selector-modulo" className="btn-primary text-lg px-8 py-4">
                  Ir a Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/registro" className="btn-primary text-lg px-8 py-4">
                    Registrarse Gratis
                  </Link>
                  <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                    Iniciar Sesión
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ✅ Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <img
              src="/images/LogoNodoEafit.png"
              alt="Logo Nodo EAFIT"
              className="w-32 h-32 object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
              />
              <span className="font-thicker text-2xl text-white">NODUX</span>
            </div>
            <p className="font-inter text-white/60">
              © 2024 Nodux. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
