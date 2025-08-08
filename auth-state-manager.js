// Authentication State Manager
// This file manages user authentication state across all pages

class AuthStateManager {
  constructor() {
    this.currentUser = null;
    this.isInitialized = false;
    this.authListeners = [];
    this.init();
  }

  init() {
    // Check for existing session on page load
    this.checkExistingSession();
    
    // Set up Firebase auth state listener if available
    if (typeof auth !== 'undefined' && auth.onAuthStateChanged) {
      auth.onAuthStateChanged((user) => {
        this.handleAuthStateChange(user);
      });
    }
    
    this.isInitialized = true;
  }

  checkExistingSession() {
    try {
      const storedUser = localStorage.getItem('current_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const loginTime = user.loginTime;
        const now = Date.now();
        
        // Check if session is still valid (24 hours)
        if (now - loginTime < 24 * 60 * 60 * 1000) {
          this.currentUser = user;
          this.updateAllAuthUI();
          console.log('✅ Existing session found:', user.email);
        } else {
          // Session expired
          this.signOut();
          console.log('⚠️ Session expired, user signed out');
        }
      }
    } catch (error) {
      console.error('❌ Error checking existing session:', error);
      this.signOut();
    }
  }

  handleAuthStateChange(user) {
    if (user) {
      // User is signed in
      this.currentUser = {
        email: user.email,
        uid: user.uid,
        loginTime: Date.now()
      };
      localStorage.setItem('current_user', JSON.stringify(this.currentUser));
      console.log('✅ User signed in:', user.email);
    } else {
      // User is signed out
      this.signOut();
      console.log('✅ User signed out');
    }
    
    this.updateAllAuthUI();
    this.notifyListeners();
  }

  async signIn(email, password) {
    try {
      const result = await authenticateUser(email, password, false);
      this.currentUser = {
        email: result.user.email,
        uid: result.user.uid,
        loginTime: Date.now()
      };
      localStorage.setItem('current_user', JSON.stringify(this.currentUser));
      this.updateAllAuthUI();
      this.notifyListeners();
      return result;
    } catch (error) {
      console.error('❌ Sign in failed:', error);
      throw error;
    }
  }

  async signUp(email, password) {
    try {
      const result = await authenticateUser(email, password, true);
      this.currentUser = {
        email: result.user.email,
        uid: result.user.uid,
        loginTime: Date.now()
      };
      localStorage.setItem('current_user', JSON.stringify(this.currentUser));
      this.updateAllAuthUI();
      this.notifyListeners();
      return result;
    } catch (error) {
      console.error('❌ Sign up failed:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      await signOutUser();
    } catch (error) {
      console.error('❌ Sign out error:', error);
    }
    
    this.currentUser = null;
    localStorage.removeItem('current_user');
    this.updateAllAuthUI();
    this.notifyListeners();
  }

  isSignedIn() {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getUserEmail() {
    return this.currentUser ? this.currentUser.email : null;
  }

  updateAllAuthUI() {
    // Update navigation auth links
    this.updateAuthLinks();
    
    // Update mobile menu auth links
    this.updateMobileAuthLinks();
    
    // Update any other auth-related UI elements
    this.updateAuthButtons();
  }

  updateAuthLinks() {
    const authLinks = document.querySelectorAll('.auth-link');
    authLinks.forEach(link => {
      if (this.isSignedIn()) {
        // Check if this is a logout link (already set to logout.html)
        if (link.href.includes('logout.html')) {
          link.textContent = 'Sign Out';
          link.href = 'logout.html';
        } else {
          link.textContent = this.getUserEmail() || 'Profile';
          link.href = 'profile.html';
        }
        link.classList.add('signed-in');
      } else {
        link.textContent = 'Sign In';
        link.href = 'login.html';
        link.classList.remove('signed-in');
      }
    });
  }

  updateMobileAuthLinks() {
    const mobileAuthLinks = document.querySelectorAll('.mobile-menu .nav-link[href*="login"], .mobile-menu .nav-link[href*="profile"]');
    mobileAuthLinks.forEach(link => {
      if (this.isSignedIn()) {
        link.textContent = `👤 ${this.getUserEmail() || 'Profile'}`;
        link.href = 'profile.html';
      } else {
        link.textContent = '🔐 Sign In';
        link.href = 'login.html';
      }
    });
  }

  updateAuthButtons() {
    // Update any sign out buttons
    const signOutButtons = document.querySelectorAll('.sign-out-btn');
    signOutButtons.forEach(btn => {
      btn.style.display = this.isSignedIn() ? 'block' : 'none';
    });

    // Update welcome messages
    const welcomeElements = document.querySelectorAll('.welcome-message');
    welcomeElements.forEach(element => {
      if (this.isSignedIn()) {
        element.textContent = `Welcome, ${this.getUserEmail()}`;
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
      }
    });
  }

  // Add the missing updateAuthUI function
  updateAuthUI() {
    this.updateAllAuthUI();
  }

  addAuthListener(callback) {
    this.authListeners.push(callback);
  }

  removeAuthListener(callback) {
    const index = this.authListeners.indexOf(callback);
    if (index > -1) {
      this.authListeners.splice(index, 1);
    }
  }

  notifyListeners() {
    this.authListeners.forEach(callback => {
      try {
        callback(this.currentUser);
      } catch (error) {
        console.error('❌ Auth listener error:', error);
      }
    });
  }

  // Redirect to login if not signed in
  requireAuth(redirectUrl = 'login.html') {
    if (!this.isSignedIn()) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  }

  // Redirect to dashboard if already signed in
  redirectIfSignedIn(targetUrl = 'dashboard.html') {
    if (this.isSignedIn()) {
      window.location.href = targetUrl;
      return true;
    }
    return false;
  }
}

// Create global instance
const authManager = new AuthStateManager();

// Export for global access
window.authManager = authManager;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Ensure auth manager is initialized
  if (!authManager.isInitialized) {
    authManager.init();
  }
});

console.log('✅ Auth State Manager loaded successfully');
