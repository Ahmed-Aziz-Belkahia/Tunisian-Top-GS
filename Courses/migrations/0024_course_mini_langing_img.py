# Generated by Django 5.0.7 on 2024-09-29 03:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Courses', '0023_course_langing_img'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='mini_langing_img',
            field=models.ImageField(blank=True, null=True, upload_to='li'),
        ),
    ]