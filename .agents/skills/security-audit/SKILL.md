---
name: security-audit
description: Audit application authentication, authorization, API validation, dependencies and secrets in authorized environments.
---

# security-audit

Inventory trust boundaries and endpoints. Check password hashing, signed expiring JWTs, server-side RBAC and object-level authorization, injection, XSS, CSRF where cookie auth is used, CORS, rate limits, uploads, SSRF and secret handling. Treat existing demo tokens and simulated verification as non-production. Test negative authorization cases using local disposable data. Run package-manager audit, Semgrep and Gitleaks if installed; use OWASP ZAP baseline only against authorized local/staging targets. Do not send secrets to external tools, run destructive scans or auto-force dependency upgrades. Record severity, file/line, evidence, remediation and retest; distinguish missing tools from passing checks.
