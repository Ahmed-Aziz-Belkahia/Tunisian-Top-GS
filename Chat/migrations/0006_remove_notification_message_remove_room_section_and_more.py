# Generated by Django 5.0.7 on 2024-10-10 17:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Chat', '0005_alter_message_room_alter_message_user_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notification',
            name='message',
        ),
        migrations.RemoveField(
            model_name='room',
            name='section',
        ),
        migrations.RemoveField(
            model_name='notification',
            name='course',
        ),
        migrations.RemoveField(
            model_name='notification',
            name='level',
        ),
        migrations.RemoveField(
            model_name='notification',
            name='product',
        ),
        migrations.DeleteModel(
            name='Message',
        ),
        migrations.DeleteModel(
            name='Room',
        ),
        migrations.DeleteModel(
            name='Section',
        ),
    ]