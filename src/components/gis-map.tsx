"use client";

import { useEffect, useRef, useState } from "react";
import { load } from "@2gis/mapgl";
import type { Company } from "@/lib/types";

interface MapProps {
  companies: Company[];
  onSelectCompany: (id: string) => void;
}

export default function GisMapContainer({ companies, onSelectCompany }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const container = containerRef.current;
    const key = process.env.NEXT_PUBLIC_2GIS_API_KEY;
    if (!container || !key) return;
    let cancelled = false;
    let destroyMap = () => {};

    load().then(mapgl => {
      if (cancelled) return;
      const map = new mapgl.Map(container, { center: [72.8161, 40.514], zoom: 13, key });
      const markers = companies.filter(company => Number.isFinite(company.longitude) && Number.isFinite(company.latitude)).map((company) => {
        const marker = new mapgl.Marker(map, {
          coordinates: [company.longitude!, company.latitude!],
        });
        marker.on("click", () => onSelectCompany(company.id));
        return marker;
      });
      destroyMap = () => { markers.forEach(marker => marker.destroy()); map.destroy(); };
      setError("");
    }).catch(() => { if (!cancelled) setError("The map could not load. Check the 2GIS key or use the company list."); });

    return () => { cancelled = true; destroyMap(); };
  }, [companies, onSelectCompany]);

  return <div className="relative h-full min-h-[600px] overflow-hidden rounded-xl border border-slate-200">
    <div ref={containerRef} className="h-full min-h-[600px] w-full" />
    {error && <div role="alert" className="absolute inset-x-4 top-4 rounded-lg bg-white p-4 text-red-700 shadow">{error}</div>}
  </div>;
}
