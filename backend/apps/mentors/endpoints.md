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

## ⚙️ 6. Register or view mentor attendance

### Endpoint

```
/api/mentors/{id}/hours/
```

### Methods

| Method | Description                                          |
| ------ | ---------------------------------------------------- |
| `GET`  | Retrieves all attendance records for all mentors     |
| `POST` | Registers new attendance hours for a specific mentor |

---

### 🔹 6.1 GET /api/mentors/{id}/hours/

Returns all attendance entries stored in the system.

### Example Response

```json
[
    {
        "mentor": 6,
        "registered_by": 3,
        "hours": 2
    },
    {
        "mentor": 7,
        "registered_by": 4,
        "hours": 3
    }
]
```

---

### 🔹 6.2 POST /api/mentors/{id}/hours/

Registers new attendance hours for a specific mentor.

### Rules

* `hours` must be a positive integer.
* The same user cannot register hours for the same mentor twice on the same day.

### Example Request

```
POST /api/mentors/6/hours/
```

```json
{
    "hours": 3
}
```

### Example Response

```json
{
    "mentor": 6,
    "registered_by": 3,
    "hours": 3
}
```

### Possible Validation Error

If the user already registered hours for that mentor today:

```json
{
    "non_field_errors": [
        "You have already registered hours for this mentor today."
    ]
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
| View hours      | GET    | `/api/mentors/{id}/hours/` | Lists attendance records                 |
| Register hours  | POST   | `/api/mentors/{id}/hours/` | Adds attendance for mentor               |

---