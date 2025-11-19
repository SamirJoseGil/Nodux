from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.response import Response
from .serializers import MentorSerializer, MentorAttendanceSerializer
from .models import Mentor, MentorAttendance



class MentorViewSet(viewsets.ModelViewSet):
    queryset = Mentor.objects.all()
    serializer_class = MentorSerializer

    def destroy(self, request, *args, **kwargs):
        """
        Deletes a mentor along with all related resources:
        
        1. Deletes the certificate file if it exists.
        2. Deletes the profile photo if it exists.
        3. Deletes the associated user account and profile.
        4. Deletes the mentor instance itself.
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

class MentorAttendanceViewSet(viewsets.ModelViewSet):
    queryset = MentorAttendance.objects.all()
    serializer_class = MentorAttendanceSerializer

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        attendance = self.get_object()
        attendance.is_confirmed = True
        #attendance.confirmed_by = request.user 
        attendance.save()
        return Response({"status": "confirmed"}, status=status.HTTP_200_OK)
