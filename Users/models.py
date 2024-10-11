from datetime import timedelta
from django.utils import timezone
from django.db import models
from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from django.contrib.auth.models import AbstractUser
from django.utils.safestring import mark_safe


class Badge(models.Model):
    index = models.IntegerField(default=0)
    title = models.CharField(max_length=255)
    icon = models.ImageField(upload_to="Badge_img")

    def __str__(self):
        return self.title


class CustomUser(AbstractUser):
    STATUS = (
        ('regular', 'Regular'),
        ('subscriber', 'Subscriber'),
        ('moderator', 'Moderator'),
    )
    
    email_verified = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS, default='regular')
    tel = models.CharField(max_length=16, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    pfp = models.ImageField(upload_to='profile_pics/', default='default_avatar.webp', null=True, blank=True)
    rank = models.ForeignKey("Ranks.Rank", on_delete=models.SET_NULL, null=True, blank=True)
    badges = models.ManyToManyField("Users.Badge", related_name='userss', blank=True)
    bio = models.TextField(max_length=150, null=True, blank=True)
    enrolled_courses = models.ManyToManyField('Courses.Course', related_name='enrolled_users', blank=True)
    liked_videos = models.ManyToManyField("Courses.Video", blank=True)
    liked_products = models.ManyToManyField("Products.Product", blank=True)
    liked_vocals = models.ManyToManyField("Pages.Vocal", blank=True)
    last_added_points_time = models.DateTimeField(blank=True, null=True)
    bought_course_date = models.DateField(blank=True, null=True)
    points = models.IntegerField(default=0, null=True, blank=True)

    username = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.username
    
    def has_access_to_course(self, course_id):
        if course_id == 3 and self.bought_course_date:
            expiration_date = self.bought_course_date + timedelta(days=31)
            return timezone.now().date() <= expiration_date
        return True

    def get_status(self):
        return dict(self.STATUS).get(self.status, "")

    def _calculate_transactions(self, type):
        return self.transactions.filter(type=type, status=True).aggregate(models.Sum('amount'))['amount__sum'] or 0

    def calculate_profits(self):
        return self._calculate_transactions('profit')

    def calculate_losses(self):
        return self._calculate_transactions('loss')

    def calculate_balance(self):
        return self.calculate_profits() - self.calculate_losses()

    def calculate_today_amount(self, type):
        today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        return self.transactions.filter(type=type, status=True, date__gte=today_start).aggregate(models.Sum('amount'))['amount__sum'] or 0

    def calculate_today_profits(self):
        return self.calculate_today_amount('profit')

    def calculate_today_losses(self):
        return self.calculate_today_amount('loss')

    def calculate_yesterday_amount(self, type):
        today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        yesterday_start = today_start - timedelta(days=1)
        return self.transactions.filter(type=type, status=True, date__gte=yesterday_start, date__lt=today_start).aggregate(models.Sum('amount'))['amount__sum'] or 0

    def calculate_yesterday_profits(self):
        return self.calculate_yesterday_amount('profit')

    def calculate_yesterday_losses(self):
        return self.calculate_yesterday_amount('loss')

    def calculate_daily_change_percentage(self, today_amount, yesterday_amount):
        if yesterday_amount == 0:
            return 100 if today_amount > 0 else 0
        return int(round((today_amount / yesterday_amount) * 100))

    def calculate_daily_profits_change_percentage(self):
        return self.calculate_daily_change_percentage(self.calculate_today_profits(), self.calculate_yesterday_profits())

    def calculate_daily_losses_change_percentage(self):
        return self.calculate_daily_change_percentage(self.calculate_today_losses(), self.calculate_yesterday_losses())

    def calculate_daily_balance_change_percentage(self):
        current_balance = self.calculate_balance()
        yesterday = timezone.now() - timedelta(days=1)
        transactions_yesterday = self.transactions.filter(date__lte=yesterday)

        profits_yesterday = transactions_yesterday.filter(type='profit', status=True).aggregate(models.Sum('amount'))['amount__sum'] or 0
        losses_yesterday = transactions_yesterday.filter(type='loss', status=True).aggregate(models.Sum('amount'))['amount__sum'] or 0
        balance_yesterday = profits_yesterday - losses_yesterday

        if balance_yesterday == 0:
            return 100 if current_balance > 0 else 0
        return int(((current_balance - balance_yesterday) / balance_yesterday) * 100)

    def calculate_overall_progress(self):
        overall_progress = sum(course_progress.calculate_progression() for course in self.enrolled_courses.all())
        total_courses = self.enrolled_courses.count()
        return (overall_progress / (total_courses * 100)) * 100 if total_courses > 0 else 0

    def get_current_rank(self):
        return Rank.objects.filter(points__lte=self.points).order_by('-points').first()

    def get_next_rank(self):
        return Rank.objects.filter(points__gt=self.points).order_by('points').first()

    def rank_fulfilling_percentage(self):
        current_rank = self.get_current_rank()
        next_rank = self.get_next_rank()
        
        if current_rank and next_rank:
            points_needed = next_rank.points - current_rank.points
            points_progress = self.points - current_rank.points
            return int((points_progress / points_needed) * 100)
        elif current_rank:
            return 100
        return 0

    def pfp_image(self):
        return mark_safe('<img src="%s" width="50" height="50" style="object-fit:cover; border-radius: 6px;" />' % (self.pfp.url))

    def get_latest_transactions(self):
        return self.transactions.all().order_by('-date')
    
    def has_claimed_daily_points(self):
        if self.last_added_points_time:
            return (timezone.now() - self.last_added_points_time) < timedelta(days=1)
        return False

    def time_until_next_claim(self):
        if self.last_added_points_time:
            next_claim_time = self.last_added_points_time + timedelta(days=1)
            remaining_time = next_claim_time - timezone.now()
            return remaining_time if remaining_time.total_seconds() > 0 else timedelta(0)
        return timedelta(0)

@receiver(m2m_changed, sender=CustomUser.enrolled_courses.through)
def create_course_progression(sender, instance, action, model, pk_set, **kwargs):
    if action == 'post_add':
        for course_id in pk_set:
            course = model.objects.get(pk=course_id)
            UserCourseProgress.objects.get_or_create(user=instance, course=course)
            Notification.objects.create(
                user=instance,
                content=f"You now have access to {course.title}.",
                link=f"/courses/{course.url_title}/levels",
            )

        if 3 in pk_set:
            instance.bought_course_date = timezone.now()
            instance.save()


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
            )

        if 3 in pk_set:
            instance.bought_course_date = timezone.now()
            instance.save()

class Transaction(models.Model):
    user = models.ForeignKey("Users.CustomUser", related_name='transactions', null=True, blank=True, on_delete=models.SET_NULL)
    TYPE = (
        ('profit', 'Profit'),
        ('loss', 'Loss'),
    )
    type = models.CharField(max_length=20, choices=TYPE, blank=False, null=True)
    pair = models.CharField(max_length=20, blank=False, null=True)
    amount = models.FloatField(blank=False, null=True)
    status = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.type} - {self.amount}"
    
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