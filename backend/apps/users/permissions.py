from rest_framework import permissions

class RolePermission(permissions.BasePermission):
    """
    Permission class based on user roles.
    
    Usage in ViewSets:
        class MyViewSet(viewsets.ModelViewSet):
            permission_classes = [IsAuthenticated, RolePermission]
            required_permission = 'academic.write'
    """
    
    ROLE_PERMISSIONS = {
        'SuperAdmin': ['*'],  # Acceso total
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
        ],
        'Mentor': [
            'academic.read',
            'academic.write_own',
            'mentors.read_own',
            'attendance.write',
        ],
        'Estudiante': [
            'academic.read_own',
            'events.read',
        ],
        'Trabajador': [
            'product.read',
            'product.write',
        ],
        'Usuario base': [
            'basic.read',
        ],
    }
    
    def has_permission(self, request, view):
        """
        Check if user has permission to access the view.
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
        
        # Verificar permiso requerido por la vista
        required_permission = getattr(view, 'required_permission', None)
        
        # Si la vista no requiere permiso específico, permitir acceso
        if not required_permission:
            return True
        
        # Obtener permisos del rol del usuario
        user_permissions = self.ROLE_PERMISSIONS.get(user_role, [])
        
        # Verificar si tiene el permiso específico o wildcard
        if '*' in user_permissions:
            return True
        
        # Verificar permiso exacto
        if required_permission in user_permissions:
            return True
        
        # Verificar wildcards específicos (e.g., 'academic.*' matches 'academic.read')
        for perm in user_permissions:
            if perm.endswith('.*'):
                module = perm.replace('.*', '')
                if required_permission.startswith(module + '.'):
                    return True
        
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
