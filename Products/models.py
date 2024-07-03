from django.db import models

from Users.models import CustomUser

# Create your models here.

class Color(models.Model):
    name = models.CharField(max_length=50, blank=False, null=True)
    
    def __str__(self):
        return self.name

class Size(models.Model):
    name = models.CharField(max_length=50, blank=False, null=True)
    
    def __str__(self):
        return self.name

class Product(models.Model):
    CATEGORIES = (
        ('hoodie', 'Hoodie'),
        ('cap', 'Cap'),
        ('cup', 'Cup')
    )
    category = models.CharField(max_length=20, choices=CATEGORIES, default='hoodie')
    title = models.CharField(max_length=255, blank=False)
    offer = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField(blank=True)
    colors = models.ManyToManyField(Color, blank=True)
    sizes = models.ManyToManyField(Size, blank=True)
    image = models.ImageField(upload_to="Product_Images", null=True, blank=True)
    oldPrice = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_available = models.BooleanField(default=False)
    relatedProducts = models.ManyToManyField("Products.Product", blank=True)
    quantity = models.IntegerField(default=0)

    def product_rating(self):
        product_rating = Review.objects.filter(product=self).aggregate(avg_rating=models.Avg('rating'))
        print(product_rating, product_rating['avg_rating'])
        return product_rating['avg_rating']
    
    def rating_count(self):
        rating_count = Review.objects.filter(product=self).count()
        print(rating_count)
        return rating_count
    
    def __str__(self):
        return self.title

class SubImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='sub_images')
    sub_image = models.ImageField(upload_to='Sub_Product_Images', null=True, blank=True)

    def __str__(self):
        return f"Sub Image of {self.product.title}"
    
class Deal(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='deal')
    banner = models.ImageField(upload_to="deals")

RATING = (
    ( 1,  "★☆☆☆☆"),
    ( 2,  "★★☆☆☆"),
    ( 3,  "★★★☆☆"),
    ( 4,  "★★★★☆"),
    ( 5,  "★★★★★"),
)


class Review(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, blank=True, null=True)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, blank=True, null=True, related_name="reviews")
    review = models.TextField()
    reply = models.CharField(null=True, blank=True, max_length=1000)
    rating = models.IntegerField(choices=RATING, default=None)
    active = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Reviews & Rating"
        ordering = ["-date"]
        
    def __str__(self):
        if self.product:
            return self.product.title
        else:
            return "Review"
        
    def get_rating(self):
        return self.rating