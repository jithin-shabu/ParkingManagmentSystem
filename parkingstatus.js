// Simulate parking availability
let isParkingFull = false; // You can toggle this between true and false to test both scenarios

// Simulate allocated parking details if parking is not full
const allocatedSpot = {
    floor: 2,
    block: 'A',
    spotNumber: '12'
};

// Function to display parking status
function displayParkingStatus() {
    const statusMessage = document.getElementById('statusMessage');
    const allocatedSpotDiv = document.getElementById('allocatedSpot');

    if (isParkingFull) {
        // Show message if parking is full
        statusMessage.textContent = "Sorry, the parking is full. Please try again later.";
        allocatedSpotDiv.style.display = 'none'; // Hide allocated spot details
    } else {
        // Show allocated spot details if parking is not full
        statusMessage.textContent = "Your parking spot has been successfully allocated.";
        document.getElementById('floorNumber').textContent = "Floor Number: " + allocatedSpot.floor;
        document.getElementById('blockName').textContent = "Block Name: " + allocatedSpot.block;
        document.getElementById('spotNumber').textContent = "Spot Number: " + allocatedSpot.spotNumber;
        allocatedSpotDiv.style.display = 'block'; // Show allocated spot details
    }
}

// Call the function to display the status when the page loads
displayParkingStatus();
