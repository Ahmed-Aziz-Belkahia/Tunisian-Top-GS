# Ranks.models.py
from django.db import models
from colorfield.fields import ColorField

class Rank(models.Model):
    title = models.CharField(max_length=100, unique=True)
    icon = models.ImageField(upload_to='ranks_icons', default='default_tag_image.png')
    color = ColorField(default='#FF0000')
    points = models.IntegerField(default=0)

    def get_next_rank(self):
        # Find the rank with the next higher points value
        next_rank = Rank.objects.filter(points__gt=self.points).order_by('points').first()
        return next_rank

    def __str__(self):
        return str(self.title)