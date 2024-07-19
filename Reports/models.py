from django.db import models

# Create your models here.
class Report(models.Model):
    CATEGORIES = (
        ('none', 'None'),
        ('tshirt', 'T-Shirt'),
        ('cap', 'Cap'),
        ('cup', 'Cup')
    )
    categorie = models.CharField(max_length=20, choices=CATEGORIES, default='regular')
    user = models.ForeignKey("Users.CustomUser", on_delete=models.PROTECT ,related_name="reports", null=True, blank=True)
    message = models.TextField()