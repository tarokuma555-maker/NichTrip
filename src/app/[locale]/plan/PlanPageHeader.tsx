"use client";

import UsageBadge from "@/components/UsageBadge";
import UserMenu from "@/components/UserMenu";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default function PlanPageHeader() {
  return (
    <>
      <UsageBadge className="ml-3" />
      <LocaleSwitcher />
      <UserMenu className="ml-2" />
    </>
  );
}
