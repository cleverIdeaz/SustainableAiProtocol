# 🌍 Sustainable AI Protocol (SAP)

**The Missing Button from Every AI Chat Interface**

> "One small button, enormous change. The Sustainable AI Protocol (SAP) brings transparency and accountability to every AI interaction."

## 🎯 The Vision

SAP is building the **environmental operating system for AI** - starting with the missing button that should be in every AI chat interface.

### **Phase 1: The Missing Button** ✅
- Make invisible AI energy consumption visible
- Build universal protocol for AI sustainability  
- Create accountability for every AI interaction
- **Status**: Live and working

### **Phase 2: Environmental Force** 🚀
- Use AI to solve AI's own energy problems
- Direct funding to climate projects
- Expand beyond AI to environmental impact
- **Status**: In development

### **Phase 3: Global Movement** 🌍
- Pervasive environmental consciousness
- Real-world environmental change
- The environmental operating system for the AI age
- **Status**: Future vision

## 🌱 The Foundation

We're building the groundwork for a future where:
- **Every AI interaction** is environmentally conscious
- **AI optimizes** its own energy consumption
- **Users directly fund** climate projects
- **Environmental impact** is visible and actionable

## 🚀 Core Features

### **🌍 Universal SAP Button**
- Embeddable in any AI interface with one line of code
- Single tap = counts interaction (accountability tracking)
- Long press = opens environmental dashboard
- Works offline (localStorage fallback)
- Touch-optimized for mobile

### **📊 Environmental Dashboard**
- Real-time global AI impact tracking
- Personal vs global environmental comparison
- Energy, carbon, and water usage monitoring
- Direct climate project funding
- Environmental correlations (ozone, greenhouse gas)

### **🔧 Developer SDK**
- One-line integration: `<script src="https://sustainableaiprotocol.com/embed.js"></script>`
- Automatic AI interface detection
- Real-time telemetry tracking
- Offline-first architecture
- Rate limiting and abuse prevention

## 🎯 The Problem We're Solving

### **The AI Power Paradox**
- AI energy consumption is invisible to users
- No standard way to measure or report AI environmental impact
- Every prompt consumes measurable energy - currently hidden
- No accountability for AI's carbon footprint
- AI could solve its own energy problems - but doesn't

### **The Environmental Opportunity**
- AI is becoming pervasive - so should environmental consciousness
- Every AI interaction could be a force for environmental good
- We can use AI's power to solve environmental problems
- Direct funding to climate projects through AI usage
- Create the environmental operating system for the AI age

## 🏗️ Architecture

### **Three Core Components:**

1. **SAP Button** - Universal widget for tracking
2. **Environmental Dashboard** - Impact visualization and action center
3. **Global Network** - Real-time environmental data

### **Technical Stack:**
- **Frontend**: Vanilla JS, HTML5, CSS3
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Deployment**: Vercel
- **AI Integration**: OpenRouter API

## 🛠️ Quick Start

### **For Users:**
Visit [sustainableaiprotocol.com](https://sustainableaiprotocol.com) and click the SAP button to see your environmental impact.

### **For Developers:**
```html
<!-- Add to any website -->
<script src="https://sustainableaiprotocol.com/embed.js"></script>
```

The widget automatically:
- Detects AI prompt boxes
- Tracks environmental impact
- Shows real-time statistics
- Provides dashboard access

### **For Integration:**
```javascript
// Initialize SAP SDK
const sap = new SAPSDK({
    serverUrl: 'https://sustainableaiprotocol.com',
    userId: 'user_123',
    autoTrack: true
});

// Track a prompt manually
await sap.trackPrompt('Hello, AI!', 'gpt-3.5-turbo');

// Get current statistics
const stats = sap.getStats();
console.log(`Total prompts: ${stats.totalPrompts}`);
```

## 📊 Live Demo Features

- **🌍 Global Impact**: See real-time AI energy consumption worldwide
- **👤 Personal Tracking**: Track your own AI usage and environmental impact
- **📈 Environmental Dashboard**: Detailed breakdowns, correlations, and analytics
- **🌱 Carbon Context**: Understand your environmental impact in relatable terms
- **💰 Climate Action**: Direct funding to climate projects
- **⚡ AI Optimization**: See how AI can solve its own energy problems

## 🌱 Mission

Make every AI interaction measurable, transparent, and accountable. Build a global network of AI energy tracking that creates the standard for sustainable AI development and becomes a force for environmental good.

## 🚀 Roadmap

### **Phase 1 - The Missing Button** ✅
- Universal SAP button
- Global environmental ticker
- Dashboard modal
- Developer SDK
- Basic telemetry
- **Status**: Live at sustainableaiprotocol.com

### **Phase 2 - Environmental Force** 🚀
- Verified telemetry (server-to-server)
- Environmental correlations (ozone, greenhouse gas)
- Direct climate project funding
- AI efficiency optimization
- Model-specific energy profiles
- Region-based carbon intensity
- **Status**: In development

### **Phase 3 - Global Movement** 🌍
- SAP Foundation (nonprofit)
- Open JSON Schema registry
- Certification program
- Enterprise features
- Global governance
- Environmental force multiplier
- **Status**: Future vision

## 💰 Revenue Model

### **Beta Access (50% OFF)**
- **$2.50 Lifetime Access** - Early supporter pricing
- Global AI usage counter
- Personal environmental tracking
- Beta development access
- Contribute to SAP development

### **Future Tiers**
- **Supporter**: $10/month - Offset 10kg CO₂/month
- **Advocate**: $50/month - API access, offset 100kg CO₂/month  
- **Pioneer**: $250/month - Founding member, offset 1000kg CO₂/month

## 🔒 Security & Privacy

- **No prompt content stored** - Only metadata and metrics
- **Anonymous tracking** - Works without login
- **Rate limiting** - Prevents abuse
- **HMAC validation** - Server-to-server verification
- **GDPR compliant** - Privacy-first design

## 📁 Project Structure

```
SustainableAiProtocol/
├── index.html              # Main SAP demo page
├── sap-server.js          # Node.js server with APIs
├── sap-embed.js           # Embeddable widget script
├── sap-sdk.js            # Core SAP SDK library
├── sap-schema.sql         # Database schema
├── package.json           # Dependencies
├── assets/               # Images, logos, icons
└── README.md            # This file
```

## 🛠️ Development Setup

### **1. Install Dependencies**
```bash
npm install
```

### **2. Environment Variables**
```bash
cp env.example .env
```

Required variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anon key
- `SAP_STRIPE_SECRET_KEY` - Your Stripe secret key
- `SAP_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `SAP_OPENROUTER_API_KEY` - Your OpenRouter API key

### **3. Database Setup**
1. Create Supabase project
2. Run SQL schema from `sap-schema.sql`
3. Update environment variables

### **4. Start Development**
```bash
npm start
```

Visit `http://localhost:3001` to see the SAP interface.

## 🔧 API Endpoints

### **Core Endpoints**
- `GET /` - Main SAP demo page
- `GET /api/stats` - Global statistics
- `POST /api/track` - Track AI prompt
- `POST /api/generate` - Generate AI response
- `GET /api/user/:userId` - User status

### **Payment Endpoints**
- `POST /api/create-checkout-session` - Create Stripe checkout
- `POST /stripe-webhook` - Stripe webhook handler

### **Widget Endpoints**
- `GET /sap/embed.js` - Embeddable widget script
- `GET /sap/sdk.js` - SAP SDK library

## 📊 Database Schema

### **Key Tables**
- `global_stats` - Global environmental impact statistics
- `events` - Individual interaction tracking
- `user_payments` - User payment records
- `user_profiles` - User account information

### **Automatic Updates**
- Real-time global stats updates
- User profile statistics tracking
- Energy and CO₂ factor calculations
- Atomic increment operations

## 🚀 Deployment

### **Recommended: Vercel**
```bash
# Deploy to Vercel
vercel --prod
```

### **Alternative: Netlify**
```bash
# Build and deploy
npm run build
netlify deploy --prod
```

### **Environment Setup**
1. Set environment variables in hosting platform
2. Configure domain and SSL
3. Set up Stripe webhooks
4. Test all integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For support, please contact:
- Email: support@sustainableaiprotocol.com
- GitHub Issues: [Create an issue](https://github.com/your-org/sap-protocol/issues)

## 🌟 Community

- **Discord**: Join our community
- **Twitter**: Follow for updates
- **Newsletter**: Subscribe for news
- **GitHub**: Star and contribute

---

**🌍 Building a sustainable future for AI | SAP Protocol v1.0**

*"One small button, enormous change."*

**Live at**: [sustainableaiprotocol.com](https://sustainableaiprotocol.com)