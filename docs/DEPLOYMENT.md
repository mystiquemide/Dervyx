# Deployment

Dervyx uses a split deployment:

- **Frontend:** https://dervyx.vercel.app
- **Stateful API:** https://dervyx.159.69.241.122.sslip.io

Vercel serves the Next.js interface and proxies same-origin investigation requests to the stateful API through `DERVYX_API_ORIGIN`. The Node.js API remains behind Caddy and systemd so short-lived investigation state stays with the service process.

The standalone `src/server.ts` boundary is used for engine tests and local replay. It is not a second public deployment.

## Local production run

```bash
npm ci
cp .env.example .env
npm run build
npm start -- --hostname 127.0.0.1 --port 4760
```

Open `http://127.0.0.1:4760/investigate`.

## Vercel frontend

Set these project environment variables for the production deployment:

```text
NEXT_PUBLIC_SITE_URL=https://dervyx.vercel.app
DERVYX_API_ORIGIN=https://dervyx.159.69.241.122.sslip.io
```

Deploy the exact Git commit being reviewed. After deployment, assign the canonical `dervyx.vercel.app` domain to the deployment and verify the public HTML and API proxy response.

## Stateful API service

The API service should run the built Next.js server on loopback port `4760` under a restricted service account:

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

Keep environment files readable only by the service account. Do not place credentials in the unit file or repository.

## Caddy

```caddy
dervyx.example.com {
    reverse_proxy 127.0.0.1:4760
}
```

Replace the example hostname with the API deployment hostname and keep HTTPS enabled.

## Verification

Run these checks against the canonical frontend and API:

```bash
curl https://dervyx.vercel.app/api/health
curl -I https://dervyx.vercel.app/
curl -I https://dervyx.vercel.app/status
curl https://dervyx.vercel.app/api/agent
curl https://dervyx.159.69.241.122.sslip.io/api/health
```

Then verify:

1. `/`, `/investigate`, `/compare`, and `/status` render successfully.
2. The investigation page has no landing navigation or shared footer.
3. Saved anomaly and clean-control examples complete immediately.
4. Both certificates can be downloaded and replay-verified.
5. A bounded live review either completes or fails with an explicit retryable state.
6. The canonical HTML uses `dervyx.vercel.app` for social metadata.
7. Response headers include CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy.
