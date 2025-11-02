# 📚 Documentación Completa - Nodux

## Índice General

1. [Introducción](#introducción)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Documentación por Módulo](#documentación-por-módulo)
4. [Guías Rápidas](#guías-rápidas)
5. [Roadmap](#roadmap)

---

## Introducción

**Nodux** es una plataforma integral para la gestión de proyectos académicos, mentoría de estudiantes y seguimiento de actividades educativas. El sistema está compuesto por un **frontend** desarrollado en Remix 2.16.0 y un **backend** en Django REST Framework.

### Visión General

```
┌─────────────────────────────────────────────────────────┐
│                      NODUX PLATFORM                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐         ┌──────────────────┐     │
│  │     Frontend     │   ←→    │     Backend      │     │
│  │   Remix 2.16.0   │  HTTP   │  Django REST     │     │
│  │   TypeScript     │  API    │     Python       │     │
│  └──────────────────┘         └──────────────────┘     │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                     Características                      │
│  • Autenticación JWT                                    │
│  • Gestión de Mentores y Proyectos                      │
│  • Sistema de Roles y Permisos                          │
│  • Registro de Horas                                    │
│  • Calendario Integrado                                 │
│  • Dashboards por Rol                                   │
└─────────────────────────────────────────────────────────┘
```

---

## Arquitectura del Sistema

### Stack Tecnológico

#### Frontend
- **Framework**: Remix 2.16.0 (React + SSR)
- **Lenguaje**: TypeScript 5.1.6
- **Estilos**: TailwindCSS 3.4.4
- **HTTP Client**: Axios 1.11.0
- **Animaciones**: Framer Motion 11.18.2
- **Build Tool**: Vite 6.0.0

#### Backend
- **Framework**: Django REST Framework
- **Lenguaje**: Python 3.x
- **Base de Datos**: PostgreSQL / MySQL
- **Autenticación**: JWT (JSON Web Tokens)
- **Documentación**: (Próximamente)

### Comunicación entre Capas

```
Frontend (Remix)
    ↓
Axios HTTP Client
    ↓
REST API (Django)
    ↓
Database (PostgreSQL)
```

---

## Documentación por Módulo

### 🌐 Frontend

La documentación completa del frontend está organizada en módulos:

#### 📂 Estructura General
- **[README Principal](./frontend/README.md)**: Índice completo del frontend
- **[Guía de Instalación](./frontend/README.md#instalación)**: Setup y configuración inicial
- **[Convenciones de Código](./frontend/README.md#convenciones-de-código)**: Estándares del proyecto

#### 🔄 Contextos y Estado
- **[Documentación de Contextos](./frontend/contexts/README.md)**
  - AuthContext: Gestión de autenticación
  - ModuleContext: Módulos activos
  - SidebarContext: Estado de navegación

#### 🔌 Servicios HTTP
- **[Documentación de Servicios](./frontend/services/README.md)**
  - AuthService: Login, registro, gestión de usuarios
  - AcademicService: Mentores, proyectos, grupos
  - AdminService: Administración del sistema
  - API Client: Configuración de Axios

#### 📋 Tipos TypeScript
- **[Documentación de Tipos](./frontend/types/README.md)**
  - Tipos de autenticación (User, AuthResponse)
  - Tipos académicos (Mentor, Project, Group)
  - Tipos de módulos

#### 🛣️ Sistema de Rutas
- **[Documentación de Rutas](./frontend/routes/README.md)**
  - Rutas públicas (/, /login, /signup)
  - Rutas del módulo académico
  - Rutas del módulo de administración
  - Rutas del módulo de producto
  - Sistema de protección de rutas

#### 🧩 Componentes UI
- **[Documentación de Componentes](./frontend/components/README.md)**
  - Layouts (AdminLayout, MentorLayout, etc.)
  - Navegación (Navbar, Sidebar, Footer)
  - Componentes de protección (ProtectedRoute)
  - Iconografía personalizada
  - Error Boundaries

#### 🔧 Utilidades
- **[Documentación de Utilidades](./frontend/utils/README.md)**
  - API Client y configuración
  - Navigation helpers
  - Test utilities
  - Helpers comunes

---

### 🔙 Backend

**Documentación del backend**: *Próximamente*

La documentación del backend incluirá:

- Arquitectura de Django REST Framework
- Modelos de datos (Mentor, Project, Group, etc.)
- Endpoints de API
- Sistema de autenticación JWT
- Permisos y roles
- Configuración de base de datos
- Guías de deployment

**Espacio reservado para documentación futura**:
```
docs/
└── backend/
    ├── README.md              # Índice general del backend
    ├── models/                # Documentación de modelos
    ├── api/                   # Documentación de endpoints
    ├── authentication/        # Sistema de autenticación
    ├── permissions/           # Roles y permisos
    └── deployment/            # Guías de despliegue
```

---

## Guías Rápidas

### 🚀 Inicio Rápido

#### Frontend

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd Nodux/Frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tu API_BASE_URL

# 4. Iniciar servidor de desarrollo
npm run dev
# Acceder a http://localhost:3000
```

#### Backend

```bash
# Documentación próximamente
```

### 🔑 Credenciales de Desarrollo

**Modo desarrollo** (Frontend):
- Cualquier email/password funciona para login
- Se asigna rol de Admin por defecto
- Tokens mock generados automáticamente

### 📊 Estructura del Proyecto

```
Nodux/
├── Frontend/                  # Aplicación Remix
│   ├── app/
│   │   ├── routes/           # Rutas de la aplicación
│   │   ├── components/       # Componentes reutilizables
│   │   ├── contexts/         # Estado global
│   │   ├── services/         # Servicios HTTP
│   │   ├── types/            # Tipos TypeScript
│   │   └── utils/            # Utilidades
│   ├── public/               # Assets estáticos
│   └── docs/                 # Documentación del frontend
│
├── Backend/                   # API Django (próximamente)
│   └── docs/                  # Documentación del backend
│
└── docs/                      # Documentación general
    ├── readme.md              # Este archivo
    ├── frontend/              # Docs del frontend
    └── backend/               # Docs del backend (próximamente)
```

---

## Roadmap

### ✅ Completado

#### Frontend
- [x] Sistema de autenticación JWT
- [x] Gestión de contextos globales
- [x] Sistema de rutas con Remix
- [x] Módulo de administración de usuarios
- [x] Módulo académico (mentores, proyectos, grupos)
- [x] Dashboards por rol
- [x] Sistema de protección de rutas
- [x] Componentes de UI con TailwindCSS
- [x] Documentación completa del frontend

### 🚧 En Progreso

#### Frontend
- [ ] Calendario integrado (parcial)
- [ ] Métricas y reportes avanzados
- [ ] Sistema de notificaciones
- [ ] Dashboard de módulo Producto

#### Backend
- [ ] Documentación completa
- [ ] Guías de API endpoints
- [ ] Configuración de deployment

### 📋 Planificado

#### Frontend
- [ ] Integración con Microsoft Graph (Bookings)
- [ ] Módulo Loop (Microsoft)
- [ ] Testing E2E
- [ ] Optimizaciones de rendimiento
- [ ] Dark mode

#### Backend
- [ ] WebSockets para notificaciones en tiempo real
- [ ] Sistema de caché
- [ ] API versioning
- [ ] Documentación con Swagger/OpenAPI

#### General
- [ ] CI/CD pipeline
- [ ] Monitoreo y logging
- [ ] Backup automático
- [ ] Escalabilidad horizontal

---

## Versionamiento

### Versión Actual

- **Frontend**: v1.0.0-beta
- **Backend**: *Próximamente*

### Historial de Versiones

#### Frontend v1.0.0-beta (2024-02)
- ✅ Sistema de autenticación completo
- ✅ Módulos académico y administración
- ✅ Dashboards por rol
- ✅ Documentación inicial

---

## Equipo

### Desarrollo
- **Líder Técnico**: Samir Osorio
- **Desarrollador Junior**: Juan Avendaño

### UI/UX
- **Diseñadores**: Heydi, Salomón

---

## Contribución

### Frontend

Ver [Guía de Contribución del Frontend](./frontend/README.md#guías-de-desarrollo)

**Convenciones principales**:
- TypeScript estricto
- Componentes funcionales con hooks
- File-based routing de Remix
- TailwindCSS para estilos
- Atomic Design para componentes

### Backend

*Guías de contribución próximamente*

---

## Enlaces Útiles

### Documentación Interna

#### Frontend
- [📖 Índice General del Frontend](./frontend/README.md)
- [🔄 Contextos](./frontend/contexts/README.md)
- [🔌 Servicios](./frontend/services/README.md)
- [📋 Tipos](./frontend/types/README.md)
- [🛣️ Rutas](./frontend/routes/README.md)
- [🧩 Componentes](./frontend/components/README.md)
- [🔧 Utilidades](./frontend/utils/README.md)

#### Backend
- *Documentación próximamente*

### Documentación Externa

#### Frontend
- [Remix Documentation](https://remix.run/docs)
- [TailwindCSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Framer Motion](https://www.framer.com/motion/)

#### Backend
- [Django](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [JWT](https://jwt.io/introduction)

---

## Soporte y Contacto

### Reportar Issues
- Frontend: Crear issue en el repositorio con tag `frontend`
- Backend: Crear issue en el repositorio con tag `backend`

### Contacto del Equipo
- **Email**: [correo del equipo]
- **Slack**: [canal del proyecto]
- **Reuniones**: [horarios de stand-ups]

---

## Licencia

*Por definir*

---

## Changelog

### 2024-02-20
- ✅ Documentación completa del frontend
- ✅ Organización de docs por módulos
- ✅ README principal actualizado

### 2024-02-15
- ✅ Implementación de módulo académico
- ✅ Sistema de autenticación JWT
- ✅ Dashboards por rol

---

**Última actualización**: 2024-02-20
**Versión de documentación**: 1.0.0