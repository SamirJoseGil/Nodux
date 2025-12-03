import { ProjectGroup } from '~/types/project';
import { apiClient } from '~/utils/api';

// Obtiene los grupos de un proyecto específico
export const GroupService = {
  getGroups: async (projectId: string): Promise<ProjectGroup[]> => {
    const response = await apiClient.get(`/projects/${projectId}/groups/`);
    return Array.isArray(response.data)
      ? response.data.map((g: any) => ({
          id: String(g.id),
          project: String(g.project),
          mentor: String(g.mentor),
          schedule: g.schedule
            ? {
                id: String(g.schedule.id),
                day: g.schedule.day,
                startTime: g.schedule.start_time,
                endTime: g.schedule.end_time,
              }
            : undefined,
          location: g.location,
          mode: g.mode,
          startDate: g.start_date,
          endDate: g.end_date,
        }))
      : [];
  },

  // Crea un grupo dentro de un proyecto
  createGroup: async (projectId: string, data: Partial<ProjectGroup>): Promise<ProjectGroup> => {
    const payload = {
      schedule: data.schedule?.id,
      mentor: data.mentor,
      location: data.location,
      mode: data.mode,
      start_date: data.startDate,
      end_date: data.endDate,
    };
    const response = await apiClient.post(`/projects/${projectId}/groups/`, payload);
    const g = response.data;
    return {
      id: String(g.id),
      project: String(g.project),
      mentor: String(g.mentor),
      schedule: g.schedule
        ? {
            id: String(g.schedule.id),
            day: g.schedule.day,
            startTime: g.schedule.start_time,
            endTime: g.schedule.end_time,
          }
        : undefined,
      location: g.location,
      mode: g.mode,
      startDate: g.start_date,
      endDate: g.end_date,
    };
  },
};