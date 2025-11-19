from django.db.models.signals import post_save
from django.dispatch import receiver
from datetime import timedelta, datetime, time
from .models import Group, Event

@receiver(post_save, sender=Group)
def create_events_for_group(sender, instance, created, **kwargs):
    """
    Automatically generates Event records for a newly created Group.
    It creates one event for each date between start_date and end_date
    that matches the day of the week defined in the related Schedule.
    """
    if not created:
        return  

    schedule = instance.schedule
    if not schedule:
        return  

    start_date = instance.start_date
    end_date = instance.end_date
    scheduled_day = schedule.day  

    current_date = start_date
    while current_date <= end_date:

        start_datetime = datetime.combine(current_date, schedule.start_time)
        
        print(schedule.start_time)
        print(schedule.end_time)

        start_seconds = schedule.start_time.hour * 3600 + schedule.start_time.minute * 60 + schedule.start_time.second
        end_seconds = schedule.end_time.hour * 3600 + schedule.end_time.minute * 60 + schedule.end_time.second


        print(start_seconds)
        print(end_seconds)
        
        total_event_seconds = end_seconds - start_seconds
        total_event_time = timedelta(seconds=total_event_seconds)

        end_datetime = start_datetime + total_event_time

        if current_date.weekday() == scheduled_day:
            Event.objects.create(
                group=instance,
                project=instance.project,
                location=instance.location,
                start_datetime=start_datetime,  
                end_datetime=end_datetime,    
            )
        current_date += timedelta(days=1)