import { Module, ModuleType } from '~/types/module';
import { UserRole } from '~/types/auth';

// Datos mock para módulos
const MOCK_MODULES: Module[] = [
  {
    id: '1',
    name: 'Académico',
    description: 'Gestión de proyectos, mentores y estudiantes',
    icon: '🎓'
  },
  {
    id: '2',
    name: 'Producto',
    description: 'Gestión de productos y servicios',
    icon: '📦'
  },
  {
    id: '3',
    name: 'Administración',
    description: 'Gestión de usuarios, permisos y configuración del sistema',
    icon: '⚙️',
    adminOnly: true
  }
];

// Configuración de permisos por rol
const MODULE_PERMISSIONS: Record<UserRole, ModuleType[]> = {
  'SuperAdmin': ['Académico', 'Producto', 'Administración'],
  'Admin': ['Académico', 'Producto', 'Administración'],
  'Mentor': ['Académico'],
  'Estudiante': ['Académico'],
  'Trabajador': ['Producto'],
  'Usuario base': []
};

export const ModuleService = {
  getModules: async (userRole: UserRole): Promise<Module[]> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get('/modules/');
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      
      // Filtrar módulos según el rol del usuario
      const allowedModuleTypes = MODULE_PERMISSIONS[userRole] || [];
      const filteredModules = MOCK_MODULES.filter(module => 
        module.name && allowedModuleTypes.includes(module.name)
      );
      
      return filteredModules;
    } catch (error) {
      console.error('Error al obtener módulos:', error);
      throw error;
    }
  },
  
  getModuleById: async (moduleId: string): Promise<Module | null> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get(`/modules/${moduleId}/`);
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      
      const module = MOCK_MODULES.find(m => m.id === moduleId) || null;
      return module;
    } catch (error) {
      console.error('Error al obtener módulo:', error);
      return null;
    }
  }
};
