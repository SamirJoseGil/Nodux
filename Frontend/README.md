# 🌐 Frontend — Plataforma de Mentores & Proyectos

## 🚀 Descripción

Interfaz web desarrollada en **Remix 2.16** para la gestión de **proyectos, mentores, grupos y registro de horas**.
Permite crear, editar y visualizar toda la información del ecosistema académico, con flujos fluidos y diseño modular.

---

## 🧩 Tech Stack

* **Framework:** Remix 2.16 (SSR + rutas anidadas)
* **Estilos:** TailwindCSS + DaisyUI
* **Animaciones:** Framer Motion
* **HTTP Client:** Axios (con interceptores JWT + refresh)
* **Tipado:** TypeScript
* **UI Components:** Atomic Design
* **Autenticación:** JWT + Refresh (vía cookies HttpOnly)
* **Gestión de estado:** React Hooks + Context API
* **Iconografía:** Heroicons / Lucide

---

## 📂 Estructura del proyecto

```
frontend/
│
├── app/
│   ├── routes/               # Vistas (login, dashboard, mentores, proyectos, etc.)
│   ├── components/           # Componentes atómicos y moleculares
│   ├── styles/               # Tailwind y DaisyUI configs
│   ├── utils/                # Axios, helpers, validaciones
│   ├── context/              # Contextos globales (auth, proyectos)
│   └── entry.server.tsx      # SSR Remix config
│
├── public/                   # Assets estáticos
├── tailwind.config.ts
├── package.json
└── remix.config.js
```

---

## 💡 Funcionalidades principales

### 👨‍🏫 Mentores

* Crear, editar y listar mentores (HU-01, HU-02, HU-07)
* Cargar foto (Base64), certificado y disponibilidad
* Validaciones en tiempo real (email, campos requeridos)
* Vista general + vista detallada con proyectos asignados

### 🧱 Proyectos y Grupos

* Crear y editar proyectos (HU-04, HU-05)
* Gestionar grupos dentro de proyectos (HU-06)
* Asignar mentores, horarios, modalidad y estado
* Filtrado y búsqueda dinámica por nombre o estado

### ⏱ Registro de horas

* Registrar horas de mentores por proyecto (HU-03)
* Mostrar resumen por fecha y mentor

### 📅 Calendario

* Visualizar días hábiles, clases y asignaciones
* Hover o click muestra información detallada del día

---

## 🔐 Autenticación

* **Login:** JWT vía API Django (access + refresh)
* **Tokens:** Access en memoria / Refresh en cookie HttpOnly
* **Protección:** CORS + CSRF desde backend

---

## 🧰 Scripts útiles

```
npm run dev        # Iniciar entorno local  
npm run build      # Construir para producción  
npm run lint       # Linter y formato  
```

---

## 🧱 Docker (local)

```
docker build -t frontend .
docker run -p 5173:5173 frontend
```

---

## 📎 Integraciones futuras

* Microsoft Graph (Bookings) para citas y agenda
* Loop (Microsoft) como módulo experimental
* Dashboard con métricas generales (mentores, proyectos, horas)

---

## ✨ Equipo

* **Líder técnico:** Samir Gil
* **Frontend Dev:** Samir Gil
* **Backend Dev** Juan Avendaño
