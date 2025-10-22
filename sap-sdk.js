/**
 * Sustainable AI Protocol (SAP) SDK
 * Version: 1.0.0
 * 
 * This SDK provides methods to track and manage the environmental impact
 * of AI applications in real-time.
 */

class SAPSDK {
    constructor(config = {}) {
        this.config = {
            serverUrl: config.serverUrl || 'http://localhost:3001',
            apiKey: config.apiKey || null,
            userId: config.userId || this.generateUserId(),
            autoTrack: config.autoTrack !== false,
            debug: config.debug || false,
            ...config
        };
        
        this.stats = {
            totalPrompts: 0,
            totalEnergy: 0,
            totalCO2: 0,
            lastUpdated: null
        };
        
        this.callbacks = {
            onStatsUpdate: null,
            onError: null,
            onPromptTracked: null
        };
        
        this.initialize();
    }
    
    /**
     * Initialize the SDK
     */
    initialize() {
        this.log('SAP SDK initialized');
        
        if (this.config.autoTrack) {
            this.setupAutoTracking();
        }
        
        // Load initial stats
        this.loadStats();
        
        // Set up periodic stats updates
        setInterval(() => {
            this.loadStats();
        }, 5000);
    }
    
    /**
     * Generate a unique user ID
     */
    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
    
    /**
     * Log messages if debug mode is enabled
     */
    log(message, data = null) {
        if (this.config.debug) {
            console.log(`[SAP SDK] ${message}`, data || '');
        }
    }
    
    /**
     * Set up automatic tracking for common AI interfaces
     */
    setupAutoTracking() {
        // Track form submissions that might be AI prompts
        document.addEventListener('submit', (event) => {
            const form = event.target;
            const textarea = form.querySelector('textarea');
            const input = form.querySelector('input[type="text"]');
            
            if (textarea || input) {
                const text = textarea ? textarea.value : input.value;
                if (text && text.length > 10) {
                    this.trackPrompt(text, 'form_submission');
                }
            }
        });
        
        // Track button clicks that might trigger AI
        document.addEventListener('click', (event) => {
            const button = event.target;
            if (button.tagName === 'BUTTON' && 
                (button.textContent.toLowerCase().includes('generate') ||
                 button.textContent.toLowerCase().includes('ask') ||
                 button.textContent.toLowerCase().includes('send'))) {
                
                // Find associated input/textarea
                const form = button.closest('form');
                if (form) {
                    const textarea = form.querySelector('textarea');
                    const input = form.querySelector('input[type="text"]');
                    const text = textarea ? textarea.value : input ? input.value : '';
                    
                    if (text && text.length > 10) {
                        this.trackPrompt(text, 'button_click');
                    }
                }
            }
        });
    }
    
    /**
     * Track an AI prompt
     */
    async trackPrompt(prompt, model = 'unknown', options = {}) {
        try {
            const trackingData = {
                prompt: prompt.substring(0, 1000), // Limit length
                model: model,
                tokens: options.tokens || this.estimateTokens(prompt),
                energy: options.energy || null,
                co2: options.co2 || null,
                userId: this.config.userId,
                timestamp: new Date().toISOString(),
                ...options
            };
            
            this.log('Tracking prompt', trackingData);
            
            const response = await fetch(`${this.config.serverUrl}/api/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
                },
                body: JSON.stringify(trackingData)
            });
            
            if (response.ok) {
                const result = await response.json();
                this.stats = result.stats;
                
                if (this.callbacks.onPromptTracked) {
                    this.callbacks.onPromptTracked(trackingData, result);
                }
                
                this.log('Prompt tracked successfully', result);
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            this.log('Error tracking prompt', error);
            
            if (this.callbacks.onError) {
                this.callbacks.onError(error);
            }
        }
    }
    
    /**
     * Estimate token count for a prompt
     */
    estimateTokens(text) {
        // Rough estimation: 1 token ≈ 4 characters
        return Math.ceil(text.length / 4);
    }
    
    /**
     * Load global statistics
     */
    async loadStats() {
        try {
            const response = await fetch(`${this.config.serverUrl}/api/stats`);
            
            if (response.ok) {
                const stats = await response.json();
                this.stats = stats;
                
                if (this.callbacks.onStatsUpdate) {
                    this.callbacks.onStatsUpdate(stats);
                }
                
                this.log('Stats updated', stats);
            }
        } catch (error) {
            this.log('Error loading stats', error);
            
            if (this.callbacks.onError) {
                this.callbacks.onError(error);
            }
        }
    }
    
    /**
     * Get current statistics
     */
    getStats() {
        return { ...this.stats };
    }
    
    /**
     * Get user status
     */
    async getUserStatus() {
        try {
            const response = await fetch(`${this.config.serverUrl}/api/user/${this.config.userId}`);
            
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            this.log('Error loading user status', error);
            throw error;
        }
    }
    
    /**
     * Generate AI response with tracking
     */
    async generateAI(prompt, model = 'openai/gpt-3.5-turbo') {
        try {
            const response = await fetch(`${this.config.serverUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
                },
                body: JSON.stringify({
                    prompt: prompt,
                    model: model,
                    userId: this.config.userId
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                this.log('AI response generated', result);
                return result;
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            this.log('Error generating AI response', error);
            throw error;
        }
    }
    
    /**
     * Create Stripe checkout session
     */
    async createCheckoutSession(type, priceId) {
        try {
            const response = await fetch(`${this.config.serverUrl}/api/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
                },
                body: JSON.stringify({
                    priceId: priceId,
                    userId: this.config.userId,
                    type: type
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                this.log('Checkout session created', result);
                return result;
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            this.log('Error creating checkout session', error);
            throw error;
        }
    }
    
    /**
     * Set callback functions
     */
    onStatsUpdate(callback) {
        this.callbacks.onStatsUpdate = callback;
    }
    
    onError(callback) {
        this.callbacks.onError = callback;
    }
    
    onPromptTracked(callback) {
        this.callbacks.onPromptTracked = callback;
    }
    
    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.log('Configuration updated', this.config);
    }
    
    /**
     * Get configuration
     */
    getConfig() {
        return { ...this.config };
    }
    
    /**
     * Reset statistics
     */
    resetStats() {
        this.stats = {
            totalPrompts: 0,
            totalEnergy: 0,
            totalCO2: 0,
            lastUpdated: null
        };
    }
    
    /**
     * Enable/disable auto tracking
     */
    setAutoTrack(enabled) {
        this.config.autoTrack = enabled;
        this.log(`Auto tracking ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    /**
     * Get SDK version
     */
    getVersion() {
        return '1.0.0';
    }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SAPSDK;
} else if (typeof define === 'function' && define.amd) {
    define([], function() {
        return SAPSDK;
    });
} else {
    window.SAPSDK = SAPSDK;
}

// Auto-initialize if config is provided globally
if (typeof window !== 'undefined' && window.SAP_CONFIG) {
    window.sap = new SAPSDK(window.SAP_CONFIG);
}
