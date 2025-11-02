# 🧩 Componentes - Arquitectura UI

## Índice

1. [Introducción](#introducción)
2. [Atomic Design](#atomic-design)
3. [Componentes de Layout](#componentes-de-layout)
4. [Componentes de Navegación](#componentes-de-navegación)
5. [Componentes de Protección](#componentes-de-protección)
6. [Iconografía](#iconografía)
7. [Error Boundaries](#error-boundaries)
8. [Guía de Uso](#guía-de-uso)

---

## Introducción

Los componentes en Nodux siguen el patrón **Atomic Design**, organizados en niveles de complejidad creciente. Cada componente está diseñado para ser reutilizable, composable y mantener responsabilidad única.

### Principios de Diseño

1. **Reutilización**: Componentes genéricos y adaptables
2. **Composición**: Construcción de interfaces complejas desde partes simples
3. **Accesibilidad**: Cumplimiento de estándares WCAG
4. **Responsividad**: Diseño mobile-first
5. **Consistencia**: Uso de sistema de diseño unificado

---

## Atomic Design

### Átomos (Atoms)

Componentes más básicos e indivisibles:

- **Iconos**: `AcademicIcon`, `AdminIcon`, `ProductIcon`, etc.
- **Botones**: Ya definidos en Tailwind CSS classes
- **Inputs**: Form controls básicos
- **Badges**: Indicadores de estado

### Moléculas (Molecules)

Combinaciones simples de átomos:

- **Cards**: `DashboardCard`
- **Form Groups**: Label + Input + Error
- **Navigation Items**: Icon + Text + Badge

### Organismos (Organisms)

Secciones completas de UI:

- **Navbar**: Barra de navegación principal
- **Sidebar**: Navegación lateral por módulo
- **Footer**: Pie de página
- **Tables**: Tablas complejas con filtros

### Templates

Layouts que estructuran páginas:

- **AdminLayout**: Layout para administración
- **MentorLayout**: Layout para mentores
- **StudentLayout**: Layout para estudiantes
- **SystemAdminLayout**: Layout para super admin

---

## Componentes de Layout

### AdminLayout

**Archivo**: `app/components/Layout/AdminLayout.tsx`

**Propósito**: Layout principal para usuarios Admin/SuperAdmin en el módulo académico.

**Props**:
```typescript
interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}
```

**Características**:
- Sidebar con navegación del módulo académico
- Header con título y breadcrumbs
- Área de contenido principal scrollable
- Contexto de sidebar (collapsed/expanded)

**Estructura**:
```tsx
<div className="flex h-screen">
  <AdminSidebar />
  <main className="flex-1 overflow-auto">
    <header>{title}</header>
    <div className="p-6">{children}</div>
  </main>
</div>
```

**Uso**:
```tsx
import AdminLayout from '~/components/Layout/AdminLayout';

export default function ProjectsPage() {
  return (
    <AdminLayout title="Gestión de Proyectos">
      <div className="grid grid-cols-3 gap-6">
        {/* Contenido */}
      </div>
    </AdminLayout>
  );
}
```

### MentorLayout

**Archivo**: `app/components/Layout/MentorLayout.tsx`

Similar a `AdminLayout` pero con navegación específica para mentores:
- Dashboard de mentor
- Mis proyectos
- Registro de horas
- Calendario

### StudentLayout

**Archivo**: `app/components/Layout/StudentLayout.tsx`

Layout simplificado para estudiantes:
- Vista de grupos
- Material de apoyo
- Tareas pendientes

### SystemAdminLayout

**Archivo**: `app/components/Layout/SystemAdminLayout.tsx`

Layout para administración del sistema:
- Gestión de usuarios
- Roles y permisos
- Logs del sistema
- Configuración

---

## Componentes de Navegación

### Navbar

**Archivo**: `app/components/Navigation/Navbar.tsx`

**Propósito**: Barra de navegación superior de la aplicación.

**Props**:
```typescript
interface NavbarProps {
  variant?: 'default' | 'minimal';
  showAuth?: boolean;
  showLogo?: boolean;
}
```

**Variantes**:

1. **Default**: Navegación completa con menú
```tsx
<Navbar />
```

2. **Minimal**: Solo logo y usuario
```tsx
<Navbar variant="minimal" />
```

3. **Sin autenticación**: Para landing page
```tsx
<Navbar showAuth={false} />
```

**Características**:
- Logo animado de Nodo
- Menú de navegación principal
- Dropdown de usuario autenticado
- Responsive con menú hamburguesa en mobile

**Estructura**:
```tsx
<nav className="navbar">
  <div className="container mx-auto flex items-center justify-between">
    <Logo />
    <NavigationMenu />
    <UserDropdown />
  </div>
</nav>
```

### Footer

**Archivo**: `app/components/Navigation/Footer.tsx`

**Props**:
```typescript
interface FooterProps {
  variant?: 'default' | 'minimal';
}
```

**Características**:
- Links de navegación
- Información de contacto
- Redes sociales
- Copyright

### Sidebars

Cada módulo tiene su sidebar específico:

#### AdminSidebar

**Archivo**: `app/components/Layout/AdminSidebar.tsx`

**Navegación**:
```typescript
const navigation = [
  { name: 'Dashboard', href: '/modulo/academico/dashboard', icon: HomeIcon },
  { name: 'Mentores', href: '/modulo/academico/admin/mentors', icon: UsersIcon },
  { name: 'Proyectos', href: '/modulo/academico/admin/projects', icon: ProjectIcon },
  { name: 'Grupos', href: '/modulo/academico/admin/groups', icon: GroupIcon },
  { name: 'Horas', href: '/modulo/academico/admin/hours', icon: TimeIcon },
  { name: 'Calendario', href: '/modulo/academico/admin/calendar', icon: CalendarIcon },
  { name: 'Métricas', href: '/modulo/academico/admin/metrics', icon: ChartIcon },
];
```

**Características**:
- Navegación jerárquica
- Indicador de ruta activa
- Iconos personalizados
- Soporte para badges de notificación
- Collapse/Expand animation

#### SystemAdminSidebar

**Archivo**: `app/components/Layout/SystemAdminSidebar.tsx`

**Navegación**:
```typescript
const navigation = [
  { name: 'Dashboard', href: '/modulo/administracion/dashboard', icon: HomeIcon },
  { name: 'Usuarios', href: '/modulo/administracion/users', icon: UsersIcon },
  { name: 'Roles', href: '/modulo/administracion/roles', icon: SecurityIcon },
  { name: 'Logs', href: '/modulo/administracion/logs', icon: DocumentIcon },
  { name: 'Configuración', href: '/modulo/administracion/settings', icon: SettingsIcon },
];
```

**Estados visuales**:
- Active: `bg-blue-50 text-blue-600`
- Hover: `hover:bg-gray-50`
- Default: `text-gray-600`

---

## Componentes de Protección

### ProtectedRoute

**Archivo**: `app/components/ProtectedRoute.tsx`

**Propósito**: HOC para proteger rutas que requieren autenticación y/o roles específicos.

**Props**:
```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}
```

**Lógica de protección**:

```typescript
1. Verificar autenticación
   ├─ No autenticado → Redirigir a /login
   └─ Autenticado → Continuar

2. Verificar permisos de rol
   ├─ Rol permitido → Mostrar contenido
   └─ Rol no permitido → Mostrar 403 Forbidden
```

**Uso básico**:
```tsx
import ProtectedRoute from '~/components/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
      <div>Contenido solo para admins</div>
    </ProtectedRoute>
  );
}
```

**Ejemplos por caso de uso**:

1. **Solo autenticación**:
```tsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

2. **Rol específico**:
```tsx
<ProtectedRoute allowedRoles={['Mentor']}>
  <MentorDashboard />
</ProtectedRoute>
```

3. **Múltiples roles**:
```tsx
<ProtectedRoute allowedRoles={['Admin', 'SuperAdmin', 'Mentor']}>
  <ProjectsList />
</ProtectedRoute>
```

**Estados de carga**:
```tsx
if (loading) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  );
}
```

---

## Iconografía

### Sistema de Iconos

Nodux utiliza iconos SVG personalizados y consistentes.

**Ubicación**: `app/components/Icons/`

### Iconos Disponibles

#### Módulos

- **AcademicIcon**: Módulo académico (🎓)
- **ProductIcon**: Módulo de producto (📦)
- **AdminIcon**: Administración (⚙️)

#### Navegación

- **HomeIcon**: Dashboard
- **UsersIcon**: Usuarios/Mentores
- **ProjectIcon**: Proyectos
- **GroupIcon**: Grupos
- **CalendarIcon**: Calendario
- **ChartIcon**: Métricas

#### Acciones

- **DocumentIcon**: Documentos
- **TimeIcon**: Horas/Tiempo
- **SettingsIcon**: Configuración
- **SecurityIcon**: Seguridad
- **NotificationIcon**: Notificaciones

#### Estado

- **CheckIcon**: Éxito
- **WarningIcon**: Advertencia
- **ErrorIcon**: Error
- **InfoIcon**: Información

### Props de Iconos

```typescript
interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}
```

### Uso de Iconos

```tsx
import AcademicIcon from '~/components/Icons/AcademicIcon';

<AcademicIcon size={24} className="text-blue-600" />
```

### Creación de Nuevos Iconos

Template básico:
```tsx
// app/components/Icons/MyIcon.tsx
interface MyIconProps {
  size?: number;
  className?: string;
}

export default function MyIcon({ size = 24, className = "" }: MyIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={className}
    >
      {/* SVG paths */}
    </svg>
  );
}
```

---

## Error Boundaries

### NotFound

**Archivo**: `app/components/ErrorBoundary/NotFound.tsx`

**Propósito**: Página 404 personalizada.

**Características**:
- Mensaje personalizable
- Navegación de retorno
- Diseño amigable
- Animaciones suaves

**Uso**:
```tsx
import NotFound from '~/components/ErrorBoundary/NotFound';

export function ErrorBoundary() {
  return <NotFound message="Proyecto no encontrado" />;
}
```

**Estructura**:
```tsx
<div className="min-h-screen flex items-center justify-center">
  <div className="text-center">
    <h1 className="text-6xl font-bold text-blue-600">404</h1>
    <p className="text-xl text-gray-600">{message}</p>
    <Link to="/" className="btn-primary mt-6">
      Volver al inicio
    </Link>
  </div>
</div>
```

---

## Guía de Uso

### Convenciones de Nomenclatura

1. **Componentes**: PascalCase
   - ✅ `AdminLayout.tsx`
   - ❌ `adminLayout.tsx`

2. **Archivos de estilos**: kebab-case
   - ✅ `dashboard-card.css`
   - ❌ `DashboardCard.css`

3. **Utilities**: camelCase
   - ✅ `formatDate.ts`
   - ❌ `FormatDate.ts`

### Estructura de Archivos

```
components/
├── Layout/
│   ├── AdminLayout.tsx
│   ├── AdminSidebar.tsx
│   ├── MentorLayout.tsx
│   └── ...
├── Navigation/
│   ├── Navbar.tsx
│   └── Footer.tsx
├── Icons/
│   ├── AcademicIcon.tsx
│   └── ...
├── ErrorBoundary/
│   └── NotFound.tsx
├── dashboard/
│   ├── DashboardCard.tsx
│   └── DashboardLayout.tsx
└── ProtectedRoute.tsx
```

### Composición de Componentes

**Ejemplo**: Dashboard con múltiples componentes

```tsx
import AdminLayout from '~/components/Layout/AdminLayout';
import DashboardCard from '~/components/dashboard/DashboardCard';
import ChartIcon from '~/components/Icons/ChartIcon';

export default function Dashboard() {
  return (
    <AdminLayout title="Dashboard Académico">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Mentores"
          value="45"
          icon={<ChartIcon />}
          trend="+12%"
        />
        {/* Más cards */}
      </div>
    </AdminLayout>
  );
}
```

### Props y TypeScript

**Siempre tipar props**:

```tsx
interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  onClick?: () => void;
}

export default function DashboardCard({
  title,
  value,
  icon,
  trend,
  onClick
}: DashboardCardProps) {
  // Implementación
}
```

### Accesibilidad

1. **Semantic HTML**: Usar etiquetas apropiadas
```tsx
<nav aria-label="Main navigation">
  <ul role="list">
    <li><a href="/dashboard">Dashboard</a></li>
  </ul>
</nav>
```

2. **ARIA attributes**: Para componentes interactivos
```tsx
<button
  aria-label="Cerrar menú"
  aria-expanded={isOpen}
  onClick={toggle}
>
  <MenuIcon />
</button>
```

3. **Keyboard navigation**: Soportar Tab y Enter
```tsx
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => e.key === 'Enter' && onClick()}
  onClick={onClick}
>
  Clickeable
</div>
```

### Responsive Design

**Mobile-first approach**:

```tsx
<div className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-4
">
  {/* Contenido */}
</div>
```

**Breakpoints**:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## Testing de Componentes

### Ejemplo de Test

```tsx
import { render, screen } from '@testing-library/react';
import DashboardCard from '~/components/dashboard/DashboardCard';

test('renders DashboardCard with correct title', () => {
  render(
    <DashboardCard
      title="Total Users"
      value="150"
    />
  );
  
  expect(screen.getByText('Total Users')).toBeInTheDocument();
  expect(screen.getByText('150')).toBeInTheDocument();
});
```

---

## Mejoras Futuras

- [ ] Storybook para documentación visual
- [ ] Tests unitarios completos
- [ ] Componentes con variantes (size, color)
- [ ] Sistema de temas (dark mode)
- [ ] Animaciones con Framer Motion
- [ ] Componentes de formularios avanzados
- [ ] Sistema de notificaciones toast

---

## Enlaces Relacionados

- [📘 React Components](https://react.dev/learn/your-first-component)
- [🎨 Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)
- [♿ WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
