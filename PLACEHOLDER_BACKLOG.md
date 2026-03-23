# 📋 Placeholder Backlog - What Needs to Become Real

**Date**: November 5, 2025  
**Status**: Honest list of what needs to be created/verified

---

## 🔴 Critical (Must Fix Before Sharing Publicly)

### **1. Discord Server**
- **Status**: ❌ Doesn't exist
- **Current**: All docs reference `https://discord.gg/6CSzBmMkjX` (FAKE)
- **Action Needed**:
  - Option A: Create SAP Discord server
  - Option B: Join MCP Discord and create channel
  - Option C: Remove all Discord references until created
- **Priority**: HIGH - All docs reference it

### **2. GitHub Repository**
- **Status**: ❌ Doesn't exist (or not public)
- **Current**: All docs reference `https://github.com/sustainableaiprotocol/sap-protocol` (PLACEHOLDER)
- **Action Needed**:
  - Create public GitHub repository
  - OR mark all GitHub links as `[PLACEHOLDER - Repo not public yet]`
- **Priority**: HIGH - All docs reference it

### **3. Fix All Dates**
- **Status**: ❌ Wrong dates everywhere
- **Current**: "December 2024" in many files
- **Action Needed**: Change to "November 2025"
- **Priority**: HIGH - Already fixed in docs, need to verify all files

### **4. Email Address**
- **Status**: ⚠️ Unverified
- **Current**: `support@sustainableaiprotocol.com` referenced
- **Action Needed**: Verify email exists OR remove references
- **Priority**: MEDIUM - Less critical but needs verification

---

## 🟡 Important (Before Community Submission)

### **5. Test MCP Endpoint**
- **Status**: ⚠️ Code exists, not tested
- **Current**: `/mcp/telemetry` endpoint exists in `sap-server.js`
- **Action Needed**: Test with real MCP client
- **Priority**: HIGH - Need to verify it works

### **6. Test MCP Server**
- **Status**: ⚠️ Code exists, not tested
- **Current**: `sap-mcp-server.js` exists
- **Action Needed**: Test with real MCP client
- **Priority**: HIGH - Need to verify it works

### **7. Replace Environmental Mock Data**
- **Status**: ❌ **MOCK DATA** (hardcoded)
- **Current**: `/api/environmental` returns hardcoded values (not real data)
- **Location**: `sap-server.js` lines 167-180
- **Action Needed**: 
  - Connect to real environmental API OR
  - Clearly mark as "example data" OR
  - Remove endpoint until real data available
- **Priority**: MEDIUM - Need to either connect real data or mark as mock

### **8. Test Example Integrations**
- **Status**: ⚠️ Code exists, not tested
- **Current**: Examples exist in `/examples` folder
- **Action Needed**: Test all examples actually work
- **Priority**: MEDIUM - Need to verify examples work

---

## 🟢 Nice to Have (For Credibility)

### **9. GitHub Discussions**
- **Status**: ❌ Can't exist without repo
- **Action Needed**: Create when repo is public
- **Priority**: LOW - Depends on #2

### **10. GitHub Issues**
- **Status**: ❌ Can't exist without repo
- **Action Needed**: Create when repo is public
- **Priority**: LOW - Depends on #2

### **11. Documentation Links**
- **Status**: ⚠️ Some links are placeholders
- **Action Needed**: Update when real links exist
- **Priority**: LOW - Depends on #2

### **12. Community Presence**
- **Status**: ❌ Doesn't exist
- **Action Needed**: Create Discord OR join MCP Discord
- **Priority**: LOW - Depends on #1

---

## ✅ What's Actually Working

### **Real & Working**
- ✅ Global ticker updates per prompt
- ✅ Backend accepts telemetry (`/api/track`, `/api/sap/logEvent`)
- ✅ Backend returns stats (`/api/stats`)
- ✅ MCP endpoint code exists (`/mcp/telemetry`)
- ✅ Frontend displays ticker (`index.html`)
- ✅ Live demo site (`sustainableaiprotocol.com`)

### **Code Exists But Not Tested**
- ⚠️ MCP server (`sap-mcp-server.js`)
- ⚠️ Example integrations (`/examples` folder)
- ⚠️ MCP endpoint (`/mcp/telemetry`)

---

## 📝 Action Plan

### **Immediate (Today)**
1. ✅ Fix all dates (December 2024 → November 2025) - DONE
2. ✅ Mark all placeholder links - DONE
3. ⚠️ Verify what's actually working vs what's code-only

### **This Week**
1. Create Discord server OR remove all Discord references
2. Create GitHub repo OR mark all GitHub references as placeholders
3. Test MCP endpoint with real MCP client
4. Verify environmental data source

### **Before Community Submission**
1. Test all MCP functionality
2. Test all example integrations
3. Verify all links work
4. Remove all placeholders OR clearly mark them

---

## 🎯 Success Criteria

### **Before Sharing Publicly**
- [ ] All dates fixed
- [ ] All placeholder links marked OR replaced with real links
- [ ] Discord created OR all references removed
- [ ] GitHub repo created OR all references marked as placeholders

### **Before Community Submission**
- [ ] MCP endpoint tested and working
- [ ] MCP server tested and working
- [ ] All example integrations tested
- [ ] Environmental data source verified
- [ ] All placeholders replaced with real links

---

**Status**: This backlog tracks what needs to become real. All placeholders are now clearly marked in documentation.

