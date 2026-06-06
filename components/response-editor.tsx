'use client';

import { BotResponse } from '@/lib/db-utils';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface ResponseEditorProps {
  response?: BotResponse;
  categories: string[];
  onSave: (response: BotResponse) => void;
  onClose: () => void;
}

const DEFAULT_CATEGORIES = [
  'account',
  'password',
  'billing',
  'subscription',
  'technical',
  'feature',
  'support',
  'security',
];

export function ResponseEditor({
  response,
  categories,
  onSave,
  onClose,
}: ResponseEditorProps) {
  const [formData, setFormData] = useState<Partial<BotResponse>>(
    response || {
      id: uuidv4(),
      keywords: [],
      response: '',
      category: 'support',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  );

  const [keywordInput, setKeywordInput] = useState('');

  const handleAddKeyword = () => {
    if (keywordInput.trim() && formData.keywords) {
      if (!formData.keywords.includes(keywordInput.trim())) {
        setFormData({
          ...formData,
          keywords: [...formData.keywords, keywordInput.trim()],
        });
      }
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    if (formData.keywords) {
      setFormData({
        ...formData,
        keywords: formData.keywords.filter((kw) => kw !== keyword),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.response?.trim() || !formData.keywords?.length) {
      alert('Please fill in response text and add at least one keyword');
      return;
    }

    const completeResponse: BotResponse = {
      id: formData.id || uuidv4(),
      keywords: formData.keywords,
      response: formData.response,
      category: formData.category || 'support',
      createdAt: formData.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    onSave(completeResponse);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-2xl w-full my-8 shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h3 className="text-xl font-bold text-white">
            {response ? 'Edit Response' : 'New Response'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Category
            </label>
            <select
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {DEFAULT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Response Text
            </label>
            <textarea
              value={formData.response || ''}
              onChange={(e) => setFormData({ ...formData, response: e.target.value })}
              placeholder="Enter the bot response..."
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Keywords (for matching user queries)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                placeholder="Add keyword and press Enter"
                className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.keywords?.map((kw) => (
                <div
                  key={kw}
                  className="bg-blue-900 bg-opacity-40 border border-blue-600 text-blue-200 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {kw}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(kw)}
                    className="hover:text-blue-100 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
            >
              {response ? 'Update Response' : 'Create Response'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
