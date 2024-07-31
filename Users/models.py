from datetime import timedelta
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from django.contrib.auth.models import AbstractUser


class Badge(models.Model):
    index = models.IntegerField(default=0)
    title = models.CharField(max_length=255)
    icon = models.ImageField(upload_to="Badge_img")
    def __str__(self):
        return self.title



    def __str__(self):
        return self.title

    def __str__(self):
        return self.title


class CustomUser(AbstractUser):
    STATUS = (
        ('regular', 'Regular'),
        ('subscriber', 'Subscriber'),
        ('moderator', 'Moderator')
    )
    email_verified = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS, default='regular')
    tel = models.CharField(max_length=16, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    pfp = models.ImageField(upload_to='profile_pics/', default='default_avatar.webp', null=True, blank=True)
    rank = models.ForeignKey("Ranks.Rank", on_delete=models.SET_NULL, null=True, blank=True)
    badges = models.ManyToManyField("Users.Badge", related_name='userss', null=True, blank=True)
    bio = models.TextField(max_length=150, null=True, blank=True)
    enrolled_courses = models.ManyToManyField('Courses.Course', related_name='enrolled_users', null=True, blank=True)
    liked_videos = models.ManyToManyField("Courses.Video", null=True, blank=True)
    liked_products = models.ManyToManyField("Products.Product", null=True, blank=True)
    last_added_points_time = models.DateTimeField(blank=True, null=True)
    bought_course_date = models.DateField(blank=True, null=True)
    p_general_n = models.BooleanField(default=True)
    p_chat_n = models.BooleanField(default=True)
    p_courses_n = models.BooleanField(default=True)

    email_general_n = models.BooleanField(default=True)
    email_chat_n = models.BooleanField(default=True)
    email_courses_n = models.BooleanField(default=True)

    points = models.IntegerField(default=0, null=True, blank=True)

    username = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.username
    
    def get_status(self):
        if self.status:
            for i in CustomUser.STATUS:
                if i[0] == self.status:
                    return i[1]
        return ""

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
            print(points_progress)
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

    def get_latest_transactions(self):
        return self.transactions.all().order_by('-date')
    

    def has_claimed_daily_points(self):
        if self.last_added_points_time:
            now = timezone.now()
            last_claim = self.last_added_points_time
            if (now - last_claim) < timedelta(days=1):
                return True
        return False

    def time_until_next_claim(self):
        if self.last_added_points_time:
            next_claim_time = self.last_added_points_time + timedelta(days=1)
            remaining_time = next_claim_time - timezone.now()
            if remaining_time.total_seconds() > 0:
                return remaining_time
        return timedelta(0)

@receiver(m2m_changed, sender=CustomUser.enrolled_courses.through)
def create_course_progression(sender, instance, action, model, pk_set, **kwargs):
    if action == 'post_add':
        for course_id in pk_set:
            course = model.objects.get(pk=course_id)
            UserCourseProgress.objects.get_or_create(user=instance, course=course)
            message_content = f"Your now have access to {course.title}."
            Notification.objects.create(
                user=instance,
                content=message_content,
                link=f"/courses/{course.url_title}/levels",
                icon="ps.png",  # Set an appropriate icon if needed
            )

class Transaction(models.Model):
    user = models.ForeignKey("Users.CustomUser", related_name='transactions', null=True, blank=True, on_delete=models.SET_NULL) 
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

        # Update the dashboardLog for the current day
        self.update_dashboard_log()

    def update_dashboard_log(self):
        # Get or create dashboardLog entry for today
        today = timezone.now().date()
        dashboard_log_entry, created = dashboardLog.objects.get_or_create(timestamp__date=today)

        # Update balance based on transaction type
        if self.type == 'profit':
            dashboard_log_entry.balance += self.amount
        elif self.type == 'loss':
            dashboard_log_entry.balance -= self.amount

        # Save the updated dashboardLog entry
        dashboard_log_entry.save()

    def __str__(self):
        return str(self.user)


class Professor(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.SET_NULL, related_name='professor', null=True, blank=True)
    description = models.CharField(max_length=255, blank=False, null=True)

    def __str__(self):
        return str(self.user)


class Address(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, related_name='addresses', null=True, blank=True)
    country = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    zip_code = models.CharField(max_length=20, null=True, blank=True)
    line = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.line}, {self.city}, {self.country} {self.zip_code}"

from Chat.models import Notification
from Courses.models import UserCourseProgress
from Pages.models import dashboardLog
from Ranks.models import Rank
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.utils import timezone
from django.utils.html import mark_safe

@receiver(post_save, sender=Transaction)
def create_transaction_notification(sender, instance, created, **kwargs):
    if created and instance.user:
        message_content = "Your transaction has been submitted."
        Notification.objects.create(
            user=instance.user,
            content=message_content,
            link="/profile",
            icon="ps.png",  # Set an appropriate icon if needed
        )

@receiver(post_save, sender=Transaction)
def create_transaction_status_changed_to_true_notification(sender, instance, **kwargs):
    if instance.status and instance.user:  # Ensure status is True and user exists
        message_content = "Your transaction status has been approved."
        Notification.objects.create(
            user=instance.user,
            content=message_content,
            link="/profile",
            icon="ps.png",  # Set an appropriate icon if needed
        )