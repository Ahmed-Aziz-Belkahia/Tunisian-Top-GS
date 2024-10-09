from django import template

from Courses.models import UserCourseProgress

register = template.Library()

@register.filter
def is_unlocked(instance, user):
    return instance.is_unlocked(user)

@register.filter
def is_locked(instance, user):
    if instance.is_unlocked(user):
        return False
    else:
        return True


@register.filter
def is_finished(instance, user):
    return instance.is_finished(user)

@register.filter
def get_instance_icon(instance, user):
    # Return 'finished', 'open', or 'locked' based on the instance status
    return (
        'finished' if instance.is_finished(user) 
        else 'open' if instance.is_unlocked(user) 
        else 'locked'
    )



@register.filter
def get_user_course_progression(user, course):
    return user.usercourseprogression.filter(course=course).first()

@register.filter
def calculate_progress_percentage(course, user):
    try:
        return course.calculate_progress_percentage(user)
    except:
        return 0

@register.filter
def to_int(num):
    return int(num)

