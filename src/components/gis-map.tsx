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

      // Real coordinates map for Osh business districts
      const realCoords: Record<string, [number, number]> = {
        "company-1": [72.7958, 40.5135], // Sulaiman Coffee (Central Osh)
        "company-2": [72.8055, 40.5210], // Silk Road Kitchen
        "company-3": [72.7980, 40.5180], // Archa Bakery
        "company-4": [72.8120, 40.5090], // Dostuk Restaurant
        "company-5": [72.7930, 40.5150], // Ala-Too Bistro
        "company-6": [72.7995, 40.5260], // Osh Plaza Hotel
        "company-7": [72.8020, 40.5220], // Navat Boutique Hotel
        "company-8": [72.8100, 40.5170], // Berekе Market
        "company-9": [72.8040, 40.5140], // Dordoi Mini Market
        "company-10": [72.8080, 40.5200], // Neman Pharmacy
        "company-11": [72.8010, 40.5230], // Aibolit Pharmacy
        "company-12": [72.7970, 40.5270], // Pulse Fitness Osh
      };

      companies.forEach((company, index) => {
        const coords = realCoords[company.id] || [
          72.7950 + ((index * 3) % 15) * 0.003,
          40.5100 + ((index * 5) % 12) * 0.003,
        ];

        const marker = new mapgl.Marker(map, {
          coordinates: coords,
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
