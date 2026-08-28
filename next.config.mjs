import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const isDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy. Next injects inline bootstrap scripts and inline critical CSS,
// so 'unsafe-inline' is required for script-src and style-src without a nonce middleware.
// Everything else is locked to same-origin; framing, plugins, and base-uri hijacking are
// denied outright. The app makes only same-origin fetches; the model call is server-side.
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "connect-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Pin the workspace root: a stray lockfile in the parent directory otherwise makes
  // Next infer the wrong root, which breaks the "@/" path alias and file tracing.
  outputFileTracingRoot: projectRoot,
  webpack: (config) => {
    // Resolve the "@/" alias explicitly so it never depends on tsconfig-paths pickup.
    config.resolve.alias = { ...(config.resolve.alias || {}), "@": projectRoot };
    // The deterministic engine in src/ uses NodeNext ".js" import specifiers that point
    // at ".ts" files. Teach webpack to resolve them so API routes can import the engine.
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };
    return config;
  },
};

export default nextConfig;
