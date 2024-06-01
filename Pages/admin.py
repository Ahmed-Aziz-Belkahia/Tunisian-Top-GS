from django.contrib import admin
from .models import Dashboard, Home, Feedback, Podcast, Quest, Step, UserQuestProgress, FeaturedYoutubeVideo, OptIn , OnboardingOption , OnboardingQuestion , SliderImage

# Register your models here.
admin.site.register(Dashboard)
admin.site.register(Home)
admin.site.register(Podcast)
admin.site.register(Feedback)
admin.site.register(FeaturedYoutubeVideo)
admin.site.register(Quest)
admin.site.register(Step)
admin.site.register(UserQuestProgress)
admin.site.register(OptIn)
admin.site.register(SliderImage)

class OnboardingOptionInline(admin.TabularInline):
    model = OnboardingOption
    extra = 1

@admin.register(OnboardingQuestion)
class OnboardingQuestionAdmin(admin.ModelAdmin):
    inlines = [OnboardingOptionInline]