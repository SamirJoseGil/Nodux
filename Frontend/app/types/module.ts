export type ModuleType = 'Académico' | 'Producto' | 'Administración' | null;

export interface Module {
  id: string;
  name: ModuleType;
  description: string;
  icon: string;
  adminOnly?: boolean;
}
