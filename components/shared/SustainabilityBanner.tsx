'use client';

import { Leaf, Zap, TrendingUp } from 'lucide-react';

export function SustainabilityBanner() {
  return (
    <section
      className="bg-daikin-gray-50 border-t border-daikin-gray-100 py-4"
      aria-label="Sustainability highlights"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-3 text-center md:flex-row md:justify-center md:gap-6">
          <p className="text-sm font-medium text-daikin-gray-500">
            Daikin Inverter RTUs — Proven efficiency, reliable ROI, and reduced
            carbon footprint.
          </p>
          <div className="flex items-center gap-4 text-sm text-daikin-gray-500">
            <span className="inline-flex items-center gap-1">
              <Zap className="h-4 w-4 text-primary" aria-hidden="true" />
              Energy
            </span>
            <span className="inline-flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
              Cost
            </span>
            <span className="inline-flex items-center gap-1">
              <Leaf className="h-4 w-4 text-primary" aria-hidden="true" />
              CO₂
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SustainabilityBanner;
