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

Attribution for the original protocol remains in the README license section.
