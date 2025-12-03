import { User, AuthResponse, LoginCredentials, RegisterData, UserRole, UpdateUserData } from '~/types/auth';
import { apiClient } from '~/utils/api';
import Cookies from 'js-cookie';

export const AuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // Determinar si es email o username
      let username = credentials.email;
      
      if (credentials.email.includes('@')) {
        username = credentials.email.split('@')[0];
      }
      
      console.log('🔑 Login con username:', username);
      
      // 1. Login
      const response = await apiClient.post('/users/login/', {
        username: username,
        password: credentials.password
      });
      
      const { access, refresh } = response.data;
      console.log('✅ Tokens obtenidos');
      
      // 2. Guardar tokens
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
      
      // 3. Obtener datos del usuario
      const userResponse = await apiClient.get('/users/me/', {
        headers: {
          'Authorization': `Bearer ${access}`
        }
      });
      
      console.log('📦 Respuesta completa de /users/me/:', JSON.stringify(userResponse.data, null, 2));
      
      // Backend puede retornar dos estructuras:
      // Opción 1: { id, user: {...}, phone, photo, role }
      // Opción 2: { id, user_id, phone, photo, role, user: {...} } (con ProfileSerializer)
      
      const profileData = userResponse.data;
      let userData, userRole;
      
      if (profileData.user) {
        // Estructura con usuario anidado
        userData = profileData.user;
        userRole = profileData.role || 'Usuario base';
      } else {
        // Estructura plana (menos probable)
        userData = {
          id: profileData.user_id,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          email: profileData.email,
          username: profileData.username
        };
        userRole = profileData.role || 'Usuario base';
      }
      
      console.log('👤 Usuario procesado:', {
        id: userData.id,
        name: `${userData.first_name} ${userData.last_name}`,
        email: userData.email,
        role: userRole
      });
      
      // 4. Guardar información
      localStorage.setItem('user_role', userRole);
      localStorage.setItem('user_id', String(profileData.id));
      localStorage.setItem('user_name', `${userData.first_name} ${userData.last_name}`);
      localStorage.setItem('user_email', userData.email);
      
      console.log('💾 Datos guardados en localStorage:', {
        user_role: localStorage.getItem('user_role'),
        user_id: localStorage.getItem('user_id'),
        user_name: localStorage.getItem('user_name')
      });
      
      return {
        access,
        refresh,
        user: {
          id: String(profileData.id),
          name: `${userData.first_name} ${userData.last_name}`,
          email: userData.email,
          role: userRole as UserRole,
          permissions: [],
          active: true
        }
      };
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      console.error('Response:', error.response?.data);
      
      if (error.response?.status === 401) {
        throw new Error('Credenciales incorrectas. Verifica tu usuario/email y contraseña.');
      } else if (error.response?.status === 403) {
        throw new Error('Tu cuenta ha sido bloqueada temporalmente por múltiples intentos fallidos. Intenta nuevamente en 30 minutos o contacta al administrador.');
      } else if (error.response?.status === 400) {
        throw new Error('Datos de inicio de sesión inválidos. Verifica que tu cuenta esté activa.');
      }
      
      throw new Error(error.response?.data?.detail || 'Error al iniciar sesión. Intenta nuevamente.');
    }
  },
  
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const nameParts = data.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || nameParts[0];
      const username = data.email.split('@')[0];

      const payload = {
        user: {
          first_name: firstName,
          last_name: lastName,
          email: data.email,
          username: username,
          password: data.password
        },
        phone: '',
        photo: null,
        role: data.role  // ← ENVIAR ROL AL BACKEND
      };

      // 1. Registrar usuario con rol
      await apiClient.post('/users/register/', payload);
      
      // 2. Hacer login automático
      const loginResponse = await apiClient.post('/users/login/', {
        username: username,
        password: data.password
      });
      
      const { access, refresh } = loginResponse.data;
      
      // 3. Guardar tokens
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
      
      // 4. Obtener datos del usuario (incluye rol desde el backend)
      const userResponse = await apiClient.get('/users/me/', {
        headers: {
          'Authorization': `Bearer ${access}`
        }
      });
      
      const profileData = userResponse.data;
      const userData = profileData.user || profileData;
      const userRole = profileData.role || userData.role;  // ← OBTENER ROL DEL BACKEND
      
      localStorage.setItem('user_role', userRole);  // ← GUARDAR ROL DEL BACKEND
      localStorage.setItem('user_id', String(userData.id));
      
      return {
        access,
        refresh,
        user: {
          id: String(userData.id),
          name: `${userData.first_name} ${userData.last_name}`,
          email: userData.email,
          role: userRole,  // ← USAR ROL DEL BACKEND
          permissions: [],
          active: true
        }
      };
    } catch (error: any) {
      console.error('Error en registro:', error);
      
      if (error.response?.status === 400) {
        const errorData = error.response?.data;
        
        // Extraer mensajes de error específicos
        if (errorData?.user?.email) {
          throw new Error('Este correo electrónico ya está registrado.');
        }
        if (errorData?.user?.username) {
          throw new Error('Este nombre de usuario ya existe.');
        }
        
        const errorMsg = errorData?.message || 'Datos de registro inválidos';
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
      if (!token) {
        console.log('ℹ️ No hay token de acceso');
        return null;
      }
      
      const response = await apiClient.get('/users/me/');
      
      console.log('📦 Respuesta de /users/me/ (getCurrentUser):', JSON.stringify(response.data, null, 2));
      
      const profileData = response.data;
      let userData, userRole;
      
      if (profileData.user) {
        userData = profileData.user;
        userRole = profileData.role || localStorage.getItem('user_role') || 'Usuario base';
      } else {
        userData = {
          id: profileData.user_id,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          email: profileData.email
        };
        userRole = profileData.role || localStorage.getItem('user_role') || 'Usuario base';
      }
      
      console.log('👤 Usuario actual:', {
        id: profileData.id,
        name: `${userData.first_name} ${userData.last_name}`,
        role: userRole
      });
      
      return {
        id: String(profileData.id),
        name: `${userData.first_name} ${userData.last_name}`,
        email: userData.email,
        role: userRole as UserRole,
        permissions: [],
        active: true
      };
    } catch (error: any) {
      console.error('❌ Error al obtener usuario actual:', error);
      
      if (error.response?.status === 404) {
        console.warn('⚠️ Endpoint /users/me/ no disponible.');
      }
      
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_id');
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
