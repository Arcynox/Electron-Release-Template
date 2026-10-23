# Linux distribution coverage

This is a map from distribution families to package formats, **not** a claim that the sample app has been installed and tested on every distribution. The release workflow is configured to create each format on Ubuntu x64 and ARM64 runners. A consuming project should record its own install-and-launch results before announcing support.

| Distribution or family | Package to try first | Configured in release workflow | Install/launch validated here |
| --- | --- | --- | --- |
| Debian | `.deb` | Yes | No |
| Ubuntu | `.deb` or `.AppImage` | Yes | No |
| Linux Mint | `.deb` or `.AppImage` | Yes | No |
| Pop!_OS | `.deb` or `.AppImage` | Yes | No |
| Fedora | `.rpm` or `.AppImage` | Yes | No |
| RHEL / CentOS Stream | `.rpm` | Yes | No |
| openSUSE | `.rpm` or `.AppImage` | Yes | No |
| Arch Linux | `.pacman` or `.AppImage` | Yes | No |
| Manjaro / EndeavourOS | `.pacman` or `.AppImage` | Yes | No |
| Other glibc-based desktop distributions | `.AppImage` | Yes | No |

The Pacman target is beta in electron-builder. AppImage may encounter system library, sandbox or desktop integration issues. Alpine Linux uses musl and needs separate testing; this template does not claim Alpine support. Snap and Flatpak are distinct distribution channels with extra tooling and are candidates when the adopting project needs them.

When you validate a project based on this template, replace the final column with the tested distro version, architecture and test date. Keep the distinction between **built**, **installed** and **tested** visible in release notes.

## Add another format

Choose the format for a real user need, then update `linux.target` in `electron-builder.yml`, the Linux tooling and upload patterns in `.github/workflows/release.yml`, and the expected names in `scripts/release-check.mjs`. Confirm a package build before adding it to this table. Test installation and launch on its intended distribution before changing the validation column to Yes. Flatpak and Snap need extra runtime or store setup; Alpine needs separate musl compatibility checks.
