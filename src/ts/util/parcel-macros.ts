// This file contains built-time macros as supported by the Parcel bundler
/* eslint-disable */
import type { MacroContext } from '@parcel/macros';

// @ts-expect-error This import is only used at build time and won't be bundled for runtime use.
import { execSync } from 'node:child_process';

export interface GitVersionInfo {
  hash: string | null;
  tag: string | null;
}

function getGitCommit(this: MacroContext | void) {
  this?.invalidateOnBuild();
  try {
    const execOpts = { stdio: ['ignore', 'pipe', 'ignore'] };
    return execSync('git rev-parse HEAD', execOpts).toString().trim();
  } catch (e) {
    return null;
  }
}

function geGitTag(this: MacroContext | void) {
  this?.invalidateOnBuild();
  try {
    const execOpts = { stdio: ['ignore', 'pipe', 'ignore'] };
    return execSync('git describe --tags', execOpts).toString().trim();
  } catch (e) {
    return null;
  }
}

export function getGitVersionInfo(): GitVersionInfo {
  const hash = getGitCommit();
  const tag = geGitTag();
  return { hash, tag };
}
