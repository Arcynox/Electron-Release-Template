---
name: electron-cross-platform
description: Adapt an existing Electron project to build and release Windows, macOS, and Linux packages with GitHub Actions. Use when the user asks to add or extend cross-platform packaging or Linux distro coverage; do not use for unrelated Electron app features.
---

# Electron cross-platform releases

Adapt the **existing project**. First inspect its package manager and lockfile, Electron packaging tool, app entry point, native dependencies, current CI, signing setup, update strategy and supported OS/CPU targets. Preserve the project's framework and scripts. If this skill lives inside the Electron Release Template repository, its `electron-builder.yml`, `.github/workflows/` and `scripts/release-check.mjs` are examples to adapt, not files to copy blindly.

## Choose Linux targets by distribution family

| Audience | Package target | Important limit |
| --- | --- | --- |
| Broad desktop Linux | AppImage | No universal guarantee; test system libraries and runtime behavior. |
| Debian, Ubuntu, Mint, Pop!_OS | DEB | Debian-family dependencies and installation need testing. |
| Fedora, RHEL, openSUSE | RPM | RPM-family dependencies and installation need testing. |
| Arch, Manjaro, EndeavourOS | Pacman | The electron-builder target is beta; validate on an Arch-family system. |

Add Snap or Flatpak when the user needs that distribution channel and its extra tooling, runtime, store or repository flow is understood. Do not promise Alpine support from a glibc-based AppImage; Alpine's musl environment needs separate validation. Choose further formats when the project's actual audience requires them. Treat "supports a distro" as a claim that needs an install-and-launch test there, not just a successful build on Ubuntu.

## Implement and verify

- Use the project's existing packager when it already covers the requested targets. If introducing electron-builder, keep its configuration native and visible; avoid a second custom configuration language.
- Use native GitHub-hosted runners for Windows and macOS builds, and suitable native ARM64 runners when those architectures are requested. A matrix label naming Fedora or Arch on an Ubuntu runner does not test those distributions. Native Node modules may require platform-specific rebuilds or binaries.
- Separate read-only pull request CI from tag-based release jobs. Check tag/version alignment, installer existence and names, and keep release token permissions to the job that creates a draft. Do not expose signing secrets to pull request jobs.
- Make signing and notarization requirements explicit. Do not claim auto-update works unless update metadata, release provider, signed artifacts where required and the app's updater are configured and tested together.
- Run the project's lint/tests and at least one actual package build where tooling is available. Verify the generated extension and architecture names before hard-coding artifact globs. If some operating systems or distributions cannot be tested locally, report that limit and leave the status as unverified.
- Update setup, release and compatibility documentation. Distinguish **built**, **installed**, and **tested** in the final matrix so users can judge the evidence.

Creating or publishing a GitHub Release, changing repository settings, or using signing credentials requires the user's authorization for that external action. Preparing local files and a reviewable workflow is within the normal implementation task.
