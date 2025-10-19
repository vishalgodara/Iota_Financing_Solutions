/**
 * ElevenLabs Service
 * Handles text-to-speech conversion through backend API
 */

const API_BASE_URL = 'http://localhost:3001';

/**
 * Convert text to speech using ElevenLabs API via backend
 * @param text - The text to convert to speech
 * @returns ArrayBuffer containing the audio data
 */
export async function convertTextToSpeech(text: string): Promise<ArrayBuffer> {
  try {
    console.log('🎤 Requesting text-to-speech from backend...');

    const response = await fetch(`${API_BASE_URL}/api/text-to-speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // If no audio (API key not configured), return empty buffer
    if (!data.audio) {
      console.warn('⚠️ Voice feature not available');
      return new ArrayBuffer(0);
    }

    // Convert base64 to ArrayBuffer
    const binaryString = atob(data.audio);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    console.log('✅ Audio received from backend');
    return bytes.buffer;

  } catch (error) {
    console.error('❌ Error converting text to speech:', error);
    return new ArrayBuffer(0);
  }
}

/**
 * Play audio from an ArrayBuffer
 * @param audioData - The audio data to play
 */
export async function playAudio(audioData: ArrayBuffer): Promise<void> {
  // If empty buffer (no API key or error), just log the text response
  if (audioData.byteLength === 0) {
    console.log('🔇 Audio playback skipped (no audio data)');
    return;
  }

  try {
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(audioData);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    
    return new Promise((resolve) => {
      source.onended = () => {
        audioContext.close();
        resolve();
      };
      source.start(0);
    });

  } catch (error) {
    console.error('❌ Error playing audio:', error);
  }
}
