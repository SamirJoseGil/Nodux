import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, RegisterData, UserRole } from '~/types/auth';
import { AuthService } from '~/services/authService';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = Cookies.get('access_token');
        if (token) {
          console.log('🔍 Inicializando autenticación con token existente');
          const currentUser = await AuthService.getCurrentUser();
          
          if (currentUser) {
            // Validar que el usuario tenga un rol válido
            if (!currentUser.role || currentUser.role === '') {
              console.error('🚨 Security: Usuario sin rol válido');
              currentUser.role = 'Usuario base';
            }

            console.log('✅ Usuario cargado exitosamente:', {
              id: currentUser.id,
              name: currentUser.name,
              email: currentUser.email,
              role: currentUser.role
            });
            
            setUser(currentUser);
            setIsAuthenticated(true);
          } else {
            console.log('⚠️ No se pudo obtener usuario, limpiando sesión');
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
            localStorage.removeItem('user_role');
            localStorage.removeItem('user_id');
          }
        } else {
          console.log('ℹ️ No hay token de acceso');
        }
      } catch (error) {
        console.error('❌ Error al inicializar autenticación:', error);
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_id');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      console.log('🔑 Intentando login desde contexto...');
      const response = await AuthService.login({ 
        email: usernameOrEmail,
        password 
      });
      
      console.log('✅ Respuesta de AuthService.login:', {
        hasUser: !!response.user,
        userId: response.user?.id,
        userName: response.user?.name,
        userRole: response.user?.role
      });
      
      if (!response.user) {
        throw new Error('No se recibió información del usuario');
      }
      
      if (!response.user.role || response.user.role === '') {
        console.warn('⚠️ Usuario sin rol asignado, usando "Usuario base"');
        response.user.role = 'Usuario base';
      }
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      console.log('✅ Login exitoso en contexto:', {
        name: response.user.name,
        role: response.user.role,
        email: response.user.email
      });
    } catch (error) {
      console.error('❌ Error en login desde contexto:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      console.log('📝 Iniciando registro con rol:', data.role);
      const response = await AuthService.register(data);
      
      if (!response.user.role || response.user.role === '') {
        console.warn('⚠️ Usuario registrado sin rol, usando el proporcionado:', data.role);
        response.user.role = data.role;
      }
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      console.log('✅ Registro exitoso:', {
        name: response.user.name,
        role: response.user.role,
        email: response.user.email
      });
    } catch (error) {
      console.error('❌ Error en registro desde contexto:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Cerrando sesión para:', user?.name);
      await AuthService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      sessionStorage.clear();
      console.log('✅ Sesión cerrada');
    }
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) {
      console.log('⚠️ hasRole: No hay usuario autenticado');
      return false;
    }
    
    const hasAccess = roles.includes(user.role);
    console.log('🔒 hasRole check:', {
      userRole: user.role,
      allowedRoles: roles,
      hasAccess
    });
    
    return hasAccess;
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export type { UserRole };
