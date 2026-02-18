import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

const CANONICAL_HOST = 'anime-trips.com';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 0) vercel.app → 独自ドメインへ永続リダイレクト (308)
  const host = request.headers.get('host') ?? '';
  if (host.endsWith('.vercel.app')) {
    const url = new URL(request.url);
    url.hostname = CANONICAL_HOST;
    url.port = '';
    url.protocol = 'https:';
    return NextResponse.redirect(url.toString(), 308);
  }

  // 1) Run next-intl middleware first (handles locale detection & redirect)
  const intlResponse = intlMiddleware(request);

  // Use the intl response as the base, or create a new one if intl didn't redirect
  const response = intlResponse;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Supabase未設定時はスキップ（graceful degradation）
  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_url_here') {
    // anonymous session cookie だけ設定
    if (!request.cookies.get('anon_session_id')) {
      const sessionId = crypto.randomUUID();
      response.cookies.set('anon_session_id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
      });
    }
    return response;
  }

  // 2) Supabase auth session handling
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: '', ...options });
        response.cookies.set({ name, value: '', ...options });
      },
    },
  });

  // Supabase Auth セッションリフレッシュ
  await supabase.auth.getUser();

  // 未ログインユーザーにanonymous session cookie設定
  if (!request.cookies.get('anon_session_id')) {
    const sessionId = crypto.randomUUID();
    response.cookies.set('anon_session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/|api/|sitemap|robots).*)'],
};
