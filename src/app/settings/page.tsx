"use client";
import { useState } from "react";
import { BellRing, Database, KeyRound, Languages, ShieldCheck, SlidersHorizontal, Users } from "lucide-react";
import { Button, PageHeader, SectionCard } from "@/components/ui";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Users & roles");

  const tabs = [
    [Users, "Users & roles"],
    [SlidersHorizontal, "Pipeline stages"],
    [Languages, "Language"],
    [Database, "Data & sync"],
    [BellRing, "Notifications"],
    [ShieldCheck, "Security"],
  ] as const;

  return (
    <div>
      <PageHeader
        eyebrow="Workspace controls"
        title="Settings"
        description="Configure CRM pipeline stages, user roles, language options, and Supabase connection settings."
        actions={<Button variant="primary">Save changes</Button>}
      />
      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav className="flex gap-1 overflow-x-auto lg:block">
          {tabs.map(([Icon, label]) => (
            <button
              key={label}
              onClick={() => setActiveTab(label)}
              className={`flex min-h-10 shrink-0 items-center gap-3 rounded-lg px-3 text-sm transition lg:w-full ${
                activeTab === label
                  ? "bg-indigo-50 font-semibold text-indigo-700"
                  : "text-[#667085] hover:bg-white hover:text-[#344054]"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div className="space-y-5">
          {activeTab === "Users & roles" && (
            <SectionCard title="Workspace Users & Roles">
              <div className="grid gap-4 p-5 sm:grid-cols-2">
                <label className="text-sm text-[#475467]">
                  Workspace Name
                  <input
                    defaultValue="Osh Consulting Group"
                    className="mt-1 h-11 w-full rounded-lg border border-[#d0d5dd] px-3 outline-none focus:border-indigo-500"
                  />
                </label>
                <label className="text-sm text-[#475467]">
                  Default Currency
                  <select defaultValue="KGS" className="mt-1 h-11 w-full rounded-lg border border-[#d0d5dd] bg-white px-3">
                    <option>KGS</option>
                    <option>USD</option>
                  </select>
                </label>
              </div>
            </SectionCard>
          )}

          {activeTab === "Pipeline stages" && (
            <SectionCard title="Pipeline Stages">
              <div className="space-y-2 p-5">
                {["New", "Qualified", "Contact made", "Meeting", "Proposal", "Negotiation", "Won", "Lost"].map((stage, index) => (
                  <div key={stage} className="flex items-center gap-3 rounded-lg border border-[#e4e7ec] p-3">
                    <span className="text-xs text-[#98a2b3]">{String(index + 1).padStart(2, "0")}</span>
                    <span className="flex-1 font-medium text-[#344054]">{stage}</span>
                    <button className="text-xs text-[#667085] hover:text-indigo-600">Edit</button>
                  </div>
                ))}
                <Button className="mt-2">
                  <SlidersHorizontal size={15} /> Add Stage
                </Button>
              </div>
            </SectionCard>
          )}

          {activeTab === "Data & sync" && (
            <SectionCard title="Supabase Database Connection">
              <div className="flex flex-col gap-3 p-5">
                <div className="font-semibold text-[#101828]">Supabase Connection Status</div>
                <div className="text-sm text-[#667085]">
                  Connect your Vercel Next.js frontend to Supabase PostgreSQL database. Paste `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel Environment Variables.
                </div>
              </div>
            </SectionCard>
          )}

          {(activeTab === "Language" || activeTab === "Notifications" || activeTab === "Security") && (
            <SectionCard title={activeTab}>
              <div className="p-5 text-sm text-[#667085]">
                {activeTab} settings panel active. Configure preferences below.
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}

