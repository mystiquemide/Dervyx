"use client";

import { useState } from "react";

export function CopyHashButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className="rounded border border-edge px-2 py-1 text-[11px] text-muted transition-colors hover:border-muted hover:text-cream"
      aria-label="Copy full report hash"
    >
      {copied ? "Copied" : "Copy full hash"}
    </button>
  );
}
