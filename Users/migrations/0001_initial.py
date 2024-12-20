# Generated by Django 5.0.2 on 2024-06-26 02:13

import django.contrib.auth.models
import django.contrib.auth.validators
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Courses', '0001_initial'),
        ('Products', '0001_initial'),
        ('Ranks', '0001_initial'),
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Badge',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('index', models.IntegerField(default=0)),
                ('title', models.CharField(max_length=255)),
                ('icon', models.ImageField(upload_to='Badge_img')),
            ],
        ),
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('status', models.CharField(choices=[('regular', 'Regular'), ('subscriber', 'Subscriber'), ('moderator', 'Moderator')], default='regular', max_length=20)),
                ('tel', models.CharField(blank=True, max_length=16, null=True)),
                ('address', models.CharField(blank=True, max_length=255, null=True)),
                ('pfp', models.ImageField(default='default_avatar.png', upload_to='profile_pics/')),
                ('bio', models.TextField(blank=True, max_length=150, null=True)),
                ('last_added_points_time', models.DateTimeField(blank=True, null=True)),
                ('p_general_n', models.BooleanField(default=True)),
                ('p_chat_n', models.BooleanField(default=True)),
                ('p_courses_n', models.BooleanField(default=True)),
                ('email_general_n', models.BooleanField(default=True)),
                ('email_chat_n', models.BooleanField(default=True)),
                ('email_courses_n', models.BooleanField(default=True)),
                ('points', models.IntegerField(blank=True, default=0, null=True)),
                ('badges', models.ManyToManyField(blank=True, related_name='userss', to='Users.badge')),
                ('enrolled_courses', models.ManyToManyField(blank=True, related_name='enrolled_users', to='Courses.course')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('liked_products', models.ManyToManyField(blank=True, to='Products.product')),
                ('liked_videos', models.ManyToManyField(blank=True, to='Courses.video')),
                ('rank', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='Ranks.rank')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('profit', 'Profit'), ('loss', 'Loss')], max_length=20, null=True)),
                ('pair', models.CharField(max_length=20, null=True)),
                ('amount', models.FloatField()),
                ('img', models.ImageField(null=True, upload_to='user_transactions')),
                ('status', models.BooleanField(default=False)),
                ('date', models.DateTimeField(blank=True, null=True)),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='transactions', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Professor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=255, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='professor', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('country', models.CharField(blank=True, max_length=255, null=True)),
                ('city', models.CharField(blank=True, max_length=100, null=True)),
                ('zip_code', models.CharField(blank=True, max_length=20, null=True)),
                ('line', models.CharField(blank=True, max_length=255, null=True)),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='addresses', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
