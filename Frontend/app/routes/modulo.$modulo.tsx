import { useEffect } from "react";
import { Outlet, useParams, useLocation, useNavigate } from "@remix-run/react";
import { useModule } from "~/contexts/ModuleContext";

/**
 * Este componente sirve como layout compartido para rutas dinámicas bajo /modulo/:modulo
 * Solo se usa para módulos que no tienen una ruta específica definida
 */
export default function ModuloLayout() {
    const { modulo } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { setActiveModule } = useModule();

    useEffect(() => {
        // Si llegamos aquí con academico, producto o administracion, redirigir
        // Esto es un fallback por si las rutas específicas no se cargan
        if (modulo === 'academico' || modulo === 'producto' || modulo === 'administracion') {
            console.warn(`ModuloLayout: redireccionando desde ruta dinámica ${modulo} a ruta específica`);
            navigate(`/modulo/${modulo}/dashboard`, { replace: true });
            return;
        }

        if (modulo) {
            const decodedModulo = decodeURIComponent(modulo);
            const formattedModulo = decodedModulo.charAt(0).toUpperCase() + decodedModulo.slice(1);
            console.log(`ModuloLayout: estableciendo módulo activo: ${formattedModulo}`);
            setActiveModule(formattedModulo as any);
        }
    }, [modulo, setActiveModule, navigate]);

    console.log(`ModuloLayout renderizado: ${location.pathname}, módulo: ${modulo}`);

    return <Outlet />;
}
