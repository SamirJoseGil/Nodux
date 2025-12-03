import { Stats } from '~/types/stats';
import { MentorService } from '~/services/academicService';
import { ProjectService } from '~/services/academicService';
import { GroupService } from '~/services/academicService';

export const StatsService = {
  getStats: async (): Promise<Stats> => {
    try {
      console.log('📊 Calculando estadísticas desde servicios...');
      
      // Obtener datos de múltiples endpoints
      const [mentors, projects] = await Promise.all([
        MentorService.getMentors(),
        ProjectService.getProjects()
      ]);

      // Contar grupos desde los proyectos
      let totalGroups = 0;
      for (const project of projects) {
        if (project.groups && Array.isArray(project.groups)) {
          totalGroups += project.groups.length;
        }
      }

      const stats: Stats = {
        mentors: mentors.length,
        projects: projects.length,
        groups: totalGroups
      };

      console.log('✅ Estadísticas calculadas:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Error al calcular estadísticas:', error);
      
      // Retornar estadísticas vacías en caso de error
      return {
        mentors: 0,
        projects: 0,
        groups: 0
      };
    }
  },
};