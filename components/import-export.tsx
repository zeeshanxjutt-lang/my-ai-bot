'use client';

import { Download, Upload } from 'lucide-react';
import { useRef } from 'react';
import { BotResponse } from '@/lib/db-utils';

interface ImportExportProps {
  onImport: (responses: BotResponse[]) => void;
  totalResponses: number;
}

export function ImportExport({ onImport, totalResponses }: ImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      // Get all responses from IndexedDB
      const response = await fetch('/api/admin/export');
      const data = await response.json();

      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bot-responses-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export responses');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const responses = JSON.parse(text) as BotResponse[];

      if (!Array.isArray(responses)) {
        throw new Error('Invalid format: expected an array of responses');
      }

      // Validate structure
      const isValid = responses.every(
        (r) =>
          r.keywords &&
          Array.isArray(r.keywords) &&
          r.response &&
          typeof r.response === 'string' &&
          r.category &&
          typeof r.category === 'string'
      );

      if (!isValid) {
        throw new Error('Invalid response format');
      }

      onImport(responses);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      alert(`Failed to import: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
      <h3 className="text-lg font-bold text-white mb-4">Import / Export</h3>

      <div className="space-y-3">
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-300 text-sm mb-3">
            Total Responses: <span className="font-bold text-blue-400">{totalResponses}</span>
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleExport}
              disabled={totalResponses === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export as JSON
            </button>

            <button
              onClick={handleImportClick}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
              Import JSON
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
          <p className="text-xs text-slate-400">
            Export your responses as a JSON file for backup or sharing. Import a JSON file to add multiple responses at once.
          </p>
        </div>
      </div>
    </div>
  );
}
