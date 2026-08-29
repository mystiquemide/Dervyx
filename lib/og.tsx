import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";
export const OG_ALT = "Dervyx: reproducible Base funding-and-volume anomaly certificates for launchpad and exchange vetting";

const VERDICTS: [string, string][] = [
  ["ANOMALY", "#e8a24a"],
  ["CLEAN", "#91d8d0"],
  ["UNKNOWN ROOTS", "#91a2a3"],
  ["INSUFFICIENT DATA", "#91a2a3"],
];

/** Brand-consistent 1200x630 social card, generated deterministically at request time. */
export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#101416",
          color: "#edf2f2",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "999px", backgroundColor: "#91d8d0", display: "flex" }} />
            <div style={{ fontSize: "30px", fontWeight: 700, letterSpacing: "8px", display: "flex" }}>DERVYX</div>
          </div>
          <div style={{ fontSize: "20px", color: "#83908f", letterSpacing: "2px", display: "flex" }}>BASE MAINNET · INVESTIGATION AGENT</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: "-1px",
              maxWidth: "960px",
              display: "flex",
            }}
          >
            Who funded the wallets behind this token&apos;s volume?
          </div>
          <div style={{ fontSize: "26px", color: "#91a2a3", maxWidth: "860px", display: "flex" }}>
            Reproducible Base funding-and-volume anomaly certificates for launchpad and exchange vetting.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {VERDICTS.map(([label, color]) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                border: "1px solid #2b383b",
                borderRadius: "999px",
                padding: "10px 18px",
                backgroundColor: "#151b1d",
              }}
            >
              <div style={{ width: "12px", height: "12px", borderRadius: "999px", backgroundColor: color, display: "flex" }} />
              <div style={{ fontSize: "20px", color: "#edf2f2", display: "flex" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
