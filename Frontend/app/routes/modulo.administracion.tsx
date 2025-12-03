import { Outlet } from "@remix-run/react";
import { useEffect } from "react";
import { useModule } from "~/contexts/ModuleContext";

/**
 * Layout para el módulo de administración con estilos Nodux
 */
export default function AdministracionLayout() {
    const { setActiveModule } = useModule();

    useEffect(() => {
        console.log("⚙️ AdministracionLayout: estableciendo módulo Administración");
        setActiveModule("Administración");
    }, [setActiveModule]);

    return (
        <div className="min-h-screen bg-zafiro-500">
            <Outlet />
        </div>
    );
}
