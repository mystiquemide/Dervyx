export const investigationPageHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="dark">
    <title>Dervyx | Base investigation scope</title>
    <style>
      :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, sans-serif; background: #101416; color: #edf2f2; }
      * { box-sizing: border-box; }
      body { margin: 0; min-width: 320px; background: #101416; }
      main { width: min(760px, calc(100% - 32px)); margin: 0 auto; padding: 48px 0 72px; }
      header { border-bottom: 1px solid #2b383b; margin-bottom: 28px; padding-bottom: 22px; }
      h1, h2, p { margin: 0; }
      h1 { font-size: clamp(1.8rem, 5vw, 2.8rem); letter-spacing: -0.04em; }
      h2 { font-size: 1rem; letter-spacing: 0.08em; text-transform: uppercase; color: #91d8d0; }
      .eyebrow { color: #91d8d0; font-size: 0.78rem; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 10px; }
      .lede { color: #b8c5c6; line-height: 1.6; margin-top: 14px; max-width: 62ch; }
      .notice { border-left: 3px solid #d2a95e; background: #1b1d19; color: #d9d4c5; line-height: 1.5; padding: 12px 14px; margin: 24px 0; }
      form, .result { border: 1px solid #2b383b; background: #151b1d; padding: 22px; }
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
      .field { display: grid; gap: 7px; }
      .field.full { grid-column: 1 / -1; }
      label { color: #dce6e6; font-size: 0.9rem; }
      input, select, button { font: inherit; border-radius: 3px; }
      input, select { width: 100%; border: 1px solid #405154; background: #0f1415; color: #edf2f2; padding: 11px 12px; }
      input:focus-visible, select:focus-visible, button:focus-visible { outline: 3px solid #91d8d0; outline-offset: 2px; }
      input[readonly] { color: #9fb0b1; }
      .help { color: #91a2a3; font-size: 0.78rem; line-height: 1.4; }
      button { margin-top: 20px; border: 1px solid #91d8d0; background: #91d8d0; color: #101416; cursor: pointer; font-weight: 700; padding: 12px 16px; }
      button:disabled { cursor: wait; opacity: 0.65; }
      .status { min-height: 28px; margin-top: 18px; color: #d2a95e; line-height: 1.5; }
      .status.success { color: #91d8d0; }
      .status.error { color: #ef9a9a; }
      .result { margin-top: 22px; }
      .result[hidden] { display: none; }
      dl { display: grid; grid-template-columns: minmax(130px, 0.35fr) 1fr; gap: 10px 16px; margin: 16px 0 0; }
      dt { color: #91a2a3; }
      dd { margin: 0; overflow-wrap: anywhere; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.85rem; }
      code { color: #dce6e6; }
      @media (max-width: 620px) { main { width: min(100% - 20px, 760px); padding-top: 28px; } .grid { grid-template-columns: 1fr; } .field.full { grid-column: auto; } form, .result { padding: 16px; } dl { grid-template-columns: 1fr; gap: 4px; } dd { margin-bottom: 8px; } }
      @media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; animation: none !important; } }
    </style>
  </head>
  <body>
    <main>
      <header>
        <p class="eyebrow">Dervyx / Base evidence</p>
        <h1>Scope an investigation</h1>
        <p class="lede">Start with one token and a fixed Base block window. This first slice validates scope and creates a reproducible request identity before any chain evidence is read.</p>
      </header>

      <p class="notice" role="note">Dervyx reports observed funding and volume relationships. It does not prove intent, ownership, fraud, or wash trading. No wallet connection is required.</p>

      <form id="investigation-form" novalidate>
        <h2>Scope</h2>
        <div class="grid" style="margin-top: 18px">
          <div class="field full">
            <label for="token">Base token address</label>
            <input id="token" name="token" required value="0xB2000000000000000000000Ff4a547c891AB1b01" autocomplete="off" spellcheck="false">
            <span class="help">Use an EIP-55 checksummed contract address.</span>
          </div>
          <div class="field">
            <label for="startBlock">Start block</label>
            <input id="startBlock" name="startBlock" inputmode="numeric" pattern="[0-9]+" required value="50121395">
          </div>
          <div class="field">
            <label for="endBlock">End block</label>
            <input id="endBlock" name="endBlock" inputmode="numeric" pattern="[0-9]+" required value="50123000">
          </div>
          <div class="field">
            <label for="mode">Evidence mode</label>
            <select id="mode" name="mode">
              <option value="live" selected>Live RPC (public fallback)</option>
              <option value="cached">Cached fixture (next slice)</option>
              <option value="recorded">Recorded evidence (next slice)</option>
            </select>
          </div>
          <div class="field">
            <label for="chainId">Chain ID</label>
            <input id="chainId" name="chainId" value="8453" readonly>
            <span class="help">Base Mainnet</span>
          </div>
          <div class="field">
            <label for="configVersion">Config version</label>
            <input id="configVersion" name="configVersion" value="phase1-scope-v1" readonly>
          </div>
          <div class="field">
            <label for="idempotencyKey">Replay key</label>
            <input id="idempotencyKey" name="idempotencyKey" required value="fixture-baseunc-001" autocomplete="off" spellcheck="false">
            <span class="help">Reuse it to receive the same request identity and evidence result.</span>
          </div>
        </div>
        <button id="submit-button" type="submit">Investigate token</button>
        <p id="status" class="status" role="status" aria-live="polite"></p>
      </form>

      <div id="recovery" class="notice" role="group" aria-label="Recovery options" hidden style="border-left-color: #91d8d0">
        <p id="recovery-hint"></p>
        <button id="retry-button" type="button" hidden style="margin-top: 12px">Retry evidence read</button>
      </div>

      <section id="result" class="result" aria-labelledby="result-heading" hidden>
        <h2 id="result-heading">Request scope</h2>
        <dl>
          <dt>State</dt><dd id="result-state"></dd>
          <dt>Request ID</dt><dd id="result-request-id"></dd>
          <dt>Scope hash</dt><dd id="result-scope-hash"></dd>
          <dt>Chain ID</dt><dd id="result-chain-id"></dd>
          <dt>Mode</dt><dd id="result-mode"></dd>
          <dt>Config version</dt><dd id="result-config-version"></dd>
          <dt>Provider mode</dt><dd id="result-provider-mode"></dd>
          <dt>Event count</dt><dd id="result-event-count"></dd>
          <dt>Pool ID</dt><dd id="result-pool-id"></dd>
          <dt>Funding coverage</dt><dd id="result-funding-coverage"></dd>
          <dt>Root paths</dt><dd id="result-root-paths"></dd>
          <dt>First evidence</dt><dd><a id="result-first-evidence" href="#">Not ready</a></dd>
        </dl>
      </section>

      <section id="certificate" class="result" aria-labelledby="certificate-heading" hidden>
        <h2 id="certificate-heading">Anomaly certificate</h2>
        <dl>
          <dt>Investigation branch</dt><dd id="cert-branch"></dd>
          <dt>Branch source</dt><dd id="cert-branch-mode"></dd>
          <dt>Summary hash</dt><dd id="cert-summary-hash"></dd>
          <dt>Verdict</dt><dd id="cert-verdict"></dd>
          <dt>Observed share</dt><dd id="cert-share"></dd>
          <dt>Attribution coverage</dt><dd id="cert-coverage"></dd>
          <dt>Coordination clusters</dt><dd id="cert-clusters"></dd>
          <dt>Known-root exclusions</dt><dd id="cert-exclusions"></dd>
          <dt>Funding status</dt><dd id="cert-funding-status"></dd>
          <dt>Report hash</dt><dd id="cert-hash"></dd>
          <dt>Report JSON</dt><dd><a id="cert-download" href="#">Not ready</a></dd>
        </dl>
        <p id="cert-limitation" class="help" style="margin-top: 14px"></p>
        <button id="cert-replay" type="button" style="margin-top: 16px">Replay &amp; verify report</button>
        <p id="cert-replay-result" class="status" role="status" aria-live="polite" style="margin-top: 12px"></p>
      </section>
    </main>
    <script>
      (() => {
        const form = document.getElementById('investigation-form');
        const button = document.getElementById('submit-button');
        const status = document.getElementById('status');
        const result = document.getElementById('result');
        const fields = {
          state: document.getElementById('result-state'),
          requestId: document.getElementById('result-request-id'),
          scopeHash: document.getElementById('result-scope-hash'),
          chainId: document.getElementById('result-chain-id'),
          mode: document.getElementById('result-mode'),
          configVersion: document.getElementById('result-config-version'),
          providerMode: document.getElementById('result-provider-mode'),
          eventCount: document.getElementById('result-event-count'),
          poolId: document.getElementById('result-pool-id'),
          fundingCoverage: document.getElementById('result-funding-coverage'),
          rootPaths: document.getElementById('result-root-paths'),
          firstEvidence: document.getElementById('result-first-evidence'),
          certBranch: document.getElementById('cert-branch'),
          certBranchMode: document.getElementById('cert-branch-mode'),
          certSummaryHash: document.getElementById('cert-summary-hash'),
          certVerdict: document.getElementById('cert-verdict'),
          certShare: document.getElementById('cert-share'),
          certCoverage: document.getElementById('cert-coverage'),
          certClusters: document.getElementById('cert-clusters'),
          certExclusions: document.getElementById('cert-exclusions'),
          certFundingStatus: document.getElementById('cert-funding-status'),
          certHash: document.getElementById('cert-hash'),
          certDownload: document.getElementById('cert-download'),
          certLimitation: document.getElementById('cert-limitation'),
          certReplay: document.getElementById('cert-replay'),
          certReplayResult: document.getElementById('cert-replay-result')
        };
        const certificate = document.getElementById('certificate');
        const recovery = document.getElementById('recovery');
        const recoveryHint = document.getElementById('recovery-hint');
        const retryButton = document.getElementById('retry-button');
        let lastReportRequestId = null;
        let currentRequestId = null;

        function showStatus(message, kind) {
          status.textContent = message;
          status.className = kind ? 'status ' + kind : 'status';
        }

        function showRecord(record) {
          fields.state.textContent = record.state;
          fields.requestId.textContent = record.requestId;
          fields.scopeHash.textContent = record.scopeHash;
          fields.chainId.textContent = String(record.chainId);
          fields.mode.textContent = record.mode;
          fields.configVersion.textContent = record.configVersion;
          fields.providerMode.textContent = record.evidence ? record.evidence.providerMode : record.providerMode;
          fields.eventCount.textContent = record.evidence ? String(record.evidence.eventCount) : 'not ready';
          fields.poolId.textContent = record.evidence ? record.evidence.poolId : 'not ready';
          const funding = record.evidence && record.evidence.funding;
          fields.fundingCoverage.textContent = funding ? funding.originsWithEdges + '/' + funding.originsRequested + ' sampled origins, ' + funding.erc20OriginsRequested + ' ERC-20-enriched, ' + funding.edges.length + ' edges (' + funding.status + ')' : 'not ready';
          fields.rootPaths.textContent = funding ? String(funding.graph.paths.length) : 'not ready';
          const firstEvent = record.evidence && record.evidence.events && record.evidence.events[0];
          const firstTransaction = firstEvent && firstEvent.transactionHash;
          if (firstTransaction && /^0x[0-9a-fA-F]{64}$/.test(firstTransaction)) {
            fields.firstEvidence.textContent = firstTransaction;
            fields.firstEvidence.href = 'https://basescan.org/tx/' + firstTransaction;
            fields.firstEvidence.target = '_blank';
            fields.firstEvidence.rel = 'noreferrer noopener';
          } else {
            fields.firstEvidence.textContent = 'Not ready';
            fields.firstEvidence.removeAttribute('href');
            fields.firstEvidence.removeAttribute('target');
            fields.firstEvidence.removeAttribute('rel');
          }
          result.hidden = false;
          showReport(record);
        }

        function showReport(record) {
          const cert = record.report;
          if (!cert || !cert.report) { certificate.hidden = true; lastReportRequestId = null; return; }
          const r = cert.report;
          const branch = record.branch;
          if (branch) {
            fields.certBranch.textContent = branch.branch + ' (maxHops ' + branch.plan.maxHopsConsidered + ', focus ' + branch.plan.focus + ')';
            fields.certBranchMode.textContent = branch.mode + (branch.fallbackReason ? ' (' + branch.fallbackReason + ')' : '') + (branch.rationale ? ' : ' + branch.rationale : '');
            fields.certSummaryHash.textContent = branch.summaryHash;
          } else {
            fields.certBranch.textContent = '-';
            fields.certBranchMode.textContent = '-';
            fields.certSummaryHash.textContent = '-';
          }
          fields.certVerdict.textContent = r.verdict.label + ' : ' + r.verdict.rationaleCode;
          fields.certShare.textContent = r.metric.numerator + '/' + r.metric.denominator + ' swap events (' + r.metric.ratioPercent + ') linked to shared unknown roots';
          fields.certCoverage.textContent = (r.coverage.attributionCoverageBps / 100).toFixed(2) + '% (' + r.coverage.tradersAttributed + '/' + r.coverage.originsTotal + ' origins attributed)';
          fields.certClusters.textContent = String(r.coordinationClusters.length);
          fields.certExclusions.textContent = String(r.knownRootExclusions.length);
          fields.certFundingStatus.textContent = r.coverage.fundingStatus;
          fields.certHash.textContent = cert.reportHash;
          fields.certDownload.textContent = 'Download canonical report JSON';
          fields.certDownload.href = '/api/investigations/' + encodeURIComponent(record.requestId) + '/report';
          fields.certDownload.setAttribute('download', '');
          fields.certLimitation.textContent = (r.limitations && r.limitations[0]) ? r.limitations[0] : '';
          fields.certReplayResult.textContent = '';
          fields.certReplayResult.className = 'status';
          lastReportRequestId = record.requestId;
          certificate.hidden = false;
        }

        async function replayAndVerify() {
          if (!lastReportRequestId) return;
          fields.certReplayResult.textContent = 'Replaying…';
          fields.certReplayResult.className = 'status';
          try {
            const reportResponse = await fetch('/api/investigations/' + encodeURIComponent(lastReportRequestId) + '/report');
            if (!reportResponse.ok) {
              fields.certReplayResult.textContent = 'No report is available to replay.';
              fields.certReplayResult.className = 'status error';
              return;
            }
            const cert = await reportResponse.json();
            const verifyResponse = await fetch('/api/investigations/' + encodeURIComponent(lastReportRequestId) + '/report/verify', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ report: cert.report, reportHash: cert.reportHash })
            });
            const outcome = await verifyResponse.json();
            if (outcome.ok) {
              fields.certReplayResult.textContent = 'Replay verified: canonical hash matches (' + String(outcome.recomputedHash).slice(0, 16) + '…).';
              fields.certReplayResult.className = 'status success';
            } else {
              fields.certReplayResult.textContent = 'Replay mismatch: ' + (outcome.mismatchReason || 'hash differs') + '.';
              fields.certReplayResult.className = 'status error';
            }
          } catch {
            fields.certReplayResult.textContent = 'Replay could not reach the Dervyx API.';
            fields.certReplayResult.className = 'status error';
          }
        }

        fields.certReplay.addEventListener('click', replayAndVerify);

        function hideRecovery() {
          recovery.hidden = true;
          retryButton.hidden = true;
        }

        function showRecovery(kind) {
          let hint;
          let allowRetry = false;
          if (kind === 'retryable') {
            hint = 'The evidence read hit a transient provider issue. Retry the read, or narrow the Base block range and resubmit.';
            allowRetry = true;
          } else if (kind === 'insufficient') {
            hint = 'This scope did not yield sufficient supported evidence. Try a narrower Base block range or a different window, then resubmit.';
          } else {
            hint = 'Attribution coverage is bounded to the top sampled origins, so the result is inconclusive rather than clean. Try a narrower block range to raise coverage.';
          }
          recoveryHint.textContent = hint;
          retryButton.hidden = !allowRetry;
          recovery.hidden = false;
        }

        function handleFinalRecord(finalRecord) {
          if (finalRecord.state === 'EVIDENCE_READY') {
            const label = finalRecord.report && finalRecord.report.report ? finalRecord.report.report.verdict.label : null;
            const verdict = label ? ' Certified verdict: ' + label + '.' : '';
            showStatus('Evidence ready: ' + finalRecord.evidence.eventCount + ' source-linked events.' + verdict, 'success');
            if (label === 'INSUFFICIENT_DATA' || label === 'UNKNOWN_ROOTS') {
              showRecovery('coverage');
            } else {
              hideRecovery();
            }
          } else if (finalRecord.state === 'RETRYABLE') {
            const message = finalRecord.evidenceError && finalRecord.evidenceError.message ? finalRecord.evidenceError.message : 'The evidence read is retryable.';
            showStatus(message, 'error');
            showRecovery('retryable');
          } else {
            const message = finalRecord.evidenceError && finalRecord.evidenceError.message ? finalRecord.evidenceError.message : 'Evidence was not complete for this scope.';
            showStatus(message, 'error');
            showRecovery('insufficient');
          }
        }

        async function runEvidenceFlow(requestId) {
          currentRequestId = requestId;
          hideRecovery();
          try {
            showStatus('Starting canonical Base evidence…', '');
            const evidenceStart = await fetch('/api/investigations/' + encodeURIComponent(requestId) + '/evidence', { method: 'POST' });
            const evidencePayload = await evidenceStart.json();
            if (!evidenceStart.ok) {
              const message = evidencePayload.error && evidencePayload.error.message ? evidencePayload.error.message : 'Canonical evidence could not be started.';
              showStatus(message, 'error');
              showRecovery('retryable');
              return;
            }
            showRecord(evidencePayload);
            const finalRecord = evidencePayload.state === 'INGESTING' ? await waitForEvidence(requestId) : evidencePayload;
            handleFinalRecord(finalRecord);
          } catch {
            showStatus('The evidence read could not reach the Dervyx API. Retry without changing the scope.', 'error');
            showRecovery('retryable');
          }
        }

        retryButton.addEventListener('click', async () => {
          if (!currentRequestId) return;
          button.disabled = true;
          try {
            await runEvidenceFlow(currentRequestId);
          } finally {
            button.disabled = false;
          }
        });

        async function waitForEvidence(requestId) {
          for (let attempt = 0; attempt < 120; attempt += 1) {
            const response = await fetch('/api/investigations/' + encodeURIComponent(requestId));
            if (!response.ok) throw new Error('EVIDENCE_STATUS_FAILED');
            const record = await response.json();
            showRecord(record);
            if (record.state !== 'INGESTING') return record;
            showStatus('Reading canonical Base events…', '');
            await new Promise((resolve) => setTimeout(resolve, 250));
          }
          throw new Error('EVIDENCE_TIMEOUT');
        }

        form.addEventListener('submit', async (event) => {
          event.preventDefault();
          button.disabled = true;
          result.hidden = true;
          certificate.hidden = true;
          hideRecovery();
          showStatus('Validating scope…', '');
          const formData = new FormData(form);
          const body = Object.fromEntries(formData.entries());
          body.chainId = Number(body.chainId);
          try {
            const response = await fetch('/api/investigations', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify(body)
            });
            const payload = await response.json();
            if (!response.ok) {
              const message = payload.error && payload.error.message ? payload.error.message : 'Investigation scope was rejected.';
              showStatus(message, 'error');
              return;
            }
            showRecord(payload);
            currentRequestId = payload.requestId;
            if (payload.mode !== 'live') {
              showStatus('Scope accepted. This evidence mode is not connected yet.', 'success');
              return;
            }
            await runEvidenceFlow(payload.requestId);
          } catch {
            showStatus('The request could not reach the Dervyx API. Retry without changing the scope.', 'error');
          } finally {
            button.disabled = false;
          }
        });
      })();
    </script>
  </body>
</html>`;
