import { Outlet } from "@remix-run/react";
import { useEffect } from "react";
import { useModule } from "~/contexts/ModuleContext";

/**
 * Layout para el módulo académico con estilos Nodux
 */
export default function AcademicoLayout() {
    const { setActiveModule } = useModule();

    useEffect(() => {
        console.log("🎓 AcademicoLayout: estableciendo módulo Académico");
        setActiveModule("Académico");
    }, [setActiveModule]);

    return (
        <div className="min-h-screen bg-zafiro-500">
            <Outlet />
        </div>
    );
}
