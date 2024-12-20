# Generated by Django 5.0.7 on 2024-12-15 23:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Pages', '0022_question'),
    ]

    operations = [
        migrations.CreateModel(
            name='SocialLink',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('link', models.URLField()),
                ('image', models.ImageField(upload_to='social_link/')),
                ('text', models.CharField(max_length=50)),
            ],
        ),
    ]
