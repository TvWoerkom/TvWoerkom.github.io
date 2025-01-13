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

      // Open Spotify links directly in the app
      if (isSpotifyLink(code.data)) {
        location.href = code.data; // Directly navigate to the Spotify link
      } else if (isValidURL(code.data)) {
        const userConfirmed = confirm(`QR Code detected: ${code.data}\n\nDo you want to open this link?`);
        if (userConfirmed) {
          window.open(code.data, '_blank'); // Open other valid URLs in a new tab
        }
      } else {
        alert(`QR Code detected but it's not a valid URL: ${code.data}`);
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

// Function to check if a URL is a Spotify link
function isSpotifyLink(string) {
  return string.startsWith('https://open.spotify.com/');
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
