from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from Users.models import CustomUser
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.serializers import serialize

class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, related_name="notifications", null=True, blank=True)
    content = models.TextField()
    link = models.URLField(blank=True, null=True)  
    timestamp = models.DateTimeField(auto_now_add=True)
    icon = models.TextField(default='fa-book')
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification for {self.user.username} - {self.content}"

@receiver(post_save, sender=Notification)
def send_notification_to_socket(sender, instance, created, **kwargs):
    if created and instance.user:
        serialized_notification = serialize('json', [instance])
        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            f'notifications_{instance.user.id}', {
                'type': 'chat.notification',
                'notification': serialized_notification
            }
        )
