# your_app/middleware/cart_middleware.py
from django.utils.deprecation import MiddlewareMixin
from Carts.models import Cart

class EnsureCartMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=request.user)
            request.cart = cart
