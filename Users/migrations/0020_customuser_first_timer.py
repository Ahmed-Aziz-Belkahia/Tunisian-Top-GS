# Generated by Django 5.0.7 on 2024-10-20 13:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Users', '0019_customuser_liked_vocals'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='first_timer',
            field=models.BooleanField(default=True),
        ),
    ]