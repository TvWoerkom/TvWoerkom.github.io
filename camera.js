// Function to request camera access (this triggers the browser permission prompt)
async function requestCameraAccess() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    return stream;
  } catch (error) {
    console.error('Error requesting camera access:', error);
    throw error;
  }
}

// Function to get all media devices
async function getMediaDevices() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    return videoDevices;
  } catch (error) {
    console.error('Error accessing devices:', error);
    return [];
  }
}

// Function to automatically select the back-facing camera if possible
async function showCameraFeed() {
  const videoElement = document.getElementById('camera-feed');
  const messageElement = document.getElementById('message');

  try {
    // Step 1: Request camera access (triggers browser permission prompt)
    const stream = await requestCameraAccess();

    // Step 2: After permission is granted, get media devices
    const devices = await getMediaDevices();
    console.log('Available devices:', devices);

    // Find back-facing camera by checking the label for 'back' or 'environment'
    const backCamera = devices.find(device => device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('environment'));
    console.log(backCamera);
    const cameraToUse = backCamera || devices[0]; // Fallback to first camera
    console.log(cameraToUse);

    if (cameraToUse) {
      // Step 3: Use the selected camera
      const selectedStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: cameraToUse.deviceId } }
      });
      console.log(selectedStream);

      videoElement.srcObject = selectedStream;
      messageElement.style.display = 'none'; // Hide permission message
      await startQRCodeScanning(videoElement); // Start QR scanning
    }
  } catch (error) {
    console.error('Error accessing camera:', error);
    messageElement.style.display = 'block'; // Show message if access fails
  }
}

// Run on page load
window.onload = showCameraFeed;
