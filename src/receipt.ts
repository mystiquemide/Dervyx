import type { AttributionLedgerEntry, DervyxReport, ReportCertificate } from "./report.js";

export const RECEIPT_SCHEMA_VERSION = "dervyx-evidence-receipt-v1";

export interface EvidenceReceipt {
  schema: typeof RECEIPT_SCHEMA_VERSION;
  receiptId: string;
  subject: {
    token: string;
    chainId: number;
    startBlock: number;
    endBlock: number;
    fixtureId: string;
    mode: string;
  };
  decision: {
    label: DervyxReport["verdict"]["label"];
    rationaleCode: string;
    statement: string;
  };
  counterfactual: {
    attributedSwapEvents: number;
    attributedRatioPercent: string;
    anomalyShareAfterRootPolicy: string;
    policy: string;
  };
  attributionLedger: AttributionLedgerEntry[];
  evidence: {
    swapEvents: number;
    fundingEdges: number;
    coveragePercent: string;
    fundingStatus: string;
    sourceErrors: { native: number; erc20: number };
  };
  verification: {
    reportHash: string;
    canonicalReport: "sorted-key JSON";
    command: string;
    browserPath: string;
  };
  sources: DervyxReport["sources"];
  limitations: string[];
}

function coveragePercent(bps: number): string {
  return `${(bps / 100).toFixed(2)}%`;
}

/** Build a compact, portable receipt from a certified report without changing its hash. */
export function buildEvidenceReceipt(certificate: ReportCertificate): EvidenceReceipt {
  const report = certificate.report;
  return {
    schema: RECEIPT_SCHEMA_VERSION,
    receiptId: certificate.reportHash,
    subject: {
      token: report.identity.token,
      chainId: report.identity.chainId,
      startBlock: report.identity.startBlock,
      endBlock: report.identity.endBlock,
      fixtureId: report.identity.fixtureId,
      mode: report.identity.mode,
    },
    decision: report.verdict,
    counterfactual: {
      attributedSwapEvents: report.metric.attributedSwapEvents,
      attributedRatioPercent: report.metric.attributedRatioPercent,
      anomalyShareAfterRootPolicy: report.metric.ratioPercent,
      policy: "Count shared unknown roots; show known infrastructure but exclude it from anomaly share.",
    },
    attributionLedger: report.attributionLedger,
    evidence: {
      swapEvents: report.metric.denominator,
      fundingEdges: report.evidenceSample.totalFundingEdges,
      coveragePercent: coveragePercent(report.coverage.attributionCoverageBps),
      fundingStatus: report.coverage.fundingStatus,
      sourceErrors: report.coverage.sourceErrors,
    },
    verification: {
      reportHash: certificate.reportHash,
      canonicalReport: "sorted-key JSON",
      command: "node scripts/verify-report.mjs report.json",
      browserPath: "POST /api/investigations/{id}/report/verify",
    },
    sources: report.sources,
    limitations: report.limitations,
  };
}
