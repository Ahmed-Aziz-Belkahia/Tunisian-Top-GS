var dailypointsn = 10;

document.addEventListener('DOMContentLoaded', function() {

    const audio = new Audio(tracks[0].src);
    const totalTime = document.querySelector('.total-time');
    const lastTime = document.querySelector('.last-time');
    var isPlaying = false;

    if (there_is_podcasts) {
      audio.addEventListener('loadedmetadata', function() {
        const duration = audio.duration;
        totalTime.innerText = formatTime(duration);
      });
    }

    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }








    const pointsCounter = document.querySelector(".points-counter");
    const courseProgressionCounter = document.querySelector(".points-counter.points");
    const courseProgressionSlider = document.querySelector(".progress-bar-inner.points");

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
    var PercentageArrowUP = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2EBE7B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-up-right"><path d="M13 5H19V11"/><path d="M19 5L5 19"/></svg>`;
    var PercentageArrowDown = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DA5C54" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-down-right"><path d="M19 13V19H13"/><path d="M5 5L19 19"/></svg>`;

    function loadCryptoStats() {
        cryptoChart.forEach(el => el.style.display = 'none');
        cryptoPrice.forEach(el => el.style.display = 'none');
        cryptoLoader.forEach(el => el.style.display = 'flex');
    }

    function updateCryptoData(response) {
        const cryptoDetails = response.crypto_details;
        cryptoChart.forEach(el => el.style.display = 'block');
        cryptoPrice.forEach(el => el.style.display = 'flex');
        cryptoLoader.forEach(el => el.style.display = 'none');

        Object.keys(cryptoDetails).forEach(key => {
            const [price, percentage] = cryptoDetails[key];
            const percentageElements = {
                btc: lossesPercentageBtcElement,
                eth: lossesPercentageEthElement,
                sol: lossesPercentageSolElement,
                avax: lossesPercentageAvaxElement
            };
            const priceElements = {
                btc: lossesBtcElement,
                eth: lossesEthElement,
                sol: lossesSolElement,
                avax: lossesAvaxElement
            };

            percentageElements[key].forEach(el => {
                el.textContent = percentage.toFixed(2) + "%";
                const parentDiv = el.parentNode;
                const cryptoChar = parentDiv.closest('.crypto-coin').querySelector('.coin-chart');
                if (percentage > 0) {
                    parentDiv.classList.add('percentage');
                    cryptoChar.setAttribute('src', '/static/assets/Chart-Up-1.svg');
                } else {
                    parentDiv.classList.add('percentage-down');
                    cryptoChar.setAttribute('src', '/static/assets/Chart-down-1.svg');
                }
            });
            priceElements[key].forEach(el => el.textContent = '$' + price);
        });
    }

    ajaxRequest('GET', '/getCryptoDetails/', loadCryptoStats, updateCryptoData, null, true, "Update Crypto stats", loadCryptoStats);

    document.querySelectorAll('.rating li').forEach(icon => {
        icon.addEventListener('click', event => {
            document.querySelectorAll('.rating label').forEach(svgIcon => {
                svgIcon.style.background = "";
                svgIcon.style.fill = "";
            });
            const svgElement = icon.querySelector('label');
            if (svgElement) {
                svgElement.style.background = "rgb(200 124 255 / 40%)";
            }
        });
    });

    const radioButtons = document.querySelectorAll('.feedback-option');
    let selectedValue = "";

    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('change', () => {
            if (radioButton.checked) {
                selectedValue = radioButton.value;
            }
        });
    });

    ajaxRequest("POST", "/provided-feedback/", null, function(response) {
        if (response.has_feedback) {
            document.querySelector('.told-wrapper').innerHTML = `
            <div class="thank-you-message">
                <span>You already submitted a review! ; ) </span>
                <span>You already earned your 20 Points </span>
            </div>`;
            document.querySelector('.thank-you-message').classList.add('slide-in');
        }
    }, function() {
        console.log("-")
    }, true, "Provided feedback?", null);

    sb = document.getElementById('submit-btn')
    
    if (sb) {
        sb.addEventListener('click', function(event) {
            event.preventDefault();
            if (selectedValue) {
                ajaxRequest('POST', "/submit-feedback/", { feedback: selectedValue }, function(response) {
                    const message = response.success ? "Thank you for your reviews! ; ) You've earned 20 Points" : "You already submitted a review! ; ) You already earned your 20 Points";
                    document.querySelector('.told-wrapper').innerHTML = `<div class="thank-you-message"><span>${message}</span></div>`;
                    document.querySelector('.thank-you-message').classList.add('slide-in');
                }, function() {
                    console.log("-")
                }, true, "Feedback submit", null);
            } else {
                const popupMessage = document.getElementById('ErrorPopupMessage');
                const popupSpan = document.getElementById('ErrorPopupSpan');
                popupMessage.classList.add('error');
                popupSpan.textContent = "Please select an option before submitting your feedback.";
                popupMessage.style.display = 'block';
                document.getElementById('ErrorPopUpCloseButton').addEventListener('click', function() {
                    popupMessage.style.display = 'none';
                    popupMessage.classList.remove('error');
                });
            }
        });
    }
    

    function changeCourseProgress() {
        document.querySelectorAll('.course').forEach(function(course) {
            const courseId = course.getAttribute('data-id');
            const progressBar = course.querySelector('.progress-bar-inner');
            const progressPercent = course.querySelector('.progress-percent');
            ajaxRequest('POST', "/course-progress/", { course_id: courseId }, function(response) {
                if (progressBar && progressPercent) {
                    progressBar.style.width = `${response.course_progression}%`;
                    progressPercent.innerText = `${response.course_progression}%`;
                }
                
            },  function() {
                console.log("-")
            }, true, "Fetch Course Progression", null);
        });
    }
    changeCourseProgress();

    const claimButton = document.querySelector('#claimPoints');
    const popupMessage = document.getElementById('popupMessage');
    const popupImage = document.getElementById('popupImage');
    const popupSpan = document.getElementById('popupSpan');

    if (claimButton) {
        claimButton.addEventListener('click', function(event) {
            event.preventDefault();
            ajaxRequest('POST', '/add_points/', null, function(response) {
                if (response.success) {
                    claimButton.innerHTML = '';
                    const spanElement = document.createElement('span');
                    const imgElement = document.createElement('img');
                    spanElement.textContent = 'Claimed';
                    imgElement.src = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2EBE7B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>');
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
            }, function(error) {
                popupSpan.textContent = "An error occurred while processing your request.";
                popupImage.src = "{% static 'assets/error-icon.svg' %}";
                popupMessage.style.display = 'block';
            },  function() {
                console.log("-")
            }, "Claim daily points", null);
        });
    }

    document.getElementById('popUpCloseButton').addEventListener('click', function() {
        popupMessage.style.display = 'none';
    });

    const claimDailyPoints = (time) => {
        if (!time || typeof time !== 'string') {
            return;
        }

        const durationString = time;
        const regex = /P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)(\.\d+)?S)?/;
        const matches = durationString.match(regex);

        if (!matches) {
            console.error('Invalid duration string format');
            return;
        }

        const days = parseInt(matches[1]) || 0;
        const hours = parseInt(matches[2]) || 0;
        const minutes = parseInt(matches[3]) || 0;
        const seconds = parseFloat(matches[4]) || 0;
        const now = new Date().getTime();
        const futureTime = now + days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;

        var x = setInterval(function() {
            const currentTime = new Date().getTime();
            const distance = futureTime - currentTime;

            if (distance > 0) {
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                const claimPointsTextElement = document.getElementById("claimPointsText");
                if (claimPointsTextElement) {
                    claimPointsTextElement.innerHTML = "Claim in " + hours + "h " + minutes + "m " + seconds + "s ";
                    claimPointsTextElement.style.width = "162px";
                }
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

    ajaxRequest("POST", "/claimed-points/", null, function(response) {
        if (response.success && response.claimed) {
            claimDailyPoints(response.time_until_next_claim);
        }
    },  function() {
        console.log("-")
    }, true, "has claimed points", null);

  

    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 1,
        spaceBetween: 30,
        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            1024: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            600: {
                slidesPerView: 1,
                spaceBetween: 10,
            }
        }
    });
    function handleSeeMore() {
        var descriptions = document.querySelectorAll('.course-description');
        descriptions.forEach(function(description) {
            var words = description.innerText.split(' ');
            if (words.length > 10) {
                var initialText = words.slice(0, 10).join(' ');
                var fullText = description.innerText;
                description.innerText = initialText + '... ';
                var seeMoreLink = description.nextElementSibling;
                seeMoreLink.style.display = 'inline';
                seeMoreLink.addEventListener('click', function() {
                    description.innerText = fullText;
                    seeMoreLink.style.display = 'none';
                });
            }
        });
    }
    handleSeeMore();
    swiper.on('slideChange', function() {
        handleSeeMore();
    });

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

    function loadTrack(index) {
        audio.src = tracks[index].src;
        audio.load();
        updateTrackInfo(tracks[index].name, tracks[index].image, tracks[index].description, tracks[index].banner);
        updateUI(false);
    }

    function togglePlay() {
        console.log('Toggling play');
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
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    function updatePlayButton() {
        const playButton = document.querySelector('.play');
        playButton.innerHTML = isPlaying ? `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#dbdbdf" viewBox="0 0 16 16">
                <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"/>
            </svg>
        ` : `
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

    document.querySelector('.play').addEventListener('click', togglePlay);
    document.querySelector('.next').addEventListener('click', nextTrack);
    document.querySelector('.prev').addEventListener('click', previousTrack);
    if (there_is_podcasts) {
        console.log("testing")
        loadTrack(0);
    }



});
