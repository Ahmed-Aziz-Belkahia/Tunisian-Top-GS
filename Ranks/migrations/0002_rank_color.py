# Generated by Django 5.0.2 on 2024-07-01 06:59

import colorfield.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Ranks', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='rank',
            name='color',
            field=colorfield.fields.ColorField(default='#FF0000', image_field=None, max_length=25, samples=None),
        ),
    ]
