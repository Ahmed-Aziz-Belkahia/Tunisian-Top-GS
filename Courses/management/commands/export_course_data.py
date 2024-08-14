# courses/management/commands/export_course_data.py

from django.core.management.base import BaseCommand
from Courses.models import Course, Level, Module, Video
from django.utils.html import strip_tags

class Command(BaseCommand):
    help = 'Exports course, level, module, and video details to a text file.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--output',
            type=str,
            help='Specify the output file path. Defaults to "course_data.txt".',
            default='course_data.txt'
        )

    def handle(self, *args, **options):
        output_file = options['output']
        
        with open(output_file, 'w', encoding='utf-8') as file:
            courses = Course.objects.all().order_by('title')

            for course in courses:
                file.write(f"Course: {course.title}\n")
                
                levels = Level.objects.filter(course=course).order_by('index')

                for level in levels:
                    file.write(f"  Level: {level.title}\n")
                    
                    modules = Module.objects.filter(level=level).order_by('index')

                    for module in modules:
                        file.write(f"    Module: {module.title}\n")
                        
                        videos = Video.objects.filter(module=module).order_by('index')

                        for video in videos:
                            notes = strip_tags(video.notes) if video.notes else "No Notes"
                            summary = strip_tags(video.summary) if video.summary else "No Summary"
                            
                            file.write(f"      Video: {video.title}\n")
                            file.write(f"        Notes: {notes}\n")
                            file.write(f"        Summary: {summary}\n")

        self.stdout.write(f"Data exported successfully to {output_file}")
