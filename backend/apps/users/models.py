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

class Profile(models.Model):
    ROLE_CHOICES = [
        ('SuperAdmin', 'Super Administrador'),
        ('Admin', 'Administrador'),
        ('Mentor', 'Mentor'),
        ('Estudiante', 'Estudiante'),
        ('Trabajador', 'Trabajador'),
        ('Usuario base', 'Usuario Base'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    phone = models.CharField(max_length=20, null=True, blank=True)
    photo = models.ImageField(upload_to=generateProfilePhotoPath, null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Usuario base')
    
    class Meta:
        ordering = ['id']
    
    def __str__(self):
        return f"{self.user.username} - {self.role}"
