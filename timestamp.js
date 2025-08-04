// Optional: Update the timestamp every second (for live updates)
setInterval(updateTimestamp, 1000);

// Function to update timestamp
function updateTimestamp() {
  const timestampElement = document.getElementById('timestamp');
  
  // Check if element exists before trying to update it
  if (!timestampElement) {
    return; // Exit function if element doesn't exist
  }
  
  const now = new Date();

  // Format date and time
  const formattedDate = now.toLocaleDateString(); // Example: 4/5/2025
  const formattedTime = now.toLocaleTimeString(); // Example: 10:30 PM

  // Update placeholder with formatted date and time
  timestampElement.textContent = `Current Date: ${formattedDate}, Time: ${formattedTime}`;
}

// Call the function when the page loads (only if element exists)
if (document.getElementById('timestamp')) {
  updateTimestamp();
}
