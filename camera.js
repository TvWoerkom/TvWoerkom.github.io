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

// Function to show all video devices and let the user select one
async function showCameraSelection() {
  const devices = await getMediaDevices();
  const selectElement = document.getElementById('camera-select');
  
  // Populate the select dropdown with all available cameras
  devices.forEach(device => {
    const option = document.createElement('option');
    option.value = device.deviceId;
    option.text = device.label || Camera ${device.deviceId};
    selectElement.appendChild(option);
  });

  // If there are cameras available, set up the selected camera to show the feed
  if (devices.length > 0) {
    selectElement.style.display = 'block';  // Show the camera selection dropdown
    selectElement.addEventListener('change', (event) => {
      const selectedDeviceId = event.target.value;
      showCameraFeed(selectedDeviceId);  // Show the selected camera feed
    });

    // Show feed from the first camera by default
    showCameraFeed(devices[0].deviceId);
  } else {
    console.error('No video devices found');
  }
}

// Function to request camera access and show the camera feed inside the div
async function showCameraFeed(deviceId) {
  const videoElement = document.getElementById('camera-feed'); // Get the video element by ID
  const messageElement = document.getElementById('message');   // Get the message element by ID

  try {
    // Request access to the selected camera
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId }
    });
    videoElement.srcObject = stream; // Set the camera feed to the video element
    messageElement.style.display = 'none';  // Hide the message if access is granted
  } catch (error) {
    console.error('Error accessing camera:', error);
    // Show message if camera access is denied
    messageElement.style.display = 'block';
  }
}

// Call the function to show the camera selection when the page loads
window.onload = showCameraSelection
