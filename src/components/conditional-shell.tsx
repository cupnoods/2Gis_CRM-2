"use client";
import { usePathname } from "next/navigation";
import { AppShell } from "@/components/app-shell";

// Routes that should NOT have the AppShell sidebar/topbar
const PUBLIC_ROUTES = ["/login", "/signup"];

export function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));

  if (isPublic) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}
