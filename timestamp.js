// timestamp.js
function getCurrentTimestamp() {
    return new Date().toISOString();
}

function formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleString();
} 