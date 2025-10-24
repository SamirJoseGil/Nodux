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

    @action(detail=True, methods=["get", "post"])
    def hours(self, request, pk=None):
        """
        Allows registering hours for a mentor.
        Validations:

        The 'hours' field is required.

        Must be a positive integer.

        Prevents daily duplicates per mentor.
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
        
