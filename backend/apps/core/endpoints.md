# Core API Endpoints

The **Core API** provides two main endpoints that support other application modules:

1. **Schedule API** — defines time slots used by groups, mentors, and events.
2. **Statistics API** — returns system-wide summary counts for mentors, projects, and groups.

---

## 📘 Schedule API Endpoint

The Schedule API allows you to view and create schedule entries that define the day and time ranges used by groups and events.

---

### Base URL

```
/api/schedule/
```

---

### Supported Methods

| Method | Description                      |
| ------ | -------------------------------- |
| `GET`  | Retrieve all existing schedules. |
| `POST` | Create a new schedule entry.     |

---

### Response Example (GET /api/schedule/)

**HTTP 200 OK**

```json
[
    {
        "id": 1,
        "day": 0,
        "start_time": "08:00:00",
        "end_time": "10:00:00"
    },
    {
        "id": 2,
        "day": 1,
        "start_time": "09:00:00",
        "end_time": "12:00:00"
    }
]
```

---

### Field Description

| Field        | Type              | Description                                                             |
| ------------ | ----------------- | ----------------------------------------------------------------------- |
| `id`         | integer           | Unique identifier for the schedule.                                     |
| `day`        | integer           | Numeric representation of the day of the week (0 = Monday, 6 = Sunday). |
| `start_time` | string (HH:MM:SS) | Time when the schedule begins.                                          |
| `end_time`   | string (HH:MM:SS) | Time when the schedule ends.                                            |

---

### Create a New Schedule (POST /api/schedule/)

#### Request Example

```json
{
    "day": 2,
    "start_time": "13:00:00",
    "end_time": "15:30:00"
}
```

#### Successful Response

**HTTP 201 Created**

```json
{
    "id": 8,
    "day": 2,
    "start_time": "13:00:00",
    "end_time": "15:30:00"
}
```

---

### Validation Rules

* `day` must be an integer between **0 and 6**:

  | Value | Day       |
  | ----- | --------- |
  | 0     | Monday    |
  | 1     | Tuesday   |
  | 2     | Wednesday |
  | 3     | Thursday  |
  | 4     | Friday    |
  | 5     | Saturday  |
  | 6     | Sunday    |

* `start_time` and `end_time` must follow the `HH:MM:SS` format (24-hour clock).

* `end_time` must be **after** `start_time`.

---

### Tips

* Use the `id` of a schedule when creating or linking groups through `/api/projects/<project_id>/groups/`.
* You can list schedules with `GET /api/schedule/` and reuse them instead of creating duplicates.

#### Example Integration

When creating a group, reference a schedule like this:

```json
{
    "schedule": 3,
    "location": "Aula 301",
    "mode": "presencial",
    "start_date": "2025-11-01",
    "end_date": "2026-01-31",
    "mentor": 6
}
```

---

## 📊 Statistics API Endpoint

The Statistics API provides a simple read-only summary of key system metrics.
It allows administrators and dashboards to access the number of mentors, projects, and groups.

---

### Base URL

```
/api/stats/
```

---

### Supported Methods

| Method | Description                         |
| ------ | ----------------------------------- |
| `GET`  | Retrieve current system statistics. |

---

### Example Request

```
GET /api/stats/
```

---

### Example Response

**HTTP 200 OK**

```json
{
    "mentors": 1,
    "projects": 2,
    "groups": 11
}
```

---

### Field Description

| Field      | Type    | Description                                          |
| ---------- | ------- | ---------------------------------------------------- |
| `mentors`  | integer | Total number of mentors registered in the system.    |
| `projects` | integer | Total number of projects currently stored.           |
| `groups`   | integer | Total number of groups associated with all projects. |

---

### Notes

* This endpoint is **read-only** — only supports `GET`.
* It requires authentication (`IsAuthenticated`).
* Ideal for **admin dashboards**, **reports**, or **data summaries**.

---

## 🧾 Summary of Core Endpoints

| Method | Endpoint         | Description                                              |
| ------ | ---------------- | -------------------------------------------------------- |
| `GET`  | `/api/schedule/` | Retrieve all schedules.                                  |
| `POST` | `/api/schedule/` | Create a new schedule.                                   |
| `GET`  | `/api/stats/`    | Get the current number of mentors, projects, and groups. |

---
