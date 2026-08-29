import type { Metadata } from "next";
import { InvestigateClient } from "@/components/InvestigateClient";

export const metadata: Metadata = {
  title: "Run an investigation · Dervyx",
  description:
    "Scope one token and a fixed block window. Dervyx follows observed activity and issues a certificate you can download and replay.",
};

export default function InvestigatePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-xs uppercase tracking-widest2 text-teal">Investigation</p>
      <h1 className="mt-4 max-w-3xl text-[clamp(1.875rem,8vw,3rem)] font-semibold leading-tight tracking-tight text-cream">
        Trace a token, read the evidence, get a certificate.
      </h1>
      <p className="mt-5 max-w-measure text-[15px] leading-relaxed text-muted">
        One token and a fixed block window. Dervyx follows the trail behind observed activity, then issues a
        certificate you can download and replay. It reports observed relationships, not accusations.
      </p>
      <div className="mt-10">
        <InvestigateClient />
      </div>
    </div>
  );
}
