# 🔌 Servicios - Capa de Acceso a Datos

## Índice

1. [Introducción](#introducción)
2. [Cliente HTTP (API Client)](#cliente-http-api-client)
3. [AuthService](#authservice)
4. [ModuleService](#moduleservice)
5. [AcademicService](#academicservice)
6. [AdminService](#adminservice)
7. [Otros Servicios](#otros-servicios)
8. [Manejo de Errores](#manejo-de-errores)

---

## Introducción

Los servicios en Nodux son **módulos que encapsulan la lógica de comunicación con el backend**. Cada servicio maneja un dominio específico (autenticación, módulos, académico, etc.) y proporciona métodos para realizar operaciones CRUD.

### Ubicación

```
app/services/
├── authService.ts          # Autenticación y usuarios
├── moduleService.ts        # Módulos disponibles
├── academicService.ts      # Mentores, proyectos, grupos
├── adminService.ts         # Administración del sistema
├── mentorService.ts        # Operaciones específicas de mentores
├── projectService.ts       # Operaciones específicas de proyectos
├── groupService.ts         # Operaciones específicas de grupos
├── scheduleService.ts      # Horarios
├── eventService.ts         # Eventos/calendario
└── statsService.ts         # Estadísticas
```

### Arquitectura de Servicios

```
Componente
    ↓
Llama a Service Method
    ↓
Service usa apiClient (Axios)
    ↓
Interceptores agregan token
    ↓
Request al Backend
    ↓
Response procesada
    ↓
Datos mapeados a tipos TypeScript
    ↓
Retornados al componente
```

---

## Cliente HTTP (API Client)

**Archivo**: `app/utils/api.ts`

### Configuración

```typescript
const API_BASE_URL = getApiBaseUrl();
// Cliente: VITE_API_BASE_URL || 'http://localhost:8000/api'
// Servidor: API_BASE_URL || 'http://localhost:8000/api'

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Permite envío de cookies
});
```

### Interceptores

#### Request Interceptor

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
- Agrega automáticamente el `access_token` a cada request
- Se ejecuta **antes** de enviar el request al backend

#### Response Interceptor

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // Si el error es 401 y no se ha reintentado
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = Cookies.get('refresh_token');
        
        // Obtener nuevo access token
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });
        
        const { access } = response.data;
        Cookies.set('access_token', access, { expires: 1/24 });
        
        // Reintentar request original con nuevo token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh falló, limpiar sesión y redirigir
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
- Detecta errores **401 Unauthorized**
- Intenta refrescar el token automáticamente
- Reintenta el request original con el nuevo token
- Si falla, limpia la sesión y redirige a login

### Health Check

```typescript
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/healthcheck/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

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

---

## AuthService

**Archivo**: `app/services/authService.ts`

### Propósito

Maneja toda la **autenticación** y **gestión de usuarios**.

### Métodos Disponibles

#### 1. login

```typescript
login: async (credentials: LoginCredentials): Promise<AuthResponse>
```

**Parámetros**:
```typescript
interface LoginCredentials {
  email: string;
  password: string;
}
```

**Retorna**:
```typescript
interface AuthResponse {
  access: string;        // JWT access token
  refresh: string;       // JWT refresh token
  user: User;           // Datos del usuario
}
```

**Uso**:
```typescript
const response = await AuthService.login({
  email: 'admin@nodux.com',
  password: 'password123'
});

// Almacenar tokens
Cookies.set('access_token', response.access, { expires: 1/24 });
Cookies.set('refresh_token', response.refresh, { expires: 7 });
```

**Flujo de datos**:
```
AuthService.login({ email, password })
    ↓
POST /api/auth/token/
    ↓
Backend valida credenciales
    ↓
Retorna { access, refresh, user }
    ↓
Componente almacena tokens
    ↓
Context actualiza estado global
```

#### 2. register

```typescript
register: async (data: RegisterData): Promise<AuthResponse>
```

**Parámetros**:
```typescript
interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
```

**Uso**:
```typescript
const response = await AuthService.register({
  name: 'Juan Pérez',
  email: 'juan@example.com',
  password: 'securePassword123',
  role: 'Estudiante'
});
```

#### 3. logout

```typescript
logout: async (): Promise<void>
```

**Funcionalidad**:
- Elimina cookies de tokens
- Limpia estado de autenticación
- No requiere llamada al backend (stateless JWT)

**Uso**:
```typescript
await AuthService.logout();
// Cookies eliminadas automáticamente
```

#### 4. getCurrentUser

```typescript
getCurrentUser: async (): Promise<User | null>
```

**Funcionalidad**:
- Obtiene la información del usuario actual
- Usa el `access_token` de las cookies
- Retorna `null` si no hay sesión activa

**Uso**:
```typescript
const user = await AuthService.getCurrentUser();

if (user) {
  console.log(`Bienvenido ${user.name}`);
}
```

#### 5. getUsers

```typescript
getUsers: async (): Promise<User[]>
```

**Funcionalidad**:
- Lista todos los usuarios del sistema
- Solo accesible por Admin/SuperAdmin

**Uso**:
```typescript
const users = await AuthService.getUsers();
console.log(`Total de usuarios: ${users.length}`);
```

#### 6. updateUserRole

```typescript
updateUserRole: async (userId: string, role: UserRole): Promise<User>
```

**Funcionalidad**:
- Actualiza el rol de un usuario
- Solo accesible por Admin/SuperAdmin

**Uso**:
```typescript
const updatedUser = await AuthService.updateUserRole('123', 'Mentor');
```

#### 7. updateUserStatus

```typescript
updateUserStatus: async (userId: string, active: boolean): Promise<User>
```

**Funcionalidad**:
- Activa o desactiva un usuario

**Uso**:
```typescript
await AuthService.updateUserStatus('123', false); // Desactivar
```

#### 8. updateUser

```typescript
updateUser: async (userId: string, userData: UpdateUserData): Promise<User>
```

**Parámetros**:
```typescript
interface UpdateUserData {
  name?: string;
  email?: string;
  role?: UserRole;
  active?: boolean;
}
```

**Uso**:
```typescript
const updatedUser = await AuthService.updateUser('123', {
  name: 'Nuevo Nombre',
  email: 'nuevo@email.com',
  role: 'Mentor'
});
```

### Datos Mock

El servicio actualmente usa **datos mock** para desarrollo:

```typescript
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin Usuario',
    email: 'admin@nodux.com',
    role: 'Admin',
    permissions: ['read:all', 'write:all', 'admin:all'],
    active: true,
    lastLogin: new Date().toISOString()
  },
  // ... más usuarios
];
```

**Nota**: En producción, estos métodos harán llamadas reales a la API.

---

## ModuleService

**Archivo**: `app/services/moduleService.ts`

### Propósito

Gestiona los **módulos disponibles** según el rol del usuario.

### Métodos Disponibles

#### 1. getModules

```typescript
getModules: async (userRole: UserRole): Promise<Module[]>
```

**Funcionalidad**:
- Obtiene módulos filtrados por rol
- Cada rol tiene acceso a módulos específicos

**Permisos por rol**:
```typescript
const MODULE_PERMISSIONS: Record<UserRole, ModuleType[]> = {
  'SuperAdmin': ['Académico', 'Producto', 'Administración'],
  'Admin': ['Académico', 'Producto', 'Administración'],
  'Mentor': ['Académico'],
  'Estudiante': ['Académico'],
  'Trabajador': ['Producto'],
  'Usuario base': []
};
```

**Uso**:
```typescript
const modules = await ModuleService.getModules('Admin');
// Retorna: [Académico, Producto, Administración]
```

#### 2. getModuleById

```typescript
getModuleById: async (moduleId: string): Promise<Module | null>
```

**Uso**:
```typescript
const module = await ModuleService.getModuleById('1');
if (module) {
  console.log(module.name); // "Académico"
}
```

### Módulos Disponibles

```typescript
const MOCK_MODULES: Module[] = [
  {
    id: '1',
    name: 'Académico',
    description: 'Gestión de proyectos, mentores y estudiantes',
    icon: '🎓'
  },
  {
    id: '2',
    name: 'Producto',
    description: 'Gestión de productos y servicios',
    icon: '📦'
  },
  {
    id: '3',
    name: 'Administración',
    description: 'Gestión de usuarios, permisos y configuración',
    icon: '⚙️',
    adminOnly: true
  }
];
```

---

## AcademicService

**Archivo**: `app/services/academicService.ts`

### Propósito

Conjunto de servicios para el **módulo académico**: Mentores, Proyectos, Grupos y Horarios.

### Servicios Incluidos

#### MentorService

**Métodos**:

```typescript
// Listar mentores
getMentors: async (): Promise<Mentor[]>

// Obtener mentor por ID
getMentorById: async (mentorId: string): Promise<Mentor | null>

// Crear mentor
createMentor: async (mentorData: Partial<Mentor>): Promise<Mentor>

// Actualizar mentor
updateMentor: async (mentorId: string, mentorData: Partial<Mentor>): Promise<Mentor>

// Eliminar mentor
deleteMentor: async (mentorId: string): Promise<void>
```

**Mapeo de datos**:
```typescript
// Backend → Frontend
{
  id: String(m.id),
  userId: String(m.id),
  name: `${m.first_name} ${m.last_name}`,
  email: m.email,
  phone: m.phone,
  specialty: m.charge,
  profileImage: m.photo ?? undefined,
  status: 'active',
  // ...
}
```

**Uso**:
```typescript
// Crear mentor
const newMentor = await MentorService.createMentor({
  name: 'Juan Pérez',
  email: 'juan@example.com',
  phone: '+57 300 123 4567',
  specialty: 'Desarrollo Web',
});

// Listar mentores
const mentors = await MentorService.getMentors();
```

#### ProjectService

**Métodos**:

```typescript
// Listar proyectos
getProjects: async (): Promise<Project[]>

// Obtener proyecto por ID
getProjectById: async (projectId: string): Promise<Project | null>

// Crear proyecto
createProject: async (projectData: Partial<Project>): Promise<Project>
```

**Estructura de datos**:
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'cancelled' | 'pending';
  groups?: Group[];
  mentors?: Mentor[];
}
```

**Uso**:
```typescript
const newProject = await ProjectService.createProject({
  name: 'Bootcamp Full Stack',
  description: 'Programa intensivo de desarrollo',
  status: 'active'
});
```

#### GroupService

**Métodos**:

```typescript
// Obtener grupos de un proyecto
getGroups: async (projectId: string): Promise<Group[]>

// Crear grupo en un proyecto
createGroup: async (projectId: string, groupData: Partial<Group>): Promise<Group>
```

**Uso**:
```typescript
const groups = await GroupService.getGroups('project-123');

const newGroup = await GroupService.createGroup('project-123', {
  mentorId: 'mentor-456',
  schedule: [{ day: '1', startTime: '09:00', endTime: '12:00' }]
});
```

#### ScheduleService

**Métodos**:

```typescript
// Listar horarios
getSchedules: async (): Promise<Schedule[]>

// Crear horario
createSchedule: async (scheduleData: Partial<Schedule>): Promise<Schedule>
```

**Estructura**:
```typescript
interface Schedule {
  id: string;
  groupId: string;
  day: string;        // '0' = Lunes, '6' = Domingo
  startTime: string;  // 'HH:MM:SS'
  endTime: string;    // 'HH:MM:SS'
  location?: string;
}
```

---

## AdminService

**Archivo**: `app/services/adminService.ts`

### Propósito

Operaciones de **administración del sistema**: usuarios, roles, logs.

### Métodos Disponibles

#### 1. getDashboardStats

```typescript
getDashboardStats: async (): Promise<DashboardStats>
```

**Retorna**:
```typescript
{
  totalUsers: 124,
  activeUsers: 98,
  totalRoles: 6,
  totalModules: 3,
  newUsersThisWeek: 12,
  loginAttempts: {
    successful: 245,
    failed: 18
  },
  systemHealth: {
    cpu: 32,
    memory: 45,
    storage: 28
  },
  activityLogs: [...]
}
```

#### 2. getUsers

```typescript
getUsers: async (): Promise<User[]>
```

**Funcionalidad**: Lista todos los usuarios con información completa

#### 3. updateUser

```typescript
updateUser: async (userId: string, userData: UpdateUserData): Promise<User>
```

#### 4. deleteUser

```typescript
deleteUser: async (userId: string): Promise<void>
```

#### 5. getRoles

```typescript
getRoles: async (): Promise<RoleInfo[]>
```

**Retorna**:
```typescript
[
  {
    name: 'SuperAdmin',
    count: 1,
    permissions: ['system:all', 'admin:all', 'read:all', 'write:all']
  },
  // ...
]
```

#### 6. getSystemLogs

```typescript
getSystemLogs: async (page: number, limit: number): Promise<{
  logs: Log[];
  total: number;
}>
```

**Parámetros**:
- `page`: Número de página (1-indexed)
- `limit`: Registros por página

**Retorna**:
```typescript
{
  logs: [
    {
      id: '1',
      user: 'Admin',
      action: 'Usuario creado',
      target: 'usuario@example.com',
      timestamp: '2023-06-15T10:30:00Z',
      details: 'Detalles adicionales'
    },
    // ...
  ],
  total: 100
}
```

---

## Otros Servicios

### MentorService (específico)

**Archivo**: `app/services/mentorService.ts`

Similar a `AcademicService.MentorService` pero con métodos adicionales:

```typescript
// Obtener horas de un mentor
getMentorHours: async (id: string): Promise<MentorHour[]>

// Registrar horas de un mentor
registerMentorHours: async (id: string, hours: number): Promise<MentorHour>
```

### EventService

**Archivo**: `app/services/eventService.ts`

```typescript
// Listar eventos
getEvents: async (): Promise<Event[]>

// Obtener eventos de un grupo
getGroupEvents: async (projectId: string, groupId: string): Promise<Event[]>

// Crear evento en un grupo
createGroupEvent: async (
  projectId: string,
  groupId: string,
  data: Partial<Event>
): Promise<Event>
```

### StatsService

**Archivo**: `app/services/statsService.ts`

```typescript
// Obtener estadísticas generales
getStats: async (): Promise<Stats>

interface Stats {
  mentors: number;
  projects: number;
  groups: number;
}
```

---

## Manejo de Errores

### Try-Catch en Servicios

Todos los servicios manejan errores con **try-catch**:

```typescript
try {
  const response = await apiClient.get('/mentors/');
  return response.data;
} catch (error) {
  console.error('Error al obtener mentores:', error);
  throw error; // Re-throw para que el componente maneje el error
}
```

### Manejo en Componentes

```typescript
const handleSubmit = async () => {
  try {
    setLoading(true);
    await MentorService.createMentor(formData);
    setSuccess(true);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        setError('Datos inválidos');
      } else if (error.response?.status === 401) {
        setError('No autorizado');
      } else {
        setError('Error al crear mentor');
      }
    }
  } finally {
    setLoading(false);
  }
};
```

### Errores Comunes

| Código | Significado | Acción |
|--------|-------------|--------|
| 400 | Bad Request | Validar datos del formulario |
| 401 | Unauthorized | Token expirado, refrescar automáticamente |
| 403 | Forbidden | Usuario sin permisos |
| 404 | Not Found | Recurso no existe |
| 500 | Server Error | Mostrar error genérico |

---

## Convenciones de Código

### 1. Nombres de métodos

```typescript
// Listar: get + Plural
getUsers()
getMentors()
getProjects()

// Obtener uno: get + Singular + ById
getUserById(id)
getMentorById(id)

// Crear: create + Singular
createUser(data)
createMentor(data)

// Actualizar: update + Singular
updateUser(id, data)

// Eliminar: delete + Singular
deleteUser(id)
```

### 2. Mapeo de datos

```typescript
// Siempre mapear snake_case (backend) → camelCase (frontend)
const mapped = response.data.map((item: any) => ({
  firstName: item.first_name,
  lastName: item.last_name,
  // ...
}));
```

### 3. Tipos TypeScript

```typescript
// Siempre tipar parámetros y retornos
createMentor: async (data: Partial<Mentor>): Promise<Mentor> => {
  // ...
}
```

---

## Testing

### Ejemplo de test de servicio

```typescript
import { MentorService } from '~/services/academicService';

test('getMentors retorna array de mentores', async () => {
  const mentors = await MentorService.getMentors();
  
  expect(Array.isArray(mentors)).toBe(true);
  expect(mentors.length).toBeGreaterThan(0);
  expect(mentors[0]).toHaveProperty('id');
  expect(mentors[0]).toHaveProperty('name');
});

test('createMentor crea un mentor correctamente', async () => {
  const newMentor = await MentorService.createMentor({
    name: 'Test Mentor',
    email: 'test@example.com',
    specialty: 'Testing'
  });
  
  expect(newMentor.id).toBeDefined();
  expect(newMentor.name).toBe('Test Mentor');
});
```

---

## Próximas Mejoras

- [ ] Implementar caché de respuestas (React Query)
- [ ] Agregar retry logic para requests fallidos
- [ ] Implementar optimistic updates
- [ ] Agregar tracking de requests en progreso
- [ ] Mejorar tipado con Generics

---

## Enlaces Relacionados

- [📘 Axios Documentation](https://axios-http.com/docs/intro)
- [🔐 JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [🧩 API Client Utils](../utils/README.md#api-client)
