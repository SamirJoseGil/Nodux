# Seguridad del Sistema

## 🔒 Autenticación

### JWT (JSON Web Tokens)

El sistema utiliza JWT para autenticación stateless.

#### Configuración

```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
}
```

#### Flujo de Autenticación

```
1. Usuario hace login con username/password
   POST /api/users/login/
   
2. Sistema valida credenciales
   
3. Sistema retorna access + refresh tokens
   {
     "access": "<60min token>",
     "refresh": "<7days token>"
   }
   
4. Cliente incluye access token en cada request
   Authorization: Bearer <access_token>
   
5. Cuando access token expira:
   POST /api/users/refresh/
   { "refresh": "<refresh_token>" }
   
6. Sistema retorna nuevo access token
   
7. Cuando refresh token expira:
   Usuario debe hacer login nuevamente
```

#### Tokens Blacklisted

- Cuando un refresh token se usa, el anterior se invalida
- Tokens usados se almacenan en blacklist
- Previene reutilización de tokens comprometidos

---

## 🛡️ Rate Limiting

Protección contra abuso de API y ataques de fuerza bruta.

### Configuración

```python
DEFAULT_THROTTLE_RATES = {
    'anon': '100/day',    # Usuarios no autenticados
    'user': '1000/day'    # Usuarios autenticados
}
```

### Respuesta cuando se excede el límite

**HTTP 429 Too Many Requests**
```json
{
    "detail": "Request was throttled. Expected available in 3600 seconds."
}
```

### Mejores Prácticas

- Implementar caché en el cliente
- Usar paginación para grandes datasets
- Batch requests cuando sea posible
- Monitorear uso de API

---

## 🔐 Django-Axes

Protección contra ataques de fuerza bruta en login.

### Configuración

```python
AXES_FAILURE_LIMIT = 5            # Intentos antes de bloqueo
AXES_COOLOFF_TIME = timedelta(minutes=30)  # Duración del bloqueo
AXES_RESET_ON_SUCCESS = True      # Reset contador en login exitoso
```

### Comportamiento

```
Intento 1-4: Login normal
Intento 5: ❌ Cuenta bloqueada por 30 minutos
Esperar 30 min O login exitoso: ✅ Contador reseteado
```

### Monitoreo

```bash
# Ver intentos fallidos
python manage.py axes_list_attempts

# Reset manual de bloqueos
python manage.py axes_reset
```

---

## 🌐 CORS (Cross-Origin Resource Sharing)

Configuración para permitir requests desde frontend.

### Configuración

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://yourdomain.com'
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
```

### Headers Permitidos

```python
CORS_ALLOW_HEADERS = [
    'accept',
    'authorization',
    'content-type',
    'origin',
]
```

---

## 🔑 Gestión de Contraseñas

### Validadores de Django

```python
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'UserAttributeSimilarityValidator',
        # Evita contraseñas similares al username/email
    },
    {
        'NAME': 'MinimumLengthValidator',
        # Mínimo 8 caracteres
    },
    {
        'NAME': 'CommonPasswordValidator',
        # Previene contraseñas comunes
    },
    {
        'NAME': 'NumericPasswordValidator',
        # Evita contraseñas solo numéricas
    },
]
```

### Hash de Contraseñas

Django usa PBKDF2 con SHA256 por defecto:

```python
user.set_password('plain_password')  # ✅ Correcto (hashea)
user.password = 'plain_password'     # ❌ Incorrecto (no hashea)
```

### Cambio de Contraseña

```python
# Endpoint: POST /api/users/change-password/
{
    "old_password": "current_password",
    "new_password": "new_secure_password"
}
```

---

## 📂 Upload de Archivos

### Validación de Tamaño

```python
FILE_UPLOAD_MAX_MEMORY_SIZE = 5 * 1024 * 1024  # 5 MB
PHOTO_UPLOAD_MAX_MEMORY_SIZE = 2 * 1024 * 1024 # 2 MB
```

### Extensiones Permitidas

```python
ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png']
ALLOWED_FILE_EXTENSIONS = ['.pdf']
```

### Nombres de Archivo Seguros

```python
def random_filename(filename, folder):
    """Genera nombres únicos con UUID"""
    ext = filename.split('.')[-1]
    random_name = f"{uuid.uuid4()}.{ext}"
    return os.path.join(folder, random_name)
```

**Previene:**
- Path traversal attacks
- Sobrescritura de archivos
- Nombres predecibles

---

## 🔒 Configuración de Producción

### SSL/HTTPS

```python
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
```

### Headers de Seguridad

```python
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
```

### HSTS (HTTP Strict Transport Security)

```python
SECURE_HSTS_SECONDS = 31536000  # 1 año
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
```

---

## 🔐 Variables de Entorno

### Archivo .env

**NUNCA** incluir en control de versiones:

```env
# .gitignore
.env
*.env
```

### Variables Críticas

```env
SECRET_KEY=<random-50-char-string>
DB_PASSWORD=<strong-password>
DEBUG=False  # En producción
```

### Generar SECRET_KEY

```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

---

## 🛡️ Protección CSRF

Django incluye protección CSRF por defecto.

### En Formularios HTML

```html
<form method="post">
    {% csrf_token %}
    <!-- form fields -->
</form>
```

### En API REST

- CSRF no se requiere para JWT authentication
- CSRF se aplica a session authentication

```python
# Si usas session auth, incluir en headers:
X-CSRFToken: <csrf_token>
```

---

## 👁️ Permisos de API

### Configuración por Ambiente

```python
# Desarrollo (DEBUG=True)
DEFAULT_PERMISSION_CLASSES = [
    'rest_framework.permissions.AllowAny'
]

# Producción (DEBUG=False)
DEFAULT_PERMISSION_CLASSES = [
    'rest_framework.permissions.IsAuthenticated'
]
```

### Permisos Personalizados

```python
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user
```

---

## 📊 Auditoría y Logging

### Logs Importantes

```python
import logging
logger = logging.getLogger(__name__)

# Login fallido
logger.warning(f"Failed login attempt for {username}")

# Cambio de contraseña
logger.info(f"Password changed for user {user.id}")

# Eliminación de recursos
logger.info(f"Mentor {mentor.id} deleted by {request.user}")
```

### Configuración de Logs

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'WARNING',
            'class': 'logging.FileHandler',
            'filename': 'logs/security.log',
        },
    },
    'loggers': {
        'security': {
            'handlers': ['file'],
            'level': 'WARNING',
        },
    },
}
```

---

## ✅ Checklist de Seguridad

### Antes de Producción

- [ ] `DEBUG = False`
- [ ] `SECRET_KEY` única y segura
- [ ] Variables sensibles en `.env`
- [ ] HTTPS configurado
- [ ] CORS configurado correctamente
- [ ] Rate limiting activado
- [ ] Django-Axes configurado
- [ ] Passwords validadas
- [ ] File uploads validados
- [ ] Headers de seguridad activos
- [ ] Base de datos con credenciales fuertes
- [ ] Backups automáticos configurados
- [ ] Monitoreo de logs activo
- [ ] Firewall configurado
- [ ] SSH solo con keys (no passwords)

### Revisión Periódica

- [ ] Actualizar dependencias
- [ ] Revisar logs de seguridad
- [ ] Auditar permisos de usuarios
- [ ] Verificar tokens blacklisted
- [ ] Revisar intentos de login fallidos
- [ ] Actualizar certificados SSL

---

## 🚨 Respuesta a Incidentes

### Si se Compromete SECRET_KEY

1. Generar nueva SECRET_KEY
2. Actualizar en producción
3. Invalidar todos los tokens JWT existentes
4. Notificar a usuarios para re-login
5. Auditar logs de acceso

### Si se Detecta Ataque

1. Activar modo mantenimiento
2. Revisar logs de acceso
3. Identificar vectores de ataque
4. Aplicar patches necesarios
5. Cambiar credenciales comprometidas
6. Notificar usuarios si aplica

---

## 📚 Referencias

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Django Security](https://docs.djangoproject.com/en/stable/topics/security/)
- [DRF Authentication](https://www.django-rest-framework.org/api-guide/authentication/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
