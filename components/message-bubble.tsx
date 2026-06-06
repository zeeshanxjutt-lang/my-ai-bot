'use client';

import { MessageActions } from './message-actions';

interface MessageBubbleProps {
  message: {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: number;
  };
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isBot = message.sender === 'bot';
  const date = new Date(message.timestamp);

  return (
    <div
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4 animate-fadeIn`}
    >
      <div
        className={`max-w-xs px-4 py-3 rounded-lg ${
          isBot
            ? 'bg-slate-700 text-white rounded-bl-none'
            : 'bg-blue-600 text-white rounded-br-none'
        }`}
      >
        <p className="text-sm leading-relaxed break-words">{message.text}</p>
        <span className="text-xs opacity-75 mt-1 block">
          {date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
        <MessageActions message={message.text} sender={message.sender} />
      </div>
    </div>
  );
}
