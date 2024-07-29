from django.contrib import admin
from .models import PrivateSession, PrivateSessionRequest

class PrivateSessionRequestAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email','duration_hours','phone', 'session_mode')  # Affiche les champs dans la liste des objets
    search_fields = ('first_name', 'last_name', 'email')  # Ajoute des champs de recherche

admin.site.register(PrivateSessionRequest, PrivateSessionRequestAdmin)


class PrivateSessionAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'duration')  # Affiche les champs dans la liste des objets
    search_fields = ('first_name', 'last_name')  # Ajoute des champs de recherche

admin.site.register(PrivateSession, PrivateSessionAdmin)
