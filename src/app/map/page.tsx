"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { MapPin, Search, SlidersHorizontal } from "lucide-react";
import { Button, CompanyCard, PageHeader } from "@/components/ui";
import { useApp } from "@/components/app-shell";
import { useRouter } from "next/navigation";

const GisMap = dynamic(() => import("@/components/gis-map"), {
  ssr: false,
  loading: () => <div role="status" className="flex min-h-[600px] items-center justify-center rounded-xl border bg-slate-50 text-slate-500">Loading map…</div>,
});

export default function MapPage() {
  const { companies } = useApp();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [category, setCategory] = useState("All categories");
  const categories = useMemo(() => ["All categories", ...new Set(companies.map(company => company.category))], [companies]);
  const filtered = useMemo(() => companies.filter(company =>
    (category === "All categories" || company.category === category) &&
    `${company.name} ${company.category} ${company.address}`.toLowerCase().includes(query.trim().toLowerCase())
  ), [companies, category, query]);
  const openCompany = useCallback((id: string) => router.push(`/companies/${id}`), [router]);
  const hasMapKey = Boolean(process.env.NEXT_PUBLIC_2GIS_API_KEY);

  return <div>
    <PageHeader eyebrow="Directory view" title="Map" description="Explore your companies by name, category or district. Only businesses with real coordinates appear as map markers." actions={<>
      <Button onClick={() => setShowFilters(value => !value)} aria-expanded={showFilters}><SlidersHorizontal size={16} />Filters</Button>
      <Button variant="primary" onClick={() => router.push("/catalogue")}>Open catalogue</Button>
    </>} />
    <div className="mb-4 flex flex-wrap gap-3 rounded-xl border bg-white p-3">
      <label className="relative min-w-[220px] flex-1"><span className="sr-only">Search map</span><Search size={16} className="absolute left-3 top-3 text-slate-400" /><input aria-label="Search map" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search companies or addresses" className="h-10 w-full rounded-lg border pl-9 pr-3" /></label>
      {showFilters && <label className="text-xs text-slate-600">Category<select aria-label="Map category" value={category} onChange={event => setCategory(event.target.value)} className="ml-2 h-10 rounded-lg border bg-white px-3 text-sm">{categories.map(item => <option key={item}>{item}</option>)}</select></label>}
    </div>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="relative min-h-[620px]">
        {hasMapKey ? <GisMap companies={filtered} onSelectCompany={openCompany} /> : <div className="flex min-h-[620px] flex-col items-center justify-center rounded-xl border bg-slate-100 px-8 text-center text-slate-500"><MapPin size={28} className="mb-3 text-indigo-600" /><p className="font-medium text-slate-700">Map tiles are unavailable</p><p className="mt-2 max-w-sm text-sm">Add a 2GIS MapGL key to enable tiles. You can still search and open companies from the list.</p></div>}
      </section>
      <div className="space-y-3"><div className="text-sm font-semibold text-slate-700">Matching businesses ({filtered.length})</div>{filtered.length === 0 ? <p className="rounded-xl border bg-white p-5 text-slate-500">No matching companies.</p> : filtered.slice(0, 5).map(company => <CompanyCard key={company.id} company={company} onOpen={() => openCompany(company.id)} />)}</div>
    </div>
  </div>;
}
