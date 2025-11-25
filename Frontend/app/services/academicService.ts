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
    const nameParts = mentorData.name?.split(' ') || [''];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Estructura correcta según backend
    const formData = new FormData();
    formData.append('profile.user.first_name', firstName);
    formData.append('profile.user.last_name', lastName);
    formData.append('profile.user.email', mentorData.email || '');
    formData.append('profile.phone', mentorData.phone || '');
    formData.append('charge', mentorData.specialty || '');
    formData.append('knowledge_level', 'basico'); // Default value

    console.log('Creating mentor with data:', {
      firstName,
      lastName,
      email: mentorData.email,
      phone: mentorData.phone,
      charge: mentorData.specialty
    });

    const response = await apiClient.post('/mentors/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
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
  },

  updateMentor: async (mentorId: string, mentorData: Partial<Mentor>): Promise<Mentor> => {
    const nameParts = mentorData.name?.split(' ') || [''];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const formData = new FormData();
    formData.append('profile.user.first_name', firstName);
    formData.append('profile.user.last_name', lastName);
    formData.append('profile.user.email', mentorData.email || '');
    formData.append('profile.phone', mentorData.phone || '');
    formData.append('charge', mentorData.specialty || '');
    formData.append('knowledge_level', 'basico');

    const response = await apiClient.put(`/mentors/${mentorId}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
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
    return (Array.isArray(data) ? data : []).map((g: any) => ({
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
      projectName: '',
      mentorName: '',
      description: '',
      createdAt: undefined,
    }));
  },

  createGroup: async (projectId: string, groupData: Partial<Group>): Promise<Group> => {
    const payload = {
      mentor: groupData.mentorId,
      schedule: groupData.schedule?.[0]?.id,
      location: groupData.schedule?.[0]?.location || '',
      mode: 'presencial', // default
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +6 months
    };
    
    const response = await apiClient.post(`/projects/${projectId}/groups/`, payload);
    const g = response.data;
    return {
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
      projectName: '',
      mentorName: '',
      description: '',
      createdAt: undefined,
    };
  },
};

// ScheduleService
export const ScheduleService = {
  getSchedules: async (): Promise<Schedule[]> => {
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
  },
  
  createSchedule: async (scheduleData: Partial<Schedule>): Promise<Schedule> => {
    const payload = {
      day: Number(scheduleData.day),
      start_time: scheduleData.startTime,
      end_time: scheduleData.endTime,
    };
    const response = await apiClient.post('/schedule/', payload);
    const s = response.data;
    return {
      id: String(s.id),
      groupId: '',
      day: String(s.day),
      startTime: s.start_time,
      endTime: s.end_time,
      location: undefined,
    };
  },
};
