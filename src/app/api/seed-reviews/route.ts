import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS spot_reviews (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  spot_name    text NOT NULL,
  work_title   text NOT NULL DEFAULT '',
  rating       integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment      text,
  photo_url    text,
  tips         text,
  best_angle   text,
  visited_date date,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_spot_reviews_spot_work ON spot_reviews (spot_name, work_title);
CREATE INDEX IF NOT EXISTS idx_spot_reviews_created_at ON spot_reviews (created_at DESC);

ALTER TABLE spot_reviews ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spot_reviews' AND policyname = 'spot_reviews_select'
  ) THEN
    CREATE POLICY "spot_reviews_select" ON spot_reviews FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spot_reviews' AND policyname = 'spot_reviews_insert_all'
  ) THEN
    CREATE POLICY "spot_reviews_insert_all" ON spot_reviews FOR INSERT WITH CHECK (true);
  END IF;
END $$;
`;

const FAKE_REVIEWS = [
  {
    spot_name: "須賀神社 階段",
    work_title: "君の名は。",
    rating: 5,
    comment: "映画のラストシーンそのままの景色が広がっていて感動しました。夕方に行くと特に雰囲気があります。",
    tips: "四ツ谷駅から徒歩10分。平日の朝が空いています",
    best_angle: "階段の下から見上げるように撮ると映画のシーンに近くなります",
    visited_date: "2025-12-15",
  },
  {
    spot_name: "飛騨古川駅",
    work_title: "君の名は。",
    rating: 4,
    comment: "三葉が降りた駅のモデル地。駅舎の雰囲気がそのままで嬉しかった。周辺の街並みも素敵です。",
    tips: "駅前の観光案内所で聖地巡礼マップがもらえます",
    best_angle: "ホームから駅舎全体が写る位置がベスト",
    visited_date: "2025-11-20",
  },
  {
    spot_name: "江ノ島電鉄 鎌倉高校前駅",
    work_title: "スラムダンク",
    rating: 5,
    comment: "OPの踏切シーンの場所！海が綺麗に見えて最高でした。外国人観光客も多かったです。",
    tips: "朝早めに行くと人が少なくていい写真が撮れます",
    best_angle: "踏切の海側から撮影すると電車と海が両方入ります",
    visited_date: "2025-10-08",
  },
  {
    spot_name: "秋葉原 UDX",
    work_title: "シュタインズ・ゲート",
    rating: 4,
    comment: "ラボのモデルになったビルの近く。秋葉原の雰囲気と合わせて楽しめました。",
    tips: "秋葉原駅電気街口から徒歩5分",
    best_angle: "UDXのデッキからの眺めが作中の雰囲気に近い",
    visited_date: "2025-09-22",
  },
  {
    spot_name: "竹原市 町並み保存地区",
    work_title: "たまゆら",
    rating: 5,
    comment: "まさにアニメの世界に入り込んだ感覚。古い町並みが美しく保存されていてゆっくり散歩できました。",
    tips: "竹原駅からバスで15分。レンタサイクルもおすすめ",
    best_angle: "石畳の通りを奥行きを出して撮るときれいです",
    visited_date: "2025-08-14",
  },
  {
    spot_name: "大洗磯前神社",
    work_title: "ガールズ＆パンツァー",
    rating: 5,
    comment: "神社の鳥居越しに見える海が絶景。痛絵馬もたくさんあってファンの聖地感がすごい。",
    tips: "大洗駅から循環バスで行けます。海鮮丼もおすすめ",
    best_angle: "鳥居の間から朝日が見える早朝がおすすめ",
    visited_date: "2025-12-01",
  },
  {
    spot_name: "氷菓の舞台 高山市",
    work_title: "氷菓",
    rating: 4,
    comment: "古い町並みが氷菓の雰囲気そのもの。高山陣屋や宮川朝市も楽しめました。",
    tips: "春と秋の高山祭の時期は特に混みます",
    best_angle: "宮川沿いの赤い橋からの景色がアニメに近い",
    visited_date: "2025-07-19",
  },
  {
    spot_name: "豊郷小学校旧校舎群",
    work_title: "けいおん!",
    rating: 5,
    comment: "校舎の中が自由に見学できて、軽音部の部室のモデルになった教室もそのまま残っています！",
    tips: "近江鉄道豊郷駅から徒歩10分。無料で見学可能",
    best_angle: "正面玄関から校舎全体を写すとアニメのカットに",
    visited_date: "2025-06-30",
  },
  {
    spot_name: "岩美町 浦富海岸",
    work_title: "Free!",
    rating: 5,
    comment: "海の透明度が凄い！岩美町全体がFree!の聖地で、町のいたるところにポスターがあります。",
    tips: "夏は海水浴客で混むので春か秋がベスト",
    best_angle: "遊覧船から見る海岸線が最高",
    visited_date: "2025-08-25",
  },
  {
    spot_name: "下田市 ペリーロード",
    work_title: "夏色キセキ",
    rating: 3,
    comment: "静かな港町で散歩が気持ちいい。アニメの雰囲気を感じながらのんびりできます。",
    tips: "伊豆急下田駅から徒歩15分。金目鯛が名物",
    best_angle: "川沿いの柳並木がフォトジェニック",
    visited_date: "2025-05-12",
  },
  {
    spot_name: "秩父 定林寺",
    work_title: "あの日見た花の名前を僕達はまだ知らない。",
    rating: 5,
    comment: "めんまたちの思い出の場所。実際に来ると作品の感動が蘇ってきて泣きそうになりました。",
    tips: "西武秩父駅からバス。秩父札所巡りと合わせて",
    best_angle: "境内から見下ろす秩父の町並みがきれい",
    visited_date: "2025-11-03",
  },
  {
    spot_name: "諏訪湖",
    work_title: "君の名は。",
    rating: 4,
    comment: "糸守湖のモデルと言われている湖。湖畔の散歩道が気持ちよかったです。",
    tips: "上諏訪駅から徒歩10分。足湯もあります",
    best_angle: "立石公園からの俯瞰が映画のシーンに似ています",
    visited_date: "2025-10-20",
  },
  {
    spot_name: "江ノ島",
    work_title: "青春ブタ野郎はバニーガール先輩の夢を見ない",
    rating: 4,
    comment: "咲太と麻衣さんのデートスポット。江ノ島からの夕日が特にきれいでした。",
    tips: "片瀬江ノ島駅から徒歩すぐ。しらす丼がおすすめ",
    best_angle: "展望台からの湘南の海が最高です",
    visited_date: "2025-09-15",
  },
  {
    spot_name: "箱根 芦ノ湖",
    work_title: "新世紀エヴァンゲリオン",
    rating: 4,
    comment: "第3新東京市のモデル地域。箱根全体がエヴァの世界観で、お土産屋にもコラボグッズが。",
    tips: "箱根湯本からバスで40分。エヴァンゲリオンストアも必見",
    best_angle: "芦ノ湖越しに見える富士山がベストショット",
    visited_date: "2025-12-10",
  },
  {
    spot_name: "尾道 千光寺",
    work_title: "かみちゅ!",
    rating: 4,
    comment: "坂と寺と海が織りなす風景が素晴らしい。ロープウェイからの景色も最高でした。",
    tips: "尾道駅から徒歩20分またはロープウェイ。尾道ラーメンも忘れずに",
    best_angle: "千光寺の展望台から尾道水道を一望",
    visited_date: "2025-07-28",
  },
  {
    spot_name: "国道134号線 七里ヶ浜",
    work_title: "スラムダンク",
    rating: 5,
    comment: "湘南の海を眺めながらのドライブは最高。スラムダンクの聖地として有名ですが、景色自体が素晴らしいです。",
    tips: "車かレンタサイクルでの移動がおすすめ",
    best_angle: "七里ヶ浜の歩道橋から海に向かって撮影",
    visited_date: "2025-08-05",
  },
  {
    spot_name: "三鷹の森 ジブリ美術館",
    work_title: "となりのトトロ",
    rating: 5,
    comment: "ジブリファン必訪の場所。館内の展示は写真撮影禁止ですが、屋上のロボット兵は撮影OK！",
    tips: "事前にローソンチケットで日時指定チケット購入必須",
    best_angle: "美術館の外観を緑の木々と一緒に撮ると素敵",
    visited_date: "2025-11-08",
  },
  {
    spot_name: "沼津市 内浦",
    work_title: "ラブライブ!サンシャイン!!",
    rating: 5,
    comment: "Aqoursの聖地！地元の方も温かく迎えてくれます。海がきれいで街全体がラブライブ一色。",
    tips: "沼津駅からバスで30分。みかんが名物",
    best_angle: "内浦の海岸から対岸の山々と海を一緒に",
    visited_date: "2025-10-14",
  },
  {
    spot_name: "湯涌温泉",
    work_title: "花咲くいろは",
    rating: 4,
    comment: "喜翠荘のモデルになった温泉地。小さな温泉街ですが雰囲気があって癒されます。",
    tips: "金沢駅からバスで45分。ぼんぼり祭りの時期が特におすすめ",
    best_angle: "温泉街の入口の看板と紅葉を一緒に撮影",
    visited_date: "2025-11-25",
  },
  {
    spot_name: "天橋立",
    work_title: "舞-HiME",
    rating: 4,
    comment: "日本三景の一つ。松林の中を歩くと気持ちいいです。股のぞきで見る天橋立は不思議な感覚。",
    tips: "京都丹後鉄道天橋立駅から徒歩すぐ。リフトで展望台へ",
    best_angle: "傘松公園からの「股のぞき」がベストビュー",
    visited_date: "2025-06-18",
  },
];

export async function POST() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }
    const supabase = createClient(url, key);

    // Create table if it doesn't exist (via Supabase SQL)
    const { error: sqlError } = await supabase.rpc("exec_sql", {
      query: CREATE_TABLE_SQL,
    }).maybeSingle();

    // If rpc doesn't exist, try direct insert anyway
    if (sqlError) {
      console.log("RPC exec_sql not available, trying direct insert:", sqlError.message);
    }

    const reviews = FAKE_REVIEWS.map((r) => ({
      ...r,
      photo_url: null,
      created_at: new Date(
        Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)
      ).toISOString(),
    }));

    const { error } = await supabase.from("spot_reviews").insert(reviews);

    if (error) {
      return NextResponse.json({ error: error.message, hint: error.hint, details: error.details }, { status: 500 });
    }

    return NextResponse.json({ ok: true, count: reviews.length });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
