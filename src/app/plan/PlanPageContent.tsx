"use client";

import { useSearchParams } from "next/navigation";
import ConditionForm from "@/components/ConditionForm";
import type { PlanRequest } from "@/lib/types";

const VALID_THEMES: PlanRequest["theme"][] = [
  "pilgrimage",
  "powerspot",
  "gourmet",
];

export default function PlanPageContent() {
  const searchParams = useSearchParams();

  const themeParam = searchParams.get("theme") ?? "pilgrimage";
  const theme: PlanRequest["theme"] = VALID_THEMES.includes(
    themeParam as PlanRequest["theme"]
  )
    ? (themeParam as PlanRequest["theme"])
    : "pilgrimage";

  const work = searchParams.get("work") ?? undefined;

  return <ConditionForm theme={theme} work={work} />;
}
