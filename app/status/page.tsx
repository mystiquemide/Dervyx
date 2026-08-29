import type { Metadata } from "next";
import { StatusPageClient } from "@/components/StatusPageClient";

export const metadata: Metadata = {
  title: "Status · Dervyx",
  description: "Current availability for Dervyx services and verification tools.",
};

export default function StatusPage() {
  return <StatusPageClient />;
}
