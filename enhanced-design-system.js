// Enhanced Design System for SMS Shield
// This ensures all pages have consistent new design with animations

(function() {
    'use strict';
    
    // Enhanced Design System
    class EnhancedDesignSystem {
        constructor() {
            this.init();
        }
        
        init() {
            this.setupEnhancedTheme();
            this.setupEnhancedAnimations();
            this.setupEnhancedNavigation();
            this.setupEnhancedMobileMenu();
            this.setupEnhancedCacheClearing();
            this.setupEnhancedScrollEffects();
            this.setupEnhancedButtonInteractions();
        }
        
        setupEnhancedTheme() {
            // Enhanced theme toggle with smooth transitions
            const themeToggle = document.querySelector('.theme-toggle-enhanced');
            if (themeToggle) {
                themeToggle.addEventListener('click', () => {
                    document.body.classList.toggle('dark-mode');
                    const isDark = document.body.classList.contains('dark-mode');
                    themeToggle.textContent = isDark ? '☀️' : '🌙';
                    localStorage.setItem('darkMode', isDark);
                    
                    // Add smooth transition effect
                    themeToggle.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        themeToggle.style.transform = 'scale(1)';
                    }, 200);
                });
            }
            
            // Load saved theme
            const savedTheme = localStorage.getItem('darkMode');
            if (savedTheme === 'true') {
                document.body.classList.add('dark-mode');
                const themeToggle = document.querySelector('.theme-toggle-enhanced');
                if (themeToggle) {
                    themeToggle.textContent = '☀️';
                }
            }
        }
        
        setupEnhancedAnimations() {
            // Enhanced scroll animations
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);
            
            // Observe all enhanced elements
            const enhancedElements = document.querySelectorAll('.card-enhanced, .animate-slide-up, .animate-slide-left, .animate-slide-right');
            enhancedElements.forEach((element, index) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
                observer.observe(element);
            });
        }
        
        setupEnhancedNavigation() {
            // Enhanced navigation with smooth transitions
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                });
                
                link.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'none';
                });
            });
        }
        
        setupEnhancedMobileMenu() {
            // Enhanced mobile menu functionality
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const mobileMenu = document.getElementById('mobileMenu');
            
            if (mobileMenuBtn && mobileMenu) {
                mobileMenuBtn.addEventListener('click', () => {
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
        
        setupEnhancedCacheClearing() {
            // Enhanced cache clearing functionality
            const cacheClearBtn = document.querySelector('.cache-clear-btn');
            if (cacheClearBtn) {
                cacheClearBtn.addEventListener('click', async () => {
                    try {
                        // Clear all caches
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
                        
                        // Force reload
                        window.location.reload(true);
                    } catch (error) {
                        console.error('Cache clearing error:', error);
                        window.location.reload(true);
                    }
                });
            }
        }
        
        setupEnhancedScrollEffects() {
            // Enhanced scroll effects
            let ticking = false;
            
            function updateScrollEffects() {
                const scrolled = window.pageYOffset;
                const parallaxElements = document.querySelectorAll('.parallax');
                
                parallaxElements.forEach(element => {
                    const speed = element.dataset.speed || 0.5;
                    element.style.transform = `translateY(${scrolled * speed}px)`;
                });
                
                ticking = false;
            }
            
            function requestTick() {
                if (!ticking) {
                    requestAnimationFrame(updateScrollEffects);
                    ticking = true;
                }
            }
            
            window.addEventListener('scroll', requestTick);
        }
        
        setupEnhancedButtonInteractions() {
            // Enhanced button interactions
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
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new EnhancedDesignSystem();
        });
    } else {
        new EnhancedDesignSystem();
    }
    
    console.log('🎨 Enhanced Design System loaded');
})();
