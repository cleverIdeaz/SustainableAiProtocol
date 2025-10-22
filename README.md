# 🌍 Sustainable AI Protocol (SAP)

A comprehensive system for tracking and reducing the environmental impact of AI applications in real-time.

## 🚀 Features

- **Real-time Global Ticker**: Live tracking of AI prompts, energy usage, and CO₂ emissions
- **Embeddable Widget**: One-line integration for any AI application
- **Payment System**: $1 SAP Stamps, $1 Core Memberships, $5 Credits
- **AI Demo Interface**: Multimodal chat with environmental impact tracking
- **Stripe Integration**: Secure payment processing
- **Supabase Database**: Real-time data synchronization

## 📁 Project Structure

```
SustainableAiProtocol/
├── package.json          # Dependencies and scripts
├── sap-server.js         # Main server with all APIs
├── sap.html              # Main SAP demo page
├── sap-sdk.js           # Core SAP SDK library
├── sap-embed.js         # Embeddable widget script
├── sap-schema.sql       # Database schema
├── env.example          # Environment variables template
└── README.md            # This file
```

## 🛠️ Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `env.example` to `.env` and fill in your credentials:

```bash
cp env.example .env
```

Required environment variables:
- `SAP_STRIPE_SECRET_KEY`: Your Stripe secret key
- `SAP_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `SAP_STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `SAP_OPENROUTER_API_KEY`: Your OpenRouter API key

### 3. Set Up Database

1. Create a new Supabase project
2. Run the SQL schema from `sap-schema.sql`
3. Update your environment variables with Supabase credentials

### 4. Set Up Stripe

1. Create products in Stripe:
   - SAP Stamp: $1.00 one-time
   - Core Membership: $1.00 one-time
   - Credits: $5.00 one-time
2. Set up webhook endpoint: `https://your-domain.com/stripe-webhook`
3. Copy price IDs to environment variables

### 5. Start the Server

```bash
npm start
```

Visit `http://localhost:3001` to see the SAP interface.

## 🔧 API Endpoints

### Core Endpoints

- `GET /` - Main SAP demo page
- `GET /sap/sdk.js` - SAP SDK library
- `GET /sap/embed.js` - Embeddable widget
- `GET /api/stats` - Global statistics
- `POST /api/track` - Track AI prompt
- `POST /api/generate` - Generate AI response
- `GET /api/user/:userId` - User status

### Payment Endpoints

- `POST /api/create-checkout-session` - Create Stripe checkout
- `POST /stripe-webhook` - Stripe webhook handler

## 🌐 Embedding the Widget

Add this single line to any website:

```html
<script src="https://your-sap-domain.com/sap/embed.js"></script>
```

The widget will automatically:
- Detect AI prompt boxes
- Track environmental impact
- Show real-time statistics
- Provide payment options

## 💰 Revenue Model

### Payment Options

1. **$1 SAP Stamp**: Verify AI model sustainability
2. **$1 Core Membership**: Join the sustainable AI community
3. **$5 Credits**: Access premium AI models

### Payout System

- 50/50 revenue split between creator and global pot
- Automatic payouts via Stripe Connect
- Real-time global ticker updates
- Member equity tracking

## 🎯 Usage Examples

### Basic SDK Usage

```javascript
// Initialize SAP SDK
const sap = new SAPSDK({
    serverUrl: 'https://your-sap-domain.com',
    userId: 'user_123',
    autoTrack: true
});

// Track a prompt manually
await sap.trackPrompt('Hello, AI!', 'gpt-3.5-turbo');

// Get current statistics
const stats = sap.getStats();
console.log(`Total prompts: ${stats.totalPrompts}`);

// Generate AI response
const response = await sap.generateAI('What is sustainability?');
console.log(response.response);
```

### Widget Integration

```html
<!DOCTYPE html>
<html>
<head>
    <title>My AI App</title>
</head>
<body>
    <textarea placeholder="Ask AI anything..."></textarea>
    <button>Generate</button>
    
    <!-- SAP Widget -->
    <script src="https://your-sap-domain.com/sap/embed.js"></script>
</body>
</html>
```

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- JWT-based authentication
- Secure API endpoints
- Stripe webhook verification
- Input validation and sanitization

## 📊 Database Schema

### Key Tables

- `global_stats`: Global environmental impact statistics
- `user_payments`: User payment records
- `prompt_tracking`: Individual prompt tracking
- `user_profiles`: User account information
- `ai_models`: AI model energy factors
- `impact_factors`: Environmental impact calculations

### Automatic Updates

- Automatic global stats updates
- User profile statistics tracking
- Real-time impact calculations
- Energy and CO₂ factor lookups

## 🚀 Deployment

### Recommended Hosting

1. **Vercel** (Recommended)
   - Easy deployment
   - Automatic HTTPS
   - Environment variables
   - Serverless functions

2. **Render**
   - Full-stack hosting
   - Database integration
   - Automatic deployments

3. **Railway**
   - Simple deployment
   - Database included
   - Environment management

### Domain Setup

1. Purchase domain (e.g., `sap-protocol.com`)
2. Configure DNS
3. Set up SSL certificate
4. Update all URLs in code

## 🔧 Configuration

### Environment Variables

```env
# Server Configuration
PORT=3001
DOMAIN=https://your-sap-domain.com

# Stripe Configuration
SAP_STRIPE_SECRET_KEY=sk_test_...
SAP_STRIPE_PUBLISHABLE_KEY=pk_test_...
SAP_STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenRouter API
SAP_OPENROUTER_API_KEY=sk-or-...

# SAP Configuration
SAP_STAMP_PRICE_ID=price_...
SAP_CORE_MEMBERSHIP_PRICE_ID=price_...
SAP_CREDITS_PRICE_ID=price_...
```

## 📈 Monitoring

### Real-time Metrics

- Total prompts tracked
- Energy consumption (kWh)
- CO₂ emissions (kg)
- Active users
- Active domains

### Dashboard Features

- Live global ticker
- User statistics
- Payment tracking
- Environmental impact visualization

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

## 🌟 Roadmap

- [ ] Mobile app integration
- [ ] Advanced analytics dashboard
- [ ] Carbon offset marketplace
- [ ] AI model certification
- [ ] Enterprise features
- [ ] API rate limiting
- [ ] Multi-language support

---

**🌍 Building a sustainable future for AI | SAP Protocol v1.0**
