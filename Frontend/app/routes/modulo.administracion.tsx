import { Outlet, useParams } from "@remix-run/react";
import { useEffect } from "react";
import { useModule } from "~/contexts/ModuleContext";

/**
 * Layout para el módulo de administración
 */
export default function AdministracionLayout() {
    const { setActiveModule } = useModule();

    useEffect(() => {
        console.log('AdministracionLayout: estableciendo módulo Administración');
        setActiveModule('Administración');
    }, [setActiveModule]);

    return <Outlet />;
}
