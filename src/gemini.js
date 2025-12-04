/**
 * Gemini API integration
 * https://ai.google.dev/api/rest/v1/models/generateContent
 */

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const MODEL = 'gemini-1.5-pro-latest';

/**
 * Call Gemini API with a prompt
 */
export async function callGemini(apiKey, prompt) {
  const url = `${GEMINI_API_BASE}/models/${MODEL}:generateContent?key=${apiKey}`;
  
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.3, // Lower temperature for more consistent, focused reviews
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    // Extract the text from the response
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('Unexpected response format from Gemini API');
    
  } catch (error) {
    if (error.message.includes('fetch')) {
      throw new Error('Network error: Could not reach Gemini API. Check your internet connection.');
    }
    throw error;
  }
}

/**
 * Validate API key format (basic check)
 */
export function validateApiKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }
  
  // Gemini API keys typically start with "AIza" and are 39 characters
  // This is a loose check - the API will validate properly
  return apiKey.length > 20;
}
