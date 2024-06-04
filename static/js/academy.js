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
  
    // Extract the videoId from the URL if it exists
    const urlParams = new URLSearchParams(window.location.search);
    const videoIdParam = urlParams.get("id");
  
    // Check if the videoIdParam exists and is in videosIDs
    let videoId = videosIDs.length > 0 ? videosIDs[0] : null;
    if (videoIdParam && videosIDs.includes(videoIdParam)) {
      videoId = videoIdParam;
      changeVideo(videoId);
    }
  
    const finishStepBttn = document.querySelector("#finishStep");
    finishStepBttn.addEventListener("click", function (e) {
      e.preventDefault();
      const popupContainer = document.createElement("div");
      popupContainer.classList.add("popup-next-video-container");
      const quizContainer = document.getElementById("contain-all");
      quizContainer.appendChild(popupContainer);
      const popupNextVideoContent = document.createElement("div");
      popupNextVideoContent.classList.add("popup-next-video-content");
      popupContainer.appendChild(popupNextVideoContent);
      const congrats = document.createElement("div");
      congrats.innerHTML = "Congratulations";
      congrats.classList.add("congrats");
  
      const congratsMessage = document.createElement("div");
      congratsMessage.innerHTML =
        "You finished your video, heading to the next one";
  
      congratsMessage.classList.add("congratsMessage");
  
      popupNextVideoContent.appendChild(congrats);
      popupNextVideoContent.appendChild(congratsMessage);
  
      setTimeout(() => {
        popupContainer.remove();
        changeToNextVideo(lessonContainers, currentVideo);
      }, 3000);
  
      console.log("finishStepBttn");
    });
  
    document.querySelectorAll(".iconlike").forEach(function (element) {
      toggleLikeCss(element);
      element.addEventListener("click", function (event) {
        toggleLike(event.currentTarget); // Pass the clicked element to toggleLike function
      });
    });
  
    function toggleLike(element) {
      ajaxRequest(
        "post",
        "/is_video_liked/",
        { video_id: currentVideo },
        function (response) {
          if (response.is_liked) {
            ajaxRequest(
              "post",
              "/remove_liked_video/",
              { video_id: currentVideo },
              function () {
                toggleLikeCss(element);
              },
              null,
              true,
              "Like video",
              null
            );
          } else {
            ajaxRequest(
              "post",
              "/add_liked_video/",
              { video_id: currentVideo },
              function () {
                toggleLikeCss(element);
              },
              null,
              true,
              "Dislike video",
              null
            );
          }
        },
        null,
        true,
        "Toggle like video",
        null
      );
    }
  
    function toggleLikeCss(element) {
      ajaxRequest(
        "post",
        "/is_video_liked/",
        { video_id: currentVideo },
        function (response) {
          console.log(response);
          if (response.is_liked) {
            element.classList.add("liked");
          } else {
            element.classList.remove("liked");
          }
        },
        null,
        true,
        "Toggle like video",
        null
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
      console.log(currentVideo);
    }
  
    function generateAnswers(options, rightAnswer) {
      const container = document.querySelector("#container-answers");
      const nextLessonBtn = document.querySelector(".quizz-next-page-btn");
      nextLessonBtn.style.display = "none";
  
      container.innerHTML = ""; // Clear the container first if needed
  
      // Remove any existing feedback message
      const existingFeedback = document.querySelector(".feedback-message");
      if (existingFeedback) {
        existingFeedback.remove();
      }
  
      options.forEach((option) => {
        const optionDiv = document.createElement("div");
        const optionSpan = document.createElement("span");
  
        // create div radio
        const optionRadio = document.createElement("div");
        const optionSelectedRadio = document.createElement("div");
        optionRadio.classList.add("option-radio");
        optionSelectedRadio.classList.add("selected-radio");
  
        optionDiv.className = `answer answer-${option.id}`;
        optionSpan.classList.add("answers-texts");
        optionSpan.textContent = option.text;
  
        optionDiv.appendChild(optionRadio);
        optionDiv.appendChild(optionSpan);
        container.appendChild(optionDiv);
  
        optionDiv.addEventListener("click", function () {
          // Disable further clicks
          container
            .querySelectorAll(".answer")
            .forEach((opt) => (opt.style.pointerEvents = "none"));
          const isCorrect = option.id == rightAnswer;
  
          optionRadio.appendChild(optionSelectedRadio);
  
          // optionDiv.style.backgroundColor = isCorrect ? '#0F0' : '#F00';
  
          // if (isCorrect) {
          //     optionDiv.classList.add('answer-right');
          //     if (!optionDiv.querySelector('img')) {
          //         const iconImage = document.createElement('img');
          //         iconImage.src = checkMarkSrc;
          //         iconImage.alt = 'Correct';
          //         optionDiv.appendChild(iconImage);
          //     }
          // } else {
          //     optionDiv.classList.add('answer-wrong');
          //     const iconImage = document.createElement('img');
          //     iconImage.src = closeMarkSrc;
          //     iconImage.alt = 'Incorrect';
          //     optionDiv.appendChild(iconImage);
          // }
  
          if (isCorrect) {
            nextLessonBtn.style.display = "flex";
            displayFeedbackMessage("Correct", true);
            const gradeNote = document.getElementById("grade-note");
            const gradeInformation = document.getElementById("grade-information");
            gradeInformation.style.display = "none";
            gradeNote.innerHTML = "100";
          } else {
            displayFeedbackMessage(
              "Sorry, that's incorrect. Please try again.",
              false
            );
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
  
      // create check icon for correct
      const checkIcon = document.createElement("div");
      checkIcon.classList.add("quiz-correct-icon");
      checkIcon.textContent = "\u2713";
  
      // create close icon
      const closeIcon = document.createElement("div");
      closeIcon.classList.add("quiz-wrong-icon");
      closeIcon.textContent = "x";
  
      // create span message
      const messageSpan = document.createElement("span");
      messageSpan.innerHTML = message;
  
      state && messageDiv.classList.add("right-answer-feedback");
  
      state
        ? messageDiv.appendChild(checkIcon)
        : messageDiv.appendChild(closeIcon);
      // messageDiv.textContent = message;
      messageDiv.appendChild(messageSpan);
  
      const container = document.querySelector("#container-answers");
      container.after(messageDiv);
    }
  
    function loadQuiz(videoId) {
      const nextLessonBtn = document.getElementById("nextLessonBtn");
  
      ajaxRequest(
        "POST",
        "/get-video/",
        { videoId: videoId },
        function (response) {
          console.log("response", response);
  
          if (response.success && response.video && response.video.quiz_options) {
            const answers = Object.entries(response.video.quiz_options).map(
              ([key, value], index) => ({
                id: index + 1,
                text: value,
              })
            );
            generateAnswers(answers, response["video"].answer || null);
          } else {
            displayFeedbackMessage(
              "Error loading quiz data. Please try again.",
              false
            );
          }
        },
        function () {
          displayFeedbackMessage(
            "Error loading quiz data. Please try again.",
            false
          );
        },
        true,
        "Load quiz",
        null
      );
    }
  
    function changeVideo(videoId) {
      console.log("THE CURRENT VIDEO ID: " + videoId);
      currentVideo = videoId;
      ajaxRequest(
        "POST",
        "/get-video/",
        { videoId: videoId },
        function (response) {
          if (response.success && response.video) {
            document.querySelector(".videoSRC").src = response.video.video_file;
            document.querySelector("video").load();
            document
              .querySelectorAll(".lesson-text")
              .forEach((el) => (el.innerText = response.video.title));
            document
              .querySelectorAll(".title-lesson-description")
              .forEach((el) => (el.innerText = response.video.title));
  
            document.querySelectorAll(".description-step-video").forEach((el) => {
              el.innerHTML = response.video.notes;
              console.log("test for sections", response.video.notes);
              // Add Fancybox attribute to images inside figure elements
              el.querySelectorAll("figure img").forEach((img, index) => {
                img.closest("figure").setAttribute("data-fancybox", "gallery");
                img.closest("figure").setAttribute("href", img.src);
              });
            });
  
            // Render CKEditor content for summary
            document.querySelectorAll(".content-text-inside").forEach((el) => {
              el.innerHTML = response.video.summary;
            });
  
            document
              .querySelectorAll(".question-text")
              .forEach(
                (el) =>
                  (el.innerText = `Question: ${response.video.quiz_question}`)
              );
            //HIGHLIGHT CODE SNIPPETS
            Prism.highlightAll();
            // Load quiz options
            loadQuiz(videoId);
          } else {
            displayFeedbackMessage(
              "Error loading video data. Please try again.",
              false
            );
          }
        },
        function () {
          displayFeedbackMessage(
            "Error loading video data. Please try again.",
            false
          );
        },
        true,
        "get current video details",
        null
      );
    }
  
    function changeToNextVideo(lessonContainers, currentVideoID) {
      console.log(lessonContainers, currentVideoID);
      ajaxRequest(
        "POST",
        "/next-video/",
        { video_id: currentVideoID },
        function (response) {
          finishVideo(currentVideoID);
          if (response.next_video) {
            changeVideo(response.next_video);
            showLesson(lessonContainers, 0);
          }
        },
        null,
        true,
        "change to next video",
        null
      );
    }
  
    function finishVideo(video_id) {
      ajaxRequest(
        "POST",
        "/videoFinished/",
        { videoId: video_id },
        function (response) {
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
        },
        null,
        true,
        "video finished",
        null
      );
    }
  });
  updateProgress("80");
  