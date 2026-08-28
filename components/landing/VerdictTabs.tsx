"use client";

import { useState } from "react";
import { CertificatePanel } from "@/components/CertificatePanel";
import type { ReportCertificate } from "@/lib/types";

type Tab = { key: string; title: string; note: string; cert: ReportCertificate };

export function VerdictTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  const current = tabs[active] ?? tabs[0];

  return (
    <div>
      <div role="tablist" aria-label="Verdicts" className="flex flex-wrap gap-2">
        {tabs.map((tab, index) => (
          <button
            key={tab.key}
            role="tab"
            type="button"
            aria-selected={index === active}
            onClick={() => setActive(index)}
            className={`rounded-md border px-3.5 py-2 text-sm transition-colors duration-200 ${
              index === active
                ? "border-teal/40 bg-teal/10 text-teal"
                : "border-edge text-muted hover:text-cream"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <p className="mt-5 max-w-measure text-[15px] leading-relaxed text-muted">{current.note}</p>
      <div className="mt-6 max-w-xl">
        <CertificatePanel report={current.cert.report} reportHash={current.cert.reportHash} />
      </div>
    </div>
  );
}
