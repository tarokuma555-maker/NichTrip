"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useAuth } from "@/components/AuthProvider";
import LocaleSwitcher from "@/components/LocaleSwitcher";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const CHAT_USAGE_KEY = "animetrips_chat_usage";
const CHAT_FREE_LIMIT = 1;

function getChatUsageLocal(): { month: string; count: number } {
  try {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const raw = localStorage.getItem(CHAT_USAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.month === currentMonth) {
        return { month: currentMonth, count: data.count ?? 0 };
      }
    }
    return { month: currentMonth, count: 0 };
  } catch {
    return { month: "", count: 0 };
  }
}

function incrementChatUsageLocal(): void {
  try {
    const usage = getChatUsageLocal();
    localStorage.setItem(
      CHAT_USAGE_KEY,
      JSON.stringify({ month: usage.month, count: usage.count + 1 })
    );
  } catch {}
}

export default function ChatPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Chat");
  const { isPro } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [error, setError] = useState("");
  const [chatUsed, setChatUsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // マウント時にローカル使用量チェック
  useEffect(() => {
    if (!isPro) {
      const usage = getChatUsageLocal();
      if (usage.count >= CHAT_FREE_LIMIT) {
        setLimitReached(true);
      }
    }
  }, [isPro]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!limitReached) {
      inputRef.current?.focus();
    }
  }, [limitReached]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading || limitReached) return;

    setInput("");
    setError("");

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, locale }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === "CHAT_LIMIT_EXCEEDED") {
          setLimitReached(true);
          setError("");
        } else {
          setError(data.error ?? t("error"));
        }
        setLoading(false);
        return;
      }

      setMessages([...newMessages, { role: "assistant", content: data.reply }]);

      // 最初の応答時にlocalStorage使用量を記録 + 制限を設定
      if (!chatUsed && !isPro) {
        incrementChatUsageLocal();
        setChatUsed(true);
        // 1回の会話が完了したら、次の送信を制限
        setLimitReached(true);
      }
    } catch {
      setError(t("networkError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b-2 border-white/10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-white/40 hover:text-white/60 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-black text-white">{t("title")}</h1>
            <p className="text-[10px] text-white/30 font-bold">{t("subtitle")}</p>
          </div>
          {!isPro && (
            <span className={`text-[10px] font-bold border px-2 py-1 ${
              limitReached
                ? "text-red-400 border-red-500/30"
                : "text-white/30 border-white/10"
            }`}>
              {limitReached ? t("freeUsed") : t("freeCount")}
            </span>
          )}
          {isPro && (
            <span className="text-[10px] text-emerald-400 font-bold border border-emerald-500/30 px-2 py-1">
              {t("proUnlimited")}
            </span>
          )}
          <LocaleSwitcher />
        </div>
      </header>

      {/* メッセージエリア */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pb-44">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          {/* 初期メッセージ（制限未到達時） */}
          {messages.length === 0 && !limitReached && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-lg font-black text-white mb-2">{t("pilgrimageChat")}</h2>
              <p className="text-sm text-white/40 mb-6 max-w-sm mx-auto">
                {t("chatDesc")}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {([
                  { key: "suggestion1" as const, text: t("suggestion1") },
                  { key: "suggestion2" as const, text: t("suggestion2") },
                  { key: "suggestion3" as const, text: t("suggestion3") },
                ]).map((q) => (
                  <button
                    key={q.key}
                    onClick={() => {
                      setInput(q.text);
                      inputRef.current?.focus();
                    }}
                    className="text-xs text-white/50 border border-white/10 px-3 py-2 hover:border-red-500/30 hover:text-red-400 transition-colors"
                  >
                    {q.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 制限到達時（初回ページ表示で既に使用済み） */}
          {messages.length === 0 && limitReached && (
            <div className="py-8">
              <ProUpgradeCard router={router} />
            </div>
          )}

          {/* メッセージ一覧 */}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-red-500 text-white border-2 border-red-400/30"
                    : "bg-white/5 text-white/80 border-2 border-white/10"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
              </div>
            </div>
          ))}

          {/* ローディング */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/5 border-2 border-white/10 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-red-500 animate-pulse" />
                  <div className="w-2 h-2 bg-red-500 animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 bg-red-500 animate-pulse" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          )}

          {/* エラー表示 */}
          {error && (
            <div className="bg-red-500/10 border-2 border-red-500/30 px-4 py-3 text-sm text-red-400 font-bold">
              {error}
            </div>
          )}

          {/* Pro誘導（会話後に制限到達） */}
          {limitReached && messages.length > 0 && (
            <ProUpgradeCard router={router} />
          )}
        </div>
      </div>

      {/* 入力エリア */}
      {!limitReached && (
        <div className="fixed bottom-24 left-0 right-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-sm border-t-2 border-white/10 pb-[env(safe-area-inset-bottom)]">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("inputPlaceholder")}
                disabled={loading}
                className="flex-1 bg-white/5 border-2 border-white/10 text-white text-sm font-medium
                           placeholder:text-white/30 px-4 py-3
                           focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20
                           transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="shrink-0 bg-red-500 text-white px-4 py-3 border-2 border-red-400/30
                           hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* Pro誘導カード */
function ProUpgradeCard({ router }: { router: ReturnType<typeof useRouter> }) {
  const t = useTranslations("Chat");
  return (
    <div className="bg-gradient-to-r from-red-500/10 to-red-900/10 border-2 border-red-500/30 p-6 text-center">
      <span className="inline-block bg-red-500 text-white text-[10px] font-black tracking-[0.3em] px-3 py-1.5 mb-4">
        PRO PLAN
      </span>
      <h3 className="text-base font-black text-white mb-2">
        {t("limitTitle")}
      </h3>
      <p className="text-sm text-white/40 mb-5">
        {t("limitDesc")}
      </p>
      <button
        onClick={() => router.push("/pricing")}
        className="inline-flex items-center gap-2 bg-red-500 text-white text-sm font-black
                   px-8 py-3 border-2 border-red-400/30
                   shadow-[4px_4px_0_rgba(0,0,0,0.4)] hover:shadow-[2px_2px_0_rgba(0,0,0,0.4)]
                   hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150"
      >
        {t("viewProPlan")}
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </div>
  );
}
