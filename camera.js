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
  const messageElement = document.getElementById('message');
  const loadingElement = document.getElementById('loading-message');
  
  // Hide loading message when devices are fetched
  loadingElement.style.display = 'none';

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

  // If a camera is selected, populate the select dropdown with all available cameras
  devices.forEach(device => {
    const option = document.createElement('option');
    option.value = device.deviceId;
    option.text = device.label || `Camera ${device.deviceId}`;
    selectElement.appendChild(option);
  });

  // Show the dropdown with camera selection
  selectElement.style.display = 'block';

  // Event listener for camera selection change
  selectElement.addEventListener('change', (event) => {
    const selectedDeviceId = event.target.value;
    showCameraFeed(selectedDeviceId);  // Show the selected camera feed
  });

  // Show the feed from the selected camera (back camera preferred, otherwise front camera)
  showCameraFeed(selectedCamera.deviceId);
}

// Function to request camera access and show the camera feed inside the div
async function showCameraFeed(deviceId) {
  const videoElement = document.getElementById('camera-feed');
  const messageElement = document.getElementById('message');

  try {
    // Request access to the selected camera
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId }
    });
    videoElement.srcObject = stream; // Set the camera feed to the video element
    messageElement.style.display = 'none';  // Hide message if access is granted
  } catch (error) {
    console.error('Error accessing camera:', error);
    // Show message if camera access is denied
    messageElement.textContent = 'Please allow camera access to view the feed.';
    messageElement.style.display = 'block';
  }
}

// Call the function to show the camera selection when the page loads
window.onload = showCameraSelection;
