---
name: systematic-debugging
description: Reproduce and diagnose bugs, fix root causes and verify regressions.
---

# systematic-debugging

Read relevant code, logs, browser console and network responses. Reproduce with exact inputs and record expected versus actual behavior. Trace frontend, API and storage boundaries; isolate the failing assumption before changing code. Add a regression test where feasible. Make the smallest coherent fix; do not swallow errors or disable validation. Run npm run lint and npm run build plus relevant tests using the repository package manager. Report commands, outcomes and blockers; never claim a fix is verified without execution.
