from rest_framework import permissions

class RolePermission(permissions.BasePermission):
    """
    Permission class based on user roles.
    """
    
    ROLE_PERMISSIONS = {
        'SuperAdmin': ['*'],
        'Admin': [
            'academic.*',
            'product.*',
            'admin.*',
            'users.read',
            'users.write',
            'mentors.read',
            'mentors.write',
            'projects.read',
            'projects.write',
            'attendance.read',
            'attendance.write',
        ],
        'Mentor': [
            'academic.read',
            'academic.write_own',
            'mentors.read',  # ✅ Pueden ver mentores
            'mentors.read_own',
            'attendance.write',
        ],
        'Estudiante': [
            'academic.read_own',
            'events.read',
            'mentors.read',  # ✅ Pueden ver mentores
        ],
        'Trabajador': [
            'product.read',
            'product.write',
        ],
        'Usuario base': [
            'basic.read',
            'mentors.read',  # ✅ Pueden ver mentores
        ],
    }
    
    def has_permission(self, request, view):
        """
        Check if user has permission to access the view.
        """
        import logging
        logger = logging.getLogger(__name__)
        
        # Verificar autenticación
        if not request.user or not request.user.is_authenticated:
            logger.warning("❌ User not authenticated")
            return False
        
        # Obtener rol del usuario
        try:
            user_role = request.user.profile.role
            logger.info(f"✅ User {request.user.username} has role: {user_role}")
        except Exception as e:
            logger.error(f"❌ Error getting user role: {e}")
            return False
        
        # SuperAdmin tiene acceso a todo
        if user_role == 'SuperAdmin':
            logger.info(f"✅ SuperAdmin access granted")
            return True
        
        # Obtener permiso requerido
        required_permission = getattr(view, 'required_permission', None)
        
        # Si es callable, ejecutarlo
        if callable(required_permission):
            try:
                required_permission = required_permission()
            except Exception as e:
                logger.error(f"❌ Error calling required_permission: {e}")
                required_permission = None
        
        logger.info(f"🔍 Required permission: {required_permission}")
        
        # Si no requiere permiso específico, permitir
        if not required_permission:
            logger.info("✅ No specific permission required, access granted")
            return True
        
        # Obtener permisos del rol
        user_permissions = self.ROLE_PERMISSIONS.get(user_role, [])
        logger.info(f"🔍 User permissions: {user_permissions}")
        
        # Verificar wildcard
        if '*' in user_permissions:
            logger.info("✅ Wildcard permission, access granted")
            return True
        
        # Verificar permiso exacto
        if required_permission in user_permissions:
            logger.info(f"✅ Exact permission match: {required_permission}")
            return True
        
        # Verificar wildcards de módulo (e.g., 'academic.*' matches 'academic.read')
        for perm in user_permissions:
            if perm.endswith('.*'):
                module = perm.replace('.*', '')
                if isinstance(required_permission, str) and required_permission.startswith(module + '.'):
                    logger.info(f"✅ Module wildcard match: {perm} covers {required_permission}")
                    return True
        
        # Acceso denegado
        logger.warning(
            f"❌ PERMISSION DENIED\n"
            f"   User: {request.user.username}\n"
            f"   Role: {user_role}\n"
            f"   Required: {required_permission}\n"
            f"   Available: {user_permissions}\n"
            f"   View: {view.__class__.__name__}\n"
            f"   Action: {getattr(view, 'action', 'N/A')}"
        )
        
        return False
    
    def has_object_permission(self, request, view, obj):
        """
        Check if user has permission to access specific object.
        """
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            user_role = request.user.profile.role
        except:
            return False
        
        # SuperAdmin tiene acceso a todo
        if user_role == 'SuperAdmin':
            return True
        
        # Admin tiene acceso a la mayoría de objetos
        if user_role == 'Admin':
            return True
        
        # Para otros roles, verificar ownership si aplica
        required_permission = getattr(view, 'required_permission', '')
        
        if '_own' in required_permission:
            # Verificar si el objeto pertenece al usuario
            if hasattr(obj, 'user'):
                return obj.user == request.user
            elif hasattr(obj, 'profile') and hasattr(obj.profile, 'user'):
                return obj.profile.user == request.user
        
        return self.has_permission(request, view)


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permission to only allow owners of an object or admins to edit it.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Check if user is admin
        try:
            user_role = request.user.profile.role
            if user_role in ['SuperAdmin', 'Admin']:
                return True
        except:
            pass
        
        # Check ownership
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'profile') and hasattr(obj.profile, 'user'):
            return obj.profile.user == request.user
        
        return False
