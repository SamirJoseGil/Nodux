# Nodux Backend API

Backend RESTful API para la plataforma Nodux, desarrollado con Django y Django REST Framework.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Documentación](#documentación)
- [Healthcheck](#healthcheck)

## ✨ Características

- **Autenticación JWT** con tokens de acceso y refresh
- **Gestión de Usuarios** con perfiles y fotos
- **Gestión de Mentores** con certificados y asistencia
- **Gestión de Proyectos** con grupos y eventos
- **Sistema de Horarios** flexible
- **Seguridad robusta** con rate limiting, CORS y django-axes
- **API RESTful** con endpoints anidados
- **Upload de archivos** con validación y almacenamiento seguro

## 🔧 Requisitos

- Python 3.8+
- PostgreSQL 12+ (o base de datos compatible)
- pip
- virtualenv (recomendado)

## 🚀 Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd backend
```

2. Crear entorno virtual:
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Configurar variables de entorno (ver sección [Configuración](#configuración))

5. Ejecutar migraciones:
```bash
python manage.py migrate
```

6. Crear superusuario:
```bash
python manage.py createsuperuser
```

7. **Crear usuarios de prueba** (opcional pero recomendado):
```bash
python manage.py create_test_users
```

Esto creará los siguientes usuarios:
- **superadmin** / admin123 (SuperAdmin)
- **admin** / admin123 (Admin)
- **mentor** / mentor123 (Mentor)
- **estudiante** / estudiante123 (Estudiante)

8. Ejecutar servidor de desarrollo:
```bash
python manage.py runserver
```

## ⚙️ Configuración

Crear archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Django
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=nodux_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## 📁 Estructura del Proyecto

```
backend/
├── apps/
│   ├── api/          # Configuración principal de API y rutas
│   ├── core/         # Modelos y servicios compartidos
│   ├── users/        # Gestión de usuarios y autenticación
│   ├── mentors/      # Gestión de mentores y asistencia
│   └── projects/     # Gestión de proyectos, grupos y eventos
├── config/           # Configuración de Django
├── media/            # Archivos subidos por usuarios
├── staticfiles/      # Archivos estáticos
├── docs/             # Documentación adicional
└── manage.py
```

## 📚 Documentación

- [Arquitectura del Sistema](docs/ARCHITECTURE.md)
- [Endpoints API](docs/ENDPOINTS.md)
- [Modelos de Datos](docs/MODELS.md)
- [Seguridad](docs/SECURITY.md)

## 🏥 Healthcheck

El sistema incluye un endpoint de healthcheck en:

```
GET /api/healthcheck/
```

Retorna información sobre el estado del servicio, base de datos, JWT y métricas de rendimiento.

## 📝 Licencia

[Especificar licencia]

## 👥 Contribuidores

[Lista de contribuidores]