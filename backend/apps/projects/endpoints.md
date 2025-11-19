# Project and Event API — Endpoints Documentation

## 📘 Base Endpoints

| Resource                       | Base URL                                               |
| ------------------------------ | ------------------------------------------------------ |
| Projects                       | `/api/projects/`                                       |
| Groups (nested under projects) | `/api/projects/{project_id}/groups/`                   |
| Events (nested under groups)   | `/api/projects/{project_id}/groups/{group_id}/events/` |
| Global Events                  | `/api/events/`                                         |

---

## 🔹 1. Project Endpoints

### **List All Projects**

**GET**

```
/api/projects/
```

### Description

Retrieves all existing projects.
Each project includes its own details and all related groups.

### Example Response

```json
[
    {
        "id": 1,
        "name": "STEM Education Program",
        "is_active": true,
        "groups": [
            {
                "id": 3,
                "project": 1,
                "mentor": 6,
                "schedule": {
                    "id": 5,
                    "day": 0,
                    "start_time": "08:00:00",
                    "end_time": "10:00:00"
                },
                "location": "Aula 301",
                "mode": "presencial",
                "start_date": "2025-11-01",
                "end_date": "2026-01-31"
            }
        ]
    }
]
```

### **Create a Project**

**POST**

```
/api/projects/
```

### Example Request

```json
{
    "name": "STEM Education Program",
    "is_active": true
}
```

### Example Response

```json
{
    "id": 2,
    "name": "STEM Education Program",
    "is_active": true,
    "groups": []
}
```

---

## 🔹 2. Group Endpoints (Nested in Projects)

### **List Groups in a Project**

**GET**

```
/api/projects/{project_id}/groups/
```

### Description

Retrieves all groups belonging to a specific project.

### Example Response

```json
[
    {
        "id": 3,
        "project": 1,
        "mentor": 6,
        "schedule": {
            "id": 5,
            "day": 0,
            "start_time": "08:00:00",
            "end_time": "10:00:00"
        },
        "location": "Aula 301",
        "mode": "presencial",
        "start_date": "2025-11-01",
        "end_date": "2026-01-31"
    }
]
```

---

### **Create a Group inside a Project**

**POST**

```
/api/projects/{project_id}/groups/
```

### Description

Creates a new group within a project.
Each group must reference an existing schedule and mentor.

### Example Request

```json
{
    "schedule": 5,
    "mentor": 6,
    "location": "Aula 301",
    "mode": "presencial",
    "start_date": "2025-11-01",
    "end_date": "2026-01-31"
}
```

### Example Response

```json
{
    "id": 8,
    "project": 1,
    "mentor": 6,
    "schedule": {
        "id": 5,
        "day": 0,
        "start_time": "08:00:00",
        "end_time": "10:00:00"
    },
    "location": "Aula 301",
    "mode": "presencial",
    "start_date": "2025-11-01",
    "end_date": "2026-01-31"
}
```

### Validation Rules

* `schedule` must reference a valid Schedule ID.
* `mode` must be one of: `"presencial"`, `"virtual"`, `"hibrido"`.
* `start_date` must precede `end_date`.

---

## 🔹 3. Event Endpoints (Nested under Groups)

### **List Events for a Group**

**GET**

```
/api/projects/{project_id}/groups/{group_id}/events/
```

### Description

Retrieves all events created for a specific group.

### Example Response

```json
[
    {
        "id": 1,
        "group": 3,
        "location": "Aula 301",
        "date": "2025-11-03",
        "start_date": "2025-11-03",
        "end_date": "2025-11-03",
        "schedule": 5
    }
]
```

---

### **Create an Event for a Group**

**POST**

```
/api/projects/{project_id}/groups/{group_id}/events/
```

### Example Request

```json
{
    "location": "Aula 301",
    "date": "2025-11-03",
    "start_date": "2025-11-03",
    "end_date": "2025-11-03",
    "schedule": 5
}
```

### Example Response

```json
{
    "id": 4,
    "group": 3,
    "location": "Aula 301",
    "date": "2025-11-03",
    "start_date": "2025-11-03",
    "end_date": "2025-11-03",
    "schedule": 5
}
```

---

## 🔹 4. Global Event Endpoint

### **List All Events**

**GET**

```
/api/events/
```

### Description

Retrieves every event in the system across all projects and groups.

### Example Response

```json
[
    {
        "id": 1,
        "group": 3,
        "location": "Aula 301",
        "date": "2025-11-03",
        "start_date": "2025-11-03",
        "end_date": "2025-11-03",
        "schedule": 5
    },
    {
        "id": 2,
        "group": 4,
        "location": "Laboratorio 202",
        "date": "2025-11-10",
        "start_date": "2025-11-10",
        "end_date": "2025-11-10",
        "schedule": 6
    }
]
```

---

## 🧾 Summary of Endpoints

| Method | Endpoint                                               | Description                         |
| ------ | ------------------------------------------------------ | ----------------------------------- |
| `GET`  | `/api/projects/`                                       | List all projects with their groups |
| `POST` | `/api/projects/`                                       | Create a new project                |
| `GET`  | `/api/projects/{project_id}/groups/`                   | List all groups for a project       |
| `POST` | `/api/projects/{project_id}/groups/`                   | Create a group inside a project     |
| `GET`  | `/api/projects/{project_id}/groups/{group_id}/events/` | List all events for a group         |
| `POST` | `/api/projects/{project_id}/groups/{group_id}/events/` | Create a new event for a group      |
| `GET`  | `/api/events/`                                         | List all events globally            |

---