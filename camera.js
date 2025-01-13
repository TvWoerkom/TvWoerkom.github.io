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

// Function to display all video device names on the HTML page
async function displayVideoDevices() {
  const devices = await getMediaDevices();
  const videoDeviceList = document.getElementById('video-device-list'); // Get the element to display the list

  // Clear any previous content
  videoDeviceList.innerHTML = '';

  // Check if there are video devices
  if (devices.length === 0) {
    videoDeviceList.innerHTML = '<p>No video devices found.</p>';
  } else {
    // Loop through all video devices and display their names
    devices.forEach(device => {
      const listItem = document.createElement('li');
      listItem.textContent = device.label || 'Unnamed Device'; // Display the label, or "Unnamed Device" if no label
      videoDeviceList.appendChild(listItem);
    });
  }
}

// Call the function to display video devices when the page loads
window.onload = displayVideoDevices;
