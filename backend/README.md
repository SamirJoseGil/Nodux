# ⚙️ Backend — Plataforma de Mentores & Proyectos

## 🧠 Descripción

API REST desarrollada en **Django 4.2 + Django REST Framework**, que gestiona la información de mentores, proyectos, grupos, calendarios, registro de horas, usuarios y métricas.
El backend expone endpoints seguros y escalables con autenticación **JWT (SimpleJWT)** y soporte para integraciones **Microsoft Graph (Bookings / Loop experimental)**.

---

## 🧩 Tech Stack

* **Framework:** Django 4.2
* **API:** Django REST Framework (DRF)
* **Auth:** SimpleJWT (rotación + blacklist)
* **DB:** PostgreSQL 15
* **Cache / Blacklist:** Redis 7
* **Seguridad:** django-cors-headers + django-cryptography
* **Infraestructura:** Docker + Nginx + Certbot
* **Monitorización:** Sentry / Prometheus

---

## 🗃️ Estructura del proyecto

```
backend/
│
├── core/                     # Configuración general (settings, urls, middleware)
├── apps/
│   ├── usuarios/             # Roles, usuarios, fotos, autenticación
│   ├── mentores/             # CRUD de mentores, conocimientos, disponibilidad
│   ├── proyectos/            # Proyectos, grupos y relaciones
│   ├── calendario/           # Calendario académico y horarios
│   ├── registros/            # Registro de horas
│   ├── archivos/             # Uploads y archivos por usuario
│   └── metricas/             # KPIs y datos globales
│
├── requirements.txt
└── manage.py
```

---

## 📚 Principales Modelos

* **Usuario / Rol:** manejo de permisos y perfiles
* **Mentor:** datos personales, conocimientos, certificados, disponibilidad
* **Proyecto / Grupo:** estructura jerárquica para asignar mentores y grupos
* **Calendario / Horario:** días hábiles, horas de clase y agenda
* **RegistroHoras:** control del tiempo de trabajo por mentor/proyecto
* **Archivo / Foto:** subida de archivos y fotos
* **Métrica:** estadísticas (proyectos activos, horas totales, mentores)

---

## 🔐 Seguridad

* JWT con refresh rotativo y blacklist
* Cookies HttpOnly + Secure + SameSite=Strict
* CSRF activo en endpoints cookie-based
* CORS restringido a orígenes del frontend
* Encriptación con django-cryptography
* Rate limiting + backoff para llamadas a Graph API

---

## 🧰 Endpoints principales

| Endpoint                      | Método             | Descripción                        |
| ----------------------------- | ------------------ | ---------------------------------- |
| `/api/mentores/`              | GET / POST         | Listar o crear mentores            |
| `/api/mentores/{id}/`         | GET / PUT / DELETE | Ver, editar o eliminar mentor      |
| `/api/proyectos/`             | GET / POST         | Gestionar proyectos                |
| `/api/proyectos/{id}/grupos/` | GET / POST         | Crear o listar grupos del proyecto |
| `/api/registro-horas/`        | POST               | Registrar horas trabajadas         |
| `/api/metricas/`              | GET                | Consultar métricas globales        |

---

## 🧱 Docker

```
docker-compose up --build
```

Servicios disponibles:

| Servicio  | Puerto   | Descripción          |
| --------- | -------- | -------------------- |
| `backend` | 8000     | API principal Django |
| `db`      | 5432     | PostgreSQL           |
| `redis`   | 6379     | Cache y tokens       |
| `nginx`   | 80 / 443 | Reverse proxy + SSL  |

---

## 🧩 Integraciones Microsoft (Graph)

* **Bookings API:** manejo de citas, staff y clientes
  → Scopes requeridos: `Bookings.ReadWrite.All`
* **Loop (experimental):** integración parcial vía Power Automate o Graph Beta
* **MSAL Python:** flujo OAuth2 Authorization Code

---

## 📎 Variables de entorno

```
DJANGO_SECRET_KEY=...
DATABASE_URL=postgres://user:pass@db:5432/appdb
REDIS_URL=redis://redis:6379/0
CORS_ALLOWED_ORIGINS=http://localhost:5173
SIMPLE_JWT_ROTATE_REFRESH_TOKENS=True
SIMPLE_JWT_BLACKLIST_AFTER_ROTATION=True
```

---

## 📈 Métricas y administración

* Panel de métricas para administrador:

  * Total de proyectos activos
  * Total de mentores registrados
  * Total de horas acumuladas
* Soporte para Django Admin y endpoints de estadísticas (DRF)

---

## 👥 Equipo

* **Project Manager:** Samir Osorio
* **Backend Devs:** Jose Daniel, Stiven, Sara
* **Base de datos:** Sara, Samir
* **Infraestructura:** Samir