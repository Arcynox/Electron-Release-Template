# Electron Release Template

A small, runnable Electron starter that builds installable desktop packages with GitHub Actions. Fork it or mark the repository as a GitHub template, replace the sample app, and keep the release pipeline.

[Español](docs/es/README.md) · [Linux coverage](docs/compatibility.md) · [Release guide](docs/releasing.md) · [Contributing](CONTRIBUTING.md)

## What it builds

| Runner | Architecture | Files | Intended use |
| --- | --- | --- | --- |
| Windows | x64, arm64 | `.exe` (NSIS) | Windows installer |
| macOS | Intel x64, Apple Silicon arm64 | `.dmg` | macOS disk image |
| Linux | x64, arm64 | `.AppImage`, `.deb`, `.rpm`, `.pacman` | Portable app, Debian, RPM and Arch families |

The Linux jobs run on Ubuntu. Producing an RPM, Pacman package or AppImage does **not** mean it has been tested on Fedora, Arch, Mint, or every Linux distribution. Test the packages on the systems you support before publishing a production release. AppImage is a broad compatibility option, not a universal guarantee. See the [distribution coverage map](docs/compatibility.md).

## Use this template

1. On GitHub, enable **Settings → General → Template repository** for this repository. Then select **Use this template** to create a new repository.
2. Install [Node.js 24](https://nodejs.org/en/download) and run `npm ci` followed by `npm start`.
3. Replace `src/` with your app. Keep `src/main.cjs` as an example of Electron security settings, or carry those settings into your own main process.
4. Edit the app identity before shipping:
   - `package.json`: `name`, `desktopName`, `description`, `author`, `homepage`, `repository`, `version`.
   - `electron-builder.yml`: `appId`, `productName`, targets and categories.
   - Add your own icons in `build/` (see [electron-builder icons](https://www.electron.build/v26/docs/icons/)). Without them, the package uses default Electron artwork.
5. Run `npm run lint`, `npm test`, and `npm run pack` locally. `npm run dist` creates installers for your current OS and architecture; Linux RPM and Pacman builds need `rpm` and `bsdtar` system tooling.
6. Review [the release guide](docs/releasing.md), configure signing if you intend to distribute to end users, then create a version tag.

The sample `author.email` and `github.com/your-org` addresses are placeholders. Replace them before publishing. If your company owns the project, review the copyright and license with it too.

## Workflows

- [CI](.github/workflows/ci.yml) runs on pushes to `main`, pull requests, and manual dispatch. It checks JavaScript, runs tests, and creates unpacked packages on Ubuntu, Windows and macOS. It does not publish anything.
- [Release](.github/workflows/release.yml) runs on a pushed `v*` tag. It checks that the tag equals `v` plus `package.json#version`, builds all twelve installers, verifies the expected files, and creates a **draft** GitHub Release. A maintainer reviews and publishes the draft.

The release job uses only `contents: write` to create the draft. Pull requests have read-only permissions. The matrix uses native runners for Windows and Linux ARM64, plus Intel and Apple Silicon macOS runners. Apps with native Node modules may need extra platform-specific setup and testing.

## Create a release

```bash
npm version 0.1.1
git push origin main --follow-tags
```

`npm version` updates `package.json` and `package-lock.json`, commits them, and creates `v0.1.1`. The pushed tag starts the release workflow. After all jobs succeed, inspect the draft GitHub Release and its installers, then publish it. The workflow refuses to overwrite an already published release.

See [docs/releasing.md](docs/releasing.md) for signing, platform validation and reruns.

## Adapt an existing Electron project with an agent

The repository includes a portable [Codex skill](skills/electron-cross-platform/SKILL.md). Give that file to your agent, or copy the `skills/electron-cross-platform` folder into your Codex skills directory to invoke it as `$electron-cross-platform`.

```bash
mkdir -p ~/.codex/skills
cp -R skills/electron-cross-platform ~/.codex/skills/
```

For example, paste this into a chat opened in your own Electron project:

> Use `$electron-cross-platform` to adapt this project for Windows, macOS, and the Linux distribution families our users need. Preserve the existing app and packaging stack. Build the requested formats, document what was actually tested, and leave a draft-release workflow.

The skill inspects the project before changing it. It can add DEB, RPM, Pacman, AppImage or further channels when they match the app's audience; it does not pretend that one Ubuntu runner tests every distro.

## Scope

This is a packaging and release starter, not a compatibility certification or auto-update service. GitHub Release assets are uploaded without auto-update metadata; add `electron-updater` and its metadata/publishing flow only after choosing an update strategy. macOS notarization and Windows signing require your own credentials. See the [electron-builder publishing guide](https://www.electron.build/v26/docs/publish/) and [code signing guide](https://www.electron.build/v26/docs/features/code-signing/).

## Project layout

```text
.github/workflows/ci.yml       Pull request and main-branch checks
.github/workflows/release.yml  Tagged build and draft release
electron-builder.yml           Installer targets and artifact names
scripts/release-check.mjs      Tag and installer validation
src/                           Minimal Electron application
docs/releasing.md              Production release guide
skills/electron-cross-platform Agent skill for adapting existing apps
```

## License

MIT. See [LICENSE](LICENSE).
