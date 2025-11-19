from projects.models import Event
from .models import MentorAttendance
from django.utils import timezone


def generate_attendance():
    current_time = timezone.now()
    pending_attendance_events = Event.objects.filter(start_date__lte = current_time, attendance_generated = False)

    for event in pending_attendance_events:
        start_event_datetime = event.start_datetime
        end_event_datetime = event.end_datetime
        duration = end_event_datetime - start_event_datetime

        MentorAttendance.objects.create(
            mentor = event.group.mentor,
            start_datetime = start_event_datetime,
            end_datetime = end_event_datetime,
            hours = duration.total_seconds() / 3600,
        )

        event.attendance_generated = True
        event.save()






