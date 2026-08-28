export function pct(bps: number): string {
  const whole = Math.floor(bps / 100);
  const frac = Math.abs(bps % 100)
    .toString()
    .padStart(2, "0");
  return `${whole}.${frac}%`;
}

export function shortHash(value: string, head = 16): string {
  return value.length > head ? `${value.slice(0, head)}\u2026` : value;
}

export function shortAddr(value: string): string {
  return value.length > 12 ? `${value.slice(0, 6)}\u2026${value.slice(-4)}` : value;
}
