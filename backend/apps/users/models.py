from django.db import models
from django.contrib.auth.models import User

# Create your models here.

def generateProfilePhotoPath(instance, filename):
    """
    Uses FileService to generate a random and organized file path
    for user profile photos.
    """
    return FileService.random_filename(filename, settings.PROFILE_PHOTOS_DIR)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    phone = models.CharField(max_length=20, null=True, blank=True)
    photo = models.ImageField(upload_to=generateProfilePhotoPath, null=True, blank=True)
