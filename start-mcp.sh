#!/bin/bash

echo "🚀 Starting SAP Protocol MCP Server..."
echo "📍 Location: $(pwd)"
echo ""

# Check if MCP SDK is installed
if ! npm list @modelcontextprotocol/sdk > /dev/null 2>&1; then
    echo "📦 Installing MCP SDK..."
    npm install @modelcontextprotocol/sdk
fi

# Start the MCP server
echo "🔧 Starting MCP Server..."
node mcp-server.js
