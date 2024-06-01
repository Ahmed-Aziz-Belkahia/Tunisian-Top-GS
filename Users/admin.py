from django.contrib import admin
from .models import CustomUser, Transaction, Badge, Professor

class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'amount', 'date')  # Specify the fields to display in the list view
    list_editable = ('date',)  # Make the date field editable in the list view

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['pfp_image', 'user', 'email', 'status', 'tel']
    list_per_page = 10    

admin.site.register(Badge)
admin.site.register(Professor)
admin.site.register(Transaction, TransactionAdmin)  # Register Transaction model with custom admin options