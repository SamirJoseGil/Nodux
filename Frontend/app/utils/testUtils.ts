import { AuthService } from "~/services/authService";
import { ModuleService } from "~/services/moduleService";
import { 
  MentorService, 
  ProjectService, 
  GroupService,
} from "~/services/academicService";

/**
 * Utilidad para probar todas las funcionalidades del sistema
 */
export const testAllServices = async () => {
  console.log('🧪 Iniciando pruebas de servicios...');
  
  try {
    // 1. Probar servicios de autenticación
    console.log('👤 Probando AuthService...');
    const loginResult = await AuthService.login({ email: 'test@example.com', password: 'password' });
    console.log('✅ Login exitoso');
    
    const users = await AuthService.getUsers();
    console.log(`✅ Se obtuvieron ${users.length} usuarios`);
    
    // 2. Probar servicios de módulos
    console.log('🧩 Probando ModuleService...');
    const modules = await ModuleService.getModules('Admin');
    console.log(`✅ Se obtuvieron ${modules.length} módulos`);
    
    // 3. Probar servicios académicos
    console.log('🎓 Probando servicios académicos...');
    
    // Mentores
    const mentors = await MentorService.getMentors();
    console.log(`✅ Se obtuvieron ${mentors.length} mentores`);
    
    // Proyectos
    const projects = await ProjectService.getProjects();
    console.log(`✅ Se obtuvieron ${projects.length} proyectos`);

    return {
      status: 'success',
      results: {
        auth: { users: users.length },
        modules: { count: modules.length },
        academic: {
          mentors: mentors.length,
          projects: projects.length,
        }
      }
    };
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

export const testApplicationRoutes = () => {
  const routes = [
    { path: '/', name: 'Home', protected: false },
    { path: '/login', name: 'Login', protected: false },
    { path: '/registro', name: 'Registro', protected: false },
    { path: '/selector-modulo', name: 'Selector de módulos', protected: true },
    { path: '/modulo/academico/dashboard', name: 'Dashboard académico (Admin)', protected: true },
    { path: '/modulo/producto/dashboard', name: 'Dashboard producto (Admin)', protected: true },
    { path: '/modulo/academico/mentor/dashboard', name: 'Dashboard mentor', protected: true },
    { path: '/modulo/academico/estudiante/dashboard', name: 'Dashboard estudiante', protected: true },
    { path: '/modulo/academico/admin/users', name: 'Admin de usuarios', protected: true },
    { path: '/modulo/academico/admin/permissions', name: 'Admin de permisos', protected: true },
    { path: '/healthcheck', name: 'Healthcheck', protected: false },
  ];
  
  return routes;
};
