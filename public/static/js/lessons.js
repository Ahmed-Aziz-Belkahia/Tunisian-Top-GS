// Array to store all audio elements
const allAudios = [];

// Initialize all audio elements and store them in the array
document.querySelectorAll('.vocal').forEach(vocal => {
  const audio = vocal.querySelector('.audio');
  allAudios.push(audio); // Store each audio element

  const playPauseBtn = vocal.querySelector('#app');
  const audioSlider = vocal.querySelector('.audioSlider');
  const currentTimeElem = vocal.querySelector('.currentTime');
  const durationElem = vocal.querySelector('.duration');
  const favoriteBtn = vocal.querySelector('.favoriteBtn');
  const heartIcon = vocal.querySelector('.heartIcon');
  const play = playPauseBtn.querySelector('.play');
  const pause = playPauseBtn.querySelector('.pause');

  // Play/Pause button click event
  playPauseBtn.addEventListener('click', () => {
    if (play.classList.contains('active')) {
      // Stop all other audios
      stopAllAudios();

      play.classList.remove('active');
      pause.classList.add('active');
      audio.play();
    } else {
      play.classList.add('active');
      pause.classList.remove('active');
      audio.pause();
    }
  });

  // Update slider max value and duration text when metadata is loaded
  audio.addEventListener('loadedmetadata', () => {
    audioSlider.max = audio.duration;
    durationElem.textContent = formatTime(audio.duration);
  });

  // Update slider value and current time text during playback
  audio.addEventListener('timeupdate', () => {
    audioSlider.value = audio.currentTime;
    currentTimeElem.textContent = formatTime(audio.currentTime);
  });

  // Seek audio when slider input changes
  audioSlider.addEventListener('input', () => {
    audio.currentTime = audioSlider.value;
  });

  // Toggle favorite button state
  favoriteBtn.addEventListener('click', () => {
    heartIcon.classList.toggle('filled');
  });

  // Function to format time
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
});

// Function to stop all audios
function stopAllAudios() {
  allAudios.forEach(audio => {
    if (!audio.paused) {
      audio.pause();
      /* audio.currentTime = 0; */
    }
  });

  // Reset all play/pause buttons to the default state
  document.querySelectorAll('.vocal').forEach(vocal => {
    const playPauseBtn = vocal.querySelector('#app');
    const play = playPauseBtn.querySelector('.play');
    const pause = playPauseBtn.querySelector('.pause');

    play.classList.add('active');
    pause.classList.remove('active');
  });
}




function initializeLikeButtons() {
  const likeButtons = document.querySelectorAll('.card-icon');

  likeButtons.forEach(element => {
      toggleLikeCss(element, element.getAttribute("data-id"));
      element.addEventListener("click", function(event) {
          event.preventDefault();
          toggleLike(event.currentTarget, element.getAttribute("data-id"));
      });
  });

  function toggleLike(element, currentVocal) {
      ajaxRequest("post", "/is_vocal_liked/", { vocal_id: currentVocal }, function(response) {
          if (response.is_liked) {
              ajaxRequest("post", "/remove_liked_vocal/", { vocal_id: currentVocal }, function() {
                  toggleLikeCss(element, currentVocal);
              }, null, true, "Remove liked vocal", null);
          } else {
              ajaxRequest("post", "/add_liked_vocal/", { vocal_id: currentVocal }, function() {
                  toggleLikeCss(element, currentVocal);
              }, null, true, "Add liked vocal", null);
          }
      }, null, true, "Check if vocal is liked", null);
  }

  function toggleLikeCss(element, currentVocal) {
      ajaxRequest("post", "/is_vocal_liked/", { vocal_id: currentVocal }, function(response) {
          if (response.is_liked) {
              element.classList.remove("fa-regular");
              element.classList.add("fa-solid");
          } else {
              element.classList.add("fa-regular");
              element.classList.remove("fa-solid");
          }
      }, null, true, "Check if vocal is liked", null);
  }
}

initializeLikeButtons()