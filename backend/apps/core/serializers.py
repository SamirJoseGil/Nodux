# serializers.py
import uuid
from django.contrib.auth.models import User
from rest_framework import serializers
from apps.users.models import Profile
from .models import Schedule


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = "__all__"

    def validate(self, data):
        start_time = data.get('start_time')
        end_time = data.get('end_time')

        if start_time and end_time and end_time <= start_time:
            raise serializers.ValidationError({
                "end_time": "end_time must be greater than start_time"
            })

        return data