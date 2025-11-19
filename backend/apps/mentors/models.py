from django.db import models
from django.contrib.auth.models import User
from apps.core.models import Schedule
from apps.core.services.files import FileService
from django.conf import settings
from apps.core.models import Profile
from datetime import date

# Create your models here.


def generateCertificatePath(instance, filename):
    """
    Uses FileService to generate a random and organized file path
    for mentor certificates (ONLY SERVES FOR CALLING FileServices, we're trying to preserve clean arquitecture).
    """
    return FileService.random_filename(filename, settings.MENTORS_CERTIFICATES_DIR)

class Mentor(models.Model):
    CHOICES_KNOWLEDGE = [
        ("basico", "Básico"),
        ("intermedio", "Intermedio"),
        ("avanzado", "Avanzado"),
    ]

    profile = models.OneToOneField(to=Profile, on_delete=models.CASCADE)
    charge = models.CharField(max_length=20)
    knowledge_level = models.CharField(max_length=20, choices=CHOICES_KNOWLEDGE)
    certificate = models.FileField(
        upload_to=generateCertificatePath,
        null=True,
        blank=True,
    )

    class Meta:
        ordering = ["id"]


class MentorAttendance(models.Model):
    mentor = models.ForeignKey(to=Mentor, on_delete=models.CASCADE)
    confirmed_by = models.ForeignKey(to=User, on_delete=models.CASCADE, blank=True, null=True)
    hours = models.IntegerField()
    is_confirmed = models.BooleanField(default=False)
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()


class MentorAvailability(models.Model):
    mentor = models.ForeignKey(to=Mentor, on_delete=models.CASCADE)
    schedule = models.ForeignKey(to=Schedule, on_delete=models.CASCADE)
