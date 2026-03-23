/**
 * SAP MCP Client Example
 * 
 * This example shows how to integrate SAP telemetry into an MCP-enabled application
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// Initialize MCP client
const client = new Client(
  {
    name: 'sap-example-client',
    version: '1.0.0',
  },
  {
    capabilities: {},
  }
);

const transport = new StdioClientTransport({
  command: 'node',
  args: ['sap-mcp-server.js'],
});

await client.connect(transport);

// Example 1: Track an AI interaction
async function trackInteraction() {
  console.log('📊 Tracking AI interaction...');
  
  const result = await client.callTool({
    name: 'track_interaction',
    arguments: {
      model: 'gpt-4',
      tokens_input: 150,
      tokens_output: 300,
      request_type: 'text',
      prompt: 'Hello, AI!',
      user_id: 'user_123'
    }
  });

  console.log('✅ Interaction tracked:', result);
}

// Example 2: Get environmental context
async function getEnvironmentalContext() {
  console.log('🌍 Fetching environmental context...');
  
  const result = await client.callTool({
    name: 'get_environmental_context',
    arguments: {
      location: 'global'
    }
  });

  console.log('✅ Environmental context:', result);
}

// Example 3: Get sustainability score
async function getSustainabilityScore() {
  console.log('📈 Getting sustainability score...');
  
  const result = await client.callTool({
    name: 'get_sustainability_score',
    arguments: {
      time_period: 'day'
    }
  });

  console.log('✅ Sustainability score:', result);
}

// Example 4: Optimize a prompt
async function optimizePrompt() {
  console.log('⚡ Optimizing prompt...');
  
  const result = await client.callTool({
    name: 'optimize_prompt',
    arguments: {
      prompt: 'Write a long, detailed essay about climate change',
      model: 'gpt-4',
      preferences: 'energy-focused'
    }
  });

  console.log('✅ Optimized prompt:', result);
}

// Run examples
async function main() {
  try {
    await trackInteraction();
    await getEnvironmentalContext();
    await getSustainabilityScore();
    await optimizePrompt();
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

main();

