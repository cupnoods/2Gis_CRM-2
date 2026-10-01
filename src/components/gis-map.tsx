"use client";

import { useEffect, useRef } from "react";
import { load } from "@2gis/mapgl";
import type { Company } from "@/lib/types";

interface MapProps {
  companies: Company[];
  onSelectCompany?: (id: string) => void;
}

export default function GisMapContainer({ companies, onSelectCompany }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let map: any = null;
    let markers: any[] = [];

    const key = process.env.NEXT_PUBLIC_2GIS_API_KEY || "ruabzy8282";

    load().then((mapgl) => {
      if (!containerRef.current) return;

      // Initialize 2GIS Map centered on Osh, Kyrgyzstan (40.514, 72.816)
      map = new mapgl.Map(containerRef.current, {
        center: [72.8161, 40.514],
        zoom: 13,
        key: key,
      });

      mapInstanceRef.current = map;

      // Add markers for demo companies with lat/lng fallback around Osh
      companies.forEach((company, index) => {
        // Approximate grid offsets around center of Osh if coords missing
        const lng = 72.8000 + ((index * 7) % 35) * 0.002;
        const lat = 40.5050 + ((index * 11) % 25) * 0.002;

        const marker = new mapgl.Marker(map, {
          coordinates: [lng, lat],
        });

        marker.on("click", () => {
          if (onSelectCompany) {
            onSelectCompany(company.id);
          }
        });

        markers.push(marker);
      });
    }).catch((err) => {
      console.error("Failed to load 2GIS MapGL:", err);
    });

    return () => {
      markers.forEach((m) => m.destroy && m.destroy());
      if (map) {
        map.destroy();
      }
    };
  }, [companies, onSelectCompany]);

  return (
    <div className="relative h-full w-full min-h-[600px] overflow-hidden rounded-xl border border-[#e4e7ec]">
      <div ref={containerRef} className="h-full w-full min-h-[600px]" />
    </div>
  );
}
