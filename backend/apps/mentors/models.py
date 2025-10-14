from django.db import models
from django.contrib.auth.models import User
from apps.core.models import Schedule

# Create your models here.

class Mentor(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    charge = models.CharField(max_length=20)
    phone = models.CharField(max_length=20)
    knownledge_level = models.CharField(max_length=20)
    certificate_url = models.CharField(max_length=255)
    photo_url = models.CharField(max_length=255)


class MentorAttendance(models.Model):
    mentor = models.ForeignKey(to=Mentor, on_delete=models.CASCADE)
    registered_by = models.ForeignKey(to=User, on_delete=models.CASCADE)
    hours = models.IntegerField()


class MentorAvailability(models.Model):
    mentor = models.ForeignKey(to=Mentor, on_delete=models.CASCADE)
    schedule = models.ForeignKey(to=Schedule, on_delete=models.CASCADE)

