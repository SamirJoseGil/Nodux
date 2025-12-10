from django.db import models
from apps.mentors.models import Mentor
from apps.core.models import Schedule
from datetime import date, datetime


class Project(models.Model):
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=False)

    class Meta:
        ordering = ["id"]


class Group(models.Model):
    CHOICES_MODE = [
        ("presencial", "Presencial"),
        ("virtual", "Virtual"),
        ("hibrido", "Híbrido"),
    ]

    project = models.ForeignKey(to=Project, on_delete=models.CASCADE)
    mentor = models.ForeignKey(to=Mentor, on_delete=models.PROTECT, null=True)
    schedule = models.ForeignKey(to=Schedule, on_delete=models.PROTECT, null=True)
    location = models.CharField(max_length=255)
    mode = models.CharField(max_length=10, choices=CHOICES_MODE)
    start_date = models.DateField()
    end_date = models.DateField()

    class Meta:
        ordering = ["id"]


class Event(models.Model):
    group = models.ForeignKey(to=Group, on_delete=models.CASCADE)
    location = models.CharField(max_length=255)
    event_date = models.DateField(default=date.today)
    start_datetime = models.DateTimeField(default=datetime.now)
    end_datetime = models.DateTimeField(default=datetime.now)
    is_cancelled = models.BooleanField(default=False)
    cancellation_reason = models.TextField(blank=True, null=True)
    attendance_generated = models.BooleanField(default=False)


    class Meta:
        ordering = ["id"]
