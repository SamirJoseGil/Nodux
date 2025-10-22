from django.contrib.auth.models import User
from django.db import transaction
from .models import Mentor
from apps.core.models import Profile
from apps.core.serializers import UserSerializer, ProfileSerializer
from apps.core.services.credentials import CredentialService
from apps.core.services.files import FileService
from rest_framework.exceptions import ValidationError


def createMentorWithProfileAndUser(
    user_data: dict, mentor_data: dict, profile_data: dict
) -> Mentor:
    """
    Creates User, Profile, and Mentor in a single atomic transaction.
    Performs full validation using the serializers.
    Returns the created Mentor instance.
    """

    with transaction.atomic():
        # --------------------
        # Validate User
        # --------------------
        temp_user_data = user_data.copy()
        temp_user_data["username"] = CredentialService.generate_username(
            temp_user_data["first_name"], temp_user_data["last_name"]
        )
        temp_user_data["password"] = CredentialService.generate_password()

        user_serializer = UserSerializer(data=temp_user_data)
        if not user_serializer.is_valid():
            raise ValidationError({"user_errors": user_serializer.errors})

        # Create User
        user = user_serializer.save()

        # --------------------
        # Validate Profile
        # --------------------
        profile_data = profile_data.copy()
        profile_data["user"] = user.id  # assign user for validation

        profile_serializer = ProfileSerializer(data=profile_data)
        if not profile_serializer.is_valid():
            raise ValidationError({"profile_errors": profile_serializer.errors})

        # Handle photo file naming using FileService
        if profile_data.get("photo"):
            profile_serializer.validated_data["photo"].name = (
                FileService.random_filename(
                    profile_data["photo"].name, folder="profiles/photos"
                )
            )

        # Create Profile
        profile = profile_serializer.save(user=user)

        # --------------------
        # Create Mentor
        # --------------------
        mentor = Mentor.objects.create(profile=profile, **mentor_data)

    return mentor
