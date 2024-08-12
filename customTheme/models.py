from django.db import models

class WebsitePublicVisits(models.Model):
    visit_user_ip= models.CharField(max_length=25)
    visit_datetime = models.DateTimeField(auto_now_add=True)