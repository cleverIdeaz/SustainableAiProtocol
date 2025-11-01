/**
 * SAP Dashboard Embed Script
 * One-line embed that gets live data and provides loggable experience
 * Usage: <script src="https://sustainableaiprotocol.com/sap-dashboard-embed.js"></script>
 */
(function() {
    'use strict';

    // Configuration
    const DASHBOARD_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
        ? 'http://localhost:3001/dashboard.html' 
        : 'https://sustainableaiprotocol.com/dashboard.html';
    const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
        ? 'http://localhost:3001' 
        : 'https://sustainableaiprotocol.com';
    
    // Create iframe container
    const container = document.createElement('div');
    container.id = 'sap-dashboard-container';
    container.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:99999;display:none;align-items:center;justify-content:center;';
    
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = DASHBOARD_URL;
    iframe.style.cssText = 'width:90%;max-width:800px;height:80vh;max-height:800px;border:none;border-radius:12px;background:#fff;box-shadow:0 20px 60px rgba(0,0,0,0.3);';
    iframe.setAttribute('allowtransparency', 'true');
    
    container.appendChild(iframe);
    document.body.appendChild(container);

    // Open dashboard function
    window.openSAPDashboard = function() {
        container.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        // Refresh iframe to get latest data
        iframe.src = iframe.src;
    };

    // Close dashboard function
    window.closeSAPDashboard = function() {
        container.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    // Close on overlay click
    container.addEventListener('click', function(e) {
        if (e.target === container) {
            window.closeSAPDashboard();
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && container.style.display === 'flex') {
            window.closeSAPDashboard();
        }
    });

    // Expose global API
    window.SAP = window.SAP || {};
    window.SAP.openDashboard = window.openSAPDashboard;
    window.SAP.closeDashboard = window.closeSAPDashboard;

    console.log('🌍 SAP Dashboard Embed loaded! Use SAP.openDashboard() or openSAPDashboard() to open the dashboard.');
})();

