'use client';

import { useState, useEffect } from 'react';
import { X, Moon, Sun, Trash2, Settings2 } from 'lucide-react';
import { getPreference, savePreference, deleteAllData } from '@/lib/db-utils';
import Link from 'next/link';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const mode = await getPreference('darkMode');
    const notif = await getPreference('notifications');
    if (mode !== undefined) setDarkMode(mode);
    if (notif !== undefined) setNotifications(notif);
  };

  const handleDarkModeChange = async (enabled: boolean) => {
    setDarkMode(enabled);
    await savePreference('darkMode', enabled);
  };

  const handleNotificationsChange = async (enabled: boolean) => {
    setNotifications(enabled);
    await savePreference('notifications', enabled);
  };

  const handleClearAllData = async () => {
    if (
      confirm(
        'This will delete all your conversations and data. This cannot be undone. Are you sure?'
      )
    ) {
      await deleteAllData();
      window.location.reload();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center justify-center">
      <div className="bg-slate-900 text-white rounded-t-2xl lg:rounded-lg w-full lg:max-w-md max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-700 sticky top-0 bg-slate-900">
          <h2 className="text-lg font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon size={20} className="text-blue-400" />
              ) : (
                <Sun size={20} className="text-yellow-400" />
              )}
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-xs text-slate-400">
                  {darkMode ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDarkModeChange(!darkMode)}
              className={`w-12 h-6 rounded-full transition-colors ${
                darkMode ? 'bg-blue-600' : 'bg-slate-600'
              }`}
            />
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between border-t border-slate-700 pt-4">
            <div>
              <p className="font-medium">Notifications</p>
              <p className="text-xs text-slate-400">
                {notifications ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <button
              onClick={() => handleNotificationsChange(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors ${
                notifications ? 'bg-blue-600' : 'bg-slate-600'
              }`}
            />
          </div>

          {/* Admin Control Room */}
          <div className="border-t border-slate-700 pt-4">
            <Link
              href="/admin"
              onClick={onClose}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Settings2 size={16} />
              Admin Control Room
            </Link>
          </div>

          {/* About */}
          <div className="border-t border-slate-700 pt-4">
            <p className="font-medium mb-2">About</p>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Support Bot v2.0</p>
              <p>Advanced Customer Support with Admin Control</p>
              <p>96,000+ knowledge base responses</p>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border-t border-slate-700 pt-4">
            <p className="font-medium mb-2 text-red-400">Danger Zone</p>
            <button
              onClick={handleClearAllData}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              Clear All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
