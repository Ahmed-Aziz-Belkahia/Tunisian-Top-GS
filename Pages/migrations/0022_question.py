# Generated by Django 5.0.7 on 2024-10-29 09:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Pages', '0021_bookorder_state'),
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.TextField()),
            ],
        ),
    ]