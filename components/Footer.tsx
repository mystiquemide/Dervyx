import Link from "next/link";
import { Mark } from "./Mark";

const REPO = "https://github.com/mystiquemide/Dervyx";

export function Footer() {
  return (
    <footer className="border-t border-edge/70 bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Mark size={24} />
              <span className="text-[15px] font-semibold tracking-tight text-cream">Dervyx</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-faint">
              Read-only funding and volume evidence for Base tokens. One token, one block window,
              one certificate you can re-verify by hash.
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest2 text-faint">Product</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li><Link href="/investigate" className="transition-colors hover:text-cream">Run an investigation</Link></li>
              <li><Link href="/compare" className="transition-colors hover:text-cream">Run the paired proof</Link></li>
              <li><a href="/#workflow" className="transition-colors hover:text-cream">How it works</a></li>
              <li><a href="/#verify" className="transition-colors hover:text-cream">Verify a report</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest2 text-faint">Project</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li><a href={REPO} target="_blank" rel="noreferrer" className="transition-colors hover:text-cream">GitHub</a></li>
              <li><a href={`${REPO}#readme`} target="_blank" rel="noreferrer" className="transition-colors hover:text-cream">README</a></li>
              <li><Link href="/status" className="transition-colors hover:text-cream">Status</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest2 text-faint">Limits</h3>
            <p className="mt-4 text-sm leading-relaxed text-faint">
              Dervyx reports observed relationships, not proof of wash trading, ownership, or intent.
              Read-only. No wallet. Public RPC fallback is labeled as such.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-edge/60 pt-6 text-xs text-faint md:flex-row md:items-center md:justify-between">
          <span>Base mainnet, chain 8453. Not affiliated with any token or protocol shown.</span>
          <span>Dervyx {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
