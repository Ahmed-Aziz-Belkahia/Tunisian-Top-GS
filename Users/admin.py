from django.contrib import admin
from .models import CustomUser, Transaction, Badge, Professor
from import_export.admin import ExportActionModelAdmin

class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'amount', 'date')  # Specify the fields to display in the list view
    list_editable = ('date',)  # Make the date field editable in the list view

@admin.register(CustomUser)
class CustomUserAdmin(ExportActionModelAdmin):
    pass
admin.site.register(Badge)
admin.site.register(Professor)
admin.site.register(Transaction, TransactionAdmin)  # Register Transaction model with custom admin options