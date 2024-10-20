# Generated by Django 5.0.2 on 2024-07-08 17:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Pages', '0002_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ContactSubmission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('email', models.EmailField(max_length=254)),
                ('phone_number', models.CharField(blank=True, max_length=15)),
                ('message', models.TextField()),
                ('subject', models.CharField(max_length=100)),
                ('submitted_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
