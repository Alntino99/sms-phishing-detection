// Navigation Fix for SMS Shield
// This file ensures all navigation buttons work properly

(function() {
    'use strict';
    
    console.log('🔧 Loading Navigation Fix...');
    
    // Enhanced mobile menu functionality
    function setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const isOpen = mobileMenu.classList.contains('show');
                
                if (isOpen) {
                    // Close menu
                    mobileMenu.classList.remove('show');
                    mobileMenuBtn.textContent = '☰';
                    mobileMenuBtn.style.transform = 'rotate(0deg)';
                    document.body.style.overflow = '';
                } else {
                    // Open menu
                    mobileMenu.classList.add('show');
                    mobileMenuBtn.textContent = '✕';
                    mobileMenuBtn.style.transform = 'rotate(180deg)';
                    document.body.style.overflow = 'hidden';
                }
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                    mobileMenu.classList.remove('show');
                    mobileMenuBtn.textContent = '☰';
                    mobileMenuBtn.style.transform = 'rotate(0deg)';
                    document.body.style.overflow = '';
                }
            });
            
            // Close menu when clicking on a link
            const mobileLinks = mobileMenu.querySelectorAll('.nav-link');
            mobileLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileMenu.classList.remove('show');
                    mobileMenuBtn.textContent = '☰';
                    mobileMenuBtn.style.transform = 'rotate(0deg)';
                    document.body.style.overflow = '';
                });
            });
        }
    }
    
    // Enhanced theme toggle
    function setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle-enhanced');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                document.body.classList.toggle('dark-mode');
                const isDark = document.body.classList.contains('dark-mode');
                themeToggle.textContent = isDark ? '☀️' : '🌙';
                localStorage.setItem('darkMode', isDark);
                
                // Add smooth transition
                themeToggle.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    themeToggle.style.transform = 'scale(1)';
                }, 200);
            });
            
            // Load saved theme
            const savedTheme = localStorage.getItem('darkMode');
            if (savedTheme === 'true') {
                document.body.classList.add('dark-mode');
                themeToggle.textContent = '☀️';
            }
        }
    }
    
    // Enhanced navigation link interactions
    function setupNavigationLinks() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            // Add hover effects
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
            
            // Add click effects
            link.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }
    
    // Enhanced logo interactions
    function setupLogoInteractions() {
        const logoText = document.querySelector('.logo-text');
        const logoIcon = document.querySelector('.logo-icon');
        
        if (logoText) {
            logoText.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
            });
            
            logoText.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        }
        
        if (logoIcon) {
            logoIcon.addEventListener('mouseenter', function() {
                this.style.transform = 'rotate(10deg) scale(1.1)';
            });
            
            logoIcon.addEventListener('mouseleave', function() {
                this.style.transform = 'rotate(0deg) scale(1)';
            });
        }
    }
    
    // Enhanced cache clear button
    function setupCacheClearButton() {
        const cacheClearBtn = document.querySelector('.cache-clear-btn');
        
        if (cacheClearBtn) {
            cacheClearBtn.addEventListener('click', async function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                try {
                    this.textContent = '⏳';
                    this.style.background = 'rgba(245, 158, 11, 0.9)';
                    
                    // Show notification
                    if (window.showInfo) {
                        showInfo('Clearing cache and service workers...', '🔄 Cache Clearing');
                    }
                    
                    // Clear caches
                    if ('caches' in window) {
                        const cacheNames = await caches.keys();
                        await Promise.all(
                            cacheNames.map(cacheName => caches.delete(cacheName))
                        );
                    }
                    
                    // Unregister service workers
                    if ('serviceWorker' in navigator) {
                        const registrations = await navigator.serviceWorker.getRegistrations();
                        await Promise.all(
                            registrations.map(registration => registration.unregister())
                        );
                    }
                    
                    this.textContent = '✅';
                    this.style.background = 'rgba(16, 185, 129, 0.9)';
                    
                    // Show success notification
                    if (window.showSuccess) {
                        showSuccess('Cache cleared successfully!', '🔄 Cache Cleared');
                    }
                    
                    setTimeout(() => {
                        this.textContent = '🔄';
                        this.style.background = 'rgba(239, 68, 68, 0.9)';
                    }, 2000);
                    
                } catch (error) {
                    console.error('Cache clearing error:', error);
                    this.textContent = '❌';
                    this.style.background = 'rgba(239, 68, 68, 0.9)';
                    
                    // Show error notification
                    if (window.showError) {
                        showError('Failed to clear cache: ' + error.message, '🔄 Cache Error');
                    }
                    
                    setTimeout(() => {
                        this.textContent = '🔄';
                        this.style.background = 'rgba(239, 68, 68, 0.9)';
                    }, 2000);
                }
            });
        }
    }
    
    // Enhanced button animations
    function setupButtonAnimations() {
        const enhancedButtons = document.querySelectorAll('.btn-enhanced');
        
        enhancedButtons.forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.02)';
                this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = 'none';
            });
            
            btn.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }
    
    // Initialize all navigation features
    function initNavigation() {
        console.log('🔧 Initializing Navigation Fix...');
        
        setupMobileMenu();
        setupThemeToggle();
        setupNavigationLinks();
        setupLogoInteractions();
        setupCacheClearButton();
        setupButtonAnimations();
        
        console.log('✅ Navigation Fix loaded successfully');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavigation);
    } else {
        initNavigation();
    }
    
})();
