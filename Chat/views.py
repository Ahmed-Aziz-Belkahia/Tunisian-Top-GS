# chat/views.py

from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseBadRequest
from django.contrib.auth.decorators import login_required
from .models import Message, Room
from django.contrib.auth.models import User


from Users.models import CustomUser
from django.core.serializers.json import DjangoJSONEncoder
from django.core.cache import cache  # Import Django's cache module
import json
""" 
def send_message(request):
    if request.method == "POST":
        customuser_id = request.POST.get("customuser_id")
        room_name = request.POST.get("room_name")
        content = request.POST.get("content")

        user = get_object_or_404(CustomUser, id=customuser_id)
        room = get_object_or_404(Room, name=room_name)
        
        if user and room and content:
            # Create and save the message
            message = Message(user=user, room=room, content=content)
            message.save()
            return HttpResponse("Message sent successfully!")
        else:
            return HttpResponseBadRequest("Invalid data provided.")
    else:
        return HttpResponseBadRequest("Invalid request method.")


def index(request):
    # Example: Retrieve online users
    online_users = get_online_users()  # You need to implement this function
    return render(request, "chat/index.html", {"online_users": online_users})


@login_required
def room(request, room_name):
    customuser_id = request.user.id
    room = get_object_or_404(Room, name=room_name)
    messages = Message.objects.filter(room=room).order_by('timestamp').values('user__first_name', 'content')
    messages_list = list(messages)
    
    # Convert QuerySet to list of dictionaries
    messages_list = [dict(message) for message in messages_list]

    # Serialize the messages list to JSON
    messages_json = json.dumps(messages_list, cls=DjangoJSONEncoder)

    print(messages_json)  # Add this line for debugging
    return render(request, "chat/room.html", {"room_name": room_name, "customuser_id": customuser_id, "messages_json": messages_json})
 """

def get_online_users():
    # Example function to retrieve online users
    online_users = []
    user_ids = CustomUser.objects.values_list('id', flat=True)  # Get a list of all user IDs
    for user_id in user_ids:
        if cache.get(f'user_{user_id}_online'):
            online_users.append(user_id)
    return online_users