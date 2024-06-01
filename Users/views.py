import json
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.contrib.auth import authenticate, login, logout
""" from .forms import SignUpForm, LogInForm """
from .models import CustomUser
from django.contrib import messages



from django.contrib.auth.decorators import login_required
from .forms import UserUpdateForm

@login_required
def update_user_info(request):
    if request.method == 'POST' and request.is_ajax():
        form = UserUpdateForm(request.POST, instance=request.user.customuser)
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success'})
        else:
            return JsonResponse({'status': 'error', 'errors': form.errors})
    return JsonResponse({'status': 'invalid request'})
