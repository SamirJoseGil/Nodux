import { Outlet } from "@remix-run/react";
import { useEffect } from "react";
import { useModule } from "~/contexts/ModuleContext";

/**
 * Layout para el módulo académico
 */
export default function AcademicoLayout() {
    const { setActiveModule } = useModule();

    useEffect(() => {
        console.log('AcademicoLayout: estableciendo módulo Académico');
        setActiveModule('Académico');
    }, [setActiveModule]);

    return <Outlet />;
}
