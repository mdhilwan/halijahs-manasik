#!/usr/bin/env node
/**
 * Convert MP3 audio to MP3 mono at a target bitrate using ffmpeg.
 *
 * Supports:
 *  - Single file conversion (default)
 *  - Batch conversion when input is a directory (or --inputDir)
 *
 * This script is intentionally dependency-free and shells out to the system ffmpeg.
 */

import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function printHelp() {
  // Keep this short and copyable.
  console.log(`\
Usage:
  node scripts/convert-audio.mjs --input <file|dir> [--output <path>] [--bitrate 48k] [--sampleRate 44100] [--overwrite]
  node scripts/convert-audio.mjs --inputDir <dir> --outputDir <dir> [--bitrate 48k] [--sampleRate 44100] [--overwrite]

Options:
  -i, --input        Input audio path (required)
  -o, --output       Output path (default: ./.audio-out/<name>.mono48.mp3)
  --inputDir         Batch: input directory (alternative to --input)
  --outputDir        Batch: output directory (required for batch)
  -b, --bitrate      Target MP3 bitrate (default: 48k)
  --sampleRate       Output sample rate (default: 44100)
  --mono             Force mono (default: true)
  --overwrite        Overwrite output if it already exists
  --skipExisting     Batch: skip files that already exist in output (default: true)
  --dryRun           Batch: print planned work only
  -h, --help         Show help

Notes:
  - Requires ffmpeg in PATH (macOS: brew install ffmpeg)
  - For spoken-word audio, mono + 48k is usually a large size win.
`);
}

function parseArgs(argv) {
  /** @type {Record<string, string | boolean>} */
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('-')) continue;

    if (a === '-h' || a === '--help') out.help = true;
    else if (a === '-i' || a === '--input') out.input = argv[++i];
    else if (a === '-o' || a === '--output') out.output = argv[++i];
    else if (a === '--inputDir') out.inputDir = argv[++i];
    else if (a === '--outputDir') out.outputDir = argv[++i];
    else if (a === '-b' || a === '--bitrate') out.bitrate = argv[++i];
    else if (a === '--sampleRate') out.sampleRate = argv[++i];
    else if (a === '--mono') out.mono = true;
    else if (a === '--overwrite') out.overwrite = true;
    else if (a === '--skipExisting') out.skipExisting = true;
    else if (a === '--dryRun') out.dryRun = true;
    else {
      // ignore unknown flags for now
    }
  }
  return out;
}

function ensureFfmpeg() {
  const res = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
  if (res.error || res.status !== 0) {
    console.error('ffmpeg not found in PATH. Install it first:');
    console.error('  brew install ffmpeg');
    process.exit(1);
  }
}

function normalizeBitrate(bitrate) {
  // Accept: 48, 48k, 48000
  if (!bitrate) return '48k';
  const s = String(bitrate).trim();
  if (/^\d+$/.test(s)) return `${s}k`;
  if (/^\d+k$/i.test(s)) return s.toLowerCase();
  return s; // assume user knows what they're doing
}

function isDirectory(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function listMp3FilesRecursively(rootDir, { excludeDirsAbs = [] } = {}) {
  /** @type {string[]} */
  const results = [];
  const excludeSet = new Set(excludeDirsAbs.map((d) => path.resolve(d)));

  /** @param {string} dir */
  function walk(dir) {
    const absDir = path.resolve(dir);
    if (excludeSet.has(absDir)) return;
    const entries = fs.readdirSync(absDir, { withFileTypes: true });
    for (const ent of entries) {
      const abs = path.join(absDir, ent.name);
      if (ent.isDirectory()) {
        if (excludeSet.has(path.resolve(abs))) continue;
        walk(abs);
      } else if (ent.isFile()) {
        if (ent.name.toLowerCase().endsWith('.mp3')) results.push(abs);
      }
    }
  }

  walk(rootDir);
  return results.sort();
}

function bytesToMb(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2);
}

function makeFfmpegArgs({ input, output, overwrite, mono, bitrate, sampleRate, bufsize }) {
  return [
    '-hide_banner',
    '-nostdin',
    ...(overwrite ? ['-y'] : ['-n']),
    '-i',
    input,
    '-vn',
    '-map',
    '0:a:0',
    '-map_metadata',
    '0',
    ...(mono ? ['-ac', '1'] : []),
    '-ar',
    sampleRate,
    '-c:a',
    'libmp3lame',
    '-b:a',
    bitrate,
    '-minrate',
    bitrate,
    '-maxrate',
    bitrate,
    '-bufsize',
    bufsize,
    // better compatibility metadata
    '-id3v2_version',
    '3',
    output,
  ];
}

function runFfmpeg(ffmpegArgs) {
  return new Promise((resolve, reject) => {
    const p = spawn('ffmpeg', ffmpegArgs, { stdio: 'inherit' });
    p.on('error', reject);
    p.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}

async function convertOne({ input, output, mono, bitrate, sampleRate, overwrite }) {
  const bitrateNum = parseInt(String(bitrate), 10);
  const bufsize = Number.isFinite(bitrateNum) ? `${Math.max(64, bitrateNum * 2)}k` : '96k';
  const ffmpegArgs = makeFfmpegArgs({ input, output, overwrite, mono, bitrate, sampleRate, bufsize });
  await runFfmpeg(ffmpegArgs);
}

async function batchConvert({ inputDir, outputDir, mono, bitrate, sampleRate, overwrite, skipExisting, dryRun }) {
  const absInputDir = path.resolve(process.cwd(), inputDir);
  const absOutputDir = path.resolve(process.cwd(), outputDir);

  if (!isDirectory(absInputDir)) {
    console.error(`Input directory not found: ${absInputDir}`);
    process.exit(1);
  }

  // Avoid recursively picking up our own outputs when outputDir is inside inputDir.
  const exclude = [];
  if (absOutputDir.startsWith(absInputDir + path.sep) || absOutputDir === absInputDir) {
    exclude.push(absOutputDir);
  }

  const files = listMp3FilesRecursively(absInputDir, { excludeDirsAbs: exclude });
  if (files.length === 0) {
    console.log(`No .mp3 files found under: ${absInputDir}`);
    return;
  }

  fs.mkdirSync(absOutputDir, { recursive: true });

  console.log(`Batch input : ${absInputDir}`);
  console.log(`Batch output: ${absOutputDir}`);
  console.log(`Settings    : ${mono ? 'mono' : 'keep channels'}, ${bitrate}, ${sampleRate} Hz`);
  console.log(`Files       : ${files.length}`);
  if (dryRun) console.log('Mode        : dry-run (no files will be written)');

  let totalIn = 0;
  let totalOut = 0;
  let converted = 0;
  let skipped = 0;
  let failed = 0;

  for (let idx = 0; idx < files.length; idx++) {
    const input = files[idx];
    const rel = path.relative(absInputDir, input);
    const output = path.join(absOutputDir, rel);

    const inStat = fs.statSync(input);
    totalIn += inStat.size;

    fs.mkdirSync(path.dirname(output), { recursive: true });

    if (fs.existsSync(output) && !overwrite) {
      // default batch behavior: skip existing outputs unless user requests overwrite
      if (skipExisting) {
        skipped++;
        const outStat = fs.statSync(output);
        totalOut += outStat.size;
        continue;
      }
      console.error(`Output exists (use --overwrite or --skipExisting): ${output}`);
      failed++;
      continue;
    }

    console.log(`\n[${idx + 1}/${files.length}] ${rel}`);
    console.log(`  in : ${bytesToMb(inStat.size)} MB`);
    console.log(`  out: ${output}`);

    if (dryRun) {
      converted++;
      continue;
    }

    try {
      await convertOne({ input, output, mono, bitrate, sampleRate, overwrite });
      const outStat = fs.statSync(output);
      totalOut += outStat.size;
      converted++;
      console.log(`  done: ${bytesToMb(outStat.size)} MB (${((outStat.size / inStat.size) * 100).toFixed(1)}% of original)`);
    } catch (err) {
      failed++;
      console.error(`  FAILED: ${String(err?.message ?? err)}`);
    }
  }

  console.log('\nSummary');
  console.log(`  Converted: ${converted}`);
  console.log(`  Skipped  : ${skipped}`);
  console.log(`  Failed   : ${failed}`);
  if (!dryRun) {
    const pct = totalIn > 0 ? (totalOut / totalIn) * 100 : 0;
    console.log(`  Total in : ${bytesToMb(totalIn)} MB`);
    console.log(`  Total out: ${bytesToMb(totalOut)} MB (${pct.toFixed(1)}% of original)`);
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const inputArg = args.input;
  const inputDirArg = args.inputDir;
  if (!inputArg && !inputDirArg) {
    printHelp();
    process.exit(1);
  }

  ensureFfmpeg();

  const bitrate = normalizeBitrate(args.bitrate ?? '48k');
  const sampleRate = String(args.sampleRate ?? '44100');
  const mono = args.mono !== false; // default true

  // Batch mode when input is a directory (or when --inputDir is provided)
  if (inputDirArg || (inputArg && isDirectory(path.resolve(process.cwd(), inputArg)))) {
    const inputDir = inputDirArg ?? inputArg;
    const outputDir = args.outputDir;
    if (!outputDir) {
      console.error('Batch mode requires --outputDir');
      process.exit(1);
    }
    const skipExisting = args.skipExisting !== false; // default true
    const dryRun = Boolean(args.dryRun);
    batchConvert({
      inputDir,
      outputDir,
      mono,
      bitrate,
      sampleRate,
      overwrite: Boolean(args.overwrite),
      skipExisting,
      dryRun,
    }).catch((err) => {
      console.error(String(err?.message ?? err));
      process.exit(1);
    });
    return;
  }

  const input = path.resolve(process.cwd(), inputArg);
  if (!fs.existsSync(input)) {
    console.error(`Input not found: ${input}`);
    process.exit(1);
  }

  const defaultOutDir = path.resolve(process.cwd(), '.audio-out');
  const ext = path.extname(input) || '.mp3';
  const base = path.basename(input, ext);
  const output = args.output
    ? path.resolve(process.cwd(), String(args.output))
    : path.join(defaultOutDir, `${base}.mono${bitrate.replace(/\W/g, '')}.mp3`);

  fs.mkdirSync(path.dirname(output), { recursive: true });

  if (fs.existsSync(output) && !args.overwrite) {
    console.error(`Output exists (use --overwrite to replace): ${output}`);
    process.exit(1);
  }

  const inStat = fs.statSync(input);
  console.log(`Input : ${input} (${bytesToMb(inStat.size)} MB)`);
  console.log(`Output: ${output}`);
  console.log(`Settings: ${mono ? 'mono' : 'keep channels'}, ${bitrate}, ${sampleRate} Hz`);

  convertOne({
    input,
    output,
    mono,
    bitrate,
    sampleRate,
    overwrite: Boolean(args.overwrite),
  })
    .then(() => {
      const outStat = fs.statSync(output);
      const ratio = outStat.size / inStat.size;
      console.log(`Done  : ${bytesToMb(outStat.size)} MB (${(ratio * 100).toFixed(1)}% of original)`);
    })
    .catch((err) => {
      console.error(String(err?.message ?? err));
      process.exit(1);
    });
}

main();

