from django.contrib import admin
from Courses.forms import QuizForm
from .models import Course, CourseOrder, Level, Module, Video, Quiz, UserCourseProgress, QuizOption

class QuizInline(admin.TabularInline):
    model = Quiz
    form = QuizForm
    extra = 0

class VideoInline(admin.TabularInline):
    model = Video
    extra = 0

class ModuleInline(admin.TabularInline):
    model = Module
    extra = 0

class LevelInline(admin.TabularInline):
    model = Level
    extra = 0

class QuizOptionInline(admin.TabularInline):
    model = QuizOption
    extra = 0

class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'course_image', 'professor', 'price', 'discount_price', 'members_count', 'category', 'url_title']
    search_fields = ['title', 'description', 'professor__name']
    list_filter = ['price', 'professor', 'category']
    prepopulated_fields = {"url_title": ("title", )}
    readonly_fields = ['course_image']
    fieldsets = (
        ('Course Information', {
            'fields': ('title', 'url_title', 'description', 'price', 'discount_price', 'img', 'course_image', 'professor', 'members_count', 'category')
        }),
        ('Additional Information', {
            'fields': ('course_requirements', 'course_features', 'video_trailer')
        }),
    )
    inlines = [QuizInline, QuizOptionInline]

    def discount_price(self, obj):
        return obj.discount_price
    discount_price.short_description = 'Discount Price'

    class Media:
        js = ('js/collapsible_inlines.js',)

admin.site.register(CourseOrder)
admin.site.register(Course, CourseAdmin)

@admin.register(UserCourseProgress)
class UserCourseProgressAdmin(admin.ModelAdmin):
    pass

# Separate admin for Level to handle prepopulated_fields
class LevelAdmin(admin.ModelAdmin):
    prepopulated_fields = {"url_title": ("title", )}


admin.site.register(Level, LevelAdmin)

# Separate admin for Module to handle prepopulated_fields
class ModuleAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'level', 'index']
    search_fields = ['title', 'course__title', 'level__title']
    list_filter = ['course', 'level']

admin.site.register(Module, ModuleAdmin)

# Separate admin for Video to handle prepopulated_fields
class VideoAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'module', 'index']
    search_fields = ['title', 'course__title', 'module__title']
    list_filter = ['course', 'module']

admin.site.register(Video, VideoAdmin)

# Separate admin for QuizOption to handle prepopulated_fields
class QuizOptionAdmin(admin.ModelAdmin):
    list_display = ['text', 'quiz', 'course']
    search_fields = ['text', 'quiz__question', 'course__title']
    list_filter = ['course']

admin.site.register(QuizOption, QuizOptionAdmin)

# Separate admin for Quiz to handle prepopulated_fields
class QuizAdmin(admin.ModelAdmin):
    list_display = ['question', 'course', 'video']
    search_fields = ['question', 'course__title', 'video__title']
    list_filter = ['course', 'video']

admin.site.register(Quiz, QuizAdmin)
