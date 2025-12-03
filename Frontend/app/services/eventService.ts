import { Event } from '~/types/event';
import { apiClient } from '~/utils/api';

export const EventService = {
  // Endpoint global optimizado para calendario
  getEvents: async (): Promise<Event[]> => {
    try {
      const response = await apiClient.get('/events/');
      console.log('📅 Response completo de /events/:', JSON.stringify(response.data, null, 2));
      
      const data = response.data.results || response.data;
      
      if (!Array.isArray(data)) {
        console.warn('⚠️ La respuesta no es un array:', data);
        return [];
      }

      return data.map((e: any) => {
        console.log('🔍 Procesando evento:', JSON.stringify(e, null, 2));
        
        return {
          id: String(e.id),
          group: String(e.group),
          location: e.location || 'Sin ubicación',
          // ✅ El backend devuelve 'date' (renombrado desde event_date)
          date: e.date || e.event_date, // Soportar ambos por si acaso
          startDate: e.start_date || e.date || e.event_date,
          endDate: e.end_date || e.date || e.event_date,
          // Información del schedule incluida (del endpoint optimizado)
          scheduleId: e.schedule_id ? String(e.schedule_id) : null,
          scheduleDay: e.schedule_day !== undefined ? Number(e.schedule_day) : null,
          scheduleDayName: e.schedule_day_name || null,
          startTime: e.start_time || null,
          endTime: e.end_time || null,
          startHour: e.start_hour !== undefined ? Number(e.start_hour) : 8,
          endHour: e.end_hour !== undefined ? Number(e.end_hour) : 10,
          duration: e.duration !== undefined ? Number(e.duration) : 2,
          // Información del grupo
          groupInfo: e.group_info ? {
            id: String(e.group_info.id),
            location: e.group_info.location || '',
            mode: e.group_info.mode || '',
            project: e.group_info.project || null,
            mentor: e.group_info.mentor ? {
              id: String(e.group_info.mentor.id),
              name: e.group_info.mentor.name || 'Sin mentor'
            } : null
          } : null,
        };
      });
    } catch (error) {
      console.error('❌ Error al obtener eventos:', error);
      throw error;
    }
  },

  // Obtener eventos filtrados por fecha - ✅ ACTUALIZADO
  getEventsByDateRange: async (startDate: string, endDate: string): Promise<Event[]> => {
    try {
      // ✅ Usar event_date para filtros según el backend
      const response = await apiClient.get('/events/', {
        params: {
          event_date__gte: startDate,  // ← Cambiar de date__gte a event_date__gte
          event_date__lte: endDate     // ← Cambiar de date__lte a event_date__lte
        }
      });
      
      console.log('📅 Eventos filtrados por rango:', {
        startDate,
        endDate,
        count: response.data.results?.length || response.data.length
      });
      
      const data = response.data.results || response.data;
      
      if (!Array.isArray(data)) {
        return [];
      }

      return data.map((e: any) => ({
        id: String(e.id),
        group: String(e.group),
        location: e.location || 'Sin ubicación',
        date: e.date || e.event_date,
        startDate: e.start_date || e.date || e.event_date,
        endDate: e.end_date || e.date || e.event_date,
        scheduleId: e.schedule_id ? String(e.schedule_id) : null,
        scheduleDay: e.schedule_day !== undefined ? Number(e.schedule_day) : null,
        scheduleDayName: e.schedule_day_name || null,
        startTime: e.start_time || null,
        endTime: e.end_time || null,
        startHour: e.start_hour !== undefined ? Number(e.start_hour) : 8,
        endHour: e.end_hour !== undefined ? Number(e.end_hour) : 10,
        duration: e.duration !== undefined ? Number(e.duration) : 2,
        groupInfo: e.group_info ? {
          id: String(e.group_info.id),
          location: e.group_info.location || '',
          mode: e.group_info.mode || '',
          project: e.group_info.project || null,
          mentor: e.group_info.mentor ? {
            id: String(e.group_info.mentor.id),
            name: e.group_info.mentor.name || 'Sin mentor'
          } : null
        } : null,
      }));
    } catch (error) {
      console.error('❌ Error al obtener eventos por rango:', error);
      throw error;
    }
  },

  // Endpoint anidado para eventos de un grupo específico
  getGroupEvents: async (projectId: string, groupId: string): Promise<Event[]> => {
    try {
      const response = await apiClient.get(`/projects/${projectId}/groups/${groupId}/events/`);
      const data = response.data.results || response.data;
      
      if (!Array.isArray(data)) {
        return [];
      }

      return data.map((e: any) => ({
        id: String(e.id),
        group: String(e.group),
        location: e.location || 'Sin ubicación',
        date: e.date || e.event_date,
        startDate: e.start_date || e.date || e.event_date,
        endDate: e.end_date || e.date || e.event_date,
        scheduleId: null,
        scheduleDay: null,
        scheduleDayName: null,
        startTime: null,
        endTime: null,
        startHour: 8,
        endHour: 10,
        duration: 2,
        groupInfo: null,
      }));
    } catch (error) {
      console.error('❌ Error al obtener eventos del grupo:', error);
      throw error;
    }
  },

  createGroupEvent: async (
    projectId: string,
    groupId: string,
    data: Partial<Event>
  ): Promise<Event> => {
    try {
      // ✅ El backend espera event_date en el POST
      const payload = {
        location: data.location,
        event_date: data.date,     // ← Usar event_date para crear
        start_date: data.startDate,
        end_date: data.endDate,
      };
      
      console.log('📤 Creando evento:', payload);
      
      const response = await apiClient.post(`/projects/${projectId}/groups/${groupId}/events/`, payload);
      const e = response.data;
      
      return {
        id: String(e.id),
        group: String(e.group),
        location: e.location || 'Sin ubicación',
        date: e.date || e.event_date,
        startDate: e.start_date || e.date || e.event_date,
        endDate: e.end_date || e.date || e.event_date,
        scheduleId: null,
        scheduleDay: null,
        scheduleDayName: null,
        startTime: null,
        endTime: null,
        startHour: 8,
        endHour: 10,
        duration: 2,
        groupInfo: null,
      };
    } catch (error) {
      console.error('❌ Error al crear evento:', error);
      throw error;
    }
  },
};