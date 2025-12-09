import { Outlet } from "@remix-run/react";
import { useEffect } from "react";
import { useModule } from "~/contexts/ModuleContext";

/**
 * Layout para el módulo de producto
 */
export default function ProductoLayout() {
    const { setActiveModule } = useModule();

    useEffect(() => {
        console.log('ProductoLayout: estableciendo módulo Producto');
        setActiveModule('Producto');
    }, [setActiveModule]);

    return <Outlet />;
}
