"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname === "/status") return null;

  return <Footer />;
}
