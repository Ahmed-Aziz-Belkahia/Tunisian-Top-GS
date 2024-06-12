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

    // Adding click event listeners to previous and next buttons
    prev_next_bttns.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            showLesson(lessonContainers, btn.getAttribute("data-index"));
        });
    });

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

    // Function to generate quiz answers
    function generateAnswers(options, rightAnswer) {
        const container = document.querySelector("#container-answers");
        const nextLessonBtn = document.querySelector(".quizz-next-page-btn");
        if (nextLessonBtn) {
            nextLessonBtn.style.display = "none";
        }

        if (container) {
            container.innerHTML = "";
        } else {
            console.error("Container for answers not found");
            return;
        }

        const existingFeedback = document.querySelector(".feedback-message");
        if (existingFeedback) {
            existingFeedback.remove();
        }

        let selectedOptionId = null;

        options.forEach((option) => {
            const optionDiv = document.createElement("li");
            optionDiv.classList.add("option-container", "answer-option");
            optionDiv.dataset.optionId = option.id;

            const optionSpan = document.createElement("span");
            optionSpan.textContent = option.text;

            optionDiv.appendChild(optionSpan);

            if (option.image) {
                const optionImg = document.createElement("img");
                optionImg.src = option.image;
                optionImg.alt = option.text;

                optionImg.onclick = function () {
                    openModal(option.image);
                };
                optionDiv.appendChild(optionImg);
            }

            container.appendChild(optionDiv);

            optionDiv.addEventListener("click", function () {
                container.querySelectorAll(".answer-option").forEach((opt) => opt.classList.remove("selected"));
                optionDiv.classList.add("selected");
                selectedOptionId = option.id;
            });
        });

        const submitButton = document.createElement("button");
        submitButton.textContent = "Submit";
        submitButton.classList.add("submit-button");
        submitButton.onclick = function () {
            if (selectedOptionId === null) {
                displayFeedbackMessage("Please select an option.", false);
                return;
            }
            const isCorrect = selectedOptionId == rightAnswer;

            container.querySelectorAll(".answer-option").forEach((opt) => (opt.style.pointerEvents = "none"));

            if (isCorrect) {
                if (nextLessonBtn) {
                    nextLessonBtn.style.display = "flex";
                }
                displayFeedbackMessage("Correct", true);
                const gradeNote = document.getElementById("grade-note");
                const gradeInformation = document.getElementById("grade-information");
                if (gradeInformation) {
                    gradeInformation.style.display = "none";
                }
                if (gradeNote) {
                    gradeNote.innerHTML = "100";
                }
            } else {
                displayFeedbackMessage("Sorry, that's incorrect. Please try again.", false);
                showRetryButton(options, rightAnswer);
            }
            submitButton.remove();
        };

        container.after(submitButton);
    }

    // Function to show retry button for quiz
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
        if (container && !existingButton) {
            container.after(retryButton);
        }
    }

    // Function to display feedback message
    function displayFeedbackMessage(message, state) {
        const container = document.querySelector("#container-answers");
        if (!container) {
            console.error("Container for answers not found");
            return;
        }

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

        if (container) {
            container.after(messageDiv);
        } else {
            console.error("Container for answers not found");
        }
    }

    // Function to load quiz for a video
    function loadQuiz(videoId) {
        ajaxRequest("POST", "/get-video/", { videoId: videoId }, function (response) {
            if (response.success && response.video && response.video.quizes) {
                const quiz = response.video.quizes[0];
                const options = quiz.options.map(option => ({
                    id: option.id,
                    text: option.text,
                    image: option.img
                }));

                // Display the question
                const questionContainer = document.querySelector("#quiz-question");
                if (questionContainer) {
                    questionContainer.textContent = quiz.question;
                } else {
                    console.error("Question container not found");
                }

                generateAnswers(options, quiz.correct_option_id);
            } else {
                displayFeedbackMessage("Error loading quiz data. Please try again.", false);
            }
        }, function () {
            displayFeedbackMessage("Error loading quiz data. Please try again.", false);
        }, true, "Load quiz", null);
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
        }, null, true, "get video details", null);
    }
    

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
        lessonContainers.forEach((container, i) => {
            container.style.display = i == index ? "flex" : "none";
        });
    }

    // Function to change to the next video
    function changeToNextVideo(lessonContainers, currentVideoID) {
        ajaxRequest("POST", "/next-video/", { video_id: currentVideoID }, function (response) {
            if (response.next_video) {
                changeVideo(response.next_video);
                showLesson(lessonContainers, 0);
            } else {
                displayFeedbackMessage("No more videos available.", false);
            }
        }, null, false, "change to next video", null);
    }
});
