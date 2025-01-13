// Function to scan the video feed for QR codes
async function scanQRCode(videoElement) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const messageElement = document.getElementById('message');
  const nextButton = document.getElementById('next-button');

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

      // Check if the QR code contains a Spotify URL
      if (isSpotifyLink(code.data)) {
        // Convert the web URL to Spotify URI if it's a valid link
        const spotifyURI = convertToSpotifyURI(code.data);

        if (spotifyURI) {
          // Open directly in Spotify app (if available)
          window.location.href = spotifyURI;
        }
      } else if (isValidURL(code.data)) {
        // For other valid URLs, show a confirmation to the user before opening the link
        const userConfirmed = confirm(`QR Code detected: ${code.data}\n\nDo you want to open this link?`);
        if (userConfirmed) {
          window.open(code.data, '_blank'); // Open other valid URLs in a new tab
        }
      } else {
        alert(`QR Code detected but it's not a valid URL: ${code.data}`);
      }

      // Hide the video and stop the stream once a link is detected
      const stream = videoElement.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop()); // Stop the camera stream

      // Hide the video element
      videoElement.style.display = 'none';

      // Show the "Next" button
      nextButton.style.display = 'block';

      return; // Stop further scanning once a valid QR code is found
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

// Convert a Spotify web URL to a Spotify URI
function convertToSpotifyURI(spotifyURL) {
  try {
    const url = new URL(spotifyURL);

    // Extract the path to determine the type of resource (track, album, playlist, etc.)
    const path = url.pathname.split('/');
    const type = path[1]; // The resource type (e.g., "track", "album", "playlist")
    const id = path[2]; // The unique ID of the resource

    // Build the corresponding Spotify URI
    if (type === 'track') {
      return `spotify:track:${id}`;
    } else if (type === 'album') {
      return `spotify:album:${id}`;
    } else if (type === 'playlist') {
      return `spotify:playlist:${id}`;
    }

    // If it's not a valid Spotify link, return null
    return null;
  } catch (error) {
    console.error('Error converting to Spotify URI:', error);
    return null;
  }
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

// Function to reactivate video scanning after pressing "Next"
function startNextScan() {
  const videoElement = document.getElementById('camera-feed');
  const nextButton = document.getElementById('next-button');

  // Show the video element and hide the "Next" button
  videoElement.style.display = 'block';
  nextButton.style.display = 'none';

  // Restart the camera feed and QR scanning
  showCameraFeed();
}
