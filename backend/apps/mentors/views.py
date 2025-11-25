from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.users.permissions import RolePermission
from .serializers import MentorSerializer, MentorAttendanceSerializer
from .models import Mentor, MentorAttendance


class MentorViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing mentors.
    
    Permissions:
    - List/Read: Admin, Mentor
    - Create/Update/Delete: Admin only
    """
    queryset = Mentor.objects.all()
    serializer_class = MentorSerializer
    permission_classes = [IsAuthenticated, RolePermission]
    required_permission = 'mentors.write'

    def destroy(self, request, *args, **kwargs):
        """
        Deletes a mentor along with all related resources.
        Only accessible by Admin and SuperAdmin roles.
        """
        mentor = self.get_object()

        # Delete certificate file
        if mentor.certificate:
            mentor.certificate.delete(save=False)

        # Delete profile photo if exists
        if mentor.profile.photo:
            mentor.profile.photo.delete(save=False)

        # Delete associated user, profile and mentor.
        mentor.profile.user.delete()

        return Response({"deleted": True, "id": mentor.id}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get", "post"])
    def hours(self, request, pk=None):
        """
        Allows registering hours for a mentor.
        GET: Anyone with mentors.read permission
        POST: Anyone with attendance.write permission
        """
        if request.method == "GET":
            # Get all registered attendances
            registeredAttendance = MentorAttendance.objects.all()
            serializer = MentorAttendanceSerializer(registeredAttendance, many=True)
            return Response(serializer.data)
        elif request.method == "POST":
            # Register new hours for the mentor
            mentor = self.get_object()
            user = request.user
            hours = request.data.get("hours")

            data = {
                "mentor": mentor.id,
                "registered_by": user.id,
                "hours": hours,
            }

            serializer = MentorAttendanceSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save(registered_by=user)

            return Response(serializer.data, status=status.HTTP_201_CREATED)


class MentorAttendanceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet de solo lectura para ver todas las asistencias registradas.
    
    Permissions:
    - List/Read: Admin, Mentor
    
    Endpoints:
    - GET /api/attendance/ - Lista todas las asistencias
    - GET /api/attendance/{id}/ - Detalle de una asistencia
    """
    queryset = MentorAttendance.objects.all()
    serializer_class = MentorAttendanceSerializer
    permission_classes = [IsAuthenticated, RolePermission]
    required_permission = 'attendance.read'
