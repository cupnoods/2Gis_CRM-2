"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Building2, ChevronDown, CircleHelp, ClipboardCheck, FileDown, Globe2, LayoutDashboard, LayoutGrid, ListTodo, Map, Menu, PanelLeft, Search, Settings, SquareKanban, X } from "lucide-react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { companies as initialCompanies, tasks as initialTasks } from "@/lib/mock-data";
import type { Company, Language, Task } from "@/lib/types";
import { copy } from "@/lib/i18n";
import { cn, initials } from "@/lib/utils";

type State = { companies: Company[]; tasks: Task[]; language: Language; setLanguage: (l: Language) => void; toggleFavourite: (id: string) => void; updateCompany: (id: string, patch: Partial<Company>) => void; addNote: (id: string, text: string) => void; deleteNote: (companyId: string, noteId: string) => void; addActivity: (id: string, text: string) => void; toggleTask: (id: string) => void; moveDeal: (companyId: string, dealId: string, stage: Company["deals"][number]["stage"]) => void; addDeal: (companyId: string) => void; };
const AppContext = createContext<State | null>(null);
export function useApp() { const ctx = useContext(AppContext); if (!ctx) throw new Error("useApp must be used inside AppShell"); return ctx; }

const nav = [
  { href: "/catalogue", key: "catalogue", icon: LayoutGrid }, { href: "/map", key: "map", icon: Map }, { href: "/pipeline", key: "pipeline", icon: SquareKanban }, { href: "/tasks", key: "tasks", icon: ListTodo }, { href: "/dashboard", key: "dashboard", icon: LayoutDashboard }, { href: "/import-export", key: "exports", icon: FileDown }, { href: "/settings", key: "settings", icon: Settings },
] as const;

function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) { return <span className={cn("inline-flex shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700", size === "md" ? "size-9 text-xs" : "size-7 text-[10px]")}>{initials(name)}</span>; }
function Sidebar({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) { const pathname = usePathname(); const { language } = useApp(); const t = copy[language]; return <><aside className={cn("fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col border-r border-[#e4e7ec] bg-white transition-transform lg:static lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}><div className="flex h-16 items-center gap-3 border-b border-[#f0f1f3] px-5"><div className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">O</div><div><div className="font-semibold tracking-tight">OshBiz CRM</div><div className="text-[11px] text-[#98a2b3]">Osh, Kyrgyzstan</div></div><button className="ml-auto rounded-lg p-2 text-[#667085] hover:bg-[#f6f7f9] lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation"><X size={18} /></button></div><div className="flex-1 overflow-y-auto px-3 py-5"><p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[.16em] text-[#98a2b3]">Workspace</p>{nav.map(({ href, key, icon: Icon }) => { const active = pathname.startsWith(href); return <Link key={href} href={href} onClick={() => setOpen(false)} className={cn("mb-1 flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors", active ? "bg-indigo-50 font-semibold text-indigo-700" : "text-[#667085] hover:bg-[#f6f7f9] hover:text-[#344054]")}><Icon size={18} strokeWidth={active ? 2.2 : 1.8} />{t[key]}</Link>; })}</div><div className="m-3 rounded-xl bg-[#f8f9fb] p-3"><div className="flex items-center gap-2"><Avatar name="Alex Will" /><div><div className="text-xs font-semibold">Alex Will</div><div className="text-[11px] text-[#98a2b3]">Owner</div></div><ChevronDown size={14} className="ml-auto text-[#98a2b3]" /></div></div></aside>{open && <button className="fixed inset-0 z-30 bg-[#101828]/20 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation overlay" />}</>; }
function Topbar({ onMenu }: { onMenu: () => void }) { const { language, setLanguage } = useApp(); const pathname = usePathname(); const current = nav.find((item) => pathname.startsWith(item.href)); const t = copy[language]; return <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-[#e4e7ec] bg-white/95 px-4 backdrop-blur sm:px-6"><button onClick={onMenu} className="rounded-lg p-2 text-[#667085] hover:bg-[#f6f7f9] lg:hidden" aria-label="Open navigation"><Menu size={20} /></button><div className="hidden items-center gap-2 text-sm text-[#98a2b3] sm:flex"><span>OshBiz CRM</span><span>/</span><span className="font-medium text-[#344054]">{current ? t[current.key] : "Workspace"}</span></div><div className="relative ml-auto hidden w-full max-w-[360px] md:block"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98a2b3]" /><input aria-label="Global search" placeholder={t.search} className="h-9 w-full rounded-lg border border-[#e4e7ec] bg-[#f9fafb] pl-9 pr-16 text-sm outline-none transition focus:border-indigo-400 focus:bg-white" /><kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-[#e4e7ec] bg-white px-1.5 py-0.5 text-[10px] text-[#98a2b3]">⌘ K</kbd></div><button onClick={() => setLanguage(language === "en" ? "ru" : "en")} className="flex min-h-10 items-center gap-1 rounded-lg px-2 text-xs font-medium text-[#667085] hover:bg-[#f6f7f9]" title="Switch language"><Globe2 size={16} />{language === "en" ? "EN" : "RU"}<ChevronDown size={13} /></button><button className="relative rounded-lg p-2 text-[#667085] hover:bg-[#f6f7f9]" aria-label="Notifications"><Bell size={18} /><span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-indigo-600" /></button><button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-[#f6f7f9]" aria-label="Open user menu"><Avatar name="Alex Will" /><ChevronDown size={14} className="text-[#98a2b3]" /></button></header>; }
function MobileNav() { const pathname = usePathname(); const { language } = useApp(); const t = copy[language]; const items = [{ href: "/catalogue", label: t.companies, icon: Building2 }, { href: "/map", label: t.map, icon: Map }, { href: "/pipeline", label: t.pipeline, icon: SquareKanban }, { href: "/tasks", label: t.tasks, icon: ClipboardCheck }, { href: "/settings", label: "More", icon: Menu }]; return <nav className="fixed inset-x-0 bottom-0 z-20 grid h-[68px] grid-cols-5 border-t border-[#e4e7ec] bg-white pb-safe lg:hidden">{items.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={cn("flex flex-col items-center justify-center gap-1 text-[10px]", pathname.startsWith(href) ? "font-semibold text-indigo-600" : "text-[#667085]")}><Icon size={19} /><span>{label}</span></Link>)}</nav>; }

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const [companies, setCompanies] = useState<Company[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("oshbiz_companies");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return initialCompanies;
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("oshbiz_tasks");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return initialTasks;
  });

  // Sync to localStorage on update
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("oshbiz_companies", JSON.stringify(companies));
    }
  }, [companies]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("oshbiz_tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const value = useMemo<State>(
    () => ({
      language,
      setLanguage,
      companies,
      tasks,
      toggleFavourite: (id) =>
        setCompanies((list) =>
          list.map((c) => (c.id === id ? { ...c, favourite: !c.favourite } : c))
        ),
      updateCompany: (id, patch) =>
        setCompanies((list) =>
          list.map((c) => (c.id === id ? { ...c, ...patch } : c))
        ),
      addNote: (id, text) =>
        setCompanies((list) =>
          list.map((c) =>
            c.id === id
              ? {
                  ...c,
                  notes: [
                    {
                      id: `note-${Date.now()}`,
                      text,
                      author: "Alex",
                      createdAt: "Just now",
                    },
                    ...c.notes,
                  ],
                }
              : c
          )
        ),
      deleteNote: (companyId, noteId) =>
        setCompanies((list) =>
          list.map((c) =>
            c.id === companyId
              ? { ...c, notes: c.notes.filter((note) => note.id !== noteId) }
              : c
          )
        ),
      addActivity: (id, text) =>
        setCompanies((list) =>
          list.map((c) =>
            c.id === id
              ? {
                  ...c,
                  activities: [
                    {
                      id: `activity-${Date.now()}`,
                      type: "note",
                      text,
                      author: "Alex",
                      date: "Just now",
                    },
                    ...c.activities,
                  ],
                }
              : c
          )
        ),
      toggleTask: (id) =>
        setTasks((list) =>
          list.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completed: !task.completed,
                  bucket: task.completed ? "Today" : "Completed",
                }
              : task
          )
        ),
      moveDeal: (companyId, dealId, stage) =>
        setCompanies((list) =>
          list.map((c) =>
            c.id === companyId
              ? {
                  ...c,
                  deals: c.deals.map((deal) =>
                    deal.id === dealId ? { ...deal, stage } : deal
                  ),
                }
              : c
          )
        ),
      addDeal: (id) =>
        setCompanies((list) =>
          list.map((c) =>
            c.id === id
              ? {
                  ...c,
                  deals: [
                    ...c.deals,
                    {
                      id: `deal-${Date.now()}`,
                      title: "New opportunity",
                      stage: "New",
                      amount: 25000,
                      currency: "KGS",
                      assignee: "Alex",
                      nextAction: "Add next action",
                      priority: "B",
                    },
                  ],
                }
              : c
          ),
        ),
    }),
    [companies, tasks, language]
  );

  return (
    <AppContext.Provider value={value}>
      <div className="flex min-h-screen bg-[#f6f7f9]">
        <Sidebar open={open} setOpen={setOpen} />
        <div className="min-w-0 flex-1">
          <Topbar onMenu={() => setOpen(true)} />
          <main className="mx-auto min-h-[calc(100vh-64px)] max-w-[1680px] px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-8">
            {children}
          </main>
        </div>
        <MobileNav />
      </div>
    </AppContext.Provider>
  );
}
