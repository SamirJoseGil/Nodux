from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0002_remove_event_end_date_remove_event_start_date'),
    ]

    operations = [
        migrations.RunSQL(
            """
            ALTER TABLE projects_event DROP COLUMN IF EXISTS attendance_generated;
            ALTER TABLE projects_event DROP COLUMN IF EXISTS start_datetime;
            ALTER TABLE projects_event DROP COLUMN IF EXISTS end_datetime;
            """,
            reverse_sql=migrations.RunSQL.noop
        ),
    ]
