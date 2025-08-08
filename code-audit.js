// Comprehensive Code Audit for SMS Shield
// Checks for duplicate code, missing functions, and potential issues

(function() {
    'use strict';
    
    console.log('🔍 Starting Comprehensive Code Audit...');
    
    class CodeAuditor {
        constructor() {
            this.issues = [];
            this.duplicates = [];
            this.missingFunctions = [];
            this.loadingIssues = [];
        }
        
        async runAudit() {
            console.log('📋 Running comprehensive code audit...');
            
            this.checkDuplicateFunctions();
            this.checkMissingFunctions();
            this.checkScriptLoading();
            this.checkErrorHandling();
            this.checkDependencies();
            
            this.generateReport();
        }
        
        checkDuplicateFunctions() {
            const functionNames = [
                'toggleTheme',
                'clearCacheAndReload',
                'showSuccess',
                'showError',
                'showInfo',
                'showWarning',
                'updateAuthUI'
            ];
            
            functionNames.forEach(funcName => {
                const instances = this.findFunctionInstances(funcName);
                if (instances.length > 1) {
                    this.duplicates.push({
                        function: funcName,
                        instances: instances
                    });
                }
            });
        }
        
        findFunctionInstances(funcName) {
            const instances = [];
            
            // Check global scope
            if (typeof window[funcName] === 'function') {
                instances.push({
                    location: 'Global Scope',
                    type: 'Global Function'
                });
            }
            
            // Check script tags
            const scripts = document.querySelectorAll('script');
            scripts.forEach((script, index) => {
                if (script.textContent && script.textContent.includes(`function ${funcName}`)) {
                    instances.push({
                        location: `Script ${index + 1}`,
                        type: 'Inline Function'
                    });
                }
            });
            
            return instances;
        }
        
        checkMissingFunctions() {
            const requiredFunctions = [
                'showSuccess',
                'showError', 
                'showInfo',
                'showWarning',
                'toggleTheme',
                'clearCacheAndReload'
            ];
            
            requiredFunctions.forEach(funcName => {
                if (typeof window[funcName] !== 'function') {
                    this.missingFunctions.push(funcName);
                }
            });
            
            // Check for updateAuthUI - it can be either global or part of authManager
            if (typeof window.updateAuthUI !== 'function' && 
                (!window.authManager || typeof window.authManager.updateAuthUI !== 'function')) {
                this.missingFunctions.push('updateAuthUI');
            }
        }
        
        checkScriptLoading() {
            const scripts = document.querySelectorAll('script[src]');
            const loadedScripts = [];
            
            scripts.forEach(script => {
                const src = script.getAttribute('src');
                if (src) {
                    loadedScripts.push(src);
                }
            });
            
            // Check for potential loading issues
            const criticalScripts = [
                'error-handler.js',
                'darkMode.js',
                'auth-state-manager.js',
                'notification-system.js'
            ];
            
            criticalScripts.forEach(script => {
                if (!loadedScripts.some(loaded => loaded.includes(script))) {
                    this.loadingIssues.push(`Missing critical script: ${script}`);
                }
            });
        }
        
        checkErrorHandling() {
            // Check if error handler is loaded
            if (!window.errorHandler) {
                this.issues.push('Error handler not loaded');
            }
            
            // Check for console.error usage
            const scripts = document.querySelectorAll('script');
            scripts.forEach((script, index) => {
                if (script.textContent && script.textContent.includes('console.error')) {
                    // This is expected, but we can track it
                }
            });
        }
        
        checkDependencies() {
            const dependencies = [
                { name: 'authManager', required: true },
                { name: 'darkModeManager', required: true },
                { name: 'showSuccess', required: true },
                { name: 'toggleTheme', required: true },
                { name: 'clearCacheAndReload', required: true }
            ];
            
            dependencies.forEach(dep => {
                if (dep.required && typeof window[dep.name] === 'undefined') {
                    this.issues.push(`Missing required dependency: ${dep.name}`);
                }
            });
        }
        
        generateReport() {
            console.log('\n📊 CODE AUDIT REPORT');
            console.log('====================');
            
            if (this.duplicates.length > 0) {
                console.log('\n🚨 DUPLICATE FUNCTIONS FOUND:');
                this.duplicates.forEach(dup => {
                    console.log(`  - ${dup.function}: ${dup.instances.length} instances`);
                    dup.instances.forEach(instance => {
                        console.log(`    * ${instance.location} (${instance.type})`);
                    });
                });
            }
            
            if (this.missingFunctions.length > 0) {
                console.log('\n❌ MISSING FUNCTIONS:');
                this.missingFunctions.forEach(func => {
                    console.log(`  - ${func}`);
                });
            }
            
            if (this.loadingIssues.length > 0) {
                console.log('\n⚠️ SCRIPT LOADING ISSUES:');
                this.loadingIssues.forEach(issue => {
                    console.log(`  - ${issue}`);
                });
            }
            
            if (this.issues.length > 0) {
                console.log('\n🔧 GENERAL ISSUES:');
                this.issues.forEach(issue => {
                    console.log(`  - ${issue}`);
                });
            }
            
            // Summary
            const totalIssues = this.duplicates.length + this.missingFunctions.length + 
                              this.loadingIssues.length + this.issues.length;
            
            console.log('\n📈 SUMMARY:');
            console.log(`  - Duplicate functions: ${this.duplicates.length}`);
            console.log(`  - Missing functions: ${this.missingFunctions.length}`);
            console.log(`  - Loading issues: ${this.loadingIssues.length}`);
            console.log(`  - General issues: ${this.issues.length}`);
            console.log(`  - Total issues: ${totalIssues}`);
            
            if (totalIssues === 0) {
                console.log('\n✅ CODE AUDIT PASSED - No issues found!');
            } else {
                console.log('\n🔧 RECOMMENDATIONS:');
                console.log('  1. Remove duplicate function definitions');
                console.log('  2. Ensure all required scripts are loaded');
                console.log('  3. Add proper error handling for missing functions');
                console.log('  4. Use the error handler for graceful fallbacks');
            }
            
            // Store results for external access
            window.auditResults = {
                duplicates: this.duplicates,
                missingFunctions: this.missingFunctions,
                loadingIssues: this.loadingIssues,
                issues: this.issues,
                totalIssues: totalIssues
            };
        }
    }
    
    // Create and run auditor
    const auditor = new CodeAuditor();
    
    // Run audit when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            auditor.runAudit();
        }, 1000); // Give scripts time to load
    });
    
    // Also run immediately if DOM is already loaded
    if (document.readyState === 'loading') {
        // Wait for DOMContentLoaded
    } else {
        setTimeout(() => {
            auditor.runAudit();
        }, 1000);
    }
    
    console.log('✅ Code Auditor loaded successfully');
})();
