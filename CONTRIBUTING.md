# Contributing to Zunia Chain Registry

## Before submitting

```shell
yarn install
yarn validate cosmos/{your-file}.json
```

## Requirements

- Chain JSON must pass validation (`yarn validate`)
- Logo: 256x256 PNG at `images/{chain-identifier}/chain.png`
- File name must match chain identifier (see main README)
- RPC and REST endpoints must be HTTPS and publicly reachable
- Include accurate `nodeProvider` contact information

## Pull request checklist

- [ ] Validated locally with `yarn validate`
- [ ] Logo added or updated
- [ ] `chainSymbolImageUrl` points to `Zunia-Lab/zunia-chain-registry`
- [ ] No secrets or private infrastructure details

See [Zunia-Lab/.github CONTRIBUTING](https://github.com/Zunia-Lab/.github/blob/main/CONTRIBUTING.md) for org-wide guidelines.
