from rest_framework import serializers
from .models import Project, Group, Event


# --- Project ---
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"


# --- Group ---
class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"
        extra_kwargs = {
            "project": {"read_only": True}
        }


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
    class Meta:
        model = Event
        fields = "__all__"
