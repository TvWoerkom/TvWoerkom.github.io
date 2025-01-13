// Get the video element where the camera stream will be displayed
const video = document.getElementById('camera');

// Check if the browser supports media devices
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Request the camera (video only)
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            // Assign the camera stream to the video element
            video.srcObject = stream;
        })
        .catch((err) => {
            console.log('Error accessing the camera: ' + err);
            alert('Unable to access the camera: ' + err);
        });
} else {
    alert('Camera not supported in this browser.');
}
