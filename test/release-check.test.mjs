import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { checkAssets, checkTag, expectedNames } from '../scripts/release-check.mjs';

const { version, name } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('a release tag must match the package version', () => {
  assert.doesNotThrow(() => checkTag(`v${version}`));
  assert.throws(() => checkTag(`v${version}-other`), /must match/);
});

test('a release cannot proceed with a missing platform artifact', () => {
  const dir = mkdtempSync(join(tmpdir(), 'release-check-'));
  try {
    for (const name of expectedNames('linux', 'x64')) writeFileSync(join(dir, name), '');
    assert.doesNotThrow(() => checkAssets(dir, 'linux', 'x64'));
    assert.throws(() => checkAssets(dir, 'all'), /Missing installers/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('Linux artifact names use each package format\'s architecture convention', () => {
  assert.deepEqual(expectedNames('linux', 'x64'), [
    `${name}-${version}-linux-x86_64.AppImage`,
    `${name}-${version}-linux-amd64.deb`,
    `${name}-${version}-linux-x86_64.rpm`,
    `${name}-${version}-linux-x64.pacman`,
  ]);
  assert.deepEqual(expectedNames('linux', 'arm64'), [
    `${name}-${version}-linux-arm64.AppImage`,
    `${name}-${version}-linux-arm64.deb`,
    `${name}-${version}-linux-aarch64.rpm`,
    `${name}-${version}-linux-aarch64.pacman`,
  ]);
});
