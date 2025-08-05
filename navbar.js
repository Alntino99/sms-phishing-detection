// navbar.js
function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.classList.add('active');
    }
}

// Initialize navbar
document.addEventListener('DOMContentLoaded', updateNavbar); 