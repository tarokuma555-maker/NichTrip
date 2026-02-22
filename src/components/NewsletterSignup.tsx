"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function NewsletterSignup() {
  const t = useTranslations("Blog");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="border-2 border-white/10 bg-white/[0.02] p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-3">
        <svg
          className="w-5 h-5 text-red-400 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
          />
        </svg>
        <h3 className="text-sm sm:text-base font-black text-white">
          {t("newsletterTitle")}
        </h3>
      </div>

      {status === "success" ? (
        <div className="flex items-center gap-2 py-3">
          <span className="w-5 h-5 bg-emerald-500 flex items-center justify-center text-white text-xs font-black shrink-0">
            ✓
          </span>
          <p className="text-sm font-bold text-emerald-400">
            {t("newsletterSuccess")}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder={t("newsletterPlaceholder")}
            required
            className="flex-1 min-w-0 px-3 py-2 text-sm bg-white/[0.03] border-2 border-white/10
                       text-white placeholder:text-white/25 focus:border-red-500/40 focus:outline-none
                       transition-colors"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="shrink-0 bg-red-500 text-white text-xs sm:text-sm font-black px-4 py-2 border-2 border-red-400/50
                       shadow-[2px_2px_0_rgba(0,0,0,0.3)] hover:shadow-[1px_1px_0_rgba(0,0,0,0.3)]
                       hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "..." : t("newsletterButton")}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-2 text-xs font-bold text-red-400">
          {t("newsletterError")}
        </p>
      )}
    </section>
  );
}
