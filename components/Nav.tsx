"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mark } from "./Mark";

const REPO = "https://github.com/mystiquemide/Dervyx";

const LINKS: { href: string; label: string; external?: boolean }[] = [
  { href: "/#certificate", label: "Product" },
  { href: "/#workflow", label: "How it works" },
  { href: "/#verify", label: "Verify" },
  { href: "/compare", label: "Paired proof" },
  { href: REPO, label: "GitHub", external: true },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-edge/70 bg-ink/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Dervyx home" onClick={() => setOpen(false)}>
          <Mark size={26} />
          <span className="text-[15px] font-semibold tracking-tight text-cream">Dervyx</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted md:flex" aria-label="Primary">
          {LINKS.map((link) =>
            link.external ? (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-cream">
                {link.label}
              </a>
            ) : (
              <a key={link.label} href={link.href} className="transition-colors hover:text-cream">
                {link.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/investigate"
            className="hidden rounded-md border border-teal/30 bg-teal/10 px-4 py-2 text-sm font-medium text-teal transition-colors duration-200 hover:bg-teal/20 sm:inline-flex"
          >
            Run an investigation
          </Link>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-edge text-cream transition-colors hover:border-muted md:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              {open ? (
                <>
                  <path d="M6 6 L18 18" />
                  <path d="M18 6 L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7 H20" />
                  <path d="M4 12 H20" />
                  <path d="M4 17 H20" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-edge/70 bg-ink md:hidden">
          <div className="mx-auto max-w-6xl px-6 py-4">
            <ul className="flex flex-col">
              {LINKS.map((link) => (
                <li key={link.label} className="border-b border-edge/50">
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setOpen(false)}
                      className="block py-3.5 text-[15px] text-cream transition-colors hover:text-teal"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block py-3.5 text-[15px] text-cream transition-colors hover:text-teal"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <Link
              href="/investigate"
              onClick={() => setOpen(false)}
              className="mt-4 block rounded-md bg-teal px-4 py-3 text-center text-sm font-semibold text-ink transition-colors duration-200 hover:bg-teal-deep"
            >
              Run an investigation
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
