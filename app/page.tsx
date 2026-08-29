import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ScrollLink } from "@/components/ScrollLink";
import { CertificatePanel } from "@/components/CertificatePanel";
import { VerdictTabs } from "@/components/landing/VerdictTabs";
import { FundingGraph } from "@/components/landing/FundingGraph";
import { sampleAnomaly, sampleClean, sampleUnknown } from "@/lib/sample";
import { shortHash } from "@/lib/format";

const REPO = "https://github.com/mystiquemide/Dervyx";

const STRIP = [
  ["Deterministic", "Same token and window give the same hash, every time."],
  ["Source-linked", "Live evidence edges cite on-chain transactions; saved references show their source."],
  ["Reproducible", "Download the report and replay its hash."],
  ["Honest", "Thin coverage returns a non-verdict, never a forced label."],
  ["Base-native", "Canonical Uniswap v4 swaps and funding transfers."],
];

const CONTENTS = [
  ["Verdict", "ANOMALY, CLEAN, UNKNOWN_ROOTS, or INSUFFICIENT_DATA, as text."],
  ["Observed share", "Numerator and denominator of swap events, with the window."],
  ["Attribution ledger", "What was counted, what was excluded, and what remains unlinked."],
  ["Coverage", "How many trading origins were attributed, and funding status."],
  ["Exclusions", "Known routers and exchanges, separated and named."],
  ["Report hash", "A SHA-256 over the canonical JSON that anyone can replay."],
];

const SOURCES = [
  ["Network access", "Public chain access, with coverage clearly labeled."],
  ["Uniswap v4 PoolManager", "Canonical Swap events as the volume ground truth."],
  ["ERC-20 transfers", "Canonical eth_getLogs as the reliable funding layer."],
  ["Blockscout", "Best-effort native-ETH funding enrichment."],
  ["BaseScan", "Live evidence edges link to their transaction."],
];

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs uppercase tracking-widest2 text-teal">{children}</p>;
}

const anomalyCluster = sampleAnomaly.report.coordinationClusters[0];
const unknownLedger = sampleAnomaly.report.attributionLedger.find((entry) => entry.bucket === "unknown_coordination");
const knownLedger = sampleAnomaly.report.attributionLedger.find((entry) => entry.bucket === "known_infrastructure");
const verifySnippet = `${sampleAnomaly.canonicalJson.slice(0, 200)}\u2026`;

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-edge/50">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-28">
          <Reveal>
            <p className="text-xs uppercase tracking-widest2 text-muted">Base investigation agent</p>
            <h1 className="mt-5 max-w-4xl text-[clamp(2.4rem,6vw,4.6rem)] font-semibold leading-[1.04] tracking-tight text-cream">
              Who funded the wallets behind this token&apos;s volume?
            </h1>
            <p className="mt-6 max-w-measure text-lg leading-relaxed text-muted">
              Dervyx reads public Base data for one token and one block window, maps how the trading
              wallets were funded, and issues a certificate you can re-verify by hash. It reports observed
              relationships, not accusations.
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Link
                href="/investigate"
                className="w-full rounded-md bg-teal px-5 py-3 text-center text-sm font-semibold text-ink transition-colors duration-200 hover:bg-teal-deep sm:w-auto"
              >
                Run an investigation
              </Link>
              <Link
                href="/compare"
                className="w-full rounded-md border border-teal/30 bg-teal/5 px-5 py-3 text-center text-sm font-medium text-teal transition-colors duration-200 hover:bg-teal/10 sm:w-auto"
              >
                Run the paired proof
              </Link>
              <ScrollLink
                targetId="workflow"
                className="w-full rounded-md border border-edge px-5 py-3 text-center text-sm font-medium text-cream transition-colors duration-200 hover:border-muted sm:w-auto"
              >
                How it works
              </ScrollLink>
            </div>
          </Reveal>

          <Reveal delay={120} className="mt-14">
            <div className="mx-auto max-w-xl">
              <CertificatePanel
                report={sampleAnomaly.report}
                reportHash={sampleAnomaly.reportHash}
                chip="Saved example"
              />
              <p className="mt-3 text-center text-xs text-faint">
                A saved certificate over a reference scope. The numbers and hash above replay-verify.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-b border-edge/50">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 gap-y-8 px-6 py-16 sm:grid-cols-2 lg:grid-cols-3">
          {STRIP.map(([title, body], i) => (
            <Reveal key={title} delay={i * 50}>
              <div>
                <h3 className="text-sm font-semibold text-cream">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Paired proof */}
      <section id="paired-proof" className="border-b border-edge/50 bg-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:gap-12 sm:px-6 sm:py-24 md:grid-cols-[1.1fr_1fr] md:items-center">
          <Reveal>
            <Label>Paired proof</Label>
            <h2 className="mt-4 text-[clamp(1.9rem,3.4vw,2.8rem)] font-semibold leading-tight tracking-tight text-cream">
              The verdict survives a control.
            </h2>
            <p className="mt-5 max-w-measure text-[15px] leading-relaxed text-muted">
              Same token, block window, thresholds, and engine. Only the funding topology changes. Dervyx
              shows the known router in the ledger, excludes it, and leaves the unknown-root residual visible.
            </p>
            <Link
              href="/compare"
              className="mt-7 inline-flex rounded-md border border-edge px-5 py-3 text-sm font-medium text-cream transition-colors duration-200 hover:border-muted"
            >
              See both certificates
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <div className="rounded-lg border border-edge bg-ink p-6 font-mono text-sm">
              <div className="flex items-center justify-between border-b border-edge/60 pb-4">
                <span className="text-faint">unknown shared root</span>
                <span className="text-anomaly">{unknownLedger?.swapEvents ?? 0}/{sampleAnomaly.report.metric.denominator} · {unknownLedger?.ratioPercent ?? "0.00%"} counted</span>
              </div>
              <div className="flex items-center justify-between border-b border-edge/60 py-4">
                <span className="text-faint">known router root</span>
                <span className="text-muted">{knownLedger?.swapEvents ?? 0}/{sampleAnomaly.report.metric.denominator} · {knownLedger?.ratioPercent ?? "0.00%"} excluded</span>
              </div>
              <div className="flex items-center justify-between pt-4">
                <span className="text-faint">after policy</span>
                <span className="text-teal">{sampleAnomaly.report.metric.numerator}/{sampleAnomaly.report.metric.denominator} · {sampleAnomaly.report.metric.ratioPercent}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Certificate */}
      <section id="certificate" className="border-b border-edge/50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:gap-12 sm:px-6 sm:py-24 md:grid-cols-2 md:items-center">
          <Reveal>
            <Label>Certificate</Label>
            <h2 className="mt-4 text-[clamp(1.9rem,3.4vw,2.8rem)] font-semibold leading-tight tracking-tight text-cream">
              Every run is a certificate.
            </h2>
            <p className="mt-5 max-w-measure text-[15px] leading-relaxed text-muted">
              Not a dashboard number you have to trust. A single, canonical document with a stable hash,
              carrying the verdict, the exact share, the coverage it was measured against, and the funding
              evidence it rests on.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <dl className="rounded-lg border border-edge bg-surface p-6">
              {CONTENTS.map(([term, desc]) => (
                <div key={term} className="border-t border-edge/60 py-3 first:border-t-0 first:pt-0">
                  <dt className="text-sm font-medium text-cream">{term}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">{desc}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Funding graph */}
      <section id="graph" className="border-b border-edge/50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:gap-12 sm:px-6 sm:py-24 md:grid-cols-2 md:items-center">
          <Reveal className="md:order-2">
            <Label>Funding graph</Label>
            <h2 className="mt-4 text-[clamp(1.9rem,3.4vw,2.8rem)] font-semibold leading-tight tracking-tight text-cream">
              Follow the funding, two hops back.
            </h2>
            <p className="mt-5 max-w-measure text-[15px] leading-relaxed text-muted">
              Dervyx traces each trading wallet to the source that funded it. When several wallets share one
              unknown root, that is the signal. Known routers and exchanges are separated, never counted as
              coordination.
            </p>
          </Reveal>
          <Reveal delay={100} className="md:order-1">
            {anomalyCluster ? (
              <FundingGraph
                root={anomalyCluster.rootAddress}
                traders={anomalyCluster.traders}
                sourceUrls={anomalyCluster.sampleSourceUrls}
                sourceLinksAreLive={false}
              />
            ) : null}
          </Reveal>
        </div>
      </section>

      {/* Editorial statement */}
      <section className="border-b border-edge/50">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-28">
          <Reveal>
            <p className="font-serif text-[clamp(2rem,4.4vw,3.4rem)] leading-tight text-cream">
              Evidence, not accusations.
            </p>
            <p className="mx-auto mt-6 max-w-measure text-[15px] leading-relaxed text-muted">
              Dervyx surfaces observed relationships for a person to judge. It never claims proof of wash
              trading, ownership, or intent, and it never forces a verdict on incomplete evidence.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Verdicts */}
      <section id="verdicts" className="border-b border-edge/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <Reveal className="text-center">
            <Label>Verdicts</Label>
            <h2 className="mx-auto mt-4 max-w-2xl text-[clamp(1.9rem,3.4vw,2.8rem)] font-semibold leading-tight tracking-tight text-cream">
              Four honest verdicts.
            </h2>
            <p className="mx-auto mt-5 max-w-measure text-[15px] leading-relaxed text-muted">
              Partial coverage is never labeled clean. Switch between real certificates for each outcome.
            </p>
          </Reveal>
          <Reveal delay={100} className="mt-12">
            <VerdictTabs
              tabs={[
                { key: "anomaly", title: "Anomaly", note: "A material share of swap activity traces to a shared unknown root.", cert: sampleAnomaly },
                { key: "clean", title: "Clean", note: "No coordination, complete funding, sufficient coverage. Not a guarantee of legitimacy.", cert: sampleClean },
                { key: "unknown", title: "Unknown roots", note: "Some evidence, coverage too thin to confirm or rule out. Inconclusive, not clean.", cert: sampleUnknown },
              ]}
            />
          </Reveal>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="border-b border-edge/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <Reveal>
            <Label>Workflow</Label>
            <h2 className="mt-4 max-w-2xl text-[clamp(1.9rem,3.4vw,2.8rem)] font-semibold leading-tight tracking-tight text-cream">
              How an investigation runs.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-center">
            <Reveal>
              <ol className="space-y-6">
                {[
                  ["Scope", "One token and a fixed block window. You get a reproducible request identity before the review begins."],
                  ["Evidence", "Observed activity and the funding trail behind each trading wallet, using public chain data."],
                  ["Certificate", "The deterministic engine computes the verdict, the share, coverage, and a stable hash."],
                  ["Verify", "Download the report and replay its hash, in the browser or from the command line."],
                ].map(([step, body], i) => (
                  <li key={step} className="flex gap-4">
                    <span className="mt-0.5 font-mono text-sm text-teal">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="text-base font-semibold text-cream">{step}</h3>
                      <p className="mt-1 max-w-md text-sm leading-relaxed text-muted">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal delay={100}>
              <figure className="overflow-hidden rounded-lg border border-edge">
                <img
                  src="/workflow.jpg"
                  alt="City lights at night forming a connected network across a continent"
                  width={1400}
                  height={933}
                  loading="lazy"
                  className="h-full w-full object-cover opacity-90"
                />
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Verify (reserved darker proof section) */}
      <section id="verify" className="border-y border-edge bg-[#0c0f10]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-28">
          <Reveal>
            <Label>Technical proof</Label>
            <h2 className="mt-4 max-w-3xl text-[clamp(1.9rem,3.4vw,2.8rem)] font-semibold leading-tight tracking-tight text-cream">
              You do not have to trust it. Check it.
            </h2>
            <p className="mt-5 max-w-measure text-[15px] leading-relaxed text-muted">
              Every certificate carries the canonical JSON it was hashed from. Recompute the hash and it
              matches. Change a single field and it fails. Same scope and config, same hash.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-lg border border-edge bg-ink p-5">
                <p className="text-xs uppercase tracking-widest2 text-faint">Canonical JSON (head)</p>
                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all font-mono text-[11px] leading-relaxed text-muted">{verifySnippet}</pre>
                <p className="mt-4 text-xs uppercase tracking-widest2 text-faint">SHA-256</p>
                <p className="mt-2 break-all font-mono text-[12px] text-teal">{sampleAnomaly.reportHash}</p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <ul className="space-y-4 text-[15px] leading-relaxed text-muted">
                <li><span className="text-cream">Replay in the browser.</span> The tool re-runs verification and shows a match or a mismatch.</li>
                <li><span className="text-cream">Replay on the command line.</span> <span className="font-mono text-sm text-teal">node scripts/verify-report.mjs report.json</span></li>
                <li><span className="text-cream">Tamper detection.</span> Any edit to the report changes the hash and fails the check.</li>
                <li><span className="text-cream">No shields or seals.</span> The proof is the reproducible document, not a badge.</li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Investigation agent */}
      <section id="agent" className="border-b border-edge/50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:gap-12 sm:px-6 sm:py-24 md:grid-cols-[1fr_1.1fr] md:items-center">
          <Reveal>
            <Label>Investigation agent</Label>
            <h2 className="mt-4 text-[clamp(1.9rem,3.4vw,2.8rem)] font-semibold leading-tight tracking-tight text-cream">
              One path through the evidence.
            </h2>
            <p className="mt-5 max-w-measure text-[15px] leading-relaxed text-muted">
              Dervyx follows a focused funding trail, separates known infrastructure, and turns the observed
              relationships into a certificate you can inspect and replay.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="rounded-lg border border-edge bg-surface p-6 font-mono text-sm">
              <div className="flex justify-between border-b border-edge/60 pb-3">
                <span className="text-faint">path</span>
                <span className="text-cream">funding trail</span>
              </div>
              <div className="flex justify-between border-b border-edge/60 py-3">
                <span className="text-faint">focus</span>
                <span className="text-cream">linked activity</span>
              </div>
              <div className="flex justify-between border-b border-edge/60 py-3">
                <span className="text-faint">evidence</span>
                <span className="text-teal">recorded</span>
              </div>
              <div className="flex justify-between pt-3">
                <span className="text-faint">certificate</span>
                <span className="text-teal">verifiable</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Sources */}
      <section id="sources" className="border-b border-edge/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <Reveal>
            <Label>Sources</Label>
            <h2 className="mt-4 max-w-2xl text-[clamp(1.9rem,3.4vw,2.8rem)] font-semibold leading-tight tracking-tight text-cream">
              Built on public Base data.
            </h2>
          </Reveal>
          <div className="mt-12 divide-y divide-edge/60 border-y border-edge/60">
            {SOURCES.map(([name, body], i) => (
              <Reveal key={name} delay={i * 40}>
                <div className="grid grid-cols-1 gap-1 py-5 sm:grid-cols-[220px_1fr] sm:gap-6">
                  <span className="text-sm font-semibold text-cream">{name}</span>
                  <span className="text-sm leading-relaxed text-muted">{body}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-surface">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-28">
          <Reveal>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight tracking-tight text-cream">
              Run an investigation.
            </h2>
            <p className="mx-auto mt-5 max-w-measure text-[15px] leading-relaxed text-muted">
              One token, one block window, one certificate you can re-verify.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/investigate" className="rounded-md bg-teal px-5 py-3 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-teal-deep">
                Open the tool
              </Link>
              <a href={REPO} target="_blank" rel="noreferrer" className="rounded-md border border-edge px-5 py-3 text-sm font-medium text-cream transition-colors duration-200 hover:border-muted">
                Read the source
              </a>
            </div>
            <p className="mt-6 font-mono text-xs text-faint">example report {shortHash(sampleAnomaly.reportHash, 24)}</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
