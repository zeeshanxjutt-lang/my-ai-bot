'use client';

import { BotResponse } from '@/lib/db-utils';
import { Edit, Trash2, Tag } from 'lucide-react';
import { useState } from 'react';

interface ResponseListProps {
  responses: BotResponse[];
  onEdit: (response: BotResponse) => void;
  onDelete: (id: string) => void;
  filter: string;
  categoryFilter: string;
}

export function ResponseList({
  responses,
  onEdit,
  onDelete,
  filter,
  categoryFilter,
}: ResponseListProps) {
  const filteredResponses = responses.filter((resp) => {
    const matchesSearch =
      resp.keywords.some((kw) => kw.toLowerCase().includes(filter.toLowerCase())) ||
      resp.response.toLowerCase().includes(filter.toLowerCase());

    const matchesCategory = !categoryFilter || resp.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  if (filteredResponses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No responses found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredResponses.map((response) => (
        <div
          key={response.id}
          className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-blue-400" />
                <span className="px-2 py-1 bg-blue-900 bg-opacity-40 text-blue-300 text-xs rounded-full">
                  {response.category}
                </span>
              </div>
              <p className="text-slate-200 font-medium text-sm line-clamp-2">
                {response.response}
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEdit(response)}
                className="p-2 hover:bg-slate-700 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm('Delete this response?')) {
                    onDelete(response.id);
                  }
                }}
                className="p-2 hover:bg-slate-700 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">Keywords:</p>
              <div className="flex flex-wrap gap-1">
                {response.keywords.slice(0, 3).map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded"
                  >
                    {kw}
                  </span>
                ))}
                {response.keywords.length > 3 && (
                  <span className="px-2 py-1 bg-slate-700 text-slate-400 text-xs rounded">
                    +{response.keywords.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-3">
            Updated: {new Date(response.updatedAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
