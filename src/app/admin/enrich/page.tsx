import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase-server';
import EnrichAdmin from './EnrichAdmin';

export const dynamic = 'force-dynamic';

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

export default async function EnrichPage() {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL;

  if (!user || !adminEmail || user.email !== adminEmail) {
    redirect('/');
  }

  const { data: items } = await supabase
    .from('auto_enrichment_queue')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black">聖地データ自動拡充</h1>
          <a
            href="/"
            className="text-xs text-white/40 border border-white/10 px-3 py-1.5 hover:text-white hover:border-white/30 transition-colors"
          >
            トップに戻る
          </a>
        </div>
        <EnrichAdmin items={(items as QueueItem[]) ?? []} />
      </div>
    </main>
  );
}
