document.addEventListener("DOMContentLoaded", function () {
    // Initializing variables
    var dropdownToggles = document.querySelectorAll(".dropdownToggle");
    var currentVideo = null;
    var prev_next_bttns = document.querySelectorAll(".prev-next-bttn");
    const lessonContainers = document.querySelectorAll(".container-lesson");
    const videos = document.querySelectorAll(".videos");
    let videosIDs = [];

    // Adding click event listeners to dropdown toggles
    dropdownToggles.forEach(function (toggle) {
        toggle.addEventListener("click", function (event) {
            event.preventDefault();
            var modules = this.parentNode.nextElementSibling;
            modules.classList.toggle("is-active");
        });
    });

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
            showLesson(lessonContainers, 0);
        });
    });

    // Setting the current video to the first video
    currentVideo = videosIDs[0];



    // Displaying the first lesson
    showLesson(lessonContainers, 0);
    changeVideo(currentVideo);

    // Handling URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const videoIdParam = urlParams.get("id");
    let videoId = videosIDs.length > 0 ? videosIDs[0] : null;
    if (videoIdParam && videosIDs.includes(videoIdParam)) {
        videoId = videoIdParam;
        changeVideo(videoId);
    }

    // Adding click event listener to the finish step button
    const finishStepBttn = document.querySelector("#finishStep");
    if (finishStepBttn) {
        finishStepBttn.addEventListener("click", function (e) {
            e.preventDefault();
            finishVideo(currentVideo, lessonContainers);
        });
    } else {
        console.error("#finishStep button not found");
    }

    // Adding click event listeners to like icons
    document.querySelectorAll(".iconlike").forEach(function (element) {
        toggleLikeCss(element);
        element.addEventListener("click", function (event) {
            toggleLike(event.currentTarget);
        });
    });

    // Function to handle like toggle
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

    // Function to update like CSS
    function toggleLikeCss(element) {
        ajaxRequest("post", "/is_video_liked/", { video_id: currentVideo }, function (response) {
            if (response.is_liked) {
                element.classList.add("liked");
            } else {
                element.classList.remove("liked");
            }
        }, null, false, "Toggle like video", null);
    }

    // Function to update level progress
    function updateProgress(percentage) {
        var levelProgressText = document.querySelector(".percentage-progess");
        var progressBar = document.getElementById("progressBar");
        if (levelProgressText) {
            levelProgressText.innerText = `${percentage}% complete`;
        }
        if (progressBar) {
            progressBar.style.width = percentage + "%";
        }
    }

    

























    // Function to show specific lesson
    function showLesson(lessonContainers, index) {
        console.log("test", index)
        lessonContainers.forEach((container, i) => {
            container.style.display = i == index ? "flex" : "none";
        });
    }

    // Function to change the current video
    function changeVideo(videoId) {
        currentVideo = videoId;
        ajaxRequest("POST", "/get-video/", { videoId: videoId }, function (response) {
            if (response.success && response.video) {
                const videoSRC = document.querySelector(".videoSRC");
                if (videoSRC) {
                    videoSRC.src = response.video.video_file;
                    document.querySelector("video").load();
                }
    
                // Update video description and summary
                document.querySelectorAll(".description-step-video").forEach((el) => {
                    if (el) el.innerHTML = response.video.notes;
                });
                document.querySelectorAll(".content-text-inside").forEach((el) => {
                    if (el) el.innerHTML = response.video.summary;
                });
                Prism.highlightAll();
                loadQuiz(videoId);
    
                // Add active class to the current step and remove from previous step
                document.querySelectorAll('.step').forEach(step => {
                    step.classList.remove('active-step');
                });
                const currentStepElement = document.querySelector(`.videos[data-id='${videoId}'] .step`);
                if (currentStepElement) {
                    currentStepElement.classList.add('active-step');
                }
            } else {
                displayFeedbackMessage("Error loading video data. Please try again.", false);
            }
        }, null, false, "get video details", null);
    }

    // Function to load quiz for a video
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

    // Function to generate quiz answers
    function generateAnswers(quizzes) {
        var quizzesNextDiv = document.querySelector('.quizzes_next');

        var quizzes_containers = document.querySelectorAll(".container-quiz")
        quizzes_containers.forEach((quiz_container) => {
            quiz_container.remove();
        })

        quizzes.forEach((quizz, index) => {
            var quiz_container = document.createElement("div");
            quiz_container.classList.add("container-quiz", "container-lesson")

            var lessons_containers = document.createElement("div");
            lessons_containers.classList.add("content-video-lesson");

            var title_default_quiz = document.createElement("div")
            title_default_quiz.classList.add("title-default-quiz")
            title_default_quiz.innerHTML = `
                <span class="text-default-quiz">QUIZZES</span>
            `

            var grade_container = document.createElement("div");
            grade_container.classList.add("grade-container")
            grade_container.innerHTML = `
                <div class="grade-note">
                    Your grade: <span id="grade-note">0</span>%
                </div>
                <div class="grade-information" id="grade-information">
                    Passing grade: 100%
                </div>
            `
            lessons_containers.appendChild(title_default_quiz)
            lessons_containers.appendChild(grade_container)

            var fill_question = document.createElement("div");
            fill_question.classList.add("fill-question");

            var quiz_question = document.createElement("div");
            quiz_question.classList.add("fill-question");
            quiz_question.innerText=quizz.question

            fill_question.appendChild(quiz_question);

            var container_answers = document.createElement("ul");
            container_answers.classList.add("container-answers");

            quizz.options.forEach((option) => {
                var answer_option = document.createElement("li");
                answer_option.classList.add("option-container", "answer-option")
                answer_option.setAttribute('data-option-id', option.id);

                if (option.text) {
                    const spanElement = document.createElement('span');
                    spanElement.className = 'span-answers-quiz';
                    spanElement.innerText = option.text;
                    answer_option.appendChild(spanElement);
                }

                // Check if the option has an image and add an img element if it does
                if (option.img) {
                    const imgElement = document.createElement('img');
                    imgElement.className = 'img-answers-quiz';
                    imgElement.src = option.img.url;
                    answer_option.appendChild(imgElement);
                }

                container_answers.appendChild(answer_option)

            })

            fill_question.appendChild(container_answers)
            lessons_containers.appendChild(fill_question)
            var next_lesson = document.createElement('div')
            next_lesson.classList.add('next-lesson')

            var prev_container = document.createElement('div')

            var prev_button = document.createElement('a')
            prev_button.classList.add("prev-btn", "prev-next-bttn")
            prev_button.setAttribute('data-index', index+1);
            prev_button.innerHTML = `<img src="/static/assets/back.svg" alt="arrow-left" />BACK`

            prev_container.appendChild(prev_button)
            next_lesson.appendChild(prev_container)

            var next_container = document.createElement('div')

            var next_button = document.createElement('a')
            next_button.classList.add("keep-next", "prev-next-bttn", "quizz-next-page-btn")
            next_button.setAttribute('data-index', index+2);
            next_button.innerHTML = `NEXT <img src="/static/assets/next.svg" alt="arrow-right" />`

            next_container.appendChild(next_button)
            next_lesson.appendChild(next_container)

            quiz_container.appendChild(lessons_containers);
            quiz_container.appendChild(next_lesson);

            console.log(quiz_container)
            quizzesNextDiv.parentNode.insertBefore(quiz_container, quizzesNextDiv.nextSibling);
        });
        
        var prev_next_bttns = document.querySelectorAll(".prev-next-bttn");
        prev_next_bttns.forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                showLesson(lessonContainers, btn.getAttribute("data-index"));
            });
        });
    }

    function displayFeedbackMessage(message, state) {
        const container = document.querySelector(".container-answers");
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("feedback-message");

        const checkIcon = document.createElement("div");
        checkIcon.classList.add("quiz-correct-icon");
        checkIcon.textContent = "\u2713";

        const closeIcon = document.createElement("div");
        closeIcon.classList.add("quiz-wrong-icon");
        closeIcon.textContent = "x";

        const messageSpan = document.createElement("span");
        messageSpan.innerHTML = message;

        if (state) {
            messageDiv.classList.add("right-answer-feedback");
            messageDiv.appendChild(checkIcon);
        } else {
            messageDiv.appendChild(closeIcon);
        }

        messageDiv.appendChild(messageSpan);
        container.after(messageDiv);
    }

/*     function showRetryButton(quizzes) {
        const retryButton = document.createElement("button");
        retryButton.textContent = "Retry Quiz";
        retryButton.classList.add("retry-button");
        retryButton.onclick = function () {
            generateAnswers(quizzes);
            retryButton.remove();
        };

        const container = document.querySelector(containerSelector);
        const existingButton = document.querySelector(".retry-button");
        if (container && !existingButton) {
            container.after(retryButton);
        }
    } */




    

    // Function to mark video as finished
    function finishVideo(video_id, lessonContainers) {
        ajaxRequest("POST", "/videoFinished/", { videoId: video_id }, function (response) {
            if (response.success) {
                const next_step = response.next_step;

                ajaxRequest("POST", "/level_progress/", { level_id: level_id }, function (response) {
                    updateProgress(response.level_progression);
                }, null, true, "level progression", null);

                const videoElement = document.querySelector(`[data-id='${video_id}']`);
                if (videoElement) {
                    videoElement.classList.remove("locked");
                    videoElement.classList.add("completed");
                    const icon = videoElement.querySelector(".step-icon img");
                    if (icon) {
                        icon.src = checkMarkSrc;
                    }
                }

                if (next_step) {
                    changeVideo(next_step.video_id);
                    showLesson(lessonContainers, 0);
                } else {
                    displayFeedbackMessage("No more videos available.", false);
                }
            } else {
                displayFeedbackMessage("Error finishing video. Please try again.", false);
            }
        }, null, true, "video finished", null);
    }


    // Adding click event listeners to previous and next buttons
    prev_next_bttns.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            showLesson(lessonContainers, btn.getAttribute("data-index"));
        });
    });

});