import { Attendance, AttendanceUpdateData } from '~/types/attendance';
import { apiClient } from '~/utils/api';

export const AttendanceService = {
  getAttendances: async (): Promise<Attendance[]> => {
    const response = await apiClient.get('/attendance/');
    return response.data.map((a: any) => ({
      id: String(a.id),
      mentor: {
        id: String(a.mentor.id),
        firstName: a.mentor.first_name,
        lastName: a.mentor.last_name,
        email: a.mentor.email,
        username: a.mentor.username,
        phone: a.mentor.phone,
        photo: a.mentor.photo ?? undefined,
        charge: a.mentor.charge,
        knowledgeLevel: a.mentor.knowledge_level,
        certificate: a.mentor.certificate ?? undefined,
      },
      hours: a.hours,
      isConfirmed: a.is_confirmed,
      startDatetime: a.start_datetime,
      endDatetime: a.end_datetime,
      confirmedBy: a.confirmed_by ? String(a.confirmed_by) : undefined,
    }));
  },

  getAttendanceById: async (id: string): Promise<Attendance> => {
    const response = await apiClient.get(`/attendance/${id}/`);
    const a = response.data;
    return {
      id: String(a.id),
      mentor: {
        id: String(a.mentor.id),
        firstName: a.mentor.first_name,
        lastName: a.mentor.last_name,
        email: a.mentor.email,
        username: a.mentor.username,
        phone: a.mentor.phone,
        photo: a.mentor.photo ?? undefined,
        charge: a.mentor.charge,
        knowledgeLevel: a.mentor.knowledge_level,
        certificate: a.mentor.certificate ?? undefined,
      },
      hours: a.hours,
      isConfirmed: a.is_confirmed,
      startDatetime: a.start_datetime,
      endDatetime: a.end_datetime,
      confirmedBy: a.confirmed_by ? String(a.confirmed_by) : undefined,
    };
  },

  updateAttendance: async (
    id: string,
    data: AttendanceUpdateData
  ): Promise<Attendance> => {
    const payload: any = {};
    
    if (data.startDatetime) {
      payload.start_datetime = data.startDatetime;
    }
    if (data.endDatetime) {
      payload.end_datetime = data.endDatetime;
    }
    if (data.isConfirmed !== undefined) {
      payload.is_confirmed = data.isConfirmed;
    }

    const response = await apiClient.patch(`/attendance/${id}/`, payload);
    const a = response.data;
    return {
      id: String(a.id),
      mentor: {
        id: String(a.mentor.id),
        firstName: a.mentor.first_name,
        lastName: a.mentor.last_name,
        email: a.mentor.email,
        username: a.mentor.username,
        phone: a.mentor.phone,
        photo: a.mentor.photo ?? undefined,
        charge: a.mentor.charge,
        knowledgeLevel: a.mentor.knowledge_level,
        certificate: a.mentor.certificate ?? undefined,
      },
      hours: a.hours,
      isConfirmed: a.is_confirmed,
      startDatetime: a.start_datetime,
      endDatetime: a.end_datetime,
      confirmedBy: a.confirmed_by ? String(a.confirmed_by) : undefined,
    };
  },

  confirmAttendance: async (id: string): Promise<{ success: string }> => {
    const response = await apiClient.post(`/attendance/${id}/confirm/`);
    return response.data;
  },

  createAttendance: async (data: AttendanceCreateData): Promise<Attendance> => {
    const payload = {
      mentor: Number(data.mentorId),
      start_datetime: data.startDatetime,
      end_datetime: data.endDatetime,
    };

    console.log('Creando asistencia:', payload);

    const response = await apiClient.post('/attendance/', payload);
    const a = response.data;
    return {
      id: String(a.id),
      mentor: {
        id: String(a.mentor.id),
        firstName: a.mentor.first_name,
        lastName: a.mentor.last_name,
        email: a.mentor.email,
        username: a.mentor.username,
        phone: a.mentor.phone,
        photo: a.mentor.photo ?? undefined,
        charge: a.mentor.charge,
        knowledgeLevel: a.mentor.knowledge_level,
        certificate: a.mentor.certificate ?? undefined,
      },
      hours: a.hours,
      isConfirmed: a.is_confirmed,
      startDatetime: a.start_datetime,
      endDatetime: a.end_datetime,
      confirmedBy: a.confirmed_by ? String(a.confirmed_by) : undefined,
    };
  },
};
