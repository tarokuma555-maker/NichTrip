import { NextRequest, NextResponse } from "next/server";

const RAKUTEN_API_URL =
  "https://openapi.rakuten.co.jp/engine/api/Travel/SimpleHotelSearch/20170426";

/**
 * Convert WGS84 decimal degrees to Rakuten Travel coordinate format.
 * Rakuten uses Japan Geodetic Datum in DMS (millisecond-level):
 *   degrees * 3600 + minutes * 60 + seconds
 */
function toRakutenCoord(decimal: number): string {
  const degrees = Math.floor(decimal);
  const minutesDecimal = (decimal - degrees) * 60;
  const minutes = Math.floor(minutesDecimal);
  const seconds = (minutesDecimal - minutes) * 60;
  return (degrees * 3600 + minutes * 60 + seconds).toFixed(2);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");
  const radius = parseInt(searchParams.get("radius") ?? "3", 10);
  const hits = parseInt(searchParams.get("hits") ?? "5", 10);
  const sort = searchParams.get("sort") ?? "standard";

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: "lat and lng are required" }, { status: 400 });
  }

  const accessKey = process.env.RAKUTEN_ACCESS_KEY;
  const appId = process.env.RAKUTEN_APP_ID;
  const affiliateId = process.env.RAKUTEN_AFFILIATE_ID;

  if (!appId) {
    return NextResponse.json({ error: "Rakuten API not configured" }, { status: 500 });
  }

  const rakutenLat = toRakutenCoord(lat);
  const rakutenLng = toRakutenCoord(lng);

  const params = new URLSearchParams({
    format: "json",
    applicationId: appId,
    ...(accessKey && { accessKey }),
    ...(affiliateId && { affiliateId }),
    latitude: rakutenLat,
    longitude: rakutenLng,
    searchRadius: String(Math.min(Math.max(radius, 1), 3)),
    hits: String(Math.min(Math.max(hits, 1), 30)),
    sort,
  });

  try {
    const res = await fetch(`${RAKUTEN_API_URL}?${params.toString()}`, {
      headers: {
        Referer: process.env.NEXT_PUBLIC_SITE_URL || "https://anime-trips-7bd7.vercel.app/",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("Rakuten API error:", res.status, text);
      return NextResponse.json({ hotels: [], count: 0 });
    }

    const data = await res.json();

    if (!data.hotels || !Array.isArray(data.hotels)) {
      return NextResponse.json({ hotels: [], count: 0 });
    }

    const hotels = data.hotels.map((h: Record<string, unknown>) => {
      const hotelArr = h.hotel as Record<string, Record<string, unknown>>[];
      const basic = hotelArr?.[0]?.hotelBasicInfo ?? {};
      const rating = hotelArr?.[1]?.hotelRatingInfo ?? {};

      const hotelNo = Number(basic.hotelNo) || 0;
      // API返却のアフィリエイトURL（ホテル固有）を優先、なければ直接リンク
      const bookingUrl =
        (basic.planListUrl as string) ||
        (basic.hotelInformationUrl as string) ||
        `https://hotel.travel.rakuten.co.jp/hotelinfo/plan/${hotelNo}`;

      return {
        id: hotelNo,
        name: basic.hotelName ?? "",
        description: basic.hotelSpecial ?? "",
        minPrice: basic.hotelMinCharge ?? null,
        address: `${basic.address1 ?? ""}${basic.address2 ?? ""}`,
        access: basic.access ?? "",
        nearestStation: basic.nearestStation ?? "",
        imageUrl: basic.hotelImageUrl ?? null,
        thumbnailUrl: basic.hotelThumbnailUrl ?? null,
        bookingUrl,
        infoUrl: (basic.hotelInformationUrl as string) ?? "",
        reviewCount: basic.reviewCount ?? 0,
        reviewAverage: basic.reviewAverage ?? null,
        rating: {
          service: rating.serviceAverage ?? null,
          location: rating.locationAverage ?? null,
          room: rating.roomAverage ?? null,
          equipment: rating.equipmentAverage ?? null,
          bath: rating.bathAverage ?? null,
          meal: rating.mealAverage ?? null,
        },
      };
    });

    return NextResponse.json({
      count: data.pagingInfo?.recordCount ?? hotels.length,
      hotels,
    });
  } catch (err) {
    console.error("Rakuten API fetch error:", err);
    return NextResponse.json({ hotels: [], count: 0 });
  }
}
