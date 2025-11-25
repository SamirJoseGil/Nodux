from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from apps.users.models import Profile


class Command(BaseCommand):
    help = 'Fix users without profiles'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('\n' + '='*60))
        self.stdout.write(self.style.SUCCESS('FIXING USERS WITHOUT PROFILES'))
        self.stdout.write(self.style.SUCCESS('='*60 + '\n'))
        
        users_without_profile = []
        
        for user in User.objects.all():
            try:
                profile = user.profile
                self.stdout.write(f"✅ User {user.username} has profile (role: {profile.role})")
            except Profile.DoesNotExist:
                users_without_profile.append(user)
                self.stdout.write(self.style.WARNING(f"⚠️  User {user.username} has NO profile"))
        
        if not users_without_profile:
            self.stdout.write(self.style.SUCCESS("\n🎉 All users have profiles!"))
            return
        
        self.stdout.write(f"\n📝 Creating profiles for {len(users_without_profile)} users...\n")
        
        for user in users_without_profile:
            # Determinar rol basado en propiedades del usuario
            if user.is_superuser:
                role = 'SuperAdmin'
            elif user.is_staff:
                role = 'Admin'
            else:
                role = 'Usuario base'
            
            profile = Profile.objects.create(
                user=user,
                role=role,
                phone=''
            )
            
            self.stdout.write(self.style.SUCCESS(
                f"✅ Created profile for {user.username} with role: {role}"
            ))
        
        self.stdout.write(self.style.SUCCESS('\n🎉 All profiles created successfully!\n'))
