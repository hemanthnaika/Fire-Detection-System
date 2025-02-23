import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push } from "firebase/database";

// Firebase configuration from your Firebase project
const firebaseConfig = {
    apiKey: "AIzaSyCKcIcqzysE-YbGldT39wrZIYARt2MUAyI",
    authDomain: "fire-detection-system-33f91.firebaseapp.com",
    projectId: "fire-detection-system-33f91",
    storageBucket: "fire-detection-system-33f91.firebasestorage.app",
    messagingSenderId: "711717232784",
    appId: "1:711717232784:web:387bda68bbcedf89c1b815",
    databaseURL: "https://fire-detection-system-33f91-default-rtdb.asia-southeast1.firebasedatabase.app", // Updated URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Fetch data from Firebase
export const fetchData = (path, callback) => {
  const dataRef = ref(database, path);
  onValue(dataRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};

// Save fire detection event to Firebase
export const saveFireDetection = (status, latitude, longitude) => {
  const fireHistoryRef = ref(database, "fireHistory");
  const newEventRef = push(fireHistoryRef); // Generates a unique key for each event

  // Save data to Firebase
  set(newEventRef, {
    timestamp: new Date().toISOString(), // Current time in ISO format
    status: status,
    latitude: latitude,
    longitude: longitude,
  }).then(() => {
    console.log("Fire detection data saved successfully");
  }).catch((error) => {
    console.error("Error saving fire detection data:", error);
  });
};
