import { Mentor, MentorHour } from '~/types/mentor';
import { apiClient } from '~/utils/api';

export const MentorService = {
  getMentors: async (): Promise<Mentor[]> => {
    const response = await apiClient.get('/mentors/');
    return response.data.map((m: any) => ({
      id: String(m.id),
      firstName: m.first_name,
      lastName: m.last_name,
      email: m.email,
      username: m.username,
      phone: m.phone,
      photo: m.photo ?? undefined,
      charge: m.charge,
      knowledgeLevel: m.knowledge_level,
      certificate: m.certificate ?? undefined,
    }));
  },
  getMentorById: async (id: string): Promise<Mentor> => {
    const response = await apiClient.get(`/mentors/${id}/`);
    const m = response.data;
    return {
      id: String(m.id),
      firstName: m.first_name,
      lastName: m.last_name,
      email: m.email,
      username: m.username,
      phone: m.phone,
      photo: m.photo ?? undefined,
      charge: m.charge,
      knowledgeLevel: m.knowledge_level,
      certificate: m.certificate ?? undefined,
    };
  },
  createMentor: async (data: Partial<Mentor>): Promise<Mentor> => {
    const payload = {
      profile: {
        user: {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
        },
        phone: data.phone,
      },
      charge: data.charge,
      knowledge_level: data.knowledgeLevel,
    };
    const response = await apiClient.post('/mentors/', payload);
    const m = response.data;
    return {
      id: String(m.id),
      firstName: m.first_name,
      lastName: m.last_name,
      email: m.email,
      username: m.username,
      phone: m.phone,
      photo: m.photo ?? undefined,
      charge: m.charge,
      knowledgeLevel: m.knowledge_level,
      certificate: m.certificate ?? undefined,
    };
  },
  updateMentor: async (id: string, data: Partial<Mentor>): Promise<Mentor> => {
    const payload = {
      profile: {
        user: {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
        },
        phone: data.phone,
      },
      charge: data.charge,
      knowledge_level: data.knowledgeLevel,
    };
    const response = await apiClient.put(`/mentors/${id}/`, payload);
    const m = response.data;
    return {
      id: String(m.id),
      firstName: m.first_name,
      lastName: m.last_name,
      email: m.email,
      username: m.username,
      phone: m.phone,
      photo: m.photo ?? undefined,
      charge: m.charge,
      knowledgeLevel: m.knowledge_level,
      certificate: m.certificate ?? undefined,
    };
  },
  deleteMentor: async (id: string): Promise<void> => {
    await apiClient.delete(`/mentors/${id}/`);
  },
  getMentorHours: async (id: string): Promise<MentorHour[]> => {
    const response = await apiClient.get(`/mentors/${id}/hours/`);
    return response.data.map((h: any) => ({
      mentor: String(h.mentor),
      registeredBy: String(h.registered_by),
      hours: h.hours,
    }));
  },
  registerMentorHours: async (id: string, hours: number): Promise<MentorHour> => {
    const response = await apiClient.post(`/mentors/${id}/hours/`, { hours });
    const h = response.data;
    return {
      mentor: String(h.mentor),
      registeredBy: String(h.registered_by),
      hours: h.hours,
    };
  },
};