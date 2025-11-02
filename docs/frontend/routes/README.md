# 🛣️ Routes - Sistema de Rutas de Remix

## Índice

1. [Introducción](#introducción)
2. [Estructura de Rutas](#estructura-de-rutas)
3. [Rutas Públicas](#rutas-públicas)
4. [Rutas del Módulo Académico](#rutas-del-módulo-académico)
5. [Rutas del Módulo de Administración](#rutas-del-módulo-de-administración)
6. [Rutas del Módulo de Producto](#rutas-del-módulo-de-producto)
7. [Convenciones de Remix](#convenciones-de-remix)
8. [Loaders y Actions](#loaders-y-actions)

---

## Introducción

Nodux utiliza el sistema de **file-based routing** de Remix, donde cada archivo en `app/routes/` define automáticamente una ruta en la aplicación. Este sistema permite SSR (Server-Side Rendering), validación de datos y manejo de formularios de forma declarativa.

### Características del Sistema de Rutas

- **Server-Side Rendering**: Todas las rutas se renderizan primero en el servidor
- **File-based**: La estructura de carpetas define la estructura de URLs
- **Nested Routes**: Soporte para layouts anidados
- **Data Loading**: `loader` para cargar datos antes del render
- **Data Mutations**: `action` para manejar formularios y mutaciones
- **Error Boundaries**: Manejo de errores por ruta

---

## Estructura de Rutas

```
app/routes/
├── _index.tsx                                    # / (Landing page)
├── login.tsx                                     # /login
├── registro.tsx                                  # /registro
├── healthcheck.tsx                               # /healthcheck
├── test.tsx                                      # /test
├── selector-modulo.tsx                           # /selector-modulo
│
├── modulo.academico.tsx                          # Layout: /modulo/academico
├── modulo.academico.dashboard.tsx                # /modulo/academico/dashboard
├── modulo.academico.admin.mentors.tsx           # /modulo/academico/admin/mentors
├── modulo.academico.admin.projects.tsx          # /modulo/academico/admin/projects
├── modulo.academico.admin.groups.tsx            # /modulo/academico/admin/groups
├── modulo.academico.admin.hours.tsx             # /modulo/academico/admin/hours
├── modulo.academico.admin.calendar.tsx          # /modulo/academico/admin/calendar
├── modulo.academico.admin.metrics.tsx           # /modulo/academico/admin/metrics
│
├── modulo.administracion.tsx                     # Layout: /modulo/administracion
├── modulo.administracion.dashboard.tsx           # /modulo/administracion/dashboard
├── modulo.administracion.users.tsx               # /modulo/administracion/users
├── modulo.administracion.roles.tsx               # /modulo/administracion/roles
├── modulo.administracion.logs.tsx                # /modulo/administracion/logs
├── modulo.administracion.settings.tsx            # /modulo/administracion/settings
│
├── modulo.producto.tsx                           # Layout: /modulo/producto
├── modulo.producto.dashboard.tsx                 # /modulo/producto/dashboard
│
├── estudiantes.dashboard._index.tsx              # /estudiantes/dashboard
├── estudiantes.dashboard.datos-personales.tsx    # /estudiantes/dashboard/datos-personales
├── estudiantes.dashboard.anexo-documentos.tsx    # /estudiantes/dashboard/anexo-documentos
├── estudiantes.dashboard.matricula.tsx           # /estudiantes/dashboard/matricula
├── estudiantes.dashboard.cuestionarios.tsx       # /estudiantes/dashboard/cuestionarios
├── estudiantes.dashboard.evaluacion-docente.tsx  # /estudiantes/dashboard/evaluacion-docente
├── estudiantes.dashboard.material-apoyo.tsx      # /estudiantes/dashboard/material-apoyo
│
└── $.tsx                                         # Catch-all para 404
```

---

## Rutas Públicas

### Landing Page (`_index.tsx`)

**URL**: `/`

**Propósito**: Página principal de presentación de Nodux.

**Características**:
- Hero section con descripción del producto
- Sección de características principales
- Cards de módulos disponibles
- CTA para registro/login
- Navegación responsive

**Datos cargados**:
- Ninguno (página estática con estado de autenticación del contexto)

**Componentes utilizados**:
- `Navbar`: Navegación principal
- `Footer`: Pie de página
- `AcademicIcon`, `ProductIcon`, `AdminIcon`: Iconos de módulos

**Flujo**:
```
Usuario no autenticado → Muestra CTA de registro/login
Usuario autenticado → Muestra botón "Ir a mi Dashboard"
```

### Login (`login.tsx`)

**URL**: `/login`

**Propósito**: Autenticación de usuarios en la plataforma.

**Características**:
- Formulario de email y contraseña
- Modo desarrollo: acepta cualquier credencial
- Almacenamiento de tokens en cookies
- Redirección automática según rol

**Estado del formulario**:
```typescript
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [isLoading, setIsLoading] = useState(false);
```

**Flujo de autenticación**:
```
1. Usuario ingresa credenciales
   ↓
2. handleSubmit previene default
   ↓
3. Llama a login() del AuthContext
   ↓
4. AuthService.login simula llamada a API
   ↓
5. Almacena tokens en cookies
   ↓
6. useEffect detecta isAuthenticated
   ↓
7. Redirige según rol:
   - Mentor → /modulo/academico/mentor/dashboard
   - Estudiante → /modulo/academico/estudiante/dashboard
   - Admin/SuperAdmin → /selector-modulo
```

**Modo desarrollo**:
- ✅ No valida credenciales
- ✅ Cualquier email/password funciona
- ✅ Asigna rol de Admin por defecto
- ⚠️ Mostrar advertencia visual de modo desarrollo

### Registro (`registro.tsx`)

**URL**: `/registro`

**Propósito**: Creación de nuevas cuentas de usuario.

**Características**:
- Formulario multi-paso o simple
- Selección de rol
- Validación de campos
- Confirmación de contraseña

**Nota**: Archivo no incluido en el codebase actual, pendiente de implementación.

### Health Check (`healthcheck.tsx`)

**URL**: `/healthcheck`

**Propósito**: Monitoreo del estado del sistema frontend y backend.

**Loader**:
```typescript
export const loader: LoaderFunction = async () => {
  const frontendHealth = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  };
  
  return json({ frontendHealth });
};
```

**Características**:
- Estado del frontend (siempre OK)
- Estado del backend (mediante API call)
- Métricas del sistema
- Tiempo de respuesta
- Botón de actualización manual

**Datos mostrados**:
```typescript
{
  Frontend: {
    status: 'ok',
    version: '1.0.0',
    environment: 'development'
  },
  Backend: {
    status: 'healthy' | 'unhealthy',
    database: 'ok',
    responseTime: 150 // ms
  },
  Metrics: {
    disponibilidad: '99.9%',
    tiempoRespuesta: '150ms',
    usuariosActivos: '1.2k'
  }
}
```

### Test Page (`test.tsx`)

**URL**: `/test`

**Propósito**: Página de pruebas de servicios y funcionalidades.

**Nota**: Archivo no incluido en el codebase actual.

---

## Rutas del Módulo Académico

### Layout (`modulo.academico.tsx`)

**URL**: `/modulo/academico` (no renderiza, solo layout)

**Propósito**: Layout compartido para todas las rutas del módulo académico.

**Funcionalidad**:
```typescript
export default function AcademicoLayout() {
  const { setActiveModule } = useModule();

  useEffect(() => {
    console.log('AcademicoLayout: estableciendo módulo Académico');
    setActiveModule('Académico');
  }, [setActiveModule]);

  return <Outlet />;
}
```

**Características**:
- Establece el módulo activo en el contexto
- Renderiza las rutas hijas mediante `<Outlet />`
- No tiene UI propia

### Dashboard Admin (`modulo.academico.dashboard.tsx`)

**URL**: `/modulo/academico/dashboard`

**Roles permitidos**: `Admin`, `SuperAdmin`

**Propósito**: Dashboard principal del módulo académico para administradores.

**Características**:
- Redirección automática según rol
- Frases filosóficas rotativas
- Saludo personalizado según hora del día
- Mensaje de bienvenida

**Flujo de redirección**:
```typescript
useEffect(() => {
  if (user && !hasRedirected.current) {
    if (user.role === 'Mentor') {
      hasRedirected.current = true;
      navigate('/modulo/academico/mentor/dashboard', { replace: true });
    } else if (user.role === 'Estudiante') {
      hasRedirected.current = true;
      navigate('/modulo/academico/estudiante/dashboard', { replace: true });
    }
  }
}, [user, navigate]);
```

**Frases filosóficas**:
```typescript
const philosophicalQuotes = [
  {
    text: "La educación es el arma más poderosa que puedes usar para cambiar el mundo.",
    author: "Nelson Mandela"
  },
  // ... 8 frases rotativas cada 6 segundos
];
```

### Gestión de Mentores (`modulo.academico.admin.mentors.tsx`)

**URL**: `/modulo/academico/admin/mentors`

**Roles permitidos**: `Admin`, `SuperAdmin`

**Propósito**: CRUD completo de mentores.

**Estado del componente**:
```typescript
const [mentors, setMentors] = useState<Mentor[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
```

**Loader de datos**:
```typescript
useEffect(() => {
  const fetchMentors = async () => {
    setLoading(true);
    try {
      const data = await MentorService.getMentors();
      setMentors(data);
    } catch (err) {
      setError('Error al cargar los mentores');
    } finally {
      setLoading(false);
    }
  };

  fetchMentors();
}, []);
```

**Características**:
- Tabla con lista de mentores
- Panel de detalle al seleccionar
- Búsqueda y filtrado
- Estados: active/inactive
- Botón de crear nuevo mentor

**Estructura de datos mostrados**:
```typescript
interface MentorDisplay {
  Avatar: Image | InitialCircle;
  Nombre: string;
  Email: string;
  Especialidad: string;
  Estado: Badge;
  Estadísticas: {
    proyectos: number;
    horas: number;
  };
}
```

### Gestión de Proyectos (`modulo.academico.admin.projects.tsx`)

**URL**: `/modulo/academico/admin/projects`

**Roles permitidos**: `Admin`, `SuperAdmin`

**Propósito**: CRUD completo de proyectos académicos.

**Estado del componente**:
```typescript
const [projects, setProjects] = useState<Project[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [selectedProject, setSelectedProject] = useState<Project | null>(null);
```

**Características**:
- Tabla de proyectos con estados
- Fechas de inicio/fin
- Estadísticas por proyecto
- Panel de detalle

**Estados de proyecto**:
```typescript
type ProjectStatus = 'active' | 'completed' | 'cancelled' | 'pending';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'badge-success';
    case 'completed': return 'badge-info';
    case 'cancelled': return 'badge-error';
    case 'pending': return 'badge-warning';
  }
};
```

### Gestión de Grupos (`modulo.academico.admin.groups.tsx`)

**URL**: `/modulo/academico/admin/groups`

**Roles permitidos**: `Admin`, `SuperAdmin`

**Propósito**: CRUD de grupos académicos dentro de proyectos.

**Características**:
- Tabla de grupos por proyecto
- Asignación de mentores
- Lista de estudiantes por grupo
- Horarios del grupo

**Estructura de datos**:
```typescript
interface Group {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  mentorId: string;
  mentorName: string;
  students: Student[];
  schedule?: Schedule[];
}
```

**Vista de detalle**:
```typescript
<dl>
  <dd>Nombre: {group.name}</dd>
  <dd>Proyecto: {group.projectName}</dd>
  <dd>Mentor: {group.mentorName}</dd>
  <dd>
    Estudiantes ({group.students.length}):
    <ul>
      {group.students.map(student => (
        <li key={student.id}>{student.name}</li>
      ))}
    </ul>
  </dd>
</dl>
```

### Registro de Horas (`modulo.academico.admin.hours.tsx`)

**URL**: `/modulo/academico/admin/hours`

**Roles permitidos**: `Admin`, `SuperAdmin`

**Propósito**: Gestión y aprobación de registros de horas de mentores.

**Estado del componente**:
```typescript
const [hours, setHours] = useState<HourRecord[]>([]);
const [selectedHour, setSelectedHour] = useState<HourRecord | null>(null);
const [filterStatus, setFilterStatus] = useState<string>('all');
```

**Estadísticas mostradas**:
```typescript
const totalHours = hours.reduce((sum, h) => sum + h.hours, 0);
const pendingHours = hours.filter(h => h.status === 'pending').length;
const approvedHours = hours.filter(h => h.status === 'approved')
  .reduce((sum, h) => sum + h.hours, 0);
```

**Acciones disponibles**:
```typescript
const handleApproveHour = async (hourId: string) => {
  // Aprobar registro
};

const handleRejectHour = async (hourId: string) => {
  // Rechazar registro
};
```

**Estados de registro**:
- `pending`: Pendiente de aprobación (amarillo)
- `approved`: Aprobado (verde)
- `rejected`: Rechazado (rojo)

### Calendario (`modulo.academico.admin.calendar.tsx`)

**URL**: `/modulo/academico/admin/calendar`

**Roles permitidos**: `Admin`, `SuperAdmin`

**Propósito**: Visualización de calendario con eventos y sesiones.

**Características**:
- Vista de semana (Lun-Vie) o semana completa (Lun-Dom)
- Grid de horarios (7:00 - 19:00)
- Eventos con código de colores
- Modal de detalle al hacer click
- Tooltip en hover

**Tipos de vista**:
```typescript
type ViewMode = 'week' | 'fullWeek' | 'month';
```

**Estructura de eventos**:
```typescript
interface CalendarEvent {
  id: number;
  title: string;
  mentor: {
    id: number;
    name: string;
    avatar: string;
    expertise: string;
  };
  proyecto: {
    id: number;
    name: string;
    estado: string;
  };
  startTime: string;
  endTime: string;
  date: string;
  color: string;
  modalidad: 'Presencial' | 'Virtual' | 'Híbrida';
  lugar: string;
}
```

**Navegación**:
```typescript
const goToPrevious = () => {
  const newDate = new Date(currentDate);
  newDate.setDate(newDate.getDate() - 7);
  setCurrentDate(newDate);
};

const goToNext = () => {
  const newDate = new Date(currentDate);
  newDate.setDate(newDate.getDate() + 7);
  setCurrentDate(newDate);
};
```

**Renderizado de eventos**:
```typescript
// Evento se renderiza en la cuadrícula según:
// - Columna: día de la semana
// - Fila inicio: hora de inicio
// - Fila fin: hora de inicio + duración
const startRow = event.startHour - 7 + 2;
const endRow = startRow + event.duration;
const columnPos = dayIndex + 2;
```

### Métricas (`modulo.academico.admin.metrics.tsx`)

**URL**: `/modulo/academico/admin/metrics`

**Roles permitidos**: `Admin`, `SuperAdmin`

**Propósito**: Dashboard de analytics y métricas académicas.

**Métricas principales**:
```typescript
interface MetricData {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
}
```

**Secciones**:
1. **Métricas principales**: Cards con KPIs
2. **Top Mentores**: Ranking por horas y rating
3. **Top Proyectos**: Proyectos destacados por completitud
4. **Análisis de rendimiento**: Barras de progreso

**Top Mentores**:
```typescript
const topMentors = [
  {
    name: 'María García',
    hours: 245,
    students: 12,
    rating: 4.8
  },
  // ...
];
```

**Análisis de rendimiento**:
- Productividad General: 85%
- Participación Estudiantil: 92%
- Calidad de Mentorías: 78%
- Retención de Estudiantes: 94%

---

## Rutas del Módulo de Administración

### Layout (`modulo.administracion.tsx`)

**URL**: `/modulo/administracion` (no renderiza, solo layout)

**Funcionalidad**:
```typescript
export default function AdministracionLayout() {
  const { setActiveModule } = useModule();

  useEffect(() => {
    console.log('AdministracionLayout: estableciendo módulo Administración');
    setActiveModule('Administración');
  }, [setActiveModule]);

  return <Outlet />;
}
```

### Dashboard Admin (`modulo.administracion.dashboard.tsx`)

**URL**: `/modulo/administracion/dashboard`

**Roles permitidos**: `Admin`, `SuperAdmin`

**Propósito**: Dashboard de administración del sistema.

**Estadísticas mostradas**:
```typescript
const stats = await AdminService.getDashboardStats();

// Estadísticas incluyen:
{
  totalUsers: 124,
  activeUsers: 98,
  totalRoles: 6,
  totalModules: 3,
  newUsersThisWeek: 12,
  systemHealth: {
    cpu: 32,
    memory: 45,
    storage: 28
  },
  activityLogs: [...]
}
```

**Secciones**:
1. **Cards de estadísticas**: Usuarios, roles, módulos
2. **Salud del sistema**: CPU, Memoria, Almacenamiento
3. **Actividad reciente**: Últimas acciones del sistema

### Gestión de Usuarios (`modulo.administracion.users.tsx`)

**URL**: `/modulo/administracion/users`

**Roles permitidos**: `Admin`, `SuperAdmin`

**Propósito**: CRUD completo de usuarios del sistema.

**Estado del componente**:
```typescript
const [users, setUsers] = useState<User[]>([]);
const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
const [selectedUser, setSelectedUser] = useState<User | null>(null);
const [searchTerm, setSearchTerm] = useState('');
const [roleFilter, setRoleFilter] = useState<string>('all');
const [statusFilter, setStatusFilter] = useState<string>('all');
```

**Filtros disponibles**:
- Por término de búsqueda (nombre/email)
- Por rol
- Por estado (activo/inactivo)

**Modo de edición**:
```typescript
const [editMode, setEditMode] = useState(false);
const [editForm, setEditForm] = useState({
  name: '',
  email: '',
  role: '',
  active: true
});
```

**Acciones**:
- Ver detalles
- Editar usuario
- Cambiar rol
- Activar/Desactivar
- Eliminar

### Gestión de Roles (`modulo.administracion.roles.tsx`)

**URL**: `/modulo/administracion/roles`

**Roles permitidos**: `Admin`, `SuperAdmin`

**Propósito**: Gestión de roles y permisos del sistema.

**Datos mostrados**:
```typescript
interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystemRole: boolean;
}
```

**Permisos agrupados por módulo**:
```typescript
const groupedPermissions = {
  'General': [
    { id: '1', name: 'view_dashboard', description: 'Ver dashboard' },
    // ...
  ],
  'Administración': [
    { id: '2', name: 'manage_users', description: 'Gestionar usuarios' },
    // ...
  ],
  'Académico': [
    { id: '3', name: 'manage_projects', description: 'Gestionar proyectos' },
    // ...
  ]
};
```

**Roles del sistema**:
- `SuperAdmin`: Acceso total (⚡ Todos los permisos)
- `Admin`: Administración de módulos
- `Mentor`: Mentoría académica
- `Estudiante`: Vista de estudiante

**Nota**: Los roles del sistema no pueden ser modificados (isSystemRole: true)

### Logs del Sistema (`modulo.administracion.logs.tsx`)

**URL**: `/modulo/administracion/logs`

**Roles permitidos**: `Admin`, `SuperAdmin`

**Propósito**: Visualización y análisis de logs del sistema.

**Estructura de logs**:
```typescript
interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG';
  source: string;
  user?: string;
  action: string;
  details: string;
  ip?: string;
  userAgent?: string;
}
```

**Filtros**:
- Por nivel (ERROR, WARNING, INFO, DEBUG)
- Por fuente (AUTH, API, DATABASE, SECURITY, etc.)
- Por término de búsqueda
- Por fecha (hoy, ayer, última semana)

**Estadísticas rápidas**:
```typescript
const errorCount = logs.filter(log => log.level === 'ERROR').length;
const warningCount = logs.filter(log => log.level === 'WARNING').length;
const infoCount = logs.filter(log => log.level === 'INFO').length;
const totalCount = logs.length;
```

**Iconos por nivel**:
- ERROR: 🔴
- WARNING: 🟡
- INFO: 🔵
- DEBUG: ⚪

### Configuración (`modulo.administracion.settings.tsx`)

**URL**: `/modulo/administracion/settings`

**Roles permitidos**: `Admin`, `SuperAdmin`

**Propósito**: Configuración general del sistema.

**Tabs de configuración**:
```typescript
const tabs = [
  { id: 'general', name: 'General', icon: SettingsIcon },
  { id: 'security', name: 'Seguridad', icon: SecurityIcon },
  { id: 'notifications', name: 'Notificaciones', icon: NotificationIcon },
  { id: 'modules', name: 'Módulos', icon: ModulesIcon },
];
```

**Configuraciones**:
```typescript
interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    maintenanceMode: boolean;
    allowRegistration: boolean;
  };
  security: {
    loginAttempts: number;
    sessionTimeout: number;
    passwordMinLength: number;
    requireTwoFactor: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    browserNotifications: boolean;
    slackIntegration: boolean;
    discordIntegration: boolean;
  };
  modules: {
    academicModule: boolean;
    productModule: boolean;
    hrModule: boolean;
  };
}
```

---

## Rutas del Módulo de Producto

### Layout (`modulo.producto.tsx`)

**Propósito**: Layout para módulo de producto (pendiente de implementación).

### Dashboard (`modulo.producto.dashboard.tsx`)

**URL**: `/modulo/producto/dashboard`

**Roles permitidos**: `Admin`, `SuperAdmin`, `Trabajador`

**Nota**: Módulo en construcción, muestra mensaje de "Próximamente".

---

## Convenciones de Remix

### Nomenclatura de Archivos

```
Convención de puntos para rutas anidadas:
modulo.academico.admin.mentors.tsx → /modulo/academico/admin/mentors

Guion bajo para rutas sin segmento:
_index.tsx → / (ruta raíz sin agregar segmento)

Símbolo de dólar para parámetros:
users.$userId.tsx → /users/:userId

Símbolo de dólar solo para catch-all:
$.tsx → Captura cualquier ruta no definida (404)
```

### Meta Tags

Todas las rutas definen sus meta tags:

```typescript
export const meta: MetaFunction = () => {
  return [
    { title: 'Título de la página - Nodux' },
    {
      name: 'description',
      content: 'Descripción de la página',
    },
  ];
};
```

### Protected Routes

Las rutas protegidas usan el componente `ProtectedRoute`:

```typescript
export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
      {/* Contenido */}
    </ProtectedRoute>
  );
}
```

---

## Loaders y Actions

### Loaders

Cargan datos en el servidor antes de renderizar:

```typescript
export const loader: LoaderFunction = async ({ request, params }) => {
  const mentors = await MentorService.getMentors();
  return json({ mentors });
};

export default function Mentors() {
  const { mentors } = useLoaderData<typeof loader>();
  return <div>{/* Renderizar mentors */}</div>;
}
```

### Actions

Manejan mutaciones de datos (POST, PUT, DELETE):

```typescript
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get('intent');
  
  if (intent === 'create') {
    const mentor = await MentorService.createMentor({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    });
    return json({ success: true, mentor });
  }
  
  return json({ success: false });
};
```

**Nota**: Actualmente, la mayoría de mutaciones se manejan con `useState` y llamadas directas a servicios. La migración a `action` está pendiente.

---

## Error Boundaries

Cada ruta puede definir su error boundary:

```typescript
export function ErrorBoundary() {
  const error = useRouteError();
  
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFound />;
  }
  
  return <div>Error inesperado</div>;
}
```

---

## Próximas Mejoras

- [ ] Implementar loaders para todas las rutas
- [ ] Migrar mutaciones a actions
- [ ] Agregar validación de formularios con Zod
- [ ] Implementar optimistic UI
- [ ] Agregar prefetching de datos
- [ ] Mejorar error boundaries por ruta

---

## Enlaces Relacionados

- [📘 Remix Routing](https://remix.run/docs/en/main/file-conventions/routes)
- [🔄 Loaders](https://remix.run/docs/en/main/route/loader)
- [✏️ Actions](https://remix.run/docs/en/main/route/action)
- [🎯 Meta Tags](https://remix.run/docs/en/main/route/meta)
