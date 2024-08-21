const os = require('node:os');
const fs = require('fs');
const path = require('path');
const https = require('https');

const homeDir = os.homedir();
console.log(homeDir);
const dirName = "batman";
const dirPath = path.join(homeDir, dirName);

// Function to create a directory if it doesn't already exist
function createDirectory() {
    try {
        // Use mkdirSync to create the directory synchronously
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
            console.log(`Directory created at: ${dirPath}`);
        } else {
            console.log('Directory already exists.');
        }
    } catch (err) {
        console.error(`Error creating directory: ${err.message}`);
    }
}

// Function to download JSON and save it to the local machine
function downloadJSON(url, outputDirectory) {
    return new Promise((resolve, reject) => {
        // Extract the filename from the URL
        const filename = path.basename(url);

        // Make an HTTPS GET request to the specified URL
        https.get(url, (response) => {
            let data = '';

            // Accumulate data as it comes in
            response.on('data', (chunk) => {
                data += chunk;
            });

            // When the response has finished, process the data
            response.on('end', () => {
                try {
                    // Parse the JSON data
                    const jsonData = JSON.parse(data);

                    // Ensure the output directory exists
                    if (!fs.existsSync(outputDirectory)) {
                        fs.mkdirSync(outputDirectory, { recursive: true });
                    }

                    // Define the full path for the file using the extracted filename
                    const filePath = path.join(outputDirectory, filename);

                    // Write the JSON data to the file
                    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

                    console.log(`File saved to ${filePath}`);
                    resolve(filePath); // Resolve the promise with the file path
                } catch (error) {
                    reject(`Error parsing or saving JSON: ${error}`);
                }
            });
        }).on('error', (error) => {
            reject(`Error downloading JSON: ${error}`);
        });
    });
}

// Function to read JSON and save it to the local machine
function readJSON(filePath) {
    return new Promise((resolve, reject) => {
        // Read the file asynchronously
        fs.readFile(filePath, 'utf-8', (err, jsonData) => {
            if (err) {
                reject(`Error reading JSON file: ${err.message}`);
                return;
            }

            try {
                // Parse the JSON data
                const data = JSON.parse(jsonData);
                console.log('JSON data:', data);
                resolve(data); // Resolve the promise with the JSON data
            } catch (parseError) {
                reject(`Error parsing JSON data: ${parseError.message}`);
            }
        });
    });
}

// Async function to execute tasks in sequence
async function executeTasks() {
    try {
        // Step 1: Create the directory
        createDirectory();

        // Step 2: Download the JSON file and save it
        const filePath = await downloadJSON('https://cos-pwa.onrender.com/mibs.json', dirPath);

        // Step 3: Read the JSON file
        await readJSON(filePath);
    } catch (error) {
        console.error('Error during execution:', error);
    }
}

// Run the tasks
executeTasks();
