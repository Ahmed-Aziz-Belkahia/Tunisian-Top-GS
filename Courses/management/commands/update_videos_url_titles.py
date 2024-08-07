from django.core.management.base import BaseCommand
from django.utils.text import slugify
import shortuuid
from Courses.models import Video

class Command(BaseCommand):
    help = 'Generate url_title for existing Video records'

    def handle(self, *args, **options):
        videos = Video.objects.filter(url_title__isnull=True) | Video.objects.filter(url_title='')
        for video in videos:
            base_slug = slugify(video.title)
            new_slug = base_slug
            # Check if the base_slug is unique
            if Video.objects.filter(url_title=new_slug).exists():
                # If not unique, add a UUID
                uuid_key = shortuuid.uuid()
                uniqueid = uuid_key[:4]
                new_slug = f"{base_slug}-{uniqueid.lower()}"
                while Video.objects.filter(url_title=new_slug).exists():
                    uuid_key = shortuuid.uuid()
                    uniqueid = uuid_key[:4]
                    new_slug = f"{base_slug}-{uniqueid.lower()}"
            video.url_title = new_slug
            video.save()
            self.stdout.write(self.style.SUCCESS(f'Updated video {video.id} with new url_title: {video.url_title}'))
