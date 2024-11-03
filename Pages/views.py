
import json
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import update_session_auth_hash
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.db.models import Sum
from verify_email.email_handler import send_verification_email
from django.utils.timezone import now, localdate
from django.db.models import Max
from django.db.models.functions import TruncDate, TruncMonth
from datetime import datetime, timedelta
import pandas as pd
import json
import sys

from django.core.cache import cache
from django.core.exceptions import ObjectDoesNotExist
from Pages.models import OptIn 
from django.core.serializers.json import DjangoJSONEncoder
from django.utils import timezone
from django.contrib.auth.models import User
from datetime import time, timedelta
from Carts.models import Cart, CartItem, Coupon
from Chat.models import Notification
from Orders.models import Order, OrderItem
from Pages.models import Home , OnBoardingQuestion
from PrivateSessions.forms import PrivateSessionForm
from Products.models import Product, Deal
from django.urls import reverse
from allauth.account.models import EmailAddress  # Import EmailAddress model

import random

import requests
from Users.forms import TransactionForm , UpdateUserForm
from Users.models import Badge, Professor, Transaction
from .forms import ContactForm, LogInForm, customSignupForm
from django.contrib.auth import authenticate, login, logout
from Courses.models import Course, CourseOrder, CourseProgression, Level, LevelProgression, Module, UserCourseProgress, UserLevelCheckpoint, Video , Quiz
from django.contrib import messages
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.contrib.auth.forms import PasswordResetForm, SetPasswordForm
from .models import Dashboard, Question, bookOrder, dailyLesson, UserDailyActivity, OnBoardingOption, OnBoardingQuestionTrack, OnBoardingTrack, Quest, UserQuestProgress , SliderImage, Feedback, Podcast, FeaturedYoutubeVideo, Vocal, generalCheckRow, checkRow, dashboardLog
from django.core.serializers import serialize
from Users.models import CustomUser
from django.shortcuts import render
from django.contrib.auth import logout
from django.shortcuts import redirect
from allauth.socialaccount.models import SocialApp
from allauth.account.views import ConfirmEmailView
from django.core.exceptions import PermissionDenied
from .models import UserDevice
from customTheme.models import WebsitePublicVisits

def get_rounded_intervals(time_spent):
    # Convert the timedelta to total hours
    total_hours = time_spent.total_seconds() / 3600
    
    # Divide the total hours by 4 to get step
    step = total_hours / 4

    # Create a list of intervals starting from 0, rounding to nearest 0.5 or whole number
    def custom_round(x):
        # Extract the decimal part
        decimal_part = x - int(x)
        
        # Apply the specific rounding rules
        if decimal_part <= 0.2:
            return round(x)  # Round down to the nearest whole number
        elif 0.3 <= decimal_part <= 0.7:
            return int(x) + 0.5  # Round to the nearest 0.5
        else:
            return round(x)  # Round up to the nearest whole number

    # Generate rounded intervals
    intervals = [custom_round(step * i) for i in range(1, 5)]
    
    # Return the intervals and the maximum interval
    return intervals[::-1], max(intervals) if intervals else 1  # Avoid division by zero

def get_total_hours(time_spent):
    # Convert the timedelta to total seconds, then to hours as a float
    total_hours = time_spent.total_seconds() / 3600
    return total_hours

def check_device_limit(user):
    if user.is_authenticated:
        device_count = UserDevice.objects.filter(user=user).count()
        if device_count > 2:
            raise PermissionDenied("User is logged in on more than two devices.")

def get_random_daily_lesson():
    # Get all objects from the DailyLesson model
    all_lessons = dailyLesson.objects.all()
    
    if all_lessons.exists():
        # Randomly select one object
        random_lesson = random.choice(all_lessons)
        return random_lesson
    else:
        # Handle the case where no objects exist
        return None

def homeView(request, *args, **kwargs):


    if request.user.is_authenticated:
        display_onboarding = True if request.user.first_timer else False
        request.user.first_timer = False
        request.user.save()
    else :
        display_onboarding = False
    
    check_device_limit(request.user)
    user = request.user
    if user.is_authenticated:
        userOnBoardingTrack, created = OnBoardingTrack.objects.get_or_create(user=request.user)
        courses = user.enrolled_courses.all()
        if created:
            return redirect('onboarding')
    else:
        courses = Course.objects.all()
    home_obj = Home.objects.all().first()
    featured_course = home_obj.featured_course if home_obj else None
    podcasts = Podcast.objects.all()
    next_points_goal = user.get_next_rank().points if user.is_authenticated and user.get_next_rank() else None
    quests = Quest.objects.all()
    quests_and_progress = []
    featured_video = FeaturedYoutubeVideo.objects.first()
    daily_lesson =  get_random_daily_lesson

    lessons = Vocal.objects.all()

    hourslist = None
    activity_data = None
    if request.user.is_authenticated:
        last_7_days = [(now().date() - timedelta(days=i)) for i in range(7)][::-1]
        activity_data = []
        max_interval = 0
        
        # Determine the maximum interval across all days
        for day in last_7_days:
            activity = UserDailyActivity.objects.filter(user=user, date=day).first()
            if activity:
                time_spent = activity.total_time_spent
                hourslist, day_max_interval = get_rounded_intervals(time_spent)
                max_interval = max(max_interval, day_max_interval)
                total_hours = time_spent.total_seconds() / 3600
                percentage = (total_hours / max_interval) * 100 if max_interval else 0

                activity_data.append({
                    'day': day.strftime("%a"),
                    'percentage': round(percentage, 1),  # Round percentage to one decimal place
                })
            else:
                activity_data.append({
                    'day': day.strftime("%a"),
                    'percentage': 0,
                })

    top_users = CustomUser.objects.all()
    top_users = sorted(top_users, key=lambda user: user.calculate_balance(), reverse=True)[:5]

    professors = Professor.objects.all()


    if request.user.is_authenticated:
        notifications = Notification.objects.filter(user=user).order_by('-timestamp')
    else:
        notifications = None

    for quest in quests:
        uqp, created = UserQuestProgress.objects.get_or_create(user=user, quest=quest)
        quests_and_progress.append((quest, uqp))

    is_enrolled = featured_course in courses if featured_course else False
    # Retrieve the specific course with id=3
    course_to_check = Course.objects.get(id=3)

    # Check if the retrieved course is in the list of courses
    in_trading = course_to_check in courses
    crypto_course = course_to_check
    if user.is_authenticated:
        other_courses = Course.objects.exclude(id__in=courses.values_list('id', flat=True))
    else:
        other_courses = []

    # print("Featured Course:", featured_course)
    # print("Enrolled Courses:", courses)
    # print("Other Courses:", other_courses)


    if request.user.is_authenticated:
        for r in generalCheckRow.objects.all():
            user_r = checkRow.objects.get_or_create(user=request.user, title=r.title)
        checkListRows = checkRow.objects.filter(user=request.user)
    else: checkListRows= []

    context = {
        "courses": courses,
        "next_points_goal": next_points_goal,
        "feedback_options": Feedback.FEEDBACKS,
        "featured_video": featured_video,
        "featured_course": featured_course,
        "podcasts": podcasts,
        "quests_and_progress": quests_and_progress,
        "is_enrolled": is_enrolled,
        "other_courses": other_courses,
        'notifications': notifications,
        'checkListRows': checkListRows,
        'hourslist': hourslist,
        'activity_data': activity_data,
        'in_trading': in_trading,
        'daily_lesson': daily_lesson,
        'crypto_course': crypto_course,
        'lessons': lessons,
        'display_onboarding': display_onboarding,
        'top_users': top_users,
        'professors': professors,
        
    }
    return render(request, 'new-home.html', context)

@csrf_exempt
@login_required
def settingsResetPasswordView(request):
    check_device_limit(request.user)
    if request.method == 'POST':
        data = json.loads(request.body)
        form = PasswordChangeForm(user=request.user, data=data)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)  # Important for keeping the user logged in
            return JsonResponse({'success': True})
        else:
            errors = form.errors.as_json()
            return JsonResponse({'success': False, 'errors': errors})
    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=400)

@login_required
def settingsResetPasswordPage(request):
    check_device_limit(request.user)
    if request.user.is_authenticated:
        notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')
    else: notifications = None
    return render(request, 'settingsResetPassword.html', {"notifications": notifications})

@csrf_exempt
@login_required
def update_user_info(request):
    check_device_limit(request.user)
    if request.method == 'POST':
        user = request.user
        customuser = user

        if request.FILES:
            if 'pfp' in request.FILES:
                user.pfp = request.FILES['pfp']
                user.save()
                return JsonResponse({'status': 'success'})
        else:
            data = json.loads(request.body)

            if 'username' in data:
                user.username = data['username']
            if 'email' in data:
                customuser.email = data['email']
            if 'tel' in data:
                customuser.tel = data['tel']
            if 'bio' in data:
                customuser.bio = data['bio']
            if 'first_name' in data:
                user.first_name = data['first_name']
                customuser.first_name = data['first_name']
            if 'last_name' in data:
                user.last_name = data['last_name']
                customuser.last_name = data['last_name']

            try:
                user.save()
                customuser.save()
                return JsonResponse({'status': 'success'})
            except Exception as e:
                return JsonResponse({'status': 'error', 'message': str(e)})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'})


def userProfileView(request, *args, **kwargs):  
    user = CustomUser.objects.get(username=kwargs.get('username'))
    if request.user.is_authenticated:
        notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')
    else: notifications = None
    return render(request, 'user_profile.html', {"user": user, "notifications": notifications})

def registerView(request, *args, **kwargs):
    if request.user.is_authenticated:
        return redirect("home")
    
    SignupForm = customSignupForm()

    return render(request, 'register.html', {
        "SignupForm": SignupForm,
    })

from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.http import JsonResponse
from django.shortcuts import redirect

def registerf(request, *args, **kwargs):
    if request.method == 'POST':
        form = customSignupForm(request.POST)
        if form.is_valid():
            user = form.save(request)
            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']  # Use 'password1' for authentication

            # Authenticate the user
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, "Registered and logged in successfully.")
                # Optionally send verification email
                if user.email and not EmailAddress.objects.filter(user=user, verified=True).exists():
                    email_address = EmailAddress.objects.add_email(request, user, user.email, confirm=False)
                    email_address.send_confirmation(request)
                return JsonResponse({'success': True})
            else:
                return JsonResponse({'success': False, 'errors': 'Authentication failed.'})
        else:
            errors = form.errors.as_json()
            return JsonResponse({'success': False, 'errors': errors})
    else:
        form = customSignupForm()

    return render(request, 'registration/register.html', {'SignupForm': form})

@csrf_exempt
def request_new_verification_link(request):
    if request.method == 'POST' and request.user.is_authenticated:
        user = request.user

        # Check if user has an unverified email address
        if user.email and not EmailAddress.objects.filter(user=user, verified=True).exists():
            email_address = EmailAddress.objects.add_email(request, user, user.email, confirm=False)
            email_address.send_confirmation(request)
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'message': 'No new link sent. Email is already verified.'})

    return JsonResponse({'success': False, 'message': 'Invalid request.'})

@csrf_exempt
class CustomConfirmEmailView(ConfirmEmailView):
    def get(self, *args, **kwargs):
        response = super().get(*args, **kwargs)
        if self.object and self.object.email_address.verified:
            return redirect('/home')  # Redirect to /home upon successful confirmation
        else:
            return response  # Allow default behavior for other cases

def loginView(request, *args, **kwargs):
    if request.user.is_authenticated:
        return redirect("home")

    LoginForm = LogInForm()
    return render(request, 'login.html', {"LoginForm": LoginForm})

def loginf(request, *args, **kwargs):
    if request.method == 'POST':
        form = LogInForm(data=request.POST)
        if form.is_valid():
            emailoruser = form.cleaned_data['username']
            password = form.cleaned_data['password']

            # Attempt to authenticate by email first
            try:
                Cuser = CustomUser.objects.get(email=emailoruser)
                user = authenticate(request, username=Cuser.username, password=password)
            except CustomUser.DoesNotExist:
                user = authenticate(request, username=emailoruser, password=password)

            if user:
                messages.success(request, 'Logged in successfully')
                login(request, user)
                return  JsonResponse({'success': True, 'error': "User logged in"})
            else:
                return JsonResponse({'success': False, 'error': "User not found"})
        else:
            errors = form.errors.as_json()
            return JsonResponse({'success': False, 'error': errors})
    else:
        form = LogInForm()
    return render(request, 'login.html', {'form': form})

def logoutf(request):
    logout(request)
    # Redirect to a specific page after logout
    return redirect('')

def pageNotFoundView(request, *args, **kwargs):
    if request.user.is_authenticated:
        notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')
    else: notifications = None
    return render(request, '404.html', {"notifications": notifications})

@login_required
def onboarding_view(request):
    check_device_limit(request.user)
    questions = OnBoardingQuestion.objects.prefetch_related('options').order_by('index').all()
    notifications = None
    
    if request.method == 'POST':
        answers = request.POST.getlist('answers[]')
        userOnBoardingTrack, created = OnBoardingTrack.objects.get_or_create(user=request.user)
        
        for index, question in enumerate(questions):
            answer = answers[index]
            if question.question_type == 'input':
                # Handle input question type
                questionTrack, created = OnBoardingQuestionTrack.objects.get_or_create(
                    question=question, 
                    track=userOnBoardingTrack, 
                    defaults={'input_answer': answer}
                )
            else:
                # Handle other question types (e.g., options)
                questionTrack, created = OnBoardingQuestionTrack.objects.get_or_create(
                    question=question, 
                    track=userOnBoardingTrack, 
                    defaults={'answer': OnBoardingOption.objects.get(id=answer)}
                )

        return JsonResponse({"success": True})

    if request.user.is_authenticated:
        notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')

    return render(request, 'onboarding.html', {
        'questions': questions,
        'notifications': notifications
    })

def forgetPasswordView(request, *args, **kwargs):
    if request.user.is_authenticated:
        notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')
    else: notifications = None
    return render(request, 'forgetPassword.html', {"notifications": notifications})

def resetDoneView(request, *args, **kwargs):
    if request.user.is_authenticated:
        notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')
    else: notifications = None
    return render(request, 'resetDone.html', {"notifications": notifications})

def newPasswordView(request, *args, **kwargs):
    if request.user.is_authenticated:
        notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')
    else: notifications = None
    return render(request, 'newPassword.html', {"notifications": notifications})

@login_required
def verificationView(request, *args, **kwargs):
    check_device_limit(request.user)
    if request.user.is_authenticated:
        notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')
    else: notifications = None
    email_addresses = EmailAddress.objects.filter(user=request.user)
    for email_address in email_addresses:
        if email_address.verified:
            return redirect("home")
    return render(request, 'verification.html', {"notifications": notifications})

import logging

logger = logging.getLogger(__name__)

def contact_us_view(request, *args, **kwargs):
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            return JsonResponse({"success": True, "message": "Thanks for contacting us"})
        else:
            logger.error("Form errors: %s", form.errors)
            return JsonResponse({"success": False, "errors": form.errors})
    else:
        form = ContactForm()

    notifications = Notification.objects.filter(user=request.user).order_by('-timestamp') if request.user.is_authenticated else None

    return render(request, 'contact-us.html', {
        "form": form,
        "notifications": notifications
    })


def dashboardView(request, *args, **kwargs):
    if request.user.is_authenticated:
        notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')
    else: notifications = None
    try:
        dashboard = Dashboard.objects.get(id=1)
    except ObjectDoesNotExist:
        error_message = "Dashboard data not found. Please contact the support team."
        messages.error(request, error_message)
        return render(request, '404.html', {
            "error_message": error_message,
            "page": "Dashboard"
        })

    transactionForm = TransactionForm()
    transactions = Transaction.objects.all().order_by('-date')[:4]  # Assuming 'date' is the field you want to order by
    reversed_transactions = reversed(transactions)

    top_users = CustomUser.objects.all()
    top_users = sorted(top_users, key=lambda user: user.calculate_balance(), reverse=True)[:5]

    top_user = sorted(top_users, key=lambda user: user.calculate_balance(), reverse=True)[:1][0]









    return render(request, 'dashboard.html', {
        "dashboard": dashboard, 
        "transactions": reversed_transactions, 
        "top_users": top_users,
        "top_user": top_user,
        "transactionForm": transactionForm,
        "notifications": notifications
    })





def getCryptoDetails(request, *args, **kwargs):


    import requests

    # Your CoinMarketCap API Key
    API_KEY = '17d4cb62-2cd2-42c3-9cda-01b143ba1965'

    # CoinMarketCap API URL for specific cryptocurrency quotes
    url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest'

    # Parameters for fetching BTC, ETH, and SOL
    parameters = {
        'symbol': 'BTC,ETH,SOL',  # Request only these specific cryptocurrencies
        'convert': 'USD'
    }

    # Headers to authenticate the request
    headers = {
        'Accepts': 'application/json',
        'X-CMC_PRO_API_KEY': API_KEY
    }

    # Make the API request
    response = requests.get(url, headers=headers, params=parameters)

    # Convert the response to JSON
    data = response.json()

    # Extracting price and daily change for BTC, ETH, and SOL
    btc_price = data['data']['BTC']['quote']['USD']['price']
    btc_daily_change = data['data']['BTC']['quote']['USD']['percent_change_24h']

    eth_price = data['data']['ETH']['quote']['USD']['price']
    eth_daily_change = data['data']['ETH']['quote']['USD']['percent_change_24h']

    sol_price = data['data']['SOL']['quote']['USD']['price']
    sol_daily_change = data['data']['SOL']['quote']['USD']['percent_change_24h']

    # Print out the results
    print(f"BTC Price: ${btc_price:.2f}, Daily Change: {btc_daily_change:.2f}%")
    print(f"ETH Price: ${eth_price:.2f}, Daily Change: {eth_daily_change:.2f}%")
    print(f"SOL Price: ${sol_price:.2f}, Daily Change: {sol_daily_change:.2f}%")


    context = {
        'btc': [btc_price, btc_daily_change],
        'eth': [eth_price, eth_daily_change],
        'sol': [sol_price, sol_daily_change],
    }
    return JsonResponse({"success": True, "crypto_details": context})

def getDashboard(request, *args, **kwargs):
    if request.method == "GET":
        dashboard = Dashboard.objects.get(id=1)
        dashboard_data = {
            'objectif': dashboard.objectif,
            'profits': dashboard.calculate_today_profits(),
            'losses': dashboard.calculate_today_losses(),
            'balance': dashboard.calculate_total_balance(),
            'profits_percentage': dashboard.calculate_daily_profits_change_percentage(),
            'losses_percentage': dashboard.calculate_daily_losses_change_percentage(),
        }

        # Return the dictionary as JSON response
        return JsonResponse({"success": True, "dashboard": dashboard_data})
    else:
        return JsonResponse({"success": False, "error": "Bad request"})

def getTransactions(request, *args, **kwargs):
    if request.method == "GET":
        transactions = Transaction.objects.filter(status=True).order_by('-date')[:5]
    
        # Prepare transaction data
        transactions_data = []
        for transaction in reversed(transactions):
            badges_list = []

            # Iterate through user's badges and create dictionaries
            for badge in transaction.user.badges.all():
                badge_dict = {
                    'title': badge.title,
                    'icon': badge.icon.url  # Assuming badge.icon is a FileField
                }
                badges_list.append(badge_dict)

            transaction_data = {
                'user': transaction.user.username,  # Assuming user has a related User model
                'pfp': transaction.user.pfp.url,
                'badges': badges_list,
                'type': transaction.type,
                'pair': transaction.pair,
                'amount': transaction.amount,
                'date': transaction.date.strftime('%Y-%m-%d %H:%M:%S'),  # Format the date as string
                # Add other fields as needed
            }
            transactions_data.append(transaction_data)

        # Return the transactions data as JSON response
        return JsonResponse({"success": True, "transactions": transactions_data})
    else:
        return JsonResponse({"success": False, "error": "Bad request"})

@login_required
def getRanking(request, *args, **kwargs):
    check_device_limit(request.user)
    if request.method == "GET":
        # Query all users and order them by calculated balance in descending order
        top_users = CustomUser.objects.all()
        top_users = sorted(top_users, key=lambda user: user.calculate_balance(), reverse=True)[:5]

        # Serialize user data into JSON serializable format
        serialized_users = []
        rankIco = 1
        for user in top_users:
            serialized_user = {
                'username': user.username,
                'pfp': user.pfp.url,
                'balance': user.calculate_balance(),
                'rankIco': rankIco,
                # Add other fields if necessary
            }
            rankIco += 1
            serialized_users.append(serialized_user)


        # Pass the serialized top 5 users to the JsonResponse
        return JsonResponse({"success": True, "top_users": serialized_users})
    else:
        return JsonResponse({"success": False, "error": "Bad request"})

@login_required
def getTopUser(request, *args, **kwargs):
    check_device_limit(request.user)
    if request.method == "GET":
        # Query all users and order them by calculated balance in descending order
        top_users = CustomUser.objects.all()
        top_user = sorted(top_users, key=lambda user: user.calculate_balance(), reverse=True)[:1][0]
        badges_list = []

        for badge in top_user.badges.all():
            badge_dict = {
                'title': badge.title,
                'icon': badge.icon.url  # Assuming badge.icon is a FileField
            }
            badges_list.append(badge_dict)

        # Extract the username from the top user
        
        # Serialize the top user
        top_user_serialized = serialize('json', [top_user])
        
        # Pass the serialized top user to the JsonResponse along with the username
        return JsonResponse({"success": True, "top_user": top_user_serialized, "top_user_badgesList": badges_list, 'top_user_pfp': top_user.pfp.url})
    else:
        return JsonResponse({"success": False, "error": "Bad request"})
    

def landingView (request, *args, **kwargs):
    slider_images = SliderImage.objects.all()[:6]
    big_slider_images = SliderImage.objects.all()[6:8]
    rest_slider_images = SliderImage.objects.all()[9:]
    if request.user.is_authenticated:
        notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')
    else: 
        notifications = None
        tempObj = WebsitePublicVisits()
        try:
            tempObj.visit_user_ip = request.META['REMOTE_ADDR']
        except:
            pass
        tempObj.save()

    courses = Course.objects.all()
    return render(request, 'test.html', {"notifications": notifications, 'slider_images': slider_images, "courses": courses, "big_slider_images": big_slider_images, "rest_slider_images": rest_slider_images})

def bookView(request, *args, **kwargs):
    slider_images = SliderImage.objects.all()[:6]
    big_slider_images = SliderImage.objects.all()[6:8]
    rest_slider_images = SliderImage.objects.all()[9:]
    if request.user.is_authenticated:
        notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')
    else: 
        notifications = None
        tempObj = WebsitePublicVisits()
        try:
            tempObj.visit_user_ip = request.META['REMOTE_ADDR']
        except:
            pass
        tempObj.save()

    courses = Course.objects.all()
    return render(request, 'book.html', {"notifications": notifications, 'slider_images': slider_images, "courses": courses, "big_slider_images": big_slider_images, "rest_slider_images": rest_slider_images})

def bookCheckoutView(request, *args, **kwargs):
    if request.method == "POST":
        data=request.POST
        bookOrder.objects.create(email=data.get("email"), state=data.get("state"), name = data.get("name"), phone=data.get("phone"), address=data.get("address"), quantity=data.get("quantity"))
        return JsonResponse({"success": True})
    return render(request, 'book_checkout.html', {})


@login_required
def addPoints(request, *args, **kwargs):
    check_device_limit(request.user)
    if request.method == 'POST':
        user = request.user
        
        # Check if the user has added points in the last 24 hours
        last_added_points_time = user.last_added_points_time
        if last_added_points_time is not None and timezone.now() - last_added_points_time < timedelta(hours=24):
            return JsonResponse({"success": False, "message": "Points can only be added once every 24 hours."})
        
        # Add points to the user
        points_to_add = 10
        user.points += points_to_add
        user.last_added_points_time = timezone.now()
        user.save()

        return JsonResponse({"success": True, "message": f"Points successfully added: {points_to_add}"})
    
    return JsonResponse({"success": False, "message": "Invalid request method."})

@csrf_exempt
def addTransaction(request):
    check_device_limit(request.user)
    if request.method == 'POST':
        form = TransactionForm(request.POST, request.FILES)
        if form.is_valid():
            # Save the transaction
            transaction = form.save(commit=False)
            transaction.user = request.user
            transaction.save()
            return JsonResponse({"success": True})
        else:
            return JsonResponse({"success": False, "errors": form.errors})

def privateSessionView(request, *args, **kwargs):
    check_device_limit(request.user)
    if request.user.is_authenticated:
        notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')
    else: notifications = None
    if request.method == 'POST':
        return privateSessionSubmitView(request)
    else:
        form = PrivateSessionForm()
        return render(request, 'privateSession.html', {'form': form, "notifications": notifications})

def privateSessionSubmitView(request):
    check_device_limit(request.user)
    form = PrivateSessionForm(request.POST)
    if form.is_valid():
        form.save()
        # Redirect to a success page or do something else
        return JsonResponse({"success": True, "message": "form submitted successfully"})
    else:
        return JsonResponse({"success": False, "errors": form.errors})

@login_required
def privateSessionScheduleDoneView(request, *args, **kwargs):
    check_device_limit(request.user)
    if request.user.is_authenticated:
        notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')
    else: notifications = None

    return render(request, 'privateSessionScheduleDone.html', {"notifications": notifications})

@login_required
def settingsView(request, *args, **kwargs):
    check_device_limit(request.user)
    if request.user.is_authenticated:
        notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')
    else: notifications = None
    return render(request, 'settings.html', {"notifications": notifications})

@login_required
def personalInfoView(request, *args, **kwargs):
    check_device_limit(request.user)
    if request.user.is_authenticated:
        notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')
    else: notifications = None
    email_addresses = EmailAddress.objects.filter(user=request.user)

    verified = False
    for email_address in email_addresses:
        if email_address.verified:
            verified = True
            break
    return render(request, 'personalInfo.html', {'date' : request.user.date_joined, "notifications" : notifications, "verified": verified})

@login_required
def notificationView(request, *args, **kwargs):
    check_device_limit(request.user)
    notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')
    user = request.user

    if request.method == 'POST':
        outputs = json.loads(request.POST.get('outputs', '{}'))
        # Update user's notification settings
        user.p_general_n = outputs.get('p_general_n', False)
        user.p_chat_n = outputs.get('p_chat_n', False)
        user.p_courses_n = outputs.get('p_courses_n', False)
        user.email_general_n = outputs.get('email_general_n', False)
        user.email_chat_n = outputs.get('email_chat_n', False)
        user.email_courses_n = outputs.get('email_courses_n', False)
        user.save()
        return JsonResponse({'status': 'success'})

    context = {
        "notifications": notifications,
        "user_settings": {
            "p_general_n": user.p_general_n,
            "p_chat_n": user.p_chat_n,
            "p_courses_n": user.p_courses_n,
            "email_general_n": user.email_general_n,
            "email_chat_n": user.email_chat_n,
            "email_courses_n": user.email_courses_n,
        }
    }
    return render(request, 'settingsNotification.html', context)
    
    return render(request, 'settingsNotification.html', {"notifications": notifications})
def serverChatView(request, room_name, *args, **kwargs):
    if request.user.is_authenticated:
        notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')
    else: notifications = None
    customuser_id = request.user.id
    room = get_object_or_404(Room, name=room_name)
    messages = Message.objects.filter(room=room).order_by('timestamp').values('user__user__username', 'content', 'user__pfp', 'timestamp')
    messages_list = list(messages)
    
    # Convert QuerySet to list of dictionaries
    messages_list = [dict(message) for message in messages_list]

    # Serialize the messages list to JSON
    messages_json = json.dumps(messages_list, cls=DjangoJSONEncoder)
    
    online_user_ids = get_online_users()
    online_users = CustomUser.objects.filter(id__in=online_user_ids)
    
    # Get offline users
    all_users = CustomUser.objects.all()
    offline_users = all_users.exclude(user_id__in=online_user_ids)
    
    all_badges = Badge.objects.filter(customusers__in=online_users).order_by('-index')
    sections = Section.objects.all().order_by('-index')

    return render(request, 'serverChat.html', {"room_name": room_name, "customuser_id": customuser_id, "messages_json": messages_json, "online_members": online_users, "offline_members": offline_users, "all_badges": all_badges, "sections": sections, "notifications": notifications})

@login_required
def search_members(request):
    check_device_limit(request.user)
    if request.method == 'POST':
        query = request.POST.get('q')
        
        # Perform the search for members
        matched_users = CustomUser.objects.filter(user__username__icontains=query)
        
        # Get online user IDs
        online_user_ids = get_online_users()
        
        # Separate online and offline users
        online_users = matched_users.filter(user_id__in=online_user_ids)
        offline_users = matched_users.exclude(user_id__in=online_user_ids)
        
        # Serialize the online and offline users to JSON
        online_users_list = [{'id': user.id, 'username': user.username, 'pfp': user.pfp.url} for user in online_users]
        offline_users_list = [{'id': user.id, 'username': user.username, 'pfp': user.pfp.url} for user in offline_users]
        
        return JsonResponse({"success": True, 'online_members': online_users_list, 'offline_members': offline_users_list}) 

@login_required
def privateChatView(request, *args, **kwargs):
    check_device_limit(request.user)
    if request.user.is_authenticated:
        notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')
    else: notifications = None
    return render(request, 'privateChat.html', {"notifications": notifications})  

@login_required
def logout_view(request):
    check_device_limit(request.user)
    logout(request)
    next_page = request.GET.get('next', '/')  # Redirige vers  par défaut
    return redirect(next_page)

@login_required
def profileView(request, *args, **kwargs):
    check_device_limit(request.user)
    if request.user.is_authenticated:
        notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')
    else: notifications = None
    user = request.user
    email_addresses = EmailAddress.objects.filter(user=user)
    verified = False
    for email_address in email_addresses:
        if email_address.verified:
            verified = True
            break

    quests = Quest.objects.all()[:2]
    course_orders = CourseOrder.objects.filter(user=request.user, status=True).order_by('order_date')
    orders = Order.objects.filter(user=request.user, status="completed").order_by('created_at')
    return render(request, 'profile.html', {"notifications": notifications, "quests": quests, "course_orders": course_orders, "orders": orders, "verified": verified})

@login_required
def submitFeedbackView(request, *args, **kwargs):
    check_device_limit(request.user)
    if request.method == 'POST':
        feedback_value = int(request.POST.get('feedback', -1))  # Get feedback value as an integer

        if feedback_value != -1:  # Check if feedback is provided
            # Check if the user has already submitted feedback
            existing_feedback = Feedback.objects.filter(user=request.user).exists()
            if not existing_feedback:
                # If user hasn't submitted feedback, create a new Feedback instance
                Feedback.objects.create(feedback_choice=feedback_value, user=request.user)

                # Update user's points and last_added_points_time
                user = request.user
                user.points += 20
                user.save()

                return JsonResponse({'success': True, 'message': "Feedback submitted and points added"})
            else:
                return JsonResponse({'success': False, 'message': "You have already submitted feedback"})
        else:
            return JsonResponse({'success': False, 'message': "Feedback value not provided"})
    else:
        return JsonResponse({'success': False, 'message': "Invalid request method"})

@login_required
def start_quest(request, quest_id):
    check_device_limit(request.user)
    quest = get_object_or_404(Quest, pk=quest_id)
    user = request.user

    # Create or get UserQuestProgress instance for the user and quest
    user_quest_progress, created = UserQuestProgress.objects.get_or_create(user=user, quest=quest)

    # If it's a new instance, start from the first step
    if created:
        user_quest_progress.current_step = quest.steps.first()
        user_quest_progress.save()

    # Return JSON response indicating success
    return JsonResponse({'success': True})

@login_required
def quest_detail(request, quest_id):
    check_device_limit(request.user)
    quest = get_object_or_404(Quest, pk=quest_id)
    
    # Serialize the quest object into JSON format
    quest_json = serialize('json', [quest])

    # Return JSON response with quest details
    return JsonResponse({'quest': quest_json})


# =================================================================================================
# Notification views
# =================================================================================================

@login_required
def get_notifications(request):
    check_device_limit(request.user)
    if request.user.is_authenticated:
        return Notification.objects.filter(user=request.user).order_by('-timestamp')
    return None

#================================================================================================
# Course Academy views
#================================================================================================

@login_required
def videoCourseView(request, url_title, video_url_title=None):
    check_device_limit(request.user)

    notifications = get_notifications(request)
    level = get_object_or_404(Level, url_title=url_title)
    course = get_object_or_404(Course, id=level.course.id)
    if course not in request.user.enrolled_courses.all():
        return redirect('course_detail', course_url_title = course.url_title)
    
    user_progress, created = UserCourseProgress.objects.get_or_create(user=request.user, course=course)

    first_module = level.modules.first()
    # Fetch the user's checkpointed video for the current level
    user_checkpoint = UserLevelCheckpoint.objects.filter(user=request.user, level=level).first()
    if user_checkpoint:
        first_video = user_checkpoint.checkpointed_video
    else:
        first_video = None

    if video_url_title:
        first_video = get_object_or_404(Video, url_title=video_url_title)
        if not first_video:
            return redirect('404')
    return render(request, 'video-course.html', {
        "modules": level.modules.all(),
        "level": level,
        "video": first_video,
        "notifications": notifications,
        "video_quiz": first_video.quizzes.all() if first_video else []
    })

@login_required
def notesCourseView(request, level_id):
    check_device_limit(request.user)
    notifications = get_notifications(request)
    level = get_object_or_404(Level, id=level_id)
    return render(request, 'notes-course.html', {"modules": level.module_set.all(), "notifications": notifications})

@login_required
def imgQuizzCourseView(request, level_id):
    check_device_limit(request.user)
    notifications = get_notifications(request)
    level = get_object_or_404(Level, id=level_id)
    return render(request, 'imgQuizz-course.html', {"modules": level.module_set.all(), "notifications": notifications})

@login_required
def textQuizzCourseView(request, level_id):
    check_device_limit(request.user)
    notifications = get_notifications(request)
    level = get_object_or_404(Level, id=level_id)
    return render(request, 'textQuizz-course.html', {"modules": level.module_set.all(), "notifications": notifications})

@login_required
def lessonCompletedView(request, level_id):
    check_device_limit(request.user)
    notifications = get_notifications(request)
    level = get_object_or_404(Level, id=level_id)
    return render(request, 'lessonComplete.html', {"modules": level.module_set.all(), "notifications": notifications})

@login_required
def getVideoView(request):
    check_device_limit(request.user)
    if request.method == 'POST':
        videoId = request.POST.get("videoId")
        try:
            video = get_object_or_404(Video, id=videoId)
            course = video.module.level.course
            user_progress = UserCourseProgress.objects.get(user=request.user, course=course)

            if video.is_unlocked(request.user):
                quizes = [{
                    "id": quiz.id,
                    "question": quiz.question,
                    "image": quiz.image.url if quiz.image else None,
                    "correct_option_id": quiz.answer.id if quiz.answer else None,
                    "options": [{
                        "id": option.id,
                        "text": option.text,
                        "img": option.image.url if option.image else None
                    } for option in quiz.options.all()]
                } for quiz in video.quizzes.all()]

                serialized_video = {
                    "id": video.id,
                    "title": video.title,
                    "url_title": video.url_title,
                    "level_url_title": video.module.level.url_title,
                    "vimeo_url": video.vimeo_url if video.vimeo_url else None,
                    "video_file": video.video_file.url if video.video_file else None,
                    "video_image": video.image.url if video.image else None,
                    "notes": video.notes,
                    "summary": video.summary,
                    "module": video.module.id,
                    'finished': video in user_progress.completed_videos.all(),
                    'quizes': quizes
                }
                return JsonResponse({'success': True, "video": serialized_video})
            else:
                return JsonResponse({'success': False, 'message': "You haven't unlocked this video.", "video_unlocked": False})

        except Video.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Video not found'})
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method'})


@login_required
def getNextVideo(request):
    check_device_limit(request.user)
    if request.method == 'POST':
        video_id = request.POST.get('video_id')
        current_video = get_object_or_404(Video, id=video_id)
        next_video = current_video.get_next_video()

        if not next_video:
            next_module = current_video.module.get_next_module()
            if next_module:
                next_video = next_module.videos.order_by('index').first()

        next_step = {'video_id': next_video.id, 'title': next_video.title} if next_video else None

        return JsonResponse({'success': True, 'next_video': next_step})
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=405)

@login_required
def videoFinishedView(request):
    check_device_limit(request.user)
    if request.method == 'POST':
        videoId = request.POST.get("videoId")
        video = get_object_or_404(Video, id=videoId)
        course = video.module.level.course
        user_progress, created = UserCourseProgress.objects.get_or_create(user=request.user, course=course)
        
        is_already_finished = user_progress.completed_videos.filter(id=video.id).exists()
        user_progress.completed_videos.add(video)
        request.user.points += 20
        #user_progress.video_checkpoint = video
        checkpoint, created = UserLevelCheckpoint.objects.update_or_create(
            user=request.user,
            level=video.module.level,
            defaults={'checkpointed_video': video}
        )
        user_progress.save()
        video.module.update_completion_status(request.user)


        next_video = video.get_next_video()
        next_step = None
        next_module_open = None
        video_in_next_module = None
        level_finished = None
        finished_open_modules = None
        course_id = course.id  # Assuming you want to send the course ID in the response

        if not next_video:
            unfinished_videos = video.module.videos.exclude(id__in=user_progress.completed_videos.all()).order_by('index')
            next_video = unfinished_videos.first()

        if not next_video:
            next_module = video.module.get_next_module()
            while next_module:
                if next_module.is_unlocked(request.user):
                    break
                next_module = next_module.get_next_module()

            if next_module and next_module.is_unlocked(request.user):
                unfinished_videos_next_module = next_module.videos.exclude(id__in=user_progress.completed_videos.all()).order_by('index')
                next_video = unfinished_videos_next_module.first()
                if not next_video:
                    next_video = next_module.videos.order_by('index').first()
                    video_in_next_module = next_video is not None
                next_module_open = True
            elif next_module:
                next_module_open = False
                level_finished = False
                return JsonResponse({
                    'success': True,
                    'message': "Next module is locked",
                    "next_module_open": next_module_open,
                    "video_in_next_module": video_in_next_module,
                    "level_finished": level_finished,
                    "next_step": next_step,
                    "finished_open_modules": finished_open_modules,
                    "course_id": course_id,
                    "url_title": course.url_title,
                    "is_already_finished": is_already_finished,
                })
            else:
                if video.module.level in user_progress.completed_levels.all():
                    level_finished = True
                    return JsonResponse({
                        'success': True,
                        'message': "Level is finished",
                        "next_module_open": next_module_open,
                        "video_in_next_module": video_in_next_module,
                        "level_finished": level_finished,
                        "next_step": next_step,
                        "finished_open_modules": finished_open_modules,
                        "course_id": course_id,
                        "url_title": course.url_title,
                        "is_already_finished": is_already_finished,
                    })
                else:
                    level_finished = False
                    finished_open_modules = True
                    return JsonResponse({
                        'success': True,
                        'message': "Level is finished but there are no open modules",
                        "next_module_open": next_module_open,
                        "video_in_next_module": video_in_next_module,
                        "level_finished": level_finished,
                        "next_step": next_step,
                        "finished_open_modules": finished_open_modules,
                        "course_id": course_id,
                        "url_title": course.url_title,
                        "is_already_finished": is_already_finished,
                    })

        if next_video:
            if next_video.is_unlocked(request.user):
                next_step = {'video_id': next_video.id, 'title': next_video.title, "module_id": next_video.module.id}
            else:
                return JsonResponse({
                    'success': True,
                    'message': "Video is locked",
                    "video_open": False,
                    "next_module_open": next_module_open,
                    "video_in_next_module": video_in_next_module,
                    "level_finished": level_finished,
                    "next_step": next_step,
                    "finished_open_modules": finished_open_modules,
                    "course_id": course_id,
                    "module_id": next_video.module.id,
                    "is_already_finished": is_already_finished
                })

        return JsonResponse({
            'success': True,
            'next_step': next_step,
            "video_in_next_module": video_in_next_module,
            "next_module_open": next_module_open,
            "level_finished": level_finished,
            "finished_open_modules": finished_open_modules,
            "course_id": course_id,
            "is_already_finished": is_already_finished
        })
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=405)

@login_required
def add_liked_video(request):
    check_device_limit(request.user)









    user = request.user
    video = get_object_or_404(Video, id=request.POST.get("video_id"))

    user.liked_videos.add(video)

    return JsonResponse({'success': True})

@login_required
def remove_liked_video(request):
    check_device_limit(request.user)
    user = request.user
    video = get_object_or_404(Video, id=request.POST.get("video_id"))

    user.liked_videos.remove(video)

    return JsonResponse({'success': True})

@login_required
def is_video_liked(request):
    check_device_limit(request.user)
    user = request.user
    video_id = request.POST.get("video_id")

    if user.liked_videos:
        is_liked = user.liked_videos.filter(id=video_id).exists()
    else:
        is_liked = None
    return JsonResponse({'is_liked': is_liked})

@login_required
def user_quest_progression(request, quest_id):
    check_device_limit(request.user)
    quest = get_object_or_404(Quest, pk=quest_id)
    user = request.user
    user_quest_progress = get_object_or_404(UserQuestProgress, user=user, quest=quest)

    user_quest_progress_json = serialize('json', [user_quest_progress])

    return JsonResponse({'user_quest_progress': user_quest_progress_json})

@login_required
def complete_step(request, quest_id):
    check_device_limit(request.user)
    quest = get_object_or_404(Quest, pk=quest_id)
    user = request.user
    user_quest_progress = get_object_or_404(UserQuestProgress, user=user, quest=quest)

    user_quest_progress.complete_step()

    return JsonResponse({'success': True})

@login_required
def level_progress(request):
    check_device_limit(request.user)
    user = request.user
    level_id = request.POST.get('level_id')
    level = Level.objects.get(id=level_id)

    return JsonResponse({"success": True, "level_progression": level.calculate_progress_percentage(user=user)})

@login_required
def course_progress(request):
    check_device_limit(request.user)
    if request.method == 'POST':
        user = request.user
        course_id = request.POST.get("course_id")
        
        # Ensure course_id is provided and valid
        if not course_id:
            return HttpResponseBadRequest("Course ID is required.")
        
        try:
            course = get_object_or_404(Course, id=course_id)
            course_progression = course.calculate_progress_percentage(user=user)
            return JsonResponse({"success": True, "course_progression": course_progression})
        except Course.DoesNotExist:
            return HttpResponseBadRequest("Course not found.")
        except Exception as e:
            return HttpResponseBadRequest(f"Error: {str(e)}")
    
    return HttpResponseBadRequest("Invalid request method or not an AJAX request.")

def course_detail_view(request, course_url_title):
    course = get_object_or_404(Course, url_title=course_url_title)
    if request.user.is_authenticated:
        if course in request.user.enrolled_courses.all():
            return redirect("levels", course_url_title=course.url_title)
    course_requirements = course.course_requirements.split('\n') if course.course_requirements else []
    course_features = course.course_features.split('\n') if course.course_features else []
    notifications = get_notifications(request)
    context = {
        'course': course,
        'course_requirements': course_requirements,
        'course_features': course_features,
        'total_price': course.get_total_price(),
        'notifications': notifications
    }
    return render(request, 'course_detail.html', context)

def course_checkout(request, course_url_title, *args, **kwargs):
    # Use get_object_or_404 to handle course retrieval more gracefully
    course = get_object_or_404(Course, url_title=course_url_title)

    # Directly enroll the user if the course is free
    if course.discount_price <= 0:
        request.user.enrolled_courses.add(course)
        return redirect('levels', course_url_title=course.url_title)

    if request.method == 'POST':
        # Get data from POST request and set defaults
        first_name = request.POST.get('first_name', '')
        last_name = request.POST.get('last_name', '')
        phone = request.POST.get('phone', '')
        email = request.POST.get('email', '')
        age = request.POST.get('age', 0)  # Use default value for age
        country = request.POST.get('country', '')
        state = request.POST.get('state', '')
        payment_method = request.POST.get('payment_method', '')

        # Handle user details
        user = request.user if request.user.is_authenticated else None
        em = request.user.email if request.user.is_authenticated else email

        # Validate the required fields before creating the order
        if not all([first_name, last_name, phone, em, country, state, payment_method]):
            return JsonResponse({"success": False, "message": "All fields are required."})

        # Create the order
        order = CourseOrder.objects.create(
            course=course,
            user=user,
            first_name=first_name,
            last_name=last_name,
            tel=phone,
            email=em,
            age=age,
            country=country,
            state=state,
            payment_method=payment_method,
        )

        # Serialize the order and return a response
        serialized_order = serialize('json', [order])
        return JsonResponse({"success": True, "order": serialized_order, "message": "Order placed successfully."})


    return render(request, 'course_checkout.html', {"course": course})

def courseOrderComplete(request, *args, **kwargs):
    return render(request, 'courseOrderComplete.html', {})

def courseOrderFailed(request, *args, **kwargs):
    return render(request, 'courseOrderComplete.html', {})

def coursesView(request):
    check_device_limit(request.user)
    user = request.user
    courses = Course.objects.all()
    notifications = get_notifications(request)
    if user.is_authenticated:
        for course in courses:
            course.has_access = user.enrolled_courses.filter(id=course.id).exists()

    context = {
        'courses': courses,
        'notifications': notifications
    }
    return render(request, 'courses.html', context)

@login_required
def levelsView(request, course_url_title):
    check_device_limit(request.user)
    user = request.user
    course = get_object_or_404(Course, url_title=course_url_title)
    notifications = get_notifications(request)
    if not course in user.enrolled_courses.all():
        return redirect('course_detail', course_url_title=course.url_title)

    levels = Level.objects.filter(course=course)
    return render(request, 'levels.html', {"levels": levels, "course": course, 'notifications': notifications})


# ========================
# Shop views
# ========================
def ProductView(request, product_id):
    return rediect("shop")
    product = Product.objects.get(id=product_id)
    if request.user.is_authenticated:
        cart, created = Cart.objects.get_or_create(user=request.user)
        cart_count = cart.cart_items.aggregate(total_quantity=Sum('quantity'))['total_quantity'] if cart.cart_items.exists() else 0
    else:
        cart_count = 0
    product_images = []
    product_images.append(product.image.url)
    for subImg in product.sub_images.all():
        product_images.append(subImg.sub_image.url)
    context = {
        'product': product,
        'product_images':product_images,
        'star_range': range(1, 6),  # This will provide the range 1 to 5
        'cart_count': cart_count,
    }
    return render(request, 'product.html', context)

def checkoutView(request):
    if request.user.is_authenticated:
        notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')
    else: notifications = None
    try:
        user = request.user
        cart = Cart.objects.get(user=user)
        total_price = cart.calculate_total_price()
        final_price = cart.calculate_final_price()
        discount = total_price - final_price
        coupon_discount = cart.coupon.discount if cart.coupon else 0

        context = {
            "cartID": cart.id,
            "cart": cart,
            "total_price": total_price,
            "final_price": final_price,
            "discount": discount,
            "coupon_discount": coupon_discount,
            "notifications": notifications
        }

        return render(request, 'checkout.html', context)
    except Cart.DoesNotExist:
        # Handle case where cart does not exist for the user
        return render(request, 'checkout.html', {"cartID": None, "cart": None, "notifications": notifications})

def shopView(request, *args, **kwargs):
    products = Product.objects.all()
    deals = Deal.objects.all()
    if request.user.is_authenticated:
        notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')
    else: notifications = None
    return render(request, 'shop.html', {"products": products, "deals": deals, "notifications": notifications})

def orderCompleteView(request, *args, **kwargs):
    if request.user.is_authenticated:
        notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')
    else: notifications = None
    oid = request.GET.get('oid')
    payment_ref = request.GET.get('payment_ref')
    if oid and payment_ref:
        order = Order.objects.get(user=request.user, id=oid)
        return render(request, 'orderComplete.html', {"notifications": notifications, "order": order, "payment_ref": payment_ref})
    if oid:
        order = Order.objects.get(user=request.user, id=oid)
        return render(request, 'orderComplete.html', {"notifications": notifications, order: order})
    else:
        return render(request, 'orderComplete.html', {"notifications": notifications, "message": "no order found"})

import logging

logger = logging.getLogger(__name__)

@login_required
def update_cart_quantity(request):
    check_device_limit(request.user)
    if request.method == 'POST':
        try:
            product_id = request.POST.get('product_id')
            product = Product.objects.get(id=product_id)
            color = request.POST.get('color')
            size = request.POST.get('size')
            quantity = int(request.POST.get('quantity'))

            if quantity > product.quantity:
                return JsonResponse({'success': False, 'message': 'You cannot add more than product.quantity items.'})

            product = get_object_or_404(Product, id=product_id)
            user_cart = Cart.objects.get(user=request.user)
            cart_item = CartItem.objects.filter(cart=user_cart, product=product, color=color, size=size).first()

            if cart_item:
                if  quantity > product.quantity:
                    return JsonResponse({'success': False, 'message': 'You cannot add more than 5 items.'})
                cart_item.quantity = quantity
                cart_item.save()
            else:
                CartItem.objects.create(cart=user_cart, product=product, color=color, size=size, quantity=quantity)

            cart_count = user_cart.cart_items.aggregate(total_quantity=Sum('quantity'))['total_quantity'] if user_cart.cart_items.exists() else 0
            total_price = user_cart.calculate_total_price()  # Assuming you have this method to calculate total price
            ultimate_total = user_cart.calculate_final_price()  # Add shipping or any other charges if needed
            discount_amount = total_price - ultimate_total  # Calculating discount amount

            return JsonResponse({'success': True, 'cart_count': cart_count, 'total_price': total_price, 'ultimate_total': ultimate_total, 'discount_amount': discount_amount, 'message': 'Product quantity updated'})
        except Exception as e:
            logger.error(f"Error updating cart quantity: {e}")
            return JsonResponse({'success': False, 'message': 'An error occurred. Please try again.'})
    return JsonResponse({'success': False, 'message': 'Invalid request method'})

@login_required
def paymentView(request, *args, **kwargs):
    check_device_limit(request.user)
    if request.user.is_authenticated:
        notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')
    else: notifications = None
    return render(request, 'payment.html', {"notifications": notifications})

@login_required
def delete_cart_item(request):
    check_device_limit(request.user)
    if request.method == 'POST':
        item_id = request.POST.get('itemId')
        try:
            # Retrieve the cart item
            cart_item = CartItem.objects.get(pk=item_id)
            # Delete the cart item
            cart_item.delete()

            user_cart = None
            try:
                user_cart = Cart.objects.filter(user=CustomUser.objects.get(user=request.user))[0]
            except:
                print ("Cart does not exist")
            if user_cart:
                # Access the items related to the cart using the related name 'cart_items'
                items = user_cart.cart_items.all()
                total_price = user_cart.calculate_total_price()
                ultimate_total = total_price
                total_items = user_cart.cart_items.count()
            else:
                items = []

            return JsonResponse({'success': True, 'message': 'Item deleted successfully', "total_price": total_price, "ultimate_total":ultimate_total, "total_items": total_items})
        except CartItem.DoesNotExist:
            return JsonResponse({'error': 'Cart item not found'})
    else:
        return JsonResponse({'error': 'bad request'})

@login_required
def createOrderView(request):
    check_device_limit(request.user)
    if request.method == 'POST':
        # Retrieve data from request.POST
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        address = request.POST.get('address')
        city = request.POST.get('city')
        state = request.POST.get('state')
        zip_code = request.POST.get('zip_code')
        payment_method = request.POST.get('payment_method')
        
        cart = Cart.objects.get(user=request.user)

        # Create the order
        order = Order.objects.create(
            user=request.user,  # Assuming the user is authenticated
            first_name=first_name,
            last_name=last_name,
            address=address,
            city=city,
            state=state,
            zip_code=zip_code,
            shipping_method=1,  # You may adjust this as needed
            payment_method=payment_method,
            price=cart.calculate_final_price(),  # Ensure you have the correct price for the order
        )

        # Move items from cart to order
        for item in cart.cart_items.all():
            order_item = OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                color=item.color,
                size=item.size,
            )

        # Clear the cart after order creation
        cart.cart_items.all().delete()
        cart.coupon = None
        cart.save()
        # Redirect to payment page or confirmation page based on payment method
        if payment_method == "card":
            payment = initiate_payment(request, orderId=order.id, amount=order.price)
            url = payment["payUrl"]
        elif payment_method == "cash":
            url = f"/place-order/?oid={order.id}"  # Redirect to shop or confirmation page if payment method is not credit card

        return JsonResponse({'success': True, 'order_id': order.id, "url": url})
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method'})

@login_required
def initiate_payment(request, orderId, amount):
    check_device_limit(request.user)
    # Make sure to replace these values with your actual credentials and data
    api_key = '665ddd89ecb4e3b38d776b78a:5usETKkdz0MZwYpgWLMIQXg2gtyNgGp'
    konnect_wallet_id = '65ddd89ecb4e3b38d776b78e'

    url = "https://api.preprod.konnect.network/api/v2/payments/init-payment"
    headers = {
        "x-api-key": '65f0e6d5f85f11d7b8c06004:x3QEEv76q8kvnSxAXTqjMljIeYLz',
        "Content-Type": "application/json"
    }
    payload = {
      "receiverWalletId": '65f0e6d5f85f11d7b8c06008',
      "token": "TND",
      "amount": float(amount) * 1000,
      "type": "immediate",
      "description": "payment description",
      "acceptedPaymentMethods": [
        "bank_card",
      ],
      "lifespan": 10,
      "checkoutForm": True,
      "addPaymentFeesToAmount": True,
      "firstName": request.user.first_name,
      "lastName": request.user.last_name,
      "phoneNumber": request.user.tel,
      "email": request.user.email,
      "orderId": orderId,
      "webhook": "http://127.0.0.1:8000/webhook",
      "silentWebhook": True,
      "successUrl": f"http://127.0.0.1:8000/order_complete?oid={orderId}",
      "failUrl": f"http://127.0.0.1:8000/payment-error?oid={orderId}",
      "theme": "dark"
    }

    response = requests.post(url, headers=headers, json=payload)
    if response.status_code == 200:
        data = response.json()
        return data
    else:
        error_message = "Failed to initiate payment"
        if response.status_code == 401:
            error_message = "Unauthorized: API key is invalid or missing"
        elif response.status_code == 403:
            error_message = "Forbidden: You do not have permission to access this resource"
        elif response.status_code == 404:
            error_message = "Not Found: The requested resource was not found"
        elif response.status_code == 422:
            error_message = "Unprocessable Entity: The request was well-formed but failed validation"
        
        return JsonResponse({"error": error_message}, status=response.status_code)

@login_required
def webhook(request):
    check_device_limit(request.user)
    payment_ref = request.GET.get("payment_ref")
    if payment_ref:
        # Query Konnect API to get payment details
        payment_status = get_payment_status(payment_ref)
        # Process payment status and update database or trigger actions
        # Example: Update database with payment status
        # payment.update(status=payment_status)
        return JsonResponse({"message": "Webhook received", "payment status": payment_status})
    else:
        return JsonResponse({"error": "Payment reference ID not provided"})

@login_required
def get_payment_status(payment_ref):
    check_device_limit(request.user)
    # Make a request to Konnect API to get payment details
    # Replace 'YOUR_KONNECT_API_KEY' with your actual API key
    api_key = '665ddd89ecb4e3b38d776b78a:5usETKkdz0MZwYpgWLMIQXg2gtyNgGp'
    url = f"https://api.preprod.konnect.network/api/v2/payments/{payment_ref}"
    headers = {"x-api-key": api_key}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        payment_data = response.json()
        payment_status = payment_data.get("payment", {}).get("status")
        return payment_status
    else:
        error_message = "Failed to get payment status"
        if response.status_code == 401:
            error_message = "Unauthorized: API key is invalid or missing"
        elif response.status_code == 403:
            error_message = "Forbidden: You do not have permission to access this resource"
        elif response.status_code == 404:
            error_message = "Not Found: The requested resource was not found"
        elif response.status_code == 422:
            error_message = "Unprocessable Entity: The request was well-formed but failed validation"
        elif response.status_code == 502:
            error_message = "Bad Gateway: The server was acting as a gateway or proxy and received an invalid response from the upstream server"
        
        return error_message

@login_required
def finalCartCheckoutView(request):
    check_device_limit(request.user)
    cartId = request.POST.get('cartId')
    price = request.POST.get('price')
    shippingMethod = request.POST.get('shippingMethod')
    shippingCost = request.POST.get('shippingCost')

    cart = Cart.objects.get(id=cartId)
    cart.price = price
    cart.shippingMethod = shippingMethod
    cart.shippingCost = shippingCost
    cart.save()
    return JsonResponse({'success': True})

@login_required
def add_to_cart(request):
    check_device_limit(request.user)
    if request.method == 'POST':
        product_id = request.POST.get('product_id')
        if not request.user.is_authenticated:
            return JsonResponse({'success': True, 'message': 'not logged in', 'url': f"/login?next=/product/{product_id}"})
        product = Product.objects.get(id=product_id)
        color = request.POST.get('color')
        size = request.POST.get('size')
        quantity = int(request.POST.get('quantity'))

        if product_id:
            product = get_object_or_404(Product, id=product_id)

            if product.quantity < 1:
                return JsonResponse({'success': False, 'message': 'Product is out of stock'})

            user_cart, created = Cart.objects.get_or_create(user=request.user)

            cart_item, item_created = CartItem.objects.get_or_create(
                cart=user_cart,
                product=product,
                color=color,
                size=size,
            )

            if not item_created:
                if cart_item.quantity + quantity > product.quantity:
                    return JsonResponse({'success': False, 'message': 'Cannot add more than 5 of the same item to the cart'})
                cart_item.quantity += quantity
            else:
                if quantity > product.quantity:
                    return JsonResponse({'success': False, 'message': 'Cannot add more than 5 of the same item to the cart'})
                cart_item.quantity = quantity

            cart_item.save()

            user_cart.save()

            cart_count = user_cart.cart_items.aggregate(total_quantity=Sum('quantity'))['total_quantity']

            return JsonResponse({'success': True, 'message': 'Product added to cart', 'cart_count': cart_count})
        else:
            return JsonResponse({'success': False, 'message': 'Product ID not provided'})
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method'})
    
@login_required
def buy_now(request):
    check_device_limit(request.user)
    if request.method == 'POST':
        product_id = request.POST.get('product_id')
        color = request.POST.get('color')
        size = request.POST.get('size')
        quantity = int(request.POST.get('quantity'))
        
        if product_id:
            product = get_object_or_404(Product, id=product_id)
            
            if product.quantity < 1:
                return JsonResponse({'success': False, 'message': 'Product is out of stock'})

            user_cart, created = Cart.objects.get_or_create(user=CustomUser.objects.get(user=request.user))

            cart_item, item_created = CartItem.objects.get_or_create(
                cart=user_cart,
                product=product,
                color=color,
                size=size,
            )

            if not item_created:
                if cart_item.quantity + quantity > product.quantity:
                    return JsonResponse({'success': False, 'message': 'Cannot add more than 5 of the same item to the cart'})
                cart_item.quantity += quantity
            else:
                if quantity > product.quantity:
                    return JsonResponse({'success': False, 'message': 'Cannot add more than 5 of the same item to the cart'})
                cart_item.quantity = quantity

            cart_item.save()

            user_cart.save()

            return JsonResponse({'success': True, 'redirect_url': '/checkout/'})
        else:
            return JsonResponse({'success': False, 'message': 'Product ID not provided'})
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method'})

def optIn(request, *args, **kwargs):
    email = request.POST.get('email')
    optIn, created = OptIn.objects.get_or_create(email=email)
    message = "you already subscribed"
    if created:
        message = "thanks for subscribing"
    return JsonResponse({"sucess": True, "message": message})

@login_required
def add_liked_product(request):
    check_device_limit(request.user)
    user = request.user
    product = get_object_or_404(Product, id=request.POST.get("product_id"))

    # Add the product to the user's liked products
    user.liked_products.add(product)

    # Return a success message
    return JsonResponse({'success': True})

@login_required
def remove_liked_product(request):
    check_device_limit(request.user)
    user = request.user
    product = get_object_or_404(Product, id=request.POST.get("product_id"))

    user.liked_products.remove(product)

    return JsonResponse({'success': True})

@login_required
def is_product_liked(request):
    check_device_limit(request.user)

    user = request.user
    product_id = request.POST.get("product_id")
    print(product_id)
    # Check if the product is liked by the user
    if user.liked_products:
        is_liked = user.liked_products.filter(id=product_id).exists()
    else:
        is_liked = None
    # Return a response indicating whether the video is liked or not
    return JsonResponse({'is_liked': is_liked})

@login_required
def create_order(request):
    check_device_limit(request.user)
    try:
        user = request.user
        order = Order.objects.get(user=user, id=request.GET.get("oid"))
        if order:
            order.status = "approved"
            url = reverse('order_complete')
            query_string = f"?oid={order.id}"
            full_url = f"{url}{query_string}"
            return redirect(full_url)
        else:
            return JsonResponse({'success': False, 'message': 'no order found'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})

@login_required
def apply_coupon(request):
    check_device_limit(request.user)
    if request.method == 'POST':
        try:
            coupon_code = request.POST.get('coupon').upper()
            cart_id = request.POST.get('cart_id')
            cart = get_object_or_404(Cart, id=cart_id)
            coupon = get_object_or_404(Coupon, code=coupon_code, active=True, valid_from__lte=timezone.now(), valid_to__gte=timezone.now())

            cart.coupon = coupon
            cart.save()

            total_price = cart.calculate_total_price()
            discount_amount = (total_price * coupon.discount) / 100
            ultimate_total = total_price - discount_amount

            response = {
                'success': True,
                'total_price': total_price,
                'ultimate_total': ultimate_total,
                'discount_amount': discount_amount,
                'message': 'Coupon applied successfully.',
                'total_items': cart.cart_items.count()
            }
            return JsonResponse(response)
        except Coupon.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Invalid or expired coupon.'})
        except Exception as e:
            logger.error(f"Error applying coupon: {e}")
            return JsonResponse({'success': False, 'message': 'An error occurred. Please try again.'})
    return JsonResponse({'success': False, 'message': 'Invalid request method'})

@login_required
def updateQuantity(request, *args, **kwargs):
    check_device_limit(request.user)
    cart_item_id = request.POST.get('item_id')
    print(cart_item_id)
    change = int(request.POST.get('change'))

    try:
        cart_item = CartItem.objects.get(id=cart_item_id)

        if cart_item.quantity == cart_item.product.quantity and change > 0:
            return JsonResponse({"success": True, "error": "Cannot exceed available product quantity."})

        if cart_item.quantity == 1 and change < 0:
            return JsonResponse({"success": True, "error": "Cannot have less than one item in the cart."})

        cart_item.quantity += change
        cart_item.save()  # Don't forget to save the changes to the database

        return JsonResponse({"success": True, "quantity": cart_item.quantity, "cart": serialize('json', [cart_item.cart,]), "price":cart_item.cart.calculate_total_price(), "total": cart_item.cart.calculate_final_price() })

    except CartItem.DoesNotExist:
        return JsonResponse({"success": True, "error": "Cart item not found."})


# ===================
# Crypto Display View
# ===================
from requests import Request, Session
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
import json
# -*- coding: utf-8 -*-
from random import randint
from datetime import datetime, timedelta
import requests



def get_crypto_price(pair):
    price_str = LiveCryptoData(pair).return_data()["price"]
    price_float = float(price_str.iloc[0])
    change = calculate_daily_change_percentage(pair)
    return [price_float, change]

def get_btc_price():

    price_str = LiveCryptoData('BTC-USD').return_data()["price"]
    price_float = float(price_str.iloc[0])
    change = calculate_daily_change_percentage('BTC-USD')
    return [price_float, change]

def get_eth_price():

    price_str = LiveCryptoData('ETH-USD').return_data()["price"]
    price_float = float(price_str.iloc[0])
    change = calculate_daily_change_percentage('ETH-USD')
    return [price_float, change]

def get_sol_price():

    price_str = LiveCryptoData('SOL-USD').return_data()["price"]
    price_float = float(price_str.iloc[0])
    change = calculate_daily_change_percentage('SOL-USD')
    return [price_float, change]

def get_avax_price():

    price_str = LiveCryptoData('AVAX-USD').return_data()["price"]
    price_float = float(price_str.iloc[0])
    change = calculate_daily_change_percentage('AVAX-USD')
    return [price_float, change]

def calculate_daily_change_percentage(ticker):
    # Step 1: Obtain the closing price of the cryptocurrency for the current day from the live data
    live_data = LiveCryptoData(ticker).return_data()
    current_price = pd.to_numeric(live_data.iloc[0]['price'])

    # Step 2: Retrieve the closing price of the cryptocurrency for the previous day from the historical data
    today = datetime.now().strftime('%Y-%m-%d') + "-00-00"
    yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d') + "-00-00"

    historical_data = HistoricalData(ticker, granularity=86400, start_date=yesterday, end_date=today).retrieve_data()
    # Check if historical data retrieval is successful

    # Convert previous day's closing price to numeric
    previous_day_price = pd.to_numeric(historical_data.iloc[-1]['open'])

    # Step 3: Calculate the daily change percentage
    daily_change_percentage = ((current_price - previous_day_price) / previous_day_price) * 100

    return daily_change_percentage

def get_video_icon(request, *args, **kwargs):
    videoID = request.POST.get("video_id")

    if videoID:
        return JsonResponse({"success": True, "icon": Video.objects.get(id=videoID).get_icon(request.user)})

def get_module_icon(request, *args, **kwargs):
    moduleID = request.POST.get("module_id")

    if moduleID:
        return JsonResponse({"success": True, "icon": Module.objects.get(id=moduleID).get_icon(request.user)})
    
from django.db.models import Max
from datetime import datetime, timedelta
from django.db.models.functions import TruncDate

def get_dashboard_log(request, *args, **kwargs):
    # Calculate the date 29 days ago from today
    type = request.POST.get('type').lower()
    print(type)
    if type == 'day':
        end_date = datetime.now()
        start_date = end_date - timedelta(days=29)

        # Get the latest log for each day within the last 29 days
        subquery = (dashboardLog.objects
                    .filter(timestamp__range=[start_date, end_date])
                    .annotate(day=TruncDate('timestamp'))
                    .values('day')
                    .annotate(latest_time=Max('timestamp'))
                    .values('latest_time'))
        
        # Fetch the logs based on the subquery
        logs = dashboardLog.objects.filter(timestamp__in=subquery).order_by('-timestamp')[:31]
        
        # Create a list of logs with balance and date
        log_list = [[log.balance, log.timestamp.date()] for log in logs]
    elif type == 'month':
        end_date = datetime.now()
        start_date = end_date - timedelta(days=365)

        # Get the latest log for each month within the last 12 months
        subquery = (dashboardLog.objects
                    .filter(timestamp__range=[start_date, end_date])
                    .annotate(month=TruncMonth('timestamp'))
                    .values('month')
                    .annotate(latest_time=Max('timestamp'))
                    .values('latest_time'))
        
        # Fetch the logs based on the subquery
        logs = dashboardLog.objects.filter(timestamp__in=subquery).order_by('-timestamp')[:12]
        
        # Create a list of logs with balance and month
        log_list = [[log.balance, log.timestamp.strftime("%b %Y")] for log in logs]
    
    return JsonResponse({"success": True, "log_list": log_list})

def providedFeedback(request, *args, **kwargs):
    has_feedback=False
    if request.user.is_authenticated:
        has_feedback = Feedback.objects.filter(user=request.user).exists()
    return JsonResponse({"success": True, "has_feedback": has_feedback})

def claimedDailyPoints(request, *args, **kwargs):
    if request.user.is_authenticated:
        return JsonResponse({"success": True, "claimed": request.user.has_claimed_daily_points(), "time_until_next_claim": request.user.time_until_next_claim()})
    else:
        return JsonResponse({"success": True, "claimed": True, "time_until_next_claim": None})
    

def privacyPolicy(request, *args, **kwargs):
    return render(request, 'policy.html', {})
def termsService(request, *args, **kwargs):
    return render(request, 'terms.html', {})

def pageNotFoundView(request, invalid_path=None):
    return redirect("landing")

def handler404(request, exception):
    return redirect("landing")

def lessonsView(request, *args, **kwargs):

    vocals = Vocal.objects.all()
    return render(request, 'lessons.html', {"vocals": vocals})

@login_required
def add_liked_vocal(request):
    check_device_limit(request.user)
    user = request.user
    vocal = get_object_or_404(Vocal, id=request.POST.get("vocal_id"))
    
    # Check if the vocal is already liked
    if not user.liked_vocals.filter(id=vocal.id).exists():
        user.points += 20
        user.liked_vocals.add(vocal)
    
    # Save the user instance if points were modified
    user.save()
    
    # Return a success message
    return JsonResponse({'success': True})

@login_required
def remove_liked_vocal(request):
    check_device_limit(request.user)
    user = request.user
    vocal = get_object_or_404(Vocal, id=request.POST.get("vocal_id"))
    
    # Check if the vocal is actually in the liked list before removing points
    if user.liked_vocals.filter(id=vocal.id).exists():
        user.points = max(user.points - 20, 0)  # Ensure points don't go below 0
        user.liked_vocals.remove(vocal)
    
    # Save the user instance if points were modified
    user.save()
    
    return JsonResponse({'success': True})

@login_required
def is_vocal_liked(request):
    check_device_limit(request.user)

    user = request.user
    vocal_id = request.POST.get("vocal_id")
    print(vocal_id)
    # Check if the vocal is liked by the user
    if user.liked_vocals:
        is_liked = user.liked_vocals.filter(id=vocal_id).exists()
    else:
        is_liked = None
    return JsonResponse({'is_liked': is_liked})

def formRedirectView(request, *args, **kwargs):
    return redirect("https://docs.google.com/forms/d/e/1FAIpQLSd-zaCXZTRKWv8SUWIWAbFDjEeehFg4MfmYBQOUNfts7vV7hA/viewform")

def freeView(request, *args, **kwargs):
    return redirect("course_detail", course_url_title=Course.objects.get(id=4).url_title)

def ExclusiveView(request, *args, **kwargs):
    return redirect("https://forms.gle/p5anJatt9o8GiWsS8")



def addCheckListRowView(request, *args, **kwargs):
    title = request.POST.get("title")

    if not title:
        return JsonResponse({"success": False, "error": "Title is required."})

    try:
        row = checkRow.objects.create(user=request.user, title=title)
        return JsonResponse({"success": True, "id": row.id, "title": row.title})
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)})
    
def checkCheckListRowView(request, *args, **kwargs):
    # Extract the id from the POST request
    id = request.POST.get("id")
    
    # Check if id is provided
    if not id:
        print("test 1")
        return JsonResponse({"success": False, "message": "ID is required."})
    try:
        
        # Fetch the checkRow object and mark it as checked
        check_row = checkRow.objects.get(id=id)
        check_row.checked = True
        check_row.save()

        return JsonResponse({"success": True, "message": "Row checked successfully."})

    except ObjectDoesNotExist:
        return JsonResponse({"success": False, "message": "Row with given ID not found."})

    except Exception as e:
        # Handle any other exceptions
        return JsonResponse({"success": False, "message": str(e)})
    
def uncheckCheckListRowView(request, *args, **kwargs):
    # Extract the id from the POST request
    id = request.POST.get("id")


    # Check if id is provided
    if not id:
        print("test")
        return JsonResponse({"success": False, "message": "ID is required."})
    
    
    
    try:
        
        # Fetch the checkRow object and mark it as checked
        check_row = checkRow.objects.get(id=id)
        check_row.checked = False
        check_row.save()

        return JsonResponse({"success": True, "message": "Row unchecked successfully."})

    except ObjectDoesNotExist:
        return JsonResponse({"success": False, "message": "Row with given ID not found."})

    except Exception as e:
        # Handle any other exceptions
        return JsonResponse({"success": False, "message": str(e)})

def deleteCheckListRowView(request, *args, **kwargs):
    # Check if the request method is POST
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Invalid request method."})

    # Extract the id from the POST request
    row_id = request.POST.get("id")

    # Check if id is provided
    if not row_id:
        return JsonResponse({"success": False, "message": "ID is required."})

    try:
        # Fetch the checkRow object by ID
        check_row = checkRow.objects.get(id=row_id)
        
        # Delete the checkRow object
        check_row.delete()

        return JsonResponse({"success": True, "message": "Row deleted successfully."})

    except ObjectDoesNotExist:
        return JsonResponse({"success": False, "message": "Row with the given ID not found."})

    except Exception as e:
        # Handle any other exceptions
        return JsonResponse({"success": False, "message": str(e)})

def testView(request, *args, **kwargs):
    return render(request, "test.html")


def heartbeat(request):
    if request.user.is_authenticated and request.method == 'POST':
        # Get the current date
        current_date = localdate()

        # Get or create the daily activity log for the user
        daily_activity, created = UserDailyActivity.objects.get_or_create(
            user=request.user,
            date=current_date
        )

        # If this is not the first heartbeat of the day, calculate time since last activity
        if not created and 'last_activity' in request.session:
            last_activity = request.session['last_activity']

            # Convert the session-stored timestamp to a datetime object
            last_activity_time = now().fromisoformat(last_activity)

            # Calculate time since the last activity (this will be a timedelta)
            time_spent_since_last = now() - last_activity_time

            # Ensure that `time_spent_since_last` is a `timedelta` and not an integer
            if isinstance(time_spent_since_last, timedelta):
                # Update the daily activity log with the additional time spent
                daily_activity.update_time_spent(time_spent_since_last)

        # Update last activity time in the session (store as an ISO formatted string)
        request.session['last_activity'] = now().isoformat()

        return JsonResponse({'status': 'success'})

    return JsonResponse({'status': 'failure'}, status=400)

def sendQuestionView(request):
    if request.user.is_authenticated and request.method == 'POST':
        question = request.POST.get("question")
        Question.objects.create(question=question)

        return JsonResponse({'status': 'success'})

    return JsonResponse({'status': 'failed'}, status=400)

def VideoDurationView(request, *args, **kwargs):
    if request.method == 'POST':
        # Parse the JSON body of the request
        try:
            video_id = request.POST.get('video_id')
            
            # Assuming you have a method to get the video object
            video = Video.objects.get(id=video_id)  # Replace with your method to get the video instance

            if video:
                duration = video.get_duration()  # Get the duration in seconds
                return JsonResponse({"duration": duration})

            return JsonResponse({"error": "Video not found or duration could not be fetched."}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)
        
def getVocalsView(request, *args, **kwargs):
    vocals = Vocal.objects.all().reverse()
    serialized_vocals = []
    for vocal in vocals:
        serialized_vocals.append({
            "src": vocal.file.url,
            "name": vocal.title,
            "description": "",
            "image": vocal.image.url if vocal.image else "",
            "banner": ""
        })
    return JsonResponse({"vocals": serialized_vocals})

def testingDark(request, orderId, *args, **kwargs):
    if orderId in [000032379, 000032380, 000032381, 000032382, 000032383, 000032384, 000032385, 000032386, 000032387, 000032388]:
        return JsonResponse({"success": True})
    else:
        return JsonResponse({"success": False})

