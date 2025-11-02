# 📋 Types - Definiciones de TypeScript

## Índice

1. [Introducción](#introducción)
2. [Tipos de Autenticación](#tipos-de-autenticación)
3. [Tipos Académicos](#tipos-académicos)
4. [Tipos de Módulos](#tipos-de-módulos)
5. [Convenciones](#convenciones)

---

## Introducción

Los tipos en Nodux definen la **estructura de datos** utilizada en toda la aplicación. TypeScript garantiza la seguridad de tipos en tiempo de desarrollo, previene errores y mejora la experiencia del desarrollador con autocompletado.

### Ubicación

```
app/types/
├── auth.ts         # Tipos de autenticación y usuarios
├── academic.ts     # Tipos del módulo académico
├── module.ts       # Tipos de módulos
├── project.ts      # Tipos de proyectos
├── mentor.ts       # Tipos de mentores
├── schedule.ts     # Tipos de horarios
├── event.ts        # Tipos de eventos
└── stats.ts        # Tipos de estadísticas
```

---

## Tipos de Autenticación

**Archivo**: `app/types/auth.ts`

### User

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
  active: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

**Propiedades**:
- `id`: Identificador único del usuario
- `name`: Nombre completo
- `email`: Correo electrónico
- `role`: Rol del usuario (enum UserRole)
- `permissions`: Array de permisos específicos
- `active`: Estado de activación
- `lastLogin`: Última fecha de inicio de sesión (opcional)
- `createdAt/updatedAt`: Timestamps (opcional)

### UserRole

```typescript
export type UserRole = 
  | 'SuperAdmin'
  | 'Admin'
  | 'Mentor'
  | 'Estudiante'
  | 'Trabajador'
  | 'Usuario base';
```

**Descripción de roles**:
- `SuperAdmin`: Acceso completo al sistema
- `Admin`: Administración de módulos
- `Mentor`: Mentoría académica
- `Estudiante`: Estudiante del programa
- `Trabajador`: Trabajador de módulo producto
- `Usuario base`: Usuario sin permisos especiales

### LoginCredentials

```typescript
export interface LoginCredentials {
  email: string;
  password: string;
}
```

### AuthResponse

```typescript
export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}
```

**Uso típico**:
```typescript
const response: AuthResponse = await AuthService.login(credentials);
Cookies.set('access_token', response.access);
Cookies.set('refresh_token', response.refresh);
setUser(response.user);
```

---

## Tipos Académicos

**Archivo**: `app/types/academic.ts`

### Mentor

```typescript
export interface Mentor {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  specialty: string;
  profileImage?: string;
  status: 'active' | 'inactive';
  projectCount?: number;
  totalHours?: number;
  availableHours?: {
    monday?: string[];
    tuesday?: string[];
    wednesday?: string[];
    thursday?: string[];
    friday?: string[];
    saturday?: string[];
    sunday?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
}
```

### Project

```typescript
export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'cancelled' | 'pending';
  groups?: Group[];
  mentors?: Mentor[];
  mentorCount?: number;
  studentCount?: number;
  totalHours?: number;
  createdAt?: string;
  updatedAt?: string;
}
```

### Group

```typescript
export interface Group {
  id: string;
  name: string;
  description: string;
  projectId: string;
  projectName: string;
  mentorId: string;
  mentorName: string;
  students: Student[];
  schedule?: Schedule[];
  createdAt?: string;
  updatedAt?: string;
}
```

### Student

```typescript
export interface Student {
  id: string;
  name: string;
  email: string;
  groupId?: string;
  status: 'active' | 'inactive';
}
```

### HourRecord

```typescript
export interface HourRecord {
  id: string;
  mentorId: string;
  mentorName: string;
  projectId: string;
  projectName: string;
  date: string;
  hours: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  createdAt?: string;
}
```

**Estados del registro**:
- `pending`: Pendiente de aprobación
- `approved`: Aprobado por administrador
- `rejected`: Rechazado

---

## Tipos de Módulos

**Archivo**: `app/types/module.ts`

### Module

```typescript
export interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  route?: string;
  roles?: UserRole[];
  permissions?: string[];
  adminOnly?: boolean;
}
```

**Módulos disponibles**:
```typescript
const academicModule: Module = {
  id: '1',
  name: 'Académico',
  description: 'Gestión de proyectos, mentores y estudiantes',
  icon: '🎓',
  route: '/modulo/academico/dashboard',
  roles: ['Admin', 'SuperAdmin', 'Mentor', 'Estudiante']
};
```

### ModuleType

```typescript
export type ModuleType = 'Académico' | 'Producto' | 'Administración';
```

---

## Convenciones

### 1. Nomenclatura

**Interfaces**:
```typescript
// ✅ Correcto
export interface User { }
export interface Project { }

// ❌ Incorrecto
export interface IUser { }
export interface user { }
```

**Types**:
```typescript
// ✅ Correcto
export type UserRole = 'Admin' | 'Mentor';

// ❌ Incorrecto
export type userRole = 'Admin' | 'Mentor';
```

### 2. Propiedades Opcionales

```typescript
// Usar ? para propiedades opcionales
export interface Mentor {
  id: string;           // Requerido
  name: string;         // Requerido
  phone?: string;       // Opcional
  profileImage?: string; // Opcional
}
```

### 3. Union Types

```typescript
// Para valores específicos
export type Status = 'active' | 'inactive' | 'pending';

// Mejor que:
export type Status = string; // Demasiado genérico
```

### 4. Composición

```typescript
// Reutilizar tipos existentes
export interface MentorWithStats extends Mentor {
  totalProjects: number;
  averageRating: number;
}
```

---

## Uso en Componentes

### Con useState

```typescript
const [user, setUser] = useState<User | null>(null);
const [mentors, setMentors] = useState<Mentor[]>([]);
```

### Con Props

```typescript
interface MentorCardProps {
  mentor: Mentor;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function MentorCard({ mentor, onEdit, onDelete }: MentorCardProps) {
  // ...
}
```

### Con Servicios

```typescript
// El tipo se infiere automáticamente
const mentors: Mentor[] = await MentorService.getMentors();

// O explícitamente
const response: Promise<Mentor[]> = MentorService.getMentors();
```

---

## Validación en Runtime

TypeScript solo valida en **tiempo de compilación**. Para validación en runtime:

```typescript
// Usar type guards
function isUser(obj: any): obj is User {
  return 'id' in obj && 'name' in obj && 'email' in obj && 'role' in obj;
}

// Uso
if (isUser(data)) {
  // TypeScript sabe que data es User
  console.log(data.name);
}
```

---

## Próximas Mejoras

- [ ] Agregar validación con Zod
- [ ] Generar tipos desde backend (OpenAPI)
- [ ] Tipos para responses paginadas
- [ ] Tipos para filtros y queries

---

## Enlaces Relacionados

- [📘 TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [🔧 Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [🎯 Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
