# Upstream sync

This repository is maintained by Zunia Lab. Optional sync from [chainapsis/keplr-chain-registry](https://github.com/chainapsis/keplr-chain-registry) keeps schemas and community chain data current.

## Remotes

```bash
git remote add upstream https://github.com/chainapsis/keplr-chain-registry.git
git fetch upstream
```

## Sync workflow

```bash
git checkout main
git fetch upstream
git merge upstream/main
# Resolve conflicts; keep Zunia branding, docs/assets, and Zunia-Lab image URLs
yarn validate cosmos/your-chain.json
git push origin main
```

## URL migration after upstream merge

If upstream reintroduces old image hosts:

```bash
find . -type f -name "*.json" -exec sed -i '' \
  's|chainapsis/keplr-chain-registry|Zunia-Lab/zunia-chain-registry|g' {} +
```

## What Zunia changes vs upstream

- README, docs, and UI copy branded for Zunia
- `chainSymbolImageUrl` and related raw URLs point at this repository
- Screenshots and icons under `docs/assets/`
- Curation and review process owned by Zunia Lab
- Injective's `ethPubKeyTypeUrl` (`/injective.crypto.v1beta1.ethsecp256k1.PubKey`), which the validator does not know yet
- USDC keeps its bare `coinDenom` on Noble (`uusdc`) and Injective (`erc20:0xa00C…`), where upstream writes `USDC.n` and `USDC.inj`: the Zunia apps tag a ticker issued on several chains with its issuer themselves (`USDC.n`, `USDC.inj`, `USDC.grv`), and they recognise a shared ticker by the bare name. Keep these when merging upstream.

Attribution for the original protocol remains in the README license section.
