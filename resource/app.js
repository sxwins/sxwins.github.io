// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyAb0tn3FBPnBq5mr6gV7Io68217qLN-Hmk",
	authDomain: "reitaku-gakuensai.firebaseapp.com",
	databaseURL: "https://reitaku-gakuensai-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "reitaku-gakuensai",
	storageBucket: "reitaku-gakuensai.appspot.com",
	messagingSenderId: "982697880095",
	appId: "1:982697880095:web:f11143437a32ccef6c832a",
	measurementId: "G-V2XHKF63LN"
};

try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
	
    // Making database globally accessible if needed
    window.database = database;	
	
    console.log("Firebase initialized successfully");
} catch (error) {
    console.error("Firebase initialization failed", error);
    alert("Failed to initialize Firebase!"); // Display an error alert in the browser
}

try {
    // Write initial data to Firebase after successful initialization
    //writeInitialData(database);	
	//console.log("writeInitialData successfully");
} catch (error) {
    console.error("writeInitialData failed", error);
    alert("Failed to writeInitialData!"); // Display an error alert in the browser
}

// Function to write initial data
function writeInitialData(database) {
    const now = new Date().toISOString();
    const initRef = ref(database, 'initialData');
    push(initRef, {
        message: "Database connection successfully established.",
        timestamp: now
    })
    .then(() => {
        console.log("Initial data written to the database at: " + now);
        alert("Data was successfully written to the database!");
    })
    .catch((error) => {
        console.error("Failed to write initial data to the database", error);
        alert("Failed to write data to the database. Error: " + error.message);
    });
}

// Function to submit feedback
export function submitFeedback() {
    const feedbackInput = document.getElementById('feedbackInput');
    const feedback = feedbackInput.value;
    if (feedback.trim() === "") {
        alert("Please enter some feedback before submitting.");
        return; // Prevent submitting empty feedback
    }
    const feedbackRef = ref(database, 'feedbacks');
    push(feedbackRef, {
        text: feedback,
        timestamp: new Date().toISOString()
    })
    .then(() => {
        feedbackInput.value = ''; // Clear input after sending
		console.log("Info submitted: " + feedback);
        loadFeedback(); // Call loadFeedback to refresh the list
    })
    .catch(error => {
        console.error("Failed to submit feedback:", error);
        alert("Failed to submit feedback. Please try again.");
    });
}

// Make it accessible globally
window.submitFeedback = submitFeedback;

// Function to load feedback
function loadFeedback() {
    const feedbackRef = ref(database, 'feedbacks');
    onValue(feedbackRef, (snapshot) => {
        const feedbackList = document.getElementById('feedbackList');
        feedbackList.innerHTML = ''; // Clear previous feedback
        snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            const listItem = document.createElement('li');
            listItem.innerText = `${childData.text} (Posted at ${childData.timestamp})`;
            feedbackList.appendChild(listItem);
        });
    });
}

// Load feedback history on page load
window.addEventListener('DOMContentLoaded', loadFeedback);
