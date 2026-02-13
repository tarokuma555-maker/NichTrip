import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") ?? "work";
  const title = searchParams.get("title") ?? "AnimeTrips";
  const spots = searchParams.get("spots") ?? "";
  const subtitle = searchParams.get("subtitle") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #0a0a0a 100%)",
          position: "relative",
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Red accent line top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #E53E3E, transparent)",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 60px",
            maxWidth: "100%",
          }}
        >
          {/* Type badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                background: "#E53E3E",
                color: "white",
                fontSize: "14px",
                fontWeight: 900,
                padding: "4px 16px",
                letterSpacing: "0.15em",
                display: "flex",
              }}
            >
              {type === "blog" ? "BLOG" : "PILGRIMAGE GUIDE"}
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 20 ? "48px" : "56px",
              fontWeight: 900,
              color: "white",
              textAlign: "center",
              lineHeight: 1.2,
              maxWidth: "900px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {title}
          </div>

          {/* Subtitle / spots count */}
          {(spots || subtitle) && (
            <div
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.5)",
                marginTop: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {spots ? `聖地スポット ${spots}箇所` : subtitle}
            </div>
          )}

          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "40px",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                fontWeight: 900,
                color: "#E53E3E",
                letterSpacing: "0.05em",
                display: "flex",
              }}
            >
              AnimeTrips
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.3)",
                display: "flex",
              }}
            >
              アニメ聖地巡礼プラン
            </div>
          </div>
        </div>

        {/* Red accent line bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #E53E3E, transparent)",
            display: "flex",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
