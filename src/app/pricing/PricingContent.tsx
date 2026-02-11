"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import PricingCard from "@/components/PricingCard";
import AuthModal from "@/components/AuthModal";

const FAQ_ITEMS = [
  {
    q: "いつでも解約できますか？",
    a: "はい。Stripeのカスタマーポータルからいつでも解約できます。解約後も現在の請求期間が終了するまでProプランをご利用いただけます。",
  },
  {
    q: "3ヶ月後に自動で値上がりしますか？",
    a: "はい。最初の3ヶ月間は月額480円で、4ヶ月目以降は月額980円になります。価格変更前にメールでお知らせします。",
  },
  {
    q: "複数作品ミックス巡礼とは？",
    a: "最大3つのアニメ作品を選択し、それぞれの聖地を地理的に最適化したルートで巡るプランを生成できるPro限定機能です。",
  },
  {
    q: "支払い方法は？",
    a: "クレジットカード（Visa, Mastercard, JCB, American Express）に対応しています。Stripeの安全な決済システムを利用しています。",
  },
];

export default function PricingContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "true";
  const canceled = searchParams.get("canceled") === "true";
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <main className="max-w-4xl mx-auto px-4 sm:px-5 py-12 pb-20">
        {/* 成功メッセージ */}
        {success && (
          <div className="mb-8 bg-emerald-500/10 border-2 border-emerald-500/30 p-4 text-center">
            <p className="text-emerald-400 font-black text-sm">
              Proプランへのアップグレードが完了しました！
            </p>
            <p className="text-xs text-white/40 mt-1">
              すべての機能をお楽しみください。
            </p>
          </div>
        )}

        {canceled && (
          <div className="mb-8 bg-white/5 border-2 border-white/10 p-4 text-center">
            <p className="text-white/60 font-bold text-sm">
              決済がキャンセルされました。
            </p>
          </div>
        )}

        {/* ヒーロー */}
        <div className="text-center mb-12">
          <p className="text-xs font-black text-red-400 uppercase tracking-wider mb-2">
            PRICING
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            料金プラン
          </h1>
          <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed">
            無料でも十分に使えます。もっと自由に旅をプランしたい方はProプランへ。
          </p>
        </div>

        {/* プランカード */}
        <PricingCard onNeedAuth={() => setShowAuth(true)} />

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-xl font-black text-white mb-6 text-center">
            よくある質問
          </h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="border-2 border-white/10 p-4"
              >
                <h3 className="text-sm font-black text-white mb-2">
                  Q. {item.q}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  A. {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} defaultTab="signup" />
      )}
    </>
  );
}
