# 💳 Stripe Setup Guide for SAP Protocol

Complete guide to setting up Stripe payments for the Sustainable AI Protocol.

## 🎯 Overview

SAP Protocol uses Stripe for three payment types:
- **SAP Stamp**: $1.00 one-time (model verification)
- **Core Membership**: $1.00 one-time (community access)
- **Credits**: $5.00 one-time (premium AI models)

## 🛠️ Step-by-Step Setup

### 1. Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Sign up for a new account
3. Complete account verification
4. Note your API keys from the dashboard

### 2. Get API Keys

1. **Dashboard → Developers → API Keys**
2. Copy the following keys:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

3. Add to your `.env` file:
   ```env
   SAP_STRIPE_PUBLISHABLE_KEY=pk_test_...
   SAP_STRIPE_SECRET_KEY=sk_test_...
   ```

### 3. Create Products

#### SAP Stamp Product

1. **Dashboard → Products → Add Product**
2. **Product Details:**
   - Name: `SAP Stamp`
   - Description: `Verify your AI model's sustainability`
   - Price: `$1.00`
   - Billing: `One-time`
   - Currency: `USD`

3. **Save and note the Price ID** (starts with `price_`)

#### Core Membership Product

1. **Dashboard → Products → Add Product**
2. **Product Details:**
   - Name: `Core Membership`
   - Description: `Join the sustainable AI community`
   - Price: `$1.00`
   - Billing: `One-time`
   - Currency: `USD`

3. **Save and note the Price ID**

#### Credits Product

1. **Dashboard → Products → Add Product**
2. **Product Details:**
   - Name: `Credits`
   - Description: `Access premium AI models`
   - Price: `$5.00`
   - Billing: `One-time`
   - Currency: `USD`

3. **Save and note the Price ID**

### 4. Configure Webhook

1. **Dashboard → Developers → Webhooks**
2. **Add Endpoint:**
   - Endpoint URL: `https://your-sap-domain.com/stripe-webhook`
   - Description: `SAP Protocol Webhook`

3. **Select Events:**
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

4. **Save and copy the Webhook Secret** (starts with `whsec_`)

5. **Add to your `.env` file:**
   ```env
   SAP_STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### 5. Update Environment Variables

Add all price IDs to your `.env` file:

```env
# Stripe Configuration
SAP_STRIPE_SECRET_KEY=sk_test_...
SAP_STRIPE_PUBLISHABLE_KEY=pk_test_...
SAP_STRIPE_WEBHOOK_SECRET=whsec_...

# SAP Configuration
SAP_STAMP_PRICE_ID=price_...
SAP_CORE_MEMBERSHIP_PRICE_ID=price_...
SAP_CREDITS_PRICE_ID=price_...
```

### 6. Test Webhook Locally

For local development, use Stripe CLI:

1. **Install Stripe CLI**
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Windows
   # Download from GitHub releases
   ```

2. **Login to Stripe**
   ```bash
   stripe login
   ```

3. **Forward webhooks to local server**
   ```bash
   stripe listen --forward-to localhost:3001/stripe-webhook
   ```

4. **Copy the webhook secret** (starts with `whsec_`)
5. **Update your `.env` file** with the local webhook secret

### 7. Test Payments

1. **Start your server**
   ```bash
   npm start
   ```

2. **Test checkout flow**
   - Go to `http://localhost:3001`
   - Click on payment buttons
   - Use test card: `4242 4242 4242 4242`

3. **Verify webhook events**
   - Check Stripe Dashboard → Events
   - Verify webhook is receiving events

## 🔧 Production Setup

### 1. Switch to Live Mode

1. **Dashboard → Toggle to Live Mode**
2. **Get live API keys**
3. **Update environment variables**

### 2. Configure Live Webhook

1. **Dashboard → Developers → Webhooks**
2. **Add Live Endpoint:**
   - URL: `https://your-production-domain.com/stripe-webhook`
   - Events: `checkout.session.completed`

3. **Update webhook secret in production**

### 3. Test Live Payments

1. **Use real payment methods**
2. **Verify webhook events**
3. **Check database updates**

## 💰 Revenue Configuration

### Payout Settings

1. **Dashboard → Settings → Payouts**
2. **Configure payout schedule**
3. **Add bank account details**

### Connect Integration (Future)

For 50/50 revenue splits:

1. **Dashboard → Connect**
2. **Create platform account**
3. **Configure application fees**
4. **Update payment flow**

## 🔒 Security

### Webhook Security

```javascript
// Verify webhook signature
const sig = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(
  req.body, 
  sig, 
  process.env.SAP_STRIPE_WEBHOOK_SECRET
);
```

### API Key Security

- Never expose secret keys in client-side code
- Use environment variables
- Rotate keys regularly
- Monitor API usage

## 📊 Monitoring

### Dashboard Metrics

- **Payments**: Total volume, success rate
- **Customers**: New signups, retention
- **Revenue**: Daily, monthly trends
- **Disputes**: Chargeback rate

### Webhook Monitoring

- **Events**: Success/failure rates
- **Response times**: Webhook performance
- **Errors**: Failed webhook deliveries

## 🚨 Troubleshooting

### Common Issues

1. **Webhook Not Receiving Events**
   - Check endpoint URL is accessible
   - Verify SSL certificate
   - Check firewall settings

2. **Payment Failures**
   - Verify API keys are correct
   - Check product/price IDs
   - Test with different cards

3. **Database Not Updating**
   - Check webhook handler code
   - Verify database connection
   - Review error logs

### Debug Mode

Enable Stripe debug mode:

```javascript
const stripe = require('stripe')(process.env.SAP_STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  debug: true
});
```

### Logs

Check webhook logs in Stripe Dashboard:
- **Dashboard → Developers → Webhooks**
- **Click on your webhook**
- **View event logs**

## 📋 Checklist

### Development Setup
- [ ] Stripe account created
- [ ] API keys obtained
- [ ] Products created
- [ ] Price IDs noted
- [ ] Webhook configured
- [ ] Environment variables set
- [ ] Test payments working

### Production Setup
- [ ] Live mode enabled
- [ ] Live API keys configured
- [ ] Production webhook set up
- [ ] SSL certificate active
- [ ] Payout settings configured
- [ ] Monitoring enabled

## 🆘 Support

### Stripe Support
- **Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Support**: [support.stripe.com](https://support.stripe.com)
- **Status**: [status.stripe.com](https://status.stripe.com)

### SAP Protocol Support
- **GitHub Issues**: Create an issue
- **Email**: support@sap-protocol.com

---

**💳 Ready to process sustainable AI payments!**
