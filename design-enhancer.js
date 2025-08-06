/**
 * Design Enhancement Utility
 * Automatically applies modern design improvements to existing pages
 */

// Enhanced design system utilities
const DesignEnhancer = {
  
  // Apply modern glass morphism effect to any element
  applyGlassMorphism: (element, options = {}) => {
    const defaultOptions = {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '1rem',
      boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)'
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    Object.assign(element.style, finalOptions);
  },

  // Enhance buttons with modern styling
  enhanceButtons: () => {
    const buttons = document.querySelectorAll('button, .btn, input[type="submit"], input[type="button"]');
    
    buttons.forEach(btn => {
      if (!btn.classList.contains('enhanced')) {
        btn.classList.add('enhanced');
        
        // Apply base button styles
        Object.assign(btn.style, {
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '2rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          zIndex: '1'
        });

        // Add hover effects
        btn.addEventListener('mouseenter', () => {
          btn.style.transform = 'translateY(-2px)';
          btn.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.transform = 'translateY(0)';
          btn.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        });

        // Add click animation
        btn.addEventListener('click', () => {
          btn.style.transform = 'scale(0.98)';
          setTimeout(() => {
            btn.style.transform = 'translateY(-2px)';
          }, 100);
        });
      }
    });
  },

  // Enhance cards with glass morphism and animations
  enhanceCards: () => {
    const cards = document.querySelectorAll('.card, .post, .item, .box');
    
    cards.forEach((card, index) => {
      if (!card.classList.contains('enhanced')) {
        card.classList.add('enhanced');
        
        DesignEnhancer.applyGlassMorphism(card);
        
        // Add hover animation
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'translateY(-8px)';
          card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = 'translateY(0)';
          card.style.boxShadow = '0 8px 32px rgba(31, 38, 135, 0.37)';
        });

        // Add entrance animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        // Trigger animation when in view
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }
          });
        });
        
        observer.observe(card);
      }
    });
  },

  // Enhance forms with modern styling
  enhanceForms: () => {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      if (!input.classList.contains('enhanced')) {
        input.classList.add('enhanced');
        
        Object.assign(input.style, {
          padding: '0.75rem 1rem',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '0.5rem',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          fontSize: '1rem',
          transition: 'all 0.3s ease'
        });

        // Add focus effects
        input.addEventListener('focus', () => {
          input.style.borderColor = '#6366f1';
          input.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
          input.style.background = 'rgba(255, 255, 255, 0.15)';
        });

        input.addEventListener('blur', () => {
          input.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          input.style.boxShadow = 'none';
          input.style.background = 'rgba(255, 255, 255, 0.1)';
        });
      }
    });
  },

  // Add floating animations to elements
  addFloatingAnimation: (selector) => {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach((element, index) => {
      element.style.animation = `float 3s ease-in-out infinite ${index * 0.5}s`;
    });

    // Add CSS animation if not exists
    if (!document.querySelector('#float-animation')) {
      const style = document.createElement('style');
      style.id = 'float-animation';
      style.textContent = `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `;
      document.head.appendChild(style);
    }
  },

  // Enhance navigation with modern styling
  enhanceNavigation: () => {
    const navs = document.querySelectorAll('nav, .nav, .navigation');
    
    navs.forEach(nav => {
      if (!nav.classList.contains('enhanced')) {
        nav.classList.add('enhanced');
        
        DesignEnhancer.applyGlassMorphism(nav, {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)'
        });

        const links = nav.querySelectorAll('a');
        links.forEach(link => {
          Object.assign(link.style, {
            padding: '0.5rem 1rem',
            borderRadius: '1.5rem',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
            fontWeight: '500'
          });

          link.addEventListener('mouseenter', () => {
            link.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            link.style.color = 'white';
            link.style.transform = 'translateY(-2px)';
          });

          link.addEventListener('mouseleave', () => {
            link.style.background = 'transparent';
            link.style.color = '';
            link.style.transform = 'translateY(0)';
          });
        });
      }
    });
  },

  // Add theme toggle functionality
  addThemeToggle: () => {
    if (!document.querySelector('.theme-toggle-enhanced')) {
      const toggle = document.createElement('button');
      toggle.className = 'theme-toggle-enhanced';
      toggle.innerHTML = '🌙';
      toggle.setAttribute('aria-label', 'Toggle theme');
      
      Object.assign(toggle.style, {
        position: 'fixed',
        top: '1.5rem',
        right: '1.5rem',
        zIndex: '1001',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        color: 'white'
      });

      toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        toggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('darkMode', isDark);
        
        // Add rotation animation
        toggle.style.transform = 'scale(1.1) rotate(180deg)';
        setTimeout(() => {
          toggle.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
      });

      toggle.addEventListener('mouseenter', () => {
        toggle.style.transform = 'scale(1.1)';
        toggle.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
      });

      toggle.addEventListener('mouseleave', () => {
        toggle.style.transform = 'scale(1)';
        toggle.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
      });

      document.body.appendChild(toggle);

      // Load saved theme
      const savedTheme = localStorage.getItem('darkMode');
      if (savedTheme === 'true') {
        document.body.classList.add('dark-mode');
        toggle.textContent = '☀️';
      }
    }
  },

  // Initialize all enhancements
  init: () => {
    console.log('🎨 Initializing design enhancements...');
    
    // Apply enhancements
    DesignEnhancer.enhanceButtons();
    DesignEnhancer.enhanceCards();
    DesignEnhancer.enhanceForms();
    DesignEnhancer.enhanceNavigation();
    DesignEnhancer.addThemeToggle();
    
    // Add floating animation to logos and icons
    DesignEnhancer.addFloatingAnimation('.logo, .icon, .logo-icon');
    
    console.log('✅ Design enhancements applied successfully!');
  }
};

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  DesignEnhancer.init();
});

// Make it globally available
window.DesignEnhancer = DesignEnhancer;

// Add some utility CSS classes
const utilityStyles = document.createElement('style');
utilityStyles.textContent = `
  /* Dark mode styles */
  body.dark-mode {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%) !important;
  }

  body.dark-mode .enhanced {
    background: rgba(0, 0, 0, 0.2) !important;
    border-color: rgba(255, 255, 255, 0.1) !important;
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Enhanced scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #f093fb, #f5576c);
  }

  /* Responsive design utilities */
  @media (max-width: 768px) {
    .theme-toggle-enhanced {
      width: 50px !important;
      height: 50px !important;
      font-size: 1.2rem !important;
    }
  }
`;

document.head.appendChild(utilityStyles);
