# Quick Start Guide - Chatbot Integration

## ✅ What's Been Done

Your Iota Financial Solutions application now has a fully functional AI chatbot that appears on both:
- **Landing Page** (for visitors before login)
- **Dashboard** (for authenticated users)

## 🚀 Quick Start

### Option 1: Using PowerShell Script (Windows - Recommended)
```powershell
.\start-dev.ps1
```
This will:
- Start the backend server in a new window (port 3001)
- Start the frontend in the current window (port 5173 or similar)

### Option 2: Manual Start

**Terminal 1 - Backend:**
```powershell
cd C:\Users\rpaga\OneDrive\Desktop\Hacktx\Interactivefinancingsolution
node server.js
```

**Terminal 2 - Frontend:**
```powershell
cd C:\Users\rpaga\OneDrive\Desktop\Hacktx\Interactivefinancingsolution
npm run dev
```

## 🧪 Testing the Chatbot

1. Open your browser to the Vite dev server URL (usually `http://localhost:5173`)
2. Look for the **red floating microphone button** in the bottom-right corner
3. Click it to open the chatbot
4. Try these sample questions:
   - "What financing options are available?"
   - "How does vehicle leasing work?"
   - "Can you help me calculate monthly payments?"
   - "What's my trade-in worth?"
   - "What credit score do I need?"

## 📁 Files Created/Modified

### New Files:
- ✅ `src/services/geminiService.ts` - Backend API communication
- ✅ `src/services/elevenlabsService.ts` - Text-to-speech (optional)
- ✅ `src/components/ChatBot.tsx` - Chatbot UI component
- ✅ `start-dev.ps1` - Quick start script for Windows
- ✅ `CHATBOT_INTEGRATION.md` - Detailed documentation

### Modified Files:
- ✅ `server.js` - Added `/api/chat` endpoint
- ✅ `src/App.tsx` - Added ChatBot to landing page
- ✅ `src/components/Dashboard.tsx` - Added ChatBot to dashboard
- ✅ `package.json` - Added dotenv dependency

## 🔧 Environment Variables

Your `.env` file already has:
```
VITE_GEMINI_API_KEY=AIzaSyBlHzQMU4ND22s02NwMaL8QB8unxhJRiQM
VITE_ELEVENLABS_API_KEY=38a0c5806cb4deddca7339e7f78d571e0b90f4dc982e69cfe5369a6f2e269254
```

The chatbot will use these for:
- **Gemini**: AI-powered responses
- **ElevenLabs**: Voice/speech output (optional)

## 💡 Features

### Visual Design
- Red floating action button (matches your brand)
- Smooth animations
- Modern voice assistant interface
- Real-time status updates

### AI Capabilities
- Automotive financing expertise
- Leasing information
- Trade-in valuations
- Credit score guidance
- Payment calculations
- Fallback responses (works even without Gemini)

### Technical
- Backend API endpoint at `http://localhost:3001/api/chat`
- Frontend communicates via fetch API
- Error handling and graceful degradation
- Optional text-to-speech

## 🐛 Troubleshooting

### "Backend not responding"
Make sure `node server.js` is running. Check terminal for errors.

### "Chatbot button not appearing"
1. Check browser console (F12) for errors
2. Verify files exist in `src/services/` and `src/components/`
3. Make sure both servers are running

### "Cannot find module 'dotenv'"
Run: `npm install dotenv`

### "No voice output"
Voice is optional. The chatbot works fine with text-only responses.

## 📚 More Information

See `CHATBOT_INTEGRATION.md` for:
- Detailed architecture
- API documentation
- Customization options
- Advanced troubleshooting

## ✨ Ready to Go!

Your chatbot is now integrated and ready to use. Just run the start script and test it out!
