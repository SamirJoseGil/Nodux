# Guía de Inicio de Sesión - Nodux

## 🔐 Credenciales de Prueba

### Usuarios Disponibles

| Username | Password | Rol | Descripción |
|----------|----------|-----|-------------|
| **superadmin** | admin123 | SuperAdmin | Acceso completo al sistema |
| **admin** | admin123 | Admin | Gestión de usuarios y módulos |
| **mentor** | mentor123 | Mentor | Gestión de mentoría académica |
| **estudiante** | estudiante123 | Estudiante | Acceso a contenido académico |

---

## 🚀 Cómo Iniciar Sesión

### 1. Desde el Frontend

1. Abre la aplicación en `http://localhost:5173/login`
2. Ingresa uno de los usuarios de prueba (ej: `admin`)
3. Ingresa la contraseña correspondiente (`admin123`)
4. Click en "Iniciar Sesión"

### 2. Con cURL (API Directa)

```bash
# Login
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Respuesta:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

# Obtener información del usuario
curl -H "Authorization: Bearer <access_token>" \
     http://localhost:8000/api/users/me/

# Respuesta:
{
  "id": 1,
  "user": {
    "id": 2,
    "username": "admin",
    "first_name": "John",
    "last_name": "Admin",
    "email": "admin@nodux.com"
  },
  "phone": "3002222222",
  "photo": null,
  "role": "Admin"
}
```

---

## 📊 Flujo de Autenticación

