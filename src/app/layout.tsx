import type { ReactNode } from "react";

// Root layout — rendering is handled by [locale]/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
