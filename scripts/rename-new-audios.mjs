#!/usr/bin/env node
/**
 * Normalize filenames in assets/new_audios.
 *
 * Rules:
 * - lower case
 * - spaces -> underscore
 * - no special characters (final name: [a-z0-9_]+.mp3)
 * - should not start with a number
 *
 * Default: dry-run (prints mapping)
 * Apply:   node scripts/rename-new-audios.mjs --apply --yes
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const argv = process.argv.slice(2);
const args = new Set(argv);

const APPLY = args.has('--apply');
const YES = args.has('--yes');

const dirFlagIndex = argv.indexOf('--dir');
const DIR = dirFlagIndex >= 0 ? path.resolve(argv[dirFlagIndex + 1] ?? '') : path.resolve('assets/new_audios');

function printHelp(exitCode = 0) {
  // eslint-disable-next-line no-console
  console.log(`\nUsage:\n  node scripts/rename-new-audios.mjs [--dir <path>] [--apply --yes]\n\nDry-run:\n  node scripts/rename-new-audios.mjs\n\nApply renames:\n  node scripts/rename-new-audios.mjs --apply --yes\n`);
  process.exit(exitCode);
}

if (args.has('-h') || args.has('--help')) {
  printHelp(0);
}

function stableSort(a, b) {
  return a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' });
}

function stripExtension(filename) {
  const ext = path.extname(filename);
  return { base: path.basename(filename, ext), ext };
}

function removeDiacritics(s) {
  return s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
}

function normalizeApostrophes(s) {
  // Remove apostrophes-like chars (e.g. baqi’.mp3, ta’awwudh.mp3)
  return s.replace(/[\u2019\u2018\u0060\u00B4\u2032\u02BC\u0027]/g, '');
}

function extractLeadingNumber(s) {
  // Matches "1. Foo", "10. Foo", "9.  Foo", "3) Foo", "4 - Foo"
  const m = s.match(/^\s*(\d+)\s*[.)-]*\s+/);
  if (!m) return { leadingNumber: null, rest: s };
  return { leadingNumber: m[1], rest: s.slice(m[0].length) };
}

function slugifyCore(input) {
  let s = input;
  s = normalizeApostrophes(s);
  s = removeDiacritics(s);
  s = s.toLowerCase();
  s = s.replace(/\s+/g, '_');
  s = s.replace(/-+/g, '_');
  s = s.replace(/[^a-z0-9_]+/g, '_');
  s = s.replace(/_+/g, '_').replace(/^_+|_+$/g, '');
  return s;
}

function ensureNotStartingWithNumber(slug) {
  let s = slug.replace(/^\d+_*/, '');
  if (!s) s = 'audio';
  if (/^\d/.test(s)) s = `audio_${s}`;
  return s;
}

function computeCandidateSlug(baseName) {
  const { leadingNumber, rest } = extractLeadingNumber(baseName);
  const core = ensureNotStartingWithNumber(slugifyCore(rest));
  return { core, leadingNumber };
}

function withSuffix(base, suffix) {
  return suffix ? `${base}_${suffix}` : base;
}

async function main() {
  let dirEntries;
  try {
    dirEntries = await fs.readdir(DIR, { withFileTypes: true });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`Cannot read directory: ${DIR}`);
    // eslint-disable-next-line no-console
    console.error(e?.message ?? e);
    process.exit(1);
  }

  const allFiles = dirEntries.filter(d => d.isFile()).map(d => d.name).sort(stableSort);
  const mp3Files = allFiles.filter(f => path.extname(f).toLowerCase() === '.mp3');
  const nonMp3 = allFiles.filter(f => path.extname(f).toLowerCase() !== '.mp3');

  // eslint-disable-next-line no-console
  console.log(`Directory: ${DIR}`);
  // eslint-disable-next-line no-console
  console.log(`Found: ${mp3Files.length} .mp3 file(s)`);

  if (nonMp3.length) {
    // eslint-disable-next-line no-console
    console.log(`Skipping non-mp3 file(s): ${nonMp3.join(', ')}`);
  }

  const candidates = mp3Files.map((filename) => {
    const { base } = stripExtension(filename);
    const { core, leadingNumber } = computeCandidateSlug(base);
    return { from: filename, core, leadingNumber };
  });

  // Group by core to detect collisions.
  const groups = new Map();
  for (const c of candidates) {
    const list = groups.get(c.core) ?? [];
    list.push(c);
    groups.set(c.core, list);
  }

  const reserved = new Set(nonMp3.map(n => n.toLowerCase()));
  const targetCounts = new Map(); // case-insensitive target base -> count

  function reserveTargetBase(base) {
    const key = base.toLowerCase();
    targetCounts.set(key, (targetCounts.get(key) ?? 0) + 1);
  }

  /** @type {{from: string, to: string}[]} */
  const mappings = [];

  for (const [core, items] of groups.entries()) {
    const sorted = [...items].sort((a, b) => stableSort(a.from, b.from));

    // Prefer the non-numbered file as canonical for the clean name.
    const canonicalIndex = sorted.findIndex(x => !x.leadingNumber);
    const canonical = canonicalIndex >= 0 ? sorted[canonicalIndex] : sorted[0];

    const ordered = canonical === sorted[0] ? sorted : [canonical, ...sorted.filter(x => x !== canonical)];

    for (const item of ordered) {
      let targetBase = core;

      // If this core collides, add suffix for non-canonical entries.
      if (sorted.length > 1 && item !== canonical) {
        targetBase = item.leadingNumber ? withSuffix(core, item.leadingNumber) : core;
      }

      targetBase = ensureNotStartingWithNumber(targetBase);

      // Ensure uniqueness vs other targets and non-mp3 files.
      let candidate = targetBase;
      let tries = 0;
      while (
        reserved.has(`${candidate}.mp3`.toLowerCase()) ||
        targetCounts.has(candidate.toLowerCase())
      ) {
        tries += 1;
        // If we haven't used the leading number yet, try that first.
        if (item.leadingNumber && candidate === targetBase && !targetBase.endsWith(`_${item.leadingNumber}`)) {
          candidate = ensureNotStartingWithNumber(withSuffix(targetBase, item.leadingNumber));
        } else {
          candidate = ensureNotStartingWithNumber(withSuffix(targetBase, String(tries + 1)));
        }
        if (tries > 50) break;
      }

      reserveTargetBase(candidate);
      mappings.push({ from: item.from, to: `${candidate}.mp3` });
    }
  }

  mappings.sort((a, b) => stableSort(a.from, b.from));
  const changes = mappings.filter(m => m.from !== m.to);

  if (!changes.length) {
    // eslint-disable-next-line no-console
    console.log('No changes needed.');
    return;
  }

  // eslint-disable-next-line no-console
  console.log(`\nPlanned changes (${changes.length}):`);
  for (const m of changes) {
    // eslint-disable-next-line no-console
    console.log(`  ${m.from} -> ${m.to}`);
  }

  if (!APPLY) {
    // eslint-disable-next-line no-console
    console.log('\nDry-run only. Re-run with --apply --yes to perform renames.');
    return;
  }

  if (!YES) {
    // eslint-disable-next-line no-console
    console.error('Refusing to apply without --yes (safety).');
    printHelp(1);
  }

  // Two-phase rename to avoid macOS case-insensitive rename issues.
  const stamp = Date.now().toString(36);
  const tempMappings = [];

  // Phase 1: move to temp names
  for (let i = 0; i < changes.length; i += 1) {
    const { from } = changes[i];
    const temp = `__tmp_rename_${stamp}_${i}.mp3`;
    tempMappings.push({ temp, final: changes[i].to });
    await fs.rename(path.join(DIR, from), path.join(DIR, temp));
  }

  // Phase 2: move temp to final
  for (const { temp, final } of tempMappings) {
    await fs.rename(path.join(DIR, temp), path.join(DIR, final));
  }

  // eslint-disable-next-line no-console
  console.log('\nRenames applied successfully.');
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e?.message ?? e);
  process.exit(1);
});

