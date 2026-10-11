import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  ExternalLink,
  Briefcase,
  FileText,
  Building2,
  DollarSign,
  Mic,
  Copy,
  Check,
  RefreshCw,
  Search,
} from "lucide-react";
import { ChatMessage, Job, ResumeData } from "../../types";
import { streamAgentChat } from "../../services/gemini";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export const ChatView: React.FC = () => {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "assistant",
      content: `Namaste **${profile.displayName || "Candidate"}**! I'm **CareerPilot AI**, your dedicated career copilot for the Indian tech market. 

I can find matching roles across Bengaluru, Hyderabad, Pune, Mumbai, and Tier-2 hubs, evaluate your ATS resume score, benchmark compensation in **LPA**, and research startup cultures with verified sources.

What can I assist you with today?`,
      timestamp: "Just now",
      toolCalls: [
        { toolName: "Job Search", summary: "Loaded 30 Indian tech openings (Bengaluru, Hyderabad, Pune, Tier-2)" }
      ],
      sources: [
        { title: "Adzuna India Endpoint", url: "https://www.adzuna.in", note: "Live tech salary indexes" },
        { title: "Candidate Profile (PII Masked)", note: "Safe processing" }
      ]
    }
  ]);

  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [resume, setResume] = useState<ResumeData | null>(null);

  useEffect(() => {
    async function initContext() {
      const [jList, rData] = await Promise.all([
        api.searchJobs({ userProfile: profile }),
        api.getResume(),
      ]);
      setJobs(jList);
      setResume(rData);
    }
    initContext();
  }, [profile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  const suggestionChips = [
    "Find backend jobs in Hyderabad, 12+ LPA, 30-day notice",
    "Score my resume against Swiggy's Backend Engineer role",
    "Tell me about Razorpay's funding, culture, and tech stack",
    "How to negotiate from 18 LPA to 24 LPA as a 2.5 yr dev?",
    "Give me 3 STAR behavioral interview questions for Full Stack",
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isGenerating) return;

    setInput("");
    const userMsgId = "msg-" + Date.now();
    const assistantMsgId = "msg-" + (Date.now() + 1);

    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMsgId,
        sender: "user",
        content: textToSend,
        timestamp: "Just now",
      },
      {
        id: assistantMsgId,
        sender: "assistant",
        content: "",
        timestamp: "Just now",
        isStreaming: true,
      },
    ];

    setMessages(newMessages);
    setIsGenerating(true);

    try {
      const history = messages.map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        content: m.content,
      }));

      const contextData = {
        resume: resume || (await api.getResume()),
        jobs: jobs.length > 0 ? jobs : await api.searchJobs({ userProfile: profile }),
      };

      const result = await streamAgentChat(
        textToSend,
        history,
        contextData,
        (chunk) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId ? { ...m, content: chunk } : m
            )
          );
        }
      );

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                content: result.fullText,
                toolCalls: result.toolCalls,
                sources: result.sources,
                isStreaming: false,
              }
            : m
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                content: "I encountered a transient error processing your request. Please check your query or retry in a moment.",
                isStreaming: false,
              }
            : m
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getToolIcon = (name: string) => {
    switch (name) {
      case "Job Search":
        return <Briefcase className="w-3 h-3 text-[#3B3FD8]" />;
      case "Resume Studio":
        return <FileText className="w-3 h-3 text-[#14B8A6]" />;
      case "Company Intel":
        return <Building2 className="w-3 h-3 text-[#FFB020]" />;
      case "Salary Benchmark":
        return <DollarSign className="w-3 h-3 text-emerald-500" />;
      default:
        return <Sparkles className="w-3 h-3 text-indigo-400" />;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] bg-white dark:bg-[#111C44] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in">
      {/* Top Bar inside Chat */}
      <div className="px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#0B1437]/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3B3FD8] to-[#14B8A6] flex items-center justify-center text-white shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
              LangGraph Agent Orchestrator
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-[#3B3FD8] dark:bg-indigo-950 dark:text-indigo-300">
                Gemini Flash
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Parallel tool routing: Adzuna + JSearch + Resume Engine + AmbitionBox
            </p>
          </div>
        </div>

        {/* Privacy Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>PII Masked before LLM</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.sender === "user" ? "ml-auto justify-end" : "mr-auto"
            }`}
          >
            {msg.sender === "assistant" && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3B3FD8] to-[#14B8A6] text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`space-y-2.5 ${msg.sender === "user" ? "items-end" : "items-start"}`}>
              {/* Tool Execution Chips (Blueprint feature) */}
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {msg.toolCalls.map((t, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-[11px] text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {getToolIcon(t.toolName)}
                      <span className="font-semibold text-slate-900 dark:text-white">{t.toolName}:</span>
                      <span className="text-slate-500 dark:text-slate-400 truncate max-w-xs">{t.summary}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Message Content Bubble */}
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-[#3B3FD8] text-white shadow-md rounded-tr-sm"
                    : "bg-slate-50 dark:bg-[#0B1437] text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800/80 rounded-tl-sm whitespace-pre-line"
                }`}
              >
                {msg.content ? (
                  <div>{msg.content}</div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-400 py-1">
                    <span className="w-2 h-2 rounded-full bg-[#3B3FD8] animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-[#FFB020] animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-xs font-medium">Orchestrating career tools...</span>
                  </div>
                )}
              </div>

              {/* Citations & Sources (Blueprint requirement) */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="p-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 max-w-md">
                  <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <span>Sources & Evidence:</span>
                  </div>
                  <div className="space-y-0.5">
                    {msg.sources.map((s, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]"></span>
                        {s.url ? (
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#3B3FD8] dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                          >
                            <span>{s.title}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <span>{s.title}</span>
                        )}
                        {s.note && <span className="text-slate-400 text-[10px]">({s.note})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Actions */}
              {msg.sender === "assistant" && msg.content && (
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[11px] flex items-center gap-1"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {msg.sender === "user" && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0B1437]/30 overflow-x-auto flex gap-2 no-scrollbar">
        {suggestionChips.map((chip, idx) => (
          <button
            key={idx}
            disabled={isGenerating}
            onClick={() => handleSend(chip)}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 hover:border-[#3B3FD8] dark:hover:border-indigo-500 text-slate-700 dark:text-slate-300 hover:text-[#3B3FD8] text-xs font-medium transition-all shadow-xs cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything: e.g. 'Find backend roles in Hyderabad with 14+ LPA, 30 days notice...'"
              className="w-full pl-4 pr-10 py-3 text-xs sm:text-sm rounded-2xl bg-slate-100 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800 focus:border-[#3B3FD8] focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 resize-none max-h-32"
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="w-11 h-11 rounded-2xl bg-[#3B3FD8] hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-2 text-center text-[10px] text-slate-400">
          CareerPilot AI can make mistakes. Always verify salary ranges with official offers. PII is masked before analysis.
        </div>
      </div>
    </div>
  );
};

export default ChatView;
