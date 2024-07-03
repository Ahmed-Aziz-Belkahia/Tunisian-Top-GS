from datetime import timezone
from django.db import models
from Chat.models import Notification
from Users.models import Address, CustomUser
from Products.models import Product
# Create your models here.

class Order(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    )
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', blank=True, null=True)
    
    SHIPPING_CHOICES = (
        (0, 'Pick up in store'),
        (1, 'Ship to home'),
    )
    
    shipping_method = models.IntegerField(choices=SHIPPING_CHOICES, default=1, blank=True, null=True)
    price = models.FloatField(blank = True, null=True)
    # New fields for address details
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    address = models.CharField(max_length=200, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    zip_code = models.CharField(max_length=10, blank=True, null=True)
    
    PAYMENT_METHOD_CHOICES = (
        ('cash', 'Cash on Delivery'),
        ('card', 'Credit Card'),
        # Add more payment methods as needed
    )

    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='cash', blank=True, null=True)

    def calculate_total_price(self):
        total = sum(item.product.price * item.quantity for item in self.order_items.all())
        return total

    def __str__(self):
        return f"Order {self.id} for {self.user}"

from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
@receiver(post_save, sender=Order)
def create_podcast_notification(sender, instance, created, **kwargs):
    if created and instance.user:
        message_content = "Your order has been submitted."
        Notification.objects.create(
            user=instance.user,
            content=message_content,
            link="/profile",
            icon="ps.png",  # Set an appropriate icon if needed
        )

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items', blank=True, null=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, blank=True, null=True)
    quantity = models.PositiveIntegerField(default=1)
    color = models.CharField(max_length=50, blank=True, null=True)
    size = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.quantity} x {self.product.title} in Order"