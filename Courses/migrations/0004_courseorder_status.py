# Generated by Django 5.0.2 on 2024-07-01 05:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Courses', '0003_alter_video_vimeo_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='courseorder',
            name='status',
            field=models.BooleanField(default=False),
        ),
    ]
