# Pages/middleware.py

from django.utils import timezone
from django.core.cache import cache
from Pages.models import Dashboard, dashboardLog

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
        last_logged_date = cache.get('last_logged_date')

        if last_logged_date is None or last_logged_date < today:
            # Update the last logged date in the cache
            cache.set('last_logged_date', today)

            # Create a new dashboardLog entry for today
            self.create_daily_log(today)

    def create_daily_log(self, today):
        # Create a new dashboardLog entry for today
        dashboard = Dashboard.objects.first()  # Assuming there's a single Dashboard instance
        if dashboard:
            total_balance = dashboard.calculate_total_balance()
            dashboardLog.objects.create(balance=total_balance, timestamp=timezone.now())