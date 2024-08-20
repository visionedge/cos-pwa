const socket = new WebSocket('wss://cos-server.onrender.com:8081');

socket.addEventListener('open', function (event) {
    console.log('Connected to the WebSocket server');

    // Send a message to the server
    socket.send('Hello Server!');
});

socket.addEventListener('message', function (event) {
    console.log('Message from server:', event.data);
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML += `<p>${event.data}</p>`;
});

socket.addEventListener('close', function (event) {
    console.log('WebSocket connection closed');
});

socket.addEventListener('error', function (error) {
    console.error('WebSocket error:', error);
});
