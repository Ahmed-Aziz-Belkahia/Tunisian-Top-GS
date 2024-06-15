# Generated by Django 5.0.2 on 2024-06-15 16:51

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Ranks', '0001_initial'),
        ('Users', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='rank',
        ),
        migrations.AddField(
            model_name='customuser',
            name='rank',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='Ranks.rank'),
        ),
    ]