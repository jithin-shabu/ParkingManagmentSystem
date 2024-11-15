import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase config and initialization
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

export async function calculateFees() {
    const vehicleNumber = document.getElementById('vehicleNumber').value.trim().toUpperCase();
    const exitTime = document.getElementById('exitTime').value;

    if (!vehicleNumber || !exitTime) {
        alert("Please enter both vehicle number and exit time.");
        return;
    }

    console.log("Vehicle Number:", vehicleNumber); // Debugging
    console.log("Exit Time:", exitTime); // Debugging

    const parkingRef = ref(db, 'parking_spots');
    
    try {
        const snapshot = await get(parkingRef);
        if (snapshot.exists()) {
            const parkingSpots = snapshot.val();
            let found = false;

            // Loop through all floors, blocks, and spots to find the matching vehicle number
            for (const floor in parkingSpots) {
                if (found) break;
                for (const block in parkingSpots[floor]) {
                    if (found) break;
                    for (let i = 1; i <= 10; i++) {
                        const spotKey = `spot_${i}`;
                        const spot = parkingSpots[floor][block][spotKey];
                        console.log("Checking spot:", spotKey, spot); // Debugging

                        if (spot.vehicleNo && spot.vehicleNo === vehicleNumber) {
                            found = true;
                            console.log("Spot Found:", spot); // Debugging

                            // Calculate the fee (assuming $5 per hour for simplicity)
                            const entryTime = spot.time;
                            const entryHour = parseInt(entryTime.split(":")[0], 10);
                            const entryMinute = parseInt(entryTime.split(":")[1], 10);
                            const exitHour = parseInt(exitTime.split(":")[0], 10);
                            const exitMinute = parseInt(exitTime.split(":")[1], 10);

                            const entryTotalMinutes = entryHour * 60 + entryMinute;
                            const exitTotalMinutes = exitHour * 60 + exitMinute;
                            const parkedTime = exitTotalMinutes - entryTotalMinutes;
                            const fee = (parkedTime * 0.083).toFixed(2);

                            // Display the fee details
                            document.getElementById('feeDetails').textContent = `
                               
                                Entry Time: ${spot.time}\n
                                Exit Time: ${exitTime}\n
                                Total Parked Time: ${parkedTime} minutes\n
                                Total Parking Fee: RS${fee}
                            `;
                            document.getElementById('calculatedFee').style.display = 'block';

                            // Reset the parking spot to "free"
                            const spotRef = ref(db, `parking_spots/${floor}/${block}/${spotKey}`);
                            await set(spotRef, {
                                vehicleNo: "",
                                name: "",
                                time: "",
                                typeOfVehicle: "",
                                status: "free"
                            });

                            console.log(`Spot ${spotKey} is now free.`);
                            break;
                        }
                    }
                }
            }

            if (!found) {
                alert("Vehicle not found in the parking system.");
            }
        } else {
            console.log("No parking data available.");
        }
    } catch (error) {
        console.error("Error reading parking data:", error);
    }
}
