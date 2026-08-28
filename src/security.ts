export type ProviderMode = "public_fallback" | "configured";

/** Never expose configured RPC credentials through evidence, reports, or receipts. */
export function redactProviderUrl(value: string, mode: ProviderMode): string {
  if (mode === "configured") return "[REDACTED_CONFIGURED_RPC]";
  try {
    const url = new URL(value);
    if (url.username || url.password) return "[REDACTED_RPC_URL]";
    if ([...url.searchParams.keys()].length === 0) return value;
    if ([...url.searchParams.keys()].length > 0) {
      for (const key of url.searchParams.keys()) url.searchParams.set(key, "[REDACTED]");
    }
    return url.toString();
  } catch {
    return "[REDACTED_RPC_URL]";
  }
}
