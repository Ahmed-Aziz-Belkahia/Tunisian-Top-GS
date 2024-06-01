from django.contrib import admin
from .models import Message, Room, Section, Notification
# Register your models here.
admin.site.register(Message)
admin.site.register(Room)
admin.site.register(Section)
admin.site.register(Notification)