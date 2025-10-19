// Minimal Express server setup
const express = require('express');
const cors = require('cors');

const app = express();


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

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

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
    } else {
      // SDK not available — use heuristic
      resaleValue = heuristicResaleValue({ year, model, originalPrice, yearsOwned, totalMileage });
    }

  console.log('Responding with resaleValue:', resaleValue);
  res.status(200).json({ resaleValue });

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