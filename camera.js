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

// Function to automatically select the back-facing camera
async function showCameraFeed() {
  const videoElement = document.getElementById('camera-feed'); // Get the video element by ID
  const messageElement = document.getElementById('message');   // Get the message element by ID

  try {
    const devices = await getMediaDevices();
    const backCamera = devices.find(device => device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('environment'));
    
    if (backCamera) {
      // Request access to the back camera (using the found back camera deviceId)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: backCamera.deviceId }
      });
      videoElement.srcObject = stream; // Set the camera feed to the video element
      messageElement.style.display = 'none';  // Hide the message if access is granted
    } else {
      // If no back camera is found, fall back to the first available camera
      const fallbackCamera = devices[0];
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: fallbackCamera.deviceId }
      });
      videoElement.srcObject = stream;
      messageElement.style.display = 'none';  // Hide the message if access is granted
    }
  } catch (error) {
    console.error('Error accessing camera:', error);
    messageElement.style.display = 'block'; // Show the message if camera access is denied
  }
}

// Call the function to show the camera feed when the page loads
window.onload = showCameraFeed;
