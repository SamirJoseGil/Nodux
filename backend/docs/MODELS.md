# Modelos de Datos

## 📊 Diagrama de Relaciones

```
User (Django Auth)
  ↓ OneToOne
Profile (con role)
  ↓ OneToOne
Mentor
  ↓ ManyToOne
MentorAttendance
MentorAvailability → Schedule

Project
  ↓ OneToMany
Group → Mentor (ManyToOne)
     → Schedule (ManyToOne)
  ↓ OneToMany
Event
```

---

## 👤 User (Django Built-in)

Modelo estándar de Django para autenticación.

### Campos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Integer | ID único (auto-generado) |
| username | String(150) | Nombre de usuario único |
| password | String(128) | Contraseña hasheada |
| first_name | String(150) | Nombre |
| last_name | String(150) | Apellido |
| email | String(254) | Email único |
| is_staff | Boolean | Acceso al admin |
| is_active | Boolean | Cuenta activa |
| is_superuser | Boolean | Permisos de super usuario |
| date_joined | DateTime | Fecha de registro |
| last_login | DateTime | Último login |

---

## 👔 Profile

Extiende el modelo User con información adicional y rol del sistema.

**Ubicación:** `apps.users.models.Profile`

### Campos

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Integer | PK, Auto | ID único |
| user | FK(User) | OneToOne, Cascade | Usuario asociado |
| phone | String(20) | Nullable | Teléfono de contacto |
| photo | ImageField | Nullable | Foto de perfil |
| role | String(20) | Choices, Default='Usuario base' | Rol del usuario en el sistema |

### Choices

**role:**
- `SuperAdmin`: Super Administrador (acceso total)
- `Admin`: Administrador
- `Mentor`: Mentor
- `Estudiante`: Estudiante
- `Trabajador`: Trabajador
- `Usuario base`: Usuario Base (default)

### Relaciones

- **User**: OneToOne con `django.contrib.auth.models.User`

### Reglas de Negocio

- Al eliminar User, se elimina Profile (CASCADE)
- La foto se guarda en `media/user_photos/` con nombre único UUID
- El teléfono es opcional
- El rol es obligatorio (default: 'Usuario base')
- Solo SuperAdmin puede asignar rol SuperAdmin a otros usuarios
- Admin no puede cambiar su propio rol

### Ejemplo JSON

```json
{
    "id": 1,
    "user": {
        "id": 1,
        "username": "juan.perez123",
        "first_name": "Juan",
        "last_name": "Pérez",
        "email": "juan@example.com"
    },
    "phone": "3001234567",
    "photo": "http://localhost:8000/media/user_photos/abc-123.jpg",
    "role": "Estudiante"
}
```

---

## 👨‍🏫 Mentor

Representa a un mentor en la plataforma.

**Ubicación:** `apps.mentors.models.Mentor`

### Campos

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Integer | PK, Auto | ID único |
| profile | FK(Profile) | OneToOne, Cascade | Perfil asociado |
| charge | String(20) | Required | Cargo del mentor |
| knowledge_level | String(20) | Choices, Required | Nivel de conocimiento |
| certificate | FileField | Nullable | Certificado de mentor |

### Choices

**knowledge_level:**
- `basico`: Básico
- `intermedio`: Intermedio
- `avanzado`: Avanzado

### Relaciones

- **Profile**: OneToOne con `apps.users.models.Profile`
- **Group**: OneToMany (reverse: `group_set`)
- **MentorAttendance**: OneToMany (reverse: `mentorattendance_set`)
- **MentorAvailability**: OneToMany (reverse: `mentoravailability_set`)

### Reglas de Negocio

- Al eliminar Profile, se elimina Mentor (CASCADE)
- El certificado se guarda en `media/mentors_certificates/` con nombre UUID
- `knowledge_level` es obligatorio
- Username y password se generan automáticamente al crear

### Ejemplo JSON

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

## ⏰ MentorAttendance

Registra las horas trabajadas por un mentor.

**Ubicación:** `apps.mentors.models.MentorAttendance`

### Campos

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Integer | PK, Auto | ID único |
| mentor | FK(Mentor) | ManyToOne, Cascade | Mentor asociado |
| registered_by | FK(User) | ManyToOne, Cascade | Usuario que registró |
| hours | Integer | Required, Positive | Horas trabajadas |
| date | DateField | Auto-add | Fecha de registro |

### Relaciones

- **Mentor**: ManyToOne con `Mentor`
- **User**: ManyToOne con `django.contrib.auth.models.User`

### Reglas de Negocio

- `hours` debe ser mayor a 0
- Solo se puede registrar una vez por día por mentor
- `date` se asigna automáticamente al crear
- Al eliminar Mentor, se eliminan sus registros (CASCADE)

### Validaciones

```python
# Evita duplicados por día
if MentorAttendance.objects.filter(
    mentor=mentor, 
    registered_by=user, 
    date=today
).exists():
    raise ValidationError("Already registered today")
```

---

## 📅 Schedule

Define horarios reutilizables.

**Ubicación:** `apps.core.models.Schedule`

### Campos

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Integer | PK, Auto | ID único |
| day | Integer | Choices, Required | Día de la semana (0-6) |
| start_time | TimeField | Required | Hora de inicio |
| end_time | TimeField | Required | Hora de fin |

### Choices

**day:**
- 0: Lunes
- 1: Martes
- 2: Miércoles
- 3: Jueves
- 4: Viernes
- 5: Sábado
- 6: Domingo

### Relaciones

- **Group**: OneToMany (reverse: `group_set`)
- **MentorAvailability**: OneToMany (reverse: `mentoravailability_set`)

### Ejemplo JSON

```json
{
    "id": 1,
    "day": 0,
    "start_time": "09:00:00",
    "end_time": "17:00:00"
}
```

---

## 🗓️ MentorAvailability

Define la disponibilidad de un mentor.

**Ubicación:** `apps.mentors.models.MentorAvailability`

### Campos

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Integer | PK, Auto | ID único |
| mentor | FK(Mentor) | ManyToOne, Cascade | Mentor asociado |
| schedule | FK(Schedule) | ManyToOne, Cascade | Horario disponible |

### Relaciones

- **Mentor**: ManyToOne con `Mentor`
- **Schedule**: ManyToOne con `Schedule`

---

## 📊 Project

Representa un proyecto en la plataforma.

**Ubicación:** `apps.projects.models.Project`

### Campos

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Integer | PK, Auto | ID único |
| name | String(255) | Required | Nombre del proyecto |
| is_active | Boolean | Default: False | Proyecto activo |

### Relaciones

- **Group**: OneToMany (reverse: `group_set`)

### Ejemplo JSON

```json
{
    "id": 1,
    "name": "Proyecto Alpha",
    "is_active": true
}
```

---

## 👥 Group

Representa un grupo dentro de un proyecto.

**Ubicación:** `apps.projects.models.Group`

### Campos

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Integer | PK, Auto | ID único |
| project | FK(Project) | ManyToOne, Cascade | Proyecto padre |
| mentor | FK(Mentor) | ManyToOne, Protect, Nullable | Mentor asignado |
| schedule | FK(Schedule) | ManyToOne, Protect, Nullable | Horario del grupo |
| location | String(255) | Required | Ubicación |
| mode | String(10) | Choices, Required | Modalidad |
| start_date | DateField | Required | Fecha de inicio |
| end_date | DateField | Required | Fecha de fin |

### Choices

**mode:**
- `presencial`: Presencial
- `virtual`: Virtual
- `hibrido`: Híbrido

### Relaciones

- **Project**: ManyToOne con `Project`
- **Mentor**: ManyToOne con `Mentor` (PROTECT - no se puede eliminar mentor si tiene grupos)
- **Schedule**: ManyToOne con `Schedule` (PROTECT)
- **Event**: OneToMany (reverse: `event_set`)

### Reglas de Negocio

- Al eliminar Project, se eliminan sus grupos (CASCADE)
- No se puede eliminar Mentor o Schedule si están asignados a grupos (PROTECT)
- **Al crear un grupo, se generan eventos automáticamente** basados en:
  - El día de la semana del Schedule
  - El rango de fechas (start_date - end_date)
  - Frecuencia semanal (un evento por semana)
- Los eventos heredan la ubicación del grupo
- Si el grupo dura 6 meses con clases semanales, se crearán ~24 eventos

### Flujo de Creación

```
1. Frontend envía datos del grupo con horario integrado
   ↓
2. Backend busca o crea un Schedule con los datos de horario
   ↓
3. Se crea el Group con referencia al Schedule
   ↓
4. Se calculan todas las fechas que coinciden con schedule_day
   ↓
5. Se crean eventos automáticamente para cada fecha
   ↓
6. Los eventos aparecen en el calendario inmediatamente
```

### Ejemplo JSON

```json
{
    "id": 1,
    "project": 1,
    "mentor": 2,
    "schedule": 3,
    "location": "Sala A",
    "mode": "presencial",
    "start_date": "2024-01-15",
    "end_date": "2024-06-15",
    "events_generated": 24
}
```

---

## 📅 Event

Representa un evento dentro de un grupo.

**Ubicación:** `apps.projects.models.Event`

### Campos

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | Integer | PK, Auto | ID único |
| group | FK(Group) | ManyToOne, Cascade | Grupo padre |
| location | String(255) | Required | Ubicación del evento |
| date | DateField | Required | Fecha del evento |
| start_date | DateField | Required | Fecha de inicio |
| end_date | DateField | Required | Fecha de fin |

### Relaciones

- **Group**: ManyToOne con `Group`

### Reglas de Negocio

- Al eliminar Group, se eliminan sus eventos (CASCADE)

### Ejemplo JSON

```json
{
    "id": 1,
    "group": 1,
    "location": "Auditorio Principal",
    "date": "2024-02-15",
    "start_date": "2024-02-15",
    "end_date": "2024-02-15"
}
```

---

## 🔗 Resumen de Relaciones

```
CASCADE (elimina en cascada):
- User → Profile
- Profile → Mentor
- Mentor → MentorAttendance
- Mentor → MentorAvailability
- Project → Group
- Group → Event

PROTECT (previene eliminación):
- Mentor → Group (no se puede eliminar mentor con grupos)
- Schedule → Group (no se puede eliminar horario en uso)
```
