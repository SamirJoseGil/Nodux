# Mentor API — Endpoints Documentation

## 📘 Base URL

```
/api/mentors/
```

The `MentorViewSet` manages all mentor-related operations, including:

* Creating, updating, and deleting mentors.
* Managing mentor attendance via the custom action `/hours/`.

---

## 🧩 Data Model Overview

Each `Mentor` is linked to:

* A **Profile**, which includes a `User` (with name and email).
* Additional mentor-specific data (`charge`, `knowledge_level`, `certificate`).

### Mentor Structure

| Field             | Source  | Description                                      |
| ----------------- | ------- | ------------------------------------------------ |
| `id`              | Mentor  | Mentor identifier                                |
| `first_name`      | User    | First name of the mentor                         |
| `last_name`       | User    | Last name of the mentor                          |
| `email`           | User    | Email address                                    |
| `username`        | User    | Automatically generated unique username          |
| `phone`           | Profile | Mentor’s phone number                            |
| `photo`           | Profile | Profile picture URL (if any)                     |
| `charge`          | Mentor  | Mentor’s position or role                        |
| `knowledge_level` | Mentor  | One of: `"basico"`, `"intermedio"`, `"avanzado"` |
| `certificate`     | Mentor  | File URL if a certificate was uploaded           |

---

## 🔹 1. List all mentors

### Endpoint

```
GET /api/mentors/
```

### Description

Retrieves all mentors in the system with flattened data from `User`, `Profile`, and `Mentor`.

### Example Response

```json
[
    {
        "id": 6,
        "first_name": "Juan Pablo",
        "last_name": "Avendaño",
        "email": "juanp@example.com",
        "username": "juan pablo.avendaño943",
        "phone": "+573001112233",
        "photo": null,
        "charge": "Profesor de Robótica",
        "knowledge_level": "intermedio",
        "certificate": null
    }
]
```

---

## 🔹 2. Retrieve a specific mentor

### Endpoint

```
GET /api/mentors/{id}/
```

### Description

Returns detailed information for a single mentor.

### Example

```
GET /api/mentors/6/
```

### Example Response

```json
{
    "id": 6,
    "first_name": "Juan Pablo",
    "last_name": "Avendaño",
    "email": "juanp@example.com",
    "username": "juan pablo.avendaño943",
    "phone": "+573001112233",
    "photo": null,
    "charge": "Profesor de Robótica",
    "knowledge_level": "intermedio",
    "certificate": null
}
```

---

## 🔹 3. Create a mentor

### Endpoint

```
POST /api/mentors/
```

### Description

Creates a new mentor together with:

* a `User` (first name, last name, email, and an auto-generated username),
* a `Profile` (phone, photo),
* and the `Mentor` itself.

### Required Fields

| Field                     | Type            | Description                                 |
| ------------------------- | --------------- | ------------------------------------------- |
| `profile.user.first_name` | string          | User’s first name                           |
| `profile.user.last_name`  | string          | User’s last name                            |
| `profile.user.email`      | string          | User’s email                                |
| `profile.phone`           | string          | Phone number                                |
| `charge`                  | string          | Mentor’s role                               |
| `knowledge_level`         | string          | `"basico"`, `"intermedio"`, or `"avanzado"` |
| `certificate`             | file (optional) | Certificate document                        |

### Example Request

```json
{
    "profile": {
        "user": {
            "first_name": "Laura",
            "last_name": "Ramírez",
            "email": "laura@example.com"
        },
        "phone": "+573001112244"
    },
    "charge": "Docente de Electrónica",
    "knowledge_level": "avanzado"
}
```

### Example Response

```json
{
    "id": 7,
    "first_name": "Laura",
    "last_name": "Ramírez",
    "email": "laura@example.com",
    "username": "laura.ramírez821",
    "phone": "+573001112244",
    "photo": null,
    "charge": "Docente de Electrónica",
    "knowledge_level": "avanzado",
    "certificate": null
}
```

---

## 🔹 4. Update a mentor

### Endpoint

```
PUT /api/mentors/{id}/
```

### Description

Updates the mentor, including their related `Profile` and `User`.

### Example Request

```json
{
    "profile": {
        "user": {
            "first_name": "Juan Pablo",
            "last_name": "Avendaño",
            "email": "juanp@example.com"
        },
        "phone": "+573001112233"
    },
    "charge": "Docente Senior",
    "knowledge_level": "avanzado"
}
```

### Example Response

```json
{
    "id": 6,
    "first_name": "Juan Pablo",
    "last_name": "Avendaño",
    "email": "juanp@example.com",
    "username": "juan pablo.avendaño943",
    "phone": "+573001112233",
    "photo": null,
    "charge": "Docente Senior",
    "knowledge_level": "avanzado",
    "certificate": null
}
```

---

## 🔹 5. Delete a mentor

### Endpoint

```
DELETE /api/mentors/{id}/
```

### Description

Deletes the mentor and all associated data:

* Removes certificate file (if exists)
* Removes profile photo (if exists)
* Deletes related `User` and `Profile` entries

### Example Response

```json
{
    "deleted": true,
    "id": 6
}
```

---

Perfecto, entonces podemos reorganizar la documentación de tus endpoints usando la estructura que quieres: un **endpoint para confirmar** y otro para **editar horas + confirmar**. Quedaría así:

---

Perfecto, puedo reestructurarte toda la sección de **attendance** según los endpoints y métodos que me indicaste. Quedaría así:

---

## ⚙️ 6. Mentor Attendance

### Endpoints

| Endpoint                        | Method | Description                                 |
| ------------------------------- | ------ | ------------------------------------------- |
| `/api/attendance/`              | GET    | List all attendance records                 |
| `/api/attendance/{id}/`         | GET    | Retrieve attendance for a specific mentor   |
| `/api/attendance/{id}/`         | PATCH  | Edit start/end times and confirm attendance |
| `/api/attendance/{id}/confirm/` | POST   | Confirm attendance without editing times    |

---

### 🔹 6.1 GET /api/attendance/

Returns all attendance entries stored in the system.

#### Example Response

```json
[
    {
        "id": 5,
        "mentor": {
            "id": 1,
            "first_name": "Juan",
            "last_name": "Avendano",
            "email": "jpavendanb@gmail.com",
            "username": "juan.avendano502",
            "phone": "3232420471",
            "photo": null,
            "charge": "No se",
            "knowledge_level": "basico",
            "certificate": null
        },
        "hours": 8,
        "is_confirmed": true,
        "start_datetime": "2025-11-17T06:27:00-05:00",
        "end_datetime": "2025-11-17T14:28:00-05:00",
        "confirmed_by": null
    }
]
```

---

### 🔹 6.2 GET /api/attendance/{id}/

Returns attendance entries for a specific mentor.

#### Example Response

```json
{
    "id": 5,
    "mentor": {
        "id": 1,
        "first_name": "Juan",
        "last_name": "Avendano",
        "email": "jpavendanb@gmail.com",
        "username": "juan.avendano502",
        "phone": "3232420471",
        "photo": null,
        "charge": "No se",
        "knowledge_level": "basico",
        "certificate": null
    },
    "hours": 8,
    "is_confirmed": true,
    "start_datetime": "2025-11-17T06:27:00-05:00",
    "end_datetime": "2025-11-17T14:28:00-05:00",
    "confirmed_by": null
}
```

---

### 🔹 6.3 PATCH /api/attendance/{id}

Updates attendance hours and confirms the record.

#### Rules

* Users can edit only `start_datetime` and `end_datetime`.
* `hours` are recalculated automatically.
* Setting `is_confirmed` to `true` confirms the attendance.
* Validation ensures `end_datetime > start_datetime`.

#### Example Request

```json
{
    "start_datetime": "2025-11-19T06:00:00-05:00",
    "end_datetime": "2025-11-19T14:00:00-05:00",
    "is_confirmed": true
}
```

#### Example Response

```json
{
    "id": 5,
    "mentor": {
        "id": 1,
        "first_name": "Juan",
        "last_name": "Avendano",
        "email": "jpavendanb@gmail.com",
        "username": "juan.avendano502",
        "phone": "3232420471",
        "photo": null,
        "charge": "No se",
        "knowledge_level": "basico",
        "certificate": null
    },
    "hours": 8,
    "is_confirmed": true,
    "start_datetime": "2025-11-19T06:00:00-05:00",
    "end_datetime": "2025-11-19T14:00:00-05:00",
    "confirmed_by": 3
}
```

---

### 🔹 6.4 POST /api/attendance/{id}/confirm/

Confirms attendance **without editing start/end times**. Automatically sets `confirmed_by` to the user making the request.

#### Example Response

```json
{
    "success": "confirmed"
}
```
---


## 🧾 Summary

| Action          | Method | URL                        | Description                              |
| --------------- | ------ | -------------------------- | ---------------------------------------- |
| List mentors    | GET    | `/api/mentors/`            | Shows all mentors                        |
| Retrieve mentor | GET    | `/api/mentors/{id}/`       | Shows a single mentor                    |
| Create mentor   | POST   | `/api/mentors/`            | Creates a new mentor with user & profile |
| Update mentor   | PUT    | `/api/mentors/{id}/`       | Updates mentor, profile, and user        |
| Delete mentor   | DELETE | `/api/mentors/{id}/`       | Deletes mentor and related resources     |
| List attendance     | GET    | `/api/attendance/`              | Shows all attendance records             |
| Retrieve attendance | GET    | `/api/attendance/{id}/`         | Shows attendance for a specific mentor   |
| Update attendance   | PATCH  | `/api/attendance/{id}/`         | Edit times and confirm attendance        |
| Confirm attendance  | POST   | `/api/attendance/{id}/confirm/` | Confirm attendance without editing times |

---