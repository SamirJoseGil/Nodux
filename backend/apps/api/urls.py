# 3rd party imports
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,   # for login
    TokenRefreshView       # for renovating access token
)

# Local imports
from apps.mentors.views import MentorViewSet
from apps.projects.views import ProjectViewSet

router = DefaultRouter()
router.register(r"mentors", MentorViewSet, basename="mentor")
router.register(r'projects', ProjectViewSet, basename="project")

app_name = "api"

urlpatterns = [
    #Resource routes
    path("", include((router.urls, app_name))),
    # Auth routes
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
