import { User, AuthResponse, LoginCredentials, RegisterData, UserRole, UpdateUserData } from '~/types/auth';
import { apiClient } from '~/utils/api';
import Cookies from 'js-cookie';

// Datos mock para usuarios
const MOCK_USERS: User[] = [
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
  }
];

export const AuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.post('/auth/token/', credentials);
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      
      const user = MOCK_USERS.find(u => u.email === credentials.email) || 
        MOCK_USERS[0]; // Default to admin for testing
      
      const mockResponse: AuthResponse = {
        access: `mock-token-${Date.now()}`,
        refresh: `mock-refresh-${Date.now()}`,
        user
      };
      
      return mockResponse;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },
  
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.post('/auth/register/', data);
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      
      const newUser: User = {
        id: `${MOCK_USERS.length + 1}`,
        name: data.name,
        email: data.email,
        role: data.role,
        permissions: data.role === 'Admin' ? ['read:all', 'write:all'] : 
                    data.role === 'Mentor' ? ['read:mentor', 'write:mentor'] :
                    ['read:basic'],
        active: true,
        lastLogin: new Date().toISOString()
      };
      
      MOCK_USERS.push(newUser);
      
      const mockResponse: AuthResponse = {
        access: `mock-token-${Date.now()}`,
        refresh: `mock-refresh-${Date.now()}`,
        user: newUser
      };
      
      return mockResponse;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },
  
  logout: async (): Promise<void> => {
    // En producción, podría haber una llamada para invalidar el token en el backend
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get('/users/me/');
      // return response.data;
      
      // Mock response
      const token = Cookies.get('access_token');
      if (!token) return null;
      
      // Simular devolver el usuario basado en el rol almacenado
      const storedRole = localStorage.getItem('user_role') || 'Admin';
      const user = MOCK_USERS.find(u => u.role === storedRole) || MOCK_USERS[0];
      
      return user;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  },
  
  getUsers: async (): Promise<User[]> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get('/users/');
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      return MOCK_USERS;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },
  
  updateUserRole: async (userId: string, role: UserRole): Promise<User> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.patch(`/users/${userId}/`, { role });
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      
      const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
      if (userIndex === -1) throw new Error('Usuario no encontrado');
      
      MOCK_USERS[userIndex] = {
        ...MOCK_USERS[userIndex],
        role
      };
      
      return MOCK_USERS[userIndex];
    } catch (error) {
      console.error('Error al actualizar rol de usuario:', error);
      throw error;
    }
  },
  
  updateUserStatus: async (userId: string, active: boolean): Promise<User> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.patch(`/users/${userId}/`, { active });
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      
      const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
      if (userIndex === -1) throw new Error('Usuario no encontrado');
      
      MOCK_USERS[userIndex] = {
        ...MOCK_USERS[userIndex],
        active
      };
      
      return MOCK_USERS[userIndex];
    } catch (error) {
      console.error('Error al actualizar estado de usuario:', error);
      throw error;
    }
  },
  
  // Método añadido para actualizar usuario
  updateUser: async (userId: string, userData: UpdateUserData): Promise<User> => {
    try {
      // Simulación de una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
      if (userIndex === -1) throw new Error('Usuario no encontrado');
      
      MOCK_USERS[userIndex] = {
        ...MOCK_USERS[userIndex],
        ...userData
      };
      
      return MOCK_USERS[userIndex];
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }
};
