# Generated by Django 5.0.7 on 2024-10-22 00:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Chat', '0006_remove_notification_message_remove_room_section_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='icon',
            field=models.TextField(default='fa-book'),
        ),
    ]