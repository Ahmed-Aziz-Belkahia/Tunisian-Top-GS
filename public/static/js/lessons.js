// Initialize and store all audio elements in one pass
const allAudios = [...document.querySelectorAll('.vocal .audio')];
const vocals = document.querySelectorAll('.vocal');
const searchInput = document.querySelector('.search');
const noResultsMessage = document.querySelector('.no-results-message');

// Function to format time
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Function to stop all audios
function stopAllAudios() {
  allAudios.forEach(audio => audio.pause());

  // Reset all play/pause buttons to default state
  vocals.forEach(vocal => {
    const playPauseBtn = vocal.querySelector('#app');
    playPauseBtn.querySelector('.play').classList.add('active');
    playPauseBtn.querySelector('.pause').classList.remove('active');
  });
}

// Function to initialize audio controls for each vocal
function initializeAudioControls(vocal) {
  const audio = vocal.querySelector('.audio');
  const playPauseBtn = vocal.querySelector('#app');
  const play = playPauseBtn.querySelector('.play');
  const pause = playPauseBtn.querySelector('.pause');
  const audioSlider = vocal.querySelector('.audioSlider');
  const currentTimeElem = vocal.querySelector('.currentTime');
  const durationElem = vocal.querySelector('.duration');
  const heartIcon = vocal.querySelector('.heartIcon');

  // Play/Pause click event
  playPauseBtn.addEventListener('click', () => {
    const isPlaying = play.classList.contains('active');
    stopAllAudios();
    play.classList.toggle('active', !isPlaying);
    pause.classList.toggle('active', isPlaying);
    isPlaying ? audio.play() : audio.pause();
  });

  // Update slider max value and duration when metadata is loaded
  audio.addEventListener('loadedmetadata', () => {
    audioSlider.max = audio.duration;
    durationElem.textContent = formatTime(audio.duration);
  });

  // Update slider and current time during playback
  audio.addEventListener('timeupdate', () => {
    audioSlider.value = audio.currentTime;
    currentTimeElem.textContent = formatTime(audio.currentTime);
  });

  // Seek audio when slider input changes
  audioSlider.addEventListener('input', () => {
    audio.currentTime = audioSlider.value;
  });

  // Toggle heart icon state on favorite button click
  vocal.querySelector('.favoriteBtn').addEventListener('click', () => {
    heartIcon.classList.toggle('filled');
  });
}

// Initialize all vocal controls
vocals.forEach(initializeAudioControls);

// Live search functionality with emoji when no results are found
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  let visibleVocals = 0;

  vocals.forEach(vocal => {
    const vocalTitle = vocal.getAttribute('data-title').toLowerCase();
    const matches = vocalTitle.includes(searchTerm);
    vocal.style.display = matches ? 'flex' : 'none';
    visibleVocals += matches ? 1 : 0;
  });

  // Toggle "No search available" message visibility
  noResultsMessage.style.display = visibleVocals ? 'none' : 'flex';
});

// Function to handle the heart icon animation on like/unlike
function handleHeartAnimation(heartIcon, isLiked) {
  if (isLiked) {
    heartIcon.classList.add('liked');
    heartIcon.classList.remove('unliked');
  } else {
    heartIcon.classList.remove('liked');
    heartIcon.classList.add('unliked');
  }
}

// Like button initialization with AJAX requests and animation
function initializeLikeButtons() {
  const likeButtons = document.querySelectorAll('.card-icon');

  likeButtons.forEach(button => {
    const vocalId = button.getAttribute("data-id");
    toggleLikeCss(button, vocalId);

    button.addEventListener("click", event => {
      event.preventDefault();
      toggleLike(button, vocalId);
    });
  });

  // Function to toggle like state
  function toggleLike(button, vocalId) {
    ajaxRequest("post", "/is_vocal_liked/", { vocal_id: vocalId }, response => {
      const action = response.is_liked ? "/remove_liked_vocal/" : "/add_liked_vocal/";
      ajaxRequest("post", action, { vocal_id: vocalId }, () => {
        toggleLikeCss(button, vocalId);
      });
    });
  }

  // Function to update the like button style with animation
  function toggleLikeCss(button, vocalId) {
    ajaxRequest("post", "/is_vocal_liked/", { vocal_id: vocalId }, response => {
      const isLiked = response.is_liked;
      handleHeartAnimation(button, isLiked);
    });
  }
}

initializeLikeButtons();
