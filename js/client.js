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

function readJSON() {
    const readURL = 'https://cos-pwa.onrender.com/mibs.json';
    fetch(readURL)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('JSON data with fetch:', data);
    })
    .catch(error => {
        console.error('Error fetching the JSON file:', error);
    });
}

// Function to read JSON from a given URL
readJSON();

function readJSONAjax() {
    const mibsUrl = 'https://cos-pwa.onrender.com/mibs.json';
    $.ajax({
        dataType: "json",
        url: mibsUrl,
        success: function(data) {
            console.log('JSON data with Ajax:', data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); alert("Error: " + errorThrown); 
        }          
    });
}
readJSONAjax();

function downloadJSON(url, filename) {
    // Use the fetch API to get the JSON data
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();  // Parse the JSON data
        })
        .then(jsonData => {
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
        })
        .catch(error => {
            console.error('Error downloading JSON:', error);
        });
}
// Function to download JSON from a given URL
//downloadJSON('https://cos-pwa.onrender.com/mibs.json', 'myFile.json');
