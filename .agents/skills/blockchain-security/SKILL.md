---
name: blockchain-security
description: Review Solidity, oracle, IPFS evidence and blockchain transaction integrity.
---

# blockchain-security

Inspect whether real contracts and RPC integration exist before claiming verification. Check access control, lifecycle transitions, replay protection, reentrancy where relevant, quantity invariants, event consistency, chain ID, contract address and receipt confirmation. Use Hardhat local tests and Slither if available. Validate oracle provenance, freshness and idempotency; verify IPFS content identifiers and availability separately. Never fabricate hashes, receipts, certificates or authenticity claims. Keep keys out of source and logs; do not deploy or spend funds without authorization. Report missing contracts or credentials as blockers.
