import { useState } from 'react';
import { Mic, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { sendMessageToGemini } from '../services/geminiService';
import { convertTextToSpeech, playAudio } from '../services/elevenlabsService';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Hi! Ask me anything about vehicle financing...');
  const [aiResponse, setAiResponse] = useState(''); // Store the AI's text response

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;

    const userQuestion = inputMessage;
    setInputMessage('');
    setIsProcessing(true);
    setStatusMessage('🤔 Thinking...');
    setAiResponse(''); // Clear previous response

    try {
      // Step 1: Get text response from Gemini
      console.log('📝 Getting response from Gemini...');
      const textResponse = await sendMessageToGemini(userQuestion);
      
      // Show the AI's response immediately
      setAiResponse(textResponse);
      setStatusMessage('🎙️ Generating voice...');
      
      // Step 2: Convert text to speech
      console.log('🎤 Converting to speech...');
      const audioStream = await convertTextToSpeech(textResponse);
      
      setIsProcessing(false);
      setIsSpeaking(true);
      setStatusMessage('🔊 Speaking...');
      
      // Step 3: Play the audio
      await playAudio(audioStream);
      
      setIsSpeaking(false);
      setStatusMessage('✅ Ask me another question!');
      
    } catch (error) {
      console.error('❌ Error:', error);
      setStatusMessage('❌ Sorry, I encountered an error. Please try again.');
      setIsProcessing(false);
      setIsSpeaking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Voice Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-all hover:scale-110 z-50"
        >
          <Mic className="w-6 h-6" />
        </button>
      )}

      {/* Voice Assistant Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-red-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5" />
              <div>
                <h3 className="font-semibold">Iota Voice Assistant</h3>
                <p className="text-xs text-red-100">Your Financial Expert</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-red-700 p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Voice Animation & Status */}
          <div className="p-8 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 min-h-[280px]">
            {/* Animated Avatar */}
            <div className="relative mb-6">
              {/* Outer pulse ring - animates when speaking */}
              {isSpeaking && (
                <>
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse opacity-30"></div>
                </>
              )}
              
              {/* Main avatar circle */}
              <div className={`relative w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-lg ${isSpeaking ? 'animate-pulse' : ''}`}>
                {isProcessing ? (
                  <Loader2 className="w-12 h-12 text-white animate-spin" />
                ) : isSpeaking ? (
                  <div className="flex gap-1 items-end h-8">
                    {/* Sound wave bars */}
                    <div className="w-1.5 bg-white rounded-full animate-sound-wave-1" style={{ height: '50%' }}></div>
                    <div className="w-1.5 bg-white rounded-full animate-sound-wave-2" style={{ height: '80%' }}></div>
                    <div className="w-1.5 bg-white rounded-full animate-sound-wave-3" style={{ height: '60%' }}></div>
                    <div className="w-1.5 bg-white rounded-full animate-sound-wave-2" style={{ height: '90%' }}></div>
                    <div className="w-1.5 bg-white rounded-full animate-sound-wave-1" style={{ height: '70%' }}></div>
                  </div>
                ) : (
                  <Mic className="w-12 h-12 text-white" />
                )}
              </div>
            </div>

            {/* Status Message */}
            <p className="text-center text-gray-700 font-medium mb-2">{statusMessage}</p>
            
            {/* AI Response Text */}
            {aiResponse && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-32 overflow-y-auto">
                <p className="text-sm text-gray-800 leading-relaxed">{aiResponse}</p>
              </div>
            )}
            
            {!aiResponse && (
              <p className="text-center text-sm text-gray-500">Type your question below</p>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Ask me anything..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isProcessing || isSpeaking}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isProcessing || isSpeaking}
                size="icon"
                className="bg-red-600 hover:bg-red-700"
              >
                <Mic className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for sound wave animation */}
      <style>{`
        @keyframes sound-wave-1 {
          0%, 100% { height: 30%; }
          50% { height: 70%; }
        }
        @keyframes sound-wave-2 {
          0%, 100% { height: 60%; }
          50% { height: 100%; }
        }
        @keyframes sound-wave-3 {
          0%, 100% { height: 40%; }
          50% { height: 80%; }
        }
        .animate-sound-wave-1 {
          animation: sound-wave-1 0.6s ease-in-out infinite;
        }
        .animate-sound-wave-2 {
          animation: sound-wave-2 0.8s ease-in-out infinite;
        }
        .animate-sound-wave-3 {
          animation: sound-wave-3 0.7s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
