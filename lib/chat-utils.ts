import type { Message } from './types';
import { getAllResponses, searchResponses, BotResponse } from './db-utils';

let responseDatabase: any = null;
let idbResponses: BotResponse[] | null = null;

// Load the bot response database from JSON
export async function loadBotDatabase() {
  if (responseDatabase) return responseDatabase;

  try {
    // Try loading 10k responses first, fall back to smaller database
    let response = await fetch('/bot-responses-10k.json');
    if (!response.ok) {
      response = await fetch('/bot-responses-full.json');
    }
    const data = await response.json();
    responseDatabase = data;
    return data;
  } catch (error) {
    console.log('[v0] Could not load bot database, using fallback');
    return null;
  }
}

// Load responses from IndexedDB
export async function loadIDBResponses() {
  if (idbResponses !== null) return idbResponses;

  try {
    idbResponses = await getAllResponses();
    return idbResponses;
  } catch (error) {
    console.log('[v0] Could not load IDB responses');
    return [];
  }
}

// Find matching responses from IDB
async function findMatchingResponsesIDB(userInput: string): Promise<string[]> {
  try {
    const matches = await searchResponses(userInput);
    if (matches.length > 0) {
      return [matches[0].response];
    }
  } catch (error) {
    console.log('[v0] IDB search failed');
  }
  return [];
}

// Find matching responses based on user input
function findMatchingResponses(userInput: string, database: any): string[] {
  if (!database || !database.responses) return [];

  const userKeywords = userInput.toLowerCase().split(/\s+/);
  const matches: any[] = [];

  // Search through database for keyword matches
  for (const item of database.responses) {
    if (!item.keywords) continue;

    const matchCount = userKeywords.filter((keyword) =>
      item.keywords.some(
        (k: string) =>
          k.toLowerCase().includes(keyword) ||
          (keyword.length > 3 && k.toLowerCase().startsWith(keyword))
      )
    ).length;

    if (matchCount > 0) {
      matches.push({ ...item, score: matchCount });
    }

    if (matches.length >= 5) break; // Limit search for performance
  }

  return matches.length > 0
    ? [matches[0].response]
    : ["I'm not sure about that. Could you please provide more details?"];
}

// Get bot response based on user message (tries IDB first, then JSON)
export async function getBotResponse(userMessage: string): Promise<string> {
  // First try to get from IndexedDB (admin-managed responses)
  const idbMatches = await findMatchingResponsesIDB(userMessage);
  if (idbMatches.length > 0) {
    return idbMatches[0];
  }

  // Fall back to JSON database
  const database = responseDatabase || (await loadBotDatabase());

  if (!database) {
    // Fallback responses if database is not available
    const fallbacks = [
      'Thank you for your message! Our support team will help you shortly.',
      "I'm here to help! Can you tell me more about your question?",
      'Your request is important to us. Please describe what you need assistance with.',
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  const matches = findMatchingResponses(userMessage, database);
  return matches[0] || 'How can I assist you further?';
}

// Format message for display
export function formatMessage(text: string): string {
  return text.trim();
}

// Create a message object
export function createMessage(content: string, sender: 'user' | 'bot'): Message {
  return {
    id: Date.now().toString(),
    content,
    sender,
    timestamp: new Date(),
  };
}
