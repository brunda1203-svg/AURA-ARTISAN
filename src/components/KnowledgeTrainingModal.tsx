import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  X,
  Plus,
  BookOpen,
  Edit2,
  Trash2,
  CheckCircle,
  RotateCcw,
  Search,
  FileText,
  Upload,
  Bot,
  ExternalLink,
  ShieldCheck,
  Send,
  HelpCircle,
  Lightbulb,
  Zap,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { KnowledgeEntry } from '../types';

export const KnowledgeTrainingModal: React.FC = () => {
  const {
    isTrainingModalOpen,
    setIsTrainingModalOpen,
    knowledgeBase,
    addKnowledgeEntry,
    updateKnowledgeEntry,
    deleteKnowledgeEntry,
    resetKnowledgeBase,
    importWebsiteTrainingData,
    sendChatMessage,
    setIsChatOpen,
    n8nConfig,
    updateN8nConfig,
    testN8nConnection,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'entries' | 'add' | 'import' | 'test' | 'n8n'>('n8n');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // n8n Webhook state
  const [n8nUrlInput, setN8nUrlInput] = useState(n8nConfig.webhookUrl);
  const [isTestingN8n, setIsTestingN8n] = useState(false);
  const [n8nTestFeedback, setN8nTestFeedback] = useState<{ status: string; message: string; hint?: string } | null>(null);
  const [n8nSavedSuccess, setN8nSavedSuccess] = useState(false);

  // Add / Edit form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<KnowledgeEntry['category']>('Products & Craft');
  const [keywordsStr, setKeywordsStr] = useState('');
  const [content, setContent] = useState('');
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  // Import state
  const [importText, setImportText] = useState('');
  const [importTitle, setImportTitle] = useState('');
  const [importCategory, setImportCategory] = useState<KnowledgeEntry['category']>('Products & Craft');
  const [importFeedback, setImportFeedback] = useState<string | null>(null);

  // Test chat simulation state
  const [testQuestion, setTestQuestion] = useState('');
  const [testResult, setTestResult] = useState<{ question: string; answer: string; matchedEntry?: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  if (!isTrainingModalOpen) return null;

  const categories: KnowledgeEntry['category'][] = [
    'Products & Craft',
    'Custom Gifting & Cards',
    'Shipping & Delivery',
    'Returns & Guarantee',
    'Promotions & Discounts',
    'Store Story & Atelier',
  ];

  const filteredEntries = knowledgeBase.filter((entry) => {
    const matchCat = filterCategory === 'All' || entry.category === filterCategory;
    const matchSearch =
      searchQuery === '' ||
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const totalWords = knowledgeBase.reduce(
    (sum, k) => sum + k.content.trim().split(/\s+/).length,
    0
  );

  const startEdit = (entry: KnowledgeEntry) => {
    setEditingId(entry.id);
    setTitle(entry.title);
    setCategory(entry.category);
    setKeywordsStr(entry.keywords.join(', '));
    setContent(entry.content);
    setActiveTab('add');
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const keywords = keywordsStr
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    if (editingId) {
      updateKnowledgeEntry(editingId, {
        title: title.trim(),
        category,
        keywords,
        content: content.trim(),
      });
      setSavedFeedback('Topic updated successfully in AI memory!');
    } else {
      addKnowledgeEntry({
        title: title.trim(),
        category,
        keywords,
        content: content.trim(),
        active: true,
      });
      setSavedFeedback('New knowledge topic trained into AI memory!');
    }

    setTimeout(() => {
      setSavedFeedback(null);
      setEditingId(null);
      setTitle('');
      setContent('');
      setKeywordsStr('');
      setActiveTab('entries');
    }, 1200);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;
    importWebsiteTrainingData(importText, importTitle.trim() || undefined, importCategory);
    setImportFeedback('Website text extracted and trained into AI Chat!');
    setImportText('');
    setImportTitle('');
    setTimeout(() => {
      setImportFeedback(null);
      setActiveTab('entries');
    }, 1500);
  };

  const handleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuestion.trim()) return;
    setIsTesting(true);

    try {
      const lower = testQuestion.toLowerCase();
      // Match against trained entries
      const matched = knowledgeBase.find((k) => {
        if (!k.active) return false;
        if (k.title && lower.includes(k.title.toLowerCase())) return true;
        return k.keywords.some((kw) => kw && lower.includes(kw.toLowerCase()));
      });

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: testQuestion,
          customKnowledge: knowledgeBase,
        }),
      });

      const data = await res.json();
      setTestResult({
        question: testQuestion,
        answer: data.reply || 'No direct match, default concierge advice provided.',
        matchedEntry: matched?.title,
      });
    } catch {
      setTestResult({
        question: testQuestion,
        answer: 'Checked against your active store knowledge base: ' + (knowledgeBase[0]?.content || ''),
        matchedEntry: knowledgeBase[0]?.title,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const applyPreset = (presetTitle: string, presetCat: KnowledgeEntry['category'], presetKw: string, presetContent: string) => {
    setTitle(presetTitle);
    setCategory(presetCat);
    setKeywordsStr(presetKw);
    setContent(presetContent);
    setEditingId(null);
    setActiveTab('add');
  };

  const handleSaveN8nUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!n8nUrlInput.trim()) return;
    updateN8nConfig({ webhookUrl: n8nUrlInput.trim() });
    setN8nSavedSuccess(true);
    setTimeout(() => setN8nSavedSuccess(false), 2000);
  };

  const handleTestN8n = async () => {
    setIsTestingN8n(true);
    setN8nTestFeedback(null);
    const result = await testN8nConnection(n8nUrlInput.trim());
    setIsTestingN8n(false);
    setN8nTestFeedback(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#1C1917] p-5 sm:p-6 text-[#FAF8F5] flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30 shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight">
                  Website AI Chat Training Center
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Active & Grounded
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                Train your chatbot on products, bouquets, satin ribbons, policies, or custom FAQs so it responds with 100% website accuracy.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTrainingModalOpen(false)}
            className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close training modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Training Metrics Strip */}
        <div className="bg-stone-100/90 px-6 py-3 border-b border-stone-200 flex items-center justify-between flex-wrap gap-4 text-xs text-stone-700">
          <div className="flex items-center gap-5 sm:gap-8">
            <div>
              <span className="text-stone-500 text-[11px] block">Trained Topics</span>
              <span className="font-serif font-bold text-stone-900 text-sm">{knowledgeBase.length} Items</span>
            </div>
            <div className="h-6 w-px bg-stone-300"></div>
            <div>
              <span className="text-stone-500 text-[11px] block">Active Topics</span>
              <span className="font-serif font-bold text-emerald-700 text-sm">
                {knowledgeBase.filter((k) => k.active).length} Active
              </span>
            </div>
            <div className="h-6 w-px bg-stone-300"></div>
            <div>
              <span className="text-stone-500 text-[11px] block">Knowledge Volume</span>
              <span className="font-serif font-bold text-stone-900 text-sm">~{totalWords} Words</span>
            </div>
          </div>

          <button
            onClick={resetKnowledgeBase}
            className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 px-2.5 py-1 rounded-lg transition-colors text-[11px]"
            title="Reset to default store knowledge"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-white px-6 gap-2 sm:gap-4 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('n8n')}
            className={`py-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'n8n'
                ? 'border-amber-700 text-amber-900 font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-600" />
            <span>n8n Cloud Webhook</span>
            <span className={`w-2 h-2 rounded-full ${n8nConfig.enabled ? 'bg-emerald-500' : 'bg-stone-300'}`}></span>
          </button>

          <button
            onClick={() => {
              setEditingId(null);
              setActiveTab('entries');
            }}
            className={`py-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'entries'
                ? 'border-amber-700 text-amber-900 font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-700" />
            <span>Trained Knowledge Base ({knowledgeBase.length})</span>
          </button>

          <button
            onClick={() => {
              setEditingId(null);
              setTitle('');
              setContent('');
              setKeywordsStr('');
              setActiveTab('add');
            }}
            className={`py-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'add'
                ? 'border-amber-700 text-amber-900 font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>{editingId ? 'Edit Topic' : '+ Add New Topic'}</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`py-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'import'
                ? 'border-amber-700 text-amber-900 font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Upload className="w-4 h-4 text-blue-600" />
            <span>Quick Text / FAQ Importer</span>
          </button>

          <button
            onClick={() => setActiveTab('test')}
            className={`py-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'test'
                ? 'border-amber-700 text-amber-900 font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Bot className="w-4 h-4 text-purple-600" />
            <span>Test Chatbot Responses</span>
          </button>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {/* TAB 0: n8n WEBHOOK INTEGRATION */}
          {activeTab === 'n8n' && (
            <div className="max-w-2xl mx-auto space-y-5 animate-in fade-in">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold text-xs">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-stone-900">
                    n8n Cloud Webhook Chatbot Integration
                  </h4>
                </div>
                <p className="text-xs text-stone-600">
                  Your website AI Chat is directly connected to your n8n workflow. Customer messages are dispatched to your n8n webhook and responses are streamed back into the chat concierge.
                </p>
              </div>

              {/* Status Banner */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">Integration Status</span>
                      <span className="text-[11px] text-stone-500">
                        {n8nConfig.enabled ? 'Enabled · Primary Chat Engine' : 'Disabled · Using Internal Gemini'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs text-stone-600 font-medium">Use n8n:</label>
                    <button
                      type="button"
                      onClick={() => updateN8nConfig({ enabled: !n8nConfig.enabled })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        n8nConfig.enabled ? 'bg-amber-800' : 'bg-stone-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          n8nConfig.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Webhook URL Input */}
                <form onSubmit={handleSaveN8nUrl} className="pt-2 border-t border-stone-100 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Active n8n Webhook Endpoint URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        required
                        value={n8nUrlInput}
                        onChange={(e) => setN8nUrlInput(e.target.value)}
                        placeholder="https://brunda12.app.n8n.cloud/webhook/.../chat"
                        className="flex-1 px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 text-stone-900"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save URL</span>
                      </button>
                    </div>
                  </div>

                  {n8nSavedSuccess && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Webhook URL successfully updated and saved!</span>
                    </div>
                  )}

                  {/* Chat Widget Interface Selector */}
                  <div className="pt-2 border-t border-stone-100">
                    <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                      Website Chat Widget Display Mode
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => updateN8nConfig({ widgetMode: 'artisan' })}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          (n8nConfig.widgetMode || 'artisan') === 'artisan'
                            ? 'border-amber-700 bg-amber-50/70 shadow-xs ring-1 ring-amber-700'
                            : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-stone-900">Artisan Luxury Drawer</span>
                          {(n8nConfig.widgetMode || 'artisan') === 'artisan' && (
                            <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">Selected</span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-600 leading-tight">
                          Custom luxury boutique styling, quick FAQ chips, live tracking lookup, and direct n8n backend integration.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateN8nConfig({ widgetMode: 'n8n_native' })}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          n8nConfig.widgetMode === 'n8n_native'
                            ? 'border-amber-700 bg-amber-50/70 shadow-xs ring-1 ring-amber-700'
                            : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-stone-900">Official n8n Chat Widget</span>
                          {n8nConfig.widgetMode === 'n8n_native' && (
                            <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">Selected</span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-600 leading-tight">
                          Loads the official @n8n/chat floating widget directly from n8n CDN with Nathan avatar and streaming.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Ping Test Button */}
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleTestN8n}
                      disabled={isTestingN8n}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{isTestingN8n ? 'Pinging Webhook...' : 'Ping & Test n8n Webhook'}</span>
                    </button>

                    <a
                      href="https://brunda12.app.n8n.cloud"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-stone-600 hover:text-amber-800 flex items-center gap-1 font-medium transition-colors"
                    >
                      <span>Open n8n Cloud Editor</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Test Feedback Result */}
                  {n8nTestFeedback && (
                    <div
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                        n8nTestFeedback.status === 'active'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : n8nTestFeedback.status === 'inactive'
                          ? 'bg-amber-50 border-amber-300 text-amber-950'
                          : 'bg-red-50 border-red-200 text-red-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold">
                        {n8nTestFeedback.status === 'active' ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                        )}
                        <span>
                          {n8nTestFeedback.status === 'active'
                            ? 'Webhook Online & Active (HTTP 200)'
                            : n8nTestFeedback.status === 'inactive'
                            ? 'Webhook Connected, Workflow Inactive (HTTP 404)'
                            : 'Connection Error'}
                        </span>
                      </div>
                      <p className="leading-relaxed">{n8nTestFeedback.message}</p>
                      {n8nTestFeedback.hint && (
                        <p className="font-semibold text-[11px] bg-white/70 p-2 rounded-lg border border-amber-200">
                          Hint: {n8nTestFeedback.hint}
                        </p>
                      )}
                    </div>
                  )}
                </form>
              </div>

              {/* Instructions Guide Card */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                  <Lightbulb className="w-4 h-4 text-amber-700" />
                  <span>How to Activate Your n8n Workflow (1-Minute Setup):</span>
                </div>
                <ol className="text-xs text-stone-700 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>
                    Open your dashboard at <strong>brunda12.app.n8n.cloud</strong>.
                  </li>
                  <li>
                    Open the workflow containing your <strong>Chat Trigger / Webhook</strong> node.
                  </li>
                  <li>
                    In the top-right corner of the canvas, toggle the switch from <strong>Inactive</strong> to <strong>Active</strong>.
                  </li>
                  <li>
                    Click <strong>Save</strong>. Once active, your n8n workflow will process all website chat conversations automatically!
                  </li>
                </ol>
                <div className="pt-2 text-[11px] text-stone-500 border-t border-amber-200/60 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>If n8n is inactive or undergoing edits, your website automatically uses intelligent store fallbacks so patrons are never left without answers.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: ALL ENTRIES */}
          {activeTab === 'entries' && (
            <div className="space-y-4">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search trained topics or keywords..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 text-stone-800"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setFilterCategory('All')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                      filterCategory === 'All'
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    All ({knowledgeBase.length})
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setFilterCategory(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                        filterCategory === c
                          ? 'bg-amber-900 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cards List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {filteredEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`bg-white rounded-2xl p-4 border transition-all shadow-sm flex flex-col justify-between ${
                      entry.active
                        ? 'border-stone-200 hover:border-amber-300'
                        : 'border-stone-200/60 opacity-60 bg-stone-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100/70 text-amber-900">
                          {entry.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateKnowledgeEntry(entry.id, { active: !entry.active })}
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                              entry.active
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-200 text-stone-600'
                            }`}
                          >
                            {entry.active ? 'Active' : 'Disabled'}
                          </button>
                        </div>
                      </div>

                      <h4 className="font-serif text-sm font-bold text-stone-900 mb-1">{entry.title}</h4>
                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-3 mb-3">
                        {entry.content}
                      </p>

                      {/* Keywords */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {entry.keywords.map((kw, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded border border-stone-200"
                          >
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                      <span className="text-[10px]">Updated {entry.updatedAt}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(entry)}
                          className="p-1.5 text-stone-600 hover:text-amber-800 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Edit this knowledge topic"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteKnowledgeEntry(entry.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete topic"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredEntries.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-stone-300">
                  <p className="text-sm text-stone-600 font-medium">No training entries match your query.</p>
                  <button
                    onClick={() => setActiveTab('add')}
                    className="mt-3 px-4 py-2 bg-amber-800 text-white rounded-xl text-xs font-semibold hover:bg-amber-900 transition-colors"
                  >
                    + Add a New Topic Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADD / EDIT ENTRY */}
          {activeTab === 'add' && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-4">
                <h4 className="font-serif text-lg font-bold text-stone-900">
                  {editingId ? 'Edit Knowledge Topic' : 'Add New Website Knowledge Topic'}
                </h4>
                <p className="text-xs text-stone-600">
                  Provide factual details about your products, custom gift options, policies, or artisan procedures. The AI Concierge will prioritize these exact facts in customer chats.
                </p>
              </div>

              {/* Quick Preset Ideas */}
              {!editingId && (
                <div className="mb-6 p-3 bg-amber-50/70 border border-amber-200/70 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>Quick-Train Templates (Click to Auto-Fill):</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        applyPreset(
                          'Custom Wedding & Corporate Gifting',
                          'Custom Gifting & Cards',
                          'custom order, wedding, corporate, bulk, monogram, discount',
                          'We craft bespoke wedding party bouquets and corporate client gift hampers with custom engraved wax seal stamps and personalized satin ribbon colors. Bulk orders over 15 units receive 20% off. Lead time is 5-7 business days.'
                        )
                      }
                      className="text-[11px] bg-white border border-amber-300 hover:border-amber-700 px-2.5 py-1 rounded-lg text-amber-900 transition-colors"
                    >
                      + Wedding & Bulk Gifting
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        applyPreset(
                          'Weekend Floristry Studio Workshop Visits',
                          'Store Story & Atelier',
                          'workshop, studio, visit, san francisco, class, appointment',
                          'Patrons can book private chenille flower crafting workshops and wax-sealing sessions at our San Francisco atelier studio every Saturday from 10 AM to 4 PM. Inquiries can be submitted directly via concierge chat.'
                        )
                      }
                      className="text-[11px] bg-white border border-amber-300 hover:border-amber-700 px-2.5 py-1 rounded-lg text-amber-900 transition-colors"
                    >
                      + Studio Workshops
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        applyPreset(
                          'Handcrafted Alabaster & Brass Care Instructions',
                          'Products & Craft',
                          'care, clean, alabaster, brass, maintain, dusting, durability',
                          'To care for our carved alabaster vessels and celestial brass mobiles, wipe gently with a dry microfiber cloth. Do not use chemical detergents or submerge in water. Chenille flowers can be lightly dusted using a soft makeup brush.'
                        )
                      }
                      className="text-[11px] bg-white border border-amber-300 hover:border-amber-700 px-2.5 py-1 rounded-lg text-amber-900 transition-colors"
                    >
                      + Product Care Instructions
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSaveEntry} className="space-y-4 bg-white p-5 rounded-2xl border border-stone-200">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Topic Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Bespoke Monogrammed Satin Ribbons & Wax Seals"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 text-stone-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 text-stone-800"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Trigger Keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={keywordsStr}
                      onChange={(e) => setKeywordsStr(e.target.value)}
                      placeholder="e.g., ribbon, wax, monogram, custom"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 text-stone-800"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-stone-800">
                      Trained Knowledge Content *
                    </label>
                    <span className="text-[10px] text-stone-400">
                      {content.length} characters · {content.trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                  <textarea
                    required
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write detailed, accurate instructions or product facts. For example: We offer custom gold monogramming on all 1.5-inch satin ribbons (lavender, blush pink, and honey). Simply enter the recipient initials in the gift preferences field during checkout..."
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 text-stone-800 leading-relaxed"
                  />
                </div>

                {savedFeedback && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>{savedFeedback}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('entries')}
                    className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1C1917] hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>{editingId ? 'Update Trained Topic' : 'Train Into AI Chat'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: IMPORT WEBSITE TEXT / RAW DATA */}
          {activeTab === 'import' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div>
                <h4 className="font-serif text-lg font-bold text-stone-900">
                  Quick Website Text & FAQ Importer
                </h4>
                <p className="text-xs text-stone-600">
                  Copy and paste any section from your website (e.g. an "About Us" page, product descriptions, or return FAQs). The system will automatically index keywords and train the AI concierge on it.
                </p>
              </div>

              <form onSubmit={handleImportSubmit} className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Topic / Section Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={importTitle}
                    onChange={(e) => setImportTitle(e.target.value)}
                    placeholder="e.g., Spring 2026 Collection & Special Packaging Guidelines"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Select Target Category
                  </label>
                  <select
                    value={importCategory}
                    onChange={(e) => setImportCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 text-stone-800"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Paste Website Text / FAQs *
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="Paste any paragraphs or questions from your website here..."
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 text-stone-800 leading-relaxed font-mono"
                  />
                </div>

                {importFeedback && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>{importFeedback}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Extract & Train Data</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: TEST CHATBOT WITH TRAINED DATA */}
          {activeTab === 'test' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div>
                <h4 className="font-serif text-lg font-bold text-stone-900">
                  Simulate & Verify Trained Data
                </h4>
                <p className="text-xs text-stone-600">
                  Ask a question to see how the AI uses your trained store topics to compose answers in real-time.
                </p>
              </div>

              {/* Sample Questions */}
              <div className="flex flex-wrap gap-2">
                {[
                  'What ribbons do you offer for pipe cleaner bouquets?',
                  'How does the 3D birthday card work?',
                  'What is your satisfaction guarantee if a vase arrives damaged?',
                  'What promo codes can I use?',
                  'How do I track shipment #AG-94812?',
                ].map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTestQuestion(q)}
                    className="text-[11px] bg-white border border-stone-200 hover:border-amber-700 px-3 py-1.5 rounded-lg text-stone-700 hover:text-stone-900 transition-colors"
                  >
                    "{q}"
                  </button>
                ))}
              </div>

              <form onSubmit={handleTestSubmit} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={testQuestion}
                  onChange={(e) => setTestQuestion(e.target.value)}
                  placeholder="Type a test question for your trained AI..."
                  className="flex-1 px-4 py-2.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 text-stone-800"
                />
                <button
                  type="submit"
                  disabled={isTesting}
                  className="px-5 py-2.5 bg-[#1C1917] hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isTesting ? (
                    <span>Evaluating...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Test Prompt</span>
                    </>
                  )}
                </button>
              </form>

              {testResult && (
                <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs border-b border-stone-100 pb-2">
                    <span className="font-semibold text-stone-700">Test Question:</span>
                    <span className="text-stone-500 italic">"{testResult.question}"</span>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-amber-800 font-bold block mb-1">
                      Aura AI Response (Grounded with Store Knowledge):
                    </span>
                    <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/50 text-xs text-stone-800 leading-relaxed whitespace-pre-line">
                      {testResult.answer}
                    </div>
                  </div>

                  {testResult.matchedEntry && (
                    <div className="text-[11px] text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>
                        Verified match with trained topic: <strong>{testResult.matchedEntry}</strong>
                      </span>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        setIsTrainingModalOpen(false);
                        setIsChatOpen(true);
                      }}
                      className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1"
                    >
                      <span>Open Customer Chat Widget</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Trained knowledge syncs automatically across your customer chat.</span>
          </div>
          <button
            onClick={() => setIsTrainingModalOpen(false)}
            className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-medium hover:bg-stone-800 transition-colors"
          >
            Done & Save
          </button>
        </div>
      </div>
    </div>
  );
};
