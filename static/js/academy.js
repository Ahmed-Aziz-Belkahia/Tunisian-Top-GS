document.addEventListener("DOMContentLoaded", function () {
    var dropdownToggles = document.querySelectorAll(".dropdownToggle");
    var currentVideo = null;
    dropdownToggles.forEach(function (toggle) {
        toggle.addEventListener("click", function (event) {
            event.preventDefault();
            var modules = this.parentNode.nextElementSibling;
            modules.classList.toggle("is-active");
        });
    });

    ajaxRequest("POST", "/level_progress/", { level_id: level_id },function (response) {
            updateProgress(response.level_progression);
        }, null, false, "level progression", null
    );

    const lessonContainers = document.querySelectorAll(".container-lesson");
    var prev_next_bttns = document.querySelectorAll(".prev-next-bttn");

    const videos = document.querySelectorAll(".videos");
    let videosIDs = [];

    videos.forEach(function (video) {
        const videoID = video.dataset.id;
        videosIDs.push(videoID);

        video.addEventListener("click", function (e) {
            e.preventDefault();
            changeVideo(videoID);
            showLesson(lessonContainers, 0);
        });
    });
    var currentVideo = videosIDs[0];

    prev_next_bttns.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            showLesson(lessonContainers, btn.getAttribute("data-index"));
        });
    });

    showLesson(lessonContainers, 0);
    changeVideo(currentVideo);

    const urlParams = new URLSearchParams(window.location.search);
    const videoIdParam = urlParams.get("id");

    let videoId = videosIDs.length > 0 ? videosIDs[0] : null;
    if (videoIdParam && videosIDs.includes(videoIdParam)) {
        videoId = videoIdParam;
        changeVideo(videoId);
    }

    const finishStepBttn = document.querySelector("#finishStep");
    finishStepBttn.addEventListener("click", function (e) {
        e.preventDefault();
        finishVideo(currentVideo, lessonContainers);
    });

    document.querySelectorAll(".iconlike").forEach(function (element) {
        toggleLikeCss(element);
        element.addEventListener("click", function (event) {
            toggleLike(event.currentTarget);
        });
    });

    function toggleLike(element) {
        ajaxRequest("post", "/is_video_liked/", { video_id: currentVideo },

            function (response) {
                if (response.is_liked) {
                    ajaxRequest( "post", "/remove_liked_video/", { video_id: currentVideo }, function () {toggleLikeCss(element);}, null, false, "Like video", null);
                } else {
                    ajaxRequest( "post", "/add_liked_video/", { video_id: currentVideo }, function () {toggleLikeCss(element);}, null, false, "Dislike video", null);
                }
            }

            , null, false, "Toggle like video", null
        );
    }

    function toggleLikeCss(element) {
        ajaxRequest("post", "/is_video_liked/", { video_id: currentVideo },

            function (response) {
                if (response.is_liked) {
                    element.classList.add("liked");
                } else {
                    element.classList.remove("liked");
                }
            },

            null,
            false,
            "Toggle like video",
            null
        );
    }


    function generateAnswers(options, rightAnswer) {
        const container = document.querySelector("#container-answers");
        const nextLessonBtn = document.querySelector(".quizz-next-page-btn");
        nextLessonBtn.style.display = "none";

        container.innerHTML = "";

        const existingFeedback = document.querySelector(".feedback-message");
        if (existingFeedback) {
            existingFeedback.remove();
        }

        options.forEach((option) => {
            const optionDiv = document.createElement("div");
            const optionSpan = document.createElement("span");
            const optionImg = document.createElement("img");

            const optionRadio = document.createElement("div");
            const optionSelectedRadio = document.createElement("div");
            optionRadio.classList.add("option-radio");
            optionSelectedRadio.classList.add("selected-radio");

            optionDiv.className = `answer answer-${option.id}`;
            optionSpan.classList.add("answers-texts");
            optionSpan.textContent = option.text;
            if (option.image) {
                optionImg.src = option.image;
                optionImg.alt = option.text;
                optionImg.classList.add("answer-image");
            }

            optionDiv.appendChild(optionRadio);
            optionDiv.appendChild(optionSpan);
            if (option.image) {
                optionDiv.appendChild(optionImg);
            }
            container.appendChild(optionDiv);

            optionDiv.addEventListener("click", function () {
                container.querySelectorAll(".answer").forEach((opt) => (opt.style.pointerEvents = "none"));
                const isCorrect = option.id == rightAnswer;

                optionRadio.appendChild(optionSelectedRadio);

                if (isCorrect) {
                    nextLessonBtn.style.display = "flex";
                    displayFeedbackMessage("Correct", true);
                    const gradeNote = document.getElementById("grade-note");
                    const gradeInformation = document.getElementById("grade-information");
                    gradeInformation.style.display = "none";
                    gradeNote.innerHTML = "100";
                } else {
                    displayFeedbackMessage("Sorry, that's incorrect. Please try again.", false);
                    showRetryButton(options, rightAnswer);
                }
            });
        });
    }

    function showRetryButton(options, rightAnswer) {
        const retryButton = document.createElement("button");
        retryButton.textContent = "Retry Quiz";
        retryButton.classList.add("retry-button");
        retryButton.onclick = function () {
            generateAnswers(options, rightAnswer);
            retryButton.remove();
        };

        const container = document.querySelector("#container-answers");
        const existingButton = document.querySelector(".retry-button");
        if (!existingButton) {
            container.after(retryButton);
        }
    }

    function displayFeedbackMessage(message, state) {
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

        state && messageDiv.classList.add("right-answer-feedback");

        state
            ? messageDiv.appendChild(checkIcon)
            : messageDiv.appendChild(closeIcon);

        messageDiv.appendChild(messageSpan);

        const container = document.querySelector("#container-answers");
        container.after(messageDiv);
    }

    function loadQuiz(videoId) {
        const nextLessonBtn = document.getElementById("nextLessonBtn");

        ajaxRequest("POST", "/get-video/", { videoId: videoId },

            function (response) {
                //OLD CODE (i changed the API response to handle multiple quizes)

                /* if (response.success && response.video && response.video.quizes) {
                    const options = response.video.quizes.map((option) => ({
                        id: option.id,
                        text: option.text,
                        image: option.image,
                    }));
                    generateAnswers(options, response["video"].answer || null);
                } else {
                    displayFeedbackMessage("Error loading quiz data. Please try again.", false);
                } */
            },

            function () {
                displayFeedbackMessage("Error loading quiz data. Please try again.", false);
            },

            true, "Load quiz", null
        );
    }

  
    function changeVideo(videoId) {
        currentVideo = videoId;
        ajaxRequest("POST", "/get-video/", { videoId: videoId },

            function (response) {
                if (response.success && response.video) {
                    document.querySelector(".videoSRC").src = response.video.video_file;
                    document.querySelector("video").load();
                    document.querySelectorAll(".lesson-text").forEach((el) => (el.innerText = response.video.title));
                    document.querySelectorAll(".title-lesson-description").forEach((el) => (el.innerText = response.video.title));
                    document.querySelectorAll(".description-step-video").forEach((el) => {
                        el.innerHTML = response.video.notes;
                        el.querySelectorAll("figure img").forEach((img, index) => {
                            img.closest("figure").setAttribute("data-fancybox", "gallery");
                            img.closest("figure").setAttribute("href", img.src);
                        });
                    });
                    document.querySelectorAll(".content-text-inside").forEach((el) => {
                        el.innerHTML = response.video.summary;
                    });
                    // document.querySelectorAll(".question-text").forEach((el) => (el.innerText = `Question: ${response.video_quiz}`));
                    Prism.highlightAll();
                    loadQuiz(videoId);
                } else {
                    displayFeedbackMessage("Error loading video data. Please try again.", false);
                }
            },

            null, true, "get video details", null);
    }

    function finishVideo(video_id, lessonContainers) {
        ajaxRequest("POST", "/videoFinished/", { videoId: video_id },

            function (response) {
                if (response.success) {
                    const next_step = response.next_step;

                    ajaxRequest(
                        "POST",
                        "/level_progress/",
                        { level_id: level_id },
                        function (response) {
                            updateProgress(response.level_progression);
                        },
                        null,
                        true,
                        "level progression",
                        null
                    );

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
            },

            null, false, "video finished", null
        );
    }
    
    function updateProgress(percentage) {
        var levelProgressText = document.querySelector(".percentage-progess");
        var progressBar = document.getElementById("progressBar");
        levelProgressText.innerText = `${percentage}% complete`;
        progressBar.style.width = percentage + "%";
    }

    function showLesson(lessonContainers, index) {
        lessonContainers.forEach((container, i) => {
            container.style.display = i == index ? "flex" : "none";
        });
    }

    function changeToNextVideo(lessonContainers, currentVideoID) {
        console.log(lessonContainers, currentVideoID);
        ajaxRequest("POST", "/next-video/", { video_id: currentVideoID },

            function (response) {
                if (response.next_video) {
                    changeVideo(response.next_video);
                    showLesson(lessonContainers, 0);
                } else {
                    displayFeedbackMessage("No more videos available.", false);
                }
            },

            null, false, "change to next video", null
        );
    }
});
