const videos = document.querySelectorAll('.videos');
let videosIDs = [];

videos.forEach(function (video) {
    const videoID = video.dataset.id;
    videosIDs.push(videoID);

    video.addEventListener('click', function (e) {
        e.preventDefault();
        changeVideo(videoID);
    });
});