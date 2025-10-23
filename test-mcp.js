#!/usr/bin/env node

/**
 * Test script for SAP Protocol MCP Server
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Testing SAP Protocol MCP Server...\n');

// Test the MCP server
const mcpServer = spawn('node', [path.join(__dirname, 'mcp-server.js')], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Send a test request
const testRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list',
  params: {}
};

console.log('📤 Sending test request...');
mcpServer.stdin.write(JSON.stringify(testRequest) + '\n');

mcpServer.stdout.on('data', (data) => {
  console.log('📥 MCP Server Response:');
  console.log(JSON.parse(data.toString()));
});

mcpServer.stderr.on('data', (data) => {
  console.log('🔧 MCP Server Log:', data.toString());
});

mcpServer.on('close', (code) => {
  console.log(`\n✅ MCP Server test completed with code ${code}`);
});

// Clean up after 5 seconds
setTimeout(() => {
  mcpServer.kill();
  console.log('\n🏁 Test completed!');
}, 5000);
