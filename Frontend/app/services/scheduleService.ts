import { Schedule } from '~/types/schedule';
import { apiClient } from '~/utils/api';

// ScheduleService
export const ScheduleService = {
  getSchedules: async (): Promise<Schedule[]> => {
    const response = await apiClient.get('/schedule/');
    return response.data.map((s: any) => ({
      id: String(s.id),
      day: Number(s.day),
      startTime: s.start_time,
      endTime: s.end_time,
    }));
  },
  createSchedule: async (data: Partial<Schedule>): Promise<Schedule> => {
    const payload = {
      day: data.day,
      start_time: data.startTime,
      end_time: data.endTime,
    };
    const response = await apiClient.post('/schedule/', payload);
    const s = response.data;
    return {
      id: String(s.id),
      day: Number(s.day),
      startTime: s.start_time,
      endTime: s.end_time,
    };
  },
};