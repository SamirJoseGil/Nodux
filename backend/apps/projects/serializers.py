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


# --- Event (global read-only endpoint with schedule info) ---
class EventListSerializer(serializers.ModelSerializer):
    """
    Read-only serializer for the global `/api/events/` endpoint.
    Includes schedule information for calendar display.
    """
    schedule = serializers.SerializerMethodField()
    group_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = "__all__"
    
    def get_schedule(self, obj):
        """
        Returns schedule information from the group's schedule.
        """
        if obj.group and obj.group.schedule:
            schedule = obj.group.schedule
            return {
                "id": schedule.id,
                "day": schedule.day,
                "day_name": schedule.get_day_display(),
                "start_time": obj.start_datetime.strftime("%H:%M:%S"),
                "end_time": obj.end_datetime.strftime("%H:%M:%S"),
                "start_hour": schedule.start_time.hour,
                "end_hour": schedule.end_time.hour,
                "duration": (schedule.end_time.hour - schedule.start_time.hour)
            }
        return None
    
    def get_group_info(self, obj):
        """
        Returns basic group information.
        """
        if obj.group:
            group = obj.group
            return {
                "id": group.id,
                "location": group.location,
                "mode": group.mode,
                "project": group.project.name if group.project else None,
                "mentor": {
                    "id": group.mentor.id,
                    "name": f"{group.mentor.profile.user.first_name} {group.mentor.profile.user.last_name}"
                } if group.mentor else None
            }
        return None
    
    def to_representation(self, instance):
        """
        Custom representation optimized for calendar view.
        """
        representation = super().to_representation(instance)
        
        # Renombrar event_date a date para el frontend
        if 'event_date' in representation:
            representation['date'] = representation.pop('event_date')
        
        # Flatten schedule data for easier frontend consumption
        schedule = representation.pop('schedule', None)
        if schedule:
            representation['schedule_id'] = schedule['id']
            representation['schedule_day'] = schedule['day']
            representation['schedule_day_name'] = schedule['day_name']
            representation['start_time'] = schedule['start_time']
            representation['end_time'] = schedule['end_time']
            representation['start_hour'] = schedule['start_hour']
            representation['end_hour'] = schedule['end_hour']
            representation['duration'] = schedule['duration']
        else:
            # Defaults si no hay schedule
            representation['schedule_id'] = None
            representation['schedule_day'] = None
            representation['schedule_day_name'] = None
            representation['start_time'] = "08:00:00"
            representation['end_time'] = "10:00:00"
            representation['start_hour'] = 8
            representation['end_hour'] = 10
            representation['duration'] = 2
        
        return representation
