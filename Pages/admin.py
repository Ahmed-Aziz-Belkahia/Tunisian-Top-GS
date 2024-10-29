from django.contrib import admin
from .models import (
    Dashboard, Home, Feedback, Podcast, Quest, Question, Step, UserDevice, 
    UserQuestProgress, FeaturedYoutubeVideo, OptIn, 
    OnBoardingOption, OnBoardingQuestion, SliderImage, Vocal, bookOrder, checkRow,
    dashboardLog, OnBoardingTrack, dailyLesson, OnBoardingQuestionTrack, UserDailyActivity, 
    ContactSubmission, generalCheckRow
)
from django.utils.html import format_html


@admin.register(Dashboard)
class DashboardAdmin(admin.ModelAdmin):
    list_display = ('id', 'objectif', 'total_balance', 'total_change_today', 'change_percentage')

    def total_balance(self, obj):
        return obj.calculate_total_balance()

    def total_change_today(self, obj):
        return obj.get_changes_today()

    def change_percentage(self, obj):
        return obj.calculate_change_percentage()


@admin.register(Home)
class HomeAdmin(admin.ModelAdmin):
    list_display = ('id', 'featured_course')

@admin.register(bookOrder)
class bookOrderAdmin(admin.ModelAdmin):
    pass

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    pass

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('feedback_emoji', 'user', 'timestamp')
    list_filter = ('feedback_choice', 'user', 'timestamp')
    search_fields = ('user__username', 'user__email')

    def feedback_emoji(self, obj):
        return obj.get_feedback_choice_display()
    feedback_emoji.short_description = 'Feedback'


@admin.register(Podcast)
class PodcastAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'banner', 'mp3')


@admin.register(FeaturedYoutubeVideo)
class FeaturedYoutubeVideoAdmin(admin.ModelAdmin):
    list_display = ('video_url',)


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    pass

@admin.register(generalCheckRow)
class generalCheckRowAdmin(admin.ModelAdmin):
    pass

@admin.register(Quest)
class QuestAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'image', 'points')


@admin.register(Step)
class StepAdmin(admin.ModelAdmin):
    list_display = ('quest', 'title', 'description', 'index', 'points')


@admin.register(UserQuestProgress)
class UserQuestProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'quest', 'current_step', 'points_earned')
    search_fields = ('user__username', 'quest__title')


@admin.register(OptIn)
class OptInAdmin(admin.ModelAdmin):
    list_display = ('email',)

@admin.register(Vocal)
class VocalAdmin(admin.ModelAdmin):
    pass

@admin.register(checkRow)
class checkRowAdmin(admin.ModelAdmin):
    pass

@admin.register(dailyLesson)
class dailyLessonAdmin(admin.ModelAdmin):
    pass

@admin.register(UserDailyActivity)
class UserDailyActivityAdmin(admin.ModelAdmin):
    pass

class OnbBoardingOptionInline(admin.TabularInline):
    model = OnBoardingOption
    extra = 1

class OnBoardingQuestionTrackInline(admin.TabularInline):
    model = OnBoardingQuestionTrack
    extra = 1

class OnBoardingTrackAdmin(admin.ModelAdmin):
    inlines = [OnBoardingQuestionTrackInline]

admin.site.register(OnBoardingTrack, OnBoardingTrackAdmin)

@admin.register(OnBoardingQuestion)
class OnBoardingQuestionAdmin(admin.ModelAdmin):
    list_display = ('question',)
    inlines = [OnbBoardingOptionInline]

@admin.register(dashboardLog)
class dashboardLogAdmin(admin.ModelAdmin):
    list_display = ('balance', 'timestamp')
    list_filter = ('balance', 'timestamp')
    editable = ('balance', 'timestamp')
    search_fields = ('balance', 'timestamp')

    def feedback_emoji(self, obj):
        return obj.get_feedback_choice_display()
    feedback_emoji.short_description = 'Feedback'
@admin.register(SliderImage)
class SliderImageAdmin(admin.ModelAdmin):
    list_display = ('alt_text', 'image_preview')

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 50px;" />', obj.image.url)
        return ""
    image_preview.short_description = 'Preview'

@admin.register(UserDevice)
class UserDeviceAdmin(admin.ModelAdmin):
    list_display = ('user', 'device_id', 'last_login', 'login_attempts')
    search_fields = ('user__username', 'device_id')