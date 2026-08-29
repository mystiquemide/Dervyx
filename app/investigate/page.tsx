import type { Metadata } from "next";
import { InvestigateClient } from "@/components/InvestigateClient";

export const metadata: Metadata = {
  title: "Run an investigation \u00b7 Dervyx",
  description:
    "Scope one Base token and a fixed block window. Dervyx reads canonical swaps and funding transfers over the public Base fallback and issues a certificate you can download and replay.",
};

export default function InvestigatePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-xs uppercase tracking-widest2 text-teal">Investigation</p>
      <h1 className="mt-4 max-w-3xl text-[clamp(1.875rem,8vw,3rem)] font-semibold leading-tight tracking-tight text-cream">
        Scope a token, read the evidence, get a certificate.
      </h1>
      <p className="mt-5 max-w-measure text-[15px] leading-relaxed text-muted">
        One token and a fixed Base block window. Dervyx reads canonical Uniswap v4 swaps and the funding
        transfers behind each trading wallet over the public Base fallback, then issues a certificate you can
        download and replay. It reports observed relationships, not accusations.
      </p>
      <p className="mt-5 max-w-measure rounded-md border-l-2 border-caution/50 bg-caution/5 px-4 py-3 text-sm leading-relaxed text-caution">
        Read-only. No wallet connection, no transactions, no signing. Live reads use the public Base RPC
        fallback and take a moment.
      </p>
      <div className="mt-10">
        <InvestigateClient />
      </div>
    </div>
  );
}
