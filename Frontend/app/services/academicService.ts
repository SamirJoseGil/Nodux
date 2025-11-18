import { 
  Mentor, Project, Group, Student, Schedule, HourRecord, Metric 
} from '~/types/academic';
import { apiClient } from '~/utils/api';

// Datos mock para mentores
const MOCK_MENTORES: Mentor[] = [
  {
    id: '1',
    userId: '5',
    name: 'Juan Pérez',
    email: 'juan.perez@nodux.com',
    specialty: 'Desarrollo Web',
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'Especialista en React y Node.js con 10 años de experiencia',
    status: 'active',
    totalHours: 125,
    projectCount: 3,
    expertise: ['React', 'Node.js', 'MongoDB']
  },
  {
    id: '2',
    userId: '6',
    name: 'María García',
    email: 'maria.garcia@nodux.com',
    specialty: 'Diseño UX/UI',
    profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
    bio: 'Diseñadora con enfoque en experiencia de usuario',
    status: 'active',
    totalHours: 80,
    projectCount: 2,
    expertise: ['Figma', 'Adobe XD', 'Sketch']
  },
  {
    id: '3',
    userId: '7',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@nodux.com',
    specialty: 'Ciencia de Datos',
    profileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
    bio: 'Especialista en Machine Learning y análisis de datos',
    status: 'inactive',
    totalHours: 45,
    projectCount: 1,
    expertise: ['Python', 'TensorFlow', 'SQL']
  }
];

// Datos mock para proyectos
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Plataforma E-learning',
    description: 'Desarrollo de plataforma de cursos online con React',
    startDate: '2023-01-15',
    endDate: '2023-07-30',
    status: 'active',
    totalHours: 240,
    mentorCount: 2,
    studentCount: 12
  },
  {
    id: '2',
    name: 'App Móvil de Finanzas',
    description: 'Aplicación para control de gastos personales con React Native',
    startDate: '2023-03-10',
    status: 'active',
    totalHours: 180,
    mentorCount: 1,
    studentCount: 8
  },
  {
    id: '3',
    name: 'Dashboard Analítico',
    description: 'Sistema de visualización de datos empresariales',
    startDate: '2022-11-05',
    endDate: '2023-05-20',
    status: 'completed',
    totalHours: 320,
    mentorCount: 2,
    studentCount: 10
  }
];

// Datos mock para estudiantes
const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    userId: '10',
    name: 'Ana Martínez',
    email: 'ana.martinez@nodux.com',
    status: 'active',
    profileImage: 'https://randomuser.me/api/portraits/women/10.jpg',
  },
  {
    id: '2',
    userId: '11',
    name: 'Pedro Gómez',
    email: 'pedro.gomez@nodux.com',
    status: 'active',
    profileImage: 'https://randomuser.me/api/portraits/men/11.jpg',
  },
  {
    id: '3',
    userId: '12',
    name: 'Sofía López',
    email: 'sofia.lopez@nodux.com',
    status: 'inactive',
    profileImage: 'https://randomuser.me/api/portraits/women/12.jpg',
  }
];

// Datos mock para grupos
const MOCK_GROUPS: Group[] = [
  {
    id: '1',
    name: 'Grupo Frontend',
    projectId: '1',
    mentorId: '1',
    students: [MOCK_STUDENTS[0], MOCK_STUDENTS[1]],
    projectName: 'Plataforma E-learning',
    mentorName: 'Juan Pérez'
  },
  {
    id: '2',
    name: 'Grupo Diseño',
    projectId: '1',
    mentorId: '2',
    students: [MOCK_STUDENTS[2]],
    projectName: 'Plataforma E-learning',
    mentorName: 'María García'
  },
  {
    id: '3',
    name: 'Grupo App',
    projectId: '2',
    mentorId: '1',
    students: [MOCK_STUDENTS[0], MOCK_STUDENTS[2]],
    projectName: 'App Móvil de Finanzas',
    mentorName: 'Juan Pérez'
  }
];

// Datos mock para horarios
const MOCK_SCHEDULES: Schedule[] = [
  {
    id: '1',
    groupId: '1',
    day: 'Lunes',
    startTime: '15:00',
    endTime: '17:00',
    location: 'Sala Virtual 1'
  },
  {
    id: '2',
    groupId: '1',
    day: 'Miércoles',
    startTime: '15:00',
    endTime: '17:00',
    location: 'Sala Virtual 1'
  },
  {
    id: '3',
    groupId: '2',
    day: 'Martes',
    startTime: '10:00',
    endTime: '12:00',
    location: 'Sala Virtual 2'
  },
  {
    id: '4',
    groupId: '3',
    day: 'Jueves',
    startTime: '14:00',
    endTime: '16:00',
    location: 'Sala Virtual 3'
  }
];

// Datos mock para registro de horas
const MOCK_HOUR_RECORDS: HourRecord[] = [
  {
    id: '1',
    mentorId: '1',
    projectId: '1',
    date: '2023-06-10',
    hours: 4,
    description: 'Sesión de desarrollo Frontend con Grupo Frontend',
    status: 'approved',
    mentorName: 'Juan Pérez',
    projectName: 'Plataforma E-learning'
  },
  {
    id: '2',
    mentorId: '1',
    projectId: '2',
    date: '2023-06-11',
    hours: 3,
    description: 'Revisión de código y resolución de bugs',
    status: 'approved',
    mentorName: 'Juan Pérez',
    projectName: 'App Móvil de Finanzas'
  },
  {
    id: '3',
    mentorId: '2',
    projectId: '1',
    date: '2023-06-12',
    hours: 5,
    description: 'Diseño de interfaces y wireframes',
    status: 'pending',
    mentorName: 'María García',
    projectName: 'Plataforma E-learning'
  }
];

// Datos mock para métricas
const MOCK_METRICS: Metric[] = [
  {
    id: '1',
    name: 'Proyectos Activos',
    value: 2,
    type: 'count',
    category: 'projects'
  },
  {
    id: '2',
    name: 'Total Mentores',
    value: 3,
    type: 'count',
    category: 'mentors'
  },
  {
    id: '3',
    name: 'Total Estudiantes',
    value: 3,
    type: 'count',
    category: 'students'
  },
  {
    id: '4',
    name: 'Horas Registradas',
    value: 12,
    type: 'count',
    category: 'hours'
  }
];

export const MentorService = {
  getMentors: async (): Promise<Mentor[]> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get('/mentors/');
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      return MOCK_MENTORES;
    } catch (error) {
      console.error('Error al obtener mentores:', error);
      throw error;
    }
  },
  
  getMentorById: async (mentorId: string): Promise<Mentor | null> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get(`/mentors/${mentorId}/`);
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 400)); // Simulación de latencia
      
      const mentor = MOCK_MENTORES.find(m => m.id === mentorId) || null;
      return mentor;
    } catch (error) {
      console.error('Error al obtener mentor:', error);
      return null;
    }
  },
  
  createMentor: async (mentorData: Partial<Mentor>): Promise<Mentor> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.post('/mentors/', mentorData);
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      
      const newMentor: Mentor = {
        id: `${MOCK_MENTORES.length + 1}`,
        userId: `${10 + MOCK_MENTORES.length}`,
        name: mentorData.name || 'Nuevo Mentor',
        email: mentorData.email || `mentor${MOCK_MENTORES.length + 1}@nodux.com`,
        specialty: mentorData.specialty || 'Desarrollo',
        bio: mentorData.bio || '',
        status: mentorData.status || 'active',
        totalHours: 0,
        projectCount: 0,
        expertise: mentorData.expertise || []
      };
      
      MOCK_MENTORES.push(newMentor);
      
      return newMentor;
    } catch (error) {
      console.error('Error al crear mentor:', error);
      throw error;
    }
  },
  
  updateMentor: async (mentorId: string, mentorData: Partial<Mentor>): Promise<Mentor> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.patch(`/mentors/${mentorId}/`, mentorData);
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      
      const mentorIndex = MOCK_MENTORES.findIndex(m => m.id === mentorId);
      if (mentorIndex === -1) throw new Error('Mentor no encontrado');
      
      MOCK_MENTORES[mentorIndex] = {
        ...MOCK_MENTORES[mentorIndex],
        ...mentorData
      };
      
      return MOCK_MENTORES[mentorIndex];
    } catch (error) {
      console.error('Error al actualizar mentor:', error);
      throw error;
    }
  },
  
  deleteMentor: async (mentorId: string): Promise<void> => {
    try {
      // En producción, esto sería una llamada a la API
      // await apiClient.delete(`/mentors/${mentorId}/`);
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      
      const mentorIndex = MOCK_MENTORES.findIndex(m => m.id === mentorId);
      if (mentorIndex === -1) throw new Error('Mentor no encontrado');
      
      MOCK_MENTORES.splice(mentorIndex, 1);
    } catch (error) {
      console.error('Error al eliminar mentor:', error);
      throw error;
    }
  },

  getMentorProjects: async (mentorId: string): Promise<Project[]> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get(`/mentors/${mentorId}/projects/`);
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulación de latencia
      
      // Filtramos los grupos donde participa el mentor
      const mentorGroups = MOCK_GROUPS.filter(g => g.mentorId === mentorId);
      
      // Obtenemos los proyectos únicos de esos grupos
      const projectIds = [...new Set(mentorGroups.map(g => g.projectId))];
      const mentorProjects = MOCK_PROJECTS.filter(p => projectIds.includes(p.id));
      
      return mentorProjects;
    } catch (error) {
      console.error('Error al obtener proyectos del mentor:', error);
      throw error;
    }
  },

  getMentorGroups: async (mentorId: string): Promise<Group[]> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get(`/mentors/${mentorId}/groups/`);
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulación de latencia
      
      const mentorGroups = MOCK_GROUPS.filter(g => g.mentorId === mentorId);
      return mentorGroups;
    } catch (error) {
      console.error('Error al obtener grupos del mentor:', error);
      throw error;
    }
  },

  getMentorHours: async (mentorId: string): Promise<HourRecord[]> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get(`/mentors/${mentorId}/hours/`);
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulación de latencia
      
      const mentorHours = MOCK_HOUR_RECORDS.filter(h => h.mentorId === mentorId);
      return mentorHours;
    } catch (error) {
      console.error('Error al obtener horas del mentor:', error);
      throw error;
    }
  },

  // Método añadido para obtener proyectos por usuario
  getProjectsByUser: async (userId: string): Promise<Project[]> => {
    try {
      // Simulación de datos
      await new Promise(resolve => setTimeout(resolve, 600));
      return MOCK_PROJECTS.slice(0, 2); // Devuelve los primeros 2 proyectos como ejemplo
    } catch (error) {
      console.error('Error al obtener proyectos del usuario:', error);
      throw error;
    }
  },
  
  // Método añadido para obtener grupos por mentor
  getGroupsByMentor: async (userId: string): Promise<Group[]> => {
    try {
      // Simulación de datos
      await new Promise(resolve => setTimeout(resolve, 600));
      return MOCK_GROUPS.slice(0, 2); // Devuelve los primeros 2 grupos como ejemplo
    } catch (error) {
      console.error('Error al obtener grupos del mentor:', error);
      throw error;
    }
  },
};

export const ProjectService = {
  getProjects: async (): Promise<Project[]> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get('/projects/');
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      return MOCK_PROJECTS;
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
      throw error;
    }
  },
  
  getProjectById: async (projectId: string): Promise<Project | null> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get(`/projects/${projectId}/`);
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulación de latencia
      
      const project = MOCK_PROJECTS.find(p => p.id === projectId) || null;
      
      if (project) {
        // Agregamos mentores y grupos al proyecto
        const projectGroups = MOCK_GROUPS.filter(g => g.projectId === projectId);
        const mentorIds = [...new Set(projectGroups.map(g => g.mentorId))];
        const projectMentors = MOCK_MENTORES.filter(m => mentorIds.includes(m.id));
        
        return {
          ...project,
          groups: projectGroups,
          mentors: projectMentors
        };
      }
      
      return project;
    } catch (error) {
      console.error('Error al obtener proyecto:', error);
      return null;
    }
  },
  
  createProject: async (projectData: Partial<Project>): Promise<Project> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.post('/projects/', projectData);
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      
      const newProject: Project = {
        id: `${MOCK_PROJECTS.length + 1}`,
        name: projectData.name || 'Nuevo Proyecto',
        description: projectData.description || '',
        startDate: projectData.startDate || new Date().toISOString().split('T')[0],
        endDate: projectData.endDate,
        status: projectData.status || 'active',
        totalHours: 0,
        mentorCount: 0,
        studentCount: 0
      };
      
      MOCK_PROJECTS.push(newProject);
      
      return newProject;
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      throw error;
    }
  },
  
  updateProject: async (projectId: string, projectData: Partial<Project>): Promise<Project> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.patch(`/projects/${projectId}/`, projectData);
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      
      const projectIndex = MOCK_PROJECTS.findIndex(p => p.id === projectId);
      if (projectIndex === -1) throw new Error('Proyecto no encontrado');
      
      MOCK_PROJECTS[projectIndex] = {
        ...MOCK_PROJECTS[projectIndex],
        ...projectData
      };
      
      return MOCK_PROJECTS[projectIndex];
    } catch (error) {
      console.error('Error al actualizar proyecto:', error);
      throw error;
    }
  },
  
  deleteProject: async (projectId: string): Promise<void> => {
    try {
      // En producción, esto sería una llamada a la API
      // await apiClient.delete(`/projects/${projectId}/`);
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      
      const projectIndex = MOCK_PROJECTS.findIndex(p => p.id === projectId);
      if (projectIndex === -1) throw new Error('Proyecto no encontrado');
      
      MOCK_PROJECTS.splice(projectIndex, 1);
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
      throw error;
    }
  },
  
  getProjectGroups: async (projectId: string): Promise<Group[]> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get(`/projects/${projectId}/groups/`);
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulación de latencia
      
      const projectGroups = MOCK_GROUPS.filter(g => g.projectId === projectId);
      return projectGroups;
    } catch (error) {
      console.error('Error al obtener grupos del proyecto:', error);
      throw error;
    }
  },
  
  addMentorToProject: async (projectId: string, mentorId: string): Promise<void> => {
    try {
      // En producción, esto sería una llamada a la API
      // await apiClient.post(`/projects/${projectId}/mentors/`, { mentor_id: mentorId });
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      
      // En nuestra estructura mock, esto no tiene un efecto real ya que la relación
      // se representa a través de los grupos.
    } catch (error) {
      console.error('Error al agregar mentor al proyecto:', error);
      throw error;
    }
  }
};

export const GroupService = {
  getGroups: async (): Promise<Group[]> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get('/groups/');
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      return MOCK_GROUPS;
    } catch (error) {
      console.error('Error al obtener grupos:', error);
      throw error;
    }
  },
  
  getGroupById: async (groupId: string): Promise<Group | null> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get(`/groups/${groupId}/`);
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulación de latencia
      
      const group = MOCK_GROUPS.find(g => g.id === groupId) || null;
      return group;
    } catch (error) {
      console.error('Error al obtener grupo:', error);
      return null;
    }
  },
  
  createGroup: async (groupData: Partial<Group>): Promise<Group> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.post('/groups/', groupData);
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      
      // Obtener información del proyecto y mentor para el nombre
      const project = MOCK_PROJECTS.find(p => p.id === groupData.projectId);
      const mentor = MOCK_MENTORES.find(m => m.id === groupData.mentorId);
      
      const newGroup: Group = {
        id: `${MOCK_GROUPS.length + 1}`,
        name: groupData.name || `Grupo ${MOCK_GROUPS.length + 1}`,
        projectId: groupData.projectId || '',
        mentorId: groupData.mentorId || '',
        students: groupData.students || [],
        projectName: project?.name,
        mentorName: mentor?.name
      };
      
      MOCK_GROUPS.push(newGroup);
      
      return newGroup;
    } catch (error) {
      console.error('Error al crear grupo:', error);
      throw error;
    }
  },
  
  updateGroup: async (groupId: string, groupData: Partial<Group>): Promise<Group> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.patch(`/groups/${groupId}/`, groupData);
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      
      const groupIndex = MOCK_GROUPS.findIndex(g => g.id === groupId);
      if (groupIndex === -1) throw new Error('Grupo no encontrado');
      
      // Si cambiaron el proyecto o mentor, actualizamos los nombres
      if (groupData.projectId) {
        const project = MOCK_PROJECTS.find(p => p.id === groupData.projectId);
        if (project) {
          groupData.projectName = project.name;
        }
      }
      
      if (groupData.mentorId) {
        const mentor = MOCK_MENTORES.find(m => m.id === groupData.mentorId);
        if (mentor) {
          groupData.mentorName = mentor.name;
        }
      }
      
      MOCK_GROUPS[groupIndex] = {
        ...MOCK_GROUPS[groupIndex],
        ...groupData
      };
      
      return MOCK_GROUPS[groupIndex];
    } catch (error) {
      console.error('Error al actualizar grupo:', error);
      throw error;
    }
  },
  
  deleteGroup: async (groupId: string): Promise<void> => {
    try {
      // En producción, esto sería una llamada a la API
      // await apiClient.delete(`/groups/${groupId}/`);
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      
      const groupIndex = MOCK_GROUPS.findIndex(g => g.id === groupId);
      if (groupIndex === -1) throw new Error('Grupo no encontrado');
      
      MOCK_GROUPS.splice(groupIndex, 1);
    } catch (error) {
      console.error('Error al eliminar grupo:', error);
      throw error;
    }
  },
  
  getGroupStudents: async (groupId: string): Promise<Student[]> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get(`/groups/${groupId}/students/`);
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulación de latencia
      
      const group = MOCK_GROUPS.find(g => g.id === groupId);
      return group?.students || [];
    } catch (error) {
      console.error('Error al obtener estudiantes del grupo:', error);
      throw error;
    }
  },
  
  addStudentToGroup: async (groupId: string, studentId: string): Promise<void> => {
    try {
      // En producción, esto sería una llamada a la API
      // await apiClient.post(`/groups/${groupId}/students/`, { student_id: studentId });
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      
      const groupIndex = MOCK_GROUPS.findIndex(g => g.id === groupId);
      if (groupIndex === -1) throw new Error('Grupo no encontrado');
      
      const student = MOCK_STUDENTS.find(s => s.id === studentId);
      if (!student) throw new Error('Estudiante no encontrado');
      
      // Verificamos que el estudiante no esté ya en el grupo
      if (!MOCK_GROUPS[groupIndex].students.some(s => s.id === studentId)) {
        MOCK_GROUPS[groupIndex].students.push(student);
      }
    } catch (error) {
      console.error('Error al agregar estudiante al grupo:', error);
      throw error;
    }
  },
  
  removeStudentFromGroup: async (groupId: string, studentId: string): Promise<void> => {
    try {
      // En producción, esto sería una llamada a la API
      // await apiClient.delete(`/groups/${groupId}/students/${studentId}/`);
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      
      const groupIndex = MOCK_GROUPS.findIndex(g => g.id === groupId);
      if (groupIndex === -1) throw new Error('Grupo no encontrado');
      
      MOCK_GROUPS[groupIndex].students = MOCK_GROUPS[groupIndex].students.filter(s => s.id !== studentId);
    } catch (error) {
      console.error('Error al eliminar estudiante del grupo:', error);
      throw error;
    }
  },
  
  getGroupSchedules: async (groupId: string): Promise<Schedule[]> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get(`/groups/${groupId}/schedules/`);
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulación de latencia
      
      const groupSchedules = MOCK_SCHEDULES.filter(s => s.groupId === groupId);
      return groupSchedules;
    } catch (error) {
      console.error('Error al obtener horarios del grupo:', error);
      throw error;
    }
  },
};

export const StudentService = {
  getStudents: async (): Promise<Student[]> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get('/students/');
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      return MOCK_STUDENTS;
    } catch (error) {
      console.error('Error al obtener estudiantes:', error);
      throw error;
    }
  },
  
  getStudentById: async (studentId: string): Promise<Student | null> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get(`/students/${studentId}/`);
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulación de latencia
      
      const student = MOCK_STUDENTS.find(s => s.id === studentId) || null;
      
      if (student) {
        // Agregamos los grupos del estudiante
        const studentGroups = MOCK_GROUPS.filter(g => 
          g.students.some(s => s.id === studentId)
        );
        
        return {
          ...student,
          groups: studentGroups
        };
      }
      
      return student;
    } catch (error) {
      console.error('Error al obtener estudiante:', error);
      return null;
    }
  },
  
  getStudentGroups: async (studentId: string): Promise<Group[]> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get(`/students/${studentId}/groups/`);
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulación de latencia
      
      const studentGroups = MOCK_GROUPS.filter(g => 
        g.students.some(s => s.id === studentId)
      );
      
      return studentGroups;
    } catch (error) {
      console.error('Error al obtener grupos del estudiante:', error);
      throw error;
    }
  },

  // Método añadido para obtener todos los grupos
  getGroups: async (): Promise<Group[]> => {
    try {
      // Simulación de datos
      await new Promise(resolve => setTimeout(resolve, 600));
      return MOCK_GROUPS; // Devuelve todos los grupos
    } catch (error) {
      console.error('Error al obtener grupos:', error);
      throw error;
    }
  }
};

export const HourService = {
  getHourRecords: async (): Promise<HourRecord[]> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get('/hours/');
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      return MOCK_HOUR_RECORDS;
    } catch (error) {
      console.error('Error al obtener registros de horas:', error);
      throw error;
    }
  },
  
  getHourRecordById: async (recordId: string): Promise<HourRecord | null> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get(`/hours/${recordId}/`);
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulación de latencia
      
      const record = MOCK_HOUR_RECORDS.find(r => r.id === recordId) || null;
      return record;
    } catch (error) {
      console.error('Error al obtener registro de horas:', error);
      return null;
    }
  },
  
  createHourRecord: async (recordData: Partial<HourRecord>): Promise<HourRecord> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.post('/hours/', recordData);
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      
      // Obtener información del mentor y proyecto para los nombres
      const mentor = MOCK_MENTORES.find(m => m.id === recordData.mentorId);
      const project = MOCK_PROJECTS.find(p => p.id === recordData.projectId);
      
      const newRecord: HourRecord = {
        id: `${MOCK_HOUR_RECORDS.length + 1}`,
        mentorId: recordData.mentorId || '',
        projectId: recordData.projectId || '',
        date: recordData.date || new Date().toISOString().split('T')[0],
        hours: recordData.hours || 1,
        description: recordData.description || '',
        status: 'pending',
        mentorName: mentor?.name,
        projectName: project?.name
      };
      
      MOCK_HOUR_RECORDS.push(newRecord);
      
      return newRecord;
    } catch (error) {
      console.error('Error al crear registro de horas:', error);
      throw error;
    }
  },
  
  updateHourRecord: async (recordId: string, recordData: Partial<HourRecord>): Promise<HourRecord> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.patch(`/hours/${recordId}/`, recordData);
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      
      const recordIndex = MOCK_HOUR_RECORDS.findIndex(r => r.id === recordId);
      if (recordIndex === -1) throw new Error('Registro no encontrado');
      
      // Si cambiaron el mentor o proyecto, actualizamos los nombres
      if (recordData.mentorId) {
        const mentor = MOCK_MENTORES.find(m => m.id === recordData.mentorId);
        if (mentor) {
          recordData.mentorName = mentor.name;
        }
      }
      
      if (recordData.projectId) {
        const project = MOCK_PROJECTS.find(p => p.id === recordData.projectId);
        if (project) {
          recordData.projectName = project.name;
        }
      }
      
      MOCK_HOUR_RECORDS[recordIndex] = {
        ...MOCK_HOUR_RECORDS[recordIndex],
        ...recordData
      };
      
      return MOCK_HOUR_RECORDS[recordIndex];
    } catch (error) {
      console.error('Error al actualizar registro de horas:', error);
      throw error;
    }
  },
  
  deleteHourRecord: async (recordId: string): Promise<void> => {
    try {
      // En producción, esto sería una llamada a la API
      // await apiClient.delete(`/hours/${recordId}/`);
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      
      const recordIndex = MOCK_HOUR_RECORDS.findIndex(r => r.id === recordId);
      if (recordIndex === -1) throw new Error('Registro no encontrado');
      
      MOCK_HOUR_RECORDS.splice(recordIndex, 1);
    } catch (error) {
      console.error('Error al eliminar registro de horas:', error);
      throw error;
    }
  },
  
  getMentorHourRecords: async (mentorId: string): Promise<HourRecord[]> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get(`/mentors/${mentorId}/hours/`);
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulación de latencia
      
      const mentorRecords = MOCK_HOUR_RECORDS.filter(r => r.mentorId === mentorId);
      return mentorRecords;
    } catch (error) {
      console.error('Error al obtener registros de horas del mentor:', error);
      throw error;
    }
  },
  
  getProjectHourRecords: async (projectId: string): Promise<HourRecord[]> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get(`/projects/${projectId}/hours/`);
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulación de latencia
      
      const projectRecords = MOCK_HOUR_RECORDS.filter(r => r.projectId === projectId);
      return projectRecords;
    } catch (error) {
      console.error('Error al obtener registros de horas del proyecto:', error);
      throw error;
    }
  }
};

export const MetricService = {
  getMetrics: async (): Promise<Metric[]> => {
    try {
      // En producción, esto sería una llamada a la API
      // const response = await apiClient.get('/metrics/');
      // return response.data;
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia
      return MOCK_METRICS;
    } catch (error) {
      console.error('Error al obtener métricas:', error);
      throw error;
    }
  }
};
