"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { TransportOption } from "@/lib/types";
import { getBusAffiliate } from "@/lib/a8-affiliates";
import A8ImpressionPixel from "@/components/A8ImpressionPixel";

/* ===== Transport SVG Icons (outline) ===== */
const TRANSPORT_ICONS: Record<string, React.ReactNode> = {
  flight: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M12 2L4 7v4l8-3 8 3V7l-8-5zM4 11l8 3 8-3M4 11v4l8 5 8-5v-4" />
    </svg>
  ),
  shinkansen: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <rect x="4" y="3" width="16" height="14" rx="2" />
      <path d="M4 11h16M12 3v8" />
      <circle cx="8" cy="19" r="1" /><circle cx="16" cy="19" r="1" />
      <path d="M6 17l-2 4M18 17l2 4" />
    </svg>
  ),
  train: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <rect x="4" y="3" width="16" height="14" rx="2" />
      <path d="M4 11h16M12 3v8" />
      <circle cx="8" cy="19" r="1" /><circle cx="16" cy="19" r="1" />
      <path d="M6 17l-2 4M18 17l2 4" />
    </svg>
  ),
  bus: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <rect x="4" y="3" width="16" height="16" rx="2" />
      <path d="M4 11h16M4 7h16" />
      <circle cx="7.5" cy="15.5" r="1.5" /><circle cx="16.5" cy="15.5" r="1.5" />
    </svg>
  ),
  car: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2M5 17a1 1 0 100 2 1 1 0 000-2zm14 0a1 1 0 100 2 1 1 0 000-2z" />
    </svg>
  ),
  taxi: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2M5 17a1 1 0 100 2 1 1 0 000-2zm14 0a1 1 0 100 2 1 1 0 000-2z" />
      <rect x="10" y="1" width="4" height="3" rx="1" />
    </svg>
  ),
};

function getTransportIcon(type: string): React.ReactNode {
  return TRANSPORT_ICONS[type] || TRANSPORT_ICONS.train;
}

export default function TransportOptions({
  from,
  to,
  companions,
}: {
  from: string;
  to: string;
  companions?: string;
}) {
  const t = useTranslations("Transport");
  const locale = useLocale();
  const [options, setOptions] = useState<TransportOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const a8Bus = useMemo(() => getBusAffiliate(), []);

  useEffect(() => {
    if (!from || !to) {
      setLoading(false);
      return;
    }

    const params = new URLSearchParams({ from, to });
    if (companions) params.set("companions", companions);
    params.set("locale", locale);

    fetch(`/api/affiliate/transport?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setOptions(data.options ?? []);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [from, to, companions, locale]);

  if (error || (!loading && options.length === 0)) return null;

  if (loading) {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          {t("recommendedWay")}
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/5 border-2 border-white/10 p-4 animate-pulse"
            >
              <div className="h-5 w-40 bg-white/10 mb-3" />
              <div className="h-4 w-24 bg-white/10 mb-2" />
              <div className="h-3 w-56 bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        {t("recommendedWay")}
      </h3>
      <div className="space-y-3">
        {options.map((opt, idx) => (
          <div
            key={idx}
            className="bg-white/5 border-2 border-white/10 p-4 relative overflow-hidden"
          >
            {idx === 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black px-2.5 py-1">
                {t("recommended")}
              </span>
            )}

            <div className="flex items-center gap-2 mb-2">
              <span className="text-white/60">{getTransportIcon(opt.type)}</span>
              <span className="text-sm font-black text-white">{opt.name}</span>
              <span className="text-xs text-white/40 ml-auto shrink-0">
                {opt.duration}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <span className="text-base font-black text-red-400">
                {opt.price}
              </span>
              {opt.transfers > 0 && (
                <span className="text-[11px] text-white/40 font-bold">
                  {t("transfers", { count: opt.transfers })}
                </span>
              )}
              {opt.transfers === 0 && (
                <span className="text-[11px] text-emerald-400/60 font-bold">
                  {t("direct")}
                </span>
              )}
            </div>

            <p className="text-xs text-white/50 mb-3 leading-relaxed">
              {opt.recommendation}
            </p>

            {opt.type === "taxi" ? (
              <a
                href="https://m.uber.com/"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1.5 text-xs font-black text-white bg-black border-2 border-white/20 px-3 py-1.5
                           hover:bg-white/10 transition-colors"
              >
                {t("uberTaxi")}
                <span className="text-[10px]">&rarr;</span>
              </a>
            ) : opt.type === "bus" ? (
              <span className="relative">
                <a
                  href={a8Bus.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-1.5 text-xs font-black text-purple-400 border-2 border-purple-500/30 px-3 py-1.5
                             hover:bg-purple-500/10 transition-colors"
                >
                  {t("bookBus")}
                  <span className="text-[10px]">&rarr;</span>
                </a>
                <A8ImpressionPixel url={a8Bus.impTagUrl} />
              </span>
            ) : opt.type === "flight" ? (
              <a
                href={opt.bookingUrl || "https://www.aviasales.com/"}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1.5 text-xs font-black text-blue-400 border-2 border-blue-500/30 px-3 py-1.5
                           hover:bg-blue-500/10 transition-colors"
              >
                {t("viewTicket")}
                <span className="text-[10px]">&rarr;</span>
              </a>
            ) : opt.bookingUrl ? (
              <a
                href={opt.bookingUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1.5 text-xs font-black text-red-400 border-2 border-red-500/30 px-3 py-1.5
                           hover:bg-red-500/10 transition-colors"
              >
                {t("viewTicket")}
                <span className="text-[10px]">&rarr;</span>
              </a>
            ) : (
              <p className="text-[11px] text-white/30 font-bold">
                {t("bookViaCompany")}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
