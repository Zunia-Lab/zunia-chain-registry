# Contributing to Zunia Chain Registry

## Before submitting

```shell
yarn install
yarn validate cosmos/{your-file}.json
```

## Requirements

- Chain JSON must pass validation (`yarn validate`)
- Logo: 256×256 PNG at `images/{chain-identifier}/chain.png`
- File name must match the chain identifier (see [README](./README.md))
- RPC and REST endpoints must be HTTPS and publicly reachable
- Include accurate `nodeProvider` contact information
- `chainSymbolImageUrl` must use `Zunia-Lab/zunia-chain-registry`

## Pull request checklist

- [ ] Validated locally with `yarn validate`
- [ ] Logo added or updated
- [ ] Image URLs point to this repository
- [ ] No secrets or private infrastructure details

Org-wide guidelines: [Zunia-Lab/.github CONTRIBUTING](https://github.com/Zunia-Lab/.github/blob/main/CONTRIBUTING.md).
