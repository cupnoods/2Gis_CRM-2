"use client";

import dynamic from "next/dynamic";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button, CompanyCard, PageHeader } from "@/components/ui";
import { useApp } from "@/components/app-shell";
import { useRouter } from "next/navigation";

// Dynamically import map to avoid SSR window/DOM errors with 2GIS JS SDK
const GisMap = dynamic(() => import("@/components/gis-map"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[600px] items-center justify-center rounded-xl border border-[#e4e7ec] bg-[#f8f9fb]">
      <div className="flex flex-col items-center gap-2 text-sm text-[#667085]">
        <div className="size-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        <span>Loading 2GIS MapGL Engine…</span>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const { companies } = useApp();
  const router = useRouter();

  return (
    <div>
      <PageHeader
        eyebrow="Directory view"
        title="Map"
        description="Explore companies by district using 2GIS MapGL vector maps and interactive markers."
        actions={
          <>
            <Button variant="secondary">
              <SlidersHorizontal size={16} /> Filter Map
            </Button>
            <Button variant="primary" onClick={() => router.push("/catalogue")}>
              Open catalogue
            </Button>
          </>
        }
      />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="relative min-h-[620px]">
          <GisMap
            companies={companies}
            onSelectCompany={(id) => router.push(`/companies/${id}`)}
          />
        </section>
        <div className="space-y-3">
          <div className="text-sm font-semibold text-[#344054]">
            Nearby businesses ({companies.length})
          </div>
          {companies.slice(0, 5).map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onOpen={() => router.push(`/companies/${company.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
