# Generated by Django 5.0.7 on 2024-12-10 23:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Courses', '0029_course_video_count'),
    ]

    operations = [
        migrations.CreateModel(
            name='levelFeedback',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.IntegerField()),
                ('feedback', models.TextField(blank=True)),
                ('timestamp', models.TimeField(auto_now_add=True)),
                ('level', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='Courses.level')),
            ],
        ),
    ]
