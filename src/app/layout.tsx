import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { AppShell } from "@/components/app-shell";
export const metadata: Metadata = { title: "OshBiz CRM", description: "Osh business directory and lightweight CRM" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><AuthProvider><AppShell>{children}</AppShell></AuthProvider></body></html>; }
