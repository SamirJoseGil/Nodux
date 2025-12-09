import { Mentor } from '~/types/academic';
import { apiClient } from '~/utils/api';

export const MentorService = {
  /**
   * Obtiene todos los mentores
   */
  getMentors: async (): Promise<Mentor[]> => {
    try {
      const response = await apiClient.get('/mentors/');
      return response.data.map((m: any) => ({
        id: String(m.id),
        name: `${m.profile.user.first_name} ${m.profile.user.last_name}`,
        email: m.profile.user.email,
        username: m.profile.user.username,
        phone: m.profile.phone || '',
        photo: m.profile.photo || undefined,
        specialty: m.charge || 'Sin especialidad',
        knowledgeLevel: m.knowledge_level || 'Básico',
        certificate: m.certificate || undefined,
      }));
    } catch (error) {
      console.error('Error al obtener mentores:', error);
      throw error;
    }
  },
  
  /**
   * Obtiene un mentor por ID
   */
  getMentorById: async (id: string): Promise<Mentor> => {
    try {
      const response = await apiClient.get(`/mentors/${id}/`);
      const m = response.data;
      return {
        id: String(m.id),
        name: `${m.profile.user.first_name} ${m.profile.user.last_name}`,
        email: m.profile.user.email,
        username: m.profile.user.username,
        phone: m.profile.phone || '',
        photo: m.profile.photo || undefined,
        specialty: m.charge || 'Sin especialidad',
        knowledgeLevel: m.knowledge_level || 'Básico',
        certificate: m.certificate || undefined,
      };
    } catch (error) {
      console.error('Error al obtener mentor:', error);
      throw error;
    }
  },
  
  /**
   * Crea un nuevo mentor (con usuario asociado)
   * Este método crea primero un usuario y luego el perfil de mentor
   */
  createMentor: async (data: {
    name: string;
    email: string;
    phone?: string;
    specialty: string;
    username?: string;
    password?: string;
  }): Promise<Mentor> => {
    try {
      // Dividir el nombre en firstName y lastName
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || nameParts[0];

      // Generar username si no se proporciona
      const username = data.username || data.email.split('@')[0];
      
      // Generar password temporal si no se proporciona
      const password = data.password || `Mentor${Math.random().toString(36).slice(-8)}`;

      const payload = {
        user: {
          first_name: firstName,
          last_name: lastName,
          email: data.email,
          username: username,
          password: password
        },
        profile: {
          phone: data.phone || '',
          role: 'Mentor'
        },
        charge: data.specialty,
        knowledge_level: 'Intermedio'
      };

      console.log('📤 Creando mentor:', payload);

      const response = await apiClient.post('/mentors/', payload);
      const m = response.data;
      
      return {
        id: String(m.id),
        name: `${m.profile.user.first_name} ${m.profile.user.last_name}`,
        email: m.profile.user.email,
        username: m.profile.user.username,
        phone: m.profile.phone || '',
        photo: m.profile.photo || undefined,
        specialty: m.charge || data.specialty,
        knowledgeLevel: m.knowledge_level || 'Intermedio',
        certificate: m.certificate || undefined,
      };
    } catch (error: any) {
      console.error('❌ Error al crear mentor:', error);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Manejar errores específicos
        if (errorData.user) {
          if (errorData.user.email) {
            throw new Error(`Email: ${Array.isArray(errorData.user.email) ? errorData.user.email[0] : errorData.user.email}`);
          }
          if (errorData.user.username) {
            throw new Error(`Usuario: ${Array.isArray(errorData.user.username) ? errorData.user.username[0] : errorData.user.username}`);
          }
        }
        
        if (errorData.detail) {
          throw new Error(errorData.detail);
        }
      }
      
      throw new Error('Error al crear el mentor. Por favor intenta de nuevo.');
    }
  },
  
  /**
   * Actualiza la información de un mentor
   */
  updateMentor: async (id: string, data: Partial<Mentor>): Promise<Mentor> => {
    try {
      const payload: any = {};
      
      if (data.specialty) {
        payload.charge = data.specialty;
      }
      
      if (data.knowledgeLevel) {
        payload.knowledge_level = data.knowledgeLevel;
      }

      // Si se actualizan datos del usuario o perfil
      if (data.name || data.email || data.phone) {
        payload.profile = {};
        
        if (data.phone) {
          payload.profile.phone = data.phone;
        }
        
        if (data.name || data.email) {
          payload.user = {};
          
          if (data.name) {
            const nameParts = data.name.trim().split(' ');
            payload.user.first_name = nameParts[0];
            payload.user.last_name = nameParts.slice(1).join(' ') || nameParts[0];
          }
          
          if (data.email) {
            payload.user.email = data.email;
          }
        }
      }

      console.log('📤 Actualizando mentor:', payload);

      const response = await apiClient.patch(`/mentors/${id}/`, payload);
      const m = response.data;
      
      return {
        id: String(m.id),
        name: `${m.profile.user.first_name} ${m.profile.user.last_name}`,
        email: m.profile.user.email,
        username: m.profile.user.username,
        phone: m.profile.phone || '',
        photo: m.profile.photo || undefined,
        specialty: m.charge || 'Sin especialidad',
        knowledgeLevel: m.knowledge_level || 'Básico',
        certificate: m.certificate || undefined,
      };
    } catch (error: any) {
      console.error('❌ Error al actualizar mentor:', error);
      
      if (error.response?.status === 403) {
        throw new Error('No tienes permisos para actualizar este mentor');
      }
      
      throw new Error('Error al actualizar el mentor. Por favor intenta de nuevo.');
    }
  },
  
  /**
   * Elimina un mentor
   */
  deleteMentor: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/mentors/${id}/`);
    } catch (error: any) {
      console.error('❌ Error al eliminar mentor:', error);
      
      if (error.response?.status === 403) {
        throw new Error('No tienes permisos para eliminar este mentor');
      }
      
      throw new Error('Error al eliminar el mentor. Por favor intenta de nuevo.');
    }
  },
};