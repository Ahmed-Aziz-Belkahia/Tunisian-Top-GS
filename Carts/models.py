from django.db import models
from Users.models import CustomUser
from Products.models import Product

class Coupon(models.Model):
    code = models.CharField(max_length=1000)
    discount = models.IntegerField(default=1)
    date = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)
    valid_from = models.DateField()
    valid_to = models.DateField()
    
    def __str__(self):
        return self.code
    
    class Meta:
        ordering =['-id']

# Create your models here.
class Cart(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, related_name="cart")
    created_at = models.DateTimeField(null=True, blank=True)
    shippingCost = models.IntegerField(default=7)
    coupon = models.ForeignKey(Coupon, on_delete=models.CASCADE, null=True, blank=True)
    
    def calculate_total_price(self):
        total_price = 0
        for cart_item in self.cart_items.all():
            total_price += cart_item.product.price * cart_item.quantity
        return total_price
    
    def calculate_final_price(self):
        total_price = 0
        for cart_item in self.cart_items.all():
            total_price += cart_item.product.price * cart_item.quantity
            if self.coupon:
                total_price = total_price - (total_price * self.coupon.discount)/100
        return total_price

    def __str__(self):
        return f"Cart for {self.user.user.username}"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='cart_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    color = models.CharField(max_length=50, blank=True, null=True)
    size = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.quantity} x {self.product.title} in Cart"