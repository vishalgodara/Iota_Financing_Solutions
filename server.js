// Minimal Express server setup
require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');

const app = express();

// Log environment variables to verify they're loaded
console.log('🔐 Environment check:');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Loaded' : '❌ Missing');
console.log('ELEVENLABS_API_KEY:', process.env.ELEVENLABS_API_KEY ? '✅ Loaded' : '❌ Missing');

// Fallback: if not loaded from .env, set it manually (temporary fix)
if (!process.env.ELEVENLABS_API_KEY) {
  console.log('⚠️  Setting ELEVENLABS_API_KEY manually as fallback');
  process.env.ELEVENLABS_API_KEY = 'sk_71d4bb0cb7fb12f8c06f741b2461d30bcacffbeac8f6876a';
}


// Try to load the Google Generative AI SDK if available. It's optional — we
// provide a local heuristic fallback so the API works without credentials.
let genAI;
try {
  genAI = require('@google/generative-ai');
} catch (err) {
  genAI = undefined;
}

// Simple deterministic heuristic for resale value. This is intentionally
// conservative and avoids external calls so the app works offline/in dev.
function heuristicResaleValue({ year, model, originalPrice, yearsOwned, totalMileage }) {
  // Depreciation by age: typical annual depreciation 12%-18% for first few years
  const age = yearsOwned || Math.max(1, new Date().getFullYear() - (year || new Date().getFullYear()));
  const baseDepreciationRate = age <= 3 ? 0.16 : 0.08; // faster early decline

  // Mileage adjustment: $0.05 per mile as rough influence
  const mileagePenalty = (totalMileage || (age * 12000)) * 0.05;

  // Model factor (very coarse): premium models keep value better
  const modelLower = (model || '').toLowerCase();
  let modelFactor = 1.0;
  if (modelLower.includes('highlander') || modelLower.includes('4runner') || modelLower.includes('tundra')) modelFactor = 1.05;
  if (modelLower.includes('prius') || modelLower.includes('corolla')) modelFactor = 0.95;

  const estimated = Math.max(1000, (originalPrice || 20000) * Math.pow(1 - baseDepreciationRate, age) * modelFactor - mileagePenalty);
  return Math.round(estimated);
}

// Simple heuristic for monthly insurance estimate and total over the ownership period
function heuristicInsuranceEstimate({ year, model, yearsOwned, totalMileage }) {
  const modelLower = (model || '').toLowerCase();
  let base = 150; // default monthly
  if (modelLower.includes('camry')) base = 135;
  if (modelLower.includes('corolla') && !modelLower.includes('cross')) base = 120;
  if (modelLower.includes('corolla cross')) base = 145;
  if (modelLower.includes('prius')) base = 130;
  if (modelLower.includes('rav4')) base = 165;
  if (modelLower.includes('highlander')) base = 185;
  if (modelLower.includes('grand highlander')) base = 195;
  if (modelLower.includes('4runner')) base = 180;
  if (modelLower.includes('tacoma')) base = 160;
  if (modelLower.includes('tundra')) base = 175;
  if (modelLower.includes('sienna')) base = 150;

  const age = yearsOwned || Math.max(1, new Date().getFullYear() - (year || new Date().getFullYear()));
  // Slightly higher insurance for older vehicles but reduce after very old
  const ageFactor = age <= 3 ? 1.0 : age <= 10 ? 1.05 : 0.95;

  // Mileage effect: more miles -> modestly higher insurance
  const avgAnnual = (totalMileage || (age * 12000)) / Math.max(1, age);
  const mileageFactor = 1 + Math.max(0, (avgAnnual - 12000) / 30000 * 0.1);

  const monthly = Math.max(25, Math.round(base * ageFactor * mileageFactor));
  const total = Math.round(monthly * (yearsOwned || age) * 12);
  return { monthly, total };
}

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Chat endpoint for Gemini AI chatbot
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Received /api/chat request with message:', message);

    // Enhanced system prompt for automotive financing context
    const systemContext = `You are an expert automotive financing advisor for Iota Financial Solutions. 
Your role is to help customers understand vehicle financing, leasing, trade-ins, and automotive financial products.
Provide clear, concise, and helpful answers. Be friendly and professional.
Focus on Toyota vehicles and their financing options when relevant.
Keep responses conversational and under 150 words unless more detail is specifically requested.`;

    const fullPrompt = `${systemContext}\n\nCustomer question: ${message}\n\nYour response:`;

    let responseText;

    // Try to use Gemini if available
    if (genAI && typeof genAI.GoogleGenerativeAI === 'function') {
      try {
        const googleAI = new genAI.GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
        const model = googleAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Updated model name
        
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        responseText = response.text();
        
        console.log('🤖 Gemini response:', responseText);
      } catch (err) {
        console.error('Gemini API call failed:', err);
        // Fallback to heuristic response
        responseText = generateFallbackResponse(message);
      }
    } else {
      // No Gemini available - use fallback
      responseText = generateFallbackResponse(message);
    }

    res.status(200).json({ response: responseText });

  } catch (error) {
    console.error('❌ Error in /api/chat:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Text-to-speech endpoint using ElevenLabs
app.post('/api/text-to-speech', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    
    console.log('🔑 Checking ElevenLabs API key...');
    console.log('API Key exists:', !!ELEVENLABS_API_KEY);
    console.log('API Key length:', ELEVENLABS_API_KEY ? ELEVENLABS_API_KEY.length : 0);
    
    if (!ELEVENLABS_API_KEY) {
      console.warn('⚠️ ElevenLabs API key not configured');
      return res.status(200).json({ audio: null, message: 'Voice disabled' });
    }

    console.log('🎤 Converting text to speech with ElevenLabs SDK...');
    console.log('📝 Text:', text.substring(0, 50) + '...');

    const elevenlabs = new ElevenLabsClient({
      apiKey: ELEVENLABS_API_KEY
    });

    // Correct method from official docs
    const audio = await elevenlabs.textToSpeech.convert(
      'JBFqnCBsd6RMkjVDRZzb', // voice_id
      {
        text: text,
        model_id: 'eleven_multilingual_v2',
      }
    );

    // Convert audio stream to buffer
    const chunks = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);
    const base64Audio = audioBuffer.toString('base64');
    
    console.log('✅ Text-to-speech conversion successful');
    res.status(200).json({ audio: base64Audio });

  } catch (error) {
    console.error('❌ Error in /api/text-to-speech:', error);
    console.error('Error details:', error.message);
    // Return null audio instead of error - voice is optional
    res.status(200).json({ audio: null, message: 'Voice feature unavailable' });
  }
});

// Fallback response generator for when Gemini is unavailable
function generateFallbackResponse(message) {
  const messageLower = message.toLowerCase();
  
  if (messageLower.includes('financing') || messageLower.includes('loan')) {
    return "Great question about financing! We offer competitive rates and flexible terms for new and used Toyota vehicles. Our financing options include traditional auto loans with terms from 24 to 72 months. Would you like to use our financing calculator to see estimated monthly payments?";
  }
  
  if (messageLower.includes('lease') || messageLower.includes('leasing')) {
    return "Leasing is a popular option! With a lease, you typically have lower monthly payments compared to buying, and you can drive a new vehicle every few years. Lease terms usually range from 24 to 36 months. Would you like to learn more about our current lease offers?";
  }
  
  if (messageLower.includes('trade') || messageLower.includes('trade-in')) {
    return "We'd love to help you with your trade-in! The value depends on your vehicle's year, make, model, mileage, and condition. You can use our trade-in estimator tool, or schedule an appointment for a quick in-person appraisal. What vehicle are you looking to trade in?";
  }
  
  if (messageLower.includes('credit') || messageLower.includes('credit score')) {
    return "Your credit score does affect your financing terms, but we work with a variety of credit situations! Even if your credit isn't perfect, we have programs that can help. Generally, higher credit scores (700+) get the best rates, but we can often find solutions for scores as low as 600. Would you like to discuss your specific situation?";
  }
  
  if (messageLower.includes('payment') || messageLower.includes('monthly')) {
    return "Monthly payments depend on several factors: the vehicle price, your down payment, interest rate, and loan term. For example, a $30,000 vehicle with $3,000 down at 5% APR for 60 months would be around $510/month. Use our calculator to see estimates for your specific situation!";
  }
  
  // Generic fallback
  return "Thank you for your question! I'm here to help with automotive financing, leasing, trade-ins, and vehicle purchases. Our team at Iota Financial Solutions can provide personalized assistance. Would you like to schedule an appointment with one of our financing specialists, or is there something specific I can help you with?";
}

app.post('/api/predict-resale', async (req, res) => {
  try {
    const { year, model, trim, originalPrice, yearsOwned, totalMileage } = req.body;
    console.log('Received /api/predict-resale request body:', { year, model, trim, originalPrice, yearsOwned, totalMileage });

    const prompt = `
      Predict the resale value for the following vehicle:
      - Year: ${year}
      - Model: ${model}
      - Trim: ${trim}
      - Original Price: $${originalPrice}
      - Age: ${yearsOwned.toFixed(1)} years
      - Mileage: ${Math.round(totalMileage)} miles

      Respond ONLY with a JSON object in this format:
      {"resaleValue": <number>}
    `;

  let resaleValue;
  let insuranceMonthly = 0;
  let insuranceTotal = 0;

    // If genAI is configured, try calling it. Otherwise, use a local heuristic.
    if (genAI && typeof genAI.getGenerativeModel === 'function') {
      try {
        const modelApi = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await modelApi.generateContent(prompt);
        const text = result.response?.text?.() || result.text?.() || '';

        console.log("🔹 Gemini raw response:", text);

        const cleanedText = text
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .replace(/^[^{]+/, '')
          .replace(/[^}]+$/, '')
          .trim();

        let jsonResponse;
        try {
          jsonResponse = JSON.parse(cleanedText);
        } catch (err) {
          console.error("⚠️ JSON parse failed. Raw Gemini text:", text);
          throw new Error("Gemini returned invalid JSON");
        }

        if (jsonResponse && typeof jsonResponse.resaleValue === 'number') {
          resaleValue = jsonResponse.resaleValue;
        } else {
          throw new Error('Invalid JSON format from Gemini');
        }
      } catch (err) {
        console.error('Gemini call failed, falling back to heuristic. Error:', err);
        resaleValue = heuristicResaleValue({ year, model, originalPrice, yearsOwned, totalMileage });
      }
      // Now attempt to get an insurance estimate from the model using a second prompt
      try {
        const insurancePrompt = `
Predict an appropriate monthly insurance premium (USD) and the total insurance cost over ${yearsOwned} years for the following vehicle. Respond ONLY with JSON in this format:\n{"insuranceMonthly": <number>, "insuranceTotal": <number>}\n\nVehicle:\n- Year: ${year}\n- Model: ${model}\n- Trim: ${trim}\n- Total mileage: ${Math.round(totalMileage)} miles\n- Years owned: ${yearsOwned}
`;
        const insResult = await modelApi.generateContent(insurancePrompt);
        const insText = insResult.response?.text?.() || insResult.text?.() || '';
        const cleanedInsText = insText
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .replace(/^[^{]+/, '')
          .replace(/[^}]+$/, '')
          .trim();
        let insJson;
        try {
          insJson = JSON.parse(cleanedInsText);
        } catch (err) {
          console.error('⚠️ JSON parse failed for insurance. Raw Gemini text:', insText);
          throw new Error('Gemini returned invalid JSON for insurance');
        }
        if (insJson && typeof insJson.insuranceMonthly === 'number') {
          insuranceMonthly = insJson.insuranceMonthly;
          insuranceTotal = typeof insJson.insuranceTotal === 'number' ? insJson.insuranceTotal : Math.round(insJson.insuranceMonthly * (yearsOwned || 1) * 12);
        } else {
          throw new Error('Invalid JSON format from Gemini (insurance)');
        }
      } catch (err) {
        console.error('Gemini insurance call failed, falling back to heuristic. Error:', err);
        const ins = heuristicInsuranceEstimate({ year, model, yearsOwned, totalMileage });
        insuranceMonthly = ins.monthly;
        insuranceTotal = ins.total;
      }
    } else {
      // SDK not available — use heuristic
      resaleValue = heuristicResaleValue({ year, model, originalPrice, yearsOwned, totalMileage });
      const ins = heuristicInsuranceEstimate({ year, model, yearsOwned, totalMileage });
      insuranceMonthly = ins.monthly;
      insuranceTotal = ins.total;
    }

  console.log('Responding with resaleValue:', resaleValue, 'insuranceMonthly:', insuranceMonthly, 'insuranceTotal:', insuranceTotal);
  res.status(200).json({ resaleValue, insuranceMonthly, insuranceTotal });

  } catch (error) {
    console.error('❌ Error in /api/predict-resale:', error);
    res.status(500).json({ error: 'Failed to predict resale value' });
  }
});

// Simple guard: ensure genAI is available at runtime
if (typeof genAI === 'undefined') {
  console.warn('Warning: `genAI` is not defined. The /api/predict-resale endpoint will fail until you initialize the @google/generative-ai SDK and set required credentials.');
}

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});