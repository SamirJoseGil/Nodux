from rest_framework import viewsets, mixins
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

    def perform_create(self, serializer):
        project_id = self.kwargs["project_pk"]
        serializer.save(project_id=project_id)


class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer

    def get_queryset(self):
        group_id = self.kwargs["group_pk"]
        return Event.objects.filter(group_id=group_id)

    def perform_create(self, serializer):
        group_id = self.kwargs["group_pk"]
        serializer.save(group_id=group_id)


class EventListViewSet(mixins.ListModelMixin,
                       mixins.RetrieveModelMixin,
                       viewsets.GenericViewSet):
    """
    Endpoint: /api/events/
    Only allows GET (list and retrieve).
    """
    queryset = Event.objects.all()
    serializer_class = EventListSerializer
