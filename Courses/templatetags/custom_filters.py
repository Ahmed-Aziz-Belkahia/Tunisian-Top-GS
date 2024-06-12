from django import template

register = template.Library()

@register.filter
def is_finished(video, user):
    return video.is_finished(user)

@register.filter
def is_unlocked(video, user):
    return video.is_unlocked(user)
