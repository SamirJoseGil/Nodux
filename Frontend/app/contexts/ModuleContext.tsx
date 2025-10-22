import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useLocation } from '@remix-run/react';
import { ModuleType } from '../types/module';

type ModuleContextType = {
    activeModule: ModuleType;
    setActiveModule: (module: ModuleType) => void;
};

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

// Mapeo de rutas a nombres de módulos
const MODULE_PATH_MAP: Record<string, ModuleType> = {
    'academico': 'Académico',
    'producto': 'Producto',
    'administracion': 'Administración',
};

// Función para extraer el nombre del módulo desde la URL
function getModuleFromPath(pathname: string): ModuleType {
    const match = pathname.match(/\/modulo\/([^\/]+)/);
    if (match) {
        const modulePath = match[1].toLowerCase();
        return MODULE_PATH_MAP[modulePath] || null;
    }
    return null;
}

export const ModuleProvider = ({ children }: { children: ReactNode }) => {
    const [activeModule, setActiveModuleState] = useState<ModuleType>(null);
    const location = useLocation();

    // Efecto para cargar el módulo guardado al iniciar - solo una vez
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const savedModule = sessionStorage.getItem('activeModule');
                if (savedModule && (savedModule === 'Académico' || savedModule === 'Producto' || savedModule === 'Administración')) {
                    setActiveModuleState(savedModule as ModuleType);
                }
            } catch (error) {
                console.error('Error al leer de sessionStorage:', error);
            }
        }
    }, []);

    // Efecto para guardar en sessionStorage cuando cambie
    useEffect(() => {
        if (activeModule && typeof window !== 'undefined') {
            try {
                sessionStorage.setItem('activeModule', activeModule);
            } catch (error) {
                console.error('Error al escribir en sessionStorage:', error);
            }
        }
    }, [activeModule]);

    // Efecto para detectar el módulo desde la URL
    useEffect(() => {
        if (location.pathname.startsWith('/modulo/')) {
            const moduleFromPath = getModuleFromPath(location.pathname);

            if (moduleFromPath && moduleFromPath !== activeModule) {
                setActiveModuleState(moduleFromPath);
            }
        }
    }, [location.pathname, activeModule]);

    const setActiveModule = (module: ModuleType) => {
        setActiveModuleState(module);
    };

    const value = { activeModule, setActiveModule };

    return (
        <ModuleContext.Provider value={value}>
            {children}
        </ModuleContext.Provider>
    );
};

export const useModule = () => {
    const context = useContext(ModuleContext);
    if (context === undefined) {
        throw new Error('useModule debe usarse dentro de un ModuleProvider');
    }
    return context;
};
