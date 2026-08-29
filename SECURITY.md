# Security

## Scope

Dervyx is a read-only Base investigation tool. It reads public chain data and
returns bounded evidence about observable funding relationships and swap
activity.

Dervyx does not:

- connect to or custody user wallets;
- request signatures;
- send transactions or move funds;
- prove intent, ownership, fraud, or criminal wash trading;
- make automatic listing, blacklist, or enforcement decisions.

## Reporting a vulnerability

Please do not include secrets, private keys, wallet credentials, RPC tokens, or
personal data in a report. Share a minimal reproduction and the affected
commit or route through the repository's issue tracker. For sensitive reports,
contact the maintainer privately before public disclosure.

## Data handling

Configured RPC URLs are redacted before they enter evidence, reports, receipts,
or normalized public source metadata. Keep `.env` local and never commit API
keys, passwords, private keys, wallet signatures, or provider credentials.

Public reports are bounded by the configured block range, sampled origins, and
two-hop funding traversal. Incomplete evidence is surfaced as uncertainty and
must not be interpreted as a clean result.
