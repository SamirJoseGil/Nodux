import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Nodux - Plataforma de Proyectos" },
    {
      name: "description",
      content: "Plataforma de gestión de proyectos y mentores",
    },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bienvenido a Nodux
        </h1>
        <p className="text-xl text-gray-600">
          Plataforma de gestión de proyectos y mentores
        </p>
      </div>
    </div>
  );
}
