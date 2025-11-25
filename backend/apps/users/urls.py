from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, ChangePasswordView, CurrentUserView, UserManagementViewSet

# Router para gestión de usuarios
router = DefaultRouter()
router.register(r'manage', UserManagementViewSet, basename='user-management')

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", CurrentUserView.as_view(), name="current-user"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    
    # Endpoints de gestión de usuarios (Admin/SuperAdmin only)
    path("", include(router.urls)),
]