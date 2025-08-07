// Cache clearing script for SMS Shield
// Only clears cache when explicitly requested, doesn't interfere with navigation

(function() {
    'use strict';
    
    // Clear all caches
    async function clearAllCaches() {
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
            console.log('✅ All caches cleared');
        }
    }
    
    // Unregister all service workers
    async function unregisterServiceWorkers() {
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(
                registrations.map(registration => registration.unregister())
            );
            console.log('✅ All service workers unregistered');
        }
    }
    
    // Clear localStorage if needed
    function clearLocalStorage() {
        const keysToKeep = ['darkMode', 'userPreferences'];
        const keysToRemove = Object.keys(localStorage).filter(key => 
            !keysToKeep.includes(key)
        );
        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log('✅ Old localStorage items cleared');
    }
    
    // Main function to clear everything
    async function clearEverything() {
        try {
            await clearAllCaches();
            await unregisterServiceWorkers();
            clearLocalStorage();
            
            // Force reload after a short delay
            setTimeout(() => {
                window.location.reload(true);
            }, 100);
            
        } catch (error) {
            console.error('Error clearing cache:', error);
            // Still try to reload
            setTimeout(() => {
                window.location.reload(true);
            }, 100);
        }
    }
    
    // Only clear cache if explicitly requested via URL parameter
    if (window.location.search.includes('clear-cache=true')) {
        clearEverything();
    }
    
    // Export for manual use
    window.clearCacheAndReload = clearEverything;
    
    console.log('🔄 Cache clearing script loaded (manual only)');
})();
