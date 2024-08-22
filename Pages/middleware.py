from datetime import timedelta
import uuid
from django.shortcuts import redirect
from django.urls import reverse
from django.utils import timezone
from django.core.cache import cache
from Pages.models import Dashboard, UserDevice, dashboardLog
import time
from django.utils.deprecation import MiddlewareMixin

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
        # Create a new dashboardLog entry for today
        dashboard = Dashboard.objects.first()  # Assuming there's a single Dashboard instance
        if dashboard:
            total_balance = dashboard.calculate_total_balance()
            dashboardLog.objects.create(balance=total_balance, timestamp=today)

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
                expiration_date = request.user.bought_course_date + timedelta(days=31)
                # If the current date is past the expiration date, remove the course
                if timezone.now().date() > expiration_date:
                    request.user.enrolled_courses.remove(3)

        # Proceed to the next middleware or view
        return self.get_response(request)