"use client";

import { useState } from "react";
import { shortAddr } from "@/lib/format";

export function FundingGraph({
  root,
  traders,
  sourceUrls,
}: {
  root: string;
  traders: string[];
  sourceUrls: string[];
}) {
  const [hover, setHover] = useState<number | null>(null);
  const width = 340;
  const height = 230;
  const rootX = width / 2;
  const rootY = 180;
  const count = Math.max(traders.length, 1);
  const positions = traders.map((_, i) => ({
    x: count === 1 ? width / 2 : 46 + (i * (width - 92)) / (count - 1),
    y: 46,
  }));

  return (
    <div className="rounded-lg border border-edge bg-surface p-5 sm:p-6">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Funding graph: wallets tracing to one shared root">
        {positions.map((p, i) => (
          <line
            key={`edge-${i}`}
            x1={p.x}
            y1={p.y}
            x2={rootX}
            y2={rootY}
            stroke={hover === i ? "#91d8d0" : "#2b383b"}
            strokeWidth={hover === i ? 2 : 1.4}
          />
        ))}
        {positions.map((p, i) => (
          <g
            key={`node-${i}`}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className="cursor-pointer"
          >
            <circle cx={p.x} cy={p.y} r={hover === i ? 7 : 5.5} fill={hover === i ? "#91d8d0" : "#edf2f2"} />
          </g>
        ))}
        <circle cx={rootX} cy={rootY} r={11} fill="#91d8d0" />
        <text x={rootX} y={rootY + 28} textAnchor="middle" fontSize="11" fontFamily="ui-monospace, monospace" fill="#5f6a6b">
          {shortAddr(root)}
        </text>
      </svg>
      <p className="mt-3 min-h-[44px] text-sm leading-relaxed text-muted">
        {hover === null ? (
          <>Wallets at the top, the shared unknown root at the bottom. Hover a wallet to trace it.</>
        ) : (
          <>
            Wallet <span className="font-mono text-cream">{shortAddr(traders[hover] ?? "")}</span> traces to the shared
            root.{" "}
            {sourceUrls[hover] ? (
              <a href={sourceUrls[hover]} target="_blank" rel="noreferrer" className="text-teal underline-offset-2 hover:underline">
                View funding tx &#8599;
              </a>
            ) : null}
          </>
        )}
      </p>
    </div>
  );
}
