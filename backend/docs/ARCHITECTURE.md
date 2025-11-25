# Arquitectura del Sistema

## 🏗️ Visión General

Nodux Backend sigue una arquitectura en capas basada en Django REST Framework, implementando principios de Clean Architecture y separación de responsabilidades.

## 📐 Estructura en Capas

```
┌─────────────────────────────────────┐
│      Presentation Layer             │
│   (Views, Serializers, URLs)        │
├─────────────────────────────────────┤
│      Business Logic Layer           │
│   (ViewSets, Custom Methods)        │
├─────────────────────────────────────┤
│      Service Layer                  │
│   (CredentialService, FileService)  │
├─────────────────────────────────────┤
│      Data Access Layer              │
│   (Models, Django ORM)              │
├─────────────────────────────────────┤
│      Infrastructure Layer           │
│   (Database, File Storage)          │
└─────────────────────────────────────┘
```

## 🗂️ Aplicaciones Django

### 1. **apps.api**
- **Propósito**: Punto de entrada principal de la API
- **Responsabilidades**:
  - Configuración de routers principales
  - Definición de rutas anidadas
  - Agregación de endpoints de todas las apps
  - Configuración de URL patterns

**Estructura de Rutas:**
```python
router (DefaultRouter)
├── /mentors/           → MentorViewSet
├── /attendance/        → MentorAttendanceViewSet
├── /projects/          → ProjectViewSet
├── /schedule/          → ScheduleViewSet
└── /events/            → EventListViewSet (read-only)

projectsRouter (NestedRouter)
└── /projects/{id}/groups/  → GroupViewSet

groupsRouter (NestedRouter)
└── /projects/{id}/groups/{id}/events/  → EventViewSet
```

### 2. **apps.core**
- **Propósito**: Funcionalidades compartidas y servicios comunes
- **Responsabilidades**:
  - Modelos base (Schedule)
  - Servicios reutilizables
  - Utilidades globales

**Servicios:**

#### `CredentialService`
```python
# Genera credenciales seguras para usuarios
- generateUsername(first_name, last_name) → str
- generatePassword(length=12) → str
```

#### `FileService`
```python
# Gestiona nombres de archivos únicos
- random_filename(filename, folder) → str
```

### 3. **apps.users**
- **Propósito**: Gestión de usuarios y autenticación
- **Responsabilidades**:
  - Registro de usuarios
  - Autenticación JWT
  - Gestión de perfiles
  - Cambio de contraseñas

**Endpoints:**
```
POST   /api/users/register/
POST   /api/users/login/
POST   /api/users/refresh/
POST   /api/users/change-password/
```

### 4. **apps.mentors**
- **Propósito**: Gestión de mentores y asistencia
- **Responsabilidades**:
  - CRUD de mentores
  - Upload de certificados
  - Registro de horas de asistencia
  - Gestión de disponibilidad

**Relaciones:**
```
User (Django) 
  ↓ OneToOne
Profile (apps.users)
  ↓ OneToOne
Mentor
  ↓ ManyToOne
MentorAttendance
MentorAvailability
```

### 5. **apps.projects**
- **Propósito**: Gestión de proyectos, grupos y eventos
- **Responsabilidades**:
  - CRUD de proyectos
  - Gestión de grupos por proyecto
  - Gestión de eventos por grupo
  - Endpoint global de eventos

**Relaciones:**
```
Project
  ↓ OneToMany
Group
  ↓ ManyToOne (Mentor, Schedule)
  ↓ OneToMany
Event
```

## 🔄 Flujo de Datos

### Ejemplo: Creación de Mentor

```
1. Request
   POST /api/mentors/
   {
     "profile": {
       "user": {...},
       "phone": "..."
     },
     "charge": "...",
     "knowledge_level": "...",
     "certificate": <file>
   }
   
2. MentorViewSet.create()
   ↓
3. MentorSerializer.create()
   ↓
4. CredentialService.generateUsername()
   CredentialService.generatePassword()
   ↓
5. User.objects.create_user()
   ↓
6. Profile.objects.create()
   ↓
7. Mentor.objects.create()
   ↓
8. Response
   {
     "id": 1,
     "first_name": "...",
     ...
   }
```

## 🔐 Autenticación y Permisos

### JWT Flow
```
1. Usuario se registra → User + Profile creados
2. Usuario hace login → Obtiene access + refresh tokens
3. Usuario hace requests → Incluye Bearer token en headers
4. Token expira → Usa refresh token para obtener nuevo access token
5. Refresh token expira → Debe hacer login nuevamente
```

### Configuración de Permisos

```python
# En producción (DEBUG=False)
DEFAULT_PERMISSION_CLASSES = [
    'rest_framework.permissions.IsAuthenticated'
]

# En desarrollo (DEBUG=True)
DEFAULT_PERMISSION_CLASSES = [
    'rest_framework.permissions.AllowAny'
]
```

## 📦 Gestión de Archivos

### Estructura de Almacenamiento
```
media/
├── user_photos/
│   └── <uuid>.jpg
└── mentors_certificates/
    └── <uuid>.pdf
```

### Upload Flow
```
1. Cliente sube archivo con multipart/form-data
2. FileService.random_filename() genera nombre único
3. Django guarda en MEDIA_ROOT/<folder>/<uuid>.<ext>
4. URL se genera dinámicamente en serializer
5. Cliente recibe URL absoluta
```

## 🎯 Patrones de Diseño

### 1. **Repository Pattern** (implícito)
- Django ORM actúa como repository
- QuerySets encapsulan lógica de consultas

### 2. **Service Layer Pattern**
- `CredentialService` y `FileService`
- Lógica de negocio reutilizable
- Separación de responsabilidades

### 3. **Serializer Pattern**
- Transformación bidireccional de datos
- Validación en capa de presentación
- Representación personalizada con `to_representation()`

### 4. **ViewSet Pattern** (DRF)
- Encapsula acciones CRUD estándar
- Custom actions con `@action` decorator
- Nested routers para relaciones

## 🔧 Configuración de Seguridad

### Rate Limiting
```python
THROTTLE_RATES = {
    'anon': '100/day',    # Usuarios anónimos
    'user': '1000/day'    # Usuarios autenticados
}
```

### CORS
- Configurado para permitir orígenes específicos
- Credentials permitidos
- Headers personalizados permitidos

### Django-Axes
- Protección contra fuerza bruta
- 5 intentos fallidos → lockout 30 minutos
- Reset automático en login exitoso

## 📊 Base de Datos

### Configuración
- PostgreSQL (producción)
- SQLite (desarrollo opcional)
- Migraciones versionadas

### Índices y Optimizaciones
```python
class Meta:
    ordering = ['id']  # Orden consistente
    indexes = []       # Añadir según necesidad
```

## 🧪 Testing

### Estructura Recomendada
```
apps/<app>/tests/
├── __init__.py
├── test_models.py
├── test_serializers.py
├── test_views.py
└── test_services.py
```

## 📈 Escalabilidad

### Consideraciones Futuras
1. **Caché**: Redis para sesiones y queries frecuentes
2. **CDN**: Para archivos media estáticos
3. **Task Queue**: Celery para tareas asíncronas
4. **API Gateway**: Para microservicios
5. **Load Balancer**: Para múltiples instancias

## 🔍 Monitoreo

### Healthcheck Endpoint
```
GET /api/healthcheck/

Retorna:
- Status general del servicio
- Latencia de base de datos
- Estado de JWT
- Métricas de seguridad
- Tiempo de respuesta
```
