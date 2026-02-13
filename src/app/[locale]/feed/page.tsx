"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAuth } from "@/components/AuthProvider";
import AuthModal from "@/components/AuthModal";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import AdFeedCard from "@/components/ads/AdFeedCard";
import { AD_FEED_CARDS } from "@/lib/a8-affiliates";
import type { SpotReview } from "@/lib/types";

const FREE_POST_LIMIT = 3;

const SAMPLE_REVIEWS: SpotReview[] = [
  { id: "s1", user_id: "", spot_name: "須賀神社 階段", work_title: "君の名は。", rating: 5, comment: "映画のラストシーンそのままの景色が広がっていて感動しました。夕方に行くと特に雰囲気があります。", photo_url: "https://images.unsplash.com/photo-1570459027562-4a916cc6113f?w=800&h=600&fit=crop&q=80", tips: "四ツ谷駅から徒歩10分。平日の朝が空いています", best_angle: "階段の下から見上げるように撮ると映画のシーンに近くなります", visited_date: "2025-12-15", created_at: "2025-12-15T10:00:00Z" },
  { id: "s2", user_id: "", spot_name: "江ノ島電鉄 鎌倉高校前駅", work_title: "スラムダンク", rating: 5, comment: "OPの踏切シーンの場所！海が綺麗に見えて最高でした。外国人観光客も多かったです。", photo_url: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&h=600&fit=crop&q=80", tips: "朝早めに行くと人が少なくていい写真が撮れます", best_angle: "踏切の海側から撮影すると電車と海が両方入ります", visited_date: "2025-10-08", created_at: "2025-10-08T10:00:00Z" },
  { id: "s3", user_id: "", spot_name: "飛騨古川駅", work_title: "君の名は。", rating: 4, comment: "三葉が降りた駅のモデル地。駅舎の雰囲気がそのままで嬉しかった。周辺の街並みも素敵です。", photo_url: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800&h=600&fit=crop&q=80", tips: "駅前の観光案内所で聖地巡礼マップがもらえます", best_angle: "ホームから駅舎全体が写る位置がベスト", visited_date: "2025-11-20", created_at: "2025-11-20T10:00:00Z" },
  { id: "s4", user_id: "", spot_name: "秋葉原 UDX", work_title: "シュタインズ・ゲート", rating: 4, comment: "ラボのモデルになったビルの近く。秋葉原の雰囲気と合わせて楽しめました。", photo_url: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&h=600&fit=crop&q=80", tips: "秋葉原駅電気街口から徒歩5分", best_angle: "UDXのデッキからの眺めが作中の雰囲気に近い", visited_date: "2025-09-22", created_at: "2025-09-22T10:00:00Z" },
  { id: "s5", user_id: "", spot_name: "大洗磯前神社", work_title: "ガールズ＆パンツァー", rating: 5, comment: "神社の鳥居越しに見える海が絶景。痛絵馬もたくさんあってファンの聖地感がすごい。", photo_url: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800&h=600&fit=crop&q=80", tips: "大洗駅から循環バスで行けます。海鮮丼もおすすめ", best_angle: "鳥居の間から朝日が見える早朝がおすすめ", visited_date: "2025-12-01", created_at: "2025-12-01T10:00:00Z" },
  { id: "s6", user_id: "", spot_name: "竹原市 町並み保存地区", work_title: "たまゆら", rating: 5, comment: "まさにアニメの世界に入り込んだ感覚。古い町並みが美しく保存されていてゆっくり散歩できました。", photo_url: "https://images.unsplash.com/photo-1580237541049-2d715a09486e?w=800&h=600&fit=crop&q=80", tips: "竹原駅からバスで15分。レンタサイクルもおすすめ", best_angle: "石畳の通りを奥行きを出して撮るときれいです", visited_date: "2025-08-14", created_at: "2025-08-14T10:00:00Z" },
  { id: "s7", user_id: "", spot_name: "豊郷小学校旧校舎群", work_title: "けいおん!", rating: 5, comment: "校舎の中が自由に見学できて、軽音部の部室のモデルになった教室もそのまま残っています！", photo_url: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&h=600&fit=crop&q=80", tips: "近江鉄道豊郷駅から徒歩10分。無料で見学可能", best_angle: "正面玄関から校舎全体を写すとアニメのカットに", visited_date: "2025-06-30", created_at: "2025-06-30T10:00:00Z" },
  { id: "s8", user_id: "", spot_name: "岩美町 浦富海岸", work_title: "Free!", rating: 5, comment: "海の透明度が凄い！岩美町全体がFree!の聖地で、町のいたるところにポスターがあります。", photo_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80", tips: "夏は海水浴客で混むので春か秋がベスト", best_angle: "遊覧船から見る海岸線が最高", visited_date: "2025-08-25", created_at: "2025-08-25T10:00:00Z" },
  { id: "s9", user_id: "", spot_name: "秩父 定林寺", work_title: "あの日見た花の名前を僕達はまだ知らない。", rating: 5, comment: "めんまたちの思い出の場所。実際に来ると作品の感動が蘇ってきて泣きそうになりました。", photo_url: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop&q=80", tips: "西武秩父駅からバス。秩父札所巡りと合わせて", best_angle: "境内から見下ろす秩父の町並みがきれい", visited_date: "2025-11-03", created_at: "2025-11-03T10:00:00Z" },
  { id: "s10", user_id: "", spot_name: "諏訪湖", work_title: "君の名は。", rating: 4, comment: "糸守湖のモデルと言われている湖。湖畔の散歩道が気持ちよかったです。", photo_url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=600&fit=crop&q=80", tips: "上諏訪駅から徒歩10分。足湯もあります", best_angle: "立石公園からの俯瞰が映画のシーンに似ています", visited_date: "2025-10-20", created_at: "2025-10-20T10:00:00Z" },
  { id: "s11", user_id: "", spot_name: "江ノ島", work_title: "青春ブタ野郎はバニーガール先輩の夢を見ない", rating: 4, comment: "咲太と麻衣さんのデートスポット。江ノ島からの夕日が特にきれいでした。", photo_url: "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&h=600&fit=crop&q=80", tips: "片瀬江ノ島駅から徒歩すぐ。しらす丼がおすすめ", best_angle: "展望台からの湘南の海が最高です", visited_date: "2025-09-15", created_at: "2025-09-15T10:00:00Z" },
  { id: "s12", user_id: "", spot_name: "箱根 芦ノ湖", work_title: "新世紀エヴァンゲリオン", rating: 4, comment: "第3新東京市のモデル地域。箱根全体がエヴァの世界観で、お土産屋にもコラボグッズが。", photo_url: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&h=600&fit=crop&q=80", tips: "箱根湯本からバスで40分。エヴァンゲリオンストアも必見", best_angle: "芦ノ湖越しに見える富士山がベストショット", visited_date: "2025-12-10", created_at: "2025-12-10T10:00:00Z" },
  { id: "s13", user_id: "", spot_name: "尾道 千光寺", work_title: "かみちゅ!", rating: 4, comment: "坂と寺と海が織りなす風景が素晴らしい。ロープウェイからの景色も最高でした。", photo_url: "https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?w=800&h=600&fit=crop&q=80", tips: "尾道駅から徒歩20分またはロープウェイ。尾道ラーメンも忘れずに", best_angle: "千光寺の展望台から尾道水道を一望", visited_date: "2025-07-28", created_at: "2025-07-28T10:00:00Z" },
  { id: "s14", user_id: "", spot_name: "国道134号線 七里ヶ浜", work_title: "スラムダンク", rating: 5, comment: "湘南の海を眺めながらのドライブは最高。スラムダンクの聖地として有名ですが、景色自体が素晴らしいです。", photo_url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&h=600&fit=crop&q=80", tips: "車かレンタサイクルでの移動がおすすめ", best_angle: "七里ヶ浜の歩道橋から海に向かって撮影", visited_date: "2025-08-05", created_at: "2025-08-05T10:00:00Z" },
  { id: "s15", user_id: "", spot_name: "三鷹の森 ジブリ美術館", work_title: "となりのトトロ", rating: 5, comment: "ジブリファン必訪の場所。館内の展示は写真撮影禁止ですが、屋上のロボット兵は撮影OK！", photo_url: "https://images.unsplash.com/photo-1565618754154-c8012c6a40ae?w=800&h=600&fit=crop&q=80", tips: "事前にローソンチケットで日時指定チケット購入必須", best_angle: "美術館の外観を緑の木々と一緒に撮ると素敵", visited_date: "2025-11-08", created_at: "2025-11-08T10:00:00Z" },
  { id: "s16", user_id: "", spot_name: "沼津市 内浦", work_title: "ラブライブ!サンシャイン!!", rating: 5, comment: "Aqoursの聖地！地元の方も温かく迎えてくれます。海がきれいで街全体がラブライブ一色。", photo_url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop&q=80", tips: "沼津駅からバスで30分。みかんが名物", best_angle: "内浦の海岸から対岸の山々と海を一緒に", visited_date: "2025-10-14", created_at: "2025-10-14T10:00:00Z" },
  { id: "s17", user_id: "", spot_name: "湯涌温泉", work_title: "花咲くいろは", rating: 4, comment: "喜翠荘のモデルになった温泉地。小さな温泉街ですが雰囲気があって癒されます。", photo_url: "https://images.unsplash.com/photo-1553653924-39b70295f8da?w=800&h=600&fit=crop&q=80", tips: "金沢駅からバスで45分。ぼんぼり祭りの時期が特におすすめ", best_angle: "温泉街の入口の看板と紅葉を一緒に撮影", visited_date: "2025-11-25", created_at: "2025-11-25T10:00:00Z" },
  { id: "s18", user_id: "", spot_name: "氷菓の舞台 高山市", work_title: "氷菓", rating: 4, comment: "古い町並みが氷菓の雰囲気そのもの。高山陣屋や宮川朝市も楽しめました。", photo_url: "https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?w=800&h=600&fit=crop&q=80", tips: "春と秋の高山祭の時期は特に混みます", best_angle: "宮川沿いの赤い橋からの景色がアニメに近い", visited_date: "2025-07-19", created_at: "2025-07-19T10:00:00Z" },
  { id: "s19", user_id: "", spot_name: "下田市 ペリーロード", work_title: "夏色キセキ", rating: 3, comment: "静かな港町で散歩が気持ちいい。アニメの雰囲気を感じながらのんびりできます。", photo_url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&h=600&fit=crop&q=80", tips: "伊豆急下田駅から徒歩15分。金目鯛が名物", best_angle: "川沿いの柳並木がフォトジェニック", visited_date: "2025-05-12", created_at: "2025-05-12T10:00:00Z" },
  { id: "s20", user_id: "", spot_name: "天橋立", work_title: "舞-HiME", rating: 4, comment: "日本三景の一つ。松林の中を歩くと気持ちいいです。股のぞきで見る天橋立は不思議な感覚。", photo_url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop&q=80", tips: "京都丹後鉄道天橋立駅から徒歩すぐ。リフトで展望台へ", best_angle: "傘松公園からの「股のぞき」がベストビュー", visited_date: "2025-06-18", created_at: "2025-06-18T10:00:00Z" },
];

export default function FeedPage() {
  const t = useTranslations("Feed");
  const { user, isPro } = useAuth();
  const [reviews, setReviews] = useState<SpotReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    fetch("/api/feed")
      .then((res) => res.json())
      .then((data) => {
        const dbReviews = data.reviews ?? [];
        setReviews(dbReviews.length > 0 ? dbReviews : SAMPLE_REVIEWS);
      })
      .catch(() => {
        setReviews(SAMPLE_REVIEWS);
      })
      .finally(() => setLoading(false));
  }, []);

  const showPaywall = !isPro && reviews.length > FREE_POST_LIMIT;
  const visibleReviews = showPaywall
    ? reviews.slice(0, FREE_POST_LIMIT)
    : reviews;

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  async function handleUpgrade() {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setCheckoutLoading(true);
    setCheckoutError("");
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setCheckoutError(data.error ?? t("checkoutError"));
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError(t("urlError"));
      }
    } catch {
      setCheckoutError(t("networkError"));
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* ヘッダー */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-sm border-b-2 border-white/10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h1 className="text-base font-black text-white">{t("title")}</h1>
          <div className="ml-auto">
            <LocaleSwitcher />
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 border-2 border-white/10 p-4 animate-pulse">
                <div className="h-4 w-32 bg-white/10 mb-3" />
                <div className="h-48 bg-white/10 mb-3" />
                <div className="h-3 w-full bg-white/10 mb-2" />
                <div className="h-3 w-2/3 bg-white/10" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-12 h-12 text-white/10 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-white/30 font-bold">{t("noPosts")}</p>
            <p className="text-xs text-white/20 mt-1">
              {t("postEncourage")}
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="space-y-4">
              {visibleReviews.map((review, idx) => (
                <div key={review.id}>
                  <FeedCard review={review} />
                  {/* 2枚目の後に広告カード1枚挿入 */}
                  {idx === 1 && (
                    <div className="my-4">
                      <AdFeedCard ad={AD_FEED_CARDS[0]} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ペイウォール */}
            {showPaywall && (
              <div className="relative mt-4">
                {/* 暗くなるフェードアウト */}
                <div className="absolute -top-24 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#0a0a0a] pointer-events-none z-10" />

                {/* ペイウォールオーバーレイ */}
                <div className="relative z-20 py-12 flex flex-col items-center">
                  <div className="w-full max-w-sm bg-[#111] border-2 border-red-500/40 shadow-[6px_6px_0_rgba(229,62,62,0.3)] p-6 text-center">
                    <svg className="w-8 h-8 text-red-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>

                    <h3 className="text-base font-black text-white mb-2">
                      {t("proRequired")}
                    </h3>
                    <p className="text-xs text-white/40 mb-1 leading-relaxed">
                      {t("viewAll")}
                    </p>
                    <p className="text-xs text-white/30 mb-5">
                      {t("remainingPosts", { count: reviews.length - FREE_POST_LIMIT })}
                    </p>

                    {checkoutError && (
                      <div className="mb-4 bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-400 font-bold">
                        {checkoutError}
                      </div>
                    )}

                    <button
                      onClick={handleUpgrade}
                      disabled={checkoutLoading}
                      className={`w-full py-3 text-sm font-black border-2 transition-all duration-150 ${
                        checkoutLoading
                          ? "bg-white/10 text-white/30 border-white/10 cursor-not-allowed"
                          : "bg-red-500 text-white border-red-400/50 shadow-[3px_3px_0_rgba(0,0,0,0.3)] hover:shadow-[1px_1px_0_rgba(0,0,0,0.3)] hover:translate-x-0.5 hover:translate-y-0.5"
                      }`}
                    >
                      {checkoutLoading ? t("processing") : user ? t("registerPro") : t("loginToStart")}
                    </button>

                    <p className="text-[11px] text-white/20 mt-3">
                      {t("monthlyPrice")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Paywall下の広告カードセクション */}
            {showPaywall && (
              <div className="mt-6 space-y-4">
                <div className="text-center mb-4">
                  <p className="text-xs text-white/20 font-bold">─── おすすめ旅行サイト ───</p>
                </div>
                {AD_FEED_CARDS.slice(1).map((ad) => (
                  <AdFeedCard key={ad.id} ad={ad} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}

/* ========== Feed Card ========== */

function FeedCard({ review }: { review: SpotReview }) {
  const t = useTranslations("Feed");
  const locale = useLocale();
  return (
    <article className="bg-white/5 border-2 border-white/10 overflow-hidden">
      {/* ヘッダー */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-2">
        <div className="w-7 h-7 bg-red-500/20 border border-red-500/30 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-white truncate">{review.spot_name}</p>
          {review.work_title && (
            <p className="text-[10px] text-red-400/60 font-bold truncate">{review.work_title}</p>
          )}
        </div>
        <div className="flex gap-0.5 shrink-0">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className={`text-[10px] ${n <= review.rating ? "text-yellow-400" : "text-white/10"}`}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* 写真 */}
      {review.photo_url && (
        <div className="w-full aspect-[4/3] bg-black/40 overflow-hidden border-y-2 border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={review.photo_url}
            alt={review.spot_name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* コンテンツ */}
      <div className="px-4 py-3 space-y-2">
        {review.comment && (
          <p className="text-sm text-white/70 leading-relaxed">{review.comment}</p>
        )}

        {review.tips && (
          <div className="flex items-start gap-1.5">
            <svg className="w-3.5 h-3.5 text-white/40 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M9 21h6M12 3a6 6 0 014 10.5V17H8v-3.5A6 6 0 0112 3z" />
            </svg>
            <p className="text-xs text-white/40">
              <span className="font-black">Tips:</span> {review.tips}
            </p>
          </div>
        )}

        {review.best_angle && (
          <div className="flex items-start gap-1.5">
            <svg className="w-3.5 h-3.5 text-white/40 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <p className="text-xs text-white/40">
              <span className="font-black">{t("angle")}</span> {review.best_angle}
            </p>
          </div>
        )}

        {/* フッター */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-white/20 font-bold">
            {review.visited_date
              ? new Date(review.visited_date).toLocaleDateString(locale)
              : new Date(review.created_at).toLocaleDateString(locale)}
          </span>
        </div>
      </div>
    </article>
  );
}
