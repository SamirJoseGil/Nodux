from rest_framework import serializers
from django.contrib.auth.models import User
from apps.core.models import Profile
from apps.core.serializers import ProfileSerializer
from apps.core.services.credentials import CredentialService
from .models import Mentor, MentorAttendance
from django.utils import timezone


class MentorSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    certificate = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = Mentor
        fields = ["id", "profile", "charge", "knowledge_level", "certificate"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        profile_data = validated_data.pop("profile")
        user_data = profile_data.pop("user")

        username = CredentialService.generateUsername(
            user_data["first_name"], user_data["last_name"]
        )
        password = CredentialService.generatePassword()

        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=user_data.get("first_name", ""),
            last_name=user_data.get("last_name", ""),
            email=user_data.get("email", ""),
        )

        profile = Profile.objects.create(user=user, **profile_data)
        mentor = Mentor.objects.create(profile=profile, **validated_data)

        return mentor

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", None)

        # --- Update Mentor fields ---
        for attr, value in validated_data.items():
            if attr == "certificate":
                # Delete old certificate if replacing
                if value and instance.certificate:
                    instance.certificate.delete(save=False)
                # Allow deleting certificate
                if value is None and instance.certificate:
                    instance.certificate.delete(save=True)
                else:
                    setattr(instance, attr, value)
            else:
                setattr(instance, attr, value)
        instance.save()

        # --- Update Profile fields ---
        if profile_data:
            user_data = profile_data.pop("user", None)
            for attr, value in profile_data.items():
                if attr == "photo":
                    # Delete old photo if replacing
                    if value and instance.profile.photo:
                        instance.profile.photo.delete(save=False)
                    # Allow deleting photo
                    if value is None and instance.profile.photo:
                        instance.profile.photo.delete(save=True)
                    else:
                        setattr(instance.profile, attr, value)
                else:
                    setattr(instance.profile, attr, value)
            instance.profile.save()

            # --- Update User fields ---
            if user_data:
                user = instance.profile.user
                for attr, value in user_data.items():
                    if attr == "password" and value:
                        user.set_password(value)
                    elif value is not None:
                        setattr(user, attr, value)
                user.save()

        return instance

    def to_representation(self, instance):
        """
        Returns a flat representation of the mentor,
        expanding the data from the related profile and user.
        Includes absolute URLs for the photo and certificate if they exist.
        """

        request = self.context.get("request")

        profile = getattr(instance, "profile", None)
        user = getattr(profile, "user", None) if profile else None

        photo_url = None
        if profile and profile.photo and hasattr(profile.photo, "url"):
            if request:
                photo_url = request.build_absolute_uri(profile.photo.url)
            else:
                photo_url = profile.photo.url

        certificate_url = None
        if (
            hasattr(instance, "certificate")
            and instance.certificate
            and hasattr(instance.certificate, "url")
        ):
            if request:
                certificate_url = request.build_absolute_uri(instance.certificate.url)
            else:
                certificate_url = instance.certificate.url

        return {
            "id": instance.id,
            "first_name": getattr(user, "first_name", None),
            "last_name": getattr(user, "last_name", None),
            "email": getattr(user, "email", None),
            "username": getattr(user, "username", None),
            "phone": getattr(profile, "phone", None),
            "photo": photo_url,
            "charge": getattr(instance, "charge", None),
            "knowledge_level": getattr(instance, "knowledge_level", None),
            "certificate": certificate_url,
        }


class MentorAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MentorAttendance
        fields = ["mentor", "registered_by", "hours"]

    def validate_hours(self, value):
        """Validates that hours are positive integers."""
        if value <= 0:
            raise serializers.ValidationError("Hours must be a positive integer.")
        return value

    def validate(self, attrs):
        """Avoid duplicated registers"""
        mentor = attrs.get("mentor")
        user = attrs.get("registered_by")
        today = timezone.now()

        if MentorAttendance.objects.filter(
            mentor=mentor, registered_by=user, date=today
        ).exists():
            raise serializers.ValidationError(
                "You have already registered hours for this mentor today."
            )
        return attrs
