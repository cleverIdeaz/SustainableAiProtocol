/**
 * SAP Button Embed Script
 * Simple embed with rotation animation that hooks to send buttons
 * Usage: <script src="https://sustainableaiprotocol.com/sap-button-embed.js"></script>
 */
(function() {
    'use strict';

    // Configuration
    const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
        ? 'http://localhost:3001' 
        : 'https://sustainableaiprotocol.com';
    
    const DASHBOARD_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
        ? 'http://localhost:3001/dashboard.html' 
        : 'https://sustainableaiprotocol.com/dashboard.html';
    
    const SUPABASE_URL = 'https://fpnpfnahwaztdlxuayyv.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwbnBmbmFod2F6dGRseHVheXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDY2NTcsImV4cCI6MjA3NjEyMjY1N30.Q6mn8RIvXujBXbd10aFkeY7yGHVsAQPEHM5OzoPMsFQ';

    // Initialize Supabase if available
    let supabaseClient = null;
    if (typeof supabase !== 'undefined') {
        const { createClient } = supabase;
        supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    // Personal counter
    function getPersonalCounter() {
        return parseInt(localStorage.getItem('sap_personal_counter') || '0');
    }

    function setPersonalCounter(value) {
        localStorage.setItem('sap_personal_counter', value.toString());
    }

    function formatCounter(value) {
        if (value < 1000) return value.toString();
        if (value < 1000000) return (value / 1000).toFixed(1) + 'K';
        if (value < 1000000000) return (value / 1000000).toFixed(1) + 'M';
        return (value / 1000000000).toFixed(1) + 'B';
    }

    // Inject button styles
    function injectButtonStyles() {
        if (document.getElementById('sap-button-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'sap-button-styles';
        style.textContent = `
            .sap-button-embed {
                background: none;
                border: none;
                cursor: pointer;
                padding: 0;
                position: relative;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 60px;
                height: 60px;
                user-select: none;
                transition: transform 0.2s ease;
            }
            .sap-button-embed:hover {
                transform: scale(1.1);
            }
            .sap-button-embed:active {
                transform: scale(0.95);
            }
            .sap-button-embed.rotating svg {
                animation: sap-rotate 0.6s ease-in-out;
            }
            @keyframes sap-rotate {
                0% { transform: rotate(0deg) scale(1); }
                50% { transform: rotate(180deg) scale(1.1); }
                100% { transform: rotate(360deg) scale(1); }
            }
            .sap-button-embed svg {
                transition: transform 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    // Create and inject button
    function createButton() {
        if (document.getElementById('sap-button-embed')) return;

        injectButtonStyles();

        const button = document.createElement('button');
        button.className = 'sap-button-embed';
        button.id = 'sap-button-embed';
        button.title = 'SAP - Sustainable AI Protocol';
        button.innerHTML = `
            <svg viewBox="0 0 120 120" width="60" height="60">
                <circle cx="60" cy="60" r="55" fill="none" stroke="#00C853" stroke-width="4"/>
                <circle cx="60" cy="60" r="45" fill="rgba(0, 200, 83, 0.1)"/>
                <text x="60" y="70" text-anchor="middle" id="sap-counter-text" style="font-family:Inter,sans-serif;font-size:16px;font-weight:700;fill:#00C853;">${formatCounter(getPersonalCounter())}</text>
            </svg>
        `;

        // Event handlers
        button.addEventListener('mousedown', startLongPress);
        button.addEventListener('mouseup', endLongPress);
        button.addEventListener('mouseleave', endLongPress);
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startLongPress(e);
        });
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            endLongPress(e);
        });

        // Click handler (open dashboard or increment)
        button.addEventListener('click', (e) => {
            e.preventDefault();
            // Open dashboard
            if (typeof openSAPDashboard === 'function') {
                openSAPDashboard();
            } else if (typeof window.SAP !== 'undefined' && window.SAP.openDashboard) {
                window.SAP.openDashboard();
            } else {
                // Fallback: open dashboard in new window
                window.open(DASHBOARD_URL, 'SAP Dashboard', 'width=800,height=800,resizable=yes,scrollbars=yes');
            }
        });

        // Try to inject near common chat input areas
        const chatInput = document.querySelector('input[type="text"], textarea, .chat-input, [role="textbox"]');
        if (chatInput && chatInput.parentElement) {
            const container = chatInput.parentElement;
            if (container.style.position !== 'fixed') {
                container.style.position = 'relative';
            }
            container.insertBefore(button, chatInput.nextSibling);
        } else {
            // Fallback: inject at end of body
            document.body.appendChild(button);
            button.style.cssText += 'position:fixed;bottom:20px;right:20px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.15);';
        }

        updateCounterDisplay();
    }

    // Long press handler
    let longPressTimer = null;
    let pressStartTime = null;

    function startLongPress(e) {
        pressStartTime = Date.now();
        const button = e.target.closest('.sap-button-embed');
        if (button) {
            button._pressStart = pressStartTime;
            longPressTimer = setTimeout(() => {
                // Long press = open dashboard
                if (typeof openSAPDashboard === 'function') {
                    openSAPDashboard();
                } else if (typeof window.SAP !== 'undefined' && window.SAP.openDashboard) {
                    window.SAP.openDashboard();
                }
            }, 500);
        }
    }

    function endLongPress(e) {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
        
        // Short tap = increment counter
        if (pressStartTime) {
            const timeDiff = Date.now() - pressStartTime;
            if (timeDiff < 300 && timeDiff > 50) {
                incrementCounter();
            }
            pressStartTime = null;
        }
    }

    // Track telemetry
    async function trackTelemetry(data = {}) {
        const telemetryPacket = {
            model: data.model || 'unknown',
            tokens_input: data.tokens_input || 0,
            tokens_output: data.tokens_output || 0,
            request_type: data.type || 'text', // text, image, audio, video
            prompt_length: data.prompt?.length || 0,
            char_count: data.char_count || 0,
            user_id: localStorage.getItem('sap_user_id') || 'anonymous',
            timestamp: new Date().toISOString(),
            metadata: {
                estimated_kwh: calculateEnergyEstimate(data),
                estimated_gco2: calculateCO2Estimate(data),
                ...data.metadata
            }
        };

        // Rotate button
        rotateButton();

        // Update counter
        incrementCounter();

        // Try to send to Supabase
        try {
            if (supabaseClient) {
                const { error } = await supabaseClient.rpc('increment_sap_stats', {
                    add_count: 1,
                    add_kwh: telemetryPacket.metadata.estimated_kwh,
                    add_co2: telemetryPacket.metadata.estimated_gco2,
                    event_type: telemetryPacket.request_type
                });
                if (error) {
                    console.log('SAP telemetry error:', error);
                } else {
                    console.log('🌍 SAP telemetry logged:', telemetryPacket);
                }
            } else {
                // Fallback to API
                await fetch(`${API_BASE_URL}/api/sap/logEvent`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(telemetryPacket)
                });
            }
        } catch (error) {
            console.log('SAP telemetry offline, using local storage:', error);
        }
    }

    // Energy estimation
    function calculateEnergyEstimate(data) {
        const ENERGY_PER_TOKEN = {
            'gpt-4': 0.0025 / 1000,
            'gpt-3.5-turbo': 0.001 / 1000,
            'claude-3-opus': 0.002 / 1000,
            'claude-3-sonnet': 0.0015 / 1000,
            'claude-3-haiku': 0.0008 / 1000,
            'gemini-pro': 0.001 / 1000,
            'local-llama': 0.0002 / 1000
        };

        if (data.type === 'image') {
            return 0.05; // 50Wh per image
        }
        if (data.type === 'audio') {
            return 0.02; // 20Wh per audio
        }
        if (data.type === 'video') {
            return 0.1; // 100Wh per video
        }

        // Text: estimate from tokens
        if (data.tokens_input || data.tokens_output) {
            const tokens = (data.tokens_input || 0) + (data.tokens_output || 0);
            const model = data.model || 'gpt-3.5-turbo';
            return tokens * (ENERGY_PER_TOKEN[model] || ENERGY_PER_TOKEN['gpt-3.5-turbo']);
        }

        // Fallback: estimate from char count
        if (data.char_count) {
            const estimatedTokens = data.char_count / 4; // ~4 chars per token
            return estimatedTokens * ENERGY_PER_TOKEN['gpt-3.5-turbo'];
        }

        return 0.0004; // Default 0.4Wh for text prompt
    }

    // CO2 estimation
    function calculateCO2Estimate(data) {
        const energy = calculateEnergyEstimate(data);
        const GLOBAL_AVG_GCO2_PER_KWH = 475; // gCO2/kWh
        return energy * GLOBAL_AVG_GCO2_PER_KWH;
    }

    // Rotate button
    function rotateButton() {
        const button = document.getElementById('sap-button-embed');
        if (button) {
            button.classList.add('rotating');
            setTimeout(() => {
                button.classList.remove('rotating');
            }, 600);
        }
    }

    // Increment counter
    function incrementCounter() {
        const count = getPersonalCounter() + 1;
        setPersonalCounter(count);
        updateCounterDisplay();
    }

    // Update counter display
    function updateCounterDisplay() {
        const counter = getPersonalCounter();
        const counterText = document.getElementById('sap-counter-text');
        if (counterText) {
            counterText.textContent = formatCounter(counter);
        }
    }

    // Auto-hook to send buttons
    function autoHookSendButtons() {
        // Common send button selectors
        const sendButtonSelectors = [
            'button[type="submit"]',
            'button.send',
            'button[aria-label*="Send"]',
            'button[aria-label*="send"]',
            '.send-button',
            '#send-button',
            '[data-send]',
            'button:has(svg[class*="send"])',
            'button:has(svg[class*="arrow"])'
        ];

        sendButtonSelectors.forEach(selector => {
            try {
                const buttons = document.querySelectorAll(selector);
                buttons.forEach(btn => {
                    if (!btn.dataset.sapHooked) {
                        btn.dataset.sapHooked = 'true';
                        btn.addEventListener('click', function() {
                            // Rotate SAP button
                            rotateButton();
                            
                            // Try to extract prompt data
                            const input = btn.closest('form')?.querySelector('input[type="text"], input[type="search"], textarea') 
                                       || document.querySelector('input[type="text"], textarea');
                            
                            if (input) {
                                const prompt = input.value || '';
                                trackTelemetry({
                                    type: 'text',
                                    char_count: prompt.length,
                                    prompt: prompt
                                });
                            } else {
                                trackTelemetry({ type: 'text' });
                            }
                        });
                    }
                });
            } catch (e) {
                // Ignore selector errors
            }
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Create and inject button
        createButton();

        // Update counter display
        updateCounterDisplay();

        // Auto-hook send buttons
        setTimeout(autoHookSendButtons, 1000);
        // Re-hook periodically (for dynamic content)
        setInterval(autoHookSendButtons, 3000);

        // Update counter periodically
        setInterval(updateCounterDisplay, 5000);

        // Re-create button if removed (for dynamic content)
        setInterval(() => {
            if (!document.getElementById('sap-button-embed')) {
                createButton();
            }
        }, 2000);
    }

    // Expose global API
    window.SAP = window.SAP || {};
    window.SAP.trackTelemetry = trackTelemetry;
    window.SAP.rotateButton = rotateButton;
    window.SAP.incrementCounter = incrementCounter;
    window.SAP.getCounter = getPersonalCounter;
    window.SAP.autoHookSendButtons = autoHookSendButtons;

    console.log('🔘 SAP Button Embed loaded! Button will rotate on prompt sends. Use SAP.trackTelemetry(data) for custom telemetry.');
})();

