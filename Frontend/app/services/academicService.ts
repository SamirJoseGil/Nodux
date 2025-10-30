import { Mentor, Project, Group, Schedule } from '~/types/academic';
import { apiClient } from '~/utils/api';

// MentorService
export const MentorService = {
  getMentors: async (): Promise<Mentor[]> => {
    const response = await apiClient.get('/mentors/');
    return response.data.map((m: any) => ({
      id: String(m.id),
      userId: String(m.id),
      name: `${m.first_name} ${m.last_name}`,
      email: m.email,
      phone: m.phone,
      specialty: m.charge,
      profileImage: m.photo ?? undefined,
      bio: '',
      status: 'active',
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
      phone: m.phone,
      specialty: m.charge,
      profileImage: m.photo ?? undefined,
      bio: '',
      status: 'active',
      expertise: [],
      createdAt: undefined,
    };
  },

  createMentor: async (mentorData: Partial<Mentor>): Promise<Mentor> => {
    const payload = {
      profile: {
        user: {
          first_name: mentorData.name?.split(' ')[0] || '',
          last_name: mentorData.name?.split(' ').slice(1).join(' ') || '',
          email: mentorData.email,
        },
        phone: mentorData.phone,
      },
      charge: mentorData.specialty,
      knowledge_level: 'basico',
    };
    const response = await apiClient.post('/mentors/', payload);
    const m = response.data;
    return {
      id: String(m.id),
      userId: String(m.id),
      name: `${m.first_name} ${m.last_name}`,
      email: m.email,
      phone: m.phone,
      specialty: m.charge,
      profileImage: m.photo ?? undefined,
      bio: '',
      status: 'active',
      expertise: [],
      createdAt: undefined,
    };
  },

  updateMentor: async (mentorId: string, mentorData: Partial<Mentor>): Promise<Mentor> => {
    const payload = {
      profile: {
        user: {
          first_name: mentorData.name?.split(' ')[0] || '',
          last_name: mentorData.name?.split(' ').slice(1).join(' ') || '',
          email: mentorData.email,
        },
        phone: mentorData.phone,
      },
      charge: mentorData.specialty,
      knowledge_level: 'basico',
    };
    const response = await apiClient.put(`/mentors/${mentorId}/`, payload);
    const m = response.data;
    return {
      id: String(m.id),
      userId: String(m.id),
      name: `${m.first_name} ${m.last_name}`,
      email: m.email,
      phone: m.phone,
      specialty: m.charge,
      profileImage: m.photo ?? undefined,
      bio: '',
      status: 'active',
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
    return Array.isArray(response.data)
      ? response.data.map((p: any) => ({
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
        }))
      : [];
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
  getGroups: async (projectId?: string): Promise<Group[]> => {
    let response;
    if (projectId) {
      response = await apiClient.get(`/projects/${projectId}/groups/`);
    } else {
      response = await apiClient.get('/groups/');
    }
    return Array.isArray(response.data)
      ? response.data.map((g: any) => ({
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
        }))
      : [];
  },
};

// ScheduleService
export const ScheduleService = {
  getSchedules: async (): Promise<Schedule[]> => {
    const response = await apiClient.get('/schedule/');
    return Array.isArray(response.data)
      ? response.data.map((s: any) => ({
          id: String(s.id),
          groupId: '',
          day: String(s.day),
          startTime: s.start_time,
          endTime: s.end_time,
          location: undefined,
        }))
      : [];
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
