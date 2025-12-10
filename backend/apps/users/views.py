from django.shortcuts import render
from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User
from .models import Profile
from .serializers import ChangePasswordSerializer, ProfileSerializer
from apps.users.permissions import RolePermission
from rest_framework.decorators import api_view, permission_classes
import logging

logger = logging.getLogger(__name__)


class RegisterView(generics.CreateAPIView):
    """
    Endpoint: POST /api/users/register/
    Registers a new user with profile and role.
    No authentication required.
    """
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]
    authentication_classes = []  # ← IMPORTANTE: Sin autenticación


class CurrentUserView(APIView):
    """
    Endpoint: GET /api/users/me/
    Returns the current authenticated user's profile information including role.
    Requires JWT authentication.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        try:
            profile = user.profile
            serializer = ProfileSerializer(profile, context={'request': request})
            data = dict(serializer.data)
            
            # Asegurar que el rol esté disponible
            data['role'] = profile.role
            
            return Response(data, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response(
                {"error": "Profile not found for this user"},
                status=status.HTTP_404_NOT_FOUND
            )


class ChangePasswordView(APIView):
    """
    Endpoint: POST /api/users/change-password/
    Allows an authenticated user to change their password.
    Requires JWT authentication.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = request.user

        old_password = serializer.validated_data["old_password"]
        new_password = serializer.validated_data["new_password"]

        if not user.check_password(old_password):
            return Response(
                {"error": "Current password is incorrect"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Cambiar contraseña
        user.set_password(new_password)
        user.save()

        return Response(
            {"message": "Password changed succesfully"},
            status=status.HTTP_200_OK
        )


class UserManagementViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Admin to manage users and roles.
    
    Endpoints:
    - GET /api/users/manage/ - List all users
    - GET /api/users/manage/{id}/ - Get user details
    - PATCH /api/users/manage/{id}/ - Update user role
    - DELETE /api/users/manage/{id}/ - Delete user
    
    Permissions: SuperAdmin, Admin only
    """
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, RolePermission]
    required_permission = 'users.write'
    
    def get_queryset(self):
        """
        SuperAdmin can see all users.
        Admin can see all users except SuperAdmin.
        """
        user = getattr(self.request, "user", None)
        profile = getattr(user, "profile", None)
        user_role = getattr(profile, "role", None)

        if user_role == 'SuperAdmin':
            return Profile.objects.all()
        elif user_role == 'Admin':
            return Profile.objects.exclude(role='SuperAdmin')

        return Profile.objects.none()
    
    def update(self, request, *args, **kwargs):
        """
        Update user profile and role.
        Only SuperAdmin can change roles to SuperAdmin.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Validar permisos especiales
        new_role = request.data.get('role')
        user_role = request.user.profile.role
        
        # Solo SuperAdmin puede asignar rol SuperAdmin
        if new_role == 'SuperAdmin' and user_role != 'SuperAdmin':
            return Response(
                {"error": "Only SuperAdmin can assign SuperAdmin role"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # No permitir que Admin se quite su propio rol de Admin
        if instance.user == request.user and user_role == 'Admin' and new_role != 'Admin':
            return Response(
                {"error": "You cannot change your own admin role"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Actualizar rol
        if new_role and new_role in dict(Profile.ROLE_CHOICES):
            instance.role = new_role
            instance.save()
        
        serializer = self.get_serializer(instance, context={'request': request})
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        """
        Delete user, profile, and related data.
        Cannot delete yourself or other SuperAdmins.
        """
        instance = self.get_object()
        user_role = request.user.profile.role
        
        # No permitir eliminar a uno mismo
        if instance.user == request.user:
            return Response(
                {"error": "You cannot delete yourself"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Solo SuperAdmin puede eliminar a otros SuperAdmins
        if instance.role == 'SuperAdmin' and user_role != 'SuperAdmin':
            return Response(
                {"error": "Only SuperAdmin can delete other SuperAdmins"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Eliminar foto si existe
        if instance.photo:
            instance.photo.delete(save=False)
        
        # Eliminar usuario (esto eliminará el profile en cascada)
        instance.user.delete()
        
        return Response(
            {"deleted": True, "username": instance.user.username},
            status=status.HTTP_200_OK
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def debug_permissions(request):
    """
    Endpoint temporal para debugging de permisos.
    GET /api/users/debug-permissions/
    """
    try:
        user = request.user
        profile = user.profile
        
        from apps.users.permissions import RolePermission
        user_permissions = RolePermission.ROLE_PERMISSIONS.get(profile.role, [])
        
        # Verificar permisos específicos
        has_mentors_read = (
            'mentors.read' in user_permissions or 
            'mentors.*' in user_permissions or 
            '*' in user_permissions
        )
        has_mentors_write = (
            'mentors.write' in user_permissions or 
            'mentors.*' in user_permissions or 
            '*' in user_permissions
        )
        
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_authenticated': user.is_authenticated,
                'is_superuser': user.is_superuser,
            },
            'profile': {
                'id': profile.id,
                'role': profile.role,
            },
            'permissions': user_permissions,
            'checks': {
                'has_mentors_read': has_mentors_read,
                'has_mentors_write': has_mentors_write,
                'is_superadmin': profile.role == 'SuperAdmin',
                'has_wildcard': '*' in user_permissions,
            },
            'debug_info': {
                'request_path': request.path,
                'request_method': request.method,
                'auth_header': request.headers.get('Authorization', 'Not present')[:50] + '...' if request.headers.get('Authorization') else 'Not present',
            }
        }, status=status.HTTP_200_OK)
    except Exception as e:
        import traceback
        return Response({
            'error': str(e),
            'traceback': traceback.format_exc()
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
