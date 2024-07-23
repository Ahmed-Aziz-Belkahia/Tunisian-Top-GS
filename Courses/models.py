# Courses/models.py

from django.db import models
from django.db.models import Sum
from django.utils.html import mark_safe
from django_ckeditor_5.fields import CKEditor5Field
import shortuuid
from Users.models import CustomUser, Professor
from django.core.exceptions import ObjectDoesNotExist
from django.utils.text import slugify



REQUIERMENTS = [
        ("None", "None"),
        ("previous", "Previous"),
        ("hard", "Hard Close"),
    ]
# Create your models here.
class Course(models.Model):
    CATEGORY_CHOICES = [
        ('Trading', 'Trading'),
        ('Development', 'Development'),
        ('Design', 'Design UI / UX'),
        ('Data Science', 'Data Science'),
        ('Marketing', 'Marketing'),
    ]

    title = models.CharField(max_length=255, db_index=True)
    url_title = models.SlugField(unique=True, blank=True, null=True, db_index=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, blank=True, null=True)
    img = models.ImageField(upload_to="Course_img", blank=True, null=True)
    professor = models.ForeignKey('Users.Professor', db_index=True, on_delete=models.PROTECT, related_name='courses', null=True, blank=True)
    members_count = models.IntegerField(default=0)
    course_requirements = models.TextField(blank=True, null=True)
    course_features = models.TextField(blank=True, null=True)
    video_trailer = models.FileField(upload_to="course_trailers", blank=True, null=True)
    category = models.CharField(db_index=True, max_length=100, choices=CATEGORY_CHOICES)

    def course_image(self):
        if self.img and hasattr(self.img, 'url'):
            return mark_safe('<img src="%s" width="50" height="50" style="object-fit:cover; border-radius: 6px;" />' % (self.img.url))
        else:
            return "No Image"

    def calculate_progress_percentage(self, user):
        total_levels = self.admin_levels.count()
        if total_levels == 0:
            return 0

        user_progress = UserCourseProgress.objects.get(user=user, course=self)
        completed_levels = user_progress.completed_levels.count()
        return round((completed_levels / total_levels) * 100)

    def update_completion_status(self, user):
        user_progress = UserCourseProgress.objects.get(user=user, course=self)
        all_levels_completed = all(level in user_progress.completed_levels.all() for level in self.admin_levels.all())
        if all_levels_completed:
            user_progress.completed = True
            user_progress.save()

    def get_total_price(self):
        if self.discount_price and self.discount_price < self.price:
            return self.price - self.discount_price
        return self.price
   
    def is_unlocked(self, customuser):
        if self.module.is_unlocked(customuser):
            if self.requierment == "None":
                return True
            if self.index == 0:
                previous_module = self.module.get_previous_module()
                if previous_module and previous_module.get_videos().last().is_finished(customuser):
                    return True
            user_progress = UserCourseProgress.objects.get(user=customuser, course=self.course)
            return self.get_previous_video() in user_progress.completed_videos.all()
        return False

    def is_finished(self, customuser):
        user_progress = UserCourseProgress.objects.get(user=customuser, course=self.course)
        return self in user_progress.completed_videos.all()
    
    def save(self, *args, **kwargs):
        if not self.url_title:
            uuid_key = shortuuid.uuid()
            uniqueid = uuid_key[:4]
            new_slug = slugify(self.title) + "-" + str(uniqueid.lower())
            while Course.objects.filter(url_title=new_slug).exists():
                uuid_key = shortuuid.uuid()
                uniqueid = uuid_key[:4]
                new_slug = slugify(self.title) + "-" + str(uniqueid.lower())
            self.url_title = new_slug

        super(Course, self).save(*args, **kwargs)

        if self.professor:
            self.professor.save()  # Ensure the professor is saved as well

    def __str__(self):
        return self.title


class Level(models.Model):
    course = models.ForeignKey(Course, on_delete=models.PROTECT, db_index=True, related_name='admin_levels', blank=True, null=True)
    image = models.ImageField(upload_to="levels_images", blank=True, null=True)
    level_number = models.IntegerField()
    title = models.CharField(max_length=255)
    url_title = models.SlugField(unique=True, db_index=True, blank=True, null=True, max_length=200)
    description = models.TextField()

    def is_unlocked(self):
        return True

    def __str__(self):
        return self.title    

    def videos_count(self):
        modules = self.modules.all()
        total_videos = 0
        for module in modules:
            total_videos += module.videos.count()
        return total_videos

    def questions_count(self):
        modules = self.modules.all()
        total_questions = 0
        for module in modules:
            for video in module.videos.all():
                total_questions += video.quizzes.count()
        return total_questions

    def update_completion_status(self, user):
        user_progress = UserCourseProgress.objects.get(user=user, course=self.course)
        if all(module in user_progress.completed_modules.all() for module in self.modules.all()):
            user_progress.completed_levels.add(self)
            self.course.update_completion_status(user)

    def calculate_progress_percentage(self, user):
        total_modules = self.modules.count()
        if total_modules == 0:
            return 0

        user_progress = UserCourseProgress.objects.get(user=user, course=self.course)
        completed_modules = user_progress.completed_modules.filter(level=self).count()
        return round((completed_modules / total_modules) * 100)
    
    def save(self, *args, **kwargs):
        if not self.url_title:
            uuid_key = shortuuid.uuid()
            uniqueid = uuid_key[:4]
            new_slug = slugify(self.title) + "-" + str(uniqueid.lower())
            while Level.objects.filter(url_title=new_slug).exists():
                uuid_key = shortuuid.uuid()
                uniqueid = uuid_key[:4]
                new_slug = slugify(self.title) + "-" + str(uniqueid.lower())
            self.url_title = new_slug

        super(Level, self).save(*args, **kwargs)


class Module(models.Model):

        
    course = models.ForeignKey(Course, db_index=True, on_delete=models.PROTECT, related_name='admin_modules', null=True, blank=True)
    level = models.ForeignKey(Level, db_index=True, on_delete=models.PROTECT, related_name='modules', null=True, blank=True)
    title = models.CharField(max_length=255)
    index = models.IntegerField(default=0, db_index=True)
    module_number = models.IntegerField(blank=True, null=True)
    description = models.TextField()
    open_videos = models.BooleanField(default=False)
    requierment = models.CharField(max_length=100, default="None", choices=REQUIERMENTS)
    def is_unlocked(self, customuser):
        user_progress = UserCourseProgress.objects.get(user=customuser, course=self.course)

        if self.requierment == "None":
            return True
        
        previous_module = self.get_previous_module()
       
        if previous_module :
            if previous_module.is_unlocked(customuser) and self.requierment == "previous" and previous_module in user_progress.completed_modules.all():
                return True
        
        if self in user_progress.completed_modules.all():
            return True
        
        if self.requierment == "hard":
            return False

    def get_videos(self):
        return self.videos.all().order_by('index')

    def update_completion_status(self, user=None):
        if user:
            user_progress = UserCourseProgress.objects.get(user=user, course=self.level.course)
            if all(video in user_progress.completed_videos.all() for video in self.videos.all()):
                user_progress.completed_modules.add(self)
                self.level.update_completion_status(user)

    def calculate_progress_percentage(self, user):
        total_videos = self.videos.count()
        if total_videos == 0:
            return 0

        user_progress = UserCourseProgress.objects.get(user=user, course=self.level.course)
        completed_videos = user_progress.completed_videos.filter(module=self).count()
        return round((completed_videos / total_videos) * 100)

    def get_next_module(self):
        next_module = Module.objects.filter(level=self.level, index__gt=self.index).exclude(id=self.id). order_by('index').first()
        if next_module:
            return next_module
        else:
            return None

    def get_previous_module(self):
        previous_module = Module.objects.filter(level=self.level, index__lt=self.index).exclude(id=self.id).order_by('-index').first()
        return previous_module

    def is_finished(self, customuser):
        user_progress = UserCourseProgress.objects.get(user=customuser, course=self.course)
        return self in user_progress.completed_modules.all()
    
    def get_icon(self, customuser):
        icon = ""
        if self.is_finished(customuser):
            icon = "completed"
        elif self.is_unlocked(customuser):
            icon = "open"
        elif not self.is_unlocked(customuser):
            icon = 'locked'

        return icon

    def __str__(self):
        return self.title


class Video(models.Model):
    course = models.ForeignKey(Course, db_index=True, on_delete=models.PROTECT, related_name='admin_videos', null=True, blank=True)
    module = models.ForeignKey(Module, db_index=True, on_delete=models.PROTECT, related_name='videos', null=True, blank=True)
    index = models.IntegerField(default=0, db_index=True)
    title = models.CharField(max_length=255)
    vimeo_url = models.CharField(max_length=1000, null=True, blank=True)
    video_file = models.FileField(upload_to="coursesVideos", blank=True, null=True)
    image = models.ImageField(upload_to="courses/images", blank=True, null=True)
    summary = CKEditor5Field(config_name='extends', blank=True, null=True)
    notes = CKEditor5Field(config_name='extends', blank=True, null=True)
    requierment = models.CharField(max_length=100, default="None", choices=REQUIERMENTS)


    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.module:
            self.module.update_completion_status()

    def get_next_video(self):
        next_video = Video.objects.filter(module=self.module, index__gt=self.index).order_by('index').first()
        return next_video if next_video else None

    def get_previous_video(self):
        previous_video = Video.objects.filter(module=self.module, index__lt=self.index).order_by('-index').first()
        return previous_video if previous_video else None

    def is_unlocked(self, customuser):
        user_progress = UserCourseProgress.objects.get(user=customuser, course=self.course)

        if self.module.is_unlocked(customuser):
            if self.requierment == "None":
                return True
            if self.index == 0 and self.module.get_previous_module().get_videos().last().is_unlocked(customuser):
                return True
            if self.get_previous_video() in user_progress.completed_videos.all() and self.requierment == "previous":
                return True
        else:
            return False
        return self.get_previous_video() in user_progress.completed_videos.all()

    def is_finished(self, customuser):
        user_progress = UserCourseProgress.objects.get(user=customuser, course=self.course)
        return self in user_progress.completed_videos.all()
    
    def get_icon(self, customuser):
        icon = ""
        if self.is_finished(customuser):
            icon = "completed"
        elif self.is_unlocked(customuser):
            icon = "open"
        elif not self.is_unlocked(customuser):
            icon = 'locked'

        return icon

    def __str__(self):
        return self.title


# In models.py
class Quiz(models.Model):
    course = models.ForeignKey(Course, db_index=True, on_delete=models.PROTECT, related_name='admin_quizzes', null=True, blank=True)
    video = models.ForeignKey(Video, db_index=True, on_delete=models.SET_NULL, related_name='quizzes', null=True, blank=True)
    question = models.TextField()
    answer = models.ForeignKey("Courses.QuizOption", db_index=True, on_delete=models.PROTECT, blank=True, null=True, related_name='quiz_answer')

    def __str__(self):
        return self.question

class QuizOption(models.Model):
    quiz = models.ForeignKey(Quiz, db_index=True, on_delete=models.PROTECT, related_name='options', null=True, blank=True)
    course = models.ForeignKey(Course, db_index=True, on_delete=models.PROTECT, null=True, blank=True)
    text = models.CharField(max_length=255, blank=True, null=True)
    image = models.ImageField(upload_to="quiz_images", blank=True, null=True)

    def __str__(self):
        return self.text if self.text else "Image Option"


class Exam(models.Model):
    course = models.ForeignKey(Course, db_index=True, on_delete=models.PROTECT, related_name='exams', blank=True, null=True)
    name = models.CharField(max_length=255)
    quizzes = models.ManyToManyField(Quiz)


class UserCourseProgress(models.Model):
    user = models.ForeignKey(CustomUser, db_index=True, on_delete=models.PROTECT, related_name='usercourseprogression', null=True, blank=True)
    course = models.ForeignKey(Course, db_index=True, on_delete=models.PROTECT, null=True, blank=True)
    completed_levels = models.ManyToManyField(Level, blank=True, related_name='completed_levels')
    completed_modules = models.ManyToManyField(Module, blank=True, related_name='completed_modules')
    completed_videos = models.ManyToManyField(Video, blank=True, related_name='completed_videos')
    completed = models.BooleanField(default=False)  # Add this field to track course completion

    def update_completion_status(self, user):
        user_progress = UserCourseProgress.objects.get(user=user, course=self.course)
        if all(level in user_progress.completed_levels.all() for level in self.course.admin_levels.all()):
            user_progress.completed = True
            user_progress.save()


class LevelProgression(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.PROTECT, null=True, blank=True, related_name='level_progressions')
    level = models.ForeignKey(Level, on_delete=models.PROTECT, null=True, blank=True, related_name='progressions')
    progress = models.IntegerField(default=0, null=True, blank=True)


class CourseProgression(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.PROTECT, null=True, blank=True, related_name='course_progressions')
    course = models.ForeignKey(Course, on_delete=models.PROTECT, null=True, blank=True, related_name='user_progressions')

    def calculate_progression(self):
        course_levels = self.course.admin_levels.all()
        level_progressions = LevelProgression.objects.filter(level__in=course_levels, user=self.user)
        total_progress = level_progressions.aggregate(Sum('progress'))['progress__sum']
        total_progress = total_progress or 0
        return round(total_progress)

class CourseOrder(models.Model):
    PAYMENT_CHOICES = [
        ('tba', 'Transfer Bank Account (R.I.B - Preferred)'),
        ('e-dinar', 'E-Dinar'),
        ('paypal', 'Paypal'),
        ('zelle', 'Zelle'),
        ('cashapp', 'Cash App'),
        ('crypto', 'Crypto'),
        ('wise', 'Wise'),
        ('venmo', 'Venmo'),
    ]

    course = models.ForeignKey(Course, on_delete=models.PROTECT, related_name="orders", null=True, blank=True)
    user = models.ForeignKey(CustomUser, on_delete=models.PROTECT, related_name="courses_orders", blank=True, null=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    age = models.IntegerField()
    tel = models.CharField(max_length=15)
    email = models.EmailField()
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES)
    order_date = models.DateTimeField(auto_now_add=True)

    status = models.BooleanField(default=False)

    def __str__(self):
        return f"Order {self.id} by {self.first_name} {self.last_name}"
    
    def get_payment_method(self):
        if self.payment_method:
            for i in self.PAYMENT_CHOICES:
                if self.payment_method == i[0]:
                    return i[1]
        return ""