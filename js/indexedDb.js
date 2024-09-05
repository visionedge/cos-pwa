// Open (or create) an IndexedDB database
let db;
let request = indexedDB.open("fileDB", 1);

// Create object stores for images and files if they don't exist
request.onupgradeneeded = function(event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains("images")) {
        db.createObjectStore("images", { keyPath: "id" });
        console.log("Image store created");
    }
    if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "id" });
        console.log("File store created");
    }
};

// Utility function to save a Blob to IndexedDB
function saveBlobToIndexedDB(storeName, id, blob, filename) {
    let transaction = db.transaction([storeName], "readwrite");
    let objectStore = transaction.objectStore(storeName);
    
    let record = { id: id, blob: blob, filename: filename };
    objectStore.put(record);

    transaction.oncomplete = () => {
        console.log(`${filename} saved in IndexedDB!`);
    };

    transaction.onerror = () => {
        console.error(`Error saving ${filename} in IndexedDB.`);
    };
}

// Fetch and save a resource (image or file) from a URL
function fetchAndSaveResource(url, storeName, id, filename) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            saveBlobToIndexedDB(storeName, id, blob, filename);
        })
        .catch(error => console.error(`Failed to fetch ${filename}:`, error));
}

// Retrieve a Blob from IndexedDB and trigger download/display
function retrieveBlobFromIndexedDB(storeName, id, callback) {
    let transaction = db.transaction([storeName], "readonly");
    let objectStore = transaction.objectStore(storeName);

    let request = objectStore.get(id);

    request.onsuccess = function(event) {
        let record = event.target.result;
        if (record) {
            callback(record.blob, record.filename);
        } else {
            console.log(`No record found in IndexedDB with ID ${id}.`);
        }
    };

    request.onerror = function(event) {
        console.error(`Failed to retrieve record from ${storeName} in IndexedDB:`, event);
    };
}

// Display an image from a Blob
function displayImage(blob) {
    let imgURL = URL.createObjectURL(blob);
    let imgElement = document.getElementById('imageDisplay');
    imgElement.src = imgURL;
    console.log("Image displayed from IndexedDB");
}

// Trigger download of a Blob file
function downloadBlob(blob, filename) {
    let fileURL = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = fileURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    console.log(`${filename} downloaded from IndexedDB`);
}

// Initialize the database and perform actions
request.onsuccess = function(event) {
    db = event.target.result;

    // Example usage: Saving an image and a ZIP file
    // fetchAndSaveResource('https://cos-pwa.onrender.com/images/coffee1.jpg', 'images', 1, 'coffee1.jpg');
    // fetchAndSaveResource('https://cos-pwa.onrender.com/runtime.zip', 'files', 1, 'runtime.zip');

    fetchAndSaveResource('http://localhost:5500/images/coffee1.jpg', 'images', 1, 'coffee1.jpg');
    fetchAndSaveResource('http://localhost:5500/runtime.zip', 'files', 1, 'runtime.zip');

    // Example usage: Displaying the image after saving
    retrieveBlobFromIndexedDB('images', 1, displayImage);
};

// Download ZIP when the button is clicked
document.getElementById('downloadZipBtn').addEventListener('click', function() {
    retrieveBlobFromIndexedDB('files', 1, downloadBlob);
});
