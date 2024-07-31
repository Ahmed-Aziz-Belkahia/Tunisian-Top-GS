from django.shortcuts import render,redirect
from django.contrib import messages
from django.http.response import HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User, Group
from django.contrib.auth import login,logout,authenticate
from datetime import datetime, timedelta
from django.db.models import Subquery
from django.utils.dateparse import parse_datetime,parse_date
from django.core.mail import EmailMessage
import Carts.models as cartsModels
import Chat.models as chatModels
import Courses.models as coursesModels
import Orders.models as ordersModels
import Pages.models as pagesModels
import PrivateSessions.models as privateSessionsModels
import Products.models as productsModels
import Ranks.models as ranksModels
from TTG import settings
import Users.models as usersModels
import csv
from django.core.exceptions import ObjectDoesNotExist
import re
from django.template.loader import render_to_string
from celery import shared_task

# Create your views here.
@login_required(login_url="/login")
def course_order(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    courseObjs = coursesModels.CourseOrder.objects.all()
    
    context = { "pageTitle": "View Course Orders", "courseObjs": courseObjs }
    return render(request,'admin/courses/course-order.html',context)

@login_required(login_url="/login")
def courses(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    courseObjs = coursesModels.Course.objects.all()
    
    context = { "pageTitle": "View Courses", "courseObjs": courseObjs }
    return render(request,'admin/courses/courses.html',context)

@login_required(login_url="/login")
def user_course_progress(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    userCourseObjs = coursesModels.UserCourseProgress.objects.all()
    
    context = { "pageTitle": "View User Course Progress", "userCourseObjs": userCourseObjs }
    return render(request,'admin/courses/user_course_progress.html',context)





@login_required(login_url="/login")
def badges(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    badgeObjs = usersModels.Badge.objects.all()
    
    context = { "pageTitle": "View Badges", "badgeObjs": badgeObjs }
    return render(request,'admin/users/badges.html',context)

@login_required(login_url="/login")
def custom_users(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    userObjs = usersModels.CustomUser.objects.all()
    
    context = { "pageTitle": "View Custom Users", "userObjs": userObjs }
    return render(request,'admin/users/customUsers.html',context)

@login_required(login_url="/login")
def professors(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    profObjs = usersModels.Professor.objects.all()
    
    context = { "pageTitle": "View Professors", "profObjs": profObjs }
    return render(request,'admin/users/professors.html',context)

@login_required(login_url="/login")
def transactions(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    transObjs = usersModels.Transaction.objects.all()
    
    context = { "pageTitle": "View Transactions", "transObjs": transObjs }
    return render(request,'admin/users/transactions.html',context)





@login_required(login_url="/login")
def groups(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    courseObjs = Group.objects.all()
    
    context = { "pageTitle": "View Groups", "courseObjs": courseObjs }
    return render(request,'admin/courses/courses.html',context)

@login_required(login_url="/login")
def users(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    courseObjs = User.objects.all()
    
    context = { "pageTitle": "View Users", "courseObjs": courseObjs }
    return render(request,'admin/courses/courses.html',context)





@login_required(login_url="/login")
def private_session_requests(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    privateSessionReqObjs = privateSessionsModels.PrivateSessionRequest.objects.all()
    
    context = { "pageTitle": "View Private Session Requests", "privateSessionReqObjs": privateSessionReqObjs }
    return render(request,'admin/privateSessions/requests.html',context)

@login_required(login_url="/login")
def private_sessions(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    privateSessionObjs = privateSessionsModels.PrivateSession.objects.all()
    
    context = { "pageTitle": "View Private Session", "privateSessionObjs": privateSessionObjs }
    return render(request,'admin/privateSessions/sessions.html',context)





@login_required(login_url="/login")
def colors(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    colorObjs = productsModels.Color.objects.all()
    
    context = { "pageTitle": "View Colors", "colorObjs": colorObjs }
    return render(request,'admin/products/colors.html',context)

@login_required(login_url="/login")
def products(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    productObjs = productsModels.Product.objects.all()
    
    context = { "pageTitle": "View Products", "productObjs": productObjs }
    return render(request,'admin/products/products.html',context)

@login_required(login_url="/login")
def reviews_and_ratings(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    reviewObjs = productsModels.Review.objects.all()
    
    context = { "pageTitle": "View Reviews And Ratings", "reviewObjs": reviewObjs }
    return render(request,'admin/products/review.html',context)

@login_required(login_url="/login")
def sizes(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    sizeObjs = productsModels.Size.objects.all()
    
    context = { "pageTitle": "View Sizes", "sizeObjs": sizeObjs }
    return render(request,'admin/products/sizes.html',context)





@login_required(login_url="/login")
def orders(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    orderObjs = ordersModels.Order.objects.all()
    
    context = { "pageTitle": "View Orders", "orderObjs": orderObjs }
    return render(request,'admin/orders/orders.html',context)





@login_required(login_url="/login")
def carts(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    cartObjs = cartsModels.Cart.objects.all()
    
    context = { "pageTitle": "View Carts", "cartObjs": cartObjs }
    return render(request,'admin/carts/carts.html',context)

@login_required(login_url="/login")
def coupons(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    couponObjs = cartsModels.Coupon.objects.all()
    
    context = { "pageTitle": "View Coupons", "couponObjs": couponObjs }
    return render(request,'admin/carts/coupons.html',context)





@login_required(login_url="/login")
def ranks(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    rankObjs = ranksModels.Rank.objects.all()
    
    context = { "pageTitle": "View Ranks", "rankObjs": rankObjs }
    return render(request,'admin/ranks/ranks.html',context)





@login_required(login_url="/login")
def chat_messages(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    messageObjs = chatModels.Message.objects.all()
    
    context = { "pageTitle": "View Messages", "messageObjs": messageObjs }
    return render(request,'admin/chat/messages.html',context)

@login_required(login_url="/login")
def notifications(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    notificationObjs = chatModels.Notification.objects.all()
    
    context = { "pageTitle": "View Notifications", "notificationObjs": notificationObjs }
    return render(request,'admin/chat/notifications.html',context)

@login_required(login_url="/login")
def rooms(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    roomObjs = chatModels.Room.objects.all()
    
    context = { "pageTitle": "View Rooms", "roomObjs": roomObjs }
    return render(request,'admin/chat/rooms.html',context)

@login_required(login_url="/login")
def sections(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    sectionObjs = chatModels.Section.objects.all()
    
    context = { "pageTitle": "View Sections", "sectionObjs": sectionObjs }
    return render(request,'admin/chat/sections.html',context)





@login_required(login_url="/login")
def dashboard_logs(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    dashObjs = pagesModels.dashboardLog.objects.all()
    
    context = { "pageTitle": "View Dashboard Logs", "dashObjs": dashObjs }
    return render(request,'admin/pages/dashboard-logs.html',context)

@login_required(login_url="/login")
def dashboards(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    dashObjs = pagesModels.Dashboard.objects.all()
    
    context = { "pageTitle": "View Dashboards", "dashObjs": dashObjs }
    return render(request,'admin/pages/dashboards.html',context)

@login_required(login_url="/login")
def features_youtube_videos(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    featureYTVidsObjs = pagesModels.FeaturedYoutubeVideo.objects.all()
    
    context = { "pageTitle": "View Feature Youtube Videos", "featureYTVidsObjs": featureYTVidsObjs }
    return render(request,'admin/pages/features.html',context)

@login_required(login_url="/login")
def feedbacks(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    feedbackObjs = pagesModels.Feedback.objects.all()
    
    context = { "pageTitle": "View Feedbacks", "feedbackObjs": feedbackObjs }
    return render(request,'admin/pages/feedbacks.html',context)

@login_required(login_url="/login")
def homes(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    homeObjs = pagesModels.Home.objects.all()
    
    context = { "pageTitle": "View Homes", "homeObjs": homeObjs }
    return render(request,'admin/pages/homes.html',context)

@login_required(login_url="/login")
def onboarding_questions(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    onboardingQsObjs = pagesModels.OnBoardingQuestion.objects.all()
    
    context = { "pageTitle": "View Onboarding Questions", "onboardingQsObjs": onboardingQsObjs }
    return render(request,'admin/pages/onboardingQs.html',context)

@login_required(login_url="/login")
def opt_ins(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    optInObjs = pagesModels.OptIn.objects.all()
    
    context = { "pageTitle": "View Opt Ins", "optInObjs": optInObjs }
    return render(request,'admin/pages/optins.html',context)

@login_required(login_url="/login")
def podcasts(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    podcastObjs = pagesModels.Podcast.objects.all()
    
    context = { "pageTitle": "View Podcasts", "podcastObjs": podcastObjs }
    return render(request,'admin/pages/podcasts.html',context)

@login_required(login_url="/login")
def quests(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    questObjs = pagesModels.Quest.objects.all()
    
    context = { "pageTitle": "View Quests", "questObjs": questObjs }
    return render(request,'admin/pages/quests.html',context)

@login_required(login_url="/login")
def slider_images(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    sliderObjs = pagesModels.SliderImage.objects.all()
    
    context = { "pageTitle": "View Slider Images", "sliderObjs": sliderObjs }
    return render(request,'admin/pages/sliderImages.html',context)

@login_required(login_url="/login")
def steps(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    stepObjs = pagesModels.Step.objects.all()
    
    context = { "pageTitle": "View Steps", "stepObjs": stepObjs }
    return render(request,'admin/pages/steps.html',context)

@login_required(login_url="/login")
def user_quest_progress(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    
    userQuestProgObjs = pagesModels.UserQuestProgress.objects.all()
    
    context = { "pageTitle": "View User Quest Progress", "userQuestProgObjs": userQuestProgObjs }
    return render(request,'admin/pages/userQuestProg.html',context)




# -------------------------------------------


@login_required(login_url="/login")
def course_order_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Course Order"}

    context["courseobjs"] = coursesModels.Course.objects.all()
    context["userobjs"] = usersModels.CustomUser.objects.all()
    context["payments"] = coursesModels.CourseOrder.PAYMENT_CHOICES

    try:
        if id != 0:
            obj = coursesModels.CourseOrder.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Course Order was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = coursesModels.CourseOrder()

        try:
            obj.user = usersModels.CustomUser.objects.get(pk=int(request.POST['user']))
        except:
            pass
        try:
            if request.POST["status"]:
                obj.status = True
        except:
            obj.status = False

        obj.course = coursesModels.Course.objects.get(pk=int(request.POST['course']))
        obj.first_name = request.POST['fname']
        obj.last_name = request.POST['lname']
        obj.age = int(request.POST['age'])
        obj.tel = request.POST['tel']
        obj.email = request.POST['email']
        obj.country = request.POST['cntry']
        obj.state = request.POST['state']
        obj.payment_method = request.POST['method']
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/course-order")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/course-order-add/0")
        else:
            return redirect("/admin/course-order-add/{}".format(obj.id))
    
    return render(request, 'admin/courses/course-order-add.html', context)

def parse_structure(structure_string):
    structure = {}
    current_level = None
    current_module = None
    current_video = None

    tokens = re.split(r'(\w+\(\d+-)|\)', structure_string)
    tokens = [token for token in tokens if token and token != '-']

    for token in tokens:
        if token.startswith('level'):
            level_num = int(re.search(r'\d+', token).group())
            current_level = level_num
            structure[current_level] = {}
        elif token.startswith('module'):
            module_num = int(re.search(r'\d+', token).group())
            current_module = module_num
            structure[current_level][current_module] = {}
        elif token.startswith('video'):
            video_num = int(re.search(r'\d+', token).group())
            current_video = video_num
            structure[current_level][current_module][current_video] = {}
        elif token.startswith('quiz'):
            quiz_num = int(re.search(r'\d+', token).group())
            structure[current_level][current_module][current_video][quiz_num] = {}

    return structure

def populate_extra_info(courseObj,vals,files):
    if len(vals['courseHier']) > 0:
        info_struct = parse_structure(vals['courseHier'])
        level_ids = info_struct.keys()

        for i in level_ids:
            if not vals["level-temp-"+str(i)+"-title"]:
                continue
            try:
                levelObj = coursesModels.Level.objects.get(pk=int(vals["level-temp-"+str(i)+"-id"]))
            except:
                levelObj = coursesModels.Level()
            if vals["level-temp-"+str(i)+"-image-clear"] == "y":
                levelObj.image.delete()
            levelObj.course = courseObj
            levelObj.level_number = int(vals["level-temp-"+str(i)+"-level-no"])
            levelObj.title = vals["level-temp-"+str(i)+"-title"]
            levelObj.description = vals["level-temp-"+str(i)+"-desc"]
            try:
                levelObj.image = files["level-temp-"+str(i)+"-image"]
            except:
                pass
            levelObj.save()

            for j in info_struct[i].keys():
                if not vals["module-temp-"+str(j)+"-title"]:
                    continue
                try:
                    moduleObj = coursesModels.Module.objects.get(pk=int(vals["module-temp-"+str(j)+"-id"]))
                except:
                    moduleObj = coursesModels.Module()
                moduleObj.course = courseObj
                moduleObj.level = levelObj
                moduleObj.title = vals["module-temp-"+str(j)+"-title"]
                moduleObj.index = int(vals["module-temp-"+str(j)+"-index"])
                moduleObj.module_number = int(vals["module-temp-"+str(j)+"-module-no"])
                moduleObj.description = vals["module-temp-"+str(j)+"-desc"]
                try:
                    if vals["module-temp-"+str(j)+"-open"]:
                        moduleObj.open_videos = True
                except:
                    moduleObj.open_videos = False
                moduleObj.requierment = vals["module-temp-"+str(j)+"-req"]
                moduleObj.save()

                for k in info_struct[i][j].keys():
                    if not vals["video-temp-"+str(k)+"-title"]:
                        continue
                    try:
                        videoObj = coursesModels.Video.objects.get(pk=int(vals["video-temp-"+str(k)+"-id"]))
                    except:
                        videoObj = coursesModels.Video()
                    if vals["video-temp-"+str(k)+"-video-clear"] == "y":
                        videoObj.video_file.delete()
                    if vals["video-temp-"+str(k)+"-image-clear"] == "y":
                        videoObj.image.delete()
                    videoObj.course = courseObj
                    videoObj.module = moduleObj
                    videoObj.index = int(vals["video-temp-"+str(k)+"-index"])
                    videoObj.title = vals["video-temp-"+str(k)+"-title"]
                    videoObj.vimeo_url = vals["video-temp-"+str(k)+"-vimeo"]
                    try:
                        videoObj.video_file = files["video-temp-"+str(k)+"-video"]
                    except:
                        pass
                    try:
                        videoObj.image = files["video-temp-"+str(k)+"-image"]
                    except:
                        pass
                    videoObj.summary = vals["video-temp-"+str(k)+"-summary"]
                    videoObj.notes = vals["video-temp-"+str(k)+"-notes"]
                    videoObj.requierment = vals["video-temp-"+str(k)+"-req"]
                    videoObj.save()

                    for l in info_struct[i][j][k].keys():
                        if not vals["quiz-temp-"+str(l)+"-ques"]:
                            continue
                        try:
                            quizObj = coursesModels.Quiz.objects.get(pk=int(vals["quiz-temp-"+str(l)+"-id"]))
                        except:
                            quizObj = coursesModels.Quiz()
                        quizObj.course = courseObj
                        quizObj.video = videoObj
                        quizObj.question = vals["quiz-temp-"+str(l)+"-ques"]
                        quizObj.save()

                        if len(vals["quiz-temp-"+str(l)+"-answers"]):
                            tempOpts = vals["quiz-temp-"+str(l)+"-answers"].split("-")

                            for m in tempOpts:
                                if m and vals["quiz-temp-"+str(l)+"-title"+str(m)]:
                                    try:
                                        quizOptObj = coursesModels.QuizOption.objects.get(pk=int(vals["quiz-temp-"+str(l)+"-id"+str(m)]))
                                    except:
                                        quizOptObj = coursesModels.QuizOption()
                                    quizOptObj.quiz = quizObj
                                    quizOptObj.course = courseObj
                                    quizOptObj.text = vals["quiz-temp-"+str(l)+"-title"+str(m)]
                                    try:
                                        quizOptObj.image = files["quiz-temp-"+str(l)+"-image"+str(m)]
                                    except:
                                        pass
                                    quizOptObj.save()

                                    if vals["quiz-temp-"+str(l)+"-answer"] == str(m):
                                        quizObj.answer = quizOptObj
                                        quizObj.save()

        try:
            if vals['del-levels']:
                tempIds = vals['del-levels'].split("-")
                for i in tempIds:
                    try:
                        temp = coursesModels.Level.objects.get(pk=int(i))
                        temp.delete()
                    except:
                        pass
            if vals['del-modules']:
                tempIds = vals['del-modules'].split("-")
                for i in tempIds:
                    try:
                        temp = coursesModels.Module.objects.get(pk=int(i))
                        temp.delete()
                    except:
                        pass
            if vals['del-videos']:
                tempIds = vals['del-videos'].split("-")
                for i in tempIds:
                    try:
                        temp = coursesModels.Video.objects.get(pk=int(i))
                        temp.delete()
                    except:
                        pass
            if vals['del-quiz']:
                tempIds = vals['del-quiz'].split("-")
                for i in tempIds:
                    try:
                        temp = coursesModels.Quiz.objects.get(pk=int(i))
                        temp.delete()
                    except:
                        pass
            if vals['del-opt']:
                tempIds = vals['del-opt'].split("-")
                for i in tempIds:
                    try:
                        temp = coursesModels.QuizOption.objects.get(pk=int(i))
                        temp.delete()
                    except:
                        pass
        except:
            pass

    return

@login_required(login_url="/login")
def courses_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Courses"}

    context['profs'] = usersModels.Professor.objects.all()
    context['cats'] = coursesModels.Course.CATEGORY_CHOICES
    context['reqs'] = coursesModels.REQUIERMENTS

    try:
        if id != 0:
            obj = coursesModels.Course.objects.get(pk=id)
            context['obj'] = obj
            context['editFlow'] = True
            lc = 1
            mc = 1
            vc = 1
            qc = 1

            temp_list = []
            obj_levels = coursesModels.Level.objects.filter(course=obj)
            obj_modules = coursesModels.Module.objects.filter(course=obj)
            obj_videos = coursesModels.Video.objects.filter(course=obj)
            obj_quiz = coursesModels.Quiz.objects.filter(course=obj)
            obj_opts = coursesModels.QuizOption.objects.filter(course=obj)
            for i in obj_levels:
                temp_level = {'level':i, 'modules':[], 'num':lc}
                for j in obj_modules:
                    if j.level != i:
                        continue
                    temp_module = {'module':j, 'videos':[], 'num':mc}
                    for k in obj_videos:
                        if k.module != j:
                            continue
                        temp_video = {'video':k, 'quizs':[], 'num':vc}
                        for l in obj_quiz:
                            if l.video != k:
                                continue
                            temp_quiz = {'quiz':l, 'opts':[], 'num':qc}
                            for m in obj_opts:
                                if m.quiz != l:
                                    continue
                                temp_quiz['opts'].append(m)
                            temp_video["quizs"].append(temp_quiz)
                            qc += 1
                        temp_module["videos"].append(temp_video)
                        vc += 1
                    temp_level["modules"].append(temp_module)
                    mc += 1
                temp_list.append(temp_level)
                lc += 1

            context["levels"] = temp_list
            context['lc'] = lc
            context['mc'] = mc
            context['vc'] = vc
            context['qc'] = qc

            context['saving_check'] = request.session.get("saving_check",False)
            
    except:
        messages.error(request,"Course was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = coursesModels.Course()

        try:
            obj.img = request.FILES['image']
        except:
            pass
        try:
            obj.video_trailer = request.FILES['video']
        except:
            pass
        try:
            obj.professor = usersModels.Professor.objects.get(pk=int(request.POST['prof']))
        except:
            pass

        obj.title = request.POST['title']
        obj.url_title = request.POST['url-title']
        obj.description = request.POST['desc']
        obj.price = float(request.POST['price'])
        obj.discount_price = float(request.POST['disc-price'])
        obj.members_count = int(request.POST['mem'])
        obj.category = request.POST['cat']
        obj.course_requirements = request.POST['course-req']
        obj.course_features = request.POST['course-fea']

        if request.POST['image-clear'] == "y":
            obj.img.delete()
        if request.POST['video-clear'] == "y":
            obj.video_trailer.delete()

        obj.save()

        populate_extra_info(obj,request.POST,request.FILES)

        try:
            if request.POST["saving-check"]:
                request.session['saving_check'] = True
        except:
            request.session['saving_check'] = False

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/courses")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/courses-add/0")
        else:
            return redirect("/admin/courses-add/{}".format(obj.id))

    return render(request, 'admin/courses/courses-add.html', context)

@login_required(login_url="/login")
def user_course_progress_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add User Course Progress"}

    context["userobjs"] = usersModels.CustomUser.objects.all()
    context["courseobjs"] = coursesModels.Course.objects.all()
    context["levelobjs"] = coursesModels.Level.objects.all()
    context["moduleobjs"] = coursesModels.Module.objects.all()
    context["videoobjs"] = coursesModels.Video.objects.all()
    
    try:
        if id != 0:
            obj = coursesModels.UserCourseProgress.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"User Course Progress was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = coursesModels.UserCourseProgress()

        obj.user = usersModels.CustomUser.objects.get(pk=int(request.POST['user']))
        obj.course = coursesModels.Course.objects.get(pk=int(request.POST['course']))
        
        try:
            if request.POST["complete"]:
                obj.completed = True
        except:
            obj.completed = False

        obj.save()

        obj.completed_levels.clear()
        for i in request.POST['levels'].split(','):
            try:
                obj.completed_levels.add(coursesModels.Level.objects.get(pk=int(i)))
            except:
                pass
            
        obj.completed_modules.clear()
        for i in request.POST['modules'].split(','):
            try:
                obj.completed_modules.add(coursesModels.Module.objects.get(pk=int(i)))
            except:
                pass
                                     
        obj.completed_videos.clear()
        for i in request.POST['videos'].split(','):
            try:
                obj.completed_videos.add(coursesModels.Video.objects.get(pk=int(i)))
            except:
                pass
        
        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/user-course-progress")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/user-course-progress-add/0")
        else:
            return redirect("/admin/user-course-progress-add/{}".format(obj.id))
    
    return render(request, 'admin/courses/user_course_progress-add.html', context)


# -------------------------------------------


@login_required(login_url="/login")
def badges_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Badges"}

    try:
        if id != 0:
            obj = usersModels.Badge.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Rank was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = usersModels.Badge()

        try:
            obj.icon = request.FILES['icon']
        except:
            pass

        obj.title = request.POST['title']
        obj.index = request.POST['index']
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/badges")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/badges-add/0")
        else:
            return redirect("/admin/badges-add/{}".format(obj.id))

    return render(request, 'admin/users/badges-add.html', context)


@login_required(login_url="/login")
def custom_users_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Custom Users"}

    context['statuses'] = usersModels.CustomUser.STATUS
    context['ranks'] = ranksModels.Rank.objects.all()
    context['badges'] = usersModels.Badge.objects.all()
    context['courses'] = coursesModels.Course.objects.all()
    context['videos'] = coursesModels.Video.objects.all()
    context['products'] = productsModels.Product.objects.all()

    try:
        if id != 0:
            obj = usersModels.CustomUser.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"User was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = usersModels.CustomUser()

        if request.POST['pass']:
            obj.set_password(request.POST['pass'])
        if request.POST['dt']:
            obj.last_login = parse_datetime(request.POST['dt'])
        try:
            if request.POST["super"]:
                obj.is_superuser = True
        except:
            obj.is_superuser = False
        obj.first_name = request.POST['fname']
        obj.last_name = request.POST['lname']
        obj.email = request.POST['email']
        try:
            if request.POST["staff"]:
                obj.is_staff = True
        except:
            obj.is_staff = False
        try:
            if request.POST["active"]:
                obj.is_active = True
        except:
            obj.is_active = False
        if request.POST['dt1']:
            obj.date_joined = parse_datetime(request.POST['dt1'])
        obj.status = request.POST['status']
        obj.tel = request.POST['tel']
        obj.address = request.POST['address']
        try:
            obj.pfp = request.FILES['pfp']
        except:
            pass
        try:
            obj.rank = ranksModels.Rank.objects.get(pk=int(request.POST['rank']))
        except:
            pass
        obj.bio = request.POST['bio']
        if request.POST['dt2']:
            obj.last_added_points_time = parse_datetime(request.POST['dt2'])

        try:
            if request.POST["pgn"]:
                obj.p_general_n = True
        except:
            obj.p_general_n = False
        try:
            if request.POST["pcn"]:
                obj.p_chat_n = True
        except:
            obj.p_chat_n = False
        try:
            if request.POST["pcon"]:
                obj.p_courses_n = True
        except:
            obj.p_courses_n = False
        try:
            if request.POST["egn"]:
                obj.email_general_n = True
        except:
            obj.email_general_n = False
        try:
            if request.POST["ecn"]:
                obj.email_chat_n = True
        except:
            obj.email_chat_n = False
        try:
            if request.POST["econ"]:
                obj.email_courses_n = True
        except:
            obj.email_courses_n = False

        obj.points = int(request.POST['points'])
        obj.username = request.POST['username']
        obj.save()

        obj.enrolled_courses.clear()
        for i in request.POST['courses'].split(','):
            try:
                obj.enrolled_courses.add(coursesModels.Course.objects.get(pk=int(i)))
            except:
                pass
        obj.liked_videos.clear()
        for i in request.POST['videos'].split(','):
            try:
                obj.liked_videos.add(coursesModels.Video.objects.get(pk=int(i)))
            except:
                pass
        obj.liked_products.clear()
        for i in request.POST['products'].split(','):
            try:
                obj.liked_products.add(productsModels.Product.objects.get(pk=int(i)))
            except:
                pass
        obj.badges.clear()
        for i in request.POST['badges'].split(','):
            try:
                obj.badges.add(usersModels.Badge.objects.get(pk=int(i)))
            except:
                pass

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/custom-users")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/custom-users-add/0")
        else:
            return redirect("/admin/custom-users-add/{}".format(obj.id))

    return render(request, 'admin/users/customUsers-add.html', context)

@login_required(login_url="/login")
def professors_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Professors"}

    existing_profs = usersModels.Professor.objects.values('id')
    context['users'] = usersModels.CustomUser.objects.exclude(id__in=Subquery(existing_profs))

    try:
        if id != 0:
            obj = usersModels.Professor.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Professor was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = usersModels.Professor()

        obj.user = usersModels.CustomUser.objects.get(pk=int(request.POST['user']))
        obj.description = request.POST['desc']
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/professors")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/professors-add/0")
        else:
            return redirect("/admin/professors-add/{}".format(obj.id))

    return render(request, 'admin/users/professors-add.html', context)

@login_required(login_url="/login")
def transactions_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Transactions"}

    context["userobjs"] = usersModels.CustomUser.objects.all()
    context["typeof"] = usersModels.Transaction.TYPE

    try:
        if id != 0:
            obj = usersModels.Transaction.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Transaction was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = usersModels.Transaction()

        obj.user = usersModels.CustomUser.objects.get(pk=int(request.POST['user']))
        obj.type = request.POST['typeof']
        obj.pair = request.POST['pair']
        obj.amount = float(request.POST['amount'])

        if request.POST['dt']:
            obj.date = parse_datetime(request.POST['dt'])
        try:
            obj.icon = request.FILES['img']
        except:
            pass
        try:
            if request.POST["status"]:
                obj.status = True
        except:
            obj.status = False
        
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/transactions")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/transactions-add/0")
        else:
            return redirect("/admin/transactions-add/{}".format(obj.id))

    return render(request, 'admin/users/transactions-add.html', context)




@login_required(login_url="/login")
def groups_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Groups"}

    try:
        if id != 0:
            obj = Group.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Group was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = Group()

        
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/groups")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/groups-add/0")
        else:
            return redirect("/admin/groups-add/{}".format(obj.id))

    return render(request, 'admin/courses/courses-add.html', context)

@login_required(login_url="/login")
def users_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    context = { "pageTitle": "Add Users"}
    return render(request, 'admin/courses/courses-add.html', context)




@login_required(login_url="/login")
def private_session_requests_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Private Session Requests"}

    context["modes"] = privateSessionsModels.PrivateSessionRequest.TYPES
    context["durations"] = privateSessionsModels.PrivateSessionRequest.DURATION_CHOICES
    context["profs"] = privateSessionsModels.PrivateSessionRequest.PROFESSOR_CHOICES

    try:
        if id != 0:
            obj = privateSessionsModels.PrivateSessionRequest.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Private Session Request was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = privateSessionsModels.PrivateSessionRequest()

        obj.session_mode = request.POST['mode']
        obj.first_name = request.POST['fname']
        obj.last_name = request.POST['lname']
        obj.email = request.POST['email']
        obj.phone = request.POST['phone']
        try:
            obj.duration_hours = int(request.POST['duration'])
        except:
            pass
        obj.selected_professor = request.POST['prof']
        try:
            obj.session_date = parse_datetime(request.POST['dt'])
        except:
            pass
        obj.additional_notes = request.POST['notes']
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/private-session-requests")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/private-session-requests-add/0")
        else:
            return redirect("/admin/private-session-requests-add/{}".format(obj.id))

    return render(request, 'admin/privateSessions/requests-add.html', context)

@login_required(login_url="/login")
def private_sessions_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Private Sessions"}

    context["status"] = privateSessionsModels.PrivateSession.STATUS_CHOICES
    context["students"] = usersModels.CustomUser.objects.all()
    context["profs"] = usersModels.Professor.objects.all()
    context["courses"] = coursesModels.Course.objects.all()
    context["durations"] = privateSessionsModels.PrivateSession.DURATION_CHOICES
    context["modes"] = privateSessionsModels.PrivateSession.TYPE_CHOICES

    try:
        if id != 0:
            obj = privateSessionsModels.PrivateSession.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Private Session was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = privateSessionsModels.PrivateSession()

        obj.status = request.POST['status']
        if request.POST['std']:
            obj.student = usersModels.CustomUser.objects.get(pk=int(request.POST['std']))
        obj.professor = usersModels.Professor.objects.get(pk=int(request.POST['prof']))
        obj.cours = coursesModels.Course.objects.get(pk=int(request.POST['course']))
        obj.schedule = parse_datetime(request.POST['dt'])
        temp = request.POST['duration']
        hours, minutes, seconds = map(int, temp.split(':'))
        obj.duration = timedelta(hours=hours, minutes=minutes, seconds=seconds)
        obj.first_name = request.POST['fname']
        obj.last_name = request.POST['lname']
        obj.email = request.POST['email']
        obj.phone_number = request.POST['phone']
        obj.session_mode = request.POST['mode']
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/private-sessions")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/private-sessions-add/0")
        else:
            return redirect("/admin/private-sessions-add/{}".format(obj.id))

    return render(request, 'admin/privateSessions/sessions-add.html', context)




@login_required(login_url="/login")
def colors_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Colors"}

    try:
        if id != 0:
            obj = productsModels.Color.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Color was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = productsModels.Color()
        
        obj.name = request.POST['color']
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/colors")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/colors-add/0")
        else:
            return redirect("/admin/colors-add/{}".format(obj.id))

    return render(request, 'admin/products/colors-add.html', context)

@login_required(login_url="/login")
def products_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Products"}

    context['cats'] = productsModels.Product.CATEGORIES
    context['sizes'] = productsModels.Size.objects.all()
    context['colors'] = productsModels.Color.objects.all()
    context['prods'] = productsModels.Product.objects.all()

    try:
        if id != 0:
            obj = productsModels.Product.objects.get(pk=id)
            context['obj'] = obj
            context['prods'] = productsModels.Product.objects.exclude(pk=obj.id)
            context['editFlow'] = True
            templist = productsModels.SubImage.objects.filter(product=obj)
            context["itemobjs"] = templist
            context["itemcount"] = len(templist)
            templist2 = productsModels.Deal.objects.filter(product=obj)
            context["itemobjsd"] = templist2
            context["itemcountd"] = len(templist2)
    except:
        messages.error(request,"Product was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = productsModels.Product()
        
        obj.category = request.POST['cat']
        obj.title = request.POST['title']
        obj.description = request.POST['desc']
        try:
            obj.image = request.FILES['img']
        except:
            pass
        obj.oldPrice = float(request.POST['oprice'])
        obj.price = float(request.POST['price'])
        try:
            if request.POST["avail"]:
                obj.is_available = True
        except:
            obj.is_available = False
        obj.quantity = int(request.POST['quant'])
        obj.save()

        obj.colors.clear()
        for i in request.POST['colors'].split(','):
            try:
                obj.colors.add(productsModels.Color.objects.get(pk=int(i)))
            except:
                pass
        obj.sizes.clear()
        for i in request.POST['sizes'].split(','):
            try:
                obj.sizes.add(productsModels.Size.objects.get(pk=int(i)))
            except:
                pass
        obj.relatedProducts.clear()
        for i in request.POST['products'].split(','):
            try:
                obj.relatedProducts.add(productsModels.Product.objects.get(pk=int(i)))
            except:
                pass

        # Sub Images
        if request.POST['item-ids']:
            tempIds = request.POST['item-ids'].split("-")
            for i in tempIds:
                try:
                    if request.FILES['img-'+i]:
                        try:
                            objItem = productsModels.SubImage.objects.get(pk=int(request.POST['id-'+i]))
                        except:
                            objItem = productsModels.SubImage()
                        objItem.product = obj
                        objItem.sub_image = request.FILES['img-'+i]
                        objItem.save()
                except:
                    pass

        try:
            if request.POST['del-ids']:
                tempIds = request.POST['del-ids'].split("-")
                for i in tempIds:
                    try:
                        temp = productsModels.SubImage.objects.get(pk=int(i))
                        temp.delete()
                    except:
                        pass
        except:
            pass

        # Deals
        if request.POST['item-idsd']:
            tempIds = request.POST['item-idsd'].split("-")
            for i in tempIds:
                try:
                    if request.FILES['imgd-'+i]:
                        try:
                            objItem = productsModels.Deal.objects.get(pk=int(request.POST['idd-'+i]))
                        except:
                            objItem = productsModels.Deal()
                        objItem.product = obj
                        objItem.banner = request.FILES['imgd-'+i]
                        objItem.save()
                except:
                    pass

        try:
            if request.POST['del-idsd']:
                tempIds = request.POST['del-idsd'].split("-")
                for i in tempIds:
                    try:
                        temp = productsModels.Deal.objects.get(pk=int(i))
                        temp.delete()
                    except:
                        pass
        except:
            pass
        

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/products")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/products-add/0")
        else:
            return redirect("/admin/products-add/{}".format(obj.id))

    return render(request, 'admin/products/products-add.html', context)

@login_required(login_url="/login")
def reviews_and_ratings_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Reviews And Ratings"}

    context["users"] = usersModels.CustomUser.objects.all()
    context["products"] = productsModels.Product.objects.all()
    context["ratings"] = productsModels.RATING

    try:
        if id != 0:
            obj = productsModels.Review.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Reviews And Rating was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = productsModels.Review()
        
        try:
            obj.user = usersModels.CustomUser.objects.get(pk=int(request.POST['user']))
        except:
            pass
        try:
            obj.product = productsModels.Product.objects.get(pk=int(request.POST['prod']))
        except:
            pass
        obj.review = request.POST['rev']
        obj.reply = request.POST['reply']
        obj.rating = request.POST['rat']
        try:
            if request.POST["active"]:
                obj.active = True
        except:
            obj.active = False
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/reviews-and-ratings")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/reviews-and-ratings-add/0")
        else:
            return redirect("/admin/reviews-and-ratings-add/{}".format(obj.id))

    return render(request, 'admin/products/review-add.html', context)

@login_required(login_url="/login")
def sizes_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Sizes"}

    try:
        if id != 0:
            obj = productsModels.Size.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Size was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = productsModels.Size()
        
        obj.name = request.POST['size']
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/sizes")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/sizes-add/0")
        else:
            return redirect("/admin/sizes-add/{}".format(obj.id))
    
    return render(request, 'admin/products/sizes-add.html', context)




@login_required(login_url="/login")
def orders_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Orders"}

    context["users"] = usersModels.CustomUser.objects.all()
    context["status"] = ordersModels.Order.STATUS_CHOICES
    context["ship"] = ordersModels.Order.SHIPPING_CHOICES
    context["pay"] = ordersModels.Order.PAYMENT_METHOD_CHOICES
    context["prods"] = productsModels.Product.objects.all()
    context["colors"] = productsModels.Color.objects.all()
    context["sizes"] = productsModels.Size.objects.all()

    try:
        if id != 0:
            obj = ordersModels.Order.objects.get(pk=id)
            context['obj'] = obj
            context['editFlow'] = True
            templist = ordersModels.OrderItem.objects.filter(order=obj)
            context["itemobjs"] = templist
            context["itemcount"] = len(templist)

    except:
        messages.error(request,"Order was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = ordersModels.Order()
        
        obj.user = usersModels.CustomUser.objects.get(pk=int(request.POST['user']))
        obj.status = request.POST['status']
        if request.POST['ship']:
            obj.shipping_method = int(request.POST['ship'])
        obj.price = float(request.POST['price'])
        obj.first_name = request.POST['fname']
        obj.last_name = request.POST['lname']
        obj.address = request.POST['address']
        obj.city = request.POST['city']
        obj.state = request.POST['state']
        obj.zip_code = request.POST['zip']
        obj.payment_method = request.POST['pay']
        obj.save()

        if request.POST['item-ids']:
            tempIds = request.POST['item-ids'].split("-")
            for i in tempIds:
                try:
                    if request.POST['prod-'+i]:
                        try:
                            objItem = ordersModels.OrderItem.objects.get(pk=int(request.POST['id-'+i]))
                        except:
                            objItem = ordersModels.OrderItem()
                        objItem.order = obj
                        objItem.product = productsModels.Product.objects.get(pk=int(request.POST['prod-'+i]))
                        objItem.quantity = int(request.POST['quant-'+i])
                        objItem.color = request.POST['color-'+i]
                        objItem.size = request.POST['size-'+i]
                        objItem.save()
                except:
                    pass

        try:
            if request.POST['del-ids']:
                tempIds = request.POST['del-ids'].split("-")
                for i in tempIds:
                    try:
                        temp = ordersModels.OrderItem.objects.get(pk=int(i))
                        temp.delete()
                    except:
                        pass
        except:
            pass

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/orders")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/orders-add/0")
        else:
            return redirect("/admin/orders-add/{}".format(obj.id))

    return render(request, 'admin/orders/orders-add.html', context)




@login_required(login_url="/login")
def carts_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Carts"}

    context['userobjs'] = usersModels.CustomUser.objects.all()
    context['coupons'] = cartsModels.Coupon.objects.all()
    context['prods'] = productsModels.Product.objects.all()

    try:
        if id != 0:
            obj = cartsModels.Cart.objects.get(pk=id)
            context['obj'] = obj
            context['editFlow'] = True
            templist = cartsModels.CartItem.objects.filter(cart=obj)
            context["itemobjs"] = templist
            context["itemcount"] = len(templist)
    except:
        messages.error(request,"Cart was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = cartsModels.Cart()
        
        if request.POST['user']:
            obj.user = usersModels.CustomUser.objects.get(pk=int(request.POST['user']))
        if request.POST['dt']:
            obj.created_at = parse_datetime(request.POST['dt'])
        obj.shippingCost = int(request.POST['amount'])
        if request.POST['coupon']:
            obj.coupon = cartsModels.Coupon.objects.get(pk=int(request.POST['coupon']))
        obj.save()

        if request.POST['item-ids']:
            tempIds = request.POST['item-ids'].split("-")
            for i in tempIds:
                try:
                    if request.POST['prod-'+i]:
                        try:
                            objItem = cartsModels.CartItem.objects.get(pk=int(request.POST['id-'+i]))
                        except:
                            objItem = cartsModels.CartItem()
                        objItem.cart = obj
                        objItem.product = productsModels.Product.objects.get(pk=int(request.POST['prod-'+i]))
                        objItem.quantity = int(request.POST['quant-'+i])
                        objItem.color = request.POST['color-'+i]
                        objItem.size = request.POST['size-'+i]
                        objItem.save()
                except:
                    pass

        try:
            if request.POST['del-ids']:
                tempIds = request.POST['del-ids'].split("-")
                for i in tempIds:
                    try:
                        temp = cartsModels.CartItem.objects.get(pk=int(i))
                        temp.delete()
                    except:
                        pass
        except:
            pass

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/carts")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/carts-add/0")
        else:
            return redirect("/admin/carts-add/{}".format(obj.id))

    return render(request, 'admin/carts/carts-add.html', context)

@login_required(login_url="/login")
def coupons_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Coupons"}

    try:
        if id != 0:
            obj = cartsModels.Coupon.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Coupon was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = cartsModels.Coupon()
        
        obj.code = request.POST['code']
        obj.discount = int(request.POST['disc'])
        try:
            if request.POST["active"]:
                obj.active = True
        except:
            obj.active = False
        obj.valid_from = parse_date(request.POST['from'])
        obj.valid_to = parse_date(request.POST['to'])
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/coupons")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/coupons-add/0")
        else:
            return redirect("/admin/coupons-add/{}".format(obj.id))

    return render(request, 'admin/carts/coupons-add.html', context)




@login_required(login_url="/login")
def ranks_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Ranks"}
    
    try:
        if id != 0:
            obj = ranksModels.Rank.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Rank was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = ranksModels.Rank()

        try:
            obj.icon = request.FILES['icon']
        except:
            pass

        obj.title = request.POST['title']
        obj.points = request.POST['points']
        print(request.POST['color'])
        obj.color = request.POST['color']
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/ranks")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/ranks-add/0")
        else:
            return redirect("/admin/ranks-add/{}".format(obj.id))
    
    return render(request, 'admin/ranks/ranks-add.html', context)




@login_required(login_url="/login")
def chat_messages_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Messages"}

    context["users"] = usersModels.CustomUser.objects.all()
    context["rooms"] = chatModels.Room.objects.all()

    try:
        if id != 0:
            obj = chatModels.Message.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Message was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = chatModels.Message()
        
        obj.user = usersModels.CustomUser.objects.get(pk=int(request.POST['user']))
        obj.room = chatModels.Room.objects.get(pk=int(request.POST['room']))
        obj.content = request.POST['content']
        try:
            obj.file = request.FILES['file']
        except:
            pass
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/chat-messages")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/chat-messages-add/0")
        else:
            return redirect("/admin/chat-messages-add/{}".format(obj.id))

    return render(request, 'admin/chat/messages-add.html', context)

@login_required(login_url="/login")
def notifications_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Notifications"}

    context["users"] = usersModels.CustomUser.objects.all()
    context["msgs"] = chatModels.Message.objects.all()
    context["courses"] = coursesModels.Course.objects.all()
    context["levels"] = coursesModels.Level.objects.all()
    context["products"] = productsModels.Product.objects.all()

    try:
        if id != 0:
            obj = chatModels.Notification.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Notification was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = chatModels.Notification()
        
        obj.user = usersModels.CustomUser.objects.get(pk=int(request.POST['user']))
        if request.POST['msg']:
            obj.message = chatModels.Message.objects.get(pk=int(request.POST['msg']))
        if request.POST['course']:
            obj.course = coursesModels.Course.objects.get(pk=int(request.POST['course']))
        if request.POST['level']:
            obj.level = coursesModels.Level.objects.get(pk=int(request.POST['level']))
        if request.POST['product']:
            obj.product = productsModels.Product.objects.get(pk=int(request.POST['product']))
        obj.content = request.POST['content']
        obj.link = request.POST['link']
        try:
            obj.icon = request.FILES['file']
        except:
            pass
        try:
            if request.POST["read"]:
                obj.read = True
        except:
            obj.read = False
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/notifications")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/notifications-add/0")
        else:
            return redirect("/admin/notifications-add/{}".format(obj.id))

    return render(request, 'admin/chat/notifications-add.html', context)

@login_required(login_url="/login")
def rooms_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Rooms"}

    context['sections'] = chatModels.Section.objects.all()
    
    try:
        if id != 0:
            obj = chatModels.Room.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Room was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = chatModels.Room()
        
        obj.section = chatModels.Section.objects.get(pk=int(request.POST['section']))
        obj.name = request.POST['name']
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/rooms")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/rooms-add/0")
        else:
            return redirect("/admin/rooms-add/{}".format(obj.id))
    
    return render(request, 'admin/chat/rooms-add.html', context)

@login_required(login_url="/login")
def sections_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Sections"}
    
    try:
        if id != 0:
            obj = chatModels.Section.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Section was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = chatModels.Section()
        
        obj.index = request.POST['index']
        obj.name = request.POST['name']
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/sections")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/sections-add/0")
        else:
            return redirect("/admin/sections-add/{}".format(obj.id))
    
    return render(request, 'admin/chat/sections-add.html', context)




@login_required(login_url="/login")
def dashboard_logs_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Dashboard Logs"}

    try:
        if id != 0:
            obj = pagesModels.dashboardLog.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Dashboard Log was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = pagesModels.dashboardLog()
        
        obj.balance = int(request.POST['bal'])
        obj.timestamp = parse_datetime(request.POST['dt'])
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/dashboard-logs")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/dashboard-logs-add/0")
        else:
            return redirect("/admin/dashboard-logs-add/{}".format(obj.id))

    return render(request, 'admin/pages/dashboard-logs-add.html', context)

@login_required(login_url="/login")
def dashboards_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Dashboards"}

    try:
        if id != 0:
            obj = pagesModels.Dashboard.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Dashboard was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = pagesModels.Dashboard()
        
        obj.objectif = int(request.POST['objectif'])
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/dashboards")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/dashboards-add/0")
        else:
            return redirect("/admin/dashboards-add/{}".format(obj.id))

    return render(request, 'admin/pages/dashboards-add.html', context)

@login_required(login_url="/login")
def features_youtube_videos_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Feature Youtube Videos"}

    try:
        if id != 0:
            obj = pagesModels.FeaturedYoutubeVideo.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Featured Youtube Video was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = pagesModels.FeaturedYoutubeVideo()
        
        obj.video_url = request.POST['url']
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/features-youtube-videos")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/features-youtube-videos-add/0")
        else:
            return redirect("/admin/features-youtube-videos-add/{}".format(obj.id))

    return render(request, 'admin/pages/features-add.html', context)

@login_required(login_url="/login")
def feedbacks_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Feedbacks"}

    context["users"] = usersModels.CustomUser.objects.all()
    context["choices"] = pagesModels.Feedback.FEEDBACKS

    try:
        if id != 0:
            obj = pagesModels.Feedback.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Feedback was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = pagesModels.Feedback()
        
        obj.feedback_choice = request.POST['fb']
        obj.user = usersModels.CustomUser.objects.get(pk=int(request.POST['user']))
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/feedbacks")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/feedbacks-add/0")
        else:
            return redirect("/admin/feedbacks-add/{}".format(obj.id))

    return render(request, 'admin/pages/feedbacks-add.html', context)

@login_required(login_url="/login")
def homes_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Homes"}

    context["courses"] = coursesModels.Course.objects.all()

    try:
        if id != 0:
            obj = pagesModels.Home.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Home was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = pagesModels.Home()
        
        obj.featured_course = coursesModels.Course.objects.get(pk=int(request.POST['course']))
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/homes")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/homes-add/0")
        else:
            return redirect("/admin/homes-add/{}".format(obj.id))

    return render(request, 'admin/pages/homes-add.html', context)

@login_required(login_url="/login")
def onboarding_questions_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Onboarding Questions"}

    context['qtypes'] = pagesModels.OnBoardingQuestion.QTYPES

    try:
        if id != 0:
            obj = pagesModels.OnBoardingQuestion.objects.get(pk=id)
            context['obj'] = obj
            context['editFlow'] = True
            templist = pagesModels.OnBoardingOption.objects.filter(question=obj)
            context["itemobjs"] = templist
            context["itemcount"] = len(templist)
    except:
        messages.error(request,"Onboarding Questions was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = pagesModels.OnBoardingQuestion()
        
        obj.index = int(request.POST['amount'])
        obj.question_type = request.POST['qtype']
        obj.question = request.POST['ques']
        obj.save()

        if request.POST['item-ids']:
            tempIds = request.POST['item-ids'].split("-")
            for i in tempIds:
                try:
                    if request.POST['text-'+i] or request.FILES['img-'+i]:
                        try:
                            objItem = pagesModels.OnBoardingOption.objects.get(pk=int(request.POST['id-'+i]))
                        except:
                            objItem = pagesModels.OnBoardingOption()
                        objItem.question = obj
                        objItem.text = request.POST['text-'+i]
                        try:
                            objItem.img = request.FILES['img-'+i]
                        except:
                            pass
                        objItem.save()
                except:
                    pass

        try:
            if request.POST['del-ids']:
                tempIds = request.POST['del-ids'].split("-")
                for i in tempIds:
                    try:
                        temp = pagesModels.OnBoardingOption.objects.get(pk=int(i))
                        temp.delete()
                    except:
                        pass
        except:
            pass

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/onboarding-questions")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/onboarding-questions-add/0")
        else:
            return redirect("/admin/onboarding-questions-add/{}".format(obj.id))

    return render(request, 'admin/pages/onboardingQs-add.html', context)

@login_required(login_url="/login")
def opt_ins_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Opt Ins"}

    try:
        if id != 0:
            obj = pagesModels.OptIn.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Opt In was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = pagesModels.OptIn()
        
        obj.email = request.POST['email']
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/opt-ins")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/opt-ins-add/0")
        else:
            return redirect("/admin/opt-ins-add/{}".format(obj.id))

    return render(request, 'admin/pages/optins-add.html', context)

@login_required(login_url="/login")
def podcasts_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Podcasts"}

    try:
        if id != 0:
            obj = pagesModels.Podcast.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Podcast was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = pagesModels.Podcast()
        
        obj.name = request.POST['name']
        obj.description = request.POST['desc']
        try:
            obj.image = request.FILES['img']
        except:
            pass
        try:
            obj.banner = request.FILES['banner']
        except:
            pass
        try:
            obj.mp3 = request.FILES['mp3']
        except:
            pass
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/podcasts")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/podcasts-add/0")
        else:
            return redirect("/admin/podcasts-add/{}".format(obj.id))

    return render(request, 'admin/pages/podcasts-add.html', context)

@login_required(login_url="/login")
def quests_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Quests"}

    try:
        if id != 0:
            obj = pagesModels.Quest.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Quest was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = pagesModels.Quest()
        
        obj.title = request.POST['title']
        obj.description = request.POST['desc']
        try:
            obj.image = request.FILES['img']
        except:
            pass
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/quests")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/quests-add/0")
        else:
            return redirect("/admin/quests-add/{}".format(obj.id))

    return render(request, 'admin/pages/quests-add.html', context)

@login_required(login_url="/login")
def slider_images_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Slider Images"}

    try:
        if id != 0:
            obj = pagesModels.SliderImage.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Slider Image was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = pagesModels.SliderImage()
        
        obj.alt_text = request.POST['text']
        try:
            obj.image = request.FILES['img']
        except:
            pass
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/slider-images")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/slider-images-add/0")
        else:
            return redirect("/admin/slider-images-add/{}".format(obj.id))

    return render(request, 'admin/pages/sliderImages-add.html', context)

@login_required(login_url="/login")
def steps_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add Steps"}

    context["quests"] = pagesModels.Quest.objects.all()

    try:
        if id != 0:
            obj = pagesModels.Step.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"Step was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = pagesModels.Step()
        
        obj.title = request.POST['title']
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/steps")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/steps-add/0")
        else:
            return redirect("/admin/steps-add/{}".format(obj.id))

    return render(request, 'admin/pages/steps-add.html', context)

@login_required(login_url="/login")
def user_quest_progress_add(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    check = True
    context = { "pageTitle": "Add User Quest Progress"}

    context['users'] = usersModels.CustomUser.objects.all()
    context['quests'] = pagesModels.Quest.objects.all()
    context['steps'] = pagesModels.Step.objects.all()

    try:
        if id != 0:
            obj = pagesModels.UserQuestProgress.objects.get(pk=id)
            context['obj'] = obj
    except:
        messages.error(request,"User Quest 333333333Progress was not found")
        check = False

    if request.method == 'POST' and check:
        if id == 0:
            obj = pagesModels.UserQuestProgress()
        
        obj.user = usersModels.CustomUser.objects.get(pk=int(request.POST['user']))
        obj.quest = pagesModels.Quest.objects.get(pk=int(request.POST['quest']))
        try:
            obj.current_step = pagesModels.Step.objects.get(pk=int(request.POST['step']))
        except:
            pass
        obj.points_earned = int(request.POST['points'])
        obj.save()

        if id == 0:
            messages.success(request,"{} added successfully!".format(obj))
        else:
            messages.success(request,"{} modified successfully!".format(obj))

        if request.POST['actionSubmit'] == '1':
            return redirect("/admin/user-quest-progress")
        elif request.POST['actionSubmit'] == '2':
            return redirect("/admin/user-quest-progress-add/0")
        else:
            return redirect("/admin/user-quest-progress-add/{}".format(obj.id))

    return render(request, 'admin/pages/userQuestProg-add.html', context)



@login_required(login_url="/login")
def course_order_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = coursesModels.CourseOrder.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/course-order")

@login_required(login_url="/login")
def courses_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = coursesModels.Course.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/courses")

@login_required(login_url="/login")
def user_course_progress_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = coursesModels.UserCourseProgress.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/user-course-progress")

@login_required(login_url="/login")
def badges_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = usersModels.Badge.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/badges")

@login_required(login_url="/login")
def custom_users_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = usersModels.CustomUser.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/custom-users")

@login_required(login_url="/login")
def professors_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = usersModels.Professor.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/professors")

@login_required(login_url="/login")
def transactions_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = usersModels.Transaction.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/transactions")

@login_required(login_url="/login")
def groups_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = Group.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/groups")

@login_required(login_url="/login")
def users_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = User.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/users")

@login_required(login_url="/login")
def private_session_requests_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = privateSessionsModels.PrivateSessionRequest.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/private-session-requests")

@login_required(login_url="/login")
def private_sessions_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = privateSessionsModels.PrivateSession.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/private-sessions")

@login_required(login_url="/login")
def colors_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = productsModels.Color.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/colors")

@login_required(login_url="/login")
def products_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = productsModels.Product.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/products")

@login_required(login_url="/login")
def reviews_and_ratings_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = productsModels.Review.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/reviews-and-ratings")

@login_required(login_url="/login")
def sizes_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = productsModels.Size.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/sizes")

@login_required(login_url="/login")
def orders_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = ordersModels.Order.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/orders")

@login_required(login_url="/login")
def carts_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = cartsModels.Cart.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/carts")

@login_required(login_url="/login")
def coupons_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = cartsModels.Coupon.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/coupons")

@login_required(login_url="/login")
def ranks_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = ranksModels.Rank.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/ranks")

@login_required(login_url="/login")
def chat_messages_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = chatModels.Message.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/chat-messages")

@login_required(login_url="/login")
def notifications_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = chatModels.Notification.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/notifications")

@login_required(login_url="/login")
def rooms_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = chatModels.Room.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/rooms")

@login_required(login_url="/login")
def sections_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = chatModels.Section.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/sections")

@login_required(login_url="/login")
def dashboard_logs_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = pagesModels.dashboardLog.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/dashboard-logs")

@login_required(login_url="/login")
def dashboards_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = pagesModels.Dashboard.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/dashboards")

@login_required(login_url="/login")
def features_youtube_videos_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = pagesModels.FeaturedYoutubeVideo.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/features-youtube-videos")

@login_required(login_url="/login")
def feedbacks_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = pagesModels.Feedback.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/feedbacks")

@login_required(login_url="/login")
def homes_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = pagesModels.Home.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/homes")

@login_required(login_url="/login")
def onboarding_questions_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = pagesModels.OnBoardingQuestion.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/onboarding-questions")

@login_required(login_url="/login")
def opt_ins_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = pagesModels.OptIn.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/opt-ins")

@login_required(login_url="/login")
def podcasts_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = pagesModels.Podcast.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/podcasts")

@login_required(login_url="/login")
def quests_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = pagesModels.Quest.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/quests")

@login_required(login_url="/login")
def slider_images_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = pagesModels.SliderImage.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/slider-images")

@login_required(login_url="/login")
def steps_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = pagesModels.Step.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/steps")

@login_required(login_url="/login")
def user_quest_progress_delete(request,id):
    if not request.user.is_superuser:
        return redirect("/")
    
    obj = pagesModels.UserQuestProgress.objects.get(pk=id)
    tempstr = obj.__str__()

    try:
        obj.delete()
        messages.success(request,"{} deleted successfully!".format(tempstr))
    except:
        messages.error(request,"Unable to delete {}".format(tempstr))
    
    return redirect("/admin/user-quest-progress")





#-------------------------General(Dashboards,Widgets & Layout)---------------------------------------

# #---------------Dashboards

@login_required(login_url="/login")
def index(request):
    if (request.user.is_superuser == False):
        return redirect("/")
    userobjs = usersModels.CustomUser.objects.all()
    monthlyUserCount = [0,0,0,0,0,0,0,0,0,0,0,0]
    totalUsers = 0
    thisMonthUser = 0
    for i in userobjs:
        monthlyUserCount[i.date_joined.month-1] = monthlyUserCount[i.date_joined.month-1] + 1
        totalUsers += 1
        if (datetime.now().month == i.date_joined.month):
            thisMonthUser += 1

    transObjs = usersModels.Transaction.objects.all()
    monthlyProfit = [0,0,0,0,0,0,0,0,0,0,0,0]
    monthlyLoss = [0,0,0,0,0,0,0,0,0,0,0,0]
    for i in transObjs:
        if (i.type == 'profit'):
            monthlyProfit[i.date.month-1] = monthlyProfit[i.date.month-1] + i.amount
        else:
            monthlyLoss[i.date.month-1] = monthlyLoss[i.date.month-1] - i.amount

    context = { "pageTitle": "Administration Dashboard",
               "monthlyUsers": monthlyUserCount, "totalUsers": totalUsers, "thisMonthUser": thisMonthUser,
               "monthlyAmountsProfit": monthlyProfit, "monthlyAmountsLoss": monthlyLoss, }
    






    # ID of the course to remove
    course_id = 3

    # # Get the course object
    # try:
    #     course = coursesModels.Course.objects.get(id=course_id)
    # except coursesModels.Course.DoesNotExist:
    #     print(f"Course with ID {course_id} does not exist.")
    #     course = None

    # if course:
    #     # Fetch all users
    #     users = usersModels.CustomUser.objects.all()

    #     # Iterate over each user to remove the course if enrolled
    #     for user in users:
    #         if course in user.enrolled_courses.all():
    #             user.enrolled_courses.remove(course)
    #             user.save()
    #             print(f"Removed course {course_id} from user {user.username} ({user.email})")

    #     print("Course removal complete.")











    # Define the path to your CSV file
    csv_file_path = '/usr/local/lsws/Example/html/TTG/updated_filtered_contacts.csv'
    #csv_file_path = 'C:/Users/anonymous/Documents/TunisianTopGs/src/updated_filtered_contacts.csv'
    emails_added_to_course = []

    emails_to_update = [
        "ahmadazizbelkahia@gmail.com",
        "yousseflimem549@gmail.com",
        "mouhamedbenarbia08@gmail.com",
        "wael6539@gmail.com",
        "Hasnaouiwael5@gmail.com",
        "o6844734@gmail.com",
        "Mouhibbj@icloud.com",
        "medazizh31@gmail.com",
        "raedzouitina11@gmail.com",
        "dhiachahed08@gmail.com",
        "taktakrayen2005@gmail.com",
        "yassinekhbtn@gmail.com",
        "nassirplay6@gmail.com",
        "bnayoub69@gmail.com",
        "medmalekkaouach@gmail.com",
        "j00yassinjouli@gmail.com",
        "Dhiajlaiel05@gmail.com",
        "faze7616@gmail.com",
        "dhia2006.jemli@gmail.com",
        "ghassenwed0000@gmail.com",
        "arbiaziz434@gmail.com",
        "jedlimedamine@gmail.com",
        "mouhamedjelassi2004@gmail.com",
        "ranimzghab@gmail.com",
        "spyyt4299@gmail.com",
        "seif.hrizi2@gmail.com",
        "ahmedbrahim200427@gmail.com",
        "raedhmida16@gmail.com",
        "amina.mechri21@gmail.com",
        "J00yassinjouili12@gmail.com",
        "saifxvii@gmail.com",
        "mouhanedboch2@gmail.com",
        "rayengaabout@gmail.com",
        "manelnasr698@gmail.com",
        "oussemasammeri@gmail.com",
        "mouhedinnerekik@gmail.com"
    ]

    try:
        course = coursesModels.Course.objects.get(id=course_id)
    except coursesModels.Course.DoesNotExist:
        print(f"Course with ID {course_id} does not exist.")
        course = None


    @shared_task
    def send_course_email(user_email, course_title):
        subject = 'WELCOME TO TUNISIAN TOP GS!'
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [user_email]

        # Render the email body from the HTML template
        html_message = render_to_string('C:/Users/anonymous/Documents/TunisianTopGs/src/templates/email.html', {
            'course_name': course_title,
            'user_email': user_email,
        })
        message = EmailMessage(subject, html_message, from_email, recipient_list)
        message.content_subtype = 'html'  # This is important to send HTML emails
        message.send()

    if course:
        def process_csv_emails(file_path):
            try:
                with open(file_path, mode='r', encoding='utf-8') as csvfile:
                    reader = csv.DictReader(csvfile)
                    for row in reader:
                        email = row.get('Email')
                        subscribed = row.get('Subscribed', '').lower() == 'true'
                        bought_course_date = row.get('Bought_Course_Date', None)
                        
                        if email and subscribed:
                            try:
                                user = usersModels.CustomUser.objects.get(email=email)
                                if course not in user.enrolled_courses.all():
                                    user.enrolled_courses.add(course)
                                    if bought_course_date:
                                        user.bought_course_date = datetime.strptime(bought_course_date, '%Y-%m-%dT%H:%M:%S.%fZ').date()
                                    user.save()
                                    emails_added_to_course.append(email)
                            except usersModels.CustomUser.DoesNotExist:
                                pass
            except UnicodeDecodeError as e:
                print(f"Error reading the CSV file: {e}")

        process_csv_emails(csv_file_path)

        for email in emails_to_update:
            try:
                user = usersModels.CustomUser.objects.get(email=email)
                if course not in user.enrolled_courses.all():
                    user.enrolled_courses.add(course)
                    # user.bought_course_date = datetime.today().date()  # Set today's date if no date is provided
                    user.save()
                    emails_added_to_course.append(email)
                    
            except usersModels.CustomUser.DoesNotExist:
                pass

        for email in emails_added_to_course:
            send_course_email.apply_async(args=[email, course.title], countdown=10)




    return render(request,'index.html',context)





@login_required(login_url="/login_home")
def dashboard_02(request):
    context = { "breadcrumb":{"title":"Ecommerce Dashboard","parent":"Dashboard", "child":"E-commerce"}} 
    return render(request,"general/dashboard/ecommerce/dashboard-02.html",context)

@login_required(login_url="/login_home")
def dashboard_03(request):
    context = { "breadcrumb":{"title":"Project Dashboard","parent":"Dashboard", "child":"Project"}} 
    return render(request,"general/dashboard/project/dashboard-03.html",context)

# #---------------Widgets

@login_required(login_url="/login_home")
def general_widget(request):
    context = { "breadcrumb":{"title":"General","parent":"Widgets", "child":"General"}} 
    return render(request,"general/widget/general-widget/general-widget.html",context)

@login_required(login_url="/login_home")
def chart_widget(request):
    context = { "breadcrumb":{"title":"Chart","parent":"Widgets", "child":"Chart"}} 
    return render(request,"general/widget/chart-widget/chart-widget.html",context)


# #-----------------Layout
@login_required(login_url="/login_home")
def box_layout(request):
    context = {'layout':'box-layout', "breadcrumb":{"title":"Box Layout","parent":"Page Layout", "child":"Box Layout"}}
    return render(request,"general/page-layout/box-layout.html",context)

@login_required(login_url="/login_home")
def layout_rtl(request):
    context = {'layout':'rtl', "breadcrumb":{"title":"RTL Layout","parent":"Page Layout", "child":"RTL Layout"}}
    return render(request,"general/page-layout/layout-rtl.html",context)

@login_required(login_url="/login_home")
def layout_dark(request):
    context = {'layout':'dark-only', "breadcrumb":{"title":"Layout Dark","parent":"Page Layout", "child":"Layout Dark"}}
    return render(request,"general/page-layout/layout-dark.html",context)

@login_required(login_url="/login_home")
def hide_on_scroll(request):
    context = { "breadcrumb":{"title":"Hide Menu On Scroll","parent":"Page Layout", "child":"Hide Menu On Scroll"}}
    return render(request,"general/page-layout/hide-on-scroll.html",context)
    
#--------------------------------Applications---------------------------------

#---------------------Project 
@login_required(login_url="/login_home")
def projects(request):
    context = { "breadcrumb":{"title":"Project List","parent":"Project", "child":"Project List"}}
    return render(request,"applications/projects/projects-list/projects.html",context)
    
@login_required(login_url="/login_home")
def projectcreate(request):
    context = { "breadcrumb":{"title":"Project Create","parent":"Apps", "child":"Project Create"}}
    return render(request,"applications/projects/projectcreate/projectcreate.html",context)


#-------------------File Manager
@login_required(login_url="/login_home")
def file_manager(request):
    context = { "breadcrumb":{"title":"File Manager","parent":"Apps", "child":"File Manager"}}
    return render(request,"applications/file-manager/file-manager.html",context)

#------------------------Kanban Board
@login_required(login_url="/login_home")
def kanban(request):
    context = { "breadcrumb":{"title":"Kanban Board","parent":"Apps", "child":"Kanban Board"}}
    return render(request,"applications/kanban/kanban.html",context)


#------------------------ ecommerce
@login_required(login_url="/login_home")
def add_products(request):
    context = { "breadcrumb":{"title":"Add-Product","parent":"ECommerce", "child":"Add-Product"}}
    return render(request,"applications/ecommerce/add-products/add-products.html",context)

@login_required(login_url="/login_home")
def product_cards(request):
    context = { "breadcrumb":{"title":"Product","parent":"Ecommerce", "child":"Product"}}
    return render(request,"applications/ecommerce/product/product.html",context)

@login_required(login_url="/login_home")
def product_page(request):
    context = { "breadcrumb":{"title":"Product Page","parent":"Ecommerce", "child":"Product Page"}}
    return render(request,"applications/ecommerce/product-page/product-page.html",context)

@login_required(login_url="/login_home")
def list_products(request):
    context = { "breadcrumb":{"title":"Product List","parent":"Ecommerce", "child":"Product List"}}
    return render(request,"applications/ecommerce/list-products/list-products.html",context)

@login_required(login_url="/login_home")
def payment_details(request):
    context = { "breadcrumb":{"title":"Payment Details","parent":"Ecommerce", "child":"Payment Details"}}
    return render(request,"applications/ecommerce/payment-details/payment-details.html",context)

@login_required(login_url="/login_home")
def order_history(request):
    context = { "breadcrumb":{"title":"Recent Orders","parent":"Ecommerce", "child":"Recent Orders"}}
    return render(request,"applications/ecommerce/order-history/order-history.html",context)
           
@login_required(login_url="/login_home")           
def invoice_1(request):
    return render(request,"applications/ecommerce/invoice-template/invoice-1.html")

@login_required(login_url="/login_home")
def invoice_2(request):
    context = { "breadcrumb":{"title":"Invoice","parent":"Ecommerce", "child":"Invoice"}}
    return render(request,"applications/ecommerce/invoice-template/invoice-2.html",context)

@login_required(login_url="/login_home")
def invoice_3(request):
    context = { "breadcrumb":{"title":"Invoice","parent":"Ecommerce", "child":"Invoice"}}
    return render(request,"applications/ecommerce/invoice-template/invoice-3.html",context)

@login_required(login_url="/login_home")
def invoice_4(request):
    context = { "breadcrumb":{"title":"Invoice","parent":"Ecommerce", "child":"Invoice"}}
    return render(request,"applications/ecommerce/invoice-template/invoice-4.html",context)

@login_required(login_url="/login_home")
def invoice_5(request):
    context = { "breadcrumb":{"title":"Invoice","parent":"Ecommerce", "child":"Invoice"}}
    return render(request,"applications/ecommerce/invoice-template/invoice-5.html",context)

@login_required(login_url="/login_home")
def invoice_template(request):
    context = { "breadcrumb":{"title":"Invoice","parent":"Ecommerce", "child":"Invoice"}}
    return render(request,"applications/ecommerce/invoice-template/invoice-template.html",context)

@login_required(login_url="/login_home")
def cart(request):
    context = { "breadcrumb":{"title":"Cart","parent":"Ecommerce", "child":"Cart"}}
    return render(request,"applications/ecommerce/cart/cart.html",context)
      
@login_required(login_url="/login_home")
def list_wish(request):
    context = { "breadcrumb":{"title":"Wishlist","parent":"Ecommerce", "child":"Wishlist"}}
    return render(request,"applications/ecommerce/list-wish/list-wish.html",context)
     
@login_required(login_url="/login_home")
def checkout(request):
    context = { "breadcrumb":{"title":"Checkout","parent":"Ecommerce", "child":"Checkout"}}
    return render(request,"applications/ecommerce/checkout/checkout.html",context)
    
@login_required(login_url="/login_home")
def pricing(request):
    context = { "breadcrumb":{"title":"Pricing","parent":"Ecommerce", "child":"Pricing"}}
    return render(request,"applications/ecommerce/pricing/pricing.html",context)


#--------------------------emails
@login_required(login_url="/login_home")
def letter_box(request):
    context = { "breadcrumb":{"title":"Letter Box","parent":"Email", "child":"Letter Box"}}
    return render(request,"applications/email/letter-box/letter-box.html",context)



#--------------------------------chat
@login_required(login_url="/login_home")
def private_chat(request):
    context = { "breadcrumb":{"title":"Private Chat","parent":"Chat", "child":"Private Chat"}}
    return render(request,"applications/chat/private-chat/private-chat.html",context)
     
@login_required(login_url="/login_home")
def group_chat(request):
    context = { "breadcrumb":{"title":"Group Chat","parent":"Chat", "child":"Group Chat"}}
    return render(request,"applications/chat/group-chat/group-chat.html",context)



#---------------------------------user
@login_required(login_url="/login_home")
def user_profile(request):
    context = { "breadcrumb":{"title":"User Profile","parent":"Users", "child":"User Profile"}}
    return render(request,"applications/user/user-profile/user-profile.html",context)
    
@login_required(login_url="/login_home")
def edit_profile(request):
    context = { "breadcrumb":{"title":"Edit Profile","parent":"Users", "child":"Edit Profile"}}
    return render(request,"applications/user/edit-profile/edit-profile.html",context)
       
@login_required(login_url="/login_home")
def user_cards(request):
    context = { "breadcrumb":{"title":"User Cards","parent":"Users", "child":"User Cards"}}
    return render(request,"applications/user/user-cards/user-cards.html",context)


#------------------------bookmark
@login_required(login_url="/login_home")
def bookmark(request):
    context = { "breadcrumb":{"title":"Bookmarks","parent":"Apps", "child":"Bookmarks"}}
    return render(request,"applications/bookmark/bookmark.html",context)


#------------------------contacts
@login_required(login_url="/login_home")
def contacts(request):
    context = { "breadcrumb":{"title":"Contacts","parent":"Apps", "child":"Contacts"}}
    return render(request,"applications/contacts/contacts.html",context)


#------------------------task
@login_required(login_url="/login_home")
def task(request):
    context = { "breadcrumb":{"title":"Tasks","parent":"Apps", "child":"Tasks"}}
    return render(request,"applications/task/task.html",context)
    

#------------------------calendar
@login_required(login_url="/login_home")
def calendar_basic(request):
    context = { "breadcrumb":{"title":"Calender Basic","parent":"Apps", "child":"Calender Basic"}}
    return render(request,"applications/calendar/calendar-basic.html",context)
    

#------------------------social-app
@login_required(login_url="/login_home")
def social_app(request):
    context = { "breadcrumb":{"title":"Social App","parent":"Apps", "child":"Social App"}}
    return render(request,"applications/social-app/social-app.html",context)


#------------------------to-do
@login_required(login_url="/login_home")
def to_do(request):
    context = { "breadcrumb":{"title":"To-Do","parent":"Apps", "child":"To-Do"}}
    return render(request,"applications/to-do/to-do.html",context)
    

#------------------------search
@login_required(login_url="/login_home")
def search(request):
    context = { "breadcrumb":{"title":"Search Website","parent":"Search Pages", "child":"Search Website"}}
    return render(request,"applications/search/search.html",context)


#--------------------------------Forms & Table-----------------------------------------------
#--------------------------------Forms------------------------------------
#------------------------form-controls

@login_required(login_url="/login_home")
def form_validation(request):
    context = { "breadcrumb":{"title":"Validation Form","parent":"Form Controls", "child":"Validation Form"}}
    return render(request,"forms-table/forms/form-controls/form-validation/form-validation.html",context)


@login_required(login_url="/login_home")
def base_input(request):
    context = { "breadcrumb":{"title":"Base Inputs","parent":"Form Controls", "child":"Base Inputs"}}
    return render(request,"forms-table/forms/form-controls/base-input/base-input.html",context)    


@login_required(login_url="/login_home")
def radio_checkbox_control(request):
    context = { "breadcrumb":{"title":"Checkbox & Radio","parent":"Form Controls", "child":"Checkbox & Radio"}}
    return render(request,"forms-table/forms/form-controls/radio-checkbox-control/radio-checkbox-control.html",context)
    
    
@login_required(login_url="/login_home")
def input_group(request):
    context = { "breadcrumb":{"title":"Input Groups","parent":"Form Controls", "child":"Input Groups"}}
    return render(request,"forms-table/forms/form-controls/input-group/input-group.html",context)


@login_required(login_url="/login_home")
def input_mask(request):
    context = { "breadcrumb":{"title":"Input Mask","parent":"Form Controls", "child":"Input Mask"}}
    return render(request,"forms-table/forms/form-controls/input-mask/input-mask.html",context)
    
    
@login_required(login_url="/login_home")
def megaoptions(request):
    context = { "breadcrumb":{"title":"Mega Options","parent":"Form Controls", "child":"Mega Options"}}
    return render(request,"forms-table/forms/form-controls/megaoptions/megaoptions.html",context)    



#---------------------------form widgets

@login_required(login_url="/login_home")
def datepicker(request):
    context = { "breadcrumb":{"title":"Datepicker","parent":"Form Widgets", "child":"Datepicker"}}
    return render(request,"forms-table/forms/form-widgets/datepicker/datepicker.html",context)


@login_required(login_url="/login_home")    
def touchspin(request):
    context = { "breadcrumb":{"title":"Touchspin","parent":"Form Widgets", "child":"Touchspin"}}
    return render(request,'forms-table/forms/form-widgets/touchspin/touchspin.html',context)


@login_required(login_url="/login_home")
def select2(request):
    context = { "breadcrumb":{"title":"Select2","parent":"Form Widgets", "child":"Select2"}}
    return render(request,'forms-table/forms/form-widgets/select2/select2.html',context)


@login_required(login_url="/login_home")      
def switch(request):
    context = { "breadcrumb":{"title":"Switch","parent":"Form Widgets", "child":"Switch"}}
    return render(request,'forms-table/forms/form-widgets/switch/switch.html',context)
      

@login_required(login_url="/login_home")      
def typeahead(request):
    context = { "breadcrumb":{"title":"Typeahead","parent":"Form Widgets", "child":"Typeahead"}}
    return render(request,'forms-table/forms/form-widgets/typeahead/typeahead.html',context)
      

@login_required(login_url="/login_home")    
def clipboard(request):
    context = { "breadcrumb":{"title":"Clipboard","parent":"Form Widgets", "child":"Clipboard"}}
    return render(request,'forms-table/forms/form-widgets/clipboard/clipboard.html',context)
     
     
#-----------------------form layout

@login_required(login_url="/login_home")
def form_wizard_one(request):
    context = { "breadcrumb":{"title":"Form Wizard","parent":"Form Layout", "child":"Form Wizard"}}
    return render(request,'forms-table/forms/form-layout/form-wizard/form-wizard.html',context) 


@login_required(login_url="/login_home")
def form_wizard_two(request):
    context = { "breadcrumb":{"title":"Step Form Wizard","parent":"Form Layout", "child":"Step Form Wizard"}}
    return render(request,'forms-table/forms/form-layout/form-wizard-two/form-wizard-two.html',context) 


@login_required(login_url="/login_home")
def two_factor(request):
    context = { "breadcrumb":{"title":"Two Factor","parent":"Form Layout", "child":"Two Factor"}}
    return render(request,'forms-table/forms/form-layout/two-factor/two-factor.html',context)



#----------------------------------------------------Table------------------------------------------
#------------------------bootstrap table

@login_required(login_url="/login_home")
def basic_table(request):
    context = { "breadcrumb":{"title":"Bootstrap Basic Tables","parent":"Bootstrap Tables", "child":"Bootstrap Basic Tables"}}
    return render(request,'forms-table/table/bootstrap-table/basic-table/bootstrap-basic-table.html',context)
    

@login_required(login_url="/login_home")
def table_components(request):
    context = { "breadcrumb":{"title":"Table Components","parent":"Bootstrap Tables", "child":"Table Components"}}
    return render(request,'forms-table/table/bootstrap-table/table-components/table-components.html',context)


#------------------------data table

@login_required(login_url="/login_home")
def datatable_basic_init(request):
    context = { "breadcrumb":{"title":"Basic DataTables","parent":"Data Tables", "child":"Basic DataTables"}}
    return render(request,'forms-table/table/data-table/datatable-basic/datatable-basic-init.html',context)
    

@login_required(login_url="/login_home")
def datatable_advance(request):
    context = { "breadcrumb":{"title":"Advance Init","parent":"Data Tables", "child":"Advance Init"}}
    return render(request,'forms-table/table/data-table/datatable-advance/datatable-advance.html',context)
    

@login_required(login_url="/login_home")
def datatable_API(request):
    context = { "breadcrumb":{"title":"API DataTables","parent":"Data Tables", "child":"API DataTables"}}
    return render(request,'forms-table/table/data-table/datatable-API/datatable-API.html',context)
    

@login_required(login_url="/login_home")
def datatable_data_source(request):
    context = { "breadcrumb":{"title":"DATA Source DataTables","parent":"Data Tables", "child":"DATA Source DataTables"}}
    return render(request,'forms-table/table/data-table/data-source/datatable-data-source.html',context)


#-------------------------------EX.data-table

@login_required(login_url="/login_home")
def ext_autofill(request):
    context = { "breadcrumb":{"title":"Autofill Datatables","parent":"Extension Data Tables", "child":"Autofill Datatables"}}
    return render(request,'forms-table/table/Ex-data-table/ext-autofill/datatable-ext-autofill.html',context)


#--------------------------------jsgrid_table

@login_required(login_url="/login_home")
def jsgrid_table(request):
    context = { "breadcrumb":{"title":"JS Grid Tables","parent":"Tables", "child":"JS Grid Tables"}}
    return render(request,'forms-table/table/js-grid-table/jsgrid-table.html',context) 


#------------------Components------UI Components-----Elements ----------->

#-----------------------------Ui kits

@login_required(login_url="/login_home")
def typography(request):
    context = { "breadcrumb":{"title":"Typography","parent":"Ui Kits", "child":"Typography"}}
    return render(request,'components/ui-kits/typography/typography.html', context)


@login_required(login_url="/login_home")
def avatars(request):
    context = { "breadcrumb":{"title":"Avatars","parent":"Ui Kits", "child":"Avatars"}}
    return render(request,'components/ui-kits/avatars/avatars.html', context)
     

@login_required(login_url="/login_home")
def helper_classes(request):
    context = { "breadcrumb":{"title":"Helper Classes","parent":"Ui Kits", "child":"Helper Classes"}}
    return render(request,'components/ui-kits/helper-classes/helper-classes.html', context)


@login_required(login_url="/login_home")
def grid(request):
    context = { "breadcrumb":{"title":"Grid","parent":"Ui Kits", "child":"Grid"}}
    return render(request,'components/ui-kits/grid/grid.html', context)


@login_required(login_url="/login_home")      
def tagpills(request):
    context = { "breadcrumb":{"title":"Tag & Pills","parent":"Ui Kits", "child":"Tag & Pills"}}
    return render(request,'components/ui-kits/tag-pills/tag-pills.html', context)
      
      
@login_required(login_url="/login_home")
def progressbar(request):
    context = { "breadcrumb":{"title":"Progress","parent":"Ui Kits", "child":"Progress"}}
    return render(request,'components/ui-kits/progress-bar/progress-bar.html', context)
     
         
@login_required(login_url="/login_home")
def modal(request):
    context = { "breadcrumb":{"title":"Modal","parent":"Ui Kits", "child":"Modal"}}
    return render(request,'components/ui-kits/modal/modal.html', context)  

    
@login_required(login_url="/login_home")
def alert(request):
    context = { "breadcrumb":{"title":"alert","parent":"Ui Kits", "child":"alert"}}
    return render(request,'components/ui-kits/alert/alert.html', context)
    
    
@login_required(login_url="/login_home")   
def popover(request):
    context = { "breadcrumb":{"title":"Popover","parent":"Ui Kits", "child":"Popover"}}
    return render(request,'components/ui-kits/popover/popover.html', context) 
    
    
@login_required(login_url="/login_home")
def tooltip(request):
    context = { "breadcrumb":{"title":"Tooltip","parent":"Ui Kits", "child":"Tooltip"}}
    return render(request,'components/ui-kits/tooltip/tooltip.html', context)
    
    
@login_required(login_url="/login_home")
def dropdown(request):
    context = { "breadcrumb":{"title":"Dropdown","parent":"Ui Kits", "child":"Dropdown"}}
    return render(request,'components/ui-kits/dropdown/dropdown.html', context)   
    
    
@login_required(login_url="/login_home")
def accordion(request):
    context = { "breadcrumb":{"title":"Accordion","parent":"Ui Kits", "child":"Accordion"}}
    return render(request,'components/ui-kits/according/according.html', context)    
    
    
@login_required(login_url="/login_home")
def bootstraptab(request):
    context = { "breadcrumb":{"title":"Bootstrap Tabs","parent":"Ui Kits", "child":"Bootstrap Tabs"}}
    return render(request,'components/ui-kits/tab-bootstrap/tab-bootstrap.html', context)    


@login_required(login_url="/login_home")
def lists(request):
    context = {"breadcrumb":{"title":"Lists","parent":"Ui Kits", "child":"Lists"}}
    return render(request,'components/ui-kits/list/list.html', context)



#-------------------------------Bonus Ui

@login_required(login_url="/login_home")
def scrollable(request):
    context = {"breadcrumb":{"title":"Scrollable","parent":"Bonus Ui", "child":"Scrollable"}}
    return render(request,'components/bonus-ui/scrollable/scrollable.html', context)
            
            
@login_required(login_url="/login_home")
def tree(request):
    context = {"breadcrumb":{"title":"Tree View","parent":"Bonus Ui", "child":"Tree View"}}
    return render(request,'components/bonus-ui/tree/tree.html', context)


@login_required(login_url="/login_home")           
def toasts(request):
    context = {"breadcrumb":{"title":"Toasts","parent":"Bonus Ui", "child":"Toasts"}}
    return render(request,'components/bonus-ui/toasts/toasts.html', context)      

  
@login_required(login_url="/login_home")    
def rating(request):
    context = {"breadcrumb":{"title":"Rating","parent":"Bonus Ui", "child":"Rating"}}
    return render(request,'components/bonus-ui/rating/rating.html', context)
               
               
@login_required(login_url="/login_home")
def dropzone(request):
    context = {"breadcrumb":{"title":"Dropzone","parent":"Bonus Ui", "child":"Dropzone"}}
    return render(request,'components/bonus-ui/dropzone/dropzone.html', context)    
    
    
@login_required(login_url="/login_home")
def tour(request):
    context = {"breadcrumb":{"title":"Tour","parent":"Bonus Ui", "child":"Tour"}}
    return render(request,'components/bonus-ui/tour/tour.html', context)        
    
    
@login_required(login_url="/login_home")
def sweetalert2(request):
    context = {"breadcrumb":{"title":"Sweet Alert","parent":"Bonus Ui", "child":"Sweet Alert"}}
    return render(request,'components/bonus-ui/sweet-alert2/sweet-alert2.html', context)    
    
    
@login_required(login_url="/login_home")
def animatedmodal(request):
    context = {"breadcrumb":{"title":"Animated Modal","parent":"Bonus Ui", "child":"Animated Modal"}}
    return render(request,'components/bonus-ui/modal-animated/modal-animated.html', context)     
    
    
@login_required(login_url="/login_home")
def owlcarousel(request):
    context = {"breadcrumb":{"title":"Owl Carousel","parent":"Bonus Ui", "child":"Owl Carousel"}}
    return render(request,'components/bonus-ui/owl-carousel/owl-carousel.html', context)
    
              
@login_required(login_url="/login_home")
def ribbons(request):
    context = {"breadcrumb":{"title":"Ribbons","parent":"Bonus Ui", "child":"Ribbons"}}
    return render(request,'components/bonus-ui/ribbons/ribbons.html', context) 
    
             
@login_required(login_url="/login_home")
def pagination(request):
    context = {"breadcrumb":{"title":"Paginations","parent":"Bonus Ui", "child":"Paginations"}}
    return render(request,'components/bonus-ui/pagination/pagination.html', context)
      
        
@login_required(login_url="/login_home")
def breadcrumb(request):
    context = {"breadcrumb":{"title":"Breadcrumb","parent":"Bonus Ui", "child":"Breadcrumb"}}
    return render(request,'components/bonus-ui/breadcrumb/breadcrumb.html', context)       
    
    
@login_required(login_url="/login_home")
def rangeslider(request):
    context = {"breadcrumb":{"title":"Range Slider","parent":"Bonus Ui", "child":"Range Slider"}}
    return render(request,'components/bonus-ui/range-slider/range-slider.html', context)     
    
    
@login_required(login_url="/login_home")
def imagecropper(request):
    context = {"breadcrumb":{"title":"Image Cropper","parent":"Bonus Ui", "child":"Image Cropper"}}
    return render(request,'components/bonus-ui/image-cropper/image-cropper.html', context)      
    

@login_required(login_url="/login_home")
def basiccard(request):
    context = {"breadcrumb":{"title":"Basic Card","parent":"Bonus Ui", "child":"Basic Card"}}
    return render(request,'components/bonus-ui/basic-card/basic-card.html', context)
                    
                    
@login_required(login_url="/login_home")
def creativecard(request):
    context = {"breadcrumb":{"title":"Creative Card","parent":"Bonus Ui", "child":"Creative Card"}}
    return render(request,'components/bonus-ui/creative-card/creative-card.html', context)  
       

@login_required(login_url="/login_home")
def draggablecard(request):
    context = {"breadcrumb":{"title":"Draggable Card","parent":"Bonus Ui", "child":"Draggable Card"}}
    return render(request,'components/bonus-ui/dragable-card/dragable-card.html', context)       
    
    
@login_required(login_url="/login_home")    
def timeline1(request):
    context = {"breadcrumb":{"title":"Range Slider","parent":"Bonus Ui", "child":"Range Slider"}}
    return render(request,'components/bonus-ui/timeline/timeline-v-1.html', context) 



#---------------------------------Animation

@login_required(login_url="/login_home")
def animate(request):
    context = {"breadcrumb":{"title":"Animate","parent":"Animation", "child":"Animate"}}
    return render(request,'components/animation/animate/animate.html', context)
            
            
@login_required(login_url="/login_home")
def scrollreval(request):
    context = {"breadcrumb":{"title":"Scroll Reveal","parent":"Animation", "child":"Scroll Reveal"}}
    return render(request,'components/animation/scroll-reval/scroll-reval.html', context)        
    

@login_required(login_url="/login_home")
def AOS(request):
    context = {"breadcrumb":{"title":"AOS Animation","parent":"Animation", "child":"AOS Animation"}}
    return render(request,'components/animation/AOS/AOS.html', context)
            

@login_required(login_url="/login_home")
def tilt(request):
    context = {"breadcrumb":{"title":"Tilt Animation","parent":"Animation", "child":"Tilt Animation"}}
    return render(request,'components/animation/tilt/tilt.html', context)        
    
    
@login_required(login_url="/login_home")
def wow(request):
    context = {"breadcrumb":{"title":"Wow Animation","parent":"Animation", "child":"Wow Animation"}}
    return render(request,'components/animation/wow/wow.html', context)    



#--------------------------Icons

@login_required(login_url="/login_home")
def flagicon(request):
    context = {"breadcrumb":{"title":"Flag Icons","parent":"Icons", "child":"Flag Icons"}}
    return render(request,'components/icons/flag-icon/flag-icon.html', context) 
    

@login_required(login_url="/login_home")
def fontawesome(request):
    context = {"breadcrumb":{"title":"Font Awesome Icon","parent":"Icons", "child":"Font Awesome Icon"}}
    return render(request,'components/icons/font-awesome/font-awesome.html', context) 
    

@login_required(login_url="/login_home")
def icoicon(request):
    context = {"breadcrumb":{"title":"ICO Icon","parent":"Ui Kits", "child":"ICO Icon"}}
    return render(request,'components/icons/ico-icon/ico-icon.html', context) 
    
    
@login_required(login_url="/login_home")
def themify(request):
    context = {"breadcrumb":{"title":"Themify Icon","parent":"Icons", "child":"Themify Icon"}}
    return render(request,'components/icons/themify-icon/themify-icon.html', context)  


@login_required(login_url="/login_home")    
def feather(request):
    context = {"breadcrumb":{"title":"Feather Icons","parent":"Icons", "child":"Feather Icons"}}
    return render(request,'components/icons/feather-icon/feather-icon.html', context)  
    
    
@login_required(login_url="/login_home")
def whether(request):
    context = {"breadcrumb":{"title":"Whether Icon","parent":"Icons", "child":"Whether Icon"}}
    return render(request,'components/icons/whether-icon/whether-icon.html', context)      



#--------------------------------Buttons

@login_required(login_url="/login_home")
def buttons(request):
    context = {"breadcrumb":{"title":"Default Style","parent":"Buttons", "child":"Default Style"}}
    return render(request,'components/buttons/default-button/buttons.html', context)        
          

@login_required(login_url="/login_home")
def group(request):
    context = {"breadcrumb":{"title":"Button Group","parent":"Buttons", "child":"Button Group"}}
    return render(request,'components/buttons/button-group/button-group.html', context)   



#-------------------------------charts

    

@login_required(login_url="/login_home")
def apex(request):
    context = {"breadcrumb":{"title":"Apex Chart","parent":"Charts", "child":"Apex Chart"}}
    return render(request,'components/charts/apex/chart-apex.html', context)    


@login_required(login_url="/login_home")         
def google(request):
    context = {"breadcrumb":{"title":"Google Chart","parent":"Charts", "child":"Google Chart"}}
    return render(request,'components/charts/google/chart-google.html', context)


@login_required(login_url="/login_home")         
def sparkline(request):
    context = {"breadcrumb":{"title":"Sparkline Chart","parent":"Charts", "child":"Sparkline Chart"}}
    return render(request,'components/charts/sparkline/chart-sparkline.html', context)      


@login_required(login_url="/login_home")             
def flot(request):
    context = {"breadcrumb":{"title":"Flot Chart","parent":"Charts", "child":"Flot Chart"}}
    return render(request,'components/charts/flot/chart-flot.html', context)   
    

@login_required(login_url="/login_home")
def knob(request):
    context = {"breadcrumb":{"title":"Knob Chart","parent":"Charts", "child":"Knob Chart"}}
    return render(request,'components/charts/knob/chart-knob.html', context)     
       
       
@login_required(login_url="/login_home")         
def morris(request):
    context = {"breadcrumb":{"title":"Morris Chart","parent":"Charts", "child":"Morris Chart"}}
    return render(request,'components/charts/morris/chart-morris.html', context)


@login_required(login_url="/login_home")      
def chartjs(request):
    context = {"breadcrumb":{"title":"ChartJS Chart","parent":"Charts", "child":"ChartJS Chart"}}
    return render(request,'components/charts/chartjs/chartjs.html', context)     
    
    
@login_required(login_url="/login_home")
def chartist(request):
    context = {"breadcrumb":{"title":"Chartist Chart","parent":"Charts", "child":"Chartist Chart"}}
    return render(request,'components/charts/chartist/chartist.html', context)   


@login_required(login_url="/login_home")
def peity(request):
    context = {"breadcrumb":{"title":"Peity Chart","parent":"Charts", "child":"Peity Chart"}}
    return render(request,'components/charts/peity/chart-peity.html', context)        
    
    
@login_required(login_url="/login_home")
def echarts(request):
    context = {"breadcrumb":{"title":"Echarts","parent":"Charts", "child":"Echarts"}}
    return render(request,'components/charts/echarts/echarts.html', context)


#------------------------------------------Pages-------------------------------------

#-------------------------sample-page

@login_required(login_url="/login_home")
def sample_page(request):
    context = {"breadcrumb":{"title":"Sample Page","parent":"Pages", "child":"Sample Page"}}    
    return render(request,'pages/sample-page/sample-page.html',context)


@login_required(login_url="/login_home")
def translate(request):
    context = {"breadcrumb":{"title":"Translate","parent":"Pages", "child":"Translate"}}    
    return render(request,'pages/translate/translate.html',context)
    



#-----------------------------------------------others

# ------------------------------error page

@login_required(login_url="/login_home")
def error_400(request):
    return render(request,'pages/others/error-page/error-page/error-400.html')


@login_required(login_url="/login_home")
def error_401(request):
    return render(request,'pages/others/error-page/error-page/error-401.html')
    

@login_required(login_url="/login_home")
def error_403(request):
    return render(request,'pages/others/error-page/error-page/error-403.html')


@login_required(login_url="/login_home")
def error_404(request):
    return render(request,'pages/others/error-page/error-page/error-404.html')
    

@login_required(login_url="/login_home")
def error_500(request):
    return render(request,'pages/others/error-page/error-page/error-500.html')
    

@login_required(login_url="/login_home")
def error_503(request):
    return render(request,'pages/others/error-page/error-page/error-503.html')
    

#----------------------------------Authentication



@login_required(login_url="/login_home")
def login_simple(request):
    return render(request,'pages/others/authentication/login/login.html')


@login_required(login_url="/login_home")
def login_one(request):
    return render(request,'pages/others/authentication/login-one/login_one.html')
    

@login_required(login_url="/login_home")
def login_two(request):
    return render(request,'pages/others/authentication/login-two/login_two.html')


@login_required(login_url="/login_home")
def login_bs_validation(request):
    return render(request,'pages/others/authentication/login-bs-validation/login-bs-validation.html')


@login_required(login_url="/login_home")
def login_tt_validation(request):
    return render(request,'pages/others/authentication/login-bs-tt-validation/login-bs-tt-validation.html')
    

@login_required(login_url="/login_home")
def login_validation(request):
    return render(request,'pages/others/authentication/login-sa-validation/login-sa-validation.html')
    

@login_required(login_url="/login_home")
def sign_up(request):
    return render(request,'pages/others/authentication/sign-up/sign-up.html')  


@login_required(login_url="/login_home")
def sign_one(request):
    return render(request,'pages/others/authentication/sign-one/sign-up-one.html')
    

@login_required(login_url="/login_home")
def sign_two(request):
    return render(request,'pages/others/authentication/sign-two/sign-up-two.html')


@login_required(login_url="/login_home")
def sign_wizard(request):
    return render(request,'pages/others/authentication/sign-up-wizard/sign-up-wizard.html')    


@login_required(login_url="/login_home")
def unlock(request):
    return render(request,'pages/others/authentication/unlock/unlock.html')
    

@login_required(login_url="/login_home")
def forget_password(request):
    return render(request,'pages/others/authentication/forget-password/forget-password.html')
    

@login_required(login_url="/login_home")
def reset_password(request):
    return render(request,'pages/others/authentication/reset-password/reset-password.html')


@login_required(login_url="/login_home")
def maintenance(request):
    return render(request,'pages/others/authentication/maintenance/maintenance.html')



#---------------------------------------comingsoon

@login_required(login_url="/login_home")
def comingsoon(request):
    return render(request,'pages/others/comingsoon/comingsoon/comingsoon.html')
    

@login_required(login_url="/login_home")
def comingsoon_video(request):
    return render(request,'pages/others/comingsoon/comingsoon-video/comingsoon-bg-video.html')


@login_required(login_url="/login_home")
def comingsoon_img(request):
    return render(request,'pages/others/comingsoon/comingsoon-img/comingsoon-bg-img.html')
    

#----------------------------------Email-Template

@login_required(login_url="/login_home")
def basic_temp(request):
    return render(request,'pages/others/email-templates/basic-email/basic-template.html')
    

@login_required(login_url="/login_home")
def email_header(request):
    return render(request,'pages/others/email-templates/basic-header/email-header.html')
    

@login_required(login_url="/login_home")
def template_email(request):
    return render(request,'pages/others/email-templates/ecom-template/template-email.html')
    

@login_required(login_url="/login_home")
def template_email_2(request):
    return render(request,'pages/others/email-templates/template-email-2/template-email-2.html')


@login_required(login_url="/login_home")
def ecommerce_temp(request):
    return render(request,'pages/others/email-templates/ecom-email/ecommerce-templates.html')
    

@login_required(login_url="/login_home")
def email_order(request):
    return render(request,'pages/others/email-templates/order-success/email-order-success.html')     



#------------------------------------------Miscellaneous----------------- -------------------------

#--------------------------------------gallery

@login_required(login_url="/login_home")
def gallery_grid(request):
    context = {"breadcrumb":{"title":"Gallery","parent":"Gallery", "child":"Gallery"}}    
    return render(request,'miscellaneous/gallery/gallery-grid/gallery.html',context)
    

@login_required(login_url="/login_home")
def gallery_description(request):
    context = {"breadcrumb":{"title":"Gallery Grid With Description","parent":"Gallery", "child":"Gallery Grid With Description"}}    
    return render(request,'miscellaneous/gallery/gallery-grid-desc/gallery-with-description.html',context)


@login_required(login_url="/login_home")
def masonry_gallery(request):
    context = {"breadcrumb":{"title":"Masonry Gallery","parent":"Gallery", "child":"Masonry Gallery"}}    
    return render(request,'miscellaneous/gallery/masonry-gallery/gallery-masonry.html',context)
    

@login_required(login_url="/login_home")
def masonry_disc(request):
    context = {"breadcrumb":{"title":"Masonry Gallery With Description","parent":"Gallery", "child":"Masonry Gallery With Description"}}    
    return render(request,'miscellaneous/gallery/masonry-with-desc/masonry-gallery-with-disc.html',context)
    

@login_required(login_url="/login_home")
def hover(request):
    context = {"breadcrumb":{"title":"Image Hover Effects","parent":"Gallery", "child":"Image Hover Effects"}}    
    return render(request,'miscellaneous/gallery/hover-effects/gallery-hover.html',context)
    
    
#------------------------------------Blog

@login_required(login_url="/login_home")
def blog_details(request):  
    context = {"breadcrumb":{"title":"Blog Details","parent":"Blog", "child":"Blog Details"}}    
    return render(request,'miscellaneous/blog/blog-details/blog.html',context)
    


@login_required(login_url="/login_home")
def blog_single(request):
    context = {"breadcrumb":{"title":"Blog Single","parent":"Blog", "child":"Blog Single"}}    
    return render(request,'miscellaneous/blog/blog-single/blog-single.html',context)
    


@login_required(login_url="/login_home")
def add_post(request):
    context = {"breadcrumb":{"title":"Add Post","parent":"Blog", "child":"Add Post"}}    
    return render(request,'miscellaneous/blog/add-post/add-post.html',context)
    
#--------------------------------------faq

@login_required(login_url="/login_home")
def FAQ(request):
    context = {"breadcrumb":{"title":"FAQ","parent":"FAQ", "child":"FAQ"}}    
    return render(request,'miscellaneous/FAQ/faq.html',context)


#---------------------------------job serach

@login_required(login_url="/login_home")
def job_cards(request):
    context = {"breadcrumb":{"title":"Cards View","parent":"Job Search", "child":"Cards View"}}    
    return render(request,'miscellaneous/job-search/cards-view/job-cards-view.html',context)
    

@login_required(login_url="/login_home")
def job_list(request):
    context = {"breadcrumb":{"title":"List View","parent":"Job Search", "child":"List View"}}    
    return render(request,'miscellaneous/job-search/list-view/job-list-view.html',context)
    

@login_required(login_url="/login_home")
def job_details(request):
    context = {"breadcrumb":{"title":"Job Details","parent":"Job Search", "child":"Job Details"}}    
    return render(request,'miscellaneous/job-search/job-details/job-details.html',context)
    

@login_required(login_url="/login_home")
def apply(request):
    context = {"breadcrumb":{"title":"Apply","parent":"Job Search", "child":"Apply"}}    
    return render(request,'miscellaneous/job-search/apply/job-apply.html',context)
    
#------------------------------------Learning

@login_required(login_url="/login_home")
def learning_list(request):
    context = {"breadcrumb":{"title":"Learning List","parent":"Learning", "child":"Learning List"}}    
    return render(request,'miscellaneous/learning/learning-list/learning-list-view.html',context)
    

@login_required(login_url="/login_home")
def learning_detailed(request):
    context = {"breadcrumb":{"title":"Detailed Course","parent":"Learning", "child":"Detailed Course"}}    
    return render(request,'miscellaneous/learning/learning-detailed/learning-detailed.html',context)
    

#----------------------------------------Maps
@login_required(login_url="/login_home")
def maps_js(request):
    context = {"breadcrumb":{"title":"Map JS","parent":"Maps", "child":"Map JS"}}    
    return render(request,'miscellaneous/maps/maps-js/map-js.html',context)
    
   
@login_required(login_url="/login_home")
def vector_maps(request):
    context = {"breadcrumb":{"title":"Vector Maps","parent":"Maps", "child":"Vector Maps"}}
    return render(request,'miscellaneous/maps/vector-maps/vector-map.html',context)
    

#------------------------------------Editors
   
@login_required(login_url="/login_home")
def summernote(request):
    context = {"breadcrumb":{"title":"Summer Note","parent":"Editors", "child":"Summer Note"}}    
    return render(request,'miscellaneous/editors/summer-note/summernote.html',context)
    

@login_required(login_url="/login_home")
def ckeditor(request):
    context = {"breadcrumb":{"title":"Ck Editor","parent":"Editors", "child":"Ck Editor"}}    
    return render(request,'miscellaneous/editors/ckeditor/ckeditor.html',context)
    

@login_required(login_url="/login_home")
def simple_mde(request):
    context = {"breadcrumb":{"title":"MDE Editor","parent":"Editors", "child":"MDE Editor"}}    
    return render(request,'miscellaneous/editors/simple-mde/simple-mde.html',context) 
    
    
@login_required(login_url="/login_home")
def ace_code(request):
    context = {"breadcrumb":{"title":"ACE Code Editor","parent":"Editors", "child":"ACE Code Editor"}}    
    return render(request,'miscellaneous/editors/ace-code/ace-code-editor.html',context) 
    
#----------------------------knowledgeUi Kits
@login_required(login_url="/login_home")
def knowledgebase(request):
    context = {"breadcrumb":{"title":"Knowledgebase","parent":"Knowledgebase", "child":"Knowledgebase"}}    
    return render(request,'miscellaneous/knowledgebase/knowledgebase.html',context)
    
#-----------------------------support-ticket
@login_required(login_url="/login_home")
def support_ticket(request):
    context = { "breadcrumb":{"title":"Support Ticket","parent":"Apps", "child":"Support Ticket"}}
    return render(request,"miscellaneous/support-ticket/support-ticket.html",context)

      

#---------------------------------------------------------------------------------------

def signup_home(request):
    if request.method == "GET":
        return render(request, 'sign-up.html')
    else:
        email = request.POST['email']
        username = request.POST['username']
        password = request.POST['password']
        user = User.objects.filter(email=email).exists()
        if user:
            raise Exception('Something went wrong')
        new_user = User.objects.create_user(username=username,email=email, password=password)
        new_user.save()
        return redirect('index')
    
    
def logout_view(request):
    logout(request)
    return redirect('login_home')


def login_home(request):
    if request.method == "POST":
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password  = form.cleaned_data['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request,user)
                if 'next' in request.GET:
                    nextPage = request.GET['next']
                    return HttpResponseRedirect(nextPage)
                return redirect("index")
            else:
                messages.error(request,"Wrong credentials")
                return redirect("login_home")
        else:
            messages.error(request,"Wrong credentials")
            return redirect("login_home")
    else:
        form = AuthenticationForm()        
        
    return render(request,'login.html',{"form":form,})