# SAP MCP Add-On Proposal

**Sustainable AI Protocol (SAP) - Model Context Protocol Add-On**

## 📋 Overview

SAP is a free, open-source protocol that tracks AI energy consumption and environmental impact. This proposal outlines how SAP integrates with the Model Context Protocol (MCP) to provide sustainability telemetry to AI applications.

## 🎯 Purpose

**Problem**: AI energy consumption is invisible to users. Every prompt consumes measurable energy, but there's no standard way to track or report it.

**Solution**: SAP provides a universal telemetry layer that makes AI environmental impact visible, trackable, and actionable.

## 🏗️ Architecture

### **Core Components**

1. **SAP Button** - Universal embeddable widget (one line of code)
2. **Telemetry API** - RESTful endpoint for tracking AI interactions
3. **MCP Resource** - `sap://telemetry` resource exposing sustainability metrics
4. **Global Ticker** - Real-time aggregated statistics

### **MCP Integration**

SAP exposes sustainability data as an MCP resource:

- **Resource URI**: `sap://telemetry`
- **Format**: JSON with global stats and per-prompt telemetry
- **Endpoint**: `GET /mcp/telemetry`

### **Data Schema**

```json
{
  "global_stats": {
    "total_prompts": 12345,
    "total_energy_kwh": 12.345,
    "total_co2_kg": 6.172,
    "last_updated": "2025-11-05T12:00:00Z"
  },
  "recent_events": [
    {
      "model_id": "gpt-4",
      "timestamp": "2025-11-05T12:00:00Z",
      "tokens_input": 100,
      "tokens_output": 200,
      "kwh_estimate": 0.0004,
      "co2_grams": 0.2,
      "session_id": "user_123"
    }
  ]
}
```

## 🔧 MCP Tools

SAP provides four MCP tools:

1. **`track_interaction`** - Log AI interaction with sustainability metrics
2. **`get_environmental_context`** - Get current environmental data
3. **`optimize_prompt`** - Optimize prompts for efficiency
4. **`get_sustainability_score`** - Get sustainability score for usage patterns

## 📊 Current Status

### ✅ **What's Built**
- Backend API with telemetry logging (`/api/sap/logEvent`)
- Global ticker that updates per prompt
- MCP server prototype (`sap-mcp-server.js`)
- MCP-compliant telemetry endpoint (`/mcp/telemetry`)
- Embeddable widgets (dashboard, button)
- Supabase database integration

### 🚧 **In Development**
- Full MCP schema compliance
- Resource definitions
- Example integrations
- Documentation

## 🚀 Use Cases

### **For AI Applications**
- Track energy consumption per prompt
- Show users their environmental impact
- Integrate sustainability metrics into dashboards

### **For Developers**
- One-line integration: `<script src="sap-dashboard-embed.js"></script>`
- REST API for custom integrations
- MCP resource for protocol-native access

### **For Users**
- See real-time global AI impact
- Track personal AI usage
- Understand environmental cost of AI

## 📝 Technical Details

### **API Endpoints**
- `GET /mcp/telemetry` - MCP-compliant telemetry resource
- `POST /api/track` - Track AI interaction
- `GET /api/stats` - Global statistics
- `POST /api/sap/logEvent` - Structured telemetry logging

### **MCP Manifest**
See `mcp.json` for full tool and resource definitions.

### **Dependencies**
- Node.js/Express
- Supabase (PostgreSQL)
- @modelcontextprotocol/sdk

## 🤝 Integration with MCP

### **How to Use**
1. Install SAP MCP server
2. Configure in MCP client
3. Query `sap://telemetry` resource
4. Use `track_interaction` tool to log AI interactions

### **Example Integration**
```typescript
// Query SAP telemetry resource
const telemetry = await mcpClient.readResource({
  uri: 'sap://telemetry'
});

// Track an interaction
await mcpClient.callTool({
  name: 'track_interaction',
  arguments: {
    model: 'gpt-4',
    tokens_input: 100,
    tokens_output: 200
  }
});
```

## 📈 Roadmap

### **Phase 1** (Current)
- ✅ MCP server prototype
- ✅ Basic telemetry endpoint
- 🚧 MCP schema compliance
- 🚧 Documentation

### **Phase 2** (Next)
- Resource subscriptions
- Verified telemetry (HMAC)
- Model-specific energy profiles
- Region-based carbon intensity

### **Phase 3** (Future)
- Open JSON Schema registry
- Certification program
- Enterprise features
- Global governance

## 🎯 Success Criteria

- MCP-compliant server implementation ✅
- Working demo accessible to MCP community
- Clear documentation and examples
- At least 3 developer integrations

## 📄 License

MIT License - fully open source

## 🔗 Links

- **Live Demo**: https://sustainableaiprotocol.com
- **GitHub**: [PLACEHOLDER - Repository not yet public]
- **Documentation**: https://sustainableaiprotocol.com (live demo)
- **MCP Discord**: [PLACEHOLDER - Discord server not yet created]

## 💬 Questions & Discussion

- **GitHub Discussion**: [PLACEHOLDER - Repo not public yet]
- **MCP Discord**: [PLACEHOLDER - Discord not created yet]
- **Email**: [PLACEHOLDER - Email not verified]

---

**Proposed by**: SAP Foundation  
**Date**: November 5, 2025  
**Status**: Documentation ready - Code exists but needs testing before community submission

