import { User, UserRole, UpdateUserData } from '~/types/auth';
import { apiClient } from '~/utils/api';

// Datos mock para estadísticas
const MOCK_STATS = {
  totalUsers: 124,
  activeUsers: 98,
  totalRoles: 6,
  totalModules: 3,
  newUsersThisWeek: 12,
  loginAttempts: {
    successful: 245,
    failed: 18
  },
  systemHealth: {
    cpu: 32, // porcentaje
    memory: 45, // porcentaje
    storage: 28 // porcentaje
  },
  activityLogs: [
    { id: '1', user: 'Admin', action: 'Usuario creado', target: 'usuario@example.com', timestamp: '2023-06-15T10:30:00Z' },
    { id: '2', user: 'SuperAdmin', action: 'Permiso modificado', target: 'Mentor', timestamp: '2023-06-15T09:45:00Z' },
    { id: '3', user: 'Admin', action: 'Módulo actualizado', target: 'Académico', timestamp: '2023-06-14T16:20:00Z' },
    { id: '4', user: 'Admin', action: 'Usuario desactivado', target: 'antiguo@example.com', timestamp: '2023-06-13T11:10:00Z' },
    { id: '5', user: 'SuperAdmin', action: 'Configuración actualizada', target: 'Sistema', timestamp: '2023-06-12T14:25:00Z' },
  ]
};

export const AdminService = {
  getDashboardStats: async (): Promise<typeof MOCK_STATS> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get('/admin/stats/');
      // return response.data;
      
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      return MOCK_STATS;
    } catch (error) {
      console.error('Error al obtener estadísticas del dashboard:', error);
      throw error;
    }
  },

  getUsers: async (): Promise<User[]> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get('/admin/users/');
      // return response.data;
      
      // Simulamos una llamada a AuthService.getUsers()
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const users: User[] = [
        {
          id: '1',
          name: 'Admin Usuario',
          email: 'admin@nodux.com',
          role: 'Admin',
          permissions: ['read:all', 'write:all', 'admin:all'],
          active: true,
          lastLogin: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Mentor Usuario',
          email: 'mentor@nodux.com',
          role: 'Mentor',
          permissions: ['read:mentor', 'write:mentor'],
          active: true,
          lastLogin: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Estudiante Usuario',
          email: 'estudiante@nodux.com',
          role: 'Estudiante',
          permissions: ['read:student'],
          active: true,
          lastLogin: new Date().toISOString()
        },
        {
          id: '4',
          name: 'SuperAdmin Usuario',
          email: 'superadmin@nodux.com',
          role: 'SuperAdmin',
          permissions: ['read:all', 'write:all', 'admin:all', 'system:all'],
          active: true,
          lastLogin: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Trabajador Usuario',
          email: 'trabajador@nodux.com',
          role: 'Trabajador',
          permissions: ['read:product', 'write:product'],
          active: true,
          lastLogin: new Date().toISOString()
        }
      ];
      
      return users;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },
  
  updateUser: async (userId: string, userData: UpdateUserData): Promise<User> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.patch(`/admin/users/${userId}/`, userData);
      // return response.data;
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulamos respuesta
      const updatedUser: User = {
        id: userId,
        name: userData.name || 'Usuario Actualizado',
        email: userData.email || 'actualizado@nodux.com',
        role: userData.role || 'Usuario base',
        permissions: ['read:basic'],
        active: userData.active !== undefined ? userData.active : true,
        lastLogin: new Date().toISOString()
      };
      
      return updatedUser;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  },
  
  deleteUser: async (userId: string): Promise<void> => {
    try {
      // En producción, esto sería una llamada a la API
      // await apiClient.delete(`/admin/users/${userId}/`);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log(`Usuario ${userId} eliminado`);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  },
  
  getRoles: async (): Promise<{ name: UserRole; count: number; permissions: string[] }[]> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get('/admin/roles/');
      // return response.data;
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return [
        { name: 'SuperAdmin', count: 1, permissions: ['system:all', 'admin:all', 'read:all', 'write:all'] },
        { name: 'Admin', count: 5, permissions: ['admin:all', 'read:all', 'write:all'] },
        { name: 'Mentor', count: 12, permissions: ['read:mentor', 'write:mentor', 'read:student'] },
        { name: 'Estudiante', count: 78, permissions: ['read:student'] },
        { name: 'Trabajador', count: 23, permissions: ['read:product', 'write:product'] },
        { name: 'Usuario base', count: 5, permissions: ['read:basic'] }
      ];
    } catch (error) {
      console.error('Error al obtener roles:', error);
      throw error;
    }
  },
  
  getSystemLogs: async (page: number = 1, limit: number = 10): Promise<{
    logs: Array<{
      id: string;
      user: string;
      action: string;
      target: string;
      timestamp: string;
      details?: string;
    }>;
    total: number;
  }> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get(`/admin/logs/?page=${page}&limit=${limit}`);
      // return response.data;
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generamos logs de prueba
      const logs = Array(limit).fill(0).map((_, i) => ({
        id: `${(page - 1) * limit + i + 1}`,
        user: i % 2 === 0 ? 'Admin' : 'SuperAdmin',
        action: ['Usuario creado', 'Permiso modificado', 'Sistema actualizado', 'Sesión iniciada', 'Módulo configurado'][i % 5],
        target: ['usuario@example.com', 'Mentor', 'Sistema', 'Admin', 'Académico'][i % 5],
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        details: i % 3 === 0 ? 'Detalles adicionales de la acción' : undefined
      }));
      
      return {
        logs,
        total: 100 // Total ficticio de registros
      };
    } catch (error) {
      console.error('Error al obtener logs del sistema:', error);
      throw error;
    }
  }
};
