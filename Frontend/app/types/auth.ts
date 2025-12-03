export type UserRole = 
  | 'SuperAdmin' 
  | 'Admin' 
  | 'Mentor' 
  | 'Estudiante' 
  | 'Trabajador' 
  | 'Usuario base';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
  active?: boolean;
  lastLogin?: string;
  upcomingEvents?: any[]; // Añadido para resolver error
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role: UserRole;
}

// Añadido para actualizar usuarios
export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: UserRole;
  active?: boolean;
}
