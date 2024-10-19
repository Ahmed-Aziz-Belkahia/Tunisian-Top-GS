from django.conf import settings
from django.contrib import admin
from django.urls import path, include, reverse_lazy
from django.conf.urls.static import static
from django_ckeditor_5 import views as ckeditor_views
from django.contrib.sitemaps.views import sitemap

from Pages import views
from Pages.views import CustomConfirmEmailView, lessonsView, pageNotFoundView
from django.contrib.auth import views as auth_views
from django.contrib.auth.forms import SetPasswordForm

from django.contrib.sitemaps import Sitemap
from django.urls import reverse

class StaticViewSitemap(Sitemap):
    def items(self):
        return ['landing', 'contact-us']  # Include names of your URL patterns here

    def location(self, item):
        return reverse(item)

sitemaps = {
    'static': StaticViewSitemap,
}

urlpatterns = [
    # Admin
    path('admin-old/', admin.site.urls),
    path('admin/',include('customTheme.urls')),
    path('accounts/', include('allauth.urls')),
    path('verification/', include('verify_email.urls')),	
    # Authentication
    path('register/', views.registerView, name="register"),
    path('registerf/', views.registerf, name="registerf"),
    path('login/', views.loginView, name="login"),
    path('loginf/', views.loginf, name="loginf"),
    path('logoutf/', views.logoutf, name="logout"),
    path('logout/', views.logout_view, name='logout'),

    # Password Reset
    path('reset_password/', auth_views.PasswordResetView.as_view(template_name="forgetPassword.html"), name="reset_password"),
    path('reset_password_sent/', auth_views.PasswordResetDoneView.as_view(template_name="verification.html"), name="password_reset_done"),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name="newPassword.html", success_url=reverse_lazy('password_reset_complete')), name="password_reset_confirm"),
    path('reset_password_complete/', auth_views.PasswordResetCompleteView.as_view(template_name="resetDone.html"), name="password_reset_complete"),
    
    # Profile and Settings
    path('profile/<str:username>/', views.userProfileView, name='user_profile'),
    path('settings_reset_password/', views.settingsResetPasswordPage, name='settings_reset_password'),
    path('settings_reset_password_action/', views.settingsResetPasswordView, name='settings_reset_password_action'),
    path('settings/', views.settingsView, name="settings"),
    path('payment/', views.paymentView, name="payment"),
    path('personal_info/', views.personalInfoView, name="personal_info"),
    path('settings_notification/', views.notificationView, name="settings_notification"),
    path('profile/', views.profileView, name='profile'),

    # Home and Landing Pages
    path('home/', views.homeView, name="home"),
    path('', views.landingView, name="landing"),
    path('provided-feedback/', views.providedFeedback, name="has_feedback"),
    path('claimed-points/', views.claimedDailyPoints, name="has_claimed_points"),

    # Contact
    path('contact-us/', views.contact_us_view, name='contact-us'),

    # Shop and Products
    path('shop/', views.shopView, name="shop"),
    path('product/<int:product_id>/', views.ProductView, name="product"),
    path('add-to-cart/', views.add_to_cart, name='add_to_cart'),
    path('delete-cart-item/', views.delete_cart_item, name='delete_cart_item'),
    path('update-cart-quantity/', views.update_cart_quantity, name='update_cart_quantity'),
    path('create-order/', views.createOrderView, name='create_order'),
    path('final-cart-checkout/', views.finalCartCheckoutView, name='final-cart-checkout'),
    path('checkout/', views.checkoutView, name="checkout"),
    path('order_complete/', views.orderCompleteView, name="order_complete"),
    #path('cart/', views.cartView, name="cart"),
    path('add_liked_product/', views.add_liked_product, name='add_liked_product'),
    path('remove_liked_product/', views.remove_liked_product, name='remove_liked_product'),
    path('is_product_liked/', views.is_product_liked, name='is_product_liked'),
    path('apply_coupon/', views.apply_coupon, name='apply_coupon'),
    path('update_quantity/', views.updateQuantity, name='update_quantity'),
    path('place-order/', views.create_order, name='place_order'),

    # Feedback
    path('submit-feedback/', views.submitFeedbackView, name='submit_feedback'),

    # Crypto
    path('getbtc/', views.get_btc_price, name='btc'),
    path('geteth/', views.get_eth_price, name='eth'),
    path('getsol/', views.get_sol_price, name='sol'),
    path('getCryptoDetails/', views.getCryptoDetails, name='get_crypto_details'),

    # Chat
    # path("chat/", include("Chat.urls")),
    path('server-chat/<str:room_name>/', views.serverChatView, name="server_chat"),
    path('private-chat/', views.privateChatView, name="private_chat"),

    # Dashboard
    path('dashboard/', views.dashboardView, name="dashboard"),
    path('getDashboard/', views.getDashboard, name="getDashboard"),
    path('getTransactions/', views.getTransactions, name="getTransaction"),
    path('getRanking/', views.getRanking, name="getRanking"),
    path('getTopUser/', views.getTopUser, name="getTopUser"),

    # Private Sessions
    path('private-session/', views.privateSessionView, name="private_session"),
    path('private-session-done/', views.privateSessionScheduleDoneView, name="private_session_done"),
    path('schedulePrivateSession/', views.privateSessionSubmitView, name="schedule_private_session"),

    # Miscellaneous
    path('404/', views.pageNotFoundView, name="404"),
    path('verify/', views.verificationView, name="verify"),
    path('onboarding/', views.onboarding_view, name='onboarding'),
    path('optIn/', views.optIn, name='optIn'),

    # Quests
    path('start-quest/', views.start_quest, name='start-quest'),
    path('quest-detail/', views.quest_detail, name='quest-detail'),
    path('user-quest-progression/', views.user_quest_progression, name='user-quest-progression'),

    # Points and Transactions
    path('add_points/', views.addPoints, name="add_points"),
    path('add_transaction/', views.addTransaction, name="add_transaction"),

    # API
    path('update-user-info/', views.update_user_info, name='update_user_info'),
    path('heartbeat/', views.heartbeat, name='heartbeat'),

    # CKEditor
    path("ckeditor5/", include('django_ckeditor_5.urls')),

    # Academy (Courses)
    path('course-checkout/<slug:course_url_title>/', views.course_checkout, name='course_checkout'),
    path('courses/', views.coursesView, name="courses"),
    path('course_order_complete/', views.courseOrderComplete, name="course_order_complete"),
    path('course_order_failed/', views.courseOrderFailed, name="course_order_failed"),
    path('courses/<slug:course_url_title>/levels/', views.levelsView, name="levels"),
    path('<slug:url_title>/video-course/', views.videoCourseView, name="video-course"),
    path('<slug:url_title>/video-course/<slug:video_url_title>', views.videoCourseView, name="video-course"),
    path('<int:level_id>/notes-course/', views.notesCourseView, name="notes-course"),
    path('<int:level_id>/imgQuizz-course/', views.imgQuizzCourseView, name="imgQuizz-course"),
    path('<int:level_id>/textQuizz-course/', views.textQuizzCourseView, name="textQuizz-course"),
    path('<int:level_id>/lesson-completed/', views.lessonCompletedView, name="lesson-completed"),
    path('course-detail/<slug:course_url_title>/', views.course_detail_view, name='course_detail'),
    path('get-video/', views.getVideoView, name="get-video"),
    path('videoFinished/', views.videoFinishedView, name="videoFinished"),
    path('course-progress/', views.course_progress, name="course-progress"),
    path('level_progress/', views.level_progress, name="level_progress"),
    path('next-video/', views.getNextVideo, name='next-video'),
    path('complete-step/', views.complete_step, name='complete-step'),
    path('add_liked_video/', views.add_liked_video, name='add_liked_video'),
    path('remove_liked_video/', views.remove_liked_video, name='remove_liked_video'),
    path('is_video_liked/', views.is_video_liked, name='is_video_liked'),
    path('form/', views.formRedirectView, name='form'),
    path('free/', views.freeView, name='free'),
    path('exclusive/', views.ExclusiveView, name='exclusive'),
    path('book/', views.bookView, name='book'),
    path('test/', views.testView, name='test'),

    path('get_video_icon/', views.get_video_icon, name='get_video_icon'),
    path('get_module_icon/', views.get_module_icon, name='get_module_icon'),

    path('get_dashboard_log/', views.get_dashboard_log, name='get_dashboard_log'),
    path('privacy-policy/', views.privacyPolicy, name='privacy_policy'),
    path('terms-service/', views.termsService, name='terms-service'),

    path('request-new-verification-link/', views.request_new_verification_link, name='request_new_verification_link'),
    path('accounts/confirm-email/<str:key>/', CustomConfirmEmailView, name='account_confirm_email'),
    path('lessons/', lessonsView, name="lessons"),

    path('add_liked_vocal/', views.add_liked_vocal, name='add_liked_vocal'),
    path('remove_liked_vocal/', views.remove_liked_vocal, name='remove_liked_vocal'),
    path('is_vocal_liked/', views.is_vocal_liked, name='is_vocal_liked'),

    path('add-check-list-row/', views.addCheckListRowView, name='addCheckListRowView'),
    path('check-check-list-row/', views.checkCheckListRowView, name='checkCheckListRowView'),
    path('uncheck-check-list-row/', views.uncheckCheckListRowView, name='uncheckCheckListRowView'),
    path('delete-check-list-row/', views.deleteCheckListRowView, name='deleteCheckListRowView'),

    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    
    path('404/', pageNotFoundView, name="404"),
    path('<path:invalid_path>/', pageNotFoundView),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
