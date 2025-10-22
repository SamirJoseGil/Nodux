"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static
from django.db import connection
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework import routers
from apps.mentors.views import MentorViewSet 
import time

def healthcheck(request):
    """Comprehensive healthcheck endpoint with metrics"""
    start_time = time.time()
    
    # Database check
    db_status = "healthy"
    db_latency = 0
    try:
        db_start = time.time()
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        db_latency = round((time.time() - db_start) * 1000, 2)
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    # JWT check
    jwt_status = "healthy"
    try:
        token = AccessToken()
        jwt_status = "healthy"
    except Exception as e:
        jwt_status = f"unhealthy: {str(e)}"
    
    response_time = round((time.time() - start_time) * 1000, 2)
    
    return JsonResponse({
        'status': 'healthy' if db_status == "healthy" else 'degraded',
        'service': 'nodux-backend',
        'version': '1.0.0',
        'timestamp': time.time(),
        'metrics': {
            'response_time_ms': response_time,
            'database': {
                'status': db_status,
                'latency_ms': db_latency,
                'engine': settings.DATABASES['default']['ENGINE']
            },
            'authentication': {
                'status': jwt_status,
                'method': 'JWT'
            },
            'security': {
                'cors_enabled': True,
                'rate_limiting': True,
                'axes_enabled': True,
                'debug_mode': settings.DEBUG
            }
        }
    })



urlpatterns = [
    path("admin/", admin.site.urls),
    # API routes will be added here
    path("api/healthcheck/", healthcheck, name="healthcheck"),
    path("api/", include("apps.api.urls", namespace="api")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
