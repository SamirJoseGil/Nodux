import { useEffect, useState } from 'react';
import { useNavigate } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserRole } from '~/types/auth';

interface AccessDeniedModalProps {
  isOpen: boolean;
  userRole: UserRole;
  requiredRoles: UserRole[];
  attemptedPath: string;
  onClose?: () => void;
}

export function AccessDeniedModal({ 
  isOpen, 
  userRole, 
  requiredRoles, 
  attemptedPath,
  onClose 
}: AccessDeniedModalProps) {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/selector-modulo');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, navigate]);

  const handleGoToModules = () => {
    navigate('/selector-modulo');
    onClose?.();
  };

  const handleGoHome = () => {
    navigate('/');
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              {/* Icon */}
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
                Acceso Denegado
              </h2>

              {/* Message */}
              <div className="space-y-3 mb-6">
                <p className="text-gray-600 text-center">
                  No tienes permisos para acceder a esta sección.
                </p>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tu rol actual:</span>
                    <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-full border border-gray-200">
                      {userRole}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Roles requeridos:</span>
                    <span className="font-semibold text-red-600">
                      {requiredRoles.join(', ')}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-500 text-center">
                  Ruta intentada: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{attemptedPath}</code>
                </p>
              </div>

              {/* Countdown */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-blue-800 text-center">
                  Serás redirigido al selector de módulos en{' '}
                  <span className="font-bold text-blue-600">{countdown}</span> segundos
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleGoToModules}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Ir a Selector de Módulos
                </button>
                
                <button
                  onClick={handleGoHome}
                  className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Volver al Inicio
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
