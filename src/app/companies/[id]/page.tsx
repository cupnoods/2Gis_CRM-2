"use client";
import { useState } from "react";
import { ArrowLeft, CalendarClock, Camera, Check, ChevronDown, CircleDot, ExternalLink, Globe, Heart, MapPin, MessageCircle, Phone, Plus, Send, Star, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Badge, Button, NoteList, PageHeader, PriorityIndicator, QuickAction, SectionCard, StatusSelect } from "@/components/ui";
import { useApp } from "@/components/app-shell";
import { webUrl } from "@/lib/csv";
import type { Stage } from "@/lib/types";

const tabs = ["Overview", "Pipeline", "Notes", "Activity"] as const;

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium text-[#98a2b3]">{label}</div>
      <div className="mt-1 text-sm text-[#344054]">{value}</div>
    </div>
  );
}

export default function CompanyDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { companies, updateCompany, addNote, addActivity, addDeal, toggleFavourite, tasks, create } = useApp();
  const company = companies.find((item) => item.id === params.id);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  const [note, setNote] = useState("");
  const [activity, setActivity] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  if (!company) return <div><PageHeader title="Company not found" description="This company does not exist in the current workspace." /><Button onClick={() => router.push("/catalogue")}>Back to catalogue</Button></div>;

  const addTheNote = () => {
    if (!note.trim()) return;
    addNote(company.id, note.trim());
    setNote("");
  };

  const addTheActivity = () => {
    if (!activity.trim()) return;
    addActivity(company.id, activity.trim());
    setActivity("");
  };

  const quickStats = [
    { label: "Rating", value: `${company.rating.toFixed(1)}/5`, icon: Star },
    { label: "Deals", value: `${company.deals.length}`, icon: Users },
    { label: "Tasks", value: String(tasks.filter(task => task.companyId === company.id && !task.completed).length), icon: Check },
    { label: "Verified", value: company.verified ? "Yes" : "No", icon: CircleDot },
  ];

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push("/catalogue")}
        className="mb-5 inline-flex min-h-10 items-center gap-2 text-sm font-medium text-[#667085] hover:text-indigo-600"
      >
        <ArrowLeft size={16} />
        Back to catalogue
      </button>

      <PageHeader
        eyebrow="Company profile"
        title={company.name}
        description={`${company.category} · ${company.address}`}
        actions={
          <>
            <StatusSelect companyId={company.id} status={company.status} />
            <PriorityIndicator priority={company.priority} showLabel />
            <Button variant="secondary" onClick={() => toggleFavourite(company.id)} aria-pressed={company.favourite}>
              <Heart size={16} className={company.favourite ? "fill-violet-500 text-violet-500" : ""} />
              Favourite
            </Button>
          </>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <QuickAction href={company.phone ? `tel:${company.phone}` : undefined} icon={Phone} label="Call" />
        <QuickAction href={webUrl(company.whatsapp)} icon={MessageCircle} label="WhatsApp" />
        <QuickAction href={company.instagram ? `https://www.instagram.com/${encodeURIComponent(company.instagram.replace(/^@/, ""))}/` : undefined} icon={Camera} label="Instagram" />
        <QuickAction href={webUrl(company.website)} icon={Globe} label="Website" />
        <QuickAction href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(company.address)}`} icon={MapPin} label="Directions" />
        <QuickAction href={`https://2gis.kg/osh/search/${encodeURIComponent(company.name + " " + company.address)}`} icon={ExternalLink} label="Open in 2GIS" />
      </div>

      <div className="mb-6 flex gap-1 overflow-x-auto rounded-lg border border-[#e4e7ec] bg-[#f9fafb] p-1">
        {tabs.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`min-h-9 rounded-md px-3 text-sm font-medium transition ${
              tab === item ? "bg-white text-[#344054] shadow-sm" : "text-[#667085] hover:text-[#344054]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickStats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-[#e4e7ec] bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#667085]">{label}</span>
              <span className="flex size-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Icon size={18} />
              </span>
            </div>
            <div className="mt-3 text-2xl font-semibold text-[#101828]">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <SectionCard title="Overview" className={tab === "Overview" ? "overflow-hidden" : "hidden"}>
          <div className="p-5">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <Info label="Primary contact" value={company.assignee} />
              <Info label="District" value={company.district} />
              <Info label="Phone" value={company.phone ?? "Not provided"} />
              <Info label="WhatsApp" value={company.whatsapp ?? "Not provided"} />
              <Info label="Website" value={company.website ?? "Not provided"} />
              <Info label="Next action" value={company.nextAction ?? "No action set"} />
            </div>

            <div className="mt-5 rounded-lg border border-[#e4e7ec] bg-[#f9fafb] p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-[#344054]">Company details</div>
                <button
                  onClick={() => setShowDetails((value) => !value)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#667085]"
                >
                  {showDetails ? "Hide" : "Show"}
                  <ChevronDown size={14} className={showDetails ? "rotate-180" : ""} />
                </button>
              </div>

              {showDetails && (
                <div className="mt-4 grid gap-3 text-sm text-[#475467] sm:grid-cols-2">
                  <div>Category: {company.category}</div>
                  <div>Assignee: {company.assignee}</div>
                  <div>Priority: {company.priority}</div>
                  <div>Wishlist: {company.wishlist ? "Yes" : "No"}</div>
                  <div>Verified: {company.verified ? "Verified" : "Unverified"}</div>
                  <div>Favourite: {company.favourite ? "Yes" : "No"}</div>
                </div>
              )}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Pipeline" className={tab === "Overview" || tab === "Pipeline" ? "h-fit" : "hidden"}>
          <div className="p-5 space-y-3">
            {company.deals.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[#d0d5dd] p-4 text-sm text-[#98a2b3]">
                No deals yet.
              </div>
            ) : (
              company.deals.map((deal) => (
                <div key={deal.id} className="rounded-lg border border-[#e4e7ec] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-[#344054]">{deal.title}</div>
                      <div className="mt-1 text-xs text-[#98a2b3]">{deal.assignee}</div>
                    </div>
                    <Badge tone="violet">{deal.stage}</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="font-semibold text-[#101828]">
                      {deal.amount.toLocaleString()} {deal.currency}
                    </span>
                    <span className="text-[#667085]">{deal.priority}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <select
                      value={deal.stage}
                      onChange={(event) =>
                        updateCompany(company.id, {
                          deals: company.deals.map((item) =>
                            item.id === deal.id ? { ...item, stage: event.target.value as Stage } : item,
                          ),
                        })
                      }
                      className="w-full rounded-lg border border-[#d0d5dd] bg-white px-2 py-1.5 text-xs text-[#344054] outline-none"
                    >
                      {[
                        "New",
                        "Qualified",
                        "Contact made",
                        "Meeting",
                        "Proposal",
                        "Negotiation",
                        "Won",
                        "Lost",
                      ].map((stage) => (
                        <option key={stage} value={stage}>
                          {stage}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))
            )}
            <Button variant="secondary" className="w-full" onClick={() => addDeal(company.id)}>
              <Plus size={14} />
              Add deal
            </Button>
          </div>
        </SectionCard>
      </div>

      {tab === "Notes" && (
        <SectionCard title="Notes">
          <div className="p-5">
            <div className="mb-4 flex gap-2">
              <input
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Add a note"
                className="h-10 flex-1 rounded-lg border border-[#d0d5dd] bg-white px-3 text-sm text-[#344054] outline-none focus:border-indigo-500"
              />
              <Button variant="primary" disabled={!note.trim()} onClick={addTheNote}>
                <Send size={14} />
                Save
              </Button>
            </div>
            <NoteList company={company} />
          </div>
        </SectionCard>
      )}

      {tab === "Activity" && (
        <SectionCard title="Recent activity">
          <div className="p-5">
            <div className="mb-4 flex gap-2">
              <input
                value={activity}
                onChange={(event) => setActivity(event.target.value)}
                placeholder="Log activity"
                className="h-10 flex-1 rounded-lg border border-[#d0d5dd] bg-white px-3 text-sm text-[#344054] outline-none focus:border-indigo-500"
              />
              <Button variant="primary" disabled={!activity.trim()} onClick={addTheActivity}>
                <Plus size={14} />
                Add
              </Button>
            </div>

            <div className="space-y-3">
              {company.activities.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[#d0d5dd] p-4 text-sm text-[#98a2b3]">
                  No activity logged yet.
                </div>
              ) : (
                company.activities.map((entry) => (
                  <div key={entry.id} className="flex gap-3 rounded-lg border border-[#e4e7ec] p-3">
                    <div className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                      <CalendarClock size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-[#344054]">{entry.type}</div>
                      <div className="mt-1 text-sm text-[#475467]">{entry.text}</div>
                      <div className="mt-1 text-xs text-[#98a2b3]">
                        {entry.author} · {entry.date}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </SectionCard>
      )}

      {tab === "Pipeline" && (
        <SectionCard title="Sales timeline">
          <div className="p-5">
            <div className="space-y-4">
              {company.deals.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[#d0d5dd] p-4 text-sm text-[#98a2b3]">
                  No deals to display.
                </div>
              ) : (
                company.deals.map((deal) => (
                  <div key={deal.id} className="flex items-start gap-3 rounded-lg border border-[#e4e7ec] p-3">
                    <div className="mt-1 flex size-7 items-center justify-center rounded-full bg-[#f2f4f7] text-[#667085]">
                      <CircleDot size={13} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-[#344054]">{deal.title}</span>
                        <Badge tone="indigo">{deal.stage}</Badge>
                      </div>
                      <div className="mt-1 text-sm text-[#475467]">{deal.nextAction}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </SectionCard>
      )}

      <SectionCard title="Contacts and tags">
        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            {company.tags.map((item) => (
              <Badge key={item} tone="neutral">{item}</Badge>
            ))}
          </div>
          <form className="mt-4 flex gap-2" onSubmit={e => { e.preventDefault(); const form = e.currentTarget; const tag = String(new FormData(form).get('tag') ?? '').trim(); if (tag) { updateCompany(company.id, { tags: Array.from(new Set([...company.tags, tag])) }); form.reset(); } }}><input aria-label="New tag" name="tag" required maxLength={40} placeholder="New tag" className="rounded-lg border px-3" /><Button type="submit" size="sm">Add tag</Button></form>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" disabled={!company.phone} onClick={() => { window.location.href = `tel:${company.phone}`; }}>
              <Phone size={14} />
              Call
            </Button>
            <Button variant="secondary" size="sm" disabled={!webUrl(company.whatsapp)} onClick={() => window.open(webUrl(company.whatsapp), "_blank", "noopener,noreferrer")}>
              <MessageCircle size={14} />
              WhatsApp
            </Button>
            <Button variant="secondary" size="sm" onClick={() => create({ kind: "task", companyId: company.id })}>
              <Plus size={14} />
              New task
            </Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
