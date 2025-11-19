from django.db.models.signals import post_save
from django.dispatch import receiver
from datetime import timedelta
from .models import Group, Event

from django.db.models.signals import post_save
from django.dispatch import receiver
from datetime import timedelta
from .models import Group, Event

@receiver(post_save, sender=Group)
def create_events_for_group(sender, instance, created, **kwargs):
    """
    Automatically generates Event records for a newly created Group.
    It creates one event for each date between start_date and end_date
    that matches the day of the week defined in the related Schedule.
    """
    print("im here")
    if not created:
        return  # Only run when a new Group is created

    schedule = instance.schedule
    if not schedule:
        return  # Skip if the group has no schedule assigned
    print("im here")
    start_date = instance.start_date
    end_date = instance.end_date
    scheduled_day = schedule.day  # 0=Monday, 1=Tuesday, ..., 6=Sunday

    current_date = start_date
    while current_date <= end_date:
        # If the weekday matches the schedule day, create an event
        if current_date.weekday() == scheduled_day:
            Event.objects.create(
                group=instance,
                location=instance.location,
                date=current_date,
                start_date=current_date,  # Event start date = current date
                end_date=current_date,    # Event end date = same day (single-day event)
                schedule=schedule,
            )
        current_date += timedelta(days=1)
    print("im here")