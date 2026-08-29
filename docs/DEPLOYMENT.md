# Deployment

Dervyx is a Node.js Next.js application. The current public deployment runs on a VPS behind Caddy at:

https://dervyx.159.69.241.122.sslip.io

Vercel is not part of the current deployment path.

The Next.js app and its `app/api` routes are authoritative for production. The
standalone `src/server.ts` process is a compatibility boundary for engine tests
and local replay, not a second production service.

## Local production run

```bash
npm ci
cp .env.example .env
npm run build
npm start -- --hostname 127.0.0.1 --port 4760
```

Verify:

```bash
curl https://dervyx.159.69.241.122.sslip.io/api/health
curl -I https://dervyx.159.69.241.122.sslip.io/
curl -I https://dervyx.159.69.241.122.sslip.io/status
curl https://dervyx.159.69.241.122.sslip.io/api/agent
```

Deploy the exact Git commit being reviewed. Record the commit locally before
reloading the service, then verify the public response and the repository ref
match. The latest build must expose the paired proof, receipt route, full hash
verification, and configured-provider URL redaction.

## systemd

The production service should run the built Next.js server on loopback port `4760` and restart automatically.

```ini
[Unit]
Description=Dervyx Base investigation application
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=app
WorkingDirectory=/srv/dervyx
Environment=NODE_ENV=production
Environment=HOSTNAME=127.0.0.1
Environment=PORT=4760
ExecStart=/usr/bin/node /srv/dervyx/node_modules/next/dist/bin/next start -H 127.0.0.1 -p 4760
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Use a restricted service user and keep `.env` readable only by that user. Do not place credentials in the unit file.

## Caddy

```caddy
dervyx.example.com {
    reverse_proxy 127.0.0.1:4760
}
```

Replace the example hostname with the deployment's canonical HTTPS hostname. Keep TLS termination and security headers enabled at the edge and application layers.

## Post-deploy checks

1. Confirm the service is active and enabled.
2. Confirm port `4760` has exactly one listener.
3. Confirm `/api/health` returns `200` and `chainId: 8453`.
4. Open `/`, `/investigate`, and `/status` in a browser.
5. Load the instant example and use **Replay & verify**.
6. Open `/compare`, run both labeled cached cases, download both receipts, and run `npm run verify:fixtures` from the checkout.
7. Confirm a live evidence request is bounded by the two-run concurrency gate and public rate limit.
8. Inspect the rendered HTML for the canonical public URL in `og:url` and social-image metadata.
9. Check response headers include CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy.
