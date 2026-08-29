import Link from "next/link";
import { Mark } from "./Mark";
import { ScrollLink } from "./ScrollLink";

const REPO = "https://github.com/mystiquemide/Dervyx";

export function Footer() {
  return (
    <footer className="border-t border-edge/70 bg-ink">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="grid gap-8 sm:gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Mark size={24} />
              <span className="text-[15px] font-semibold tracking-tight text-cream">Dervyx</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-faint">
              Base investigation agent for launchpad and exchange vetting teams. One token, one block window,
              one certificate you can re-verify by hash.
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest2 text-faint">Product</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li><Link href="/investigate" className="transition-colors hover:text-cream">Run an investigation</Link></li>
              <li><Link href="/compare" className="transition-colors hover:text-cream">Run the paired proof</Link></li>
              <li><ScrollLink targetId="workflow" className="transition-colors hover:text-cream">How it works</ScrollLink></li>
              <li><ScrollLink targetId="verify" className="transition-colors hover:text-cream">Verify a report</ScrollLink></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest2 text-faint">Project</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li><a href={REPO} target="_blank" rel="noreferrer" className="transition-colors hover:text-cream">GitHub</a></li>
              <li><Link href="/status" className="transition-colors hover:text-cream">Status</Link></li>
            </ul>
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
