// Global Dark Mode System
class DarkModeManager {
  constructor() {
    this.themeToggle = null;
    this.body = document.body;
    this.savedTheme = localStorage.getItem('theme');
    this.init();
  }

  init() {
    // Create theme toggle button if it doesn't exist
    if (!document.getElementById('themeToggle')) {
      this.createThemeToggle();
    } else {
      this.themeToggle = document.getElementById('themeToggle');
    }

    // Apply saved theme
    this.applyTheme();
    
    // Add event listener
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Auto-detect system preference if no saved theme
    if (!this.savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        this.setDarkMode(true);
      }
    }
  }

  createThemeToggle() {
    this.themeToggle = document.createElement('button');
    this.themeToggle.id = 'themeToggle';
    this.themeToggle.className = 'theme-toggle';
    this.themeToggle.title = 'Toggle Dark Mode';
    this.themeToggle.innerHTML = '🌙';
    document.body.appendChild(this.themeToggle);
  }

  applyTheme() {
    if (this.savedTheme === 'dark') {
      this.setDarkMode(true);
    } else {
      this.setDarkMode(false);
    }
  }

  toggleTheme() {
    const isDark = this.body.classList.contains('dark-mode');
    this.setDarkMode(!isDark);
  }

  setDarkMode(isDark) {
    if (isDark) {
      this.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
      if (this.themeToggle) {
        this.themeToggle.textContent = '☀️';
        this.themeToggle.title = 'Switch to Light Mode';
      }
    } else {
      this.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
      if (this.themeToggle) {
        this.themeToggle.textContent = '🌙';
        this.themeToggle.title = 'Switch to Dark Mode';
      }
    }
  }

  // Method to get current theme
  getCurrentTheme() {
    return this.body.classList.contains('dark-mode') ? 'dark' : 'light';
  }

  // Method to set theme programmatically
  setTheme(theme) {
    this.setDarkMode(theme === 'dark');
  }
}

// Initialize dark mode manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.darkModeManager = new DarkModeManager();
});

// Global function to toggle theme from any page
function toggleDarkMode() {
  if (window.darkModeManager) {
    window.darkModeManager.toggleTheme();
  }
}

// Global function to set theme from any page
function setDarkMode(isDark) {
  if (window.darkModeManager) {
    window.darkModeManager.setDarkMode(isDark);
  }
} 