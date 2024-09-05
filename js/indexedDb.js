// Open (or create) an IndexedDB database
let db;
let request = indexedDB.open("imageDB", 1);

// Create object store if it doesn't exist
request.onupgradeneeded = function(event) {
    db = event.target.result;
    let objectStore = db.createObjectStore("images", { keyPath: "id" });
};

// Save the image blob in IndexedDB
function saveImageToIndexedDB(url) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            let transaction = db.transaction(["images"], "readwrite");
            let objectStore = transaction.objectStore("images");
            
            // Save the image with a unique id
            let imageRecord = { id: 1, imageBlob: blob };
            objectStore.put(imageRecord);

            transaction.oncomplete = () => {
                console.log("Image saved in IndexedDB!");
            };
        })
        .catch(error => console.error("Failed to fetch the image:", error));
}

// Initialize the database and save the image
request.onsuccess = function(event) {
    db = event.target.result;
    saveImageToIndexedDB('https://cos-pwa.onrender.com/images/coffee1.jpg');
};


// Retrieve the image blob from IndexedDB and display it in an img element
function displayImageFromIndexedDB() {
    let transaction = db.transaction(["images"], "readonly");
    let objectStore = transaction.objectStore("images");
    
    let request = objectStore.get(1);
    
    request.onsuccess = function(event) {
        let record = event.target.result;
        if (record) {
            let blob = record.imageBlob;
            
            // Create a URL for the Blob and set it as the source of an image element
            let imgURL = URL.createObjectURL(blob);
            let imgElement = document.getElementById('imageDisplay');
            imgElement.src = imgURL;
        } else {
            console.log("No image found in IndexedDB.");
        }
    };
}

// Call displayImageFromIndexedDB once the page has loaded
window.onload = function() {
    request.onsuccess = function(event) {
        db = event.target.result;
        displayImageFromIndexedDB();
    };
};
