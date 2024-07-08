from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="admin-dash"),

    path('course-order', views.course_order, name="admin-course-order"),
    path('courses', views.courses, name="admin-courses"),
    path('user-course-progress', views.user_course_progress, name="admin-user-course-progress"),
    path('badges', views.badges, name="admin-badges"),
    path('custom-users', views.custom_users, name="admin-custom-users"),
    path('professors', views.professors, name="admin-professors"),
    path('transactions', views.transactions, name="admin-transactions"),
    path('groups', views.groups, name="admin-groups"),
    path('users', views.users, name="admin-users"),
    path('private-session-requests', views.private_session_requests, name="admin-private-session-requests"),
    path('private-sessions', views.private_sessions, name="admin-private-sessions"),
    path('colors', views.colors, name="admin-colors"),
    path('products', views.products, name="admin-products"),
    path('reviews-and-ratings', views.reviews_and_ratings, name="admin-reviews-and-ratings"),
    path('sizes', views.sizes, name="admin-sizes"),
    path('orders', views.orders, name="admin-orders"),
    path('carts', views.carts, name="admin-carts"),
    path('coupons', views.coupons, name="admin-coupons"),
    path('ranks', views.ranks, name="admin-ranks"),
    path('chat-messages', views.chat_messages, name="admin-chat-messages"),
    path('notifications', views.notifications, name="admin-notifications"),
    path('rooms', views.rooms, name="admin-rooms"),
    path('sections', views.sections, name="admin-sections"),
    path('dashboard-logs', views.dashboard_logs, name="admin-dashboard-logs"),
    path('dashboards', views.dashboards, name="admin-dashboards"),
    path('features-youtube-videos', views.features_youtube_videos, name="admin-features-youtube-videos"),
    path('feedbacks', views.feedbacks, name="admin-feedbacks"),
    path('homes', views.homes, name="admin-homes"),
    path('onboarding-questions', views.onboarding_questions, name="admin-onboarding-questions"),
    path('opt-ins', views.opt_ins, name="admin-opt-ins"),
    path('podcasts', views.podcasts, name="admin-podcasts"),
    path('quests', views.quests, name="admin-quests"),
    path('slider-images', views.slider_images, name="admin-slider-images"),
    path('steps', views.steps, name="admin-steps"),
    path('user-quest-progress', views.user_quest_progress, name="admin-user-quest-progress"),



    path('course-order-add/<int:id>', views.course_order_add, name="admin-course-order-add"),
    path('courses-add/<int:id>', views.courses_add, name="admin-courses-add"),
    path('user-course-progress-add/<int:id>', views.user_course_progress_add, name="admin-user-course-progress-add"),
    path('badges-add/<int:id>', views.badges_add, name="admin-badges-add"),
    path('custom-users-add/<int:id>', views.custom_users_add, name="admin-custom-users-add"),
    path('professors-add/<int:id>', views.professors_add, name="admin-professors-add"),
    path('transactions-add/<int:id>', views.transactions_add, name="admin-transactions-add"),
    path('groups-add/<int:id>', views.groups_add, name="admin-groups-add"),
    path('users-add/<int:id>', views.users_add, name="admin-users-add"),
    path('private-session-requests-add/<int:id>', views.private_session_requests_add, name="admin-private-session-requests-add"),
    path('private-sessions-add/<int:id>', views.private_sessions_add, name="admin-private-sessions-add"),
    path('colors-add/<int:id>', views.colors_add, name="admin-colors-add"),
    path('products-add/<int:id>', views.products_add, name="admin-products-add"),
    path('reviews-and-ratings-add/<int:id>', views.reviews_and_ratings_add, name="admin-reviews-and-ratings-add"),
    path('sizes-add/<int:id>', views.sizes_add, name="admin-sizes-add"),
    path('orders-add/<int:id>', views.orders_add, name="admin-orders-add"),
    path('carts-add/<int:id>', views.carts_add, name="admin-carts-add"),
    path('coupons-add/<int:id>', views.coupons_add, name="admin-coupons-add"),
    path('ranks-add/<int:id>', views.ranks_add, name="admin-ranks-add"),
    path('chat-messages-add/<int:id>', views.chat_messages_add, name="admin-chat-messages-add"),
    path('notifications-add/<int:id>', views.notifications_add, name="admin-notifications-add"),
    path('rooms-add/<int:id>', views.rooms_add, name="admin-rooms-add"),
    path('sections-add/<int:id>', views.sections_add, name="admin-sections-add"),
    path('dashboard-logs-add/<int:id>', views.dashboard_logs_add, name="admin-dashboard-logs-add"),
    path('dashboards-add/<int:id>', views.dashboards_add, name="admin-dashboards-add"),
    path('features-youtube-videos-add/<int:id>', views.features_youtube_videos_add, name="admin-features-youtube-videos-add"),
    path('feedbacks-add/<int:id>', views.feedbacks_add, name="admin-feedbacks-add"),
    path('homes-add/<int:id>', views.homes_add, name="admin-homes-add"),
    path('onboarding-questions-add/<int:id>', views.onboarding_questions_add, name="admin-onboarding-questions-add"),
    path('opt-ins-add/<int:id>', views.opt_ins_add, name="admin-opt-ins-add"),
    path('podcasts-add/<int:id>', views.podcasts_add, name="admin-podcasts-add"),
    path('quests-add/<int:id>', views.quests_add, name="admin-quests-add"),
    path('slider-images-add/<int:id>', views.slider_images_add, name="admin-slider-images-add"),
    path('steps-add/<int:id>', views.steps_add, name="admin-steps-add"),
    path('user-quest-progress-add/<int:id>', views.user_quest_progress_add, name="admin-user-quest-progress-add"),



    path('course-order-delete/<int:id>', views.course_order_delete, name="admin-course-order-delete"),
    path('courses-delete/<int:id>', views.courses_delete, name="admin-courses-delete"),
    path('user-course-progress-delete/<int:id>', views.user_course_progress_delete, name="admin-user-course-progress-delete"),
    path('badges-delete/<int:id>', views.badges_delete, name="admin-badges-delete"),
    path('custom-users-delete/<int:id>', views.custom_users_delete, name="admin-custom-users-delete"),
    path('professors-delete/<int:id>', views.professors_delete, name="admin-professors-delete"),
    path('transactions-delete/<int:id>', views.transactions_delete, name="admin-transactions-delete"),
    path('groups-delete/<int:id>', views.groups_delete, name="admin-groups-delete"),
    path('users-delete/<int:id>', views.users_delete, name="admin-users-delete"),
    path('private-session-requests-delete/<int:id>', views.private_session_requests_delete, name="admin-private-session-requests-delete"),
    path('private-sessions-delete/<int:id>', views.private_sessions_delete, name="admin-private-sessions-delete"),
    path('colors-delete/<int:id>', views.colors_delete, name="admin-colors-delete"),
    path('products-delete/<int:id>', views.products_delete, name="admin-products-delete"),
    path('reviews-and-ratings-delete/<int:id>', views.reviews_and_ratings_delete, name="admin-reviews-and-ratings-delete"),
    path('sizes-delete/<int:id>', views.sizes_delete, name="admin-sizes-delete"),
    path('orders-delete/<int:id>', views.orders_delete, name="admin-orders-delete"),
    path('carts-delete/<int:id>', views.carts_delete, name="admin-carts-delete"),
    path('coupons-delete/<int:id>', views.coupons_delete, name="admin-coupons-delete"),
    path('ranks-delete/<int:id>', views.ranks_delete, name="admin-ranks-delete"),
    path('chat-messages-delete/<int:id>', views.chat_messages_delete, name="admin-chat-messages-delete"),
    path('notifications-delete/<int:id>', views.notifications_delete, name="admin-notifications-delete"),
    path('rooms-delete/<int:id>', views.rooms_delete, name="admin-rooms-delete"),
    path('sections-delete/<int:id>', views.sections_delete, name="admin-sections-delete"),
    path('dashboard-logs-delete/<int:id>', views.dashboard_logs_delete, name="admin-dashboard-logs-delete"),
    path('dashboards-delete/<int:id>', views.dashboards_delete, name="admin-dashboards-delete"),
    path('features-youtube-videos-delete/<int:id>', views.features_youtube_videos_delete, name="admin-features-youtube-videos-delete"),
    path('feedbacks-delete/<int:id>', views.feedbacks_delete, name="admin-feedbacks-delete"),
    path('homes-delete/<int:id>', views.homes_delete, name="admin-homes-delete"),
    path('onboarding-questions-delete/<int:id>', views.onboarding_questions_delete, name="admin-onboarding-questions-delete"),
    path('opt-ins-delete/<int:id>', views.opt_ins_delete, name="admin-opt-ins-delete"),
    path('podcasts-delete/<int:id>', views.podcasts_delete, name="admin-podcasts-delete"),
    path('quests-delete/<int:id>', views.quests_delete, name="admin-quests-delete"),
    path('slider-images-delete/<int:id>', views.slider_images_delete, name="admin-slider-images-delete"),
    path('steps-delete/<int:id>', views.steps_delete, name="admin-steps-delete"),
    path('user-quest-progress-delete/<int:id>', views.user_quest_progress_delete, name="admin-user-quest-progress-delete"),





#-------------------------General(Dashboards,Widgets & Layout)---------------------------------------

    
    # #-----------------------Dashboards

    path('dashboard_02', views.dashboard_02, name="dashboard_02"),
    path('dashboard_03', views.dashboard_03, name="dashboard_03"),
    
    # #-----------------------Widgets
    path('general_widget', views.general_widget, name="general_widget"),
    path('chart_widget', views.chart_widget, name="chart_widget"),
    
    
    # #------------------------Layout
    path('box_layout', views.box_layout, name="box_layout"),
    path('layout_rtl', views.layout_rtl, name="layout_rtl"),
    path('layout_dark', views.layout_dark, name="layout_dark"),
    path('hide_on_scroll', views.hide_on_scroll, name="hide_on_scroll"),
    
    
    
    #--------------------------------Applications---------------------------------

    #---------------------Project 

    path('projects', views.projects, name="projects"),
    path('projectcreate', views.projectcreate, name="projectcreate"), 

    #-------------------File M,anager
    path('file_manager', views.file_manager, name="file_manager"),

    #------------------Kanban Board
    path('kanban', views.kanban, name="kanban"),
    
    
    #--------------------ecommerce
    path('add_products',views.add_products, name="add_products"),    
    path('product_cards',views.product_cards, name="product_cards"),    
    path('product_page',views.product_page, name="product_page"),    
    path('list_products', views.list_products, name="list_products"),
    path('payment_details', views.payment_details, name="payment_details"),
    path('order_history', views.order_history, name="order_history"),
    path('invoice_1', views.invoice_1, name="invoice_1"),
    path('invoice_2', views.invoice_2, name="invoice_2"),
    path('invoice_3', views.invoice_3, name="invoice_3"),
    path('invoice_4', views.invoice_4, name="invoice_4"),
    path('invoice_5', views.invoice_5, name="invoice_5"),
    path('invoice_template', views.invoice_template, name="invoice_template"),
    path('cart', views.cart, name="cart"),
    path('list_wish', views.list_wish, name="list_wish"),
    path('checkout', views.checkout, name="checkout"),
    path('pricing', views.pricing, name="pricing"),
    
    #--------------------------emails
    path('letter_box', views.letter_box, name="letter_box"),
    
    #----------------------Chat
    path('private_chat', views.private_chat, name="private_chat"),
    path('group_chat', views.group_chat, name="group_chat"),
    
    
    #---------------------------------user
    path('user_profile', views.user_profile, name="user_profile"),
    path('edit_profile', views.edit_profile, name="edit_profile"),
    path('user_cards', views.user_cards, name="user_cards"),
    
    
    #------------------------bookmark
    path('bookmark', views.bookmark, name="bookmark"),
    
    
    #------------------------contacts
    path('contacts', views.contacts, name="contacts"),

    #------------------------task
    path('task', views.task, name="task"),

    #------------------------calendar
    path('calendar_basic', views.calendar_basic, name="calendar_basic"),

    #------------------------social-app
    path('social_app', views.social_app, name="social_app"),
    
    #------------------------to-do
    path('to_do', views.to_do, name="to_do"),
    
    
    #------------------------search
    path('search', views.search, name="search"),
    
    
#--------------------------------Forms & Table-----------------------------------------------

    #--------------------------------Forms------------------------------------

    #------------------------form-controls
    path('form_validation', views.form_validation, name="form_validation"),
    path('base_input', views.base_input, name="base_input"),
    path('radio_checkbox_control', views.radio_checkbox_control, name="radio_checkbox_control"),
    path('input_group', views.input_group, name="input_group"),
    path('input_mask', views.input_mask, name="input_mask"),
    path('megaoptions', views.megaoptions, name="megaoptions"),
    
    
    #---------------------------form widgets
    path('datepicker', views.datepicker, name="datepicker"),
    path('touchspin', views.touchspin, name="touchspin"),
    path('select2', views.select2, name="select2"),
    path('switch', views.switch, name="switch"),
    path('typeahead', views.typeahead, name="typeahead"),
    path('clipboard', views.clipboard, name="clipboard"),
    
    
   #--------------------------------form layout
    path('form_wizard_one', views.form_wizard_one, name="form_wizard_one"),
    path('form_wizard_two', views.form_wizard_two, name="form_wizard_two"),
    path('two_factor', views.two_factor, name="two_factor"),
    
    
    
#--------------------------------------Table--------------------------------------------------

    #------------------------bootstrap table
    path('basic_table', views.basic_table, name="basic_table"),
    path('table_components', views.table_components, name="table_components"),
    
    
    #-------------------------data table
    path('datatable_basic_init', views.datatable_basic_init, name="datatable_basic_init"),
    path('datatable_advance', views.datatable_advance, name="datatable_advance"),
    path('datatable_API', views.datatable_API, name="datatable_API"),
    path('datatable_data_source', views.datatable_data_source, name="datatable_data_source"),
    
    
    #---------------------------EXdata table
    path('ext_autofill', views.ext_autofill, name="ext_autofill"),  
    
    #-----------------------------jsgrid_table
    path('jsgrid_table', views.jsgrid_table, name="jsgrid_table"),
    
    
#------------------Components------UI Components-----Elements ----------->

    #-----------------------------Ui kits
    path('typography', views.typography, name="typography"),
    path('avatars', views.avatars, name="avatars"),
    path('helper_classes', views.helper_classes, name="helper_classes"),
    path('grid', views.grid, name="grid"),
    path('tag-pills', views.tagpills, name="tag-pills"),
    path('progressbar', views.progressbar, name="progressbar"),
    path('modal', views.modal, name="modal"),
    path('alert', views.alert, name="alert"),
    path('popover', views.popover, name="popover"),
    path('tooltip', views.tooltip, name="tooltip"),
    path('dropdown', views.dropdown, name="dropdown"),
    path('accordion', views.accordion, name="accordion"),
    path('bootstraptab', views.bootstraptab, name="bootstraptab"),
    path('lists', views.lists, name="lists"),  
    
    
    
    #-------------------------------Bonus Ui    
    path('scrollable/', views.scrollable, name="scrollable"),
    path('tree/', views.tree, name="tree"),
    path('toasts/', views.toasts, name="toasts"),
    path('rating/', views.rating, name="rating"),
    path('dropzone/', views.dropzone, name="dropzone"),
    path('tour/', views.tour, name="tour"),
    path('sweetalert2/', views.sweetalert2, name="sweetalert2"),
    path('effect_modal/', views.animatedmodal, name="animatedmodal"),
    path('owlcarousel/', views.owlcarousel, name="owlcarousel"),
    path('ribbons/', views.ribbons, name="ribbons"),
    path('pagination/', views.pagination, name="pagination"),
    path('breadcrumb/', views.breadcrumb, name="breadcrumb"),
    path('rangeslider/', views.rangeslider, name="rangeslider"),
    path('imagecropper/', views.imagecropper, name="imagecropper"),
    path('basiccard/', views.basiccard, name="basiccard"),
    path('creativecard/', views.creativecard, name="creativecard"),
    path('draggablecard/', views.draggablecard, name="draggablecard"),
    path('timeline1/', views.timeline1, name="timeline1"),  
    
    
    
    #---------------------------------Animation    
    path('animate/', views.animate, name="animate"),
    path('scrollreval/', views.scrollreval, name="scrollreval"),
    path('AOS/', views.AOS, name="AOS"),
    path('tilt/', views.tilt, name="tilt"),
    path('wow/', views.wow, name="wow"),
    
    
    #--------------------------Icons
    path('flagicon/', views.flagicon, name="flagicon"),
    path('fontawesome/', views.fontawesome, name="fontawesome"),
    path('icoicon/', views.icoicon, name="icoicon"),
    path('themify/', views.themify, name="themify"),
    path('feather/', views.feather, name="feather"),
    path('whether/', views.whether, name="whether"),
    
    
    
    #--------------------------------Buttons
    path('buttons/', views.buttons, name="buttons"),
    path('group', views.group, name="group"),


    #--------------------------------Charts 
    path('echarts', views.echarts, name="echarts"),
    path('apex', views.apex, name="apex"),
    path('chartjs', views.chartjs, name="chartjs"),
    path('chartist', views.chartist, name="chartist"),
    path('flot', views.flot, name="flot"),
    path('google', views.google, name="google"),
    path('knob', views.knob, name="knob"),
    path('morris', views.morris, name="morris"),
    path('peity', views.peity, name="peity"),
    path('sparkline', views.sparkline, name="sparkline"),
    
    
#----------------------------------------------------Pages-----------------------------------

    
    #-----------------sample-page
    path('sample_page', views.sample_page , name="sample_page"),
    
    #-----------------translate-page
    path('translate', views.translate , name="translate"),

    
    #--------------------Errror pae
    path('error_400', views.error_400, name="error_400"),
    path('error_401', views.error_401, name="error_401"),
    path('error_403', views.error_403, name="error_403"),
    path('error_404', views.error_404, name="error_404"),
    path('error_500', views.error_500, name="error_500"),
    path('error_503', views.error_503, name="error_503"),

    #---------------------Authentication
    path('login_simple', views.login_simple, name="login_simple"),
    path('login_one', views.login_one, name="login_one"),
    path('login_two', views.login_two, name="login_two"),
    path('login_bs_validation', views.login_bs_validation, name="login_bs_validation"),
    path('login_tt_validation', views.login_tt_validation, name="login_tt_validation"),
    path('login_validation', views.login_validation, name="login_validation"),
    path('sign_up/', views.sign_up, name="sign_up" ),
    path('sign_one', views.sign_one, name="sign_one" ),
    path('sign_two', views.sign_two, name="sign_two" ),
    path('sign_wizard', views.sign_wizard, name="sign_wizard"),
    path('unlock', views.unlock , name="unlock"),
    path('forget_password', views.forget_password, name="forget_password"),
    path('reset_password', views.reset_password, name="reset_password"),
    path('maintenance', views.maintenance, name="maintenance"),
    
    
    #---------------------------------------comingsoon

    path('comingsoon', views.comingsoon, name="comingsoon"),
    path('comingsoon_video', views.comingsoon_video, name="comingsoon_video"),
    path('comingsoon_img', views.comingsoon_img, name="comingsoon_img"),

    #------------------------------------email template

    path('basic_temp', views.basic_temp, name="basic_temp"),
    path('email_header', views.email_header, name="email_header"),
    path('template_email', views.template_email, name="template_email"),
    path('template_email_2', views.template_email_2, name="template_email_2"),
    path('ecommerce_temp', views.ecommerce_temp, name="ecommerce_temp"),
    path('email_order', views.email_order, name="email_order"),    
    
    
#------------------------------------------Miscellaneous----------------- -------------------------

    #------------------------gallery

    path('gallery_grid', views.gallery_grid, name="gallery_grid"),
    path('gallery_description', views.gallery_description, name="gallery_description"),
    path('masonry_gallery', views.masonry_gallery, name="masonry_gallery"),
    path('masonry_disc', views.masonry_disc, name="masonry_disc"),
    path('hover', views.hover, name="hover"),

    #-------------------------Blog
    path('blog_details', views.blog_details, name="blog_details"),
    path('blog_single', views.blog_single, name="blog_single"),
    path('add_post', views.add_post, name="add_post"),

    #-------------------------faq
    path('FAQ', views.FAQ, name="FAQ"),
    
    #-------------------------job serch

    path('job_cards', views.job_cards, name="job_cards"),
    path('job_list', views.job_list, name="job_list"),
    path('job_details', views.job_details, name="job_details"),
    path('apply', views.apply, name="apply"),

    #-------------------------Learning
    path('learning_list', views.learning_list, name="learning_list"),
    path('learning_detailed', views.learning_detailed, name="learning_detailed"),

    #-------------------------maps
    path('maps_js', views.maps_js, name="maps_js"),
    path('vector_maps', views.vector_maps, name="vector_maps"),


    #------------------------------------Editors
    path('summernote', views.summernote, name="summernote"),
    path('ckeditor', views.ckeditor, name="ckeditor"),
    path('simple_mde', views.simple_mde, name="simple_mde"),
    path('ace_code', views.ace_code, name="ace_code"),


    #-----------------------------knowledgebase
    path('knowledgebase', views.knowledgebase, name="knowledgebase"),

    #-----------------------------support-ticket
    path('support_ticket', views.support_ticket, name="support_ticket"),

#-----------------------------------------------------------------------------------    
    
    
    path('signup_home', views.signup_home, name="signup_home"),
    path('login_home', views.login_home, name="login_home"),
    path('logout_view', views.logout_view, name="logout_view"),
    
]
