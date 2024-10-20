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
  allAudios.forEach(audio => {
    audio.pause(); // Stop all audios

    // Remove breathing effect when stopping all audios
    stopBreathingEffect();
  });
  // Reset all play/pause buttons to default state
  vocals.forEach(vocal => {
    const playPauseBtn = vocal.querySelector('#app');
    playPauseBtn.querySelector('.play').classList.add('active');
    playPauseBtn.querySelector('.pause').classList.remove('active');
  });
}

// Get the container__main element
const containerMain = document.querySelector('.container__main');

// Function to apply breathing animation
function startBreathingEffect() {
  containerMain.classList.add('breathing-effect');
}

// Function to stop breathing animation
function stopBreathingEffect() {
  containerMain.classList.remove('breathing-effect');
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
    if (isPlaying) {
      audio.play();
      startBreathingEffect(); // Start the breathing animation
    } else {
      audio.pause();
      stopBreathingEffect(); // Stop the breathing animation
    }

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

  // Handle audio pause and end events to stop animation
  audio.addEventListener('pause', () => stopBreathingEffect());
  audio.addEventListener('ended', () => stopBreathingEffect()); 

  // Toggle heart icon state on favorite button click
  vocal.querySelector('.favoriteBtn').addEventListener('click', () => {
    heartIcon.classList.toggle('filled');
  });
}

// Initialize all vocal controls
vocals.forEach(initializeAudioControls);

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  let visibleVocals = 0;

  vocals.forEach(vocal => {
    const vocalTitle = vocal.getAttribute('data-title').toLowerCase();
    const matches = vocalTitle.includes(searchTerm);
    vocal.style.display = matches ? 'flex' : 'none';
    visibleVocals += matches ? 1 : 0;
  });

  // If no vocals are visible, fade in the message
  if (visibleVocals === 0) {
    noResultsMessage.classList.add('show');
    noResultsMessage.classList.remove('hide');
    noResultsMessage.style.display = 'block'; // Ensure it's displayed when fading in
  } else {
    // If there are visible vocals, fade out the message
    noResultsMessage.classList.remove('show');
    noResultsMessage.classList.add('hide');
    
    // After the fade-out, hide it completely from the layout
    setTimeout(() => {
      noResultsMessage.style.display = 'none';
    }, 500); // Match the duration of the CSS transition
  }
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


// Function to show pop-up with points
function showPointsPopup(points) {
  const pointsPopup = document.getElementById('pointsPopup');
  const pointsCount = pointsPopup.querySelector('.points-count');
  
  // Set the points content and show the popup
  pointsCount.textContent = points;
  pointsPopup.classList.remove('hidden');
  pointsPopup.classList.add('show');

  // Hide the popup after 3 seconds
  setTimeout(() => {
    pointsPopup.classList.remove('show');
    setTimeout(() => {
      pointsPopup.classList.add('hidden');
    }, 500); // Match the CSS transition duration
  }, 3000);
}

// Function to handle like button click and points update
function handleLikeButtonClick(event, button) {
  event.preventDefault();

  const vocalId = button.getAttribute("data-id");

  // Call your toggle like function
  toggleLike(button, vocalId, () => {
    // After successfully liking, show the points pop-up
    showPointsPopup(20); // Show a pop-up saying the user earned 20 points
  });
}

// Initialize like buttons with points pop-up functionality
function initializeLikeButtonsWithPoints() {
  const likeButtons = document.querySelectorAll('.card-icon');

  likeButtons.forEach(button => {
    button.addEventListener("click", event => handleLikeButtonClick(event, button));
  });
}

// Initialize like buttons when the document is ready
document.addEventListener('DOMContentLoaded', initializeLikeButtonsWithPoints);

// Modified toggle like function to include a callback
function toggleLike(button, vocalId, callback) {
  ajaxRequest("post", "/is_vocal_liked/", { vocal_id: vocalId }, response => {
    const action = response.is_liked ? "/remove_liked_vocal/" : "/add_liked_vocal/";
    ajaxRequest("post", action, { vocal_id: vocalId }, () => {
      toggleLikeCss(button, vocalId);
      if (callback) callback(); // Execute callback after like is toggled
    });
  });
}

// Function to toggle like button appearance
function toggleLikeCss(button, vocalId) {
  ajaxRequest("post", "/is_vocal_liked/", { vocal_id: vocalId }, response => {
    const isLiked = response.is_liked;
    handleHeartAnimation(button, isLiked);
  });
}

// Handle heart animation (already defined in the existing code)
function handleHeartAnimation(heartIcon, isLiked) {
  if (isLiked) {
    heartIcon.classList.add('liked');
    heartIcon.classList.remove('unliked');
  } else {
    heartIcon.classList.remove('liked');
    heartIcon.classList.add('unliked');
  }
}
