"use client";
import { useState, useEffect } from "react";
import { BellRing, Database, KeyRound, Languages, ShieldCheck, SlidersHorizontal, Users, User, CheckCircle2 } from "lucide-react";
import { Button, PageHeader, SectionCard } from "@/components/ui";
import { useApp } from "@/components/app-shell";

export default function SettingsPage() {
  const { user, updateUserProfile } = useApp();
  const [activeTab, setActiveTab] = useState("Profile & workspace");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "Sales Manager");
  const [workspaceName, setWorkspaceName] = useState(user?.workspaceName || "OshBiz CRM Workspace");
  const [currency, setCurrency] = useState<"KGS" | "USD">(user?.currency || "KGS");
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role || "Sales Manager");
      setWorkspaceName(user.workspaceName || "OshBiz CRM Workspace");
      setCurrency(user.currency || "KGS");
    }
  }, [user]);

  const handleSave = () => {
    updateUserProfile({
      name,
      email,
      role,
      workspaceName,
      currency,
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const tabs = [
    [User, "Profile & workspace"],
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
        description="Manage your account profile, isolated workspace preferences, pipeline stages, and Supabase integration."
        actions={
          <div className="flex items-center gap-2">
            {savedMsg && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                <CheckCircle2 size={14} /> Saved!
              </span>
            )}
            <Button variant="primary" onClick={handleSave}>Save changes</Button>
          </div>
        }
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
          {activeTab === "Profile & workspace" && (
            <SectionCard title="User Profile & Workspace">
              <div className="grid gap-4 p-5 sm:grid-cols-2">
                <label className="text-sm font-medium text-[#475467]">
                  Full Name
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 h-11 w-full rounded-lg border border-[#d0d5dd] px-3 outline-none focus:border-indigo-500"
                  />
                </label>

                <label className="text-sm font-medium text-[#475467]">
                  Email Address
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 h-11 w-full rounded-lg border border-[#d0d5dd] px-3 outline-none focus:border-indigo-500"
                  />
                </label>

                <label className="text-sm font-medium text-[#475467]">
                  Role / Title
                  <input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1 h-11 w-full rounded-lg border border-[#d0d5dd] px-3 outline-none focus:border-indigo-500"
                  />
                </label>

                <label className="text-sm font-medium text-[#475467]">
                  Workspace Name
                  <input
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="mt-1 h-11 w-full rounded-lg border border-[#d0d5dd] px-3 outline-none focus:border-indigo-500"
                  />
                </label>

                <label className="text-sm font-medium text-[#475467]">
                  Default Currency
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as "KGS" | "USD")}
                    className="mt-1 h-11 w-full rounded-lg border border-[#d0d5dd] bg-white px-3 text-sm"
                  >
                    <option value="KGS">KGS (Kyrgyzstani Som)</option>
                    <option value="USD">USD ($)</option>
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
                  Connected to Supabase database. Tables `profiles`, `statuses`, `companies`, `notes`, and `tasks` are configured with Row Level Security (RLS).
                </div>
                <div className="mt-2 rounded-lg bg-[#f8f9fb] p-3 font-mono text-xs text-[#344054]">
                  <div>NEXT_PUBLIC_SUPABASE_URL: https://xyzcompany.supabase.co</div>
                  <div>Status table: public.statuses (4 default options)</div>
                </div>
              </div>
            </SectionCard>
          )}

          {(activeTab === "Language" || activeTab === "Notifications" || activeTab === "Security") && (
            <SectionCard title={activeTab}>
              <div className="p-5 text-sm text-[#667085]">
                {activeTab} settings panel active for {user?.name || "current user"}. Configure preferences below.
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}
