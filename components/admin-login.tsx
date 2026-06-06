'use client';

import { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';
import { validateAdminPassword, createAdminSession } from '@/lib/admin-auth';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      if (validateAdminPassword(password)) {
        createAdminSession();
        setPassword('');
        onLoginSuccess();
      } else {
        setError('Invalid password. Please try again.');
      }
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full shadow-xl border border-slate-700">
        <div className="flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-white">Admin Control Room</h2>
        </div>

        <p className="text-slate-400 text-sm mb-6 text-center">
          Enter your admin password to access the control room
        </p>

        {error && (
          <div className="bg-red-900 bg-opacity-20 border border-red-600 rounded-lg p-3 mb-4 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              disabled={isLoading}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-colors"
          >
            {isLoading ? 'Verifying...' : 'Access Control Room'}
          </button>
        </form>

        <p className="text-xs text-slate-500 mt-4 text-center">
          Demo password: admin123
        </p>
      </div>
    </div>
  );
}
