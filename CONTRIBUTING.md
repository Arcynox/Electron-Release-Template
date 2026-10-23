# Contributing

Thanks for helping improve the template. Open an issue before a large change so maintainers and contributors can agree on the scope.

## Local checks

Use Node.js 24, then run:

```bash
npm ci
npm run lint
npm test
npm run pack
```

`npm run pack` makes an unpacked package for your current platform. For target-format changes, describe the platform you tested and attach the relevant CI run to your pull request. Keep documentation and the release matrix in sync with any new target.

## Pull requests

- Explain the problem, the approach and the platforms affected.
- Keep sample-app changes small; the project's main purpose is the release pipeline.
- Do not commit build output, credentials, certificates or generated installers.
- Update the English README and its Spanish quick start when user-facing behavior changes.

For a security issue, follow [SECURITY.md](SECURITY.md) instead of opening a public issue.
