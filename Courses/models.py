# Courses/models.py

from django.db import models
from django.db.models import Sum
from django.utils.html import mark_safe
from django_ckeditor_5.fields import CKEditor5Field
import shortuuid
from Users.models import CustomUser, Professor
from django.core.exceptions import ObjectDoesNotExist
from django.utils.text import slugify
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from moviepy.editor import VideoFileClip
import requests
import json

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
    mini_description = models.TextField(blank=True, null=True)
    tags = models.CharField(max_length=50)
    svg = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, blank=True, null=True)
    img = models.ImageField(upload_to="Course_img", blank=True, null=True)
    professor = models.ForeignKey('Users.Professor', db_index=True, on_delete=models.SET_NULL, related_name='courses', null=True, blank=True)
    members_count = models.IntegerField(default=0)
    course_requirements = models.TextField(blank=True, null=True)
    course_features = models.TextField(blank=True, null=True)
    video_trailer = models.FileField(upload_to="course_trailers", blank=True, null=True)
    category = models.CharField(db_index=True, max_length=100, choices=CATEGORY_CHOICES)
    fake_enrollment = models.IntegerField(default=0)
    landing_img = models.ImageField(upload_to="li", null=True, blank=True)
    mini_landing_img = models.ImageField(upload_to="li", null=True, blank=True)
    icon = models.TextField(default="fa-graduation-cap")
    video_count = models.IntegerField(default=0)


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

    def last_video(self, user):
        last_checkpoint = UserLevelCheckpoint.objects.filter(user=user, level__course=self).order_by('-updated_at').first()
        
        if last_checkpoint:
            return last_checkpoint.checkpointed_video
        
        # If no checkpoints are found, return None
        return None

    def update_video_count(self):
        """Method to update the video count based on the actual number of videos."""
        self.video_count = self.admin_videos.count()
        # Use update_fields to prevent the full save operation
        self.save(update_fields=['video_count'], _update_video_count=False)

    def get_videos_count(self):
        """Retrieve the stored video count without recounting."""
        return self.video_count

    def save(self, *args, _update_video_count=True, **kwargs):
        # Generate a unique slug if url_title is not set
        if not self.url_title:
            uuid_key = shortuuid.uuid()
            uniqueid = uuid_key[:4]
            new_slug = slugify(self.title) + "-" + str(uniqueid.lower())
            while Course.objects.filter(url_title=new_slug).exists():
                uuid_key = shortuuid.uuid()
                uniqueid = uuid_key[:4]
                new_slug = slugify(self.title) + "-" + str(uniqueid.lower())
            self.url_title = new_slug
        
        # Update the video count if the flag is True
        if _update_video_count:
            self.update_video_count()
        
        super(Course, self).save(*args, **kwargs)
        
        if self.professor:
            self.professor.save()

    def get_fake_enrollement(self):
        return self.fake_enrollment + self.enrolled_users.count()

    def __str__(self):
        return self.title



class Level(models.Model):
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, db_index=True, related_name='admin_levels', blank=True, null=True)
    image = models.ImageField(upload_to="levels_images", blank=True, null=True)
    level_number = models.IntegerField()
    index = models.IntegerField(default=0, db_index=True)
    title = models.CharField(max_length=255)
    url_title = models.SlugField(unique=True, db_index=True, blank=True, null=True, max_length=200)
    description = models.TextField()
    requierment = models.CharField(max_length=100, default="None", choices=REQUIERMENTS)
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
        # Calculate the total number of videos across all modules in this course
        total_videos = Video.objects.filter(module__in=self.modules.all()).count()

        if total_videos == 0:
            return 0  # Avoid division by zero if there are no videos

        # Fetch user progress for this course
        user_progress = UserCourseProgress.objects.get(user=user, course=self.course)

        # Calculate the number of completed videos for the user in this course
        completed_videos = user_progress.completed_videos.filter(module__in=self.modules.all()).count()

        # Calculate and return the completion percentage
        return round((completed_videos / total_videos) * 100)
    
    def get_previous_level(self):
        previous_level = Level.objects.filter(course=self.course, index__lt=self.index).exclude(id=self.id).order_by('-index').first()
        return previous_level

    def get_next_level(self):
        next_level = Level.objects.filter(course=self.course, index__gt=self.index).exclude(id=self.id).order_by('index').first()
        return next_level
    
    def is_unlocked(self, customuser):
        user_progress = UserCourseProgress.objects.get(user=customuser, course=self.course)

        if self.requierment == "None":
            return True
        
        previous_level = self.get_previous_level()
       
        if previous_level :
            if previous_level.is_unlocked(customuser) and self.requierment == "previous" and previous_level in user_progress.completed_levels.all():
                return True

        if self in user_progress.completed_levels.all():
            return True
        
        if self.requierment == "hard":
            return False

    def get_lowest_module_index(self):
        lowest_module = self.modules.order_by('index').first()
        if lowest_module:
            return lowest_module.index
        return None

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
    
    def get_checkpointed_video(self, user):
        try:
            checkpoint = UserLevelCheckpoint.objects.get(user=user, level=self)
            return checkpoint.checkpointed_video
        except UserLevelCheckpoint.DoesNotExist:
            return None
        
    def set_checkpoint(self, user, video):
        # Ensure the video belongs to the level
        if video.module.level == self:
            checkpoint, created = UserLevelCheckpoint.objects.update_or_create(
                user=user,
                level=self,
                defaults={'checkpointed_video': video}
            )
            return checkpoint
        else:
            raise ValueError("The video does not belong to the specified level.")

class Module(models.Model):

        
    course = models.ForeignKey(Course, db_index=True, on_delete=models.SET_NULL, related_name='admin_modules', null=True, blank=True)
    level = models.ForeignKey(Level, db_index=True, on_delete=models.SET_NULL, related_name='modules', null=True, blank=True)
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
        else:
            previous_level = self.level.get_previous_level()
            if previous_level and previous_level.is_unlocked(customuser) and self.requierment == "previous" and previous_level in user_progress.completed_levels.all():
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

    def get_lowest_video_index(self):
        lowest_video = self.videos.order_by('index').first()
        if lowest_video:
            return lowest_video.index
        return None

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
    course = models.ForeignKey(Course, db_index=True, on_delete=models.SET_NULL, related_name='admin_videos', null=True, blank=True)
    module = models.ForeignKey(Module, db_index=True, on_delete=models.SET_NULL, related_name='videos', null=True, blank=True)
    index = models.IntegerField(default=0, db_index=True)
    title = models.CharField(max_length=255)
    url_title = models.SlugField(unique=True, db_index=True, blank=True, null=True, max_length=200)
    vimeo_url = models.CharField(max_length=1000, null=True, blank=True)
    video_file = models.FileField(upload_to="coursesVideos", blank=True, null=True)
    image = models.ImageField(upload_to="courses/images", blank=True, null=True)
    summary = CKEditor5Field(config_name='extends', blank=True, null=True)
    notes = CKEditor5Field(config_name='extends', blank=True, null=True)
    requierment = models.CharField(max_length=100, default="None", choices=REQUIERMENTS)



    def get_duration(self):

        # Handle video_file if present
        if self.video_file:
            try:
                video_path = self.video_file.path  # Full path of the uploaded file
                with VideoFileClip(video_path) as clip:
                    duration = clip.duration  # Duration in seconds
                return self.format_duration(duration)
            except Exception as e:
                print(f"Error getting duration for {self.video_file}: {e}")
                return None

        # Handle Vimeo videos
        if self.vimeo_url:
            try:
                # Assume you have a method to get Vimeo video details via API
                duration = self.get_vimeo_duration()
                return self.format_duration(duration)
            except Exception as e:
                print(f"Error getting duration from Vimeo: {e}")
                return None

        # No video file or Vimeo URL provided
        return None

    def get_vimeo_duration(self):
        # Extract video ID from Vimeo iframe URL
        try:
            # Assuming self.vimeo_url is the full iframe code
            # Use regex to find the video ID within the iframe URL
            import re
            
            # Pattern to match the video ID
            pattern = r"https://player.vimeo.com/video/(\d+)"
            match = re.search(pattern, self.vimeo_url)

            if match:
                vimeo_video_id = match.group(1)  # Extract the video ID
            else:
                print("Invalid Vimeo URL format.")
                return None

        except Exception as e:
            print(f"Error extracting video ID: {e}")
            return None

        # Vimeo API URL for fetching video details
        vimeo_api_url = f"https://api.vimeo.com/videos/{vimeo_video_id}"

        headers = {
            'Authorization': 'Bearer 112bde15729090698ad5ad28da2ae8b2',  # Replace with your Vimeo API token
        }

        try:
            # Send request to Vimeo API
            response = requests.get(vimeo_api_url, headers=headers, timeout=10)  # Add timeout for safety

            # Check if the request was successful
            if response.status_code == 200:
                data = response.json()
                return data.get('duration')  # Duration is in seconds
            else:
                print(f"Failed to fetch Vimeo video data. Status code: {response.status_code}, Response: {response.text}")
                return None

        except requests.RequestException as e:
            print(f"An error occurred while fetching video duration: {e}")
            return None

    def format_duration(self, seconds):
        """Helper method to format duration from seconds to 'm:s'."""
        if seconds is not None:
            minutes, seconds = divmod(int(seconds), 60)
            return f"{minutes}:{seconds:02d}"  # Formats seconds to always have two digits
        return None


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
            if self.index == self.module.get_lowest_video_index() and self.module.get_previous_module() in user_progress.completed_modules.all():
                return True
            if self.get_previous_video() in user_progress.completed_videos.all() and self.requierment == "previous":
                return True
            if self.index == self.module.get_lowest_video_index() and self.module.level.get_previous_level() in user_progress.completed_levels.all():
                print("unlooooooo")
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
            icon = "finished"
        elif self.is_unlocked(customuser):
            icon = "open"
        elif not self.is_unlocked(customuser):
            icon = 'locked'

        return icon

    def save(self, *args, **kwargs):
        if not self.url_title:
            uuid_key = shortuuid.uuid()
            uniqueid = uuid_key[:4]
            new_slug = slugify(self.title) + "-" + str(uniqueid.lower())
            while Video.objects.filter(url_title=new_slug).exists():
                uuid_key = shortuuid.uuid()
                uniqueid = uuid_key[:4]
                new_slug = slugify(self.title) + "-" + str(uniqueid.lower())
            self.url_title = new_slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


@receiver(post_save, sender=Video)
def increment_video_count(sender, instance, created, **kwargs):
    if created:
        instance.course.video_count += 1
        instance.course.save(update_fields=['video_count'])

@receiver(post_delete, sender=Video)
def decrement_video_count(sender, instance, **kwargs):
    if instance.course:
        instance.course.video_count = max(instance.course.video_count - 1, 0)
        instance.course.save(update_fields=['video_count'])

# In models.py
class Quiz(models.Model):
    course = models.ForeignKey(Course, db_index=True, on_delete=models.SET_NULL, related_name='admin_quizzes', null=True, blank=True)
    video = models.ForeignKey(Video, db_index=True, on_delete=models.SET_NULL, related_name='quizzes', null=True, blank=True)
    question = models.TextField()
    image = models.ImageField(upload_to="quizzes_images/", blank=True, null=True)
    answer = models.ForeignKey("Courses.QuizOption", db_index=True, on_delete=models.PROTECT, blank=True, null=True, related_name='quiz_answer')

    def __str__(self):
        return self.question

class QuizOption(models.Model):
    quiz = models.ForeignKey(Quiz, db_index=True, on_delete=models.CASCADE, related_name='options', null=True, blank=True)
    course = models.ForeignKey(Course, db_index=True, on_delete=models.SET_NULL, null=True, blank=True)
    text = models.CharField(max_length=255, blank=True, null=True)
    image = models.ImageField(upload_to="quiz_images", blank=True, null=True)

    def __str__(self):
        return self.text if self.text else "Image Option"


class Exam(models.Model):
    course = models.ForeignKey(Course, db_index=True, on_delete=models.SET_NULL, related_name='exams', blank=True, null=True)
    name = models.CharField(max_length=255)
    quizzes = models.ManyToManyField(Quiz)


class UserCourseProgress(models.Model):
    user = models.ForeignKey(CustomUser, db_index=True, on_delete=models.SET_NULL, related_name='usercourseprogression', null=True, blank=True)
    course = models.ForeignKey(Course, db_index=True, on_delete=models.CASCADE, null=True, blank=True)
    completed_levels = models.ManyToManyField(Level, blank=True, related_name='completed_levels')
    completed_modules = models.ManyToManyField(Module, blank=True, related_name='completed_modules')
    completed_videos = models.ManyToManyField(Video, blank=True, related_name='completed_videos')
    completed = models.BooleanField(default=False)
    video_checkpoint = models.ForeignKey(Video, db_index=True, on_delete=models.SET_NULL, related_name='checkpointed_videos', null=True, blank=True)

    def update_completion_status(self, user):
        user_progress = UserCourseProgress.objects.get(user=user, course=self.course)
        if all(level in user_progress.completed_levels.all() for level in self.course.admin_levels.all()):
            user_progress.completed = True
            user_progress.save()

    def get_checkpoint_for_level(self, level):
        try:
            return UserLevelCheckpoint.objects.get(user=self.user, level=level).checkpointed_video
        except UserLevelCheckpoint.DoesNotExist:
            return None

class UserLevelCheckpoint(models.Model):
    user = models.ForeignKey(CustomUser, db_index=True, on_delete=models.CASCADE, related_name='user_level_checkpoints')
    level = models.ForeignKey(Level, db_index=True, on_delete=models.CASCADE, related_name='user_checkpoints')
    checkpointed_video = models.ForeignKey(Video, db_index=True, on_delete=models.SET_NULL, related_name='checkpointed_for_levels', null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)  # Automatically updates the timestamp when modified

    class Meta:
        unique_together = ('user', 'level')

class LevelProgression(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='level_progressions')
    level = models.ForeignKey(Level, on_delete=models.SET_NULL, null=True, blank=True, related_name='progressions')
    progress = models.IntegerField(default=0, null=True, blank=True)


class CourseProgression(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='course_progressions')
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name='user_progressions')

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

    course = models.ForeignKey(Course, on_delete=models.SET_NULL, related_name="orders", null=True, blank=True)
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, related_name="courses_orders", blank=True, null=True)
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
    
@receiver(post_save, sender=CourseOrder)
def create_course_order_notification(sender, instance, created, **kwargs):
    if created:
        # Prepare the email content
        email_subject = "New Course Order"
        email_message = (
            f"Dear {instance.first_name} {instance.last_name},\n\n"
            f"Thank you for ordering the course '{instance.course.name}' on our platform.\n\n"
            f"Order Details:\n"
            f"Course: {instance.course.name}\n"
            f"Payment Method: {instance.get_payment_method()}\n"
            f"Order Date: {instance.order_date}\n"
            f"Status: {'Confirmed' if instance.status else 'Pending'}\n\n"
            f"Best regards,\n"
            f"Tunisian TopGs Team"
        )
        
        # Send the email
        send_mail(
            email_subject,
            email_message,
            'info@tunisiantopgs.online',  # Replace with your actual 'from' email
            ['ahmadazizbelkahia@gmail.com', "adoumazzouz.aa@gmail.com"],  # Add other recipients if needed
            fail_silently=False,
        )