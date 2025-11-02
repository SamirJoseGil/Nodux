# 🔄 Contextos - Gestión de Estado Global

## Índice

1. [Introducción](#introducción)
2. [AuthContext](#authcontext)
3. [ModuleContext](#modulecontext)
4. [Flujo de Datos](#flujo-de-datos)
5. [Uso en Componentes](#uso-en-componentes)

---

## Introducción

Los contextos en Nodux manejan el **estado global** de la aplicación usando la **Context API de React**. Esto permite compartir datos entre componentes sin prop drilling.

### Contextos Disponibles

| Contexto | Propósito | Datos que gestiona |
|----------|-----------|-------------------|
| `AuthContext` | Autenticación y sesión | Usuario, tokens, login/logout |
| `ModuleContext` | Módulo activo | Módulo seleccionado, permisos |

---

## AuthContext

**Archivo**: `app/contexts/AuthContext.tsx`

### Propósito

Gestiona todo el ciclo de vida de la **autenticación del usuario**:
- Login/Logout
- Almacenamiento de tokens (access + refresh)
- Persistencia de sesión
- Renovación automática de tokens
- Información del usuario actual

### Estructura del Contexto

```typescript
interface AuthContextType {
  // Estado
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  
  // Acciones
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
}
```

### Tipos de Datos

```typescript
interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MENTOR' | 'STUDENT';
  permissions: string[];
}
```

### Funcionalidades Principales

#### 1. Login

```typescript
const login = async (email: string, password: string) => {
  // 1. Llama a AuthService.login
  const response = await AuthService.login({ email, password });
  
  // 2. Almacena tokens
  Cookies.set('access_token', response.access, { expires: 1/24 }); // 1 hora
  Cookies.set('refresh_token', response.refresh, { expires: 7 });  // 7 días
  
  // 3. Actualiza estado del usuario
  setUser(response.user);
  
  // 4. Redirige según rol
  navigate('/module-selector');
};
```

**Flujo de datos**:
```
Usuario → login(email, password)
    ↓
AuthService.login (POST /auth/login)
    ↓
Backend retorna { access, refresh, user }
    ↓
Cookies almacenan tokens
    ↓
Context actualiza estado
    ↓
Redirige a selector de módulos
```

#### 2. Logout

```typescript
const logout = () => {
  // 1. Limpia cookies
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  
  // 2. Limpia estado
  setUser(null);
  
  // 3. Redirige a login
  navigate('/login');
};
```

#### 3. Check Auth (Persistencia)

```typescript
const checkAuth = async () => {
  const token = Cookies.get('access_token');
  
  if (!token) {
    setLoading(false);
    return;
  }
  
  try {
    // Obtiene información del usuario con el token
    const userData = await AuthService.getCurrentUser();
    setUser(userData);
  } catch (error) {
    // Token inválido, intenta refresh
    await refreshAccessToken();
  } finally {
    setLoading(false);
  }
};
```

**Se ejecuta en**:
- Montaje inicial del provider
- Refresh de página
- Cambio de ruta

#### 4. Refresh Token

```typescript
const refreshAccessToken = async () => {
  const refreshToken = Cookies.get('refresh_token');
  
  if (!refreshToken) {
    logout();
    return null;
  }
  
  try {
    const response = await AuthService.refresh(refreshToken);
    Cookies.set('access_token', response.access, { expires: 1/24 });
    
    // Recarga información del usuario
    await checkAuth();
    return response.access;
  } catch (error) {
    logout();
    return null;
  }
};
```

**Llamado desde**:
- Interceptor de Axios (cuando API retorna 401)
- checkAuth (si el access token es inválido)

### Ciclo de Vida

```
App Mount
    ↓
AuthProvider se inicializa
    ↓
useEffect ejecuta checkAuth()
    ↓
¿Existe access_token en cookies?
    ├─ Sí → Llama a getCurrentUser()
    │        ├─ Success → setUser(userData)
    │        └─ Error → refreshAccessToken()
    │
    └─ No → setLoading(false)
    ↓
Estado: { user, loading: false, isAuthenticated }
```

### Uso en Componentes

```typescript
import { useAuth } from '~/contexts/AuthContext';

function ProtectedComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div>
      <h1>Bienvenido {user?.first_name}</h1>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
```

### Integración con Remix

El `AuthProvider` se coloca en el `root.tsx` para envolver toda la aplicación:

```typescript
// app/root.tsx
export default function App() {
  return (
    <AuthProvider>
      <ModuleProvider>
        <Outlet />
      </ModuleProvider>
    </AuthProvider>
  );
}
```

---

## ModuleContext

**Archivo**: `app/contexts/ModuleContext.tsx`

### Propósito

Gestiona el **módulo activo** seleccionado por el usuario. Nodux es una aplicación multi-módulo donde cada rol tiene acceso a diferentes módulos.

### Estructura del Contexto

```typescript
interface ModuleContextType {
  // Estado
  selectedModule: Module | null;
  availableModules: Module[];
  
  // Acciones
  selectModule: (module: Module) => void;
  clearModule: () => void;
  loadModulesForUser: (role: string) => Promise<void>;
}
```

### Tipos de Datos

```typescript
interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  roles: string[];
  permissions?: string[];
}
```

### Módulos Disponibles

| ID | Nombre | Descripción | Roles | Ruta |
|----|--------|-------------|-------|------|
| `academic_admin` | Admin Académico | Gestión de mentores, proyectos y grupos | ADMIN, SUPER_ADMIN | `/modulo/academico/dashboard` |
| `products` | Productos | Gestión de productos y métricas | ADMIN, SUPER_ADMIN | `/modulo/producto/dashboard` |
| `mentor_dashboard` | Dashboard Mentor | Vista de proyectos y horas | MENTOR | `/modulo/academico/mentor/dashboard` |
| `student_dashboard` | Dashboard Estudiante | Vista de grupos y actividades | STUDENT | `/modulo/academico/estudiante/dashboard` |

### Funcionalidades Principales

#### 1. Select Module

```typescript
const selectModule = (module: Module) => {
  // 1. Almacena en localStorage
  localStorage.setItem('selectedModule', JSON.stringify(module));
  
  // 2. Actualiza estado
  setSelectedModule(module);
  
  // 3. Navega a la ruta del módulo
  navigate(module.route);
};
```

#### 2. Load Modules for User

```typescript
const loadModulesForUser = async (role: string) => {
  try {
    // Obtiene módulos del backend según el rol
    const modules = await ModuleService.getModules(role);
    setAvailableModules(modules);
  } catch (error) {
    console.error('Error cargando módulos:', error);
  }
};
```

**Se ejecuta en**:
- Login exitoso
- Cambio de rol
- Refresh de selector de módulos

#### 3. Clear Module

```typescript
const clearModule = () => {
  localStorage.removeItem('selectedModule');
  setSelectedModule(null);
  navigate('/module-selector');
};
```

**Se ejecuta en**:
- Logout
- Cambio manual de módulo
- Error en módulo actual

### Ciclo de Vida

```
Usuario hace login
    ↓
loadModulesForUser(user.role)
    ↓
Backend retorna módulos disponibles
    ↓
setAvailableModules(modules)
    ↓
Usuario selecciona módulo
    ↓
selectModule(module)
    ↓
localStorage + setState + navigate
    ↓
Usuario trabaja en módulo
```

### Persistencia

El módulo seleccionado se **persiste en localStorage**:

```typescript
// Al montar el provider
useEffect(() => {
  const stored = localStorage.getItem('selectedModule');
  if (stored) {
    setSelectedModule(JSON.parse(stored));
  }
}, []);
```

Esto permite que al refrescar la página, el usuario **permanezca en el mismo módulo**.

### Uso en Componentes

```typescript
import { useModule } from '~/contexts/ModuleContext';

function ModuleSelector() {
  const { availableModules, selectModule } = useModule();
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {availableModules.map(module => (
        <button
          key={module.id}
          onClick={() => selectModule(module)}
          className="card p-6 hover:shadow-lg"
        >
          <h3>{module.name}</h3>
          <p>{module.description}</p>
        </button>
      ))}
    </div>
  );
}
```

---

## Flujo de Datos

### Flujo Completo de Autenticación y Módulos

```
1. Usuario accede a la app
   ↓
2. AuthProvider verifica cookies
   ├─ Tiene tokens → checkAuth()
   │                 ├─ Token válido → setUser()
   │                 └─ Token expirado → refreshAccessToken()
   │
   └─ No tiene tokens → Redirige a /login
   ↓
3. Usuario hace login
   ↓
4. AuthContext almacena user y tokens
   ↓
5. ModuleContext carga módulos disponibles
   ↓
6. Usuario selecciona módulo
   ↓
7. ModuleContext almacena módulo y navega
   ↓
8. Usuario trabaja en el módulo
   ↓
9. Si token expira:
   - Interceptor detecta 401
   - Llama a refreshAccessToken()
   - Reintenta request
   ↓
10. Usuario cierra sesión
    ↓
11. AuthContext limpia estado
    ↓
12. ModuleContext limpia módulo
    ↓
13. Redirige a /login
```

### Comunicación entre Contextos

Los contextos **no se comunican directamente**, pero se complementan:

```typescript
// En un componente protegido
function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { selectedModule } = useModule();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!selectedModule) {
    return <Navigate to="/module-selector" />;
  }
  
  return <div>Dashboard de {selectedModule.name}</div>;
}
```

---

## Uso en Componentes

### Hooks Personalizados

```typescript
// Hook para autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

// Hook para módulos
export const useModule = () => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error('useModule debe usarse dentro de ModuleProvider');
  }
  return context;
};
```

### Ejemplo de Componente Completo

```typescript
import { useAuth } from '~/contexts/AuthContext';
import { useModule } from '~/contexts/ModuleContext';

function Header() {
  const { user, logout } = useAuth();
  const { selectedModule, clearModule } = useModule();
  
  const handleLogout = () => {
    clearModule();
    logout();
  };
  
  return (
    <header className="navbar">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold">{selectedModule?.name}</h1>
          <p className="text-sm text-gray-500">
            {user?.first_name} {user?.last_name}
          </p>
        </div>
        
        <div className="flex gap-2">
          <button onClick={clearModule} className="btn-secondary">
            Cambiar módulo
          </button>
          <button onClick={handleLogout} className="btn-primary">
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}
```

### Protección de Rutas

```typescript
import { useAuth } from '~/contexts/AuthContext';
import { Navigate } from '@remix-run/react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}
```

---

## Buenas Prácticas

### 1. Siempre verificar loading

```typescript
const { user, loading } = useAuth();

if (loading) {
  return <LoadingSpinner />;
}

// Ahora es seguro usar user
```

### 2. Manejar errores gracefully

```typescript
const handleLogin = async (email: string, password: string) => {
  try {
    await login(email, password);
  } catch (error) {
    // Mostrar error al usuario
    setError('Credenciales inválidas');
  }
};
```

### 3. Limpiar estado al desmontar

```typescript
useEffect(() => {
  return () => {
    // Cleanup si es necesario
  };
}, []);
```

### 4. No abusar de contextos globales

- Solo usa contextos para **datos verdaderamente globales**
- Para estado local, usa `useState` o `useReducer`
- Para estado de formularios, usa bibliotecas especializadas

---

## Debugging

### Ver estado actual

```typescript
const { user, isAuthenticated, loading } = useAuth();

console.log('Auth State:', {
  user,
  isAuthenticated,
  loading,
  hasAccessToken: !!Cookies.get('access_token'),
  hasRefreshToken: !!Cookies.get('refresh_token'),
});
```

### Verificar módulo activo

```typescript
const { selectedModule, availableModules } = useModule();

console.log('Module State:', {
  selectedModule,
  availableModules,
  stored: localStorage.getItem('selectedModule'),
});
```

---

## Testing

```typescript
import { renderHook } from '@testing-library/react-hooks';
import { AuthProvider, useAuth } from '~/contexts/AuthContext';

test('login actualiza el estado del usuario', async () => {
  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
  const { result } = renderHook(() => useAuth(), { wrapper });
  
  await act(async () => {
    await result.current.login('test@example.com', 'password');
  });
  
  expect(result.current.user).not.toBeNull();
  expect(result.current.isAuthenticated).toBe(true);
});
```

---

## Próximas Mejoras

- [ ] Context para notificaciones
- [ ] Context para tema (dark mode)
- [ ] Context para idioma (i18n)
- [ ] Persistencia en IndexedDB para offline
- [ ] Sincronización con WebSockets

---

## Enlaces Relacionados

- [📘 React Context API](https://react.dev/reference/react/useContext)
- [🔐 AuthService](../services/README.md#authservice)
- [🧩 ModuleService](../services/README.md#moduleservice)
