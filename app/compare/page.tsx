import type { Metadata } from "next";
import { PairedProofClient } from "@/components/PairedProofClient";

export const metadata: Metadata = {
  title: "Paired proof | Dervyx",
  description: "Run the same Dervyx evidence engine against an unknown-root anomaly and a known-router control.",
};

export default function ComparePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-24">
      <PairedProofClient />
    </main>
  );
}
