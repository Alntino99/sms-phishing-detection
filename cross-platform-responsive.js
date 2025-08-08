// ===== COMPREHENSIVE CROSS-PLATFORM RESPONSIVE JAVASCRIPT =====
// Handles responsive behavior, device detection, and cross-platform optimizations

class CrossPlatformManager {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isTablet = this.detectTablet();
        this.isDesktop = this.detectDesktop();
        this.isTouchDevice = this.detectTouchDevice();
        this.isHighDPI = this.detectHighDPI();
        this.isDarkMode = this.detectDarkMode();
        this.isReducedMotion = this.detectReducedMotion();
        
        this.init();
    }

    // Device Detection Methods
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }

    detectTablet() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    }

    detectDesktop() {
        return window.innerWidth > 1024;
    }

    detectTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    detectHighDPI() {
        return window.devicePixelRatio > 1;
    }

    detectDarkMode() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    detectReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // Initialize Cross-Platform Features
    init() {
        this.setupViewport();
        this.setupResponsiveNavigation();
        this.setupTouchOptimizations();
        this.setupAccessibility();
        this.setupPerformanceOptimizations();
        this.setupEventListeners();
        this.applyDeviceSpecificStyles();
    }

    // Viewport Setup
    setupViewport() {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            if (this.isMobile) {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            } else {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
            }
        }
    }

    // Responsive Navigation
    setupResponsiveNavigation() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.getElementById('mobileMenu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    mobileMenu.classList.remove('show');
                }
            });

            // Close mobile menu when clicking on a link
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (this.isMobile) {
                        mobileMenu.classList.remove('show');
                    }
                });
            });
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.toggle('show');
            
            // Prevent body scroll when menu is open
            if (mobileMenu.classList.contains('show')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    }

    handleResize() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && window.innerWidth > 768) {
            mobileMenu.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // Touch Device Optimizations
    setupTouchOptimizations() {
        if (this.isTouchDevice) {
            // Add touch-specific classes
            document.body.classList.add('touch-device');
            
            // Optimize touch targets
            const touchTargets = document.querySelectorAll('.nav-link, .button, .theme-toggle-enhanced, .mobile-menu-btn');
            touchTargets.forEach(target => {
                target.classList.add('touch-optimized');
            });

            // Add touch feedback
            touchTargets.forEach(target => {
                target.addEventListener('touchstart', () => {
                    target.classList.add('touch-active');
                });
                
                target.addEventListener('touchend', () => {
                    setTimeout(() => {
                        target.classList.remove('touch-active');
                    }, 150);
                });
            });
        }
    }

    // Accessibility Features
    setupAccessibility() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu && mobileMenu.classList.contains('show')) {
                    this.toggleMobileMenu();
                }
            }
        });

        // Focus management
        const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.classList.add('focused');
            });
            
            element.addEventListener('blur', () => {
                element.classList.remove('focused');
            });
        });

        // Screen reader announcements
        this.announceToScreenReader = (message) => {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.style.position = 'absolute';
            announcement.style.left = '-10000px';
            announcement.style.width = '1px';
            announcement.style.height = '1px';
            announcement.style.overflow = 'hidden';
            announcement.textContent = message;
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        };
    }

    // Performance Optimizations
    setupPerformanceOptimizations() {
        // Lazy loading for images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }

        // Debounced resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Preload critical resources
        this.preloadCriticalResources();
    }

    preloadCriticalResources() {
        const criticalResources = [
            'enhanced-design.css',
            'cross-platform-responsive.css',
            'mobile-enhancements.css'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = 'style';
            document.head.appendChild(link);
        });
    }

    // Event Listeners
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.querySelector('.theme-toggle-enhanced');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Notification system
        const notificationBell = document.querySelector('.notification-bell');
        if (notificationBell) {
            notificationBell.addEventListener('click', () => {
                this.toggleNotificationPanel();
            });
        }

        // Cache clear button
        const cacheClearBtn = document.querySelector('.cache-clear-btn');
        if (cacheClearBtn) {
            cacheClearBtn.addEventListener('click', () => {
                this.clearCacheAndReload();
            });
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Theme Management
    toggleTheme() {
        const body = document.body;
        const isDark = body.classList.contains('dark-mode');
        
        if (isDark) {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            this.announceToScreenReader('Switched to light mode');
        } else {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            this.announceToScreenReader('Switched to dark mode');
        }
    }

    // Notification System
    toggleNotificationPanel() {
        const panel = document.getElementById('notification-panel');
        if (panel) {
            panel.classList.toggle('show');
        }
    }

    // Cache Management
    clearCacheAndReload() {
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
            });
        }
        
        // Clear localStorage
        localStorage.clear();
        
        // Reload page
        window.location.reload();
    }

    // Device-Specific Styles
    applyDeviceSpecificStyles() {
        const body = document.body;
        
        // Add device-specific classes
        if (this.isMobile) body.classList.add('mobile-device');
        if (this.isTablet) body.classList.add('tablet-device');
        if (this.isDesktop) body.classList.add('desktop-device');
        if (this.isTouchDevice) body.classList.add('touch-device');
        if (this.isHighDPI) body.classList.add('high-dpi');
        if (this.isDarkMode) body.classList.add('dark-mode');
        if (this.isReducedMotion) body.classList.add('reduced-motion');

        // Apply saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            body.classList.toggle('dark-mode', savedTheme === 'dark');
        }
    }

    // Utility Methods
    getDeviceInfo() {
        return {
            isMobile: this.isMobile,
            isTablet: this.isTablet,
            isDesktop: this.isDesktop,
            isTouchDevice: this.isTouchDevice,
            isHighDPI: this.isHighDPI,
            isDarkMode: this.isDarkMode,
            isReducedMotion: this.isReducedMotion,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            userAgent: navigator.userAgent,
            language: navigator.language
        };
    }

    // Responsive Image Loading
    loadResponsiveImage(imgElement, srcSet) {
        if (this.isMobile && srcSet.mobile) {
            imgElement.src = srcSet.mobile;
        } else if (this.isTablet && srcSet.tablet) {
            imgElement.src = srcSet.tablet;
        } else if (srcSet.desktop) {
            imgElement.src = srcSet.desktop;
        }
    }

    // Network Status Detection
    setupNetworkDetection() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                document.body.classList.add('slow-connection');
            }
            
            connection.addEventListener('change', () => {
                document.body.classList.toggle('slow-connection', 
                    connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
            });
        }
    }
}

// Initialize Cross-Platform Manager
document.addEventListener('DOMContentLoaded', () => {
    window.crossPlatformManager = new CrossPlatformManager();
    
    // Additional mobile-specific optimizations
    if (window.crossPlatformManager.isMobile) {
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Optimize scroll performance
        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('.scrollable')) {
                e.preventDefault();
            }
        }, { passive: false });
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CrossPlatformManager;
}

