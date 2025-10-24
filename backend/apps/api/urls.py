# 3rd party imports
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,  # for login
    TokenRefreshView,  # for renovating access token
)

# Local imports
from apps.mentors.views import MentorViewSet
from apps.projects.views import (
    ProjectViewSet,
    GroupViewSet,
    EventViewSet,
    EventListViewSet,
)
from apps.core.views import ScheduleViewSet, SummaryViewSet


# --- Router principal ---
router = DefaultRouter()
router.register(r"mentors", MentorViewSet, basename="mentor")
router.register(r"projects", ProjectViewSet, basename="project")
router.register(r"schedule", ScheduleViewSet, basename="schedule")
router.register(r"events", EventListViewSet, basename="events")
router.register(r"stats", SummaryViewSet, basename="stats")

# --- Routers anidados ---
# /projects/{pk}/groups/
projectsRouter = routers.NestedDefaultRouter(router, r"projects", lookup="project")
projectsRouter.register(r"groups", GroupViewSet, basename="projects-groups")

# /projects/{pk}/groups/{pk}/events/
groupsRouter = routers.NestedDefaultRouter(projectsRouter, r"groups", lookup="group")
groupsRouter.register(r"events", EventViewSet, basename="projects-groups-events")


# --- URL patterns ---
app_name = "api"

urlpatterns = [
    # Recursos principales
    path("", include((router.urls, app_name))),
    path("", include((projectsRouter.urls, app_name))),
    path("", include((groupsRouter.urls, app_name))),

    # Autenticación JWT
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
