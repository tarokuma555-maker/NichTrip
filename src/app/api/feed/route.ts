import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createSupabaseServer();

    const { data: reviews } = await supabase
      .from("spot_reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    return NextResponse.json({ reviews: reviews ?? [] });
  } catch (error) {
    console.error("feed GET error:", error);
    return NextResponse.json({ reviews: [] });
  }
}
