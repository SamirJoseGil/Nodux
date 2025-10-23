// Utility para detectar si estamos en navegación del cliente
let isHydrated = false;

// Función para marcar cuando la app ha sido hidratada en el cliente
export function markHydrated() {
  isHydrated = true;
  console.log('✓ Aplicación hidratada en el cliente');
}

// Función para verificar si estamos en navegación del cliente
export function isClientNavigation() {
  return isHydrated;
}

// Función para ejecutar código solo en navegación del cliente
export function onClientNavigation(callback: () => void) {
  if (isHydrated) {
    callback();
  }
}

/**
 * Decodifica parámetros de URL que pueden estar codificados
 */
export function decodeParam(param: string | undefined): string {
  if (!param) return '';
  try {
    return decodeURIComponent(param);
  } catch {
    return param;
  }
}

/**
 * Codifica parámetros para URLs de manera segura
 */
export function encodeParam(param: string): string {
  return encodeURIComponent(param);
}

/**
 * Rutas específicas para el módulo académico
 */
export const ACADEMIC_ROUTES = {
  dashboard: '/modulo/academico/dashboard',
  projects: '/modulo/academico/admin/projects',
  mentors: '/modulo/academico/admin/mentors',
  groups: '/modulo/academico/admin/groups',
  hours: '/modulo/academico/admin/hours',
  calendar: '/modulo/academico/admin/calendar',
  metrics: '/modulo/academico/admin/metrics',
} as const;

/**
 * Rutas específicas para el módulo de administración
 */
export const ADMIN_ROUTES = {
  dashboard: '/modulo/administracion/dashboard',
  users: '/modulo/administracion/users',
  roles: '/modulo/administracion/roles',
  logs: '/modulo/administracion/logs',
  settings: '/modulo/administracion/settings',
} as const;

/**
 * Rutas específicas para el módulo de producto
 */
export const PRODUCT_ROUTES = {
  dashboard: '/modulo/producto/dashboard',
} as const;
