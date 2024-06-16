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
def is_finished(video, user):
    return video.is_finished(user)

@register.filter
def get_video_icon(video, user):
    return video.get_icon(user)

@register.filter
def get_user_course_progression(user, course):
    return user.usercourseprogression.filter(course=course).first()

@register.filter
def calculate_progress_percentage(course, user):
    return course.calculate_progress_percentage(user)

@register.filter
def to_int(num):
    return int(num)

