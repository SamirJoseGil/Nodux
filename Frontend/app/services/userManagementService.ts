import { UserProfile, UserManagementData, UserListItem, RoleStats } from '~/types/user';
import { UserRole } from '~/types/auth';
import { apiClient } from '~/utils/api';

export const UserManagementService = {
  /**
   * Obtiene la lista de todos los usuarios (Admin/SuperAdmin)
   */
  getAllUsers: async (): Promise<UserListItem[]> => {
    try {
      const response = await apiClient.get('/users/manage/');
      const data = response.data.results || response.data;
      
      return (Array.isArray(data) ? data : []).map((profile: any) => ({
        id: String(profile.id),
        username: profile.user.username,
        name: `${profile.user.first_name} ${profile.user.last_name}`,
        email: profile.user.email,
        role: profile.role,
        phone: profile.phone || '',
        photo: profile.photo,
        isActive: true
      }));
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },

  /**
   * Obtiene los detalles de un usuario específico
   */
  getUserById: async (userId: string): Promise<UserProfile> => {
    try {
      const response = await apiClient.get(`/users/manage/${userId}/`);
      const profile = response.data;
      
      return {
        id: String(profile.id),
        user: {
          id: String(profile.user.id),
          username: profile.user.username,
          firstName: profile.user.first_name,
          lastName: profile.user.last_name,
          email: profile.user.email
        },
        phone: profile.phone || '',
        photo: profile.photo,
        role: profile.role
      };
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  },

  /**
   * Cambia el rol de un usuario (Admin/SuperAdmin)
   */
  changeUserRole: async (userId: string, newRole: UserRole): Promise<UserProfile> => {
    try {
      const response = await apiClient.patch(`/users/manage/${userId}/`, {
        role: newRole
      });
      
      const profile = response.data;
      
      return {
        id: String(profile.id),
        user: {
          id: String(profile.user.id),
          username: profile.user.username,
          firstName: profile.user.first_name,
          lastName: profile.user.last_name,
          email: profile.user.email
        },
        phone: profile.phone || '',
        photo: profile.photo,
        role: profile.role
      };
    } catch (error: any) {
      console.error('Error al cambiar rol:', error);
      
      if (error.response?.status === 403) {
        throw new Error('No tienes permisos para cambiar este rol');
      }
      
      throw error;
    }
  },

  /**
   * Elimina un usuario (Admin/SuperAdmin)
   */
  deleteUser: async (userId: string): Promise<{ deleted: boolean; username: string }> => {
    try {
      const response = await apiClient.delete(`/users/manage/${userId}/`);
      return response.data;
    } catch (error: any) {
      console.error('Error al eliminar usuario:', error);
      
      if (error.response?.status === 403) {
        throw new Error('No tienes permisos para eliminar este usuario');
      }
      
      throw error;
    }
  },

  /**
   * Obtiene estadísticas de roles
   */
  getRoleStats: async (): Promise<RoleStats[]> => {
    try {
      const users = await UserManagementService.getAllUsers();
      
      const roleDescriptions: Record<UserRole, { description: string; permissions: string[] }> = {
        'SuperAdmin': {
          description: 'Acceso total al sistema',
          permissions: ['*']
        },
        'Admin': {
          description: 'Gestión de usuarios y módulos',
          permissions: ['academic.*', 'product.*', 'admin.*', 'users.write']
        },
        'Mentor': {
          description: 'Gestión de grupos académicos',
          permissions: ['academic.read', 'academic.write_own', 'attendance.write']
        },
        'Estudiante': {
          description: 'Acceso a contenido académico',
          permissions: ['academic.read_own', 'events.read']
        },
        'Trabajador': {
          description: 'Gestión de productos',
          permissions: ['product.read', 'product.write']
        },
        'Usuario base': {
          description: 'Acceso básico',
          permissions: ['basic.read']
        }
      };
      
      const roleCounts: Record<UserRole, number> = {
        'SuperAdmin': 0,
        'Admin': 0,
        'Mentor': 0,
        'Estudiante': 0,
        'Trabajador': 0,
        'Usuario base': 0
      };
      
      users.forEach(user => {
        roleCounts[user.role]++;
      });
      
      return Object.entries(roleCounts).map(([role, count]) => ({
        name: role as UserRole,
        count,
        description: roleDescriptions[role as UserRole].description,
        permissions: roleDescriptions[role as UserRole].permissions
      }));
    } catch (error) {
      console.error('Error al obtener estadísticas de roles:', error);
      throw error;
    }
  },

  /**
   * Valida si el usuario actual puede cambiar un rol específico
   */
  canChangeRole: (currentUserRole: UserRole, targetRole: UserRole): boolean => {
    // Solo SuperAdmin puede asignar rol SuperAdmin
    if (targetRole === 'SuperAdmin') {
      return currentUserRole === 'SuperAdmin';
    }
    
    // Admin y SuperAdmin pueden cambiar otros roles
    return currentUserRole === 'Admin' || currentUserRole === 'SuperAdmin';
  },

  /**
   * Valida si el usuario actual puede eliminar un usuario específico
   */
  canDeleteUser: (currentUserRole: UserRole, targetUserRole: UserRole, targetUserId: string, currentUserId: string): boolean => {
    // No puedes eliminarte a ti mismo
    if (targetUserId === currentUserId) {
      return false;
    }
    
    // Solo SuperAdmin puede eliminar a otros SuperAdmins
    if (targetUserRole === 'SuperAdmin') {
      return currentUserRole === 'SuperAdmin';
    }
    
    // Admin y SuperAdmin pueden eliminar otros usuarios
    return currentUserRole === 'Admin' || currentUserRole === 'SuperAdmin';
  }
};
