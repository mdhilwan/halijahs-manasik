import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function getArgValue(name) {
  const idx = process.argv.indexOf(name);
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return null;
}

const allowedCompanyIds = ['manasiktech', 'halijah'];

const companyId =
  getArgValue('--companyId') ||
  getArgValue('--company') ||
  process.env.COMPANY_ID ||
  'manasiktech';

if (!allowedCompanyIds.includes(companyId)) {
  throw new Error(
    `Invalid COMPANY_ID="${companyId}". Valid companyIds: ${allowedCompanyIds.join(', ')}`
  );
}

const tasks = [
  {
    label: 'root images',
    src: path.join(repoRoot, 'assets/images', companyId),
    dest: path.join(repoRoot, 'assets/images/current'),
  },
  {
    label: 'button backgrounds',
    src: path.join(repoRoot, 'assets/images/button-bg', companyId),
    dest: path.join(repoRoot, 'assets/images/button-bg/current'),
  },
];

async function existsDir(p) {
  try {
    const stat = await fs.stat(p);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

async function main() {
  for (const { label, src, dest } of tasks) {
    if (!(await existsDir(src))) {
      throw new Error(
        `Missing ${label} source folder for COMPANY_ID="${companyId}". Expected: ${src}`
      );
    }

    // Ensure parent exists
    await fs.mkdir(path.dirname(dest), { recursive: true });

    // Remove old generated folder, then copy fresh
    await fs.rm(dest, { recursive: true, force: true });
    await fs.mkdir(dest, { recursive: true });

    await fs.cp(src, dest, { recursive: true });

    // Optional: cleanup macOS metadata if present
    await fs.rm(path.join(dest, '.DS_Store'), { force: true }).catch(() => {});
  }

  console.log(`[brand] Selected COMPANY_ID="${companyId}"`);
  console.log('[brand] Generated assets/images/current/*');
  console.log('[brand] Generated assets/images/button-bg/current/*');
}

main().catch((err) => {
  console.error(`[brand] Failed to select brand: ${err?.message ?? err}`);
  process.exit(1);
});

