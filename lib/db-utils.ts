import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
  conversationId: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messageCount: number;
}

export interface BotResponse {
  id: string;
  keywords: string[];
  response: string;
  category: string;
  createdAt: number;
  updatedAt: number;
}

export interface ChatDBSchema extends DBSchema {
  messages: {
    key: string;
    value: Message;
    indexes: { 'by-conversation': string; 'by-timestamp': number };
  };
  conversations: {
    key: string;
    value: Conversation;
    indexes: { 'by-updatedAt': number };
  };
  preferences: {
    key: string;
    value: any;
  };
  responses: {
    key: string;
    value: BotResponse;
    indexes: { 'by-category': string; 'by-timestamp': number };
  };
}

let db: IDBPDatabase<ChatDBSchema> | null = null;

export async function initDB() {
  if (db) return db;

  db = await openDB<ChatDBSchema>('chat-support-db', 1, {
    upgrade(db) {
      // Messages store
      if (!db.objectStoreNames.contains('messages')) {
        const messageStore = db.createObjectStore('messages', { keyPath: 'id' });
        messageStore.createIndex('by-conversation', 'conversationId');
        messageStore.createIndex('by-timestamp', 'timestamp');
      }

      // Conversations store
      if (!db.objectStoreNames.contains('conversations')) {
        const convStore = db.createObjectStore('conversations', { keyPath: 'id' });
        convStore.createIndex('by-updatedAt', 'updatedAt');
      }

      // Preferences store
      if (!db.objectStoreNames.contains('preferences')) {
        db.createObjectStore('preferences', { keyPath: 'key' });
      }

      // Responses store
      if (!db.objectStoreNames.contains('responses')) {
        const responseStore = db.createObjectStore('responses', { keyPath: 'id' });
        responseStore.createIndex('by-category', 'category');
        responseStore.createIndex('by-timestamp', 'updatedAt');
      }
    },
  });

  return db;
}

export async function saveMessage(message: Message) {
  const database = await initDB();
  await database.put('messages', message);
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const database = await initDB();
  const allMessages = await database.getAllFromIndex('messages', 'by-conversation', conversationId);
  return allMessages.sort((a, b) => a.timestamp - b.timestamp);
}

export async function getMessageCount(conversationId: string): Promise<number> {
  const database = await initDB();
  return database.countFromIndex('messages', 'by-conversation', conversationId);
}

export async function deleteMessages(conversationId: string) {
  const database = await initDB();
  const messages = await getMessages(conversationId);
  for (const msg of messages) {
    await database.delete('messages', msg.id);
  }
}

export async function saveConversation(conversation: Conversation) {
  const database = await initDB();
  await database.put('conversations', conversation);
}

export async function getConversations(): Promise<Conversation[]> {
  const database = await initDB();
  const allConvs = await database.getAll('conversations');
  return allConvs.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function deleteConversation(conversationId: string) {
  const database = await initDB();
  await deleteMessages(conversationId);
  await database.delete('conversations', conversationId);
}

export async function savePreference(key: string, value: any) {
  const database = await initDB();
  await database.put('preferences', { key, value });
}

export async function getPreference(key: string) {
  const database = await initDB();
  const pref = await database.get('preferences', key);
  return pref?.value;
}

export async function deleteAllData() {
  const database = await initDB();
  await database.clear('messages');
  await database.clear('conversations');
  await database.clear('preferences');
}

// Response Management Functions
export async function saveResponse(response: BotResponse) {
  const database = await initDB();
  await database.put('responses', response);
}

export async function getResponse(id: string): Promise<BotResponse | undefined> {
  const database = await initDB();
  return database.get('responses', id);
}

export async function getAllResponses(): Promise<BotResponse[]> {
  const database = await initDB();
  return database.getAll('responses');
}

export async function getResponsesByCategory(category: string): Promise<BotResponse[]> {
  const database = await initDB();
  return database.getAllFromIndex('responses', 'by-category', category);
}

export async function deleteResponse(id: string) {
  const database = await initDB();
  await database.delete('responses', id);
}

export async function searchResponses(query: string): Promise<BotResponse[]> {
  const database = await initDB();
  const allResponses = await database.getAll('responses');
  const lowerQuery = query.toLowerCase();

  return allResponses.filter(
    (resp) =>
      resp.keywords.some((kw) => kw.toLowerCase().includes(lowerQuery)) ||
      resp.response.toLowerCase().includes(lowerQuery) ||
      resp.category.toLowerCase().includes(lowerQuery)
  );
}

export async function importResponses(responses: BotResponse[]) {
  const database = await initDB();
  const tx = database.transaction('responses', 'readwrite');

  for (const response of responses) {
    await tx.store.put(response);
  }

  await tx.done;
}

export async function exportResponses(): Promise<BotResponse[]> {
  return getAllResponses();
}
