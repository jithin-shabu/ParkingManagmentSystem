import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwKZx7zGayg6NLVt0wsDLOV2j3IMo4Lh0",
  authDomain: "car-parking-management-s-1f1d8.firebaseapp.com",
  databaseURL: "https://car-parking-management-s-1f1d8-default-rtdb.firebaseio.com",
  projectId: "car-parking-management-s-1f1d8",
  storageBucket: "car-parking-management-s-1f1d8.firebasestorage.app",
  messagingSenderId: "314331985346",
  appId: "1:314331985346:web:dff9f9f08b8cf3a120525b",
  measurementId: "G-0FNLYV6SXT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Reference to the parking spots in Firebase
const parkingRef = ref(db, 'parking_spots');

// Function to initialize parking structure if not already done
async function initializeParkingStructure() {
  const snapshot = await get(parkingRef);
  if (!snapshot.exists()) {
    console.log("Initializing parking spots structure...");
    const parkingSpots = {
      floor_1: {
        block_A: {},
        block_B: {},
        block_C: {},
        block_D: {}
      },
      floor_2: {
        block_A: {},
        block_B: {},
        block_C: {},
        block_D: {}
      }
    };
    await set(parkingRef, parkingSpots);
    console.log("Parking spots structure initialized.");
  } else {
    console.log("Parking spots structure already exists.");
  }
}

// Call the initialization function once when the page loads
initializeParkingStructure();

// Function to handle form submission and store data in Firebase
async function handleFormSubmission(event) {
  event.preventDefault(); // Prevent form from refreshing the page
  console.log("Form Submission Triggered!");

  // Collect form values
  const vehicleNumber = document.getElementById("vehicleNumber").value.trim().toUpperCase();
  const name = document.getElementById("name").value.trim();
  const vehicleType = document.getElementById("vehicleType").value;
  const entryTime = document.getElementById("entryTime").value;

  // Basic validation
  if (!vehicleNumber || !name || !vehicleType || !entryTime) {
    alert("Please fill in all fields.");
    return;
  }

  console.log("Form Data:", vehicleNumber, name, vehicleType, entryTime); // Debugging

  // Find a free spot in the parking structure
  let parkingAssigned = false;
  let allocatedSpot = null;

  // Loop through the parking spots to find a free spot
  for (const floor in parkingSpots) {
    if (parkingAssigned) break;
    for (const block in parkingSpots[floor]) {
      if (parkingAssigned) break;
      
      // Loop over the integer spot keys (1, 2, 3, 4, ..., 10)
      for (let i = 1; i <= 10; i++) {
        const spotKey = `${i}`;  // Use integer spot keys like '1', '2', '3'
        const spotRef = ref(db, `parking_spots/${floor}/${block}/${spotKey}`);
        
        // Get spot data from Firebase to check if it's free
        const spotSnapshot = await get(spotRef);
        
        // If the spot is empty (doesn't exist or doesn't have a vehicle)
        if (!spotSnapshot.exists() || !spotSnapshot.val().vehicleNo) {
          // Assign this spot if it's free
          const newSpotData = {
            vehicleNo: vehicleNumber,
            name: name,
            time: entryTime,
            typeOfVehicle: vehicleType,
            status: "occupied"
          };

          // Update the spot in Firebase
          await set(spotRef, newSpotData);

          // Store the allocated spot details for redirection
          allocatedSpot = {
            vehicleNo: vehicleNumber,
            name: name,
            typeOfVehicle: vehicleType,
            time: entryTime,
            floor: floor,
            block: block,
            spot: `${i}`  // Storing the spot number (1, 2, 3, etc.)
          };

          parkingAssigned = true; // Exit loop once a spot is assigned
          break;
        }
      }
    }
  }

  // If no spot was found (all spots are occupied)
  if (!parkingAssigned) {
    alert("Sorry, no parking spots available.");
    return;
  }

  console.log("Allocated Spot:", allocatedSpot); // Debugging

  // Redirect to parking status page with spot details in the query string
  const queryParams = new URLSearchParams(allocatedSpot).toString();
  console.log("Query String:", queryParams); // Debugging

  // Redirect after the spot data is saved
  window.location.href = `parking-status.html?${queryParams}`;
}

// Ensure event listener is attached only when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const submitButton = document.querySelector('button');
  console.log(submitButton); // Debugging
  submitButton.addEventListener('click', handleFormSubmission);
});
