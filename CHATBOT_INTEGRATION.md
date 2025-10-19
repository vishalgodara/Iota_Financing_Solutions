# Chatbot Integration Summary

## Overview
Successfully integrated an AI-powered chatbot into both the Landing Page and Dashboard of the Iota Financial Solutions application.

## What Was Created

### 1. Service Files

#### `src/services/geminiService.ts`
- Handles communication with the backend API for chatbot functionality
- Sends user messages to `/api/chat` endpoint
- Returns AI-generated responses
- Includes error handling with fallback messages

#### `src/services/elevenlabsService.ts`
- Provides text-to-speech functionality using ElevenLabs API
- Converts AI responses to spoken audio
- Includes graceful fallback when API key is not configured
- Handles audio playback in the browser

### 2. Backend Endpoint

#### `server.js` - New `/api/chat` Endpoint
- Accepts POST requests with user messages
- Uses Google Generative AI (Gemini) for intelligent responses
- Includes automotive financing-specific context and expertise
- Provides smart fallback responses when Gemini is unavailable
- Topics covered:
  - Vehicle financing and loans
  - Leasing options
  - Trade-in valuations
  - Credit score considerations
  - Monthly payment calculations

### 3. Frontend Integration

#### `src/App.tsx`
- Added ChatBot component to the Landing Page
- Visitors can ask questions before signing in

#### `src/components/Dashboard.tsx`
- Added ChatBot component to all Dashboard pages
- Authenticated users have access throughout their session

### 4. Existing ChatBot Component

#### `src/components/ChatBot.tsx`
- Modern floating action button (FAB) design
- Animated voice assistant interface
- Real-time visual feedback during processing
- Text input with keyboard support (Enter to send)
- Microphone icon for intuitive voice assistant feel
- Sound wave animations during speech playback
- Customizable red theme matching Iota branding

## Features

### User Experience
- **Floating Button**: Always accessible in bottom-right corner
- **Expandable Interface**: Clean, modal-style chat window
- **Visual Feedback**: Animated avatar shows processing and speaking states
- **Status Messages**: Clear indication of what's happening
- **Keyboard Shortcuts**: Press Enter to send messages
- **Responsive Design**: Works on desktop and mobile

### Technical Features
- **AI-Powered Responses**: Uses Google Gemini for intelligent answers
- **Text-to-Speech**: Optional voice responses via ElevenLabs
- **Fallback Support**: Works even without external APIs
- **Error Handling**: Graceful degradation on failures
- **Context-Aware**: Specialized in automotive financing topics

## Environment Variables

Required in `.env` file:
```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-key>
VITE_GEMINI_API_KEY=<your-gemini-api-key>
VITE_ELEVENLABS_API_KEY=<your-elevenlabs-api-key>
```

**Note**: The chatbot will work with just VITE_GEMINI_API_KEY. ElevenLabs is optional for voice features.

## How to Run

### Start the Backend Server
```bash
node server.js
```
This starts the Express server on port 3001.

### Start the Frontend Development Server
```bash
npm run dev
```
This starts the Vite development server (typically on port 5173).

### Production Build
```bash
npm run build
```

## API Endpoints

### Health Check
- **Endpoint**: `GET /api/health`
- **Response**: `{ status: 'ok' }`

### Chat
- **Endpoint**: `POST /api/chat`
- **Request Body**: `{ message: string }`
- **Response**: `{ response: string }`

### Resale Prediction (Existing)
- **Endpoint**: `POST /api/predict-resale`
- **Request Body**: `{ year, model, trim, originalPrice, yearsOwned, totalMileage }`
- **Response**: `{ resaleValue: number }`

## Architecture

```
User Input (ChatBot.tsx)
    ↓
geminiService.ts
    ↓
Backend API (/api/chat in server.js)
    ↓
Google Gemini AI
    ↓
Response returned to frontend
    ↓
elevenlabsService.ts (optional voice)
    ↓
Audio playback in browser
```

## Customization Options

### Changing Voice
Edit `src/services/elevenlabsService.ts`:
```typescript
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Change this to your preferred voice
```

### Modifying AI Context
Edit `server.js` in the `/api/chat` endpoint:
```javascript
const systemContext = `Your custom context here...`;
```

### Styling
The chatbot uses Tailwind CSS classes and can be customized in `ChatBot.tsx`.

## Dependencies Added
- `dotenv` - For environment variable support in backend

## Testing the Chatbot

### Sample Questions to Try:
1. "What financing options do you offer?"
2. "How does leasing work?"
3. "Can you help me estimate my trade-in value?"
4. "What credit score do I need for financing?"
5. "How much would my monthly payments be?"

## Troubleshooting

### Chatbot button doesn't appear
- Check browser console for errors
- Verify all service files exist
- Ensure imports are correct

### API errors
- Verify backend server is running on port 3001
- Check `.env` file has VITE_GEMINI_API_KEY
- Look at server console for error messages

### No voice output
- Voice is optional - requires VITE_ELEVENLABS_API_KEY
- Check browser console for audio-related errors
- Verify ElevenLabs API key is valid

## Future Enhancements
- Chat history persistence
- Multi-language support
- Vehicle-specific recommendations
- Integration with appointment scheduler
- User feedback and ratings
