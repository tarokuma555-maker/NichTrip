"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/AuthProvider";
import AuthModal from "./AuthModal";

export default function UserMenu({ className = "" }: { className?: string }) {
  const t = useTranslations("UserMenu");
  const { user, loading, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (loading) return null;

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowAuth(true)}
          className={`text-[11px] font-black text-white/50 border border-white/10 px-2.5 py-1
                     hover:text-white hover:border-white/30 transition-colors ${className}`}
        >
          {t("login")}
        </button>
        {showAuth && (
          <AuthModal onClose={() => setShowAuth(false)} defaultTab="login" />
        )}
      </>
    );
  }

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      <button
        onClick={() => setShowMenu((v) => !v)}
        className="w-7 h-7 bg-red-500/20 border border-red-500/30 flex items-center justify-center
                   text-[11px] font-black text-red-400 hover:bg-red-500/30 transition-colors"
      >
        {user.email?.charAt(0).toUpperCase() ?? "U"}
      </button>

      {showMenu && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-[#111] border-2 border-white/20 shadow-[4px_4px_0_rgba(0,0,0,0.4)] z-50">
          <div className="px-3 py-2 border-b border-white/10">
            <p className="text-[11px] text-white/30 truncate">{user.email}</p>
          </div>
          <button
            onClick={() => {
              setShowMenu(false);
              window.location.href = "/pricing";
            }}
            className="w-full text-left px-3 py-2 text-xs text-white/60 hover:bg-white/5 hover:text-white font-bold transition-colors"
          >
            💎 {t("subscription")}
          </button>
          <button
            onClick={() => {
              setShowMenu(false);
              signOut();
            }}
            className="w-full text-left px-3 py-2 text-xs text-white/60 hover:bg-white/5 hover:text-white font-bold transition-colors border-t border-white/10"
          >
            {t("logout")}
          </button>
        </div>
      )}
    </div>
  );
}
