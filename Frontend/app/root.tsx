// app/root.tsx
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";
import { AuthProvider } from "./contexts/AuthContext";
import { ModuleProvider } from "./contexts/ModuleContext";
import NotFound from "~/components/ErrorBoundary/NotFound";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ModuleProvider>
        <Outlet />
      </ModuleProvider>
    </AuthProvider>
  );
}

// Corregir el ErrorBoundary para que no cause problemas de anidamiento DOM
export function ErrorBoundary() {
  const error = useRouteError();

  console.error("Root ErrorBoundary:", error);

  // Manejo específico para errores 404
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <html lang="es">
          <head>
            <title>404 - Página no encontrada | Nodux</title>
            <link rel="icon" href="https://www.eafit.edu.co/sites/default/files/favicon-EAFIT_0.ico" type="image/vnd.microsoft.icon" />
            <Meta />
            <Links />
          </head>
          <body>
            <NotFound />
            <Scripts />
            <ScrollRestoration />
          </body>
        </html>
      );
    }

    return (
      <html lang="es">
        <head>
          <title>Error {error.status} | Nodux</title>
          <Meta />
          <Links />
        </head>
        <body>
          <NotFound
            message={`Error ${error.status}: ${error.statusText || "Ha ocurrido un error"}`}
          />
          <Scripts />
          <ScrollRestoration />
        </body>
      </html>
    );
  }

  // Para otros tipos de errores
  let errorMessage = "Ha ocurrido un error inesperado";
  if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <html lang="es">
      <head>
        <title>Error | Nodux</title>
        <Meta />
        <Links />
      </head>
      <body>
        <NotFound message={errorMessage} />
        <Scripts />
        <ScrollRestoration />
      </body>
    </html>
  );
}