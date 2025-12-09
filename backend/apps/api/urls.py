# 3rd party imports
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from django.http import JsonResponse

# Local imports
from apps.mentors.views import MentorViewSet, MentorAttendanceViewSet
from apps.projects.views import ProjectViewSet, GroupViewSet, EventViewSet, EventListViewSet
from apps.core.views import ScheduleViewSet

# Admin endpoints
from apps.core.views import (
    admin_dashboard_stats,
    system_settings,
    update_system_settings,
    role_statistics,
)

# --- Router principal ---
router = DefaultRouter()
router.register(r"mentors", MentorViewSet, basename="mentor")
router.register(r"attendance", MentorAttendanceViewSet, basename="attendance")
router.register(r"projects", ProjectViewSet, basename="project")
router.register(r"schedule", ScheduleViewSet, basename="schedule")

# Endpoint optimizado para eventos con información de schedule
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
    # Admin endpoints
    path("admin/dashboard/stats/", admin_dashboard_stats, name="admin-dashboard-stats"),
    path("admin/settings/", system_settings, name="system-settings"),
    path("admin/settings/update/", update_system_settings, name="update-system-settings"),
    path("admin/roles/statistics/", role_statistics, name="role-statistics"),
    # Users endpoints (Register, Login, Profile, User Management)
    # Estos endpoints incluyen:
    # - POST /api/users/register/ (registro de nuevos usuarios)
    # - POST /api/users/login/ (autenticación)
    # - POST /api/users/refresh/ (refresh token)
    # - GET /api/users/me/ (perfil del usuario actual)
    # - GET /api/users/manage/ (lista de usuarios - Admin)
    # - GET /api/users/manage/:id/ (detalle de usuario - Admin)
    # - PATCH /api/users/manage/:id/ (actualizar usuario - Admin)
    # - DELETE /api/users/manage/:id/ (eliminar usuario - Admin)
    path("users/", include("apps.users.urls")),
    # Health check
    path("healthcheck/", lambda request: JsonResponse({"status": "healthy"}), name="healthcheck"),
]
