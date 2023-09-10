let stream, mediaRecorder;
let socket;

const videoPlayer = document.getElementById('video-player');
const recordButton = document.getElementById('record-button');

recordButton.addEventListener('click', toggleRecording);

// Get user media stream and display it in the video player
async function startStream() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoPlayer.srcObject = stream;
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = handleDataAvailable;
        socket = new WebSocket('ws://localhost:3000');

        socket.onopen = () => {
            console.log('WebSocket connection established.');
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed.');
        };

        socket.onerror = error => {
            console.error('WebSocket error:', error);
        };
    } catch (error) {
        console.error('Error accessing media devices:', error);
    }
}

// Start or stop video recording
function toggleRecording() {
    if (mediaRecorder && mediaRecorder.state === 'inactive') {
        startRecording();
        recordButton.textContent = 'Stop Recording';
    } else {
        stopRecording();
        recordButton.textContent = 'Start Recording';
    }
}

// Start video recording
function startRecording() {
    mediaRecorder.start();
}

// Stop video recording
function stopRecording() {
    mediaRecorder.stop();
}

// Handle data available from Media Recorder
function handleDataAvailable(event) {
    if (event.data.size > 0) {
        socket.send(event.data);
        console.log("data is available: ", event.data.length)
    }
}

// Start the stream when the page loads
startStream();