from rest_framework import serializers
from .models import Project, Group, Event
from apps.core.serializers import ScheduleSerializer
from apps.core.models import Schedule

class GroupSerializer(serializers.ModelSerializer):
    schedule = serializers.PrimaryKeyRelatedField(
        queryset=Schedule.objects.all(),
        required=False
    )

    class Meta:
        model = Group
        fields = "__all__"
        extra_kwargs = {"project": {"read_only": True}}

    def to_internal_value(self, data):
        """
        Override to allow both dict (new Schedule) and pk (existing Schedule).
        """
        schedule_data = data.get("schedule")

        # Si es un diccionario, lo dejamos como está (para crear un nuevo Schedule)
        if isinstance(schedule_data, dict):
            data = data.copy()
            data.pop("schedule")
        return super().to_internal_value(data)

    def create(self, validated_data):
        """
        Create Group and its Schedule if nested data provided.
        """
        request_data = self.context["request"].data
        schedule_data = request_data.get("schedule")

        # Si el usuario mandó un diccionario, creamos el Schedule
        if isinstance(schedule_data, dict):
            schedule = Schedule.objects.create(**schedule_data)
            validated_data["schedule"] = schedule

        return Group.objects.create(**validated_data)
    
# --- Project ---
class ProjectSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'is_active', 'groups']




# --- Event (used in nested routes) ---
class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = "__all__"
        extra_kwargs = {
            "group": {"read_only": True}
        }


# --- Event (global read-only endpoint) ---
class EventListSerializer(serializers.ModelSerializer):
    """
    Read-only serializer for the global `/api/events/` endpoint.
    """
    schedule = ScheduleSerializer(read_only=True)
    class Meta:
        model = Event
        fields = "__all__"
