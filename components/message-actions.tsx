'use client';

import { useState } from 'react';
import { Copy, CheckCircle2, ThumbsUp, ThumbsDown } from 'lucide-react';

interface MessageActionsProps {
  message: string;
  sender: 'user' | 'bot';
}

export function MessageActions({ message, sender }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState<'up' | 'down' | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (sender === 'user') return null;

  return (
    <div className="flex items-center gap-2 mt-2">
      <button
        onClick={handleCopy}
        className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs"
        title="Copy message"
      >
        {copied ? (
          <>
            <CheckCircle2 size={14} />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy size={14} />
            <span>Copy</span>
          </>
        )}
      </button>

      <div className="flex items-center gap-1 ml-auto">
        <button
          onClick={() => setRating(rating === 'up' ? null : 'up')}
          className={`transition-colors ${
            rating === 'up'
              ? 'text-green-400'
              : 'text-slate-400 hover:text-green-400'
          }`}
          title="Helpful"
        >
          <ThumbsUp size={14} />
        </button>
        <button
          onClick={() => setRating(rating === 'down' ? null : 'down')}
          className={`transition-colors ${
            rating === 'down'
              ? 'text-red-400'
              : 'text-slate-400 hover:text-red-400'
          }`}
          title="Not helpful"
        >
          <ThumbsDown size={14} />
        </button>
      </div>
    </div>
  );
}
