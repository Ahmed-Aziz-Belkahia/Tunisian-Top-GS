#Chat/models.py

from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from Users.models import CustomUser
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.serializers import serialize

# Create your models here.

class Section(models.Model):
    index = models.IntegerField(default=0)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Room(models.Model):
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='rooms', null=True, blank=False)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Message(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, null=True)
    content = models.TextField(max_length=10000)
    file = models.FileField(upload_to='uploads/', null=True, blank=True)  # Add this field
    timestamp = models.DateTimeField(auto_now_add=True)
# Add this field
class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="notifications")
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name="notifications", null=True, blank=True)
    course = models.ForeignKey("Courses.Course", on_delete=models.CASCADE, related_name="notifications", null=True, blank=True)
    level = models.ForeignKey("Courses.Level", on_delete=models.CASCADE, related_name="notifications", null=True, blank=True)
    product = models.ForeignKey("Products.Product", on_delete=models.CASCADE, related_name="notifications", null=True, blank=True)
    content = models.TextField()
    link = models.URLField(blank=True, null=True)  # Add this field
    timestamp = models.DateTimeField(auto_now_add=True)
    icon = models.ImageField(upload_to="Notification_Icon/", blank=True, null=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification for {self.user.user.username} - {self.content}"

    
@receiver(post_save, sender=Notification)
def send_notification_to_socket(sender, instance, created, **kwargs):
    if created:
        serialized_notification = serialize('json', [instance])
        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            f'notifications_{instance.user.id}', {
                'type': 'chat.notification',
                'notification': serialized_notification
            }
        )