import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase-server';
import { checkUsageLimit } from '@/lib/usage';
import { isProUser } from '@/lib/subscription';

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const sessionId = request.cookies.get('anon_session_id')?.value ?? '';
    const pro = user ? await isProUser(user.id, user.email) : false;
    const usage = await checkUsageLimit(user?.id ?? null, sessionId, pro);

    return NextResponse.json({
      ...usage,
      isPro: pro,
      isAuthenticated: !!user,
    });
  } catch {
    // Supabase未設定時のfallback
    return NextResponse.json({
      allowed: true,
      used: 0,
      limit: 3,
      isPro: false,
      isAuthenticated: false,
    });
  }
}
