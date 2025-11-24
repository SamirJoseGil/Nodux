from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from apps.core.services.files import FileService

# Create your models here.


def generateProfilePhotoPath(instance, filename):
    """
    Uses FileService to generate a random and organized file path
    for user profile photos.
    """
    return FileService.random_filename(filename, settings.PROFILE_PHOTOS_DIR)


class Schedule(models.Model):
    DAYS_OF_WEEK = [
        (0, "Lunes"),
        (1, "Martes"),
        (2, "Miercoles"),
        (3, "Jueves"),
        (4, "Viernes"),
        (5, "Sabado"),
        (6, "Domingo"),
    ]

    day = models.IntegerField(choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    phone = models.CharField(max_length=20, null=True, blank=True)
    photo = models.ImageField(upload_to=generateProfilePhotoPath, null=True, blank=True)
