import { User, AuthResponse, LoginCredentials, RegisterData, UserRole, UpdateUserData } from '~/types/auth';
import { apiClient } from '~/utils/api';
import Cookies from 'js-cookie';

export const AuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/auth/token/', {
        email: credentials.email,
        password: credentials.password
      });
      
      const { access, refresh, user } = response.data;
      
      // Guardar tokens en cookies (httpOnly sería mejor en producción)
      Cookies.set('access_token', access, { 
        expires: 1/24, // 1 hora
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      Cookies.set('refresh_token', refresh, { 
        expires: 7, // 7 días
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      // Guardar rol en localStorage para persistencia
      localStorage.setItem('user_role', user.role);
      localStorage.setItem('user_id', user.id);
      
      return response.data;
    } catch (error: any) {
      console.error('Error en login:', error);
      throw new Error(error.response?.data?.detail || 'Error al iniciar sesión');
    }
  },
  
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      // NOTA: Si el backend no tiene endpoint de registro público,
      // debes usar el endpoint de creación de usuarios del admin
      // Por ahora, vamos a simular el registro y luego hacer login
      
      console.log('Intentando registrar usuario:', { 
        name: data.name, 
        email: data.email, 
        role: data.role 
      });
  
      // Intenta primero con el endpoint de registro si existe
      try {
        const response = await apiClient.post('/auth/register/', {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role
        });
        
        const { access, refresh, user } = response.data;
        
        // Guardar tokens
        Cookies.set('access_token', access, { 
          expires: 1/24,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        
        Cookies.set('refresh_token', refresh, { 
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        
        localStorage.setItem('user_role', user.role);
        localStorage.setItem('user_id', user.id);
        
        return response.data;
      } catch (registerError: any) {
        // Si el endpoint de registro no existe (404), usar endpoint alternativo
        if (registerError.response?.status === 404) {
          throw new Error('El registro de usuarios no está disponible. Por favor contacta al administrador para crear tu cuenta.');
        }
        throw registerError;
      }
    } catch (error: any) {
      console.error('Error en registro:', error);
      
      // Mejorar mensajes de error
      if (error.response?.status === 404) {
        throw new Error('El endpoint de registro no está disponible. Contacta al administrador.');
      } else if (error.response?.status === 400) {
        const errorMsg = error.response?.data?.email?.[0] || 
                        error.response?.data?.message ||
                        'Datos de registro inválidos';
        throw new Error(errorMsg);
      } else if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      
      throw new Error(error.message || 'Error al registrar usuario');
    }
  },
  
  logout: async (): Promise<void> => {
    try {
      const refreshToken = Cookies.get('refresh_token');
      
      if (refreshToken) {
        // Intentar invalidar el token en el backend
        try {
          await apiClient.post('/auth/logout/', {
            refresh: refreshToken
          });
        } catch (error) {
          console.error('Error al invalidar token:', error);
        }
      }
      
      // Limpiar todo
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_id');
      sessionStorage.removeItem('activeModule');
    } catch (error) {
      console.error('Error en logout:', error);
      // Limpiar de todos modos
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_id');
      sessionStorage.removeItem('activeModule');
    }
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const token = Cookies.get('access_token');
      if (!token) return null;
      
      const response = await apiClient.get('/users/me/');
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      // Si el token es inválido, limpiar
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      return null;
    }
  },
  
  refreshToken: async (): Promise<string | null> => {
    try {
      const refreshToken = Cookies.get('refresh_token');
      if (!refreshToken) return null;
      
      const response = await apiClient.post('/auth/token/refresh/', {
        refresh: refreshToken
      });
      
      const { access } = response.data;
      
      Cookies.set('access_token', access, { 
        expires: 1/24,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      return access;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      return null;
    }
  },
  
  // ...existing getUsers, updateUserRole, updateUserStatus, updateUser methods...
};
