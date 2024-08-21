const socket = new WebSocket('wss://cos-server.onrender.com/');
//const socket = new WebSocket('wss://cos-server.onrender.com:8080');

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

/* Download */
// Function to download JSON from a given URL
async function downloadJSON(url, filename) {
    try {
        // Fetch the JSON data from the URL
        const response = await fetch(url);
        
        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        
        // Parse the JSON data
        const jsonData = await response.json();
        
        // Convert JSON data to a Blob
        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
        
        // Create a URL for the Blob
        const blobUrl = URL.createObjectURL(blob);
        
        // Create an anchor element and set the download attribute
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename || 'data.json';  // Default filename if not provided
        
        // Append the link to the document
        document.body.appendChild(link);
        
        // Programmatically click the link to trigger the download
        link.click();
        
        // Clean up by removing the link and revoking the Blob URL
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Error downloading JSON:', error);
    }
}

// Usage example
downloadJSON('https://cos-pwa.onrender.com/mibs.json', 'myFile.json');
