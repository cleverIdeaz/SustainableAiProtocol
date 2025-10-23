# 🌍 Sustainable AI Protocol (SAP)

**The Missing Button from Every AI Chat Interface**

> "One small button. Enormous change. The Sustainable AI Protocol (SAP) brings transparency and accountability to every AI interaction."

## 🎯 Vision

SAP is the **OAuth for AI sustainability** - a universal protocol that makes invisible AI energy consumption visible and actionable. Think of it as the missing button that should be in every AI chat interface.

### The Problem
- AI energy consumption is invisible to users
- No standard way to measure or report AI environmental impact
- Every prompt consumes measurable energy - currently hidden
- No accountability for AI's carbon footprint

### The Solution
- **One small button** that appears in every AI interface
- **Real-time tracking** of energy and carbon impact
- **Global network** of AI sustainability data
- **Developer-friendly** integration with one line of code

## 🚀 Core Features

### 🌍 **Global Ticker**
- Real-time AI energy consumption worldwide
- Live updates every 10 seconds
- Shows total prompts, energy (kWh), and CO₂ emissions
- Format: "15 interactions tracked ⚡ ~0.096 kWh estimated"

### 📊 **Universal SAP Button**
- Embeddable in any AI interface with one line of code
- Single tap = counts interaction (accountability tracking)
- Double tap = opens dashboard
- Spin animation on prompt submission
- Works offline (localStorage fallback)

### 📈 **Dashboard Modal**
- Personal vs global impact comparison
- Breakdown by interaction type (text, image, audio, video)
- 7-day usage trends
- Recent activity feed
- Carbon offset options
- Methodology transparency

### 🔧 **Developer SDK**
- One-line integration: `<script src="https://sap-protocol.com/embed.js"></script>`
- Automatic AI interface detection
- Real-time telemetry tracking
- Offline-first architecture
- Rate limiting and abuse prevention

## 🏗️ Architecture

### **Three Core Components:**

1. **SAP Button** - Universal widget for tracking
2. **Global Ticker** - Real-time network stats  
3. **Dashboard** - Impact visualization modal

### **Technical Stack:**
- **Frontend**: Vanilla JS, HTML5, CSS3
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Deployment**: Vercel
- **AI Integration**: OpenRouter API

## 🛠️ Quick Start

### **For Users:**
Visit the live demo and click the SAP button to see your impact.

### **For Developers:**
```html
<!-- Add to any website -->
<script src="https://sap-protocol.com/embed.js"></script>
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
    serverUrl: 'https://sap-protocol.com',
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
- **👤 Personal Tracking**: Track your own AI usage and impact
- **📈 Dashboard**: Detailed breakdowns, charts, and analytics
- **🌱 Carbon Context**: Understand your environmental impact
- **💰 Carbon Offsets**: Take direct action on your impact

## 🌱 Mission

Make every AI interaction measurable, transparent, and accountable. Build a global network of AI energy tracking that creates the standard for sustainable AI development.

## 🚀 Roadmap

### **Phase 1 - Public Demo & Awareness** ✅
- Universal SAP button
- Global ticker
- Dashboard modal
- Developer SDK
- Basic telemetry

### **Phase 2 - Early Partnerships** 🚧
- Verified telemetry (server-to-server)
- Green Dial controls
- Carbon offset marketplace
- Model-specific energy profiles
- Region-based carbon intensity

### **Phase 3 - Global Standardization** 🔮
- SAP Foundation (nonprofit)
- Open JSON Schema registry
- Certification program
- Enterprise features
- Global governance

## 💰 Revenue Model

### **Beta Access (50% OFF)**
- **$2.50 Lifetime Access** - Early supporter pricing
- Global AI usage counter
- Personal cache counter
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
- Email: support@sap-protocol.com
- GitHub Issues: [Create an issue](https://github.com/your-org/sap-protocol/issues)

## 🌟 Community

- **Discord**: Join our community
- **Twitter**: Follow for updates
- **Newsletter**: Subscribe for news
- **GitHub**: Star and contribute

---

**🌍 Building a sustainable future for AI | SAP Protocol v1.0**

*"One small button. Enormous change."*