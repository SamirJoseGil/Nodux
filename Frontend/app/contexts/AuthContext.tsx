import { createContext, useContext, useState, useEffect } from 'react';
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
    login: (email?: string, password?: string) => Promise<User>; // Corregido el tipo de retorno
    register: (userData: { email: string; password: string; name: string; role: UserRole }) => Promise<User>; // Corregido el tipo de retorno
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Verificar si hay un usuario en la sesión al cargar
    useEffect(() => {
        const checkAuthStatus = async () => {
            const accessToken = Cookies.get('access_token');

            if (accessToken) {
                try {
                    // Simulamos obtener información del usuario actual
                    // En un caso real, aquí harías una llamada a la API
                    setUser({
                        id: '1',
                        name: 'Usuario Demo',
                        email: 'demo@nodux.com',
                        role: 'Admin',
                        permissions: ['read:all', 'write:all', 'admin:all']
                    });
                } catch (error) {
                    console.error('Error al verificar autenticación', error);
                    Cookies.remove('access_token');
                }
            }

            setIsLoading(false);
        };

        checkAuthStatus();
    }, []);

    const login = async (email?: string, password?: string): Promise<User> => {
        setIsLoading(true);
        try {
            // Simulamos una respuesta exitosa de la API
            // En un entorno real, esto sería una llamada a la API

            // Simulamos una pequeña demora para dar sensación de proceso
            await new Promise(resolve => setTimeout(resolve, 800));

            // Creamos un token falso
            const fakeToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
                JSON.stringify({ user_id: '1', email: email || 'demo@nodux.com' })
            )}.fake-signature`;

            // Guardamos tokens en cookies
            Cookies.set('access_token', fakeToken, { expires: 1 / 24 }); // 1 hora
            Cookies.set('refresh_token', `${fakeToken}-refresh`, { expires: 7 }); // 7 días

            // Establecemos el usuario
            const demoUser = {
                id: '1',
                name: 'Usuario Demo',
                email: email || 'demo@nodux.com',
                role: 'Admin' as UserRole,
                permissions: ['read:all', 'write:all', 'admin:all']
            };

            setUser(demoUser);
            return demoUser;
        } catch (error) {
            console.error('Error durante el login', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData: { email: string; password: string; name: string; role: UserRole }): Promise<User> => {
        setIsLoading(true);
        try {
            // Simulamos una respuesta exitosa de la API
            await new Promise(resolve => setTimeout(resolve, 800));

            // Creamos un token falso
            const fakeToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
                JSON.stringify({ user_id: '1', email: userData.email })
            )}.fake-signature`;

            // Guardamos tokens en cookies
            Cookies.set('access_token', fakeToken, { expires: 1 / 24 }); // 1 hora
            Cookies.set('refresh_token', `${fakeToken}-refresh`, { expires: 7 }); // 7 días

            // Establecemos el usuario
            const newUser = {
                id: '1',
                name: userData.name,
                email: userData.email,
                role: userData.role,
                permissions: ['read:basic']
            };

            setUser(newUser);
            return newUser;
        } catch (error) {
            console.error('Error durante el registro', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        // Limpiar cookies y localStorage
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        localStorage.removeItem('user_role');

        // Limpiar el estado del usuario
        setUser(null);

        // Limpiar sessionStorage del módulo
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('activeModule');
        }

        // Redirigir a la página de inicio
        window.location.href = '/';
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
