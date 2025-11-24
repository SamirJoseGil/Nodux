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
