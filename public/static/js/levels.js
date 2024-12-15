function showPopupMessage(message) {
    const popupMessage = document.getElementById('popupMessage');
    const popupSpan = document.getElementById('popupSpan');
    popupSpan.innerText = message;
    popupMessage.style.display = 'flex';

    document.getElementById('popUpCloseButton').addEventListener('click', function () {
        popupMessage.style.display = 'none';
    });

    // Hide the popup automatically after 15 seconds
    setTimeout(function () {
        popupMessage.style.display = 'none';
    }, 2000);
}

function fetchCourseProgress() {
    document.querySelectorAll('.learning-step').forEach(function(level) {
        var levelId = level.getAttribute('data-id');
        var progressPercent = level.querySelector('.progressTXT');
        var progressBar = level.querySelector('.progress');

        $.ajax({
            type: 'POST',
            url: '/level_progress/',
            data: {
                level_id: levelId
            },
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"));
            },
            success: function(response) {
                if (response.success) {
                    progressPercent.innerText = `${response.level_progression}%`;
                    progressBar.style.width = `${response.level_progression}%`;
                } else {
                    showPopupMessage('Failed to fetch progress data.');
                }
            },
            error: function(error) {
                showPopupMessage('An error occurred while fetching progress data.');
            }
        });
    });
}

$(document).ready(function() {
    fetchCourseProgress();

    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const fid = params.get('fid');
    const lvl = params.get('lvl');

    const askQuestionButton = document.getElementById('askQuestionButton');
    const modal = document.getElementById('askQuestionModal');
    const closeButton = modal.querySelector('.close-button');
    const submitButton = document.getElementById('submitQuestionButton');
    const ratings = document.querySelectorAll(".rateoption")
    const successMessage = document.getElementById('successMessage');
    const userQuestion = document.getElementById('userQuestion');
  
    submitButton.disabled = true;


    choosed_rating = null

    // Toggle modal visibility
    askQuestionButton.addEventListener('click', () => {
        modal.classList.toggle('hidden');
        modal.classList.toggle('show');
    });
  
    // Hide the modal when the close button is clicked
    closeButton.addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.classList.remove('show');
        successMessage.classList.add('hidden'); // Hide success message if visible
    });
  
    // Hide modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.add('hidden');
            modal.classList.remove('show');
            successMessage.classList.add('hidden');
        }
    });
  
    ratings.forEach(function (ratingi) {
        ratingi.addEventListener("click", function (event) {
            // Clear the 'selected' class from all ratings
            ratings.forEach(function (rr) {
                rr.classList.remove("selected");
            });
    
            // Set the selected rating value
            choosed_rating = ratingi.getAttribute("data-rating");
            
            // Add 'selected' class to the clicked element
            event.target.classList.add("selected");
    
            // Display the question section and hide the rating section
            let userQuestion = document.querySelector("#userQuestion");
    
            submitButton.disabled = false;

            userQuestion.style.display = "block";
    
            console.log(`Selected rating: ${choosed_rating}`); // Debugging log
        });
    });
    





    if (lvl) {
        // Submit question functionality
        submitButton.addEventListener('click', () => {
            const feedback = userQuestion.value || "";
            if (choosed_rating) {
                ajaxRequest("POST", "/submit-lvl-feedback/", {lvl: lvl, rating: choosed_rating, feedback: feedback}, (response) => {
                    modal.classList.add('hidden');
                    modal.classList.remove('show');
                    showPopupMessage("Feedback submitted. Thank you for your feedback")
                    submitButton.disabled = false;
                    userQuestion.value=""
                }, (response) => {
                    modal.classList.add('hidden');
                    modal.classList.remove('show');
                    showPopupMessage("We couldn't submit your feedback, Try again later")
                    userQuestion.value=""
                }, false, "Submit Feedback", ()=>{
                    submitButton.disabled = true;
                })
            }
    
        });

        document.querySelector("#askQuestionButton").style.display = "flex";
        modal.classList.toggle('hidden');
        modal.classList.toggle('show');
    }

    /* ga3mouza */
    if (fid) {
        let messages = {
            0: "Level is finished.",
            1: "No more open modules.",
            2: "No video in module.",
            3: "No more video available.",
            4: "Failed to finish video.",
            5: "Response failed."
        };
        showPopupMessage(messages[fid]);
    }
});