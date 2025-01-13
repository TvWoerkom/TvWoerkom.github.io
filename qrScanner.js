// qrScanner.js

// Function to scan the video feed for QR codes
async function scanQRCode(videoElement) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Set the canvas size to match the video dimensions
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  // Continuously scan the video feed for QR codes
  function scan() {
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code) {
      console.log('QR Code found:', code.data);

      // Open the URL directly if it is valid
      if (isValidURL(code.data)) {
        location.href = code.data; // Navigate to the URL in the current tab
      } else {
        console.log('Detected QR Code is not a valid URL:', code.data);
      }

      return; // Stop further scanning
    } else {
      // Continue scanning
      requestAnimationFrame(scan);
    }
  }

  // Start scanning
  scan();
}

// Function to validate if the detected text is a URL
function isValidURL(string) {
  try {
    new URL(string); // Attempt to create a URL object
    return true; // If successful, the string is a valid URL
  } catch (error) {
    return false; // If it fails, the string is not a valid URL
  }
}

// Initialize QR code scanning after the camera feed starts
function startQRCodeScanning(videoElement) {
  // Wait until the video element is ready (it might take a moment to start playing)
  videoElement.onplay = () => {
    scanQRCode(videoElement);
  };
}
