# Release guide

## Before the first public release

- Replace the sample app, product name, package name, application ID, author email, repository URL and icons.
- Confirm the company or maintainers approve the [MIT license](../LICENSE) and copyright line.
- Enable GitHub Actions and, if this is a template repository, enable **Template repository** in repository settings.
- Choose the supported OS versions and test actual installs. A successful CI build only proves the packages were created.
- Decide whether you need signed installers. Unsigned macOS downloads can be blocked by Gatekeeper; unsigned Windows installers may trigger SmartScreen warnings.

## Signing

The release workflow accepts optional repository secrets:

| Platform | Secrets |
| --- | --- |
| macOS | `MAC_CSC_LINK`, `MAC_CSC_KEY_PASSWORD` |
| macOS notarization | `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, `APPLE_TEAM_ID` |
| Windows | `WIN_CSC_LINK`, `WIN_CSC_KEY_PASSWORD` |

Use GitHub **Settings → Secrets and variables → Actions**. The macOS certificate must be appropriate for Developer ID distribution. To make signing mandatory, add `forceCodeSigning: true` to the relevant platform configuration after credentials work. To enable notarization, also add `notarize: true` under `mac` in `electron-builder.yml`; Apple secrets alone do not enable it. Confirm notarization succeeds on a test release before publishing. See [electron-builder macOS signing](https://www.electron.build/v26/docs/features/code-signing/code-signing-mac/) and [notarization](https://www.electron.build/v26/docs/features/code-signing/notarization/).

Signing secrets are available only in the tagged release workflow, not in pull request CI. Never commit certificates or passwords.

## Tag and publish

The tag must be exactly `v` plus the `version` in `package.json`. For example:

```bash
npm version 1.0.0
git push origin main --follow-tags
```

Wait for all matrix jobs and the draft job to succeed. Review the twelve assets in the draft Release, install the relevant ones on actual target systems, and publish the draft in GitHub's UI. The workflow checks for missing assets and will not overwrite an existing published release.

If a run fails, fix the problem and rerun it while the release remains a draft. The workflow can replace assets on an existing draft. Do not move a published version tag; release a new version instead.

## Compatibility notes

- `.deb` targets Debian-based systems; `.rpm` targets RPM-based systems. Packaging does not validate dependency behavior on those distributions.
- `.pacman` targets Arch-based systems. This electron-builder target is beta; validate installation and launch on Arch or a derivative before distributing it.
- `.AppImage` is intended for broad Linux distribution coverage, including many installations of Arch and Mint, but it can still fail because of system library, sandbox or display-server differences.
- ARM64 jobs use native GitHub-hosted runners. If your application has native Node modules, ensure each module builds or ships a compatible binary on all six runner environments.
- Intel macOS runner availability and labels may change over time; check [GitHub's runner reference](https://docs.github.com/en/actions/reference/runners/github-hosted-runners) when upgrading the workflow.
- Auto-update is intentionally absent. Adding it requires `electron-updater`, platform-specific update artifacts and metadata, signing, and a published release channel. This workflow currently uploads only installers.
