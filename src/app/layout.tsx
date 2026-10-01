import type { Metadata } from "next";
import "./globals.css";
import { ConditionalShell } from "@/components/conditional-shell";

export const metadata: Metadata = {
  title: "OshBiz CRM",
  description: "Osh business directory and lightweight CRM",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f6f7f9]">
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  );
}


