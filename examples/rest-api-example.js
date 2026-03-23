/**
 * SAP REST API Example
 * 
 * This example shows how to use SAP's REST API endpoints
 * to track AI interactions and fetch telemetry data.
 */

const API_BASE_URL = 'http://localhost:3001';

// Example 1: Track an AI interaction
async function trackInteraction() {
  console.log('📊 Tracking AI interaction...');
  
  const response = await fetch(`${API_BASE_URL}/api/track`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: 'Hello, AI!',
      model: 'gpt-4',
      tokens: 150,
      energy: 0.0004,
      co2: 0.0002,
      userId: 'user_123'
    })
  });

  const result = await response.json();
  console.log('✅ Interaction tracked:', result);
  
  return result;
}

// Example 2: Get global statistics
async function getGlobalStats() {
  console.log('🌍 Fetching global statistics...');
  
  const response = await fetch(`${API_BASE_URL}/api/stats`);
  const stats = await response.json();
  
  console.log('✅ Global stats:', {
    totalPrompts: stats.totalPrompts,
    totalEnergy: `${stats.totalEnergy.toFixed(3)} kWh`,
    totalCO2: `${stats.totalCO2.toFixed(3)} kg`,
    lastUpdated: stats.lastUpdated
  });
  
  return stats;
}

// Example 3: Get MCP-compliant telemetry
async function getMCPTelemetry() {
  console.log('📡 Fetching MCP telemetry...');
  
  const response = await fetch(`${API_BASE_URL}/mcp/telemetry`);
  const telemetry = await response.json();
  
  console.log('✅ MCP telemetry:', telemetry);
  
  return telemetry;
}

// Example 4: Log structured telemetry event
async function logStructuredEvent() {
  console.log('📝 Logging structured telemetry event...');
  
  const response = await fetch(`${API_BASE_URL}/api/sap/logEvent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      tokens_input: 100,
      tokens_output: 200,
      request_type: 'text',
      user_id: 'user_123',
      timestamp: new Date().toISOString(),
      metadata: {
        prompt_length: 50,
        estimated_kwh: 0.0004,
        estimated_gco2: 0.2,
        data_center_region: 'us-east-1'
      }
    })
  });

  const result = await response.json();
  console.log('✅ Event logged:', result);
  
  return result;
}

// Run all examples
async function main() {
  try {
    await trackInteraction();
    await getGlobalStats();
    await getMCPTelemetry();
    await logStructuredEvent();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    trackInteraction,
    getGlobalStats,
    getMCPTelemetry,
    logStructuredEvent
  };
}

// Run if called directly
if (require.main === module) {
  main();
}

