"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname === "/status" || pathname === "/investigate") return null;

  return <Footer />;
}
