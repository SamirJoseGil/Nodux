from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from apps.users.models import Profile


class Command(BaseCommand):
    help = 'Create test users with profiles and roles'

    def handle(self, *args, **kwargs):
        # Lista de usuarios de prueba
        test_users = [
            {
                'username': 'superadmin',
                'email': 'superadmin@nodux.com',
                'password': 'admin123',
                'first_name': 'Super',
                'last_name': 'Admin',
                'role': 'SuperAdmin',
                'phone': '3001111111'
            },
            {
                'username': 'admin',
                'email': 'admin@nodux.com',
                'password': 'admin123',
                'first_name': 'John',
                'last_name': 'Admin',
                'role': 'Admin',
                'phone': '3002222222'
            },
            {
                'username': 'mentor',
                'email': 'mentor@nodux.com',
                'password': 'mentor123',
                'first_name': 'Maria',
                'last_name': 'Mentor',
                'role': 'Mentor',
                'phone': '3003333333'
            },
            {
                'username': 'estudiante',
                'email': 'estudiante@nodux.com',
                'password': 'estudiante123',
                'first_name': 'Carlos',
                'last_name': 'Estudiante',
                'role': 'Estudiante',
                'phone': '3004444444'
            },
        ]

        for user_data in test_users:
            # Verificar si el usuario ya existe
            if User.objects.filter(username=user_data['username']).exists():
                self.stdout.write(
                    self.style.WARNING(f"User {user_data['username']} already exists. Skipping...")
                )
                continue

            # Crear usuario
            user = User.objects.create_user(
                username=user_data['username'],
                email=user_data['email'],
                password=user_data['password'],
                first_name=user_data['first_name'],
                last_name=user_data['last_name']
            )

            # Crear perfil con rol
            Profile.objects.create(
                user=user,
                phone=user_data['phone'],
                role=user_data['role']
            )

            self.stdout.write(
                self.style.SUCCESS(
                    f"✅ Created user: {user_data['username']} ({user_data['role']})"
                )
            )

        self.stdout.write(
            self.style.SUCCESS('\n🎉 All test users created successfully!')
        )
        self.stdout.write('\n📋 Test Credentials:')
        self.stdout.write('-------------------')
        for user_data in test_users:
            self.stdout.write(
                f"Username: {user_data['username']} | Password: {user_data['password']} | Role: {user_data['role']}"
            )
