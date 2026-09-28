import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  User,
  ShieldCheck,
  ChevronDown,
  BookOpen,
  Settings,
  Zap,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const SupportChatbot: React.FC = () => {
  const {
    isChatOpen,
    setIsChatOpen,
    chatMessages,
    isChatLoading,
    sendChatMessage,
    knowledgeBase,
    setIsTrainingModalOpen,
    n8nConfig,
    updateN8nConfig,
    testN8nConnection,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [showN8nInfo, setShowN8nInfo] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'Handcrafted pipe cleaner bouquets',
    'Custom 3D birthday cards & hampers',
    'Where is my shipment #AG-94812?',
    'Can I customize the calligraphy note?',
    'What promo codes can I use?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isChatOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isChatLoading) return;
    const msg = inputVal;
    setInputVal('');
    await sendChatMessage(msg);
  };

  const handleQuickQuestionClick = async (q: string) => {
    await sendChatMessage(q);
  };

  const handlePing = async () => {
    setIsPinging(true);
    setPingResult(null);
    const res = await testN8nConnection();
    setIsPinging(false);
    if (res.status === 'active') {
      setPingResult('Online & responding');
    } else if (res.status === 'inactive') {
      setPingResult('Workflow reached: activate toggle in n8n');
    } else {
      setPingResult(res.message || 'Error reaching webhook');
    }
  };

  const activeKnowledgeCount = knowledgeBase.filter((k) => k.active).length;

  return (
    <>
      {/* Floating Launcher Button */}
      {!isChatOpen && n8nConfig.widgetMode !== 'n8n_native' && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
          {/* Quick Train & n8n Pill Button */}
          <button
            onClick={() => setIsTrainingModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-white/95 hover:bg-white text-stone-800 text-xs font-semibold rounded-full shadow-lg border border-amber-300/80 backdrop-blur-md transition-all hover:scale-105"
            title="n8n Webhook & Training Center"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>n8n Webhook Active</span>
          </button>

          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-stone-900 hover:bg-stone-800 text-[#FAF8F5] p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl border border-stone-700/60 flex items-center gap-3 transition-transform hover:scale-105 group"
            aria-label="Open customer support chat"
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5 text-amber-300" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-stone-900 animate-pulse"></span>
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-semibold block leading-tight">Artisan Concierge</span>
              <span className="text-[10px] text-amber-200/80 block">Connected to n8n Cloud</span>
            </div>
          </button>
        </div>
      )}

      {/* Chat Window Drawer */}
      {isChatOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col h-[560px] max-h-[85vh] animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#1C1917] p-4 text-[#FAF8F5] flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-900/60 text-amber-200 flex items-center justify-center border border-amber-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold leading-tight">Aura Artisan Concierge</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-[10px] text-stone-300">Live AI · n8n Cloud Connected</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowN8nInfo(!showN8nInfo)}
                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-semibold ${
                  showN8nInfo ? 'bg-amber-500/20 text-amber-300' : 'text-stone-400 hover:text-white hover:bg-white/10'
                }`}
                title="View n8n Webhook Settings"
              >
                <Zap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">n8n</span>
              </button>
              <button
                onClick={() => setIsTrainingModalOpen(true)}
                className="p-1.5 text-amber-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                title="Train chatbot on website data"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Train</span>
              </button>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* n8n Webhook Dropdown Details */}
          {showN8nInfo && (
            <div className="bg-stone-900 text-stone-200 p-3 border-b border-stone-800 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>n8n Cloud Webhook</span>
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {n8nConfig.enabled ? 'Active' : 'Disabled'}
                </span>
              </div>
              <div className="font-mono text-[10px] text-stone-400 bg-black/40 p-2 rounded-lg break-all border border-stone-800">
                {n8nConfig.webhookUrl}
              </div>
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handlePing}
                  disabled={isPinging}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-[10px] transition-colors disabled:opacity-50"
                >
                  {isPinging ? 'Pinging...' : 'Ping Webhook'}
                </button>
                {pingResult && (
                  <span className="text-[10px] text-amber-200 truncate max-w-[200px]" title={pingResult}>
                    {pingResult}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Trained Knowledge & n8n Status Strip */}
          <div className="bg-amber-50/90 px-3.5 py-1.5 border-b border-amber-200/60 flex items-center justify-between text-[11px] text-amber-950">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>n8n Webhook + {activeKnowledgeCount} store topics</span>
            </div>
            <button
              onClick={() => setIsTrainingModalOpen(true)}
              className="text-amber-800 hover:text-amber-950 font-bold underline transition-colors"
            >
              Settings & Train
            </button>
          </div>

          {/* Inactive Workflow Notice (if n8n workflow isn't toggled to Active yet) */}
          {n8nConfig.lastStatus === 'inactive' && (
            <div className="bg-amber-100/90 border-b border-amber-300 p-2.5 text-[11px] text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">n8n Workflow Inactive:</span> In your n8n editor, toggle the switch in the top-right to <strong>Active</strong>. Store AI fallback is active in the meantime.
              </div>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF8F5]/50">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-stone-900 text-amber-300 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-stone-900 text-white rounded-tr-none'
                      : 'bg-white border border-stone-200/80 text-stone-800 rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div className="flex items-center justify-between mt-1 text-[9px] text-stone-400 gap-2">
                    {msg.sender === 'assistant' && (
                      <span className="font-mono text-[8px] uppercase tracking-wider text-amber-800 bg-amber-50 px-1 rounded">
                        {msg.source === 'n8n' ? 'via n8n' : msg.source === 'gemini' ? 'via gemini' : 'store data'}
                      </span>
                    )}
                    <span className="ml-auto">{msg.timestamp}</span>
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isChatLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg bg-stone-900 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-800 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-800 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-800 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Suggestion Chips */}
          <div className="px-3 py-2 bg-stone-100/90 border-t border-stone-200/60 overflow-x-auto scrollbar-none flex gap-1.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestionClick(q)}
                className="px-2.5 py-1 bg-white hover:bg-stone-50 border border-stone-200 rounded-full text-[11px] text-stone-700 whitespace-nowrap shadow-xs transition-colors flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask about bouquets, ribbons, delivery..."
              className="flex-1 px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-800 text-stone-900"
            />
            <button
              type="submit"
              disabled={isChatLoading || !inputVal.trim()}
              className="p-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl disabled:opacity-40 transition-colors shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 text-amber-300" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
