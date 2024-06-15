from datetime import timedelta
from django.contrib.auth.models import User
from django.db import models
from Ranks.models import Rank
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.utils import timezone
from django.utils.html import mark_safe

class Badge(models.Model):
    index = models.IntegerField(default=0)
    title = models.CharField(max_length=255)
    icon = models.ImageField(upload_to="Badge_img")


class CustomUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    STATUS = (
        ('regular', 'Regular'),
        ('subscriber', 'Subscriber'),
        ('moderator', 'Moderator')
    )

    status = models.CharField(max_length=20, choices=STATUS, default='regular')
    tel = models.CharField(max_length=16, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    pfp = models.ImageField(upload_to='profile_pics/', default='default_avatar.png')  # Change here
    rank = models.ForeignKey(Rank, blank=True, on_delete=models.CASCADE, null=True)
    badges = models.ManyToManyField(Badge, related_name='customusers', blank=True)
    bio = models.TextField(max_length=150, null=True, blank=True)
    enrolled_courses = models.ManyToManyField('Courses.Course', related_name='enrolled_users', blank=True)
    liked_videos = models.ManyToManyField("Courses.Video", blank=True)
    liked_products = models.ManyToManyField("Products.Product", blank=True)
    last_added_points_time = models.DateTimeField(blank=True, null=True)
    # liked_videos = models.ManyToManyField('Courses.Video', blank=True)

    p_general_n = models.BooleanField(default=True)
    p_chat_n = models.BooleanField(default=True)
    p_courses_n = models.BooleanField(default=True)

    email_general_n = models.BooleanField(default=True)
    email_chat_n = models.BooleanField(default=True)
    email_courses_n = models.BooleanField(default=True)

    email = models.EmailField(blank=True, null=True)
    first_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=30, blank=True, null=True)
    points = models.IntegerField(default=0, null=True, blank=True)

    def __str__(self):
        return str(self.user)

    def calculate_profits(self):
        return self.transactions.filter(type='profit', status=True).aggregate(models.Sum('amount'))['amount__sum'] or 0

    def calculate_losses(self):
        return self.transactions.filter(type='loss', status=True).aggregate(models.Sum('amount'))['amount__sum'] or 0

    def calculate_balance(self):
        profits = self.calculate_profits()
        losses = self.calculate_losses()
        return profits - losses

    def calculate_today_profits(self):
        today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        today_profits = self.transactions.filter(type='profit', status=True, date__gte=today_start).aggregate(models.Sum('amount'))['amount__sum'] or 0
        return today_profits

    def calculate_today_losses(self):
        today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        today_losses = self.transactions.filter(type='loss', status=True, date__gte=today_start).aggregate(models.Sum('amount'))['amount__sum'] or 0
        return today_losses

    def calculate_yesterday_profits(self):
        today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        yesterday_start = today_start - timedelta(days=1)
        yesterday_profits = self.transactions.filter(type='profit', status=True, date__gte=yesterday_start, date__lt=today_start).aggregate(models.Sum('amount'))['amount__sum'] or 0
        return yesterday_profits

    def calculate_yesterday_losses(self):
        today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        yesterday_start = today_start - timedelta(days=1)
        yesterday_losses = self.transactions.filter(type='loss', status=True, date__gte=yesterday_start, date__lt=today_start).aggregate(models.Sum('amount'))['amount__sum'] or 0
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
        transactions_yesterday = self.transactions.filter(date__lte=yesterday)
        
        profits_yesterday = transactions_yesterday.filter(type='profit', status=True).aggregate(models.Sum('amount'))['amount__sum'] or 0
        losses_yesterday = transactions_yesterday.filter(type='loss', status=True).aggregate(models.Sum('amount'))['amount__sum'] or 0
        balance_yesterday = profits_yesterday - losses_yesterday

        if balance_yesterday == 0:
            return 100 if current_balance > 0 else 0

        # Calculate the percentage change
        balance_change_percentage = ((current_balance - balance_yesterday) / balance_yesterday) * 100

        return int(balance_change_percentage)

    def calculate_overall_progress(self):
        # enrolled_courses = self.enrolled_courses.all()
        overall_progress = 0
        total_courses = 0  # enrolled_courses.count()

        # for course in enrolled_courses:
        #     course_progression, created = CourseProgression.objects.get_or_create(user=self, course=course)
        #     course_progress = course_progression.calculate_progression()
        #     overall_progress += course_progress

        if total_courses > 0:
            overall_progress_percentage = (overall_progress / (total_courses * 100)) * 100
        else:
            overall_progress_percentage = 0

        return overall_progress_percentage

    def get_current_rank(self):
        # Find the highest rank the user qualifies for based on their points
        current_rank = Rank.objects.filter(points__lte=self.points).order_by('-points').first()
        return current_rank

    def get_next_rank(self):
        # Find the next rank the user can achieve based on their points
        next_rank = Rank.objects.filter(points__gt=self.points).order_by('points').first()
        return next_rank

    def rank_fulfilling_percentage(self):
        current_rank = self.get_current_rank()
        next_rank = self.get_next_rank()
        
        if (current_rank and next_rank):
            # Calculate the percentage of points towards the next rank
            points_needed = next_rank.points - current_rank.points
            points_progress = self.points - current_rank.points
            percentage = (points_progress / points_needed) * 100
            return int(percentage)
        elif current_rank:
            # If there is no next rank, user is at the highest rank
            return 100
        else:
            # If there is no current rank, percentage cannot be calculated
            return 0

    def pfp_image(self):
        return mark_safe('<img src="%s" width="50" height="50" style="object-fit:cover; border-radius: 6px;" />' % (self.pfp.url))

    # New Method to get latest transactions
    def get_latest_transactions(self):
        return self.transactions.all().order_by('-date')

class Transaction(models.Model):
    user = models.ForeignKey(CustomUser, related_name='transactions', null=True, on_delete=models.CASCADE) 
    TYPE = (
        ('profit', 'Profit'),
        ('loss', 'Loss'),
    )

    type = models.CharField(max_length=20, choices=TYPE, blank=False,  null=True)
    pair = models.CharField(max_length=20, blank=False,  null=True)
    amount = models.FloatField()
    img = models.ImageField(upload_to='user_transactions', blank=False, null=True)
    status = models.BooleanField(default=False, null=False, blank=False)
    date = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.date:
            self.date = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.user)


class Professor(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='professor')
    description = models.CharField(max_length=255, blank=False, null=True)

    def __str__(self):
        return str(self.user)


class Address(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='addresses', null=True, blank=True)
    country = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    zip_code = models.CharField(max_length=20, null=True, blank=True)
    line = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.line}, {self.city}, {self.country} {self.zip_code}"


@receiver(post_save, sender=User)
def create_custom_user(sender, instance, created, **kwargs):
    if created and not hasattr(instance, 'customuser'):
        CustomUser.objects.create(user=instance, email=instance.email)

@receiver(post_save, sender=User)
def save_custom_user(sender, instance, **kwargs):
    try:
        instance.customuser.save()
    except CustomUser.DoesNotExist:
        pass


@receiver(pre_save, sender=CustomUser)
def update_user_email(sender, instance, **kwargs):
    if instance.pk:
        try:
            original_instance = CustomUser.objects.get(pk=instance.pk)
            if original_instance.email != instance.email:
                User.objects.filter(pk=instance.user.pk).update(email=instance.email)
        except CustomUser.DoesNotExist:
            pass