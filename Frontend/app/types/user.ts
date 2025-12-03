import { UserRole } from './auth';

export interface UserProfile {
  id: string;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  phone: string;
  photo?: string;
  role: UserRole;
}

export interface UserManagementData {
  role?: UserRole;
  active?: boolean;
}

export interface UserListItem {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  photo?: string;
  isActive: boolean;
}

export interface RoleStats {
  name: UserRole;
  count: number;
  description: string;
  permissions: string[];
}
