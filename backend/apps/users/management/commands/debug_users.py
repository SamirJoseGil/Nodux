from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from apps.users.models import Profile


class Command(BaseCommand):
    help = 'Debug users in database and test authentication'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('\n' + '='*60))
        self.stdout.write(self.style.SUCCESS('DEBUG: USERS IN DATABASE'))
        self.stdout.write(self.style.SUCCESS('='*60 + '\n'))
        
        # 1. Verificar usuarios
        users = User.objects.all()
        self.stdout.write(f"📊 Total users in database: {users.count()}\n")
        
        if users.count() == 0:
            self.stdout.write(self.style.ERROR("❌ NO USERS FOUND IN DATABASE!"))
            self.stdout.write("\n💡 Run: python manage.py create_test_users\n")
            return
        
        # 2. Mostrar información de cada usuario
        for user in users:
            self.stdout.write(self.style.SUCCESS(f"\n👤 User ID: {user.id}"))
            self.stdout.write(f"   Username: {user.username}")
            self.stdout.write(f"   Email: {user.email}")
            self.stdout.write(f"   First name: {user.first_name}")
            self.stdout.write(f"   Last name: {user.last_name}")
            self.stdout.write(f"   Is active: {user.is_active}")
            self.stdout.write(f"   Is staff: {user.is_staff}")
            self.stdout.write(f"   Is superuser: {user.is_superuser}")
            
            # Verificar si tiene perfil
            try:
                profile = user.profile
                self.stdout.write(f"   ✅ Has profile: YES")
                self.stdout.write(f"      Role: {profile.role}")
                self.stdout.write(f"      Phone: {profile.phone}")
            except Profile.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"   ⚠️  Has profile: NO"))
        
        # 3. Probar autenticación
        self.stdout.write(self.style.SUCCESS('\n' + '='*60))
        self.stdout.write(self.style.SUCCESS('TESTING AUTHENTICATION'))
        self.stdout.write(self.style.SUCCESS('='*60 + '\n'))
        
        test_credentials = [
            ('admin', 'admin123'),
            ('superadmin', 'admin123'),
            ('mentor', 'mentor123'),
            ('estudiante', 'estudiante123'),
        ]
        
        for username, password in test_credentials:
            self.stdout.write(f"\n🔐 Testing: {username} / {password}")
            
            try:
                user = User.objects.get(username=username)
                self.stdout.write(f"   ✅ User exists in database")
                
                # Probar autenticación
                auth_user = authenticate(username=username, password=password)
                if auth_user:
                    self.stdout.write(self.style.SUCCESS(f"   ✅ Authentication SUCCESSFUL"))
                else:
                    self.stdout.write(self.style.ERROR(f"   ❌ Authentication FAILED"))
                        
            except User.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"   ❌ User '{username}' NOT FOUND in database"))
