import { Link } from "@remix-run/react";
import { motion } from "framer-motion";

interface FooterProps {
    variant?: 'default' | 'minimal' | 'dark';
    showSocialLinks?: boolean;
    showLinks?: boolean;
    className?: string;
}

export default function Footer({
    variant = 'default',
    showSocialLinks = true,
    showLinks = true,
    className = ''
}: FooterProps) {

    const getVariantClasses = () => {
        switch (variant) {
            case 'minimal':
                return 'bg-slate-50 border-t border-gray-200';
            case 'dark':
                return 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white';
            default:
                return 'bg-gradient-to-br from-white to-slate-50 border-t border-gray-200';
        }
    };

    const getTextClasses = () => {
        switch (variant) {
            case 'dark':
                return 'text-slate-300';
            default:
                return 'text-slate-600';
        }
    };

    const getLinkClasses = () => {
        switch (variant) {
            case 'dark':
                return 'text-slate-400 hover:text-white hover:scale-105';
            default:
                return 'text-slate-500 hover:text-blue-600 hover:scale-105';
        }
    };

    const footerLinks = [
        { name: 'Inicio', href: '/' },
        { name: 'Características', href: '/#caracteristicas' },
        { name: 'Módulos', href: '/#modulos' },
        { name: 'Estado del Sistema', href: '/healthcheck' },
    ];

    const socialLinks = [
        {
            name: 'GitHub',
            href: '#',
            icon: (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            name: 'Twitter',
            href: '#',
            icon: (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
            )
        },
        {
            name: 'LinkedIn',
            href: '#',
            icon: (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" clipRule="evenodd" />
                </svg>
            )
        }
    ];

    return (
        <footer className={`relative overflow-hidden ${getVariantClasses()} ${className}`}>
            {/* Decorative elements */}
            {variant === 'dark' && (
                <>
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl"></div>
                </>
            )}

            <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                {/* Main Footer Content */}
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    {/* Brand Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6 xl:col-span-1"
                    >
                        <div className="flex items-center gap-3">
                            <span className={`font-thicker text-2xl ${variant === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                NODUX
                            </span>
                        </div>
                        <p className={`text-sm sm:text-base ${getTextClasses()} max-w-md leading-relaxed`}>
                            Plataforma integral para la gestión de proyectos académicos,
                            mentoría de estudiantes y seguimiento de actividades educativas.
                        </p>
                        {showSocialLinks && (
                            <div className="flex space-x-4">
                                {socialLinks.map((item) => (
                                    <motion.a
                                        key={item.name}
                                        href={item.href}
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`p-2 rounded-lg transition-all duration-300 ${
                                            variant === 'dark' 
                                                ? 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white' 
                                                : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-blue-600'
                                        }`}
                                    >
                                        <span className="sr-only">{item.name}</span>
                                        {item.icon}
                                    </motion.a>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Links Sections */}
                    {showLinks && (
                        <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="md:grid md:grid-cols-2 md:gap-8 col-span-2"
                            >
                                <div>
                                    <h3 className={`text-sm font-bold tracking-wider uppercase mb-4 ${variant === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                        Navegación
                                    </h3>
                                    <ul className="space-y-3">
                                        {footerLinks.map((link) => (
                                            <li key={link.name}>
                                                <Link
                                                    to={link.href}
                                                    className={`text-sm sm:text-base ${getLinkClasses()} transition-all duration-300 inline-block`}
                                                >
                                                    {link.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mt-8 md:mt-0">
                                    <h3 className={`text-sm font-bold tracking-wider uppercase mb-4 ${variant === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                        Soporte
                                    </h3>
                                    <ul className="space-y-3">
                                        <li>
                                            <a href="#" className={`text-sm sm:text-base ${getLinkClasses()} transition-all duration-300 inline-block`}>
                                                Documentación
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className={`text-sm sm:text-base ${getLinkClasses()} transition-all duration-300 inline-block`}>
                                                Contacto
                                            </a>
                                        </li>
                                        <li>
                                            <Link to="/healthcheck" className={`text-sm sm:text-base ${getLinkClasses()} transition-all duration-300 inline-block`}>
                                                Estado del Sistema
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>

                {/* Bottom Bar */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className={`mt-12 pt-8 border-t ${variant === 'dark' ? 'border-white/10' : 'border-gray-200'}`}
                >
                    <div className="md:flex md:items-center md:justify-between">
                        <p className={`text-sm ${getTextClasses()} text-center md:text-left`}>
                            &copy; 2025 Nodux by{' '}
                            <span className={`font-bold ${variant === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                                Nodo EAFIT
                            </span>
                            . Todos los derechos reservados.
                        </p>
                        <div className="mt-4 md:mt-0 flex justify-center md:justify-end space-x-6">
                            <a href="#" className={`text-xs ${getLinkClasses()} transition-all duration-300`}>
                                Privacidad
                            </a>
                            <a href="#" className={`text-xs ${getLinkClasses()} transition-all duration-300`}>
                                Términos
                            </a>
                            <a href="#" className={`text-xs ${getLinkClasses()} transition-all duration-300`}>
                                Cookies
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
