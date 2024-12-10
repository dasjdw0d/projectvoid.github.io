function showNotification(type, message) {
    Toastify({
        text: message,
        duration: 5000, // Duration in milliseconds
        close: true, // Show close button
        gravity: "top", // Position on screen (top or bottom)
        position: "center", // Position on screen (left, center, or right)
        style: {
			background: getBackgroundColor(type), // Background color based on notification type
        },
    }).showToast();
}


function getBackgroundColor(type) {
    switch(type) {
		case "success":
			return "#28a745"; // Solid green for success
		case "error":
			return "#dc3545"; // Solid red for error
		case "warning":
			return "#ffc107"; // Yellow for warning
		default:
			return "#0072ff"; // Default blue for info
    }
}