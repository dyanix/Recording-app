const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let videoStream = null;
let videoChunks = [];

// Serve static files
app.use(express.static(__dirname));

// Handle WebSocket connection
wss.on('connection', socket => {
    console.log('WebSocket connection established.');

    socket.on('message', data => {
        videoChunks.push(data);
        console.log("received chunks of size: ", data.length)
    });

    socket.on('close', () => {
        console.log('WebSocket connection closed.');
    });

    socket.on('error', error => {
        console.error('WebSocket error:', error);
    });
});

// Handle the video chunks
function handleVideoChunks() {
    if (videoChunks.length > 0) {
        if (!videoStream) {
            videoStream = fs.createWriteStream('./videos/recorded-video.webm');
        }

        while (videoChunks.length > 0) {
            videoStream.write(videoChunks.shift());
        }
    }

    setTimeout(handleVideoChunks, 500); // Process chunks every 0.5 seconds
}

handleVideoChunks();

const port = 4000;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});