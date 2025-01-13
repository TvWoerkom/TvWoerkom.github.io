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

// Function to request camera access and show the camera feed inside the div
async function showCameraFeed() {
  const videoElement = document.getElementById('camera-feed'); // Get the video element by ID
  const messageElement = document.getElementById('message');   // Get the message element by ID

  try {
    // Get available video devices (cameras)
    const videoDevices = await getMediaDevices();

    if (videoDevices.length > 0) {
      // Request access to the first available camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: videoDevices[0].deviceId }
      });
      videoElement.srcObject = stream; // Set the camera feed to the video element
      messageElement.style.display = 'none';  // Hide the message if access is granted
    } else {
      console.error('No video devices found');
    }
  } catch (error) {
    console.error('Error accessing camera:', error);
    // Show message if camera access is denied
    messageElement.style.display = 'block';
  }
}

// Call the function to show the camera feed when the page loads
window.onload = showCameraFeed;
