/**
 * Gemini Service
 * Handles communication with the backend API for chatbot functionality
 */

const API_BASE_URL = 'http://localhost:3001';

/**
 * Send a message to the Gemini AI chatbot through the backend
 * @param message - The user's message/question
 * @returns The AI's text response
 */
export async function sendMessageToGemini(message: string): Promise<string> {
  try {
    console.log('📤 Sending message to backend:', message);

    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.response) {
      throw new Error('Invalid response format from backend');
    }

    console.log('📥 Received response from backend:', data.response);
    return data.response;

  } catch (error) {
    console.error('❌ Error calling Gemini API:', error);
    
    // Fallback response
    return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or contact our support team for immediate assistance.";
  }
}
