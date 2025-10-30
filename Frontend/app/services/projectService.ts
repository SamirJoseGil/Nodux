import { Project, ProjectGroup } from '~/types/project';
import { apiClient } from '~/utils/api';

export const ProjectService = {
  getProjects: async (): Promise<Project[]> => {
    const response = await apiClient.get('/projects/');
    return response.data.map((p: any) => ({
      id: String(p.id),
      name: p.name,
      isActive: Boolean(p.is_active),
      groups: Array.isArray(p.groups)
        ? p.groups.map((g: any) => ({
            id: String(g.id),
            project: String(g.project),
            mentor: String(g.mentor),
            schedule: g.schedule,
            location: g.location,
            mode: g.mode,
            startDate: g.start_date,
            endDate: g.end_date,
          }))
        : [],
    }));
  },
  getProjectById: async (id: string): Promise<Project> => {
    const response = await apiClient.get(`/projects/${id}/`);
    const p = response.data;
    return {
      id: String(p.id),
      name: p.name,
      isActive: Boolean(p.is_active),
      groups: Array.isArray(p.groups)
        ? p.groups.map((g: any) => ({
            id: String(g.id),
            project: String(g.project),
            mentor: String(g.mentor),
            schedule: g.schedule,
            location: g.location,
            mode: g.mode,
            startDate: g.start_date,
            endDate: g.end_date,
          }))
        : [],
    };
  },
  createProject: async (data: Partial<Project>): Promise<Project> => {
    const payload = {
      name: data.name,
      is_active: data.isActive,
    };
    const response = await apiClient.post('/projects/', payload);
    const p = response.data;
    return {
      id: String(p.id),
      name: p.name,
      isActive: Boolean(p.is_active),
      groups: [],
    };
  },
};