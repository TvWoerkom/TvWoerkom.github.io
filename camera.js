// script.js

// Function to get all media devices
async function getMediaDevices() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    return videoDevices;
  } catch (error) {
    console.error('Error accessing devices:', error);
  }
}

// Function to show the camera feed
async function showCameraFeed() {
  const videoElement = document.createElement('video');
  videoElement.style.width = '100%';  // Make the video full width
  document.body.appendChild(videoElement);

  try {
    const videoDevices = await getMediaDevices();

    if (videoDevices.length > 0) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: videoDevices[0].deviceId } });
      videoElement.srcObject = stream;
      videoElement.play();
    } else {
      console.error('No video devices found');
    }
  } catch (error) {
    console.error('Error accessing camera:', error);
  }
}

// Call the function to show the camera feed when the page loads
window.onload = showCameraFeed;
