from django.db import models
from django.utils.functional import lazy
from Chat.models import Notification
from Users.models import CustomUser, Transaction
from Products.models import Product
from datetime import datetime, timedelta
from django.db.models.signals import pre_save
from django.dispatch import receiver

from django.utils import timezone

class Home(models.Model):
    featured_course = models.ForeignKey('Courses.Course', on_delete=models.SET_NULL, blank=True, null=True)

class Dashboard(models.Model):
    objectif = models.IntegerField(default=0)

    def get_changes_today(self):
        today = timezone.now().date()
        start_of_day = datetime.combine(today, datetime.min.time())
        end_of_day = datetime.combine(today, datetime.max.time())
        profits_today = Transaction.objects.filter(type='profit', date__range=(start_of_day, end_of_day), status=True)
        losses_today = Transaction.objects.filter(type='loss', date__range=(start_of_day, end_of_day), status=True)
        total_profits_today = profits_today.aggregate(models.Sum('amount'))['amount__sum'] or 0
        total_losses_today = losses_today.aggregate(models.Sum('amount'))['amount__sum'] or 0
        total_change = total_profits_today - total_losses_today
        return total_change

    def calculate_total_balance(self):
        profits = Transaction.objects.filter(type='profit', status=True)
        losses = Transaction.objects.filter(type='loss', status=True)
        total_profits = profits.aggregate(models.Sum('amount'))['amount__sum'] or 0
        total_losses = losses.aggregate(models.Sum('amount'))['amount__sum'] or 0
        total_balance = total_profits - total_losses
        # if total_balance.is_integer():
        #     total_balance = int(total_balance)
        return total_balance

    def calculate_change_percentage(self):
        today = timezone.now().date()
        yesterday = today - timedelta(days=1)
        today_balance = self.calculate_total_balance()
        yesterday_balance = Transaction.objects.filter(date__date=yesterday).aggregate(
            total_balance=models.Sum(models.Case(
                models.When(type='profit', status=True, then=models.F('amount')),
                models.When(type='loss', status=True, then=models.F('amount') * -1),
                default=models.Value(0),
                output_field=models.FloatField()
            ))
        )['total_balance'] or 0
        if yesterday_balance != 0:
            change_percentage = ((today_balance - yesterday_balance) / yesterday_balance) * 100
        else:
            change_percentage = 0
        change_percentage = round(change_percentage, 2)
        return change_percentage
    

    def calculate_profits(self):
        return Transaction.objects.filter(type='profit', status=True).aggregate(models.Sum('amount'))['amount__sum'] or 0

    def calculate_losses(self):
        return Transaction.objects.filter(type='loss', status=True).aggregate(models.Sum('amount'))['amount__sum'] or 0

    def calculate_balance(self):
        profits = self.calculate_profits()
        losses = self.calculate_losses()
        return profits - losses

    def calculate_today_profits(self):
        today_start = timezone.now().date()
        print("ttttttttttttttttttttttttttttt")
        today_profits = Transaction.objects.filter(type='profit', status=True, date__gte=today_start).aggregate(models.Sum('amount'))['amount__sum'] or 0
        print(today_profits)
        return today_profits

    def calculate_today_losses(self):
        today_start = timezone.now().date()
        today_losses = Transaction.objects.filter(type='loss', status=True, date__gte=today_start).aggregate(models.Sum('amount'))['amount__sum'] or 0
        return today_losses

    def calculate_yesterday_profits(self):
        today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        yesterday_start = today_start - timedelta(days=1)
        yesterday_profits = Transaction.objects.filter(type='profit', status=True, date__gte=yesterday_start, date__lt=today_start).aggregate(models.Sum('amount'))['amount__sum'] or 0
        return yesterday_profits

    def calculate_yesterday_losses(self):
        today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        yesterday_start = today_start - timedelta(days=1)
        yesterday_losses = Transaction.objects.filter(type='loss', status=True, date__gte=yesterday_start, date__lt=today_start).aggregate(models.Sum('amount'))['amount__sum'] or 0
        return yesterday_losses

    def calculate_daily_profits_change_percentage(self):
        today_profits = self.calculate_today_profits()
        yesterday_profits = self.calculate_yesterday_profits()

        if yesterday_profits == 0:
            # If there were no profits yesterday, avoid division by zero
            return 100 if today_profits > 0 else 0

        # Calculate the percentage of today's profits relative to yesterday's profits
        profits_change_percentage = (today_profits / yesterday_profits) * 100
        return int(round(profits_change_percentage))

    def calculate_daily_losses_change_percentage(self):
        today_losses = self.calculate_today_losses()
        yesterday_losses = self.calculate_yesterday_losses()
    
        if yesterday_losses == 0:
            # If there were no losses yesterday, avoid division by zero
            return 100 if today_losses > 0 else 0
    
        # Calculate the percentage of today's losses relative to yesterday's losses
        losses_change_percentage = (today_losses / yesterday_losses) * 100
        return int(round(losses_change_percentage))

    def calculate_daily_balance_change_percentage(self):
        # Calculate the current balance
        current_balance = self.calculate_balance()

        # Calculate the balance 24 hours ago
        yesterday = timezone.now() - timedelta(days=1)
        transactions_yesterday = Transaction.objects.filter(date__lte=yesterday)
        
        profits_yesterday = transactions_yesterday.filter(type='profit', status=True).aggregate(models.Sum('amount'))['amount__sum'] or 0
        losses_yesterday = transactions_yesterday.filter(type='loss', status=True).aggregate(models.Sum('amount'))['amount__sum'] or 0
        balance_yesterday = profits_yesterday - losses_yesterday

        if balance_yesterday == 0:
            return 100 if current_balance > 0 else 0

        # Calculate the percentage change
        balance_change_percentage = ((current_balance - balance_yesterday) / balance_yesterday) * 100

        return int(balance_change_percentage)

class Feedback(models.Model):
    FEEDBACKS = (
        (0, "😤"),
        (1, "🙁"),
        (2, "😐"),
        (3, "🙂"),
        (4, "😀"),
        (5, "😄"),
    )
    feedback_choice = models.IntegerField(choices=FEEDBACKS)
    user = models.ForeignKey("Users.CustomUser", on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    def get_feedback(self):
        if self.feedback_choice:
            for i in Feedback.FEEDBACKS:
                if i[0] == self.feedback_choice:
                    return i[1]
        return ""

class Podcast(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='podcast_images/')
    description = models.CharField(max_length=150, blank=True, null=True)
    banner = models.ImageField(upload_to='podcast_banner/', blank=True, null=True)
    mp3 = models.FileField(upload_to='podcast_mp3s/')

    def __str__(self):
        return self.name
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
# @receiver(post_save, sender=Podcast)
# def create_podcast_notification(sender, instance, created, **kwargs):
#     if created and instance.user:
#         message_content = "A new podcast."
#         Notification.objects.create(
#             user=instance.user,
#             content=message_content,
#             link="/home",
#             icon="ps.png",  # Set an appropriate icon if needed
#         )

class FeaturedYoutubeVideo(models.Model):
    video_url = models.CharField(max_length=100, blank=True, null=True)

class Quest(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to="quests/", blank=True, null=True)

    def __str__(self):
        return self.title

    def points(self):
        return sum(step.points for step in self.steps.all())

class Step(models.Model):
    quest = models.ForeignKey(Quest, on_delete=models.SET_NULL, related_name='steps', blank=True, null=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    index = models.IntegerField(blank=True, null=True)
    points = models.IntegerField()

class UserQuestProgress(models.Model):
    user = models.ForeignKey("Users.CustomUser", on_delete=models.SET_NULL, null=True, blank=True)
    quest = models.ForeignKey(Quest, on_delete=models.SET_NULL, null=True, blank=True)
    current_step = models.ForeignKey(Step, on_delete=models.SET_NULL, null=True, blank=True)
    points_earned = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - {self.quest.title}"

    def update_progress(self):
        if self.current_step:
            next_step = Step.objects.filter(quest=self.quest, index=self.current_step.index + 1).first()
        else:
            next_step = self.quest.steps.first()
        if next_step:
            self.current_step = next_step
            self.save()

    def complete_step(self):
        if self.current_step:
            self.points_earned += self.current_step.points
            self.update_progress()

    def finished_steps_count(self):
        if self.current_step:
            return self.quest.steps.filter(index__lte=self.current_step.index).count()
        else:
            return 0

class OptIn(models.Model):
    email = models.EmailField(max_length=254)
    def __str__(self):
        return self.email
    
class SliderImage(models.Model):
    image = models.ImageField(upload_to='slider_images/')
    alt_text = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.alt_text if self.alt_text else 'Slider Image'
    
class OnBoardingQuestion(models.Model):
    QTYPES = (
        ("table", "Table"),
        ("images", "Images"),
        ("input", "Input"),  # Add input type
    )
    index = models.IntegerField(default=0)
    question_type = models.CharField(choices=QTYPES, max_length=50, default="images")
    question = models.CharField(max_length=300)
    def __str__(self):
        return self.question

class OnBoardingOption(models.Model):
    question = models.ForeignKey(OnBoardingQuestion, on_delete=models.SET_NULL, related_name="options", blank=True, null=True)
    text = models.CharField(max_length=300, blank=True, null=True)
    img = models.ImageField(upload_to="on_boarding/", blank=True, null=True)
    def __str__(self):
        return self.text


class OnBoardingTrack(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, related_name="on_boarding", null=True, blank=True)

    def __str__(self):
        return "Onboarding Track for user - {}".format(self.user)

class OnBoardingQuestionTrack(models.Model):
    question = models.ForeignKey(OnBoardingQuestion, on_delete=models.CASCADE, null=True, blank=True)
    track = models.ForeignKey(OnBoardingTrack, on_delete=models.CASCADE, null=True, blank=True)
    answer = models.ForeignKey(OnBoardingOption, null=True, blank=True, on_delete=models.CASCADE)
    input_answer = models.TextField(null=True, blank=True)  # Field for text input answers

class dashboardLog(models.Model):
    balance = models.IntegerField(default=0)
    timestamp = models.DateTimeField()

class ContactSubmission(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField()
    phone_number = models.CharField(max_length=15, blank=True)
    message = models.TextField()
    subject = models.CharField(max_length=100)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.subject}"
    
class Vocal(models.Model):
    title = models.CharField(max_length=255)
    students_only = models.BooleanField(default=False)
    file = models.FileField(upload_to="vocals/")

    def likes_count(self):
        return CustomUser.objects.filter(liked_vocals=self).count()

    def __str__(self):
        return f"{self.title}"
    