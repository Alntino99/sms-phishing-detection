// Mobile Navigation Fix for SMS Shield
// This file ensures mobile navigation works properly across all devices

(function() {
    'use strict';
    
    console.log('📱 Loading Mobile Navigation Fix...');
    
    // Enhanced mobile menu functionality
    function setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (!mobileMenuBtn || !mobileMenu) {
            console.warn('⚠️ Mobile menu elements not found');
            return;
        }
        
        console.log('📱 Setting up mobile menu...');
        
        // Add click event listener
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('📱 Mobile menu button clicked');
            
            const isOpen = mobileMenu.classList.contains('show');
            
            if (isOpen) {
                // Close menu
                closeMobileMenu();
            } else {
                // Open menu
                openMobileMenu();
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (mobileMenu.classList.contains('show') && 
                !mobileMenuBtn.contains(e.target) && 
                !mobileMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Close menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('.nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                console.log('📱 Mobile menu link clicked, closing menu');
                closeMobileMenu();
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('show')) {
                closeMobileMenu();
            }
        });
        
        // Close menu on window resize (if switching to desktop)
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && mobileMenu.classList.contains('show')) {
                closeMobileMenu();
            }
        });
    }
    
    function openMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        mobileMenu.classList.add('show');
        mobileMenuBtn.classList.add('active');
        mobileMenuBtn.innerHTML = '✕';
        document.body.style.overflow = 'hidden';
        
        // Force visibility
        mobileMenu.style.display = 'flex';
        mobileMenu.style.opacity = '1';
        mobileMenu.style.visibility = 'visible';
        mobileMenu.style.transform = 'translateY(0)';
        
        console.log('📱 Mobile menu opened');
    }
    
    function closeMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        mobileMenu.classList.remove('show');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.innerHTML = '☰';
        document.body.style.overflow = '';
        
        // Hide menu
        mobileMenu.style.opacity = '0';
        mobileMenu.style.visibility = 'hidden';
        mobileMenu.style.transform = 'translateY(-100%)';
        
        console.log('📱 Mobile menu closed');
    }
    
    // Global function for onclick handlers
    window.toggleMobileMenu = function() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && mobileMenu.classList.contains('show')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    };
    
    // Enhanced mobile menu styling - OVERRIDE ALL CONFLICTING STYLES
    function enhanceMobileMenuStyles() {
        // Remove any existing mobile menu styles
        const existingStyle = document.getElementById('mobile-menu-fix-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // Add comprehensive CSS for mobile menu
        const style = document.createElement('style');
        style.id = 'mobile-menu-fix-styles';
        style.textContent = `
            /* CRITICAL: Override all conflicting mobile menu styles */
            .mobile-menu {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: rgba(0, 0, 0, 0.95) !important;
                backdrop-filter: blur(20px) !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
                z-index: 99999 !important;
                opacity: 0 !important;
                visibility: hidden !important;
                transform: translateY(-100%) !important;
                transition: all 0.3s ease !important;
                padding: 2rem !important;
                margin: 0 !important;
                border: none !important;
                box-shadow: none !important;
            }
            
            .mobile-menu.show {
                opacity: 1 !important;
                visibility: visible !important;
                transform: translateY(0) !important;
                display: flex !important;
            }
            
            .mobile-menu-links {
                display: flex !important;
                flex-direction: column !important;
                gap: 1rem !important;
                width: 100% !important;
                max-width: 300px !important;
                align-items: center !important;
                justify-content: center !important;
            }
            
            .mobile-menu-links .nav-link {
                width: 100% !important;
                padding: 1rem 1.5rem !important;
                background: rgba(255, 255, 255, 0.1) !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
                border-radius: 12px !important;
                color: white !important;
                text-decoration: none !important;
                font-size: 1.1rem !important;
                font-weight: 500 !important;
                text-align: center !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                min-height: 50px !important;
                transition: all 0.3s ease !important;
                backdrop-filter: blur(10px) !important;
                margin: 0 !important;
                cursor: pointer !important;
            }
            
            .mobile-menu-links .nav-link:hover {
                background: linear-gradient(135deg, #667eea, #764ba2) !important;
                transform: scale(1.05) !important;
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4) !important;
                color: white !important;
            }
            
            .mobile-menu-links .nav-link.active {
                background: linear-gradient(135deg, #667eea, #764ba2) !important;
                color: white !important;
            }
            
            .mobile-menu-btn {
                display: none !important;
                background: linear-gradient(135deg, #667eea, #764ba2) !important;
                color: white !important;
                border: none !important;
                border-radius: 8px !important;
                padding: 0.5rem !important;
                cursor: pointer !important;
                font-size: 1.2rem !important;
                transition: all 0.3s ease !important;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3) !important;
                z-index: 100000 !important;
                position: relative !important;
            }
            
            .mobile-menu-btn:hover {
                transform: scale(1.1) !important;
            }
            
            .mobile-menu-btn.active {
                background: linear-gradient(135deg, #764ba2, #667eea) !important;
            }
            
            /* Mobile responsive breakpoints - FORCE MOBILE MENU */
            @media screen and (max-width: 768px) {
                .mobile-menu-btn {
                    display: block !important;
                }
                
                .enhanced-nav {
                    display: none !important;
                }
                
                .mobile-menu {
                    display: none !important;
                }
                
                .mobile-menu.show {
                    display: flex !important;
                }
            }
            
            @media screen and (min-width: 769px) {
                .mobile-menu-btn {
                    display: none !important;
                }
                
                .mobile-menu {
                    display: none !important;
                }
            }
            
            /* Animation for mobile menu */
            @keyframes slideInDown {
                from {
                    opacity: 0;
                    transform: translateY(-100%);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Dark mode support */
            body.dark-mode .mobile-menu {
                background: rgba(0, 0, 0, 0.98) !important;
            }
            
            body.dark-mode .mobile-menu-links .nav-link {
                background: rgba(255, 255, 255, 0.05) !important;
                border-color: rgba(255, 255, 255, 0.1) !important;
            }
            
            body.dark-mode .mobile-menu-links .nav-link:hover {
                background: linear-gradient(135deg, #667eea, #764ba2) !important;
            }
            
            /* Ensure mobile menu is always on top */
            .mobile-menu {
                z-index: 99999 !important;
            }
            
            /* Fix for any conflicting styles */
            .mobile-menu * {
                box-sizing: border-box !important;
            }
            
            /* Force visibility of mobile menu links */
            .mobile-menu.show .mobile-menu-links {
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
            
            .mobile-menu.show .mobile-menu-links .nav-link {
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
        `;
        
        document.head.appendChild(style);
        console.log('📱 Enhanced mobile menu styles added with !important overrides');
    }
    
    // Initialize mobile navigation
    function initMobileNavigation() {
        console.log('📱 Initializing Mobile Navigation Fix...');
        
        enhanceMobileMenuStyles();
        setupMobileMenu();
        
        // Force mobile menu to be visible if screen is small
        if (window.innerWidth <= 768) {
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            if (mobileMenuBtn) {
                mobileMenuBtn.style.display = 'block';
            }
        }
        
        console.log('✅ Mobile Navigation Fix loaded successfully');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileNavigation);
    } else {
        initMobileNavigation();
    }
    
})();
