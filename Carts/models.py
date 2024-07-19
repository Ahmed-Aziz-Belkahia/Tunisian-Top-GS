from django.db import models
from Users.models import CustomUser
from Products.models import Product
from datetime import datetime

class Coupon(models.Model):
    code = models.CharField(max_length=1000)
    discount = models.IntegerField(default=1)
    date = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)
    valid_from = models.DateField()
    valid_to = models.DateField()

    def validate(self):
        now = datetime.now().date()
        return self.active and self.valid_from <= now <= self.valid_to
    
    def __str__(self):
        return self.code

    class Meta:
        ordering = ['-id']

class Cart(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.PROTECT, null=True, blank=True, related_name="cart")
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    shippingCost = models.IntegerField(default=7)
    coupon = models.ForeignKey(Coupon, on_delete=models.PROTECT, null=True, blank=True)

    def calculate_total_price(self):
        total_price = sum(cart_item.product.price * cart_item.quantity for cart_item in self.cart_items.all())
        return total_price
    
    def calculate_final_price(self):
        total_price = self.calculate_total_price()
        if self.coupon and self.coupon.validate():
            total_price -= (total_price * self.coupon.discount) / 100
        total_price += self.shippingCost
        return total_price
    
    def get_discounted_price(self):
        if self.coupon and self.coupon.validate():
            total_price = self.calculate_total_price()
            return (total_price * self.coupon.discount) / 100
        return 0

    def __str__(self):
        return f"Cart for {self.user}"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.PROTECT, related_name='cart_items', null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.PROTECT, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    color = models.CharField(max_length=50, blank=True, null=True)
    size = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.quantity} x {self.product.title} in Cart"
