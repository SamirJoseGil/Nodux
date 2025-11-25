from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='role',
            field=models.CharField(
                choices=[
                    ('SuperAdmin', 'Super Administrador'),
                    ('Admin', 'Administrador'),
                    ('Mentor', 'Mentor'),
                    ('Estudiante', 'Estudiante'),
                    ('Trabajador', 'Trabajador'),
                    ('Usuario base', 'Usuario Base'),
                ],
                default='Usuario base',
                max_length=20
            ),
        ),
    ]
