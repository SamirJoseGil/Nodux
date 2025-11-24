import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService } from '~/services/authService';
import Cookies from 'js-cookie';

// Define los tipos para los roles y usuarios
export type UserRole = 'SuperAdmin' | 'Admin' | 'Mentor' | 'Estudiante' | 'Trabajador' | 'Usuario base';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    permissions: string[];
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: { email: string; password: string; name: string; role: UserRole }) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Verificar autenticación al cargar
    useEffect(() => {
        const checkAuthStatus = async () => {
            const accessToken = Cookies.get('access_token');

            if (accessToken) {
                try {
                    const currentUser = await AuthService.getCurrentUser();
                    setUser(currentUser);
                } catch (error) {
                    console.error('Error al verificar autenticación:', error);
                    Cookies.remove('access_token');
                    Cookies.remove('refresh_token');
                }
            }

            setIsLoading(false);
        };

        checkAuthStatus();
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await AuthService.login({ email, password });
            setUser(response.user);
        } catch (error: any) {
            console.error('Error durante el login:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData: { email: string; password: string; name: string; role: UserRole }): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await AuthService.register({
                email: userData.email,
                password: userData.password,
                name: userData.name,
                role: userData.role
            });
            setUser(response.user);
        } catch (error: any) {
            console.error('Error durante el registro:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await AuthService.logout();
            setUser(null);
            
            // Redirigir al home
            if (typeof window !== 'undefined') {
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Error durante el logout:', error);
            // Limpiar de todos modos
            setUser(null);
            if (typeof window !== 'undefined') {
                window.location.href = '/';
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};
