"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { type MapSpot } from "@/components/MapView";
import { type WorkSpot } from "@/lib/works-data";

const MapView = dynamic(() => import("@/components/MapView"), {
  loading: () => (
    <div className="w-full h-80 sm:h-[420px] rounded-2xl bg-white/5 animate-pulse flex items-center justify-center border border-white/10">
      <span className="text-white/30 text-sm">Loading map...</span>
    </div>
  ),
  ssr: false,
});

export default function WorkMap({
  spots,
  focusIndex,
}: {
  spots: WorkSpot[];
  focusIndex: number | null;
}) {
  const t = useTranslations("WorkDetail");

  const mapSpots: MapSpot[] = useMemo(
    () =>
      spots.map((s, i) => ({
        lat: s.lat,
        lng: s.lng,
        name: s.name,
        dayNumber: 1,
        globalIndex: i + 1,
      })),
    [spots],
  );

  const dayGroups = useMemo(() => [mapSpots], [mapSpots]);

  return (
    <div>
      <p className="text-sm font-black text-white/60 mb-3">{t("mapTitle")}</p>
      <MapView
        spots={mapSpots}
        dayGroups={dayGroups}
        focusIndex={focusIndex}
        transportMode="train"
      />
    </div>
  );
}
