// Import the functions you need from the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js"; // Import Realtime Database methods

// Your web app's Firebase configuration
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

// Function to find parking spot by vehicle number
window.findParkingSpot = function() {
    const vehicleNumber = document.getElementById('vehicleNumber').value;

    if (vehicleNumber) {
        // Reference to 'parking_spots' in Firebase
        const parkingRef = ref(db, 'parking_spots');

        // Fetch the data
        get(parkingRef).then((snapshot) => {
            if (snapshot.exists()) {
                const parkingData = snapshot.val();
                let found = false;

                // Loop through all floors and blocks to find the vehicle
                for (const floor in parkingData) {
                    for (const block in parkingData[floor]) {
                        for (const spotKey in parkingData[floor][block]) {
                            const spot = parkingData[floor][block][spotKey];

                            // Check if the current spot contains the vehicle number
                            if (spot.vehicleNo === vehicleNumber) {
                                // Vehicle found, display parking details
                                document.getElementById('displayFloorNumber').innerText = `Floor: ${floor}`;
                                document.getElementById('displayBlockName').innerText = `Block: ${block}`;
                                document.getElementById('displaySpotNumber').innerText = `Spot: ${spotKey}`;
                                document.getElementById('displayVehicleNo').innerText = `Vehicle Number: ${spot.vehicleNo}`;
                                document.getElementById('displayTypeOfVehicle').innerText = `Type: ${spot.typeOfVehicle}`;
                              
                                document.getElementById('displayName').innerText = `Name: ${spot.name}`;
                                

                                // Show the parking details and hide the "No Spot Found" message
                                document.getElementById('parkingDetails').style.display = 'block';
                                document.getElementById('noSpotFound').style.display = 'none';
                                found = true;
                                break;
                            }
                        }
                        if (found) break;
                    }
                    if (found) break;
                }

                // If vehicle is not found
                if (!found) {
                    document.getElementById('noSpotFound').style.display = 'block';
                    document.getElementById('parkingDetails').style.display = 'none';
                }
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error("Error reading data from Firebase:", error);
        });
    } else {
        alert("Please enter a vehicle number");
    }
}
