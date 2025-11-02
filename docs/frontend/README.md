# 📘 Documentación Frontend - Nodux

## Índice

1. [Introducción](#introducción)
2. [Arquitectura General](#arquitectura-general)
3. [Configuración del Proyecto](#configuración-del-proyecto)
4. [Estructura de Carpetas](#estructura-de-carpetas)
5. [Sistema de Enrutamiento](#sistema-de-enrutamiento)
6. [Autenticación y Autorización](#autenticación-y-autorización)
7. [Flujo de Datos](#flujo-de-datos)
8. [Guías de Desarrollo](#guías-de-desarrollo)
9. [Documentación Detallada](#documentación-detallada)

---

## Introducción

Nodux Frontend es una aplicación web construida con **Remix 2.16.0**, diseñada para gestionar mentores, proyectos, grupos y registro de horas en un ecosistema académico. La aplicación implementa un sistema de autenticación basado en roles con módulos dinámicos.

### Tecnologías Principales

- **Framework**: Remix 2.16.0 (React con SSR)
- **Lenguaje**: TypeScript 5.1.6
- **Estilos**: TailwindCSS 3.4.4
- **HTTP Client**: Axios 1.11.0
- **Animaciones**: Framer Motion 11.18.2
- **Build Tool**: Vite 6.0.0
- **Node**: >= 20.0.0

---

## Arquitectura General

### Patrón de Arquitectura

La aplicación sigue una arquitectura **modular basada en features** con los siguientes principios:

1. **Server-Side Rendering (SSR)**: Remix renderiza las páginas en el servidor para mejorar SEO y performance inicial
2. **File-based Routing**: Las rutas se definen automáticamente basadas en la estructura de archivos
3. **Progressive Enhancement**: La aplicación funciona sin JavaScript y se mejora progresivamente
4. **Atomic Design**: Los componentes se organizan en átomos, moléculas y organismos

### Capas de la Aplicación

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (Routes, Components, UI)         │
├─────────────────────────────────────┤
│         Business Logic Layer        │
│    (Contexts, Hooks, Utils)         │
├─────────────────────────────────────┤
│         Data Access Layer           │
│    (API Services, Axios)            │
├─────────────────────────────────────┤
│         Backend API                 │
│    (Django REST Framework)          │
└─────────────────────────────────────┘
```

---

## Configuración del Proyecto

### Variables de Entorno

El proyecto utiliza un archivo `.env` para configuración:

```properties
API_BASE_URL=http://localhost:8000/api
```

Esta variable se inyecta en tiempo de build mediante Vite.

### Vite Configuration

**Archivo**: `vite.config.ts`

```typescript
- Plugins configurados: Remix, TSConfig Paths
- Servidor de desarrollo: Puerto 3000
- Inyección de variables de entorno
- Soporte para ESM (ECMAScript Modules)
```

**Características clave**:
- **Future flags** activados para v3 (fetcherPersist, relativeSplatPath, throwAbortReason)
- **Server Module Format**: ESM
- **App Directory**: `app/`

### TypeScript Configuration

**Archivo**: `tsconfig.json`

```typescript
- Strict mode activado
- Module resolution: Bundler
- Path aliases: ~/* apunta a ./app/*
- Target: ES2022
- JSX: react-jsx
```

### TailwindCSS Configuration

**Archivo**: `tailwind.config.ts`

Define la paleta de colores y tipografías de Nodo:

**Colores**:
- `nodo-primary`: #006FFF (azul principal)
- `nodo-primary-light`: #E6F2FF
- `nodo-primary-dark`: #0056CC
- `nodo-secondary`: #F8FAFC (gris claro)
- `nodo-accent`: #1E293B (gris oscuro)
- Estados: success, warning, error

**Tipografías**:
- `font-thicker`: Tipografía principal de branding
- `font-inter`: Tipografía de soporte para contenido
- `font-arial`: Tipografía de sistema

---

## Estructura de Carpetas

```
Frontend/
│
├── app/                          # Código fuente principal
│   ├── routes/                   # Rutas de la aplicación (auto-routing)
│   ├── components/               # Componentes reutilizables
│   ├── contexts/                 # Context API (AuthContext, etc.)
│   ├── services/                 # Servicios HTTP
│   ├── types/                    # Definiciones TypeScript
│   ├── utils/                    # Utilidades y helpers
│   ├── styles/                   # Estilos globales
│   ├── root.tsx                  # Layout raíz de la aplicación
│   └── entry.client.tsx          # Punto de entrada del cliente
│
├── public/                       # Assets estáticos
├── docs/                         # Documentación
│   └── frontend/                 # Documentación del frontend
│       ├── README.md             # Este archivo
│       ├── contexts/             # Documentación de contextos
│       ├── services/             # Documentación de servicios
│       ├── types/                # Documentación de tipos
│       ├── routes/               # Documentación de rutas
│       ├── components/           # Documentación de componentes
│       └── utils/                # Documentación de utilidades
│
├── vite.config.ts                # Configuración de Vite
├── tailwind.config.ts            # Configuración de Tailwind
├── tsconfig.json                 # Configuración de TypeScript
├── package.json                  # Dependencias y scripts
└── Dockerfile                    # Configuración de Docker
```

---

## Sistema de Enrutamiento

Remix utiliza **file-based routing** donde cada archivo en `app/routes/` se convierte automáticamente en una ruta.

### Convenciones de Rutas

```
app/routes/
├── _index.tsx                    # / (raíz)
├── login.tsx                     # /login
├── signup.tsx                    # /signup
├── dashboard.tsx                 # /dashboard
├── module-selector.tsx           # /module-selector
├── admin/                        # Rutas del módulo admin
│   ├── _layout.tsx               # Layout compartido /admin/*
│   ├── users.tsx                 # /admin/users
│   ├── mentors.tsx               # /admin/mentors
│   └── projects.tsx              # /admin/projects
└── $.tsx                         # Catch-all para 404
```

### Tipos de Rutas

1. **Rutas públicas**: Login, Signup, Healthcheck
2. **Rutas protegidas**: Requieren autenticación (Dashboard, Module Selector)
3. **Rutas con permisos**: Requieren roles específicos (Admin, Mentor, Student)

**📚 Documentación completa**: [Sistema de Rutas](./routes/README.md)

---

## Autenticación y Autorización

### Sistema de Tokens

La aplicación utiliza **JWT (JSON Web Tokens)** con dos tipos de tokens:

1. **Access Token**: 
   - Vida corta (15 minutos)
   - Se almacena en memoria (variable de estado)
   - Se envía en header `Authorization: Bearer <token>`

2. **Refresh Token**:
   - Vida larga (7 días)
   - Se almacena en cookie HttpOnly
   - Se usa para obtener nuevos access tokens

### Flujo de Autenticación

```
1. Usuario ingresa credenciales
   ↓
2. POST /api/auth/login
   ↓
3. Backend retorna access + refresh tokens
   ↓
4. Access token → Memoria (AuthContext)
   Refresh token → Cookie HttpOnly
   ↓
5. Requests incluyen access token en headers
   ↓
6. Si access token expira:
   - Interceptor detecta 401
   - Llama a /api/auth/refresh con cookie
   - Obtiene nuevo access token
   - Reintenta request original
```

### Roles y Permisos

**Roles disponibles**:
- `SUPER_ADMIN`: Acceso total al sistema
- `ADMIN`: Gestión de módulos y usuarios
- `MENTOR`: Acceso a proyectos y registro de horas
- `STUDENT`: Acceso limitado a información de grupos

**Módulos por rol**:
- Admin/SuperAdmin: `academic_admin`, `products`
- Mentor: `mentor_dashboard`
- Student: `student_dashboard`

**📚 Documentación completa**: [Contextos - AuthContext](./contexts/README.md#authcontext)

---

## Flujo de Datos

### Estado Global (Context API)

La aplicación usa React Context para manejar estado global:

```typescript
AuthContext {
  user: User | null
  login(credentials): Promise<void>
  logout(): void
  refreshToken(): Promise<string>
  isAuthenticated: boolean
  selectedModule: Module | null
  selectModule(module): void
}
```

**📚 Documentación completa**: [Gestión de Estado - Contextos](./contexts/README.md)

### Comunicación con API

**Cliente HTTP**: Axios con interceptores

```typescript
// Interceptor de Request
- Agrega access token a headers
- Configura base URL

// Interceptor de Response
- Detecta errores 401 (token expirado)
- Llama a refresh token automáticamente
- Reintenta request fallido
- Maneja errores 403 (refresh expirado)
```

**📚 Documentación completa**: [Servicios HTTP](./services/README.md)

---

## Guías de Desarrollo

### Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd Frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles

```bash
npm run dev         # Servidor de desarrollo (puerto 3000)
npm run build       # Build de producción
npm run start       # Servidor de producción
npm run lint        # Ejecutar linter
npm run typecheck   # Verificar tipos TypeScript
```

### Docker

```bash
# Build de imagen
docker build -t nodux-frontend .

# Ejecutar contenedor
docker run -p 3000:3000 nodux-frontend
```

### Convenciones de Código

1. **Nombres de archivos**: kebab-case (ej: `user-list.tsx`)
2. **Componentes**: PascalCase (ej: `UserList`)
3. **Funciones**: camelCase (ej: `getUserById`)
4. **Constantes**: UPPER_SNAKE_CASE (ej: `API_BASE_URL`)
5. **Tipos/Interfaces**: PascalCase con prefijo I (ej: `IUser`)

### Creación de Nuevas Rutas

```typescript
// 1. Crear archivo en app/routes/
// app/routes/admin/nueva-funcionalidad.tsx

import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

// 2. Definir loader (server-side)
export async function loader({ request }: LoaderFunctionArgs) {
  // Lógica server-side
  return json({ data: 'example' });
}

// 3. Definir action (para formularios)
export async function action({ request }: ActionFunctionArgs) {
  // Manejar POST, PUT, DELETE
  return json({ success: true });
}

// 4. Exportar componente
export default function NuevaFuncionalidad() {
  const data = useLoaderData<typeof loader>();
  return <div>{/* UI */}</div>;
}
```

---

## Documentación Detallada

### 📂 Por Módulo

- **[🔄 Contextos](./contexts/README.md)**: AuthContext, ModuleContext, gestión de estado global
- **[🔌 Servicios](./services/README.md)**: AuthService, MentorService, ProjectService, AdminService
- **[📋 Tipos TypeScript](./types/README.md)**: Definiciones de User, Mentor, Project, Module
- **[🛣️ Rutas](./routes/README.md)**: Sistema completo de rutas de Remix
- **[🧩 Componentes](./components/README.md)**: Layouts, Navigation, Iconos, Error Boundaries
- **[🔧 Utilidades](./utils/README.md)**: API Client, Navigation Helpers, Test Utils

### 📊 Por Funcionalidad

#### Autenticación
- [AuthContext](./contexts/README.md#authcontext): Estado global de autenticación
- [AuthService](./services/README.md#authservice): Servicios de login/logout/registro
- [Login Route](./routes/README.md#login-logintsx): Página de inicio de sesión
- [ProtectedRoute Component](./components/README.md#protectedroute): HOC de protección

#### Módulo Académico
- [Academic Routes](./routes/README.md#rutas-del-módulo-académico): Todas las rutas académicas
- [AcademicService](./services/README.md#academicservice): MentorService, ProjectService, GroupService
- [AdminLayout](./components/README.md#adminlayout): Layout del módulo académico
- [Types](./types/README.md#tipos-académicos): Mentor, Project, Group, Schedule

#### Módulo de Administración
- [Admin Routes](./routes/README.md#rutas-del-módulo-de-administración): Rutas de administración
- [AdminService](./services/README.md#adminservice): Gestión de usuarios, roles, logs
- [SystemAdminLayout](./components/README.md#systemadminlayout): Layout de administración

#### Sistema de Rutas
- [Routing System](./routes/README.md#sistema-de-rutas): File-based routing de Remix
- [Navigation Utils](./utils/README.md#navigation-utils): Helpers de navegación
- [Route Protection](./components/README.md#protectedroute): Sistema de protección

---

## Estado del Proyecto

**Versión actual**: Beta 1.0

Ver [todo.md](../../Frontend/todo.md) para el roadmap completo.

### Fases Completadas

- ✅ Fase 1: Autenticación y Gestión de Usuarios
- ✅ Fase 2: Navegación y Control de Acceso
- ✅ Fase 3: Selector de Módulos
- ✅ Fase 4: Dashboards por Rol
- ✅ Fase 5: Gestión de Entidades (Módulo Académico)
- ✅ Fase 6: Componentes de UI (parcial)

### Próximos Pasos

- ⏳ Calendario integrado
- ⏳ Sistema de notificaciones
- ⏳ Dashboard de módulo Producto
- ⏳ Métricas y reportes avanzados

---

## Mapa de Navegación de la Documentación

```
docs/frontend/
├── README.md (este archivo)          # Índice general
│
├── contexts/
│   └── README.md                     # AuthContext, ModuleContext
│
├── services/
│   └── README.md                     # Todos los servicios HTTP
│
├── types/
│   └── README.md                     # Tipos TypeScript
│
├── routes/
│   └── README.md                     # Sistema de rutas completo
│
├── components/
│   └── README.md                     # Componentes UI
│
└── utils/
    └── README.md                     # Utilidades y helpers
```

---

## Enlaces Útiles

### Documentación Interna
- [📁 Estructura de Routes](./routes/README.md)
- [🧩 Componentes](./components/README.md)
- [🔧 Utilidades](./utils/README.md)
- [🔄 Contextos](./contexts/README.md)
- [🔌 Servicios](./services/README.md)
- [📋 Tipos](./types/README.md)

### Documentación Externa
- [📖 Remix Documentation](https://remix.run/docs)
- [🎨 TailwindCSS Docs](https://tailwindcss.com/docs)
- [📘 TypeScript Handbook](https://www.typescriptlang.org/docs)
- [🔐 JWT.io](https://jwt.io)

---

## Soporte

Para dudas o problemas técnicos, contactar al equipo de desarrollo:

- **Líder Técnico**: Samir Osorio
- **Frontend Devs**: Heydi, Sofía, Alejandro
- **UI/UX**: Heydi, Salomón

---

## Contribución

Ver [Guías de Desarrollo](#guías-de-desarrollo) para convenciones de código y flujo de trabajo.