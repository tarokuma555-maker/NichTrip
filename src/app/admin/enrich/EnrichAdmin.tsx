"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type QueueItem = {
  id: string;
  work_title: string;
  work_data: {
    title: string;
    title_en: string;
    genre: string;
    year: number;
    description: string;
  };
  spots_data: {
    name: string;
    address: string;
    lat: number;
    lng: number;
    scene_description: string;
    episode: string;
    access_info: string;
  }[];
  status: string;
  reviewed_at: string | null;
  notes: string | null;
  created_at: string;
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  rejected: "bg-red-500/10 text-red-400 border-red-500/30",
};

export default function EnrichAdmin({ items }: { items: QueueItem[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [detail, setDetail] = useState<QueueItem | null>(null);

  async function handleAction(id: string, action: "approve" | "reject") {
    setLoading(id);
    try {
      const res = await fetch("/api/auto-enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, id }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.error ?? "エラーが発生しました");
      }
      router.refresh();
    } catch {
      alert("通信エラー");
    } finally {
      setLoading(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-white/30 font-bold">
        キューにデータがありません
      </div>
    );
  }

  return (
    <>
      {/* テーブル */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-white/10 text-left text-white/40 text-xs font-black uppercase tracking-wider">
              <th className="py-3 pr-4">作品名</th>
              <th className="py-3 pr-4">ジャンル</th>
              <th className="py-3 pr-4">年</th>
              <th className="py-3 pr-4">スポット</th>
              <th className="py-3 pr-4">ステータス</th>
              <th className="py-3 pr-4">作成日</th>
              <th className="py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-white/5 hover:bg-white/[0.02]"
              >
                <td className="py-3 pr-4 font-bold text-white">
                  {item.work_title}
                  {item.work_data.title_en && (
                    <span className="block text-[11px] text-white/30 font-normal">
                      {item.work_data.title_en}
                    </span>
                  )}
                </td>
                <td className="py-3 pr-4 text-white/50">
                  {item.work_data.genre}
                </td>
                <td className="py-3 pr-4 text-white/50">
                  {item.work_data.year}
                </td>
                <td className="py-3 pr-4 text-white/50">
                  {item.spots_data.length}件
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`inline-block text-[11px] font-black px-2 py-0.5 border ${
                      STATUS_STYLES[item.status] ?? "text-white/40 border-white/10"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3 pr-4 text-white/30 text-xs">
                  {new Date(item.created_at).toLocaleDateString("ja-JP")}
                </td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDetail(item)}
                      className="text-[11px] font-bold text-white/50 border border-white/10 px-2 py-1
                                 hover:text-white hover:border-white/30 transition-colors"
                    >
                      詳細
                    </button>
                    {item.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAction(item.id, "approve")}
                          disabled={loading === item.id}
                          className="text-[11px] font-black text-emerald-400 border border-emerald-500/30 px-2 py-1
                                     hover:bg-emerald-500/10 transition-colors disabled:opacity-50"
                        >
                          {loading === item.id ? "..." : "✓ 承認"}
                        </button>
                        <button
                          onClick={() => handleAction(item.id, "reject")}
                          disabled={loading === item.id}
                          className="text-[11px] font-black text-red-400 border border-red-500/30 px-2 py-1
                                     hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        >
                          {loading === item.id ? "..." : "✗ 却下"}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 詳細モーダル */}
      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setDetail(null)}
        >
          <div
            className="bg-[#111] border-2 border-white/10 max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-white">
                {detail.work_title}
              </h2>
              <button
                onClick={() => setDetail(null)}
                className="text-white/30 hover:text-white text-xl font-black"
              >
                ×
              </button>
            </div>

            <div className="mb-4 text-xs text-white/50 space-y-1">
              <p>英語名: {detail.work_data.title_en}</p>
              <p>
                {detail.work_data.genre} / {detail.work_data.year}年
              </p>
              <p>{detail.work_data.description}</p>
            </div>

            <h3 className="text-sm font-black text-white mb-3">
              スポット ({detail.spots_data.length}件)
            </h3>
            <div className="space-y-3">
              {detail.spots_data.map((spot, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 p-3"
                >
                  <p className="text-sm font-bold text-white mb-1">
                    {spot.name}
                  </p>
                  <p className="text-xs text-white/40 mb-1">{spot.address}</p>
                  <p className="text-xs text-white/40">
                    lat: {spot.lat}, lng: {spot.lng}
                  </p>
                  <p className="text-xs text-white/50 mt-1">
                    {spot.scene_description}
                  </p>
                  <p className="text-[11px] text-white/30 mt-1">
                    {spot.episode} / {spot.access_info}
                  </p>
                </div>
              ))}
            </div>

            {detail.status === "pending" && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    handleAction(detail.id, "approve");
                    setDetail(null);
                  }}
                  className="flex-1 py-2.5 text-sm font-black text-emerald-400 border-2 border-emerald-500/30
                             hover:bg-emerald-500/10 transition-colors"
                >
                  ✓ 承認する
                </button>
                <button
                  onClick={() => {
                    handleAction(detail.id, "reject");
                    setDetail(null);
                  }}
                  className="flex-1 py-2.5 text-sm font-black text-red-400 border-2 border-red-500/30
                             hover:bg-red-500/10 transition-colors"
                >
                  ✗ 却下する
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
