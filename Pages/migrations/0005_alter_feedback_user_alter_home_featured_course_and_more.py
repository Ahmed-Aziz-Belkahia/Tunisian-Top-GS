# Generated by Django 5.0.2 on 2024-07-19 00:53

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Courses', '0008_alter_course_professor_alter_courseorder_course_and_more'),
        ('Pages', '0004_alter_feedback_user_alter_home_featured_course_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='feedback',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='home',
            name='featured_course',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='Courses.course'),
        ),
        migrations.AlterField(
            model_name='onboardingoption',
            name='question',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='options', to='Pages.onboardingquestion'),
        ),
        migrations.AlterField(
            model_name='onboardingquestiontrack',
            name='answer',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='answers', to='Pages.onboardingoption'),
        ),
        migrations.AlterField(
            model_name='onboardingquestiontrack',
            name='question',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='answers', to='Pages.onboardingquestion'),
        ),
        migrations.AlterField(
            model_name='onboardingquestiontrack',
            name='track',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='questions', to='Pages.onboardingtrack'),
        ),
        migrations.AlterField(
            model_name='onboardingtrack',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='on_boarding', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='step',
            name='quest',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='steps', to='Pages.quest'),
        ),
        migrations.AlterField(
            model_name='userquestprogress',
            name='current_step',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='Pages.step'),
        ),
        migrations.AlterField(
            model_name='userquestprogress',
            name='quest',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='Pages.quest'),
        ),
        migrations.AlterField(
            model_name='userquestprogress',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL),
        ),
    ]