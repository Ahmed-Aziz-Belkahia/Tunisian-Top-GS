# Generated by Django 5.0.2 on 2024-07-19 01:03

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Ranks', '0002_rank_color'),
        ('Users', '0008_alter_address_user_alter_customuser_rank_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='rank',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='Ranks.rank'),
        ),
    ]
