from django.urls import path

# Import consumers here to delay their import
def get_websocket_urlpatterns():
    from . import consumers  # Move the import here
    return [
        path('ws/notifications/', consumers.NotificationConsumer.as_asgi()),
        # Add other websocket paths as needed
    ]

websocket_urlpatterns = get_websocket_urlpatterns()
