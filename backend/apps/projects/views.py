from rest_framework import viewsets, mixins, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Prefetch
from django_filters.rest_framework import DjangoFilterBackend
from datetime import datetime, timedelta
from apps.core.models import Schedule
from .models import Project, Group, Event
from .serializers import (
    ProjectSerializer,
    GroupSerializer,
    EventSerializer,
    EventListSerializer,
)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class GroupViewSet(viewsets.ModelViewSet):
    serializer_class = GroupSerializer

    def get_queryset(self):
        project_id = self.kwargs["project_pk"]
        return Group.objects.filter(project_id=project_id)

    def create(self, request, *args, **kwargs):
        """
        Crea un grupo y genera eventos automáticamente basados en:
        - Día de la semana (schedule_day)
        - Horario (start_time, end_time)
        - Rango de fechas (start_date, end_date)
        
        Request body esperado:
        {
            "mentor": 1,
            "location": "Sala A",
            "mode": "presencial",
            "start_date": "2024-01-15",
            "end_date": "2024-06-15",
            "schedule_day": 0,  // 0=Lunes, 1=Martes, etc.
            "start_time": "08:00:00",
            "end_time": "10:00:00"
        }
        """
        project_id = self.kwargs.get("project_pk")
        
        try:
            # Validar que el proyecto existe
            project = Project.objects.get(pk=project_id)
            
            # Obtener datos del request
            mentor_id = request.data.get('mentor')
            location = request.data.get('location')
            mode = request.data.get('mode', 'presencial')
            start_date_str = request.data.get('start_date')
            end_date_str = request.data.get('end_date')
            
            # Datos del horario
            schedule_day = request.data.get('schedule_day')  # 0-6 (Lunes-Domingo)
            start_time_str = request.data.get('start_time')  # "08:00:00"
            end_time_str = request.data.get('end_time')      # "10:00:00"
            
            # Validar campos requeridos
            if not all([mentor_id, location, start_date_str, end_date_str]):
                return Response({
                    'error': 'Faltan campos requeridos: mentor, location, start_date, end_date'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if schedule_day is None or not start_time_str or not end_time_str:
                return Response({
                    'error': 'Faltan campos de horario: schedule_day, start_time, end_time'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validar formato de fechas
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            except ValueError:
                return Response({
                    'error': 'Formato de fecha inválido. Use YYYY-MM-DD'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if end_date < start_date:
                return Response({
                    'error': 'La fecha de fin debe ser posterior a la fecha de inicio'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # 1. Buscar o crear Schedule
            schedule, schedule_created = Schedule.objects.get_or_create(
                day=int(schedule_day),
                start_time=start_time_str,
                end_time=end_time_str
            )
            
            # 2. Crear Grupo
            group = Group.objects.create(
                project=project,
                mentor_id=mentor_id,
                schedule=schedule,
                location=location,
                mode=mode,
                start_date=start_date,
                end_date=end_date
            )
            
            # 3. 🔥 GENERAR EVENTOS AUTOMÁTICAMENTE
            events_created = self._generate_events_for_group(
                group=group,
                schedule_day=int(schedule_day),
                start_date=start_date,
                end_date=end_date,
                location=location
            )
            
            # 4. Serializar y retornar respuesta
            serializer = self.get_serializer(group)
            return Response({
                **serializer.data,
                'schedule': {
                    'id': schedule.id,
                    'day': schedule.day,
                    'start_time': str(schedule.start_time),
                    'end_time': str(schedule.end_time),
                    'created': schedule_created
                },
                'events_created': events_created,
                'message': f'✅ Grupo creado con {events_created} eventos generados automáticamente'
            }, status=status.HTTP_201_CREATED)
            
        except Project.DoesNotExist:
            return Response({
                'error': f'Proyecto con ID {project_id} no encontrado'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': f'Error al crear grupo: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    def _generate_events_for_group(self, group, schedule_day, start_date, end_date, location):
        """
        Genera eventos automáticamente para un grupo basado en su horario.
        
        Args:
            group: Instancia del Group creado
            schedule_day: Día de la semana (0=Lunes, 6=Domingo)
            start_date: Fecha de inicio del grupo
            end_date: Fecha de fin del grupo
            location: Ubicación del evento
        
        Returns:
            int: Número de eventos creados
        """
        # Encontrar el primer día que coincida con schedule_day
        current_date = start_date
        
        # current_date.weekday() retorna 0=Lunes, 6=Domingo (igual que schedule_day)
        while current_date.weekday() != schedule_day:
            current_date += timedelta(days=1)
            # Si superamos end_date sin encontrar el día, retornar 0
            if current_date > end_date:
                return 0
        
        # Crear eventos para cada ocurrencia del día especificado
        events_created = 0
        events_to_create = []
        
        while current_date <= end_date:
            events_to_create.append(
                Event(
                    group=group,
                    location=location,
                    event_date=current_date,  # ← Cambiar de date a event_date
                    start_date=current_date,
                    end_date=current_date
                )
            )
            events_created += 1
            current_date += timedelta(days=7)  # Siguiente semana (mismo día)
        
        # Crear todos los eventos en una sola operación (bulk_create es más eficiente)
        if events_to_create:
            Event.objects.bulk_create(events_to_create)
        
        return events_created

    def perform_create(self, serializer):
        """
        Este método ya no se usa porque create() maneja todo.
        Lo dejamos para compatibilidad pero no hace nada.
        """
        pass

    def update(self, request, *args, **kwargs):
        """
        Actualiza un grupo y REGENERA todos sus eventos si cambió el horario.
        
        Request body:
        {
            "mentor": 2,
            "location": "Nueva ubicación",
            "mode": "virtual",
            "start_date": "2024-02-01",
            "end_date": "2024-07-01",
            "schedule_day": 1,  // Cambió de Lunes a Martes
            "start_time": "10:00:00",  // Cambió de 8am a 10am
            "end_time": "12:00:00"
        }
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Obtener datos del request
        schedule_day = request.data.get('schedule_day')
        start_time_str = request.data.get('start_time')
        end_time_str = request.data.get('end_time')
        start_date_str = request.data.get('start_date')
        end_date_str = request.data.get('end_date')
        
        # Verificar si cambió el horario
        schedule_changed = False
        if schedule_day is not None or start_time_str or end_time_str:
            schedule_changed = True
            
            # Buscar o crear nuevo schedule
            if schedule_day and start_time_str and end_time_str:
                new_schedule, _ = Schedule.objects.get_or_create(
                    day=int(schedule_day),
                    start_time=start_time_str,
                    end_time=end_time_str
                )
                instance.schedule = new_schedule
        
        # Actualizar otros campos
        if request.data.get('mentor'):
            instance.mentor_id = request.data['mentor']
        if request.data.get('location'):
            instance.location = request.data['location']
        if request.data.get('mode'):
            instance.mode = request.data['mode']
        if start_date_str:
            instance.start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        if end_date_str:
            instance.end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        
        instance.save()
        
        # Si cambió el horario o fechas, REGENERAR eventos
        if schedule_changed or start_date_str or end_date_str:
            # 1. Eliminar eventos antiguos
            old_events_count = instance.event_set.count()
            instance.event_set.all().delete()
            
            # 2. Generar nuevos eventos
            new_events_count = self._generate_events_for_group(
                group=instance,
                schedule_day=instance.schedule.day,
                start_date=instance.start_date,
                end_date=instance.end_date,
                location=instance.location
            )
            
            serializer = self.get_serializer(instance)
            return Response({
                **serializer.data,
                'events_deleted': old_events_count,
                'events_created': new_events_count,
                'message': f'✅ Grupo actualizado. {old_events_count} eventos eliminados, {new_events_count} eventos creados'
            })
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """
        Elimina un grupo y TODOS sus eventos automáticamente (CASCADE).
        """
        instance = self.get_object()
        events_count = instance.event_set.count()
        group_id = instance.id
        
        # Django eliminará automáticamente los eventos por CASCADE
        self.perform_destroy(instance)
        
        return Response({
            'deleted': True,
            'group_id': group_id,
            'events_deleted': events_count,
            'message': f'✅ Grupo eliminado junto con {events_count} eventos'
        }, status=status.HTTP_200_OK)


class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer

    def get_queryset(self):
        group_id = self.kwargs["group_pk"]
        return Event.objects.filter(group_id=group_id)

    def perform_create(self, serializer):
        group_id = self.kwargs["group_pk"]
        serializer.save(group_id=group_id)

    @action(detail=True, methods=['post'])
    def cancel(self, request, *args, **kwargs):
        """
        Cancela un evento específico sin eliminarlo.
        
        POST /api/projects/{project_id}/groups/{group_id}/events/{event_id}/cancel/
        {
            "reason": "Día festivo"
        }
        """
        event = self.get_object()
        reason = request.data.get('reason', '')
        
        event.is_cancelled = True
        event.cancellation_reason = reason
        event.save()
        
        return Response({
            'cancelled': True,
            'event_id': event.id,
            'reason': reason,
            'message': '✅ Evento cancelado exitosamente'
        })
    
    @action(detail=True, methods=['post'])
    def restore(self, request, *args, **kwargs):
        """
        Restaura un evento cancelado.
        
        POST /api/projects/{project_id}/groups/{group_id}/events/{event_id}/restore/
        """
        event = self.get_object()
        
        event.is_cancelled = False
        event.cancellation_reason = None
        event.save()
        
        return Response({
            'restored': True,
            'event_id': event.id,
            'message': '✅ Evento restaurado exitosamente'
        })


class EventListViewSet(mixins.ListModelMixin,
                       mixins.RetrieveModelMixin,
                       viewsets.GenericViewSet):
    serializer_class = EventListSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['event_date', 'group', 'group__project']
    ordering_fields = ['event_date', 'group__schedule__start_time']
    ordering = ['event_date', 'group__schedule__start_time']
    
    def get_queryset(self):
        queryset = Event.objects.select_related(
            'group',
            'group__schedule',
            'group__project',
            'group__mentor',
            'group__mentor__profile',
            'group__mentor__profile__user'
        ).all()
        
        date_from = self.request.GET.get('event_date__gte')
        date_to = self.request.GET.get('event_date__lte')
        
        if date_from:
            queryset = queryset.filter(event_date__gte=date_from)
        if date_to:
            queryset = queryset.filter(event_date__lte=date_to)
        
        return queryset.order_by('event_date', 'group__schedule__start_time')