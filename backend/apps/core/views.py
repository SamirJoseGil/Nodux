from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta
from apps.users.models import Profile
from apps.projects.models import Project, Group
from apps.mentors.models import Mentor
from .serializers import ScheduleSerializer
from .models import Schedule

class ScheduleViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar horarios (Schedule)
    """
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated]

# TODO: Temporalmente comentado - Requiere configurar is_staff en usuarios Admin
# @api_view(['GET'])
# @permission_classes([IsAuthenticated, IsAdminUser])
# def admin_dashboard_stats(request):
#     """
#     Obtiene estadísticas generales del sistema para el dashboard de administración
#     """
#     try:
#         # Contar usuarios totales y activos
#         total_users = User.objects.count()
#         active_users = User.objects.filter(is_active=True).count()
#         
#         # Usuarios nuevos esta semana
#         one_week_ago = timezone.now() - timedelta(days=7)
#         new_users_this_week = User.objects.filter(date_joined__gte=one_week_ago).count()
#         
#         # Contar roles únicos
#         unique_roles = Profile.objects.values('role').distinct().count()
#         
#         # Contar módulos (hardcoded por ahora, puedes hacerlo dinámico)
#         total_modules = 3  # Académico, Producto, Administración
#         
#         # Estadísticas de proyectos y grupos (si existen)
#         total_projects = Project.objects.count()
#         total_groups = Group.objects.count()
#         total_mentors = Mentor.objects.count()
#         
#         # Actividad reciente (últimos 5 logs de usuarios)
#         recent_users = User.objects.order_by('-last_login')[:5]
#         activity_logs = [
#             {
#                 'id': str(user.id),
#                 'user': user.get_full_name() or user.username,
#                 'action': 'Inicio de sesión',
#                 'target': user.email,
#                 'timestamp': user.last_login.isoformat() if user.last_login else timezone.now().isoformat()
#             }
#             for user in recent_users
#         ]
#         
#         # Salud del sistema (mock data - puedes integrar con psutil para datos reales)
#         system_health = {
#             'cpu': 32,
#             'memory': 45,
#             'storage': 28
#         }
#         
#         # Intentos de login (mock data)
#         login_attempts = {
#             'successful': 245,
#             'failed': 18
#         }
#         
#         return Response({
#             'totalUsers': total_users,
#             'activeUsers': active_users,
#             'totalRoles': unique_roles,
#             'totalModules': total_modules,
#             'newUsersThisWeek': new_users_this_week,
#             'totalProjects': total_projects,
#             'totalGroups': total_groups,
#             'totalMentors': total_mentors,
#             'loginAttempts': login_attempts,
#             'systemHealth': system_health,
#             'activityLogs': activity_logs
#         })
#         
#     except Exception as e:
#         return Response(
#             {'error': str(e)},
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR
#         )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard_stats(request):
    """
    Versión simplificada de estadísticas (sin IsAdminUser)
    TODO: Agregar validación de roles en el futuro
    """
    try:
        # Verificar si el usuario tiene rol Admin o SuperAdmin
        try:
            profile = Profile.objects.get(user=request.user)
            if profile.role not in ['Admin', 'SuperAdmin']:
                return Response(
                    {'error': 'No tienes permisos para acceder a esta información'},
                    status=status.HTTP_403_FORBIDDEN
                )
        except Profile.DoesNotExist:
            return Response(
                {'error': 'Perfil de usuario no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )

        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        
        one_week_ago = timezone.now() - timedelta(days=7)
        new_users_this_week = User.objects.filter(date_joined__gte=one_week_ago).count()
        
        unique_roles = Profile.objects.values('role').distinct().count()
        total_modules = 3
        
        total_projects = Project.objects.count()
        total_groups = Group.objects.count()
        total_mentors = Mentor.objects.count()
        
        recent_users = User.objects.order_by('-last_login')[:5]
        activity_logs = [
            {
                'id': str(user.pk),
                'user': user.get_full_name() or user.username,
                'action': 'Inicio de sesión',
                'target': user.email,
                'timestamp': user.last_login.isoformat() if user.last_login else timezone.now().isoformat()
            }
            for user in recent_users
        ]
        
        system_health = {'cpu': 32, 'memory': 45, 'storage': 28}
        login_attempts = {'successful': 245, 'failed': 18}
        
        return Response({
            'totalUsers': total_users,
            'activeUsers': active_users,
            'totalRoles': unique_roles,
            'totalModules': total_modules,
            'newUsersThisWeek': new_users_this_week,
            'totalProjects': total_projects,
            'totalGroups': total_groups,
            'totalMentors': total_mentors,
            'loginAttempts': login_attempts,
            'systemHealth': system_health,
            'activityLogs': activity_logs
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def system_settings(request):
    """
    Obtiene la configuración actual del sistema
    TODO: Implementar guardado en base de datos
    """
    try:
        profile = Profile.objects.get(user=request.user)
        if profile.role not in ['Admin', 'SuperAdmin']:
            return Response(
                {'error': 'No tienes permisos para acceder a esta información'},
                status=status.HTTP_403_FORBIDDEN
            )
    except Profile.DoesNotExist:
        return Response(
            {'error': 'Perfil de usuario no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )

    return Response({
        'general': {
            'siteName': 'Nodux',
            'siteDescription': 'Plataforma de gestión académica y de proyectos',
            'maintenanceMode': False,
            'allowRegistration': True
        },
        'security': {
            'loginAttempts': 5,
            'sessionTimeout': 60,
            'passwordMinLength': 8,
            'requireTwoFactor': False
        },
        'notifications': {
            'emailNotifications': True,
            'browserNotifications': True,
            'slackIntegration': False,
            'discordIntegration': False
        },
        'modules': {
            'academicModule': True,
            'productModule': True,
            'hrModule': False
        }
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_system_settings(request):
    """
    Actualiza la configuración del sistema
    TODO: Implementar lógica de guardado en BD
    """
    try:
        profile = Profile.objects.get(user=request.user)
        if profile.role not in ['Admin', 'SuperAdmin']:
            return Response(
                {'error': 'No tienes permisos para realizar esta acción'},
                status=status.HTTP_403_FORBIDDEN
            )
    except Profile.DoesNotExist:
        return Response(
            {'error': 'Perfil de usuario no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )

    settings_data = request.data
    
    # TODO: Implementar lógica de guardado en BD
    # Por ahora solo simulamos el guardado
    
    return Response({
        'success': True,
        'message': 'Configuración actualizada exitosamente (modo demo)',
        'settings': settings_data
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def role_statistics(request):
    """
    Obtiene estadísticas de roles del sistema
    """
    try:
        profile = Profile.objects.get(user=request.user)
        if profile.role not in ['Admin', 'SuperAdmin']:
            return Response(
                {'error': 'No tienes permisos para acceder a esta información'},
                status=status.HTTP_403_FORBIDDEN
            )
    except Profile.DoesNotExist:
        return Response(
            {'error': 'Perfil de usuario no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    try:
        role_counts = Profile.objects.values('role').annotate(
            count=Count('id')
        ).order_by('-count')
        
        role_stats = []
        role_descriptions = {
            'SuperAdmin': {
                'description': 'Acceso total al sistema',
                'permissions': ['*']
            },
            'Admin': {
                'description': 'Gestión de usuarios y módulos',
                'permissions': ['academic.*', 'product.*', 'admin.*', 'users.write']
            },
            'Mentor': {
                'description': 'Gestión de grupos académicos',
                'permissions': ['academic.read', 'academic.write_own', 'attendance.write']
            },
            'Estudiante': {
                'description': 'Acceso a contenido académico',
                'permissions': ['academic.read_own', 'events.read']
            },
            'Trabajador': {
                'description': 'Gestión de productos',
                'permissions': ['product.read', 'product.write']
            },
            'Usuario base': {
                'description': 'Acceso básico',
                'permissions': ['basic.read']
            }
        }
        
        for item in role_counts:
            role_name = item['role']
            role_info = role_descriptions.get(role_name, {
                'description': 'Rol personalizado',
                'permissions': []
            })
            
            role_stats.append({
                'name': role_name,
                'count': item['count'],
                'description': role_info['description'],
                'permissions': role_info['permissions']
            })
        
        return Response(role_stats)
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
