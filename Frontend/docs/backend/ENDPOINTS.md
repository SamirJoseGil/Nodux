# Documentación de Endpoints API

## 📍 Base URL

Todos los endpoints están prefijados con:
```
http://localhost:8000/api/
```

## 📑 Índice de Endpoints

- [Autenticación y Usuarios](#autenticación-y-usuarios)
- [Mentores](#mentores)
- [Asistencia de Mentores](#asistencia-de-mentores)
- [Proyectos](#proyectos)
- [Grupos](#grupos)
- [Eventos](#eventos)
- [Horarios](#horarios)
- [Healthcheck](#healthcheck)

---

## 🔐 Autenticación y Usuarios

### Registro de Usuario

**Endpoint:** `POST /api/users/register/`

**Autenticación:** No requerida

**Request Body:**
```json
{
    "user": {
        "first_name": "Juan",
        "last_name": "Pérez",
        "email": "juan.perez@example.com",
        "username": "juan123",
        "password": "securePassword123"
    },
    "phone": "3001234567",
    "photo": null,
    "role": "Estudiante"
}
```

**Roles Disponibles:**
- `SuperAdmin`: Super Administrador (acceso total)
- `Admin`: Administrador
- `Mentor`: Mentor
- `Estudiante`: Estudiante
- `Trabajador`: Trabajador
- `Usuario base`: Usuario Base (default)

**Response:** `201 Created`
```json
{
    "id": 1,
    "user": {
        "id": 5,
        "username": "juan123",
        "first_name": "Juan",
        "last_name": "Pérez",
        "email": "juan.perez@example.com"
    },
    "phone": "3001234567",
    "photo": null,
    "role": "Estudiante"
}
```

**Errores:**
- `400 Bad Request`: Validación fallida (email duplicado, username en uso)

---

### Login

**Endpoint:** `POST /api/users/login/`

**Autenticación:** No requerida

**Request Body:**
```json
{
    "username": "juan123",
    "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Notas:**
- Después del login, usar `GET /api/users/me/` para obtener el rol del usuario

---

### Refresh Token

**Endpoint:** `POST /api/users/refresh/`

**Autenticación:** No requerida

**Request Body:**
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response:** `200 OK`
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

### Cambiar Contraseña

**Endpoint:** `POST /api/users/change-password/`

**Autenticación:** Bearer Token requerido

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
    "old_password": "oldPassword123",
    "new_password": "newSecurePassword456"
}
```

**Response:** `200 OK`
```json
{
    "message": "Password changed succesfully"
}
```

**Errores:**
- `400 Bad Request`: Contraseña actual incorrecta
- `401 Unauthorized`: Token inválido o expirado

---

### Obtener Usuario Actual

**Endpoint:** `GET /api/users/me/`

**Autenticación:** Bearer Token requerido

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:** Ninguno

**Response:** `200 OK`
```json
{
    "id": 1,
    "user": {
        "id": 5,
        "username": "juan123",
        "first_name": "Juan",
        "last_name": "Pérez",
        "email": "juan.perez@example.com"
    },
    "phone": "3001234567",
    "photo": "http://localhost:8000/media/user_photos/abc-123.jpg",
    "role": "Estudiante"
}
```

**Errores:**
- `401 Unauthorized`: Token inválido o ausente
- `404 Not Found`: Perfil no encontrado para el usuario

**Notas:**
- Este endpoint retorna la información del usuario autenticado **incluyendo su rol**
- El rol determina los módulos y permisos disponibles en el frontend
- La URL de la foto es absoluta y lista para usar
- Si no hay foto, el campo `photo` será `null`

---

## 👥 Gestión de Usuarios (Admin/SuperAdmin)

### Listar Todos los Usuarios

**Endpoint:** `GET /api/users/manage/`

**Autenticación:** Bearer Token requerido

**Permisos:** Admin, SuperAdmin

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
    "count": 10,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "user": {
                "id": 5,
                "username": "juan123",
                "first_name": "Juan",
                "last_name": "Pérez",
                "email": "juan.perez@example.com"
            },
            "phone": "3001234567",
            "photo": "http://localhost:8000/media/user_photos/abc-123.jpg",
            "role": "Estudiante"
        }
    ]
}
```

**Notas:**
- Admin puede ver todos los usuarios excepto SuperAdmin
- SuperAdmin puede ver todos los usuarios

---

### Obtener Detalles de Usuario

**Endpoint:** `GET /api/users/manage/{id}/`

**Autenticación:** Bearer Token requerido

**Permisos:** Admin, SuperAdmin

**Response:** `200 OK`

---

### Cambiar Rol de Usuario

**Endpoint:** `PATCH /api/users/manage/{id}/`

**Autenticación:** Bearer Token requerido

**Permisos:** Admin, SuperAdmin

**Request Body:**
```json
{
    "role": "Mentor"
}
```

**Response:** `200 OK`
```json
{
    "id": 1,
    "user": {
        "id": 5,
        "username": "juan123",
        "first_name": "Juan",
        "last_name": "Pérez",
        "email": "juan.perez@example.com"
    },
    "phone": "3001234567",
    "photo": "http://localhost:8000/media/user_photos/abc-123.jpg",
    "role": "Mentor"
}
```

**Restricciones:**
- Solo SuperAdmin puede asignar rol SuperAdmin
- Admin no puede cambiar su propio rol
- Admin no puede cambiar roles a SuperAdmin

**Errores:**
- `403 Forbidden`: Sin permisos para cambiar este rol

---

### Eliminar Usuario

**Endpoint:** `DELETE /api/users/manage/{id}/`

**Autenticación:** Bearer Token requerido

**Permisos:** Admin, SuperAdmin

**Response:** `200 OK`
```json
{
    "deleted": true,
    "username": "juan123"
}
```

**Restricciones:**
- No puedes eliminarte a ti mismo
- Solo SuperAdmin puede eliminar a otros SuperAdmins

**Errores:**
- `403 Forbidden`: Sin permisos para eliminar este usuario

---

## 👨‍🏫 Mentores

### Listar Mentores

**Endpoint:** `GET /api/mentors/`

**Autenticación:** Bearer Token (según configuración)

**Query Parameters:**
- `page`: Número de página (default: 1)
- `page_size`: Elementos por página (default: 20)

**Response:** `200 OK`
```json
{
    "count": 50,
    "next": "http://localhost:8000/api/mentors/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "first_name": "Ana",
            "last_name": "García",
            "email": "ana.garcia@example.com",
            "username": "ana.garcia123",
            "phone": "3001234567",
            "photo": "http://localhost:8000/media/user_photos/abc-123.jpg",
            "charge": "Senior Developer",
            "knowledge_level": "avanzado",
            "certificate": "http://localhost:8000/media/mentors_certificates/xyz-456.pdf"
        }
    ]
}
```

---

### Obtener Mentor

**Endpoint:** `GET /api/mentors/{id}/`

**Response:** `200 OK`
```json
{
    "id": 1,
    "first_name": "Ana",
    "last_name": "García",
    "email": "ana.garcia@example.com",
    "username": "ana.garcia123",
    "phone": "3001234567",
    "photo": "http://localhost:8000/media/user_photos/abc-123.jpg",
    "charge": "Senior Developer",
    "knowledge_level": "avanzado",
    "certificate": "http://localhost:8000/media/mentors_certificates/xyz-456.pdf"
}
```

---

### Crear Mentor

**Endpoint:** `POST /api/mentors/`

**Content-Type:** `multipart/form-data`

**Request Body:**
```
profile.user.first_name: "Ana"
profile.user.last_name: "García"
profile.user.email: "ana.garcia@example.com"
profile.phone: "3001234567"
profile.photo: <file>
charge: "Senior Developer"
knowledge_level: "avanzado"
certificate: <file>
```

**Response:** `201 Created`
```json
{
    "id": 1,
    "first_name": "Ana",
    "last_name": "García",
    "email": "ana.garcia@example.com",
    "username": "ana.garcia123",
    "phone": "3001234567",
    "photo": "http://localhost:8000/media/user_photos/abc-123.jpg",
    "charge": "Senior Developer",
    "knowledge_level": "avanzado",
    "certificate": "http://localhost:8000/media/mentors_certificates/xyz-456.pdf"
}
```

**Notas:**
- Username y password se generan automáticamente
- `knowledge_level` opciones: "basico", "intermedio", "avanzado"

---

### Actualizar Mentor

**Endpoint:** `PUT /api/mentors/{id}/` o `PATCH /api/mentors/{id}/`

**Content-Type:** `multipart/form-data`

**Request Body (parcial):**
```
charge: "Tech Lead"
knowledge_level: "avanzado"
```

**Response:** `200 OK`

---

### Eliminar Mentor

**Endpoint:** `DELETE /api/mentors/{id}/`

**Response:** `200 OK`
```json
{
    "deleted": true,
    "id": 1
}
```

**Notas:**
- Elimina el mentor, perfil, usuario y archivos asociados
- Operación irreversible

---

## ⏰ Asistencia de Mentores

### Registrar Horas

**Endpoint:** `POST /api/mentors/{id}/hours/`

**Request Body:**
```json
{
    "hours": 8
}
```

**Response:** `201 Created`
```json
{
    "mentor": 1,
    "registered_by": 5,
    "hours": 8
}
```

**Validaciones:**
- `hours` debe ser un entero positivo
- Solo se puede registrar una vez por día para el mismo mentor

---

### Listar Asistencias

**Endpoint:** `GET /api/mentors/{id}/hours/`

**Response:** `200 OK`
```json
[
    {
        "mentor": 1,
        "registered_by": 5,
        "hours": 8
    }
]
```

---

## 📊 Proyectos

### Listar Proyectos

**Endpoint:** `GET /api/projects/`

**Response:** `200 OK`
```json
{
    "count": 10,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "name": "Proyecto Alpha",
            "is_active": true
        }
    ]
}
```

---

### Obtener Proyecto

**Endpoint:** `GET /api/projects/{id}/`

**Response:** `200 OK`
```json
{
    "id": 1,
    "name": "Proyecto Alpha",
    "is_active": true
}
```

---

### Crear Proyecto

**Endpoint:** `POST /api/projects/`

**Request Body:**
```json
{
    "name": "Proyecto Beta",
    "is_active": true
}
```

**Response:** `201 Created`

---

### Actualizar Proyecto

**Endpoint:** `PUT /api/projects/{id}/` o `PATCH /api/projects/{id}/`

---

### Eliminar Proyecto

**Endpoint:** `DELETE /api/projects/{id}/`

**Response:** `204 No Content`

---

## 👥 Grupos

### Listar Grupos de un Proyecto

**Endpoint:** `GET /api/projects/{project_id}/groups/`

**Response:** `200 OK`
```json
{
    "count": 5,
    "results": [
        {
            "id": 1,
            "project": 1,
            "mentor": 2,
            "schedule": 3,
            "location": "Sala A",
            "mode": "presencial",
            "start_date": "2024-01-15",
            "end_date": "2024-06-15"
        }
    ]
}
```

---

### Crear Grupo

**Endpoint:** `POST /api/projects/{project_id}/groups/`

**Request Body:**
```json
{
    "mentor": 2,
    "schedule": 3,
    "location": "Sala A",
    "mode": "presencial",
    "start_date": "2024-01-15",
    "end_date": "2024-06-15"
}
```

**Opciones de `mode`:**
- "presencial"
- "virtual"
- "hibrido"

**Response:** `201 Created`

---

### Obtener Grupo

**Endpoint:** `GET /api/projects/{project_id}/groups/{id}/`

---

### Actualizar Grupo

**Endpoint:** `PUT /api/projects/{project_id}/groups/{id}/`

---

### Eliminar Grupo

**Endpoint:** `DELETE /api/projects/{project_id}/groups/{id}/`

---

## 📅 Eventos

### Listar Eventos de un Grupo

**Endpoint:** `GET /api/projects/{project_id}/groups/{group_id}/events/`

**Response:** `200 OK`
```json
{
    "count": 20,
    "results": [
        {
            "id": 1,
            "group": 1,
            "location": "Auditorio Principal",
            "date": "2024-02-15",
            "start_date": "2024-02-15",
            "end_date": "2024-02-15"
        }
    ]
}
```

---

### Crear Evento

**Endpoint:** `POST /api/projects/{project_id}/groups/{group_id}/events/`

**Request Body:**
```json
{
    "location": "Auditorio Principal",
    "date": "2024-02-15",
    "start_date": "2024-02-15",
    "end_date": "2024-02-15"
}
```

**Response:** `201 Created`

---

### Listar Todos los Eventos (Global)

**Endpoint:** `GET /api/events/`

**Descripción:** Endpoint de solo lectura para obtener todos los eventos del sistema

**Response:** `200 OK`
```json
{
    "count": 100,
    "results": [
        {
            "id": 1,
            "group": 1,
            "location": "Auditorio Principal",
            "date": "2024-02-15",
            "start_date": "2024-02-15",
            "end_date": "2024-02-15"
        }
    ]
}
```

---

### Obtener Evento

**Endpoint:** `GET /api/events/{id}/`

**Response:** `200 OK`

---

## ⏰ Horarios

### Listar Horarios

**Endpoint:** `GET /api/schedule/`

**Response:** `200 OK`
```json
{
    "count": 7,
    "results": [
        {
            "id": 1,
            "day": 0,
            "start_time": "09:00:00",
            "end_time": "17:00:00"
        }
    ]
}
```

**Días de la semana:**
- 0: Lunes
- 1: Martes
- 2: Miércoles
- 3: Jueves
- 4: Viernes
- 5: Sábado
- 6: Domingo

---

### Crear Horario

**Endpoint:** `POST /api/schedule/`

**Request Body:**
```json
{
    "day": 0,
    "start_time": "09:00:00",
    "end_time": "17:00:00"
}
```

**Response:** `201 Created`

---

## 🏥 Healthcheck

**Endpoint:** `GET /api/healthcheck/`

**Autenticación:** No requerida

**Response:** `200 OK`
```json
{
    "status": "healthy",
    "service": "nodux-backend",
    "version": "1.0.0",
    "timestamp": 1704067200.0,
    "metrics": {
        "response_time_ms": 15.23,
        "database": {
            "status": "healthy",
            "latency_ms": 5.67,
            "engine": "django.db.backends.postgresql"
        },
        "authentication": {
            "status": "healthy",
            "method": "JWT"
        },
        "security": {
            "cors_enabled": true,
            "rate_limiting": true,
            "axes_enabled": true,
            "debug_mode": false
        }
    }
}
```

---

## 📝 Códigos de Estado HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Operación exitosa |
| 201 | Created | Recurso creado exitosamente |
| 204 | No Content | Eliminación exitosa |
| 400 | Bad Request | Validación fallida |
| 401 | Unauthorized | Token inválido o ausente |
| 403 | Forbidden | Sin permisos |
| 404 | Not Found | Recurso no encontrado |
| 429 | Too Many Requests | Rate limit excedido |
| 500 | Internal Server Error | Error del servidor |

---

## 🔒 Autenticación en Requests

Para endpoints protegidos, incluir el token en el header:

```http
Authorization: Bearer <access_token>
```

Ejemplo con curl:
```bash
curl -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..." \
     http://localhost:8000/api/mentors/
```

Ejemplo con JavaScript fetch:
```javascript
fetch('http://localhost:8000/api/mentors/', {
    headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
    }
})
```

---

## 🔐 Sistema de Permisos por Rol

### Matriz de Permisos

| Rol | Permisos |
|-----|----------|
| **SuperAdmin** | Acceso total a todos los módulos y recursos |
| **Admin** | Gestión completa de usuarios, mentores, proyectos y productos |
| **Mentor** | Lectura y escritura en módulo académico (propio), registro de asistencia |
| **Estudiante** | Solo lectura en módulo académico (propio), ver eventos |
| **Trabajador** | Lectura y escritura en módulo de productos |
| **Usuario base** | Permisos básicos de lectura |

### Permisos Específicos

```
SuperAdmin:
  - * (todos los permisos)

Admin:
  - academic.* (todos los permisos académicos)
  - product.* (todos los permisos de productos)
  - admin.* (todos los permisos administrativos)
  - users.read, users.write
  - mentors.read, mentors.write
  - projects.read, projects.write

Mentor:
  - academic.read (leer contenido académico)
  - academic.write_own (escribir contenido propio)
  - mentors.read_own (ver su perfil)
  - attendance.write (registrar asistencia)

Estudiante:
  - academic.read_own (leer su contenido académico)
  - events.read (ver eventos)

Trabajador:
  - product.read (leer productos)
  - product.write (gestionar productos)

Usuario base:
  - basic.read (lectura básica)
```

### Códigos de Respuesta para Permisos

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Operación exitosa |
| 401 | Unauthorized | Token inválido o ausente |
| 403 | Forbidden | Usuario autenticado pero sin permisos suficientes |
| 404 | Not Found | Recurso no encontrado |

**Ejemplo de error 403:**
```json
{
    "detail": "You do not have permission to perform this action."
}
```