from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "username", "password"]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("El email ya está registrado.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("El username ya está en uso.")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    photo = serializers.ImageField(required=False, allow_null=True)
    role = serializers.ChoiceField(
        choices=Profile.ROLE_CHOICES,
        required=False,
        default='Usuario base'
    )

    class Meta:
        model = Profile
        fields = ["id", "user", "phone", "photo", "role"]

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        role = validated_data.get('role', 'Usuario base')
        
        # Crear usuario
        user = UserSerializer().create(user_data)
        
        # Crear perfil con rol
        profile = Profile.objects.create(
            user=user,
            phone=validated_data.get('phone', ''),
            photo=validated_data.get('photo'),
            role=role
        )
        return profile

    def to_representation(self, instance):
        """
        Returns a flat representation of the profile with user data,
        absolute URL for the photo if it exists, and role information.
        """
        request = self.context.get("request")
        
        user = instance.user
        
        photo_url = None
        if instance.photo and hasattr(instance.photo, "url"):
            if request:
                photo_url = request.build_absolute_uri(instance.photo.url)
            else:
                photo_url = instance.photo.url
        
        return {
            "id": instance.id,
            "user": {
                "id": user.id,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
            },
            "phone": instance.phone,
            "photo": photo_url,
            "role": instance.role,
        }

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)