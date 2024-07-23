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
    }, 15000);
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