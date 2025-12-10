import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SidebarContextType {
    isCollapsed: boolean;
    isPinned: boolean;
    toggleCollapse: () => void;
    togglePin: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
    // ✅ Recuperar estado del localStorage
    const [isPinned, setIsPinned] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sidebarPinned');
            return saved === 'true';
        }
        return false;
    });

    // ✅ En desktop, el sidebar está abierto si está pinned
    // En mobile, está cerrado por defecto
    const [isCollapsed, setIsCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            const isMobile = window.innerWidth < 1024;
            const saved = localStorage.getItem('sidebarPinned');
            return isMobile ? true : saved !== 'true';
        }
        return true;
    });

    // ✅ Persistir el estado de "pinned" en localStorage
    useEffect(() => {
        localStorage.setItem('sidebarPinned', String(isPinned));
    }, [isPinned]);

    // Manejar cambios de tamaño de pantalla
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                // Desktop: abrir si está pinned
                if (isPinned) {
                    setIsCollapsed(false);
                }
            } else {
                // Mobile: siempre cerrar al cambiar a mobile
                setIsCollapsed(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isPinned]);

    const toggleCollapse = () => {
        console.log('🔄 toggleCollapse llamado, isCollapsed actual:', isCollapsed);
        setIsCollapsed(prev => !prev);
    };

    const togglePin = () => {
        console.log('📌 togglePin llamado, isPinned actual:', isPinned);
        setIsPinned(prev => {
            const newPinned = !prev;
            // Si se pinea, abrir el sidebar
            if (newPinned) {
                setIsCollapsed(false);
            }
            return newPinned;
        });
    };

    return (
        <SidebarContext.Provider value={{ 
            isCollapsed, 
            isPinned, 
            toggleCollapse, 
            togglePin 
        }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}
