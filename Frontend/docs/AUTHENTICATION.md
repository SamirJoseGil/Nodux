# Sistema de Autenticación y Roles

## 🔐 Flujo de Autenticación

### 1. Registro de Usuario

```typescript
// Paso 1: Usuario completa formulario con rol
const registerData = {
  name: "Juan Pérez",
  email: "juan@example.com",
  password: "securePass123",
  role: "Estudiante"  // Rol seleccionado
};

// Paso 2: Frontend envía al backend
POST /api/users/register/
{
  "user": {
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "username": "juan",
    "password": "securePass123"
  },
  "phone": "",
  "photo": null,
  "role": "Estudiante"  // ← Rol incluido
}

// Paso 3: Backend crea User + Profile con role
Profile.role = "Estudiante"

// Paso 4: Backend retorna datos
{
  "id": 1,
  "user": {...},
  "role": "Estudiante"  // ← Rol asignado
}
```

### 2. Login

```typescript
// Paso 1: Usuario ingresa credenciales
const credentials = {
  username: "juan",  // o email
  password: "securePass123"
};

// Paso 2: Frontend solicita tokens
POST /api/users/login/
{
  "username": "juan",
  "password": "securePass123"
}

// Paso 3: Backend retorna tokens JWT
{
  "access": "eyJ0eXAiOiJKV1Qi...",  // 1 hora
  "refresh": "eyJ0eXAiOiJKV1Qi..."  // 7 días
}

// Paso 4: Frontend guarda tokens en cookies
Cookies.set('access_token', access, { expires: 1/24 });
Cookies.set('refresh_token', refresh, { expires: 7 });

// Paso 5: Frontend obtiene datos del usuario
GET /api/users/me/
Authorization: Bearer eyJ0eXAiOiJKV1Qi...

{
  "id": 1,
  "user": {...},
  "role": "Estudiante"  // ← Rol del backend
}

// Paso 6: Frontend guarda rol
localStorage.setItem('user_role', 'Estudiante');
localStorage.setItem('user_id', '1');
```

### 3. Renovación de Token

```typescript
// Cuando access token expira (401 Unauthorized)
// Interceptor automáticamente:

POST /api/users/refresh/
{
  "refresh": "eyJ0eXAiOiJKV1Qi..."
}

// Backend retorna nuevo access token
{
  "access": "eyJ0eXAiOiJKV1Qi..."  // Nuevo token
}

// Interceptor guarda y reintenta request original
```

---

## 👥 Roles Disponibles

| Rol | Permisos | Módulos |
|-----|----------|---------|
| **SuperAdmin** | Acceso total | Académico, Producto, Administración |
| **Admin** | Gestión de usuarios y módulos | Académico, Producto, Administración |
| **Mentor** | Gestión académica propia | Académico |
| **Estudiante** | Solo lectura académica | Académico |
| **Trabajador** | Gestión de productos | Producto |
| **Usuario base** | Acceso básico | Ninguno |

---

## 🛡️ Protección de Rutas

### Uso Básico

```tsx
import { ProtectedRoute } from '~/components/ProtectedRoute';

// Ruta solo para Admin y SuperAdmin
<Route
  path="/admin/*"
  element={
    <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

// Ruta solo para Mentores
<Route
  path="/mentor/*"
  element={
    <ProtectedRoute allowedRoles={['Mentor', 'Admin', 'SuperAdmin']}>
      <MentorDashboard />
    </ProtectedRoute>
  }
/>
```

### Validación en Componentes

```tsx
import { useAuth } from '~/contexts/AuthContext';

function MyComponent() {
  const { user, hasRole } = useAuth();

  return (
    <div>
      {/* Mostrar solo para Admin/SuperAdmin */}
      {hasRole(['Admin', 'SuperAdmin']) && (
        <button>Crear Mentor</button>
      )}

      {/* Mostrar para todos menos Usuario base */}
      {!hasRole(['Usuario base']) && (
        <div>Contenido avanzado</div>
      )}
    </div>
  );
}
```

---

## 📊 Gestión de Usuarios

### Listar Usuarios (Admin)

```typescript
import { UserManagementService } from '~/services/userManagementService';

// Obtener todos los usuarios
const users = await UserManagementService.getAllUsers();

// users = [
//   {
//     id: "1",
//     username: "juan",
//     name: "Juan Pérez",
//     email: "juan@example.com",
//     role: "Estudiante",
//     phone: "3001234567",
//     photo: "...",
//     isActive: true
//   }
// ]
```

### Cambiar Rol de Usuario

```typescript
// Solo Admin/SuperAdmin
await UserManagementService.changeUserRole('1', 'Mentor');

// Validaciones automáticas:
// - No puedes cambiar tu propio rol
// - Solo SuperAdmin puede asignar rol SuperAdmin
// - Admin no puede cambiar roles a SuperAdmin
```

### Eliminar Usuario

```typescript
// Solo Admin/SuperAdmin
await UserManagementService.deleteUser('1');

// Validaciones automáticas:
// - No puedes eliminarte a ti mismo
// - Solo SuperAdmin puede eliminar SuperAdmins
```

---

## ✅ Checklist de Integración

### Backend
- [ ] Servidor corriendo en `http://localhost:8000`
- [ ] Base de datos con migraciones aplicadas
- [ ] Campo `role` en modelo `Profile`
- [ ] Endpoint `/api/users/me/` funcionando
- [ ] Endpoint `/api/users/manage/` para Admin
- [ ] Usuarios de prueba creados

### Frontend
- [ ] `apiClient` configurado con interceptores
- [ ] `AuthContext` implementado
- [ ] `ProtectedRoute` component creado
- [ ] Rutas protegidas con `ProtectedRoute`
- [ ] `UserManagementService` implementado
- [ ] Tokens guardados en cookies (no localStorage)

---

## 🔒 Seguridad

### Tokens en Cookies

```typescript
// ✅ Correcto - Usar cookies
Cookies.set('access_token', token, {
  expires: 1/24,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
});

// ❌ Incorrecto - No usar localStorage para tokens
localStorage.setItem('access_token', token);  // Vulnerable a XSS
```

### Validación en Backend

