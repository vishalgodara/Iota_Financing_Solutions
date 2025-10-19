# 🚗 Iota Interactive Financing Solution

  # Interactive Financing Solution

<div align="center">

  This is a code bundle for Interactive Financing Solution. The original project is available at https://www.figma.com/design/WKM5Ef77j1H2RuQdfXFAm9/Interactive-Financing-Solution.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)  ## Running the code

![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)

![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite)  Run `npm i` to install the dependencies.

![License](https://img.shields.io/badge/license-Private-red.svg)

  Run `npm run dev` to start the development server.

**An intelligent, AI-powered vehicle financing platform that simplifies the car buying experience.**  

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Troubleshooting](#-troubleshooting)

---

## 🌟 Overview

**Iota Interactive Financing Solution** is a modern web application designed to revolutionize the vehicle financing experience. Built for **HackTX**, this platform combines cutting-edge AI technology with an intuitive user interface to help customers find their perfect vehicle and understand their financing options.

### Why Iota?

- **Personalized Recommendations**: AI-powered vehicle matching based on lifestyle and financial profile
- **Real-time Calculations**: Instant lease vs. finance comparisons with accurate predictions
- **Interactive Map**: Explore vehicle inventory across Texas with real-time availability
- **Voice AI Assistant**: Natural language support powered by Google Gemini and ElevenLabs
- **Educational Resources**: Learn about financing, leasing, and vehicle ownership

---

## ✨ Features

### 🎯 Core Features

#### 1. **Smart Questionnaire Flow**
- Multi-step lifestyle assessment
- Financial profile building
- Driving habits analysis
- Personalized vehicle recommendations

#### 2. **AI-Powered Vehicle Recommendations**
- **Smart Matching Algorithm** (100-point scoring system)
  - Vehicle category match (40 points)
  - Powertrain preference (30 points)
  - Budget compatibility (20 points)
  - Fuel efficiency (7 points)
  - Resale value projection (3 points)
- Filter by budget, type, and features
- Compare up to 8 Toyota models simultaneously

#### 3. **Advanced Financing Calculator**
- **Lease Analysis**: Monthly payments, mileage calculations, total cost
- **Finance Analysis**: APR calculations, resale predictions, net cost
- **Insurance Integration**: Optional bundling with real-time premiums
- **Vehicle Customization**: 6 colors, accessory packages, dynamic pricing

#### 4. **Interactive Texas Map** 🗺️
- Real OpenStreetMap integration with Leaflet
- 8 dealership locations across Texas (Austin, Houston, Dallas, San Antonio, El Paso, Fort Worth, Corpus Christi, Amarillo)
- Live inventory counts: 20,350+ vehicles total
- Interactive markers with clickable popups
- Coverage area visualization with red circles

#### 5. **Voice AI Assistant** 🎤
- **Powered by Google Gemini 2.5 Flash-Lite**: Natural language understanding
- **ElevenLabs Text-to-Speech**: Real-time voice synthesis
- Voice + text responses with animated indicators
- Available on dashboard (not on landing page)

#### 6. **Additional Features**
- Educational hub with financing guides
- Rewards & incentives program
- Community blogs and discussions
- Virtual showroom
- Appointment scheduling

---

## 🛠 Tech Stack

### Frontend
- **React** 18.3.1 - UI framework
- **TypeScript** 5.0+ - Type safety
- **Vite** 6.3.5 - Build tool
- **React Router** 7.9.4 - Routing
- **Framer Motion** 12.23.24 - Animations
- **Tailwind CSS** 4.1.3 - Styling
- **Radix UI** - Accessible components
- **Leaflet** 1.9.4 - Interactive maps
- **Recharts** 2.15.2 - Charts

### Backend
- **Node.js** 22.20.0 - Runtime
- **Express** 5.1.0 - API server
- **CORS** 2.8.5 - Cross-origin requests
- **dotenv** 17.2.3 - Environment variables

### AI & APIs
- **Google Gemini AI** - Natural language processing
- **ElevenLabs** - Text-to-speech synthesis
- **Supabase** - Authentication & database
- **OpenStreetMap** - Map tiles

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (Browser)                        │
│              React SPA (Port 3000)                           │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│               Express Server (Port 3001)                     │
│  /api/chat           → Gemini AI Integration                │
│  /api/text-to-speech → ElevenLabs TTS                       │
│  /api/predict-resale → Resale Value Calculation             │
│  /api/insurance      → Insurance Estimation                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│             External Services                                │
│  Google Gemini | ElevenLabs | Supabase                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Installation

### Prerequisites

- **Node.js** v18+ 
- **npm** v8+
- **Git**
- API Keys: Gemini, ElevenLabs, Supabase

### Quick Start

1. **Clone Repository**
   ```bash
   git clone https://github.com/vishalgodara/Interactivefinancingsolution.git
   cd Interactivefinancingsolution
   ```

2. **Install Dependencies**
   ```bash
   npm install
   npm install leaflet react-leaflet@4.2.1 @types/leaflet date-fns --legacy-peer-deps
   ```

3. **Create .env File**
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   GEMINI_API_KEY=your_gemini_key
   ELEVENLABS_API_KEY=your_elevenlabs_key
   ```

4. **Start Servers**
   ```bash
   # Terminal 1 - Frontend
   npm run dev

   # Terminal 2 - Backend
   node server.js
   ```

5. **Access Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

---

## ⚙️ Configuration

### Getting API Keys

#### Supabase (Authentication)
1. Sign up at [supabase.com](https://supabase.com)
2. Create project → Settings → API
3. Copy URL and anon key

#### Google Gemini AI
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Add to .env

#### ElevenLabs (Text-to-Speech)
1. Sign up at [elevenlabs.io](https://elevenlabs.io)
2. Profile → API Keys
3. Generate key

---

## 🚀 Usage

### Development Mode

**Windows (PowerShell):**
```powershell
.\start-dev.ps1
```

**Manual Start:**
```bash
npm run dev       # Frontend
node server.js    # Backend (separate terminal)
```

### User Flow

1. **Landing Page** → View map, sign in/up
2. **Dashboard** → Click "Find your perfect Toyota!"
3. **Questionnaire** → 5-step profile building
4. **Recommendations** → AI-matched vehicles
5. **Calculator** → Customize & calculate payments
6. **Voice Assistant** → Ask questions anytime

---

## 📡 API Documentation

### POST /api/chat
AI chatbot conversations
```json
Request: { "message": "What are lease benefits?" }
Response: { "response": "Leasing offers..." }
```

### POST /api/text-to-speech
Convert text to speech
```json
Request: { "text": "Your payment is $450" }
Response: { "audio": "base64_audio_data" }
```

### POST /api/predict-resale
Predict vehicle resale value
```json
Request: { "year": 2024, "model": "Camry", "originalPrice": 28000 }
Response: { "resaleValue": 19500 }
```

---

## 📁 Project Structure

```
Interactivefinancingsolution/
├── .env                          # Environment variables
├── package.json                  # Dependencies
├── server.js                     # Express backend
├── src/
│   ├── App.tsx                   # Main app
│   ├── components/
│   │   ├── Dashboard.tsx         # Main dashboard
│   │   ├── QuestionnaireFlow.tsx
│   │   ├── VehicleRecommendations.tsx
│   │   ├── FinancingCalculator.tsx
│   │   ├── TexasMap.tsx          # Leaflet map
│   │   ├── ChatBot.tsx           # Voice AI
│   │   └── ui/                   # Reusable components
│   ├── services/
│   │   ├── geminiService.ts      # Gemini API
│   │   └── elevenlabsService.ts  # TTS API
│   └── data/
│       └── vehicleData.ts        # Toyota catalog
```

---

## 🐛 Troubleshooting

### Common Issues

**1. Server Not Starting**
```bash
# Install dependencies
npm install

# Check port availability
netstat -ano | findstr :3001
```

**2. Map Not Loading**
```bash
# Ensure Leaflet CSS imported in index.css
@import 'leaflet/dist/leaflet.css';
```

**3. Chatbot Error: "Having trouble connecting"**
```bash
# Start backend server
node server.js

# Check logs for API key issues
```

**4. Environment Variables Not Loading**
```bash
# Verify .env file location (root directory)
# Ensure keys have no quotes
GEMINI_API_KEY=your_key_here
```

---

## 📄 License

Private and proprietary.  
© 2025 Iota Financial Solutions. All rights reserved.

---

## 👥 Team

- **Vishal Godara** - [@vishalgodara](https://github.com/vishalgodara)

---

## 🙏 Acknowledgments

- **HackTX** - For the opportunity
- **Google AI** - Gemini API
- **ElevenLabs** - Text-to-speech
- **Supabase** - Authentication
- **OpenStreetMap** - Map data

---

<div align="center">

**Built with ❤️ for HackTX**

</div>
