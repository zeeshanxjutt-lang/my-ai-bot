'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Plus, Settings, Trash2, Download } from 'lucide-react';
import { getConversations, deleteConversation, Conversation } from '@/lib/db-utils';

interface DrawerProps {
  currentConversationId: string;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onOpenSettings: () => void;
  onExport: () => void;
}

export function Drawer({
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onOpenSettings,
  onExport,
}: DrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    const convs = await getConversations();
    setConversations(convs);
  };

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this conversation?')) {
      await deleteConversation(id);
      await loadConversations();
      if (id === currentConversationId) {
        onNewChat();
      }
    }
  };

  return (
    <>
      {/* Drawer Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors lg:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white transform transition-transform duration-300 z-35 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:h-auto lg:w-64 lg:border-r lg:border-slate-700`}
      >
        <div className="p-4">
          <div className="mb-6 pt-12 lg:pt-0">
            <h2 className="text-lg font-bold mb-4">Support Bot</h2>
            <button
              onClick={() => {
                onNewChat();
                setIsOpen(false);
              }}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-4"
            >
              <Plus size={18} />
              New Chat
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase mb-2">
              Recent Conversations
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {conversations.length === 0 ? (
                <p className="text-xs text-slate-500">No conversations yet</p>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => {
                      onSelectConversation(conv.id);
                      setIsOpen(false);
                    }}
                    className={`p-2 rounded cursor-pointer transition-colors flex items-start justify-between group ${
                      conv.id === currentConversationId
                        ? 'bg-blue-600'
                        : 'hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate font-medium">{conv.title}</p>
                      <p className="text-xs text-slate-400">
                        {conv.messageCount} messages
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteConversation(conv.id, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4 space-y-2">
            <button
              onClick={() => {
                onExport();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm"
            >
              <Download size={16} />
              Export Chat
            </button>
            <button
              onClick={() => {
                onOpenSettings();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm"
            >
              <Settings size={16} />
              Settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
