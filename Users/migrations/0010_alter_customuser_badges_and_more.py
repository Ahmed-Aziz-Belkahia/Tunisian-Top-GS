# Generated by Django 5.0.2 on 2024-07-22 23:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Courses', '0009_alter_course_category_alter_course_title_and_more'),
        ('Products', '0005_alter_deal_product_alter_review_product_and_more'),
        ('Users', '0009_alter_customuser_rank'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='badges',
            field=models.ManyToManyField(blank=True, null=True, related_name='userss', to='Users.badge'),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='enrolled_courses',
            field=models.ManyToManyField(blank=True, null=True, related_name='enrolled_users', to='Courses.course'),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='liked_products',
            field=models.ManyToManyField(blank=True, null=True, to='Products.product'),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='liked_videos',
            field=models.ManyToManyField(blank=True, null=True, to='Courses.video'),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='pfp',
            field=models.ImageField(blank=True, default='default_avatar.png', null=True, upload_to='profile_pics/'),
        ),
    ]