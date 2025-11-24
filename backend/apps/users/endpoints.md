# Users API Endpoints

The **Users API** provides endpoints for user registration, login, token refresh, and password management. All endpoints are prefixed with:

```
/api/users/
```

---

## 📝 Register API Endpoint

Allows new users to create an account and profile.

### Base URL

```
/api/users/register/
```

### Supported Methods

| Method | Description                      |
| ------ | -------------------------------- |
| `POST` | Register a new user with profile |

### Request Example

```json
{
    "user": {
        "first_name": "Juan",
        "last_name": "Pérez",
        "email": "juan.perez@example.com",
        "username": "juan123",
        "password": "securePassword123"
    },
    "phone": "3001234567",
    "photo": null
}
```

### Successful Response

**HTTP 201 Created**

```json
{
    "user": {
        "first_name": "Juan",
        "last_name": "Pérez",
        "email": "juan.perez@example.com",
        "username": "juan123"
    },
    "phone": "3001234567",
    "photo": null
}
```

### Validation Rules

* `email` must be a valid email.
* `username` must be unique.
* `password` must meet project security requirements.
* `phone` is optional.
* `photo` is optional.

---

## 🔑 Login API Endpoint

Authenticate a user and obtain JWT tokens.

### Base URL

```
/api/users/login/
```

### Supported Methods

| Method | Description                      |
| ------ | -------------------------------- |
| `POST` | Obtain access and refresh tokens |

### Request Example

```json
{
    "username": "juan123",
    "password": "securePassword123"
}
```

### Successful Response

**HTTP 200 OK**

```json
{
    "refresh": "<refresh_token_here>",
    "access": "<access_token_here>"
}
```

---

## 🔄 Token Refresh API Endpoint

Refresh your access token using a valid refresh token.

### Base URL

```
/api/users/refresh/
```

### Supported Methods

| Method | Description              |
| ------ | ------------------------ |
| `POST` | Refresh the access token |

### Request Example

```json
{
    "refresh": "<refresh_token_here>"
}
```

### Successful Response

**HTTP 200 OK**

```json
{
    "access": "<new_access_token_here>"
}
```

---

## 🔑 Change Password API Endpoint

Allows an authenticated user to change their password.

### Base URL

```
/api/users/change-password/
```

### Supported Methods

| Method | Description                |
| ------ | -------------------------- |
| `POST` | Change the user's password |

### Request Example

```json
{
    "old_password": "oldPassword123",
    "new_password": "newSecurePassword456"
}
```

### Successful Response

**HTTP 200 OK**

```json
{
    "message": "Password changed succesfully"
}
```

### Validation Rules

* `old_password` must match the current password.
* `new_password` must meet security requirements.
* User must be authenticated with a valid JWT access token.

---