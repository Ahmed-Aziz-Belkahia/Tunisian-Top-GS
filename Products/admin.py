from django.contrib import admin
from .models import Color, Product, SubImage, Size, Deal, Review

class SubImageInline(admin.TabularInline):
    model = SubImage
    extra = 1

class DealInline(admin.StackedInline):
    model = Deal
    max_num = 1

class ProductAdmin(admin.ModelAdmin):
    inlines = [
        SubImageInline,
        DealInline,
    ]
    filter_horizontal = ('colors', 'sizes',)  # Pour afficher les champs ManyToMany horizontalement

    fieldsets = (
        (None, {
            'fields': ('category', 'title', 'offer', 'description', 'image', 'oldPrice', 'price', 'is_available', 'quantity')
        }),
        ('Colors and Sizes', {
            'fields': ('colors', 'sizes'),
        }),
        ('Related Products', {
            'fields': ('relatedProducts',),
        }),
    )

admin.site.register(Product, ProductAdmin)
admin.site.register(Size)
admin.site.register(Color)
admin.site.register(Review)
