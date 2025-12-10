import logging
from django.utils import timezone
from huey import crontab
from huey.contrib.djhuey import periodic_task
from apps.projects.models import Event
from apps.mentors.models import MentorAttendance

logger = logging.getLogger(__name__)

@periodic_task(crontab(minute='*/30'))
def generate_attendance():
    current_time = timezone.now()
    pending_attendance_events = Event.objects.filter(start_datetime__lte=current_time, attendance_generated=False)
    logger.info(f"generate_attendance started at {current_time}, found {pending_attendance_events.count()} events")
    for event in pending_attendance_events:
        try:
            start_event_datetime = event.start_datetime
            end_event_datetime = event.end_datetime
            duration = end_event_datetime - start_event_datetime

            MentorAttendance.objects.create(
                mentor=event.group.mentor,
                start_datetime=start_event_datetime,
                end_datetime=end_event_datetime,
                hours=duration.total_seconds() / 3600,
            )

            event.attendance_generated = True
            event.save()
            logger.info(f"Attendance generated for event {event.id}")
        except Exception as e:
            logger.error(f"Error generating attendance for event {event.id}: {e}", exc_info=True)