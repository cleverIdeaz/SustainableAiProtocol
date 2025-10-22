/**
 * SAP Protocol Test Script
 * 
 * This script tests the basic functionality of the SAP Protocol
 * without requiring external services.
 */

const express = require('express');
const path = require('path');

// Create test server
const app = express();
const PORT = 3002;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Mock data for testing
const mockStats = {
    totalPrompts: 1234,
    totalEnergy: 5.678,
    totalCO2: 2.345,
    lastUpdated: new Date().toISOString()
};

// Test routes
app.get('/api/stats', (req, res) => {
    console.log('📊 Stats requested');
    res.json(mockStats);
});

app.post('/api/track', (req, res) => {
    const { prompt, model, tokens, userId } = req.body;
    console.log('📝 Prompt tracked:', {
        prompt: prompt.substring(0, 50) + '...',
        model,
        tokens,
        userId
    });
    
    // Simulate stats update
    mockStats.totalPrompts += 1;
    mockStats.totalEnergy += (tokens * 0.001);
    mockStats.totalCO2 += (tokens * 0.0005);
    mockStats.lastUpdated = new Date().toISOString();
    
    res.json({ success: true, stats: mockStats });
});

app.post('/api/generate', (req, res) => {
    const { prompt, userId } = req.body;
    console.log('🤖 AI generation requested:', prompt.substring(0, 50) + '...');
    
    // Simulate AI response
    const responses = [
        "I understand you're asking about sustainability. Let me help you with that.",
        "That's an interesting question about environmental impact. Here's what I think...",
        "I can help you understand the carbon footprint of AI applications.",
        "Let me provide you with some insights about sustainable AI practices.",
        "I'm here to help you learn more about environmental responsibility in technology."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    res.json({
        response: randomResponse,
        usage: {
            prompt_tokens: Math.ceil(prompt.length / 4),
            completion_tokens: Math.ceil(randomResponse.length / 4),
            total_tokens: Math.ceil((prompt.length + randomResponse.length) / 4)
        }
    });
});

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params;
    console.log('👤 User status requested:', userId);
    
    res.json({
        hasStamp: Math.random() > 0.5,
        hasMembership: Math.random() > 0.7,
        credits: Math.floor(Math.random() * 100),
        payments: []
    });
});

// Serve test pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'embed-demo.html'));
});

app.get('/sap', (req, res) => {
    res.sendFile(path.join(__dirname, 'sap.html'));
});

// Serve SAP files
app.get('/sap/sdk.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'sap-sdk.js'));
});

app.get('/sap/embed.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'sap-embed.js'));
});

// Start test server
app.listen(PORT, () => {
    console.log('🧪 SAP Test Server running on port', PORT);
    console.log('📊 Mock stats:', mockStats);
    console.log('');
    console.log('🌐 Test URLs:');
    console.log(`   Main SAP: http://localhost:${PORT}/sap`);
    console.log(`   Widget Demo: http://localhost:${PORT}/`);
    console.log('');
    console.log('🔧 Test Features:');
    console.log('   - Global ticker updates');
    console.log('   - AI chat interface');
    console.log('   - Widget embedding');
    console.log('   - Mock payment system');
    console.log('');
    console.log('💡 The widget should appear in the top-right corner');
    console.log('   Click "Start Tracking" to begin monitoring');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down test server...');
    process.exit(0);
});
