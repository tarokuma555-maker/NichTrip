"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const POSTER_IMAGES = [
  "demon-slayer", "naruto", "one-piece", "attack-on-titan", "jujutsu-kaisen",
  "your-name", "slam-dunk", "spy-family", "chainsaw-man", "frieren",
  "steins-gate", "evangelion", "haikyu", "violet-evergarden", "oshi-no-ko",
  "my-hero-academia", "death-note", "hunter-x-hunter", "bocchi", "suzume",
  "sword-art-online", "code-geass", "madoka-magica", "bleach", "tokyo-revengers",
  "a-silent-voice", "mob-psycho-100", "kaguya-sama", "konosuba", "re-zero",
  "vinland-saga", "psycho-pass", "bunny-girl-senpai", "sound-euphonium", "toradora",
  "yurucamp", "k-on", "hyouka", "clannad", "anohana",
];

const STEPS = [
  { key: "step1", pct: 25 },
  { key: "step2", pct: 50 },
  { key: "step3", pct: 75 },
  { key: "step4", pct: 95 },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function LoadingAnimation() {
  const t = useTranslations("Loading");
  const [activeStep, setActiveStep] = useState(0);
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [flash, setFlash] = useState(false);

  // Shuffle posters once on mount
  const shuffled = useMemo(() => shuffle(POSTER_IMAGES), []);
  // 6 posters for background grid, cycling through
  const gridPosters = useMemo(() => shuffled.slice(0, 12), [shuffled]);
  // Featured poster cycles
  const featuredPosters = useMemo(() => shuffled.slice(0, 8), [shuffled]);

  // Step progression
  useEffect(() => {
    const id = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < STEPS.length - 1) {
          setFlash(true);
          setTimeout(() => setFlash(false), 400);
          return prev + 1;
        }
        return prev;
      });
    }, 3500);
    return () => clearInterval(id);
  }, []);

  // Featured poster cycling
  useEffect(() => {
    const id = setInterval(() => {
      setFeaturedIdx((prev) => (prev + 1) % featuredPosters.length);
    }, 2000);
    return () => clearInterval(id);
  }, [featuredPosters.length]);

  const progress = STEPS[activeStep].pct;

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 relative overflow-hidden">
      {/* Background poster mosaic */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.07]">
        <div className="grid grid-cols-4 gap-1 h-full">
          {gridPosters.map((name, i) => (
            <div key={name} className="relative overflow-hidden" style={{ animationDelay: `${i * 0.2}s` }}>
              <Image
                src={`/images/works/${name}.jpg`}
                alt=""
                fill
                className="object-cover"
                sizes="25vw"
                priority={i < 4}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Speed lines overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full animate-spin-slow opacity-20" viewBox="0 0 400 400" fill="none">
          {Array.from({ length: 48 }, (_, i) => {
            const angle = (i * 7.5 * Math.PI) / 180;
            return (
              <line
                key={i}
                x1="200" y1="200"
                x2={200 + 200 * Math.cos(angle)}
                y2={200 + 200 * Math.sin(angle)}
                stroke="#E53E3E"
                strokeWidth={i % 8 === 0 ? 2 : 0.5}
                opacity={i % 8 === 0 ? 0.6 : 0.2}
              />
            );
          })}
        </svg>
      </div>

      {/* Flash effect on step change */}
      {flash && (
        <div className="absolute inset-0 bg-white/10 z-10 pointer-events-none loading-flash" />
      )}

      {/* Main content */}
      <div className="relative z-20 w-full max-w-xs">
        {/* Featured poster showcase */}
        <div className="relative mx-auto w-48 h-64 mb-6">
          {/* Frame border */}
          <div className="absolute inset-0 border-[3px] border-white shadow-[6px_6px_0_rgba(229,62,62,0.5)] z-10 pointer-events-none">
            <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-red-500" />
            <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-red-500" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-red-500" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-red-500" />
          </div>

          {/* Poster images with crossfade */}
          {featuredPosters.map((name, i) => (
            <div
              key={name}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === featuredIdx ? 1 : 0 }}
            >
              <Image
                src={`/images/works/${name}.jpg`}
                alt=""
                fill
                className="object-cover"
                sizes="192px"
                priority={i < 2}
              />
            </div>
          ))}

          {/* Scanline overlay */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent scan-line" />
          </div>

          {/* Halftone overlay */}
          <div className="absolute inset-0 halftone opacity-[0.06] pointer-events-none z-10" />
        </div>

        {/* Small poster strip cycling below */}
        <div className="flex gap-1.5 justify-center mb-6 overflow-hidden">
          {shuffled.slice(8, 14).map((name, i) => (
            <div
              key={name}
              className="w-10 h-14 relative border border-white/20 shrink-0 poster-float"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              <Image
                src={`/images/works/${name}.jpg`}
                alt=""
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
          ))}
        </div>

        {/* Status terminal */}
        <div className="border-2 border-white/10 bg-black/60 backdrop-blur-sm px-4 py-3 mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-1.5 h-1.5 bg-red-500 step-glow" />
            <div className="w-1.5 h-1.5 bg-white/20" />
            <div className="w-1.5 h-1.5 bg-white/20" />
            <span className="text-[9px] text-white/20 font-bold ml-1.5 uppercase tracking-widest">
              generating
            </span>
          </div>
          <p key={activeStep} className="text-sm font-black text-red-400 status-text-typing">
            {t(STEPS[activeStep].key)}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-1.5">
            <span className="text-[10px] text-white/40 font-black uppercase tracking-wider">
              Progress
            </span>
            <span className="text-[10px] text-red-400 font-black">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-white/5 border-2 border-white/10 overflow-hidden">
            <div
              className="h-full transition-all duration-1000 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div
                className="absolute inset-0 bg-red-500"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 6px)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Step indicators — compact dots */}
        <div className="flex items-center justify-center gap-3">
          {STEPS.map((_, i) => {
            const done = i < activeStep;
            const current = i === activeStep;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`w-3 h-3 transition-all duration-300 ${
                    current
                      ? "bg-red-500 step-glow"
                      : done
                        ? "bg-emerald-500"
                        : "bg-white/10"
                  }`}
                />
                <span className={`text-[9px] font-bold ${
                  current ? "text-red-400" : done ? "text-white/30" : "text-white/15"
                }`}>
                  {i + 1}/{STEPS.length}
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-center text-[11px] text-white/30 mt-4">
          {t("estimate")}
        </p>
      </div>
    </div>
  );
}
