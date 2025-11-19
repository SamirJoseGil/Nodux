from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import UserSerializer, ScheduleSerializer
from .models import Schedule
from apps.projects.models import Project, Group
from apps.mentors.models import Mentor

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class ScheduleViewSet(ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer

class SummaryViewSet(ViewSet):
    """
    A read-only endpoint that returns the count of mentors, projects, and groups.
    """

    def list(self, request):
        data = {
            "mentors": Mentor.objects.count(),
            "projects": Project.objects.count(),
            "groups": Group.objects.count(),
        }
        return Response(data)
