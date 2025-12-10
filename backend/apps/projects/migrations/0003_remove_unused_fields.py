from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0002_remove_event_end_date_remove_event_start_date'),
    ]

    operations = [
        # Migración vacía - las columnas ya fueron eliminadas manualmente
        migrations.RunPython(migrations.RunPython.noop, migrations.RunPython.noop),
    ]
