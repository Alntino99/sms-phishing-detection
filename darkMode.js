// Global Dark Mode System - Enhanced Version
class DarkModeManager {
  constructor() {
    this.body = document.body;
    this.savedTheme = localStorage.getItem('theme');
    this.isInitialized = false;
    this.init();
  }

  init() {
    console.log('🌙 Initializing Dark Mode Manager...');
    
    // Apply saved theme immediately
    this.applyTheme();
    
    // Setup theme toggle buttons
    this.setupThemeToggles();
    
    // Auto-detect system preference if no saved theme
    if (!this.savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        this.setDarkMode(true);
      }
    }
    
    this.isInitialized = true;
    console.log('✅ Dark Mode Manager initialized');
  }

  setupThemeToggles() {
    // Find all theme toggle buttons (both new and old classes)
    const themeButtons = document.querySelectorAll('.theme-toggle-nav, .theme-toggle-enhanced');
    console.log(`Found ${themeButtons.length} theme toggle buttons`);
    
    if (themeButtons.length === 0) {
      console.log('No theme toggle buttons found on this page');
      return;
    }
    
    themeButtons.forEach((button, index) => {
      // Remove existing event listeners
      button.removeEventListener('click', this.handleThemeToggle);
      
      // Add new event listener
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(`Theme toggle button ${index + 1} clicked`);
        this.toggleTheme();
      });
      
      // Update button text based on current theme
      this.updateButtonText(button);
    });
  }

  handleThemeToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.toggleTheme();
  }

  applyTheme() {
    console.log(`Applying saved theme: ${this.savedTheme}`);
    if (this.savedTheme === 'dark') {
      this.setDarkMode(true);
    } else {
      this.setDarkMode(false);
    }
  }

  toggleTheme() {
    const isDark = this.body.classList.contains('dark-mode');
    console.log(`Toggling theme from ${isDark ? 'dark' : 'light'} to ${isDark ? 'light' : 'dark'}`);
    this.setDarkMode(!isDark);
  }

  setDarkMode(isDark) {
    console.log(`Setting dark mode to: ${isDark}`);
    
    if (isDark) {
      this.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      this.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
    
    // Update all theme toggle buttons
    this.updateAllButtons();
    
    // Show notification if available
    try {
      if (window.showNotification) {
        showNotification(`Theme changed to ${isDark ? 'dark' : 'light'} mode`, 'success');
      } else if (window.showInfo) {
        showInfo(`Theme changed to ${isDark ? 'dark' : 'light'} mode`, '🎨 Theme');
      }
    } catch (error) {
      console.log('Notification system not available');
    }
  }

  updateAllButtons() {
    const themeButtons = document.querySelectorAll('.theme-toggle-nav, .theme-toggle-enhanced');
    
    if (themeButtons.length === 0) {
      console.log('No theme toggle buttons found to update');
      return;
    }
    
    themeButtons.forEach((button, index) => {
      if (button) {
        this.updateButtonText(button);
        console.log(`Updated button ${index + 1}: ${button.textContent}`);
      } else {
        console.warn(`Button ${index + 1} is null or undefined`);
      }
    });
  }

  updateButtonText(button) {
    if (!button) {
      console.warn('Attempted to update null or undefined button');
      return;
    }
    
    const isDark = this.body.classList.contains('dark-mode');
    button.textContent = isDark ? '☀️' : '🌙';
    button.title = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
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

// Global function to toggle theme from any page
function toggleTheme() {
  console.log('toggleTheme() called');
  
  if (window.darkModeManager && window.darkModeManager.isInitialized) {
    console.log('Using DarkModeManager');
    window.darkModeManager.toggleTheme();
  } else {
    console.log('Using fallback toggle');
    // Fallback if manager isn't loaded
    const body = document.body;
    const isDark = body.classList.contains('dark-mode');
    
    if (isDark) {
      body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    }
    
    // Update buttons (both classes)
    const themeButtons = document.querySelectorAll('.theme-toggle-nav, .theme-toggle-enhanced');
    themeButtons.forEach((button, index) => {
      if (button) {
        button.textContent = isDark ? '🌙' : '☀️';
        button.title = isDark ? 'Switch to Dark Mode' : 'Switch to Light Mode';
      } else {
        console.warn(`Fallback: Button ${index + 1} is null or undefined`);
      }
    });
    
    console.log(`Theme toggled to ${isDark ? 'light' : 'dark'} mode`);
  }
}

// Global function to set theme from any page
function setDarkMode(isDark) {
  if (window.darkModeManager && window.darkModeManager.isInitialized) {
    window.darkModeManager.setDarkMode(isDark);
  } else {
    // Fallback
    const body = document.body;
    if (isDark) {
      body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }
}

// Initialize dark mode manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing DarkModeManager');
  window.darkModeManager = new DarkModeManager();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
  // DOM is still loading, wait for DOMContentLoaded
} else {
  // DOM is already loaded, initialize immediately
  console.log('DOM already loaded, initializing DarkModeManager immediately');
  window.darkModeManager = new DarkModeManager();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DarkModeManager, toggleTheme, setDarkMode };
} 