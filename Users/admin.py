from django.contrib import admin
from .models import CustomUser, Transaction, Badge, Professor
from import_export.admin import ExportActionModelAdmin
from django.utils.translation import gettext_lazy as _

class EnrolledCoursesListFilter(admin.SimpleListFilter):
    title = _('enrolled courses')
    parameter_name = 'enrolled_courses'

    def lookups(self, request, model_admin):
        courses = set()
        for user in model_admin.model.objects.all():
            for course in user.enrolled_courses.all():
                courses.add((course.id, course.title))
        return sorted(courses, key=lambda x: x[1])

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(enrolled_courses__id__exact=self.value())
        return queryset

class SocialAccountLinkedFilter(admin.SimpleListFilter):
    title = _('social account linked')
    parameter_name = 'social_account_linked'

    def lookups(self, request, model_admin):
        return (
            ('yes', _('Yes')),
            ('no', _('No')),
        )

    def queryset(self, request, queryset):
        if self.value() == 'yes':
            # Assuming you use Django Allauth or a similar library and have a method to check social accounts
            return queryset.filter(socialaccount__isnull=False)
        if self.value() == 'no':
            return queryset.filter(socialaccount__isnull=True)
        return queryset

class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'amount', 'date')  # Specify the fields to display in the list view
    list_editable = ('date',)  # Make the date field editable in the list view

@admin.register(CustomUser)
class CustomUserAdmin(ExportActionModelAdmin):
    list_filter = (
        EnrolledCoursesListFilter,
        SocialAccountLinkedFilter,
        'status',
        'rank',
        'badges',
        'liked_videos',
        'liked_products',
        'liked_vocals',
        'is_superuser',
    )
admin.site.register(Badge)
admin.site.register(Professor)
admin.site.register(Transaction, TransactionAdmin)  # Register Transaction model with custom admin options