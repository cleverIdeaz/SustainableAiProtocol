/**
 * SAP Embeddable Widget
 * Version: 1.0.0
 * 
 * This widget automatically attaches to AI prompt boxes and tracks
 * environmental impact in real-time.
 */

(function() {
    'use strict';
    
    // Configuration
    const SAP_CONFIG = {
        serverUrl: 'https://your-sap-domain.com',
        localUrl: 'http://localhost:3001',
        version: '1.0.0',
        debug: false
    };
    
    // Global state
    let sapWidget = null;
    let sapStats = {
        totalPrompts: 0,
        totalEnergy: 0,
        totalCO2: 0,
        lastUpdated: null
    };
    
    let userId = 'user_' + Math.random().toString(36).substr(2, 9);
    let isTracking = false;
    
    // Utility functions
    function log(message, data = null) {
        if (SAP_CONFIG.debug) {
            console.log(`[SAP Widget] ${message}`, data || '');
        }
    }
    
    function getServerUrl() {
        return window.location.hostname === 'localhost' ? SAP_CONFIG.localUrl : SAP_CONFIG.serverUrl;
    }
    
    // Create widget HTML
    function createWidgetHTML() {
        return `
            <div id="sap-widget" style="
                position: fixed;
                top: 20px;
                right: 20px;
                width: 300px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 15px;
                padding: 20px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                line-height: 1.4;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.2);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div style="font-weight: bold; font-size: 16px;">🌍 SAP</div>
                    <button id="sap-close" style="
                        background: none;
                        border: none;
                        color: white;
                        font-size: 18px;
                        cursor: pointer;
                        padding: 0;
                        width: 20px;
                        height: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">×</button>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>📊 Prompts:</span>
                        <span id="sap-prompts">0</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>⚡ Energy:</span>
                        <span id="sap-energy">0 kWh</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>🌱 CO₂:</span>
                        <span id="sap-co2">0 kg</span>
                    </div>
                </div>
                
                <div style="text-align: center;">
                    <button id="sap-track" style="
                        background: rgba(255,255,255,0.2);
                        border: 1px solid rgba(255,255,255,0.3);
                        color: white;
                        padding: 8px 16px;
                        border-radius: 20px;
                        cursor: pointer;
                        font-size: 12px;
                        transition: all 0.3s ease;
                    ">Start Tracking</button>
                </div>
                
                <div id="sap-status" style="
                    margin-top: 10px;
                    text-align: center;
                    font-size: 12px;
                    opacity: 0.8;
                ">Ready to track environmental impact</div>
            </div>
        `;
    }
    
    // Create widget
    function createWidget() {
        if (sapWidget) return;
        
        const widgetHTML = createWidgetHTML();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = widgetHTML;
        sapWidget = tempDiv.firstElementChild;
        
        document.body.appendChild(sapWidget);
        
        // Add event listeners
        document.getElementById('sap-close').addEventListener('click', hideWidget);
        document.getElementById('sap-track').addEventListener('click', toggleTracking);
        
        log('Widget created');
    }
    
    // Show widget
    function showWidget() {
        if (!sapWidget) {
            createWidget();
        }
        sapWidget.style.display = 'block';
        log('Widget shown');
    }
    
    // Hide widget
    function hideWidget() {
        if (sapWidget) {
            sapWidget.style.display = 'none';
            log('Widget hidden');
        }
    }
    
    // Toggle tracking
    function toggleTracking() {
        isTracking = !isTracking;
        const button = document.getElementById('sap-track');
        const status = document.getElementById('sap-status');
        
        if (isTracking) {
            button.textContent = 'Stop Tracking';
            button.style.background = 'rgba(220, 53, 69, 0.3)';
            status.textContent = 'Tracking environmental impact...';
            startTracking();
        } else {
            button.textContent = 'Start Tracking';
            button.style.background = 'rgba(255,255,255,0.2)';
            status.textContent = 'Ready to track environmental impact';
            stopTracking();
        }
        
        log(`Tracking ${isTracking ? 'started' : 'stopped'}`);
    }
    
    // Start tracking
    function startTracking() {
        // Track form submissions
        document.addEventListener('submit', handleFormSubmit, true);
        
        // Track button clicks
        document.addEventListener('click', handleButtonClick, true);
        
        // Track input changes
        document.addEventListener('input', handleInputChange, true);
        
        log('Tracking started');
    }
    
    // Stop tracking
    function stopTracking() {
        document.removeEventListener('submit', handleFormSubmit, true);
        document.removeEventListener('click', handleButtonClick, true);
        document.removeEventListener('input', handleInputChange, true);
        
        log('Tracking stopped');
    }
    
    // Handle form submission
    function handleFormSubmit(event) {
        const form = event.target;
        const textarea = form.querySelector('textarea');
        const input = form.querySelector('input[type="text"]');
        
        if (textarea || input) {
            const text = textarea ? textarea.value : input.value;
            if (text && text.length > 10) {
                trackPrompt(text, 'form_submission');
            }
        }
    }
    
    // Handle button click
    function handleButtonClick(event) {
        const button = event.target;
        if (button.tagName === 'BUTTON' && 
            (button.textContent.toLowerCase().includes('generate') ||
             button.textContent.toLowerCase().includes('ask') ||
             button.textContent.toLowerCase().includes('send') ||
             button.textContent.toLowerCase().includes('submit'))) {
            
            // Find associated input/textarea
            const form = button.closest('form');
            if (form) {
                const textarea = form.querySelector('textarea');
                const input = form.querySelector('input[type="text"]');
                const text = textarea ? textarea.value : input ? input.value : '';
                
                if (text && text.length > 10) {
                    trackPrompt(text, 'button_click');
                }
            }
        }
    }
    
    // Handle input change
    function handleInputChange(event) {
        const input = event.target;
        if ((input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') && 
            input.value && input.value.length > 50) {
            
            // Debounce tracking
            clearTimeout(input.sapTimeout);
            input.sapTimeout = setTimeout(() => {
                trackPrompt(input.value, 'input_change');
            }, 2000);
        }
    }
    
    // Track prompt
    async function trackPrompt(prompt, source) {
        try {
            const response = await fetch(`${getServerUrl()}/api/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: prompt.substring(0, 1000),
                    model: 'unknown',
                    tokens: Math.ceil(prompt.length / 4),
                    userId: userId,
                    source: source
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                updateStats(result.stats);
                log('Prompt tracked', { prompt: prompt.substring(0, 50) + '...', source });
            }
        } catch (error) {
            log('Error tracking prompt', error);
        }
    }
    
    // Update statistics
    function updateStats(stats) {
        sapStats = stats;
        
        if (sapWidget) {
            document.getElementById('sap-prompts').textContent = stats.totalPrompts.toLocaleString();
            document.getElementById('sap-energy').textContent = stats.totalEnergy.toFixed(3) + ' kWh';
            document.getElementById('sap-co2').textContent = stats.totalCO2.toFixed(3) + ' kg';
        }
        
        log('Stats updated', stats);
    }
    
    // Load initial stats
    async function loadStats() {
        try {
            const response = await fetch(`${getServerUrl()}/api/stats`);
            if (response.ok) {
                const stats = await response.json();
                updateStats(stats);
            }
        } catch (error) {
            log('Error loading stats', error);
        }
    }
    
    // Auto-attach to AI interfaces
    function autoAttach() {
        // Look for common AI interface patterns
        const aiSelectors = [
            'textarea[placeholder*="prompt"]',
            'textarea[placeholder*="message"]',
            'textarea[placeholder*="ask"]',
            'input[placeholder*="prompt"]',
            'input[placeholder*="message"]',
            'input[placeholder*="ask"]',
            '.chat-input textarea',
            '.prompt-input textarea',
            '.ai-input textarea'
        ];
        
        const aiElements = document.querySelectorAll(aiSelectors.join(', '));
        
        if (aiElements.length > 0) {
            log(`Found ${aiElements.length} AI interface elements`);
            
            // Add SAP button to each element
            aiElements.forEach((element, index) => {
                if (!element.sapAttached) {
                    addSAPButton(element, index);
                    element.sapAttached = true;
                }
            });
        }
    }
    
    // Add SAP button to element
    function addSAPButton(element, index) {
        const container = element.closest('form') || element.parentElement;
        if (!container || container.querySelector('.sap-button')) return;
        
        const sapButton = document.createElement('button');
        sapButton.className = 'sap-button';
        sapButton.innerHTML = '🌍 SAP';
        sapButton.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            cursor: pointer;
            margin-left: 8px;
            transition: all 0.3s ease;
        `;
        
        sapButton.addEventListener('click', (e) => {
            e.preventDefault();
            showWidget();
        });
        
        sapButton.addEventListener('mouseenter', () => {
            sapButton.style.transform = 'scale(1.05)';
        });
        
        sapButton.addEventListener('mouseleave', () => {
            sapButton.style.transform = 'scale(1)';
        });
        
        // Insert button after the element
        element.parentNode.insertBefore(sapButton, element.nextSibling);
        
        log(`SAP button added to element ${index}`);
    }
    
    // Initialize widget
    function init() {
        log('SAP Widget initializing...');
        
        // Load initial stats
        loadStats();
        
        // Auto-attach to AI interfaces
        autoAttach();
        
        // Set up periodic stats updates
        setInterval(loadStats, 10000);
        
        // Set up periodic auto-attach
        setInterval(autoAttach, 5000);
        
        // Show widget on page load
        setTimeout(showWidget, 2000);
        
        log('SAP Widget initialized');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Expose global API
    window.SAPWidget = {
        show: showWidget,
        hide: hideWidget,
        track: trackPrompt,
        stats: () => sapStats,
        version: SAP_CONFIG.version
    };
    
})();
