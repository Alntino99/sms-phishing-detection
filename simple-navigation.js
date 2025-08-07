// Simple Navigation System for SMS Shield
// This ensures all navigation links work properly without conflicts

(function() {
    'use strict';
    
    console.log('🔗 Simple Navigation System loading...');
    
    // Simple theme toggle
    function setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle-enhanced');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                const isDark = document.body.classList.contains('dark-mode');
                themeToggle.textContent = isDark ? '☀️' : '🌙';
                localStorage.setItem('darkMode', isDark);
            });
            
            // Load saved theme
            const savedTheme = localStorage.getItem('darkMode');
            if (savedTheme === 'true') {
                document.body.classList.add('dark-mode');
                themeToggle.textContent = '☀️';
            }
        }
    }
    
    // Simple mobile menu
    function setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (mobileMenu.classList.contains('show')) {
                    mobileMenu.classList.remove('show');
                    mobileMenuBtn.textContent = '☰';
                    document.body.style.overflow = '';
                } else {
                    mobileMenu.classList.add('show');
                    mobileMenuBtn.textContent = '✕';
                    document.body.style.overflow = 'hidden';
                }
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                    mobileMenu.classList.remove('show');
                    mobileMenuBtn.textContent = '☰';
                    document.body.style.overflow = '';
                }
            });
        }
    }
    
    // Simple cache clearing
    function setupCacheClearing() {
        const cacheClearBtn = document.querySelector('.cache-clear-btn');
        if (cacheClearBtn) {
            cacheClearBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                try {
                    cacheClearBtn.textContent = '⏳';
                    cacheClearBtn.style.background = 'rgba(245, 158, 11, 0.9)';
                    
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
                    
                    cacheClearBtn.textContent = '✅';
                    cacheClearBtn.style.background = 'rgba(16, 185, 129, 0.9)';
                    
                    setTimeout(() => {
                        cacheClearBtn.textContent = '🔄';
                        cacheClearBtn.style.background = 'rgba(239, 68, 68, 0.9)';
                    }, 2000);
                    
                } catch (error) {
                    console.error('Cache clearing error:', error);
                    cacheClearBtn.textContent = '❌';
                    cacheClearBtn.style.background = 'rgba(239, 68, 68, 0.9)';
                    
                    setTimeout(() => {
                        cacheClearBtn.textContent = '🔄';
                        cacheClearBtn.style.background = 'rgba(239, 68, 68, 0.9)';
                    }, 2000);
                }
            });
        }
    }
    
    // Simple button animations
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
    
    // Initialize everything
    function init() {
        console.log('🔗 Initializing Simple Navigation System...');
        
        setupThemeToggle();
        setupMobileMenu();
        setupCacheClearing();
        setupButtonAnimations();
        
        console.log('✅ Simple Navigation System loaded successfully');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();

