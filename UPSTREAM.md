# Upstream sync

This repository is forked from [chainapsis/keplr-chain-registry](https://github.com/chainapsis/keplr-chain-registry).

## Remotes

```bash
git remote add upstream https://github.com/chainapsis/keplr-chain-registry.git
git fetch upstream
```

## Sync workflow

Periodically merge upstream changes:

```bash
git checkout main
git fetch upstream
git merge upstream/main
# Resolve conflicts, keeping zunialab image URLs where we have forked assets
yarn validate cosmos/your-chain.json  # spot-check after merge
git push origin main
```

## URL migration after upstream merge

If upstream adds entries still pointing at `chainapsis/keplr-chain-registry`, update image URLs:

```bash
find . -type f \( -name "*.json" \) -exec sed -i '' \
  's|chainapsis/keplr-chain-registry|Zunia-Lab/zunia-chain-registry|g' {} +
```

## What we change vs upstream

- README and documentation for Zunia wallet consumers
- `chainSymbolImageUrl` and related raw GitHub URLs point to this repository
- Zunia-specific chain curation and review process

We do not remove Keplr or Chainapsis attribution.
