"use client";

import UsageBadge from "@/components/UsageBadge";
import UserMenu from "@/components/UserMenu";

export default function PlanPageHeader() {
  return (
    <>
      <UsageBadge className="ml-3" />
      <UserMenu className="ml-2" />
    </>
  );
}
