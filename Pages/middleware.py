from django.shortcuts import redirect
from django.urls import reverse
from django.utils import timezone
from django.core.cache import cache
from Pages.models import Dashboard, dashboardLog
import time

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