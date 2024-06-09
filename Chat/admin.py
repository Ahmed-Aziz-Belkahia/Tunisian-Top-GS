from django.contrib import admin
from .models import Message, Room, Section, Notification

class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'content', 'timestamp', 'read')
    fields = ('user', 'message', 'course', 'level', 'product', 'content', 'link', 'icon', 'read')
    list_filter = ('read', 'timestamp')
    search_fields = ('content', 'user__username')

admin.site.register(Message)
admin.site.register(Room)
admin.site.register(Section)
admin.site.register(Notification, NotificationAdmin)
