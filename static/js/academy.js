document.addEventListener("DOMContentLoaded", function () {
    const dropdownToggles = document.querySelectorAll('.dropdownToggle');
    let currentVideo = null;
    let lessonContainers = document.querySelectorAll(".container-lesson");
    const videos = document.querySelectorAll(".videos");
    const videosIDs = [];
    var last_quizz_index = 0
    var quizzes_options_answers = []
    var right_answers = []

    // Fetching level progression
    ajaxRequest("POST", "/level_progress/", { level_id: level_id }, function (response) {
        updateProgress(response.level_progression);
    }, null, false, "level progression", null);

    // Adding click event listeners to videos
    videos.forEach(function (video) {
        const videoID = video.dataset.id;
        videosIDs.push(videoID);

        video.addEventListener("click", function (e) {
            e.preventDefault();
            changeVideo(videoID);
            showLesson(lessonContainers, 0, "24");
        });
    });

    // Setting the current video to the first video
    currentVideo = videosIDs[0];
    changeVideo(currentVideo);

    // Handling URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const videoIdParam = urlParams.get("id");
    let videoId = videosIDs.length > 0 ? videosIDs[0] : null;
    if (videoIdParam && videosIDs.includes(videoIdParam)) {
        videoId = videoIdParam;
        changeVideo(videoId);
    }

    const finishStepBttn = document.querySelector("#finishStep");
    if (finishStepBttn) {
        finishStepBttn.addEventListener("click", function (e) {
            e.preventDefault();
            finishVideo(currentVideo, lessonContainers);
        });
    } else {
        console.error("#finishStep button not found");
    }

    document.querySelectorAll(".iconlike").forEach(function (element) {
        toggleLikeCss(element);
        element.addEventListener("click", function (event) {
            toggleLike(event.currentTarget);
        });
    });

    function toggleLike(element) {
        ajaxRequest("post", "/is_video_liked/", { video_id: currentVideo }, function (response) {
            if (response.is_liked) {
                ajaxRequest("post", "/remove_liked_video/", { video_id: currentVideo }, function () {
                    toggleLikeCss(element);
                }, null, false, "Like video", null);
            } else {
                ajaxRequest("post", "/add_liked_video/", { video_id: currentVideo }, function () {
                    toggleLikeCss(element);
                }, null, false, "Dislike video", null);
            }
        }, null, false, "Toggle like video", null);
    }

    function toggleLikeCss(element) {
        ajaxRequest("post", "/is_video_liked/", { video_id: currentVideo }, function (response) {
            if (response.is_liked) {
                element.classList.add("liked");
            } else {
                element.classList.remove("liked");
            }
        }, null, false, "Toggle like video", null);
    }

    function updateProgress(percentage) {
        const levelProgressText = document.querySelector(".percentage-progess");
        const progressBar = document.getElementById("progressBar");
        if (levelProgressText) {
            levelProgressText.innerText = `${percentage}% complete`;
        }
        if (progressBar) {
            progressBar.style.width = percentage + "%";
        }
    }

    function showLesson(lessonContainers, index, whereitscalled) {
        console.log("showLesson, index: " + index + " " + whereitscalled)
        lessonContainers.forEach((container, i) => {
            container.style.display = i === index ? "flex" : "none";
        });
    }

    function changeVideo(videoId) {
        if (!videoId) {
            console.error("changeVideo: videoId is undefined");
            return;
        }

        currentVideo = videoId;

        ajaxRequest("POST", "/get-video/", { videoId: videoId }, function (response) {
            if (response.success && response.video) {
                const videoSRC = document.querySelector(".videoSRC");
                if (videoSRC) {
                    videoSRC.src = response.video.video_file;
                    document.querySelector("video").load();
                }

                document.querySelectorAll(".video-title").forEach((el) => {
                    if (el) el.innerText = response.video.title;
                });
                document.querySelectorAll(".description-step-video").forEach((el) => {
                    if (el) el.innerHTML = response.video.notes;
                });
                document.querySelectorAll(".content-text-inside").forEach((el) => {
                    if (el) el.innerHTML = response.video.summary;
                });
                Prism.highlightAll();
                loadQuiz(videoId);

                document.querySelectorAll('.step').forEach(step => {
                    step.classList.remove('active-step');
                });
                const currentStepElement = document.querySelector(`.videos[data-id='${videoId}'] .step`);
                if (currentStepElement) {
                    currentStepElement.classList.add('active-step');
                }
                lessonContainers = document.querySelectorAll(".container-lesson"); // Update lessonContainers NodeList



            } else {
                displayFeedbackMessage("Error loading video data. Please try again.", false);
            }
        }, null, false, "get video details", null);
    }

    function loadQuiz(videoId) {

        ajaxRequest("POST", "/get-video/", { videoId: videoId }, function (response) {
            if (response.success && response.video && response.video.quizes) {
                generateAnswers(response.video.quizes);
            } else {
                displayFeedbackMessage("Error loading quiz data. Please try again.", false);
            }
        }, function () {
            displayFeedbackMessage("Error loading quiz data. Please try again.", false);
        }, false, "Load quiz", null);
    }

    function generateAnswers(quizzes) {
        const quizzesNextDiv = document.querySelector('.quizzes_next');
        quizzes_options_answers = []
        right_answers = []
        // Remove existing quiz containers
        const quizzes_containers = document.querySelectorAll(".container-quiz");
        quizzes_containers.forEach((quiz_container) => {
            quiz_container.remove();
        });
    
        // Step 1: Create an array to hold the quiz containers
        const quizContainers = [];
        // Create the quiz containers and store them in the array
        quizzes.forEach((quizz, index) => {
            last_quizz_index = index + 2
            right_answers.push(quizz.correct_option_id)
            const prev_index = index + 1;
            const next_index = index + 3;
    
            const quiz_container = document.createElement("div");
            quiz_container.classList.add("container-quiz", "container-lesson");
    
            const lessons_containers = document.createElement("div");
            lessons_containers.classList.add("content-video-lesson");
    
            const title_default_quiz = document.createElement("div");
            title_default_quiz.classList.add("title-default-quiz");
            title_default_quiz.innerHTML = `<span class="text-default-quiz">QUIZZES</span>`;
    
            lessons_containers.appendChild(title_default_quiz);
    
            const fill_question = document.createElement("div");
            fill_question.classList.add("fill-question");
    
            const quiz_question = document.createElement("div");
            quiz_question.classList.add("quiz-question");
            quiz_question.innerText = quizz.question;
            fill_question.appendChild(quiz_question);
    
            const container_answers = document.createElement("ul");
            container_answers.classList.add("container-answers");
    
            // Collect options
            const options_containers = [];
    
            quizz.options.forEach((option) => {
                const answer_option = document.createElement("li");
                answer_option.classList.add("option-container", "answer-option");
                answer_option.setAttribute('data-option-id', option.id);
    
                if (option.text) {
                    const spanElement = document.createElement('span');
                    spanElement.className = 'span-answers-quiz';
                    spanElement.innerText = option.text;
                    answer_option.appendChild(spanElement);
                }
    
                if (option.img) {
                    const imgElement = document.createElement('img');
                    imgElement.className = 'img-answers-quiz';
                    imgElement.src = option.img;
                    answer_option.appendChild(imgElement);
                }
                options_containers.push(answer_option);
            });
    
            // Append options and add event listeners
            options_containers.forEach((answer_option) => {
                quizzes_options_answers[index] = null;
                answer_option.addEventListener("click", (e) => {
                    const is_selected = answer_option.classList.contains("selected");
                    options_containers.forEach((answer_optionv2) => {
                        answer_optionv2.classList.remove("selected");
                    });
                    if (!is_selected) {
                        answer_option.classList.add("selected");
                        quizzes_options_answers[index] = answer_option.getAttribute('data-option-id');
                    }
                    else {
                        quizzes_options_answers[index] = null;
                    }
                    console.log(quizzes_options_answers)

                    

                });
                container_answers.appendChild(answer_option);
            });
            


            fill_question.appendChild(container_answers);
            lessons_containers.appendChild(fill_question);
    
            const next_lesson = document.createElement('div');
            next_lesson.classList.add('next-lesson');
    
            const prev_container = document.createElement('div');
            const prev_button = document.createElement('a');
            prev_button.classList.add("prev-btn", "prev-next-bttn");
            prev_button.setAttribute('data-index', prev_index);
            prev_button.innerHTML = `<img src="/static/assets/back.svg" alt="arrow-left" />BACK`;
            prev_container.appendChild(prev_button);
            next_lesson.appendChild(prev_container);
    
            const next_container = document.createElement('div');
            const next_button = document.createElement('a');
            next_button.classList.add("keep-next", "prev-next-bttn", "quizz-next-page-btn");
            next_button.setAttribute('data-index', next_index);
            next_button.innerHTML = `NEXT <img src="/static/assets/next.svg" alt="arrow-right" />`;
            next_container.appendChild(next_button);
            next_lesson.appendChild(next_container);
    
            quiz_container.appendChild(lessons_containers);
            quiz_container.appendChild(next_lesson);
    
            // Store the created quiz container in the array
            quizContainers.push(quiz_container);
        });
    
        // Step 2: Append the quiz containers in reverse order
        quizContainers.reverse().forEach((quiz_container) => {
            quizzesNextDiv.parentNode.insertBefore(quiz_container, quizzesNextDiv.nextSibling);
        });
    
        // Update lessonContainers NodeList
        const lessonContainers = document.querySelectorAll(".container-lesson");
    
        document.querySelectorAll(".prev-next-bttn").forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                const index = parseInt(btn.getAttribute("data-index"));
                showLesson(lessonContainers, index, "327");
            });
        });

        document.querySelectorAll(".prev-next-bttn").forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                const index = parseInt(btn.getAttribute("data-index"));
                console.log(quizzes_options_answers)
                if (index == last_quizz_index + 1) {
                    if (quizzes_options_answers.includes(null)) {
                        loadQuiz(currentVideo)
                        showLesson(lessonContainers, 0, "339");
                        console.log("answer all quizzes")
                    } else {
                        var quizz_passed = true

                        quizzes_options_answers.forEach((answer, index) => {
                            if (answer != parseInt(right_answers[index])) {
                                quizz_passed = false
                            }
                        })
                        console.log("is quizz passed?: ", quizz_passed)
                        if (quizz_passed) {
                            //loadQuiz(currentVideo)
                            showLesson(lessonContainers, index, "359");
                        }
                        else {
                            console.log("eeeeeeeeeeeeeee")
                            loadQuiz(currentVideo)
                            showLesson(lessonContainers, 0, "364");
                            console.log("your answers were wrong")
                        }
                    }
                }
                else {
                    showLesson(lessonContainers, index, "369");
                }
            });
        });
        showLesson(lessonContainers, 0, "372");
    }

    function displayFeedbackMessage(message) {
        feedback_container = document.querySelector(".feedback_message")
        feedback_container.innerText = message;
    }

    function finishVideo(video_id, lessonContainers) {
        ajaxRequest("POST", "/videoFinished/", { videoId: video_id }, function (response) {
            if (response.success) {
                ajaxRequest("POST", "/level_progress/", { level_id: level_id }, function (response) {
                    updateProgress(response.level_progression);
                }, null, true, "level progression", null);

                videos.forEach(function (video) {
                    const videoID = video.dataset.id;
                    ajaxRequest("POST", "/get_video_icon/", { video_id: videoID }, function (response) {
                        console.log(response);
                        video.classList.remove("completed");
                        video.classList.remove("open");
                        video.classList.remove("locked");
                        video.classList.add(response.icon);
                        video.querySelector(".video_icon").src = static_url + "assets/" + response.icon + ".png"
            
                    }, null, true, "change video icons", null);
                });
                console.log('testing  ----------------')
                if (response.success) {
                    console.log("Response succeeded");
                    if (response.next_step) {
                        console.log("There is a next step");
                        changeVideo(response.next_step.video_id);
                        showLesson(lessonContainers, 0, "423");
                    } else {
                        console.log("There is no next step");
                        if (response.video_in_next_module === false) {
                            window.location.href = `/courses/${response.course_id}/levels?fid=2`;
                        } else if (response.level_finished === true) {
                            window.location.href = `/courses/${response.course_id}/levels?fid=0`;
                        } else if (response.finished_open_modules === true) {
                            window.location.href = `/courses/${response.course_id}/levels?fid=1`;
                        } else {
                            window.location.href = `/courses/${response.course_id}/levels?fid=3`
                        }
                    }
                } else {
                    window.location.href = `/courses/${response.course_id}/levels?fid=4`
                }
            } else {
                window.location.href = `/courses/${response.course_id}/levels?fid=5`
            }
        }, null, true, "video finished", null);
    }

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function (event) {
            event.preventDefault();
            const arrowIcon = toggle.querySelector('.arrow-icon');
            const modulesDropdowns = toggle.parentElement.nextElementSibling;

            arrowIcon.classList.toggle('rotate');
            modulesDropdowns.classList.toggle('open');
        });
    });


    lessonContainers = document.querySelectorAll(".container-lesson"); // Update lessonContainers NodeList

    document.querySelectorAll(".prev-next-bttn").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            const index = parseInt(btn.getAttribute("data-index"));
            showLesson(lessonContainers, index, "451");
        });
    });








    videos.forEach(function (video) {
        const videoID = video.dataset.id;
        ajaxRequest("POST", "/get_video_icon/", { video_id: videoID }, function (response) {
            console.log(response);
            video.classList.remove("completed");
            video.classList.remove("open");
            video.classList.remove("locked");
            video.classList.add(response.icon);
            video.querySelector(".video_icon").src = static_url + "assets/" + response.icon + ".png"

        }, null, true, "change video icons", null);
    });
});




