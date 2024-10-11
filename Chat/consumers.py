import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

class NotificationsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.customuser_id = self.scope['user'].id
        self.room_group_name = f'notifications_{self.customuser_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def chat_notification(self, event):
        notification = event['notification']
        await self.send(text_data=json.dumps({
            'notification': notification,
        }))

    async def send_error_message(self, error_message):
        await self.send(text_data=json.dumps({"error": error_message}))

    async def send_notification(self, **kwargs):
        # Defer the imports inside the function
        from .models import Notification  # Import Notification model here
        from Users.models import CustomUser  # Import CustomUser model here
        
        users = await sync_to_async(list)(CustomUser.objects.all())
        for user in users:
            notification_data = {
                'user': user,
                'content': f"{self.scope['user'].username} sent a new notification."
            }

            await sync_to_async(Notification.objects.create)(**notification_data)

            notification = {
                "type": "chat.notification",
                "message": notification_data['content']
            }

            await self.channel_layer.group_send(
                f'notifications_{user.id}',
                {
                    "type": "chat.notification",
                    "notification": notification,
                }
            )
