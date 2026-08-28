type Tone = "onDark" | "onLight" | "mono";

export function Mark({ size = 40, tone = "onDark" }: { size?: number; tone?: Tone }) {
  const structure = tone === "onLight" ? "#101416" : "#edf2f2";
  const root = tone === "mono" ? structure : tone === "onLight" ? "#0f6e64" : "#91d8d0";
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <g fill="none" stroke={structure} strokeWidth={2.4} strokeLinecap="round">
        <path d="M15 19 L32 45" />
        <path d="M32 12 L32 45" />
        <path d="M49 19 L32 45" />
      </g>
      <circle cx="15" cy="19" r="3.6" fill={structure} />
      <circle cx="32" cy="12" r="3.6" fill={structure} />
      <circle cx="49" cy="19" r="3.6" fill={structure} />
      <circle cx="32" cy="45" r="7" fill={root} />
    </svg>
  );
}
