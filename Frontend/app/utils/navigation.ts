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

// Función para decodificar parámetros de URL correctamente
export function decodeParam(param: string | undefined): string {
  if (!param) return '';
  try {
    return decodeURIComponent(param);
  } catch (e) {
    console.error('Error decodificando parámetro URL:', e);
    return param;
  }
}
