const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize Stripe
const stripe = require('stripe')(process.env.SAP_STRIPE_SECRET_KEY);

// Initialize Supabase
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Global variables for real-time tracking
let globalStats = {
  totalPrompts: 0,
  totalEnergy: 0,
  totalCO2: 0,
  lastUpdated: new Date().toISOString()
};

// Routes

// Serve main SAP page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'sap.html'));
});

// Serve SAP SDK
app.get('/sap/sdk.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'sap-sdk.js'));
});

// Serve embeddable widget
app.get('/sap/embed.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'sap-embed.js'));
});

// Get global stats
app.get('/api/stats', async (req, res) => {
  try {
    // Get latest stats from database
    const { data, error } = await supabase
      .from('global_stats')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      globalStats = {
        totalPrompts: data.total_prompts || 0,
        totalEnergy: data.total_energy || 0,
        totalCO2: data.total_co2 || 0,
        lastUpdated: data.created_at
      };
    }

    res.json(globalStats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.json(globalStats);
  }
});

// Track AI prompt
app.post('/api/track', async (req, res) => {
  try {
    const { prompt, model, tokens, energy, co2, userId } = req.body;
    
    // Calculate environmental impact
    const promptEnergy = energy || (tokens * 0.001); // kWh per token
    const promptCO2 = co2 || (promptEnergy * 0.5); // kg CO2 per kWh
    
    // Update global stats
    globalStats.totalPrompts += 1;
    globalStats.totalEnergy += promptEnergy;
    globalStats.totalCO2 += promptCO2;
    globalStats.lastUpdated = new Date().toISOString();
    
    // Save to database
    const { error } = await supabase
      .from('prompt_tracking')
      .insert({
        prompt: prompt.substring(0, 1000), // Limit length
        model: model,
        tokens: tokens,
        energy: promptEnergy,
        co2: promptCO2,
        user_id: userId,
        created_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Database error:', error);
    }
    
    // Update global stats in database
    await supabase
      .from('global_stats')
      .insert({
        total_prompts: globalStats.totalPrompts,
        total_energy: globalStats.totalEnergy,
        total_co2: globalStats.totalCO2,
        created_at: globalStats.lastUpdated
      });
    
    res.json({ success: true, stats: globalStats });
  } catch (error) {
    console.error('Error tracking prompt:', error);
    res.status(500).json({ error: 'Failed to track prompt' });
  }
});

// Stripe payment routes
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { priceId, userId, type } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.DOMAIN}/sap?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.DOMAIN}/sap?canceled=true`,
      metadata: {
        userId: userId,
        type: type
      }
    });
    
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Stripe webhook
app.post('/stripe-webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.SAP_STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, type } = session.metadata;
    
    // Update user status in database
    await supabase
      .from('user_payments')
      .insert({
        user_id: userId,
        type: type,
        amount: session.amount_total / 100,
        stripe_session_id: session.id,
        created_at: new Date().toISOString()
      });
  }
  
  res.json({ received: true });
});

// AI generation endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, model = 'openai/gpt-3.5-turbo', userId } = req.body;
    
    // Track the prompt
    await fetch(`${process.env.DOMAIN}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        model,
        tokens: prompt.length / 4, // Rough estimate
        userId
      })
    });
    
    // Generate AI response using OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SAP_OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000
      })
    });
    
    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      res.json({
        response: data.choices[0].message.content,
        usage: data.usage
      });
    } else {
      res.status(500).json({ error: 'Failed to generate response' });
    }
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

// Get user status
app.get('/api/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const { data, error } = await supabase
      .from('user_payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    
    const hasStamp = data.some(payment => payment.type === 'stamp');
    const hasMembership = data.some(payment => payment.type === 'membership');
    const credits = data
      .filter(payment => payment.type === 'credits')
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    res.json({
      hasStamp,
      hasMembership,
      credits,
      payments: data
    });
  } catch (error) {
    console.error('Error fetching user status:', error);
    res.status(500).json({ error: 'Failed to fetch user status' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🌍 SAP Server running on port ${PORT}`);
  console.log(`📊 Global ticker: ${globalStats.totalPrompts} prompts tracked`);
  console.log(`⚡ Energy: ${globalStats.totalEnergy.toFixed(3)} kWh`);
  console.log(`🌱 CO2: ${globalStats.totalCO2.toFixed(3)} kg`);
});
