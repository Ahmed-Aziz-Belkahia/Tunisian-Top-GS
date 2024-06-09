from django.contrib import admin
from .models import Course, Level, Module, Video, Quiz, UserCourseProgress ,QuizOption

class QuizInline(admin.StackedInline):
    model = Quiz
    extra = 0

class VideoInline(admin.StackedInline):
    model = Video
    extra = 0

class ModuleInline(admin.StackedInline):
    model = Module
    extra = 0
    inlines = [VideoInline]

class LevelInline(admin.StackedInline):
    model = Level
    extra = 0
    inlines = [ModuleInline]
    
class QuizOptionInLine(admin.StackedInline):
    model = QuizOption
    extra = 0
    inlines = [ModuleInline]

class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'course_image', 'professor', 'price', 'get_discount_price', 'members_count', 'category', "url_title"]
    search_fields = ['title', 'description', 'professor__name']
    list_filter = ['price', 'professor', 'category']
    prepopulated_fields = {"url_title": ("title", )}
    readonly_fields = ['course_image']
    fieldsets = (
        ('Course Information', {
            'fields': ('title', "url_title", 'description', 'price', 'discount_price', 'img', 'course_image', 'professor', 'members_count', 'category')
        }),
        ('Additional Information', {
            'fields': ('course_requirements', 'course_features', 'video_trailer')
        }),
    )
    inlines = [LevelInline, ModuleInline, VideoInline, QuizInline,QuizOptionInLine]

    def get_discount_price(self, obj):
        return obj.discount_price
    get_discount_price.short_description = 'Discount Price'

    class Media:
        js = ('js/collapsible_inlines.js',)

admin.site.register(Course, CourseAdmin)

@admin.register(UserCourseProgress)
class UserCourseProgressAdmin(admin.ModelAdmin):
    pass

