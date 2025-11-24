import { Event } from '~/types/event';
import { apiClient } from '~/utils/api';

export const EventService = {
  getEvents: async (): Promise<Event[]> => {
    const response = await apiClient.get('/events/');
    return response.data.map((e: any) => ({
      id: String(e.id),
      group: String(e.group),
      location: e.location,
      date: e.date,
      startDate: e.start_date,
      endDate: e.end_date,
      schedule: String(e.schedule),
    }));
  },
  getGroupEvents: async (projectId: string, groupId: string): Promise<Event[]> => {
    const response = await apiClient.get(`/projects/${projectId}/groups/${groupId}/events/`);
    return response.data.map((e: any) => ({
      id: String(e.id),
      group: String(e.group),
      location: e.location,
      date: e.date,
      startDate: e.start_date,
      endDate: e.end_date,
      schedule: String(e.schedule),
    }));
  },
  createGroupEvent: async (
    projectId: string,
    groupId: string,
    data: Partial<Event>
  ): Promise<Event> => {
    const payload = {
      location: data.location,
      date: data.date,
      start_date: data.startDate,
      end_date: data.endDate,
      schedule: data.schedule,
    };
    const response = await apiClient.post(`/projects/${projectId}/groups/${groupId}/events/`, payload);
    const e = response.data;
    return {
      id: String(e.id),
      group: String(e.group),
      location: e.location,
      date: e.date,
      startDate: e.start_date,
      endDate: e.end_date,
      schedule: String(e.schedule),
    };
  },
};