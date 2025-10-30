import { Stats } from '~/types/stats';
import { apiClient } from '~/utils/api';

export const StatsService = {
  getStats: async (): Promise<Stats> => {
    const response = await apiClient.get('/stats/');
    return {
      mentors: response.data.mentors,
      projects: response.data.projects,
      groups: response.data.groups,
    };
  },
};