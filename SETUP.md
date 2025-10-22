# 🚀 SAP Protocol Setup Guide

Complete setup instructions for the Sustainable AI Protocol.

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Stripe account
- Supabase account
- OpenRouter API key

## 🛠️ Step-by-Step Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-org/sap-protocol.git
cd sap-protocol

# Install dependencies
npm install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp env.example .env

# Edit environment variables
nano .env
```

Fill in the following variables:

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

### 3. Database Setup (Supabase)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note your project URL and keys

2. **Run Database Schema**
   - Go to SQL Editor in Supabase
   - Copy and paste the contents of `sap-schema.sql`
   - Execute the SQL script

3. **Verify Tables Created**
   - Check that all tables are created
   - Verify initial data is inserted

### 4. Stripe Setup

1. **Create Stripe Account**
   - Go to [stripe.com](https://stripe.com)
   - Create account and get API keys

2. **Create Products**
   - SAP Stamp: $1.00 one-time
   - Core Membership: $1.00 one-time
   - Credits: $5.00 one-time

3. **Set Up Webhook**
   - Go to Stripe Dashboard > Webhooks
   - Add endpoint: `https://your-domain.com/stripe-webhook`
   - Select events: `checkout.session.completed`
   - Copy webhook secret

4. **Get Price IDs**
   - Copy price IDs from Stripe Dashboard
   - Add to environment variables

### 5. OpenRouter Setup

1. **Get API Key**
   - Go to [openrouter.ai](https://openrouter.ai)
   - Create account and get API key
   - Add to environment variables

### 6. Test Local Development

```bash
# Start development server
npm run dev

# Or start production server
npm start
```

Visit `http://localhost:3001` to test the interface.

### 7. Production Deployment

#### Option A: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configure Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Update domain in environment variables

#### Option B: Render

1. **Connect Repository**
   - Go to [render.com](https://render.com)
   - Connect your GitHub repository

2. **Configure Build**
   - Build command: `npm install`
   - Start command: `npm start`

3. **Set Environment Variables**
   - Add all environment variables
   - Update domain

#### Option C: Railway

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository

2. **Configure Environment**
   - Add all environment variables
   - Update domain

### 8. Domain Configuration

1. **Purchase Domain**
   - Buy domain (e.g., `sap-protocol.com`)
   - Configure DNS settings

2. **Update URLs**
   - Update `DOMAIN` in environment variables
   - Update URLs in code if needed

3. **SSL Certificate**
   - Most hosting providers handle SSL automatically
   - Verify HTTPS is working

### 9. Final Testing

1. **Test All Features**
   - Global ticker updates
   - AI chat interface
   - Payment processing
   - Widget embedding

2. **Test Widget Integration**
   ```html
   <script src="https://your-sap-domain.com/sap/embed.js"></script>
   ```

3. **Verify Database**
   - Check data is being stored
   - Verify real-time updates

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify Supabase credentials
   - Check database schema is applied
   - Ensure RLS policies are set

2. **Stripe Payment Error**
   - Verify API keys are correct
   - Check webhook endpoint is accessible
   - Ensure products are created

3. **Widget Not Loading**
   - Check CORS settings
   - Verify server is running
   - Check browser console for errors

4. **Environment Variables**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Verify values are correct

### Debug Mode

Enable debug mode in the SDK:

```javascript
const sap = new SAPSDK({
    debug: true,
    serverUrl: 'https://your-sap-domain.com'
});
```

### Logs

Check server logs for errors:

```bash
# View logs
npm run dev

# Or check production logs
vercel logs
```

## 📊 Monitoring

### Health Checks

- Server status: `GET /api/stats`
- Database connection
- Stripe webhook status

### Metrics to Monitor

- Total prompts tracked
- Energy consumption
- CO₂ emissions
- Active users
- Payment success rate

## 🔒 Security Checklist

- [ ] Environment variables secured
- [ ] Database RLS enabled
- [ ] Stripe webhook verified
- [ ] HTTPS enabled
- [ ] Input validation implemented
- [ ] Rate limiting configured

## 🚀 Go Live Checklist

- [ ] All environment variables set
- [ ] Database schema applied
- [ ] Stripe products created
- [ ] Webhook endpoint configured
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] All features tested
- [ ] Monitoring set up

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review server logs
3. Verify all configurations
4. Contact support if needed

---

**🌍 Ready to track AI's environmental impact!**
