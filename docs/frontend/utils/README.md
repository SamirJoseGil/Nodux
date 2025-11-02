# 🔧 Utilidades - Helpers y Funciones de Apoyo

## Índice

1. [Introducción](#introducción)
2. [API Client](#api-client)
3. [Navigation Utils](#navigation-utils)
4. [Test Utils](#test-utils)
5. [Helpers Comunes](#helpers-comunes)

---

## Introducción

Las utilidades en Nodux son **funciones auxiliares** que encapsulan lógica reutilizable en toda la aplicación. Estas herramientas facilitan tareas comunes como comunicación HTTP, navegación, testing y formateo de datos.

### Ubicación

```
app/utils/
├── api.ts              # Cliente HTTP y configuración de Axios
├── navigation.ts       # Helpers de navegación
├── testUtils.ts        # Utilidades para testing
└── helpers.ts          # Funciones auxiliares generales
```

---

## API Client

**Archivo**: `app/utils/api.ts`

### Propósito

Proporciona un **cliente HTTP configurado** (Axios) con interceptores para manejo automático de tokens, refresh y errores.

### Funciones Principales

#### 1. getApiBaseUrl

```typescript
export const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    // Server-side: usa variable de entorno del servidor
    return process.env.API_BASE_URL || 'http://localhost:8000/api';
  }
  
  // Client-side: usa variable inyectada por Vite
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
};
```

**Funcionalidad**:
- Detecta si se ejecuta en **servidor** (SSR) o **cliente** (browser)
- Retorna la URL base correcta según el contexto
- Fallback a localhost en desarrollo

**Uso**:
```typescript
const API_URL = getApiBaseUrl();
console.log(API_URL); // 'http://localhost:8000/api'
```

#### 2. apiClient

```typescript
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Permite cookies HttpOnly
});
```

**Configuración**:
- **baseURL**: Prefijo automático para todas las requests
- **headers**: Content-Type por defecto
- **withCredentials**: Habilita envío de cookies en requests cross-origin

**Ejemplo de uso**:
```typescript
// GET request
const response = await apiClient.get('/mentors/');

// POST request
const newMentor = await apiClient.post('/mentors/', {
  name: 'Juan Pérez',
  email: 'juan@example.com'
});

// PUT request
await apiClient.put('/mentors/123/', { name: 'Juan P.' });

// DELETE request
await apiClient.delete('/mentors/123/');
```

#### 3. Request Interceptor

```typescript
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

**Funcionalidad**:
- Se ejecuta **antes** de cada request
- Lee el `access_token` de las cookies
- Agrega header `Authorization` automáticamente
- Evita tener que agregar el token manualmente en cada llamada

#### 4. Response Interceptor

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // Si el error es 401 y no se ha reintentado
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = Cookies.get('refresh_token');
        
        // Llamar a endpoint de refresh
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });
        
        const { access } = response.data;
        
        // Actualizar token en cookies
        Cookies.set('access_token', access, { expires: 1/24 });
        
        // Reintentar request original con nuevo token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh falló, limpiar sesión
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

**Funcionalidad**:
- Se ejecuta **después** de cada response
- Detecta errores **401 Unauthorized**
- Intenta obtener un nuevo `access_token` usando el `refresh_token`
- Reintenta la request original con el nuevo token
- Si el refresh falla, cierra sesión y redirige a login

**Flujo de refresh automático**:
```
Request → 401 Error
    ↓
Interceptor detecta 401
    ↓
Llama a /auth/token/refresh/
    ↓
Backend valida refresh_token
    ↓
Retorna nuevo access_token
    ↓
Actualiza cookie
    ↓
Reintenta request original
    ↓
Success o Error final
```

#### 5. healthCheck

```typescript
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/healthcheck/');
    return response.data;
  } catch (error) {
    throw error;
  }
};
```

**Uso**:
```typescript
const health = await healthCheck();
console.log(health.status); // 'ok'
```

#### 6. getBackendHealth

```typescript
export const getBackendHealth = async () => {
  const startTime = performance.now();
  try {
    const response = await axios.get(`${API_BASE_URL}/healthcheck/`);
    const endTime = performance.now();
    return {
      ...response.data,
      responseTime: Math.round(endTime - startTime)
    };
  } catch (error) {
    const endTime = performance.now();
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Math.round(endTime - startTime)
    };
  }
};
```

**Funcionalidad**:
- Verifica la salud del backend
- Mide el tiempo de respuesta
- Retorna estado incluso si falla la conexión

**Uso**:
```typescript
const health = await getBackendHealth();
console.log(health.status); // 'healthy' o 'unhealthy'
console.log(health.responseTime); // 150 (ms)
```

---

## Navigation Utils

**Archivo**: `app/utils/navigation.ts`

### Propósito

Proporciona **helpers para navegación** y gestión de rutas según el rol del usuario.

### Funciones Principales

#### 1. getDefaultRouteForRole

```typescript
export const getDefaultRouteForRole = (role: UserRole): string => {
  switch (role) {
    case 'Mentor':
      return '/modulo/academico/mentor/dashboard';
    case 'Estudiante':
      return '/modulo/academico/estudiante/dashboard';
    case 'Admin':
    case 'SuperAdmin':
      return '/selector-modulo';
    case 'Trabajador':
      return '/modulo/producto/dashboard';
    default:
      return '/';
  }
};
```

**Uso**:
```typescript
const { user } = useAuth();
const navigate = useNavigate();

const handleLogin = () => {
  const defaultRoute = getDefaultRouteForRole(user.role);
  navigate(defaultRoute);
};
```

#### 2. isRouteAllowed

```typescript
export const isRouteAllowed = (
  route: string,
  userRole: UserRole
): boolean => {
  const routePermissions: Record<string, UserRole[]> = {
    '/modulo/administracion': ['Admin', 'SuperAdmin'],
    '/modulo/academico/admin': ['Admin', 'SuperAdmin'],
    '/modulo/academico/mentor': ['Mentor'],
    '/modulo/academico/estudiante': ['Estudiante'],
    '/modulo/producto': ['Trabajador', 'Admin', 'SuperAdmin'],
  };
  
  for (const [path, roles] of Object.entries(routePermissions)) {
    if (route.startsWith(path)) {
      return roles.includes(userRole);
    }
  }
  
  return true; // Rutas públicas
};
```

**Uso**:
```typescript
const canAccess = isRouteAllowed('/modulo/administracion', 'Mentor');
console.log(canAccess); // false
```

#### 3. getModuleFromRoute

```typescript
export const getModuleFromRoute = (pathname: string): string | null => {
  const match = pathname.match(/\/modulo\/([^\/]+)/);
  return match ? match[1] : null;
};
```

**Funcionalidad**:
- Extrae el nombre del módulo de una ruta
- Retorna null si no es una ruta de módulo

**Uso**:
```typescript
const module = getModuleFromRoute('/modulo/academico/dashboard');
console.log(module); // 'academico'
```

---

## Test Utils

**Archivo**: `app/utils/testUtils.ts`

### Propósito

Proporciona **utilidades para testing** y diagnóstico del sistema.

### Funciones Principales

#### 1. testAllServices

```typescript
export const testAllServices = async () => {
  try {
    const results = {
      auth: await testAuthService(),
      modules: await testModuleService(),
      academic: await testAcademicService(),
    };
    
    return {
      status: 'success',
      results
    };
  } catch (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
```

**Funcionalidad**:
- Ejecuta pruebas de todos los servicios
- Retorna resultados consolidados
- Útil para healthchecks y debugging

#### 2. testApplicationRoutes

```typescript
export const testApplicationRoutes = () => {
  return [
    { name: 'Inicio', path: '/', protected: false },
    { name: 'Login', path: '/login', protected: false },
    { name: 'Registro', path: '/registro', protected: false },
    { name: 'Selector de Módulos', path: '/selector-modulo', protected: true },
    { name: 'Dashboard Académico', path: '/modulo/academico/dashboard', protected: true },
    { name: 'Dashboard Producto', path: '/modulo/producto/dashboard', protected: true },
    { name: 'Dashboard Admin', path: '/modulo/administracion/dashboard', protected: true },
    { name: 'Healthcheck', path: '/healthcheck', protected: false },
    { name: 'Test', path: '/test', protected: false },
  ];
};
```

**Uso**:
```typescript
const routes = testApplicationRoutes();
routes.forEach(route => {
  console.log(`${route.name}: ${route.path} (${route.protected ? 'Protegida' : 'Pública'})`);
});
```

---

## Helpers Comunes

### Formateo de Fechas

```typescript
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
```

**Uso**:
```typescript
const date = formatDate('2024-02-20');
console.log(date); // "20 de febrero de 2024"

const dateTime = formatDateTime('2024-02-20T14:30:00');
console.log(dateTime); // "20 de febrero de 2024, 14:30"
```

### Validación de Email

```typescript
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

### Truncado de Texto

```typescript
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
```

### Formateo de Números

```typescript
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-ES').format(num);
};

export const formatCurrency = (amount: number, currency: string = 'COP'): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency
  }).format(amount);
};
```

---

## Buenas Prácticas

### 1. Uso de apiClient

**✅ Correcto**:
```typescript
const response = await apiClient.get('/mentors/');
const mentors = response.data;
```

**❌ Incorrecto**:
```typescript
const response = await axios.get('http://localhost:8000/api/mentors/');
// No usa la configuración centralizada
```

### 2. Manejo de Errores

**✅ Correcto**:
```typescript
try {
  const data = await apiClient.get('/mentors/');
  return data;
} catch (error) {
  if (axios.isAxiosError(error)) {
    console.error('API Error:', error.response?.status);
  }
  throw error;
}
```

### 3. Navegación Segura

**✅ Correcto**:
```typescript
const defaultRoute = getDefaultRouteForRole(user.role);
if (isRouteAllowed(defaultRoute, user.role)) {
  navigate(defaultRoute);
}
```

---

## Testing

### Test de API Client

```typescript
import { apiClient } from '~/utils/api';

test('apiClient agrega token automáticamente', async () => {
  Cookies.set('access_token', 'test-token');
  
  const response = await apiClient.get('/test/');
  
  expect(response.config.headers.Authorization).toBe('Bearer test-token');
});
```

### Test de Navigation Utils

```typescript
import { getDefaultRouteForRole } from '~/utils/navigation';

test('getDefaultRouteForRole retorna ruta correcta para Mentor', () => {
  const route = getDefaultRouteForRole('Mentor');
  expect(route).toBe('/modulo/academico/mentor/dashboard');
});
```

---

## Próximas Mejoras

- [ ] Caché de responses con React Query
- [ ] Retry logic configurable
- [ ] Request cancellation con AbortController
- [ ] Logging centralizado de errores
- [ ] Helpers para formateo de horas

---

## Enlaces Relacionados

- [📘 Axios Documentation](https://axios-http.com/)
- [🍪 js-cookie Documentation](https://github.com/js-cookie/js-cookie)
- [🔐 JWT Best Practices](https://tools.ietf.org/html/rfc8725)
