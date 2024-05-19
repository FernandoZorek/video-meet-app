
function copyURL(link) {
  const url = link;
  navigator.clipboard.writeText(url)
    .then(() => newNotify('URL copied to clipboard!'))
    .catch(error => console.error("Failed to copy URL:", error));
}
  
function newNotify(text) {
  const alertElement = document.querySelector(".alert");
  alertElement.textContent = text;
  alertElement.classList.remove("hidden");
  alertElement.classList.add("show");
  setTimeout(() => {
    alertElement.classList.remove("show");
    alertElement.classList.add("hidden");
  }, 2000);
}

function resizeVideos() {
  const videoContainer = document.getElementById('video-container');
  const videos = videoContainer.querySelectorAll('video');
  const numParticipants = videos.length;

  if (numParticipants === 1) {
    setVideoLayout(videos[0], 12, 100);
  } else if (numParticipants === 2) {
    setVideoLayoutForEach(videos, 6, 50);
  } else if (numParticipants === 3) {
    setVideoLayoutForEach(videos, 4, 33);
  } else {
    setVideoLayoutForEach(videos, 3, 25);
  }
}

function setVideoLayout(video, colsPerParticipant, size) {
  video.classList.remove('col-12', 'col-6', 'col-4', 'col-3');
  video.classList.add(`col-${colsPerParticipant}`);
  video.style.width = `${size}%`;
}

function setVideoLayoutForEach(videos, colsPerParticipant, size) {
  videos.forEach(video => setVideoLayout(video, colsPerParticipant, size));
}