from django.contrib import admin
from .models import Notification

class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'content', 'timestamp', 'read')
    fields = ('user', 'message', 'course', 'level', 'product', 'content', 'link', 'icon', 'read')
    list_filter = ('read', 'timestamp')
    search_fields = ('content', 'user__username')

admin.site.register(Notification, NotificationAdmin)
