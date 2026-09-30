import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, RefreshCw, X, User } from 'lucide-react';
import axios from '@/lib/axios';

const STORAGE_KEY = 'lifedrop_ai_chat_history';

const DEFAULT_WELCOME_MESSAGE = {
  role: 'model',
  content: 'Assalam-o-Alaikum! 🩸 I am **LifeDrop AI**, your virtual blood health assistant. Ask me anything about blood donation eligibility, compatibility, or how to get emergency blood!',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

const QUICK_PROMPTS = [
  '🩺 Am I eligible to donate blood today?',
  '🩸 Who can receive O- blood?',
  '📦 What is current blood inventory?',
  '🚨 I need urgent blood. How does LifeDrop help?'
];

export default function AIChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not load chat history from localStorage:', e);
    }
    return [DEFAULT_WELCOME_MESSAGE];
  });
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll on new message or open
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Persist chat history to localStorage on update
  useEffect(() => {
    try {
      if (messages && messages.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      }
    } catch (e) {
      console.warn('Could not save chat history to localStorage:', e);
    }
  }, [messages]);

  const handleSend = async (textToSend = null) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isLoading) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await axios.post('/ai/chat', {
        message: messageText,
        history: historyPayload
      });

      if (res.data && res.data.success && res.data.data) {
        setMessages(prev => [
          ...prev,
          {
            role: 'model',
            content: res.data.data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error(res.data?.message || 'Failed to get response');
      }
    } catch (err) {
      console.error('Chatbot API Error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          content: 'Assalam-o-Alaikum! 🩸 Main **LifeDrop AI** hoon. Blood donation eligibility (age 18-65, weight ≥ 50kg, 90 days gap) ya emergency blood request ke baray mein aap mujh se mazeed pooch sakte hain!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    setMessages([
      {
        role: 'model',
        content: 'Assalam-o-Alaikum! 🩸 I am **LifeDrop AI**, your virtual blood health assistant. How can I assist you today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} className={line.startsWith('* ') || line.startsWith('- ') ? 'ml-2 my-0.5' : 'my-1'}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden">
      {/* Chat Window */}
      {isOpen && (
        <div className="flex h-[520px] w-[360px] sm:w-[400px] flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-4 py-3.5 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20 shadow-inner backdrop-blur-sm">
                <Bot className="h-5 w-5 text-white" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-red-600 bg-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-semibold text-sm">
                  <span>LifeDrop AI</span>
                </div>
                <p className="text-[11px] text-white/80">Virtual Blood & Health Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                title="Clear Chat History"
                className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close"
                className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/10 text-xs sm:text-sm">
            {messages.map((m, index) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={index}
                  className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400 font-bold text-xs">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 shadow-sm text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-red-600 text-white rounded-br-xs'
                        : 'bg-card border border-border text-card-foreground rounded-bl-xs'
                    }`}
                  >
                    <div>{renderFormattedText(m.content)}</div>
                    <span
                      className={`block mt-1 text-[10px] ${
                        isUser ? 'text-white/70 text-right' : 'text-muted-foreground'
                      }`}
                    >
                      {m.timestamp}
                    </span>
                  </div>

                  {isUser && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="rounded-2xl rounded-bl-xs border border-border bg-card px-4 py-2.5 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-red-500 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-red-500 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-red-500" />
                    <span className="ml-1 text-[11px] font-medium text-muted-foreground">LifeDrop AI thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div className="border-t border-border bg-muted/40 p-2.5">
              <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">Suggested questions:</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    disabled={isLoading}
                    className="rounded-full border border-border/80 bg-background px-2.5 py-1 text-[11px] font-medium text-foreground/80 hover:border-red-500 hover:text-red-600 transition-colors text-left cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-border bg-card p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about blood donation, eligibility..."
              disabled={isLoading}
              className="flex-1 rounded-xl border border-input bg-muted/30 px-3.5 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white shadow hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button (Visible only when chat is closed) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-red-500/40 cursor-pointer"
          aria-label="Open LifeDrop AI Assistant"
        >
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-rose-500 border-2 border-white" />
          </span>
          <div className="flex items-center justify-center">
            <Bot className="h-6 w-6 text-white group-hover:rotate-12 transition-transform" />
          </div>
        </button>
      )}
    </div>
  );
}
