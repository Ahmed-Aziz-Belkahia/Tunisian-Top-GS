# Generated by Django 5.0.2 on 2024-06-21 04:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Courses', '0005_rename_city_courseorder_country_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='courseorder',
            old_name='country',
            new_name='state',
        ),
    ]