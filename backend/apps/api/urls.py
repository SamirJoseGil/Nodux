# 3rd party imports
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Local imports
from apps.mentors.views import MentorViewSet
from apps.projects.views import (
    ProjectViewSet,
    GroupViewSet,
    EventViewSet,
    EventListViewSet,  # 👈 nuevo viewset
)
from apps.core.views import ScheduleViewSet

# --- Router principal ---
router = DefaultRouter()
router.register(r"mentors", MentorViewSet, basename="mentor")
router.register(r"attendance", MentorAttendanceViewSet, basename="attendance")
router.register(r"projects", ProjectViewSet, basename="project")
router.register(r"schedule", ScheduleViewSet, basename="schedule")

# 👇 Nuevo endpoint global solo lectura de eventos
router.register(r"events", EventListViewSet, basename="events")

# --- Routers anidados ---
projectsRouter = routers.NestedDefaultRouter(router, r"projects", lookup="project")
projectsRouter.register(r"groups", GroupViewSet, basename="projects-groups")

groupsRouter = routers.NestedDefaultRouter(projectsRouter, r"groups", lookup="group")
groupsRouter.register(r"events", EventViewSet, basename="projects-groups-events")

# --- URL patterns ---
app_name = "api"

urlpatterns = [
    # Recursos principales
    path("", include(router.urls)),
    path("", include(projectsRouter.urls)),
    path("", include(groupsRouter.urls)),

    # Users (Register + Login)
    path("users/", include("apps.users.urls")),
]
