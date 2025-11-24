import { Stats } from '~/types/stats';
import { apiClient } from '~/utils/api';

export const StatsService = {
  getStats: async (): Promise<Stats> => {
    const response = await apiClient.get('/stats/');
    return {
      mentors: response.data.mentors || 0,
      projects: response.data.projects || 0,
      groups: response.data.groups || 0,
    };
  },
};