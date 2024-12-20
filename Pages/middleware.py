from datetime import timedelta
import uuid
from django.shortcuts import redirect
from django.urls import reverse
from django.utils import timezone
from django.core.cache import cache
from Pages.models import Dashboard, UserDevice, dashboardLog
import time
import datetime
from django.utils.timezone import now
from django.core.cache import cache
from django.utils.deprecation import MiddlewareMixin
from Users.models import CustomUser
from django.db.models import Count, Q
from django.db.models import F

import threading
from django.core.cache import cache
from .models import CustomUser, checkRow

class DailyDashboardLogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        self.process_request(request)
        response = self.get_response(request)
        return response

    def process_request(self, request):
        # Check if today's log has been created
        today = timezone.now().date()
        dashboard_log_entry = dashboardLog.objects.filter(timestamp__date=today).first()

        if dashboard_log_entry:
            # Update existing entry's balance
            self.update_daily_log(dashboard_log_entry)
        else:
            # Create a new dashboardLog entry for today
            self.create_daily_log(today)

    def update_daily_log(self, dashboard_log_entry):
        # Update existing dashboardLog entry's balance
        dashboard = Dashboard.objects.first()  # Assuming there's a single Dashboard instance
        if dashboard:
            total_balance = dashboard.calculate_total_balance()
            dashboard_log_entry.balance = total_balance
            dashboard_log_entry.save()

    def create_daily_log(self, today):
        # Retrieve or create a dashboardLog entry for today
        dashboard = Dashboard.objects.first()  # Assuming there's a single Dashboard instance
        if dashboard:
            total_balance = dashboard.calculate_total_balance()
            
            # Retrieve the existing dashboardLog entry for today, or create a new one if it doesn't exist
            dashboard_log_entry, created = dashboardLog.objects.get_or_create(
                timestamp__date=today,
                defaults={'balance': total_balance, 'timestamp': today}
            )
            
            # Update the balance if the entry was retrieved (not created) and the balance has changed
            if not created and dashboard_log_entry.balance != total_balance:
                dashboard_log_entry.balance = total_balance
                dashboard_log_entry.save()

class EmailVerificationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated and not request.user.email_verified:
            if request.path not in [reverse('verification_success'), reverse('verification_failed')]:
                return redirect('verification_needed')  # Create this view to inform user to verify email
        response = self.get_response(request)
        return response
    

class DeviceTrackingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.user.is_authenticated:
            device_id = request.COOKIES.get('device_id', str(uuid.uuid4()))
            request.COOKIES['device_id'] = device_id
            response = self.get_response(request)
            
            user_device, created = UserDevice.objects.get_or_create(
                user=request.user,
                device_id=device_id,
            )
            if not created:
                user_device.login_attempts += 1
                user_device.save()
            
            return response
        else:
            return self.get_response(request)
        
class RestrictCourseAccessMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Check if the user is authenticated
        if request.user.is_authenticated:
            # Check if the user has course ID 3 in their enrolled courses
            if request.user.enrolled_courses.filter(id=3).exists() and request.user.bought_course_date:
                # Calculate the expiration date
                expiration_date = request.user.bought_course_date + timedelta(days=38)
                # If the current date is past the expiration date, remove the course
                if timezone.now().date() > expiration_date:
                    request.user.enrolled_courses.remove(3)

        # Proceed to the next middleware or view
        return self.get_response(request)
    
class DailyTaskMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Get today's date
        today = now().date()

        # Check if the task has already been run for the current user today
        if request.user.is_authenticated:
            user_id = request.user.id
            user_last_run_key = f'daily_task_last_run_{user_id}'
            last_run = cache.get(user_last_run_key)

            # If last run date is not today, run the task in a separate thread
            if last_run != today:
                # Start a new thread to run the daily task
                thread = threading.Thread(target=self.run_daily_task, args=(request.user,))
                thread.start()

                # Update the cache with today's date after starting the thread
                cache.set(user_last_run_key, today, timeout=86400)  # Cache for 1 day

        # Proceed with the normal request flow
        response = self.get_response(request)
        return response

    def run_daily_task(self, user):
        # Fetch the checks for the user in a single query
        checks = user.check_list_rows.all()
        all_checked = checks.filter(checked=False).count() == 0

        # Only update points if all checks are marked
        if all_checked and checks.exists():
            user.points = F('points') + 20
            user.save(update_fields=['points'])

        # Uncheck all rows for the new day in a single update operation
        unchecked_rows_count = checkRow.objects.filter(user=user, checked=True).update(checked=False)

        print(f"Unchecked {unchecked_rows_count} rows today for user {user.id}!")