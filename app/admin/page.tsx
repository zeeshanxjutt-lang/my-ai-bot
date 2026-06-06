'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLogin } from '@/components/admin-login';
import { ResponseList } from '@/components/response-list';
import { ResponseEditor } from '@/components/response-editor';
import { ImportExport } from '@/components/import-export';
import { isAdminAuthenticated, logoutAdmin } from '@/lib/admin-auth';
import {
  getAllResponses,
  saveResponse,
  deleteResponse,
  importResponses,
  BotResponse,
} from '@/lib/db-utils';
import { LogOut, Plus, Search, Download } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [responses, setResponses] = useState<BotResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [editingResponse, setEditingResponse] = useState<BotResponse | undefined>();
  const [showEditor, setShowEditor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAdminAuthenticated()) {
        setIsAuthenticated(true);
        await loadResponses();
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const loadResponses = async () => {
    try {
      const data = await getAllResponses();
      setResponses(data);
    } catch (error) {
      console.error('Failed to load responses:', error);
    }
  };

  const handleLoginSuccess = async () => {
    setIsAuthenticated(true);
    await loadResponses();
  };

  const handleNewResponse = () => {
    setEditingResponse(undefined);
    setShowEditor(true);
  };

  const handleEditResponse = (response: BotResponse) => {
    setEditingResponse(response);
    setShowEditor(true);
  };

  const handleSaveResponse = async (response: BotResponse) => {
    try {
      await saveResponse(response);
      await loadResponses();
      setShowEditor(false);
      setEditingResponse(undefined);
    } catch (error) {
      alert('Failed to save response');
    }
  };

  const handleDeleteResponse = async (id: string) => {
    try {
      await deleteResponse(id);
      await loadResponses();
    } catch (error) {
      alert('Failed to delete response');
    }
  };

  const handleImport = async (newResponses: BotResponse[]) => {
    try {
      await importResponses(newResponses);
      await loadResponses();
      alert(`Successfully imported ${newResponses.length} responses!`);
    } catch (error) {
      alert('Failed to import responses');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    router.push('/');
  };

  const handleExportLocal = async () => {
    try {
      const jsonString = JSON.stringify(responses, null, 2);
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

  const categories = Array.from(new Set(responses.map((r) => r.category)));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Control Room</h1>
            <p className="text-slate-400 text-sm">Manage bot responses and configurations</p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-3">Statistics</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Total Responses</span>
                  <span className="text-2xl font-bold text-blue-400">{responses.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Categories</span>
                  <span className="text-2xl font-bold text-green-400">{categories.length}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleNewResponse}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New Response
            </button>

            <button
              onClick={handleExportLocal}
              disabled={responses.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              Export All
            </button>

            {/* Import/Export */}
            <ImportExport onImport={handleImport} totalResponses={responses.length} />
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search responses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setCategoryFilter('')}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      categoryFilter === ''
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        categoryFilter === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Response List */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Bot Responses ({responses.length})
              </h3>
              <ResponseList
                responses={responses}
                onEdit={handleEditResponse}
                onDelete={handleDeleteResponse}
                filter={searchQuery}
                categoryFilter={categoryFilter}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Response Editor Modal */}
      {showEditor && (
        <ResponseEditor
          response={editingResponse}
          categories={categories}
          onSave={handleSaveResponse}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
}
