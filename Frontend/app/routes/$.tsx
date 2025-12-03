import type { MetaFunction } from "@remix-run/node";
import { useLocation } from "@remix-run/react";
import NotFound from "~/components/ErrorBoundary/NotFound";

export const meta: MetaFunction = () => {
    return [
        { title: "404 - Página no encontrada | Nodux" },
        {
            name: "description",
            content: "La página que buscas no existe en Nodux",
        },
    ];
};

export default function CatchAllRoute() {
    const location = useLocation();

    return (
        <NotFound
            message={`La ruta "${location.pathname}" no fue encontrada`}
        />
    );
}
