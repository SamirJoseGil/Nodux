import { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
    isCollapsed: boolean;
    isPinned: boolean;
    toggleCollapsed: () => void;
    togglePinned: () => void;
    setCollapsed: (collapsed: boolean) => void;
    setPinned: (pinned: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
    children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isPinned, setIsPinned] = useState(true);

    const toggleCollapsed = () => {
        setIsCollapsed(!isCollapsed);
    };

    const togglePinned = () => {
        setIsPinned(!isPinned);
    };

    const setCollapsed = (collapsed: boolean) => {
        setIsCollapsed(collapsed);
    };

    const setPinned = (pinned: boolean) => {
        setIsPinned(pinned);
    };

    return (
        <SidebarContext.Provider
            value={{
                isCollapsed,
                isPinned,
                toggleCollapsed,
                togglePinned,
                setCollapsed,
                setPinned,
            }}
        >
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
