from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.response import Response
from .serializers import MentorSerializer
from .models import Mentor, MentorAttendance
from .serializers import MentorAttendanceSerializer


class MentorViewSet(viewsets.ModelViewSet):
    queryset = Mentor.objects.all()
    serializer_class = MentorSerializer

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
            registeredAttendance = MentorAttendance.objects.all()
            serializer = MentorAttendanceSerializer(registeredAttendance, many=True)
            return Response(serializer.data)
        elif request.method == "POST":
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
