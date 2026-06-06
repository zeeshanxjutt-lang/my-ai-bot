'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, RotateCcw, Send, WifiOff } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { MessageBubble } from './message-bubble';
import { ChatInput } from './chat-input';
import { Drawer } from './drawer';
import { Settings } from './settings';
import { QuickCategories } from './quick-categories';
import { InstallButton } from './install-button';
import {
  getBotResponse,
  loadBotDatabase,
} from '@/lib/chat-utils';
import {
  saveMessage,
  getMessages,
  saveConversation,
  getMessageCount,
  initDB,
  Message as DBMessage,
} from '@/lib/db-utils';

export function ChatWindow() {
  const [messages, setMessages] = useState<DBMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dbLoaded, setDbLoaded] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showCategories, setShowCategories] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize database and load chat
  useEffect(() => {
    const initChat = async () => {
      await initDB();
      await loadBotDatabase();

      const newConvId = uuidv4();
      setConversationId(newConvId);

      const welcomeMsg: DBMessage = {
        id: uuidv4(),
        text: 'Hello! 👋 Welcome to our customer support. I can help you with account issues, billing, subscriptions, technical problems, and more. What can I help you with today?',
        sender: 'bot',
        timestamp: Date.now(),
        conversationId: newConvId,
      };

      await saveMessage(welcomeMsg);
      await saveConversation({
        id: newConvId,
        title: 'New Conversation',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messageCount: 1,
      });

      setMessages([welcomeMsg]);
      setDbLoaded(true);
    };

    initChat();

    // Handle online/offline
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));

    return () => {
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || !dbLoaded || !conversationId) return;

    setShowCategories(false);

    const userMsg: DBMessage = {
      id: uuidv4(),
      text: userMessage,
      sender: 'user',
      timestamp: Date.now(),
      conversationId,
    };

    setMessages((prev) => [...prev, userMsg]);
    await saveMessage(userMsg);
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const botResponse = await getBotResponse(userMessage);
      const botMsg: DBMessage = {
        id: uuidv4(),
        text: botResponse,
        sender: 'bot',
        timestamp: Date.now(),
        conversationId,
      };

      setMessages((prev) => [...prev, botMsg]);
      await saveMessage(botMsg);

      const msgCount = await getMessageCount(conversationId);
      await saveConversation({
        id: conversationId,
        title: userMessage.substring(0, 50),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messageCount: msgCount,
      });
    } catch (error) {
      console.log('[v0] Error getting bot response:', error);
      const errorMsg: DBMessage = {
        id: uuidv4(),
        text: 'Sorry, I encountered an issue. Please try again.',
        sender: 'bot',
        timestamp: Date.now(),
        conversationId,
      };
      setMessages((prev) => [...prev, errorMsg]);
      await saveMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    const newConvId = uuidv4();
    setConversationId(newConvId);
    setMessages([]);
    setShowCategories(true);

    const welcomeMsg: DBMessage = {
      id: uuidv4(),
      text: 'New conversation started. How can I help you?',
      sender: 'bot',
      timestamp: Date.now(),
      conversationId: newConvId,
    };

    saveMessage(welcomeMsg);
    saveConversation({
      id: newConvId,
      title: 'New Conversation',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messageCount: 1,
    });

    setMessages([welcomeMsg]);
  };

  const handleSelectConversation = async (id: string) => {
    setConversationId(id);
    const msgs = await getMessages(id);
    setMessages(msgs);
    setShowCategories(false);
  };

  const handleClearChat = () => {
    handleNewChat();
  };

  const handleExport = () => {
    const data = {
      conversationId,
      messages,
      exportedAt: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white overflow-hidden">
      <Drawer
        currentConversationId={conversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onOpenSettings={() => setShowSettings(true)}
        onExport={handleExport}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden lg:ml-64">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 p-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-full p-2">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Support Bot</h1>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>24/7 Support</span>
                {!isOnline && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <WifiOff size={12} />
                      Offline Mode
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleClearChat}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            title="Clear chat"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && showCategories && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <MessageCircle className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Start a Conversation</h2>
                <p className="text-slate-400 text-sm">
                  Choose a category or type your question below
                </p>
              </div>
              <QuickCategories onSelect={handleSendMessage} />
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-700 rounded-lg rounded-bl-none px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  />
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>

      {/* Settings Modal */}
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* Install Button */}
      <InstallButton />
    </div>
  );
}
