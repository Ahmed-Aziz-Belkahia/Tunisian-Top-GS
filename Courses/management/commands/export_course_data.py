from django.core.management.base import BaseCommand
from Courses.models import Course, Level, Module, Video
from django.utils.html import strip_tags

class Command(BaseCommand):
    help = 'Exports course, level, module, and video details in order.'

    def handle(self, *args, **options):
        courses = Course.objects.all().order_by('title')

        for course in courses:
            self.stdout.write(f"Course: {course.title}")
            
            levels = Level.objects.filter(course=course).order_by('index')

            for level in levels:
                self.stdout.write(f"  Level: {level.title}")
                
                modules = Module.objects.filter(level=level).order_by('index')

                for module in modules:
                    self.stdout.write(f"    Module: {module.title}")
                    
                    videos = Video.objects.filter(module=module).order_by('index')

                    for video in videos:
                        notes = strip_tags(video.notes) if video.notes else "No Notes"
                        summary = strip_tags(video.summary) if video.summary else "No Summary"
                        
                        self.stdout.write(f"      Video: {video.title}")
                        self.stdout.write(f"        Notes: {notes}")
                        self.stdout.write(f"        Summary: {summary}")