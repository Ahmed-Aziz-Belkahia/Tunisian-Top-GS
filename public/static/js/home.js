document.addEventListener('DOMContentLoaded', function() {
    
    const pointsCounter = document.querySelector(".points-counter");
    const courseProgressionCounter = document.querySelector(
    ".points-counter.points"
    );
    const courseProgressionSlider = document.querySelector(
    ".progress-bar-inner.points"
    );

    function updateProgressBar(response) {
    courseProgressionCounter.innerText = response.points + "/" + response.goal;
    courseProgressionSlider.style.width = response.percentage + "%";
    }


    var lossesPercentageBtcElement = document.querySelectorAll('.btc-percentage');
    var lossesPercentageEthElement = document.querySelectorAll('.eth-percentage');
    var lossesPercentageSolElement = document.querySelectorAll('.sol-percentage');
    var lossesPercentageAvaxElement = document.querySelectorAll('.avax-percentage');

    var lossesBtcElement = document.querySelectorAll('.btc-price');
    var lossesEthElement = document.querySelectorAll('.eth-price');
    var lossesSolElement = document.querySelectorAll('.sol-price');
    var lossesAvaxElement = document.querySelectorAll('.avax-price');
    var cryptoChart = document.querySelectorAll('.coin-chart');
    var cryptoPrice = document.querySelectorAll('.coin-price');
    var cryptoLoader = document.querySelectorAll('.loading-coin');
    var PercentageDivBg = document.querySelectorAll('.percentage-coin');
    var PercentageArrowUP = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2EBE7B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-up-right"><path d="M13 5H19V11"/><path d="M19 5L5 19"/></svg>';
    var PercentageArrowDown = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DA5C54" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-down-right"><path d="M19 13V19H13"/><path d="M5 5L19 19"/></svg>';

    
    function loadCryptoStats() {
        cryptoChart.forEach(function(element) {
            element.style.display = 'none';
        });
        cryptoPrice.forEach(function(element) {
            element.style.display = 'none';
        });
        cryptoLoader.forEach(function(element) {
            element.style.display = 'flex';
        });
    }


    ajaxRequest('GET', '/getCryptoDetails/', loadCryptoStats, function(response){
            var btc     = response["crypto_details"].btc;
            var eth     = response["crypto_details"].eth;
            var sol     = response["crypto_details"].sol;
            var avax    = response["crypto_details"].avax;


            cryptoChart.forEach(function(element) {
                element.style.display = 'block';
            });
            cryptoPrice.forEach(function(element) {
                element.style.display = 'flex';
            });
            cryptoLoader.forEach(function(element) {
                element.style.display = 'none';
            });

            lossesPercentageBtcElement.forEach(function(element) {
            element.textContent = btc[1].toFixed(2) + "%";
            if (btc[1] > 0) {
                //parent of the element
                element.parentNode.classList.add('percentage');
                //create another child and add svg to it 
                var imgElement = document.createElement('img');
                imgElement.setAttribute('src', 'data:image/svg+xml;base64,' + btoa(PercentageArrowUP));
                imgElement.setAttribute('width', '24');
                imgElement.setAttribute('height', '24');
                element.parentNode.appendChild(imgElement);

                var parentDiv = element.parentNode; // Parent div with class "percentage-coin"
                var grandParentDiv = parentDiv.parentNode; // Parent div with class "coin-info"
                var cryptoCoinDiv = grandParentDiv.parentNode; // Parent div with class "crypto-coin"
                var cryptoChar = cryptoCoinDiv.querySelector('.coin-chart');
                cryptoChar.setAttribute('src', '/static/assets/Chart-Up-1.svg');
                
            }
            else {
                element.parentNode.classList.add('percentage-down');
                var imgElement = document.createElement('img');
                imgElement.setAttribute('src', 'data:image/svg+xml;base64,' + btoa(PercentageArrowDown));
                imgElement.setAttribute('width', '24');
                imgElement.setAttribute('height', '24');
        
                // Append the <img> to the parent element
                element.parentNode.appendChild(imgElement);

                var parentDiv = element.parentNode; // Parent div with class "percentage-coin"
                var grandParentDiv = parentDiv.parentNode; // Parent div with class "coin-info"
                var cryptoCoinDiv = grandParentDiv.parentNode; // Parent div with class "crypto-coin"
                var cryptoChar = cryptoCoinDiv.querySelector('.coin-chart');
                cryptoChar.setAttribute('src', '/static/assets/Chart-down-1.svg');
                
                
            }
            });
            lossesPercentageEthElement.forEach(function(element) {
            element.textContent = eth[1].toFixed(2) + "%";
                if (eth[1] > 0) {
                    //parent of the element
                    element.parentNode.classList.add('percentage');
                    //create another child and add svg to it 
                    var imgElement = document.createElement('img');
                    imgElement.setAttribute('src', 'data:image/svg+xml;base64,' + btoa(PercentageArrowUP));
                    imgElement.setAttribute('width', '24');
                    imgElement.setAttribute('height', '24');
                    element.parentNode.appendChild(imgElement);

                    var parentDiv = element.parentNode; // Parent div with class "percentage-coin"
                    var grandParentDiv = parentDiv.parentNode; // Parent div with class "coin-info"
                    var cryptoCoinDiv = grandParentDiv.parentNode; // Parent div with class "crypto-coin"
                    var cryptoChar = cryptoCoinDiv.querySelector('.coin-chart');
                    cryptoChar.setAttribute('src', '/static/assets/Chart-Up-1.svg');
                    
                }
                else {
                    element.parentNode.classList.add('percentage-down');
                    var imgElement = document.createElement('img');
                    imgElement.setAttribute('src', 'data:image/svg+xml;base64,' + btoa(PercentageArrowDown));
                    imgElement.setAttribute('width', '24');
                    imgElement.setAttribute('height', '24');
            
                    // Append the <img> to the parent element
                    element.parentNode.appendChild(imgElement);

                    var parentDiv = element.parentNode; // Parent div with class "percentage-coin"
                    var grandParentDiv = parentDiv.parentNode; // Parent div with class "coin-info"
                    var cryptoCoinDiv = grandParentDiv.parentNode; // Parent div with class "crypto-coin"
                    var cryptoChar = cryptoCoinDiv.querySelector('.coin-chart');
                    cryptoChar.setAttribute('src', '/static/assets/Chart-down-1.svg');
                    
                }
            });
            lossesPercentageSolElement.forEach(function(element) {
            element.textContent = sol[1].toFixed(2) + "%";
                if (sol[1] > 0) {
                    //parent of the element
                    element.parentNode.classList.add('percentage');
                    //create another child and add svg to it 
                    var imgElement = document.createElement('img');
                    imgElement.setAttribute('src', 'data:image/svg+xml;base64,' + btoa(PercentageArrowUP));
                    imgElement.setAttribute('width', '24');
                    imgElement.setAttribute('height', '24');
                    element.parentNode.appendChild(imgElement);

                    var parentDiv = element.parentNode; // Parent div with class "percentage-coin"
                    var grandParentDiv = parentDiv.parentNode; // Parent div with class "coin-info"
                    var cryptoCoinDiv = grandParentDiv.parentNode; // Parent div with class "crypto-coin"
                    var cryptoChar = cryptoCoinDiv.querySelector('.coin-chart');
                    cryptoChar.setAttribute('src', '/static/assets/Chart-Up-1.svg');
                    
                }
                else {
                    element.parentNode.classList.add('percentage-down');
                    var imgElement = document.createElement('img');
                    imgElement.setAttribute('src', 'data:image/svg+xml;base64,' + btoa(PercentageArrowDown));
                    imgElement.setAttribute('width', '24');
                    imgElement.setAttribute('height', '24');
            
                    // Append the <img> to the parent element
                    element.parentNode.appendChild(imgElement);

                    var parentDiv = element.parentNode; // Parent div with class "percentage-coin"
                    var grandParentDiv = parentDiv.parentNode; // Parent div with class "coin-info"
                    var cryptoCoinDiv = grandParentDiv.parentNode; // Parent div with class "crypto-coin"
                    var cryptoChar = cryptoCoinDiv.querySelector('.coin-chart');
                    cryptoChar.setAttribute('src', '/static/assets/Chart-down-1.svg');
                    
                }
            });
            lossesPercentageAvaxElement.forEach(function(element) {
            element.textContent = avax[1].toFixed(2) + "%";
                if (avax[1] > 0) {
                    //parent of the element
                    element.parentNode.classList.add('percentage');
                    //create another child and add svg to it 
                    var imgElement = document.createElement('img');
                    imgElement.setAttribute('src', 'data:image/svg+xml;base64,' + btoa(PercentageArrowUP));
                    imgElement.setAttribute('width', '24');
                    imgElement.setAttribute('height', '24');
                    element.parentNode.appendChild(imgElement);

                    var parentDiv = element.parentNode; // Parent div with class "percentage-coin"
                    var grandParentDiv = parentDiv.parentNode; // Parent div with class "coin-info"
                    var cryptoCoinDiv = grandParentDiv.parentNode; // Parent div with class "crypto-coin"
                    var cryptoChar = cryptoCoinDiv.querySelector('.coin-chart');
                    cryptoChar.setAttribute('src', '/static/assets/Chart-Up-1.svg');
                    
                }
                else {
                    element.parentNode.classList.add('percentage-down');
                    var imgElement = document.createElement('img');
                    imgElement.setAttribute('src', 'data:image/svg+xml;base64,' + btoa(PercentageArrowDown));
                    imgElement.setAttribute('width', '24');
                    imgElement.setAttribute('height', '24');
            
                    // Append the <img> to the parent element
                    element.parentNode.appendChild(imgElement);

                    var parentDiv = element.parentNode; // Parent div with class "percentage-coin"
                    var grandParentDiv = parentDiv.parentNode; // Parent div with class "coin-info"
                    var cryptoCoinDiv = grandParentDiv.parentNode; // Parent div with class "crypto-coin"
                    var cryptoChar = cryptoCoinDiv.querySelector('.coin-chart');
                    cryptoChar.setAttribute('src', '/static/assets/Chart-down-1.svg');
                    
                }
            });

            lossesBtcElement.forEach(function(element) {
            element.textContent = '$' + btc[0];
            });
            lossesEthElement.forEach(function(element) {
            element.textContent = '$' + eth[0];
            });
            lossesSolElement.forEach(function(element) {
            element.textContent = '$' + sol[0];
            });
            lossesAvaxElement.forEach(function(element) {
            element.textContent = '$' + avax[0];
            });
        }
        , null, true, "Update Crypto stats", loadCryptoStats)


    // Event listener for the rating icons
    document.querySelectorAll('.rating li').forEach(icon => {
        icon.addEventListener('click', event => {
            // Reset all icons to original state
            document.querySelectorAll('.rating label').forEach(svgIcon => {
                svgIcon.style.background = ""; // Clear any set background
                svgIcon.style.fill = ""; // Assuming SVG, we use fill for color
            });

            // Change the clicked icon's appearance
            const svgElement = icon.querySelector('label');
            if (svgElement) { // Ensure the SVG element exists
                svgElement.style.background = "rgb(200 124 255 / 40%)"; // White background
            }
        });
    });

    // The submit button listener remains the same

    // Get all the radio buttons with the class "feedback-option"
    const radioButtons = document.querySelectorAll('.feedback-option');
    let selectedValue = "";
    // Add event listener to each radio button
    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('change', () => {
            // Check if radio button is checked
            if (radioButton.checked) {
                // Get the value of the checked radio button
                selectedValue = radioButton.value;
                
            }
        });
    });

    function showThankYouMessage() {

    }

    function showErrorMessage() {

    }

    ajaxRequest("POST", "/provided-feedback/", null, function (response) {
        ('Response:', response)
    if (response.has_feedback) {
        document.querySelector('.told-wrapper').innerHTML = 
        `<div class="thank-you-message">
            <span>You already submitted a review! ; ) </span>
            <span>You already earned your 20 Points </span>
        </div>`;
        // Trigger animation after setting innerHTML
        document.querySelector('.thank-you-message').classList.add('slide-in');
    }
    }, null, true, "Provided feedback?", null);

    document.getElementById('submit-btn').addEventListener('click', function(event) {
        event.preventDefault(); // Prevents navigating to a new page if href="#".

        
        if (selectedValue) {
            ajaxRequest('POST', "/submit-feedback/", {feedback: selectedValue}, function (response) {
                if (response.success) {
                    document.querySelector('.told-wrapper').innerHTML = 
                        `<div class="thank-you-message">
                            <span>Thank you for your reviews! ; ) </span>
                            <span>You've earned 20 Points </span>
                        </div>`;
                    // Trigger animation after setting innerHTML
                    document.querySelector('.thank-you-message').classList.add('slide-in');
                }
                else {
                    document.querySelector('.told-wrapper').innerHTML = 
                        `<div class="thank-you-message">
                            <span>You already submitted a review! ; ) </span>
                            <span>You already earned your 20 Points </span>
                        </div>`;
                    // Trigger animation after setting innerHTML
                    document.querySelector('.thank-you-message').classList.add('slide-in');
                }
            }, null, true, "Feedback submit", null)
        }
        else {
            var popupMessage = document.getElementById('ErrorPopupMessage');
            var popupSpan = document.getElementById('ErrorPopupSpan');
            popupMessage.classList.add('error');
            popupSpan.textContent = "Please select an option before submitting your feedback.";
            popupMessage.style.display = 'block';
            document.getElementById('ErrorPopUpCloseButton').addEventListener('click', function() {
                popupMessage.style.display = 'none';
                popupMessage.classList.remove('error');
            });
        }
    });



    // Call the function to fetch course progress when the document is ready

    $(document).ready(function() {
        changeCourseProgress();  // Ensure this function is defined and working properly

        var claimButton = document.querySelector('#claimPoints');

        var popupMessage = document.getElementById('popupMessage');
        var popupImage = document.getElementById('popupImage');
        var popupSpan = document.getElementById('popupSpan');

        claimButton.addEventListener('click', function(event) {
            event.preventDefault(); // Stop the form from submitting normally
            ajaxRequest('POST', '/add_points/', null, function(response){
                if (response.success) {
                    // Create a span inside claimButton to show the message "Claimed"
                    claimButton.innerHTML = '';
                    var spanElement = document.createElement('span');
                    var imgElement = document.createElement('img');
                    spanElement.textContent = 'Claimed';
                    var checkSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2EBE7B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>';
                    imgElement.src = 'data:image/svg+xml;base64,' + btoa(checkSVG);
                    claimButton.appendChild(imgElement);
                    claimButton.appendChild(spanElement);


                    claimButton.disabled = true;
                    popupMessage.classList.add('success');
                    popupImage.src = "{% static 'assets/points-icon.svg' %}";
                    popupSpan.textContent = `You claimed ${dailypointsn} points, get back the next day.`;
                    popupMessage.style.display = 'block';
                } else {
                    popupMessage.classList.remove('success');
                    popupImage.src = "{% static 'assets/x-circle.svg' %}";
                    popupSpan.textContent = "You already claimed your daily points! Try again tomorrow.";
                    popupMessage.style.display = 'block';
                }
            }, function(error){
                popupSpan.textContent = "An error occurred while processing your request.";
                popupImage.src = "{% static 'assets/error-icon.svg' %}";
                popupMessage.style.display = 'block';
            }, true, "Claim daily points", null)
        });

        /* Close pop up after 5 seconds */

        document.getElementById('popUpCloseButton').addEventListener('click', function() {
            popupMessage.style.display = 'none';
        });
    });

    function changeCourseProgress() {
        // Iterate through each course element
        document.querySelectorAll('.course').forEach(function(course) {
            // Get the course ID from the data attribute
            var courseId = course.getAttribute('data-id');
            // Select the progress bar element within the current course
            var progressBar = course.querySelector('.progress-bar-inner');
            var progressPercent = course.querySelector('.progress-percent');
            // Make an AJAX request
            ajaxRequest('POST', "/course-progress/", {course_id: courseId}, function(response) {
                ("nnnnn", response)
                progressBar.style.width = `${response.course_progression}%`;
                progressPercent.innerText = `${response.course_progression}%`;
            }, null, true, "Fetch Course Progression", null)

        });
    }


    let currentTrackIndex = 0;
    let isPlaying = false;
    const audio = new Audio();

    function loadTrack(index) {
        audio.src = tracks[index].src;
        audio.load();
        updateTrackInfo(tracks[index].name, tracks[index].image, tracks[index].description, tracks[index].banner);

        updateUI(false); 
    }

    function togglePlay() {
        if (audio.src) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play().catch(error => {
                    console.error("Playback failed:", error);
                });
            }
            isPlaying = !isPlaying;
            updateUI(isPlaying);
        } else {
            if (there_is_podcasts) {

                loadTrack(currentTrackIndex);
            }
            audio.play().catch(error => {
                console.error("Playback failed:", error);
            });
            isPlaying = true;
            updateUI(true);
        }
    }

    function updateUI(playing) {
        const playButton = document.querySelector('.play-pause-button'); // Ensure you have this element
        if (playButton) {
            playButton.textContent = playing ? 'Pause' : 'Play';
        }
    }

    // Update track information displayed on the UI
    function updateTrackInfo(name, image, description, banner) {
        const trackNameElement = document.querySelector('.title-music'); // Ensure you have this element
        const trackImageElement = document.querySelector('.player-image'); // Ensure you have this element
        const trackDescriptionElement = document.querySelector('.description-music'); // Ensure you have this element
        const trackBannerElement = document.querySelector('.player'); // Ensure you have this element
        if (trackNameElement) trackNameElement.textContent = name;
        if (trackImageElement) trackImageElement.src = image;
        if (trackDescriptionElement) trackDescriptionElement.textContent = description;
        if (trackBannerElement) {
            trackBannerElement.style.setProperty('--banner-url', `url('/media/${banner}')`);
        }
        else {
            trackBannerElement.style.setProperty('--banner-url', `url('/media/${image}')`);
        }
    }

    const playPauseButton = document.querySelector('.play-pause-button'); // Ensure you have a button with this class
    if (playPauseButton) {
        playPauseButton.addEventListener('click', togglePlay);
    }

    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        if (there_is_podcasts) {

            loadTrack(currentTrackIndex);
        }
    }

    function previousTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        if (there_is_podcasts) {

            loadTrack(currentTrackIndex);
        }
    }

    function updateCurrentTime() {
        const current = audio.currentTime;
        const duration = audio.duration;
        const progress = (current / duration) * 100;
        document.querySelector('.last-time').textContent = formatTime(current);
        document.querySelector('.total-time').textContent = formatTime(duration);
        document.querySelector('.progress').style.width = progress + '%';
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedTime = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        return formattedTime;
    }

    function updatePlayButton() {
        const playButton = document.querySelector('.play');
        playButton.innerHTML = isPlaying ? `
            <!-- SVG for pause -->
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#dbdbdf" viewBox="0 0 16 16">
                <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"/>
            </svg>
            ` : `
            <!-- SVG for play -->
            <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.32137 25.586C7.9759 25.5853 7.63655 25.4948 7.33669 25.3232C6.66148 24.9406 6.24173 24.1978 6.24173 23.3915V7.07398C6.24173 6.26542 6.66148 5.52494 7.33669 5.14232C7.64369 4.96589 7.99244 4.87516 8.3465 4.87961C8.70056 4.88407 9.04692 4.98354 9.34938 5.16764L23.2952 13.5155C23.5859 13.6977 23.8255 13.9508 23.9916 14.251C24.1577 14.5511 24.2448 14.8886 24.2448 15.2316C24.2448 15.5747 24.1577 15.9121 23.9916 16.2123C23.8255 16.5125 23.5859 16.7655 23.2952 16.9478L9.34713 25.2979C9.0376 25.485 8.68307 25.5846 8.32137 25.586V25.586Z" fill="#E1E1E6"/>
            </svg>
        `;
    }

    function updateUI() {
        updateCurrentTime();
        updatePlayButton();
    }

    audio.addEventListener('timeupdate', updateCurrentTime);

    document.addEventListener("DOMContentLoaded", function() {
        document.querySelector('.play').addEventListener('click', togglePlay);
        document.querySelector('.next').addEventListener('click', nextTrack);
        document.querySelector('.prev').addEventListener('click', previousTrack);
        if (there_is_podcasts) {

            loadTrack(0);
        }
    });


    // ---------------------------------  Add the following code to the end of the file ---------------------------------

    const claimDailyPoints = (time) => {
        if (!time || typeof time !== 'string') {
            (time)
        console.error('Invalid time format or time is undefined');
        return;
        }
    
        // Duration string in ISO 8601 format
        const durationString = time;
    
        // Parse the duration string
        const regex = /P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)(\.\d+)?S)?/;
        const matches = durationString.match(regex);
    
        if (!matches) {
        console.error('Invalid duration string format');
        return;
        }
    
        // Extract components from regex matches
        const days = parseInt(matches[1]) || 0;
        const hours = parseInt(matches[2]) || 0;
        const minutes = parseInt(matches[3]) || 0;
        const seconds = parseFloat(matches[4]) || 0;
    
        // Calculate total milliseconds in the future from now
        const now = new Date().getTime();
        const futureTime = now + days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;
    
        // Update countdown timer
        var x = setInterval(function () {
        // Get today's date and time
        const currentTime = new Date().getTime();
    
        // Find the distance between now and the future time
        const distance = futureTime - currentTime;
    
        if (distance > 0) {
            // Time calculations for days, hours, minutes and seconds
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
            // Output the result in an element with id="claimPointsText"
            const claimPointsTextElement = document.getElementById("claimPointsText");
            if (claimPointsTextElement) {
            claimPointsTextElement.innerHTML = "Claim in " + hours + "h " + minutes + "m " + seconds + "s ";
            
            // Adjust width dynamically
            claimPointsTextElement.style.width = "162px";
            }
    
            // If the count down is over, write some text
            if (distance < 0) {
            clearInterval(x);
            if (claimPointsTextElement) {
                claimPointsTextElement.innerHTML = "Claim Now";
                claimPointsTextElement.style.width = "auto";
            }
            }
        } else {
            clearInterval(x);
        }
        }, 1000);
    };

    ajaxRequest("POST", "/claimed-points/", null, function (response) {
            ('bbbb', response)

            if (response.success && response.claimed) {
                claimDailyPoints(response.time_until_next_claim)
            }
        },
        null, true, "has claimed points", null
    );
});