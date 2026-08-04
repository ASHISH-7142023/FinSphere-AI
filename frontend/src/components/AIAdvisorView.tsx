"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: "user" | "advisor";
  text: string;
  timestamp: string;
  insight?: {
    label: string;
    value: string;
    title: string;
    subtitle: string;
  };
  action?: {
    type: string;
    payload: any;
    executed?: boolean;
  };
}

export default function AIAdvisorView({ session, onRefreshData }: { session?: any; onRefreshData?: () => Promise<void> }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputText("");
    setIsTyping(true);

    if (session?.token) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"}/advisor/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.token}`
          },
          body: JSON.stringify({ messages: nextMessages })
        });
        
        if (!response.ok) {
          throw new Error("Chat request failed");
        }

        const data = await response.json();
        setIsTyping(false);
        if (data?.message) {
          const advisorMsg: Message = {
            id: (Date.now() + 1).toString(),
            sender: "advisor",
            text: data.message.text,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            insight: data.message.insight || undefined,
            action: data.message.action || undefined,
          };
          setMessages((prev) => [...prev, advisorMsg]);
          return;
        }
      } catch (err) {
        console.error("Backend chat failed, falling back to local fallback:", err);
      }
    }

    // Local simulation fallback
    setTimeout(() => {
      setIsTyping(false);
      let replyText = "I've analyzed your financial query. Let's optimize your tax brackets and allocation mix.";
      let insightData;
      let actionData;

      const lower = textToSend.toLowerCase();
      if (lower.includes("portfolio") || lower.includes("stock") || lower.includes("invest")) {
        replyText = "Your equity portfolio is currently showing a 62% concentration. I recommend rebalancing 5% into debt or bonds to buffer against index volatility.";
        insightData = {
          label: "Risk Index",
          value: "Balanced",
          title: "Volatility Rating",
          subtitle: "Optimized allocation",
        };
      } else if (lower.includes("tax") || lower.includes("save")) {
        replyText = "Using tax-loss harvesting, we can offset ₹8,200 in short-term capital gains by booking carry-forward losses this cycle. This will save ₹2,460.";
        insightData = {
          label: "Potential Saving",
          value: "₹2,460",
          title: "Direct Tax Saving",
          subtitle: "FY2026 Strategy",
        };
      } else if (lower.includes("budget") || lower.includes("expense")) {
        replyText = "Your food and entertainment spending is currently tracking 14% higher than your optimal target. Restricting dining out to twice a week will save ₹4,500/mo.";
        insightData = {
          label: "Monthly Buffer",
          value: "+₹4,500",
          title: "Budget Optimization",
          subtitle: "Available surplus",
        };
      }

      const advisorReply: Message = {
        id: (Date.now() + 1).toString(),
        sender: "advisor",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        insight: insightData,
        action: actionData,
      };

      setMessages((prev) => [...prev, advisorReply]);
    }, 1500);
  };

  const quickPrompts = [
    { text: "Analyze my portfolio risk", icon: "analytics" },
    { text: "Optimize my tax-loss harvesting", icon: "percent" },
    { text: "Set savings budget strategy", icon: "payments" },
    { text: "Detailed growth forecast", icon: "monitoring" },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-10rem)] w-full rounded-3xl border border-white/10 bg-surface/20 backdrop-blur-xl relative overflow-hidden">
      
      {/* Advisor Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-surface-container/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center relative">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              smart_toy
            </span>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-primary border-2 border-surface animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-headline-md text-base font-bold text-white leading-tight">FinSphere AI Strategist</h3>
            <span className="text-[10px] text-primary uppercase font-bold tracking-wider">Active Analysis Online</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg hover:bg-white/5 text-on-surface-variant hover:text-white transition-colors" title="Clear History" onClick={handleClearHistory}>
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
          <button className="p-2 rounded-lg hover:bg-white/5 text-on-surface-variant hover:text-white transition-colors" title="Download Report" onClick={handleDownloadChat}>
            <span className="material-symbols-outlined text-[20px]">download</span>
          </button>
        </div>
      </div>

      {/* Messages Canvas */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-20 opacity-60 max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-surface-container-high border border-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                smart_toy
              </span>
            </div>
            <h4 className="font-headline-md text-lg text-on-surface font-semibold">Your Financial Strategist</h4>
            <p className="font-body-md text-sm text-on-surface-variant">
              Ask about your assets, tax saving strategies, budget optimizations, or growth projections. Click a prompt below to start.
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-4 items-start ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-9 h-9 rounded-xl bg-primary-container flex-shrink-0 flex items-center justify-center mt-1 glow-pulse">
                    <span className="material-symbols-outlined text-on-primary-container text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      smart_toy
                    </span>
                  </div>
                )}
                
                <div className={`flex flex-col max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-5 py-3.5 rounded-2xl ${
                      isUser
                        ? "user-bubble rounded-tr-none text-white text-sm"
                        : "ai-bubble rounded-tl-none text-on-surface text-sm space-y-4 relative overflow-hidden"
                    }`}
                  >
                    {!isUser && (
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary to-transparent opacity-40"></div>
                    )}
                    <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                    
                    {msg.insight && (
                      <div className="glass-card rounded-xl p-4 border border-white/10 flex items-center justify-between gap-4 bg-background/35 mt-2 bg-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-[18px]">speed</span>
                          </div>
                          <div>
                            <p className="text-[9px] font-label-sm text-on-surface-variant uppercase tracking-wider">{msg.insight.label}</p>
                            <p className="font-headline-md text-base text-primary font-bold">{msg.insight.value}</p>
                          </div>
                        </div>
                        <div className="text-right text-xs">
                          <p className="font-semibold text-on-surface">{msg.insight.title}</p>
                          <p className="text-[10px] text-on-surface-variant">{msg.insight.subtitle}</p>
                        </div>
                      </div>
                    )}

                    {msg.action && (
                      <div className="glass-card rounded-xl p-4 border border-white/10 flex flex-col gap-3 bg-white/5 mt-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-[18px]">
                              {msg.action.type === "SHIFT_BUDGET" ? "rule" : msg.action.type === "ADD_EXPENSE" ? "receipt_long" : msg.action.type === "MUTUAL_FUND_REBALANCE" ? "balance" : "stars"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">
                              AI Suggested Optimization
                            </p>
                            <p className="text-xs text-on-surface">
                              {msg.action.type === "SHIFT_BUDGET" && `Shift budget limit for ${msg.action.payload.category}`}
                              {msg.action.type === "ADD_EXPENSE" && `Record target savings offset transaction`}
                              {msg.action.type === "CREATE_GOAL" && `Commit to target goal: ${msg.action.payload.title}`}
                              {msg.action.type === "MUTUAL_FUND_REBALANCE" && "Rebalance portfolio allocations"}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleExecuteAction(msg.id, msg.action!)}
                          disabled={msg.action.executed || executingId === msg.id}
                          className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            msg.action.executed
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                              : "bg-primary text-on-primary hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99]"
                          }`}
                        >
                          {executingId === msg.id ? (
                            <>
                              <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                              Executing...
                            </>
                          ) : msg.action.executed ? (
                            <>
                              <span className="material-symbols-outlined text-sm">check_circle</span>
                              Executed & Synced
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-sm">bolt</span>
                              Approve & Execute Optimization
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-on-surface-variant mt-1.5 opacity-55">
                    {msg.timestamp} {isUser ? "• Sent" : "• FinSphere Intelligence"}
                  </span>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-surface-container border border-white/5 flex-shrink-0 flex items-center justify-center mt-1">
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">person</span>
                  </div>
                )}
              </motion.div>
            );
          })}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 items-start justify-start"
            >
              <div className="w-9 h-9 rounded-xl bg-primary-container flex-shrink-0 flex items-center justify-center mt-1 glow-pulse">
                <span className="material-symbols-outlined text-on-primary-container text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  smart_toy
                </span>
              </div>
              <div className="ai-bubble rounded-2xl rounded-tl-none px-5 py-4 text-on-surface-variant text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-150"></span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-300"></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Prompts and Input Bar */}
      <div className="p-4 border-t border-white/10 bg-surface-container/20">
        <div className="max-w-3xl mx-auto space-y-4">
          
          {/* Quick chip buttons */}
          <div className="flex flex-wrap gap-2 justify-start no-scrollbar overflow-x-auto pb-1">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt.text)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-surface-container hover:bg-primary/10 hover:border-primary/30 text-xs text-on-surface-variant hover:text-primary transition-all active:scale-95 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[14px]">{prompt.icon}</span>
                <span>{prompt.text}</span>
              </button>
            ))}
          </div>

          {/* Chat text input prompt box */}
          <div className="glass-card rounded-2xl p-1.5 flex items-center gap-2 shadow-2xl focus-within:ring-1 focus-within:ring-primary/40 transition-all bg-background/45 border-white/5">
            <button className="p-2.5 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center" onClick={() => showToast("Attachment upload is limited to PDF/CSV in Elite tier.")}>
              <span className="material-symbols-outlined text-[20px]">attach_file</span>
            </button>
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none"
              placeholder="Ask about your investments, taxes, or budget..."
              type="text"
            />
            <button className="p-2.5 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center" onClick={() => showToast("Microphone voice recognition requires Pro Tier access.")}>
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>
            <button
              onClick={() => handleSend()}
              className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined font-bold text-[18px]">arrow_upward</span>
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-24 left-1/2 transform -translate-x-1/2 px-5 py-3 rounded-xl bg-surface-container-highest/90 border border-primary/30 text-xs font-semibold text-primary shadow-2xl flex items-center gap-2 backdrop-blur-md z-50 text-center max-w-sm"
          >
            <span className="material-symbols-outlined text-primary text-base">info</span>
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
