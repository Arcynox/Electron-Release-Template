import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

const formats = {
  win: { exe: { x64: 'x64', arm64: 'arm64' } },
  mac: { dmg: { x64: 'x64', arm64: 'arm64' } },
  linux: {
    AppImage: { x64: 'x86_64', arm64: 'arm64' },
    deb: { x64: 'amd64', arm64: 'arm64' },
    rpm: { x64: 'x86_64', arm64: 'aarch64' },
    pacman: { x64: 'x64', arm64: 'aarch64' },
  },
};

export function expectedNames(platform, arch) {
  if (!(platform in formats)) throw new Error(`Unknown platform: ${platform}`);
  if (!['x64', 'arm64'].includes(arch)) throw new Error(`Unknown architecture: ${arch}`);
  return Object.entries(formats[platform]).map(([ext, names]) =>
    `${pkg.name}-${pkg.version}-${platform}-${names[arch]}.${ext}`,
  );
}

export function checkTag(tag) {
  const expected = `v${pkg.version}`;
  if (tag !== expected) throw new Error(`Tag ${tag} must match package.json version ${expected}`);
}

export function checkAssets(directory, platform, arch) {
  if (!existsSync(directory)) throw new Error(`Missing directory: ${directory}`);
  const actual = new Set(readdirSync(directory));
  const platforms = platform === 'all' ? Object.keys(formats) : [platform];
  const missing = platforms.flatMap((name) =>
    (platform === 'all' ? ['x64', 'arm64'] : [arch])
      .flatMap((cpu) => expectedNames(name, cpu)),
  ).filter((name) => !actual.has(name));
  if (missing.length) throw new Error(`Missing installers: ${missing.join(', ')}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const [, , command, first, second, third] = process.argv;
  try {
    if (command === 'tag') checkTag(first);
    else if (command === 'assets') checkAssets(first, second, third);
    else throw new Error('Usage: release-check.mjs tag <vVERSION> | assets <directory> <platform|all> [arch]');
    console.log('Release check passed.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
