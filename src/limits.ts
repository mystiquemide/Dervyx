/** Bound expensive read-only runs so a public caller cannot exhaust the process or RPC quota. */
export class LiveRunGate {
  private active = 0;

  constructor(public readonly maxConcurrent = 2) {}

  tryAcquire(): boolean {
    if (this.active >= this.maxConcurrent) return false;
    this.active += 1;
    return true;
  }

  release(): void {
    this.active = Math.max(0, this.active - 1);
  }

  get activeRuns(): number {
    return this.active;
  }
}
