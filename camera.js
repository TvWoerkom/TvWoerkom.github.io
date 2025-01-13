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

// Function to show the camera feed from the back camera or front camera as a fallback
async function showCameraFeed() {
  const devices = await getMediaDevices();
  const videoElement = document.getElementById('camera-feed');
  const messageElement = document.getElementById('message');
  
  const loadingElement = document.getElementById('loading-message');
  loadingElement.style.display = 'none'; // Hide loading message once devices are fetched

  // If no devices are found, show a message
  if (devices.length === 0) {
    messageElement.textContent = 'No video devices found.';
    messageElement.style.display = 'block';
    return;
  }

  // Try to find the back camera first
  const backCamera = devices.find(device => device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('environment'));

  // If no back camera is found, fall back to the front camera
  const frontCamera = devices.find(device => device.label.toLowerCase().includes('front') || device.label.toLowerCase().includes('user'));

  // Use the back camera if found, otherwise use the front camera
  const selectedCamera = backCamera || frontCamera;

  if (selectedCamera) {
    try {
      // Request access to the selected camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedCamera.deviceId }
      });
      videoElement.srcObject = stream; // Set the camera feed to the video element
      messageElement.style.display = 'none';  // Hide message if access is granted
    } catch (error) {
      console.error('Error accessing camera:', error);
      messageElement.textContent = 'Please allow camera access to view the feed.';
      messageElement.style.display = 'block';
    }
  } else {
    messageElement.textContent = 'No suitable camera found.';
    messageElement.style.display = 'block';
  }
}

// Call the function to show the camera feed when the page loads
window.onload = showCameraFeed;
