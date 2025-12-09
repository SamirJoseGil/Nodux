import { Mentor, Project, Group, Schedule } from '~/types/academic';
import { apiClient } from '~/utils/api';

// MentorService
export const MentorService = {
  getMentors: async (): Promise<Mentor[]> => {
    const response = await apiClient.get('/mentors/');
    // Backend retorna paginado, acceder a results
    const data = response.data.results || response.data;
    return (Array.isArray(data) ? data : []).map((m: any) => ({
      id: String(m.id),
      userId: String(m.id),
      name: `${m.first_name} ${m.last_name}`,
      email: m.email,
      phone: m.phone || '',
      specialty: m.charge,
      profileImage: m.photo ?? undefined,
      bio: '',
      status: 'active' as const,
      expertise: [],
      createdAt: undefined,
    }));
  },

  getMentorById: async (mentorId: string): Promise<Mentor | null> => {
    const response = await apiClient.get(`/mentors/${mentorId}/`);
    const m = response.data;
    return {
      id: String(m.id),
      userId: String(m.id),
      name: `${m.first_name} ${m.last_name}`,
      email: m.email,
      phone: m.phone || '',
      specialty: m.charge,
      profileImage: m.photo ?? undefined,
      bio: '',
      status: 'active' as const,
      expertise: [],
      createdAt: undefined,
    };
  },

  createMentor: async (mentorData: Partial<Mentor>): Promise<Mentor> => {
    try {
      const nameParts = mentorData.name?.split(' ') || [''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || nameParts[0];
      
      // Generar username y password
      const username = mentorData.email?.split('@')[0] || `mentor_${Date.now()}`;
      const password = `Mentor${Date.now()}`;

      console.log('📤 Preparando datos del mentor:', {
        firstName,
        lastName,
        email: mentorData.email,
        username,
        phone: mentorData.phone,
        specialty: mentorData.specialty
      });

      // ✅ Estructura correcta según el backend
      const payload = {
        profile: {
          user: {
            first_name: firstName,
            last_name: lastName,
            email: mentorData.email || '',
            username: username,
            password: password
          },
          phone: mentorData.phone || ''
        },
        charge: mentorData.specialty || '',
        knowledge_level: 'basico'
      };

      console.log('📤 Payload a enviar:', JSON.stringify(payload, null, 2));

      const response = await apiClient.post('/mentors/', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('✅ Respuesta del servidor:', response.data);
      
      const m = response.data;
      return {
        id: String(m.id),
        userId: String(m.id),
        name: `${m.first_name} ${m.last_name}`,
        email: m.email,
        phone: m.phone || '',
        specialty: m.charge,
        profileImage: m.photo ?? undefined,
        bio: '',
        status: 'active' as const,
        expertise: [],
        createdAt: undefined,
      };
    } catch (error: any) {
      console.error('❌ Error al crear mentor:', error);
      console.error('📋 Detalles del error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Extraer mensajes de error específicos del backend
      if (error.response?.data) {
        const errorData = error.response.data;
        
        console.error('🔴 Errores de validación:', JSON.stringify(errorData, null, 2));
        
        // Procesar errores anidados de profile.user
        if (errorData.profile?.user) {
          const userErrors = errorData.profile.user;
          
          if (userErrors.email) {
            const emailErrors = Array.isArray(userErrors.email) 
              ? userErrors.email[0] 
              : userErrors.email;
            throw new Error(`Email: ${emailErrors}`);
          }
          
          if (userErrors.username) {
            const usernameErrors = Array.isArray(userErrors.username)
              ? userErrors.username[0]
              : userErrors.username;
            throw new Error(`Usuario: ${usernameErrors}`);
          }
          
          if (userErrors.password) {
            const passwordErrors = Array.isArray(userErrors.password)
              ? userErrors.password[0]
              : userErrors.password;
            throw new Error(`Contraseña: ${passwordErrors}`);
          }
          
          // Extraer el primer error encontrado
          const firstErrorKey = Object.keys(userErrors)[0];
          const firstError = userErrors[firstErrorKey];
          if (Array.isArray(firstError)) {
            throw new Error(`${firstErrorKey}: ${firstError[0]}`);
          }
        }
        
        if (errorData.charge) {
          const chargeErrors = Array.isArray(errorData.charge)
            ? errorData.charge[0]
            : errorData.charge;
          throw new Error(`Cargo: ${chargeErrors}`);
        }
        
        if (errorData.knowledge_level) {
          const levelErrors = Array.isArray(errorData.knowledge_level)
            ? errorData.knowledge_level[0]
            : errorData.knowledge_level;
          throw new Error(`Nivel: ${levelErrors}`);
        }
        
        // Error genérico
        const errorMsg = errorData.detail || 
                        errorData.message || 
                        JSON.stringify(errorData);
        throw new Error(`Error de validación: ${errorMsg}`);
      }
      
      throw new Error(error.message || 'Error al crear mentor');
    }
  },

  updateMentor: async (mentorId: string, mentorData: Partial<Mentor>): Promise<Mentor> => {
    try {
      const nameParts = mentorData.name?.split(' ') || [''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || nameParts[0];

      const payload = {
        user: {
          first_name: firstName,
          last_name: lastName,
          email: mentorData.email || ''
        },
        phone: mentorData.phone || '',
        charge: mentorData.specialty || '',
        knowledge_level: 'basico'
      };

      console.log('📤 Actualizando mentor:', JSON.stringify(payload, null, 2));

      const response = await apiClient.put(`/mentors/${mentorId}/`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const m = response.data;
      return {
        id: String(m.id),
        userId: String(m.id),
        name: `${m.first_name} ${m.last_name}`,
        email: m.email,
        phone: m.phone || '',
        specialty: m.charge,
        profileImage: m.photo ?? undefined,
        bio: '',
        status: 'active' as const,
        expertise: [],
        createdAt: undefined,
      };
    } catch (error: any) {
      console.error('❌ Error al actualizar mentor:', error);
      console.error('📋 Respuesta del servidor:', error.response?.data);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        const errorMsg = errorData.detail || 
                        errorData.message || 
                        JSON.stringify(errorData);
        throw new Error(errorMsg);
      }
      
      throw error;
    }
  },

  deleteMentor: async (mentorId: string): Promise<void> => {
    await apiClient.delete(`/mentors/${mentorId}/`);
  },
};

// ProjectService
export const ProjectService = {
  getProjects: async (): Promise<Project[]> => {
    const response = await apiClient.get('/projects/');
    const data = response.data.results || response.data;
    return (Array.isArray(data) ? data : []).map((p: any) => ({
      id: String(p.id),
      name: p.name,
      description: '',
      startDate: '',
      endDate: '',
      status: p.is_active ? 'active' : 'pending',
      totalHours: undefined,
      mentorCount: undefined,
      studentCount: undefined,
      groups: Array.isArray(p.groups)
        ? p.groups.map((g: any) => ({
            id: String(g.id),
            name: '',
            projectId: String(g.project),
            mentorId: String(g.mentor),
            students: [],
            schedule: g.schedule
              ? [{
                  id: String(g.schedule.id),
                  groupId: String(g.id),
                  day: String(g.schedule.day),
                  startTime: g.schedule.start_time,
                  endTime: g.schedule.end_time,
                  location: g.location ?? undefined,
                }]
              : [],
            projectName: p.name,
            mentorName: '',
            description: '',
            createdAt: undefined,
          }))
        : [],
      mentors: [],
      createdAt: undefined,
    }));
  },

  getProjectById: async (projectId: string): Promise<Project | null> => {
    const response = await apiClient.get(`/projects/${projectId}/`);
    const p = response.data;
    return {
      id: String(p.id),
      name: p.name,
      description: '',
      startDate: '',
      endDate: '',
      status: p.is_active ? 'active' : 'pending',
      totalHours: undefined,
      mentorCount: undefined,
      studentCount: undefined,
      groups: Array.isArray(p.groups)
        ? p.groups.map((g: any) => ({
            id: String(g.id),
            name: '',
            projectId: String(g.project),
            mentorId: String(g.mentor),
            students: [],
            schedule: g.schedule
              ? [{
                  id: String(g.schedule.id),
                  groupId: String(g.id),
                  day: String(g.schedule.day),
                  startTime: g.schedule.start_time,
                  endTime: g.schedule.end_time,
                  location: g.location ?? undefined,
                }]
              : [],
            projectName: p.name,
            mentorName: '',
            description: '',
            createdAt: undefined,
          }))
        : [],
      mentors: [],
      createdAt: undefined,
    };
  },

  createProject: async (projectData: Partial<Project>): Promise<Project> => {
    const payload = {
      name: projectData.name,
      is_active: projectData.status === 'active',
    };
    const response = await apiClient.post('/projects/', payload);
    const p = response.data;
    return {
      id: String(p.id),
      name: p.name,
      description: '',
      startDate: '',
      endDate: '',
      status: p.is_active ? 'active' : 'pending',
      totalHours: undefined,
      mentorCount: undefined,
      studentCount: undefined,
      groups: [],
      mentors: [],
      createdAt: undefined,
    };
  },
};

// GroupService
export const GroupService = {
  getGroups: async (projectId: string): Promise<Group[]> => {
    const response = await apiClient.get(`/projects/${projectId}/groups/`);
    const data = response.data.results || response.data;
    
    console.log('📦 Respuesta raw de grupos:', JSON.stringify(data, null, 2));
    
    // Si schedule es un ID, necesitamos obtener los schedules por separado
    const schedules: Record<string, any> = {};
    
    // Intentar obtener todos los schedules
    try {
      const schedulesResponse = await apiClient.get('/schedule/');
      const schedulesData = schedulesResponse.data.results || schedulesResponse.data;
      
      if (Array.isArray(schedulesData)) {
        schedulesData.forEach((sch: any) => {
          schedules[String(sch.id)] = sch;
        });
      }
    } catch (error) {
      console.warn('⚠️ No se pudieron cargar los schedules:', error);
    }
    
    return (Array.isArray(data) ? data : []).map((g: any) => {
      console.log('🔍 Procesando grupo:', JSON.stringify(g, null, 2));
      
      // Determinar el schedule (puede ser un ID o un objeto)
      let scheduleData = null;
      
      if (typeof g.schedule === 'number') {
        // schedule es un ID, buscar en los schedules cargados
        scheduleData = schedules[String(g.schedule)];
        console.log(`📅 Schedule ID ${g.schedule} encontrado:`, scheduleData);
      } else if (typeof g.schedule === 'object' && g.schedule !== null) {
        // schedule ya es un objeto
        scheduleData = g.schedule;
        console.log('📅 Schedule como objeto:', scheduleData);
      }
      
      return {
        id: String(g.id),
        name: g.name || `Grupo ${g.id}`,
        projectId: String(g.project),
        projectName: '', // Se puede obtener del proyecto padre si es necesario
        mentorId: String(g.mentor),
        mentorName: '', // No viene en la respuesta, se debe obtener por separado
        mode: g.mode || '',
        location: g.location || '',
        startDate: g.start_date || '',
        endDate: g.end_date || '',
        status: g.is_active ? 'active' : 'inactive',
        students: [], // No viene en esta respuesta
        schedule: scheduleData ? [{
          id: String(scheduleData.id),
          groupId: String(g.id),
          day: String(scheduleData.day),
          startTime: scheduleData.start_time || '',
          endTime: scheduleData.end_time || '',
          location: g.location,
          startDate: g.start_date,
          endDate: g.end_date,
        }] : [],
        description: g.description || '',
        createdAt: g.created_at || undefined,
      };
    });
  },

  createGroup: async (projectId: string, groupData: {
    mentorId: string;
    location: string;
    mode: 'presencial' | 'virtual' | 'hibrido';
    scheduleDay: number;
    startTime: string;
    endTime: string;
    startDate: string;
    endDate: string;
  }): Promise<Group> => {
    // ✅ Asegurarnos de que el mentor sea un número entero
    const mentorId = parseInt(groupData.mentorId);
    
    // ✅ Validar que todos los campos requeridos estén presentes
    if (!mentorId || isNaN(mentorId)) {
      throw new Error('El ID del mentor es inválido');
    }
    
    if (!groupData.location || !groupData.location.trim()) {
      throw new Error('La ubicación es requerida');
    }
    
    if (groupData.scheduleDay < 0 || groupData.scheduleDay > 6) {
      throw new Error('El día de la semana debe estar entre 0 (Lunes) y 6 (Domingo)');
    }
    
    if (!groupData.startTime || !groupData.endTime) {
      throw new Error('Las horas de inicio y fin son requeridas');
    }
    
    if (!groupData.startDate || !groupData.endDate) {
      throw new Error('Las fechas de inicio y fin son requeridas');
    }
    
    // ✅ Construir payload exactamente como el backend lo espera
    const payload = {
      mentor: mentorId,
      location: groupData.location.trim(),
      mode: groupData.mode,
      start_date: groupData.startDate,
      end_date: groupData.endDate,
      schedule_day: groupData.scheduleDay,
      start_time: groupData.startTime,
      end_time: groupData.endTime
    };
    
    console.log('📤 Payload de creación de grupo (validado):', JSON.stringify(payload, null, 2));
    
    try {
      const response = await apiClient.post(`/projects/${projectId}/groups/`, payload);
      
      console.log('✅ Respuesta del backend:', JSON.stringify(response.data, null, 2));
      
      const g = response.data;
      
      // El backend puede retornar schedule como ID o como objeto
      let scheduleData = null;
      
      if (typeof g.schedule === 'number') {
        // Si es un ID, intentar obtener el schedule completo
        try {
          const scheduleResponse = await apiClient.get(`/schedule/${g.schedule}/`);
          scheduleData = scheduleResponse.data;
          console.log('📅 Schedule obtenido del backend:', scheduleData);
        } catch (error) {
          console.warn('⚠️ No se pudo obtener el schedule completo, usando datos del payload');
          // Usar los datos del payload si no se puede obtener
          scheduleData = {
            id: g.schedule,
            day: groupData.scheduleDay,
            start_time: groupData.startTime,
            end_time: groupData.endTime
          };
        }
      } else if (typeof g.schedule === 'object' && g.schedule !== null) {
        scheduleData = g.schedule;
      }
      
      return {
        id: String(g.id),
        name: g.name || `Grupo ${g.id}`,
        projectId: String(g.project),
        projectName: '',
        mentorId: String(g.mentor),
        mentorName: '',
        mode: g.mode || '',
        location: g.location || '',
        startDate: g.start_date || '',
        endDate: g.end_date || '',
        status: g.is_active ? 'active' : 'inactive',
        students: [],
        schedule: scheduleData ? [{
          id: String(scheduleData.id),
          groupId: String(g.id),
          day: String(scheduleData.day),
          startTime: scheduleData.start_time || '',
          endTime: scheduleData.end_time || '',
          location: g.location,
          startDate: g.start_date,
          endDate: g.end_date,
        }] : [],
        description: '',
        createdAt: undefined,
      };
    } catch (error: any) {
      console.error('❌ Error completo al crear grupo:', error);
      console.error('📋 Response data:', JSON.stringify(error.response?.data, null, 2));
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (typeof errorData === 'string') {
          throw new Error(errorData);
        }
        
        if (errorData.error) {
          throw new Error(errorData.error);
        }
        
        if (errorData.detail) {
          throw new Error(errorData.detail);
        }
        
        if (typeof errorData === 'object') {
          const fieldErrors = [];
          
          for (const [field, messages] of Object.entries(errorData)) {
            const messageArray = Array.isArray(messages) ? messages : [messages];
            fieldErrors.push(`${field}: ${messageArray.join(', ')}`);
          }
          
          if (fieldErrors.length > 0) {
            throw new Error(`Errores de validación:\n${fieldErrors.join('\n')}`);
          }
        }
        
        throw new Error(JSON.stringify(errorData));
      }
      
      throw new Error(error.message || 'Error al crear grupo');
    }
  },

  updateGroup: async (projectId: string, groupId: string, groupData: {
    mentorId: string;
    location: string;
    mode: 'presencial' | 'virtual' | 'hibrido';
    scheduleDay: number;
    startTime: string;
    endTime: string;
    startDate: string;
    endDate: string;
  }): Promise<Group> => {
    const payload = {
      mentor: parseInt(groupData.mentorId),
      location: groupData.location,
      mode: groupData.mode,
      schedule_day: groupData.scheduleDay,
      start_time: groupData.startTime,
      end_time: groupData.endTime,
      start_date: groupData.startDate,
      end_date: groupData.endDate
    };
    
    console.log('📤 Actualizando grupo:', JSON.stringify(payload, null, 2));
    
    const response = await apiClient.put(`/projects/${projectId}/groups/${groupId}/`, payload);
    
    console.log('✅ Grupo actualizado:', JSON.stringify(response.data, null, 2));
    
    const g = response.data;
    return {
      id: String(g.id),
      name: g.name || `Grupo ${g.id}`,
      projectId: String(g.project),
      mentorId: String(g.mentor),
      students: [],
      schedule: g.schedule
        ? [{
            id: String(g.schedule.id),
            groupId: String(g.id),
            day: String(g.schedule.day),
            startTime: g.schedule.start_time,
            endTime: g.schedule.end_time,
            location: g.location ?? undefined,
          }]
        : [],
      projectName: '',
      mentorName: '',
      description: '',
      createdAt: undefined,
    };
  },

  deleteGroup: async (projectId: string, groupId: string): Promise<void> => {
    console.log('🗑️ Eliminando grupo:', groupId);
    
    await apiClient.delete(`/projects/${projectId}/groups/${groupId}/`);
    
    console.log('✅ Grupo eliminado exitosamente');
  },
};

// ScheduleService - Solo para consultas, NO para crear schedules manualmente
export const ScheduleService = {
  getSchedules: async (): Promise<Schedule[]> => {
    try {
      const response = await apiClient.get('/schedule/');
      const data = response.data.results || response.data;
      return (Array.isArray(data) ? data : []).map((s: any) => ({
        id: String(s.id),
        groupId: '',
        day: String(s.day),
        startTime: s.start_time,
        endTime: s.end_time,
        location: undefined,
      }));
    } catch (error) {
      console.warn('⚠️ Error al cargar schedules (no crítico):', error);
      return [];
    }
  },
};
