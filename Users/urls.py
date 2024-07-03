from django.urls import path
from .views import update_user_info

urlpatterns = [
    path('update_info/', update_user_info, name='update_user_info'),
]
