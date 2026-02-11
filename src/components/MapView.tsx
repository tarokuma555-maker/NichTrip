"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  MarkerF,
  InfoWindowF,
  PolylineF,
} from "@react-google-maps/api";

export type MapSpot = {
  lat: number;
  lng: number;
  name: string;
  dayNumber: number;
  globalIndex: number; // 1-based
};

const DAY_COLORS = [
  "#E53E3E", // Day 1 accent
  "#3182CE", // Day 2 blue
  "#38A169", // Day 3 green
  "#D69E2E", // Day 4 gold
  "#805AD5", // Day 5 purple
];

const DARK_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2a2a3e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1a1a2e" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3a3a4e" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1626" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#1a2e1a" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#2a2a3e" }] },
];

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  styles: DARK_MAP_STYLES,
};

/** ピン型 SVG マーカーを生成 */
function markerIconUrl(num: number, color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="38" viewBox="0 0 28 38">
    <path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 24 14 24s14-13.5 14-24C28 6.3 21.7 0 14 0z" fill="${color}"/>
    <circle cx="14" cy="13" r="9" fill="#fff"/>
    <text x="14" y="17" text-anchor="middle" font-size="11" font-weight="700" font-family="sans-serif" fill="${color}">${num}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export default function MapView({
  spots,
  dayGroups,
  focusIndex,
  transportMode = "train",
}: {
  spots: MapSpot[];
  dayGroups: MapSpot[][];
  focusIndex: number | null;
  transportMode?: string;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  /* ---- マップ読み込み時に全スポットが収まるようにズーム ---- */
  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      if (spots.length === 0) return;

      const bounds = new google.maps.LatLngBounds();
      spots.forEach((s) => bounds.extend({ lat: s.lat, lng: s.lng }));
      map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
    },
    [spots],
  );

  /* ---- focusIndex が変わったらパン ---- */
  useEffect(() => {
    if (focusIndex === null || !mapRef.current) return;
    const spot = spots.find((s) => s.globalIndex === focusIndex);
    if (!spot) return;

    mapRef.current.panTo({ lat: spot.lat, lng: spot.lng });
    mapRef.current.setZoom(16);
    setActiveIdx(focusIndex);
  }, [focusIndex, spots]);

  /** 交通モードに応じたポリラインオプション */
  function getPolylineOptions(color: string) {
    if (transportMode === "walk") {
      return {
        strokeColor: color,
        strokeWeight: 2,
        strokeOpacity: 0,
        icons: [
          {
            icon: {
              path: "M 0,-1 0,1",
              strokeOpacity: 0.7,
              scale: 3,
            },
            offset: "0",
            repeat: "16px",
          },
        ],
        geodesic: true,
      };
    }
    return {
      strokeColor: color,
      strokeWeight: transportMode === "car" ? 4 : 3,
      strokeOpacity: 0.65,
      geodesic: true,
    };
  }

  /* ---- 未設定 / エラー / 読み込み中 ---- */
  if (!apiKey || apiKey === "your_key_here") {
    return <Fallback message="Google Maps APIキーを .env.local に設定してください" />;
  }
  if (loadError) {
    return <Fallback message="Google Maps の読み込みに失敗しました" />;
  }
  if (!isLoaded) {
    return (
      <div className="w-full h-80 rounded-2xl bg-white/5 animate-pulse flex items-center justify-center">
        <span className="text-white/30 text-sm">地図を読み込み中...</span>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerClassName="w-full h-80 sm:h-[420px] rounded-2xl border border-white/10"
      onLoad={onMapLoad}
      options={MAP_OPTIONS}
    >
      {/* ===== 日ごとのポリライン ===== */}
      {dayGroups.map((group, i) => (
        <PolylineF
          key={`${i}-${transportMode}`}
          path={group.map((s) => ({ lat: s.lat, lng: s.lng }))}
          options={getPolylineOptions(DAY_COLORS[i % DAY_COLORS.length])}
        />
      ))}

      {/* ===== マーカー ===== */}
      {spots.map((spot) => {
        const color = DAY_COLORS[(spot.dayNumber - 1) % DAY_COLORS.length];

        return (
          <MarkerF
            key={spot.globalIndex}
            position={{ lat: spot.lat, lng: spot.lng }}
            icon={{
              url: markerIconUrl(spot.globalIndex, color),
              scaledSize: new google.maps.Size(28, 38),
              anchor: new google.maps.Point(14, 38),
            }}
            onClick={() => setActiveIdx(spot.globalIndex)}
            zIndex={activeIdx === spot.globalIndex ? 999 : spot.globalIndex}
          >
            {activeIdx === spot.globalIndex && (
              <InfoWindowF
                position={{ lat: spot.lat, lng: spot.lng }}
                onCloseClick={() => setActiveIdx(null)}
              >
                <div className="px-1 py-0.5 max-w-[200px]">
                  <p className="font-bold text-sm text-[#1A365D] leading-snug">
                    {spot.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Day {spot.dayNumber} - スポット {spot.globalIndex}
                  </p>
                </div>
              </InfoWindowF>
            )}
          </MarkerF>
        );
      })}
    </GoogleMap>
  );
}

/* ========== Fallback ========== */

function Fallback({ message }: { message: string }) {
  return (
    <div className="w-full h-80 rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 px-4">
      <span className="text-3xl">🗺️</span>
      <p className="text-sm text-white/50 text-center">{message}</p>
    </div>
  );
}
